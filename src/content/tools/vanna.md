---
name: "Vanna"
description: "An MIT-licensed Python framework for text-to-SQL: a user-aware agent that learns from successful queries and streams tables, charts, and summaries back."
seoDescription: "Vanna for analysts: how its RAG text-to-SQL agent learns, which vector stores and databases it supports, Vanna Cloud pricing, and why the repo is now archived."
date: 2026-09-10
url: "https://vanna.ai"
pricing: "open-source"
category: "analytics"
color: "orange"
repo: "https://github.com/vanna-ai/vanna"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["text-to-sql", "rag", "open-source", "python", "sql"]
featured: false
alternativeTo: ["pandasai", "databricks-genie"]
sameAs: ["https://github.com/vanna-ai/vanna", "https://pypi.org/project/vanna/"]
related: ["guide:claude-for-data-analysis", "guide:best-ai-tools-for-data-analysts-2026", "guide:best-text-to-sql-tools-2026", "tool:pandasai", "tool:databricks-genie", "glossary:text-to-sql", "glossary:semantic-layer"]
keywords: ["Vanna", "Vanna AI", "text-to-SQL", "RAG SQL", "Vanna Cloud pricing"]
summary: "Vanna is an open-source Python framework for asking a SQL database questions in English. It retrieves context from a vector store, generates SQL, runs it, and streams back a table, a chart, and a written summary. Version 2.0 replaced the old train-on-DDL workflow with agent memory, and added per-user permissions."
faq:
  - q: "How does Vanna generate accurate SQL?"
    a: "By retrieval rather than by memorization. Relevant context is stored in a vector database and retrieved for each question, so the model sees your schema, your documentation, and examples of queries that worked before writing new SQL. In version 2.0 that context is agent memory: every successful tool usage is saved, and similar past examples are retrieved by semantic similarity for later questions."
  - q: "How do you train Vanna 2.0?"
    a: "There is no train() method any more. The documented options are in-chat training, where a correct or corrected answer is saved automatically, and manual seeding through agent memory: save_tool_usage() records a question and the SQL that answered it, and save_text_memory() adds documentation or business rules. Seeding memory with known-good examples is how you accelerate the learning."
  - q: "Which vector stores and databases does Vanna support?"
    a: "For memory, the documented backends are ChromaDB for local persistent storage, DemoAgentMemory for in-memory prototyping, Cloud Agent Memory on Vanna Cloud, and custom backends you implement yourself, with Pinecone, Weaviate, and Milvus given as examples. For data, the documented connectors are PostgreSQL, MySQL, Snowflake, and BigQuery for production plus SQLite for development, with a path for custom connectors."
  - q: "Is the Vanna repository still maintained?"
    a: "The GitHub repository was archived by its owner on March 29, 2026 and is now read-only. The last release on PyPI is 2.0.2 from February 2, 2026. The documentation and the commercial Vanna Cloud offering are still live, but treat the open-source code as frozen and factor that into any long-term dependency."
---

Vanna is a Python framework for turning English questions into SQL against your own database. The mechanism is retrieval, not fine-tuning: context about your schema, your documentation, and queries that have worked before lives in a vector store, and the relevant pieces are pulled in each time a question is asked. That is why it gets better on your data without anyone retraining a model.

Version 2.0 reframed the project around a user-aware agent. Identity flows through the system prompt, tool execution, and SQL filtering, so results can be filtered per user with row-level security and every query is logged per user for audit. It ships a `<vanna-chat>` web component and FastAPI and Flask integrations, so the chat surface is something you embed in your own app rather than a product you log into.

## Highlights

- **RAG-based SQL generation.** Retrieved context, not a memorized schema, so accuracy improves with the examples you accumulate rather than with model size.
- **Agent memory replaced training.** Every successful tool usage is saved to a vector database; on a later question Vanna searches for similar past usage, retrieves examples by semantic similarity, and uses them to choose its tool and its arguments.
- **Streaming output an analyst can read.** A question returns progress updates, a SQL block (shown to admin users by default), an interactive data table, Plotly charts, and a natural-language summary, all streamed to the web component.
- **Pluggable memory backends.** ChromaDB for local persistent storage, DemoAgentMemory for in-memory prototyping, Cloud Agent Memory via Vanna Cloud, or your own implementation, with Pinecone, Weaviate, and Milvus named as examples.
- **Your database, your model.** Documented connectors cover PostgreSQL, MySQL, Snowflake, and BigQuery for production and SQLite for development; the LLM layer works with OpenAI, Anthropic, Ollama, Azure, Google Gemini, AWS Bedrock, Mistral, and others.
- **Permissions as a first-class concern.** A user resolver extracts identity from your existing cookies or JWTs, tools check group membership, and lifecycle hooks handle quotas and rate limiting.

## In an analyst's workflow

The analyst's job with Vanna is curating memory. A generic model plus fifty of your real, correct queries beats a bigger model with none:

```python
from vanna.capabilities.agent_memory import ToolMemory

# Seed the answer your team asks for every Monday
await agent.agent_memory.save_tool_usage(
    question="Weekly active accounts by plan tier",
    tool_name="run_sql",
    args={"sql": "SELECT ..."},
    context=ToolContext(user=your_user),
    success=True,
)

# Seed the definition nobody agrees on
await agent.agent_memory.save_text_memory(
    content="Active means at least one billable event in the trailing 7 days.",
    context=ToolContext(user=your_user),
)
```

Then use in-chat training for everything else: when an answer is right, or you corrected it, it goes into memory automatically. This is the same grounding problem covered in [text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude), solved with a persistent store instead of a prompt you paste each time.

> [!WARNING]
> The GitHub repository was archived by its owner on March 29, 2026 and is read-only, with the last PyPI release, 2.0.2, dated February 2, 2026. The docs and the commercial offering are still live, but the open-source code is frozen: no upstream fixes, no new connectors. Weigh that before building on it.

## Good to know

The open-source framework is MIT-licensed, copyright Vanna.AI, and installs as the `vanna` package. Vanna Cloud adds managed LLM endpoints with model routing and guardrails, a managed conversation store with encrypted retention and PII scrubbing, hosted vector memory, policy-driven lifecycle hooks for quotas and approvals, session management and permissions, and an evaluation suite. As of September 2026 the published plans are Explorer at $50 per month for small teams of two to three with 20 questions a day, Team at $500 per month with 300 questions a day and setup support, and custom Enterprise pricing with unlimited questions, on-prem deployment support, and SAML SSO; annual subscriptions receive a 20 percent discount.

If your questions are about files and dataframes rather than a warehouse, [PandasAI](/tools/pandasai) is the closer library. If your data already lives in a governed platform, a built-in agent such as [Databricks Genie](/tools/databricks-genie) removes the operational work entirely. [The best text-to-SQL tools in 2026](/guides/comparisons/best-text-to-sql-tools-2026) compares the approaches, and [the best AI tools for data analysts in 2026](/guides/comparisons/best-ai-tools-for-data-analysts-2026) plus [Claude for data analysis](/guides/analytics/claude-for-data-analysis) cover the non-SQL routes to the same answers.
