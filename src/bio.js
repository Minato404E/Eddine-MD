import {fancy} from './display.js';
export const BIO_INTERVAL=5*60*1000;
export function uptimeLabel(milliseconds){const seconds=Math.max(0,Math.floor(milliseconds/1000)),days=Math.floor(seconds/86400),hours=Math.floor(seconds/3600)%24,minutes=Math.floor(seconds/60)%60;return (days?days+'d ':'')+hours+'h '+minutes+'m';}
export async function rotateBio(entry,{enabled=true,now=Date.now(),log=console.log}={}){
 if(!enabled||entry.status!=='online'||entry.bioBusy||typeof entry.sock?.updateProfileStatus!=='function'||now<(entry.bioNextAt||0))return;
 entry.bioNextAt=now+BIO_INTERVAL;entry.bioBusy=true;
 const owner=!!entry.bioOwnerNext,text=owner?'Owner: Salah Eddine':'EDDINE-MD • Uptime: '+uptimeLabel(now-(entry.onlineSince??now));
 let timer;
 try{await Promise.race([entry.sock.updateProfileStatus(fancy(text)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('About update timed out')),8000);timer.unref?.();})]);entry.bioOwnerNext=!owner;}
 catch(error){log('About update failed for '+entry.id+': '+(error?.message||'Unavailable'));}
 finally{clearTimeout(timer);entry.bioBusy=false;}
}
