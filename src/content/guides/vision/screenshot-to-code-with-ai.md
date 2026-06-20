---
title: "Screenshot-to-Code: Building UIs from Images with AI"
description: "Turn a screenshot, mockup, or Figma frame into working frontend code with AI vision models — the realistic workflow, the right tools, and the honest pitfalls."
author: "AgentsCamp"
date: 2026-06-20
color: "purple"
topics: ["multimodal-ai", "coding-languages"]
tags: ["screenshot-to-code", "vision", "frontend", "figma", "design-to-code", "ai-coding"]
featured: false
summary: "Screenshot-to-code works: a vision model reads an image and emits matching markup. Treat it as an 80% first draft, not a final answer. Use prompt-to-app tools (v0, Bolt, Lovable) for greenfield, a vision model plus an agent in your editor for in-repo work, and Figma's MCP when you have real design data — because a flat screenshot loses structure a model has to guess back."
keyTakeaways:
  - "A screenshot gets you a fast, surprisingly good first draft — but it's a guess. The model infers structure, state, and responsiveness it cannot actually see in a flat image."
  - "Pixel-perfect is not the same as correct. Matching the picture says nothing about semantics, accessibility, responsive behavior, or whether it uses your design system."
  - "Match the tool to the job: v0 / Bolt / Lovable for greenfield prompt-to-app; a vision model plus an agent in Cursor for editing an existing repo; Figma's MCP when you have the real design file."
  - "Figma's Dev Mode MCP beats a screenshot because it passes the actual node tree, variants, layout constraints, and design tokens — structure a flat image throws away."
  - "Prompt for intent, not just appearance: name the framework, the design system, the breakpoints, and the interactive states the still image can't show."
howtoSteps:
  - name: "Capture the right image"
    text: "Grab a high-resolution, tightly-scoped screenshot or export. Crop to the component or screen you actually want; include enough surrounding context to imply layout, but drop unrelated chrome. Blurry or low-res images degrade the output more than anything else."
  - name: "Describe the intent the image can't show"
    text: "A still frame has no hover, no loading state, no breakpoints, no data binding. Spell those out: name the framework and design system, the target breakpoints, the interactive states, and where real data comes from."
  - name: "Generate the first draft"
    text: "For greenfield, paste the image into v0, Bolt, or Lovable and let it produce a running app. For an existing repo, drop the screenshot into your agent in Cursor so the model sees the image alongside your real files and conventions."
  - name: "Refine conversationally"
    text: "Treat the output as ~80% done. Iterate in follow-up turns — fix spacing, swap ad-hoc markup for your components, wire up state and data. This back-and-forth is where the result becomes correct, not just similar."
  - name: "Prefer real design data when you have it"
    text: "If the source is a Figma file, use Figma's Dev Mode MCP instead of a screenshot so the agent reads the node tree, variants, layout constraints, and design tokens — and maps to your real components via Code Connect."
faq:
  - q: "Can AI really turn a screenshot into working code?"
    a: "Yes, and it's genuinely useful — but with a caveat. A frontier vision model reads the image, recognizes the layout, colors, and components, and emits matching markup (typically React plus Tailwind, often shadcn/ui). For clean, structured UIs like dashboards, forms, and landing pages the result is impressively close. The honest framing is that it produces a strong first draft, around 80% there, that you refine conversationally. It is not a one-click replacement for a frontend engineer, because a flat image leaves out everything that isn't visible: interactive states, responsive behavior, accessibility, and whether the code uses your design system. Screenshot-to-code is an accelerator for the boring scaffolding, not an oracle for correct UI."
  - q: "Which tool should I use for screenshot-to-code?"
    a: "Match the tool to the situation. For greenfield work where you want a running app from an image or prompt, use a prompt-to-app builder: v0 leans toward React/Next.js/shadcn UI, Bolt builds and runs full-stack apps in the browser, and Lovable targets non-technical builders shipping a full stack including database and auth. For editing an existing codebase, don't start over in a builder — drop the screenshot into an agent inside an editor like Cursor so the model sees the image next to your real files and conventions. And if your source is a Figma file rather than a picture of one, skip the screenshot entirely and use Figma's MCP server, which gives the agent the actual design structure instead of pixels to guess from."
  - q: "Why isn't pixel-perfect output also correct?"
    a: "Because a picture only shows one state of one viewport. Matching it perfectly says nothing about what happens at a different screen width, on hover or focus, while loading, when a list is empty, or when the text is in another language. A screenshot also strips semantics: the model can't see that a div is supposed to be a button, that an input has a label association, or that two visually-similar elements are actually different components in your design system. So you can get output that is a flawless copy of the image and still wrong as a UI — non-responsive, inaccessible, and off-design-system. Pixel fidelity is the easy 80%; the missing 20% is where real frontend work lives."
  - q: "How do I prompt a vision model for higher-fidelity UI code?"
    a: "Give it the context the image can't contain. Use a high-resolution, tightly-cropped screenshot, then state your stack explicitly (framework, styling approach, component library), the breakpoints you care about, and the interactive and edge-case states — hover, focus, disabled, loading, empty. Tell it to reuse your existing components rather than inventing markup, and point it at an example file so it matches your conventions. Then iterate: the first generation is a draft, and the fidelity comes from a few rounds of specific, targeted follow-ups rather than from one perfect prompt."
  - q: "Is Figma's MCP better than a screenshot for design-to-code?"
    a: "When you have the actual Figma file, yes. A screenshot is a flattened raster — the model has to reverse-engineer structure, hierarchy, and spacing from pixels. Figma's Dev Mode MCP server instead passes the real design data to your agent: the node tree, component variants, layout constraints, and design tokens, plus Code Connect mappings that tell the agent exactly which of your code components corresponds to a given design component. That removes most of the guessing, so the output is more likely to be on-system and structurally faithful. Use a screenshot when the design lives only as an image; use the MCP when you have the file."
