import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {styleText,fancy,copyButtons,developerText,DEVELOPER} from '../src/display.js';
import {rotateBio,BIO_INTERVAL} from '../src/bio.js';
import {Sessions} from '../src/sessions.js';
import {Commands} from '../src/commands.js';
import {Store} from '../src/store.js';
import {resolveCommand,menuText} from '../src/command-names.js';

const A='212600000001',CHAT='212600000002@s.whatsapp.net';
test('styled labels retain exact URLs, IDs, emails, code blocks and native copy payloads',()=>{
 const raw='Hello Salah\nhttps://wa.me/212631998828\nsalahpmn311@gmail.com\n`aB+/=123`\n```\n{"public":false}\n```\n'+A+'@s.whatsapp.net';
 const decorated=styleText(raw);assert.ok(decorated.includes('𝗛𝗲𝗹𝗹𝗼'));assert.ok(decorated.includes('https://wa.me/212631998828'));assert.ok(decorated.includes('salahpmn311@gmail.com'));assert.ok(decorated.includes('`aB+/=123`'));assert.ok(decorated.includes('"public":false'));assert.equal(styleText(decorated),decorated);
 assert.equal(resolveCommand(fancy('dev')),'dev');assert.equal(resolveCommand('المطور'),'dev');assert.equal(resolveCommand('بايو_تلقائي'),'autobio');
 const buttons=copyButtons([{label:'Copy code',value:'AbCd12+/='}]);assert.equal(JSON.parse(buttons[0].buttonParamsJson).copy_code,'AbCd12+/=');assert.equal(buttons[0].name,'cta_copy');
 const dev=developerText(A);for(const value of [DEVELOPER.phone,DEVELOPER.email,DEVELOPER.repository,'Morocco',A])assert.ok(dev.includes(value));
});
function mockSessions(){const state={receipts:{}},sent=[],relayed=[],sessions=new Sessions({change:(_id,fn)=>fn(state)},{log:()=>{}});const entry={id:A,sent:new Map(),sock:{user:{id:A+'@s.whatsapp.net'},sendMessage:async(chat,content)=>{sent.push({chat,content});return {key:{id:'fallback'}};},relayMessage:async(chat,message)=>{relayed.push({chat,message});}}};return {state,sent,relayed,sessions,entry};}
test('copy message serializes raw clipboard values, tracks outgoing ID and falls back on rejection',async()=>{
 const x=mockSessions();await x.sessions.copy(x.entry,CHAT,'Pairing code\n`AB12CD34`',[{label:'Copy',value:'AB12CD34'}]);assert.equal(x.sent.length,0);assert.equal(x.relayed.length,1);
 const interactive=x.relayed[0].message.viewOnceMessage.message.interactiveMessage;
 assert.equal(JSON.parse(interactive.nativeFlowMessage.buttons[0].buttonParamsJson).copy_code,'AB12CD34');assert.ok(interactive.body.text.includes('𝗣𝗮𝗶𝗿𝗶𝗻𝗴'));assert.equal(x.entry.sent.size,1);assert.equal(Object.keys(x.state.receipts).length,1);
 x.entry.sock.relayMessage=async()=>{throw Error('Unsupported');};await x.sessions.copy(x.entry,CHAT,'Copy this\n`AB12CD34`',[{value:'AB12CD34'}]);assert.equal(x.sent.length,1);assert.ok(x.sent[0].content.text.includes('`AB12CD34`'));
});
test('About rotates per online account every five minutes, obeys disable and spaces failed attempts',async()=>{
 const updates=[],logs=[],entry={id:A,status:'online',onlineSince:1000,sock:{updateProfileStatus:async text=>updates.push(text.normalize('NFKC'))}};
 await rotateBio(entry,{now:1000});assert.match(updates[0],/Uptime: 0h 0m/);await rotateBio(entry,{now:2000});assert.equal(updates.length,1);
 await rotateBio(entry,{now:1000+BIO_INTERVAL});assert.equal(updates[1],'Owner: Salah Eddine');await rotateBio(entry,{now:1000+2*BIO_INTERVAL});assert.match(updates[2],/0h 10m/);
 await rotateBio(entry,{enabled:false,now:1000+3*BIO_INTERVAL});assert.equal(updates.length,3);
 entry.sock.updateProfileStatus=async()=>{throw Error('Rejected');};await rotateBio(entry,{now:1000+3*BIO_INTERVAL,log:value=>logs.push(value)});assert.equal(logs.length,1);assert.equal(entry.bioBusy,false);await rotateBio(entry,{now:1001+3*BIO_INTERVAL,log:value=>logs.push(value)});assert.equal(logs.length,1);
 entry.status='stopped';await rotateBio(entry,{now:1000+4*BIO_INTERVAL});assert.equal(updates.length,3);
});
test('developer is text with actual account number; autobio is owner-only and info stays an image',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-dev-')),store=new Store(dir);store.ensure(A);const x=mockSessions();const commands=new Commands(store,x.sessions,{},dir);t.after(async()=>{await commands.collections.close();store.close();await fs.rm(dir,{recursive:true,force:true});});
 const context={e:x.entry,chat:CHAT,uid:A,command:'dev',rawCommand:'dev',args:[],arg:'',owner:false,sudo:false,m:{key:{id:'in',remoteJid:CHAT},message:{conversation:'!dev'}},info:{},prefix:'!'};
 await commands.execute({...context});const body=x.relayed[0].message.viewOnceMessage.message.interactiveMessage.body.text;assert.ok(body.includes('+'+A));assert.ok(body.includes(DEVELOPER.repository));assert.ok(!x.sent.some(item=>item.content.image));
 await assert.rejects(commands.execute({...context,command:'autobio',arg:'off'}),/owner or sudo/);
 await commands.execute({...context,command:'autobio',owner:true,arg:'off'});assert.equal(store.get(A).config.autobio,false);
 x.sessions.active=()=>1;await commands.execute({...context,command:'info'});assert.ok(Buffer.isBuffer(x.sent.at(-1).content.image));
});
test('styled category selectors still work and download command sends media without caption links',async t=>{
 const {categories}=await import('../src/commands.js');assert.ok(menuText(categories,{prefix:'!',language:'en',arg:fancy('group'),host:false},{config:{name:'Eddine-MD',public:true}}).normalize('NFKC').includes('!mute'));
 if(process.platform==='win32')return t.skip('Executable fixture is Linux-only');
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-caption-'));await fs.mkdir(path.join(dir,'tools'));await fs.writeFile(path.join(dir,'tools','yt-dlp'),'#!/usr/bin/env node\nconst fs=require("node:fs"),a=process.argv.slice(2);if(a.includes("--dump-single-json"))console.log(JSON.stringify({title:"https://example.com/source"}));else fs.writeFileSync(a[a.indexOf("-o")+1].replace("%(ext)s","mp4"),"media-fixture");\n',{mode:0o700});
 const store=new Store(path.join(dir,'data'));store.ensure(A);const x=mockSessions(),commands=new Commands(store,x.sessions,{},dir);t.after(async()=>{await commands.collections.close();store.close();await fs.rm(dir,{recursive:true,force:true});});
 let file;x.entry.sock.sendMessage=async(chat,content)=>{file=content.video.url;assert.equal((await fs.readFile(file)).toString(),'media-fixture');assert.equal(content.caption,undefined);assert.equal(content.text,undefined);return {key:{id:'video'}};};
 await commands.execute({e:x.entry,chat:CHAT,uid:A,command:'vimeo',arg:'https://vimeo.com/123',args:[],m:{},info:{},prefix:'!'});await assert.rejects(fs.access(file));
});
