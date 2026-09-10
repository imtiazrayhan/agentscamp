---
name: "PandasAI"
description: "A Python library that adds a chat method to your dataframes: it generates and runs pandas code to answer questions, with an optional Docker sandbox."
seoDescription: "PandasAI for analysts: how df.chat() works, the experimental semantic layer, the Docker sandbox, and what its MIT-plus-enterprise license actually allows."
date: 2026-09-10
url: "https://pandas-ai.com"
pricing: "open-source"
category: "analytics"
color: "green"
repo: "https://github.com/sinaptik-ai/pandas-ai"
os: ["macOS", "Windows", "Linux"]
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["python", "pandas", "text-to-sql", "open-source", "dataframes"]
featured: false
alternativeTo: ["vanna"]
sameAs: ["https://github.com/sinaptik-ai/pandas-ai", "https://docs.pandas-ai.com", "https://pypi.org/project/pandasai/"]
related: ["guide:claude-for-data-analysis", "guide:best-ai-tools-for-data-analysts-2026", "guide:best-text-to-sql-tools-2026", "tool:vanna", "tool:julius", "glossary:code-execution", "glossary:text-to-sql"]
keywords: ["PandasAI", "chat with dataframe", "pandas AI", "natural language data analysis", "PandasAI license"]
summary: "PandasAI is a Python library from Sinaptik GmbH that makes dataframes conversational: load a CSV or connect a database, call .chat() with a plain-English question, and it generates and executes the code to answer it. An experimental semantic layer adds column descriptions, and an optional Docker sandbox isolates the generated code."
faq:
  - q: "What does PandasAI do?"
    a: "PandasAI turns a dataframe into something you can ask questions of. You load data with a call such as pai.read_csv, configure a language model, then call .chat() with a plain-English question. The library generates Python code, runs it, and returns the answer, which can be a value, a dataframe, or a chart. You can pass several dataframes at once and ask questions that relate them."
  - q: "Is PandasAI open source?"
    a: "Partly. Its LICENSE file says content outside the pandasai/ee directory is available under the MIT Expat license, while everything under ee/ requires a PandasAI Enterprise license for production use and may not be redistributed. Because of that split, GitHub's license API reports the repository as NOASSERTION rather than a standard SPDX identifier."
  - q: "What data sources does PandasAI support?"
    a: "CSV and Excel files load directly. A sql extension adds SQL, PostgreSQL, MySQL, CockroachDB, and Microsoft SQL Server. Cloud warehouse connectors such as Snowflake and Databricks live in the enterprise-licensed extensions, so check the license before using them in production."
  - q: "Is it safe to run PandasAI on untrusted input?"
    a: "Not without the sandbox. PandasAI executes Python that a language model wrote, so a user who can phrase the question can influence the code. The pandasai-docker package runs that code in an isolated Docker container that operates offline with resource limits and filesystem isolation. Use it for anything user-facing."
---

PandasAI is the smallest possible version of the idea behind every AI data tool: put a `.chat()` method on a dataframe. You load a CSV, configure a model, ask a question in English, and the library writes Python, runs it, and hands back the answer. Nothing is hosted, nothing is a platform, and the whole thing fits in a notebook cell.

That makes it a good fit for analysts who already work in Python and want conversational analysis inside a script or notebook rather than in a vendor's web app. It also makes the security question yours to answer, because the code that runs is code a language model just generated.

## Highlights

- **Chat over one dataframe or several.** `df.chat("What is the average revenue by region?")` returns a value; `pai.chat(question, df_a, df_b)` asks across multiple frames and relates them. Ask for a plot and you get one.
- **An experimental semantic layer.** `pai.create()` saves a dataset with a path, a description, and typed, described columns, so the model reads business meaning rather than guessing from headers. PandasAI marks the semantic layer as experimental and aimed at advanced users.
- **Data beyond files.** CSV and Excel load directly; a `sql` extension covers SQL, PostgreSQL, MySQL, CockroachDB, and Microsoft SQL Server. Snowflake, Databricks, and the other cloud connectors sit in the enterprise-licensed extensions.
- **Model-agnostic.** Install `pandasai-litellm` for a unified interface to OpenAI, Anthropic, Google and others, or `pandasai-openai` for OpenAI and Azure OpenAI directly, then set it once with `pai.config.set()`.
- **A real sandbox, not a promise.** `pandasai-docker` runs generated code in an isolated Docker container that operates entirely offline, with strict resource limits and filesystem isolation.
- **An Agent for multi-turn work.** `pai.chat()` is for single-session exploration; the `Agent` class keeps conversation state so follow-up questions like "and which one has the most deals?" resolve correctly.

## In an analyst's workflow

The pattern worth adopting is to describe your columns once and then never explain them again:

```python
import pandasai as pai
from pandasai_litellm.litellm import LiteLLM

pai.config.set({"llm": LiteLLM(model="gpt-4.1-mini", api_key="...")})

df = pai.create(
    path="company/sales-data",
    df=pai.read_csv("data/sales.csv"),
    description="Sales data from our retail stores",
    columns={
        "sale_date": {"type": "datetime", "description": "Date and time of the sale"},
        "quantity":  {"type": "integer",  "description": "Number of units sold"},
        "price":     {"type": "float",    "description": "Price per unit, pre-discount"},
    },
)

df.chat("Which product had the highest revenue last quarter?")
```

Those column descriptions do most of the accuracy work, and they are cheaper to maintain than a prompt. Read the code it generates before you trust a number, the same discipline the [checking an AI data analysis](/guides/analytics/check-an-ai-data-analysis) guide applies to any generated result.

> [!WARNING]
> The license is not plain MIT. Everything outside `pandasai/ee/` is MIT Expat; everything inside requires a PandasAI Enterprise license for production use and may not be copied, distributed, or sublicensed. GitHub's license API reports the repository as NOASSERTION for exactly this reason. Check which extension you are installing before you ship.

## Good to know

PandasAI is published by Sinaptik GmbH. Version 3.0.0 is the current release on PyPI, uploaded on October 7, 2025, and requires Python 3.8 or later and below 3.12 — a narrow window worth checking against your environment. Development on the public repository has been quiet since late 2025, so treat it as a stable library rather than a fast-moving one, and pin your version.

For SQL-first work against a warehouse, [Vanna](/tools/vanna) is the closer open-source comparison, and [the best text-to-SQL tools in 2026](/guides/comparisons/best-text-to-sql-tools-2026) sets both against the hosted options. If you want the same conversational experience without maintaining any of it, [Julius](/tools/julius) is the hosted equivalent, and [Claude for data analysis](/guides/analytics/claude-for-data-analysis) covers doing it with a general assistant. The [best AI tools for data analysts in 2026](/guides/comparisons/best-ai-tools-for-data-analysts-2026) roundup has the full comparison.
