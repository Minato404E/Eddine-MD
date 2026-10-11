import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {download,mediaQueue} from '../src/media.js';
import {Sessions} from '../src/sessions.js';
import {Commands} from '../src/commands.js';

test('download keeps file and exclusive queue alive through upload, then cleans success and failure',{skip:process.platform==='win32'},async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-stream-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'tools'));
 await fs.writeFile(path.join(root,'tools','yt-dlp'),'#!/usr/bin/env node\nconst fs=require("node:fs"),a=process.argv.slice(2);if(a.includes("--dump-single-json"))console.log(JSON.stringify({title:"Fixture"}));else{if(a[a.indexOf("-f")+1]!=="bestaudio[abr<=?128]/bestaudio"||a[a.indexOf("--max-filesize")+1]!=="10M"||!a.includes("ffmpeg_i:-threads 1")||!a.includes("ffmpeg_o:-threads 1"))process.exit(2);fs.writeFileSync(a[a.indexOf("-o")+1].replace("%(ext)s","mp3"),"audio");}\n',{mode:0o700});
 let uploaded;
 const value=await download(root,'https://vimeo.com/123','vimeo',{audio:true,consume:async result=>{uploaded=result.file;assert.equal(result.buffer,undefined);assert.equal((await fs.readFile(uploaded)).toString(),'audio');assert.equal(mediaQueue.busy,true);await assert.rejects(mediaQueue.run(()=>{}),/busy/);return 'sent';}});
 assert.equal(value,'sent');await assert.rejects(fs.access(uploaded));assert.equal(mediaQueue.busy,false);
 await assert.rejects(download(root,'https://vimeo.com/123','vimeo',{audio:true,consume:async result=>{uploaded=result.file;throw Error('Upload failed');}}),/Upload failed/);await assert.rejects(fs.access(uploaded));assert.equal(mediaQueue.busy,false);
});

test('outbound-only traffic cannot grow message cache beyond its limit',async()=>{
 const sessions=new Sessions({change:(_id,fn)=>fn({receipts:{}})});let id=0;const e={id:'fixture',sent:new Map(),sock:{sendMessage:async()=>({key:{id:String(++id)},message:{conversation:'hello'}})}};
 for(let i=0;i<1300;i++)await sessions.send(e,'chat',{text:'hello'});
 assert.equal(sessions.cache.size,1200);assert.equal(e.sent.size,600);assert.equal(sessions.cache.has('fixture:1'),false);assert.equal(sessions.cache.has('fixture:1300'),true);
});

test('lazy calculator still evaluates numeric expressions and rejects code',async t=>{
 const commands=new Commands({get:()=>({config:{}})},{send:async(_e,_chat,content)=>content.text},{},os.tmpdir());t.after(()=>commands.collections.close());
 const context={command:'calc',e:{id:'fixture'},chat:'chat',m:{},arg:'(20+5)*3'};
 assert.equal(await commands.execute({...context}),'75');assert.equal(await commands.execute({...context,arg:'2^3'}),'8');
 await assert.rejects(commands.execute({...context,arg:'import("fs")'}),/numeric expression/);
});
