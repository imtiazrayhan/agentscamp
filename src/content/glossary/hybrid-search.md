---
term: "Hybrid Search"
description: "Hybrid search runs keyword (BM25) and semantic (vector) retrieval together and merges the results — catching both exact terms and paraphrases."
date: 2026-06-12
topics: ["rag-retrieval"]
tags: ["hybrid-search", "bm25", "retrieval", "rag"]
related: ["hybrid-search-reranking", "semantic-search", "reranking", "rag", "vector-database"]
faq:
  - q: "Why combine keyword and vector search?"
    a: "Their failure modes are complementary. Vector search finds paraphrases ('laptop won't boot' → 'system fails to start') but fuzzes exact tokens; keyword search nails identifiers, error codes, and SKUs but misses rephrasings. Run both and each covers the other's blind spot — the single highest-ROI retrieval upgrade for most corpora."
  - q: "How are the two result lists merged?"
    a: "Most commonly Reciprocal Rank Fusion (RRF) — combining by rank position rather than raw scores, which sidesteps the incomparable-score-scales problem — or a weighted score blend tuned per corpus. Then, typically, a reranker sorts the merged pool precisely. Most vector databases now ship hybrid search built in."
---

**Hybrid search retrieves with two engines at once — lexical keyword search (BM25) and [semantic vector search](/glossary/semantic-search) — and merges their results, so queries match both by exact terms and by meaning.**

It exists because neither half suffices alone. Pure vector retrieval has a famous blind spot: **exact strings** — error codes, function names, part numbers — where "semantically similar" is precisely wrong. Pure keyword search has the inverse: zero tolerance for vocabulary mismatch between askers and documents. Production corpora contain both query types, so production retrieval runs both engines — usually merged by Reciprocal Rank Fusion (rank-based, immune to score-scale mismatch) and refined by a [reranker](/glossary/reranking) that sorts the combined pool.

Adoption is now mostly a checkbox: [vector databases](/glossary/vector-database) from Qdrant to Weaviate to pgvector-based stacks ship hybrid retrieval natively. The judgment that remains is tuning — fusion weights per corpus, and measuring whether the lexical leg actually helps *your* queries — covered with the full recall-to-precision architecture in [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking). When [RAG](/glossary/rag) misses queries containing exact identifiers, hybrid search is the first fix on [the debugging checklist](/guides/troubleshooting/rag-debugging-checklist).
