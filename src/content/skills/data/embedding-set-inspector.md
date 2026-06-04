---
name: "embedding-set-inspector"
description: "Diagnose the health of an embedding set before blaming the retriever — checking normalization, dimensionality, near-duplicates, degenerate vectors, and corpus/query distribution mismatch. Use when retrieval quality is poor, after a re-embed, or before shipping a new index."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "purple"
date: 2026-06-03
topics: ["rag-retrieval"]
related: ["choosing-embeddings-2026", "voyage-ai", "chunking-strategy-optimizer", "retrieval-engineer"]
featured: false
summary: "When RAG retrieval is bad, the embeddings are often the culprit, not the search. This skill inspects an embedding set for the usual failure modes — unnormalized or wrong-dimension vectors, near-duplicates, degenerate/empty embeddings, and query/document distribution mismatch — and reports what to fix."
---

When retrieval is poor, teams reach for a bigger model or a reranker before checking whether the embeddings themselves are sound. This skill inspects an embedding set for the failure modes that quietly wreck recall, so you fix the cause instead of layering patches on top.

## When to use this skill

- Retrieval recall is low and you want to rule out the embeddings before tuning the retriever.
- After re-embedding a corpus (new model, new chunking) and before promoting the index.
- A subset of documents is "invisible" to search no matter the query.
- Validating a freshly built index in CI before it ships.

## Instructions

1. **Confirm the basics.** Verify every vector has the **expected dimensionality** and that vectors are **normalized** if your distance metric assumes it (cosine vs. dot product vs. L2 mismatch is a classic silent bug). Flag any zero, NaN, or near-zero-norm vectors — usually empty or failed-to-embed chunks.
2. **Check for asymmetry handling.** If the model supports input types (document vs. query), confirm documents were embedded as documents and queries as queries. Mixing them degrades retrieval and is easy to get wrong.
3. **Profile the distribution.** Summarize pairwise similarity: if almost everything is highly similar to everything else, the embeddings are not discriminating (often over-large chunks or a domain mismatch). If clusters are extreme, check for duplicated or boilerplate content dominating the space.
4. **Find near-duplicates.** Detect chunks whose embeddings are near-identical — repeated headers/footers, navigation, or licence text — which crowd out real answers in the top-k. Recommend dedup or metadata filtering.
5. **Test query/document alignment.** Embed a handful of the eval queries and confirm their nearest neighbours are plausible. A systematic mismatch (queries land far from all documents) points to a model or input-type problem, not a tuning problem.
6. **Report and recommend.** Summarize findings as `severity | issue | affected count | fix`, ordered by impact on retrieval.

> [!NOTE]
> Embeddings from different models are not comparable. Never mix vectors from two models in one index, and re-embed the whole corpus when you switch — see [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026).

> [!WARNING]
> A normalization or distance-metric mismatch can make retrieval look "sort of working" while quietly tanking recall. Check it first — it is the single most common embedding bug.

## Output

A health report: dimensionality/normalization status, count of degenerate vectors, near-duplicate clusters, distribution summary, query-alignment spot checks, and a prioritized list of fixes.
