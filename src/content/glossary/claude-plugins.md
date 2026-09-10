---
term: "Claude Plugins"
description: "Claude Plugins are installable bundles of skills, slash commands, sub-agents, and MCP connectors that set up Claude Code or Claude Cowork for a role or team."
date: 2026-09-10
topics: ["ai-at-work"]
audience: ["developers", "founders", "marketers"]
tags: ["claude", "plugins", "cowork", "claude-code", "skills", "marketplace"]
featured: false
related: ["tool:claude-cowork", "tool:claude-code", "tool:claude", "guide:claude-knowledge-work-plugins", "guide:claude-code-plugins", "guide:what-are-claude-skills", "glossary:agent-skills", "glossary:claude-cowork", "glossary:ai-connectors", "glossary:subagent"]
summary: "Claude Plugins are installable packages that bundle skills, slash commands, sub-agents, hooks, and MCP connectors so Claude Code or Claude Cowork is configured for a job in one step. Anthropic's open-source knowledge-work-plugins repo launched with eleven role plugins and holds seventeen as of September 2026; developers add marketplaces from the CLI, and Cowork users install from Customize."
faq:
  - q: "What is the difference between a plugin and a skill?"
    a: "A skill is one procedure in a SKILL.md folder. A plugin is a package that can contain many skills plus slash commands, sub-agents, hooks, and MCP server configurations, with a plugin.json manifest. Skills inside a plugin are namespaced, for example /sales:call-prep, so two plugins can ship skills with the same name."
  - q: "Where do I install Claude plugins?"
    a: "In Claude Code, add a marketplace with claude plugin marketplace add anthropics/knowledge-work-plugins and then run claude plugin install sales@knowledge-work-plugins, or use the /plugin command. In Cowork, open the Cowork tab, then Customize, then the Plugins tab, click Browse plugins, and Install. Plugins are available on all paid plans."
  - q: "Are plugins safe to install?"
    a: "Treat them like any software. Anthropic's help center notes that plugins may include local MCP servers that run on your computer with the same permissions as any other program, and says to install only from sources you trust. Enterprise admins can restrict plugins or disable local MCP servers."
---

**Claude Plugins are installable packages that bundle skills, slash commands, sub-agents, hooks, and MCP connectors into a single unit, so that Claude Code or Claude Cowork is set up for a specific job from the first conversation instead of piece by piece.**

The format comes from Claude Code, where a plugin is a directory with a `.claude-plugin/plugin.json` manifest and optional `skills/`, `commands/`, `agents/`, `hooks/`, and `.mcp.json` at its root. Plugins are distributed through marketplaces, which are git repositories holding a catalog. Developers add one and install from it:

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install sales@knowledge-work-plugins
```

The same packages install into [Claude Cowork](/tools/claude-cowork) from the Customize menu (Plugins tab, Browse plugins, Install), and into chat on the web and desktop, though hooks and [sub-agents](/glossary/subagent) only run in Cowork. Plugins are available on all paid plans, and Anthropic hosts a directory at claude.com/plugins.

Anthropic's open-source `knowledge-work-plugins` repository (Apache-2.0) is the reference set. It launched on January 30, 2026 with eleven plugins (productivity, sales, customer support, product management, marketing, legal, finance, data, enterprise search, bio research, and plugin management) and holds seventeen Anthropic-built plugins as of September 2026, the later additions covering HR, design, engineering, operations, small business, and a PDF viewer. Each wires together [Agent Skills](/glossary/agent-skills) for the domain, slash commands for explicit actions, and [connectors](/glossary/ai-connectors) for the CRM, tracker, or warehouse the role uses. The [knowledge-work plugins guide](/guides/getting-started/claude-knowledge-work-plugins) covers choosing and installing one; the [Claude Code plugins guide](/guides/configuration/claude-code-plugins) covers building your own.
