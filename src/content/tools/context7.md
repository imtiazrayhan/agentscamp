---
name: "Context7"
description: "Upstash's MCP server that pulls up-to-date, version-specific library documentation into your agent's context — the cure for hallucinated APIs."
date: 2026-06-11
url: "https://context7.com"
pricing: "freemium"
category: "mcp"
repo: "https://github.com/upstash/context7"
license: "MIT"
os: ["Web", "macOS", "Windows", "Linux"]
color: "purple"
topics: ["mcp"]
tags: ["mcp", "documentation", "context", "rag", "upstash"]
featured: true
sameAs:
  - "https://github.com/upstash/context7"
  - "https://context7.com/docs"
  - "https://www.npmjs.com/package/@upstash/context7-mcp"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "add-mcp-server", "smithery", "documentation-engineer", "govern-mcp-servers"]
alternativeTo: ["exa", "firecrawl", "jina-reader"]
summary: "Context7 is the most-adopted MCP server in the ecosystem (~57k GitHub stars): it resolves a library name to its indexed docs and injects current, version-specific documentation and code examples into the model's context at query time. Two tools — resolve-library-id and query-docs — kill the 'trained on last year's API' failure mode. Hosted at mcp.context7.com or local via npx."
faq:
  - q: "What does Context7 actually do?"
    a: "When your agent needs to use a library, Context7 fetches that library's current, version-specific documentation and code examples and injects them into context. Instead of the model guessing an API from training data, it reads the real docs for the version you're on — which is why it became the default first MCP server for coding agents."
  - q: "Is Context7 free?"
    a: "The server is MIT-licensed and the hosted service has a free tier (rate-limited, public-library docs; a free API key raises the limits). Paid Pro and Enterprise plans add private-repo indexing and higher quotas."
  - q: "How do I add Context7 to Claude Code?"
    a: "Fastest: npx ctx7 setup --claude, which handles login, key, and install. Manual remote: claude mcp add --scope user --header \"CONTEXT7_API_KEY: YOUR_API_KEY\" --transport http context7 https://mcp.context7.com/mcp. A local stdio variant runs via npx -y @upstash/context7-mcp."
---

Context7, open-sourced by Upstash, is the most-adopted MCP server in the ecosystem — and the one with the clearest job description: **stop the model from hallucinating APIs.** Models are trained on snapshots; libraries move. Context7 closes the gap by fetching current, version-specific documentation and code examples for thousands of libraries and injecting exactly the relevant slice into your agent's context at query time.

## Highlights

- **Two tools, one job** — `resolve-library-id` maps "next.js" to its indexed ID, `query-docs` pulls the documentation relevant to your query for that exact library and version.
- **Version-specific** — the docs fetched match the version you're working against, which is the whole point: v14 answers for a v14 codebase.
- **Hosted or local** — a remote Streamable HTTP endpoint at `mcp.context7.com/mcp`, or a local stdio server via `npx -y @upstash/context7-mcp`.
- **Beyond MCP** — the `ctx7` CLI and an agent-skills mode cover the same ground for setups where you'd rather not run an MCP server at all.
- **Private repos on paid plans** — Pro indexes your internal libraries so agents stop hallucinating *your* APIs too.

## In an AI-assisted workflow

The one-command setup wires Claude Code up end to end:

```bash
npx ctx7 setup --claude
# or, manually (remote server + API key header):
claude mcp add --scope user --header "CONTEXT7_API_KEY: YOUR_API_KEY" \
  --transport http context7 https://mcp.context7.com/mcp
```

From then on, "use the current Drizzle syntax for this migration — check Context7" grounds the agent in today's docs instead of training-data memory.

> [!TIP]
> Context7 pairs naturally with a rule in CLAUDE.md: "when using an unfamiliar or fast-moving library, query Context7 before writing code." It turns the server from a tool the model *might* use into a habit it always has.

## Good to know

The server is MIT-licensed; the hosted service is freemium — anonymous use is rate-limited, a free API key (from the dashboard) lifts the limits, and the free tier covers public libraries only. It's also a good first server for learning [how MCP setup works in Claude Code](/guides/mcp/claude-code-mcp-setup): no OAuth dance, instant value, obvious failure modes.
