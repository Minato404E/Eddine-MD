# Private runtime data / بيانات خاصة

This folder is created and populated locally when you start the bot. The public distribution contains no database, session, API key, token, cookies or conversation history.

هذا المجلد يُملأ محلياً عند تشغيل البوت. النسخة العامة لا تتضمن قاعدة بيانات أو جلسة واتساب أو مفتاح API أو رمز لوحة أو كوكيز أو تاريخ محادثات.

Keep your existing data folder when upgrading. Stop the bot before making a complete private backup. Git ignores runtime contents; only this README and `.gitkeep` belong in the repository. Git ignore rules do not remove files already tracked: use `git rm -r --cached data` if you had committed private files previously, and revoke exposed credentials.

عند التحديث احتفظ ببياناتك القديمة. خذ نسخة خاصة والبوت موقوف. إذا سبق رفع بيانات خاصة إلى Git، فإن `.gitignore` لا يمسح تاريخها؛ أزلها من التتبّع وغيّر بيانات الدخول التي انكشفت.
