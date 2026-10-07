<div align="center">

# ✦ EDDINE-MD ✦

### Your WhatsApp. More possibilities.
### واتسابك، بإمكانيات أكثر

**Multi-account WhatsApp bot · بوت واتساب متعدد الحسابات**

`v1.5.0` · `148 commands` · `26 anime reactions` · `10 active accounts`

**Project owner & developer: Salah Eddine**  
**مالك المشروع والمطوّر: صلاح الدين**

[English guide](#english-guide) · [الدليل العربي](#arabic-guide) · [Commands / الأوامر](#command-reference) · [Local tools / الأدوات المحلية](#local-tools)

</div>

---

> **Release / الإصدار:** v1.5.0 includes the 24 approved local-tool additions. / يشمل v1.5.0 الإضافات المحلية الـ24 المتفق عليها.

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

**Eddine-MD** بوت واتساب لإدارة المجموعات، تحميل الوسائط، إرسال تفاعلات الأنمي، الاقتصاد الافتراضي وأدوات الذكاء الاصطناعي. يدعم حتى **10 حسابات نشطة**، مع إعدادات وبيانات مستقلة لكل حساب. عدد الأوامر المعلنة في النسخة الحالية هو **148 أمراً**.

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
| `.wanted [name \| reward] (reply to image)` | Create a WANTED poster with name and reward. | إنشاء بوستر مطلوب بالاسم والمكافأة. |
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
| `.pinterest <link>` | Download a public pinterest video link. | تحميل رابط فيديو عام من pinterest. |
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

The v1.5.0 code passed **74 automated tests** and syntax checks on Node.js 24.19.0. Fresh public-package offline startup and panel authentication were also verified. These cover persistent state, economy, permissions, AI budget/quota behavior, downloader fixtures, real media conversions, mentions and progress transitions.  
اجتاز v1.5.0 **74 اختباراً آلياً** وفحص الصياغة على Node.js 24.19.0، مع تجربة تشغيل النسخة العامة من مجلد جديد والتحقق من اللوحة.

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
