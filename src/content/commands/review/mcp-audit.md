---
description: "Audit every MCP config file in the repository and home directory for unpinned packages, inline secrets, wide filesystem roots, unprotected remote servers, and poisoned tool descriptions. Read-only."
seoDescription: "/mcp-audit checks the MCP configs in the repo and home dir for unpinned packages, inline secrets, wide file roots, unprotected servers, and poisoned tool text."
date: 2026-10-12
argument-hint: "[config path or server name]"
allowed-tools: "Read, Grep, Glob, Bash"
title: "MCP Audit"
color: "purple"
topics: ["mcp", "ai-safety-security"]
audience: ["developers", "security", "devops"]
featured: false
related: ["skill:mcp-config-auditor", "agent:mcp-security-reviewer", "command:add-mcp-server", "command:security-scan", "skill:claude-settings-auditor", "guide:govern-mcp-servers", "guide:claude-code-mcp-setup"]
summary: "A read-only slash command that finds every MCP config file the common clients load from the repo and the home directory, and reports unpinned packages, inline secrets, filesystem roots at home or above, remote servers over plain HTTP or without auth, duplicate tool names, and tool descriptions that instruct the model, each with a severity and a fix."
---

Audit the MCP servers this machine and this repository will launch, before they launch. This command runs the [mcp-config-auditor](/skills/security/mcp-config-auditor) procedure over every config file the common clients read, and reports findings with the file, the line, a severity, and the fix. It is **read-only**: it never starts a server, edits a config, or rotates a credential. For the server's own code, hand the result to the [mcp-security-reviewer](/agents/quality-security/mcp-security-reviewer) agent.

## Scope

Interpret `$ARGUMENTS` as follows:

1. Empty: audit every known location in the repository and the home directory (Step 1).
2. A file path: audit that file only, but still read `.claude/settings*.json` for the auto-approval flags that affect it.
3. A server name: audit only that server, across every file that defines it; useful right after `claude mcp add`.

If a path does not exist, say so and continue with the rest. Never print the full contents of `~/.claude.json`; it holds more than servers. Read only its `mcpServers` keys and quote nothing else.

## Step 1 — Locate the configs

`Glob` these and list which exist before reading any:

| Client | Project | User |
| --- | --- | --- |
| Claude Code | `.mcp.json` | `~/.claude.json`, a managed MCP file where IT deploys one |
| Claude Desktop | | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS), `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Cursor | `.cursor/mcp.json` | `~/.cursor/mcp.json` |
| VS Code | `.vscode/mcp.json` | the profile's `mcp.json` |
| Codex CLI | | `~/.codex/config.toml` (`[mcp_servers.*]`) |

Plus `.claude/settings.json` and `.claude/settings.local.json` for `enableAllProjectMcpServers`, `enabledMcpjsonServers`, and `disabledMcpjsonServers`.

## Step 2 — Normalize

One row per server: client, scope, name, transport, command and args or URL, env keys, header names, file and line. Run `git ls-files --error-unmatch <file>` for each project file so the report can say which ones are committed.

## Step 3 — Run the checks

Apply the seven checks from the skill, in this order, so the report reads from most to least dangerous:

1. **Inline secrets** in `env` or `headers` (provider prefixes, high-entropy strings, passwords in connection strings). Fix: `${VAR}` references, values in the environment; rotate anything that was committed.
2. **Tool descriptions that instruct the model**, from docs, saved `tools/list` output, or vendored source only. Quote the text. Fix: a human reads it; if it is not describing the tool, the server does not get connected.
3. **Filesystem roots** at `/`, `~`, `$HOME`, `..`, or above the project. Fix: the narrowest directory the task needs.
4. **Remote servers** on `http://` (other than localhost), with no auth header or OAuth, or with a token in the query string. Fix: HTTPS plus an `Authorization` header that references an env var.
5. **Unpinned packages** (`npx -y pkg` with no `@version`, `uvx pkg` with no `==`, `:latest` images). Fix: an exact version.
6. **Auto-approval** of project servers enabled in settings. Fix: remove the flag; approve servers one by one.
7. **Duplicate or shadowing tool names** across servers. Fix: keep one; name the intended server.

> [!WARNING]
> Do not run a server to obtain its tool list, even to complete check 2. Starting it executes its code. If descriptions are not available statically, report "tool descriptions not reviewed" for that server and name the [mcp-security-reviewer](/agents/quality-security/mcp-security-reviewer) agent as the next step, which asks for consent before using MCP Inspector.

## Step 4 — Report

```markdown
## /mcp-audit

Configs found: .mcp.json (committed), ~/.claude.json, .cursor/mcp.json
Not found: claude_desktop_config.json, .vscode/mcp.json, ~/.codex/config.toml
Servers: 5 (3 project, 2 user)

| Severity | Server    | File:line             | Finding                                     | Fix                                   |
| -------- | --------- | --------------------- | ------------------------------------------- | ------------------------------------- |
| High     | notes-db  | .mcp.json:14          | DATABASE_URL with password, file committed  | "${DATABASE_URL}"; rotate password    |
| High     | files     | .cursor/mcp.json:6    | filesystem root "~"                         | narrow to "./"                        |
| Medium   | search    | .mcp.json:21          | npx -y @acme/search-mcp, unpinned           | @acme/search-mcp@2.3.0                |
| Medium   | (project) | .claude/settings.json | enableAllProjectMcpServers: true            | remove; approve individually          |
| Low      | search, docs | both                | both expose a `search` tool                 | disable one or rename in the server   |

Totals: 2 High, 2 Medium, 1 Low.
Not reviewed: tool descriptions for `search` (no docs or saved tools/list found).

Next: rotate the database password now; then hand `search` to the mcp-security-reviewer agent.
```

## Step 5 — Point to the next step

End with the single most urgent action. Credential exposure comes first, always: rotate, then fix the file. Then the server reviews. The fleet-level practices that make this a routine check (pinning, registries, approval gates) are in [Governing MCP servers](/guides/mcp/govern-mcp-servers); the scopes and approval prompts the flags above control are in [Claude Code MCP setup](/guides/mcp/claude-code-mcp-setup). To add a server with the checks applied up front, use [/add-mcp-server](/commands/workflow/add-mcp-server); for the permission layers around the servers, the [claude-settings-auditor](/skills/workflow/claude-settings-auditor) skill.
