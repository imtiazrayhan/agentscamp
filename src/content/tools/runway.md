---
name: "Runway"
description: "Runway's AI video platform: Gen-4.5 generation with native audio, Aleph 2.0 editing, Act-Two capture, 54 hosted models, an API, MCP, and Adobe plugins."
seoDescription: "Runway for designers: Gen-4.5 with native audio, Aleph 2.0 editing, Act-Two capture, 54 hosted models, API and MCP, Adobe plugins, plans, and output ownership."
date: 2026-10-17
url: "https://runwayml.com"
pricing: "freemium"
category: "design"
color: "orange"
os: ["Web", "iOS", "Android"]
topics: ["multimodal-ai", "ai-at-work"]
audience: ["designers", "marketers"]
tags: ["video-generation", "runway", "gen-4-5", "image-to-video", "video-editing", "api", "mcp"]
featured: false
alternativeTo: ["kling", "veed"]
sameAs: ["https://docs.dev.runwayml.com/", "https://runwayml.com/research/introducing-runway-gen-4.5", "https://techcrunch.com/?p=3091124"]
related: ["tool:kling", "tool:veed", "tool:midjourney", "guide:best-ai-video-generators-2026", "guide:best-ai-image-generators-2026", "guide:best-ai-tools-for-designers-2026", "glossary:diffusion-model"]
keywords: ["Runway", "Runway Gen-4.5", "Runway API", "Runway pricing", "Runway Aleph 2.0", "Runway vs Kling"]
summary: "Runway is a New York AI research company whose platform generates and edits video, image, and audio with its own models (Gen-4.5, Aleph 2.0, Act-Two, GWM-1) and a 54-model third-party catalog, on the web, iOS, and Android, inside Adobe Premiere Pro and After Effects, and through an agent, MCP, and API. Free tier plus Standard, Pro, Max, and Enterprise plans."
faq:
  - q: "Does Runway have an API?"
    a: "Yes. The developer API at docs.dev.runwayml.com exposes Gen-4.5 text-to-video and image-to-video (2 to 10 seconds at 1280 by 720 or 720 by 1280), Aleph 2.0 video-to-video with keyframes, Act-Two character performance, and a catalog of 54 models from providers including Kling, Google, MiniMax, ByteDance, OpenAI, and ElevenLabs. As of October 2026 the model table lists Gen-4.5 at $0.12 per second, Aleph 2.0 at $0.28 per second, and Act-Two at $0.05 per second. An MCP server is listed on the Pro and Max plans."
  - q: "How much does Runway cost?"
    a: "As of October 2026 the pricing page lists Free at $0 with 125 one-time credits, Standard at $15 a month or $12 a month billed annually (625 credits, no watermarks, 4K upscaling), Pro at $35 or $28 annually (2,250 credits, unlimited 4K upscaling, MCP), and Max at $95 or $76 annually (9,500 credits that roll over one month, ProRes and HDR output), plus custom Enterprise. Gen-4.5 uses 12 credits per second of generated video."
  - q: "Who owns the videos Runway makes?"
    a: "You do, under Runway's Terms of Use. Section 4.4 says the company does not claim ownership of any of your Inputs or Outputs and does not restrict your commercial use of your Outputs. The same terms say Inputs and Outputs may be used by the company to train and improve its AI models, so read that clause before uploading confidential footage. No watermarks is listed as a Standard-plan feature, which implies the free tier carries one."
  - q: "Runway vs Kling?"
    a: "Kling's own models go longer and sharper natively: 30-second clips on Kling 4.0 and native 4K on the 3.0 series, at a lower consumer entry price. Runway's Gen-4.5 is 2 to 10 seconds at 720p with 4K upscaling, but Runway also hosts Kling 3.0 inside its app and API, adds Aleph 2.0 editing, Act-Two capture, Adobe plugins, and world models, and its terms do not restrict commercial use, where Kling's attach branding and permission conditions."
---

Runway is the New York AI research company whose creative platform generates and edits video, image, and audio. Its own models are the draw: Gen-4.5 for text-to-video and image-to-video, Aleph 2.0 for editing existing footage, Act-Two for performance capture, and GWM-1, a world model built on Gen-4.5. Around them Runway has become a multi-model host, with a developer catalog of 54 models from Alibaba, ByteDance, ElevenLabs, Google, Ideogram, Kling, Magnific, Meta, MiniMax, OpenAI, xAI, and itself. It is reachable through the web app, iPhone and Android apps, an agent, plugins inside Adobe Premiere Pro and After Effects, an MCP server, and a developer API, from offices in New York, San Francisco, Seattle, London, Paris, Tel Aviv, and Tokyo.

For a designer or marketer the practical question is which surface you live in: the Studio timeline for a campaign, the Adobe panel for an edit, or the API when generation belongs inside a pipeline.

## Highlights

