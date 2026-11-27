---
title: "MCP Server Context-Token Overhead Benchmark (2026): 16 Servers Measured"
seoTitle: "MCP Server Token Overhead Benchmark: 16 Servers Measured (2026)"
description: "We probed 16 real MCP servers over stdio and HTTP to measure exact tools/list context-window token overhead — from 172 tokens (Ref) to 7,143 tokens (Supabase)."
author: "Imtiaz Rayhan"
date: 2026-11-25
updated: 2026-11-27
reviewed: 2026-11-27
depth: "cornerstone"
image: "/images/guides/mcp-token-overhead-benchmark.png"
color: "green"
topics: ["mcp", "workflow-prompting", "architecture"]
audience: ["developers", "ai-engineers"]
tags: ["mcp", "benchmark", "context-window", "tokens", "claude-code", "performance"]
featured: true
summary: "We connected to 16 live MCP servers on November 25, 2026 and tokenized their exact tools/list payloads (183 tools total) with tiktoken (o200k_base and cl100k_base). Overhead spans 41.5× — from 172 tokens (Ref Context) to 7,143 tokens (Supabase MCP). A common five-server dev stack consumes 21,272 tokens (10.6% of a 200K window) before prompt one."
keyTakeaways:
  - "Across 16 live MCP servers (183 tools), upfront tool-definition overhead ranges 41.5× — from 172 o200k tokens (Ref Context) to 7,143 tokens (Supabase MCP), with a median of 1,295 tokens per server."
  - "Tool count alone misleads: Context7 exposes only 2 tools yet costs 1,138 tokens (569 tokens/tool, the highest per-tool verbosity measured) — 6.6× heavier than Ref Context (2 tools, 172 tokens) and 4.4× heavier than DeepWiki (3 tools, 256 tokens)."
  - "Browser automation is a 1.76× gap: Chrome DevTools MCP (33 tools, 6,924 tokens) costs 2,984 more upfront tokens than Playwright MCP (25 tools, 3,940 tokens)."
  - "A typical 5-server stack (Supabase + Chrome DevTools + GitHub + Repomix + Context7) consumes 21,272 tokens — 10.6% of a 200K context window — before your first message, built-in tools, or CLAUDE.md."
  - "One single tool schema can dwarf entire servers: Supabase's create_notebook alone costs 1,263 tokens, more than Context7, DeepWiki, Cloudflare Docs, and Ref combined."
  - "Keep per-project .mcp.json lean, use read-only or scoped toolsets where supported, and disable idle servers with /mcp. Claude Code's tool search, on by default, already defers MCP schemas until a tool is needed."
howtoSteps:
  - name: "Audit your active MCP servers"
    text: "Run claude mcp list (or inspect /mcp inside a session) to see every server currently loading tool definitions into your workspace."
  - name: "Move niche servers from user scope to project scope"
    text: "Keep only universally needed, low-token servers in user scope; move heavy database, cloud, and browser servers into each repo's .mcp.json so they do not tax unrelated projects."
  - name: "Enable toolset scoping or read-only flags"
    text: "Where a server supports scoping (such as Supabase's read_only=true or GitHub MCP's toolset flags), mount only the tool groups you actually invoke."
  - name: "Prefer leaner servers for the same job"
    text: "When you only need docs lookup or basic browser flows, swapping a 6,900-token debugger or verbose schema for a leaner sibling saves thousands of tokens on every turn."
  - name: "Re-measure when adding new servers"
    text: "Probe any candidate server's tools/list response before adding it to a shared team .mcp.json so schema bloat does not silently erode your working context window."
