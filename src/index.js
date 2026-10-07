import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store,PRIMARY,ownerConfigured } from './store.js';
import { Sessions } from './sessions.js';
import { Commands } from './commands.js';
import { AI } from './ai.js';
import { Scheduler } from './scheduler.js';
import { panel } from './panel.js';
if(!ownerConfigured){console.error('Configure your owner number first: npm run setup (or set OWNER_NUMBER).');process.exit(1);}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const data=path.join(root,'data');fs.mkdirSync(data,{recursive:true});const store=new Store(data);const logs=[];
const log=text=>{const line=new Date().toLocaleString('en-GB',{timeZone:'Africa/Casablanca'})+' • '+text;logs.push(line);if(logs.length>200)logs.shift();console.log(line);};
let server,stopping=false;const ai=new AI(store),sessions=new Sessions(store,{log});const commands=new Commands(store,sessions,ai,root);sessions.handler=commands;const scheduler=new Scheduler(store,sessions,commands,log);
async function shutdown(code=0){if(stopping)return;stopping=true;log('Saving and stopping…');scheduler.stop();await commands.collections.close();server?.close();try{await sessions.close();store.snapshot();store.close();}catch(e){console.error('Shutdown:',e.message);code=1;}process.exit(code);}
process.on('SIGINT',()=>shutdown());process.on('SIGTERM',()=>shutdown());process.on('uncaughtException',e=>{console.error('Fatal:',e.message);shutdown(1);});process.on('unhandledRejection',e=>{log('Unhandled error: '+(e?.message||'Unknown'));});
try{server=await panel({store,sessions,ai,root,shutdown,logs});log('Eddine-MD • Salah Eddine • Panel '+server.panelUrl);log('Sign in using the token from data/panel-token.txt. Owner: '+PRIMARY);if(process.argv.includes('--offline'))log('Offline mode: WhatsApp sockets are disabled.');else await sessions.resume();scheduler.start();}catch(e){console.error(e.message);await shutdown(1);}
