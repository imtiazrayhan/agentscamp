---
name: "Luma AI"
description: "Luma AI, formerly Dream Machine, now sells Luma Agents: creative agents on its Ray3.2 video and Uni-1.1 image models plus hosted models, with an API and MCP."
seoDescription: "Luma AI in 2026: Dream Machine is now Luma Agents, with Ray3.2 video, Uni-1.1 images, 16 keyframes, EXR output, MCP for Claude, and prices as of November 2026."
date: 2026-11-12
reviewed: 2026-11-22
url: "https://lumalabs.ai"
pricing: "paid"
category: "marketing"
color: "yellow"
os: ["Web", "iOS"]
topics: ["multimodal-ai"]
audience: ["designers", "marketers"]
tags: ["luma", "dream-machine", "video-generation", "image-generation", "ray3-2", "api", "mcp"]
featured: false
alternativeTo: ["runway", "kling"]
sameAs: ["https://github.com/lumalabs", "https://www.linkedin.com/company/lumalabsai", "https://x.com/LumaLabsAI", "https://www.youtube.com/@lumalabsai"]
related: ["tool:runway", "tool:kling", "tool:elevenlabs", "guide:best-ai-video-generators-2026", "guide:best-ai-tools-for-designers-2026", "guide:ai-storyboard-from-script", "glossary:text-to-video", "glossary:text-to-image"]
keywords: ["Luma AI", "Luma Dream Machine", "Dream Machine", "Luma Agents", "Luma Ray3.2", "Luma pricing", "Luma API"]
summary: "Luma AI, the company behind Dream Machine, now sells Luma Agents: creative agents that generate and refine video, images and audio on its own Ray3.2 video and Uni-1.1 image models plus hosted models such as Veo 3.1 and Kling 4.0. It runs on the web and iOS, connects to Claude and ChatGPT through MCP, and has paid plans from Plus to Enterprise."
faq:
  - q: "Is Luma Dream Machine still available?"
    a: "Not under that name on the web. Luma launched Luma Agents and the Ray and Uni model families in March 2026, and lumalabs.ai/dream-machine now redirects to the Luma app. The iOS app is still listed as Luma Dream Machine, and Luma's API page calls the old interface the legacy Dream Machine video API; its migration guide moves Ray 3, Ray 2 and related integrations to Ray3.2."
  - q: "How much does Luma AI cost?"
    a: "As of November 2026 Luma's pricing page lists Plus at $30 a month or $25 a month billed yearly, Pro at $90 a month or $75 a month billed yearly, and Ultra at $300 a month or $250 a month billed yearly, with Team and Enterprise by quote. No free plan is listed, though Luma says all plans include free trial credits and commercial use. API usage is priced in credits."
  - q: "Does Luma generate audio?"
    a: "Not from its own text-to-video or image-to-video workflows. The Ray3.2 FAQ says there is no natively generated audio for those, while Modify Video and Reframe keep your original audio. Luma Agents work across video, image, audio and text, and the hosted model list includes ElevenLabs v4 and Whisper v3."
  - q: "Does Luma work with Claude?"
    a: "Yes. Luma announced on November 3, 2026 that Luma MCP is available for Claude and ChatGPT, and generations made from your assistant use your Luma credits. Developers can also call Luma's models through the API, billed as pay-as-you-go credits or as Provisioned Throughput with guaranteed capacity and a latency SLA."
---

Luma AI was founded in 2021 and became known for Dream Machine, the video generator it launched in June 2024. In March 2026 it launched Luma Agents and "introduced the Ray and Uni model families and the Agent canvas within a Luma app." The Dream Machine name has mostly gone: lumalabs.ai/dream-machine redirects to the app, the API docs call the old interface "the legacy Dream Machine video API," and only the iOS app still carries the name. If you searched for Dream Machine, this is the product you are looking for. Luma's about page lists a $900 million Series C led by Humain in November 2025, the latest round shown there as of November 2026.

What you get now is a creative-agent platform. Luma says its agents "research, generate, and refine across video, image, audio, and text," on its own Ray3.2 video model and Uni-1.1 image model plus hosted third-party models, and the app connects to Figma, Frame.io and Google Ads Console. For designers that puts it closest to [Runway](/tools/runway), another multi-model creative platform. The [best AI video generators in 2026](/guides/comparisons/best-ai-video-generators-2026) roundup places Ray3.2 against the field, and the [text-to-video](/glossary/text-to-video) entry covers the underlying idea.

## Highlights

