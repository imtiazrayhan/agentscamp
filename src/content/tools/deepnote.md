---
name: "Deepnote"
description: "A collaborative data notebook whose AI agent edits and runs your blocks, with data apps, a semantic layer, and integrations across warehouses and BI tools."
seoDescription: "Deepnote for analysts: what Deepnote Agent's Edit and Ask modes do, the semantic layer and integrations, and plan prices as of September 2026."
date: 2026-09-10
url: "https://deepnote.com"
pricing: "freemium"
category: "analytics"
color: "cyan"
os: ["Web"]
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["notebooks", "data-apps", "python", "sql", "semantic-layer", "analysts"]
featured: false
alternativeTo: ["hex", "julius"]
sameAs: ["https://github.com/deepnote"]
related: ["guide:claude-for-data-analysis", "guide:best-ai-tools-for-data-analysts-2026", "tool:hex", "tool:julius", "glossary:ai-data-analyst", "glossary:code-execution"]
keywords: ["Deepnote", "Deepnote Agent", "AI notebook", "data apps", "Deepnote pricing"]
summary: "Deepnote is a collaborative data workspace: notebooks that mix SQL and Python, data apps built from them, pipelines, a catalog, alerts, and a semantic layer that reads LookML and dbt. Deepnote Agent works inside the notebook in two modes, editing and running blocks or answering without touching anything."
faq:
  - q: "What is Deepnote?"
    a: "Deepnote is a hosted data workspace built on collaborative notebooks. You write SQL and Python blocks, publish the result as a data app or dashboard, and connect to warehouses, databases, and BI tools through more than a hundred integrations. It also includes ETL and ELT pipelines, a data catalog, alerts, and a semantic layer."
  - q: "What is Deepnote Agent?"
    a: "Deepnote Agent is the notebook's AI collaborator. In Edit mode, the default, it adds, edits, or deletes content, executes code blocks, inspects outputs, and adapts as it goes. In Ask mode it changes nothing and just answers questions about your data or about Deepnote. It interprets the request, shows a step-by-step plan, then executes each step."
  - q: "Which models does Deepnote AI use?"
    a: "Deepnote's documentation says it supports a range of models including Anthropic's Claude and OpenAI's GPT families, with an Automatic option that lets Deepnote pick the model for each task. AI features must be enabled by a workspace admin in Settings and Members before editors can use them."
  - q: "Is Deepnote free?"
    a: "There is a Free forever plan with up to 3 editors, up to 5 projects, limited Deepnote AI, unlimited basic machines at 5 GB RAM and 2 vCPU, and 7-day revision history. As of September 2026 the Team plan is 39 dollars per editor per month with a 20 percent discount billed yearly, and includes monthly AI, CPU, and GPU credit allowances. Enterprise is custom."
---

Deepnote is a notebook that behaves like a product rather than a file. SQL and Python blocks live in the same collaborative document, results render as real tables and charts, and the same project publishes as a data app or dashboard for people who will never see a cell. Around that sit the pieces a data team usually assembles separately: ETL and ELT pipelines, a data catalog, alerts on metrics, and a semantic layer that reads Deepnote modules, LookML, and dbt.

For an analyst, the appeal is a low floor and a high ceiling. You can start with a query and a chart and end with a scheduled, alerting, app-shaped deliverable, without leaving the tool or handing anything to an engineer.

## Highlights

- **Deepnote Agent, in two modes.** Edit mode, the default, makes direct changes to the notebook: it adds, edits, or deletes content, executes code blocks, inspects outputs, and adapts its actions based on what it sees. Ask mode edits nothing and is for brainstorming or asking questions about the data.
- **A plan you can read before it runs.** The agent interprets your request, produces a transparent step-by-step plan, then executes each step, which makes it far easier to stop before it rewrites something you cared about.
- **Deepnote AI for the smaller jobs.** Code generation, code editing, code explanation, SQL generation, completion, data visualization, error fixing, and custom AI instructions, across a range of models including Anthropic's Claude and OpenAI's GPT families with an Automatic option.
- **Apps and dashboards from the same project.** Publish a notebook as a data app so stakeholders get inputs and charts instead of code.
- **More than a hundred integrations.** Warehouses and databases, plus dashboards such as Looker, Tableau, and Power BI, and model and metadata tools.
- **A semantic layer that reads what you already have.** Deepnote's semantic layer supports modules, LookML, and dbt, so definitions do not have to be re-declared.

## In an analyst's workflow

Deepnote Agent is most useful for the second half of an analysis, the part nobody enjoys. Get the query right yourself, then hand over the cleanup:

```text
Ask mode first:
"Read this notebook. Which blocks are dead, and where am I
computing the same aggregate twice?"

Then Edit mode:
"Consolidate the duplicate aggregates into one SQL block, add a
Markdown block above each section explaining what it shows, and
make this notebook presentation-ready for a non-technical reader."
```

Ask before you edit is the habit worth keeping: the agent will happily restructure a notebook, and it is much easier to approve a plan than to unpick a rewrite. Publish the result as an app, and set an alert so the metric tells you when it moves.

> [!TIP]
> Enable AI at the workspace level deliberately. A workspace admin has to turn AI features on in settings before editors can use them, which is a good moment to decide what data the agent is allowed near. [Claude for data analysis](/guides/analytics/claude-for-data-analysis) covers the same question for general-purpose assistants.

## Good to know

Deepnote is a hosted web platform. As of September 2026 the Free plan is free forever with up to 3 editors, up to 5 projects, limited Deepnote AI, unlimited basic machines at 5 GB RAM and 2 vCPU, and 7-day revision history. Team is $39 per editor per month, 20 percent cheaper billed yearly, and bundles monthly allowances of AI credits, CPU, and GPU alongside unlimited viewers and notebooks, premium integrations, background execution, scheduled notebooks, and 30-day revision history. Enterprise is custom and adds permission groups, SSO and directory sync, audit logs, and single tenancy. Deepnote's own docs describe AI as available on paid plans, so treat the free tier as an evaluation rather than a working setup.

Deepnote and [Hex](/tools/hex) solve the same problem from slightly different angles: Hex leans harder into governed self-serve and semantic context, Deepnote into a cheaper, code-first workspace with pipelines and a catalog attached. If you would rather not open a notebook at all, [Julius](/tools/julius) is the chat-first option. See [the best AI tools for data analysts in 2026](/guides/comparisons/best-ai-tools-for-data-analysts-2026) for the full field.
