import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseAsset,ensureDownloader,downloaderPath } from '../src/downloader.js';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
test('downloader release matches libc and architecture without assuming Windows',()=>{
 assert.equal(releaseAsset('linux','x64',false),'yt-dlp_linux');
 assert.equal(releaseAsset('linux','x64',true),'yt-dlp_musllinux');
 assert.equal(releaseAsset('linux','arm64',true),'yt-dlp_musllinux_aarch64');
 assert.equal(releaseAsset('win32','x64'),'yt-dlp.exe');
 assert.throws(()=>releaseAsset('linux','ia32'));
});
test('existing local downloader is selected without network or installation',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-downloader-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
 await fs.mkdir(path.join(root,'tools'));const file=downloaderPath(root);await fs.writeFile(file,'fixture');assert.equal(await ensureDownloader(root),file);
});
test('installer verifies bytes before replacing a working tool and cleans failed downloads',{skip:process.platform==='win32'},async t=>{
 const {installDownloader}=await import('../src/downloader.js');const {createHash}=await import('node:crypto');
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-install-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'tools'));
 const file=downloaderPath(root);await fs.writeFile(file,'old-tool');const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
 const bytes=Buffer.from('#!/bin/sh\necho 2026.10.01\n');let valid=false;
 globalThis.fetch=async url=>{if(url.endsWith('/latest'))return new Response(JSON.stringify({tag_name:'2026.10.01'}));if(url.endsWith('SHA2-256SUMS'))return new Response((valid?createHash('sha256').update(bytes).digest('hex'):'0'.repeat(64))+'  '+releaseAsset(process.platform,process.arch,!process.report.getReport().header.glibcVersionRuntime));return new Response(bytes);};
 await assert.rejects(installDownloader(root),/checksum mismatch/);assert.equal(await fs.readFile(file,'utf8'),'old-tool');await assert.rejects(fs.access(file+'.download'));
 valid=true;assert.equal(await installDownloader(root),file);assert.equal(await fs.readFile(file,'utf8'),bytes.toString());
});
