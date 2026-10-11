# Validation — 2026-10-06

Environment: Linux, Node.js 24.19.0. The deliverable targets Windows with Node.js 24 or newer.

- Dependency installation completed using the pinned Baileys 7.0.0-rc14 release and package-lock.json.
- All 19 automated tests passed.
- Syntax checks passed for source, panel scripts, helper JavaScript and tests.
- Real FFmpeg/FFprobe image → WebP sticker → PNG conversion passed.
- SQLite transactional persistence, reopen, rollback, isolated state/auth and three-day expiry passed.
- Economy cooldowns, item effects, shield protection, balance conservation and cross-account 5% host fees passed.
- Owner/group/sudo/host permission checks passed; owner messages from the same linked phone work.
- Temporary admin refund, uncertain-promotion reconciliation and expiry retry passed with mocked WhatsApp responses.
- AI budget admission, retained reservations, provider limits, one-time notices and human-reply routing passed with mocked API responses. No paid API request was sent.
- Local panel authentication, safe API-key omission, origin checks and HTTP state passed.
- Full offline runtime started; authenticated panel state returned HTTP 200; graceful shutdown returned exit code 0.
- Packaging excludes dependencies, live data, credentials, sessions, API keys and panel tokens.

Not verified live: WhatsApp pairing/operations, native-flow bank button rendering on the user's phone, public-platform downloads, paid OpenAI text/voice responses, Windows registry startup and PowerShell/VBScript execution.
Browser rendering screenshot was attempted; Chromium was unavailable and the download endpoint returned an invalid archive, so no visual browser claim is made.

Run `npm test` and `npm run check` after setup. Pair and exercise the account on the user's PC to verify external integrations.


Node 22 host update (v1.1.3): all 28 tests passed on actual Node.js v22.23.3, including SQLite transactions, permissions, Gemini adapter mocks, panel authentication and real FFmpeg conversion. Direct node index.js --offline startup on v22.23.3 served panel HTTP 200, read existing SQLite data and exited cleanly with code 0 after SIGTERM. WhatsApp live pairing and the user's hosting environment were not exercised. npm 12's allowScripts entries follow its documented pinned package policy; fresh installation on the user's host is still required.

Remote host panel update (v1.1.4): all 30 tests passed on Node.js v22.23.3 and all JavaScript syntax checks passed. Tests cover remote 0.0.0.0 binding, configured public Host/Origin, token authentication, rejection of unknown hosts/origins, secret redaction, authorized settings changes, local defaults and environment precedence. External reachability and HTTPS on the user's hosting allocation were not verified.

Host downloader update (v1.1.5): all 33 tests passed on Node.js v22.23.3; JavaScript syntax checks passed. Installer tests cover libc/architecture selection, existing-tool reuse, checksum rejection without overwriting existing tools, successful replacement and temporary-file cleanup. Actual official Linux binary installation, SHA256 verification and version execution succeeded (2026.08.19). Live platform downloads and reachability from the user's host were not verified. Official binary is downloaded on demand and excluded from the portable ZIP.

YouTube cookies update (v1.1.6): 37 tests passed on Node.js v22.23.3 and syntax checks passed. Cookie tests cover Netscape formatting, YouTube-only domains, rejection of unrelated browser credentials, private temporary copies, original-file preservation, public-content restrictions and authentication diagnostics. End-to-end fake downloader test confirms both metadata and media commands receive cookies and temporary credentials are removed. No real user cookies were accessed; live YouTube authentication and PO Token providers remain unverified. PO Token plugin not installed in this version.

EJS diagnostics/update (v1.1.7): all 38 tests and JavaScript syntax checks passed on Node.js v22.23.3. New host-owner-only updatemedia command supports official yt-dlp stable/nightly updates through the media queue. Tests verify unauthorized callers cannot update, invalid channels are rejected before spawning, update/version calls and preservation of earlier EJS warnings beyond the old 350-character tail. Live nightly installation, authenticated YouTube challenge solving and host reachability remain unverified. Node/EJS flags already existed; this update improves update access and diagnosis, not a proven fix for the reported challenge.

Anime reactions (v1.2.0): all 41 tests passed on actual Node.js v22.23.3; JavaScript syntax checks passed. Includes 26 reaction commands and 52 bundled animated H264/yuv420p clips, two per command, each verified with FFprobe for multiple frames, duration and size. Command tests cover ordinary-user group reactions, captions, both mentions, reply quotation, required-target errors, private expressions and retaining kick admin permissions. Clips are selected locally without runtime API or yt-dlp use. Nekos.best source URLs/anime names are retained in assets/reactions/credits.json; marry uses romantic kiss-category clips. Live display/autoplay on the user's WhatsApp client was not tested. Deferred queue/status changes were removed from this release; prior shipped downloader behavior is preserved.

