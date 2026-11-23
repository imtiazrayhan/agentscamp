---
name: "Synthesia"
description: "Synthesia is an AI video platform for presenter-led video: Express-3 avatars, AI dubbing in the speaker's voice, interactive avatars, SCORM export and an API."
seoDescription: "Synthesia in 2026: Express-3 avatars, AI dubbing, the Syren video agent, live-only consent, SCORM export, and plan prices as of November 2026."
date: 2026-11-11
reviewed: 2026-11-22
url: "https://www.synthesia.io"
pricing: "freemium"
category: "design"
color: "blue"
os: ["Web"]
topics: ["multimodal-ai", "ai-at-work"]
audience: ["marketers", "designers"]
tags: ["synthesia", "ai-avatar", "ai-dubbing", "training-video", "scorm", "api", "mcp"]
featured: false
alternativeTo: ["heygen", "veed", "descript"]
sameAs: ["https://en.wikipedia.org/wiki/Synthesia_(company)", "https://www.linkedin.com/company/synthesia-technologies/", "https://twitter.com/synthesiaio", "https://www.youtube.com/channel/UC0Rqs6pyPoGaMT5HFMFdslg"]
related: ["tool:heygen", "tool:veed", "tool:descript", "tool:livekit", "guide:best-ai-avatar-video-generators-2026", "guide:ai-localization-review-workflow", "glossary:ai-avatar", "skill:avatar-video-script-writer"]
keywords: ["Synthesia", "Synthesia pricing", "Synthesia Express-3", "Synthesia AI dubbing", "Synthesia SCORM", "Synthesia vs HeyGen"]
summary: "Synthesia is a London-based AI video platform that turns a script into a presenter-led video with stock or personal avatars in 140+ languages and voices, dubs existing videos in the speaker's own voice, and exports SCORM packages for an LMS. Express-3 avatars arrived in July 2026, and Interactive Avatars are in beta as of November 2026."
faq:
  - q: "How much does Synthesia cost?"
    a: "As of November 2026 Synthesia's regular prices are Basic at $0, Starter at $19 a month or $14 a month billed yearly, Pro at $89 a month or $59 a month billed yearly, Business at $99 a month or $79 a month billed yearly for one member with extra members at $20 per seat per month, and Enterprise by quote. A Black Friday promotion was running on the pricing page when we read it; these are the regular list prices, not the sale prices."
  - q: "Is there a free version of Synthesia?"
    a: "Yes. The Basic plan is free with 500 credits a month, which Synthesia equates to 10 minutes of Studio video creation or dubbing, and nine AI avatars. Videos made on Basic carry a Synthesia watermark, and personal avatars from a photo need a paid plan."
  - q: "How does Synthesia handle consent for avatars?"
    a: "Every personal avatar needs the person's live consent. Synthesia's docs say a photo avatar requires a live consent recording, that consent videos must be recorded live and cannot be uploaded, and that the person in the consent video must be the one in the photo. Studio avatars need the performer to read a consent script to camera in their native language, stock avatars come from actors who gave consent, and avatar owners can ask for their data to be deleted."
  - q: "Does Synthesia have an API or MCP server?"
    a: "Yes. Synthesia publishes developer documentation for the Interactive Avatars API, the Localization API (which replaces the deprecated Dubbing API) and MCP, and its updates page announces creating Synthesia videos from ChatGPT and Claude. The plan comparison lists API usage of up to 360 minutes of video a year, deducted from the plan's limits, and Enterprise includes 360 minutes a year with more as a paid add-on. Interactive Avatars, built on LiveKit, are in beta as of November 2026."
---

Synthesia is an AI video platform for presenter-led video at work, with training as its center of gravity. You type a script, pick a presenter, and Synthesia renders it with an AI voice in any of more than 140 languages and voices. The company, Synthesia Ltd, is based in London, and its pricing page says it is "trusted by over 90% of Fortune 100 companies."

What sets it apart is posture more than features. Synthesia accepts only live consent recordings for personal avatars, moderates every video, stores customer data in the EU, and exports SCORM packages that carry every translated version of a course. If you want translation into more languages or a CLI, [HeyGen](/tools/heygen) is the closer fit; the [best AI avatar video generators roundup](/guides/comparisons/best-ai-avatar-video-generators-2026) compares both, and the [AI avatar](/glossary/ai-avatar) entry explains the avatar types.

## Highlights

