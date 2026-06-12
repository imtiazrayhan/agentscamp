---
name: "Browser Use"
description: "The most-adopted open-source browser-agent framework — point an LLM at a task and it drives a real browser: navigating, clicking, typing, extracting."
date: 2026-06-11
url: "https://browser-use.com"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/browser-use/browser-use"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "orange"
topics: ["ai-agents-systems"]
tags: ["browser-agents", "automation", "computer-use", "python"]
featured: false
alternativeTo: ["stagehand", "skyvern", "playwright-mcp"]
sameAs:
  - "https://github.com/browser-use/browser-use"
  - "https://docs.browser-use.com"
  - "https://x.com/browser_use"
related: ["browser-agents-compared-2026", "how-computer-use-agents-work", "stagehand", "skyvern", "browser-agent-engineer", "computer-use"]
summary: "Browser Use (MIT, ~98k stars) is the breakout browser-agent framework: hand it a task string and an LLM and it autonomously navigates, clicks, types, and extracts — driving Chromium over the DevTools Protocol. Model-agnostic (their hosted models, OpenAI, Anthropic, Gemini, local), with domain guardrails, and a 2026 Rust-core beta agent for persistence and recovery."
faq:
  - q: "What does Browser Use actually do?"
    a: "It turns 'go to this site, find X, do Y' into an autonomous browser session: an agent loop perceives the page (structure plus vision), decides actions, executes them via the Chrome DevTools Protocol, and iterates to task completion. Agent(task=..., llm=...) is the whole API surface to start."
  - q: "Is Browser Use free?"
    a: "The framework is MIT-licensed and free — bring your own LLM key and run locally (pip install browser-use, then uvx browser-use install for Chromium). Browser Use Cloud is the optional paid layer: hosted stealth browsers, CAPTCHA handling, residential proxies, and scheduling, with a free tier to start."
  - q: "Browser Use vs Playwright — aren't they the same thing?"
    a: "Different layers. Playwright executes scripted automation you write; Browser Use decides the steps itself from a natural-language task (and notably drives the browser via CDP directly rather than through Playwright). Use Playwright-style tools when you know the steps; Browser Use when you want the agent to figure them out."
---

Browser Use is the project that made "give an AI a browser" a one-liner. At ~98k GitHub stars it's the most-adopted framework in the [browser-agent](/glossary/computer-use) category: a Python library where `Agent(task="find the three cheapest flights and extract prices", llm=...)` produces an autonomous session that navigates, clicks, types, and reports back.

## Highlights

- **Task-in, result-out** — the agent plans and executes multi-step web tasks autonomously, with the perception-action loop handled for you.
- **CDP-native** — drives Chromium over the Chrome DevTools Protocol directly (not via Playwright), with structure+vision grounding.
- **Model-agnostic** — OpenAI, Anthropic, Gemini, local models, or Browser Use's own hosted agent models.
- **Guardrails built in** — browser profiles with `allowed_domains`, headless control, and scoped credentials keep the agent inside the fence.
- **2026 Rust core (beta)** — a new harness with persistent tools and recovery loops (`browser_use.beta`), the project's bet on production reliability.
- **Optional cloud** — stealth/anti-detect browsers, CAPTCHA solving, residential proxies, scheduling, webhooks — the operational layer self-hosting makes you build.

## In an AI-assisted workflow

```bash
pip install browser-use && uvx browser-use install   # library + Chromium
# then, in Python:
# agent = Agent(task="Log into the vendor portal and download this month's invoices", llm=llm)
# await agent.run()
```

It's the general-purpose answer to the web's no-API long tail — the workflows covered in [How Computer-Use Agents Work](/guides/concepts/how-computer-use-agents-work).

> [!WARNING]
> A browser agent reads hostile pages with your session attached — that's [prompt injection](/glossary/prompt-injection) surface by construction. Use `allowed_domains`, isolated profiles without your real logins, and human gates on anything that pays or sends.

## Good to know

MIT, Python 3.11+, backed by a $17M Felicis-led seed (March 2025, YC W25). The 0.13-era API is mid-transition (classic `Agent` import still works; the Rust-core agent lives under `browser_use.beta`) — pin versions in production. Where it sits against [Stagehand](/tools/stagehand)'s code-first primitives and [Skyvern](/tools/skyvern)'s workflow platform: [Browser Agents in 2026](/guides/comparisons/browser-agents-compared-2026).