Owner writing style (v1.3.0): the 48-test Node.js v22.23.3 suite passed; all seven style tests were rerun successfully after the final prompt refinements; syntax checks passed. Tests cover opt-in human-only outgoing collection, generated-output receipts, account/conversation isolation, bounded weekly examples, SQLite persistence, saved-name vs notify-name handling, style/name prompt injection without extra learning requests, owner-only controls and first-notice delivery retries. Contact fields were checked against the installed Baileys Contact interface. Live contact synchronization, model similarity and WhatsApp behavior require user validation. This is local metrics/reference learning for generated replies, not model fine-tuning, historical inbox import or voice cloning; no exact-person replication is claimed.

Named mentions fix (v1.3.1): all 50 tests and syntax checks passed on Node.js v24.19.0. Tests cover LID/phone alias resolution, device suffix normalization, name lookup, reaction caption mentions, tagall/hidetag and actual Baileys generated-message contextInfo. The visible mention identifier now matches the same native JID included in mentionedJid, avoiding PN text vs LID metadata mismatch. Name labels are plain caption text with separate native mentions; arbitrary clickable custom names and actual tap behavior on the user's WhatsApp client are not claimed. The unavailable scratch Node22 runtime was not used in this validation.

New tools (v1.4.0): the 58-test suite and syntax checks passed on Node.js v24.19.0; an additional malformed-image decoding test and all image/Gemini tests were run after final diagnostics changes. Covers group addition permissions/privacy, single-account messaging/cooldown/ownership, bounded media admission, platform validation, MP4 vs MP3 arguments, generated image bytes and isolated quotas/budget. Uses API/downloader fixtures; live WhatsApp delivery, host downloads and image-model availability are unverified.

Command progress (v1.4.1): all 63 tests and syntax checks passed on Node.js v24.19.0. Tests verify original-message reaction keys, pending delivery before success, error transitions, suppressed AI error notices, ordinary-command exclusion and best-effort status transport. Actual WhatsApp rendering was not tested.

v1.5.0: all 74 tests and JavaScript syntax checks passed on Node.js v24.19.0. Actual local-tool tests cover static/animated WebP metadata preservation, neon/round stickers, five changed photo effects, Unicode QR round-trip, image PDF generation/rendering/compression, ZIP round-trip and traversal/expansion rejection, collection isolation/cleanup, playable audio/video MP3/Opus/trim/speed/GIF/reverse/compress/merge outputs, and bundled eng/fra/ara OCR recognition. Emoji mix 😂 + 🔥 fetched an actual gstatic image and produced a 17,588-byte WebP in a separate manual test. Image effects were visually inspected in a contact sheet. Public package tests prove exclusion of live data/configuration/tokens/tools and presence of Windows files; setup test preserves an existing private marker. Fresh extracted public ZIP rejects missing-owner startup; OWNER_NUMBER enables offline startup, HTTP panel 200, authenticated owner-specific state and graceful SIGTERM exit0. Actual WhatsApp linking/delivery, user-host 256 MB RSS and native Windows launcher execution remain unverified. Source data was not removed, replaced or packaged.

## Pinterest image fix (1.5.1)

Metadata accepts pins without video formats. Only HTTPS i.pinimg.com images are fetched, without redirects, with a 20-second timeout, streamed 25 MB bound, image signature and pixel checks. Regression tests cover image selection, invalid hosts/bytes, oversized downloads and metadata-only image pins.

## Pinterest video formats (1.5.3)

Pinterest uses a best* selector for Pinterest video-list formats, allowing unknown height and falling back when only higher resolution is available, under the existing 25 MB cap. The installed yt-dlp selector was exercised offline on metadata fixtures for silent 1080p, unknown height/codecs, and merged 720p videos. Downloader regression and existing YouTube selection tests pass. Real Pinterest network downloads remain unverified from this environment.

## Pinterest keyword search (1.6.0)

Public search fetched 25 results for Dexter Morgan, and the Node implementation downloaded one real image (59,135 bytes). 81 tests pass. Tests cover result parsing, CDN filtering, per-chat no-repeat cycling, cached results, and empty searches. Search caches are capped at 100 queries for 10 minutes; history at 256 account/chat/query keys, 50 IDs each. Search responses are streamed with a 5 MB cap. Platform availability and search relevance depend on Pinterest.

## Wanted reference poster (1.6.1)

