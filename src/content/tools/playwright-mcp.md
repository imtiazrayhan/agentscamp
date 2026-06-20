---
name: "Playwright MCP"
description: "Microsoft's open-source MCP server that gives AI agents structured browser automation via Playwright's accessibility tree."
date: 2026-06-03
url: "https://github.com/microsoft/playwright-mcp"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/microsoft/playwright-mcp"
color: "green"
topics: ["mcp", "review-qa"]
tags: ["mcp", "browser", "testing", "automation"]
featured: false
related: ["claude-code", "test-engineer"]
alternativeTo: ["chrome-devtools-mcp", "browser-use", "stagehand", "skyvern"]
summary: "Playwright MCP is Microsoft's open-source MCP server that lets AI agents drive a real browser via Playwright. It acts on the accessibility tree rather than screenshots, so interactions are deterministic, token-efficient, and need no vision model — navigation, clicks, forms, tabs, and console/network inspection across Chromium, Firefox, and WebKit."
faq:
  - q: "What is Playwright MCP?"
    a: "Playwright MCP is a Model Context Protocol server from Microsoft that gives an AI agent a full browser tool set — navigating, clicking, typing, filling forms, managing tabs, and reading console/network output. It's built on Playwright and operates on the page's accessibility tree, returning structured snapshots instead of screenshots, so no vision model is needed."
  - q: "How do I add Playwright MCP to Claude Code?"
    a: "Run claude mcp add playwright npx @playwright/mcp@latest, or add it to an mcpServers config block with command npx and the @playwright/mcp@latest argument. The first run downloads browser binaries via Playwright; if your environment blocks that, run npx playwright install ahead of time."
  - q: "Is Playwright MCP free?"
    a: "Yes — free and open source under Apache-2.0, published as @playwright/mcp on npm and maintained by Microsoft in the microsoft/playwright-mcp repo. You run it locally via Node.js; there's no hosted tier or account, and it works with any MCP-capable client."
  - q: "Is Playwright MCP safe to run?"
    a: "A browser agent can act on any site it's pointed at, so run it against your own apps and trusted URLs. Pass --isolated for an ephemeral profile (the default profile persists your logged-in state) and use --allowed-origins / --blocked-origins to limit reachable origins — best-effort filters, not a hard security boundary."
---

Playwright MCP is a Model Context Protocol server from Microsoft that lets an AI agent drive a real browser. It is not a standalone app — you register it with an MCP client like Claude Code, and the agent gains a set of tools for navigating pages, clicking, typing, filling forms, and reading results. Under the hood it uses [Playwright](https://playwright.dev), the same automation engine that powers Microsoft's end-to-end testing framework.

Its defining choice is to act on the page's **accessibility tree** rather than screenshots. Each action returns a structured snapshot of elements, their roles, and their text, so the model interacts with semantic targets instead of guessing pixel coordinates. That makes it fast, deterministic, and token-efficient, and means no vision model is required. It is aimed at developers who want an agent that can actually exercise a running web app — reproducing bugs, checking flows, scraping state, or driving QA — instead of only reasoning about source code.

## Highlights

- **Accessibility-tree based** — operates on structured page snapshots (roles, names, text), not pixel screenshots, so interactions are deterministic and cheap on tokens.
- **No vision model needed** — the agent reads semantic element references and targets them directly; optional `--caps=vision` adds coordinate-based clicks when you really need them.
- **Full browser tool set** — navigation, clicks, typing, form fills, drag-and-drop, tab management, file uploads, dialog handling, and console/network inspection.
- **Cross-browser** — runs Chromium, Firefox, or WebKit (and named Chrome/Edge channels), headed or headless.
- **Profile control** — a persistent profile by default, so the agent reuses your logged-in state across sessions, or pass `--isolated` for an ephemeral session that is discarded when the browser closes.
- **Microsoft-maintained, Apache-2.0** — published as `@playwright/mcp` on npm and tracked in the open in the `microsoft/playwright-mcp` repo.

## In an AI-assisted workflow

Because it is an MCP server, you add it once to your client and every session can reach for it. In Claude Code:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

Or drop it into an MCP config block directly:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

From there the agent can verify its own work — start the dev server, navigate to the page it just changed, click through the flow, and read back the accessibility snapshot to confirm the result. A typical loop: ask the agent to reproduce a reported bug, let it drive the browser to the failing state, then have it write a Playwright test that locks the fix in place.

> [!TIP]
> Pair it with a testing-focused agent (see `test-engineer`) so the model knows to write a regression test once it has reproduced an issue in the browser, not just confirm the page loads.

> [!NOTE]
> The first run downloads the browser binaries via Playwright. If your environment blocks that, install browsers ahead of time with `npx playwright install`.

## Good to know

Playwright MCP is free and open source under Apache-2.0; you run it locally via Node.js (`npx @playwright/mcp@latest`) and there is no hosted tier or account. It works with any MCP-capable client — Claude Code, the Claude Desktop app, VS Code, Cursor, and others — not just Claude Code.

> [!WARNING]
> A browser agent can navigate to and act on any site it is pointed at. Run it against your own apps and trusted URLs, pass `--isolated` to run untrusted pages in an ephemeral profile (the default profile is persistent and retains your login state), and use `--allowed-origins` / `--blocked-origins` to limit which origins it can request — note these are best-effort filters, not a hard security boundary, and do not affect redirects.
