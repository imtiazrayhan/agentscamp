---
term: "Reranking"
description: "Reranking is a second-pass scoring step: a cross-encoder model re-orders the top results from fast retrieval so the truly relevant few rise to the top."
date: 2026-06-11
topics: ["rag-retrieval"]
tags: ["reranking", "retrieval", "rag", "search"]
related: ["hybrid-search-reranking", "semantic-search", "rag", "cohere-rerank", "benchmark-rerankers", "voyage-ai"]
faq:
  - q: "Why rerank if retrieval already ranks by similarity?"
    a: "Because first-pass retrieval optimizes for speed over millions of documents, scoring query and document separately (a bi-encoder). A reranker is a cross-encoder: it reads the query and each candidate together, capturing interactions the fast pass can't — much more accurate, far too slow to run on everything. So you retrieve 50 fast, rerank to a precise top 5."
  - q: "When is a reranker worth adding?"
    a: "When your retriever's top-50 usually contains the right answer but the top-5 often doesn't — reranking converts recall you already have into precision. If the right document isn't in the candidate pool at all, fix retrieval first; a reranker can't promote what was never fetched. Measure before and after — that's what our benchmark-rerankers command automates."
---

**Reranking is the precision stage of retrieval: after a fast first pass fetches candidate documents, a reranker model scores each candidate against the query directly and re-orders them, so the few results that actually matter end up on top.**

The two stages exist because of an accuracy/speed trade. First-pass retrieval ([semantic](/glossary/semantic-search) or keyword) uses representations computed independently — fast enough for millions of documents, but blind to fine query–document interaction. A reranker is a **cross-encoder**: it reads the query and candidate *together*, which is dramatically more accurate and dramatically slower — viable only on a short list. The standard [RAG](/glossary/rag) pattern: retrieve top-50 cheaply, rerank to top-5 precisely, and put just those in the prompt — better answers *and* fewer tokens.

Hosted rerankers ([Cohere Rerank](/tools/cohere-rerank), [Voyage](/tools/voyage-ai)) make the step one API call. Whether it pays in *your* pipeline is an empirical question — [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking) covers the architecture, and the [benchmark-rerankers](/commands/review/benchmark-rerankers) command measures the lift on your own queries.