faq:
  - q: "How many tokens do MCP servers use in Claude Code or Cursor?"
    a: "In our November 2026 benchmark of 16 live MCP servers, median upfront tool-definition overhead is 1,295 tokens per server (mean 2,117 tokens, overall average 185 tokens per tool). Lightweight docs servers take 172–612 tokens, while full-featured platform and browser servers take 3,548–7,143 tokens each. Connecting five heavy servers routinely consumes 20,000+ tokens before your first prompt."
  - q: "Why does Context7 use more tokens than DeepWiki or Ref despite having only 2 tools?"
    a: "Because token cost comes from the full JSON schema — tool descriptions, parameter instructions, and formatting guidance — not just the number of tools. Context7 v4.8.0 packs extensive usage instructions into its two tools (569 o200k tokens per tool, 1,138 total), whereas Ref Context v3.0.3 (172 tokens) and DeepWiki v4.0.2 (256 tokens) keep their descriptions terse."
  - q: "Does Chrome DevTools MCP use more context than Playwright MCP?"
    a: "Yes. In our November 25, 2026 measurement, Chrome DevTools MCP v1.14.0 exposed 33 tools totaling 6,924 o200k tokens (3.46% of a 200K window), compared to Playwright MCP v1.66.0-alpha-2026-11-18 with 25 tools totaling 3,940 tokens (1.97%). That is a 2,984-token (1.76×) difference before the first browser action."
  - q: "How were these token counts measured, and do they match Claude's tokenizer?"
    a: "Every server was probed live over standard MCP JSON-RPC 2.0 (initialize followed by tools/list) on November 25, 2026, and the normalized tool definitions (name, description, inputSchema) were tokenized with tiktoken (o200k_base and cl100k_base). Claude's proprietary tokenizer differs slightly in absolute counts (typically within ~5–15% on JSON schemas), and host harnesses add minor per-tool wrapper overhead, so treat these figures as the clean protocol baseline — the relative ranking across servers holds across tokenizers."
  - q: "Does prompt caching eliminate MCP token overhead?"
    a: "Prompt caching reduces the dollar cost and prefill time of resending static tool schemas across turns, but it does not give you back context window capacity or prevent attention dilution when dozens of unused tools compete for model selection. Pruning unused servers still improves both reasoning quality and budget."
sources:
  - title: "Model Context Protocol Specification — Tools (tools/list)"
    url: "https://modelcontextprotocol.io/specification/2025-03-26/server/tools"
    publisher: "Model Context Protocol"
  - title: "OpenAI tiktoken (o200k_base and cl100k_base BPE tokenizers)"
    url: "https://github.com/openai/tiktoken"
    publisher: "OpenAI"
  - title: "Claude Code MCP Documentation"
    url: "https://code.claude.com/docs/en/mcp"
    publisher: "Anthropic"
  - title: "Supabase MCP Server Repository"
    url: "https://github.com/supabase/mcp"
    publisher: "Supabase"
  - title: "Chrome DevTools MCP Repository"
    url: "https://github.com/ChromeDevTools/chrome-devtools-mcp"
    publisher: "ChromeDevTools"
  - title: "Playwright MCP Repository"
    url: "https://github.com/microsoft/playwright-mcp"
    publisher: "Microsoft"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:context-engineering", "guide:mcp-ecosystem-statistics", "tool:supabase-mcp", "tool:chrome-devtools-mcp", "tool:playwright-mcp", "tool:context7", "tool:repomix", "tool:deepwiki-mcp", "tool:gitmcp", "tool:ref-tools"]
---

In a harness that loads tools upfront, every [MCP](/glossary/model-context-protocol) server you connect injects its full `tools/list` JSON schema into the model's context window before you type your first word. Claude Code no longer does this by default: its tool search loads only tool names and server instructions at session start and defers each definition until Claude needs it, so there the figures below are what a schema costs once it is pulled in, or on every turn if tool search is off or unsupported. Everyone working with [Claude Code](/tools/claude-code), [Cursor](/tools/cursor), or [Codex CLI](/tools/codex-cli) feels that tax when four or five servers are active at once — yet most advice stops at vague warnings ("don't connect too many servers").

