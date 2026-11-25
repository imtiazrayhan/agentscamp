# agentscamp

> 345 ready-to-use Claude Code agents, skills, and slash commands — installable in one command.

[AgentsCamp](https://agentscamp.com) is a curated, format-validated hub for AI guides, tools, and Claude Code artifacts. This zero-dependency CLI bundles the full installable catalog and writes items straight into your `.claude/` directory.

## Quick start

Run it with no arguments and pick what to install:

```bash
npx agentscamp
```

```
What do you want to install?
❯ Everything            345 items
  Agents only           89
  Skills only          168
  Commands only         88
  Pick individual items…
  Cancel
```

Or skip the menu and install the whole catalog in one shot:

```bash
npx agentscamp --all
```

```
Installing 345 items into ~/.claude …
✓ 89 agents, 168 skills, 88 commands installed
345 installed · ~/.claude
```

## Commands

| Command                          | What it does                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `npx agentscamp`                 | Interactive picker — install everything, a whole type, or hand-pick items                  |
| `npx agentscamp --all`           | Install the entire catalog, no prompts                                                      |
| `npx agentscamp install [type...]` | Install whole types (`agents` \| `skills` \| `commands`), `--all`, or pick interactively  |
| `npx agentscamp add <id...>`     | Install specific items (`agents/x`, `skills/x`, `commands/x`, or a bare slug if unique)     |
| `npx agentscamp list [type]`     | List the whole catalog, or one type                                                        |
| `npx agentscamp search <query>`  | Search by name, title, topic, or description                                               |
| `npx agentscamp info <id>`       | Show details and install paths for an item                                                 |

| Flag           | Effect                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| `-a, --all`    | Install the whole catalog (with `install` or no command)                |
| `-g, --global` | Install to `~/.claude/`, available in every project                     |
| `--project`    | Install to `./.claude/` in the current project                          |
| `-f, --force`  | Overwrite existing files (re-running without it is a safe no-op)        |

## Where files go

Bulk installs (`install` / `--all` / the picker) default to **`~/.claude/`** so the
items are available in every project. Targeted `add` defaults to **`./.claude/`** in
the current project. Pass `-g` or `--project` anywhere to override.

| Type     | Global (`install` default)         | Project (`add` default, `--project`) |
| -------- | ---------------------------------- | ------------------------------------ |
| Agents   | `~/.claude/agents/<name>.md`       | `./.claude/agents/<name>.md`         |
| Skills   | `~/.claude/skills/<name>/SKILL.md` | `./.claude/skills/<name>/SKILL.md`   |
| Commands | `~/.claude/commands/<name>.md`     | `./.claude/commands/<name>.md`       |

These are Claude Code's standard locations — agents get delegated to automatically based on their description, skills load on demand, and commands run as `/<name>`.

## What's inside

- **89 agents** — specialized subagents for development, data/AI, infra, security, product, marketing, and analytics → [browse agents](https://agentscamp.com/agents)
- **168 skills** — on-demand `SKILL.md` capabilities for testing, databases, refactoring, RAG, releases, and more → [browse skills](https://agentscamp.com/skills)
- **88 commands** — reusable slash commands for planning, review, git, scaffolding, and profiling → [browse commands](https://agentscamp.com/commands)

Every item has a full page with docs, examples, and related picks at [agentscamp.com](https://agentscamp.com).

## Popular guides & directories on AgentsCamp

- [Best Claude Skills in 2026](https://agentscamp.com/guides/skills/best-claude-skills-2026) — curated skills by job
- [Best MCP Servers in 2026](https://agentscamp.com/guides/mcp/best-mcp-servers-2026) — coding, docs, database, and browser MCP servers
- [Best Claude Code Alternatives in 2026](https://agentscamp.com/guides/comparisons/best-claude-code-alternatives-2026) — CLI, IDE, and open-source comparisons
- [AI Tools Directory](https://agentscamp.com/tools) — 260+ AI tools with pricing and `/alternatives` comparisons
- [Machine-readable index (`llms.txt`)](https://agentscamp.com/llms.txt) — clean Markdown twins for every page

## How it works

The catalog is bundled into this package at publish time from the same validated source that powers agentscamp.com — what you install is byte-identical to the site's Copy/Download output. No network calls at runtime; `add`, `list`, and `search` all work offline.

## Requirements

- Node.js >= 20
- [Claude Code](https://claude.com/claude-code)

## Links

[agentscamp.com](https://agentscamp.com) · [GitHub](https://github.com/imtiazrayhan/agentscamp) · [@agentscamp](https://x.com/agentscamp)

MIT © Imtiaz Rayhan
