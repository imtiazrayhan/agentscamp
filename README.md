# AgentsCamp

> Guides, an AI tool directory, and a glossary for everyone working with AI — developers, founders, marketers, designers, and analysts — plus ready-to-install Claude Code agents, skills, and slash commands. Read it at [agentscamp.com](https://agentscamp.com).

## What's on the site

- **Guides (297)** — tutorials, benchmarks, and head-to-head comparisons across coding agents, RAG, MCP, evals, voice, and AI at work → [agentscamp.com/guides](https://agentscamp.com/guides)
- **Tools (262)** — a curated AI tool directory with pricing, workflows, and `/alternatives` pages → [agentscamp.com/tools](https://agentscamp.com/tools)
- **Glossary (157)** — plain-language AI and LLM-engineering definitions → [agentscamp.com/glossary](https://agentscamp.com/glossary)
- **Role paths & topics** — curated starting points by role ([/for](https://agentscamp.com/for)) and cross-type collections ([/topics](https://agentscamp.com/topics))
- **Agents (89), skills (168), and commands (88)** — installable Claude Code artifacts in the real on-disk format, with copy/download actions and exact install paths → [/agents](https://agentscamp.com/agents) · [/skills](https://agentscamp.com/skills) · [/commands](https://agentscamp.com/commands)

### Popular starting points

- [AI Coding Agents & Claude Code Alternatives (2026)](https://agentscamp.com/guides/comparisons/best-claude-code-alternatives-2026)
- [Best Claude Skills in 2026](https://agentscamp.com/guides/skills/best-claude-skills-2026)
- [The Best MCP Servers in 2026](https://agentscamp.com/guides/mcp/best-mcp-servers-2026)
- [AI Coding Statistics (2026)](https://agentscamp.com/guides/concepts/ai-coding-statistics-2026)
- [Start here by role](https://agentscamp.com/for) — developers, AI engineers, DevOps, security, founders, marketers, designers, analysts, and sales

Every page has a clean Markdown twin at the same URL plus `.md` (or via `Accept: text/markdown`); the whole hub is machine-readable at [/llms.txt](https://agentscamp.com/llms.txt) and [/llms-full.txt](https://agentscamp.com/llms-full.txt). Follow updates on [X (@agentscamp)](https://x.com/agentscamp), [/feed.xml](https://agentscamp.com/feed.xml), or [/guides/feed.xml](https://agentscamp.com/guides/feed.xml).

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
