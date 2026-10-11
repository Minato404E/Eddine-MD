import test from 'node:test';import assert from 'node:assert/strict';
import {wantedReward,profilePortrait} from '../src/wanted.js';
test('Wanted random bounty avoids consecutive repeats and manual amount validates',()=>{
 assert.equal(wantedReward(undefined,undefined,()=>40489),'4.048.900.000');assert.equal(wantedReward(undefined,'4.048.900.000',()=>40489),'4.049.000.000');assert.equal(wantedReward('4,048,900,000'),'4.048.900.000');for(const value of ['0','-1','text','1234567890123'])assert.throws(()=>wantedReward(value));
});
test('Wanted text reply loads profile image and clearly reports inaccessible profile',async()=>{
 const result=await profilePortrait({profilePictureUrl:async jid=>{assert.equal(jid,'123@s.whatsapp.net');return 'https://example.com/avatar';}},'123@s.whatsapp.net',async()=>new Response(Buffer.from('image-fixture')));assert.equal(result.type,'imageMessage');assert.equal(result.buffer.toString(),'image-fixture');
 await assert.rejects(profilePortrait({profilePictureUrl:async()=>{throw Error('private');}},'123@s.whatsapp.net'),/Profile lookup failed/);
});

test('Wanted text reply uses replied member name and profile image in the reference template',async t=>{
 const fs=await import('node:fs/promises'),os=await import('node:os'),path=await import('node:path');const {createCanvas,loadImage}=await import('@napi-rs/canvas');const {Store}=await import('../src/store.js');const {Commands}=await import('../src/commands.js');
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-wanted-'));const store=new Store(root),account='212600000001',target='212600000002@s.whatsapp.net';store.ensure(account);store.change(account,s=>{s.displayNames={[target]:{name:'Salah',at:Date.now()}};});
 const canvas=createCanvas(400,400);canvas.getContext('2d').fillStyle='#ef299a';canvas.getContext('2d').fillRect(0,0,400,400);const original=globalThis.fetch;globalThis.fetch=async()=>new Response(canvas.toBuffer('image/png'));
 const e={id:account,sock:{user:{id:account+'@s.whatsapp.net'},profilePictureUrl:async id=>{assert.equal(id,target);return 'https://example.com/profile';}}};let sent;const sessions={identity:async(e,id)=>id,send:async(e,chat,content)=>{sent=content;}};const bot=new Commands(store,sessions,{},root);
 t.after(async()=>{globalThis.fetch=original;await bot.collections.close();store.close();await fs.rm(root,{recursive:true,force:true});});
 await bot.execute({e,command:'wanted',arg:'',args:[],info:{participant:target,quotedMessage:{conversation:'hello'}},m:{key:{}},chat:'group@g.us',participants:[],prefix:'!'});
 const output=await loadImage(sent.image);assert.equal(output.width,735);assert.equal(output.height,1078);const result=createCanvas(735,1078);result.getContext('2d').drawImage(output,0,0);assert.deepEqual([...result.getContext('2d').getImageData(360,430,1,1).data],[239,41,154,255]);
});
