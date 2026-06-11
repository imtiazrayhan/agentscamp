---
name: "Sentry MCP"
title: "Sentry MCP"
description: "Sentry's hosted MCP service for debugging — pull issues, events, traces, and releases into your agent, and trigger Seer root-cause analysis."
date: 2026-06-11
url: "https://mcp.sentry.dev"
pricing: "free"
category: "mcp"
repo: "https://github.com/getsentry/sentry-mcp"
license: "FSL-1.1-Apache-2.0"
os: ["Web", "macOS", "Windows", "Linux"]
color: "red"
topics: ["mcp"]
tags: ["mcp", "sentry", "debugging", "observability", "errors"]
featured: false
sameAs:
  - "https://github.com/getsentry/sentry-mcp"
  - "https://www.npmjs.com/package/@sentry/mcp-server"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "debugger", "explain-error", "find-bug", "claude-code-plugins"]
summary: "Sentry MCP connects agents to production reality: 38 tools for searching issues and events, pulling stack traces and trace details, updating and annotating issues, and invoking Seer root-cause analysis. For Claude Code, Sentry ships it as a plugin that installs a sentry-mcp subagent — errors get debugged against the actual telemetry instead of your memory of it."
faq:
  - q: "How do I add Sentry MCP to Claude Code?"
    a: "Sentry's documented path is the plugin: claude plugin marketplace add getsentry/sentry-mcp, then claude plugin install sentry-mcp@sentry-mcp — it installs a subagent Claude Code delegates Sentry work to. The hosted endpoint (https://mcp.sentry.dev/mcp) also works as a normal remote server with OAuth via /mcp."
  - q: "What can an agent do through Sentry MCP?"
    a: "Search issues and events, pull full issue details with stack traces, fetch trace details, update issues (assign, resolve, annotate), look up projects/releases/teams, search Sentry's docs, and trigger Seer — Sentry's AI root-cause analysis — on an issue. The tool set is curated for human-in-the-loop debugging rather than full API coverage."
  - q: "Does Sentry MCP work with self-hosted Sentry?"
    a: "Yes, via the stdio server: npx @sentry/mcp-server@latest --access-token=<user-token> --host=sentry.example.com. Note the AI-powered natural-language search tools need an OpenAI or Anthropic key in that mode, and Seer may be unavailable on self-hosted instances."
---

Sentry MCP closes the loop between "an error is happening in production" and "the agent is fixing it." Instead of pasting a stack trace into chat, the agent queries Sentry itself — full issue context, event history, trace data — and can even hand the gnarly ones to **Seer**, Sentry's root-cause analysis, before writing the fix.

## Highlights

- **38 debugging-focused tools** — `get_issue_details`, `search_issues`, `search_events`, `get_trace_details`, `update_issue`, project/release/team lookups, and docs search; curated for coding agents, not a 1:1 API mirror.
- **Seer on demand** — `analyze_issue_with_seer` runs Sentry's AI root-cause analysis and returns the findings as agent context.
- **A real Claude Code plugin** — the install ships a `sentry-mcp` subagent that Claude Code auto-delegates Sentry investigations to, keeping noisy telemetry out of your main context.
- **Hosted or self-hosted** — OAuth remote at `mcp.sentry.dev/mcp` for SaaS; an npx stdio server with a user token for self-hosted Sentry.

## In an AI-assisted workflow

```bash
claude plugin marketplace add getsentry/sentry-mcp
claude plugin install sentry-mcp@sentry-mcp
# then:
# > Investigate the spike in SENTRY-1207, find the root cause, and propose a fix
```

The agent pulls the issue, reads representative events and the trace, correlates with the release, and comes back with a diagnosis grounded in telemetry — the workflow the [debugger agent](/agents/quality-security/debugger) runs, now with production data attached.

> [!NOTE]
> The subagent delegation pattern here is worth copying for any noisy data source: raw events stay in the subagent's context; only the diagnosis returns to yours. It's the same context discipline covered in [Managing Claude Code Memory & Context](/guides/configuration/claude-code-memory-context).

## Good to know

The hosted service is free with a Sentry account (Sentry itself is freemium). The code is source-available under FSL-1.1-Apache-2.0 — readable and self-hostable, not OSI open source. Self-hosted stdio mode needs token scopes (`org:read`, `project:read/write`, `team:read/write`, `event:write`), and its AI-search tools require your own LLM provider key.
