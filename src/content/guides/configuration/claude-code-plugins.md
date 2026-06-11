---
title: "Claude Code Plugins: Install, Use, and Build Your Own"
description: "How Claude Code plugins work — what they can bundle, the /plugin and marketplace commands, the plugin.json manifest, and building and testing your own."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "plugins", "configuration", "marketplace", "extensibility"]
featured: false
summary: "Plugins are Claude Code's distribution format: one installable package that can bundle skills, agents, slash commands, hooks, MCP servers, and LSP config. Install from marketplaces with /plugin (Anthropic's official one is preregistered), add others with /plugin marketplace add owner/repo, and build your own with a .claude-plugin/plugin.json manifest tested via claude --plugin-dir."
keyTakeaways:
  - "A plugin bundles what you'd otherwise configure piecemeal — skills, agents, commands, hooks, MCP servers, even LSP servers — into one versioned, installable unit."
  - "Install with /plugin install name@marketplace; Anthropic's official marketplace is preregistered, and any GitHub repo with a marketplace.json can be added via /plugin marketplace add owner/repo."
  - "Plugin components are namespaced (/plugin-name:skill-name), so two plugins with same-named commands don't collide."
  - "Building one is a directory: .claude-plugin/plugin.json (only the manifest goes in there) plus skills/, agents/, hooks/, .mcp.json at the plugin root. Test with claude --plugin-dir ./my-plugin."
  - "Teams ship a baseline by installing plugins at project scope, so everyone who clones the repo gets the same tooling after a trust prompt."
faq:
  - q: "What is a Claude Code plugin?"
    a: "A plugin is an installable package that extends Claude Code with any combination of skills, subagents, slash commands, hooks, MCP servers, and LSP (code intelligence) configuration. It's the distribution format: instead of telling teammates to copy files into .claude/, you point them at one plugin that carries the whole setup, versioned."
  - q: "How do I install a Claude Code plugin?"
    a: "Run /plugin to browse interactively, or install directly: /plugin install <name>@<marketplace>. Anthropic's official marketplace (claude-plugins-official) is registered out of the box; add others with /plugin marketplace add owner/repo (GitHub), a git URL, a local path, or a remote marketplace.json URL."
  - q: "What's the difference between a plugin and a skill?"
    a: "A skill is one capability — a SKILL.md that teaches Claude a procedure. A plugin is packaging: it can contain many skills, plus agents, hooks, commands, and MCP servers, with a manifest and a version. If you're sharing a single procedure, a skill file is enough; if you're sharing a toolkit, make it a plugin."
  - q: "How do I create my own plugin?"
    a: "Make a directory with .claude-plugin/plugin.json ({\"name\": \"my-plugin\"} is the only required field) and put components at the plugin root: skills/<name>/SKILL.md, agents/, hooks/hooks.json, .mcp.json. Test with claude --plugin-dir ./my-plugin, iterate with /reload-plugins, validate with claude plugin validate, then publish by listing it in a repo's marketplace.json."
  - q: "Can I make a private, team-only plugin marketplace?"
    a: "Yes — a marketplace is just a marketplace.json in a git repo (private repos work, including via SSH). Teams add it with /plugin marketplace add, and enterprises can restrict which marketplaces are allowed via managed settings."
related: ["claude-code-hooks", "claude-code-settings-permissions", "skills-vs-agents-vs-commands", "writing-your-first-skill", "writing-a-custom-agent", "plugin-scaffolder", "claude-code-mcp-setup", "claude-code"]
---

For most of Claude Code's life, sharing your setup meant a README: "copy these files into `.claude/agents/`, add this to settings, run `claude mcp add`…" **Plugins** replace that with a real distribution format — one installable, versioned package that can carry your whole toolkit.

## What a plugin can bundle

Any combination of:

