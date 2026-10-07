# Local tools v1.5.0

All 24 accepted features are dispatched from the command engine. Replies and caption commands are supported where an image/media input is needed. See `.help <command>` and README.md for each syntax.

## Collection workflow

`topdf`, `zip` and `merge`: start the command, send files in the same chat from the same account, then `<command> done`. `<command> cancel` removes the inputs. Replying to one image/file with topdf/zip processes it directly. Each collection lasts ten minutes and accepts 8 files / 25 MB combined. Collections are disk-backed, separated by bot account + sender + chat and removed after processing/cancel/expiry or clean shutdown. A wrong done command does not delete another collection. Files are temporary, not stored in the database or archived for other users.

## Processing

One local job at a time shares admission with the existing media converter/downloader. Separate Node child process (128 MB V8 heap, not an OS RSS cap), 120-second timeout, OCR 180 seconds. Native libraries/FFmpeg/WASM allocate outside this heap, so the app does not claim a hard 256 MB total-memory guarantee. Source image limit 8 million pixels; normal effects scaled to 1200px. Reverse scales to 320px at 12fps; GIF to 480px at 12fps; both are silent and limited to 15 seconds. Other clips and merged duration are limited to five minutes.

ZIP extraction prechecks count, unsafeOriginalName, symlinks and declared expanded sizes, then bounds streamed expansion to 25 MB. Files are returned as attachments, never executed. File names are flattened and sanitized. PDFs up to 8 pages are rendered sequentially with PDF.js; embedded JavaScript is not evaluated. Compression rasterizes PDF pages and cannot preserve search/form fields. Non-smaller compressed outputs retain the original.

Sticker author/pack EXIF uses node-webpmux, preserving existing animated frames. Neon text is fixed cyan. sround is a center-cropped circular sticker. remini is a local contrast/noise/sharpness filter, not face restoration. QR uses qrcode/jsqr. OCR uses bundled Apache-licensed tessdata_fast eng/fra/ara and Tesseract.js; no API. Emoji Kitchen uses bundled combination mappings, with Google gstatic artwork retrieved on demand; no API key. Unsupported combinations return a message.

Runtime integration with a real WhatsApp client and deployment on the user's Windows/256 MB host still require user-side validation. Automated tests exercise actual outputs, not just command registration.
