---
name: "Cohere Rerank"
title: "Cohere Rerank"
description: "A hosted reranking API that reorders retrieved passages by true relevance to a query."
seoDescription: "Cohere Rerank is a hosted reranking API that reorders retrieved passages by true relevance to a query — a drop-in precision boost for RAG and search."
url: "https://cohere.com/rerank"
date: 2026-06-03
pricing: "freemium"
category: "platform"
sameAs: ["https://docs.cohere.com/docs/rerank-overview"]
color: "blue"
topics: ["rag-retrieval"]
tags: ["reranking", "rag", "api", "search"]
featured: false
alternativeTo: ["voyage-ai"]
summary: "Cohere Rerank is a hosted cross-encoder API that takes a query plus a list of retrieved passages and returns them sorted by genuine relevance. Dropping it in after first-stage retrieval is one of the cheapest, highest-leverage upgrades to RAG quality."
related: ["guide:hybrid-search-reranking", "tool:voyage-ai", "tool:qdrant", "agent:retrieval-engineer", "command:benchmark-rerankers"]
faq:
  - q: "What is Cohere Rerank?"
    a: "Cohere Rerank is a hosted reranking API: you give it a query and a list of candidate passages from your vector or keyword search, and it returns them reordered by genuine relevance, each with a score. As a cross-encoder it reads the query and each passage together, so it judges relevance far more accurately than the bi-encoder embeddings used for first-stage retrieval."
  - q: "How much does Cohere Rerank cost?"
    a: "It is a commercial API with a free trial tier for evaluation and usage-based pricing in production. It's hosted only (no self-hosting), so factor in the added per-query latency and cost of the rerank call — though reranking only the top candidates keeps both modest."
  - q: "How do I use Cohere Rerank?"
    a: "The standard pattern is retrieve-wide, rerank-narrow: pull 25–50 candidates from your retriever, then call co.rerank(model='rerank-v3.5', query=question, documents=candidates, top_n=5) and put only the top passages in your prompt. It drops in after any retriever — vector, keyword, or hybrid — with no re-indexing required."
---

Cohere Rerank is a hosted **reranking** API: you give it a query and a list of candidate passages (from your vector or keyword search), and it returns them reordered by genuine relevance, each with a score. Unlike the bi-encoder embeddings used for first-stage retrieval, a reranker is a **cross-encoder** — it reads the query and each passage together, so it judges relevance far more accurately at the cost of running per candidate.

It is aimed at teams whose retrieval recall is fine but whose top results are noisy. Adding a rerank step after first-stage retrieval is one of the highest-leverage, lowest-effort upgrades you can make to a RAG pipeline: over-retrieve broadly, then let the reranker surface the few passages that actually answer the question.

## Highlights

- **Cross-encoder relevance** — scores each query/passage pair directly, catching matches that pure vector similarity misses.
- **Drop-in after retrieval** — works on top of any retriever (vector, keyword, or hybrid); no re-indexing required.
- **Multilingual** — reranks across many languages, including cross-lingual query/document pairs.
- **Tunable depth** — rerank a large candidate set and return the top-k you send to the model.

## In an AI-assisted workflow

The standard pattern is retrieve-wide, rerank-narrow:

```python
import cohere
co = cohere.ClientV2()  # reads CO_API_KEY

# candidates = top-50 passages from your vector DB (e.g. Qdrant)
result = co.rerank(model="rerank-v3.5", query=question, documents=candidates, top_n=5)
top_passages = [candidates[r.index] for r in result.results]
```

> [!TIP]
> The win comes from over-retrieving first. Pull 25–50 candidates from your retriever, then rerank down to the 3–5 you put in the prompt — measure the lift with [Benchmark Rerankers](/commands/review/benchmark-rerankers).

## Good to know

Cohere Rerank is a commercial API with a free trial tier for evaluation and usage-based pricing in production. It is a hosted service (no self-hosting), so factor in the added per-query latency and cost of the rerank call — though reranking only the top candidates keeps both modest. [Voyage AI](/tools/voyage-ai) offers a comparable reranker if you want to compare.
