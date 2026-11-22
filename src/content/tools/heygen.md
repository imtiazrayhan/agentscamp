---
name: "HeyGen"
description: "HeyGen is an AI video platform for avatar videos, video translation with lip-sync, voice cloning and prompt-to-video, with a v3 API, a CLI and an MCP server."
seoDescription: "HeyGen in 2026: Avatar 6, video translation in 175+ languages, the v3 API after the v1/v2 sunset, consent rules, LiveAvatar, and prices as of November 2026."
date: 2026-11-11
reviewed: 2026-11-22
url: "https://www.heygen.com"
pricing: "freemium"
category: "design"
color: "purple"
os: ["Web", "iOS", "Android"]
topics: ["multimodal-ai", "ai-at-work"]
audience: ["marketers", "designers", "sales"]
tags: ["heygen", "ai-avatar", "video-translation", "lip-sync", "voice-cloning", "api", "mcp"]
featured: false
alternativeTo: ["synthesia", "veed", "descript"]
sameAs: ["https://en.wikipedia.org/wiki/HeyGen", "https://github.com/heygen-com", "https://www.linkedin.com/company/heygen", "https://x.com/HeyGen", "https://www.youtube.com/@heygen_official"]
related: ["tool:synthesia", "tool:veed", "tool:descript", "tool:elevenlabs", "guide:best-ai-avatar-video-generators-2026", "guide:ai-localization-review-workflow", "glossary:ai-avatar", "glossary:voice-cloning", "skill:avatar-video-script-writer"]
keywords: ["HeyGen", "HeyGen pricing", "HeyGen Avatar 6", "HeyGen API", "HeyGen video translation", "HeyGen LiveAvatar"]
summary: "HeyGen is an AI video platform that turns a script into a talking-avatar video with a stock presenter or your own digital twin, translates existing videos with voice cloning and lip-sync, and exposes the same features through a v3 API, a CLI and an MCP server. Avatar 6 arrived in November 2026; real-time avatars now live in a separate product, LiveAvatar."
faq:
  - q: "How much does HeyGen cost?"
    a: "As of November 2026 HeyGen's pricing page lists Free at $0 with three watermarked videos a month of up to one minute each, Creator at $29 a month or $24 a month billed annually, Pro from $49 a month or $41 a month billed annually, Business at $149 a month or $119 a month billed annually plus $20 per seat per month, and Enterprise by quote. API usage is priced separately: self-serve rates appear after you sign in to the API dashboard at platform.heygen.com, and Enterprise contract pricing is not published."
  - q: "Does HeyGen have an API?"
    a: "Yes, and only one version is supported now. HeyGen's developer docs say API v1 and v2 reached end of support on October 31, 2026 and that v3 is the supported API, with calls to the old versions able to fail intermittently until removal is complete. The same API key authenticates the HeyGen CLI, and an MCP server exposes HeyGen tools to assistants over OAuth, billed to your subscription credits."
  - q: "Can I make a HeyGen avatar of another person?"
    a: "Only with their explicit consent. HeyGen's moderation policy prohibits creating avatars of other individuals unless the person represented has given explicit consent, and for a video-based digital twin that person must record their own consent video, reading HeyGen's consent statement, which in the standard webcam flow includes a spoken code. Two exceptions are documented: Enterprise accounts can upload a consent video or, after signing an indemnity agreement, skip the consent flow; and photo avatars get no consent check at all, so getting the subject's agreement is your job."
  - q: "What happened to HeyGen's interactive avatars?"
    a: "They moved to LiveAvatar, which HeyGen's help center calls the official production version of its Interactive Avatar, hosted on a separate platform at liveavatar.com with its own plans, its own credit system and its own documentation at docs.liveavatar.com. It runs in FULL mode, where HeyGen manages speech recognition, the LLM, speech synthesis, turn-taking and memory, or LITE mode, where you keep your own agent or LLM."
---

HeyGen is an AI video platform built around talking avatars. You write or paste a script, choose a stock presenter or a digital twin trained on your own footage, and HeyGen renders the video with a cloned or synthetic voice. The same platform translates videos you already have, with voice cloning and lip-sync, and generates short clips from prompts with its own HeyGen Video 1 model. It runs on the web, with iOS and Android apps.

It suits anyone who needs a presenter on camera without booking one: marketers, sales teams, and training teams exporting lessons to an LMS, plus developers who want an API. The [AI avatar](/glossary/ai-avatar) entry explains the avatar types, and the [best AI avatar video generators roundup](/guides/comparisons/best-ai-avatar-video-generators-2026) compares it with [Synthesia](/tools/synthesia) and others.

## Highlights

