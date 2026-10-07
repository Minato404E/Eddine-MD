import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fork} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {mediaQueue} from './media.js';
export const localCommands=['mines','mix','csticker','sround','remini','wanted','jail','rip','sketch','qr','readqr','topdf','frompdf','zip','unzip','compress','tomp3','tovn','trim','speed','merge','gif','reverse','ocr'];
export const collectionCommands=new Set(['topdf','zip','merge']);
export const MAX_LOCAL_BYTES=25*1024*1024;
const worker=fileURLToPath(new URL('./local-tools-worker.js',import.meta.url));
export function safeFilename(value,index=1){const name=path.basename(String(value||'file').replaceAll('\\','/')).replace(/[\x00-\x1f<>:"/\\|?*]/g,'_').replace(/^\.+/,'').slice(0,100);return String(index).padStart(2,'0')+'-'+(name||'file');}
export async function runLocal(op,inputs=[],options={},consume){return mediaQueue.run(async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-local-'));try{const files=[];let total=0;for(let i=0;i<inputs.length;i++){const x=inputs[i];total+=x.buffer.length;if(total>MAX_LOCAL_BYTES)throw Error('Maximum combined input size: 25 MB.');const file=path.join(dir,'input-'+i);await fs.writeFile(file,x.buffer,{mode:0o600});files.push({file,type:x.type,mimetype:x.data?.mimetype||x.mimetype||'',name:safeFilename(x.data?.fileName||x.name||x.type||'file',i+1)});}
 const result=await new Promise((resolve,reject)=>{const child=fork(worker,[],{execArgv:['--max-old-space-size=128'],stdio:['ignore','ignore','pipe','ipc']});let settled=false,errors='';const timer=setTimeout(()=>{child.kill('SIGKILL');finish(Error('Local tool timed out. Try a smaller file.'));},op==='ocr'?180000:120000);function finish(error,result){if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(result);}child.stderr.on('data',b=>errors=(errors+b).slice(-2000));child.on('error',e=>finish(e));child.on('message',m=>{if(m.error)finish(Error(m.error));else finish(null,m);child.disconnect();});child.on('exit',code=>{if(!settled)finish(Error('Local tool stopped before completion'+(code?' (exit '+code+')':'')+'. Try a smaller file or more host RAM.'));});child.send({op,files,options,dir});});
 if(result.text!==undefined)return consume({text:result.text});let bytes=0;for(const f of result.files||[]){if(path.dirname(path.resolve(f.file))!==dir)throw Error('Invalid tool output path.');const size=(await fs.stat(f.file)).size;bytes+=size;if(bytes>MAX_LOCAL_BYTES||size===0)throw Error('Tool output must be nonempty and at most 25 MB in total.');}
 for(const f of result.files||[]){await consume({...f,buffer:await fs.readFile(f.file)});}return result.meta;
 }finally{await fs.rm(dir,{recursive:true,force:true});}});}
export class Collections{
 constructor(){this.items=new Map();this.timer=setInterval(()=>this.cleanup(),60000);this.timer.unref();}
 key(c){return JSON.stringify([c.e.id,c.uid,c.chat]);}
 async cleanup(){for(const [key,x] of this.items)if(x.expires<=Date.now()){this.items.delete(key);await fs.rm(x.dir,{recursive:true,force:true});}}
 async start(c,op){await this.cleanup();const key=this.key(c);if(this.items.has(key))throw Error('Finish or cancel your existing collection first.');if(this.items.size>=5)throw Error('Too many active collections. Try again later.');const dir=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-collect-'));this.items.set(key,{op,dir,files:[],bytes:0,expires:Date.now()+10*60000});}
 get(c){return this.items.get(this.key(c));}
 async add(c,media){const x=this.get(c);if(!x||x.expires<=Date.now()){await this.cleanup();throw Error('Collection expired. Start again.');}if(x.files.length>=8||x.bytes+media.buffer.length>MAX_LOCAL_BYTES)throw Error('Collection limit: 8 files / 25 MB total. Finish or cancel it.');if(x.op==='topdf'&&media.type!=='imageMessage')throw Error('PDF collection accepts images only.');if(x.op==='merge'&&!['videoMessage','audioMessage'].includes(media.type))throw Error('Merge accepts audio or video only.');if(x.op==='merge'&&x.files.length&&x.files[0].type!==media.type)throw Error('Do not mix audio and video in one merge.');const file=path.join(x.dir,String(x.files.length));await fs.writeFile(file,media.buffer,{mode:0o600});x.files.push({file,type:media.type,data:media.data});x.bytes+=media.buffer.length;return x.files.length;}
 async finish(c,fn){const key=this.key(c),x=this.get(c);if(!x)throw Error('Start a collection first.');this.items.delete(key);try{if(x.expires<=Date.now())throw Error('Collection expired.');if(!x.files.length)throw Error('Collection is empty.');const input=[];for(const f of x.files)input.push({...f,buffer:await fs.readFile(f.file)});return await fn(x.op,input);}finally{await fs.rm(x.dir,{recursive:true,force:true});}}
 async cancel(c){const key=this.key(c),x=this.get(c);this.items.delete(key);if(x)await fs.rm(x.dir,{recursive:true,force:true});}
 async close(){clearInterval(this.timer);for(const x of this.items.values())await fs.rm(x.dir,{recursive:true,force:true});this.items.clear();}
}
