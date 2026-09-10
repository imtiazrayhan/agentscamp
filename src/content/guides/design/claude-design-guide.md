---
title: "Claude Design: The Complete Guide (2026)"
description: "What Claude Design makes, how it ingests your design system, the three editing modes, every export and handoff, and where it stops. Written for designers."
author: "Imtiaz Rayhan"
date: 2026-09-10
updated: 2026-09-10
depth: cornerstone
color: "green"
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["claude-design", "designers", "prototypes", "design-system", "claude-code", "anthropic-labs", "design-to-code"]
featured: true
seoTitle: "Claude Design: The Complete Guide (2026)"
seoDescription: "Claude Design explained: what it makes, plans and status, design-system import, the /design-sync handoff to Claude Code, exports, limits, and how it compares."
keywords: ["claude design", "claude design guide", "anthropic claude design", "claude design vs figma", "design-sync claude code"]
summary: "Claude Design is Anthropic's visual workspace: you describe a prototype, deck, or landing page, Claude builds it on a canvas from your design system, and you refine it by chatting, commenting, or dragging. Launched as a research preview on April 17, 2026, it is in beta on Pro, Max, Team, and Enterprise, exporting to PDF, PPTX, HTML, and Canva."
keyTakeaways:
  - "Claude Design launched as a research preview on April 17, 2026 and is in beta on Pro, Max, Team, and Enterprise as of September 2026. Not on Free."
  - "It runs at claude.ai/design or in the Claude Desktop sidebar. Web and desktop only, with no mobile version."
  - "Your design system comes in from a GitHub repo, uploaded design files, raw uploads, or a local codebase through the /design-sync command in Claude Code."
  - "Three editing modes: chat for structural changes, inline comments for one element, and direct canvas editing with live knobs for spacing, color, and layout."
  - "Exports are ZIP, PDF, PPTX, and standalone HTML, plus sends to Adobe, Base44, Canva, Gamma, Lovable, Miro, Replit, Vercel, and Wix."
  - "When a design is ready to build, Claude packages a handoff bundle you pass to Claude Code with a single instruction."
  - "Design activity counts against the same usage pool as chat, Cowork, and Claude Code. There is no separate Design allowance."
sources:
  - title: "Claude Design (Anthropic Labs)"
    url: "https://www.anthropic.com/news/claude-design-anthropic-labs"
    publisher: "Anthropic"
  - title: "Get started with Claude Design"
    url: "https://support.claude.com/en/articles/14604416-get-started-with-claude-design"
    publisher: "Anthropic"
  - title: "Claude Design product page"
    url: "https://claude.com/product/design"
    publisher: "Anthropic"
  - title: "Claude Code commands reference (/design, /design-sync)"
    url: "https://code.claude.com/docs/en/commands"
    publisher: "Anthropic"
  - title: "Design plugin (anthropics/knowledge-work-plugins)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/design"
    publisher: "Anthropic"
  - title: "How do usage and length limits work?"
    url: "https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work"
    publisher: "Anthropic"
faq:
  - q: "What is Claude Design?"
    a: "Claude Design is a visual workspace from Anthropic where you collaborate with Claude to produce designs, interactive prototypes, presentations, and one-pagers. You describe what you want, Claude builds it on a canvas using your design system, and you refine it through chat, inline comments, or direct editing on the canvas."
  - q: "Which plans include Claude Design, and is it still a research preview?"
    a: "It launched as a research preview on April 17, 2026. As of September 2026 the product page and help center describe it as beta on Pro, Max, Team, and Enterprise, included with the subscription. Enterprise organizations are off by default and need an admin to enable it in Organization settings. Free is not on the list."
  - q: "Can Claude Design read my Figma file?"
    a: "Not directly. As of September 2026 the documented design-system sources are GitHub repositories, uploaded design files, raw file uploads, and a local codebase synced with the design-sync command in Claude Code. Figma appears in the design plugin's connectors and in Figma's own MCP server, which is the route when you want an agent to read a live Figma file."
  - q: "What can I export from Claude Design?"
    a: "A ZIP download, PDF, PPTX, and standalone HTML, plus sends to Adobe, Base44, Canva, Gamma, Lovable, Miro, Replit, Vercel, and Wix, with more destinations described as coming soon. You can also share a link with view, comment, or edit access inside your organization, or package a handoff bundle for Claude Code."
  - q: "Does Claude Design have its own usage limit?"
    a: "No. Anthropic's help center says Design activity counts toward the same usage limits as the rest of Claude, with no separate allowance. A long Design session takes from the same pool as chat, Cowork, and Claude Code."
