---
title: "MCP Ecosystem Statistics 2026"
description: "The Model Context Protocol by the numbers — SDK downloads, server counts across registries, governance facts, and growth since the Linux Foundation donation."
author: "Imtiaz Rayhan"
date: 2026-07-01
freshness: "tier1"
updated: 2026-11-25
reviewed: 2026-11-25
color: "green"
topics: ["mcp", "architecture"]
audience: ["developers", "ai-engineers"]
tags: ["mcp", "statistics", "ecosystem", "data"]
featured: false
summary: "MCP's growth since the December 2025 Linux Foundation donation, updated November 2026: the official MCP Registry passed 65,000+ server listings (~32,650 distinct repos), core SDK downloads hit ~523M/month by September 2026 (~5x in nine months), Smithery shut down proxy hosting on October 31, 2026 to become a direct directory, and the AAIF reached 247 members. Every count dated and sourced."
keyTakeaways:
  - "At donation (December 9, 2025): 97M+ monthly SDK downloads and ~10,000 active servers — the official baseline numbers from Anthropic and the Linux Foundation."
  - "By September 2026: the npm TypeScript SDK topped 204M monthly downloads (5x its December rate) and PyPI's mcp package added ~319M — matching the project's own citation of close to half a billion monthly downloads across Tier 1 SDKs."
  - "By mid-November 2026: the official MCP Registry (registry.modelcontextprotocol.io) crossed 65,600–68,300 listings mapping to ~32,650 distinct code repositories, while third-party aggregators index 111,000+ entries — always cite the registry alongside the count."
  - "Smithery shut down its managed proxy, Connect, and hosting on October 31, 2026 (post-Arcade.dev acquisition), shifting smithery.ai into a public non-proxied directory pointing to official vendor endpoints."
  - "Governance is genuinely multi-vendor: the Agentic AI Foundation's eight Platinum members include Anthropic, OpenAI, Google, Microsoft, AWS, and Block, with total membership reaching 247 in August 2026 (up from 49 at launch)."
faq:
  - q: "How many MCP servers exist in 2026?"
    a: "As of mid-November 2026, the official MCP Registry (registry.modelcontextprotocol.io) tracks roughly 65,600 to 68,300 server listings — mapping down to ~32,651 distinct repositories because publishers submit multiple package variants — while broad community aggregators index 111,000+ entries. Compare that with our September 1 snapshot (Smithery 11,245; PulseMCP 21,982) and the December 2025 donation baseline (~10,000). Always name the registry; curation bars differ by 3x."
  - q: "How fast is MCP growing?"
    a: "The cleanest series is SDK downloads: at donation (December 2025) the project cited 97M monthly across SDKs; by September 2026 the npm TypeScript SDK alone ran ~204M/month (vs 38.5M in December) and PyPI's mcp package ~319M/month — roughly 5x in nine months, measured directly from registry APIs. Registry publication velocity spiked to 16,000+ new listings per month in October–November 2026."
  - q: "Who controls MCP now?"
    a: "The Agentic AI Foundation under the Linux Foundation, since December 9, 2025 — co-founded by Anthropic (donating MCP), Block (goose), and OpenAI (AGENTS.md), with AWS, Bloomberg, Cloudflare, Google, and Microsoft completing the founding eight, plus 41 gold/silver members at launch (Cisco to Hugging Face), a roster since grown to 247 (August 2026). Anthropic stated maintainers and governance processes carried over unchanged."
related: ["glossary:model-context-protocol", "guide:best-mcp-servers-2026", "guide:mcp-server-token-overhead-benchmark", "guide:mcp-vs-a2a", "guide:claude-code-mcp-setup", "guide:govern-mcp-servers", "guide:ai-coding-statistics-2026", "tool:smithery"]
---

MCP went from Anthropic side-project (November 2024) to Linux Foundation standard (December 2025) to — by late 2026 — infrastructure whose download counts and registry velocity resemble a major package ecosystem. The numbers below are **dated to each measurement snapshot (last reviewed November 25, 2026)** and refreshed on a cadence; circulating figures we couldn't trace are omitted.

## The baseline: donation day (December 9, 2025)

From the [Anthropic and Linux Foundation announcements](/glossary/model-context-protocol) *(primary)*:

