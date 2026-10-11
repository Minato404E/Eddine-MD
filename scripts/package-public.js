import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import JSZip from 'jszip';
const root=path.resolve(import.meta.dirname,'..');const zip=new JSZip();
const top=new Set(['index.js','package.json','package-lock.json','README.md','.gitignore','config.example.json','panel.config.example.json']);
const folders=['src','public','assets','scripts','tests','docs'];
for(const entry of await fs.readdir(root,{withFileTypes:true})){if(entry.isFile()&&(top.has(entry.name)||entry.name.endsWith('.bat')||['HOST-SETUP.md','YOUTUBE-SETUP.md'].includes(entry.name)))zip.file(entry.name,await fs.readFile(path.join(root,entry.name)));}
async function add(folder){for(const entry of await fs.readdir(path.join(root,folder),{withFileTypes:true})){const relative=folder+'/'+entry.name;if(entry.isDirectory())await add(relative);else if(entry.isFile())zip.file(relative,await fs.readFile(path.join(root,relative)));else throw Error('Symlinks are excluded from public releases.');}}
for(const folder of folders)await add(folder);
zip.file('data/README.md',await fs.readFile(path.join(root,'data','README.md')));zip.file('data/.gitkeep','');zip.file('tools/README.txt',await fs.readFile(path.join(root,'tools','README.txt')));
for(const name of Object.keys(zip.files)){if(name==='config.json'||name==='panel.config.json'||name.startsWith('data/')&&!['data/','data/README.md','data/.gitkeep'].includes(name)||name.startsWith('tools/')&&!['tools/','tools/README.txt'].includes(name)||/\.(sqlite|traineddata)$/.test(name))throw Error('Private/runtime file in archive: '+name);}
const output=process.argv[2]?path.resolve(process.argv[2]):path.join(os.tmpdir(),'Eddine-MD-GitHub-Ready.zip');await fs.writeFile(output,await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}}));console.log('Public ZIP saved: '+output+' (no sessions, configuration, database, cookies or tokens)');
