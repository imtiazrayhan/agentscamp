---
name: "plugin-scaffolder"
description: "Scaffold a complete, valid Claude Code plugin from a description — the .claude-plugin/plugin.json manifest, component directories (skills, agents, commands, hooks, MCP config), portable ${CLAUDE_PLUGIN_ROOT} wiring, a local test loop with --plugin-dir, and a marketplace.json for distribution. Use when turning scattered .claude/ customizations into one installable, versioned package."
allowed-tools: "Read, Grep, Glob, Write, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "purple"
date: 2026-06-11
topics: ["workflow-prompting"]
related: ["claude-code-plugins", "writing-your-first-skill", "writing-a-custom-agent", "hook-writer", "claude-code-mcp-setup"]
featured: false
summary: "Describe the plugin — or point at an existing .claude/ directory worth packaging — and this skill scaffolds the whole thing: correct layout (manifest in .claude-plugin/, components at the root), a working sample of each component, portable path variables, validation via claude plugin validate, and the marketplace.json that makes it installable with /plugin install."
---

A Claude Code plugin is mostly *layout discipline*: the manifest goes in `.claude-plugin/`, every component directory goes at the plugin root, paths must use `${CLAUDE_PLUGIN_ROOT}` to survive installation, and the marketplace entry has its own schema. This skill encodes that discipline — describe the plugin (or point at the `.claude/` setup you want to package) and get a valid, testable scaffold.

## When to use this skill

- You're starting a plugin and want the structure, manifest, and one working example of each component generated correctly the first time.
- You have customizations scattered across `.claude/agents/`, `.claude/skills/`, hooks, and an `.mcp.json`, and want them migrated into one installable package.
- You're setting up a team or personal **marketplace** repo and need the `marketplace.json` wired so `/plugin install` works.

## When NOT to use this skill

- You're sharing a *single* procedure — one [skill file](/guides/skills/writing-your-first-skill) needs no plugin around it.
- The customization is for exactly one repo and travels with it — checked-in `.claude/` files already do that; packaging adds versioning overhead you don't need yet. See [the plugins guide](/guides/configuration/claude-code-plugins) for the dividing line.

## Instructions

1. **Inventory what the plugin carries.** From the description (or by reading the existing `.claude/` directory), list the components: skills, agents, commands, hooks, MCP servers, LSP config. Confirm the plugin's name (kebab-case, unique — it becomes the namespace prefix users type, e.g. `/my-plugin:release-notes`).
2. **Scaffold the layout exactly.** Create `.claude-plugin/plugin.json` — **only the manifest lives in that folder** — and component directories at the plugin root: `skills/<name>/SKILL.md`, `agents/*.md`, `commands/*.md`, `hooks/hooks.json`, `.mcp.json`. Manifest gets `name` (required), plus `version`, `description`, `author`, and `repository` so marketplaces render it properly.
3. **Write working samples, not lorem ipsum.** Each requested component gets a minimal but real implementation derived from the user's description — a skill with actual instructions, a hook with a functioning script. Migrating existing files? Copy them in, then fix what packaging breaks (next step).
4. **Make paths portable.** Anything referencing files inside the plugin uses `${CLAUDE_PLUGIN_ROOT}` (the install location changes and moves on update); anything writing caches or generated state uses `${CLAUDE_PLUGIN_DATA}` (survives updates); anything touching the user's project uses `${CLAUDE_PROJECT_DIR}`. Hardcoded relative paths are the #1 way plugins break after install.
5. **Test, then validate.** Run the local loop: `claude --plugin-dir ./<plugin>` to load it for a session, exercise each component (the namespaced command, the hook trigger, the MCP connection), iterate with `/reload-plugins`. Finish with `claude plugin validate ./<plugin> --strict` and fix every warning.
6. **Wire distribution.** Generate or update the `marketplace.json` (in this repo or the user's marketplace repo) with the plugin's entry and source. State the consumer install path explicitly: `/plugin marketplace add <owner>/<repo>` then `/plugin install <name>@<marketplace>` — and for teams, note the project-scope install that gives every clone the plugin after a trust prompt.

> [!WARNING]
> A plugin executes on other people's machines: its hooks run shell commands and its MCP servers receive credentials. Don't bundle secrets (use env expansion), pin any third-party servers it pulls in, and keep the manifest's `repository` honest so consumers can read the source they're trusting.

> [!TIP]
> Keep version discipline from day one — bump `version` on every behavioral change. Marketplaces surface it, and "which version are you on?" is the first debugging question you'll ask a teammate.

## Output

A complete plugin directory that passes `claude plugin validate --strict`: manifest, all requested components implemented, portable path variables throughout, plus the `marketplace.json` entry and a short INSTALL note covering the marketplace-add, install, and local `--plugin-dir` test commands.