related: ["tool:claude-design", "guide:claude-code-for-designers", "guide:claude-design-vs-figma-make", "guide:maintain-a-design-system-with-claude-code", "guide:claude-design-plugin-guide", "guide:which-claude-plan-for-designers", "guide:best-ai-tools-for-designers-2026", "tool:claude-code"]
---

Claude Design is Anthropic's visual workspace. You describe a prototype, a deck, or a landing page, Claude builds it on a canvas using your design system, and you refine it by talking to it, commenting on an element, or dragging things around. It launched as a research preview on April 17, 2026 and is in beta on Pro, Max, Team, and Enterprise as of September 2026. This guide is the mechanics, from a developer's side of the handoff: what it makes, how it learns your system, every export path, and where it stops.

## What Claude Design is, and what it makes

Anthropic's launch post describes it as a product that "lets you collaborate with Claude to create polished visual work like designs, prototypes, slides, one-pagers, and more." The product page is more concrete about the output types: interactive prototypes, wireframes and mockups, design explorations, pitch decks, marketing collateral, and documents such as resumes and one-pagers. In practice that covers the artifacts a product designer produces between a brief and a build: a clickable feature flow, a landing page, an onboarding sequence, a form, a dashboard screen, and the deck that explains all of them.

The important distinction is that prototypes here are code-backed rather than a chain of linked screenshots. The canvas renders real markup, which is why the same artifact can be exported as standalone HTML and why a slider you ask for actually changes the rendered result. That property has a name, [generative UI](/glossary/generative-ui), and it is the reason a Design prototype can behave like the product instead of miming it. It is also why the output is a real starting point for [design-to-code](/glossary/design-to-code) rather than a reference image someone has to rebuild.

The tool page on this site, [Claude Design](/tools/claude-design), is the short version with the current facts; this guide is the long one.

## Status, plans, and where to open it

Claude Design shipped from Anthropic Labs, the group that incubates experimental products on top of [Claude](/tools/claude). At launch it ran on Claude Opus 4.7, which Anthropic called "our most capable vision model." The status has moved once already: research preview at launch on April 17, 2026, and beta as of September 2026, with the product page still saying "It's early, and we're shipping improvements often." Expect the export list and the editing controls to keep changing.

Availability, as of September 2026: beta on Pro, Max, Team, and Enterprise, included with the subscription. Enterprise is off by default and needs an admin to turn it on in Organization settings. Free is not on the list. Which tier is the right one for your situation is a separate question, worked through in [Which Claude Plan Should a Designer Pay For?](/guides/design/which-claude-plan-for-designers), with the current figures on the [plans comparison](/guides/getting-started/claude-plans-compared-2026).

You open it at claude.ai/design in a browser or from the Claude Desktop sidebar. There is no mobile version. Usage is not metered separately: Anthropic's help center says Design counts toward the same usage limits as the rest of Claude, so a long canvas session takes from the same pool as chat, [Cowork](/tools/claude-cowork), and Claude Code.

## Getting your design system in

This is the step that decides whether the output is usable or generic, and it is worth doing properly before you generate anything. During onboarding, in Anthropic's words, "Claude builds a design system for your team by reading your codebase and design files," and every later project applies those colors, typography, and components automatically.

There are four documented ways in:

| Source | What it is good for |
|---|---|
| GitHub repository | A component library that already lives in code and is the real source of truth |
| Design files | An existing system that lives in your design tool, uploaded as files |
| Raw uploads | A brand PDF, a logo pack, a style guide, a few screenshots of the current product |
| `/design-sync` in Claude Code | A local repo you have checked out, converted and uploaded from the terminal |

Teams get one more control: the product page describes "a new admin role" that can "approve one standard system and lock down edits," so a marketing hire cannot quietly invent a second button style.

What is not on the list, as of September 2026, is a live Figma connection. Figma is not among the export destinations, and the design-system sources are repos, files, and uploads. If your system's source of truth is a Figma library, the practical routes are to export the pieces and upload them, or to keep Figma in the loop through [Figma's own MCP server](/tools/figma-mcp), which hands an agent the node tree, variants, and [design tokens](/glossary/design-tokens) instead of pixels. That path is covered end to end in [Figma to Code with Claude](/guides/design/figma-to-code-with-claude). If you only have a built product and no written system, [design-token-extractor](/skills/design/design-token-extractor) will read screenshots or CSS and give you the token set to upload.

## The three ways to edit

Once something is on the canvas, Anthropic documents three ways to change it, and picking the right one is most of the speed:

