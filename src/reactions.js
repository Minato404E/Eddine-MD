import fs from 'node:fs/promises';
import path from 'node:path';
export const reactions={
 hug:['hug','hugged'],slap:['slap','slapped'],punch:['punch','punched'],kickgif:['kick','kicked'],marry:['kiss','married'],kiss:['kiss','kissed'],pat:['pat','patted'],cuddle:['cuddle','cuddled'],handhold:['handhold','held hands with'],highfive:['highfive','high-fived'],poke:['poke','poked'],bite:['bite','bit'],bonk:['bonk','bonked'],feed:['feed','fed'],tickle:['tickle','tickled'],wave:['wave','waved at'],wink:['wink','winked at'],dance:['dance','danced with'],cry:['cry','cried with'],laugh:['laugh','laughed with'],smile:['smile','smiled at'],blush:['blush','blushed at'],facepalm:['facepalm','facepalmed at'],happy:['happy','is happy with'],handshake:['handshake','shook hands with'],carry:['carry','carried']
};
const targeted=new Set(['hug','slap','punch','kickgif','marry','kiss','pat','cuddle','handhold','highfive','poke','bite','bonk','feed','tickle','handshake','carry']);
export function requiresTarget(command){return targeted.has(command);}
const solo={wave:'waved',wink:'winked',dance:'danced',cry:'cried',laugh:'laughed',smile:'smiled',blush:'blushed',facepalm:'facepalmed',happy:'is happy'};
export function reactionCaption(command,sender,target,{named=false}={}){const item=reactions[command];if(!item)throw Error('Unknown reaction.');const prefix=named?'':'@';return prefix+sender+' '+(target?item[1]+' '+prefix+target:(solo[command]||item[1]))+'.';}
export async function reactionVideo(root,command,{random=Math.random}={}){
 if(!reactions[command])throw Error('Unknown reaction.');
 const dir=path.join(root,'assets','reactions');const files=(await fs.readdir(dir)).filter(f=>f.startsWith(command+'-')&&f.endsWith('.mp4')).sort();
 if(!files.length)throw Error('Reaction GIF missing. Upload assets/reactions from the new ZIP.');
 const file=files[Math.min(files.length-1,Math.floor(random()*files.length))];return fs.readFile(path.join(dir,file));
}
