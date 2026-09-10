---
name: "Databricks Genie"
description: "Databricks' conversational analytics layer: Genie Agents answer natural-language questions over Unity Catalog data using curated instructions and SQL."
seoDescription: "Databricks Genie for analysts: how Genie Agents ground answers in Unity Catalog, instructions and metric views, the 2026 Genie One rename, and the Genie API."
date: 2026-09-10
url: "https://www.databricks.com/product/genie/agents"
pricing: "enterprise"
category: "analytics"
color: "red"
os: ["Web"]
topics: ["ai-at-work", "data-ml", "mlops-ai-infra"]
audience: ["analysts"]
tags: ["conversational-analytics", "text-to-sql", "unity-catalog", "semantic-layer", "databricks"]
featured: false
alternativeTo: ["thoughtspot-spotter", "hex"]
sameAs: ["https://docs.databricks.com/aws/en/genie/"]
related: ["guide:claude-for-data-analysis", "guide:best-ai-tools-for-data-analysts-2026", "guide:best-text-to-sql-tools-2026", "tool:thoughtspot-spotter", "tool:hex", "glossary:conversational-analytics", "glossary:semantic-layer"]
keywords: ["Databricks Genie", "Genie Agents", "AI/BI Genie", "Unity Catalog", "conversational analytics"]
summary: "Databricks Genie lets business users ask data questions in natural language and get answers grounded in Unity Catalog. Data teams curate a Genie Agent with a scoped set of tables, instructions, example SQL queries, and parameterized SQL functions, then expose it in Genie or through its API. In June 2026 Genie spaces became Genie Agents."
faq:
  - q: "What is Databricks Genie?"
    a: "Genie is the Databricks AI experience for business users: a single place to ask data questions in natural language, explore AI/BI dashboards, and run Databricks Apps. Every answer is grounded in your organization's data and governed through Unity Catalog. It began as a conversational analytics assistant inside Databricks AI/BI."
  - q: "Did Databricks rename Genie?"
    a: "Yes. On June 16, 2026 Databricks introduced Genie One, Genie Agents, and Genie Ontology. What used to be called a Genie space is now a Genie Agent, and Genie One is the business-user experience that sits above them. Older material still says AI/BI Genie or Genie spaces, so expect mixed terminology in blog posts and screenshots."
  - q: "How does Genie know what your metrics mean?"
    a: "A data team configures the agent: choose the Unity Catalog tables or views in scope, write general instructions for how questions should be interpreted, add example SQL queries for common patterns, and register SQL functions with parameterized queries so certain questions always return a verified answer. Unity Catalog metric views can supply shared measure and dimension definitions."
  - q: "Does Genie cost extra?"
    a: "Databricks states there are no additional license fees to use AI/BI and that standard Databricks Lakehouse DBU rates apply, and it makes the same statement for Genie Agents. You still pay for the compute the queries run on, and your data has to be managed in Unity Catalog."
---

Databricks Genie is the conversational front end to data that already lives in Databricks. A business user asks a question in plain English; Genie generates SQL against a curated set of Unity Catalog tables, runs it on a warehouse, and returns a result the asker can see the query behind. The governance is not bolted on: Unity Catalog permissions, row filters, and column masks apply to the agent exactly as they apply to a human running the same query.

The naming moved in 2026, so read old material carefully. Genie started as a conversational analytics assistant in Databricks AI/BI. On June 16, 2026 Databricks introduced Genie One (the business-user experience), Genie Agents (what Genie spaces became), and Genie Ontology (an automatic context layer that extracts knowledge from tables, queries, dashboards, and pipelines into a graph). Genie Code is the developer-facing side of the same family.

## Highlights

- **Grounded in Unity Catalog.** A Genie Agent is scoped to Unity Catalog data, up to 30 tables or views, and inherits the catalog's access policies, row filters, and column masks. Nothing the asker could not query themselves comes back.
- **Curated context, not raw text-to-SQL.** Subject-matter experts supply general instructions, example SQL queries, and common questions, so the agent learns your joins and your definitions rather than guessing at them.
- **Trusted answers via SQL functions.** Predefined functions with parameterized SQL let you pin the exact query behind a high-stakes question, so it returns a verified answer every time instead of a freshly generated one.
- **Metric views as the shared semantics.** Unity Catalog metric views separate measure definitions from the dimensions used to group and filter them, and can be queried from SQL editors, notebooks, dashboards, Genie Agents, and alerts. Genie can also export an agent's context into a metric view.
- **An API for your own surfaces.** Chat mode APIs let an application, chatbot, or agent framework start a stateful conversation, ask follow-ups, and retrieve the generated SQL, the query results, and the visualizations.
- **Feedback loops built in.** Activity monitoring tracks the questions asked, usage, and user ratings, which is how you find the definitions your instructions are still missing.

## In an analyst's workflow

Genie rewards preparation more than prompting. The setup work is where the accuracy comes from:

```sql
-- Register the answer you never want re-derived:
CREATE FUNCTION analytics.finance.net_revenue_by_month(
  start_date DATE, end_date DATE
)
RETURNS TABLE
RETURN
  SELECT date_trunc('MONTH', invoice_date) AS month,
         SUM(amount) - SUM(refund_amount) AS net_revenue
  FROM analytics.finance.fct_invoices
  WHERE invoice_date BETWEEN start_date AND end_date
  GROUP BY 1;
```

Add that function to the agent, write an instruction saying net revenue always means this, and "what was net revenue in July?" stops being a coin flip. Then watch the activity feed: every low-rated answer is a missing instruction or a missing example query. For the same grounding problem outside a single vendor's platform, see [text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude) and the [best text-to-SQL tools in 2026](/guides/comparisons/best-text-to-sql-tools-2026).

> [!WARNING]
> Scope is a feature. An agent pointed at thirty well-documented tables answers better than one pointed at a whole catalog. Build several narrow agents by domain rather than one that is meant to know everything.

## Good to know

Genie is part of the Databricks platform rather than a separate purchase: Databricks states there are no additional license fees for AI/BI and that standard Lakehouse DBU rates apply, with the same statement made for Genie Agents. Your data must be managed in Unity Catalog, and the feature set assumes Pro or Serverless SQL compute.

That makes the real comparison a platform one. If your governed [semantic layer](/glossary/semantic-layer) lives in Databricks, Genie is the cheapest good answer. If it lives elsewhere, or if you want the same conversational surface over several stacks, [ThoughtSpot Spotter](/tools/thoughtspot-spotter) is the closest dedicated competitor and [Hex](/tools/hex) is the closest notebook-plus-agent alternative. The [best AI tools for data analysts in 2026](/guides/comparisons/best-ai-tools-for-data-analysts-2026) roundup covers how they differ in practice, and [Claude for data analysis](/guides/analytics/claude-for-data-analysis) covers the general-assistant route.
