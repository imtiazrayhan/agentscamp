---
title: "Hybrid Search & Reranking: From Top-50 Recall to Top-5 Precision"
description: "How production RAG combines dense and sparse search, fuses with RRF, and reranks — turning a wide candidate set into the few passages that actually answer."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["rag-retrieval"]
tags: ["rag", "hybrid-search", "reranking", "retrieval", "bm25"]
featured: false
summary: "Production retrieval rarely relies on vector search alone. The winning pattern is hybrid search — fuse dense (semantic) and sparse (keyword/BM25) results, usually with Reciprocal Rank Fusion — to get high recall, then rerank the wide candidate set with a cross-encoder down to the precise few passages you put in the prompt."
keyTakeaways:
  - "Dense (vector) search captures meaning; sparse (BM25) search captures exact terms. Real queries need both."
  - "Reciprocal Rank Fusion (RRF) merges the two ranked lists without tuning score scales — a robust default."
  - "Retrieve wide for recall (top-25–50), then rerank narrow for precision (top-3–5)."
  - "A reranker is a cross-encoder: slower but far more accurate because it reads query and passage together."
  - "Reranking can't recover an answer first-stage retrieval missed — fix recall before investing in precision."
howtoSteps:
  - name: "Retrieve dense"
    text: "Embed the query and pull the top-N nearest chunks from your vector index (e.g. top-50) for semantic matches."
  - name: "Retrieve sparse"
    text: "Run a keyword/BM25 search over the same corpus for the top-N exact-term matches (codes, IDs, rare names)."
  - name: "Fuse with RRF"
    text: "Combine the two ranked lists with Reciprocal Rank Fusion (score = sum of 1/(k + rank), k≈60) so each result's rank, not its raw score, decides the merge."
  - name: "Rerank"
    text: "Pass the fused candidate set plus the query to a cross-encoder reranker and reorder by true relevance."
  - name: "Cut to top-k"
    text: "Keep only the top 3–5 reranked passages — enough to answer, few enough to keep the prompt tight and grounded."
  - name: "Measure"
    text: "Score recall@k after fusion and nDCG@k after reranking on a labeled eval set; keep each stage only if it earns its latency and cost."
faq:
  - q: "What is hybrid search in RAG?"
    a: "Hybrid search combines dense vector search (which matches on meaning) with sparse keyword search like BM25 (which matches exact terms), then fuses the two ranked lists. It exists because each method fails where the other succeeds: vectors miss exact codes and rare names, keywords miss paraphrases and synonyms. Together they give much higher recall."
  - q: "What is Reciprocal Rank Fusion (RRF)?"
    a: "RRF merges multiple ranked result lists by scoring each item as the sum of 1/(k + rank) across the lists it appears in (k is a constant, commonly 60). Because it uses rank position rather than raw similarity scores, it sidesteps the problem that dense and sparse scores aren't on the same scale — making it a robust, near-zero-tuning default for hybrid search."
  - q: "Do I always need a reranker?"
    a: "Not always, but it's usually worth it. Reranking is one of the cheapest, highest-leverage upgrades to RAG precision because it reads the query and each passage together. The cost is added latency and per-query expense — so over-retrieve, rerank only the candidates, and measure the lift before shipping it."
  - q: "What's the difference between an embedding model and a reranker?"
    a: "An embedding model is a bi-encoder: it encodes the query and documents separately into vectors, which makes first-stage search fast and scalable but approximate. A reranker is a cross-encoder: it processes the query and a candidate passage jointly, which is far more accurate at judging relevance but too slow to run over the whole corpus — so you use it only on the retrieved candidates."
related: ["guide:how-rag-works", "agent:retrieval-engineer", "tool:qdrant", "tool:cohere-rerank", "command:benchmark-rerankers"]
---

Pure vector search is where most RAG demos start and most RAG production systems get stuck. Vectors match on *meaning*, which is exactly what you want for "how do I cancel my plan?" → "subscription termination." But they're surprisingly bad at *exact* matches — an error code like `ERR_2043`, a product name, a function identifier — because nothing is semantically "close" to an opaque token; it has to match. Production retrieval fixes this with two moves: **hybrid search** for recall, and **reranking** for precision.

## Dense + sparse: two retrievers, different blind spots

- **Dense (vector) search** encodes meaning. It nails paraphrases, synonyms, and conceptual matches, and it's robust to wording. It misses exact strings and rare tokens.
- **Sparse (keyword / BM25) search** matches terms. It nails codes, IDs, names, and exact phrases, and it's transparent. It misses anything phrased differently from the document.

Real user queries contain both kinds of intent, often in the same sentence ("why does `ERR_2043` happen when I rotate credentials?"). **Hybrid search runs both retrievers and fuses the results**, so you don't have to choose which class of query to fail.

## Fusing with Reciprocal Rank Fusion

The catch with combining two retrievers is that their scores aren't comparable — a cosine similarity of 0.82 and a BM25 score of 14.7 live on different scales, and normalizing them is fiddly and brittle. **Reciprocal Rank Fusion (RRF)** sidesteps the whole problem by using *rank* instead of *score*:

```text
RRF(d) = Σ  1 / (k + rank_i(d))      # k ≈ 60, sum over each list i that contains d
```

A document that ranks high in either list gets a strong combined score; one that ranks high in *both* gets a stronger one. There's essentially one knob (`k`), the default works well, and you avoid score-normalization entirely. That robustness is why RRF is the common default — many vector databases, including [Qdrant](/tools/qdrant), support hybrid queries with fusion built in.

> [!NOTE]
> You can weight dense vs. sparse if your workload skews one way, but start with plain RRF. It's a strong baseline that needs no tuning.

## Retrieve wide, rerank narrow

Hybrid search gets the right passage *into* the candidate set (recall). It doesn't guarantee it's at the *top* (precision). That's the reranker's job.

A **reranker** is a cross-encoder: it reads the query and a candidate passage together and scores their relevance directly. That joint reading is far more accurate than comparing two independently-made vectors — but it's too slow to run over a whole corpus, so you only run it on the candidates the first stage already found. The pattern:

1. **Over-retrieve** a wide set (top-25–50) with hybrid search — optimize for recall here.
2. **Rerank** that set with a cross-encoder like [Cohere Rerank](/tools/cohere-rerank).
3. **Keep the top 3–5** — enough to answer, few enough to keep the prompt tight and the model grounded.

> [!TIP]
> The single most common mistake is reranking too few candidates. If you only retrieve 5 and rerank them, the reranker can only reorder 5 — it can't add the answer that retrieval missed. Retrieve wide first.

## Prove it pays for itself

Both hybrid search and reranking add latency and cost, so don't add them on faith — measure. On a labeled eval set, track **recall@k after fusion** (did hybrid search get the answer into the candidate set?) and **nDCG@k after reranking** (did reranking move it to the top?). The [Benchmark Rerankers](/commands/review/benchmark-rerankers) command runs exactly this comparison, and the [retrieval-engineer](/agents/data-ai/retrieval-engineer) agent owns tuning the whole retrieval stage against the numbers.

For where these stages sit in the full pipeline, see [How RAG Actually Works](/guides/concepts/how-rag-works).

## Continue exploring

- [turbopuffer](/tools/turbopuffer) — A serverless vector and full-text search database built on object storage (S3/GCS/Azure) — usage-based pricing, hybrid search, and low cost per GB at scale.
