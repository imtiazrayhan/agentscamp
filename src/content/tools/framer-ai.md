---
name: "Framer"
description: "A website design tool with AI agents that generate editable pages, wireframes, CMS content, and code components, then publish to hosting Framer runs."
seoDescription: "Framer for designers: AI agents, Wireframer, CMS and code-component agents, site review, and Free, Basic, Pro plan pricing with AI credits as of September 2026."
date: 2026-09-10
url: "https://www.framer.com"
pricing: "freemium"
category: "design"
color: "blue"
os: ["Web", "macOS", "Windows"]
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["framer", "website-builder", "wireframing", "cms", "publishing"]
featured: false
alternativeTo: ["relume", "canva", "lovable"]
sameAs: ["https://www.framer.com/ai/", "https://www.framer.com/pricing/"]
related: ["tool:relume", "tool:canva", "tool:stitch", "tool:lovable", "tool:claude-code", "guide:claude-design-guide", "guide:best-ai-tools-for-designers-2026", "guide:claude-code-for-designers"]
keywords: ["Framer AI", "Wireframer", "AI website builder", "Framer pricing", "Framer AI credits"]
summary: "Framer is a canvas-based website tool where AI agents generate editable pages, sections, copy, and visuals, not opaque code. Wireframer makes structure-first responsive layouts from a prompt, and agents handle CMS content, code components, pre-publish review, and analytics. Site plans run Free, Basic, Pro, and Enterprise, each with monthly AI credits."
faq:
  - q: "What does Framer's AI actually generate?"
    a: "Editable website layers, not a black box. Framer describes its agent as creating editable pages, sections, copy, and visuals directly in your project, which you then refine on the canvas: layouts, typography, components, breakpoints, spacing, color, and effects. Separate agents cover CMS collections and content, code components for custom interactions, a pre-publish site review, and analytics."
  - q: "What is Wireframer?"
    a: "Wireframer is Framer's layout generator. You open it from the insert panel or by pressing W, describe the page, and it generates responsive sections on the canvas including navigation, headings, image placeholders, and generated body copy. Framer's own framing is that it focuses on structure, not style, so you keep control of the aesthetics."
  - q: "How much does Framer cost?"
    a: "As of September 2026 Framer's pricing page lists a Free site plan at zero with 500 AI credits to try, Basic at 10 dollars a month with 1,000 AI credits a month, Pro at 30 dollars a month with 3,000 AI credits a month, and Enterprise on custom pricing with volume discounts on credits. Additional editors are 20 dollars a month each, content editors 10 dollars a month each, and viewers are free."
  - q: "Can I connect Framer to Claude Code or another coding agent?"
    a: "Yes. Framer's AI page lists connections to external agents including Claude Code, Cursor, and Codex, so an agent outside Framer can make updates and publish. That is useful when the site content lives in a repo and you want one source of truth for copy."
---

Framer is a canvas-based website tool that has grown an agent layer. You design pages on a canvas the way you would in a design tool, and Framer's AI agents write into that same canvas rather than into a code file you cannot see. Framer's description of the agent is direct: it "creates editable pages, sections, copy, and visuals directly in your project."

For designers the appeal is that nothing generated is final. A prompt produces layers you can select, restyle, and rebreak at each breakpoint, so an AI pass is a first draft rather than a commitment. Hosting, CMS, forms, SEO, localization, analytics, and A/B testing are all part of the same product, which means the generated draft can go live without a handoff.

## Highlights

- **Wireframer for structure.** Press W or open it from the insert panel, describe the page, and it generates responsive sections with navigation, headings, image placeholders, and generated body copy. Framer's framing is layouts that focus on structure, not style.
- **Design, CMS, and code agents.** One agent refines layout, typography, components, breakpoints, spacing, color, and effects. Another creates collections and populates CMS content. A third builds a code component when you describe an interaction Framer does not ship.
- **A pre-publish reviewer.** The agent can review a site before publishing and flag contrast issues, typos, missing alt text, SEO gaps, and inconsistent styles.
- **Analytics that answer back.** The analytics agent reviews top pages, drop-offs, search intent, and conversion gaps and proposes next steps rather than only charting them.
- **External agents.** Framer connects to Claude Code, Cursor, and Codex, so updates and publishes can come from outside the canvas.
- **Publishing is included.** Framer hosts what you build, with a 99.99 percent uptime claim, staging and branching on Pro, and custom domains from Basic up.

## In a designer's workflow

The pattern that works is structure first, style second. Let Wireframer settle the section order and the responsive skeleton while the page is still cheap to throw away, then design into it.

```text
Wireframer: a pricing page for a B2B analytics product. Sections:
hero with one sentence and a single CTA, three-tier plan comparison,
a feature matrix, two customer quotes, an FAQ of six questions, and a
footer CTA. No decorative imagery. Mobile layout first.
```

Once the skeleton reads, the design agent handles type scale and spacing, the CMS agent fills the FAQ from a collection, and the site-review agent catches the alt text you forgot. If the copy is the part that has to stay honest, keep it in a repo and let a coding agent push it in: the [Claude Code for designers](/guides/design/claude-code-for-designers) guide covers that split.

> [!NOTE]
> Every AI action draws on the site plan's monthly credit allowance, and credits sit on the site plan rather than the seat. A team with many editors on one Pro site shares one pool.

## Good to know

Framer runs in the browser and as a desktop app for Mac and Windows. As of September 2026 the pricing page lists Free at zero with 500 AI credits to try and 1 GB of bandwidth, Basic at 10 dollars a month with 1,000 AI credits and 50 GB of bandwidth, Pro at 30 dollars a month with 3,000 AI credits, 100 GB of bandwidth, staging, and branching with previews, and Enterprise on custom pricing with volume credit discounts and unlimited editors. Seats are priced separately: additional editors at 20 dollars a month, content editors at 10 dollars a month, viewers free.

The trade-off is the same one every hosted builder makes: the site is Framer's platform, and moving off it means rebuilding. If you want the generated structure to leave with you, [Relume](/tools/relume) exports a sitemap and wireframes to Figma, Webflow, or React instead of hosting them. [Stitch](/tools/stitch) is the closer comparison for app UI rather than marketing sites, and [Canva](/tools/canva) covers the graphics and social side of the same campaign. For the wider field, see [best AI tools for designers in 2026](/guides/comparisons/best-ai-tools-for-designers-2026) and the [Claude Design guide](/guides/design/claude-design-guide).
