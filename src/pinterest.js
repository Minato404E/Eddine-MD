import {randomInt} from 'node:crypto';
import {mediaQueue,pinterestImage} from './media.js';
const pools=new Map(),history=new Map();
const TTL=10*60*1000;
export function searchPins(data){
 const results=data?.resource_response?.data?.results;
 if(!Array.isArray(results))return [];
 const unique=new Map();
 for(const pin of results){
  if(pin?.type!=='pin'||!/^\d+$/.test(String(pin.id)))continue;
  const thumbnails=Object.values(pin.images||{}).filter(image=>{try{const u=new URL(image.url);return u.protocol==='https:'&&u.hostname==='i.pinimg.com'&&!u.port&&!u.username&&!u.password;}catch{return false;}});
  if(thumbnails.length)unique.set(String(pin.id),{id:String(pin.id),title:String(pin.title||pin.grid_title||'Pinterest image').slice(0,100),thumbnails});
 }
 return [...unique.values()].slice(0,50);
}
async function getPool(query,fetcher){
 const cached=pools.get(query);if(cached&&cached.expires>Date.now())return cached.pins;
 const url=new URL('https://www.pinterest.com/resource/BaseSearchResource/get/');
 url.searchParams.set('source_url','/search/pins/?q='+encodeURIComponent(query));
 url.searchParams.set('data',JSON.stringify({options:{query,scope:'pins',page_size:25},context:{}}));
 const response=await fetcher(url.href,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{'X-Pinterest-PWS-Handler':'www/search/[scope].js','X-Requested-With':'XMLHttpRequest'}});
 if(!response.ok||!response.body)throw Error('Pinterest search is unavailable from this host. Try a direct pin link.');
 const chunks=[];let bytes=0;
 for await(const chunk of response.body){bytes+=chunk.length;if(bytes>5*1024*1024)throw Error('Pinterest search response is too large.');chunks.push(chunk);}
 let data;try{data=JSON.parse(Buffer.concat(chunks).toString());}catch{throw Error('Pinterest search returned an invalid response. Try a direct pin link.');}
 const pins=searchPins(data);if(!pins.length)throw Error('No Pinterest images found. Try different search words or a direct pin link.');
 if(pools.size>=100)pools.delete(pools.keys().next().value);
 pools.set(query,{pins,expires:Date.now()+TTL});return pins;
}
export async function randomPinterest(query,scope,{fetcher=fetch,pick=randomInt}={}){
 query=String(query).trim().replace(/\s+/g,' ');if(!query||query.length>150)throw Error('Use !pinterest <search words> (maximum 150 characters).');
 return mediaQueue.run(async()=>{
  const pins=await getPool(query.toLowerCase(),fetcher),key=String(scope)+':'+query.toLowerCase();
  let seen=history.get(key)||[];let available=pins.filter(pin=>!seen.includes(pin.id));
  if(!available.length){const last=seen.at(-1);seen=[];available=pins.filter(pin=>pins.length===1||pin.id!==last);}
  let failure;
  for(let attempt=0;attempt<Math.min(3,pins.length)&&available.length;attempt++){
   const pin=available.splice(pick(available.length),1)[0];
   try{const image=await pinterestImage(pin,fetcher);if(history.size>=256&&!history.has(key))history.delete(history.keys().next().value);history.set(key,[...seen,pin.id].slice(-50));return image;}catch(error){failure=error;}
  }
  throw failure||Error('Pinterest images could not be downloaded. Retry later.');
 });
}
