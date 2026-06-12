---
name: "Stagehand"
description: "Browserbase's open-source SDK for browser agents — act, extract, observe, and agent primitives that mix natural language with code-level control."
date: 2026-06-11
url: "https://stagehand.dev"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/browserbase/stagehand"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["ai-agents-systems"]
tags: ["browser-agents", "automation", "typescript", "browserbase"]
featured: false
alternativeTo: ["browser-use", "skyvern", "playwright-mcp"]
sameAs:
  - "https://github.com/browserbase/stagehand"
  - "https://docs.stagehand.dev"
  - "https://www.browserbase.com"
related: ["browser-agents-compared-2026", "browser-use", "skyvern", "how-computer-use-agents-work", "playwright-mcp", "structured-output"]
summary: "Stagehand (MIT, ~23k stars, by Browserbase) is the engineer's browser-agent SDK: four primitives — act() for natural-language actions that survive redesigns, extract() with Zod-validated schemas, observe() to preview actionable elements, agent() for full autonomy — composable with ordinary code. TypeScript-first, Python too; Browserbase cloud optional."
faq:
  - q: "How is Stagehand different from Browser Use?"
    a: "Control philosophy. Browser Use leads with full autonomy — one task string, the agent figures it out. Stagehand leads with composable primitives: you write real code and drop to natural language exactly where selectors would be brittle (act('click the login button')), with extract() returning schema-validated data. Determinism where you want it, AI where you need it."
  - q: "Do I need Browserbase to use Stagehand?"
    a: "No — the SDK is MIT and runs against local Chromium with just a model API key. Browserbase's cloud browsers are the optional production layer (scale, session recording, stealth, proxies). The npx create-browser-app scaffold runs locally out of the box."
  - q: "What changed in Stagehand v3?"
    a: "A re-architecture: Playwright was removed entirely in favor of running natively at the CDP protocol level with a modular driver system, plus self-healing execution and caching of discovered actions to cut repeat LLM calls — Browserbase claims ~44% faster interactions across iframes and shadow roots. v2 configs and tutorials don't carry over; there's a migration guide."
---

Stagehand is the browser-agent framework built the way engineers wish AI tools were built: **deterministic code by default, intelligence exactly where brittleness lives.** Instead of handing the whole task to an agent, you compose four primitives — and each one earns its place.

## Highlights

- **`act()`** — natural-language actions ("click the submit button") resolved against the live page, surviving the redesigns that break selectors.
- **`extract()`** — structured data out, validated against a Zod schema: [structured output](/glossary/structured-output) discipline applied to scraping.
- **`observe()`** — preview what's actionable on a page before committing, the look-before-you-leap primitive.
- **`agent()`** — full multi-step autonomy when you want it, model-agnostic (pairs with any LLM or computer-use model).
- **v3 architecture** — native CDP driver layer (Playwright removed), self-healing execution, and action caching that avoids repeat inference on known pages.
- **Two languages** — TypeScript flagship, Python SDK alongside; `npx create-browser-app` scaffolds a running project.

## In an AI-assisted workflow

```bash
npx create-browser-app    # scaffold + run locally; OPENAI_API_KEY (or similar) required
```

The sweet spot is **reliable automations with AI joints**: a checkout flow that's 90% ordinary code and 10% `act()` where the DOM churns; an extraction pipeline whose schema is enforced, not hoped for. For one-shot autonomous errands, [Browser Use](/tools/browser-use)'s task-in/result-out model is less ceremony; the trade is exactly control versus convenience.

> [!TIP]
> The caching matters in production: actions Stagehand has resolved once replay without LLM calls until the page changes — turning per-step model costs from a constant into an amortized one.

## Good to know

MIT, from Browserbase (whose $40M Series B, June 2025, funds the cloud layer: hosted browsers, recordings, stealth, proxies — optional, paid, and where scale lives). v2-era content predates the Playwright removal — check versions when following tutorials. Field positioning against Browser Use, Skyvern, and the MCP-based options: [Browser Agents in 2026](/guides/comparisons/browser-agents-compared-2026).
