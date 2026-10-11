import {randomInt} from 'node:crypto';
export function wantedReward(value,previous,pick=randomInt){
 if(value){const digits=String(value).replace(/[.,\s]/g,'');if(!/^\d{1,12}$/.test(digits)||Number(digits)<1)throw Error('Wanted reward: enter a positive amount up to 999,999,999,999.');return Number(digits).toLocaleString('de-DE');}
 let amount=pick(100,50001)*100000;
 if(amount.toLocaleString('de-DE')===previous)amount=amount===5000000000?10000000:amount+100000;
 return amount.toLocaleString('de-DE');
}
export async function profilePortrait(sock,address,fetcher=fetch,alternates=[]){
 const candidates=[...new Set([address,...alternates].filter(Boolean))].slice(0,3);let url,lastError,denied=false;
 for(const id of candidates){for(const type of ['image','preview']){let timer;try{url=await Promise.race([sock.profilePictureUrl(id,type,8000),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Profile lookup timed out.')),9000);})]);if(url)break;}catch(e){lastError=e;const status=e.output?.statusCode||e.status||e.statusCode;denied||=status===401||status===403;if(status===401||status===403)break;}finally{clearTimeout(timer);}}if(url)break;}
 if(!url){if(denied)throw Error('WhatsApp denied this paired account access to the photo (privacy settings).');if(lastError){console.error('[Profile lookup]',lastError.output?.statusCode||lastError.status||lastError.name);throw Error('Profile lookup failed or timed out. Retry after reconnecting the bot.');}throw Error('WhatsApp returned no profile photo for this account.');}
 if(new URL(url).protocol!=='https:')throw Error('Invalid profile photo URL.');
 let response;try{response=await fetcher(url,{signal:AbortSignal.timeout(15000),redirect:'follow'});}catch(e){console.error('[Profile download]',e.name);throw Error('Profile photo was found, but its download failed. Check the host network and retry.');}
 if(response.url&&new URL(response.url).protocol!=='https:')throw Error('Insecure profile photo redirect refused.');
 if(!response.ok||!response.body)throw Error('Profile photo was found, but download returned HTTP '+response.status+'. Retry later.');
 if(Number(response.headers.get('content-length'))>5*1024*1024)throw Error('Profile picture exceeds 5 MB.');const parts=[];let size=0;try{for await(const chunk of response.body){size+=chunk.length;if(size>5*1024*1024)throw Error('Profile picture exceeds 5 MB.');parts.push(chunk);}}catch(e){if(e.message==='Profile picture exceeds 5 MB.')throw e;throw Error('Profile photo was found, but its transfer failed. Retry later.');}
 return {buffer:Buffer.concat(parts),type:'imageMessage',data:{mimetype:'image/jpeg'}};
}
