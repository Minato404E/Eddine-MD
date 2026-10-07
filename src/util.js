import os from 'node:os';
export const phone=v=>{const n=String(v||'').replace(/\D/g,'');if(!/^[1-9]\d{7,14}$/.test(n))throw Error('Use a country code and phone number, without +.');return n;};
export const jid=p=>p+'@s.whatsapp.net';
export const normalize=v=>String(v||'').replace(/:\d+@/,'@');
export const numberOf=v=>normalize(v).split('@')[0];
export const wait=ms=>new Promise(r=>setTimeout(r,ms));
export const bytes=n=>(n/1024/1024).toFixed(0)+' MB';
let previous=os.cpus().map(c=>c.times);
export function stats(){const current=os.cpus().map(c=>c.times);let idle=0,total=0;current.forEach((t,i)=>{const p=previous[i]||t;idle+=t.idle-p.idle;for(const k of Object.keys(t))total+=t[k]-p[k];});previous=current;return {cpu:total?Math.round((1-idle/total)*100):0,cpuModel:os.cpus()[0]?.model||'Unknown',cores:current.length,ramTotal:os.totalmem(),ramUsed:os.totalmem()-os.freemem(),processRam:process.memoryUsage().rss,uptime:Math.floor(process.uptime()),os:`${os.type()} ${os.release()}`};}
export function bucketKeys(now=new Date()){const local=new Date(now.toLocaleString('en-US',{timeZone:'Africa/Casablanca'}));const day=[local.getFullYear(),String(local.getMonth()+1).padStart(2,'0'),String(local.getDate()).padStart(2,'0')].join('-');const d=new Date(Date.UTC(local.getFullYear(),local.getMonth(),local.getDate()));d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return {day,week:d.toISOString().slice(0,10)};}
export function recordActivity(s,chat,id,now=new Date()){const {day,week}=bucketKeys(now);const a=s.activity[chat]??={day,week,users:{}};if(a.day!==day){a.day=day;for(const u of Object.values(a.users))u.today=0;}if(a.week!==week){a.week=week;for(const u of Object.values(a.users))u.week=0;}const u=a.users[id]??={today:0,week:0,total:0};u.today++;u.week++;u.total++;}
export function safeText(v,max=1500){return String(v||'').slice(0,max);}
export class Serial {constructor(){this.tail=Promise.resolve();}run(fn){const p=this.tail.then(fn);this.tail=p.catch(()=>{});return p;}}
