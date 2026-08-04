---
title: "Packaging and Sharing Claude Code Skills"
description: "Take a skill from your personal ~/.claude folder to a versioned plugin your whole team installs from a marketplace — portably and with governance."
author: "AgentsCamp"
date: 2026-06-20
color: "blue"
topics: ["workflow-prompting"]
tags: ["skills", "plugins", "marketplace", "distribution", "teams"]
featured: false
summary: "A personal skill in ~/.claude only helps you. To share it, commit it to a repo's .claude/skills/ for one project, or bundle it into a plugin and list that plugin in a marketplace.json so any team can install it with /plugin install. Keep skills portable with relative paths and ${CLAUDE_PLUGIN_ROOT}, pin versions per release, and review skills before trusting them — they can grant tool access."
keyTakeaways:
  - "Personal skills (~/.claude/skills/) help only you; project skills (.claude/skills/, committed) help one repo; plugins distributed via a marketplace help any team that installs them."
  - "A plugin is a directory with .claude-plugin/plugin.json that bundles skills, agents, hooks, and MCP servers into one versioned, installable unit."
  - "A marketplace is just a repo with .claude-plugin/marketplace.json listing plugins; users add it with /plugin marketplace add owner/repo and install with /plugin install name@marketplace."
  - "Portability rules: never hardcode absolute paths, reference bundled files with ${CLAUDE_SKILL_DIR} or ${CLAUDE_PLUGIN_ROOT}, and never point outside the plugin directory — installs copy to a cache."
  - "Set a version in plugin.json and bump it per release so users get controlled updates; omit it and every git commit becomes a new version."
  - "Skills can grant tool access via allowed-tools, so review and pin (commit SHA) any skill before a team trusts it."
howtoSteps:
  - name: "Decide the distribution scope"
    text: "If only you need the skill, leave it in ~/.claude/skills/. If one repo's collaborators need it, commit it to that repo's .claude/skills/. If multiple teams or repos need it, bundle it into a plugin and distribute through a marketplace."
  - name: "Make the skill portable first"
    text: "Before sharing, strip machine-specific assumptions: no absolute paths, no '~/my-stuff' references, no '../shared' that points outside the skill folder. Reference bundled scripts with ${CLAUDE_SKILL_DIR}/scripts/foo.py so they resolve at personal, project, or plugin level."
  - name: "Bundle the skill into a plugin"
    text: "Create a plugin directory with .claude-plugin/plugin.json (name, description, version) and a skills/ folder holding your skill directory. The plugin can also carry agents/, hooks, and MCP config — one versioned unit."
  - name: "Write the marketplace catalog"
    text: "In a repo, add .claude-plugin/marketplace.json with name, owner, and a plugins array. Each entry needs a name and a source (a relative ./path, a github repo, a git URL, git-subdir, or npm). Set version to pin releases."
  - name: "Host and share"
    text: "Push the marketplace repo to GitHub or any git host. Teammates run /plugin marketplace add owner/repo, then /plugin install plugin-name@marketplace-name, then /reload-plugins. For zero-touch onboarding, add extraKnownMarketplaces and enabledPlugins to the repo's .claude/settings.json."
  - name: "Version, update, and govern"
    text: "Bump version per release and push; users get it via /plugin marketplace update or auto-update. Pin third-party plugins to a commit SHA, review allowed-tools before trusting, and use managed settings to control which marketplaces an org may add."
faq:
  - q: "What's the difference between a project skill and a plugin?"
    a: "A project skill is a SKILL.md committed to one repo's .claude/skills/ — it's shared with anyone who clones that repo, and nowhere else. A plugin is a packaged, versioned bundle (skills plus optional agents, hooks, and MCP servers) that any team can install into any project from a marketplace. Reach for a project skill when the recipe is repo-specific; reach for a plugin when the same capability should travel across repos and teams."
  - q: "How do I share a skill with my whole team?"
    a: "Two paths. For one repository, commit the skill to .claude/skills/ and it ships with the repo. For reuse across many repos, bundle it into a plugin, list that plugin in a marketplace.json hosted on GitHub, and have teammates run /plugin marketplace add owner/repo then /plugin install name@marketplace. You can pre-wire the marketplace and plugin in the repo's .claude/settings.json so collaborators are prompted to install on trust."
  - q: "How does versioning work for plugins?"
    a: "Set a version field in the plugin's .claude-plugin/plugin.json (or in the marketplace entry). When set, the plugin is pinned to that string and users only receive updates when you bump it. If you omit version on a git-hosted marketplace, every commit counts as a new version. Users refresh with /plugin marketplace update, and official marketplaces auto-update by default."
  - q: "Why does my plugin skill break after I share it?"
    a: "Almost always a portability problem. Installs copy the plugin into a cache (~/.claude/plugins/cache), so any path that points outside the plugin directory — an absolute path, a ~/ reference, or ../shared-utils — won't exist on the other machine. Reference bundled files with ${CLAUDE_SKILL_DIR} or ${CLAUDE_PLUGIN_ROOT} and keep everything inside the plugin folder."
  - q: "Is it safe to install a team or third-party skill?"
    a: "Treat it like running someone else's code, because it is. Skills can declare allowed-tools that pre-approve tool use, and plugins can ship hooks and MCP servers that execute on your machine. Review project skills before accepting a repo's trust dialog, pin third-party plugins to a specific commit SHA, and let admins restrict which marketplaces the org can add via managed settings."
