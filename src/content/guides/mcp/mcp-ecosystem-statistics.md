---
title: "MCP Ecosystem Statistics 2026"
description: "The Model Context Protocol by the numbers — SDK downloads, server counts across registries, governance facts, and growth since the Linux Foundation donation."
author: "AgentsCamp"
date: 2026-06-12
color: "green"
topics: ["mcp", "architecture"]
tags: ["mcp", "statistics", "ecosystem", "data"]
featured: false
summary: "MCP's growth since the December 2025 Linux Foundation donation, measured against live registries: SDK downloads roughly 4x'd in six months (npm SDK 38.5M→153M monthly; PyPI's mcp adds 268M), registries list 6,000–22,000 servers depending on curation bar, and the AAIF has grown to ~146 members (from 41 at the December 2025 launch). Every count dated and sourced."
keyTakeaways:
  - "At donation (December 9, 2025): 97M+ monthly SDK downloads and ~10,000 active servers — the official baseline numbers from Anthropic and the Linux Foundation."
  - "Six months later: the npm TypeScript SDK alone exceeds 150M monthly downloads (4x its December rate) and PyPI's mcp package adds ~268M — combined core-SDK volume roughly quadrupled."
  - "Server counts depend on the registry's bar: Smithery curates ~6,200, PulseMCP tracks ~18,200, mcp.so self-reports ~22,000 — cite the registry with the number, never a bare 'there are X servers.'"
  - "Governance is genuinely multi-vendor now: the Agentic AI Foundation's eight Platinum members include Anthropic, OpenAI, Google, Microsoft, AWS, and Block, with the supporting Gold/Silver roster now past 130 members (up from 41 at launch)."
  - "The reference monorepo (modelcontextprotocol/servers) sits at ~87k GitHub stars — top-thousandth-percentile open source — with first-class client support across ChatGPT, Claude, Cursor, Gemini, Copilot, and VS Code."
faq:
  - q: "How many MCP servers exist in 2026?"
    a: "Between ~6,000 and ~22,000, depending on who's counting and how: Smithery's curated registry lists 6,222, PulseMCP tracks 18,233, and mcp.so self-reports 22,182 (all June 12, 2026). The official line at the December 2025 donation was 'over 10,000 published servers.' The honest answer names the registry; the practical answer is that discovery, not supply, is the constraint."
  - q: "How fast is MCP growing?"
    a: "The cleanest series is SDK downloads: at donation (December 2025) the project cited 97M monthly across SDKs; by June 2026 the npm TypeScript SDK alone runs ~153M/month (vs 38.5M in December) and PyPI's mcp package ~268M/month — combined core-SDK volume roughly 4x in six months, measured directly from registry APIs."
  - q: "Who controls MCP now?"
    a: "The Agentic AI Foundation under the Linux Foundation, since December 9, 2025 — co-founded by Anthropic (donating MCP), Block (goose), and OpenAI (AGENTS.md), with AWS, Bloomberg, Cloudflare, Google, and Microsoft completing the founding eight, plus 41 gold/silver members at launch (Cisco to Hugging Face), a roster since grown past 130. Anthropic stated maintainers and governance processes carried over unchanged."
related: ["model-context-protocol", "best-mcp-servers-2026", "mcp-vs-a2a", "claude-code-mcp-setup", "govern-mcp-servers", "ai-coding-statistics-2026", "smithery"]
---

MCP went from Anthropic side-project (November 2024) to Linux Foundation standard (December 2025) to — by mid-2026 — infrastructure whose download counts resemble a major package ecosystem. The numbers below are **pulled live from registries and primary announcements, dated June 12, 2026**, and refreshed on a cadence; circulating figures we couldn't trace are omitted.

## The baseline: donation day (December 9, 2025)

From the [Anthropic and Linux Foundation announcements](/glossary/model-context-protocol) *(primary)*:

- **97M+ monthly SDK downloads** across the official SDKs
- **~10,000 active/published MCP servers**
- First-class client support named at donation: ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot, VS Code
- The **Agentic AI Foundation** launched with founding projects MCP, goose (Block), and AGENTS.md (OpenAI — itself in 60,000+ open-source projects), and founding members AWS, Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, OpenAI

## Six months later: the growth curve

Measured directly from registry APIs, **June 12, 2026** *(primary)*:

| Metric | Dec 2025 | Jun 2026 | Source |
| --- | --- | --- | --- |
| npm `@modelcontextprotocol/sdk`, monthly downloads | 38.5M | **~153M** | npm registry API |
| PyPI `mcp` package, monthly downloads | — | **~268M** | pypistats |
| PyPI `fastmcp`, monthly downloads | — | ~74M | pypistats |
| Combined core SDKs | ~97M (all SDKs, official figure) | **~420M** (npm+PyPI core alone) | computed |

Roughly a **4x rise in six months** on the cleanest comparable series — and since the June figure counts only the two core packages, it understates the total.

## How many servers? Name the registry

| Registry | Servers (Jun 12, 2026) | Bar |
| --- | --- | --- |
| [Smithery](/tools/smithery) | **6,222** | Curated registry (API `totalCount`) |
| PulseMCP | **18,233** | Broad daily-updated tracker |
| mcp.so | **~22,182** | Self-reported directory count |

The spread is the lesson: "how many MCP servers exist" has no single answer — curation bars differ by 3.5x — so any citation should name its registry. (The official registry exposes no public total; we don't quote one.) What the spread agrees on: supply outgrew discovery, which is why [the shortlist](/guides/mcp/best-mcp-servers-2026) matters more than the catalog and [governance](/guides/mcp/govern-mcp-servers) became its own discipline.

## Ecosystem signals

- **modelcontextprotocol/servers**: ~87,100 GitHub stars; the Python SDK ~23,300, TypeScript SDK ~12,700, spec repo ~8,400 *(GitHub API, primary)*.
- **AAIF membership** beyond the founding eight: **18 Gold members at launch** (including Cisco, Datadog, Docker, IBM, JetBrains, Oracle, Salesforce, SAP, Shopify, Snowflake) and **23 Silver** (including Hugging Face, Uber, Zapier, Pydantic, Elastic), since expanded to **146 total members** by February 2026 *(Linux Foundation, primary)*.
- The protocol's sibling under the same roof: [A2A](/guides/mcp/mcp-vs-a2a) for agent-to-agent, donated by Google in mid-2025 — both halves of the agent stack now sit in neutral governance.

The arc these numbers trace: MCP won the agent-to-tool layer the way standards win — not by mandate but by **default-ness**, until "does it speak MCP" stopped being a question. The practical guides for living in that ecosystem: [adding servers to Claude Code](/guides/mcp/claude-code-mcp-setup) and [the 2026 server shortlist](/guides/mcp/best-mcp-servers-2026).
