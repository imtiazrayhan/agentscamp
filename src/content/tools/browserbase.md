---
name: "Browserbase"
title: "Browserbase"
description: "Managed headless-browser infrastructure for AI agents and web automation — serverless cloud browsers with stealth, proxies, live view, and Playwright/Stagehand."
url: "https://www.browserbase.com"
date: 2026-06-24
pricing: "freemium"
category: "platform"
color: "orange"
topics: ["ai-agents-systems", "mlops-ai-infra"]
tags: ["browser", "automation", "headless", "agents", "infrastructure"]
featured: false
alternativeTo: ["browser-use", "stagehand", "skyvern", "e2b", "playwright-mcp"]
sameAs:
  - "https://www.browserbase.com"
  - "https://docs.browserbase.com"
  - "https://github.com/browserbase"
  - "https://github.com/browserbase/stagehand"
related: ["browser-agents-compared-2026", "how-computer-use-agents-work", "web-data-for-ai-agents", "sandboxing-ai-generated-code"]
summary: "Browserbase is managed headless-browser infrastructure for AI agents and web automation: serverless cloud browsers with stealth, proxies, CAPTCHA handling, and live session view. You drive them with Playwright, Puppeteer, or Browserbase's open-source Stagehand framework. It's proprietary SaaS with a free tier and paid plans; confirm current tiers on the official site."
faq:
  - q: "What is Browserbase?"
    a: "Browserbase is a managed headless-browser platform for AI agents and web automation. It runs real, sandboxed cloud browsers on demand with stealth, proxies, and CAPTCHA handling, plus a live session view for debugging — so teams can run browser agents and scrapers at scale without operating their own browser fleet. You control the browsers with standard tools like Playwright or Puppeteer over CDP."
  - q: "How much does Browserbase cost?"
    a: "Browserbase is proprietary SaaS with a free tier for prototyping and paid plans on top. At publication it advertised a Free plan ($0), a Developer plan ($20/mo), a Startup plan ($99/mo), and a custom-priced Scale plan, with browser-hours, concurrency, and proxy bandwidth metered per tier. Pricing changes often — confirm current plans and limits on the official pricing page."
  - q: "How does Browserbase relate to Stagehand?"
    a: "They are separate things from the same company. Stagehand is Browserbase's open-source (MIT) browser-automation framework that adds natural-language act/extract/observe primitives on top of code-level control. Browserbase is the proprietary hosted browser infrastructure those scripts can run on. You can use Stagehand against local Chromium for free, or point it at Browserbase's cloud browsers for production scale, stealth, and session recording."
---

Browserbase is **managed headless-browser infrastructure for AI agents and web automation at scale**. Instead of provisioning, patching, and babysitting your own Chromium fleet, you request a browser from Browserbase's API and get a real, sandboxed cloud session — with stealth, proxies, CAPTCHA handling, and a live view for watching what the agent does. It's aimed at teams running browser agents, scrapers, and automated workflows in production, where reliability and concurrency matter more than a one-off script.

It fits an AI-assisted workflow as the **execution layer**: your agent (or LLM-driven script) decides what to do, and Browserbase supplies the browser it acts in. A useful distinction — **Browserbase is the hosted browsers; [Stagehand](/tools/stagehand) is the open-source framework** (MIT, from the same company) that adds natural-language control and can run either locally or on Browserbase's cloud.

## Highlights

- **Serverless cloud browsers** — request a real browser session over an API and let it scale to many concurrent sessions; no infrastructure to provision or keep patched.
- **Stealth, proxies, and CAPTCHA handling** — built-in residential/datacenter proxies and anti-bot measures help automations reach sites that block naive headless traffic.
- **Live session view and debugging** — watch sessions in real time and review replays, logs, and network activity to diagnose why a run failed.
- **Works with standard SDKs** — drive sessions with Playwright or Puppeteer over CDP, or with Browserbase's own Stagehand framework, in TypeScript or Python.

## In an AI-assisted workflow

Point an existing Playwright script at a Browserbase session instead of a local browser — the automation code barely changes, but the browser now runs in the cloud with stealth and proxies. See [Browser Agents Compared (2026)](/guides/comparisons/browser-agents-compared-2026) for how the hosted-infra approach compares with all-in-one agents.

```ts
import { Browserbase } from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });
const session = await bb.sessions.create({ projectId: process.env.BB_PROJECT_ID });

const browser = await chromium.connectOverCDP(session.connectUrl);
const page = (await browser.contexts())[0].pages()[0];
await page.goto("https://example.com");
// ...drive the page with your agent, then close the session
```

> [!TIP]
> Use the live session view (and replays) early. Most browser-agent failures are a misread page or a blocked request, and watching the actual session is faster than guessing from logs.

## Good to know

Browserbase is a **proprietary SaaS platform**, not open source — the open-source piece is Stagehand, not the browser infrastructure itself. There is a free tier for prototyping plus paid plans (Free, Developer, Startup, and a custom Scale tier at publication), metered on browser-hours, concurrency, and proxy bandwidth; these change frequently, so confirm current tiers and limits on the official pricing page before you budget. For background on the agents that drive these browsers, see [How Computer-Use Agents Work](/guides/concepts/how-computer-use-agents-work).