84 tests pass. Rendering uses the user-provided 735×1078 reference poster, replacing portrait/name/bounty while keeping original frame and headings. Visual preview inspected. The reply-to-text integration test verifies member identity, profile download and portrait placement. Random/manual bounty tests validate amounts and prevent an immediate repeat. WhatsApp production delivery and private profile access are dependent on the connected account.


## Consent-based Host Inbox (1.7.0)

90 automated tests pass on Node.js v24.19.0. Inbox tests cover explicit account-owner pairing approval, default locked accounts, cross-account isolation, ordinary incoming/outgoing archiving, duplicate events, SQLite restart persistence, bounded retention, deletion/edit handling, view-once/disappearing-content exclusion, revocation/purge, online-only replies and request idempotency, token authentication and panel inability to grant another account’s consent. Headless Chromium exercised token login, 100+15 message pagination, reply submission, desktop/mobile layout, locked account switching and live revocation clearing displayed messages. Screenshots were inspected using synthetic accounts only. Actual WhatsApp pairing, production media retrieval, message delivery and existing host deployment remain unverified; historical conversations are available only if WhatsApp supplies them.


## Automatic repository update (1.8.0)

96 tests and all JavaScript syntax checks pass on Node.js v24.19.0. Six updater tests cover exact byte comparison/no-change response, private data/config/runtime preservation, install failure and rollback, unsafe paths/symlinks/invalid syntax rejection, downgrade prevention, immutable GitHub commit resolution, concurrent lock and network-error cleanup, main-host-owner authorization/current-prefix help, and automatic worker restart on exit code 75. The real public GitHub archive at commit 76b1ebe651207637131f2b58e3e79ebfff914d11 was downloaded and validated/applied to a temporary isolated project: 131 files from v1.5.0, private data marker retained. Dependency installation was stubbed for that isolated archive check; live npm replacement, Windows runtime behavior, WhatsApp reconnect and deployment on the user's host are unverified. That remote release is older than this v1.8.0 and the live updater will refuse it until the new release is uploaded. Abrupt process/power loss during file replacement is not transactionally recoverable; temporary backups and a lock help identify interrupted work, while handled errors roll back source files.


## Group moderation, Arabic commands and Inbox removal (1.9.0)

100 automated tests pass on Node.js v24.19.0, including nine new integration/permission tests and one updater cleanup test. Coverage includes persistent mute/unmute, deleting media messages before command handling, no warning escalation for muted messages, generic/bare-domain links under both new and legacy antilink modes, private invitation fallback and delivery errors, selected profile pictures/privacy errors, all 152 visible English/Arabic alias pairs, actual Arabic message parsing with changed prefix, category menus, hidden paired-owner-only removal with confirmation/fresh membership/admin checks, protected bot/group owner, legacy archive/consent purge with pairing and economy retention, inaccessible Inbox API/pages and disclosure-free pairing. Updater removes obsolete Inbox source/pages/tests with rollback on handled failures. Menu artwork was rendered locally and visually inspected. WhatsApp production deletion, profile access, invitation delivery, mass removals and client menu rendering are not exercised against live accounts.

Fresh extracted v1.9.0 public ZIP: offline Node entry startup, authenticated panel state and normal panel shutdown succeeded. Archive excludes all Inbox source/pages/tests, and panel HTML has no Inbox links/disclosure controls. Dependencies were reused through a temporary node_modules symlink for this startup check; a fresh network dependency install was not repeated.


## Separate menus, profile diagnostics and 41 useful commands (2.0.0)

112 tests pass on Node.js v24.19.0. New tests cover native/phone photo lookup, preview fallback and bounded SDK calls, privacy-vs-network-vs-HTTP errors, single-language menu text and actual matching artwork, Arabic-only bare antilink toggle, all 193 advertised aliases/implementations, LID-aware pending-request approval/rejection, nickname ownership and persistent attendance/rules, configurable warning threshold, registered reward cooldown, fresh scheduled-admin authorization and single execution, text encoding/count/hash/password validation, game isolation/expiration, ordinary-media copying and rejection of all view-once/disappearing forms before any download. Both menu artworks were visually inspected. Direct live WhatsApp photo access, join approvals, image updates and scheduled group changes on the user's host remain unverified. Trivia questions and fun prompts are local fixtures; no external API is needed for those. View-once preservation is deliberately not implemented.

Fresh v2.0.0 ZIP passed offline startup, authenticated panel state and normal shutdown from an isolated extraction, with existing dependencies linked temporarily. Lock-file dependency versions were checked against their archive URLs and npm ci --dry-run --ignore-scripts --offline passed. A stale wasm-feature-detect version label was corrected to match its unchanged 1.9.0 archive/integrity. A full new network installation was not performed.
