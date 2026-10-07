import fs from 'node:fs';import path from 'node:path';import {DatabaseSync} from 'node:sqlite';
const root=path.resolve(import.meta.dirname,'..');
let config={};try{config=JSON.parse(fs.readFileSync(path.join(root,'config.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw Error('Invalid config.json. Run npm run setup.');}
function oldOwner(){const file=path.join(root,'data','bot.sqlite');if(!fs.existsSync(file))return '';let db;try{db=new DatabaseSync(file,{readOnly:true});return JSON.parse(db.prepare("SELECT payload FROM states WHERE id='host'").get()?.payload||'{}').owner||'';}catch{return '';}finally{db?.close();}}
export const configuredOwner=String(process.env.OWNER_NUMBER||config.ownerNumber||oldOwner()).replace(/\D/g,'');
export const ownerConfigured=/^[1-9]\d{7,14}$/.test(configuredOwner);
// Placeholder exists only for isolated unit fixtures; startup requires real config.
export const ownerNumber=ownerConfigured?configuredOwner:'212000000000';
