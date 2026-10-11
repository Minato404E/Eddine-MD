import fs from 'node:fs/promises';
import path from 'node:path';
import { createCanvas,loadImage } from '@napi-rs/canvas';
export async function themed(buffer,store,account,key){const file=store.get(account)?.config.images[key];if(!file||file==='menu.jpg')return buffer;try{const base=await loadImage(buffer),photo=await loadImage(await fs.readFile(path.join(store.root,'images',account,path.basename(file))));const canvas=createCanvas(base.width,base.height),c=canvas.getContext('2d');c.drawImage(base,0,0);c.save();c.beginPath();c.roundRect(base.width-300,20,270,170,18);c.clip();c.globalAlpha=0.3;c.drawImage(photo,base.width-300,20,270,170);c.restore();return canvas.toBuffer('image/png');}catch{return buffer;}}
