# agentscamp

> 198 ready-to-use Claude Code agents, skills, and slash commands — installable in one command.

[AgentsCamp](https://agentscamp.com) is a curated, format-validated directory of AI coding artifacts. This CLI bundles the full catalog and installs items straight into your `.claude/` directory.

## Quick start

```bash
npx agentscamp add agents/api-architect
```

```
✓ agents/api-architect → /your/project/.claude/agents/api-architect.md
1 installed
```

## Commands

| Command                       | What it does                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `npx agentscamp add <id...>`  | Install one or more items (`agents/x`, `skills/x`, `commands/x`, or a bare slug if unique) |
| `npx agentscamp list [type]`  | List the whole catalog, or one type (`agents` \| `skills` \| `commands`)                   |
| `npx agentscamp search <query>` | Search by name, title, topic, or description                                             |
| `npx agentscamp info <id>`    | Show details and install paths for an item                                                |

| Flag           | Effect                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| `-g, --global` | Install to `~/.claude/` (default is `./.claude/` in the current project) |
| `--project`    | Install to `./.claude/` explicitly                                       |
| `-f, --force`  | Overwrite existing files (re-running `add` without it is a safe no-op)   |

## Where files go

| Type     | Project (default)                   | Global (`-g`)                      |
| -------- | ----------------------------------- | ---------------------------------- |
| Agents   | `./.claude/agents/<name>.md`        | `~/.claude/agents/<name>.md`       |
| Skills   | `./.claude/skills/<name>/SKILL.md`  | `~/.claude/skills/<name>/SKILL.md` |
| Commands | `./.claude/commands/<name>.md`      | `~/.claude/commands/<name>.md`     |

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