- **Chat** for structural changes. "Make this a three-column layout," "add an empty state," "cut the second section." This is the mode that rebuilds.
- **Inline comments** for one element. Click the component, say what is wrong, and only that component changes. This is the mode that stops a small fix from redrawing the page.
- **Direct canvas editing** for layout and copy. Drag, resize, edit text in place. Anthropic also describes "adjustment knobs to tweak spacing, color, and layout live," which is the closest thing to a properties panel.

The habit worth forming early: describe outcomes in chat, fix specifics with comments, and only touch the canvas for the last five percent. Reaching for chat to nudge a margin is how a good screen turns into a different screen.

## Exports and handoffs

Design produces files, not screenshots of files. The documented exports are a ZIP download, PDF, PPTX, and standalone HTML. On top of that sit the send-to integrations, which as of September 2026 are Adobe, Base44, [Canva](/tools/canva), [Gamma](/tools/gamma), [Lovable](/tools/lovable), Miro, Replit, Vercel, and Wix, with the product page noting "more destinations coming soon."

Sharing is separate from exporting: you can share a link with view-only, comment, or edit access inside your organization. In practice the split falls out cleanly. A deck leaves as PPTX or goes to Canva. A one-pager leaves as PDF. A prototype goes out as a share link for feedback, as standalone HTML for an embed, or to [Base44](/tools/base44) or Lovable when someone wants to keep building it in an app builder. And when the destination is your actual product, it goes to Claude Code.

## The Claude Code handoff and `/design-sync`

The handoff is the part that matters most if the design is meant to ship. Anthropic's launch post: "When a design is ready to build, Claude packages everything into a handoff bundle that you can pass to Claude Code with a single instruction." The support article adds that you can send it to a local Claude Code agent or to Claude Code on the web.

Two slash commands connect the surfaces in the other direction, both documented in Claude Code's commands reference:

```text
/design-sync Acme DS
```

`/design-sync` converts your repo's React design system and uploads it to Claude Design "so designs it produces use your real components." Naming it is optional. Two caveats from the docs: a first-time sync verifies every component and "can take a few hours on a large repo," and the command is unavailable on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and Claude Platform on AWS, because the underlying tool cannot reach claude.ai from there.

```text
/design a settings screen for a mobile banking app
```

`/design` goes the other way: it drafts artboards on one canvas and publishes them as an artifact running a research preview of Claude Design's editor, without leaving [Claude Code](/tools/claude-code). It needs a session where artifacts are available and Claude Code v2.1.234 or later.

Keeping the synced system honest over time is its own job, and the mechanics of doing it in a repo, including what to re-sync after a token change, are in [Maintain a Design System with Claude Code](/guides/design/maintain-a-design-system-with-claude-code). If you have never opened the terminal side at all, start with [Claude Code for Designers](/guides/design/claude-code-for-designers).

## A worked example: brief to prototype to export

Here is the whole loop on one feature, a billing settings page, with the design system already ingested.

**1. Write the brief.** Use [design-brief-writer](/skills/design/design-brief-writer) in chat first, so the prompt you paste into Design is specific about the user, the states, and the constraints rather than about the vibe.

**2. Generate on the canvas.**

```text
Using our design system, build an interactive prototype of the billing
settings page: current plan card, a usage meter, an upgrade modal, and
the empty state for a brand-new account. Add a knob for the usage
percentage so I can show 20%, 80%, and 100%. Do not invent new colors
or spacing values.
```

**3. Refine in the right mode.** Comment on the usage meter to fix its label, chat to add the annual/monthly toggle you forgot, drag the modal's buttons into the right order.

**4. Check it.** Run [design-critique-checklist](/skills/design/design-critique-checklist) against a screenshot of each state, and [ux-copy-reviewer](/skills/design/ux-copy-reviewer) against the strings, before anyone else sees it.

**5. Ship it two ways.** Export PDF for the review meeting, and package the handoff bundle for Claude Code. Ask the engineer receiving it to build against the repo's real components, not the bundle's markup, which is the difference between a prototype and a pull request.

> [!TIP]
> Ask for the states you will not demo, especially the empty, loading, and error states. They are the ones that get invented during implementation if the prototype never showed them.

## What it does not do yet

The support article is unusually candid about the rough edges, and all of these were current as of September 2026:

- **Web and desktop only.** No mobile version.
- **Multi-person simultaneous editing has limited reliability.** Treat the canvas as single-driver, and use comments for everyone else.
- **Comment persistence is intermittently unreliable.** Do not let a comment thread be the only record of a decision.
- **Large codebases may cause performance issues** during ingestion, which is consistent with the multi-hour first sync `/design-sync` warns about.

