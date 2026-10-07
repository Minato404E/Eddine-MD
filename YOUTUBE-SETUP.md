# YouTube on a hosted bot

هاد النسخة كتقرا data/youtube-cookies.txt تلقائياً. ما خاصكش تبدّل index.js ولا تزيد --cookies بيدك.

1. استعمل حساب Google ثانوي: الحساب المستعمل مع yt-dlp ممكن يتعرّض للحظر. Cookies كتسمح باستعمال session ديالو؛ ما تشاركهاش ولا تبعثها فـWhatsApp أو الشات.
2. استعمل extension Get cookies.txt LOCALLY المذكورة فوثائق yt-dlp: https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp . ما تثبّتش extension القديمة Get cookies.txt بلا LOCALLY.
3. باش cookies ما يتبدّلوش بسرعة، سمح للـextension تخدم فـIncognito. سدّ أي نافذة Incognito أخرى، افتح نافذة جديدة وسجّل الدخول لـYouTube بالحساب الثانوي.
4. فـنفس التاب افتح https://www.youtube.com/robots.txt ثم خرج cookies ديال youtube.com فقط بصيغة Netscape، وسدّ النافذة. ما تخرجش cookies ديال جميع المواقع. الخطوات الرسمية: https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies . حذف الـextension بعد التصدير اختياري.
5. من Files ديال الـhost، ارفع الملف داخل data وسمّيه youtube-cookies.txt. ما ترفعوش عبر panel ديال البوت اللي خدام HTTP. محدود لـ1 MB، وصيغة Netscape ضرورية. البوت ما كيطبعش محتويات الملف، ما كيعرضهاش فالـpanel وما كيدخلهاش فالنسخ الاحتياطية ديال states.
6. جرّب YouTube MP3 برابط public قصير. ملف cookies كيتقرا مع كل طلب، ما محتاجش restart ملي تبدّلو. يبقى شرط تفعيل YouTube من owner، 8 دقائق و25 MB. الحسابات المرتبطة كتشارك session YouTube ديال الـhost. الطلبات ديال YouTube بينهم 10 ثواني على الأقل، ما كاينش إعادة محاولة لا نهائية. المحتوى private/paid/age-restricted ما مدعومش.

البوت كيستعمل نسخة مؤقتة بصلاحيات 600 من cookies لكل عملية وكيحذفها مع الملفات المؤقتة. cookies الأصلية كتبقى فـdata حتى تحذفها بيدك. Cookies اللي كيسيفطهم yt-dlp خلال الطلب ما كيتحفظوش فالملف الأصلي؛ إذا session انتهت، عاود التصدير.

Cookies ما كتضمنش النجاح. إلا باقي Sign in to confirm you're not a bot، السبب ممكن يرتبط بالـsession أو شبكة الاستضافة أو متطلبات PO Token. هاد النسخة ما فيهاش bgutil-ytdlp-pot-provider: خاص خدمة إضافية وإعداد حسب إمكانيات الـhost؛ ما تمش اختبارها هنا. ما تشتريش host آخر على أساس ضمان YouTube.

## JavaScript challenge failure

النسخة كتفعّل Node بمسار process.execPath وEJS من GitHub؛ Node 22 مدعوم رسمياً. Official standalone yt-dlp كيتضمن EJS. إذا ظهر n challenge solving failed، مول host يقدر يدير .updatemedia nightly من WhatsApp (أو .updatemedia stable للرجوع). التحديث كيتنفذ بآلية yt-dlp الرسمية، وما كيبدّلش cookies/data. التحميلات كتتسنى حتى يسالي التحديث. جرّب مرة؛ إذا فشل، صيفط كل التحذيرات ديال Console بلا cookies. nightly إصدار تجريبي وقد يبقى نفس المشكل. الـconsole يحتافظ بآخر 4000 حرف من stderr عوض 350 باش التحذيرات المبكرة تبان. هاد الخطأ وحده ما كيأكدش ضرورة PO Token.
