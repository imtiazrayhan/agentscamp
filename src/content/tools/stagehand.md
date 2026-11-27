---
name: "Stagehand"
description: "Browserbase's MIT-licensed SDK for browser agents: Playwright-style code plus act, extract and observe in natural language, for TypeScript, Python and Go."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://stagehand.dev"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/browserbase/stagehand"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["browser-agents", "automation", "typescript", "browserbase"]
featured: false
alternativeTo: ["browser-use", "skyvern", "playwright-mcp"]
sameAs:
  - "https://github.com/browserbase/stagehand"
  - "https://docs.stagehand.dev"
  - "https://www.browserbase.com"
related: ["guide:browser-agents-compared-2026", "tool:browser-use", "tool:skyvern", "guide:how-computer-use-agents-work", "tool:playwright-mcp", "glossary:structured-output"]
summary: "Stagehand is Browserbase's MIT-licensed browser automation SDK: you write Playwright-style code and call act(), extract() and observe() in natural language where selectors would be brittle. Version 4 ships one SDK for TypeScript, Python and Go, and removed the autonomous agent() primitive in favor of scripts and tool-calling loops you own."
faq:
  - q: "What changed in Stagehand v4?"
    a: "Two things, per the migration guide. agent() is gone with no one-for-one replacement: you either have a coding assistant write a Stagehand script (code mode) or run your own tool-calling loop. And the SDK surface moved: you launch a browser with localBrowser.launch() or browserbase.launch(), build on it with Stagehand.create({ browser }), and act, extract and observe live on that instance. Python and Go now share the same shape."
  - q: "Do I need Browserbase to use Stagehand?"
    a: "No. The SDK is MIT-licensed and drives a local Chrome over the Chrome DevTools Protocol with your own model API key; local runs need Chrome installed. Browserbase is the optional hosted layer: cloud browsers, a Model Gateway so you do not configure a provider, and server-side caching of repeated actions."
  - q: "How is Stagehand different from Browser Use?"
    a: "Control. Browser Use takes a task string and lets an agent work out the steps. Stagehand has you write the script and spend a model call only where a page needs judgement: act('click the sign in button') instead of a selector that breaks on redesign, extract() into a schema. Since v4 dropped agent(), that gap is wider: Stagehand no longer ships a built-in autonomous loop."
  - q: "How much does Stagehand cost?"
    a: "The SDK is free; you pay your model provider. Browserbase's cloud, as of November 2026 from browserbase.com/pricing, has a Free plan at $0 a month with 1 browser hour, Developer at $20 a month with 100 browser hours then $0.12 per hour, Startup at $99 a month with 500 hours then $0.10 per hour, and Scale through sales."
---

Stagehand is an open-source SDK for browser automation from **Browserbase**. Its idea is to keep ordinary code in charge and use a model only where a page is unpredictable: you navigate and fill forms with Playwright-style methods (`goto`, `locator`, `click`), and call natural-language primitives where a hard-coded selector would break. The repository is MIT-licensed with about 26,200 GitHub stars as of November 2026, and the current release is 4.5.0 on both npm and PyPI.

Version 4 changed the product's shape. The autonomous `agent()` primitive was removed, the constructor and result types changed, and TypeScript, Python and Go now share one SDK design. Tutorials written for v2 or v3 will not run unmodified.

## Highlights

- **`act()`**: a natural-language action ("click the sign in button") resolved against the live page. It re-resolves when the site changes, which is the self-healing the README refers to.
- **`extract()`**: structured data out, validated against a Zod schema in TypeScript, a Pydantic model in Python or a struct in Go. This is [structured output](/glossary/structured-output) applied to scraping.
- **`observe()`**: returns real selectors for elements matching a description, so your code can act on them directly. The README uses it to fill a password field without the credential ever reaching the model.
- **A full browser driver.** Stagehand talks to Chrome over CDP itself, with deep locators that cross nested iframes and closed Shadow DOMs using the same `page.locator()` call.
- **Agent-oriented extras.** WebMCP for page-declared tools, batch commands, clipboard support and OpenTelemetry traces.
- **`browse` CLI and skill.** For coding agents such as Claude Code, Cursor and Codex: `npm install -g browse` gives a command-line browser that needs no LLM key or Browserbase account for local use.

