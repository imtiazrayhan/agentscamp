---
title: "MCP Troubleshooting: Server Won't Connect & Other Fixes"
description: "Fixes for the MCP problems people actually hit — servers failing to connect, missing tools, OAuth loops, timeouts, truncated output, and Windows quirks."
author: "AgentsCamp"
date: 2026-06-12
color: "green"
topics: ["mcp"]
tags: ["mcp", "troubleshooting", "debugging", "claude-code"]
featured: false
summary: "MCP failures cluster into five: the server process won't start, it starts but times out (MCP_TIMEOUT=60000), it connects but tools are missing (pending approval, permission denies, server config), remote auth fails (finish OAuth via /mcp, check headers), and output gets truncated by design (MAX_MCP_OUTPUT_TOKENS). claude mcp list and MCP Inspector localize almost everything."
keyTakeaways:
  - "Debug in layers: does the command run at all → does it connect → do tools appear → do calls succeed. claude mcp list answers the middle two instantly."
  - "Most stdio failures are environmental: the command isn't on PATH, a required env var wasn't passed (--env KEY=value), or the runtime (Node/Python/Docker) is missing or wrong-version."
  - "Slow servers trip the startup timeout — launch with MCP_TIMEOUT=60000; per-server timeout fields in .mcp.json handle the chronic cases."
  - "Tools missing ≠ not connected: project-scoped servers need one-time approval (/mcp shows pending), and mcp__server__* deny rules silently hide tools."
  - "MCP Inspector is the bisection tool: if a server misbehaves in your client, drive it directly — same failure means the server's broken; working means your client config is."
faq:
  - q: "Why does my MCP server show as failed in Claude Code?"
    a: "Run the server's launch command standalone first — npx -y <package> or the exact command from claude mcp get <name>. Most failures reproduce immediately outside MCP: missing runtime, package error, or an env var the server requires that wasn't passed via --env. If it runs standalone but fails in the client, suspect the startup timeout (MCP_TIMEOUT=60000 claude) or PATH differences."
  - q: "Why are my MCP server's tools not showing up?"
    a: "Three usual causes: a project-scoped server still pending approval (run /mcp — approve it), a permission rule denying its tools (check /permissions for mcp__<server>__ patterns), or the server genuinely exposing nothing — /mcp shows a tool count per server; zero means the server's own configuration is the problem."
  - q: "How do I fix OAuth problems with a remote MCP server?"
    a: "Run /mcp, select the server, choose Authenticate, and finish in the browser — a 401 status means exactly this. If the browser flow loops: check the system clock (token validation hates skew), try removing and re-adding the server to clear stale tokens, and for header-auth servers verify the --header value isn't expired."
  - q: "Why is my MCP tool's output cut off?"
    a: "By design — output is capped (~25k tokens default) to protect your context window. Raise MAX_MCP_OUTPUT_TOKENS if genuinely needed, but the better fix is asking the server for less: filters, pagination, read-only modes. A tool dumping megabytes is a tool design problem."
related: ["guide:claude-code-mcp-setup", "guide:claude-code-troubleshooting", "tool:mcp-inspector", "guide:best-mcp-servers-2026", "guide:building-an-mcp-server", "command:add-mcp-server"]
---

MCP problems feel mysterious because three programs are involved — your client, a transport, and someone else's server — but the failures cluster tightly. Debug in layers and almost everything localizes in minutes. (Setup itself is covered in [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup); this is the page for when it doesn't work.)

## Layer 1: Does the server run at all?

For stdio servers, extract the launch command (`claude mcp get <name>`) and run it standalone. Most "won't connect" reproduces instantly: **missing runtime** (Node version, Python, Docker not running), **package errors** (typo'd name, broken release — pin versions), or **missing env vars** — secrets must be passed via `--env KEY=value` or the `env` block in `.mcp.json`; servers that need them typically crash on boot without them. If the standalone run works but the client connection fails, compare environments: the client doesn't inherit your shell profile's PATH additions.

## Layer 2: It runs but won't connect

**Timeouts** dominate here. Docker pulls, `uvx` cold starts, and model-loading servers can exceed the startup window — launch with `MCP_TIMEOUT=60000 claude`, and give chronic offenders a per-server `timeout` in `.mcp.json`. On **Windows**, npx-based stdio servers may need the `cmd /c` wrapper form; WSL users hitting remote-transport errors should try the documented `mcp-remote` fallbacks some vendors provide. For **remote servers**, a quick `curl -i <url>` distinguishes "server down" from "auth required" (401 → Layer 4).

## Layer 3: Connected, but tools are missing

`/mcp` shows per-server status *and tool counts* — read it before theorizing. **Pending approval** is the classic: project-scoped servers from a committed `.mcp.json` need a one-time per-user approval, and until then their tools don't exist. **Permission denies** are the silent one: a `deny: ["mcp__*"]` or server-specific rule hides tools without ceremony — `/permissions` shows active rules and their source files. And a connected server with **zero tools** is the server's own problem: wrong mode flags, a feature-group config (several official servers gate tool groups behind URL params), or a version mismatch.

## Layer 4: Auth and OAuth loops

Remote-server 401s want the built-in flow: `/mcp` → server → **Authenticate** → browser. When the loop won't complete: check **clock skew** (OAuth hates it), remove and re-add the server to clear stale token state, and confirm any `--header "Authorization: Bearer …"` token hasn't expired or lost scopes. Servers using helper-based auth re-run their helper per connection — test the helper standalone.

## Layer 5: It works, but badly

**Truncated output** is policy, not a bug — ~25k tokens default (`MAX_MCP_OUTPUT_TOKENS` to raise; better to request less). **Slow tool calls** have per-call timeout controls server-side and in config. **Context bloat** from too many connected servers shows up in `/context` — every server's schemas ride along; prune per project.

> [!TIP]
> The universal bisection tool: [MCP Inspector](/tools/mcp-inspector). Drive the misbehaving server directly — list its tools, call one with known-good arguments. Fails there too → the server is broken (file the issue upstream). Works there → your client config is the problem, and Layers 1–4 will find it.
