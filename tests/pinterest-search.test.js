import test from 'node:test';import assert from 'node:assert/strict';
import {randomPinterest,searchPins} from '../src/pinterest.js';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0ioAAAAASUVORK5CYII=','base64');
const data={resource_response:{data:{results:[1,2,3].map(id=>({type:'pin',id:String(id),grid_title:'Dexter '+id,images:{orig:{url:'https://i.pinimg.com/'+id+'.png',width:1,height:1}}}))}}};
test('Pinterest search cycles images without repeats, isolates chat history and caches results',async()=>{
 let searches=0;const fetcher=async url=>{if(url.includes('BaseSearchResource')){searches++;const u=new URL(url),options=JSON.parse(u.searchParams.get('data')).options;assert.equal(options.query,'dexter morgan');return new Response(JSON.stringify(data));}return new Response(png);};
 const options={fetcher,pick:()=>0};const titles=[];
 for(let i=0;i<4;i++)titles.push((await randomPinterest('Dexter Morgan','chat-a',options)).title);
 assert.equal(new Set(titles.slice(0,3)).size,3);assert.notEqual(titles[2],titles[3]);assert.equal(searches,1);
 assert.equal((await randomPinterest('Dexter Morgan','chat-b',options)).title,titles[0]);assert.equal(searches,1);
});
test('Pinterest search ignores non-pins and unsafe CDN URLs and reports empty search',async()=>{
 const unsafe=structuredClone(data);unsafe.resource_response.data.results[0].images.orig.url='https://127.0.0.1/x';unsafe.resource_response.data.results[1].type='user';assert.equal(searchPins(unsafe).length,1);
 await assert.rejects(randomPinterest('missing fixture','chat',{fetcher:async()=>new Response(JSON.stringify({resource_response:{data:{results:[]}}}))}),/No Pinterest images/);
 await assert.rejects(randomPinterest('x'.repeat(151),'chat'),/150/);
});
