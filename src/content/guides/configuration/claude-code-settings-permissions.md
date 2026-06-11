---
title: "Claude Code Settings & Permissions: settings.json Explained"
description: "Every Claude Code settings file and which one wins, the permission-rule syntax with its Bash matching gotchas, permission modes, and a safe starter settings.json."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "settings", "permissions", "configuration", "security"]
featured: false
summary: "Claude Code reads settings from up to five places — managed policy, CLI flags, .claude/settings.local.json, .claude/settings.json, and ~/.claude/settings.json, in that precedence order. Permissions are deny → ask → allow rules like Bash(npm run test:*) or Edit(src/**). Check a team baseline into the project file, keep personal overrides local, and manage rules with /permissions."
keyTakeaways:
  - "Five sources, one winner: managed policy > CLI flags > .claude/settings.local.json > .claude/settings.json > ~/.claude/settings.json — and a deny rule from any scope beats an allow from any other."
  - "Permission rules are Tool or Tool(specifier): Bash(npm run test:*), Edit(src/**/*.ts), Read(~/.zshrc), WebFetch(domain:example.com), mcp__server__tool."
  - "Bash matching is prefix-based with a word boundary: Bash(ls *) matches 'ls -la' but not 'lsof'; Bash(ls*) matches both. Compound commands are checked per subcommand."
  - "Permission modes set the autonomy dial — default, acceptEdits, plan, bypassPermissions — cycle them with Shift+Tab or set defaultMode in settings."
  - "First rules to write: deny Read on your secrets (.env, key files), allow your test/lint commands, and keep bypassPermissions for isolated containers only."
faq:
  - q: "Where is Claude Code's settings.json?"
    a: "Three places you'll actually edit: ~/.claude/settings.json (your defaults for every project), .claude/settings.json in a repo (team-shared, checked in), and .claude/settings.local.json (personal, gitignored). Enterprise machines can also have a managed settings file that overrides everything, and CLI flags override everything except managed policy."
  - q: "How do I let Claude Code run commands without being asked every time?"
    a: "Add permission rules. Either run /permissions and add allow rules interactively, or put them in settings.json — e.g. \"allow\": [\"Bash(npm run test:*)\", \"Bash(git diff:*)\"]. When a permission prompt appears, choosing \"don't ask again\" writes the rule for you. Prefer narrow prefixes over allowing all of Bash."
  - q: "What's the difference between settings.json and settings.local.json?"
    a: ".claude/settings.json is the team file — checked into the repo, applies to everyone who works in it. .claude/settings.local.json is yours alone — Claude Code gitignores it automatically, and it takes precedence over the team file. Team baseline in one, personal taste in the other."
  - q: "How do I block Claude Code from reading secrets?"
    a: "Deny rules: \"deny\": [\"Read(./.env)\", \"Read(./.env.*)\", \"Read(./secrets/**)\"]. Deny beats allow from any scope, so a project-level deny holds even if a user-level rule allows broadly. Pair it with a PreToolUse hook if you want the same paths protected from edits with a custom message."
  - q: "What does bypassPermissions mode do?"
    a: "It skips permission prompts entirely — Claude runs tools without asking. It exists for isolated environments (containers, throwaway VMs, CI sandboxes) where the blast radius is contained. Don't run it on your laptop: the prompt you would have denied is exactly the one that matters."
related: ["claude-code-hooks", "claude-settings-auditor", "claude-code-memory-context", "claude-code-tips", "effective-tool-use", "claude-md-best-practices", "claude-code"]
---

Every Claude Code behavior you'd want to standardize — what it may run without asking, what it must never touch, which hooks fire, which model it uses — lives in `settings.json`. The trouble is that there are five of them, they merge, and the permission syntax has real gotchas. This guide is the map.

## The five places settings come from

| Scope | Location | Who it affects | Precedence |
| --- | --- | --- | --- |
| **Managed policy** | `/Library/Application Support/ClaudeCode/` (macOS), `/etc/claude-code/` (Linux) | Everyone on the machine — IT-deployed | 1 (highest) |
| **CLI flags** | `claude --permission-mode plan …` | This session | 2 |
| **Local project** | `.claude/settings.local.json` (auto-gitignored) | You, this repo | 3 |
| **Project** | `.claude/settings.json` (checked in) | Whole team, this repo | 4 |
| **User** | `~/.claude/settings.json` | You, every repo | 5 (lowest) |

Higher scopes win on conflicts, with one crucial exception: **a `deny` permission rule from any scope blocks the action regardless of `allow` rules elsewhere.** Security floors hold even when someone's personal settings are permissive.

The working pattern: put the **team contract** (allowed commands, denied paths, shared [hooks](/guides/configuration/claude-code-hooks)) in `.claude/settings.json`, and **personal taste** (your model, your notification hook) in `~/.claude/settings.json` or the local file.

## The keys you'll actually set

