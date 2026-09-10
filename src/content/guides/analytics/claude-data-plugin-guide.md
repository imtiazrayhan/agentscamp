---
title: "Anthropic's Data Plugin for Claude: Every Skill Explained"
description: "Every skill in Anthropic's open-source data plugin for Claude Cowork and Claude Code, the warehouse connectors it expects, the install commands, and its gaps."
seoTitle: "Anthropic's Data Plugin for Claude: Every Skill Explained"
seoDescription: "All ten skills in Anthropic's data plugin for Claude Cowork and Claude Code, its .mcp.json warehouse connectors, the real install commands, and what it omits."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "cowork", "plugins", "analytics", "skills", "sql", "dashboards"]
featured: false
keywords: ["Claude data plugin", "Anthropic data plugin", "Cowork data plugin", "knowledge-work plugins data", "data analyst plugin Claude"]
summary: "Anthropic's data plugin is an Apache-2.0 folder in the knowledge-work-plugins repo: ten SKILL.md files covering analysis, profiling, SQL, charts, dashboards, validation, statistics, and a meta-skill that builds a company-specific data skill, plus an .mcp.json of warehouse and analytics connectors. It installs from Cowork or with two claude plugin commands."
keyTakeaways:
  - "As of September 2026 the data folder holds ten skills and no commands directory, though its README still describes six commands and six skills."
  - "Six skills double as slash commands, three are reference skills marked user-invocable: false, and one meta-skill is missing from the README."
  - "data-context-extractor is the most interesting piece: it interviews you about your warehouse and generates a company-specific data skill."
  - "Cowork: Customize > Plugins > Browse plugins > Install. Claude Code: add the knowledge-work-plugins marketplace, then install data@knowledge-work-plugins."
  - "The .mcp.json ships BigQuery, Hex, Amplitude (US and EU), Atlassian, and Definite; the Snowflake and Databricks entries are placeholders with empty URLs."
  - "Everything works without a warehouse connection too: paste query results or upload a CSV or Excel file and the same skills apply."
faq:
  - q: "What is in Anthropic's data plugin for Claude?"
    a: "Ten skills as of September 2026: analyze, explore-data, write-query, create-viz, build-dashboard, validate-data, data-context-extractor, sql-queries, data-visualization, and statistical-analysis, plus an .mcp.json pre-configuring BigQuery, Hex, Amplitude, Atlassian, and Definite connectors with Snowflake and Databricks left as placeholders. It lives in the data folder of the anthropics/knowledge-work-plugins repository under the Apache 2.0 license, and its manifest reports version 1.1.0."
  - q: "How do I install the data plugin in Claude Cowork?"
    a: "Open the Cowork tab in Claude Desktop, click Customize in the left sidebar, open the Plugins tab, click Browse plugins, and press Install on data. Plugins are available on all paid plans: Pro, Max, Team, and Enterprise. Bundled connectors are set up for you, though each service still asks for authorization the first time a skill reaches for it."
  - q: "How do I install it in Claude Code?"
    a: "Two terminal commands: claude plugin marketplace add anthropics/knowledge-work-plugins, then claude plugin install data@knowledge-work-plugins. The plugin's own README still shows an older claude plugins add knowledge-work-plugins/data form that no longer matches the repository root README. Once installed, skills fire automatically and are also namespaced commands such as slash data colon write-query."
  - q: "Do I need a data warehouse connection to use it?"
    a: "No. The README is explicit that without a warehouse connection you can paste SQL results or upload CSV and Excel files, and Claude will also write queries for you to run manually and then analyze the results you bring back. A connection changes the loop from copy-paste to iterate, which matters most for exploration."
  - q: "Does it overlap with the analytics skills on this site?"
    a: "It overlaps on profiling and charts and stops short at the end. Anthropic's explore-data and data-visualization cover similar ground to our dataset-first-look and chart-chooser, with a different shape: theirs adapt to whatever you share, ours produce the same report sections every run so two months are diffable. Nothing in the plugin writes the stakeholder memo, which is where analysis-memo-writer picks up."
