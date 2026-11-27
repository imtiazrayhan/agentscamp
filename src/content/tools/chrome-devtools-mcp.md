---
name: "Chrome DevTools MCP"
title: "Chrome DevTools MCP"
description: "Google's official MCP server that gives coding agents a live Chrome — Puppeteer automation plus DevTools network, console, and performance insights."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
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
alternativeTo: ["playwright-mcp", "browserbase", "stagehand", "browser-use"]
sameAs:
  - "https://www.npmjs.com/package/chrome-devtools-mcp"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "tool:playwright-mcp", "agent:performance-engineer", "agent:accessibility-auditor", "agent:debugger"]
summary: "Chrome DevTools MCP, from Google's Chrome DevTools team, lets a coding agent drive and inspect a live Chrome. Its tool reference lists 63 tools in 13 categories: Puppeteer-based input and navigation, network and console inspection, performance traces with insights, Lighthouse audits and heap snapshots. It is Apache-2.0 and also ships a CLI."
faq:
  - q: "How do I add Chrome DevTools MCP to Claude Code?"
    a: "One command from the project's client configuration guide: claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest. To get the bundled skills as well, install the plugin instead: /plugin marketplace add ChromeDevTools/chrome-devtools-mcp, then /plugin install chrome-devtools-mcp@chrome-devtools-plugins, and restart Claude Code. The README lists a Node.js LTS version, npm and a current stable Chrome as requirements."
  - q: "Chrome DevTools MCP vs Playwright MCP — which one?"
    a: "Playwright MCP is the generalist for cross-browser automation and testing flows. Chrome DevTools MCP officially supports only Google Chrome and Chrome for Testing, but it brings the debugger: performance traces with insights, CrUX field data, Lighthouse audits, heap snapshots, and network and console inspection with source maps. Pick DevTools MCP to find out why a page is slow or broken, and Playwright MCP to automate and test a flow across browsers."
  - q: "Is it safe to point at my main browser?"
    a: "Treat anything the browser can see as visible to the agent. The README says the server exposes the content of the browser instance to MCP clients, which can inspect, debug and modify any data in it. By default the server uses its own profile directory rather than your everyday one, and --isolated uses a temporary profile that is deleted when the browser closes. The --autoConnect option attaches to your running Chrome and gives the server access to all open windows of that profile, so use it deliberately."
  - q: "Does Chrome DevTools MCP send data to Google?"
    a: "Two things, both switchable. Usage statistics such as tool success rates, latency and environment information are collected by default; pass --no-usage-statistics, or set the CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS or CI environment variable, to turn that off. Performance tools may also send trace URLs to the CrUX API to fetch real-user data, which --no-performance-crux disables."
audience: ["designers"]
---

Chrome DevTools MCP gives a coding agent the thing it usually lacks: a browser it can look at. The agent writes frontend code, then opens the page in a real Chrome, clicks through it, reads the console with source-mapped stack traces, inspects network requests and records performance traces that come back with insights. It is built by Google's Chrome DevTools team, which now calls the project "Chrome DevTools for agents", and it ships as both an MCP server and a `chrome-devtools` command-line tool in the same npm package.

It suits anyone who asks an agent to fix UI bugs, chase a slow page or verify its own changes. If your need is cross-browser test automation rather than diagnosis, [Playwright MCP](/tools/playwright-mcp) is the closer fit.

## Highlights

