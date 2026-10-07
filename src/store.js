import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
export const DAY = 86400000;
export {ownerConfigured} from './runtime-config.js';
import {ownerNumber} from './runtime-config.js';
export const PRIMARY = ownerNumber;
export const defaults = () => ({config:{name:'Eddine-MD',prefix:'.',public:false,youtube:false,autoreply:false,mystyle:false,sudo:[],images:{menu:'menu.jpg'}},groups:{},users:{},activity:{},memory:{},introductions:{},reminders:[],leases:[],receipts:{},pendingBank:{},pendingFees:0});
export const groupDefaults=()=>({antilink:'off',antispam:false,welcome:false,goodbye:false,welcomeText:'Welcome {user} to {group}!',goodbyeText:'Goodbye {user}.',aigroup:false,adminShop:false,warnings:{}});
export class Store {
 constructor(root){this.root=root;fs.mkdirSync(root,{recursive:true});this.db=new DatabaseSync(path.join(root,'bot.sqlite'));this.db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS states (id TEXT PRIMARY KEY, payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY, status TEXT NOT NULL, unpairedAt INTEGER, blocked INTEGER NOT NULL DEFAULT 0);');if(!this.get('host'))this.put('host',{owner:PRIMARY,name:'Salah Eddine',maxAccounts:10,ai:{provider:'gemini',geminiKey:'',geminiDailyLimit:100,geminiTtsDailyLimit:5,geminiModel:'gemini-3.5-flash-lite',enabled:false,key:'',budgetUsd:0,period:'monthly',spent:0,cycle:'',blocked:null,notices:{},rates:{input:0.4,output:1.6,transcribe:0.006,speech:15},reserveMultiplier:1.25}});this.ensure(PRIMARY);}
 get(id){const r=this.db.prepare('SELECT payload FROM states WHERE id=?').get(id);return r?JSON.parse(r.payload):null;}
 put(id,s){this.db.prepare('INSERT INTO states VALUES (?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(id,JSON.stringify(s));}
 ensure(id){if(!this.get(id))this.put(id,defaults());return this.get(id);}
 tx(ids,fn){ids=[...new Set(ids)];this.db.exec('BEGIN IMMEDIATE');try{const states=Object.fromEntries(ids.map(id=>[id,this.get(id)||defaults()]));const result=fn(states);if(result instanceof Promise)throw Error('Transactions must be synchronous');for(const id of ids)this.put(id,states[id]);this.db.exec('COMMIT');return result;}catch(e){this.db.exec('ROLLBACK');throw e;}}
 change(id,fn){return this.tx([id],s=>fn(s[id]));}
 accounts(){return this.db.prepare('SELECT * FROM accounts ORDER BY id').all();}
 account(id){return this.db.prepare('SELECT * FROM accounts WHERE id=?').get(id);}
 status(id,status){this.db.prepare('INSERT INTO accounts(id,status) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status').run(id,status);}
 paired(id){this.status(id,'online');this.db.prepare('UPDATE accounts SET unpairedAt=NULL WHERE id=?').run(id);}
 unpair(id,now=Date.now()){this.status(id,'unpaired');this.db.prepare('UPDATE accounts SET unpairedAt=? WHERE id=?').run(now,id);}
 block(id,v){this.status(id,v?'blocked':'stopped');this.db.prepare('UPDATE accounts SET blocked=? WHERE id=?').run(v?1:0,id);}
 cleanup(now=Date.now()){for(const a of this.accounts()){if(a.unpairedAt&&now-a.unpairedAt>=3*DAY){this.db.prepare('DELETE FROM states WHERE id=?').run(a.id);this.db.prepare('DELETE FROM accounts WHERE id=?').run(a.id);fs.rmSync(path.join(this.root,'backups',a.id),{recursive:true,force:true});fs.rmSync(path.join(this.root,'sessions',a.id),{recursive:true,force:true});fs.rmSync(path.join(this.root,'images',a.id),{recursive:true,force:true});}}}
 snapshot(){for(const row of this.db.prepare('SELECT * FROM states').all()){const dir=path.join(this.root,'backups',row.id);fs.mkdirSync(dir,{recursive:true});const state=JSON.parse(row.payload);if(row.id==='host'){state.ai.key='';state.ai.geminiKey='';}const day=new Date().toISOString().slice(0,10);const file=path.join(dir,day+'.json');fs.writeFileSync(file+'.tmp',JSON.stringify({version:1,createdAt:Date.now(),state},null,2));fs.renameSync(file+'.tmp',file);const files=fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort().reverse();for(const f of files.slice(7))fs.unlinkSync(path.join(dir,f));}}
 close(){this.db.exec('PRAGMA wal_checkpoint(TRUNCATE)');this.db.close();}
}