related: ["guide:claude-for-data-analysis", "guide:claude-knowledge-work-plugins", "guide:claude-code-for-data-analysts", "guide:check-an-ai-data-analysis", "skill:dataset-first-look", "skill:chart-chooser", "tool:claude-cowork", "glossary:claude-plugins"]
sources:
  - title: "anthropics/knowledge-work-plugins: data plugin (README, skills/, .mcp.json, CONNECTORS.md, plugin.json)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/data"
    publisher: "Anthropic"
  - title: "anthropics/knowledge-work-plugins: root README (install commands, plugin structure)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Use plugins in Claude"
    url: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude"
    publisher: "Anthropic"
---

Anthropic's data plugin is one folder inside the open-source `knowledge-work-plugins` repository: ten Markdown skills, a JSON file of connectors, and a manifest. Install it in [Claude Cowork](/tools/claude-cowork) or Claude Code and Claude gains a repeatable procedure for answering data questions, profiling a table, writing dialect-correct SQL, charting, building a self-contained dashboard, and QA-ing an analysis before it ships. This guide covers every skill, the connectors, the install commands that actually work, and where it stops.

It drills into a single plugin. The catalog of every role plugin and how the repo is organized is in [Anthropic's knowledge-work plugins, explained](/guides/getting-started/claude-knowledge-work-plugins); the term is defined in the glossary under [Claude plugins](/glossary/claude-plugins). If you are new to Claude for analysis work, start at the pillar, [Claude for data analysis](/guides/analytics/claude-for-data-analysis).

## What is actually in the folder

Read the repository tree, not the README. As of September 2026 the `data/` folder contains `.claude-plugin/plugin.json` (name `data`, version `1.1.0`), `.mcp.json`, `CONNECTORS.md`, `README.md`, `LICENSE`, and `skills/`. There is no `commands/` directory, even though the README documents six slash commands and six skills.

The commit history explains it: a March 13, 2026 commit migrated commands to skills across all plugins and a second bumped the version numbers, without rewriting the READMEs. Three skill names in the README have no matching folder at all (`data-exploration`, `data-validation`, `interactive-dashboard-builder`); the tree has `explore-data`, `validate-data`, and `build-dashboard`, which are the former command names. And `data-context-extractor`, arguably the most useful thing in the plugin, is not in the README anywhere. The last change to the folder was March 18, 2026, adding Definite as a warehouse connector and an Amplitude EU endpoint.

## Every skill

Descriptions are condensed from each `SKILL.md`'s frontmatter, which is the text Claude matches your request against. The six with an `argument-hint` are the former commands and work as slash commands; the three marked `user-invocable: false` load silently as reference material.

| Skill | What it does | Triggers when you |
|---|---|---|
| `analyze` | Answers a data question at three levels: quick lookup, full multi-dimensional analysis, or formal report with methodology and caveats | Look up a single metric, investigate what is driving a drop, compare segments over time, or prepare a stakeholder report |
| `explore-data` | Profiles a table or file: shape, column types, null rates, cardinality, distributions, and quality flags before analysis starts | Meet a new table or upload, check null rates, or decide which dimensions are worth analyzing |
| `write-query` | Writes SQL from a description, optimized for your dialect, with CTEs, window functions, joins, and performance notes | Turn a data need into SQL, build a multi-CTE query, or get dialect-specific syntax |
| `create-viz` | Generates publication-quality Python charts from query results or a DataFrame, including interactive ones | Turn a result set into a chart or need a plot for a report or deck |
| `build-dashboard` | Builds one self-contained interactive HTML file with Chart.js charts, filters, tables, and KPI cards that opens in a browser with no server | Need an executive overview, a shareable snapshot, or several filtered charts in one file |
| `validate-data` | QA pass before sharing: methodology, aggregation logic, accuracy spot-checks, bias, and a confidence assessment | Review an analysis before a presentation or check whether the conclusions are supported |
| `data-context-extractor` | Meta-skill with bootstrap and iteration modes: discovers your schemas, interviews you, and generates a company-specific data skill with reference files | Want Claude to learn your warehouse, terminology, metric definitions, and query patterns |
| `sql-queries` | Reference: dialect-by-dialect SQL patterns for Snowflake, BigQuery, Databricks, and PostgreSQL, plus performance guidance | Never invoked directly; loads whenever SQL is being written |
| `data-visualization` | Reference: a chart-selection table by data relationship, matplotlib/seaborn/plotly patterns, color and accessibility principles | Never invoked directly; loads whenever a chart is being made |
| `statistical-analysis` | Reference: descriptive statistics, trend analysis, outlier detection, hypothesis testing, and when to be cautious about a claim | Never invoked directly; loads whenever numbers are being interpreted |

Two details worth knowing before you rely on them. `statistical-analysis` insists on reporting mean and median together for business metrics, on the grounds that the gap between them is the skew, which is the sort of house rule most analyses lose. And `validate-data` is a genuine pre-share QA pass rather than a rubber stamp: the README's own example has it flagging a denominator that excludes trial users and quantifying how much that overstates a conversion rate.

## Connectors the plugin expects

Skills never name a product. They refer to tool *categories* with a `~~` placeholder (`~~data warehouse`, `~~notebook`), and whatever MCP server you have connected in that category fills the slot. `CONNECTORS.md` maps them:

| Category | Placeholder | In `.mcp.json` | Other options the file names |
|---|---|---|---|
| Data warehouse | `~~data warehouse` | Snowflake and Databricks (placeholders, empty URLs), BigQuery, Definite | Redshift, PostgreSQL, MySQL |
| Notebook | `~~notebook` | Hex | Jupyter, Deepnote, Observable |
| Product analytics | `~~product analytics` | Amplitude (US and EU endpoints) | Mixpanel, Heap |
| Project tracker | `~~project tracker` | Atlassian (Jira and Confluence) | Linear, Asana |

Note what that table implies: the two warehouses most likely to be yours, Snowflake and Databricks, ship as named entries with empty URLs, so you supply the endpoint. If your Postgres is the warehouse, the plugin's own list points at PostgreSQL as a valid option and the [Postgres MCP](/tools/postgres-mcp) route is covered in [Text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude), including the read-only role you should be connecting with.

## Installing in Cowork

Plugins are available on all paid plans (Pro, Max, Team, and Enterprise). In Claude Desktop, open the **Cowork** tab, click **Customize** in the left sidebar, open the **Plugins** tab, click **Browse plugins**, and press **Install** on data. Bundled connectors are set up for you, though each service still asks for authorization the first time a skill reaches for it. Type `/` in the composer to see the invocable skills.

## Installing in Claude Code

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install data@knowledge-work-plugins
```

Inside a session, `/plugin marketplace add` and `/plugin install` do the same. Skills then fire automatically when a request matches and are also namespaced commands: `/data:write-query`, `/data:explore-data`, `/data:validate-data`. The plugin's README still shows an older `claude plugins add knowledge-work-plugins/data` form; use the two commands above, which match the repository root README. New to the terminal? [Installing Claude Code](/guides/getting-started/installing-claude-code) is the ten-minute setup, and [Claude Code plugins](/guides/configuration/claude-code-plugins) covers the format in depth.

## How the AgentsCamp skills fit alongside it

The plugin is strong in the middle of the workflow and thin at both ends.

- **[dataset-first-look](/skills/analytics/dataset-first-look)** and Anthropic's `explore-data` do the same job differently. Theirs adapts to whatever you share; ours emits the same sections every run, so August's profile and September's can be diffed and a drifting null rate is visible.
- **[chart-chooser](/skills/analytics/chart-chooser)** picks the chart form from the question and needs no Python. `create-viz` and `data-visualization` assume you are generating code, which is the wrong shape when the chart is going into a slide.
- **[analysis-memo-writer](/skills/analytics/analysis-memo-writer)** covers ground the plugin does not reach: `validate-data` ends at a confidence assessment, and the memo a stakeholder actually reads is still unwritten.

One piece of the plugin is worth borrowing regardless of what else you use: `data-context-extractor` writes down the tribal knowledge that makes every later answer better. That is the same asset the metric-definitions file in [Claude Code for data analysts](/guides/analytics/claude-code-for-data-analysts) builds by hand. Whatever produces it, everything downstream still needs the review pass in [How to check an AI data analysis](/guides/analytics/check-an-ai-data-analysis).