- **Ray3.2.** Released June 9, 2026, Ray3.2 "powers four workflows in one: Modify Video, image2video, text2video, and Reframe," and Luma made it available as an API from launch.
- **Clip specs.** Output at 360p, 540p, 720p (the default) or 1080p. Text- and image-to-video clips run 5 or 10 seconds; Modify Video handles up to 20 seconds at 24fps, 15 at 30fps and 7 at 60fps.
- **Keyframes.** "Ray3.2 lets you set up to 16 keyframes" in a clip.
- **HDR and EXR.** "16-bit EXR frames for color grading, compositing, and VFX," in ACES2065-1 (AP0).
- **Performance transfer.** Expressive Facial Performance transfers "the full expression state, for up to 8 faces," and lip sync is preserved when Face tracking is on.
- **Uni-1.1 images.** On the API since May 5, 2026, Uni-1.1 is "a decoder-only autoregressive transformer where text and image tokens share a single sequence." It accepts up to nine reference inputs per request, takes about 31 seconds per image, and comes in Uni-1.1 and Uni-1.1 Max tiers.
- **Hosted models.** The pricing table lists Ray3.14, Veo 3.1, Gemini Omni Flash, the Kling 4.0 and 3.0 families, Seedance 2.5 and 2.0, MiniMax H3, Flux 3, Nano Banana, GPT Image, Ideogram, [ElevenLabs](/tools/elevenlabs) v4 and Whisper v3, among others.

## In an AI-assisted workflow

Since November 3, 2026, "Luma MCP is now available for Claude and ChatGPT," and generations started from your assistant draw on your Luma credits. Credits scale steeply with resolution: a Ray3.2 text- or image-to-video clip costs 20 credits per 5 seconds at 360p and 400 credits per 5 seconds at 1080p, HDR doubles that, and HDR with EXR triples it. The sensible pattern is to iterate on motion cheaply and render only the keeper at full quality. With MCP connected in Claude, a designer might write:

```text
Using the Luma tools, make three 5-second Ray3.2 image-to-video
variations of the attached product still for Acme Kettles at 360p:
slow push-in, steady camera, no text on screen. Give me the links and
do not render anything at 1080p or in HDR until I pick one.
```

Plan the shots before you spend credits; the [AI storyboard guide](/guides/design/ai-storyboard-from-script) maps an approved script into shots with continuity checks. Developers integrating directly can pay as they go in credits or buy Provisioned Throughput, "guaranteed capacity and a latency SLA, billed monthly." Luma's migration guide moves Ray 3, Ray 2, Ray 2 Flash, Ray 2 Relaxed, Ray 3 Reference and Ray 3 Refiner integrations to Ray3.2, so older Dream Machine API code needs updating.

## Pricing

As of November 2026, Luma's pricing page lists Plus at $30 a month, or $25 a month billed yearly ($300 a year), with 10,000 credits, access to Luma and third-party image and video models, edit access for guest collaborators and commercial use. Pro costs $90 a month, or $75 a month billed yearly ($900 a year), as of November 2026, with 40,000 credits and "4x usage with the Luma Agents." Ultra costs $300 a month, or $250 a month billed yearly ($3,000 a year), as of November 2026, with 150,000 credits and "15x usage with the Luma Agents." Team (member management, usage analytics, SSO) and Enterprise (commitments and custom fine-tuning) are priced by quote.

Yearly billing saves up to 20%. No free plan is listed; Luma says all plans include free trial credits and commercial use. API usage is metered in credits, and the dollar value of a credit depends on your plan or contract.

## Good to know

**No native audio from Ray3.2's generation workflows.** The FAQ is explicit: for text2video and image2video "there's no natively-generated audio," while Modify Video and Reframe preserve your original audio. Plan to add sound in the edit or through one of the hosted models.

**Modify Video has failure modes.** Luma says it "can struggle with footage which has heavy camera shake, whip-fast or chaotic action, blurry/dark/low-res footage, crowded overlapping subjects." Test a short section of difficult footage before committing a whole sequence.

**Ownership is clear.** The terms say "Customer owns and retains all right, title, and interest in and to the Output," and grant Luma a broader display license on free use.

**Platforms.** Luma runs on the web and as an iOS app, which is still listed as Luma Dream Machine; we found no Android app.

Against the alternatives, [Runway](/tools/runway) is the nearest match as another platform that mixes its own and hosted models, and [Kling](/tools/kling) is the single-vendor option, though Luma hosts Kling 4.0, so you can reach Kling's flagship from inside Luma. [Luma AI alternatives](/tools/luma/alternatives) lists the options, and [the best AI video generators in 2026](/guides/comparisons/best-ai-video-generators-2026) compares them by job.
