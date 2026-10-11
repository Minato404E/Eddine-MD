import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { cookieArgs,youtubeCookies,publicYoutube,mediaFailure } from '../src/media-access.js';
const text='# Netscape HTTP Cookie File\r\n.youtube.com\tTRUE\t/\tTRUE\t2000000000\tSID\tsecret-fixture\r\n';
test('YouTube cookies validate format and reject unrelated browser credentials',()=>{
 assert.ok(!youtubeCookies(text).includes('\r'));assert.ok(youtubeCookies(text.replace('.youtube.com','#HttpOnly_.youtube.com')).includes('#HttpOnly_'));
 for(const value of ['[{"name":"SID"}]','# Netscape HTTP Cookie File\n',text.replace('.youtube.com','.google.com'),text.replace('.youtube.com','.youtube.com.evil.test'),text.replace('\tSID',' SID')])assert.throws(()=>youtubeCookies(value));
});
test('cookies are YouTube-only private temporary copies and original is preserved',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-cookies-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));const data=path.join(root,'data'),dir=path.join(root,'temp');await fs.mkdir(data);await fs.mkdir(dir);
 assert.deepEqual(await cookieArgs(root,dir,'youtube'),[]);await fs.writeFile(path.join(data,'youtube-cookies.txt'),text);
 assert.deepEqual(await cookieArgs(root,dir,'instagram'),[]);const args=await cookieArgs(root,dir,'youtube');assert.equal(args[0],'--cookies');assert.equal(path.dirname(args[1]),dir);
 if(process.platform!=='win32')assert.equal((await fs.stat(args[1])).mode&0o777,0o600);
 await fs.writeFile(args[1],'rotated');assert.equal(await fs.readFile(path.join(data,'youtube-cookies.txt'),'utf8'),text);
});
test('authenticated downloads remain limited to public unrestricted content with specific diagnostics',()=>{
 for(const availability of ['private','premium_only','subscriber_only','needs_auth'])assert.throws(()=>publicYoutube({availability}));assert.throws(()=>publicYoutube({age_limit:18}));publicYoutube({availability:'public',age_limit:0});
 assert.match(mediaFailure(Error("Sign in to confirm you're not a bot")),/data\/youtube-cookies.txt/);assert.match(mediaFailure(Error("Sign in to confirm you're not a bot"),true),/PO Token/);
});
test('full downloader passes cookies to metadata and media calls then deletes temporary credentials',{skip:process.platform==='win32'},async t=>{
 const {download}=await import('../src/media.js');const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-media-flow-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'data'));await fs.mkdir(path.join(root,'tools'));
 await fs.writeFile(path.join(root,'data','youtube-cookies.txt'),text);const trace=path.join(root,'trace.jsonl');
 const script='#!/usr/bin/env node\nconst fs=require("node:fs");const args=process.argv.slice(2);const cookie=args[args.indexOf("--cookies")+1];if(!fs.readFileSync(cookie,"utf8").includes("secret-fixture"))process.exit(2);fs.appendFileSync('+JSON.stringify(trace)+',JSON.stringify(args)+"\\n");if(args.includes("--dump-single-json")){console.log(JSON.stringify({duration:20,title:"Public fixture",availability:"public",webpage_url:"https://youtu.be/fixture"}));}else{fs.writeFileSync(args[args.indexOf("-o")+1].replace("%(ext)s","mp3"),"fixture-media");}\n';
 await fs.writeFile(path.join(root,'tools','yt-dlp'),script,{mode:0o700});const result=await download(root,'https://youtu.be/fixture','youtube');assert.equal(result.buffer.toString(),'fixture-media');
 const calls=(await fs.readFile(trace,'utf8')).trim().split('\n').map(JSON.parse);assert.equal(calls.length,2);for(const args of calls){const cookie=args[args.indexOf('--cookies')+1];assert.ok(cookie);await assert.rejects(fs.access(cookie));}assert.equal(await fs.readFile(path.join(root,'data','youtube-cookies.txt'),'utf8'),text);
});
test('nightly update runs through the serial downloader and validates channel before spawning',{skip:process.platform==='win32'},async t=>{
 const {updateMedia,run}=await import('../src/media.js');const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-update-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'tools'));
 const trace=path.join(root,'update.jsonl');const file=path.join(root,'tools','yt-dlp');
 await fs.writeFile(file,'#!/usr/bin/env node\nconst fs=require("node:fs");fs.appendFileSync('+JSON.stringify(trace)+',JSON.stringify(process.argv.slice(2))+"\\n");console.log("2026.10.06.test");\n',{mode:0o700});
 await assert.rejects(updateMedia(root,'invalid'));assert.equal(await updateMedia(root,'nightly'),'2026.10.06.test');const calls=(await fs.readFile(trace,'utf8')).trim().split('\n').map(JSON.parse);assert.deepEqual(calls,[['--ignore-config','--update-to','nightly'],['--version']]);
 await fs.writeFile(file,'#!/usr/bin/env node\nconsole.error("EARLY-EJS-WARNING"+"x".repeat(1000)+"END-ERROR");process.exit(1);\n',{mode:0o700});await assert.rejects(run(file,[]),e=>e.message.includes('EARLY-EJS-WARNING')&&e.message.includes('END-ERROR'));
 assert.match(mediaFailure(Error('n challenge solving failed')),/updatemedia nightly/);
});
