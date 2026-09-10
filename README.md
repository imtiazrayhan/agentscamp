# AgentsCamp

> Guides, an AI tool directory, and a glossary for building with AI coding agents — plus ready-to-install Claude Code agents, skills, and slash commands. Read it at [agentscamp.com](https://agentscamp.com).

## What's on the site

- **Guides** — tutorials and deep-dives, from first principles to advanced workflows → [agentscamp.com/guides](https://agentscamp.com/guides)
- **Tools** — a curated directory of AI coding tools, editors, agents, and MCP servers, with pricing and alternatives → [agentscamp.com/tools](https://agentscamp.com/tools)
- **Glossary** — AI and LLM-engineering terms, defined precisely → [agentscamp.com/glossary](https://agentscamp.com/glossary)
- **Topics** — cross-cutting collections across every content type → [agentscamp.com/topics](https://agentscamp.com/topics)
- **Agents, skills, and commands** — installable Claude Code artifacts in the real on-disk format. Every page has copy/download actions and the exact install path → [/agents](https://agentscamp.com/agents) · [/skills](https://agentscamp.com/skills) · [/commands](https://agentscamp.com/commands)

Every page has a clean Markdown twin at the same URL plus `.md`; the whole hub is machine-readable at [/llms.txt](https://agentscamp.com/llms.txt) and [/llms-full.txt](https://agentscamp.com/llms-full.txt). Follow new additions via [/feed.xml](https://agentscamp.com/feed.xml) or the guides-only [/guides/feed.xml](https://agentscamp.com/guides/feed.xml).

## npm CLI (optional)

[![npm](https://img.shields.io/npm/v/agentscamp)](https://www.npmjs.com/package/agentscamp)

If you'd rather install from the terminal, the `agentscamp` npm package bundles the full catalog of agents, skills, and commands and installs them straight into Claude Code's standard locations. Zero runtime dependencies, no network calls; everything works offline.

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

## Repository layout

| Path                           | What it is                                                         |
| ------------------------------ | ------------------------------------------------------------------ |
| [`cli/`](cli/)                 | The `agentscamp` npm package (CLI + bundled catalog)                |
| [`src/content/`](src/content/) | The catalog source — plain Markdown with zod-validated frontmatter  |
| everything else                | The [agentscamp.com](https://agentscamp.com) site (Next.js)         |

## License

The `agentscamp` npm package — the CLI and the bundled agents, skills, and commands — is [MIT](cli/LICENSE).