- **63 tools in 13 categories.** The tool reference groups them as input automation, navigation, emulation, performance, network, debugging, memory, network mocks, extensions, third-party, WebMCP, Progressive Web Apps and WebAuthn.
- **Performance traces with insights.** `performance_start_trace`, `performance_stop_trace` and `performance_analyze_insight` record a trace and explain it. Trace URLs may be sent to the CrUX API so field data from real users appears next to the lab numbers.
- **Debugging tools.** `list_console_messages`, `get_network_request`, `take_snapshot`, `take_screenshot`, `get_css_styles`, `evaluate_script` and `lighthouse_audit`, which returns Lighthouse scores and failing audits for accessibility, SEO and best practices.
- **Memory analysis.** Fourteen heap-snapshot tools, including `take_heapsnapshot`, `compare_heapsnapshots` and `get_heapsnapshot_retainers`, for finding leaks.
- **Puppeteer-based automation.** `click`, `fill_form`, `press_key`, `upload_file` and the rest wait for the result of each action before returning.
- **Opt-in categories.** Network mocks, extensions, PWA, WebAuthn, third-party and WebMCP tools are off by default and switched on with `--category-*` flags. The WebMCP and third-party categories carry "experimental" in their flag names as of November 2026.
- **Slim mode.** `--slim` cuts the server down to three tools (`navigate`, `evaluate`, `screenshot`) when you only need basic browsing and want a small context footprint.
- **Seven bundled skills.** Among them `a11y-debugging`, `debug-optimize-lcp`, `memory-leak-debugging` and `cookie-debugging`, installed with the plugin.

## In an AI-assisted workflow

Add the server to Claude Code:

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

Or install the plugin, which adds the MCP server and the skills together:

```text
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp@chrome-devtools-plugins
```

The README's own smoke test is `Check the performance of https://developers.chrome.com`. The browser starts only when a tool first needs it, so connecting the server does not open a window. A more typical working prompt:

```text
Open localhost:3000/checkout, reproduce the broken submit button,
read the console error, and fix the root cause. Reload and confirm
the error is gone.
```

The agent makes a change, checks it in a real browser, reads the actual error or trace and iterates. For performance work, "record a trace on the product page and fix the top insight" gives the [performance-engineer](/agents/quality-security/performance-engineer) agent something measurable to work against.

Any other MCP client takes the standard config:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--no-usage-statistics"]
    }
  }
}
```

Useful flags: `--headless` runs without a window, `--isolated` uses a throwaway profile, `--channel` picks canary, dev or beta, and `--autoConnect` attaches to a Chrome you already have running (Chrome 144 or newer, after you enable remote debugging at `chrome://inspect/#remote-debugging`).

> [!WARNING]
> The README states that the server "exposes content of the browser instance to the MCP clients allowing them to inspect, debug, and modify any data in the browser or DevTools." Keep logged-in sessions you care about out of the profile the agent uses. Usage statistics are on by default (`--no-usage-statistics` opts out), and `--no-performance-crux` stops trace URLs going to the CrUX API.

## Good to know

The project is Apache-2.0 and free. Version 1.0.0 shipped on May 18, 2026 and releases have come every few weeks since; the latest is 1.14.0, released November 24, 2026. The GitHub repository has about 59,600 stars as of November 2026. The npm package requires Node.js `^20.19.0 || ^22.12.0 || >=23`.

Limits to know before you rely on it:

- **Chrome only.** The README says it "officially supports Google Chrome and Chrome for Testing only" and that other Chromium-based browsers may work without any guarantee. There is no Firefox or WebKit support.
- **Tool count costs context.** The default categories load dozens of tool schemas. Disable the ones you do not need (`--category-memory=false`, for example) or use `--slim`.
- **Skills are version-specific.** The README warns that outdated skills can tell the agent to use tools or parameters that have changed, so update the plugin when you update the server.
- **Not a sandbox.** Setting `--javascript-evaluation=false` and `--file-navigations=false` narrows what the server will do, but the docs say plainly that neither is a JavaScript or filesystem sandbox.

Among alternatives, [Playwright MCP](/tools/playwright-mcp) drives Chromium, Firefox and WebKit and is the better base for end-to-end tests, and many teams run both: Playwright to drive flows, DevTools MCP to diagnose them. [Browserbase](/tools/browserbase) hosts browsers in the cloud when you need many sessions or do not want Chrome on the machine, and [Stagehand](/tools/stagehand) and [Browser Use](/tools/browser-use) are frameworks for building your own browser agents rather than servers you plug into a coding agent.
