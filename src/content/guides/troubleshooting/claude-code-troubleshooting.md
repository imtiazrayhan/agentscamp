---
title: "Claude Code Troubleshooting: Fixes for the Most Common Problems"
description: "Fixes for the Claude Code problems people actually hit — install and auth failures, context-limit errors, MCP servers that won't connect, permission loops."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "troubleshooting", "errors", "debugging", "mcp"]
featured: false
summary: "Most Claude Code problems fall into five buckets: install and auth (run /doctor; check ANTHROPIC_API_KEY isn't overriding your plan), context limits (/compact with instructions, /clear between tasks), MCP failures (claude mcp list, raise MCP_TIMEOUT, OAuth via /mcp), permission rules that don't match (the Bash word-boundary gotcha), and CI differences (explicit --allowedTools)."
keyTakeaways:
  - "Start every weird-behavior investigation with /doctor (installation health) and /status (version, model, account) — they catch the boring causes in seconds."
  - "Auth confusion is usually an environment variable: a stale ANTHROPIC_API_KEY makes Claude Code bill the API even though you have a Pro/Max plan."
  - "MCP debugging is a pipeline: claude mcp list for status → test the server's command standalone → check env vars and OAuth via /mcp → raise MCP_TIMEOUT for slow starts."
  - "Permission rules fail by syntax: Bash(ls *) won't match lsof, compound commands are checked per subcommand, and /permissions shows which file each active rule came from."
  - "Context-limit errors are managed, not fixed: /context to see the bill, /compact with instructions mid-task, /clear between tasks, subagents for verbose work."
faq:
  - q: "Why is Claude Code charging API usage when I have a Pro/Max subscription?"
    a: "Almost always an ANTHROPIC_API_KEY in your environment — when set, it takes precedence and bills the API. Unset it from your shell profile and run /login to authenticate with your subscription, then /status to confirm which account the session is using."
  - q: "Why won't my MCP server connect in Claude Code?"
    a: "Run claude mcp list for the per-server status. The usual ladder: the launch command fails outside Claude Code (test npx -y <server> standalone), a required env var is missing (--env KEY=value at add time), the server needs OAuth you haven't completed (/mcp → Authenticate), it's a project-scoped server still pending approval (/mcp shows it), or it starts slower than the timeout (MCP_TIMEOUT=60000 claude)."
  - q: "What do I do when Claude Code says the conversation is too long?"
    a: "Free the window: /compact with instructions about what to keep ('/compact keep the failing test output'), or /clear if you're between tasks (the old session stays in /resume). Prevent recurrences by running /context to see what's eating space — often MCP tool definitions — and delegating verbose operations to subagents."
  - q: "Why does Claude Code keep asking permission for a command I allowed?"
    a: "The rule probably doesn't match the command's exact shape. Bash rules are prefix matchers with word boundaries — Bash(npm test) doesn't cover npm test -- --watch (use Bash(npm test:*)), and compound commands like a && b need both halves allowed. Run /permissions to inspect active rules and which settings file each comes from."
  - q: "Where are Claude Code's logs and diagnostics?"
    a: "Three built-ins before you go log-spelunking: /doctor diagnoses installation and config health, /status shows version, model, and account, and /usage shows token spend and plan limits. For MCP specifics, claude mcp get <name> prints a server's full config and state."
related: ["guide:installing-claude-code", "guide:claude-code-mcp-setup", "guide:claude-code-settings-permissions", "guide:claude-code-memory-context", "guide:claude-code-hooks", "guide:claude-code-ci-github-actions", "guide:claude-code-tips", "command:explain-error"]
---

Claude Code problems cluster: install and auth, context limits, MCP connections, permissions, and CI. This guide is organized the way you search when something's broken — symptom first, then the fix. Two commands solve a remarkable share of everything below: **`/doctor`** (installation and config health) and **`/status`** (version, model, account). Run them first.

## Install and auth

### "command not found: claude" after installing

The install landed outside your PATH. If you used npm (`npm install -g @anthropic-ai/claude-code`), check `npm config get prefix` points somewhere your shell looks; on version managers (nvm, fnm), each Node version has its own globals, so switching Node "removes" Claude Code. Reinstall under the Node you actually use, or use the native installer from the docs, then verify with `claude --version` and `/doctor`.

### Claude Code bills the API though you have Pro/Max

A set `ANTHROPIC_API_KEY` wins over your subscription login. Unset it (check `~/.zshrc` and CI-ish dotfiles), run `/login`, confirm with `/status`. Teams that need a key for the [Agent SDK](/guides/advanced/claude-agent-sdk-tutorial) but a plan for interactive work should scope the key per-project (e.g. direnv) instead of globally.

### Stuck or looping login

