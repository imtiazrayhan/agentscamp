---
name: "Sentry MCP"
title: "Sentry MCP"
description: "Sentry's hosted MCP service for debugging — pull issues, events, traces, and releases into your agent, and trigger Seer root-cause analysis."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://mcp.sentry.dev"
pricing: "free"
category: "mcp"
repo: "https://github.com/getsentry/toolkit"
license: "FSL-1.1-Apache-2.0"
os: ["Web", "macOS", "Windows", "Linux"]
color: "red"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "sentry", "debugging", "observability", "errors"]
featured: false
sameAs:
  - "https://github.com/getsentry/toolkit"
  - "https://www.npmjs.com/package/@sentry/mcp-server"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "agent:debugger", "command:explain-error", "command:find-bug", "guide:claude-code-plugins"]
alternativeTo: ["github-mcp-server", "postgres-mcp", "playwright-mcp"]
summary: "Sentry MCP connects a coding agent to your Sentry data: it searches issues, errors, traces, logs and replays, reads stack traces, updates issues and can run Seer root-cause analysis. Use the hosted server at mcp.sentry.dev/mcp with OAuth, or run it locally with the Sentry CLI's sentry mcp command, which is also the route for self-hosted Sentry."
faq:
  - q: "How do I add Sentry MCP to Claude Code?"
    a: "Three documented ways. Remote: claude mcp add --transport http sentry https://mcp.sentry.dev/mcp, optionally with /{organizationSlug}/{projectSlug} appended to scope it, then sign in with OAuth. Plugin: claude plugin marketplace add getsentry/sentry-mcp, then claude plugin install sentry-mcp@sentry-mcp, which adds a sentry-mcp subagent. Local: install the Sentry CLI, run sentry auth login, then claude mcp add sentry -- sentry mcp."
  - q: "What can an agent do through Sentry MCP?"
    a: "Tools are grouped into skills. Inspect, on by default, is read-only access to issues, events, traces, replays, releases, monitors, profiles and documentation. Seer, also on by default, runs Sentry's AI debugger on an issue. Triage (resolve, assign and update issues) and project-management (create and modify projects, teams, DSNs, monitors and alert rules) are off by default and must be granted."
  - q: "Does Sentry MCP work with self-hosted Sentry?"
    a: "Yes, through the stdio server. Log in with sentry auth login --url https://sentry.example.com and set SENTRY_HOST in the MCP server's environment. Seer is not part of self-hosted Sentry, so the seer skill is dropped from the defaults. The AI-powered search tools need your own LLM provider key (OpenAI, Azure OpenAI, Anthropic or OpenRouter), set with EMBEDDED_AGENT_PROVIDER."
  - q: "Is Sentry MCP open source?"
    a: "It is source-available. The code is published under the Functional Source License (FSL-1.1-Apache-2.0), which is not an OSI open-source license but converts to Apache 2.0 later. The repository was renamed from getsentry/sentry-mcp to getsentry/toolkit and now holds the Sentry CLI and the MCP server together; the old URL redirects."
---

Sentry MCP closes the gap between "an error is happening in production" and "the agent is fixing it." Instead of you pasting a stack trace into chat, the agent queries Sentry itself for the issue, its events and the trace, and can hand hard cases to **Seer**, Sentry's AI debugger, before it writes a fix.

Sentry builds and hosts it. The README is explicit about scope: the service "is primarily designed for human-in-the-loop coding agents", with tool selection aimed at developer workflows and debugging "rather than providing a general-purpose MCP server for all Sentry functionality." It suits teams that already send errors and traces to Sentry and code with an agent such as Claude Code or Cursor.

## Highlights

- **Search across telemetry.** `search_issues`, `search_errors`, `search_traces`, `search_logs` and related tools translate natural-language questions into Sentry's query syntax.
- **Issue detail.** `get_issue_details`, `get_event_stacktrace`, `get_issue_breadcrumbs`, `get_trace_details` and `get_release_details` return the context a fix needs.
- **Seer on demand.** `analyze_issue_with_seer` runs Sentry's root-cause analysis and returns the findings to the agent.
- **Skills as permission groups.** `inspect` and `seer` are enabled by default. `triage` (including `update_issue` and `add_issue_note`) and `project-management` (including `create_project`, `create_dsn` and `create_alert_rule`) are opt-in. The repository's tool definitions list 80 tools in total as of November 2026.
- **Scoped URLs.** `https://mcp.sentry.dev/mcp/{organizationSlug}/{projectSlug}` limits the connection to one project and hides discovery tools you no longer need. Sentry recommends project scoping when possible.
- **Claude Code plugin.** Installs a `sentry-mcp` subagent that Claude Code delegates Sentry questions to, which keeps raw telemetry out of your main context.
- **Local stdio server.** `sentry mcp`, part of the Sentry CLI, runs the same server on your machine using your CLI login.

## In an AI-assisted workflow

The hosted server, scoped to a project:

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp/acme/web
```

The plugin, for subagent delegation:

```bash
claude plugin marketplace add getsentry/sentry-mcp
claude plugin install sentry-mcp@sentry-mcp
```

Or the local server through the Sentry CLI:

```bash
curl https://cli.sentry.dev/install -fsS | bash
sentry auth login
claude mcp add sentry -- sentry mcp
```

`acme/web` above is a made-up organization and project. With any of the three in place, a prompt like this works:

```text
Investigate the spike in WEB-1207. Read a few representative events
and the trace, find the root cause, and propose a fix.
```

The agent pulls the issue, reads events and the trace, correlates with the release and returns a diagnosis grounded in telemetry. That is the loop the [debugger agent](/agents/quality-security/debugger) runs, now with production data attached.

> [!NOTE]
> The subagent pattern is worth copying for any noisy data source: raw events stay in the subagent's context and only the diagnosis comes back to yours. It is the same discipline covered in [Managing Claude Code Memory & Context](/guides/configuration/claude-code-memory-context).

## Good to know

The hosted service needs only a Sentry account and OAuth sign-in; Sentry does not list a separate charge for it, and what the agent can read follows your Sentry plan and permissions.

- **Rate limits.** Tool calls count against the Sentry API's rate limits. The server retries briefly, then returns a "Rate Limited" message. The README's advice is to run Sentry tool calls one at a time rather than in parallel.
- **Write tools are opt-in.** Grant `triage` or `project-management` only when the task needs them. On the remote server with token auth you can narrow tools with `?skills=inspect,triage` or `?disable-skills=seer`; locally, use `--skills` and `--disable-skills`.
- **LLM key for search, locally.** In stdio mode the `search_*` tools need a configured provider. Without one those tools are unavailable and the rest still work.
- **Token scopes.** If you use a User Auth Token instead of the CLI login, the README lists `org:read`, `project:read`, `project:write`, `team:read`, `team:write` and `event:write`.
- **The npx package is legacy.** `npx @sentry/mcp-server@latest` still ships the same server, but the README files it under "Legacy" and marks `--access-token` as deprecated in favor of `SENTRY_AUTH_TOKEN`.
- **Experimental variants.** `?experimental=1` on the remote URL, or `sentry mcp --experimental`, enables forward-looking tool variants that may change, as of November 2026.

Sentry MCP has no drop-in substitute, because it fronts Sentry's own data. What you pair it with matters more. The [GitHub MCP server](/tools/github-mcp-server) supplies the code and pull-request side of an incident, [Postgres MCP Pro](/tools/postgres-mcp) diagnoses slow queries a trace points at, and [Chrome DevTools MCP](/tools/chrome-devtools-mcp) or [Playwright MCP](/tools/playwright-mcp) reproduces a frontend error in a real browser.
