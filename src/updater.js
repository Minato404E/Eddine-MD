import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import JSZip from 'jszip';

export const UPDATE_REPO='Minato404E/Eddine-MD';
const protectedNames=new Set(['data','node_modules','tools','.git','.env','config.json','panel.config.json','.eddine-update.lock']);
export function protectedPath(name){const first=name.split('/')[0].toLowerCase();return protectedNames.has(first)||first.startsWith('.env.')||/^(auth|session|sessions|auth_info_baileys)$/i.test(first);}
async function request(url,limit,fetcher){const response=await fetcher(url,{headers:{'User-Agent':'Eddine-MD-Updater','Accept':'application/vnd.github+json'},signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('GitHub request failed (HTTP '+response.status+'). Try again later.');if(Number(response.headers.get('content-length'))>limit)throw Error('Update download is too large.');let size=0;const parts=[];for await(const chunk of response.body){size+=chunk.length;if(size>limit)throw Error('Update download is too large.');parts.push(chunk);}return Buffer.concat(parts);}
export async function latestArchive(fetcher=fetch){const meta=JSON.parse(await request('https://api.github.com/repos/'+UPDATE_REPO,1024*1024,fetcher));if(typeof meta.default_branch!=='string')throw Error('GitHub did not return a default branch.');const commit=JSON.parse(await request('https://api.github.com/repos/'+UPDATE_REPO+'/commits/'+encodeURIComponent(meta.default_branch),1024*1024,fetcher));if(!/^[a-f0-9]{40}$/.test(commit.sha))throw Error('Invalid GitHub commit.');return {sha:commit.sha,buffer:await request('https://codeload.github.com/'+UPDATE_REPO+'/zip/'+commit.sha,40*1024*1024,fetcher)};}
async function safeTarget(root,name){let current=root;for(const part of name.split('/')){current=path.join(current,part);try{const stat=await fs.lstat(current);if(stat.isSymbolicLink())throw Error('Update cannot overwrite symlinks: '+name);}catch(e){if(e.code!=='ENOENT')throw e;}}return current;}
async function run(program,args,cwd,timeout=300000){await new Promise((resolve,reject)=>{const child=spawn(program,args,{cwd,stdio:['ignore','pipe','pipe'],shell:process.platform==='win32'&&program==='npm'});let tail='';for(const stream of [child.stdout,child.stderr])stream.on('data',b=>{tail=(tail+b.toString()).slice(-1500);});const timer=setTimeout(()=>{child.kill();reject(Error('Dependency installation timed out.'));},timeout);child.on('error',e=>{clearTimeout(timer);reject(e);});child.on('exit',code=>{clearTimeout(timer);if(code===0)resolve();else{console.error('[Update process]',tail);reject(Error('Update validation or dependency installation failed. Check the host console.'));}});});}
export const installDependencies=root=>run('npm',['ci','--no-audit','--no-fund'],root);
export async function validateStage(stage,names){for(const file of names.filter(x=>x.endsWith('.js')))await run(process.execPath,['--check',path.join(stage,file)],stage,30000);}
function older(a,b){const parse=x=>/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(x)?.slice(1,4).map(Number);const aa=parse(a),bb=parse(b);if(!aa||!bb)return false;for(let i=0;i<3;i++){if(aa[i]!==bb[i])return aa[i]<bb[i];}return false;}
export async function applyArchive(root,buffer,{install=installDependencies,validate=validateStage,sha=''}={}){
 const zip=await JSZip.loadAsync(buffer);const files=new Map();let total=0,prefix='';
 for(const entry of Object.values(zip.files)){if(entry.dir)continue;const raw=entry.unsafeOriginalName||entry.name,parts=raw.split('/');if(parts.length<2||parts.some(x=>!x||x==='.'||x==='..'||/[. ]$/.test(x))||/[\\\x00-\x1f:]/.test(raw)||parts[0].startsWith('.'))throw Error('Unsafe update archive path.');prefix||=parts[0];if(parts[0]!==prefix)throw Error('Update must have one repository root.');const name=parts.slice(1).join('/');if(protectedPath(name))continue;if(((entry.unixPermissions||0)&0xf000)===0xa000)throw Error('Update archive contains a symlink.');const bytes=entry._data?.uncompressedSize||0;total+=bytes;if(total>120*1024*1024||bytes>30*1024*1024||files.size>=3000)throw Error('Update archive exceeds size limits.');const content=await entry.async('nodebuffer');files.set(name,content);}
 for(const name of ['index.js','package.json','package-lock.json','src/index.js'])if(!files.has(name))throw Error('Incomplete bot update: '+name);
 const remote=JSON.parse(files.get('package.json'));if(remote.name!=='eddine-md'||remote.type!=='module')throw Error('This archive is not Eddine-MD.');
 let local;try{local=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));}catch{}
 if(local&&older(remote.version,local.version))throw Error('GitHub contains an older bot version ('+remote.version+'). Upload the latest project to GitHub first.');
 const changes=[];for(const [name,content] of files){const target=await safeTarget(root,name);let previous=null;try{previous=await fs.readFile(target);}catch(e){if(e.code!=='ENOENT')throw e;}if(!previous||!previous.equals(content))changes.push({name,content,previous});}
 if(!older(remote.version,'1.9.0'))for(const name of ['src/inbox.js','public/inbox.html','public/inbox.js','public/inbox.css','tests/inbox.test.js']){if(files.has(name))continue;const target=await safeTarget(root,name);try{const previous=await fs.readFile(target);changes.push({name,content:null,previous});}catch(e){if(e.code!=='ENOENT')throw e;}}
 if(!changes.length)return {updated:false,version:remote.version,sha,files:0};
 const work=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-update-')),stage=path.join(work,'stage'),backup=path.join(work,'backup');const applied=[];let dependencies=false;
 try{
  for(const [name,content]of files){const dest=path.join(stage,name);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,content);}
  await validate(stage,[...files.keys()]);
  for(const item of changes){if(item.previous!==null){const dest=path.join(backup,item.name);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,item.previous);}const target=await safeTarget(root,item.name);await fs.mkdir(path.dirname(target),{recursive:true});applied.push(item);if(item.content===null)await fs.rm(target,{force:true});else await fs.copyFile(path.join(stage,item.name),target);}
  dependencies=changes.some(x=>['package.json','package-lock.json'].includes(x.name));if(dependencies)await install(root);
  return {updated:true,version:remote.version,sha,files:changes.length};
 }catch(error){for(const item of applied.reverse()){const target=path.join(root,item.name);if(item.previous===null)await fs.rm(target,{force:true});else await fs.copyFile(path.join(backup,item.name),target);}if(dependencies){try{await install(root);}catch{throw Error('Update files were rolled back, but dependencies need repair: run npm install before restarting.');}}throw error;}
 finally{await fs.rm(work,{recursive:true,force:true});}
}
export class BotUpdater{
 constructor(root,{fetcher=fetch,apply=applyArchive}={}){this.root=root;this.fetcher=fetcher;this.apply=apply;this.busy=false;}
 async update(){if(this.busy)throw Error('A bot update is already running.');this.busy=true;let lock;const lockPath=path.join(this.root,'.eddine-update.lock');try{try{lock=await fs.open(lockPath,'wx');}catch(e){if(e.code==='EEXIST')throw Error('Update lock exists. If a previous update was interrupted, restart the host and remove .eddine-update.lock before retrying.');throw e;}const {buffer,sha}=await latestArchive(this.fetcher);return await this.apply(this.root,buffer,{sha});}finally{if(lock){await lock.close();await fs.rm(lockPath,{force:true});}this.busy=false;}}
}
