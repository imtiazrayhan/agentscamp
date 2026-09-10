---
name: "Claude Design"
description: "An Anthropic Labs tool for making prototypes, decks, and one-pagers with Claude, using your design system, with PPTX, PDF, HTML, and Canva export."
seoDescription: "Claude Design by Anthropic Labs: prototypes, decks, and one-pagers built on your design system, exported to PPTX, PDF, HTML, or Canva. Plans and status in 2026."
date: 2026-09-10
url: "https://claude.com/product/design"
pricing: "paid"
category: "design"
color: "pink"
topics: ["ai-at-work", "multimodal-ai"]
audience: ["developers", "founders", "marketers"]
tags: ["claude", "design", "anthropic-labs", "prototypes", "decks", "design-system"]
featured: false
related: ["tool:claude", "tool:claude-cowork", "tool:claude-code", "tool:figma-mcp", "tool:v0", "tool:lovable", "guide:claude-plans-compared-2026", "guide:screenshot-to-code-with-ai"]
alternativeTo: ["figma-mcp", "v0", "lovable"]
os: ["Web", "macOS", "Windows"]
sameAs: ["https://www.anthropic.com/news/claude-design-anthropic-labs"]
summary: "Claude Design is an Anthropic Labs product, launched April 17, 2026, for making interactive prototypes, slide decks, one-pagers, and landing pages by talking to Claude. It ingests your design system from a repo or design files, refines by comments, sliders, or direct edits, and exports to PPTX, PDF, HTML, or Canva. Beta on Pro, Max, Team, and Enterprise."
faq:
  - q: "What is Claude Design?"
    a: "Claude Design is a visual workspace from Anthropic Labs where you collaborate with Claude to produce designs, interactive prototypes, slides, and one-pagers. You describe what you want, Claude builds it on a canvas, and you refine through chat, inline comments, direct edits, or sliders Claude creates for the parameters that matter."
  - q: "Which plans can use Claude Design?"
    a: "Pro, Max, Team, and Enterprise. It is included with the subscription and uses the same usage limits as chat, Claude Code, and Cowork, with an option to enable extra usage beyond them. Enterprise organizations need an admin to turn it on. It is not on the Free plan."
  - q: "Is Claude Design still a research preview?"
    a: "It launched as a research preview on April 17, 2026. As of September 2026 the product page and help center describe it as beta on Pro, Max, Team, and Enterprise, and Anthropic says it is early and shipping improvements often."
  - q: "What can I export from Claude Design?"
    a: "PPTX, PDF, and standalone HTML, plus a zip download, Send to Canva, and an org-scoped share link. It also connects to Adobe, Base44, Gamma, Lovable, Miro, Replit, Vercel, and Wix, and can package a handoff bundle for Claude Code to implement."
  - q: "Does Claude Design use my design system?"
    a: "Yes. During onboarding Claude reads your codebase and design files and builds a design system for your team; later projects use those colors, typography, and components automatically. You can import from GitHub repos, design files, raw uploads, or a local codebase via the design-sync command, and Team and Enterprise admins can lock an approved system."
---

Claude Design is a visual workspace from Anthropic Labs, the team that incubates experimental products on top of Claude. You describe a prototype, deck, or one-pager, Claude builds it on a canvas, and you refine it through conversation, inline comments, direct edits, or sliders Claude creates for the parameters worth tuning. It launched as a research preview on April 17, 2026, powered by Claude Opus 4.7, and is in beta as of September 2026.

It is aimed at product teams and founders who need something clickable or presentable fast, and at marketers producing landing pages and one-pagers on brand. Designers use it to turn static mockups into interactive prototypes without a code review; the design-system ingestion is what makes the output usable rather than generic.

## Highlights

- **Prototypes, decks, and documents from one prompt.** Interactive prototypes, wireframes and mockups for feature flows, pitch decks, landing pages, social assets, dashboards, onboarding flows, forms, internal tools, and one-pagers.
- **Design-system ingestion.** During onboarding Claude reads your codebase and design files and builds a design system; every later project uses your colors, typography, and components. Sources include GitHub repos, design files, raw uploads, and a local codebase through `/design-sync`. Admins on Team and Enterprise can approve and lock the standard system.
- **Three ways to refine.** Chat for structural changes, inline comments for a specific component, and direct canvas editing (drag, resize, edit text) for layout. Claude can also generate sliders for a value you want to explore.
- **Real exports.** PPTX, PDF, standalone HTML, zip download, Send to Canva, and an org-scoped link. Integrations with Adobe, Base44, Gamma, Lovable, Miro, Replit, Vercel, and Wix.
- **Handoff to Claude Code.** When a design is ready to build, Claude packages a handoff bundle you can pass to [Claude Code](/tools/claude-code), locally or on the web, with a single instruction.
- **Code-powered prototypes.** Prototypes can include voice, video, shaders, 3D, and built-in AI, so a demo can behave like the product rather than a click-through.

## In an AI-assisted workflow

The pattern that fits most teams: ingest the design system once, generate in Design, then hand the bundle to Claude Code for the real implementation. That keeps Design as the exploration layer and the repository as the source of truth.

```text
Using our design system, build an interactive prototype of the new
billing settings page: plan card, usage meter, and an upgrade modal.
Add a slider for the usage percentage so I can screenshot 20%, 80%,
and 100% states. Then package a handoff bundle for Claude Code.
```

For a deck, the same flow ends in PPTX or Canva instead of code. The [Cowork](/tools/claude-cowork) agent can gather the research that feeds the deck; Design produces the deck itself.

> [!NOTE]
> Design shares your subscription's usage pool with chat, Claude Code, and Cowork. There is no separate Design allowance, though you can enable extra usage to continue beyond your plan limits.

## Good to know

Availability, as of September 2026: beta on Pro, Max, Team, and Enterprise, included with the subscription. Enterprise requires an admin to enable it in organization settings. It is not on the Free plan; the [plans comparison](/guides/getting-started/claude-plans-compared-2026) covers what each tier includes. Access is at claude.ai/design on the web or from the Claude Desktop sidebar; there is no mobile version. Design is web and desktop only.

How it compares: [v0](/tools/v0) and [Lovable](/tools/lovable) generate working apps from prompts and are the closer fit when the goal is shippable code from the start. [Figma MCP](/tools/figma-mcp) is the route when the design already lives in Figma and you want an agent to read it. Claude Design sits between: faster than an app builder for exploration, decks, and documents, with a bundle you hand to Claude Code when it is time to build. Because it is early and Anthropic ships changes often, expect the export list and editing controls to keep moving.
