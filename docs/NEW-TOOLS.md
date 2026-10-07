# New tools — v1.4.0

Use numbers with country code, without spaces (e.g. 212…). Keep `data` and `tools` during upgrades.

| Command | Behavior |
|---|---|
| `.add <number>` | Group admin only; bot must be admin. Checks WhatsApp registration and existing membership. Privacy restrictions return an error; no automatic DM invitation. |
| `.send <message> <number>` | Account owner only. Sends exactly one message from this account. |
| `.send <message> | <number> [| <your paired bot number>]` | Same behavior with separators; optional source must be an account owned by the caller. No all-account fan-out. One-minute recipient cooldown. |
| `.createimage <description>` | Uses the configured AI provider and key; returns a generated image. Requires image-model access/quota/billing. Max 1000 characters, one generation at a time. |
| `.ytmp4 <YouTube link>` | Public YouTube video, max 8 minutes and 25 MB. Owner must enable `.youtube on`. |
| `.download <link>` | Detects a supported platform and downloads a public video. YouTube is video here; `.ytmp3` and `.play` remain audio. |
| `.facebook`, `.twitter`, `.reddit`, `.pinterest`, `.vimeo`, `.dailymotion` | Platform-specific public video commands, each followed by a link. Existing Instagram and TikTok remain supported. |

Media operations reject new work immediately while busy instead of creating a silent queue. Metadata has a 60-second subprocess timeout; download 180 seconds; conversion 120 seconds. First-time downloader installation may take longer. Retry counts are bounded. Full error tail is logged for diagnosis. No live provider/host success is guaranteed.

Image integration: Gemini `gemini-3.1-flash-lite-image`, `responseModalities: ["IMAGE"]`, default 5 attempts/day shared across accounts. Quota is separate from text/TTS. OpenAI `gpt-image-1`, low quality, one 1024×1024 PNG; bot conservatively retains a $0.10 budget reservation per attempted generation. This is a local budget debit, not a provider price claim. Provider-side billing/quota remains authoritative. Requests use existing keys; no public image proxy and no automatic paid-provider fallback.

Official API references consulted:
- https://ai.google.dev/gemini-api/docs/generate-content/image-generation
- https://developers.openai.com/api/reference/resources/images/methods/generate
- https://github.com/yt-dlp/yt-dlp/wiki/EJS

Live WhatsApp additions/delivery, image-model access and platform downloads must be tried on the user's host. Automated tests use mocked provider responses and executable downloader fixtures; no user credentials are used.

## Command progress (v1.4.1)

Media downloads/conversions, anime reactions, createimage, tts and updatemedia react to the original command message with ⏳ when starting, ✅ after the command and media delivery complete, or ❌ on failure. The same reaction is replaced, not posted as separate status messages. Error explanations remain. Reaction transport failures do not abort/retry commands. Download/image checking text was removed in favor of the progress reaction. Live rendering remains to be verified on WhatsApp.
