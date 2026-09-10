---
name: "Stitch"
description: "Google's AI design canvas that turns prompts, voice, images, or an existing codebase into high-fidelity mobile and web UI, with frontend code and a Figma paste."
seoDescription: "Stitch from Google Labs: an AI-native design canvas for mobile and web UI, with voice, prototypes, DESIGN.md, and exports to Figma and Antigravity."
date: 2026-09-10
url: "https://stitch.withgoogle.com"
pricing: "freemium"
category: "design"
color: "red"
os: ["Web"]
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["google", "ui-design", "prompt-to-ui", "prototyping", "gemini"]
featured: false
alternativeTo: ["claude-design", "figma-make", "v0"]
sameAs: ["https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/", "https://developers.googleblog.com/stitch-a-new-way-to-design-uis/"]
related: ["tool:figma-make", "tool:claude-design", "tool:framer-ai", "tool:v0", "tool:antigravity", "guide:claude-design-guide", "guide:best-ai-tools-for-designers-2026", "guide:claude-design-vs-figma-make"]
keywords: ["Google Stitch", "AI UI design", "Stitch Google Labs", "prompt to UI", "DESIGN.md"]
summary: "Stitch is Google Labs' UI design tool. Introduced in May 2025 as prompt-and-image to UI and frontend code on Gemini 2.5 Pro, it moved to Gemini 3 in December 2025 and is now described by Google as an AI-native software design canvas with voice input, real-time streaming to the canvas, multi-screen prototypes, and exports to Figma, Antigravity, and Netlify."
faq:
  - q: "What is Stitch?"
    a: "Stitch is a Google Labs design tool at stitch.withgoogle.com. Google's product description is that it generates UIs for mobile and web applications, making design ideation fast and easy. In a March 2026 post Google describes it as an AI-native software design canvas where you create, iterate and collaborate to turn natural language into high-fidelity UI designs."
  - q: "Which model powers Stitch?"
    a: "It launched in May 2025 on the multimodal capabilities of Gemini 2.5 Pro. In December 2025 Google announced Gemini 3 in Stitch, saying it would mean higher quality UI generation. Google's later posts describe the product without naming a model, so treat the model as something that moves."
  - q: "What can I get out of Stitch?"
    a: "Google's posts describe pasting designs into Figma, exporting frontend code, exporting to developer tools including Google AI Studio and Antigravity, publishing directly through Netlify, and generating shareable links. There is also DESIGN.md, which Google calls an agent-friendly markdown file for exporting a design system to other tools, plus an MCP server and an SDK."
  - q: "Does Stitch cost anything?"
    a: "Stitch has a pricing page at stitch.withgoogle.com/pricing, and it is not listed among the Google AI Pro subscription benefits, so it is priced on its own rather than bundled with a Google AI plan. Google's announcement posts do not state the tiers or usage limits, so the pricing page is the only source worth trusting."
---

Stitch is Google's answer to prompt-to-UI. It started in May 2025 as a Google Labs experiment that could "turn simple prompt and image inputs into complex UI designs and frontend code in minutes," running on the multimodal capabilities of Gemini 2.5 Pro. What it is now is wider: Google describes it as "an AI-native software design canvas" where you "create, iterate and collaborate to turn natural language into high-fidelity UI designs."

For a designer, the thing that separates Stitch from a chat box that returns screens is the canvas and the agent that works on it. Google's May 2026 update describes Stitch streaming its work straight to the canvas so you watch it happen, with the Stitch Agent letting you "steer iterations before the final product is done." You can start from a text prompt, from voice, from an existing codebase, or from design files.

## Highlights

- **Mobile and web UI from natural language.** Google's own product line is that Stitch generates UIs for mobile and web applications, making design ideation fast and easy.
- **A canvas, not a transcript.** Work streams to the canvas in real time, and you redirect the agent mid-generation instead of waiting for a finished wrong answer.
- **Voice.** Speak to the canvas alongside typing, and Google says the agent can give real-time design critiques.
- **Multi-screen prototypes.** Since the December 2025 Gemini 3 update, you can stitch screens together into a working prototype and design interactions and whole user flows rather than isolated screens.
- **DESIGN.md.** Google describes an agent-friendly markdown file for exporting your design system to other tools, which is a notably practical idea: a design system a coding agent can read directly.
- **Developer handoff paths.** Paste to Figma, export frontend code, export into Google AI Studio or Antigravity, publish through Netlify, or share a link. An MCP server and an SDK put Stitch inside other agent workflows.

## In a designer's workflow

Stitch is a divergence tool. Its value is the twenty directions you did not have time to draw, not the one you will ship. Treat the output as a set of proposals and take the structure, not the pixels.

```text
A mobile expense-approval app for finance managers. Screens: approvals
inbox with filters, a single expense detail with receipt image and
policy flags, a bulk-approve confirmation, and an empty state.
Dense information, no illustrations, high contrast, dark mode.
Show me three structurally different takes on the inbox.
```

Then paste the winner into Figma and design it properly, or hand DESIGN.md and the code export to whichever agent is doing the build. Where Stitch differs from a design tool you already own is that nothing is anchored to your production design system by default, so the trip through Figma or through your own tokens is not optional.

> [!NOTE]
> Google's public posts describe Stitch's capabilities and cadence but not its plans or usage limits, and those have changed more than once since 2025. Check the model, the export list, and the pricing page before you build a team process on any of them.

## Good to know

Stitch runs in the browser at stitch.withgoogle.com, out of Google Labs, which is Google's home for products that move fast and occasionally change shape. Its pricing page is separate from Google's AI subscription benefits, so a Google AI Pro plan does not carry it.

How it compares: [Figma Make](/tools/figma-make) keeps the whole loop inside Figma and can pull your production React design system in through a Make kit, which is the thing Stitch does not do; the [Claude Design vs Figma Make](/guides/comparisons/claude-design-vs-figma-make) comparison covers that axis. [Claude Design](/tools/claude-design) ingests your design system up front and packages a handoff bundle for Claude Code, and covers decks and one-pagers as well as product UI. [Framer](/tools/framer-ai) is the one to use when the output is a marketing site you will publish rather than an app screen. [v0](/tools/v0) starts from code and ends at a deployed app.

For the field as a whole, see [best AI tools for designers in 2026](/guides/comparisons/best-ai-tools-for-designers-2026), and the [Claude Design guide](/guides/design/claude-design-guide) for a design-system-first workflow that generated screens can slot into.
