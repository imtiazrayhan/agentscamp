---
term: "Design Tokens"
description: "Design tokens are named values for a design system's decisions — color, spacing, type, radius — stored once and referenced everywhere instead of hardcoded."
date: 2026-09-10
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["design", "design-system", "tokens", "consistency"]
related: ["skill:design-token-extractor", "guide:maintain-a-design-system-with-claude-code", "command:design-tokens", "glossary:design-to-code", "guide:claude-design-guide"]
summary: "Design tokens are the named values behind a design system — colors, spacing, type scale, radii, shadows — defined once and referenced by every component. They are what makes a design system legible to an AI agent, which is why token hygiene now affects the quality of generated UI."
faq:
  - q: "What counts as a design token?"
    a: "Any design decision worth naming: palette colors, spacing steps, type sizes and weights, border radii, shadows, motion durations, and breakpoints. Teams usually split them into primitive tokens, which are raw values like a hex code, and semantic tokens, which describe intent, like surface or danger, and point at the primitives."
  - q: "Why do tokens matter more now than they did?"
    a: "Because generators read them. Tools that build interfaces from a prompt reuse whatever system you give them, so a clean token set produces output that looks like your product and a messy one produces plausible-looking output in someone else's house style. Tokens turned into the interface between your brand and every AI tool that touches it."
  - q: "How do I start if we have no tokens at all?"
    a: "Extract before you design. Have an agent inventory every color, spacing value, font size, and radius in the codebase, group the near-duplicates, and propose a named scale. You will usually find a handful of intentional values buried under dozens of accidental ones, and the grouping is the real work."
---

**Design tokens are the named values that encode a design system's decisions — color, spacing, type scale, radius, shadow, motion — defined in one place and referenced by every component instead of being retyped as raw values.** `--space-4` instead of `16px`, `--color-surface-raised` instead of a hex code.

The old argument for tokens was consistency and theming: change one value, and every screen follows. The 2026 argument is machine legibility. Every generative tool that produces an interface — [Claude Design](/tools/claude-design) reading a repository, a prompt-to-prototype tool reading a package — reproduces the structure it finds. Give it a named scale and it reuses your scale; give it eleven similar grays and it invents a twelfth. Token hygiene is now the highest-leverage design work in a codebase, because it compounds through every generated screen after it.

That makes extraction the practical starting point. The [design-token-extractor](/skills/design/design-token-extractor) skill inventories the values already in your product and proposes a named set; the [/design-tokens](/commands/design/design-tokens) command runs the same pass inside a repository; and [maintain a design system with Claude Code](/guides/design/maintain-a-design-system-with-claude-code) covers keeping the set honest as the product grows. Tokens are also what make [design-to-code](/glossary/design-to-code) produce a diff a developer will merge rather than a rewrite. The wider workflow is in the [Claude Design guide](/guides/design/claude-design-guide).
