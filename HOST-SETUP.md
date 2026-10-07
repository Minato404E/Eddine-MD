# Node host / استضافة Node

Extract the ZIP at the server root. Entry file: `index.js`. Use Node 22.13+ (22 series) or 24+.

```bash
npm ci --no-audit --no-fund
npm run setup
npm start
```

For a non-interactive host set `OWNER_NUMBER` to your WhatsApp number with country code. Configure the panel allocation with `PANEL_HOST`, `PANEL_PORT` and `PANEL_URL`, or private `panel.config.json`. The default is local only; remote hosts need their own allocation/public URL. Open the panel and use the private token from `data/panel-token.txt` to request a pairing code.

عند الاستضافة غير التفاعلية اضبط `OWNER_NUMBER` برقمك مع رمز الدولة. اضبط `PANEL_HOST` و`PANEL_PORT` و`PANEL_URL` أو ملف `panel.config.json` الخاص حسب الاستضافة. الإعداد الافتراضي محلي، والاستضافة تحتاج عنوانها ومنفذها. افتح اللوحة واستعمل رمزك من `data/panel-token.txt` لطلب كود الربط.

Upgrades: stop, replace source files, keep `data`, `config.json`, `panel.config.json` and `tools`, run npm ci, restart. Do not upload local node_modules. Old database owners remain recognized.

التحديث: أوقف البوت، بدّل ملفات المشروع واحتفظ بـ`data` و`config.json` و`panel.config.json` و`tools`، ثبّت المكتبات وأعد التشغيل. لا ترفع node_modules من PC. مالك قاعدة البيانات القديمة يبقى معتمداً.

Use `node index.js --offline` to test startup/panel without linking WhatsApp. See README.md for all 148 commands and Windows launchers.
