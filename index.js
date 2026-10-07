// Cross-platform entry point: node index.js (no BAT/PowerShell required).
const [major,minor]=process.versions.node.split('.').map(Number);
if(!((major===22&&minor>=13)||major>=24)){
 console.error('Eddine-MD requires Node.js 22.13+ (22.x) or Node.js 24+. Current version: '+process.versions.node);
 process.exitCode=1;
}else{
 await import('./src/index.js');
}
