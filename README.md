<div align="center">

# ✦ EDDINE-MD ✦

### Your WhatsApp. More possibilities.
### واتسابك، بإمكانيات أكثر

**Multi-account WhatsApp bot · بوت واتساب متعدد الحسابات**

`v2.1.0` · `187 commands` · `26 anime reactions` · `10 active accounts`

**Project owner & developer: Salah Eddine**  
**مالك المشروع والمطوّر: صلاح الدين**

[English guide](#english-guide) · [الدليل العربي](#arabic-guide) · [Commands / الأوامر](#command-reference) · [Local tools / الأدوات المحلية](#local-tools)

</div>

---

> **Release / الإصدار:** v2.0.0 includes the 24 approved local-tool additions. / يشمل v2.0.0 الإضافات المحلية الـ24 المتفق عليها.

## ✨ At a glance / نظرة سريعة

| Feature | English | العربية |
|---|---|---|
| Accounts | Up to 10 active linked accounts with separate account settings and data. | حتى 10 حسابات مرتبطة ونشطة، بإعدادات وبيانات مستقلة لكل حساب. |
| Moderation | Member management, warnings, anti-link, anti-spam and welcome messages. | إدارة الأعضاء والإنذارات ومنع الروابط والسبام ورسائل الترحيب. |
| Economy | Virtual coins, jobs, shop, inventory, bank and leaderboards. | عملات افتراضية ومهن ومتجر ومخزون وبنك وترتيب اللاعبين. |
| Anime GIFs | 26 actions with 52 bundled animated clips, mentions and names where available. | 26 حركة مع 52 مقطع أنمي، ومنشن وأسماء عند توفرها. |
| Downloads | YouTube audio/video and public video links from supported platforms. | صوت وفيديو يوتيوب وروابط فيديو عامة من المنصات المدعومة. |
| AI & voice | Gemini or OpenAI, conversation memory, translation and voice tools. | Gemini أو OpenAI، مع ذاكرة محادثة وترجمة وأدوات صوتية. |
| Owner style | Optional approximation of the owner's writing style from new outgoing messages. | تقريب اختياري لأسلوب كتابة المالك من رسائله الجديدة. |
| Image generation | Text-to-image using the configured AI provider and an eligible API key. | إنشاء صورة من وصف عبر المزوّد المهيّأ ومفتاح API يدعم الصور. |
| Progress | ⏳ working → ✅ sent successfully; ❌ on failure. | ⏳ قيد العمل ← ✅ أُرسلت النتيجة؛ ❌ عند الفشل. |
| Storage | SQLite persistence, account snapshots and a browser management panel. | حفظ دائم في SQLite ونسخ بيانات للحسابات ولوحة إدارة عبر المتصفح. |

<a id="english-guide"></a>

## 🇬🇧 English guide

### 1. Requirements

- Node.js **22.13+ within the 22 series**, or **24+**, matching the package engine range. The latest full validation used Node.js **24.19.0**.
- npm, writable persistent storage and a WhatsApp account that can link a device by pairing code.
- Network access to WhatsApp, npm, GitHub for downloader installation/updates, and any media or AI services you enable.
- Media features use FFmpeg/FFprobe installed by the project's dependencies. AI features require a separately configured API key.

A 256 MB host should process heavy media work one operation at a time. Memory requirements vary with the input and the number of connected accounts; fitting all 10 accounts on such a host is not guaranteed.

### 2. Install on a Node.js host

1. Extract the supplied project ZIP into the server directory. `index.js`, `package.json`, `package-lock.json` and `src/` must be at its root.
2. Select a supported Node.js runtime in your hosting panel.
3. Install dependencies on that host:

```bash
npm ci --no-audit --no-fund
```

4. Configure your owner number with `npm run setup`, or set the host environment variable `OWNER_NUMBER`. Keep your existing `data/` and configuration when upgrading.
5. Set the startup file to **`index.js`**, then start:

```bash
npm start
```

If your host requires a single install/start command:

```bash
npm ci --no-audit --no-fund && node index.js
```

Do not upload Windows `node_modules` to a Linux host. If install scripts are blocked, ask the host to allow the required media dependencies to install.

### 3. Install on Windows

Extract the project into a permanent folder, such as `C:\Eddine-MD`, and install a supported Node.js version. Use the supplied scripts:

| File | Purpose |
|---|---|
| `setup.bat` | Install dependencies and ask for your own owner number. |
| `start.bat` | Start the background supervisor. |
| `start-console.bat` | Start in a visible console for troubleshooting. |
| `panel.bat` | Open the local management panel. |
| `stop.bat` | Save and stop the running bot sessions. |
| `enable-startup.bat` | Enable startup when you sign in to Windows. |
| `disable-startup.bat` | Disable that login startup. |
| `update-media.bat` | Update the media downloader. |

Run only one instance against a given `data/` folder. Windows startup happens when you **sign in**, not simply when the computer receives power.

### 4. Open the panel and pair an account

The panel address is configured in `panel.config.json`. The public package includes a local-only configuration example; set `bind`, `port` and `publicUrl` to match your own allocation. Local-only example:

```json
{
  "bind": "127.0.0.1",
  "port": 8787,
  "publicUrl": "http://127.0.0.1:8787"
}
```

Open the configured URL, read **`data/panel-token.txt`** privately, enter its token and connect. The token grants management access. For remote access, use an HTTPS reverse proxy when available and set `publicUrl` accordingly; changing the bind address alone does not enable HTTPS.

Request a pairing code for the main account from the panel. In WhatsApp, open **Linked devices → Link a device → Link with phone number instead**, then enter the code. The main owner number comes from private `config.json` or `OWNER_NUMBER`; an existing database owner is preserved on upgrade. Run `npm run setup` for a fresh copy.

Other users can send **`.pair` in private** to pair their own account, subject to the 10-active-account limit. The command cannot pair another person's number. `.unpair confirm` removes the link immediately; account data is retained for three days before cleanup.

### 5. First commands and defaults

```text
.menu
.help play
.ping
.public
.youtube on
```

Fresh accounts start in **SELF** mode, with prefix **`.`**, and YouTube, AI auto-replies and owner-style learning disabled. Gemini is the default provider, but AI requires a key and must be enabled in the panel. Most system replies are English; generated AI answers can follow the user's language.

- `.public`: allow other users to use ordinary commands.
- `.self`: restrict ordinary commands to the account owner and sudo users.
- `.setprefix !`: change the command prefix for this account.
- `.setname MyBot`: change this account's bot name.
- `.sudo add <number>`: let the account owner grant sudo access. Sudo does not override every owner-only or host-only operation.

### 6. AI, voice and owner style

In the panel, select **Gemini** or **OpenAI**, add the matching API key, enable AI and save. Keys for the two providers are stored separately. There is no automatic fallback to a paid provider.

```text
.ai Explain this simply
.translate ar Good morning
.tts Hello everyone
.autoreply on
.aigroup on
.mystyle on
.mystyle status
.forget
```

Private auto-replies require `.autoreply on`. Group AI requires an administrator to enable `.aigroup on`; mentions, direct replies and explicit calls to the bot help it identify messages addressed to it. Voice transcription accepts messages up to two minutes. If speech generation fails after a text answer was produced, the bot can send the text answer instead.

Owner-style mode learns from **new human-written outgoing text** after activation. Bot output and commands are excluded. Collection is local, and generation still uses the selected API. Examples are bounded and kept for about one week; private examples are only supplied for their own conversation. This is a style approximation, not a fine-tuned model or a guaranteed copy of the owner. The first style-mode response in a chat includes an automatic-reply disclosure. Contact names are used when synchronized; complete address-book synchronization is not guaranteed.

Gemini has local per-model request limits shared across linked accounts: by default 100 text-model attempts/day, 5 TTS attempts/day and 5 image attempts/day. Provider limits and access are separate. OpenAI uses a shared host-configured budget; uncertain requests retain their cost reservation. Reset accounting follows UTC.

`.createimage <description>` accepts up to 1000 characters and runs one image generation at a time. The current adapters use a separate Gemini image model or OpenAI `gpt-image-1` with one low-quality 1024×1024 output. Image access may require billing. OpenAI image attempts retain a conservative **$0.10 local budget reservation**; this is not a claim about the provider's actual price.

### 7. Media downloads and reactions

```text
.play song name
.ytmp3 https://youtu.be/VIDEO_ID
.ytmp4 https://youtu.be/VIDEO_ID
.download https://www.instagram.com/reel/POST_ID/
.hug @member
.slap @member
.marry @member
```

Supported video-link platforms: **YouTube, Instagram, TikTok, Facebook, X/Twitter, Reddit, Pinterest, Vimeo and Dailymotion**. `.download` detects a supported platform; YouTube results are video for that command. `.play` and `.ytmp3` return MP3 audio. Public-link support does not mean every link on each platform is downloadable.

- Downloaded output: up to **25 MB**.
- YouTube duration: up to **8 minutes**, with `.youtube on` required.
- Video-to-sticker input: up to **10 seconds**.
- Live streams and restricted YouTube content are unsupported.
- A new media request is rejected promptly while the shared media tool is busy.
- On tracked commands, the reaction on the original message changes from **⏳** to **✅** after successful result delivery, or **❌** on failure. Failure explanations remain as text. Status reactions are best effort.

Anime commands use bundled animated MP4 clips sent with WhatsApp GIF playback. They do not require an AI key or YouTube. Targeted commands accept a mention or a reply. **`.kick` removes a member; `.kickgif` sends an anime action.** Names appear in captions when available; the native mention is separate, and WhatsApp controls how it displays that mention.

For YouTube authentication on a host, a private Netscape-format cookie file can be placed at `data/youtube-cookies.txt`. Export only YouTube cookies, preserve the proper header and keep the file private. It is passed only to YouTube requests through temporary copies. Cookies do not guarantee that challenges, host IP restrictions or PO Token requirements are resolved.

```text
.updatemedia nightly
```

The host owner can update the downloader from WhatsApp. Alternatively, run `npm run update:media` on the host. Consult `YOUTUBE-SETUP.md` for the detailed setup.

### 8. Economy

```text
.register Salah
.job developer
.daily
.work
.shop
.buy coffer
.use coffer
.bank
.deposit 100
.pay @member 100
.rich
```

Registration is required before using economy features. A new player receives **200 coins**; `.daily` awards **500 coins every 24 hours**. Work has a **30-minute cooldown**, with job XP earned by working. These are virtual coins, not real money.

Balances are shared between groups within one bot account; each paired account has its own economy. Buying an item does not activate it: use `.use <item>`. Job tools remain equipped. Changing jobs resets job XP, while the work cooldown remains.

Transfers charge **5% rounded up**, deducted from the sent amount and credited to the main host owner's economy. Robbery has a one-hour cooldown, an 80% success chance, and takes 15% of the target wallet up to 1000 coins; failure fines up to 150 coins. Bank funds are excluded and a shield blocks robbery.

Temporary group admin costs **20,000 coins for seven days**, after the original group owner enables `.adminshop on` and the bot has admin rights. Expired leases are processed when the bot is online with the necessary permissions.

### 9. Upgrade, backup and restore

**Stop → replace project files → keep `data/` and `tools/` → reinstall dependencies if needed → start.**

`data/bot.sqlite` stores account settings, economy, memory and session-related data. Writes occur as state changes. JSON snapshots retain up to seven daily files per account and omit the host's API keys; they are not a full session backup.

For a full restore, stop the bot and privately copy the complete `data/` directory. Restore it while stopped, then restart. Do not run the same session on your PC and host at the same time. Reminders require a running, connected bot; overdue reminders are handled after it comes back online.

<a id="arabic-guide"></a>

## 🇲🇦 الدليل العربي

### 1. تقديم البوت

**Eddine-MD** بوت واتساب لإدارة المجموعات، تحميل الوسائط، إرسال تفاعلات الأنمي، الاقتصاد الافتراضي وأدوات الذكاء الاصطناعي. يدعم حتى **10 حسابات نشطة**، مع إعدادات وبيانات مستقلة لكل حساب. عدد الأوامر المعلنة في النسخة الحالية هو **187 أمراً**.

### 2. المتطلبات والتثبيت

استعمل Node.js **22.13 أو أحدث من سلسلة 22**، أو **24 فما فوق**. يجب أن تسمح الاستضافة بكتابة البيانات والاتصال بواتساب وتنزيل المكتبات وأدوات الوسائط. الأدوات الثقيلة تُعالج واحدة في كل مرة؛ تشغيل عشرة حسابات على استضافة 256 MB ليس مضموناً.

على الاستضافة، فك ZIP بحيث تكون الملفات `index.js` و`package.json` و`package-lock.json` والمجلد `src/` مباشرة في جذر السيرفر، ثم نفّذ:

```bash
npm ci --no-audit --no-fund
npm run setup
npm start
```

ملف التشغيل هو **`index.js`**. لا ترفع `node_modules` من Windows إلى استضافة Linux؛ ثبّت المكتبات داخل الاستضافة نفسها.

على Windows، ضع المشروع في مجلد ثابت، شغّل `setup.bat`، ثم `start.bat` و`panel.bat`. استعمل `start-console.bat` لرؤية الأخطاء و`stop.bat` للإيقاف. التشغيل التلقائي يكون عند تسجيل الدخول إلى Windows. لا تشغّل نسختين على مجلد البيانات نفسه.

### 3. اللوحة والربط

عنوان اللوحة يُضبط في `panel.config.json`، مع مثال محلي في `panel.config.example.json`. عدّل العنوان والمنفذ حسب الاستضافة. افتح اللوحة، وانسخ رمز الدخول من **`data/panel-token.txt`** بشكل خاص، ثم اتصل. رمز اللوحة يمنح صلاحية الإدارة؛ استخدم HTTPS عند توفيره من الاستضافة.

اطلب كود الربط للحساب الرئيسي من اللوحة، ثم افتح في واتساب **الأجهزة المرتبطة ← ربط جهاز ← الربط برقم الهاتف** وأدخل الكود. رقم المالك يأتي من `config.json` الخاص أو `OWNER_NUMBER`؛ صاحب البيانات القديمة يُحافظ عليه عند التحديث. شغّل `npm run setup` للنسخة الجديدة.

يمكن للمستخدم إرسال `.pair` في الخاص لربط **حسابه هو**. الحد عشرة حسابات نشطة. `.unpair confirm` يفصل الحساب فوراً، مع الاحتفاظ ببياناته ثلاثة أيام قبل تنظيفها.

### 4. الإعدادات الأساسية

```text
.menu
.help sticker
.public
.self
.setprefix !
.setname Eddine-MD
.youtube on
```

الوضع الافتراضي هو **SELF** والبادئة **`.`**. تحميل يوتيوب والرد التلقائي وتعلّم الأسلوب تكون متوقفة افتراضياً. `.public` يسمح للأعضاء باستعمال الأوامر العادية، و`.self` يقصرها على المالك وsudo. الأوامر الخاصة بالمالك أو المستضيف تبقى لها صلاحياتها الخاصة.

### 5. الذكاء الاصطناعي والصوت

اختر Gemini أو OpenAI من اللوحة، أدخل مفتاح المزوّد الصحيح وفعّل AI. المفتاح الذي يعمل للنص لا يضمن صلاحية إنشاء الصور. لا يوجد انتقال تلقائي إلى مزوّد مدفوع.

- `.ai`: سؤال نصي، أو رد على رسالة صوتية لتحليلها.
- `.autoreply on`: تفعيل الرد الآلي في الخاص.
- `.aigroup on`: تفعيل AI داخل المجموعة بواسطة الأدمن.
- `.translate`: ترجمة النصوص.
- `.tts`: تحويل نص إلى رسالة صوتية.
- `.forget`: مسح الذاكرة الشخصية، مع إمكانية مسح سياق المجموعة للأدمن.
- `.createimage`: إنشاء صورة من وصف؛ يحتاج صلاحية الصور والحصة أو الفوترة المناسبة.

الذكاء الاصطناعي يتبع لغة المستخدم، بما فيها الدارجة وArabizi. الرسائل الصوتية المدخلة محدودة بدقيقتين. الأصوات مولّدة وليست صوت المالك الحقيقي.

`.mystyle on` يبدأ جمع أسلوب **رسائل المالك البشرية الجديدة**. لا يجمع أوامر البوت أو ردوده. أمثلة المحادثات محدودة ولمدة تقارب أسبوعاً، ولا تُستخدم أمثلة الخاص مع محادثة أخرى. جمع الأسلوب محلي، لكن توليد الرد يحتاج API. الأسلوب تقريبي وليس نسخة مطابقة من المالك، وأول رد بهذا الوضع يتضمّن إشارة إلى أنه رد تلقائي.

حصص AI مشتركة بين الحسابات المرتبطة، مع حدود منفصلة للنص والصوت والصور. ميزانية OpenAI مشتركة على مستوى المستضيف، وقد يبقى تقدير التكلفة محجوزاً إذا كانت نتيجة الطلب غير معروفة. حدود البوت لا تعني أن المزوّد يمنح نفس الحصة.

### 6. التحميل وتفاعلات الأنمي

`.play` و`.ytmp3` يرسلان MP3، و`.ytmp4` يرسل فيديو يوتيوب. `.download` يتعرّف على رابط فيديو من منصة مدعومة. الحد **25 MB** للنتيجة و**8 دقائق** ليوتيوب. `.youtube on` مطلوب، والبث المباشر والمحتوى المقيّد غير مدعومين.

المنصات المدعومة: YouTube وInstagram وTikTok وFacebook وX/Twitter وReddit وPinterest وVimeo وDailymotion. قد تمنع الخصوصية أو قيود المنطقة أو مكافحة البوتات بعض الروابط.

تفاعلات الأنمي تستعمل **52 مقطعاً مرفقاً** لـ26 أمراً، دون مفتاح API. استعمل `.hug @member` أو `.slap` مع الرد على رسالة العضو. **`.kick` للطرد و`.kickgif` لحركة الأنمي**. الأسماء تظهر عند توفرها، والمنشن الحقيقي منفصل عنها.

حالة الأوامر تظهر فوق الرسالة نفسها:

| الحالة | المعنى |
|---|---|
| ⏳ | البوت يحمّل أو يجهّز النتيجة. |
| ✅ | انتهى الأمر وأُرسلت النتيجة بنجاح. |
| ❌ | فشل الأمر، مع رسالة توضح السبب. |

إذا كانت أداة الوسائط مشغولة، يُرفض الطلب الجديد فوراً بدل الانتظار في طابور طويل. ملف كوكيز يوتيوب، إن احتاجته الاستضافة، يوضع بشكل خاص في `data/youtube-cookies.txt` بصيغة Netscape؛ لا تشارك محتواه. الكوكيز لا تضمن تجاوز مشاكل JavaScript أو قيود الاستضافة.

### 7. الاقتصاد والصلاحيات

التسجيل بـ`.register الاسم` يعطي **200 عملة**، و`.daily` يعطي **500 كل 24 ساعة**. `.work` متاح كل **30 دقيقة** بعد اختيار مهنة. العملات افتراضية. رصيد اللاعب مشترك بين مجموعات البوت نفسه، ومنفصل عن بقية الحسابات المرتبطة.

استعمل `.buy` للشراء ثم `.use` للتفعيل. تحويل `.pay` يخصم **5% بالتقريب للأعلى** من المبلغ، وتصل الرسوم إلى اقتصاد المستضيف الرئيسي. السرقة لا تشمل البنك، ويمكن منعها باستعمال shield.

مالك المجموعة الأصلي يستطيع تفعيل `.adminshop on`، وبعدها يمكن شراء أدمن مؤقت بـ**20,000 عملة لمدة 7 أيام**. يجب أن يكون البوت أدمن لتنفيذ الترقية والسحب لاحقاً.

إضافة عضو بـ`.add` تحتاج أدمن المجموعة وأن يكون البوت أدمن. إعدادات خصوصية العضو قد تمنع الإضافة. `.send` للمالك ويرسل **رسالة واحدة من حسابه**، وليس من جميع الحسابات إلى نفس الرقم.

### 8. التحديث والحفظ

**أوقف البوت ← بدّل ملفات المشروع ← احتفظ بـ`data/` و`tools/` ← ثبّت المكتبات عند الحاجة ← شغّل.**

البيانات محفوظة في SQLite مع التغييرات. النسخ اليومية JSON ليست بديلاً عن نسخ مجلد `data/` كاملاً لاسترجاع الربط. خذ النسخة الكاملة والبوت موقوف، ولا تشاركها لأنها تحتوي بيانات الجلسات والذاكرة والإعدادات. التذكيرات تحتاج أن يكون البوت متصلاً وخادماً.

<a id="command-reference"></a>

## 📚 Command reference / مرجع الأوامر

Examples use the default prefix **`.`**. Replace it if you changed your account prefix. `@member` can often be replaced by replying to that member's message.  
الأمثلة تستعمل البادئة **`.`**. غيّرها حسب إعداد حسابك. كثير من أوامر الأعضاء تقبل الرد على الرسالة بدل المنشن.

**Access / الصلاحيات:** Public commands depend on SELF/PUBLIC mode. Group moderation requires group-admin rights where enforced; some actions also require the bot to be an admin. Account-owner, original-group-owner and main-host permissions are distinct.  
الأوامر العامة تتبع SELF/PUBLIC. الإدارة تحتاج صلاحيات الأدمن بحسب الأمر، وبعض العمليات تحتاج أن يكون البوت أدمن. صلاحية مالك الحساب تختلف عن مالك المجموعة الأصلي وعن المستضيف الرئيسي.

### General / عامة

| Command / الأمر | English | العربية |
|---|---|---|
| `.menu` | Show command categories. | عرض قائمة الأوامر. |
| `.help [command]` | Show the menu or usage for one command. | عرض القائمة أو طريقة استعمال أمر. |
| `.info` | Show host and bot statistics. | عرض معلومات الاستضافة والبوت. |
| `.ping` | Check bot response timing. | قياس زمن الاستجابة. |
| `.alive` | Show online status. | عرض حالة تشغيل البوت. |
| `.owner` | Send the project owner contact. | إرسال جهة اتصال المالك. |
| `.jid` | Show chat and sender identifiers. | عرض معرّفات المحادثة والمرسل. |

### Account / الحساب

| Command / الأمر | English | العربية |
|---|---|---|
| `.public` | Enable public command access. | فتح الأوامر للآخرين. |
| `.self` | Restrict ordinary commands to owner/sudo. | قصر الأوامر العادية على المالك وsudo. |
| `.setname <name>` | Change the bot name; max 40 characters. | تغيير اسم البوت؛ حتى 40 حرفاً. |
| `.setprefix .` | Choose one supported punctuation prefix. | اختيار رمز واحد كبادئة. |
| `.setimage <command> (reply to image)` | Set artwork for a supported command. | تغيير صورة أمر يدعم الصور. |
| `.youtube on\|off` | Enable/disable YouTube commands. | تفعيل أو تعطيل يوتيوب. |
| `.autoreply on\|off` | Enable/disable private AI replies. | تفعيل أو تعطيل الرد الآلي في الخاص. |
| `.sudo add\|del <phone> \| sudo list` | Owner manages sudo users. | إدارة sudo بواسطة المالك. |
| `.pair (private; your own account)` | Pair your own number in private. | ربط رقمك في الخاص. |
| `.unpair confirm` | Unlink; retain data for three days. | فصل الربط مع حفظ البيانات ثلاثة أيام. |
| `.settings` | Display this account configuration. | عرض إعدادات الحساب. |
| `.mystyle on\|off\|status\|clear (account owner only)` | Owner-style learning controls and status. | التحكم في تعلّم أسلوب المالك وحالته. |

### Group / المجموعة

| Command / الأمر | English | العربية |
|---|---|---|
| `.add <number with country code>` | Add a registered number; admin required. | إضافة رقم مسجّل؛ للأدمن. |
| `.kick @member (or reply to a message)` | Remove a group member. | طرد عضو من المجموعة. |
| `.promote @member (or reply to a message)` | Promote a member to admin. | ترقية عضو إلى أدمن. |
| `.demote @member (or reply to a message)` | Demote an admin. | سحب صلاحية الأدمن. |
| `.tagall [message]` | Send named visible member mentions. | منشن ظاهر للأعضاء مع أسمائهم. |
| `.hidetag [message]` | Mention members without visible tokens. | منشن للأعضاء دون كتابة المعرّفات. |
| `.open` | Allow all members to send messages. | السماح لجميع الأعضاء بالمراسلة. |
| `.close` | Limit sending to admins. | قصر المراسلة على الأدمنات. |
| `.lock` | Restrict group settings changes. | قفل تعديل إعدادات المجموعة. |
| `.unlock` | Allow members to edit group settings. | فتح تعديل إعدادات المجموعة للأعضاء. |
| `.groupinfo` | Show group details. | عرض معلومات المجموعة. |
| `.admins` | List group admins. | عرض أدمنات المجموعة. |
| `.grouplink` | Get the group invitation link. | عرض رابط دعوة المجموعة. |
| `.resetlink` | Revoke and replace the invite link. | إلغاء رابط الدعوة وإنشاء بديل. |
| `.setsubject <group name>` | Change the group name. | تغيير اسم المجموعة. |
| `.setdesc <description>` | Change the group description. | تغيير وصف المجموعة. |
| `.delete (reply / رد)` | Delete a replied-to message. | حذف الرسالة التي رددت عليها. |
| `.warn @member (or reply to a message)` | Warn a member; third warning removes. | إنذار عضو؛ الإنذار الثالث يؤدي للطرد. |
| `.unwarn @member (or reply to a message)` | Remove one warning. | إزالة إنذار واحد. |
| `.warnings` | Show your or a target member’s warnings. | عرض إنذاراتك أو إنذارات عضو. |
| `.antilink off\|whatsapp\|all` | Configure link moderation. | ضبط منع الروابط. |
| `.antispam on\|off` | Toggle automatic spam moderation. | تفعيل أو تعطيل منع السبام. |
| `.welcome on\|off` | Toggle join greetings. | تفعيل أو تعطيل الترحيب. |
| `.goodbye on\|off` | Toggle leave messages. | تفعيل أو تعطيل رسائل المغادرة. |
| `.setwelcome Welcome {user} to {group}!` | Customize join text with placeholders. | تخصيص رسالة الترحيب. |
| `.setgoodbye Goodbye {user}` | Customize leave text with placeholders. | تخصيص رسالة المغادرة. |
| `.aigroup on\|off` | Toggle group AI responses. | تفعيل أو تعطيل AI للمجموعة. |
| `.adminshop on\|off (group owner)` | Original group owner toggles admin leases. | مالك المجموعة الأصلي يفعّل شراء الأدمن. |
| `.activity (today, week, total)` | Show today/week/total activity since tracking began. | عرض نشاط اليوم والأسبوع والمجموع منذ بدء العد. |

### Economy / الاقتصاد

| Command / الأمر | English | العربية |
|---|---|---|
| `.register <name>` | Create a player profile; max 32-character name. | التسجيل باسم حتى 32 حرفاً. |
| `.profile` | Show your player card. | عرض بطاقة اللاعب. |
| `.balance` | Show wallet and bank balances. | عرض رصيد المحفظة والبنك. |
| `.daily` | Claim the 24-hour reward. | الحصول على المكافأة اليومية. |
| `.job developer\|chef\|driver\|mechanic\|doctor` | Choose a profession. | اختيار مهنة. |
| `.jobs` | List professions and base earnings. | عرض المهن ومكافآتها الأساسية. |
| `.work` | Work for coins and job XP. | العمل مقابل عملات وخبرة مهنية. |
| `.shop [item]` | List the shop or inspect an item. | عرض المتجر أو تفاصيل عنصر. |
| `.buy <item> [quantity] \| buy admin` | Buy an item, or temporary group admin. | شراء عنصر أو أدمن مؤقت. |
| `.inventory` | Show owned and equipped items. | عرض المخزون والأدوات المجهزة. |
| `.use <item>` | Activate or open an owned item. | تفعيل أو فتح عنصر تملكه. |
| `.bank` | Show the bank card and available actions. | عرض بطاقة البنك والإجراءات. |
| `.deposit <amount>` | Move wallet coins into the bank. | إيداع العملات في البنك. |
| `.withdraw <amount>` | Move bank coins into the wallet. | سحب العملات إلى المحفظة. |
| `.pay @member <amount>` | Transfer coins with a 5% fee. | تحويل العملات برسوم 5%. |
| `.rob @member` | Attempt virtual wallet robbery. | محاولة سرقة محفظة افتراضية. |
| `.rich` | Show the richest registered players. | عرض أغنى اللاعبين المسجّلين. |

### Anime reactions / تفاعلات الأنمي

| Command / الأمر | English | العربية |
|---|---|---|
| `.hug @member (or reply to their message)` | Hug anime GIF. | عناق في GIF أنمي. |
| `.slap @member (or reply to their message)` | Slap anime GIF. | صفعة في GIF أنمي. |
| `.punch @member (or reply to their message)` | Punch anime GIF. | لكمة في GIF أنمي. |
| `.kickgif @member (or reply to their message) — anime kick; .kick removes a group member` | Anime kick anime GIF. | ركلة أنمي في GIF أنمي. |
| `.marry @member (or reply to their message)` | Romantic marriage-caption GIF; no marriage database anime GIF. | GIF رومانسي بتعليق زواج؛ دون نظام زواج محفوظ في GIF أنمي. |
| `.kiss @member (or reply to their message)` | Kiss anime GIF. | قبلة في GIF أنمي. |
| `.pat @member (or reply to their message)` | Head pat anime GIF. | ربت على الرأس في GIF أنمي. |
| `.cuddle @member (or reply to their message)` | Cuddle anime GIF. | احتضان في GIF أنمي. |
| `.handhold @member (or reply to their message)` | Hold hands anime GIF. | إمساك اليد في GIF أنمي. |
| `.highfive @member (or reply to their message)` | High five anime GIF. | تحية كف في GIF أنمي. |
| `.poke @member (or reply to their message)` | Poke anime GIF. | نخزة في GIF أنمي. |
| `.bite @member (or reply to their message)` | Bite anime GIF. | عضّة في GIF أنمي. |
| `.bonk @member (or reply to their message)` | Bonk anime GIF. | ضربة مرحة في GIF أنمي. |
| `.feed @member (or reply to their message)` | Feed anime GIF. | إطعام في GIF أنمي. |
| `.tickle @member (or reply to their message)` | Tickle anime GIF. | دغدغة في GIF أنمي. |
| `.wave [@member]` | Wave anime GIF. | تلويح في GIF أنمي. |
| `.wink [@member]` | Wink anime GIF. | غمزة في GIF أنمي. |
| `.dance [@member]` | Dance anime GIF. | رقص في GIF أنمي. |
| `.cry [@member]` | Cry anime GIF. | بكاء في GIF أنمي. |
| `.laugh [@member]` | Laugh anime GIF. | ضحك في GIF أنمي. |
| `.smile [@member]` | Smile anime GIF. | ابتسامة في GIF أنمي. |
| `.blush [@member]` | Blush anime GIF. | خجل في GIF أنمي. |
| `.facepalm [@member]` | Facepalm anime GIF. | وضع اليد على الوجه في GIF أنمي. |
| `.happy [@member]` | Happy anime GIF. | فرح في GIF أنمي. |
| `.handshake @member (or reply to their message)` | Handshake anime GIF. | مصافحة في GIF أنمي. |
| `.carry @member (or reply to their message)` | Carry anime GIF. | حمل شخص في GIF أنمي. |

### Media / الوسائط

| Command / الأمر | English | العربية |
|---|---|---|
| `.mines <author> \| <pack> (reply to sticker)` | Replace a sticker author and pack, preserving animation. | تغيير كاتب وpack الستيكر مع الحفاظ على الحركة. |
| `.mix 😂 🔥` | Combine two supported emoji; downloads the matching asset. | دمج إيموجيين مدعومين عبر تنزيل الصورة المطابقة. |
| `.csticker <text>` | Create a fixed cyan neon text sticker. | إنشاء ستيكر نص بنيون سماوي ثابت. |
| `.sround (reply to image)` | Create a circular sticker with transparent corners. | إنشاء ستيكر دائري بخلفية شفافة خارج الدائرة. |
| `.remini (local basic enhancement)` | Basic local denoising, contrast and sharpening; not AI restoration. | تحسين محلي بسيط للتشويش والتباين والحدة؛ ليس ترميماً بالـAI. |
| `.wanted [name \| reward] (reply to image)` | One Piece poster; automatic reply name and random bounty. | بوستر One Piece بصورة الشخص وسميتو ومكافأة عشوائية. |
| `.jail (reply to image)` | Add prison bars to a photo. | إضافة قضبان حبس إلى الصورة. |
| `.rip [name] (reply to image)` | Create a playful RIP grave design. | إنشاء تصميم RIP على شكل ميم. |
| `.sketch (reply to image)` | Apply a pencil-sketch effect. | تأثير رسم بالقلم الرصاص. |
| `.qr <text or link>` | Create a QR code from text or a link. | إنشاء QR من نص أو رابط. |
| `.readqr (reply to image)` | Read a QR code in an image. | قراءة QR من صورة. |
| `.topdf [done\|cancel] (or reply to image)` | Convert a replied image or collect images into one PDF. | تحويل صورة بالرد عليها أو جمع صور في PDF واحد. |
| `.frompdf (reply to PDF, max 8 pages)` | Render a PDF of up to 8 pages as images. | تحويل PDF حتى 8 صفحات إلى صور. |
| `.zip [done\|cancel] (or reply to file)` | Collect files into a ZIP, then send done. | جمع ملفات في ZIP، ثم إرسال done. |
| `.unzip (reply to ZIP)` | Extract 1–8 ZIP files with bounded total size. | استخراج 1–8 ملفات من ZIP ضمن حد الحجم. |
| `.compress (reply to image/video/PDF)` | Compress image/audio/video/PDF; keep original if smaller. | ضغط صورة أو صوت أو فيديو أو PDF؛ الاحتفاظ بالأصل إذا كان أصغر. |
| `.tomp3 (reply to video/audio)` | Extract an audio track as MP3. | استخراج الصوت بصيغة MP3. |
| `.tovn (reply to audio)` | Convert audio into an Opus voice note. | تحويل صوت إلى رسالة صوتية Opus. |
| `.trim 00:10 00:25 (reply to clip)` | Cut a clip using start/end times. | قص مقطع بأوقات البداية والنهاية. |
| `.speed 0.5–2 (reply to clip)` | Change speed between 0.5 and 2, keeping pitch. | تغيير السرعة بين 0.5 و2 مع الحفاظ على نبرة الصوت. |
| `.merge [done\|cancel] (send 2–8 matching clips)` | Collect matching clips and concatenate in order. | جمع مقاطع متوافقة ودمجها بالترتيب. |
| `.gif (reply to video, max 15s)` | Send a silent looping video, up to 15 seconds. | إرسال فيديو متكرر صامت حتى 15 ثانية. |
| `.reverse (reply to video, max 15s)` | Reverse a silent short video, up to 15 seconds. | عكس فيديو قصير صامت حتى 15 ثانية. |
| `.ocr [eng\|fra\|ara\|eng+fra+ara] (reply to image)` | Read image text locally with bundled English/French/Arabic language data. | قراءة نص الصورة محلياً ببيانات لغات إنجليزية وفرنسية وعربية مرفقة. |
| `.sticker` | Convert a replied image or short video to a sticker. | تحويل صورة أو فيديو قصير إلى ستيكر. |
| `.toimg` | Convert a replied sticker to an image. | تحويل ستيكر إلى صورة. |
| `.instagram <link>` | Download a public instagram video link. | تحميل رابط فيديو عام من instagram. |
| `.tiktok <link>` | Download a public tiktok video link. | تحميل رابط فيديو عام من tiktok. |
| `.facebook <link>` | Download a public facebook video link. | تحميل رابط فيديو عام من facebook. |
| `.twitter <link>` | Download a public twitter video link. | تحميل رابط فيديو عام من twitter. |
| `.reddit <link>` | Download a public reddit video link. | تحميل رابط فيديو عام من reddit. |
| `.pinterest <link or words>` | Download a pin, or get a random image by search words. | تحميل pin أو صورة عشوائية بالكلمات. |
| `.vimeo <link>` | Download a public vimeo video link. | تحميل رابط فيديو عام من vimeo. |
| `.dailymotion <link>` | Download a public dailymotion video link. | تحميل رابط فيديو عام من dailymotion. |
| `.play <song name or YouTube link>` | Search YouTube and send MP3 audio. | البحث في يوتيوب وإرسال MP3. |
| `.ytmp3 <YouTube link>` | Download YouTube audio. | تحميل صوت يوتيوب. |
| `.ytmp4 <YouTube link>` | Download a YouTube video. | تحميل فيديو يوتيوب. |
| `.download <supported public media link>` | Detect a supported link and download video. | التعرّف على منصة الرابط وتحميل الفيديو. |

### Tools / الأدوات

| Command / الأمر | English | العربية |
|---|---|---|
| `.createimage <description>` | Generate an image from a description using API. | إنشاء صورة من وصف عبر API. |
| `.send <message> \| <recipient number> [\| <your paired bot number>] (account owner)` | Owner sends one message to one number. | المالك يرسل رسالة واحدة إلى رقم واحد. |
| `.ai <question> or reply to voice` | Ask the configured AI; also accepts a replied voice note. | سؤال AI أو تحليل رسالة صوتية بالرد عليها. |
| `.forget (your personal AI memory)` | Clear your stored AI memory. | مسح ذاكرتك المخزّنة لدى AI. |
| `.translate <language> <text>` | Translate text using AI. | ترجمة النص عبر AI. |
| `.tts <text>` | Generate a voice note from text using AI. | توليد رسالة صوتية من نص عبر AI. |
| `.calc (20+5)*3` | Evaluate a short numeric expression. | حساب تعبير رقمي قصير. |
| `.weather <city>` | Show current weather for a city. | عرض طقس مدينة. |
| `.remind 30m <text> (m/h/d)` | Save a reminder from 1 minute to 30 days. | حفظ تذكير من دقيقة إلى 30 يوماً. |
| `.reminders` | List your pending reminders. | عرض تذكيراتك المنتظرة. |
| `.delremind <id>` | Delete one of your reminders. | حذف أحد تذكيراتك. |
| `.poll Question \| Option 1 \| Option 2` | Admin creates a group poll with 2–12 choices. | الأدمن ينشئ استطلاعاً من خيارين إلى 12. |

### Host / المستضيف الرئيسي

| Command / الأمر | English | العربية |
|---|---|---|
| `.sessions` | Main host lists paired accounts. | المستضيف يعرض الحسابات المرتبطة. |
| `.stopbot <phone>` | Main host stops an account. | المستضيف يوقف حساباً. |
| `.startbot <phone>` | Main host starts an account. | المستضيف يشغّل حساباً. |
| `.blockbot <phone>` | Main host stops and blocks an account. | المستضيف يوقف ويحظر حساباً. |
| `.unblockbot <phone>` | Main host removes an account block. | المستضيف يزيل حظر حساب. |
| `.backup` | Save account-data snapshots on the host. | حفظ نسخ بيانات الحسابات في الاستضافة. |
| `.updatemedia nightly\|stable (host owner only)` | Main host updates yt-dlp stable/nightly. | المستضيف يحدّث yt-dlp إلى stable أو nightly. |

## 🛍️ Shop / المتجر

Buy with `.buy <item>` and activate with `.use <item>`; admin activates through the group purchase flow.  
اشترِ بـ`.buy العنصر` وفعّل بـ`.use العنصر`؛ الأدمن يُفعّل عبر عملية الشراء داخل المجموعة.

| Item | Coins | Effect / المفعول |
|---|---:|---|
| `shield` | 1,000 | Robbery protection for 24 hours / حماية من السرقة 24 ساعة. |
| `coffer` | 350 | Open for 200–600 coins / افتحه للحصول على 200–600 عملة. |
| `mysterybox` | 700 | Coins, a shield or a job tool / عملات أو shield أو أداة مهنة. |
| `booster` | 900 | Double the next three work rewards / مضاعفة ثلاث مكافآت عمل قادمة. |
| `laptop` | 3,000 | Developer income +25% / دخل المطوّر +25%. |
| `oven` | 2,500 | Chef income +25% / دخل الطباخ +25%. |
| `vehicle` | 4,000 | Driver income +25% / دخل السائق +25%. |
| `toolbox` | 2,500 | Mechanic income +25% / دخل الميكانيكي +25%. |
| `medkit` | 3,500 | Doctor income +25% / دخل الطبيب +25%. |
| `admin` | 20,000 | Seven-day group admin lease when enabled / أدمن سبعة أيام عند تفعيل المتجر. |

## 🧭 Troubleshooting / حل المشاكل

| Symptom / المشكل | What to check / ما يجب مراجعته |
|---|---|
| `Cannot find ... index.js` | Check extraction and startup path; `index.js` belongs at the server root. / راجع فك الملفات ومسار التشغيل؛ `index.js` يكون في الجذر. |
| Commands ignored / الأوامر لا تجيب | Check prefix, SELF/PUBLIC, sender permissions and whether the session is online. / راجع البادئة والوضع والصلاحيات والاتصال. |
| Cannot add/kick/promote / تعذّر إدارة عضو | Check both admin roles, group-owner restrictions and the target's privacy settings. / راجع صلاحية الأدمن للبوت وللمرسل وقيود المالك والخصوصية. |
| Media tool busy / أداة الوسائط مشغولة | Wait for the active operation to finish, then send one new request. / انتظر انتهاء العملية ثم أرسل طلباً واحداً. |
| YouTube disabled / يوتيوب متوقف | Account owner runs `.youtube on`. / مالك الحساب يفعّل `.youtube on`. |
| JavaScript challenge failed | Main host tries `.updatemedia nightly`, then checks full console warnings and EJS/runtime setup. / المستضيف يجرّب التحديث ويراجع تحذيرات Console وإعداد EJS. |
| Cookies format error / خطأ صيغة الكوكيز | Export Netscape TXT with the correct header and tab-separated YouTube-only rows. / صدّر Netscape TXT بالترويسة الصحيحة وصفوف يوتيوب المفصولة بـTab. |
| AI quota/access error / خطأ حصة أو صلاحية AI | Review the selected provider, key, model access, billing and panel limits. / راجع المزوّد والمفتاح والموديل والفوترة وحدود اللوحة. |
| Image generation unavailable / الصور لا تعمل | Image-model access is separate from chat; inspect the actual error. / صلاحية موديل الصور مستقلة عن الشات؛ راجع الخطأ الفعلي. |
| Panel not opening / اللوحة لا تفتح | Match `publicUrl`, bind and port to the allocation; check environment overrides. / طابق العنوان والمنفذ وإعدادات البيئة مع الاستضافة. |
| Names/mentions differ / اختلاف الأسماء والمنشن | Contact sync and WhatsApp client display control the final presentation. / مزامنة الكونتاكتات وتطبيق واتساب يتحكمان في العرض. |

For diagnostics, share the error log **without API keys, cookies, panel tokens or session data**.  
عند طلب المساعدة، شارك سجل الخطأ **دون المفاتيح أو الكوكيز أو رمز اللوحة أو بيانات الجلسات**.

## 🗂️ Project layout / ملفات المشروع

| Path | Purpose / الوظيفة |
|---|---|
| `index.js` | Startup entry / ملف التشغيل. |
| `package.json`, `package-lock.json` | Dependencies and scripts / المكتبات وأوامر التشغيل. |
| `src/` | Sessions, commands, storage, AI, economy and media / منطق الحسابات والأوامر والحفظ والوسائط. |
| `public/` | Browser panel interface / واجهة لوحة الإدارة. |
| `assets/` | Menu artwork and bundled anime clips / صورة القائمة ومقاطع الأنمي. |
| `data/` | Private persistent state and credentials / بيانات دائمة ومعلومات ربط خاصة. |
| `tools/` | Local downloader and tool notes / أداة التحميل المحلية وتعليماتها. |
| `scripts/` | Runtime checks and helper launch/update scripts / أدوات التحقق والتشغيل والتحديث. |
| `tests/` | Automated validation / اختبارات آلية. |
| `panel.config.example.json` | Public panel template; private settings go in `panel.config.json` / عنوان اللوحة والمنفذ. |
| `HOST-SETUP.md` | Detailed host setup / إعداد الاستضافة بالتفصيل. |
| `YOUTUBE-SETUP.md` | YouTube cookies and downloader setup / إعداد يوتيوب وأداة التحميل. |

## 🧪 Validation / التحقق

```bash
npm run check
npm test
```

The v2.0.0 code passed **112 automated tests** and syntax checks on Node.js 24.19.0. Fresh public-package offline startup and panel authentication were also verified. These cover persistent state, economy, permissions, AI budget/quota behavior, downloader fixtures, real media conversions, mentions and progress transitions.  
اجتاز v2.0.0 **112 اختباراً آلياً** وفحص الصياغة على Node.js 24.19.0، مع تجربة تشغيل النسخة العامة من مجلد جديد والتحقق من اللوحة.

Live WhatsApp linking, reactions on a user's phone, the user's host downloads and image generation with a real key require deployment validation. Baileys is an unofficial WhatsApp integration, and platform changes can affect compatibility.  
ربط واتساب الفعلي وعرض التفاعلات على الهاتف وتحميل الاستضافة وتوليد الصور بمفتاح حقيقي تحتاج تجربة بعد النشر. Baileys ربط غير رسمي، وتغييرات المنصات قد تؤثر في التوافق.

<a id="local-tools"></a>

## 🧰 Local tools / الأدوات المحلية

The 24 new commands are implemented in this release. Image effects, sticker metadata, QR, PDF, archive, media conversion and OCR processing do not call an AI API. `.mix` downloads a supported Emoji Kitchen image. OCR models for `eng`, `fra` and `ara` are bundled and cached locally; use `.ocr ara` for Arabic, `.ocr fra` for French or `.ocr eng+fra+ara` for all three.

الأوامر الجديدة مركّبة في هذه النسخة. معالجة الصور والستيكر وQR وPDF والأرشيف والصوت والفيديو وOCR لا تستعمل API للذكاء الاصطناعي. `.mix` ينزّل صورة Emoji Kitchen مدعومة. بيانات OCR للإنجليزية والفرنسية والعربية مرفقة وتُخزّن محلياً؛ استعمل `.ocr ara` للعربية و`.ocr fra` للفرنسية أو `.ocr eng+fra+ara` للغات الثلاث.

### Collect multiple files / جمع عدة ملفات

```text
.topdf
(send images / أرسل الصور)
.topdf done
```

The same flow applies to `.zip` and `.merge`. Use `<command> cancel` to discard a collection. Collections are private to the account, sender and chat; expire after ten minutes; accept up to eight files with a combined maximum of 25 MB. Audio and video cannot be mixed within one merge. If you reply to one image with `.topdf`, or one file with `.zip`, it is processed immediately.

نفس الطريقة لـ`.zip` و`.merge`. استعمل `الأمر cancel` للإلغاء. كل عملية جمع منفصلة حسب الحساب والمرسل والمحادثة، وتنتهي بعد عشر دقائق. الحد ثمانية ملفات بمجموع 25 MB، ولا يمكن خلط صوت وفيديو في دمج واحد. الرد على صورة بـ`.topdf` أو ملف بـ`.zip` يعالجه مباشرة.

| Limit / الحد | Value / القيمة |
|---|---|
| Combined inputs and outputs / مجموع المدخلات والنتائج | 25 MB per operation / لكل عملية. |
| Image dimensions / أبعاد الصورة | Up to 8 million pixels / حتى 8 ملايين بكسل. |
| PDF pages / صفحات PDF | Up to 8 / حتى 8. |
| Media duration / مدة الوسائط | Up to 5 minutes; merged total also 5 minutes / حتى 5 دقائق، بما فيها مجموع الدمج. |
| GIF / reverse | Up to 15 seconds, silent / حتى 15 ثانية، صامت. |
| Speed / السرعة | 0.5–2. |
| Neon text / نص النيون | Up to 180 characters / حتى 180 حرفاً. |
| Local process timeout / مهلة المعالجة | 120 seconds; OCR 180 seconds / 120 ثانية؛ OCR 180 ثانية. |

PDF compression rasterizes pages: searchable text, editable forms and original structure are not retained. If the output is larger, the original is returned. `.remini` applies basic local filters; it does not reconstruct missing facial details. OCR accuracy depends on the image. Processing runs in a separate bounded process; a 256 MB host may still need smaller inputs or more RAM, especially with several active WhatsApp accounts.

ضغط PDF يحوّل الصفحات إلى صور: النص القابل للبحث والحقول القابلة للتعديل والبنية الأصلية لا تبقى. إذا أصبحت النتيجة أكبر يُرجع الأصل. `.remini` تحسين بفلاتر محلية وليس استرجاع تفاصيل الوجه المفقودة. دقة OCR تعتمد على الصورة. المعالجة تجري في عملية منفصلة محدودة؛ استضافة 256 MB قد تحتاج ملفات أصغر أو RAM إضافية خصوصاً مع تعدد الحسابات.

## 🔐 GitHub distribution / نسخة GitHub

The public package contains a **clean `data/` scaffold**, not anyone's live data. `data/bot.sqlite`, sessions, tokens, API keys, cookies, OCR cache, `config.json` and `panel.config.json` are excluded from the release and ignored by Git. Do not replace your current `data/` when upgrading. Each user runs `setup.bat` on Windows, or `npm run setup` on a host, to configure their own number and generate their own private data.

النسخة العامة فيها **هيكل `data/` فارغ**، وليس بيانات تشغيل أي شخص. قاعدة البيانات والجلسات والرموز والمفاتيح والكوكيز والكاش والإعدادات الخاصة مستثناة من الحزمة ومن Git. لا تمسح `data/` الحالية عند التحديث. كل مستخدم يشغّل `setup.bat` على Windows أو `npm run setup` على الاستضافة لضبط رقمه وتوليد بياناته الخاصة.

```bash
npm run package:public
```

Creates a ZIP in the system temporary directory containing only approved source/assets/docs and empty data placeholders. Inspect Git before publishing: ignore rules do not erase previously tracked secrets or repository history.

ينشئ ZIP في المجلد المؤقت، يحتوي ملفات المشروع المسموح بها وهيكل البيانات الفارغ. راجع Git قبل النشر؛ `.gitignore` لا يزيل أسراراً كانت مرفوعة مسبقاً أو موجودة في التاريخ.


---

<div align="center">

**EDDINE-MD · SALAH EDDINE**  
**Built around useful commands, clear feedback and persistent data.**  
**أوامر مفيدة، حالة واضحة، وبيانات محفوظة.**

</div>

Pinterest image pins are delivered as images; video pins remain videos. Image downloads are limited to 25 MB and 8 million pixels.

صور Pinterest كيتصيفطو كصور، والفيديوهات كيبقاو فيديوهات. الحد: 25 MB و8 ملايين بكسل للصورة.

Video downloads prefer compatible MP4 tracks, then accept other yt-dlp formats. Non-MP4 output is converted locally to MP4; audio extraction accepts audio-only or combined media. Existing size and duration limits apply.

### Pinterest image search

`!pinterest dexter morgan` sends one random image without a caption or source link. Results are cached for 10 minutes; images avoid repeats within the current result pool per account/chat/query. History resets after a restart. Public Pinterest search needs no API key but may be unavailable on some hosts. Existing 25 MB limits apply to downloads.

`!pinterest dexter morgan` كيجيب صورة عشوائية بلا كتابة ولا رابط. الصور ما كتتعاودش فنفس الشات حتى يسالي النتائج المتاحة. سجل الصور كيتصفّر ملي كيتعاود تشغيل البوت.

### One Piece wanted poster

Reply to an image with `!wanted`: the reference poster keeps its original border, WANTED, DEAD OR ALIVE and MARINE lettering, and replaces the portrait, sender name and bounty. Reply to a text message to use that sender’s accessible profile picture. If the name is unavailable, use `!wanted Salah`; `!wanted Salah | 4000000000` sets a manual amount. Random bounties range from 10 million to 5 billion and avoid an immediate repeat per chat. Name and reward history follow available WhatsApp contact data; unknown names show MEMBER. No AI API is used.

دير reply على صورة وكتب `!wanted`: البوت كيحط الصورة، سميّة صاحبها والمكافأة العشوائية فـنفس نموذج One Piece. Reply على رسالة كيستعمل صورة البروفايل إلا كانت متاحة. تقدر تحدد السميّة بـ`!wanted Salah` أو السميّة والمكافأة بـ`!wanted Salah | 4000000000`.

## Automatic GitHub update / التحديث التلقائي

The main host owner can send `<prefix>update` (default `.update`) from any paired bot account. The command downloads the latest commit on the default branch of [Minato404E/Eddine-MD](https://github.com/Minato404E/Eddine-MD), compares file bytes and replies exactly `Bot already updated` when they match. It works without Git or a GitHub token for this public repository. Upload this complete release to the repository before using the command; older package versions are rejected to prevent accidental downgrade.

Repository files are copied into the existing project. `data/`, `config.json`, `panel.config.json`, `.env` files, auth/session folders, `tools/`, `node_modules/` and `.git/` are preserved. Existing extra local files are retained. ZIP contents and JavaScript syntax are validated before application. If package files change, the command automatically runs `npm ci --no-audit --no-fund`. Changed source files are backed up temporarily and restored on failure; dependency recovery also runs against the restored package. A successful update restarts the Node worker and reconnects saved sessions; the hosting process remains running. There is a brief service interruption while dependencies install and the worker reconnects. Launch with `node index.js` or `npm start` for this restart support. Internet access to GitHub and npm, disk space and write permissions are required. If the process is interrupted during an update, inspect the host files and run `npm install` if necessary; remove `.eddine-update.lock` only after ensuring no update is running. Do not edit project files while an update is in progress.

الـowner الرئيسي يرسل `.update`، أو الأمر بالـprefix الحالي ديال الحساب. البوت كيحمّل آخر commit من GitHub ديالك ويقارن الملفات؛ إلا نفس المحتوى كيجاوب `Bot already updated`. خاصك ترفع هاد النسخة كاملة للمستودع أولاً، حيث النسخ القديمة كيتم رفضها.

التحديث كيحافظ على `data` وconfig وملفات الربط والأسرار والأدوات المحلية. كيتحقق من الملفات قبل تبديلها، وكيثبّت المكتبات تلقائياً إلا تبدلات ملفات package، ثم كيعاود يشعل البوت ويربط الحسابات المحفوظة. إلا فشل التحديث كيرجع الملفات السابقة. شغّلو بـ`node index.js` أو `npm start`، وخلي الاتصال بـGitHub وnpm خدام.


## Group controls and bilingual commands / إدارة المجموعة والأوامر بالعربية

Host Inbox has been removed: no conversation-viewing pages, Inbox endpoints or message archive. Upgrading automatically deletes the old live Inbox tables and consent fields while preserving pairing, economy and configuration. External copies/backups remain under your control. Pairing no longer asks for Inbox approval.

| Command | Arabic | Usage |
| --- | --- | --- |
| `.mute` | `.كتم` | Tag or reply to a group member; their new messages, including media, are deleted until unmuted. |
| `.unmute` | `.إلغاء_الكتم` | Tag or reply to allow that member’s messages again. |
| `.profile` | `.بروفايل` | Tag or reply for their WhatsApp photo; without a target, keeps the economy profile card. |
| `.avatar` | `.صورته` | Tag, phone number or reply for their WhatsApp photo, including in private chats. |
| `.antilink on` | `.منع_الروابط تشغيل` | Block all detected links, including social links and bare domains; old `whatsapp` mode also checks all links. |
| `.antilink off` | `.منع_الروابط تعطيل` | Disable link moderation. |
| `.add 2126…` | `.إضافة 2126…` | Add a WhatsApp member; if addition fails, send the group invite privately. |
| `.menu group` | `.القائمة مجموعة` | Group commands in English; `.اوامر مجموعة` for Arabic. |
| `.menu all` | `.القائمة الكل` | Full text list; hidden owner actions are not listed. |

Mute/unmute/add require both the caller and bot to be group admins. The bot and group owner cannot be muted. Mutes survive restarts; WhatsApp still accepts the member’s message, then the bot deletes it when received. This needs the bot online and able to delete messages. Antilink retains the admin/owner/sudo exemptions and three-warning removal policy. Profile photo availability depends on WhatsApp privacy settings. Invitation failure is reported honestly; no successful addition is claimed when only an invitation was sent.

تحيّد Inbox ومشاهدة المحادثات وتسجيلها. فالتحديث كيتم مسح الأرشيف القديم من قاعدة البيانات بلا مساس بالـpair والإعدادات والاقتصاد؛ النسخ الخارجية خاصك تدبرها بنفسك. `كتم` كيبقى بعد restart وكيحذف الرسائل الجديدة حتى تدير `إلغاء_الكتم`؛ البوت خاصو يكون متصل وأدمن. `بروفايل` بالـtag أو reply كيجيب صورة واتساب إذا كانت متاحة. `إضافة` كتبعث رابط الدعوة فالخاص إلا ما قدرش يزيد العضو مباشرة.

كل أمر عندو اسم عربي بنفس الوظيفة والصلاحيات. `.menu` كيبيّن الإنجليزية و`.اوامر` كيبيّن العربية، بلا خلط بيناتهم. الأسماء اللي فيها كلمات متعددة كتستعمل `_`. الـprefix الحالي خدام للإنجليزية والعربية. `القائمة` كتبيّن الأقسام، و`القائمة وسائط` أو `القائمة أدوات` كتبيّن أوامر القسم. أسماء الأوامر تترجم؛ معاملات الملفات والأرقام وروابط المواقع كتستعمل نفس الصيغة الموجودة فـhelp.

## v2.0: profile photos, separate menus and useful additions

`.menu` displays the English command list and English artwork. `.اوامر` / `.الأوامر` displays the Arabic list and Arabic artwork. Each category is organized independently, and `.menu group` / `.اوامر مجموعة` selects one category. Long lists are sent as text if they exceed the image-caption target. Hidden owner actions stay absent. All command aliases keep the current account prefix and the same permissions.

A bare Arabic `.منع_الروابط` (or `.مضاد_روابط`) toggles the group’s link filter: OFF → all links, enabled → OFF. English `.antilink` still requires `on` or `off`. Explicit on/off works with either command name. Admin privileges are still required.

Profile requests try the WhatsApp-native identity and resolved phone identity, full image and preview, with bounded lookup/download timeouts. Lookup/denied/no-photo/HTTP/transfer failures have distinct messages; a download failure is no longer misreported as privacy. The account can only retrieve photos WhatsApp makes available to it. `.profile` without a target still displays the registered economy card. Photo download is capped at 5 MB and `.profile`/`.avatar` requests run one at a time per paired account.

33 additional commands provide real group administration, persistent rules/nicknames/attendance, scheduled group settings, weekly/monthly virtual rewards, text utilities, and ordinary media copying. Duplicate spellings are aliases and are not counted as extra features. No arbitrary remote code execution, fabricated online/bot detection, anonymous abuse tools or conversation archives are added.

`vp` / `كشف` copies a quoted **ordinary** image/video into the same chat. View-once and disappearing media are refused before download; the sender can resend an ordinary copy. These exclusions also apply to other media-processing commands. Base64 is encoding, not secure encryption. Password generation is private-chat only. Fun replies are original phrases, not attributed quotations.

Scheduled `open`/`close` supports `1m` through `7d`, up to 50 pending jobs per account. It survives restarts and requires the bot online. At execution it fetches fresh membership and checks that both requester and bot remain admins; jobs older than a day past their deadline are dropped. Running/failed jobs are not automatically retried after uncertain outcomes. Nicknames are group-local (up to 3,000), and attendance keeps only the current local day, without message content.

Weekly rewards grant 3,000 virtual coins every seven days; monthly rewards 12,000 every 30 days, with persistent cooldown and registration required. `warnlimit` changes the default three-warning removal threshold to 1–10.

### الشرح بالعربية

`.menu` بالإنجليزية و`.اوامر` بالعربية، مع صورة مختلفة لكل لغة وقائمة منظمة بلا مزج. `منع_الروابط` بلا معاملات كيبدّل تشغيل/تعطيل غير إلا كان الاسم بالعربية؛ الإنجليزية كتحتاج `on` أو `off`. إصلاح البروفايل كيحاول الصورة الكاملة وpreview وكيبيّن واش المشكل من lookup، رفض واتساب، أو التحميل بدل ما يسمي كلشي privacy.

زدنا 41 أمر مفيد: طلبات الانضمام وقبولها/رفضها، صورة وقوانين المجموعة، الألقاب والحضور، حد ومسح الإنذارات، جدولة الفتح والإغلاق، مكافآت أسبوعية وشهرية، أدوات النص وألعاب. `كشف` و`vp` غير للميديا العادية؛ مرة واحدة والميديا المختفية ما كتتحمّلش، خاص المرسل يعاود يصيفط نسخة عادية. الجدولة كتحتاج البوت متصل وأدمن، وكتراجع صلاحيات طالبها عند التنفيذ.

### New commands / الأوامر الجديدة

| English | العربية | Usage |
| --- | --- | --- |
| `.members` | `.الأعضاء` | members |
| `.requests` | `.الطلبات` | requests (group admins) |
| `.accept` | `.قبول` | accept <request phone> (admins) |
| `.reject` | `.رفض` | reject <request phone> (admins) |
| `.groupavatar` | `.صورة_المجموعة` | groupavatar |
| `.setgroupavatar` | `.جروب_صورة` | setgroupavatar (reply to ordinary image; admins) |
| `.rules` | `.قوانين` | rules |
| `.setrules` | `.قوانين_تعيين` | setrules <group rules> (admins) |
| `.nick` | `.لقب` | nick <your nickname> or nick @member <nickname> (admins) |
| `.delnick` | `.حذف_لقب` | delnick [@member] (own nickname or admins) |
| `.nicks` | `.الألقاب` | nicks |
| `.mynick` | `.لقبي` | mynick |
| `.checkin` | `.حاضر` | checkin (daily attendance) |
| `.attendance` | `.قائمة_الحضور` | attendance |
| `.resetattendance` | `.مسح_الحضور` | resetattendance (admins) |
| `.warnlimit` | `.حد_الإنذارات` | warnlimit 1–10 (admins) |
| `.clearwarns` | `.مسح_الإنذارات` | clearwarns @member (admins) |
| `.allwarnings` | `.كل_الإنذارات` | allwarnings (admins) |
| `.schedule` | `.جدولة_الجروب` | schedule open / close 30m (admins; 1m–7d) |
| `.schedules` | `.جدولة` | schedules (admins) |
| `.cancelschedule` | `.إلغاء_جدولة` | cancelschedule <id> (admins) |
| `.weekly` | `.أسبوعي` | weekly (registered players; 7-day cooldown) |
| `.monthly` | `.شهري` | monthly (registered players; 30-day cooldown) |
| `.wordcount` | `.حساب_الحروف` | wordcount <text> or reply |
| `.base64` | `.تشفير` | base64 <text> or reply (encoding, not secure encryption) |
| `.unbase64` | `.فك_تشفير` | unbase64 <base64> |
| `.hash` | `.بصمة` | hash <text> or reply (SHA-256) |
| `.password` | `.كلمة_مرور` | password [length 8–64] (private chat only) |
| `.time` | `.وقت` | time (Morocco) |
| `.choose` | `.اختيار` | choose option A  /  option B [ /  option C] |
| `.vp` | `.كشف` | vp (reply to ordinary image/video; view-once excluded) |
| `.compliment` | `.مدح` | compliment |
| `.quote` | `.حكمة` | quote |

### All command aliases / جميع الأسماء

| English | العربية |
| --- | --- |
| `.menu` | `.القائمة` |
| `.help` | `.مساعدة` |
| `.info` | `.معلومات` |
| `.ping` | `.بينغ` |
| `.alive` | `.حي` |
| `.owner` | `.المالك` |
| `.dev` | `.المطور` |
| `.jid` | `.معرف` |
| `.public` | `.عام` |
| `.self` | `.خاص` |
| `.setname` | `.تغيير_الاسم` |
| `.setprefix` | `.تغيير_البادئة` |
| `.setimage` | `.تغيير_الصورة` |
| `.youtube` | `.يوتيوب` |
| `.autoreply` | `.رد_تلقائي` |
| `.sudo` | `.سودو` |
| `.pair` | `.ربط` |
| `.unpair` | `.فك_الربط` |
| `.settings` | `.إعدادات` |
| `.mystyle` | `.أسلوبي` |
| `.autobio` | `.بايو_تلقائي` |
| `.add` | `.إضافة` |
| `.mute` | `.كتم` |
| `.unmute` | `.إلغاء_الكتم` |
| `.kick` | `.طرد` |
| `.promote` | `.ترقية` |
| `.demote` | `.خفض` |
| `.tagall` | `.منشن` |
| `.hidetag` | `.منشن_مخفي` |
| `.open` | `.فتح` |
| `.close` | `.إغلاق` |
| `.lock` | `.قفل` |
| `.unlock` | `.فك_القفل` |
| `.groupinfo` | `.معلومات_المجموعة` |
| `.admins` | `.المشرفون` |
| `.grouplink` | `.رابط_المجموعة` |
| `.resetlink` | `.تجديد_الرابط` |
| `.setsubject` | `.اسم_المجموعة` |
| `.setdesc` | `.وصف_المجموعة` |
| `.delete` | `.حذف` |
| `.warn` | `.تحذير` |
| `.unwarn` | `.إلغاء_تحذير` |
| `.warnings` | `.تحذيرات` |
| `.antilink` | `.منع_الروابط` |
| `.antispam` | `.منع_السبام` |
| `.welcome` | `.ترحيب` |
| `.goodbye` | `.وداع` |
| `.setwelcome` | `.رسالة_الترحيب` |
| `.setgoodbye` | `.رسالة_الوداع` |
| `.aigroup` | `.ذكاء_المجموعة` |
| `.adminshop` | `.متجر_الإدارة` |
| `.activity` | `.نشاط` |
| `.members` | `.الأعضاء` |
| `.requests` | `.الطلبات` |
| `.accept` | `.قبول` |
| `.reject` | `.رفض` |
| `.groupavatar` | `.صورة_المجموعة` |
| `.setgroupavatar` | `.جروب_صورة` |
| `.rules` | `.قوانين` |
| `.setrules` | `.قوانين_تعيين` |
| `.nick` | `.لقب` |
| `.delnick` | `.حذف_لقب` |
| `.nicks` | `.الألقاب` |
| `.mynick` | `.لقبي` |
| `.checkin` | `.حاضر` |
| `.attendance` | `.قائمة_الحضور` |
| `.resetattendance` | `.مسح_الحضور` |
| `.warnlimit` | `.حد_الإنذارات` |
| `.clearwarns` | `.مسح_الإنذارات` |
| `.allwarnings` | `.كل_الإنذارات` |
| `.schedule` | `.جدولة_الجروب` |
| `.schedules` | `.جدولة` |
| `.cancelschedule` | `.إلغاء_جدولة` |
| `.register` | `.تسجيل` |
| `.profile` | `.بروفايل` |
| `.balance` | `.رصيد` |
| `.daily` | `.يومي` |
| `.job` | `.وظيفة` |
| `.jobs` | `.وظائف` |
| `.work` | `.عمل` |
| `.shop` | `.متجر` |
| `.buy` | `.شراء` |
| `.inventory` | `.حقيبة` |
| `.use` | `.استعمال` |
| `.bank` | `.بنك` |
| `.deposit` | `.إيداع` |
| `.withdraw` | `.سحب` |
| `.pay` | `.تحويل` |
| `.rob` | `.سرقة` |
| `.rich` | `.الأغنياء` |
| `.weekly` | `.أسبوعي` |
| `.monthly` | `.شهري` |
| `.hug` | `.حضن` |
| `.slap` | `.صفعة` |
| `.punch` | `.لكمة` |
| `.kickgif` | `.ركلة` |
| `.marry` | `.زواج` |
| `.kiss` | `.قبلة` |
| `.pat` | `.تربيت` |
| `.cuddle` | `.عناق` |
| `.handhold` | `.مسك_اليد` |
| `.highfive` | `.كف` |
| `.poke` | `.نكزة` |
| `.bite` | `.عضة` |
| `.bonk` | `.ضربة` |
| `.feed` | `.إطعام` |
| `.tickle` | `.دغدغة` |
| `.wave` | `.تلويح` |
| `.wink` | `.غمزة` |
| `.dance` | `.رقص` |
| `.cry` | `.بكاء` |
| `.laugh` | `.ضحك` |
| `.smile` | `.ابتسامة` |
| `.blush` | `.خجل` |
| `.facepalm` | `.يا_لطيف` |
| `.happy` | `.فرح` |
| `.handshake` | `.مصافحة` |
| `.carry` | `.حمل` |
| `.mines` | `.حقوق` |
| `.mix` | `.دمج_إيموجي` |
| `.csticker` | `.ملصق_نص` |
| `.sround` | `.ملصق_دائري` |
| `.remini` | `.تحسين` |
| `.wanted` | `.مطلوب` |
| `.jail` | `.سجن` |
| `.rip` | `.قبر` |
| `.sketch` | `.رسم` |
| `.qr` | `.رمز` |
| `.readqr` | `.قراءة_رمز` |
| `.topdf` | `.إلى_بي_دي_إف` |
| `.frompdf` | `.صور_بي_دي_إف` |
| `.zip` | `.ضغط_ملفات` |
| `.unzip` | `.فك_ضغط` |
| `.compress` | `.تقليل_الحجم` |
| `.tomp3` | `.إلى_صوت` |
| `.tovn` | `.إلى_فويس` |
| `.trim` | `.قص` |
| `.speed` | `.سرعة` |
| `.merge` | `.دمج` |
| `.gif` | `.متحرك` |
| `.reverse` | `.عكس` |
| `.ocr` | `.قراءة_نص` |
| `.sticker` | `.ملصق` |
| `.toimg` | `.إلى_صورة` |
| `.instagram` | `.إنستغرام` |
| `.tiktok` | `.تيكتوك` |
| `.facebook` | `.فيسبوك` |
| `.twitter` | `.تويتر` |
| `.reddit` | `.ريديت` |
| `.pinterest` | `.بينترست` |
| `.vimeo` | `.فيميو` |
| `.dailymotion` | `.ديليموشن` |
| `.play` | `.أغنية` |
| `.ytmp3` | `.صوت_يوتيوب` |
| `.ytmp4` | `.فيديو_يوتيوب` |
| `.download` | `.تحميل` |
| `.avatar` | `.صورته` |
| `.createimage` | `.إنشاء_صورة` |
| `.send` | `.إرسال` |
| `.ai` | `.ذكاء` |
| `.forget` | `.نسيان` |
| `.translate` | `.ترجمة` |
| `.tts` | `.نطق` |
| `.calc` | `.حساب` |
| `.weather` | `.طقس` |
| `.remind` | `.تذكير` |
| `.reminders` | `.تذكيرات` |
| `.delremind` | `.حذف_تذكير` |
| `.poll` | `.تصويت` |
| `.wordcount` | `.حساب_الحروف` |
| `.base64` | `.تشفير` |
| `.unbase64` | `.فك_تشفير` |
| `.hash` | `.بصمة` |
| `.password` | `.كلمة_مرور` |
| `.time` | `.وقت` |
| `.choose` | `.اختيار` |
| `.vp` | `.كشف` |
| `.sessions` | `.حسابات` |
| `.stopbot` | `.إيقاف_البوت` |
| `.startbot` | `.تشغيل_البوت` |
| `.blockbot` | `.حظر_البوت` |
| `.unblockbot` | `.فك_حظر_البوت` |
| `.backup` | `.نسخة_احتياطية` |
| `.update` | `.تحديث` |
| `.updatemedia` | `.تحديث_التحميل` |
| `.compliment` | `.مدح` |
| `.quote` | `.حكمة` |

### v2.0.1 — Media memory improvements / تحسين استهلاك الرام

MathJS loads on the first `calc` command instead of at startup. A local commands-module startup measurement fell from about 212 MiB to 109 MiB; actual host usage varies with accounts and workload. `play` and `ytmp3` request audio-only formats, prefer up to 128 kbps, cap output at 10 MiB and limit FFmpeg input/output threads. Downloads upload from disk, and the media queue remains locked until upload completes; temporary files are removed on success or failure. Outbound message cache is capped at 1,200 entries. All commands remain available. This reduces memory use; it does not establish the cause of a remote host OOM or guarantee that a small host can support every workload.

مكتبة الحساب كتتحمّل غير مع أول استعمال لـ`calc`. القياس المحلي عند تحميل وحدة الأوامر نزل تقريباً من 212 لـ109 MiB. الصوت كيتحمّل بصيغة صوت فقط وبحد أقصى 10 MiB، وكيترسل من الملف مباشرة؛ عملية التحميل والإرسال كتحتافظ بدورها حتى تسالي. الملفات المؤقتة كتمسح حتى إلا فشل الإرسال، وكاش الرسائل الصادرة محدود. جميع الأوامر باقيين متوفرين. استهلاك الهوست الحقيقي كيتبدّل حسب الحسابات والاستعمال، وسبب الكراش كيحتاج لوج الهوست باش يتأكد.

### v2.0.2 — Games removed / حذف الألعاب

Removed `rps`, `guess`, `quiz`, `roll`, `coin`, `truth`, `dare` and `eightball`, their Arabic aliases, game sessions and menu entries. Useful group, download, media, economy and text commands remain available. This small removal does not by itself guarantee media downloads fit a 256 MiB host; the v2.0.1 streaming and startup memory changes remain in place.

تحيدات أوامر الألعاب الثمانية والأسماء العربية ديالها وجلسات اللعب من الرام. باقي الأدوات وأوامر الإدارة والتحميل والاقتصاد متوفرين. إصلاحات الرام والإرسال من الملف باقية، ولكن هوست 256 MiB يقدر يبقى محدود مع عمليات الميديا.

### v2.0.3 — Compact category menu / مينو الأقسام

`menu` shows a compact category directory with visible command counts and a navigation command for each category. `menu group`, `menu media` and other category selectors list commands in rows of three. `menu all` shows every category available to the caller. Arabic equivalents are `اوامر`, `اوامر مجموعة`, `اوامر وسائط` and `اوامر الكل`. Host commands and their count are shown only to the main host owner. Prefix and public/self mode stay dynamic. Commands themselves keep the same permissions.

المينو الرئيسية قصيرة وكتعرض الأقسام وعدد الأوامر وطريقة فتح كل قسم. الأوامر التفصيلية كيبانو ثلاثة فكل سطر، واللائحة الكاملة كتبان بـ`اوامر الكل`. الإنجليزية والعربية مفصولين، وقسم مالك الهوست ما كيبانش للمستخدم العادي.

### v2.1.0 — Styled text, developer card and rotating About / الخطوط ومعلومات المطور والبايو

English text uses Unicode sans-serif bold; Arabic uses WhatsApp bold and framed headings. The menu includes the requester's name, account uptime and bot process RAM, with independent English/Arabic navigation. Unicode command names still resolve through NFKC; styled English category names are also accepted. URLs, emails, phone/JID values and code blocks remain unchanged. `info` remains a Canvas image; `dev` / `المطور` is a text developer card with Salah Eddine's Moroccan contact, WhatsApp link, email, GitHub profile/source and the actual paired bot number.

Native `cta_copy` buttons are attempted for developer contact values, pairing codes, group invitation links, chat/user IDs, passwords, Base64, SHA-256 and OCR/QR text. Clipboard data uses the original value, never decorative Unicode. If native sending fails, is unavailable, or the body exceeds 3,500 characters, ordinary text with the value is sent instead. Accepted native messages may still fail to display buttons on some WhatsApp clients; clipboard buttons have not been live-tested against user accounts. No dependency fork is required.

All download commands send media without title/source captions, including random Pinterest images. Requested group invitation links and developer links are still shown because they are the result of those commands.

Each online paired account attempts to rotate About every five minutes between its connection uptime and `Owner: Salah Eddine`. It starts with uptime. `autobio on|off` / `بايو_تلقائي تشغيل|إيقاف` is available to that account's owner/sudo. New and existing accounts default to enabled unless explicitly disabled. Uptime resets on reconnection. Failed updates are logged and the next attempt waits five minutes; API attempts time out after eight seconds. WhatsApp may accept the request without reflecting it in the redesigned visible About, so visibility is not guaranteed. The existing scheduler is reused; no extra timer or heavyweight dependency is added.

المينو والرسائل ولات بخط إنجليزي مزخرف، والعربية بالـbold والإطارات. `info` باقية صورة Canvas و`dev` نص فيه معلومات Salah Eddine المغربي، واتساب والإيميل وGitHub ورقم البوت الحالي. أزرار Copy كتنسخ القيم الأصلية؛ إلا فشل الإرسال كتوصلك القيمة كنص. ظهور الزر كيتعلق بنسخة واتساب وما تجربش على حساب حي. أوامر التحميل كتصيفط الميديا بلا captions ولا روابط المصدر. البايو كيتبدّل كل خمس دقايق بين uptime واسم المالك؛ تقدر توقفو بـ`بايو_تلقائي إيقاف`. نجاح طلب واتساب ما كيضمنش ظهور التحديث عند الجميع.
