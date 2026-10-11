# Agreed decisions — 60 questions

1. Run on the user's Windows PC.
2. Bot name: Eddine-MD.
3. Prefix: .
4. Bot interface language: English.
5. Pairing code; .pair for other users; same PC host, private per-account data.
6. Everyone may request .pair.
7. Maximum 10 simultaneous accounts, including primary.
8. Customizable name/prefix/menu; .info credits Salah Eddine and shows host RAM/CPU.
9. Default SELF, until account owner enables public mode.
10. Scope commands correctly to groups/private/both.
11. Menu photo with categorized commands underneath.
12. Supplied Christian Camargo photo is the menu image; other images to be supplied later.
13. All proposed core group admin commands.
14. Antilink deletes and warns; remove after 3 warnings.
15. Group admins select link types per group.
16. Configurable welcome/goodbye with photos, individually enabled per group.
17. Manual warns and three-warning removal.
18. Configurable antispam per group.
19. Activity counts messages only (no message levels/XP).
20. Activity today, week and all-time.
21. Economy with usable shop items.
22. Mandatory registration; registration Canvas card; Canvas replies have no text caption.
23. Starting balance 200 coins.
24. Shared balance across groups within each bot account.
25. Daily reward 500 coins.
26. Choose and develop a profession.
27. Work cooldown 30 minutes.
28. Income tools, rewards and shields; expensive purchase of group admin.
29. Admin price: 20,000 coins.
30. Admin lasts one week.
31. Robbery mostly succeeds; purchased shield protects. Implementation: 80% success / 20% failure.
32. .bank card with bank/wallet balances and Deposit/Withdraw buttons.
33. Transfer fee reaches primary host Salah Eddine; owner can use bot from same WhatsApp number.
34. Transfer fee 5%.
35. No coin wagering games.
36. No quiz, words, guessing or XO games.
37. Stickers from images/videos; sticker to image.
38. Instagram/TikTok video; YouTube MP3 only and disabled until owner enables.
39. YouTube search by song name and direct URL.
40. YouTube audio duration cap 8 minutes.
41. AI text, voice replies, per-number and group memory, .aigroup without prefix.
42. Contextual targeting: respond to AI-directed messages/replies, avoid human-to-human conversation.
43. Reply in voice to an incoming voice message.
44. AI adapts its personality to conversation.
45. AI replies in user's language.
46. Translation/TTS/calculator/weather.
47. Persistent reminders.
48. WhatsApp polls.
49. .autoreply on enables AI in private chat and announces it is AI at the first encounter.
50. Sudo users per account.
51. Host can list/stop/block linked accounts.
52. Account owner can unpair.
53. Keep unpaired data for 3 days, then purge.
54. Robust automatic saving, accounting for unexpected shutdown; SQLite transactions, snapshots and graceful close.
55. Reconnect after network returns; resume active accounts after program restart.
56. Automatic start on Windows login with a stop control.
57. Local browser host panel.
58. Primary owner number is private per installation: config.json / OWNER_NUMBER / existing database owner.
59. PC RAM: 16 GB.
60. AI may use paid API within a chosen budget; stop at cap, one limit notice per chat/cycle, known next availability or honestly unknown.

Implementation choices: API fallback for text+voice (Plus audio route unavailable in reviewed docs), initial API budget 0 until selected; primary fees collected across account namespaces; safe group-owner opt-in for admin purchases; consumable details documented in README.


2026-10-06 update authorized: Gemini free-tier text, transcription and synthetic voice; selectable provider in panel, isolated provider keys. Legacy installs retain OpenAI until explicitly switched. Default Gemini local caps: 100 requests/model/day, 5 TTS requests/day, 5 requests/model/minute. These are local caps, not advertised Google quotas. No automatic paid fallback. Failed voice generation sends the completed text reply; introductions are sent only after an AI reply succeeds. Free-tier billing setup and data-use disclosure are in README/panel.

2026-10-06 HTTP 404 fix: Google limits Gemini 2.5 to prior active users. New installs and old 2.5 selections now use Gemini 3.5 Flash-Lite, with Gemini 3.8 Flash selectable and Gemini 3.8 Flash-Lite TTS for voice. Gemini 3 thinking levels replace the old 2.5 thinkingBudget parameter. Model-specific 404 messages and redacted host-only provider diagnostics aid diagnosis. Legacy keys, request counters and account data are preserved.

2026-10-06 host entry update: direct cross-platform `node index.js`, npm start points to the root entry, Node 24 minimum checked before importing SQLite runtime. Host ZIP extracts index.js/package.json/src directly into the server folder. No OS assumption or Windows launcher required.

2026-10-06 Node 22 compatibility: permit Node 22.13+ and Node 24+, matching SQLite's no-flag availability. Runtime code uses DatabaseSync operations already available on Node 22. Baileys rc14 requires Node 20+, not 24. Pin npm 12 allowScripts approvals to Baileys rc14, ffmpeg-static 5.3.0 and protobufjs 7.6.6; retain data and rebuild dependencies on the host.

2026-10-06 remote host panel: Remote panel settings are installation-specific and excluded from public releases. Existing bearer token and exact Host/Origin protections retained. Logs show public URL without token. Node 22 compatibility unchanged. HTTPS requires the host's reverse proxy; no TLS termination is claimed.

Anime reactions: bundled local GIF-playback MP4 clips avoid runtime downloader/API dependencies on the hosting account. Two clips per action are chosen randomly. Target commands accept a mention or quoted message; expressions can omit a target. Captions and both participant mentions accompany the animation. The existing administrative kick command remains unchanged; kickgif is the anime reaction. marry is a playful caption with romantic anime clips and does not change stored relationships or balances. Source credits are bundled.

Owner style is opt-in per linked account. Collect only new human outgoing text, exclude commands/generated output and keep bounded same-conversation examples. Common style features/expressions adapt locally on every eligible message; other private conversations' raw examples never enter the current prompt. Replies disclose automation once per chat and remain honest if asked. Use owner-saved contact names from synchronized Baileys contacts, not unverified sender notify labels. Voice uses the existing TTS provider voice, not a clone of the owner. Live records are SQLite-backed; backups may retain prior examples after clear.

2026-10-07 v1.5.0: 24 approved local commands implemented; public release uses per-install owner configuration, an empty data scaffold, local panel template, Windows setup/start/stop/restart/panel launchers, bounded local processing, bundled OCR language data and a public-archive allowlist.