## In an AI-assisted workflow

```bash
pnpm add @browserbasehq/stagehand 'zod@~4.4.3'   # Python: pip install stagehand
```

```typescript
import { localBrowser, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod/v4";

// cookies persist in ./browser-data, so the next run starts signed in
const browser = await localBrowser.launch({ userDataDir: "./browser-data" });
const stagehand = await Stagehand.create({
  browser,
  model: { modelName: "openai/gpt-5.4-mini", apiKey: process.env.OPENAI_API_KEY },
});

const [page] = await browser.context.pages();
await page.goto("https://app.example.com/login");

// observe() returns a selector; the password goes straight to the page
const { data: password } = await stagehand.observe("find the password input");
await page.locator(password[0].selector).fill(process.env.APP_PASSWORD!);

await stagehand.act("click the sign in button");
await stagehand.act("open the billing page");

const { data } = await stagehand.extract(
  "extract every invoice in the table",
  z.object({
    invoices: z.array(z.object({ number: z.string(), amount: z.number(), paid: z.boolean() })),
  }),
);
console.log(data.invoices);

await stagehand.close();
await browser.close();
```

The model string is the one in Stagehand's README; swap in any `provider/model` your account has. To run the same script on Browserbase, replace the launch line with `browserbase.launch({ apiKey: process.env.BROWSERBASE_API_KEY! })`. With no `model` set there, the Model Gateway picks a model per action, and `cache: true` returns identical calls from Browserbase's cache without spending tokens.

The docs recommend **code mode** as the default way to work now: ask a coding assistant to write the Stagehand script, review it, and run it. The generated code should use plain locators wherever a selector is stable and reserve `act()` for the parts that need judgement.

> [!WARNING]
> Pages are untrusted input. Text on a site can try to steer `act()` or a tool-calling loop, which is the standard [prompt-injection](/guides/ai-safety/defending-prompt-injection) route for browser agents. Keep credentials in code paths the model never sees, as the `observe()` pattern above does, and scope what a logged-in session can do.

## Pricing

Stagehand itself is free under MIT, and local runs cost only model tokens. Browserbase's hosted browsers are the paid half. As of November 2026, browserbase.com/pricing lists **Free** at $0 a month (1 browser hour, 3 concurrent browsers, 15-minute sessions), **Developer** at $20 a month (100 browser hours, then $0.12 per browser hour, 25 concurrent browsers), **Startup** at $99 a month (500 browser hours, then $0.10 per browser hour, 100 concurrent browsers), and **Scale** with usage-based pricing through sales. Model usage through the Model Gateway is billed pay-as-you-go on top.

## Good to know

**No built-in autonomy any more.** If you want "give it a goal and wait", v4 expects you to build the loop yourself or use another tool. The migration guide lists `agent({ mode: "cua" })` as having no equivalent.

**v3 to v4 is a rewrite, not a bump.** `new Stagehand({ env })` plus `init()` became a browser factory plus `Stagehand.create()`, `stagehand.page` became `browser.context.activePage()`, `observe()` now returns its array under `.data`, and package names changed for Python and Go. v3 is still on npm under the `v3-latest` tag (3.7.4).

**Every `act()` and `extract()` is a model call** unless it is served from cache. A flow that calls them in a loop over hundreds of rows gets slow and expensive; extract the whole table in one call or switch to locators once you know the structure.

**Local means Chrome.** Stagehand launches the Chrome installed on your machine. Proxies and automatic captcha solving are Browserbase plan features, not SDK features.

Against the alternatives: [Browser Use](/tools/browser-use) is the pick for one-shot autonomous errands from a task string. [Skyvern](/tools/skyvern) targets workflow automation on sites you do not control, driven by vision. [Playwright MCP](/tools/playwright-mcp) hands a coding agent raw browser tools with no natural-language layer and no extra model calls. [Browser Agents in 2026](/guides/comparisons/browser-agents-compared-2026) compares the field.
