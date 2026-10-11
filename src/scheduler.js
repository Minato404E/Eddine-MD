import {rotateBio} from './bio.js';
import { DAY } from './store.js';
import { numberOf } from './util.js';
export class Scheduler {
 constructor(store,sessions,commands,log=console.log){Object.assign(this,{store,sessions,commands,log});this.busy=false;}
 start(){this.timer=setInterval(()=>this.tick().catch(e=>this.log('Scheduler: '+e.message)),15000);this.tick().catch(e=>this.log(e.message));}
 stop(){clearInterval(this.timer);}
 async tick(){if(this.busy)return;this.busy=true;try{this.store.cleanup();const day=new Date().toISOString().slice(0,10);if(this.lastBackup!==day){this.store.snapshot();this.lastBackup=day;}
 for(const e of this.sessions.entries.values()){if(e.status!=='online')continue;let state=this.store.get(e.id);if(!state)continue;
 await rotateBio(e,{enabled:state.config.autobio!==false,log:this.log});
 for(const r of state.reminders){if(r.at>Date.now())continue;try{await this.sessions.send(e,r.chat,{text:`Reminder for @${r.user}: ${r.text}`,mentions:[r.user+'@s.whatsapp.net']});this.store.change(e.id,s=>{s.reminders=s.reminders.filter(x=>x.id!==r.id);});}catch{}}
 await this.commands.adminQueue.run(async()=>{for(const job of this.store.get(e.id).groupJobs||[]){if(job.at>Date.now())continue;const discard=()=>this.store.change(e.id,s=>s.groupJobs=(s.groupJobs||[]).filter(x=>x.id!==job.id));if(job.running||Date.now()-job.at>DAY){discard();continue;}try{const meta=await e.sock.groupMetadata(job.chat);const members=await Promise.all(meta.participants.map(async p=>({...p,resolved:await this.sessions.identity(e,p.id,p.phoneNumber)})));if(!members.some(p=>numberOf(p.resolved)===job.by&&p.admin)||!members.some(p=>numberOf(p.resolved)===e.id&&p.admin))throw Error('Requester or bot no longer has admin permissions.');this.store.change(e.id,s=>{const j=s.groupJobs?.find(x=>x.id===job.id);if(j)j.running=true;});await e.sock.groupSettingUpdate(job.chat,job.action==='open'?'not_announcement':'announcement');discard();e.groups.delete(job.chat);await this.sessions.send(e,job.chat,{text:'Scheduled group '+job.action+' completed. / تمت الجدولة.'});}catch(error){discard();this.log('Group schedule '+job.id+': '+error.message);await this.sessions.send(e,job.chat,{text:'Group schedule '+job.id+' failed; no automatic retry. Check admin permissions.'}).catch(()=>{});}}});
 await this.commands.adminQueue.run(async()=>{state=this.store.get(e.id);for(const l of state.leases){if(l.status!=='promoting'&&l.at>Date.now())continue;try{e.groups.delete(l.chat);const meta=await this.sessions.group(e,l.chat);const target=meta.participants.find(p=>p.id===l.target||numberOf(p.phoneNumber)===l.user);if(l.status==='promoting'){this.store.change(e.id,s=>{const lease=s.leases.find(x=>x.id===l.id);if(!lease)return;if(target?.admin){lease.status='active';}else{if(s.users[l.user])s.users[l.user].wallet+=20000;s.leases=s.leases.filter(x=>x.id!==l.id);}});continue;}
 if(!target?.admin||target.admin==='superadmin'){this.store.change(e.id,s=>{s.leases=s.leases.filter(x=>x.id!==l.id);});continue;}
 const res=await e.sock.groupParticipantsUpdate(l.chat,[l.target],'demote');if(res.some(r=>String(r.status)!=='200'))throw Error('Admin removal rejected.');this.store.change(e.id,s=>{s.leases=s.leases.filter(x=>x.id!==l.id);});await this.sessions.send(e,l.chat,{text:`@${l.user}: your 7-day admin purchase has expired.`,mentions:[l.target]});}catch{this.store.change(e.id,s=>{const lease=s.leases.find(x=>x.id===l.id);if(lease&&lease.status!=='promoting')lease.status='pendingRemoval';});}}});
 this.store.change(e.id,s=>{for(const [k,v] of Object.entries(s.pendingBank))if(v.expires<Date.now())delete s.pendingBank[k];});
 }
 }finally{this.busy=false;}}
}
