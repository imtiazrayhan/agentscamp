---
title: "Anthropic's Knowledge-Work Plugins: Every Role Plugin, Explained"
description: "Every Anthropic knowledge-work plugin for Claude Cowork and Claude Code cataloged: what each role plugin bundles, the install commands, and how to fork one."
seoTitle: "Anthropic Knowledge-Work Plugins: Every Role Plugin Explained"
seoDescription: "Every Anthropic knowledge-work plugin for Claude Cowork and Claude Code cataloged: skills and connectors per role, exact install commands, and how to fork one."
author: "Imtiaz Rayhan"
date: 2026-09-10
freshness: "tier1"
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["developers", "founders", "marketers"]
tags: ["claude", "cowork", "plugins", "knowledge-work", "skills", "connectors"]
featured: false
keywords: ["knowledge-work plugins", "Claude Cowork plugins", "Anthropic plugins GitHub", "sales plugin Claude", "finance plugin Claude"]
summary: "Anthropic's knowledge-work-plugins repository is a set of Apache-2.0 role plugins (sales, finance, legal, marketing, HR, design, engineering, operations, data, support, and more), each a folder of Markdown skills plus a JSON list of connectors. They install from Cowork's Customize menu or with two claude plugin commands, and are meant to be forked."
keyTakeaways:
  - "Seventeen Anthropic-built plugins live in the repo as of September 2026, plus five partner-built ones and dozens of third-party entries in its marketplace.json."
  - "Each plugin is skills plus connectors: SKILL.md files Claude loads automatically (they double as /plugin:skill commands) and an .mcp.json of MCP servers."
  - "Cowork installs from Customize > Plugins. Claude Code: claude plugin marketplace add anthropics/knowledge-work-plugins, then claude plugin install <name>."
  - "Plugins are tool-agnostic: skills reference categories like ~~CRM and ~~chat, and whatever you connect in that category fills the slot."
  - "The intended workflow is to fork: swap connectors in .mcp.json, add company terminology to skill files, rewrite steps to match how your team works."
  - "This is the non-developer side of plugins. For manifests, hooks, LSP servers, and building a marketplace, read the Claude Code plugins guide instead."
faq:
  - q: "What are Anthropic's knowledge-work plugins?"
    a: "An open-source GitHub repository, anthropics/knowledge-work-plugins, of role plugins for Claude Cowork that also load in Claude Code. Each plugin bundles skills (Markdown procedures Claude uses automatically), pre-configured connectors to the tools that role depends on, and in some cases explicit slash commands. Anthropic open-sourced the first eleven on January 30, 2026 and added HR, design, engineering, and operations on February 24, 2026."
  - q: "How do I install a knowledge-work plugin in Cowork?"
    a: "Open the Customize menu in the left sidebar of Claude Desktop or claude.ai, choose Plugins, click Browse plugins, and press Install. The Knowledge Work marketplace is registered by default. Plugins are available on all paid plans, and any connectors the plugin bundles are set up for you, though you still authorize each service."
  - q: "How do I install one in Claude Code?"
    a: "Two terminal commands: claude plugin marketplace add anthropics/knowledge-work-plugins, then claude plugin install sales@knowledge-work-plugins (swap sales for the plugin you want). Inside a session, the same works as /plugin marketplace add and /plugin install. Skills then fire automatically and are available as namespaced commands such as /sales:call-prep."
  - q: "Can I customize or fork them for my company?"
    a: "Yes, that is the intended use. The repo is Apache-2.0 licensed. Copy a plugin folder, edit .mcp.json to point at your tools, add your terminology and processes to the SKILL.md files, and load it with claude --plugin-dir or upload it as a custom plugin in Cowork. The cowork-plugin-management plugin walks you through this from inside Cowork."
  - q: "What is the difference between these and Claude Code plugins?"
    a: "Same format, different audience. Claude Code plugins are the general mechanism for bundling skills, agents, hooks, MCP servers, and LSP config, mostly for developer workflows. The knowledge-work plugins are Anthropic's role-specific instances of that format, built for Cowork and aimed at sales, finance, legal, marketing, and similar teams."
