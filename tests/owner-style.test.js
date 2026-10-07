import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {Store,DAY} from '../src/store.js';import {AI} from '../src/ai.js';import {Commands} from '../src/commands.js';import {Sessions} from '../src/sessions.js';
import {learnOwnerStyle,ownerStylePrompt,updateSavedContacts,savedContactName} from '../src/owner-style.js';
const A='212600000001',B='212600000002';
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'eddine-style-'));const s=new Store(dir);s.ensure(A);s.change(A,x=>{x.config.mystyle=true;});t.after(()=>{s.close();fs.rmSync(dir,{recursive:true,force:true});});return s;}
test('style records only opted-in human outgoing text and persists isolated conversation examples',t=>{
 const s=fixture(t);assert.equal(learnOwnerStyle(s,A,{fromMe:false,text:'someone else',chat:'private'}),false);assert.equal(learnOwnerStyle(s,A,{fromMe:true,generated:true,text:'AI reply',chat:'private'}),false);assert.equal(learnOwnerStyle(s,A,{fromMe:true,text:'.play hello',chat:'private'}),false);
 assert.equal(learnOwnerStyle(s,A,{fromMe:true,text:'db bghit nmchi contactA secret',chat:'private-A'}),true);learnOwnerStyle(s,A,{fromMe:true,text:'safi ah',chat:'private-B'});const prompt=ownerStylePrompt(s.get(A),'private-B');assert.ok(!prompt.includes('contactA secret'));assert.ok(prompt.includes('safi ah'));assert.equal(s.get(A).ownerStyle.count,2);s.ensure(B);assert.equal(s.get(B).ownerStyle,undefined);
 const reopened=new Store(s.root);assert.equal(reopened.get(A).ownerStyle.count,2);reopened.close();
});
test('style examples expire, remain bounded and exclude authentication secrets',t=>{
 const s=fixture(t);assert.equal(learnOwnerStyle(s,A,{fromMe:true,text:'Bearer secret-value',chat:'x'}),false);
 const now=20*DAY;learnOwnerStyle(s,A,{fromMe:true,text:'old example',chat:'old'},now-8*DAY);for(let i=0;i<45;i++)learnOwnerStyle(s,A,{fromMe:true,text:'ah '+i,chat:'chat'+i},now);assert.ok(Object.keys(s.get(A).ownerStyle.chats).length<=40);assert.equal(s.get(A).ownerStyle.chats.old,undefined);
 for(let i=0;i<20;i++)learnOwnerStyle(s,A,{fromMe:true,text:'text '+i,chat:'last'},now);assert.equal(s.get(A).ownerStyle.chats.last.messages.length,12);assert.ok(!ownerStylePrompt(s.get(A),'last',now+8*DAY).includes('text 19'));
});
test('saved contacts use owner address-book name, not a sender-controlled push name',t=>{
 const s=fixture(t);updateSavedContacts(s,A,[{id:B+'@s.whatsapp.net',notify:'Not the saved name'}]);assert.equal(savedContactName(s.get(A),B+'@s.whatsapp.net'),'');updateSavedContacts(s,A,[{id:'123@lid',phoneNumber:B+'@s.whatsapp.net',name:'Ahmed'}]);assert.equal(savedContactName(s.get(A),B+'@s.whatsapp.net'),'Ahmed');assert.equal(savedContactName(s.get(A),'123@lid'),'Ahmed');assert.equal(savedContactName(s.get(B)||{},B+'@s.whatsapp.net'),'');
});
test('AI receives owner style plus known contact label without a separate learning API request',async t=>{
 const s=fixture(t);learnOwnerStyle(s,A,{fromMe:true,text:'ah db safi',chat:B+'@s.whatsapp.net'});updateSavedContacts(s,A,[{id:B+'@s.whatsapp.net',name:'Ahmed'}]);const ai=new AI(s);let calls=0;ai.text=async(chat,instructions)=>{calls++;assert.ok(instructions.includes('ah db safi'));assert.ok(instructions.includes('Ahmed'));assert.ok(instructions.includes('Do not ask who they are'));assert.ok(instructions.includes('not the owner personally'));return JSON.stringify({reply:'ah safi',memory:''});};assert.equal(await ai.reply({account:A,chat:B+'@s.whatsapp.net',uid:B,text:'salam',isGroup:false,name:'Eddine-MD'}),'ah safi');assert.equal(calls,1);
});
test('style control is owner-only and automatic notice appears once per conversation',async t=>{
 const s=fixture(t),sent=[];const sessions={send:async(e,chat,content)=>{sent.push(content.text);return {};}};const ai={serial:{run:fn=>fn()},reply:async()=> 'ah safi'};const bot=new Commands(s,sessions,ai,path.resolve('.'));const c={e:{id:A},chat:B+'@s.whatsapp.net',uid:B,info:{},command:'mystyle',arg:'off',args:['off'],prefix:'.',isGroup:false,owner:false,sudo:true,host:false,m:{}};await assert.rejects(bot.execute(c),/owner/);assert.equal(s.get(A).config.mystyle,true);
 await bot.respondAI(c,'salam');await bot.respondAI(c,'salam again');assert.match(sent[0],/^Automatic reply/);assert.equal(sent[1],'ah safi');c.owner=true;c.arg='clear';await bot.execute(c);assert.equal(s.get(A).ownerStyle,undefined);
});
test('generated outgoing IDs persist to prevent learning bot replies after reconnect',async t=>{
 const s=fixture(t);const sessions=new Sessions(s);const e={id:A,sent:new Map(),sock:{sendMessage:async()=>({key:{id:'generated'}})}};await sessions.send(e,'chat',{text:'bot output'});assert.ok(s.get(A).receipts.generated);
});
test('failed delivery does not consume the first automatic-reply notice',async t=>{
 const s=fixture(t);const ai={serial:{run:fn=>fn()},reply:async()=> 'reply'};let fail=true,last;const sessions={send:async(e,chat,content)=>{last=content.text;if(fail)throw Error('offline');return {};}};const bot=new Commands(s,sessions,ai,path.resolve('.'));const c={e:{id:A},chat:'test-chat',uid:B,isGroup:false,m:{},prefix:'.'};
 await assert.rejects(bot.respondAI(c,'hello'));assert.equal(s.get(A).introductions['style:test-chat'],undefined);fail=false;await bot.respondAI(c,'hello');assert.match(last,/^Automatic reply/);assert.ok(s.get(A).introductions['style:test-chat']);
});
