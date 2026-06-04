---
description: "Measure whether adding a reranker actually improves retrieval, by scoring reranked vs. un-reranked results on a labeled query set."
argument-hint: "<path to eval set / retrieval results, or a description of the pipeline>"
allowed-tools: "Read, Grep, Glob, Bash"
model: "sonnet"
title: "Benchmark Rerankers"
color: "blue"
date: 2026-06-03
topics: ["rag-retrieval"]
related: ["hybrid-search-reranking", "cohere-rerank", "retrieval-engineer"]
featured: false
summary: "Reranking usually helps RAG — but it adds latency and cost, so prove the lift before you ship it. This command scores first-stage retrieval against reranked retrieval on a labeled query set (recall@k, nDCG@k) and reports whether the reranker earns its place."
---

## Scope

Treat `$ARGUMENTS` as the retrieval setup to benchmark — a path to an eval set and retrieval results, or a description of the pipeline (retriever, candidate count, reranker). Restate what you're comparing in one sentence before running.

Goal: quantify the lift a **reranker** adds over first-stage retrieval, so the decision to ship it (and pay its latency/cost) is measured, not assumed.

> [!NOTE]
> A reranker reorders candidates the retriever already found — it cannot recover an answer that first-stage retrieval missed. So always over-retrieve (top-25–50) before reranking, and measure recall at the **first stage** too.

## Step 1 — Establish the eval set

Use a labeled set of queries with known-relevant passages (gold spans). If none exists, say so and help build a small one (20–50 queries) before benchmarking — a benchmark without ground truth is theater.

## Step 2 — Produce two result sets

For each query, capture the **top-k before reranking** (raw retriever order) and the **top-k after reranking** (e.g. via [Cohere Rerank](/tools/cohere-rerank) or another cross-encoder), over the same candidate pool.

## Step 3 — Score both

Compute, for k ∈ {3, 5, 10}:

- **recall@k** — fraction of queries with a gold passage in the top-k.
- **nDCG@k** — rank-aware quality (rewards putting the right passage higher).
- **MRR** — mean reciprocal rank of the first gold passage.

Report a side-by-side table: metric | retriever-only | + reranker | delta.

## Step 4 — Weigh the cost

State the added **per-query latency** and **cost** of the rerank call. Reranking only the top candidates keeps both modest, but make the trade-off explicit.

## Step 5 — Recommend

Give a clear verdict: ship the reranker, skip it, or change candidate depth / rerank model. Justify it from the numbers — e.g. "+0.14 nDCG@5 for +90ms is worth it" or "negligible lift, not worth the latency here."

> [!WARNING]
> Don't tune the reranker against the same handful of queries you eyeball. Use the frozen eval set, and report all metrics, not just the one that improved.
