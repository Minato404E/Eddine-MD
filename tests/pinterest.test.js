import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {download,pinterestImage,resolvePinterest} from '../src/media.js';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0ioAAAAASUVORK5CYII=','base64');
test('Pinterest image chooses largest official CDN image and validates bytes',async()=>{
 let url;const result=await pinterestImage({title:'Image pin',thumbnails:[{url:'https://i.pinimg.com/small.png',width:1,height:1},{url:'https://i.pinimg.com/original.png',width:100,height:100},{url:'https://localhost/secret',width:1000,height:1000}]},async(value,options)=>{url=value;assert.equal(options.redirect,'error');return new Response(png);});
 assert.equal(url,'https://i.pinimg.com/original.png');assert.equal(result.type,'image');assert.deepEqual(result.buffer,png);
 await assert.rejects(pinterestImage({thumbnail:'https://i.pinimg.com.evil.test/a'}),/no downloadable/);
 await assert.rejects(pinterestImage({thumbnail:'https://i.pinimg.com/a'},async()=>new Response('not an image')),/invalid image/);
 await assert.rejects(pinterestImage({thumbnail:'https://i.pinimg.com/a'},async()=>new Response(png,{headers:{'content-length':String(26*1024*1024)}})),/25 MB/);
});
test('Pinterest metadata tolerates missing formats and sends image without video download',{skip:process.platform==='win32'},async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-pin-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'tools'));
 await fs.writeFile(path.join(root,'tools','yt-dlp'),'#!/usr/bin/env node\nconst a=process.argv.slice(2);if(a.includes("--version")){console.log("fixture");}else if(a.includes("--dump-single-json")&&a.includes("--ignore-no-formats-error")){console.log(JSON.stringify({title:"Pin",formats:[],thumbnails:[{url:"https://i.pinimg.com/image.png"}]}));}else{process.exit(1);}\n',{mode:0o700});
 const original=globalThis.fetch;globalThis.fetch=async()=>new Response(png);t.after(()=>{globalThis.fetch=original;});
 const result=await download(root,'https://www.pinterest.com/pin/13651605115433428/','pinterest');assert.equal(result.type,'image');assert.deepEqual(result.buffer,png);
});

test('Pinterest short links resolve through official redirect hosts and reject external redirects',async()=>{
 const calls=[];const result=await resolvePinterest('https://pin.it/example',async url=>{calls.push(url);return new Response(null,{status:302,headers:{location:calls.length===1?'https://api.pinterest.com/url_shortener/example/redirect/':'https://www.pinterest.com/pin/13651605115433428/sent/?invite_code=example'}});});
 assert.equal(result,'https://www.pinterest.com/pin/13651605115433428/');assert.equal(calls.length,2);
 await assert.rejects(resolvePinterest('https://pin.it/example',async()=>new Response(null,{status:302,headers:{location:'https://127.0.0.1/secret'}})),/unsupported address/);
 await assert.rejects(resolvePinterest('https://pin.it/example',async()=>new Response(null,{status:200})),/full https/);
});

test('Pinterest video download accepts silent or unknown-height video formats without requiring a separate audio track',{skip:process.platform==='win32'},async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-pin-video-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'tools'));
 await fs.writeFile(path.join(root,'tools','yt-dlp'),'#!/usr/bin/env node\nconst fs=require("node:fs"),a=process.argv.slice(2);if(a.includes("--version"))console.log("fixture");else if(a.includes("--dump-single-json"))console.log(JSON.stringify({title:"Video pin",formats:[{format_id:"mp4",ext:"mp4",vcodec:"h264",acodec:"none"}]}));else if(a[a.indexOf("-f")+1]==="best*[height<=?720]/best*"&&a.includes("--max-filesize"))fs.writeFileSync(a[a.indexOf("-o")+1].replace("%(ext)s","mp4"),"video-fixture");else process.exit(1);\n',{mode:0o700});
 const result=await download(root,'https://www.pinterest.com/pin/84724036736513857/','pinterest');assert.equal(result.buffer.toString(),'video-fixture');assert.notEqual(result.type,'image');
});