- **97M+ monthly SDK downloads** across the official SDKs
- **~10,000 active/published MCP servers**
- First-class client support named at donation: ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot, VS Code
- The **Agentic AI Foundation** launched with founding projects MCP, goose (Block), and AGENTS.md (OpenAI — itself in 60,000+ open-source projects), and founding members AWS, Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, OpenAI

## Nine months later: the growth curve

Measured directly from registry APIs, **September 1, 2026** *(primary)*:

| Metric | Dec 2025 | Sep 2026 | Source |
| --- | --- | --- | --- |
| npm `@modelcontextprotocol/sdk`, monthly downloads | 38.5M | **~204M** | npm registry API |
| PyPI `mcp` package, monthly downloads | — | **~319M** | pypistats |
| PyPI `fastmcp`, monthly downloads | — | ~85M (down from ~93M in July) | pypistats |
| Combined core SDKs | ~97M (all SDKs, official figure) | **~523M** (npm+PyPI core alone) | computed |

Roughly a **5x rise in nine months** on the cleanest comparable series — and since the September figure counts only the two core packages, it understates the total. The project's own accounting agrees: the July 28, 2026 spec-release post cites "close to half-a-billion downloads a month" across Tier 1 SDKs, with the TypeScript and Python SDKs each past 1 billion lifetime downloads *(primary)*. One wrinkle: `fastmcp`, the popular Python framework, dipped from ~93M to ~85M over the summer — growth is concentrating in the core packages.

## How many servers? Name the registry

| Registry | Servers (snapshot date) | Bar |
| --- | --- | --- |
| Official MCP Registry (`registry.modelcontextprotocol.io`) | **~65,600–68,300 listings** (~32,651 distinct repos, mid-Nov 2026) | Official open registry; >16,000 new listings/month in Oct–Nov 2026 (~91% single-server publishers) |
| PulseMCP | **21,982** (Sep 1, 2026) | Broad daily-updated tracker |
| [Smithery](/tools/smithery) | **11,245** (Sep 1, 2026; hosting shut down Oct 31, 2026) | Formerly proxied registry; transitioned to non-proxied direct-endpoint directory post-Arcade.dev acquisition |
| Community aggregators (e.g. Glama / mcp.so) | **~23,000** (mcp.so, Jul 1) to **111,000+** (broad cross-platform indexes, Nov 2026) | Broadest uncurated / fork-inclusive crawls |

The spread is the lesson: "how many MCP servers exist" has no single answer — raw listings vs distinct repositories vs curated entries diverge by 2–3x — so any citation should name its registry and date. What the spread agrees on: supply outgrew discovery, which is why [the shortlist](/guides/mcp/best-mcp-servers-2026) matters more than the catalog, [token-overhead discipline](/guides/mcp/mcp-server-token-overhead-benchmark) matters before connecting a server, and [governance](/guides/mcp/govern-mcp-servers) became its own discipline.

## Ecosystem signals

- **modelcontextprotocol/servers**: ~90,000 GitHub stars; the Python SDK ~24,200, TypeScript SDK ~13,300, spec repo ~9,100 *(GitHub API, primary)*.
- **AAIF membership** beyond the founding eight: **18 Gold members at launch** (including Cisco, Datadog, Docker, IBM, JetBrains, Oracle, Salesforce, SAP, Shopify, Snowflake) and **23 Silver** (including Hugging Face, Uber, Zapier, Pydantic, Elastic), since expanded to 190 (May 18, 2026) and **247 total members** (August 13, 2026 — 57 new: 3 Gold, 33 Silver, 21 Associate) *(Linux Foundation, primary)*. Platinum stays capped at the founding eight.
- The protocol's sibling under the same roof: [A2A](/guides/mcp/mcp-vs-a2a) for agent-to-agent, donated by Google in mid-2025 — both halves of the agent stack now sit in neutral governance.

The arc these numbers trace: MCP won the agent-to-tool layer the way standards win — not by mandate but by **default-ness**, until "does it speak MCP" stopped being a question. The practical guides for living in that ecosystem: [adding servers to Claude Code](/guides/mcp/claude-code-mcp-setup) and [the 2026 server shortlist](/guides/mcp/best-mcp-servers-2026).
