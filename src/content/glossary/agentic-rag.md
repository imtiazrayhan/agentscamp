---
term: "Agentic RAG"
description: "Agentic RAG puts AI agents in charge of retrieval, so the system can plan, search repeatedly, judge what it finds and reformulate instead of retrieving once."
date: 2026-11-11
topics: ["rag-retrieval", "ai-agents-systems"]
audience: ["ai-engineers", "developers"]
tags: ["agentic-rag", "rag", "agents", "retrieval", "self-rag"]
related: ["guide:agentic-rag", "glossary:rag", "glossary:graphrag", "glossary:multi-agent-system", "agent:rag-pipeline-engineer", "glossary:ai-agent"]
faq:
  - q: "How is agentic RAG different from regular RAG?"
    a: "Regular RAG retrieves once on the user's query and generates once. The main survey of the pattern describes traditional RAG as constrained by static workflows that lack the adaptability needed for multi-step reasoning. Agentic RAG hands control of retrieval to an agent, which decides what to search for, checks whether the results are relevant and sufficient, and searches again or switches sources when they are not."
  - q: "Where did agentic RAG come from?"
    a: "It builds on adaptive-retrieval research. Self-RAG (Asai et al., 2023) argued that retrieving a fixed number of passages, whether or not retrieval is needed, hurts the model, and instead retrieved on demand and reflected on what it found. Agentic RAG generalizes that idea by putting agent design patterns such as reflection, planning, tool use and multi-agent collaboration in charge of the pipeline."
  - q: "When is agentic RAG worth it?"
    a: "When single-shot retrieval demonstrably fails: multi-part questions, several sources, or first searches that often miss. Every extra search and model call adds latency and tokens, and the survey lists evaluation, coordination, memory management, efficiency and governance as open challenges. A common approach is to keep one-shot retrieval for simple lookups and send only the hard queries to the agent loop."
summary: "Agentic RAG embeds autonomous AI agents in the retrieval-augmented generation pipeline. Instead of one fixed retrieve-then-generate pass, agents use reflection, planning, tool use and multi-agent collaboration to choose what to search, judge results, reformulate and route across sources. It pays on multi-step questions, at a cost in latency and tokens."
---

**Agentic RAG is [retrieval-augmented generation](/glossary/rag) in which one or more AI agents control retrieval, deciding what to search for, judging what comes back and searching again, instead of running a single fixed retrieve-then-generate pass.**

The clearest definition comes from the survey "Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG" (arXiv 2501.09136) by Singh, Ehtesham, Kumar, Talaei Khoei and Vasilakos, first posted in January 2025 and revised in April 2026. It describes traditional RAG systems as "constrained by static workflows" that lack "the adaptability required for multi-step reasoning and complex task management," and defines agentic RAG as "embedding autonomous AI agents into the RAG pipeline." Those agents use four design patterns (reflection, planning, tool use and multi-agent collaboration) to manage retrieval strategies, refine context iteratively and adapt the workflow. The survey classifies architectures by agent cardinality, control structure, autonomy and knowledge representation, and names evaluation, coordination, memory management, efficiency and governance as open problems.

The idea has a clear precursor in Self-RAG (2023), which argued that retrieving a fixed number of passages "regardless of whether retrieval is necessary" hurts the model, and retrieved on demand instead. Agentic RAG takes that from a single model's choice to full agent control.

In practice the agent's tools can include a vector index, a [GraphRAG](/glossary/graphrag) index, SQL or web search, and when several specialist agents share the work the design becomes a [multi-agent system](/glossary/multi-agent-system). The loop, its failure modes and how to adopt it step by step are in [Agentic RAG: When Retrieval Needs an Agent in the Loop](/guides/concepts/agentic-rag), and the [rag-pipeline-engineer](/agents/data-ai/rag-pipeline-engineer) agent builds it.