related: ["v0", "bolt", "lovable", "figma-mcp", "cursor", "add-image-understanding-to-your-app"]
---

Hand a vision model a screenshot of a UI and it will hand you back working code — usually React with Tailwind, often shadcn/ui — that looks a lot like the picture. This is real and it's useful. It's also where most people get burned, because **a screenshot that matches is not a UI that's correct**. A flat image throws away everything that makes frontend hard: responsive behavior, interactive state, accessibility, and your design system. The model fills those gaps by guessing.

So treat screenshot-to-code as what it actually is: a fast way to get an 80%-there first draft that you then refine. This guide covers the realistic workflow, which tool fits which job, how to prompt for fidelity, and exactly where it bites you.

## The realistic workflow: capture, describe, generate, refine

The loop is always the same four moves, and skipping the middle two is why output disappoints.

**Capture.** Use a high-resolution image and crop tightly to what you want. Include enough surroundings to imply layout, but cut unrelated chrome. Low-res or cluttered screenshots degrade results more than any prompt tweak.

**Describe.** This is the step everyone skips. A still frame has no hover, no loading spinner, no breakpoints, no data source. If you don't say what those should be, the model invents them. Name your framework, your design system, your target breakpoints, and the interactive states — then say where real data comes from.

**Generate.** Produce the first draft with the tool that fits (below).

**Refine.** The output is a draft, not a delivery. Iterate conversationally — tighten spacing, replace ad-hoc markup with your components, wire up state. The correctness lives in this back-and-forth, not in the first generation.

## Which tool fits which job

There's no single best tool; there's a best tool per situation.

### Greenfield: prompt-to-app builders

When you're starting from nothing and want a *running* app from an image or a sentence, reach for a prompt-to-app builder. [v0](/tools/v0) leans toward React, Next.js, and shadcn/ui — upload a screenshot or a Figma export and it analyzes layout, colors, and components, then generates matching code and a live preview. [Bolt](/tools/bolt) builds and runs full-stack apps in an in-browser environment and supports importing from Figma as a visual reference. [Lovable](/tools/lovable) aims at non-technical builders, generating a full stack — UI, database schema, auth, deploy — from natural language in one tab. All three are excellent for prototypes and net-new screens. None is the right move for editing code you already have.

### Existing repo: a vision model plus an agent in your editor

If the UI needs to land in a real codebase with real conventions, don't start over in a builder. Drop the screenshot into an agent inside your editor — [Cursor](/tools/cursor) lets you paste an image straight into the chat, where the model sees it alongside your open files. This is the difference that matters: the agent generates code that uses *your* components and patterns instead of generic markup, and it's especially good for visual debugging, where the model sees both the rendered problem and the actual stylesheet. Under the hood this is just the vision capability of a frontier model; if you're building this into your own product instead of using an editor, see [Add Image Understanding to Your App](/guides/vision/add-image-understanding-to-your-app).

### Design handoff: use the Figma file, not a picture of it

When the source is an actual Figma file, a screenshot is the worst option — you're throwing away structured data just to make the model reconstruct it. [Figma's MCP server](/tools/figma-mcp) passes the real design to your agent: the node tree, component variants, layout constraints, and design tokens, plus **Code Connect** mappings that tell the agent which of your code components a given design component maps to. That eliminates most of the guesswork a flat raster forces, so the output is far more likely to be on-system and structurally faithful. It works with Cursor, Claude Code, and other MCP clients. Screenshot when the design lives only as an image; MCP when you have the file.

## Prompting for fidelity

The model can only work with what you give it, and an image is missing most of the spec. Raise fidelity by adding the context a picture can't hold:

- **Name the stack.** Framework, styling approach, and component library. "shadcn/ui Card, not a raw div" changes everything downstream.
- **Specify breakpoints.** A screenshot is one viewport. Say what mobile and desktop should do, or you'll get one fixed-width layout.
- **List the states.** Hover, focus, disabled, loading, empty, error. None are in the image; all are in the real UI.
- **Point at conventions.** Reference an existing file so the output matches your patterns instead of inventing its own.
- **Iterate deliberately.** Fidelity comes from a few targeted follow-ups, not from one heroic prompt.

## The honest pitfalls

This is the part the demos skip.

**Pixel-perfect is not correct.** A flawless copy of the image can still be a broken UI — non-responsive, inaccessible, off-design-system. The picture is one state of one viewport, and matching it proves nothing about the other states.

**A screenshot loses semantics.** The model can't *see* that a styled box is meant to be a `<button>`, that an input needs a label association, or that two look-alike elements are actually distinct components. It guesses the meaning back from appearance, and it guesses wrong often enough to matter for accessibility and behavior.

**Responsive, state, and design-system gaps are invisible in the source.** Everything time- or size- or interaction-dependent is absent from a still frame. The model will produce *something* for those — usually plausible, frequently not what you want — and you won't notice until you resize the window or click.

**It generates generic markup by default.** Left alone, a model invents its own structure rather than using your design system. That's why in-repo agents and Figma's MCP, which give it your real components, produce better code than a bare screenshot ever can.

Used with eyes open, screenshot-to-code is a genuine accelerator — it kills the tedious scaffolding and gets you to a working draft in minutes. Just remember the draft is the easy 80%. The 20% you finish by hand is the part that was actually frontend engineering all along.
