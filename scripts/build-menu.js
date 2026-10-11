import fs from 'node:fs/promises';
import {createCanvas,GlobalFonts} from '@napi-rs/canvas';
import {fileURLToPath} from 'node:url';
GlobalFonts.registerFromPath(fileURLToPath(new URL('../assets/fonts/DejaVuSans.ttf',import.meta.url)),'EddineMenu');

const labels={en:['GENERAL','GROUP','MEDIA','TOOLS','ACCOUNT','ECONOMY','REACTIONS','HOST','FUN'],ar:['الأساسيات','المجموعة','الوسائط','الأدوات','الحساب','الاقتصاد','التفاعلات','الهوست','الترفيه']};
for(const language of ['en','ar']){
 const canvas=createCanvas(1280,720),ctx=canvas.getContext('2d'),ar=language==='ar';
 const bg=ctx.createLinearGradient(0,0,1280,720);bg.addColorStop(0,'#081820');bg.addColorStop(1,'#163e40');ctx.fillStyle=bg;ctx.fillRect(0,0,1280,720);
 ctx.strokeStyle='#ffffff0d';for(let radius=70;radius<650;radius+=70){ctx.beginPath();ctx.arc(1180,80,radius,0,Math.PI*2);ctx.stroke();}
 ctx.fillStyle='#69e3c5';ctx.font='bold 25px EddineMenu';ctx.fillText('SALAH EDDINE / WHATSAPP BOT',68,66);
 ctx.fillStyle='#ecfffc';ctx.font='bold 76px EddineMenu';ctx.fillText('EDDINE-MD',68,165);
 ctx.fillStyle='#b2caca';ctx.font='28px EddineMenu';ctx.textAlign=ar?'right':'left';ctx.fillText(ar?'الأوامر ديالك، مرتبة وواضحة.':'Your commands, clearly organized.',ar?1212:68,216);
 for(let i=0;i<labels[language].length;i++){
  const x=68+(i%3)*388,y=260+Math.floor(i/3)*113;
  ctx.fillStyle='#ffffff0b';ctx.beginPath();ctx.roundRect(x,y,364,95,17);ctx.fill();
  ctx.textAlign='left';ctx.fillStyle='#69e3c5';ctx.font='bold 18px EddineMenu';ctx.fillText(String(i+1).padStart(2,'0'),x+20,y+29);
  ctx.fillStyle='#ecfffc';ctx.font='bold 25px EddineMenu';ctx.textAlign=ar?'right':'left';ctx.fillText(labels[language][i],ar?x+344:x+20,y+70);
 }
 ctx.textAlign=ar?'right':'left';ctx.fillStyle='#b2caca';ctx.font='23px EddineMenu';ctx.fillText(ar?'اوامر مجموعة  •  مساعدة اسم_الأمر':'menu group  •  help <command>',ar?1212:68,656);
 await fs.writeFile(new URL('../assets/menu-'+language+'.jpg',import.meta.url),canvas.toBuffer('image/jpeg'));
}
