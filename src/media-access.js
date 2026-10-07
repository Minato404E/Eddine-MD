import fs from 'node:fs/promises';
import path from 'node:path';
export function youtubeCookies(text){
 text=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
 if(!/^# (?:Netscape HTTP Cookie File|HTTP Cookie File)(?:\n|$)/.test(text))throw Error('YouTube cookies must use Netscape cookies.txt format.');
 const lines=text.split('\n').filter(line=>line&&(!line.startsWith('#')||line.startsWith('#HttpOnly_')));let count=0;
 for(const line of lines){const fields=line.replace(/^#HttpOnly_/,'').split('\t');if(fields.length!==7)throw Error('Invalid YouTube cookie row. Export again in Netscape format.');const host=fields[0].replace(/^\./,'').toLowerCase();if(!(host==='youtube.com'||host.endsWith('.youtube.com')))throw Error('Export only youtube.com cookies, not cookies from all browser sites.');count++;}
 if(!count)throw Error('YouTube cookie file has no youtube.com cookies.');return text;
}
export async function cookieArgs(root,dir,kind){
 if(kind!=='youtube')return [];
 const file=path.join(root,'data','youtube-cookies.txt');let text;
 try{const stat=await fs.stat(file);if(stat.size>1024*1024)throw Error('YouTube cookies file exceeds 1 MB.');text=await fs.readFile(file,'utf8');}catch(e){if(e.code==='ENOENT')return [];throw e;}
 const copy=path.join(dir,'youtube-cookies.txt');await fs.writeFile(copy,youtubeCookies(text),{mode:0o600});return ['--cookies',copy];
}
export function publicYoutube(info){
 if(Number(info.age_limit)>0||['private','premium_only','subscriber_only','needs_auth'].includes(info.availability))throw Error('Only public, unrestricted YouTube videos are supported.');
}
export function mediaFailure(error,authenticated=false,kind='youtube'){
 if(/timed out/i.test(error.message))return 'Media operation timed out. Retry with a shorter public video.';
 if(error.code==='ENOENT')return 'Media tool missing. Owner: run node scripts/update-media.js on the host.';
 if(/challenge solving failed|challenge solver|page needs to be reloaded/i.test(error.message))return 'YouTube JavaScript challenge failed. Host owner: run .updatemedia nightly, retry once and check all warnings in the hosting console if it still fails.';
 if(kind!=='youtube'&&/login required|sign in|private|not available|unsupported url/i.test(error.message))return 'This media is private, unavailable or requires a platform login. Try a public link.';
 if(/confirm.*not a bot|sign in|login required|cookies for the authentication/i.test(error.message))return authenticated?'YouTube rejected this session. Owner: refresh data/youtube-cookies.txt; if it persists, this host may need a PO Token provider.':'YouTube requires authentication from this host. Owner: add secondary-account YouTube cookies to data/youtube-cookies.txt. See YOUTUBE-SETUP.md.';
 return 'Cannot download this media. Try another public link. Owner: check the hosting console for the downloader error.';
}
let nextYoutube=0;
export async function youtubePause(kind){if(kind!=='youtube')return;const delay=Math.max(0,nextYoutube-Date.now());if(delay)await new Promise(resolve=>setTimeout(resolve,delay));nextYoutube=Date.now()+10000;}
