---
title: "Adding MCP Servers to Claude Code: Local, Remote, and Project-Scoped"
description: "The complete claude mcp add reference — stdio vs HTTP transports, local/project/user scopes, .mcp.json with env expansion, OAuth via /mcp, and the gotchas."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["mcp", "workflow-prompting"]
tags: ["claude-code", "mcp", "configuration", "tools", "integrations"]
featured: true
summary: "Connect an MCP server to Claude Code with one command: claude mcp add <name> -- <command> for local stdio servers, or claude mcp add --transport http <name> <url> for hosted ones. Pick a scope (--scope local, project, or user), authenticate remotes with OAuth via /mcp, and commit .mcp.json so your whole team gets the same servers."
keyTakeaways:
  - "Two transports cover everything: stdio for local child-process servers (claude mcp add name -- npx -y some-server) and Streamable HTTP for hosted ones (--transport http + URL). SSE is deprecated."
  - "Three scopes: local (just you, this project — the default), project (committed to .mcp.json, whole team), user (just you, every project)."
  - "Remote servers authenticate with OAuth: add the server, run /mcp, pick it, and complete the browser flow — tokens are stored and refreshed automatically."
  - ".mcp.json supports ${VAR} and ${VAR:-default} expansion in commands, URLs, env, and headers, so secrets stay out of the committed file."
  - "MCP tools obey the permission system as mcp__server__tool, and server output is capped (~25k tokens by default) — an MCP server is code you're trusting, so vet it like a dependency."
howtoSteps:
  - name: "Pick the transport"
    text: "Use stdio for a server that runs on your machine as a child process (most npx/uvx servers), and Streamable HTTP for a hosted remote server the vendor operates (a URL like https://mcp.linear.app/mcp)."
  - name: "Choose the scope"
    text: "Default local keeps the server personal to this project. Use --scope project to write it to a committed .mcp.json the whole team shares, or --scope user to have it in every project you open."
  - name: "Add the server"
    text: "Local: claude mcp add <name> --env KEY=value -- <command and args>. Remote: claude mcp add --transport http <name> <url>, with --header for token auth if the server doesn't use OAuth."
  - name: "Authenticate if it's remote"
    text: "Inside a session, run /mcp, select the server, and choose Authenticate to complete the browser OAuth flow. Tokens are stored securely and refreshed automatically."
  - name: "Verify it connected"
    text: "claude mcp list shows every configured server with connection status; /mcp shows status and tool counts in-session. A server that's added but not connected has given you nothing yet."
  - name: "Scope what it may do"
    text: "MCP tools participate in permissions as mcp__<server>__<tool>. Allow the specific tools you want friction-free, and deny write-capable tools on servers you only need to read from."
faq:
  - q: "How do I add an MCP server to Claude Code?"
    a: "Run claude mcp add. For a local stdio server: claude mcp add my-server --env API_KEY=... -- npx -y some-mcp-server. For a hosted remote server: claude mcp add --transport http linear https://mcp.linear.app/mcp, then authenticate with /mcp inside a session. The -- separator matters: everything after it is the server's own launch command."
  - q: "Where does Claude Code store MCP server configuration?"
    a: "Local- and user-scoped servers live in ~/.claude.json (per-project entries for local scope, a top-level mcpServers key for user scope). Project-scoped servers live in a .mcp.json file at the repo root, designed to be committed so teammates get the same servers."
  - q: "What's the difference between local, project, and user scope?"
    a: "Local (default): only you, only in this project — right for experiments and personal credentials. Project: written to .mcp.json, checked in, shared with everyone who clones the repo; each teammate approves it before its tools activate. User: only you, but in every project — right for personal utilities like a notes or search server."
  - q: "How do I authenticate a remote MCP server?"
    a: "Most hosted servers use OAuth: add the server, run /mcp, select it, and choose Authenticate — a browser window completes the flow, and Claude Code stores and auto-refreshes the token. For servers that take API keys instead, pass a header at add time: claude mcp add --transport http --header \"Authorization: Bearer <token>\" name url."
  - q: "Why isn't my MCP server connecting?"
    a: "Run claude mcp list to see status. The usual causes: the launch command isn't on PATH (test it standalone first), a required env var is missing (--env KEY=value), a slow server tripping the startup timeout (raise it with MCP_TIMEOUT=60000 claude), or a project-scoped server still pending approval — check /mcp."
related: ["best-mcp-servers-2026", "building-an-mcp-server", "deploy-remote-mcp-server", "govern-mcp-servers", "add-mcp-server", "mcp-inspector", "claude-code-troubleshooting", "claude-code-settings-permissions", "context7", "github-mcp-server"]
---

