---
title: "MCP Ecosystem Statistics 2026"
description: "The Model Context Protocol by the numbers — SDK downloads, server counts across registries, governance facts, and growth since the Linux Foundation donation."
author: "AgentsCamp"
date: 2026-09-01
color: "green"
topics: ["mcp", "architecture"]
tags: ["mcp", "statistics", "ecosystem", "data"]
featured: false
summary: "MCP's growth since the December 2025 Linux Foundation donation, measured against live registries: SDK downloads roughly 5x'd in nine months (npm SDK 38.5M→204M monthly; PyPI's mcp adds 319M), registries list 11,000–23,000 servers depending on curation bar, and the AAIF has grown from 49 founding-day members to 247. Every count dated and sourced."
keyTakeaways:
  - "At donation (December 9, 2025): 97M+ monthly SDK downloads and ~10,000 active servers — the official baseline numbers from Anthropic and the Linux Foundation."
  - "Nine months later: the npm TypeScript SDK alone tops 200M monthly downloads (5x its December rate) and PyPI's mcp package adds ~319M — and the project itself now cites close to half a billion a month across its Tier 1 SDKs, with TypeScript and Python each past 1B lifetime."
  - "Server counts depend on the registry's bar: Smithery lists ~11,200, PulseMCP tracks ~22,000, mcp.so self-reported ~23,000 (July) — cite the registry with the number, never a bare 'there are X servers.'"
  - "Governance is genuinely multi-vendor now: the Agentic AI Foundation's eight Platinum members include Anthropic, OpenAI, Google, Microsoft, AWS, and Block, and total membership reached 247 in August 2026 (up from 49 at launch)."
  - "The reference monorepo (modelcontextprotocol/servers) sits at ~90k GitHub stars — top-thousandth-percentile open source — with first-class client support across ChatGPT, Claude, Cursor, Gemini, Copilot, and VS Code."
faq:
  - q: "How many MCP servers exist in 2026?"
    a: "Between ~11,000 and ~23,000, depending on who's counting and how: Smithery's registry lists 11,245 and PulseMCP tracks 21,982 (both September 1, 2026); mcp.so self-reported ~23,000 as of July 1 (the site blocks automated re-checks). The official line at the December 2025 donation was 'over 10,000 published servers.' The honest answer names the registry; the practical answer is that discovery, not supply, is the constraint."
  - q: "How fast is MCP growing?"
    a: "The cleanest series is SDK downloads: at donation (December 2025) the project cited 97M monthly across SDKs; by September 2026 the npm TypeScript SDK alone runs ~204M/month (vs 38.5M in December) and PyPI's mcp package ~319M/month — roughly 5x in nine months, measured directly from registry APIs. The project's own July 28, 2026 spec-release post put Tier 1 SDK downloads at close to half a billion a month."
  - q: "Who controls MCP now?"
    a: "The Agentic AI Foundation under the Linux Foundation, since December 9, 2025 — co-founded by Anthropic (donating MCP), Block (goose), and OpenAI (AGENTS.md), with AWS, Bloomberg, Cloudflare, Google, and Microsoft completing the founding eight, plus 41 gold/silver members at launch (Cisco to Hugging Face), a roster since grown to 247 (August 2026). Anthropic stated maintainers and governance processes carried over unchanged."
related: ["glossary:model-context-protocol", "guide:best-mcp-servers-2026", "guide:mcp-vs-a2a", "guide:claude-code-mcp-setup", "guide:govern-mcp-servers", "guide:ai-coding-statistics-2026", "tool:smithery"]
---

MCP went from Anthropic side-project (November 2024) to Linux Foundation standard (December 2025) to — by mid-2026 — infrastructure whose download counts resemble a major package ecosystem. The numbers below are **pulled live from registries and primary announcements, dated September 1, 2026**, and refreshed on a cadence; circulating figures we couldn't trace are omitted.

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

| Registry | Servers (Sep 1, 2026) | Bar |
| --- | --- | --- |
| [Smithery](/tools/smithery) | **11,245** | Registry (API `totalCount`); up from 6,652 in July |
| PulseMCP | **21,982** | Broad daily-updated tracker |
| mcp.so | **~23,000** (Jul 1, 2026; site blocks automated re-checks) | Self-reported directory count |

The spread is the lesson: "how many MCP servers exist" has no single answer — curation bars still differ by 2x — so any citation should name its registry. (The official registry exposes no public total; we don't quote one.) What the spread agrees on: supply outgrew discovery, which is why [the shortlist](/guides/mcp/best-mcp-servers-2026) matters more than the catalog and [governance](/guides/mcp/govern-mcp-servers) became its own discipline.

## Ecosystem signals

- **modelcontextprotocol/servers**: ~90,000 GitHub stars; the Python SDK ~24,200, TypeScript SDK ~13,300, spec repo ~9,100 *(GitHub API, primary)*.
- **AAIF membership** beyond the founding eight: **18 Gold members at launch** (including Cisco, Datadog, Docker, IBM, JetBrains, Oracle, Salesforce, SAP, Shopify, Snowflake) and **23 Silver** (including Hugging Face, Uber, Zapier, Pydantic, Elastic), since expanded to 190 (May 18, 2026) and **247 total members** (August 13, 2026 — 57 new: 3 Gold, 33 Silver, 21 Associate) *(Linux Foundation, primary)*. Platinum stays capped at the founding eight.
- The protocol's sibling under the same roof: [A2A](/guides/mcp/mcp-vs-a2a) for agent-to-agent, donated by Google in mid-2025 — both halves of the agent stack now sit in neutral governance.

The arc these numbers trace: MCP won the agent-to-tool layer the way standards win — not by mandate but by **default-ness**, until "does it speak MCP" stopped being a question. The practical guides for living in that ecosystem: [adding servers to Claude Code](/guides/mcp/claude-code-mcp-setup) and [the 2026 server shortlist](/guides/mcp/best-mcp-servers-2026).