- **Skills** — on-demand procedures (`skills/<name>/SKILL.md`), invoked as `/plugin-name:skill-name`
- **Agents** — subagent definitions (`agents/*.md`)
- **Slash commands** — (`commands/*.md`, the older flat format; new plugins should prefer skills)
- **Hooks** — lifecycle automation (`hooks/hooks.json`), same shape as [settings hooks](/guides/configuration/claude-code-hooks)
- **MCP servers** — a bundled `.mcp.json`, so installing the plugin connects its integrations
- **LSP servers** — code-intelligence config that gives Claude go-to-definition instead of text search
- Output styles, themes, and background monitors round out the list.

That composability is the point: a "Sentry debugging" plugin can ship the MCP server *and* a subagent that knows how to use it *and* the hook that triggers it — one install instead of three setup steps.

## Installing plugins

`/plugin` opens the interactive browser (Discover / Installed / Marketplaces tabs). The direct commands:

```text
/plugin install <name>@<marketplace>     # install
/plugin disable <name>                   # switch off without uninstalling
/plugin details <name>                   # see components and context cost
/plugin marketplace add <source>         # register a marketplace
```

Anthropic's official marketplace (`claude-plugins-official`) is preregistered — it carries first-party integrations (GitHub, Figma, Slack, language LSPs, and more). A marketplace is just a repo with a `marketplace.json`, so adding more is one command with a GitHub `owner/repo`, a git URL (private/SSH works), a local path, or a hosted JSON URL. Real-world examples you can try today: `/plugin install figma@claude-plugins-official` for Figma's design tools, or `/plugin marketplace add cloudflare/skills` for Cloudflare's.

Two details that matter day-to-day:

- **Namespacing.** Plugin components are prefixed — `/commit-commands:commit`, `Agent(security-plugin:auditor)` — so same-named components from different plugins never collide.
- **Scopes.** Like settings, plugins install at user scope by default; `--scope project` records them for the whole repo, so teammates get the team baseline after a one-time trust prompt.

## Building your own

A plugin is a directory; only the manifest lives in the `.claude-plugin/` folder, everything else sits at the root:

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json        # the manifest — only this goes in .claude-plugin/
├── skills/
│   └── release-notes/
│       └── SKILL.md
├── agents/
│   └── reviewer.md
├── hooks/
│   └── hooks.json
└── .mcp.json              # MCP servers to connect on install
```

The manifest needs one field; the rest is metadata and overrides:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Release tooling: changelog skill, reviewer agent, format hooks",
  "author": { "name": "Your Team" }
}
```

Three variables make bundled code portable: `${CLAUDE_PLUGIN_ROOT}` (the plugin's install directory — use it in hook commands and MCP configs), `${CLAUDE_PLUGIN_DATA}` (a persistent data directory that survives updates — caches, venvs), and `${CLAUDE_PROJECT_DIR}` (the project being worked on).

**Test locally, then publish:**

```bash
claude --plugin-dir ./my-plugin    # load it for one session
# iterate without restarting: /reload-plugins
claude plugin validate ./my-plugin # lint the manifest before shipping
```

Publishing is listing it in a marketplace: add a `marketplace.json` to any repo naming your plugins and their sources, and consumers run `/plugin marketplace add your-org/your-repo`. For a team, that repo becomes the tooling registry — update the plugin, everyone pulls the new version.

> [!TIP]
> Don't hand-write the scaffolding — the [plugin-scaffolder](/skills/workflow/plugin-scaffolder) skill generates the directory structure, manifest, and a working sample component from a description of what your plugin should do.

## When to reach for a plugin

Use the lighter mechanisms when they're enough — a single [skill](/guides/skills/writing-your-first-skill) for one procedure, a [custom agent](/guides/getting-started/writing-a-custom-agent) file for one specialist, plain [settings](/guides/configuration/claude-code-settings-permissions) for one project's config. Reach for a plugin when the value is in the **bundle** (skill + agent + hook + MCP that work together) or in **distribution** (more than one person, more than one repo, versioned updates). That's also why plugins are how vendors now ship Claude Code integrations — and why your internal platform team probably wants one.
