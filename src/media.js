import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import { imageSize } from 'image-size';
import { Serial } from './util.js';
import { ensureDownloader } from './downloader.js';
import { cookieArgs,publicYoutube,mediaFailure,youtubePause } from './media-access.js';
// Reject while busy instead of building an unbounded, silent media backlog.
export class MediaQueue extends Serial {
 constructor(){super();this.busy=false;}
 run(fn){if(this.busy)return Promise.reject(Error('Media tool is busy. Retry after the current operation finishes.'));this.busy=true;return super.run(fn).finally(()=>{this.busy=false;});}
}
export const mediaQueue=new MediaQueue();
export function run(file,args,{timeout=120000,maxOutput=2000000,maxError=24000}={}){return new Promise((resolve,reject)=>{const p=spawn(file,args,{windowsHide:true,shell:false,stdio:['ignore','pipe','pipe']});let out='',err='',done=false;const timer=setTimeout(()=>{p.kill();finish(Error('Media operation timed out.'));},timeout);const finish=(e)=>{if(done)return;done=true;clearTimeout(timer);e?reject(e):resolve(out);};p.stdout.on('data',b=>{out+=b;if(out.length>maxOutput){p.kill();finish(Error('Media metadata too large.'));}});p.stderr.on('data',b=>{err=(err+b).slice(-maxError);});p.once('error',e=>finish(Object.assign(Error(e.code==='ENOENT'?'Media tool missing on this host: '+path.basename(file)+'.':e.message),{code:e.code})));p.once('close',code=>finish(code===0?null:Error('Media tool could not process this content. '+err)));});}
export async function temp(fn){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'eddine-'));try{return await fn(dir);}finally{await fs.rm(dir,{recursive:true,force:true});}}
export async function convert(buffer,kind){if(buffer.length>25*1024*1024)throw Error('Maximum media size: 25 MB.');return mediaQueue.run(()=>temp(async dir=>{const input=path.join(dir,'input.bin'),output=path.join(dir,kind==='sticker'?'out.webp':kind==='image'?'out.png':'out.wav');await fs.writeFile(input,buffer);const metadata=JSON.parse(await run(ffprobe.path,['-v','error','-show_format','-show_streams','-of','json',input]));const seconds=Number(metadata.format?.duration||0);if(kind==='sticker'&&seconds>10)throw Error('Sticker videos must be 10 seconds or shorter.');if(kind==='wav'&&(!Number.isFinite(seconds)||seconds<=0||seconds>120))throw Error('Voice messages must be 2 minutes or shorter.');const args=kind==='sticker'?['-vf',(seconds>0?'fps=12,':'')+'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000','-c:v','libwebp','-lossless','0','-q:v','70','-loop','0','-an','-t','10']:kind==='image'?['-frames:v','1']:['-vn','-ac','1','-ar','16000','-c:a','pcm_s16le'];if(kind==='sticker'&&seconds===0)args.push('-frames:v','1');await run(ffmpegPath,['-y','-i',input,...args,output]);if((await fs.stat(output)).size===0)throw Error('Media conversion produced no frames.');return {buffer:await fs.readFile(output),seconds};}));}
const platforms={youtube:['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com','youtu.be'],instagram:['instagram.com','www.instagram.com'],tiktok:['tiktok.com','www.tiktok.com','vm.tiktok.com','vt.tiktok.com'],facebook:['facebook.com','www.facebook.com','m.facebook.com','fb.watch'],twitter:['x.com','www.x.com','twitter.com','www.twitter.com'],reddit:['reddit.com','www.reddit.com','old.reddit.com','redd.it'],pinterest:['pinterest.com','www.pinterest.com','pin.it'],vimeo:['vimeo.com','www.vimeo.com'],dailymotion:['dailymotion.com','www.dailymotion.com','dai.ly']};
export function platformUrl(value,kind){let u;try{u=new URL(value);}catch{throw Error('Provide a valid public link.');}if(u.protocol!=='https:'||u.username||u.password||u.port)throw Error('Use a normal HTTPS link.');if(!platforms[kind]?.includes(u.hostname.toLowerCase()))throw Error('The link does not match this platform.');return u.href;}
export function detectPlatform(value){for(const kind of Object.keys(platforms)){try{platformUrl(value,kind);return kind;}catch{}}throw Error('Supported links: YouTube, Instagram, TikTok, Facebook, X/Twitter, Reddit, Pinterest, Vimeo and Dailymotion.');}
export async function resolvePinterest(value,fetcher=fetch){
 let url=platformUrl(value,'pinterest');
 if(new URL(url).hostname!=='pin.it')return url;
 for(let step=0;step<6;step++){
  const u=new URL(url);
  if(!['pin.it','api.pin.it','api.pinterest.com','www.pinterest.com','pinterest.com'].includes(u.hostname)||u.protocol!=='https:'||u.port||u.username||u.password)throw Error('Pinterest short link redirected to an unsupported address. Use the full pinterest.com/pin/... link.');
  const pin=u.pathname.match(/^\/pin\/(?:[\w-]+--)?(\d+)(?:\/|$)/);
  if(['www.pinterest.com','pinterest.com'].includes(u.hostname)&&pin)return 'https://www.pinterest.com/pin/'+pin[1]+'/';
  const response=await fetcher(u.href,{redirect:'manual',signal:AbortSignal.timeout(15000)});
  await response.body?.cancel();
  const location=response.headers.get('location');
  if(![301,302,303,307,308].includes(response.status)||!location)break;
  url=new URL(location,u).href;
 }
 throw Error('Cannot resolve this Pinterest short link. Open it in your browser and copy the full https://www.pinterest.com/pin/... link.');
}
// Pinterest exposes image pins as thumbnails with no video formats.
export async function pinterestImage(info,fetcher=fetch){
 const candidates=[...(info.thumbnails||[]),{url:info.thumbnail}].filter(t=>{
  try{const u=new URL(t.url);return u.protocol==='https:'&&u.hostname==='i.pinimg.com'&&!u.port&&!u.username&&!u.password;}catch{return false;}
 }).sort((a,b)=>(Number(b.width)||0)*(Number(b.height)||0)-(Number(a.width)||0)*(Number(a.height)||0));
 if(!candidates.length)throw Error('Pinterest returned no downloadable video or image. Owner: try .updatemedia nightly.');
 const response=await fetcher(candidates[0].url,{redirect:'error',signal:AbortSignal.timeout(20000)});
 if(!response.ok||!response.body)throw Error('Cannot download the Pinterest image. Try another public pin.');
 const limit=25*1024*1024;
 if(Number(response.headers.get('content-length'))>limit){await response.body.cancel();throw Error('Pinterest image exceeds 25 MB.');}
 const chunks=[];let size=0;
 for await(const chunk of response.body){size+=chunk.length;if(size>limit)throw Error('Pinterest image exceeds 25 MB.');chunks.push(chunk);}
 const buffer=Buffer.concat(chunks);let dimensions;
 try{dimensions=imageSize(buffer);}catch{throw Error('Pinterest returned an invalid image.');}
 if(!['jpg','png','webp','gif'].includes(dimensions.type)||dimensions.width*dimensions.height>8000000)throw Error('Unsupported Pinterest image or image exceeds 8 million pixels.');
 return {buffer,type:'image',title:String(info.title||'Pinterest image').slice(0,100)};
}
export async function download(root,query,kind,{search=false,audio=kind==='youtube',consume}={}){return mediaQueue.run(()=>temp(async dir=>{await youtubePause(kind);const executable=await ensureDownloader(root);const cookies=await cookieArgs(root,dir,kind);const target=search?'ytsearch1:'+query.slice(0,200):kind==='pinterest'?await resolvePinterest(query):platformUrl(query,kind);const common=['--ignore-config','--no-playlist','--no-cache-dir','--socket-timeout','15','--retries','2','--fragment-retries','2','--concurrent-fragments','1','--js-runtimes','node:'+process.execPath,'--remote-components','ejs:github',...cookies];let info;try{info=JSON.parse(await run(executable,[...common,'--dump-single-json','--skip-download',...(kind==='pinterest'?['--ignore-no-formats-error']:[]),target],{timeout:60000}));}catch(e){console.error('[Media metadata]',e.message);throw Error(mediaFailure(e,cookies.length>0,kind));}if(info.entries)info=info.entries[0];if(!info)throw Error('No media found.');if(kind==='pinterest'&&!info.formats?.length&&!info.url)return consume?consume(await pinterestImage(info)):pinterestImage(info);if(kind==='youtube')publicYoutube(info);const duration=Number(info.duration);if(kind==='youtube'&&(!Number.isFinite(duration)||duration<=0||duration>480))throw Error('YouTube limit: 8 minutes. Live streams are unsupported.');if(info.is_live)throw Error('Live streams are unsupported.');const destination=path.join(dir,'download.%(ext)s');const args=[...common,'--max-filesize',audio?'10M':'25M','--ffmpeg-location',path.dirname(ffmpegPath),'-o',destination];if(audio)args.push('-f','bestaudio[abr<=?128]/bestaudio','-x','--audio-format','mp3','--audio-quality','128K','--postprocessor-args','ffmpeg_i:-threads 1','--postprocessor-args','ffmpeg_o:-threads 1');else args.push('-f',kind==='pinterest'?'best*[height<=?720]/best*':'bestvideo[ext=mp4][height<=480]+bestaudio[ext=m4a]/best[ext=mp4][height<=720]/best[height<=720]/bestvideo*+bestaudio/best*','--merge-output-format','mkv');args.push(info.webpage_url||target);try{await run(executable,args,{timeout:180000});}catch(e){console.error('[Media download]',e.message);throw Error(mediaFailure(e,cookies.length>0,kind));}const files=(await fs.readdir(dir)).filter(f=>f.startsWith('download.')&&!/\.(part|ytdl|json)$/.test(f));const f=files.find(x=>x.endsWith(audio?'.mp3':'.mp4'))||files[0];if(!f)throw Error('Download produced no media.');let file=path.join(dir,f);if((await fs.stat(file)).size>25*1024*1024)throw Error('Downloaded file exceeds 25 MB.');if(!audio&&!f.endsWith('.mp4')){const mp4=path.join(dir,'converted.mp4');await run(ffmpegPath,['-y','-i',file,'-c:v','libx264','-preset','veryfast','-threads','1','-c:a','aac','-movflags','+faststart',mp4]);file=mp4;}if((await fs.stat(file)).size>(audio?10:25)*1024*1024)throw Error('Downloaded file exceeds '+(audio?10:25)+' MB.');const result={file,title:String(info.title||'Downloaded media').slice(0,100),duration};return consume?await consume(result):{buffer:await fs.readFile(file),title:result.title,duration};}));}

export async function pcmToOpus(buffer,rate=24000){
 if(!Buffer.isBuffer(buffer)||!buffer.length||buffer.length>25*1024*1024||buffer.length%2||![16000,22050,24000,44100,48000].includes(rate))throw Error('Invalid generated voice data.');
 return mediaQueue.run(()=>temp(async dir=>{const input=path.join(dir,'voice.pcm'),output=path.join(dir,'voice.ogg');await fs.writeFile(input,buffer);await run(ffmpegPath,['-y','-f','s16le','-ar',String(rate),'-ac','1','-i',input,'-c:a','libopus','-b:a','32k','-t','180',output]);return fs.readFile(output);}));
}

export async function updateMedia(root,channel='stable'){if(!['stable','nightly'].includes(channel))throw Error('Choose stable or nightly.');return mediaQueue.run(async()=>{const executable=await ensureDownloader(root);await run(executable,['--ignore-config','--update-to',channel],{timeout:180000});return (await run(executable,['--version'],{timeout:15000})).trim();});}
