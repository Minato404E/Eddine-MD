import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import {download,run} from '../src/media.js';
test('non-MP4 downloader output is converted to playable H264 MP4',{skip:process.platform==='win32'},async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-format-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'tools'));
 const source=path.join(root,'source.webm');await run(ffmpeg,['-y','-f','lavfi','-i','color=c=blue:s=64x64:r=10','-t','0.5','-c:v','libvpx-vp9','-threads','1',source]);
 await fs.writeFile(path.join(root,'tools','yt-dlp'),'#!/usr/bin/env node\nconst fs=require("node:fs"),a=process.argv.slice(2);if(a.includes("--version"))console.log("fixture");else if(a.includes("--dump-single-json"))console.log(JSON.stringify({title:"WebM video",formats:[{ext:"webm",vcodec:"vp9",acodec:"none",height:1080}]}));else{if(!a[a.indexOf("-f")+1].endsWith("/bestvideo*+bestaudio/best*"))process.exit(1);fs.copyFileSync('+JSON.stringify(source)+',a[a.indexOf("-o")+1].replace("%(ext)s","webm"));}\n',{mode:0o700});
 const result=await download(root,'https://vimeo.com/12345','vimeo');const output=path.join(root,'output.mp4');await fs.writeFile(output,result.buffer);
 const info=JSON.parse(await run(ffprobe.path,['-v','error','-show_streams','-show_format','-of','json',output]));assert.equal(info.streams[0].codec_name,'h264');assert.ok(info.format.format_name.includes('mp4'));assert.ok(Number(info.format.duration)>0);
});