On **November 25, 2026**, we ran a live, reproducible JSON-RPC benchmark against **16 real MCP servers** (12 local `stdio` servers via `npx`/`uvx` and 4 keyless Streamable HTTP remote servers) covering **183 total tools**, and tokenized their exact `tools/list` payloads with `tiktoken` (`o200k_base` and `cl100k_base`).

## Key findings at a glance

- **41.5× spread between lightest and heaviest:** [Ref Context MCP](/tools/ref-tools) costs **172 tokens**; [Supabase MCP](/tools/supabase-mcp) costs **7,143 tokens**.
- **Median overhead:** **1,295 tokens per server** (mean **2,117 tokens**; overall average **185 tokens per tool** across 183 tools).
- **All 16 servers combined:** **33,874 `o200k` tokens** (`33,258` `cl100k` tokens, `151,880` bytes of JSON) — **16.9% of a 200K context window** spent purely on tool definitions.
- **Tool count is not token cost:** [Context7](/tools/context7) exposes only **2 tools** yet consumes **1,138 tokens** (**569 tokens/tool**), while [DeepWiki MCP](/tools/deepwiki-mcp) exposes **3 tools** in just **256 tokens** (**85 tokens/tool**).
- **One schema can outweigh four servers:** Supabase's single heaviest tool (`create_notebook`, **1,263 tokens**) is larger than Context7, DeepWiki, Cloudflare Docs, and Ref combined.

## Full benchmark results (16 live MCP servers)

![Horizontal bar chart showing upfront tools/list token overhead across 16 live MCP servers, from 172 tokens for Ref Context MCP to 7,143 tokens for Supabase MCP](/images/guides/mcp-token-overhead-benchmark.png)

Sorted from highest to lowest `o200k_base` token overhead, measured live on **November 25, 2026**. `% of 200K` shows how much of a 200,000-token [context window](/glossary/context-window) that single server occupies before prompt one.

| Server | Version | Transport | Tools | `o200k` Tokens | `cl100k` Tokens | Avg / Tool | % of 200K | Heaviest Single Tool |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| [Supabase MCP](/tools/supabase-mcp) | `0.19.0` | stdio | 36 | **7,143** | 7,042 | 198 | 3.57% | `create_notebook` (1,263) |
| [Chrome DevTools MCP](/tools/chrome-devtools-mcp) | `1.14.0` | stdio | 33 | **6,924** | 6,819 | 210 | 3.46% | `emulate` (577) |
| [Playwright MCP](/tools/playwright-mcp) | `1.66.0-alpha-2026-11-18` | stdio | 25 | **3,940** | 3,862 | 158 | 1.97% | `browser_take_screenshot` (327) |
| [GitHub MCP](/tools/github-mcp-server) *(npm ref)* | `0.6.2` | stdio | 26 | **3,548** | 3,395 | 136 | 1.77% | `create_pull_request_review` (360) |
| Filesystem MCP *(reference)* | `2.4.0` | stdio | 16 | **2,926** | 2,906 | 183 | 1.46% | `edit_file` (338) |
| [Repomix MCP](/tools/repomix) | `1.19.0` | stdio | 6 | **2,519** | 2,478 | 420 | 1.26% | `pack_remote_repository` (715) |
| Memory MCP *(reference)* | `2.2.1` | stdio | 9 | **1,738** | 1,697 | 193 | 0.87% | `search_nodes` (290) |
| Git MCP *(reference)* | `2026.11.18` | stdio | 14 | **1,451** | 1,412 | 104 | 0.73% | `git_log` (281) |
| [Context7](/tools/context7) | `4.8.0` | stdio | 2 | **1,138** | 1,143 | 569 | 0.57% | `resolve-library-id` (572) |
| [GitMCP](/tools/gitmcp) *(generic `/docs`)* | `1.1.0` | HTTP | 5 | **612** | 593 | 122 | 0.31% | `search_generic_code` (159) |
| [Sequential Thinking MCP](/tools/sequential-thinking-mcp) | `2.2.0` | stdio | 1 | **491** | 486 | 491 | 0.25% | `sequentialthinking` (489) |
| [Exa MCP](/tools/exa) | `3.5.1` | HTTP | 2 | **466** | 461 | 233 | 0.23% | `web_search_exa` (305) |
| Fetch MCP *(reference)* | `2026.11.18` | stdio | 1 | **298** | 293 | 298 | 0.15% | `fetch` (296) |
| [DeepWiki MCP](/tools/deepwiki-mcp) | `4.0.2` | HTTP | 3 | **256** | 245 | 85 | 0.13% | `ask_wiki_question` (118) |
| [Cloudflare Docs MCP](/tools/cloudflare-mcp) | `0.5.0` | HTTP | 2 | **252** | 253 | 126 | 0.13% | `search_cloudflare_documentation` (197) |
| [Ref Context MCP](/tools/ref-tools) | `3.0.3` | stdio | 2 | **172** | 173 | 86 | 0.09% | `ref_search_documentation` (101) |