related: ["guide:claude-cowork-guide", "guide:claude-plans-compared-2026", "guide:claude-code-plugins", "guide:what-are-claude-skills", "tool:claude-cowork", "tool:claude-code", "glossary:claude-plugins", "glossary:ai-connectors", "glossary:agent-skills"]
sources:
  - title: "anthropics/knowledge-work-plugins (README, marketplace.json, plugin directories)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Customize Cowork with plugins"
    url: "https://claude.com/blog/cowork-plugins"
    publisher: "Anthropic"
  - title: "Cowork and plugins for teams across the enterprise"
    url: "https://claude.com/blog/cowork-plugins-across-enterprise"
    publisher: "Anthropic"
  - title: "Cowork and plugins for finance"
    url: "https://claude.com/blog/cowork-plugins-finance"
    publisher: "Anthropic"
  - title: "Use plugins in Claude"
    url: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude"
    publisher: "Anthropic"
  - title: "Use Claude Cowork on Team and Enterprise plans"
    url: "https://support.claude.com/en/articles/13455879-use-claude-cowork-on-team-and-enterprise-plans"
    publisher: "Anthropic"
  - title: "Create plugins (Claude Code docs)"
    url: "https://code.claude.com/docs/en/plugins"
    publisher: "Anthropic"
---

Anthropic's `knowledge-work-plugins` repository is a set of open-source, Apache-2.0 licensed plugins that turn Claude into a specialist for a job: sales, finance, legal, marketing, HR, design, engineering, and more. Each one is a folder of Markdown skills plus a JSON file of connector definitions, built for [Claude Cowork](/tools/claude-cowork) and also loadable in [Claude Code](/tools/claude-code). This guide catalogs every Anthropic-built plugin in the repo as of September 2026, gives the exact install commands, and shows how to fork one for your team.

It is deliberately *not* the developer guide. For the plugin format itself (manifests, hooks, LSP servers, marketplaces) read [Claude Code Plugins: Install, Use, and Build Your Own](/guides/configuration/claude-code-plugins). This page is about the role plugins Anthropic ships; the glossary entry on [Claude plugins](/glossary/claude-plugins) covers the term.

## Where they came from

- **January 30, 2026**: Anthropic added plugins to Cowork as a research preview for all paid users and open-sourced eleven plugins its own teams use: productivity, enterprise search, plugin management, sales, finance, data, legal, marketing, customer support, product management, and biology research.
- **February 24, 2026**: HR, design, engineering, and operations joined the repo, along with partner-built plugins (Slack by Salesforce, Apollo, Common Room, and a brand-voice plugin by Tribe AI) and admin controls for Team and Enterprise. Financial-analysis, investment-banking, equity-research, private-equity, and wealth-management plugins shipped the same day but live in a separate `anthropics/financial-services` repository.
- **September 2026**: the repo's `marketplace.json` lists 99 entries. Seventeen are Anthropic-built and live in the repo, five partner plugins sit in `partner-built/`, and the rest are third-party plugins pulled from their own GitHub repositories (Zapier, Figma, Canva, Datadog, Box, Dropbox, Airtable, monday.com, and others).

## Every Anthropic-built plugin

Counts come from the repository tree at commit `34e1eae` (September 8, 2026). "Skills" are the `SKILL.md` folders each plugin ships; connectors are the MCP servers pre-configured in its `.mcp.json`.

