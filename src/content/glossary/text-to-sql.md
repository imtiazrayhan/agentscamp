---
term: "Text-to-SQL"
description: "Text-to-SQL is turning a plain-language question into a SQL query a database can run, using a model grounded in your schema, documentation, and past queries."
date: 2026-09-10
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["text-to-sql", "sql", "data", "analysts", "rag"]
related: ["guide:text-to-sql-with-claude", "guide:best-text-to-sql-tools-2026", "guide:claude-for-data-analysis", "tool:vanna", "glossary:semantic-layer", "glossary:conversational-analytics"]
summary: "Text-to-SQL turns a plain-language question into a runnable SQL query. Accuracy depends almost entirely on grounding: the model needs your DDL, your column descriptions, and known-correct example queries. It is a retrieval problem wearing a language-model costume, and the generated query is meant to be read before it is trusted."
faq:
  - q: "How accurate is text-to-SQL?"
    a: "It depends on your schema, not on the tool. A documented warehouse with a handful of well-described tables and a library of verified example queries produces reliable output; an undocumented one with three columns that could each mean revenue does not. Published benchmark scores use tidy schemas and unambiguous questions, so they overstate what you should expect on your own data."
  - q: "Is text-to-SQL the same as an AI chatbot for my database?"
    a: "It is the engine underneath one. Text-to-SQL is the narrow step of producing a query. A product built on it also handles permissions, ambiguity, clarifying questions, charting, and sharing, which is where most of the engineering effort actually goes."
  - q: "Do I need to let the model run the query?"
    a: "Not necessarily, and separating the two steps is a good habit. Generating SQL you read and run yourself is safe by construction. If the tool does execute, give it a read-only role and enforce read-only at the connection rather than trusting the prompt."
---

**Text-to-SQL is the technique of turning a plain-language question into a SQL query a database can run, using a language model that has been grounded in your schema, documentation, and previous queries.** The output is a query, not an answer, which is what makes it reviewable.

The hard part is not the SQL. It is context. A model that has never seen your warehouse does not know that `rev_net_usd` is the revenue everyone means, that orders join to customers through an intermediate table, or that your fiscal year starts in February. Tools solve this by retrieving relevant context at query time: [Vanna](/tools/vanna) trains on DDL statements, written documentation, and known-correct question-and-SQL pairs, embeds them, and pulls the most relevant pieces into the prompt, which is [RAG](/glossary/rag) applied to a database. Enterprise platforms go further and route the question through a governed [semantic layer](/glossary/semantic-layer) so metric definitions are fixed rather than inferred.

Because the intermediate artifact is a query, text-to-SQL is one of the few AI features where verification is straightforward: read the SQL, check the joins and the filters, then run it. That is also the discipline the whole category depends on, and the reason the generated query should never be hidden from the person asking.

The Claude-specific walkthrough is [text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude), the tool-by-tool comparison is [the best text-to-SQL tools in 2026](/guides/comparisons/best-text-to-sql-tools-2026), and the wider workflow it fits into is [Claude for data analysis](/guides/analytics/claude-for-data-analysis).
