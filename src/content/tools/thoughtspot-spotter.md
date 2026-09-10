---
name: "ThoughtSpot Spotter"
description: "ThoughtSpot's agentic analyst: it resolves questions into search tokens against a governed semantic model rather than raw SQL, then acts on the answer."
seoDescription: "ThoughtSpot Spotter for analysts: how search tokens over a governed semantic model differ from text-to-SQL, Spotter 3 vs Spotter Agent, and 2026 plan pricing."
date: 2026-09-10
url: "https://www.thoughtspot.com/product/agents/spotter"
pricing: "paid"
category: "analytics"
color: "blue"
os: ["Web"]
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["conversational-analytics", "agentic-analytics", "semantic-layer", "bi", "analysts"]
featured: false
alternativeTo: ["databricks-genie", "hex"]
sameAs: ["https://docs.thoughtspot.com/cloud/latest/spotter"]
related: ["guide:claude-for-data-analysis", "guide:best-ai-tools-for-data-analysts-2026", "guide:best-text-to-sql-tools-2026", "tool:databricks-genie", "tool:hex", "glossary:conversational-analytics", "glossary:semantic-layer"]
keywords: ["ThoughtSpot Spotter", "agentic analytics", "semantic layer", "conversational BI", "Spotter pricing"]
summary: "ThoughtSpot Spotter is an agentic analyst that answers business questions against a governed semantic model. Rather than generating SQL from a prompt, it translates questions into search tokens over the model, which keeps every query traceable and auditable, then reasons in steps, checks its own results, and can act on the outcome."
faq:
  - q: "What is ThoughtSpot Spotter?"
    a: "Spotter is ThoughtSpot's AI analyst agent. You ask a business question in natural language and it answers against your governed semantic model, breaking the question into steps, testing assumptions, checking results, rerunning the analysis where needed, and recommending actions. ThoughtSpot positions it as an enterprise agent for analytics rather than a chatbot bolted onto a dashboard."
  - q: "How is Spotter different from text-to-SQL?"
    a: "Spotter translates questions into search tokens grounded in your governed semantic layer instead of generating SQL straight from the prompt. Because the tokens resolve against modeled fields, the resulting query is fully traceable and auditable, and a question can only reference fields the model exposes. Standard text-to-SQL has no such floor."
  - q: "What are Spotter 3, Spotter Agent, and Spotter Classic?"
    a: "They are the three generations documented by ThoughtSpot. Spotter Classic is Spotter 1, the conversational analytics experience. Spotter Agent is Spotter 2, the agentic version. Spotter 3 is the newest and can query across data models, automatically selecting the right data source and switching sources inside one conversation."
  - q: "How much does ThoughtSpot cost?"
    a: "As of September 2026 ThoughtSpot Analytics lists Essentials at 25 dollars per user per month billed annually for 5 to 50 users and up to 25 million rows, a Pro plan priced on credits starting as low as 0.10 dollars per credit with Spotter AI Agents included at 25 queries per month, and custom Enterprise pricing with unlimited Spotter agents. ThoughtSpot Embedded lists a Developer plan free for one year and a custom Enterprise plan."
---

ThoughtSpot Spotter is a BI vendor's answer to the obvious problem with conversational analytics: a model that writes SQL from scratch can write confident SQL against the wrong column. Spotter does not do that. It translates a question into search tokens grounded in your governed semantic layer, which produces queries ThoughtSpot describes as "fully traceable, auditable." The model is the guardrail, and the agent works inside it.

That makes Spotter a fit for organizations that have already invested in modeling and want the self-serve layer on top, rather than for an analyst who wants to interrogate a loose CSV. If you have no semantic model, Spotter has nothing to stand on.

## Highlights

- **Search tokens, not free-form SQL.** Questions resolve against modeled fields, so an answer can be traced back to the definitions it used and audited afterwards.
- **Multi-step reasoning with self-checks.** Spotter breaks a question down, does multi-step reasoning, tests assumptions, checks results, reruns the analysis, and delivers recommended actions rather than a single chart.
- **Cross-model questions in Spotter 3.** The newest generation queries across data models, automatically selecting the appropriate data source and switching between sources inside the same conversation. Spotter Agent (Spotter 2) and Spotter Classic (Spotter 1) are the earlier documented generations.
- **Answers that do something.** Spotter can turn an insight into action by creating Jira tickets, updating Salesforce opportunities, posting to Slack, or triggering workflows.
- **Enterprise controls as a default.** Role-based access control, row-level and column-level security, your choice of LLM, and zero LLM data retention.
- **A family of adjacent agents.** ThoughtSpot also ships AgentSpot, SpotterModel for semantic modeling, SpotterViz for going from data to dashboards, and SpotterCode for AI-assisted coding, plus Spotter Connectors that reach it from Claude, Gemini, and Cursor.

## In an analyst's workflow

For an analyst, Spotter changes the job from answering questions to curating the model that answers them. The work looks like this:

```text
1. Model the fields business users actually ask about, with the names
   they use — not warehouse column names.
2. Ask Spotter the ten questions you get in Slack every week.
3. For each wrong answer, fix the model, not the prompt.
4. Publish, then track which questions still route back to you.
```

That loop is the same one every [conversational analytics](/glossary/conversational-analytics) deployment runs, whichever vendor you pick; the difference here is that Spotter's failures point at a modeling gap rather than at a prompt. The [best text-to-SQL tools in 2026](/guides/comparisons/best-text-to-sql-tools-2026) comparison sets the token-over-model approach against the generate-the-SQL approach directly.

> [!NOTE]
> Spotter's strength and its constraint are the same fact. A question the model cannot express is a question Spotter will not answer, which is safer than a wrong answer and more frustrating than an open-ended notebook.

## Good to know

ThoughtSpot is a hosted platform with an embedded option. As of September 2026 ThoughtSpot Analytics lists Essentials at $25 per user per month billed annually (5 to 50 users, up to 25 million rows), a Pro plan billed on credits "starting as low as $0.10 Per credit" with up to 1,000 users, 250 million rows, natural-language search, Spotter AI Agents at 25 queries per month, and Analyst Studio, and custom Enterprise pricing with unlimited Spotter agents. ThoughtSpot Embedded lists a Developer plan free for one year (up to 10 users, 25 million rows) and a custom Enterprise plan. Free trials are offered on several plans.

The closest comparison is [Databricks Genie](/tools/databricks-genie), which does the same job for teams whose data and semantics already live in Unity Catalog and is billed by consumption rather than per seat, with user traffic on Genie One and Genie Agents free until January 31, 2027 and pay-as-you-go afterwards. If you want the analyst-facing notebook rather than the business-facing agent, [Hex](/tools/hex) pairs both in one workspace. [Claude for data analysis](/guides/analytics/claude-for-data-analysis) and [the best AI tools for data analysts in 2026](/guides/comparisons/best-ai-tools-for-data-analysts-2026) cover what you give up by going the general-assistant route instead.
