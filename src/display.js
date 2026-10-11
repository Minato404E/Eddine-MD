// Unicode presentation only. Machine values and copy payloads retain their bytes.
export function fancy(value){return [...String(value)].map(char=>{const code=char.codePointAt(0);return code>=65&&code<=90?String.fromCodePoint(0x1d5d4+code-65):code>=97&&code<=122?String.fromCodePoint(0x1d5ee+code-97):char;}).join('');}
export function styleText(value){
 const text=String(value??'');
 const protectedParts=/(```[\s\S]*?```|`[^`\n]*`|https?:\/\/[^\s<>*]+|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\d+@(?:s\.whatsapp\.net|lid|g\.us)|\b[A-Za-z0-9+/=_-]{24,}\b|\b(?:on|off|confirm|start|stop|done|cancel|open|close|stable|nightly)\b)/gi;
 return text.split(protectedParts).map((part,index)=>index%2?part:fancy(part)).join('').split('\n').map(line=>/[\u0600-\u06ff]/.test(line)&&!line.includes('*')&&!line.includes('`')?'*'+line+'*':line).join('\n');
}
export const DEVELOPER={name:'Salah Eddine',country:'Morocco / المغرب 🇲🇦',phone:'212631998828',email:'salahpmn311@gmail.com',github:'https://github.com/Minato404E',repository:'https://github.com/Minato404E/Eddine-MD'};
export function developerText(botNumber,ar=false){const d=DEVELOPER;return [
 '╭─〔 '+(ar?'المطور':'DEVELOPER')+' 〕',
 '│ '+d.name,
 '│ '+(ar?'البلد':'COUNTRY')+' · '+(ar?'المغرب 🇲🇦':'Morocco 🇲🇦'),
 '╰────────────────',
 '',
 (ar?'☎ التواصل':'☎ CONTACT')+'\n+'+d.phone,
 'WhatsApp\nhttps://wa.me/'+d.phone,
 (ar?'✉ البريد':'✉ EMAIL')+'\n'+d.email,
 (ar?'◈ رقم هذا البوت':'◈ THIS BOT')+'\n+'+botNumber+'\nhttps://wa.me/'+botNumber,
 'GitHub\n'+d.github,
 (ar?'⌘ سورس البوت':'⌘ BOT SOURCE')+'\n'+d.repository,
 '',
 '_EDDINE-MD • Salah Eddine_'
 ].join('\n');}

export function copyButtons(items){return items.slice(0,3).map((item,index)=>({name:'cta_copy',buttonParamsJson:JSON.stringify({display_text:styleText(item.label||'Copy'),id:'copy-'+index,copy_code:String(item.value)})}));}
