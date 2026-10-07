import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {reactions,requiresTarget,reactionCaption,reactionVideo} from '../src/reactions.js';
import { Commands } from '../src/commands.js';
import { Store } from '../src/store.js';
import { AI } from '../src/ai.js';
import { run } from '../src/media.js';
import ffprobe from 'ffprobe-static';
const root=path.resolve('.'),A='212600000001',B='212600000002';
test('every advertised reaction has two playable H264 animation assets and credits',async()=>{
 const dir=path.join(root,'assets','reactions');const credits=JSON.parse(await fs.readFile(path.join(dir,'credits.json'),'utf8'));
 for(const cmd of Object.keys(reactions))for(let i=1;i<=2;i++){
  const name=cmd+'-'+i+'.mp4',file=path.join(dir,name);const meta=JSON.parse(await run(ffprobe.path,['-v','error','-show_streams','-show_format','-of','json',file]));const stream=meta.streams.find(s=>s.codec_type==='video');assert.equal(stream.codec_name,'h264',name);assert.equal(stream.pix_fmt,'yuv420p',name);assert.ok(Number(stream.nb_frames)>1,name);assert.ok(Number(meta.format.duration)>0&&Number(meta.format.duration)<=8.1,name);assert.ok((await fs.stat(file)).size<2*1024*1024,name);assert.ok(credits.assets[name]?.url,name);
 }
});
test('targeted captions and expression-only captions are correct and random choice uses separate assets',async()=>{
 assert.equal(reactionCaption('slap',A,B),'@'+A+' slapped @'+B+'.');assert.equal(reactionCaption('marry',A,B),'@'+A+' married @'+B+'.');assert.equal(requiresTarget('hug'),true);assert.equal(requiresTarget('cry'),false);assert.equal(reactionCaption('cry',A),'@'+A+' cried.');
 const first=await reactionVideo(root,'hug',{random:()=>0}),second=await reactionVideo(root,'hug',{random:()=>0.99});assert.ok(!first.equals(second));await assert.rejects(reactionVideo(root,'../../data'));
});
test('reaction command sends animated video with both mentions and reply quotation without moderation',async t=>{
 const data=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-reactions-'));const store=new Store(data);t.after(async()=>{store.close();await fs.rm(data,{recursive:true,force:true});});store.ensure(A);store.change(A,s=>{s.savedContacts={[A+'@s.whatsapp.net']:{name:'Salah'},[B+'@s.whatsapp.net']:{name:'Ahmed'}};});const sent=[];
 const sessions={identity:async(e,address)=>address,send:async(e,chat,content,options)=>{sent.push({content,options});return {};}};
 const bot=new Commands(store,sessions,new AI(store),root);const c={command:'slap',e:{id:A,sock:{}},chat:'test@g.us',uid:A,senderRaw:A+'@s.whatsapp.net',isGroup:true,owner:false,sudo:false,host:false,admin:false,args:[],arg:'',prefix:'.',info:{mentionedJid:[B+'@s.whatsapp.net']},m:{key:{id:'fixture'}}};
 await bot.execute(c);const {content,options}=sent[0];assert.equal(content.gifPlayback,true);assert.equal(content.mimetype,'video/mp4');assert.ok(Buffer.isBuffer(content.video));assert.equal(content.caption,'Salah slapped Ahmed.\n\n@'+A+' · @'+B);assert.deepEqual(content.mentions,[A+'@s.whatsapp.net',B+'@s.whatsapp.net']);assert.equal(options.quoted,c.m);
 c.command='hug';c.info={};await assert.rejects(bot.execute(c),/reply/);assert.equal(sent.length,1);
 c.info={participant:B+'@s.whatsapp.net'};await bot.execute(c);assert.equal(sent.length,2);
 c.command='kick';await assert.rejects(bot.execute(c),/admins/i);assert.equal(sent.length,2);
 c.command='kickgif';await bot.execute(c);assert.equal(sent.length,3);
 c.command='wave';c.info={};c.isGroup=false;await bot.execute(c);assert.equal(sent.length,4);
});