> [!NOTE]
> The GitHub row measures the keyless npm reference package (`@modelcontextprotocol/server-github@0.6.2`, 26 tools). GitHub's hosted Go MCP server exposes more tools across 22 configurable toolsets, so mounting all toolsets without scoping is heavier still.

## Four surprises in the data

### 1. Schema verbosity beats tool count

If you only glance at `/mcp` tool counts, you will misjudge which servers are actually heavy. Look at the five most verbose servers **per tool**:

| Server | Tools | Total `o200k` Tokens | Avg Tokens / Tool |
| --- | ---: | ---: | ---: |
| [Context7](/tools/context7) | 2 | 1,138 | **569** |
| [Sequential Thinking MCP](/tools/sequential-thinking-mcp) | 1 | 491 | **491** |
| [Repomix MCP](/tools/repomix) | 6 | 2,519 | **420** |
| Fetch MCP *(reference)* | 1 | 298 | **298** |
| [Exa MCP](/tools/exa) | 2 | 466 | **233** |

Servers that embed long prompt-engineering instructions inside `description` fields — telling the model when to call the tool, how to format queries, and what not to do — pay that prompt tax on **every turn of every session**, even when the tool is never called. By contrast, [Ref Context](/tools/ref-tools) (86 tokens/tool) and [DeepWiki](/tools/deepwiki-mcp) (85 tokens/tool) keep tool descriptions short and let tool responses carry the guidance.

### 2. Docs-context servers vary by 6.6× for the same job

All four library/repo documentation servers solve the same core problem — stopping hallucinated APIs — yet their fixed context cost differs sharply:

- **[Ref Context MCP](/tools/ref-tools):** 172 tokens (2 tools)
- **[Cloudflare Docs MCP](/tools/cloudflare-mcp):** 252 tokens (2 tools)
- **[DeepWiki MCP](/tools/deepwiki-mcp):** 256 tokens (3 tools)
- **[GitMCP](/tools/gitmcp):** 612 tokens (5 tools)
- **[Context7](/tools/context7):** 1,138 tokens (2 tools)

Context7's 1,138 tokens is still modest in isolation (0.57% of a 200K window), and its version-pinned library coverage is why it leads adoption. Still, teams running tight context budgets — or stacking multiple doc endpoints — can see immediately why lightweight remote servers like Ref and DeepWiki barely register in the window.

### 3. Browser automation: Chrome DevTools costs 1.76× more than Playwright

Both official browser servers are heavy because browser control requires dozens of discrete actions, but they are not equal:

- **[Chrome DevTools MCP](/tools/chrome-devtools-mcp) (`v1.14.0`):** 33 tools, **6,924 tokens** (3.46% of 200K)
- **[Playwright MCP](/tools/playwright-mcp) (`v1.66.0-alpha-2026-11-18`):** 25 tools, **3,940 tokens** (1.97% of 200K)

