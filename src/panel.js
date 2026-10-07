import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadImage,createCanvas } from '@napi-rs/canvas';
import { stats,phone } from './util.js';
import { updateAISettings } from './gemini.js';
import { PRIMARY } from './store.js';
const imageKeys=['menu','info','alive','welcome','goodbye','register','profile','bank','balance','shop'];
export async function panelConfig(root,env=process.env){
 let config={};try{config=JSON.parse(await fs.readFile(path.join(root,'panel.config.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw Error('Invalid panel.config.json: '+e.message);}
 const port=Number(env.PANEL_PORT||env.SERVER_PORT||env.PORT||config.port||8787);
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('Panel port must be 1–65535.');
 const bind=env.PANEL_HOST||config.bind||'127.0.0.1';
 if(!['127.0.0.1','0.0.0.0','::1','::'].includes(bind))throw Error('Panel bind must be a supported listen address.');
 const hosts=new Set(['127.0.0.1:'+port,'localhost:'+port,'[::1]:'+port]);
 const origins=new Set(['http://127.0.0.1:'+port,'http://localhost:'+port,'http://[::1]:'+port]);
 const publicUrl=env.PANEL_URL||config.publicUrl;let url='http://127.0.0.1:'+port;
 if(publicUrl){let u;try{u=new URL(publicUrl);}catch{throw Error('Invalid panel public URL.');}if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.pathname!=='/'||u.search||u.hash)throw Error('Panel URL must be an HTTP(S) origin without credentials or paths.');hosts.add(u.host.toLowerCase());origins.add(u.origin);url=u.origin;}
 return {port,bind,hosts,origins,url};
}
export async function panel({store,sessions,ai,root,shutdown,logs}){
 const tokenFile=path.join(store.root,'panel-token.txt');let token;try{token=(await fs.readFile(tokenFile,'utf8')).trim();}catch{token=crypto.randomBytes(32).toString('hex');await fs.writeFile(tokenFile,token,{mode:0o600});}const {port,bind,hosts,origins,url:panelUrl}=await panelConfig(root);
 const server=http.createServer(async(req,res)=>{res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'");
 const json=(value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
 try{if(!hosts.has(String(req.headers.host||'').toLowerCase()))return json({error:'Invalid host'},403);const url=new URL(req.url,'http://127.0.0.1:'+port);
 if(url.pathname.startsWith('/api/')){
 const supplied=Buffer.from(String(req.headers.authorization||'').replace(/^Bearer /,'')),expected=Buffer.from(token);if(supplied.length!==expected.length||!crypto.timingSafeEqual(supplied,expected))return json({error:'Enter the token from data/panel-token.txt to authenticate.'},401);
 const origin=req.headers.origin;if(origin&&!origins.has(origin))return json({error:'Invalid origin'},403);
 if(req.method==='GET'&&url.pathname==='/api/state'){const h=store.get('host');const configured=!!(h.ai.provider==='gemini'?h.ai.geminiKey:h.ai.key);const safeAI={...ai.prepare(),provider:h.ai.provider||'openai',key:undefined,geminiKey:undefined,configured};return json({stats:stats(),accounts:sessions.list(),host:{owner:PRIMARY,name:'Salah Eddine',maxAccounts:10,ai:safeAI},leases:sessions.list().flatMap(a=>(store.get(a.id)?.leases||[]).map(l=>({...l,account:a.id}))),logs:logs.slice(-50)});}
 if(req.method!=='POST')return json({error:'Method not allowed'},405);if(!String(req.headers['content-type']).startsWith('application/json'))return json({error:'JSON body required'},415);let raw='',size=0;for await(const b of req){size+=b.length;if(size>10*1024*1024)throw Error('Request too large.');raw+=b;}const body=JSON.parse(raw||'{}');
 if(url.pathname==='/api/pair'){const id=phone(body.phone);const e=await sessions.start(id,{pair:true});return json({phone:id,code:e.code});}
 if(url.pathname==='/api/action'){const id=phone(body.phone);switch(body.action){case 'start':await sessions.start(id);break;case 'stop':await sessions.stop(id);break;case 'unpair':await sessions.unpair(id);break;case 'block':await sessions.stop(id);store.block(id,true);break;case 'unblock':store.block(id,false);break;default:throw Error('Unknown account action.');}return json({ok:true});}
 if(url.pathname==='/api/config'){const id=phone(body.phone);if(!store.account(id))throw Error('Account not found.');store.change(id,s=>{if(body.name!==undefined){if(typeof body.name!=='string'||!body.name.trim()||body.name.length>40)throw Error('Name must be 1–40 characters.');s.config.name=body.name.trim();}if(body.prefix!==undefined){if(!/^[.!#$%&?~+;:/-]$/.test(body.prefix))throw Error('Prefix must be one supported punctuation character.');s.config.prefix=body.prefix;}for(const k of ['public','youtube','autoreply'])if(body[k]!==undefined){if(typeof body[k]!=='boolean')throw Error('Invalid setting.');s.config[k]=body[k];}});return json({ok:true});}
 if(url.pathname==='/api/ai'){updateAISettings(store,body);return json({ok:true});}
 if(url.pathname==='/api/image'){const id=phone(body.phone),key=body.key;if(!imageKeys.includes(key)||!store.account(id))throw Error('Invalid image target.');if(typeof body.data!=='string'||body.data.length>8e6)throw Error('Maximum image size: 5 MB.');const data=Buffer.from(body.data,'base64');const img=await loadImage(data);if(img.width>6000||img.height>6000)throw Error('Maximum image dimensions: 6000×6000.');const canvas=createCanvas(img.width,img.height);canvas.getContext('2d').drawImage(img,0,0);const dir=path.join(store.root,'images',id);await fs.mkdir(dir,{recursive:true});const file=key+'.png';await fs.writeFile(path.join(dir,file),canvas.toBuffer('image/png'));store.change(id,s=>{s.config.images[key]=file;});return json({ok:true});}
 if(url.pathname==='/api/backup'){store.snapshot();return json({ok:true});}
 if(url.pathname==='/api/shutdown'){json({ok:true});setTimeout(()=>shutdown(),300);return;}
 return json({error:'Unknown endpoint'},404);
 }
 const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};if(!files[url.pathname]||req.method!=='GET'){res.writeHead(404);res.end();return;}const file=files[url.pathname];res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8'});res.end(await fs.readFile(path.join(root,'public',file)));
 }catch(e){json({error:e.message||'Request failed'},400);}
 });await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,bind,resolve);});server.panelUrl=panelUrl;return server;
}