> [!WARNING]
> Design shares one usage pool with chat, Cowork, and Claude Code. A long canvas afternoon is a long canvas afternoon at the expense of everything else that day. Anthropic's usage article notes that tool- and connector-heavy work is token-intensive, and prototype iteration is exactly that.

## How it compares to Figma Make, v0, and Lovable

The honest framing is that these tools overlap in output and differ in what they leave behind.

[v0](/tools/v0) and [Lovable](/tools/lovable) generate working applications from prompts. If the goal from minute one is shippable code with a database behind it, they are the closer fit, and Claude Design's role shrinks to the exploration that happens first. Claude Design's advantage is the range either side of the prototype: it also makes the deck, the one-pager, and the marketing page, on the same design system, and it ends in a handoff bundle rather than a codebase somebody now owns.

Against [Figma Make](/tools/figma-make), the comparison turns on where your design system already lives and what happens after the artifact exists. The head-to-head, including the export and handoff paths on both sides, is in [Claude Design vs Figma Make](/guides/comparisons/claude-design-vs-figma-make).

If the input is a picture rather than a brief, that is a different workflow with different failure modes, covered in [Screenshot-to-Code](/guides/vision/screenshot-to-code-with-ai).

## The rest of a designer's AI stack

Claude Design does not cover everything, and the gaps have obvious occupants. For sites and marketing pages generated as sites, [Framer AI](/tools/framer-ai), [Relume](/tools/relume), and [Stitch](/tools/stitch) each take a different slice of the same job, and [Best AI Tools for Designers (2026)](/guides/comparisons/best-ai-tools-for-designers-2026) puts them next to each other with what each is actually good for.

Image generation is a separate category with separate winners: [Midjourney](/tools/midjourney) for aesthetics, [Recraft](/tools/recraft) for vector and brand-consistent output, [Ideogram](/tools/ideogram) for text rendered inside an image. The ranked comparison is [Best AI Image Generators (2026)](/guides/comparisons/best-ai-image-generators-2026), and the two terms worth knowing before you read it are [text-to-image](/glossary/text-to-image) and [diffusion model](/glossary/diffusion-model), which is the architecture nearly all of them use.

## Skills, commands, and an agent for the repeatable parts

Whatever you do more than twice belongs in a skill rather than a prompt you retype. Five are built for this role: [design-brief-writer](/skills/design/design-brief-writer) for the brief, [design-critique-checklist](/skills/design/design-critique-checklist) for a structured pass over a screen, [design-token-extractor](/skills/design/design-token-extractor) for pulling a token set out of screenshots or CSS, [component-spec-writer](/skills/design/component-spec-writer) for the spec an engineer needs, and [ux-copy-reviewer](/skills/design/ux-copy-reviewer) for the strings. Uploading them takes about a minute each, and the steps are in [Claude Skills for Designers](/guides/design/claude-skills-for-designers).

Inside Claude Code the same jobs are keystrokes: [/critique-screen](/commands/design/critique-screen) runs the critique against an image or a route, and [/design-tokens](/commands/design/design-tokens) extracts or audits the token set in the repo. The [design-systems-librarian](/agents/design/design-systems-librarian) agent is the one to delegate to when the question is whether a component already exists before someone builds a fourth variant of it.

Anthropic also publishes a design plugin in its open-source `knowledge-work-plugins` repository, "primarily designed for Cowork" and also working in Claude Code. As of September 2026 the folder holds seven skills (`design-critique`, `design-system`, `design-handoff`, `ux-copy`, `accessibility-review`, `user-research`, `research-synthesis`) and no commands directory, though its README still describes six commands and six skills. Its `.mcp.json` pre-configures connectors for Figma, Linear, Asana, Atlassian, Notion, and others. What each one produces is in [Anthropic's Design Plugin: A Guide](/guides/design/claude-design-plugin-guide), and the wider catalog is in [Claude's knowledge work plugins](/guides/getting-started/claude-knowledge-work-plugins).

Accessibility is deliberately not one of the five skills above, because this site already carries a deeper pass: the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent and the [/audit-accessibility](/commands/analyze/audit-accessibility) command check against WCAG 2.2 AA. Run one of them on anything you export before it becomes a build ticket.

## Where to go next

Ingest your design system first, because everything Claude Design produces before you do that is a demo of the wrong thing. Then run one real brief through the loop above, end to end, including the export. If the handoff is where your work usually gets lost, read [Claude Code for Designers](/guides/design/claude-code-for-designers) next and set up the repo side. Everything on this site for your role is collected at the [designers hub](/for/designers).
