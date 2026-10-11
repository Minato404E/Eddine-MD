import { createCanvas } from '@napi-rs/canvas';
const palette={bg:'#0c1020',panel:'#171d33',accent:'#8cf4cf',muted:'#a6b1cb',white:'#f4f7ff'};
export function card(title,name,rows,footer='EDDINE-MD • SALAH EDDINE',kind='standard'){
 const width=1000,height=Math.max(600,240+rows.length*70);const canvas=createCanvas(width,height),c=canvas.getContext('2d');
 const gradient=c.createLinearGradient(0,0,width,height);gradient.addColorStop(0,'#0c1020');gradient.addColorStop(1,'#1e3253');c.fillStyle=gradient;c.fillRect(0,0,width,height);
 c.fillStyle='#ffffff07';for(let i=0;i<12;i++){c.beginPath();c.arc(850+i*10,60+i*5,50+i*20,0,Math.PI*2);c.strokeStyle='#8cf4cf12';c.stroke();}
 c.fillStyle=palette.accent;c.font='bold 23px sans-serif';c.fillText(kind==='bank'?'EDDINE BANK • VIRTUAL COINS':'EDDINE-MD',55,65);
 c.fillStyle=palette.white;c.font='bold 44px sans-serif';fit(c,title,55,125,890,44);c.fillStyle=palette.muted;c.font='27px sans-serif';fit(c,name,55,175,890,27);
 let y=230;for(const [label,value] of rows){c.fillStyle=palette.panel;c.beginPath();c.roundRect(45,y-35,910,60,12);c.fill();c.fillStyle=palette.muted;c.font='23px sans-serif';fit(c,label,65,y+3,360,23);c.fillStyle=palette.white;c.font='bold 26px sans-serif';c.textAlign='right';fit(c,String(value),925,y+3,520,26);c.textAlign='left';y+=70;}
 c.fillStyle=palette.accent;c.font='20px sans-serif';fit(c,footer,55,height-40,890,20);return canvas.toBuffer('image/png');
}
function fit(c,text,x,y,width,size){text=String(text).replace(/[\r\n]/g,' ');while(c.measureText(text).width>width&&size>14){size--;c.font=c.font.replace(/\d+px/,size+'px');}if(c.measureText(text).width>width){while(text.length&&c.measureText(text+'…').width>width)text=text.slice(0,-1);text+='…';}c.fillText(text,x,y);}
export const balanceCard=u=>card('Your balance',u.name,[['Wallet',u.wallet.toLocaleString()+' coins'],['Bank',u.bank.toLocaleString()+' coins'],['Total',(u.wallet+u.bank).toLocaleString()+' coins']]);
export const bankCard=(u,prefix='.')=>card('Bank account',u.name,[['Bank balance',u.bank.toLocaleString()+' coins'],['Wallet balance',u.wallet.toLocaleString()+' coins'],['Deposit',prefix+'deposit <amount>'],['Withdraw',prefix+'withdraw <amount>']], 'VIRTUAL CURRENCY • NOT REAL MONEY', 'bank');