A tour of the high-value keys — there are more, but these carry most real configs:

- **`permissions`** — `allow` / `ask` / `deny` rule arrays plus `additionalDirectories` (extra paths Claude may access beyond the working directory). The heart of the file; full syntax below.
- **`env`** — environment variables for every session in scope (`{"NODE_ENV": "test"}`).
- **`hooks`** — lifecycle automation; see the [hooks guide](/guides/configuration/claude-code-hooks).
- **`model`** — default model alias or full name.
- **`defaultMode`** — starting permission mode (see modes below).
- **`statusLine`** / **`outputStyle`** — UI customization, usually set via `/statusline` and `/output-style`.
- **`includeCoAuthoredBy`** — whether commits get the `Co-Authored-By: Claude` trailer.
- **`autoMemoryEnabled`** — toggle [auto-memory](/guides/configuration/claude-code-memory-context).
- **`cleanupPeriodDays`** — how long session transcripts are kept.
- **`enableAllProjectMcpServers`** — auto-approve every MCP server a project's `.mcp.json` defines (convenient, but understand what you're trusting).
- **`enabledPlugins`** / **`extraKnownMarketplaces`** — plugin management, usually driven by `/plugin`.

## Permission rules: the syntax

Rules live in three arrays — `allow` (run without asking), `ask` (always confirm), `deny` (never) — and each rule is `Tool` or `Tool(specifier)`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Bash(git diff:*)",
      "Edit(src/**)",
      "WebFetch(domain:docs.anthropic.com)"
    ],
    "ask": ["Bash(git push:*)"],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

Evaluation order is **deny → ask → allow** — the first match decides.

**Bash rules** are prefix matchers, and the details bite:

- `Bash(npm run test:*)` — the `:*` suffix means "this prefix plus anything": matches `npm run test`, `npm run test -- --watch`, etc.
- `Bash(ls *)` matches `ls -la` but **not** `lsof` — the space is a word boundary. `Bash(ls*)` matches both. Easy to write the wrong one.
- Compound commands are evaluated per subcommand: `git status && npm test` needs both halves covered (a prompt's "yes, don't ask again" records them separately).
- Wildcards work mid-pattern too: `Bash(git * main)` covers `git push origin main` and `git merge main`.

**Read and Edit rules** use gitignore-style paths with four anchors: `//abs/path` (filesystem root), `~/path` (home), `/path` (project root), `path` (relative). `**` recurses, `*` matches one level — so `Edit(src/**/*.ts)` is "any TypeScript file under src".

**Other tools:** `WebFetch(domain:example.com)` scopes fetching by domain; `mcp__github__create_issue` targets one MCP tool (and `mcp__*` in `deny` switches off all MCP tools); `Agent(Explore)` controls which subagents may launch.

> [!TIP]
> You rarely have to hand-write rules cold: run `/permissions` for an interactive editor that shows every active rule *and which file it came from*, or answer a permission prompt with "don't ask again" and let Claude Code write the rule. The [claude-settings-auditor](/skills/workflow/claude-settings-auditor) skill reviews the merged result for holes.

## Permission modes: the autonomy dial

Modes set the default posture; rules carve out exceptions.

| Mode | Behavior |
| --- | --- |
| `default` | Prompts on first use of each tool — the standard interactive loop |
| `acceptEdits` | Auto-approves file edits and safe filesystem commands; still asks for the rest |
| `plan` | Read-only: Claude explores and proposes a plan, edits nothing until approved |
| `bypassPermissions` | No prompts at all — for isolated containers/VMs only |

Cycle modes with **Shift+Tab** mid-session, start one with `claude --permission-mode plan`, or pin a default with `"defaultMode"` in settings. (Recent versions add further opt-in modes — an auto-approval mode with safety checks among them — but these four are the durable core.)

> [!WARNING]
> `bypassPermissions` is not a convenience setting. Everything that makes an agent safe to run on your machine routes through the permission system; bypass it only where the environment itself is the sandbox — a container or CI runner you can throw away. For day-to-day speed, `acceptEdits` plus a good allow-list gets you 90% of the velocity at a fraction of the risk.

## A safe starter for your team

Drop this in `.claude/settings.json`, adjust the commands to your stack, and commit it:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Bash(npm run build)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)"
    ],
    "ask": ["Bash(git push:*)", "Bash(npm install:*)"],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": { "FORCE_COLOR": "1" },
  "includeCoAuthoredBy": true
}
```

It encodes the three habits that matter: the verify loop (lint/test/build) runs friction-free, anything that leaves the machine asks first, and secrets are unreadable no matter what anyone's personal settings say. From there, tighten or loosen per project — and let [hooks](/guides/configuration/claude-code-hooks) handle the rules that need logic instead of patterns. For the deeper question of *which tools an agent should have at all*, see [Effective Tool Use](/guides/prompting/effective-tool-use).
