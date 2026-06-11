---
name: "Chrome DevTools MCP"
title: "Chrome DevTools MCP"
description: "Google's official MCP server that gives coding agents a live Chrome — Puppeteer automation plus DevTools network, console, and performance insights."
date: 2026-06-11
url: "https://github.com/ChromeDevTools/chrome-devtools-mcp"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/ChromeDevTools/chrome-devtools-mcp"
license: "Apache-2.0"
os: ["macOS", "Windows", "Linux"]
color: "yellow"
topics: ["mcp"]
tags: ["mcp", "chrome", "browser", "debugging", "performance", "automation"]
featured: false
alternativeTo: ["playwright-mcp"]
sameAs:
  - "https://www.npmjs.com/package/chrome-devtools-mcp"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "playwright-mcp", "performance-engineer", "accessibility-auditor", "debugger"]
summary: "Chrome DevTools MCP (Google's Chrome DevTools team, ~43k stars, v1.x since May 2026) gives agents a real browser with the debugger attached: 48 tools spanning Puppeteer-driven navigation and input, network request analysis, console messages with source-mapped stack traces, screenshots, emulation, and performance trace recording with actionable insights plus CrUX field data."
faq:
  - q: "How do I add Chrome DevTools MCP to Claude Code?"
    a: "One command, verbatim from the README: claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest. There's also a plugin with bundled skills: /plugin marketplace add ChromeDevTools/chrome-devtools-mcp then /plugin install chrome-devtools-mcp@chrome-devtools-plugins. Requirements: Node LTS and a current stable Chrome."
  - q: "Chrome DevTools MCP vs Playwright MCP — which one?"
    a: "Playwright MCP is the generalist for cross-browser automation and testing flows. Chrome DevTools MCP is Chrome-only but brings the debugger: performance traces with insights, CrUX real-user data, network and console inspection with source maps. For 'why is this page slow/broken', DevTools MCP; for 'automate and test this flow everywhere', Playwright."
  - q: "Is it safe to point at my main browser?"
    a: "Point it at a clean profile. The README's own disclaimer: it exposes all browser content to the MCP client — a logged-in profile means logged-in sessions become agent-readable. Note also that usage-statistics telemetry is on by default (opt out with --no-usage-statistics)."
---

Chrome DevTools MCP is Google's answer to a blind spot every coding agent has: it can write frontend code but can't *see* it run. This server hands the agent a live Chrome with the DevTools attached — it navigates, clicks, screenshots, reads the console with source-mapped stack traces, inspects network requests, and records performance traces that come back with actionable insights.

## Highlights

- **48 tools across the debugging surface** — input and navigation automation, emulation, network, console, memory, performance, and a WebMCP category.
- **Performance traces with insights** — record a trace and get the analysis, augmented with CrUX real-user field data for the URL.
- **Debugging-grade visibility** — console messages with source-mapped stacks; network requests inspectable individually.
- **Reliable automation** — Puppeteer-driven with auto-waiting, the same engineering as Google's own testing stack.
- **Plugin or plain server** — a one-liner MCP install, or the official plugin that adds skills on top.

## In an AI-assisted workflow

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
# then:
# > Open localhost:3000/checkout, reproduce the broken submit button,
# > read the console error, and fix the root cause
```

The loop that changes frontend work: the agent makes a change, *verifies it in a real browser*, reads the actual error or trace, and iterates — closing the gap between "the diff looks right" and "the page works." For performance work, "record a trace on the product page and fix the top insight" turns the [performance-engineer](/agents/quality-security/performance-engineer) playbook into something measurable.

> [!WARNING]
> The README's own disclaimer applies: the server exposes browser content to the MCP client. Run it against a clean Chrome profile — not the one holding your banking sessions — and know that telemetry is on by default (`--no-usage-statistics` to opt out, `--no-performance-crux` to skip CrUX calls).

## Good to know

Apache-2.0 from Google's Chrome DevTools team, ~43k stars, 1.0 in May 2026 and moving fast (v1.2 added the plugin and WebMCP tools). Chrome and Chrome-for-Testing only — for cross-browser automation, [Playwright MCP](/tools/playwright-mcp) remains the complement, and many teams run both: Playwright to drive flows, DevTools MCP to diagnose them.