| Plugin | What it is for | Skills and commands | Connectors pre-configured |
|---|---|---|---|
| `productivity` | Tasks, calendar, daily planning, personal memory | 4: `start`, `task-management`, `memory-management`, `update` | Slack, Notion, Asana, Linear, Atlassian, Monday, ClickUp, Google Calendar, Gmail |
| `sales` | Prospecting, call prep, pipeline, outreach, forecasts | 9, incl. `call-prep`, `pipeline-review`, `forecast`, `draft-outreach`, `account-research` | Slack, HubSpot, Close, Monday, Clay, ZoomInfo, Notion, Atlassian, Fireflies, Apollo, Outreach, Google Calendar, Gmail, Similarweb |
| `customer-support` | Ticket triage, responses, escalations, KB articles | 5: `ticket-triage`, `draft-response`, `customer-escalation`, `customer-research`, `kb-article` | Slack, Intercom, HubSpot, Guru, Atlassian, Notion, Google Calendar, Gmail |
| `product-management` | Specs, roadmaps, research synthesis, stakeholder updates | 8 skills incl. `write-spec`, `roadmap-update`, `sprint-planning`, plus one command, `brainstorm` | Slack, Linear, Asana, Monday, ClickUp, Atlassian, Notion, Figma, Amplitude, Pendo, Intercom, Fireflies, Google Calendar, Gmail, Similarweb |
| `marketing` | Content, campaigns, brand voice, SEO, performance reports | 8, incl. `campaign-plan`, `brand-review`, `seo-audit`, `email-sequence`, `performance-report` | Slack, Canva, Figma, HubSpot, Amplitude, Notion, Ahrefs, Similarweb, Klaviyo, Supermetrics, Google Calendar, Gmail |
| `legal` | Contract review, NDA triage, compliance, risk | 9, incl. `review-contract`, `triage-nda`, `compliance-check`, `signature-request`, `vendor-check` | Slack, Box, Egnyte, Atlassian, Docusign, Google Calendar, Gmail |
| `finance` | Journal entries, reconciliation, statements, close, audit | 8, incl. `journal-entry`, `reconciliation`, `financial-statements`, `variance-analysis`, `sox-testing` | Snowflake, Databricks, BigQuery, Slack, Google Calendar, Gmail |
| `data` | SQL, exploration, visualization, dashboards, validation | 10, incl. `write-query`, `explore-data`, `build-dashboard`, `statistical-analysis`, `validate-data` | Snowflake, Databricks, BigQuery, Hex, Amplitude, Atlassian, Definite |
| `enterprise-search` | One query across chat, docs, wikis, email | 5: `search`, `search-strategy`, `digest`, `knowledge-synthesis`, `source-management` | Slack, Notion, Guru, Atlassian, Asana, Google Calendar, Gmail |
| `bio-research` | Literature search, genomics QC, target prioritization | 6, incl. `single-cell-rna-qc`, `scvi-tools`, `nextflow-development`, `scientific-problem-selection` | PubMed, BioRender, bioRxiv, Consensus, ClinicalTrials.gov, ChEMBL, Synapse, Wiley, Owkin, Open Targets, Benchling |
| `engineering` | Standups, code review, architecture, incidents, tech debt | 10, incl. `code-review`, `incident-response`, `deploy-checklist`, `system-design`, `testing-strategy` | Slack, Linear, Asana, Atlassian, Notion, GitHub, PagerDuty, Datadog, Google Calendar, Gmail |
| `human-resources` | Recruiting, onboarding, reviews, compensation, policy | 9, incl. `recruiting-pipeline`, `draft-offer`, `performance-review`, `comp-analysis`, `policy-lookup` | Slack, Google Calendar, Gmail, Notion, Atlassian |
| `design` | Critique, design systems, UX copy, accessibility, research | 7: `design-critique`, `design-system`, `design-handoff`, `ux-copy`, `accessibility-review`, `user-research`, `research-synthesis` | Slack, Figma, Linear, Asana, Atlassian, Notion, Intercom, Google Calendar, Gmail |
| `operations` | Vendors, process docs, change requests, capacity, risk | 9, incl. `process-doc`, `runbook`, `vendor-review`, `capacity-plan`, `status-report` | Slack, Google Calendar, Gmail, Notion, Atlassian, Asana |
| `small-business` | Payroll planning, month-end close, weekly briefs, campaigns | 31, incl. `monday-brief`, `friday-brief`, `invoice-chase`, `close-month`, `plan-payroll`, `tax-prep` | QuickBooks, PayPal, HubSpot, Canva, Docusign, Slack, Stripe, Square, Gmail, Google Calendar, Google Drive |
| `pdf-viewer` | View, annotate, fill, and sign PDFs in a live viewer | 1 skill, `view-pdf`, plus 4 commands: `open`, `annotate`, `fill-form`, `sign` | A bundled PDF MCP server |
| `cowork-plugin-management` | Create or customize plugins for your organization | 2: `create-cowork-plugin`, `cowork-plugin-customizer` | None |

Two things stand out. First, the plugins are heavy on **skills** and light on everything else: only `product-management` and `pdf-viewer` ship a `commands/` folder, and no Anthropic-built plugin ships an `agents/` folder even though the README mentions sub-agents (the partner-built brand-voice plugin does). Skills double as slash commands (`/sales:call-prep`, `/data:write-query`), so nothing is lost. Second, the connector lists are long because plugins are **tool-agnostic**: each `CONNECTORS.md` explains that skills reference categories like `~~CRM` or `~~chat`, and whatever you connect in that category fills the slot.

## What skills, connectors, and commands mean here

If you have read [What Are Claude Skills?](/guides/skills/what-are-claude-skills), the pieces are familiar; if not, here is the short version.