- **Express-3 avatars.** Launched July 15, 2026, Express-3 is "our most advanced avatar model for lip sync, natural body movement and gestures," and Synthesia says videos using it "can generate up to 2x faster." It is available on all plans, rolling out in stages.
- **Stock, personal and studio avatars.** Stock avatars are filmed from real actors who gave consent, from nine on Basic to 240+ on Enterprise. A personal avatar comes from a photo on paid plans, typically ready within minutes of the consent step, or, the legacy way, from a 1 to 5-minute single-take video. Studio avatars need three 2 to 3-minute recordings, filmed in 4K or at least Full HD.
- **AI dubbing.** Dubbing "translates a video's spoken content into another language, replacing the original voiceover while preserving the speaker's own voice." Lip sync costs twice the credits, uploads go up to 5GB or 2.5 hours, and transcript editing is an Enterprise feature.
- **Interactive Avatars.** "A real-time Avatar that holds a live conversation with people," in beta as of November 2026, with an API built on [LiveKit](/tools/livekit).
- **Syren.** Labelled new on the pricing page as of November 2026, Syren is Synthesia's AI video agent: "You describe the video you want, and Syren writes it as code and renders it live."
- **LMS export.** SCORM export packages a video "with all translated versions" for upload to an LMS, on the Business plan.
- **API and MCP.** Docs cover the Interactive Avatars and Localization APIs (the older Dubbing API is deprecated) and MCP, for creating videos from ChatGPT and Claude.

## In an AI-assisted workflow

Synthesia reads your script literally, so most quality work happens before you paste it in. Its script docs say to spell out numbers, symbols and abbreviations as they should be spoken ("222" as "two hundred and twenty-two", "mg" as "milligrams"), and each scene's script can run at most five minutes. Pauses and speed are controls, not markup: pauses of 0.1 to 99 seconds go in with the Pause button, and speed is set per paragraph between 0.8× and 1.2×. Each paragraph gets its own speaker, voice and speed, so you can also switch languages paragraph by paragraph.

An assistant can do that mechanical pass. For a fictional security course:

```text
Rewrite ./scripts/acme-security-101.md for a Synthesia avatar video.
One paragraph per idea, each under 60 words. Spell out numbers, symbols
and abbreviations the way the presenter should say them ("2FA" as
"two-factor authentication", "15 min" as "fifteen minutes"). Mark each
place a pause belongs with [PAUSE] so I can add it with the Pause button.
List any product names whose pronunciation I should set in the Glossary.
```

The [avatar video script writer](/skills/marketing/avatar-video-script-writer) skill is built for this step. For proper nouns, Synthesia offers an IPA or respelling option and saves it to the workspace Glossary. Voices are non-deterministic, so use Regenerate when a take sounds off. For localized courses, check dubbed versions against the source before export, as the [AI localization review workflow](/guides/marketing/ai-localization-review-workflow) describes.

## Pricing

As of November 2026, Synthesia's regular price for Basic is $0, with 500 credits a month (10 minutes of Studio video creation or dubbing), nine AI avatars and a watermark on every video. Starter costs $19 a month, or $14 a month billed yearly ($168 a year), as of November 2026, with 1,250 credits a month, 125+ stock avatars, three personal avatars and no Synthesia logo. Pro costs $89 a month, or $59 a month billed yearly ($708 a year), as of November 2026, with 6,000 credits a month, five personal avatars, interactive videos and 180+ stock avatars. Business costs $99 a month for one member, or $79 a month billed yearly ($948 a year), as of November 2026, with up to 10 members at $20 per added seat per month, 6,000 credits a month, one-click translation into 140+ languages, unlimited personal avatars and SCORM export. Enterprise is priced by quote, with unlimited video minutes under a fair-usage policy, SAML SSO and SCIM, and 240+ stock avatars.

A Studio Express-1 avatar is a paid add-on at $1,000 a year for annual-plan users as of November 2026. The pricing page was running a Black Friday promotion when we read it; the figures above are regular list prices. For seasonal discounts, see [AI video and voice Black Friday deals](/guides/deals/ai-video-voice-black-friday-deals).

## Good to know

**Consent is live-only.** Synthesia's docs say a photo avatar "requires a live consent recording to verify identity and authorization," that consent videos "must be recorded live and cannot be uploaded," and that the person in the consent video must be the person in the photo. Studio avatars need the performer to read a consent script to camera in their native language. Synthesia says it gives avatar owners "full control over their avatar's usage, including the ability to request that their data be deleted."

**Moderation and security.** Synthesia says it applies content moderation to all videos and chose to "moderate content at the point of creation, not clean up after distribution." It reports periodic ISO 42001, ISO 27001 and SOC 2 Type II audits, AES-256 encryption, TLS 1.2+, customer data stored in Irish data centers in the EU, and deletion within up to 90 days.

**Limits to plan around.** Synthesia is web-only, with no official mobile app. Avatar previews and uploading audio in place of a script are Enterprise features. The pricing page and the dubbing docs give different counts of dubbing languages, so confirm your target languages on your plan.

[Synthesia alternatives](/tools/synthesia/alternatives) lists the other options, including [VEED](/tools/veed) and [Descript](/tools/descript) for avatars inside an editor, and [the best AI avatar video generators in 2026](/guides/comparisons/best-ai-avatar-video-generators-2026) compares them by use case.
