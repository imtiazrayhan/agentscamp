---
name: "Hex"
description: "A collaborative notebook and data-app platform whose AI agents write SQL and Python, answer questions in Threads, and run on curated workspace context."
seoDescription: "Hex for analysts: the Notebook Agent (formerly Hex Magic), Threads, Context Studio, semantic model sync, and plan prices as of September 2026."
date: 2026-09-10
url: "https://hex.tech"
pricing: "freemium"
category: "analytics"
color: "purple"
os: ["Web"]
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["notebooks", "data-apps", "sql", "python", "semantic-layer", "analysts"]
featured: false
alternativeTo: ["deepnote", "databricks-genie"]
sameAs: ["https://learn.hex.tech"]
related: ["guide:claude-for-data-analysis", "guide:best-ai-tools-for-data-analysts-2026", "tool:deepnote", "tool:julius", "tool:databricks-genie", "glossary:semantic-layer"]
keywords: ["Hex", "Hex Notebook Agent", "Hex Magic", "data notebook", "Hex pricing"]
summary: "Hex is a multiplayer data workspace where SQL, Python, and no-code cells live in one notebook that publishes as an app. Its AI layer, formerly called Hex Magic, is now a set of named agents: the Notebook Agent writes and edits cells, Threads answers questions conversationally, and Context Studio curates the semantic models and rules those agents work from."
faq:
  - q: "What is Hex used for?"
    a: "Hex is a collaborative data workspace. You build an analysis in a notebook that mixes SQL, Python, and no-code cells, then publish the same project as an interactive app or dashboard for people who will never open the notebook. Teams use it for exploratory analysis, operational reporting, and self-serve internal tools."
  - q: "Was Hex Magic renamed?"
    a: "Yes. Hex's documentation states that its AI features were formerly referred to as Hex Magic in product. They are now split into named agents: the Notebook Agent for writing and editing cells, Threads for conversational questions, Chat With App Agent, Modeling Agent, Generative Apps in beta, and Context Studio for governing what those agents know."
  - q: "Does Hex support a semantic layer?"
    a: "Yes, and it treats semantic models as one context source among several. Context Studio syncs semantic models from dbt MetricFlow, Cube, and Snowflake Semantic Views, and can also pull context from Git repositories, Notion, Linear, and any MCP server. Hex is explicit that semantic models are optional where an endorsed table or a written guide is enough."
  - q: "How much does Hex cost?"
    a: "As of September 2026 Hex lists a free Community plan, Professional at 36 dollars per Editor per month, Team at 75 dollars per Editor per month, and custom Enterprise pricing. The Community plan includes a Hex agent trial; the paid plans add agent credits, published apps, version history, and larger compute."
---

Hex is a data workspace built around one idea: the notebook you explore in and the app your stakeholders read should be the same object. You write SQL, Python, and no-code cells in a multiplayer notebook, then publish it as an interactive app without rebuilding anything. For analysts, that removes the usual second job of porting a finished analysis into a BI tool.

The AI layer has been renamed and split up. Hex's documentation says its AI features "were formerly referred to as Hex Magic in product"; today they are distinct, named agents with different jobs and different audiences.

## Highlights

- **Notebook Agent.** A natural-language assistant that generates and edits Python, SQL, Markdown, Pivot, and Chart cells with your project context and warehouse schema in view, and understands the upstream and downstream dependencies in a flow well enough to debug it.
- **Threads.** Conversational analytics for people who will never open the notebook, grounded in curated, semantically modeled data. Hex surfaces it where the questions already get asked, including Slack and coding agents.
- **Context Studio.** The control plane for what the agents know: semantic models, workspace rules, endorsed tables, AI guides, and interaction-level observability so you can see which context produced which answer.
- **Semantic model sync, not lock-in.** Context Studio syncs semantic models from dbt MetricFlow, Cube, and Snowflake Semantic Views, and also draws on Git repositories, Notion, Linear, and any MCP server. Hex's own position is that semantic models are "inherently rigid and time intensive to maintain," so build them where a locked definition matters and skip them elsewhere.
- **More agents around the edges.** A Modeling Agent helps build and refine semantic models, Chat With App Agent lets app consumers interrogate a published project, and Generative Apps (beta) builds an app from a description.
- **Hex CLI.** If you would rather drive the work from Claude Code or Cursor, the CLI lets you bring your own agent instead of using Hex's.

## In an analyst's workflow

The pattern that pays off is doing the context work once, then letting Threads absorb the repeat questions. Endorse the tables that are safe, write a guide for the metric everyone gets wrong, and only build a semantic model where a definition has to be locked:

```text
# In the notebook, with the Notebook Agent:
Build a weekly cohort retention view from fct_subscription_events.
Use the endorsed `dim_accounts` table for plan tier. Show the SQL cell
and a chart cell, and explain which joins could double-count.
```

Then publish it as an app, and point the people who used to ask you for it at Threads. The [text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude) guide covers the same grounding problem when you are assembling the context yourself rather than in a vendor's studio.

> [!NOTE]
> Hashboard has joined Hex, and Hex has published a migration path for Hashboard customers. If you are evaluating Hashboard, evaluate Hex instead.

## Good to know

Hex is a hosted web platform. As of September 2026 it lists a free Community plan (Hex agent trial, any data source, small compute), Professional at $36 per Editor per month, Team at $75 per Editor per month, and custom Enterprise pricing that adds explorer seats, audit logs, OAuth database connections, OIDC SSO, BYOK, and embedded analytics. Agent usage is metered as credits, which scale by plan, so a heavy agent month costs more than a light one on the same seat count.

Choose Hex over a pure notebook when publishing and governance matter as much as the analysis. If you mainly want a fast, chat-first way to interrogate a file, [Julius](/tools/julius) is lighter; if you want a notebook with a strong agent and a cheaper entry point, look at [Deepnote](/tools/deepnote). If your data and semantics already live in one platform, the built-in option there, such as [Databricks Genie](/tools/databricks-genie), is billed by consumption instead of per Editor, with user traffic free until January 31, 2027. The [best AI tools for data analysts in 2026](/guides/comparisons/best-ai-tools-for-data-analysts-2026) roundup places all of them side by side.