`/login` again from inside the session; if the browser handoff is broken (remote box, container), copy the URL it prints into any browser. `/doctor` flags clock skew and proxy issues that quietly break OAuth.

## Context and sessions

### "Conversation too long" / context-limit errors

Free space now: `/compact` with instructions — `/compact keep the failing test output and the plan` — or `/clear` between tasks (history stays in `/resume`). If compaction itself errors, clear and reattach what you need by `@`-mentioning files. Prevent it structurally: `/context` shows what's eating the window (MCP tool schemas are a frequent surprise), and verbose work belongs in subagents — the [memory & context guide](/guides/configuration/claude-code-memory-context) covers the full hygiene list.

### Claude "forgot" an instruction mid-session

Long sessions compact; conversation-only instructions can fade in the summary. Anything that must hold belongs in a file — `CLAUDE.md`, a `.claude/rules/` entry, or a `#` memory — not just in chat. Rules that must hold *mechanically* belong in [hooks](/guides/configuration/claude-code-hooks).

### Lost a session / wrong directory

Sessions are per-directory: `claude --continue` reattaches the latest one *for the directory you're in* — including per-[worktree](/guides/advanced/parallel-claude-code-worktrees). `/resume` opens the full picker.

## MCP servers

### Server shows as failed in `claude mcp list`

Debug as a pipeline: (1) run the server's command standalone — `npx -y <package>` — most failures are PATH, Node version, or the package erroring on boot; (2) check env vars were passed (`claude mcp get <name>`; secrets go in `--env KEY=value`); (3) slow Docker/uvx starts trip the startup timeout — launch with `MCP_TIMEOUT=60000 claude`; (4) on Windows, npx-based stdio servers may need the `cmd /c` wrapper form.

### Remote server returns 401 / unauthorized

That's OAuth waiting to happen: `/mcp` → select the server → **Authenticate** → finish in the browser. Header-auth servers instead need the token at add time: `claude mcp add --transport http --header "Authorization: Bearer <token>" name url`. Setup details: [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup).

### Server connected, but its tools don't appear

Project-scoped servers need a one-time approval — `/mcp` shows anything pending. Check `/mcp`'s tool count for the server; zero tools means the server started but exposed nothing (its own config problem). And confirm a permission rule isn't denying `mcp__<server>__*`.

### MCP tool output gets truncated

By design — output is capped (~25k tokens default). Raise `MAX_MCP_OUTPUT_TOKENS` if you must, but the better fix is asking the server for less (filters, pagination, read-only modes).

## Permissions and hooks

### Claude keeps asking about a command you allowed

Rule-syntax mismatch, almost every time. The classics: `Bash(npm test)` is exact — `npm test -- --watch` needs `Bash(npm test:*)`; `Bash(ls *)` has a word boundary — it matches `ls -la`, not `lsof`; compound commands (`a && b`) are evaluated per subcommand, so both need coverage. `/permissions` shows every active rule *and the settings file it came from* — the [settings guide](/guides/configuration/claude-code-settings-permissions) has the full syntax table.

### An action is blocked and you don't know why

Deny beats allow from any scope — including a checked-in project file or managed (admin) settings you didn't write. `/permissions` reveals the source. Hooks can also block (exit code 2): `/hooks` lists what's registered and from where.

### A hook isn't firing — or fires and breaks things

`/hooks` to confirm registration and scope. Matchers are exact-or-regex (`Edit|Write` ≠ `edit`); scripts must be executable; a hook that exits 2 unintentionally blocks the action it watches — its stderr (shown to Claude) tells you which. The [hooks guide](/guides/configuration/claude-code-hooks) covers exit-code semantics.

## Headless and CI

### Works interactively, fails in CI

Three usual suspects: **auth** (CI needs `ANTHROPIC_API_KEY` or Bedrock/Vertex env — no browser login); **permissions** (no human to approve prompts — pass explicit `--allowedTools`, `--permission-mode`, `--max-turns`); **environment** (hooks/plugins/CLAUDE.md from your machine don't exist there — or *do* exist via the repo and surprise you; `--bare` starts deterministic and lets you add back only what the job needs). Full reference: [Running Claude Code in CI](/guides/advanced/claude-code-ci-github-actions).

### The GitHub Action doesn't respond to @claude

Confirm the workflow triggers on `issue_comment` (and PR events you care about), the GitHub App is installed on the repo (`claude /install-github-app`), and `anthropic_api_key` is set from repo secrets. A custom `trigger_phrase` overrides `@claude` — check the workflow inputs before blaming the bot.

> [!TIP]
> Still stuck? `claude --debug` runs with verbose diagnostics, and `/feedback` files a bug with session context attached. For errors in *your* code rather than the tool, point [Explain Error](/commands/analyze/explain-error) at the stack trace instead.
