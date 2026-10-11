// Cross-platform entry point: node index.js (no BAT/PowerShell required).
const [major,minor]=process.versions.node.split('.').map(Number);
if(!((major===22&&minor>=13)||major>=24)){
 console.error('Eddine-MD requires Node.js 22.13+ (22.x) or Node.js 24+. Current version: '+process.versions.node);
 process.exitCode=1;
}else{
 if(process.env.EDDINE_WORKER==='1')await import('./src/index.js');
 else{
  const {spawn}=await import('node:child_process');const {fileURLToPath}=await import('node:url');
  let child,stopping=false;
  const stop=signal=>{stopping=true;child?.kill(signal);};
  process.on('SIGINT',()=>stop('SIGINT'));process.on('SIGTERM',()=>stop('SIGTERM'));
  do{
   const code=await new Promise(resolve=>{
    child=spawn(process.execPath,[fileURLToPath(import.meta.url),...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,EDDINE_WORKER:'1'}});
    child.on('error',e=>{console.error(e.message);resolve(1);});child.on('exit',code=>resolve(code??0));
   });
   if(code!==75||stopping){process.exitCode=code===75?0:code;break;}
   console.log('Loading updated bot…');
  }while(!stopping);
 }
}