- **Gen-4.5.** Released December 1, 2025, and available "across all paid Runway plans." Runway says it "ranked #1 on the Artificial Analysis Text-to-Video benchmark with 1,247 Elo points" as of November 30, 2025, a vendor-reported figure. Native audio generation and editing followed on December 11, 2025, and image-to-video on January 21, 2026.
- **Clip specs.** Through the API, Gen-4.5 produces 2 to 10 seconds at 1280 by 720 or 720 by 1280; the app adds 4K upscaling and, since August 10, 2026, ProRes 4444 and PNG-sequence export.
- **Aleph 2.0.** "Edit one frame and Aleph 2.0 modifies the rest of your video to match," on clips "up to 30 seconds long at 1080p." It shipped in the app on May 21, 2026, on the API on June 2, and in MCP on July 14.
- **Act-Two and Characters.** A motion-capture model with "head, face, body and hand tracking," and Runway Characters (March 9, 2026) for real-time avatars with "facial expressions, eye movements, lip-syncing and gestures."
- **GWM-1.** "An autoregressive model built on top of Gen-4.5" that produces "up to 2 minutes of video 720p," in Worlds, Avatars, and Robotics variants.
- **Third-party models.** Kling 3.0, Wan 3.0, Hailuo 3.0, Seedance 2.5, Grok Imagine 1.5, ElevenLabs V4, and more run inside Runway's app and API.
- **Agent, Skills, plugins, MCP.** Runway Agent (May 13, 2026) "creates entire campaigns, analyzes data to improve your creative"; Agent Skills followed on July 2; the Adobe plugins arrived September 8, 2026; Runway MCP is listed on the Pro and Max plans, and a C2PA Verifier page inspects content credentials.

## In an AI-assisted workflow

The API and MCP are what make Runway scriptable. Take a fictional example: Fennwick Coffee, an invented roaster with a two-person marketing team on the Pro plan, keeps approved packshots in a repo and lets Claude Code produce the week's product clips through the Runway MCP server.

```text
For each packshot in ./assets/packshots/, use the Runway tools to run a
Gen-4.5 image-to-video generation: 5 seconds, 1280x720, slow push-in,
soft morning light, no on-screen text. Save outputs to ./renders/ named by
SKU. Then run Aleph 2.0 on the hero clip to swap the background to the
kitchen plate at ./assets/plates/kitchen.jpg. Log credits used per clip.
```

The clips go to review in the Studio timeline and then, through the Adobe plugin, into the editor's Premiere Pro project. The [best AI video generators in 2026](/guides/comparisons/best-ai-video-generators-2026) roundup covers where this workflow fits against the other platforms.

> [!WARNING]
> Runway's Terms of Use say "Inputs and Outputs may be used by the Company to train and improve its AI models." If the packshots or footage are confidential, read that clause with your client before uploading, and ask whether the Enterprise terms differ.

## Good to know

Runway is freemium. As of October 2026 the pricing page lists Free at $0 with 125 one-time credits that do not expire, Standard at $15 a month or $12 a month billed annually with 625 monthly credits, no watermarks, and 4K upscaling, Pro at $35 or $28 annually with 2,250 credits, unlimited 4K upscaling, Runway MCP, and 100GB of storage, and Max at $95 or $76 annually with 9,500 credits that roll over one month, HDR and ProRes output, 500GB of storage, and early access to new models. Enterprise is custom. Gen-4.5 costs 12 credits per second of generated video, Aleph 2.0 costs 140 credits per five seconds, and credit top-ups start at 1,000 credits, as of October 2026. On the developer API the model table lists Gen-4.5 at $0.12 per second, Aleph 2.0 at $0.28 per second, and Act-Two at $0.05 per second as of October 2026. "No watermarks" is a Standard-plan feature, which implies the free tier carries one, though the Free card does not say so.

Ownership is clearer than most. Section 4.4 of the Terms of Use says "The Company does not claim ownership of any of your Inputs or Outputs" and "the Company does not restrict your commercial use of your Outputs." The legal entity is Runway AI, Inc. Funding is press-reported: TechCrunch reported on February 10, 2026 that Runway raised a $315 million Series E at a $5.3 billion valuation led by General Atlantic, with Nvidia, Adobe Ventures, and AMD Ventures among the participants, and that remains the latest round as of October 2026.

Against the alternatives: [Kling](/tools/kling) is the single-vendor rival with deeper native specs, 30-second clips on Kling 4.0 and native 4K on the 3.0 series, a lower consumer entry price, and far stricter terms on branding and commercial use; Runway also hosts Kling 3.0 inside its own app and API, so the real difference is breadth versus depth. [VEED](/tools/veed) is a browser editor for footage you already have, strong on subtitles, with no generation models of its own. [Best AI video generators in 2026](/guides/comparisons/best-ai-video-generators-2026) compares the field, [best AI image generators in 2026](/guides/comparisons/best-ai-image-generators-2026) covers the still-image step where [Midjourney](/tools/midjourney) lives, [best AI tools for designers in 2026](/guides/comparisons/best-ai-tools-for-designers-2026) places both in a designer's stack, and the [diffusion model](/glossary/diffusion-model) entry explains the mechanics.
