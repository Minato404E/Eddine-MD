import {styleText} from './display.js';
import {uptimeLabel} from './bio.js';
import {extraArabic} from './extra-commands.js';
export const arabicNames={
 menu:'القائمة',help:'مساعدة',info:'معلومات',ping:'بينغ',alive:'حي',owner:'المالك',dev:'المطور',jid:'معرف',
 public:'عام',self:'خاص',setname:'تغيير_الاسم',setprefix:'تغيير_البادئة',setimage:'تغيير_الصورة',youtube:'يوتيوب',autoreply:'رد_تلقائي',sudo:'سودو',pair:'ربط',unpair:'فك_الربط',settings:'إعدادات',mystyle:'أسلوبي',autobio:'بايو_تلقائي',
 add:'إضافة',kick:'طرد',mute:'كتم',unmute:'إلغاء_الكتم',avatar:'صورته',promote:'ترقية',demote:'خفض',tagall:'منشن',hidetag:'منشن_مخفي',open:'فتح',close:'إغلاق',lock:'قفل',unlock:'فك_القفل',groupinfo:'معلومات_المجموعة',admins:'المشرفون',grouplink:'رابط_المجموعة',resetlink:'تجديد_الرابط',setsubject:'اسم_المجموعة',setdesc:'وصف_المجموعة',delete:'حذف',warn:'تحذير',unwarn:'إلغاء_تحذير',warnings:'تحذيرات',antilink:'منع_الروابط',antispam:'منع_السبام',welcome:'ترحيب',goodbye:'وداع',setwelcome:'رسالة_الترحيب',setgoodbye:'رسالة_الوداع',aigroup:'ذكاء_المجموعة',adminshop:'متجر_الإدارة',activity:'نشاط',
 register:'تسجيل',profile:'بروفايل',balance:'رصيد',daily:'يومي',job:'وظيفة',jobs:'وظائف',work:'عمل',shop:'متجر',buy:'شراء',inventory:'حقيبة',use:'استعمال',bank:'بنك',deposit:'إيداع',withdraw:'سحب',pay:'تحويل',rob:'سرقة',rich:'الأغنياء',
 hug:'حضن',slap:'صفعة',punch:'لكمة',kickgif:'ركلة',marry:'زواج',kiss:'قبلة',pat:'تربيت',cuddle:'عناق',handhold:'مسك_اليد',highfive:'كف',poke:'نكزة',bite:'عضة',bonk:'ضربة',feed:'إطعام',tickle:'دغدغة',wave:'تلويح',wink:'غمزة',dance:'رقص',cry:'بكاء',laugh:'ضحك',smile:'ابتسامة',blush:'خجل',facepalm:'يا_لطيف',happy:'فرح',handshake:'مصافحة',carry:'حمل',
 mines:'حقوق',mix:'دمج_إيموجي',csticker:'ملصق_نص',sround:'ملصق_دائري',remini:'تحسين',wanted:'مطلوب',jail:'سجن',rip:'قبر',sketch:'رسم',qr:'رمز',readqr:'قراءة_رمز',topdf:'إلى_بي_دي_إف',frompdf:'صور_بي_دي_إف',zip:'ضغط_ملفات',unzip:'فك_ضغط',compress:'تقليل_الحجم',tomp3:'إلى_صوت',tovn:'إلى_فويس',trim:'قص',speed:'سرعة',merge:'دمج',gif:'متحرك',reverse:'عكس',ocr:'قراءة_نص',sticker:'ملصق',toimg:'إلى_صورة',instagram:'إنستغرام',tiktok:'تيكتوك',facebook:'فيسبوك',twitter:'تويتر',reddit:'ريديت',pinterest:'بينترست',vimeo:'فيميو',dailymotion:'ديليموشن',play:'أغنية',ytmp3:'صوت_يوتيوب',ytmp4:'فيديو_يوتيوب',download:'تحميل',
 createimage:'إنشاء_صورة',send:'إرسال',ai:'ذكاء',forget:'نسيان',translate:'ترجمة',tts:'نطق',calc:'حساب',weather:'طقس',remind:'تذكير',reminders:'تذكيرات',delremind:'حذف_تذكير',poll:'تصويت',
 sessions:'حسابات',stopbot:'إيقاف_البوت',startbot:'تشغيل_البوت',blockbot:'حظر_البوت',unblockbot:'فك_حظر_البوت',backup:'نسخة_احتياطية',update:'تحديث',updatemedia:'تحديث_التحميل',kickall:'طرد_الكل',bankaction:'عملية_البنك'
};
Object.assign(arabicNames,extraArabic);
const normalize=value=>String(value||'').normalize('NFKC').replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').toLowerCase();
const aliases=new Map(Object.entries(arabicNames).map(([en,ar])=>[normalize(ar),en]));for(const name of ['اوامر','الأوامر','اوامر*'])aliases.set(normalize(name),'menu');const extraAliases={فك_كتم:'unmute',انذار:'warn',انذاراتي:'warnings',الانذارات:'allwarnings',الريكوستات:'requests',الطلبات:'requests',اقبل_ريكوستات:'accept',رفع:'promote',خفض:'demote',ضيف:'add',دعوه:'grouplink',رابط:'grouplink',لينك:'grouplink',جروب:'groupinfo',معلومات_الجروب:'groupinfo',جروب_اسم:'setsubject',جروب_وصف:'setdesc',فتح_الجروب:'open',قفل_الجروب:'close',منشنز:'tagall',مخفي:'hidetag',مضاد_روابط:'antilink',استخراج_نص:'ocr',انستا:'instagram',انستغرام:'instagram',تحميل_انستغرام:'instagram',تنزيل:'download',انشئ_صورة:'createimage',توليد_صورة:'createimage',جيميناي:'ai',جيمناي:'ai',بوت:'ai',اغنيه:'play',اغنية:'play',كشف:'vp',اوامر:'menu'};for(const [name,cmd]of Object.entries(extraAliases))aliases.set(normalize(name),cmd);
export function resolveCommand(value){return aliases.get(normalize(value))||normalize(value);}
export function commandLabel(command,prefix='.'){return prefix+command+' · '+prefix+arabicNames[command];}
export const categoryNames={General:'◈ الأساسيات / General',Account:'⚙ الحساب / Account',Group:'♜ إدارة المجموعة / Group',Economy:'◇ الاقتصاد / Economy',Reactions:'♡ التفاعلات / Reactions',Media:'▶ الوسائط / Media',Tools:'✦ الأدوات / Tools',Host:'⌘ إدارة الهوست / Host'};
export const menuUsage={mute:'@عضو أو reply — حذف رسائله حتى إلغاء الكتم',unmute:'@عضو أو reply — السماح بالرسائل',avatar:'@عضو أو reply — صورة واتساب',profile:'@عضو أو reply للصورة؛ بدون هدف لبطاقة اللاعب',add:'رقم دولي — إضافة أو إرسال دعوة',antilink:'on / off — منع جميع الروابط',help:'اسم الأمر — طريقة الاستعمال',setprefix:'! — تغيير البادئة',download:'رابط — تحميل الوسائط',pinterest:'رابط أو كلمات بحث',register:'الاسم — تسجيل لاعب',update:'تحديث ملفات البوت من GitHub'};
function makeMenuText(categories,c,s){
 const ar=c.language==='ar',selector=String(c.arg||'').normalize('NFKC').trim().toLowerCase();
 const sections={General:['◈','GENERAL','الأساسيات','عام'],Account:['⚙','ACCOUNT','الحساب','حساب'],Group:['🛡','GROUP','المجموعة','مجموعة'],Economy:['◇','ECONOMY','الاقتصاد','اقتصاد'],Reactions:['♡','REACTIONS','التفاعلات','تفاعلات'],Media:['↓','MEDIA','الوسائط','وسائط'],Tools:['✦','TOOLS','الأدوات','أدوات'],Host:['⌘','HOST OWNER','مالك الهوست','هوست'],Fun:['☀','FUN','الترفيه','ترفيه']};
 const names={عام:'General',الأساسيات:'General',حساب:'Account',الحساب:'Account',مجموعة:'Group',المجموعة:'Group',اقتصاد:'Economy',الاقتصاد:'Economy',تفاعلات:'Reactions',التفاعلات:'Reactions',وسائط:'Media',الوسائط:'Media',أدوات:'Tools',الادوات:'Tools',الأدوات:'Tools',هوست:'Host',الهوست:'Host',ترفيه:'Fun'};
 const chosen=names[selector]||Object.keys(categories).find(k=>k.toLowerCase()===selector);
 if(chosen==='Host'&&!c.host)throw Error('Main host owner only.');
 if(selector&&!chosen&&!['all','الكل'].includes(selector))throw Error('Use '+c.prefix+(ar?'اوامر مجموعة | وسائط | أدوات | الكل':'menu group | media | tools | all'));
 const allowed=Object.entries(categories).filter(([k])=>k!=='Host'||c.host),count=allowed.reduce((n,[,list])=>n+list.length,0),menu=c.prefix+(ar?'اوامر':'menu');
 const name=c.m?.pushName||s.users?.[c.uid]?.name||(ar?'صديقنا':'friend');
 const uptime=uptimeLabel(c.e?.onlineSince?Date.now()-c.e.onlineSince:process.uptime()*1000);
 const header='╭──〔 ✦ EDDINE-MD ✦ 〕\n│ '+(ar?'مرحباً':'WELCOME')+' · '+name+'\n│ '+(ar?'الاسم':'NAME')+' · '+s.config.name+'\n│ '+(ar?'البادئة':'PREFIX')+' · '+c.prefix+'  ⌁  '+(ar?(s.config.public?'عام':'خاص'):(s.config.public?'PUBLIC':'SELF'))+'\n│ '+(ar?'وقت التشغيل':'UPTIME')+' · '+uptime+'\n│ '+(ar?'رام البوت':'BOT RAM')+' · '+Math.round(process.memoryUsage().rss/1024/1024)+' MB\n╰────────────────';
 const title=key=>{const section=sections[key]||['◈',key,key,key];return '╭─〔 '+section[0]+' '+section[ar?2:1]+' 〕';};
 const footer='\n\n'+(ar?'طريقة استعمال أي أمر:':'COMMAND HELP')+'\n'+c.prefix+(ar?'مساعدة اسم_الأمر':'help <command>')+'\n\n_Salah Eddine_';
 if(!selector)return header+'\n'+(ar?count+' أمر  ·  '+allowed.length+' أقسام':count+' COMMANDS  ·  '+allowed.length+' CATEGORIES')+'\n━━━━━━━━━━━━\n\n'+allowed.map(([key,list])=>title(key)+'  ·  '+list.length+'\n╰➤ '+menu+' '+(ar?sections[key]?.[3]:key.toLowerCase())).join('\n\n')+'\n\n'+(ar?'اللائحة الكاملة':'FULL COMMAND LIST')+'\n'+menu+' '+(ar?'الكل':'all')+footer;
 const selected=chosen?allowed.filter(([key])=>key===chosen):allowed;
 const lists=selected.map(([key,list])=>{const rows=[];for(let i=0;i<list.length;i+=3)rows.push(list.slice(i,i+3).map(cmd=>c.prefix+(ar?arabicNames[cmd]:cmd)).join('  ·  '));return title(key)+'  ·  '+list.length+'\n\n'+rows.join('\n');});
 return header+'\n━━━━━━━━━━━━\n\n'+lists.join('\n\n━━━━━━━━━━━━\n\n')+'\n\n'+(ar?'رجوع للأقسام: ':'BACK TO CATEGORIES: ')+menu+footer;
}

export function menuText(categories,c,s){return styleText(makeMenuText(categories,c,s));}