Mounting both simultaneously — common on frontend repos — consumes **10,864 tokens (5.43% of 200K)** before a single page opens. Pick Playwright when you need cross-browser flows and UI automation; mount Chrome DevTools specifically when debugging console errors, network traces, or performance profiles.

### 4. What a realistic 5-server stack actually costs

![Side-by-side comparison of three real-world MCP server stacks and average tokens per tool across verbose versus lean servers](/images/guides/mcp-stack-comparison.png)

One server rarely hurts. Stacking five popular servers in user scope does:

| Example Stack | Servers Included | Total Tools | Upfront `o200k` Tokens | % of 200K Window |
| --- | --- | ---: | ---: | ---: |
| **Heavy full-stack setup** | Supabase + Chrome DevTools + GitHub + Repomix + Context7 | 103 | **21,272** | **10.64%** |
| **Lean equivalent stack** | Playwright + GitHub + DeepWiki + Ref + Exa | 58 | **8,382** | **4.19%** |
| **Minimal docs + search** | DeepWiki + Ref + Exa | 7 | **894** | **0.45%** |

That 21,272-token figure is **purely the raw `tools/list` JSON**. Add your host agent's built-in tools, system prompt, `CLAUDE.md` / rules files, and harness JSON wrappers, and a careless user-scoped `.mcp` setup easily burns 30,000–40,000 tokens before the user types a single prompt. Beyond token spend, exposing 100+ tools degrades tool-selection accuracy — the same attention dilution covered in [Context Engineering](/guides/prompting/context-engineering).

## The 10 heaviest individual tool schemas

Across all 183 tools measured, token overhead follows a sharp Pareto curve: just **10 individual tools** account for **6,698 `o200k` tokens** — nearly 20% of the entire 16-server dataset.

| Rank | Server | Tool Name | `o200k` Tokens | Raw JSON Bytes |
| ---: | --- | --- | ---: | ---: |
| 1 | [Supabase MCP](/tools/supabase-mcp) | `create_notebook` | **1,263** | 4,405 |
| 2 | [Supabase MCP](/tools/supabase-mcp) | `query_logs` | **829** | 2,659 |
| 3 | [Repomix MCP](/tools/repomix) | `pack_remote_repository` | **715** | 3,461 |
| 4 | [Repomix MCP](/tools/repomix) | `pack_codebase` | **676** | 3,350 |
| 5 | [Chrome DevTools MCP](/tools/chrome-devtools-mcp) | `emulate` | **577** | 2,422 |
| 6 | [Context7](/tools/context7) | `resolve-library-id` | **572** | 2,729 |
| 7 | [Context7](/tools/context7) | `query-docs` | **564** | 2,517 |
| 8 | [Supabase MCP](/tools/supabase-mcp) | `run_notebook` | **516** | 2,402 |
| 9 | [Supabase MCP](/tools/supabase-mcp) | `search_docs` | **497** | 2,278 |
| 10 | [Sequential Thinking MCP](/tools/sequential-thinking-mcp) | `sequentialthinking` | **489** | 2,228 |

Inspecting those ten JSON schemas reveals three recurring design patterns that inflate context cost across the ecosystem:

- **Prompt manuals stuffed into `description`:** Tools like `resolve-library-id`, `query-docs`, and `sequentialthinking` ship multi-paragraph behavioral rules, examples, and warnings inside the tool description itself. That guidance is helpful when the tool is used, but every connected session pays for it even when the task has nothing to do with docs lookup or structured thought loops.
- **Giant parameter surfaces and duplicated enums:** `pack_codebase` and `pack_remote_repository` duplicate long option descriptions (ignore patterns, compression flags, output styles, line numbers) across two separate tools instead of sharing a minimal required schema with sensible server-side defaults. Similarly, `emulate` enumerates many network, geolocation, viewport, and device parameters inline.
- **Unscoped specialty tools mounted by default:** Most developers connect Supabase MCP to run SQL queries, read schema metadata, or inspect logs — yet `create_notebook` and `run_notebook` alone add **1,779 tokens** upfront even for teams that never touch notebooks.

