---
name: VEED
title: VEED
description: "VEED is a browser video editor with auto subtitles, translation and dubbing, AI avatars and voices, a screen recorder, and credit-based AI video generation."
date: "2026-08-12"
updated: "2026-11-27"
reviewed: "2026-11-27"
topics:
- ai-at-work
- multimodal-ai
audience:
- marketers
tags:
- video
- video-editing
- subtitles
- transcription
- ai-avatars
featured: false
related:
- guide:review-ai-captions-before-publishing
- glossary:automatic-captioning
- agent:caption-reviewer
summary: "VEED is an online video editor aimed at marketing and social teams. It adds automatic subtitles you can restyle and correct, translates and dubs them, records screen and webcam, and generates video, avatars and voices from prompts using plan credits. Free exports carry a watermark, and subtitle file downloads need the Pro plan."
url: https://www.veed.io
pricing: freemium
category: marketing
os:
- Web
- iOS
color: purple
alternativeTo:
- descript
- opus-clip
- heygen
- synthesia
faq:
- q: "How much does VEED cost?"
  a: "As of November 2026, VEED's pricing page lists Creator at $12 per user a month and Pro at $22 per user a month, both billed yearly, plus Enterprise at custom pricing. Creator includes 6,000 AI credits and Pro includes 18,000. Plans are charged per editor seat, and paying monthly costs more than the yearly rate."
- q: "Is VEED free to use?"
  a: "You can sign up and edit for free, but VEED's help center says every project exported from a free account, or without logging in, carries a VEED watermark that you cannot move or remove. Removing it needs a paid plan."
- q: "Can I download an SRT file from VEED?"
  a: "Yes, on Pro and Enterprise. VEED's help center says subtitle file download is available on those plans, in SRT, VTT or TXT. On any plan you can upload an existing SRT or VTT file, or burn the subtitles into the exported video."
- q: "Are VEED subtitles unlimited?"
  a: "On paid plans, yes, within a fair use limit of 50 hours a month. Translation is metered separately by the minute: translating a 30-minute video into one language uses 30 minutes of your allowance, and each further language uses 30 more. Unused minutes do not roll over."
---

[VEED](https://www.veed.io) is a video editor that runs in the browser, built for people who publish marketing, social and training video without a dedicated editor. You upload or record footage, cut it on a timeline, add subtitles and brand elements, and export. Around that editor VEED has added generative tools: text to video, AI avatars, voice cloning, dubbing and an AI clip generator, all drawing on a monthly or yearly credit allowance.

## Highlights

- **Auto subtitles.** Pick the spoken language and VEED transcribes the clip, or the whole project, into timed subtitles. You edit text and timing in a side panel, style them with presets, animations and auto-highlighted words, and add terms to a dictionary so names come out right next time. Words the model was unsure of are marked in orange.
- **Translation and dubbing.** Subtitles can be translated into another language, and the Pro plan lists translation into more than 50 languages. AI dubbing and a video translator replace the voice track as well as the text.
- **Timeline editing in the browser.** Trim, join, compress and convert video, remove backgrounds, add text, audio and images, and apply brand kits. There is also a screen recorder, a webcam recorder and a teleprompter.
- **AI generation.** Text to video, image to video, an AI clip generator for cutting long recordings into short ones, AI avatars, talking photos, eye-contact correction, an AI voice generator and voice cloning. These spend AI credits.
- **Audio cleanup.** An AI voice cleaner and background-noise removal for both audio and video files.
- **API.** [api.veed.io](https://api.veed.io/) exposes VEED's Fabric 1.0 video model, lip sync, background removal and clean-audio endpoints for developers.

## In an AI-assisted workflow

The most common job is captioning a finished cut:

1. Log in at [veed.io](https://www.veed.io), choose **Edit Video** and upload the file.
2. Open the **Subtitles** tab, choose the spoken language and click **Auto-subtitle**. Turn on **Detect Speakers** if several people talk (Pro and above).
3. Read every line against the audio. Start with the orange low-confidence words, then names, numbers and negations.
4. Pick a style preset, or adjust font, outline, background and animation.
5. Export the video with subtitles burned in, or download the SRT, VTT or TXT file (Pro and Enterprise).

VEED's [automatic-subtitle help page](https://support.veed.io/en/articles/11172739-how-to-add-subtitles-to-your-video-automatically) documents each step. Finish the edit before you generate subtitles: recutting the video afterwards can leave the cue timing out of step with the picture.

Speech recognition gets short function words wrong in ways that change meaning, so treat the first pass as a draft. The [caption-review guide](/guides/voice/review-ai-captions-before-publishing) walks through checking a frozen cut line by line, [automatic captioning](/glossary/automatic-captioning) explains where the errors come from, and the [caption reviewer](/agents/marketing/caption-reviewer) agent checks a correction ledger you supply. It reads text; it does not listen to the audio.

## Pricing

As of November 2026, [VEED's pricing page](https://www.veed.io/pricing) lists three paid tiers, charged per editor seat:

| Plan | Price (billed yearly) | AI credits | Notable inclusions |
| --- | --- | --- | --- |
| Creator | $12 per user a month | 6,000 | No watermark, unlimited auto subtitles, full audio and video catalog |
| Pro | $22 per user a month | 18,000 | Multiple brand kits, translation into 50+ languages, up to 144 hours a year of AI voice |
| Enterprise | Custom | Custom | Central team and data management, review mode, privacy controls |

Credits refresh when the subscription renews and do not carry over. Unlimited subtitles on paid plans are subject to a fair use limit of 50 hours a month, and translation is counted in minutes per target language. A free account lets you try the editor, with a watermark on every export. VEED offers a trial of paid features only to enterprise customers with at least three users.

## Good to know

VEED is a general editor with many AI features attached, so each specialised tool below does its one job in more depth. It runs in the browser, and the help center also documents an iOS app.

VEED's help center still names the entry paid plan "Lite" in places, while the pricing page calls it Creator. Check the pricing page for the current names before you buy.

Compared with [Descript](/tools/descript), VEED is timeline-first, where Descript has you edit the recording by editing its transcript, which suits podcasts and interviews better. [Opus Clip](/tools/opus-clip) is narrower: it turns one long video into many captioned short clips and scores them. For presenter-led avatar video, [HeyGen](/tools/heygen) and [Synthesia](/tools/synthesia) go further than VEED's avatar feature; the [AI avatar video generator comparison](/guides/comparisons/best-ai-avatar-video-generators-2026) covers that category. For generating footage from a prompt, see [Runway](/tools/runway) and [Kling](/tools/kling) in the [AI video generator comparison](/guides/comparisons/best-ai-video-generators-2026).
