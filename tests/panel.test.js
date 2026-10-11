import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import http from 'node:http';
import path from 'node:path';
import { panelConfig,panel } from '../src/panel.js';
import { Store } from '../src/store.js';
import { AI } from '../src/ai.js';
async function root(t){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-panel-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));return dir;}
test('panel configuration defaults local and honors hosting environment overrides',async t=>{
 const dir=await root(t);let c=await panelConfig(dir,{});assert.equal(c.bind,'127.0.0.1');assert.equal(c.port,8787);
 await fs.writeFile(path.join(dir,'panel.config.json'),JSON.stringify({bind:'0.0.0.0',port:25730,publicUrl:'http://host.example:25730'}));
 c=await panelConfig(dir,{SERVER_PORT:'18996'});assert.equal(c.port,18996);assert.equal(c.bind,'0.0.0.0');assert.ok(c.hosts.has('host.example:25730'));
 c=await panelConfig(dir,{PANEL_PORT:'18995',SERVER_PORT:'18996',PANEL_HOST:'127.0.0.1',PANEL_URL:'https://bot.example'});assert.equal(c.port,18995);assert.equal(c.bind,'127.0.0.1');assert.equal(c.url,'https://bot.example');
 for(const port of ['-1','65536','abc'])await assert.rejects(panelConfig(dir,{PANEL_PORT:port}));
 for(const url of ['ftp://host.example','http://user:pass@host.example','http://host.example/path','http://host.example/?token=x'])await assert.rejects(panelConfig(dir,{PANEL_URL:url}));
});
test('remote panel preserves token authentication, exact host/origin checks and secret redaction',async t=>{
 const dir=await root(t),data=path.join(dir,'data');const store=new Store(data);t.after(()=>store.close());
 await fs.writeFile(path.join(dir,'panel.config.json'),JSON.stringify({bind:'0.0.0.0',port:18996,publicUrl:'http://host.example:18996'}));
 store.change('host',h=>{h.ai.key='openai-secret';h.ai.geminiKey='gemini-secret';});
 const server=await panel({store,ai:new AI(store),sessions:{list:()=>[]},root:dir,logs:[],shutdown:()=>{}});t.after(()=>new Promise(resolve=>server.close(resolve)));
 assert.equal(server.address().address,'0.0.0.0');const token=(await fs.readFile(path.join(data,'panel-token.txt'),'utf8')).trim();
 const fetchRaw=(url,opts={})=>new Promise((resolve,reject)=>{const request=http.request(url,{method:opts.method||'GET',headers:opts.headers},res=>{let body='';res.on('data',b=>body+=b);res.on('end',()=>resolve({status:res.statusCode,text:async()=>body}));});request.on('error',reject);request.end(opts.body);});
 const url='http://127.0.0.1:18996/api/state';const headers={Host:'host.example:18996',Origin:'http://host.example:18996',Authorization:'Bearer '+token};
 assert.equal((await fetchRaw(url,{headers:{Host:headers.Host}})).status,401);
 assert.equal((await fetchRaw(url,{headers:{...headers,Host:'evil.example:18996'}})).status,403);
 assert.equal((await fetchRaw(url,{headers:{...headers,Origin:'http://evil.example:18996'}})).status,403);
 const response=await fetchRaw(url,{headers});assert.equal(response.status,200);const text=await response.text();assert.ok(!text.includes('openai-secret'));assert.ok(!text.includes('gemini-secret'));
 const mutation=await fetchRaw('http://127.0.0.1:18996/api/ai',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({enabled:false})});assert.equal(mutation.status,200);
});