## What MCP server authors should do differently

If you maintain an MCP server (or build internal servers for your engineering team), treat `tools/list` size as a first-class performance budget — the same way frontend teams treat JavaScript bundle size:

- **Target 100–180 tokens per tool** for routine CRUD and search tools, and reserve verbose descriptions for genuinely ambiguous parameters.
- **Move usage examples out of `tools/list` into error messages and MCP Prompts/Resources.** If an agent passes a malformed argument, return a concise corrective hint in the tool error response instead of prepending 400 tokens of edge-case instructions to every single turn of every conversation.
- **Ship toolset flags or read-only profiles.** Letting users pass `--read-only` or `--toolsets=database,logs` cuts both token tax and security exposure in one move.
- **Gate `tools/list` token count in CI.** Running a small JSON-RPC probe (like `scripts/benchmark-mcp-tokens.ts` in this repo) on every PR catches accidental schema regressions before they ship to thousands of workspaces.

## How to cut MCP token overhead without losing capability

1. **Scope heavy servers to projects, not user global config.** Keep user scope (`~/.claude.json`) reserved for lightweight, daily utilities under ~1,200 tokens. Put database, cloud, and browser servers in each repo's `.mcp.json` (see [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup)) so backend repos never pay 6,924 tokens for Chrome DevTools.
2. **Mount scoped toolsets and read-only modes.** Many platform servers let you restrict exposed tools via URL parameters or flags — for example, Supabase's `read_only=true` or GitHub MCP's per-toolset filters — cutting both context bloat and blast radius at once.
3. **Avoid overlapping built-in tools.** If you already run Claude Code or Codex CLI, you already have native file editing, grep, and git via bash. Mounting reference Filesystem MCP (2,926 tokens) + Git MCP (1,451 tokens) adds **4,377 redundant tokens** on top of tools your agent already has.
4. **Use on-demand tool loading when available.** Harnesses that support deferred MCP tool search (Claude Code enables it by default) load only compact tool names upfront and pull full parameter schemas on demand — especially valuable when a team requires 50+ tools across multiple vendor servers.
5. **Audit tool bloat when building your own MCP server.** Keep descriptions concise, fold closely related actions into cohesive parameters instead of 30 near-duplicate tools, and check your serialized `tools/list` size in CI (see [Building an MCP Server](/guides/advanced/building-an-mcp-server)).

## Methodology and reproducibility

Every figure in this report is a direct measurement, not a vendor estimate:

- **Date measured:** November 25, 2026.
- **Protocol:** Standard MCP JSON-RPC 2.0 `initialize` (`protocolVersion: "2024-11-05"`) followed by `notifications/initialized` and paginated `tools/list`.
- **Payload normalized:** Each tool was serialized as compact JSON containing the three schema fields passed to models: `{ name, description, inputSchema }`.
- **Tokenizers:** Exact BPE token counts via Python `tiktoken` using both `o200k_base` (primary column) and `cl100k_base` (secondary column). Because Claude's tokenizer and each client's internal tool wrapper add small fixed differences, use the exact numbers as the protocol baseline and the ratios for comparing servers.
- **Why some servers were excluded:** Servers that require live account OAuth or paid API validation before returning `tools/list` (or timed out during keyless stdio startup, such as Desktop Commander, Stripe MCP's remote bridge, and Zilliz Claude Context) were excluded rather than estimated.
- **Reproduce it yourself:** The full probe script lives in the AgentsCamp repository (`scripts/benchmark-mcp-tokens.ts`) and can be re-run against newer server versions at any time.

Next steps: pick the right shortlist in [The Best MCP Servers in 2026](/guides/mcp/best-mcp-servers-2026), wire them cleanly with [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup), or explore the broader landscape in [MCP Ecosystem Statistics](/guides/mcp/mcp-ecosystem-statistics).