related: ["guide:what-are-claude-skills", "guide:how-to-install-claude-skills", "guide:writing-your-first-skill", "guide:claude-code-skills-best-practices", "guide:skills-vs-agents-vs-commands", "guide:claude-md-best-practices", "guide:testing-and-debugging-skills"]
---

You wrote a skill, it works great, and now someone else wants it. The problem: a skill in your `~/.claude/skills/` folder lives on exactly one laptop — yours. Sharing it isn't a copy-paste job. Claude Code gives you three real distribution scopes, and picking the right one is the whole game: **commit it to a repo for one project, or bundle it into a plugin and publish that plugin through a marketplace for the whole team.**

This guide takes a personal skill all the way to a versioned, installable, governed team artifact. The mechanics below are current as of June 2026; the plugin and marketplace system moves fast, so check [the official docs](https://code.claude.com/docs/en/plugin-marketplaces) for the newest fields. If you haven't built a skill yet, start with [Writing Your First Skill](/guides/skills/writing-your-first-skill).

## The three places a skill can live

Where a skill lives decides who can use it. There are four levels, but for sharing you care about three:

| Location | Path | Who gets it |
| :--- | :--- | :--- |
| Personal | `~/.claude/skills/<name>/SKILL.md` | Only you, across all your projects |
| Project | `.claude/skills/<name>/SKILL.md` (committed) | Everyone who clones the repo |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Anyone who installs the plugin |

The decision tree is short. If the skill encodes how *this one repo* does something — its deploy steps, its migration conventions — **commit it to that repo's `.claude/skills/` and you're done.** Anyone who clones the repo gets it for free. If the skill is a capability you want across many repos or across a team — a house code-review pass, a changelog generator, a security checklist — that's a plugin.

A plugin isn't just one more skill folder. It's a *bundle*: one versioned unit that can carry several skills plus agents, hooks, and MCP server configs, installed and updated together. That bundling and versioning is exactly what makes a plugin the right vehicle for cross-team distribution.

## Make the skill portable before you share it

This is the step people skip, and it's why shared skills break. A skill that works on your machine often quietly depends on your machine. Before it travels, scrub three things:

- **No absolute paths.** `/Users/you/scripts/lint.sh` doesn't exist on anyone else's box.
- **No `~/` or home-relative references** to files outside the skill folder.
- **No `../` that escapes the skill or plugin directory.** When a plugin is installed, Claude Code copies it into a cache (`~/.claude/plugins/cache`). Anything outside the plugin folder simply isn't copied, so `../shared-utils` resolves to nothing.

The fix is to keep every supporting file *inside* the skill or plugin and reference it with a variable. Use `${CLAUDE_SKILL_DIR}` to point at the skill's own directory regardless of where it's installed:

```yaml
---
name: codebase-visualizer
description: Generate an interactive tree view of the repo. Use when exploring a new codebase.
allowed-tools: Bash(python3 *)
---

Run the bundled script from the project root:

```bash
python3 ${CLAUDE_SKILL_DIR}/scripts/visualize.py .
```
```

That same skill now resolves correctly whether it's installed personally, committed to a project, or shipped inside a plugin. For files referenced from a plugin's `hooks` or `mcpServers` config, use `${CLAUDE_PLUGIN_ROOT}` instead — it points at the plugin's installed root. **Portability is just discipline about paths.**

## Bundle the skill into a plugin

A plugin is a directory with a manifest and a `skills/` folder. The minimum:

```
my-team-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── quality-review/
        └── SKILL.md
```

The manifest at `.claude-plugin/plugin.json` is small:

```json
{
  "name": "my-team-plugin",
  "description": "Team code-review and changelog skills",
  "version": "1.0.0"
}
```

By default a plugin's skills load from its `skills/` directory, so just dropping skill folders in there is enough. The `version` field matters more than it looks: set it, and users only receive updates when you bump it. Omit it on a git-hosted plugin and every commit becomes a new version — convenient for fast iteration, dangerous for a team that wants stable releases. Plugin skills are namespaced, so `quality-review` inside `my-team-plugin` is invoked as `/my-team-plugin:quality-review` and can never collide with someone's personal skill of the same name.

## Distribute it through a marketplace

A marketplace sounds heavyweight; it's just a git repo with a catalog file. Create `.claude-plugin/marketplace.json` at the repo root:

```json
{
  "name": "acme-tools",
  "owner": {
    "name": "DevTools Team",
    "email": "devtools@example.com"
  },
  "plugins": [
    {
      "name": "my-team-plugin",
      "source": "./plugins/my-team-plugin",
      "description": "Team code-review and changelog skills",
      "version": "1.0.0"
    }
  ]
}
```

Each plugin entry needs a `name` and a `source`. The source can be a relative `./path` inside the same repo, a `github` repo, a git `url` (GitLab, Bitbucket, self-hosted), a `git-subdir` for a plugin living inside a monorepo, or an `npm` package. Relative paths resolve from the marketplace root (the directory containing `.claude-plugin/`), and they only work when teammates add the marketplace via git — not via a raw URL to the JSON file.

Push the repo to GitHub, and your team installs in three commands:

```shell
/plugin marketplace add acme/claude-plugins
/plugin install my-team-plugin@acme-tools
/reload-plugins
```

The first registers the catalog, the second installs the plugin (user scope by default; choose project or local scope in the interactive `/plugin` UI), and `/reload-plugins` activates it without a restart. Before installing, the `/plugin` detail pane shows what the plugin will add — its skills, agents, hooks, and MCP servers — and an estimated context cost, so nobody installs blind.

### Zero-touch onboarding for a repo

For a team repo, you don't want every collaborator running install commands by hand. Wire it into the project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": { "source": "github", "repo": "acme/claude-plugins" }
    }
  }
}
```

When teammates trust the repository folder, Claude Code prompts them to add the marketplace and install the listed plugins. New hire clones the repo, accepts the trust dialog, and has the team's skills.

## Versioning and updating

Treat plugins like any other dependency: **pin and bump deliberately.** Set `version` in `plugin.json` (or in the marketplace entry) following semantic versioning, and increment it on every release. Users pull updates with `/plugin marketplace update acme-tools`, and official Anthropic marketplaces auto-update by default — third-party and local ones don't, by design. After any update, a `/reload-plugins` applies the change in-session.

For the community marketplace and other public sources, prefer pinning a plugin to an exact commit `sha` in the marketplace entry. A SHA is immutable: the install succeeds even if the upstream branch or tag later moves or disappears, and nobody gets a surprise change because someone force-pushed `main`.

## Review and governance for team skills

Here's the part that's easy to wave away and shouldn't be: **a skill is executable trust.** A skill's `allowed-tools` field pre-approves tools so Claude can use them without prompting while the skill is active. A plugin can also ship hooks that run shell commands and MCP servers that execute on your machine, all with your user privileges. Installing a plugin or trusting a repo with project skills is, functionally, agreeing to run someone else's code.

Practical governance for a team:

- **Review before trust.** For project skills, read the `allowed-tools` and any bundled scripts before accepting the workspace trust dialog. A skill can quietly grant itself broad `Bash(*)` access.
- **Pin third-party plugins to a commit SHA** so a vetted version is what actually runs, not whatever HEAD became.
- **Use code review for your own marketplace.** The marketplace is a git repo — gate changes to it behind PR review like any other shared infrastructure, so a skill that grants new tool access gets a human look.
- **Restrict marketplaces org-wide.** Admins can use managed settings to control which marketplaces users may add and to push approved ones automatically, keeping installs inside a trusted catalog.

The same conciseness and authoring discipline you'd apply to a single skill still applies once it's shared — see [Claude Code Skills Best Practices](/guides/skills/claude-code-skills-best-practices) and keep procedures out of [CLAUDE.md](/guides/configuration/claude-md-best-practices). And before you publish a skill to a team, prove it actually fires and produces what you expect with [Testing and Debugging Skills](/guides/skills/testing-and-debugging-skills) — a broken skill is worse shared than kept to yourself. If you're still deciding whether the capability should even be a skill, a plugin, an agent, or a command, read [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands) first.
