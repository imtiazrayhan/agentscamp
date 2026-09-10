---
name: "Opus Clip"
description: "An AI clipping tool that turns long videos into scored, captioned short clips for Shorts, TikTok, and Reels, with a scheduler, brand templates, and an API."
seoDescription: "Opus Clip for marketers: ClipAnything long-to-short repurposing, virality score, captions, AI B-roll, scheduler, API and MCP, iOS app, plans as of Sept 2026."
date: 2026-09-10
url: "https://www.opus.pro"
pricing: "freemium"
category: "marketing"
color: "yellow"
os: ["Web", "iOS"]
topics: ["ai-at-work", "workflow-prompting", "multimodal-ai"]
audience: ["marketers"]
tags: ["video", "short-form", "repurposing", "clipping", "social-media", "mcp"]
featured: false
alternativeTo: ["descript"]
sameAs: ["https://help.opus.pro"]
related: ["guide:claude-code-for-marketers", "guide:best-ai-tools-for-marketers-2026", "tool:descript", "skill:content-repurposer", "command:repurpose", "guide:claude-code-mcp-setup"]
keywords: ["Opus Clip", "OpusClip", "AI video clipping", "long to short video", "Opus Clip pricing"]
summary: "Opus Clip (OpusClip) takes a long video, finds the segments most likely to work as shorts, and returns them reframed to vertical with animated captions and a virality score. It adds AI B-roll, brand templates, a scheduler for Shorts, TikTok, and Instagram, an editor, an API and MCP server, and an iOS app. Usage costs one credit per minute of source video."
faq:
  - q: "What is Opus Clip?"
    a: "Opus Clip is an AI video clipping tool. You import a long video from a file, YouTube, Google Drive, Vimeo, Zoom, or other sources, and its ClipAnything model picks the moments most likely to perform as short-form clips, reframes them for vertical, adds animated captions in 20+ languages, and scores each clip. You can edit, apply a brand template, and post or schedule to social platforms from the same place."
  - q: "How much does Opus Clip cost?"
    a: "As of September 2026 the pricing page lists a Free plan with 60 credits a month, watermarked 1080p clips that expire after 3 days, and no editing. Starter is 15 dollars a month (monthly only) for 150 credits with the watermark removed, virality score, and auto-posting. Pro is 29 dollars monthly or 14.50 a month billed annually (174 a year, 3,600 credits available at once) and adds AI B-roll, the scheduler, multiple aspect ratios, XML export, 2 seats, and limited API access. Business is custom with full API access."
  - q: "What is an Opus Clip credit?"
    a: "One credit per minute of the original video imported, per Opus Clip's help center, regardless of how many clips come out. Videos under a minute round up to one credit, partial minutes otherwise round down, and each X post or schedule costs one credit per clip. Monthly-plan credits expire after 60 days; yearly-plan credits are valid for 12 months."
  - q: "Opus Clip vs Descript?"
    a: "Opus Clip does one job: finished long video in, ranked short clips out, with captions and scheduling. Descript is a full text-based editor that produces the long video in the first place and can also cut clips. If you already have a master edit and want volume on Shorts, TikTok, and Reels, Opus Clip is faster; if you need to fix the recording, Descript."
---

Opus Clip is the tool a content team reaches for when the webinar is done, the podcast is edited, and nobody has time to hand-cut twelve verticals for Shorts, TikTok, and Reels. You drop in the long video, its ClipAnything model finds the moments that stand on their own, and you get back reframed, captioned clips with a virality score on each. The company's own tagline is "#1 AI video clipping tool to create viral shorts," and it claims "16M+ creators and businesses" use it.

For marketers the useful bit is not the score, it is the throughput: one hour-long recording becomes a month of social posts, scheduled from the same screen.

## Highlights

- **ClipAnything.** Opus Clip describes it as "the only AI clipping model that turns any genre" of video, from vlogs and interviews to explainers, "into viral clips in 1 click," clipping on spoken words, visual objects, sound, and emotion. You can also reprompt it toward a theme.
- **Reframe and captions.** ReframeAnything keeps moving subjects centered with object tracking; animated captions come in 20+ languages, with a 97 percent accuracy claim, and Pro supports 9:16, 1:1, and 16:9 outputs.
- **AI B-roll and brand templates.** Pro adds AI image, video, and stock B-roll; Starter includes 1 brand template and Pro 2, so every clip carries the same fonts and colors.
- **Scheduler and auto-post.** Post to YouTube Shorts, TikTok, and Instagram from Starter; Pro adds the social media scheduler and 6 connected accounts.
- **Editor and export.** An in-app editor with filler and silence removal, plus XML export to Adobe Premiere Pro and DaVinci Resolve on Pro for the clips that need a human finish.
- **API and MCP.** Opus Clip publishes a video API "every AI agent can call" and an MCP server for agent workflows, with limited API access on Pro and full access on Business.

## In a content team's workflow

Opus Clip sits at the end of the pipeline. The decisions that make its clips good happen earlier: a recording with clean audio, a transcript, and a list of the points you actually want in market. Let an agent work the transcript first, then use Opus Clip's reprompt to steer the clipping toward those points.

```text
Read ./webinars/2026-09-onboarding-transcript.txt. Identify the 8
segments that (a) make one complete point in under 60 seconds and
(b) mention a product capability from ./brand/facts.md. For each,
give start-end timestamps, a one-line hook for the caption, and the
theme in three words so I can reprompt the clipping tool.
```

Upload the master, reprompt ClipAnything with those themes, apply the brand template, and schedule. The [content repurposer](/skills/marketing/content-repurposer) skill and the [/repurpose](/commands/marketing/repurpose) command handle the transcript side, and the [Claude Code for marketers](/guides/marketing/claude-code-for-marketers) pillar covers the repo layout. If you want the whole chain automated, Opus Clip's MCP server can be added to an agent the way the [Claude Code MCP setup](/guides/mcp/claude-code-mcp-setup) guide describes.

> [!NOTE]
> Credits are charged per minute of source video, not per clip. A 60-minute upload costs 60 credits whether you keep two clips or twenty, so trim the master (cut the pre-roll and Q&A you will never post) before you upload.

## Good to know

Opus Clip is a web app with an iOS app (iPhone on iOS 16 or newer); the vendor says Android is not available in all regions yet. As of September 2026 the pricing page lists Free at $0 with 60 credits a month, 1080p clips with a watermark, no editing, and exports that expire after 3 days; Starter at $15 a month, monthly billing only, with 150 credits, the watermark removed, virality score, captions in 20+ languages, auto-post, and 1 brand template; and Pro at $29 monthly or $14.50 a month billed annually ($174 a year, 3,600 credits available immediately) with a team workspace of 2 seats, 2 brand templates, 6 social connections, AI B-roll, 10+ import sources, XML export, the scheduler, custom fonts, speech enhancement, dubbing, and limited API access. Business is custom with priority processing, customized credits and seats, API and custom integrations, and an MSA. The help center says monthly credits expire after 60 days and yearly credits after 12 months.

The limit is that Opus Clip does not fix the source. Bad audio, a rambling speaker, or a missing intro all pass straight through, which is why most teams pair it with [Descript](/tools/descript) for the master edit. Opus Clip also sells a separate product, Agent Opus, for generating AI videos with avatars and voice clones on its own Free, Pro, and Max plans. The [best AI tools for marketers in 2026](/guides/comparisons/best-ai-tools-for-marketers-2026) roundup covers where clipping fits among the writing, SEO, and design tools.
