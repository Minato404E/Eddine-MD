import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
export function releaseAsset(platform=process.platform,arch=process.arch,musl=false){
 if(platform==='win32'&&arch==='x64')return 'yt-dlp.exe';
 if(platform==='darwin'&&['x64','arm64'].includes(arch))return 'yt-dlp_macos';
 if(platform==='linux'&&['x64','arm64'].includes(arch))return 'yt-dlp_'+(musl?'musllinux':'linux')+(arch==='arm64'?'_aarch64':'');
 throw Error('Unsupported downloader platform: '+platform+'/'+arch+'. Install yt-dlp in PATH manually.');
}
export function downloaderPath(root){return path.join(root,'tools',process.platform==='win32'?'yt-dlp.exe':'yt-dlp');}
async function get(url){const r=await fetch(url,{headers:{'User-Agent':'Eddine-MD'},signal:AbortSignal.timeout(120000)});if(!r.ok)throw Error('Downloader installation HTTP '+r.status);return r;}
async function version(file){return new Promise((resolve,reject)=>{const p=spawn(file,['--version'],{stdio:['ignore','pipe','pipe']});let output='';const timer=setTimeout(()=>{p.kill();reject(Error('Downloader version check timed out.'));},15000);p.stdout.on('data',b=>output+=b);p.on('error',e=>{clearTimeout(timer);reject(e);});p.on('close',c=>{clearTimeout(timer);c===0?resolve(output.trim()):reject(Error('Downloader cannot start on this host (exit '+c+').'));});});}
let updating;
export async function installDownloader(root){
 if(updating)return updating;
 updating=(async()=>{const tools=path.join(root,'tools');await fs.mkdir(tools,{recursive:true});const file=downloaderPath(root),temp=file+(process.platform==='win32'?'.download.exe':'.download');
 try{const musl=process.platform==='linux'&&!process.report.getReport().header.glibcVersionRuntime;const asset=releaseAsset(process.platform,process.arch,musl);
 const release=await (await get('https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest')).json();
 if(!/^\d{4}\.\d{2}\.\d{2}$/.test(release.tag_name))throw Error('Unexpected official downloader release tag.');
 const base='https://github.com/yt-dlp/yt-dlp/releases/download/'+release.tag_name+'/';
 const sums=await (await get(base+'SHA2-256SUMS')).text();const line=sums.split('\n').find(l=>l.trim().split(/\s+/).at(-1)?.replace(/^\*/,'')===asset);const expected=line?.split(/\s+/)[0];
 if(!/^[a-f0-9]{64}$/i.test(expected||''))throw Error('Official downloader checksum missing.');
 const response=await get(base+asset);let size=0;const hash=crypto.createHash('sha256');const input=Readable.fromWeb(response.body);input.on('data',b=>{size+=b.length;hash.update(b);if(size>100*1024*1024)input.destroy(Error('Downloader release exceeds size limit.'));});
 await pipeline(input,createWriteStream(temp,{mode:0o700}));if(hash.digest('hex').toLowerCase()!==expected.toLowerCase())throw Error('Downloader checksum mismatch.');
 await fs.chmod(temp,0o700);const v=await version(temp);await fs.rename(temp,file);console.log('yt-dlp installed: '+v);return file;
 }catch(e){throw Error('Cannot install yt-dlp on this host: '+e.message+' Check host access to GitHub; run node scripts/update-media.js to retry.');}finally{await fs.rm(temp,{force:true});}})();
 try{return await updating;}finally{updating=null;}
}
export async function ensureDownloader(root){const local=downloaderPath(root);try{await fs.access(local);return local;}catch{}
 // Existing host-managed installations remain usable without downloading a binary.
 if(process.platform!=='win32'){try{await version('yt-dlp');return 'yt-dlp';}catch{}}
 return installDownloader(root);
}
