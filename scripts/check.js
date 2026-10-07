import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
let failed=false;const entry=spawnSync(process.execPath,['--check','index.js'],{encoding:'utf8'});if(entry.status){console.error(entry.stderr);failed=true;}for(const dir of ['src','public','scripts','tests'])for(const file of fs.readdirSync(dir)){if(!file.endsWith('.js'))continue;const r=spawnSync(process.execPath,['--check',dir+'/'+file],{encoding:'utf8'});if(r.status){console.error(r.stderr);failed=true;}}
process.exitCode=failed?1:0;if(!failed)console.log('All JavaScript syntax checks passed.');