- A **skill** is a `SKILL.md` file whose description tells Claude when to use it. Claude loads it when a task matches, or you invoke it by name. The sales plugin's `call-prep` triggers on "prep me for my call with [company]" and "works standalone with user input and web research, supercharged when you connect your CRM." See [agent skills](/glossary/agent-skills).
- A **connector** is an entry in the plugin's `.mcp.json`: an MCP server for HubSpot, Snowflake, Gmail, and so on, over the [Model Context Protocol](/glossary/model-context-protocol). Installing the plugin pre-configures them; you still authorize each one. [AI connectors](/glossary/ai-connectors) covers the concept.
- A **command** is a Markdown file in `commands/` that you run explicitly. Newer plugins put everything in `skills/` instead, which the Claude Code docs now recommend.

Everything is Markdown and JSON; there is no code to compile, which is why non-developers can fork these.

## Installing in Cowork

The Knowledge Work marketplace is registered in Cowork by default. Open the **Customize** menu in the left sidebar, choose **Plugins**, click **Browse plugins**, and press **Install** on the one you want. Plugins are available on all paid plans (Pro, Max, Team, Enterprise); which plan you need for Cowork itself is covered in [Claude plans compared](/guides/getting-started/claude-plans-compared-2026). You can also install in chat on the web and in the Chat tab of Claude Desktop, but hooks and sub-agents run only in Cowork and appear grayed out elsewhere. A plugin's bundled connectors are set up for you "without you connecting each one."

On Team and Enterprise, owners can mark each plugin *Installed by default*, *Available*, *Required*, or *Not available*, run an organization-specific marketplace, and (in private beta) use private GitHub repositories as plugin sources. Members cannot remove required plugins.

## Installing in Claude Code

From a terminal, two commands:

```bash
# register the marketplace once
claude plugin marketplace add anthropics/knowledge-work-plugins

# install a plugin from it
claude plugin install sales@knowledge-work-plugins
```

Inside a session the equivalents are `/plugin marketplace add anthropics/knowledge-work-plugins` and `/plugin install sales@knowledge-work-plugins`. Once installed, skills fire automatically and are also available as namespaced slash commands, `/sales:call-prep` and the like. If you have never used the terminal tool, [Installing Claude Code](/guides/getting-started/installing-claude-code) is the ten-minute setup.

> [!NOTE]
> Some individual plugin READMEs still show an older form, `claude plugins add knowledge-work-plugins/sales`. Use the two-command form above; it matches the root README and the Claude Code plugin docs.

In Claude Code the `.mcp.json` servers are ordinary MCP configs: you authorize each one the first time it starts, and warehouse connectors such as Snowflake need credentials your admin controls.

## Forking and customizing

The README is candid that "these plugins are generic starting points." The intended path:

1. **Copy the plugin folder.** It is four things: `.claude-plugin/plugin.json`, `.mcp.json`, `skills/`, and a `CONNECTORS.md`.
2. **Swap connectors.** Edit `.mcp.json` to point at your stack. If your CRM is Salesforce rather than HubSpot, that is one entry.
3. **Add company context.** Put your terminology, org chart, pricing tiers, and house style into the relevant `SKILL.md` files. This is where most of the value comes from.
4. **Adjust workflows.** Rewrite a skill's steps to match how your team actually does the thing, "not how a textbook says to."
5. **Test it.** In Claude Code, `claude --plugin-dir ./my-sales` loads the folder for one session; in Cowork, upload it as a custom plugin from the same Plugins tab, or add your repository with **Add from a repository**.
6. **Ship it.** Contributions go back to Anthropic as a pull request; internal versions go into your own marketplace repository.

The `cowork-plugin-management` plugin automates steps 1 to 4 from inside Cowork: its two skills interview you about your tools and generate or modify a plugin folder.

## Licensing

The repository is licensed under the **Apache License 2.0**, so you can modify and redistribute the plugins, including inside a company, with the license notice intact. Partner-built plugins carry their own `LICENSE` files, and third-party marketplace entries live in their own repositories; check each before redistributing.

## Which plugin to start with

Pick the plugin that matches your title, install it, and run one skill on real work before customizing anything. The [Start here](/for) page maps roles to workflows, and [What Is Claude Cowork?](/guides/getting-started/claude-cowork-guide) walks through a first task. Skills you write for a plugin also upload directly to claude.ai; see [Claude skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
