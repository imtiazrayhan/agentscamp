# agentscamp

> 198 ready-to-use Claude Code agents, skills, and slash commands — installable in one command.

[AgentsCamp](https://agentscamp.com) is a curated, format-validated directory of AI coding artifacts. This CLI bundles the full catalog and installs items straight into your `.claude/` directory.

## Quick start

Run it with no arguments and pick what to install:

```bash
npx agentscamp
```

```
What do you want to install?
❯ Everything            198 items
  Agents only          58
  Skills only          90
  Commands only        50
  Pick individual items…
  Cancel
```

Or skip the menu and install the whole catalog in one shot:

```bash
npx agentscamp --all
```

```
Installing 198 items into ~/.claude …
✓ 58 agents, 90 skills, 50 commands installed
198 installed · ~/.claude
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

- **58 agents** — specialized subagents for development, data/AI, infra, security, and more → [browse agents](https://agentscamp.com/agents)
- **90 skills** — on-demand capabilities for testing, databases, refactoring, releases → [browse skills](https://agentscamp.com/skills)
- **50 commands** — reusable slash commands for planning, review, git, scaffolding → [browse commands](https://agentscamp.com/commands)

Every item has a full page with docs, examples, and related picks at [agentscamp.com](https://agentscamp.com).

## How it works

The catalog is bundled into this package at publish time from the same validated source that powers agentscamp.com — what you install is byte-identical to the site's Copy/Download output. No network calls at runtime; `add`, `list`, and `search` all work offline.

## Requirements

- Node.js >= 20
- [Claude Code](https://claude.com/claude-code)

## Links

[agentscamp.com](https://agentscamp.com) · [GitHub](https://github.com/imtiazrayhan/agentscamp) · [@agentscamp](https://x.com/agentscamp)

MIT © Imtiaz Rayhan
