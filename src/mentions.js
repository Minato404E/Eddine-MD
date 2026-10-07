import {normalize,numberOf} from './util.js';
export function cleanName(value){return String(value||'').replace(/[\x00-\x1f@]/g,' ').replace(/\s+/g,' ').trim().slice(0,80);}
export function participantMatches(p,...ids){const aliases=[p.id,p.resolved,p.phoneNumber,p.lid].filter(Boolean).map(normalize);return ids.filter(Boolean).map(normalize).some(id=>aliases.includes(id));}
export function rememberNames(store,account,items){
 const valid=items.filter(x=>cleanName(x.name)&&x.ids.some(id=>/^[\d:]+@(?:lid|s\.whatsapp\.net)$/.test(id||'')));if(!valid.length)return;
 store.change(account,s=>{const names=s.displayNames??={};for(const item of valid)for(const raw of item.ids){const id=normalize(raw);if(!/^\d+@(?:lid|s\.whatsapp\.net)$/.test(id))continue;names[id]={name:cleanName(item.name),at:Date.now()};}const sorted=Object.entries(names).sort((a,b)=>b[1].at-a[1].at);for(const [id]of sorted.slice(3000))delete names[id];});
}
export function mentionPerson(state,{jid,resolved,participant,name}={}){
 const native=normalize(participant?.id||resolved||jid);if(!/^\d+@(?:s\.whatsapp\.net|lid)$/.test(native))throw Error('Cannot identify this WhatsApp member.');
 const ids=[native,jid,resolved,participant?.phoneNumber,participant?.lid].filter(Boolean).map(normalize);
 const profile=ids.map(id=>state.displayNames?.[id]?.name).find(Boolean),saved=ids.map(id=>state.savedContacts?.[id]?.name).find(Boolean);
 const label=cleanName(name||participant?.notify||participant?.name||profile||saved||state.users?.[numberOf(resolved||native)]?.name);
 return {jid:native,token:'@'+numberOf(native),name:label||'Member'};
}
export function namedReaction(caption,people){return {caption:caption+'\n\n'+[...new Set(people.map(p=>p.token))].join(' · '),mentions:[...new Set(people.map(p=>p.jid))]};}
export function namedTagAll(body,people){return {text:body+'\n\n'+people.map(p=>'• '+p.name+' — '+p.token).join('\n'),mentions:[...new Set(people.map(p=>p.jid))]};}