MCP servers are how [Claude Code](/tools/claude-code) reaches beyond your filesystem — into GitHub, your database, your issue tracker, a headless browser, your docs. The protocol is open, the ecosystem is in the thousands of servers, and wiring one up is a single command. The decisions that actually matter are the **transport**, the **scope**, and **how much you trust the thing** — this guide covers all three. (When a server is added but won't connect, the [MCP troubleshooting guide](/guides/troubleshooting/mcp-troubleshooting) walks the fixes.)

## One command, two transports

**Local (stdio) servers** run on your machine as a child process Claude Code launches. This is most open-source servers — anything you'd run with `npx`, `uvx`, or `docker run`:

```bash
# the -- separator is critical: everything after it is the server's own command
claude mcp add postgres --env DATABASE_URI="postgresql://localhost:5432/mydb" \
  -- uvx postgres-mcp --access-mode=restricted
```

**Remote (HTTP) servers** are hosted by the vendor — nothing runs on your machine, and auth is usually OAuth:

```bash
claude mcp add --transport http linear https://mcp.linear.app/mcp
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

If a remote server takes a token instead of OAuth, pass it as a header: `claude mcp add --transport http --header "Authorization: Bearer <token>" name url`. You'll also see `--transport sse` in older docs — SSE is deprecated; prefer HTTP wherever the vendor offers it.

Manage what you've added with `claude mcp list` (with connection status), `claude mcp get <name>`, and `claude mcp remove <name>`.

## Scopes: who gets the server

| Scope | Stored in | Who sees it |
| --- | --- | --- |
| `local` (default) | `~/.claude.json` (this project's entry) | You, this project only |
| `project` | `.mcp.json` at the repo root — **committed** | Everyone who clones the repo |
| `user` | `~/.claude.json` (global) | You, every project |

The team play is project scope. A committed `.mcp.json` means "these are this repo's integrations" — new teammates get them on clone, and Claude Code asks each person to **approve** the file's servers before their tools activate (you'll see them as pending in `/mcp` until then).

Secrets stay out of the committed file via environment expansion — `.mcp.json` supports `${VAR}` and `${VAR:-default}` in `command`, `args`, `env`, `url`, and `headers`:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp",
      "headers": { "Authorization": "Bearer ${GITHUB_PAT}" }
    }
  }
}
```

Each teammate exports `GITHUB_PAT` their own way; the repo never holds a token.

## Authentication: the /mcp flow

Hosted servers that return a 401 want OAuth. The flow is built in: run `/mcp` inside a session, select the server, choose **Authenticate**, and finish in the browser. Claude Code stores the token securely and refreshes it automatically. `/mcp` is also your status panel — per-server connection state, tool counts, and reconnects live there.

## What a connected server actually gives you

Three things, not one:

- **Tools** — the headline feature. They appear to the model as `mcp__<server>__<tool>` and participate in the [permission system](/guides/configuration/claude-code-settings-permissions) under exactly that name, so you can allow `mcp__github__get_issue` while denying `mcp__github__*` writes.
- **Resources** — reference server data inline with `@server:resource` mentions (e.g. `@github:issue://123`), fetched and attached to your prompt.
- **Prompts** — servers can ship reusable prompts that surface as slash commands: `/mcp__github__list_prs`.

Two operational limits worth knowing: server startup has a timeout (raise with `MCP_TIMEOUT=60000 claude` for slow Docker-based servers), and tool output is capped — about 25k tokens by default, configurable via `MAX_MCP_OUTPUT_TOKENS` — so a tool that dumps a whole database will get truncated, by design.

## Trust is the real configuration

An MCP server is code that runs with the credentials you hand it, feeding text straight into your agent's context. That has two failure modes: a malicious or compromised server (supply chain), and a *legitimate* server returning attacker-controlled content (prompt injection — a web-fetching tool reading a hostile page). So:

- **Vet provenance before adding** — prefer official vendor servers and well-known projects; read the source of small community ones. The [Add MCP Server](/commands/workflow/add-mcp-server) command walks this checklist, and [MCP Inspector](/tools/mcp-inspector) lets you poke a server's tools directly before trusting it in a session.
- **Scope credentials down** — read-only tokens and modes where offered; many servers ship them precisely for this.
- **Don't hoard servers** — every connected server's tool definitions ride along in context. Keep the per-project set tight, and disable ones you're not using (the `enableAllProjectMcpServers` setting auto-approves a repo's full set — convenient, but understand what you're signing).

> [!TIP]
> Not sure which servers are worth connecting? Start with the [best MCP servers in 2026](/guides/mcp/best-mcp-servers-2026) — the short list that covers docs, GitHub, browsers, and databases for most developers.

Building your own server instead of consuming one? Start with [Building an MCP Server](/guides/advanced/building-an-mcp-server), then [deploy it remotely](/guides/mcp/deploy-remote-mcp-server) when the team needs it — and once you're running more than a handful, [governance](/guides/mcp/govern-mcp-servers) becomes the next problem.