- **Avatar 6.** The newest avatar model, introduced in November 2026, "understands your script and performs it the way you want." HeyGen says "every frame is native 2K," that the avatar "gestures to match, including pointing, counting, and directional motion," and that two avatars can share a frame and talk. In the API it is `heygen-avatar-6` or `heygen-avatar-6-turbo`, at 1080p by default or 2K.
- **Stock and custom avatars.** The free plan includes one custom video avatar and 500+ ready-made presenters; paid plans list 700+. A digital twin trains on 15 to 600 seconds of one person facing the camera (about two minutes recommended) and clones that person's voice from the same footage. A photo avatar starts from a single still image.
- **Video translation.** HeyGen translates video "with voice cloning and lip-sync across 175+ languages" in Speed or Precision mode. Precision adds editable proofread sessions before the final render.
- **Voice.** HeyGen Voice 1 covers text-to-speech, instant clones from one recording, and professional clones from 20+ minutes of recordings, each needing a purchased slot. Avatar videos made through the API can also use third-party voice engines, including [ElevenLabs](/tools/elevenlabs) and [Cartesia](/tools/cartesia).
- **Prompt-to-video and training.** HeyGen Video 1 turns text, an image or a reference into 5 to 30-second clips through the API, and the Business plan adds SCORM export and LMS integrations.
- **Agent access.** One API key covers the v3 API and the CLI; the MCP server's tools run over OAuth and bill your subscription credits; the `heygen-com/skills` agent-skills repository on GitHub is MIT-licensed; and there is a ChatGPT plugin.

## In an AI-assisted workflow

Let an assistant write and check the script while HeyGen performs it. Text written to be read rarely works spoken, so draft with the [avatar video script writer](/skills/marketing/avatar-video-script-writer) skill first. If you paste into HeyGen's Studio editor, plan short scenes: script import takes at most 1,000 characters per segment, and one segment becomes one scene.

With the MCP server connected in Claude, a training lead at a fictional company might ask:

```text
Read ./scripts/acme-onboarding-01.md and use the HeyGen tools to create
an avatar video with our approved digital twin, at 1080p. Report the
video ID and stop. I will review the render before anything is translated.
```

Translation is where review matters most. Use Precision mode so a reviewer can fix names and terminology in the proofread session before the final render; the [AI localization review workflow](/guides/marketing/ai-localization-review-workflow) shows how to check source against target.

## Pricing

As of November 2026, HeyGen's pricing page lists a Free plan at $0 with three watermarked videos a month, each up to one minute, in 30+ languages, plus one custom avatar. Creator costs $29 a month, or $24 a month billed annually ($288 a year), as of November 2026, with 600 credits, 1080p export without HeyGen branding, 175+ languages and dialects, and videos up to 30 minutes. Pro starts at $49 a month, or $41 a month billed annually ($488 a year), as of November 2026, with 1,000 credits, Avatar 6 Pro, one professional voice clone, 4K export and third-party models, and its credit tiers run to 100,000 credits a month at $4,300 as of November 2026. Business costs $149 a month, or $119 a month billed annually ($1,428 a year), plus $20 per seat per month as of November 2026, with 1,500 credits, videos up to 60 minutes, SAML SSO, SCORM export and LMS integrations, and five custom video avatars on Avatar 6 Pro. Enterprise is priced by quote and removes the maximum video length.

Monthly subscribers' unused credits carry forward one extra month; annual subscribers' credits accumulate until renewal. API usage is billed separately, with self-serve rates shown only after you sign in at platform.heygen.com.

## Good to know

**The API changed on October 31, 2026.** HeyGen's version table marks v1 and v2 as sunset on that date, says "v3 is the supported API," and warns that old calls "may fail intermittently until removal is complete." Any integration still on v1 or v2 needs migrating.

**Real-time avatars are a separate product.** LiveAvatar (liveavatar.com) is the production version of HeyGen's Interactive Avatar, with its own plans, credits and docs: FULL mode runs the whole conversation for you, LITE mode lets you bring your own agent. The [voice agent platforms comparison](/guides/comparisons/best-voice-agent-platforms-2026) covers the build-or-buy side.

**Consent is required, with documented exceptions.** HeyGen's moderation policy says that unless explicit consent has been provided, "creating avatars of other individuals is strictly prohibited"; it also bans cloning the voice of anyone under 18 and requires prior written approval for celebrity, public-figure and political-candidate voices. Each video-based digital twin needs a consent video recorded by the person in it, reading HeyGen's consent statement, plus a spoken code in the standard webcam flow. The developer docs list the exceptions: Enterprise accounts can upload a consent video instead, or skip consent after signing an indemnity agreement, and photo avatars get no consent check and no consent record, so the subject's agreement is your responsibility. See [voice cloning](/glossary/voice-cloning) for the wider picture.

**Read the realism claim carefully.** HeyGen's "84.4% indistinguishable" figure for Avatar 6 is, per its own table, twice the 42.2% rate at which viewers picked the Avatar 6 clip as real in side-by-side tests (n=270).

[Synthesia](/tools/synthesia) is the closest rival for training teams; [VEED](/tools/veed) and [Descript](/tools/descript) are editors that added avatars. See [HeyGen alternatives](/tools/heygen/alternatives) and [the best AI avatar video generators in 2026](/guides/comparisons/best-ai-avatar-video-generators-2026).
