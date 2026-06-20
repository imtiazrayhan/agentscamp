# AgentsCamp

> Ready-to-use Claude Code agents, skills, and slash commands — browse at [agentscamp.com](https://agentscamp.com), install in one command.

```bash
npx agentscamp          # pick what to install, or --all for everything
```

[![npm](https://img.shields.io/npm/v/agentscamp)](https://www.npmjs.com/package/agentscamp)

## The `agentscamp` CLI

The npm package bundles the full AgentsCamp catalog — 198 curated, format-validated items — and installs them straight into Claude Code's standard locations. Zero runtime dependencies, no network calls; everything works offline.

```bash
npx agentscamp                       # interactive picker: everything, a type, or hand-pick
npx agentscamp --all                 # install the whole catalog into ~/.claude/
npx agentscamp install agents        # install all agents

npx agentscamp add skills/dependency-audit   # install a specific item → ./.claude/
npx agentscamp list skills                   # browse the catalog by type
npx agentscamp search "code review"          # search names, titles, topics, descriptions
npx agentscamp info agents/prompt-engineer   # details + install paths for an item
```

Bulk installs (`--all`, `install`, the picker) default to `~/.claude/` so items work in every project; targeted `add` defaults to `./.claude/` in the current project.

| Flag           | Effect                                                          |
| -------------- | -------------------------------------------------------------- |
| `-a, --all`    | Install the whole catalog (with `install` or no command)        |
| `-g, --global` | Install to `~/.claude/`, available in every project             |
| `--project`    | Install to `./.claude/` in the current project                  |
| `-f, --force`  | Overwrite existing files (re-running without it is a safe no-op) |

Full CLI docs: [`cli/README.md`](cli/README.md) · npm: [npmjs.com/package/agentscamp](https://www.npmjs.com/package/agentscamp)

## What's in the catalog

- **58 agents** — specialized subagents for development, data/AI, infra, security, and more → [agentscamp.com/agents](https://agentscamp.com/agents)
- **90 skills** — on-demand capabilities for testing, databases, refactoring, releases → [agentscamp.com/skills](https://agentscamp.com/skills)
- **50 commands** — reusable slash commands for planning, review, git, scaffolding → [agentscamp.com/commands](https://agentscamp.com/commands)

The site adds guides, a tool directory, and an AI glossary. Every page has a clean Markdown twin at the same URL plus `.md`, and the whole catalog is machine-readable at [/llms.txt](https://agentscamp.com/llms.txt).

## Repository layout

| Path                           | What it is                                                         |
| ------------------------------ | ------------------------------------------------------------------ |
| [`cli/`](cli/)                 | The `agentscamp` npm package (CLI + bundled catalog)                |
| [`src/content/`](src/content/) | The catalog source — plain Markdown with zod-validated frontmatter  |
| everything else                | The [agentscamp.com](https://agentscamp.com) site (Next.js)         |

## License

The `agentscamp` npm package — the CLI and the bundled agents, skills, and commands — is [MIT](cli/LICENSE).
