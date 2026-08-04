---
title: "Agentic RAG: When Retrieval Needs an Agent in the Loop"
description: "What agentic RAG is — retrieval as a tool an agent uses iteratively, with query planning, self-correction, and multi-source routing — and when the upgrade pays."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["rag-retrieval", "ai-agents-systems"]
tags: ["agentic-rag", "rag", "agents", "retrieval"]
featured: false
summary: "Classic RAG is a fixed pipeline: retrieve once, generate once. Agentic RAG hands retrieval to an agent as a tool: it decomposes the question, searches iteratively, evaluates what came back, reformulates, routes across sources, and stops when it has enough. The upgrade pays on complex questions over messy corpora — at the price of latency, cost, and a new need for evals."
keyTakeaways:
  - "The shift is control flow: pipeline RAG retrieves once on the raw query; agentic RAG lets the model decide what to search, judge the results, and search again."
  - "Core moves: query decomposition, self-evaluation of retrieved context ('is this enough?'), reformulation on failure, and routing across multiple indexes/sources."
  - "It fixes the single-shot failure mode — bad first retrieval poisoning the answer — and handles multi-part questions a single query can't express."
  - "Costs are mechanical: multiple LLM calls and searches per question (latency + tokens), plus agent-grade failure modes (loops, overconfident stopping) that demand evals."
  - "Adopt it surgically: keep one-shot retrieval for simple lookups and escalate to the agentic loop for complex queries — routing by difficulty, not pride."
faq:
  - q: "What is agentic RAG?"
    a: "RAG where retrieval is a tool inside an agent loop rather than a fixed pre-step. The agent plans (decompose the question), acts (search — possibly different indexes), observes (evaluate retrieved context), and iterates (reformulate, search again) until it judges the evidence sufficient to answer. Retrieval becomes something the model does deliberately, repeatedly, not something done to it once."
  - q: "How is agentic RAG different from just better retrieval?"
    a: "Better retrieval (hybrid search, reranking) improves the single shot; agentic RAG removes the single-shot constraint. They compose: each search inside the agent loop should still be hybrid+reranked. If your failures are 'right doc exists, wrong rank,' fix retrieval. If they're 'the question needed three different searches,' you need the loop."
  - q: "Does agentic RAG replace GraphRAG?"
    a: "They're orthogonal upgrades. GraphRAG changes WHAT you retrieve over (a knowledge graph); agentic RAG changes HOW retrieval is driven (iteratively, by an agent). Mature systems combine them — an agent that can choose vector search, graph traversal, SQL, or web per sub-question is the full expression of the pattern."
  - q: "What's the catch?"
    a: "Latency and variance. Three to ten retrieval/LLM rounds per question costs seconds and tokens, and agent autonomy introduces loop/early-stop failure modes a pipeline never had. Production deployments cap iterations, log every hop, and eval end-to-end answer quality — not just retrieval metrics."
related: ["guide:how-rag-works", "guide:graph-rag", "guide:rag-vs-long-context", "guide:hybrid-search-reranking", "agent:rag-pipeline-engineer", "guide:production-tool-calling", "guide:write-llm-evals"]
---

Classic [RAG](/glossary/rag) is a pipeline with the intelligence at the end: embed the user's query, fetch top-k, hand it to the model, hope. Its defining weakness is that **the retrieval happens before any thinking does** — one shot, on the user's raw phrasing, with no recourse if the shot misses. Agentic RAG moves the intelligence forward: retrieval becomes a *tool* an [agent](/glossary/ai-agent) wields — repeatedly, judgmentally — rather than a fixed pre-step.

## What the agent actually does differently

- **Decomposes.** "Compare our churn in EU vs US since the pricing change" becomes three searchable sub-questions; a single embedding of the original query resembles none of them.
- **Evaluates what came back.** After each retrieval, the agent asks the question pipelines never ask: *is this sufficient and relevant?* Thin or off-target results trigger the next move instead of a hallucinated answer.
- **Reformulates.** Failed searches get rephrased — different vocabulary, narrower scope, exploded acronyms — the loop that fixes the "right doc, wrong words" miss.
- **Routes.** Multiple sources stop being a merge problem: per sub-question, the agent picks the vector index, the [knowledge graph](/guides/concepts/graph-rag), the SQL database, or web search. Tool choice *is* retrieval strategy.
- **Stops deliberately.** Enough evidence → answer with citations; exhausted strategies → say so. An honest "couldn't find it" is itself an upgrade over confident fabrication.

Under the hood this is ordinary [tool-calling agent machinery](/guides/concepts/production-tool-calling) — search tools with good descriptions, results fed back as observations, an iteration cap — pointed at retrieval.

## When the upgrade pays

The pattern earns its cost where single-shot structurally fails: **multi-part questions**, **messy or multi-source corpora**, **vocabulary mismatch between askers and documents**, and **high-stakes answers** where "search again" beats "guess." It's overkill for FAQ-shaped lookups — which is why production systems route: a difficulty classifier (or simple heuristics) sends easy queries down the cheap one-shot path and escalates the rest to the loop. Typical agentic queries cost 3–10× a pipeline query in latency and tokens; spent on the right 20% of traffic, that's a bargain.

> [!WARNING]
> Agentic RAG inherits agent failure modes RAG never had: retrieval loops, premature confident stops, tool-choice errors. Cap iterations, trace every search (query → results → agent's judgment), and eval **end-to-end answer quality** on a set that includes the hard multi-hop cases — retrieval metrics alone no longer describe the system. The discipline is the same as any [LLM eval suite](/guides/evaluation/write-llm-evals).

## Building it incrementally

Start from a working pipeline ([the anatomy](/guides/concepts/how-rag-works) — and keep its hybrid search + [reranking](/glossary/reranking); the agent's individual searches should be your *best* searches). Then add, in order of payoff: (1) self-evaluation + one reformulation retry; (2) query decomposition for multi-part questions; (3) multi-source routing; (4) the difficulty router in front. Each step is measurable against your failure set, and the first one alone — *retry on judged-bad retrieval* — routinely closes a surprising share of failures.

Agentic RAG is where the two big 2026 threads — better retrieval and better agents — braid together; the [rag-pipeline-engineer](/agents/data-ai/rag-pipeline-engineer) agent builds exactly this evolution. And for the question that usually precedes the whole topic — "do million-token contexts make RAG obsolete?" — the answer is its own guide: [RAG vs Long Context](/guides/concepts/rag-vs-long-context).
