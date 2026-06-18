---
title: "Vector Search at Scale: ANN Indexes, Quantization & Sharding"
description: "How to run vector search over millions to billions of vectors without blowing latency, memory, or cost — index families, quantization, filtering, and sharding."
author: "AgentsCamp"
color: "green"
topics: ["rag-retrieval", "data-ml"]
tags: ["vector-search", "ann", "hnsw", "quantization", "sharding", "rag"]
related:
  - "best-vector-database-2026"
  - "hybrid-search-reranking"
  - "choosing-embeddings-2026"
  - "vector-database"
  - "embedding"
featured: false
date: 2026-06-17
summary: "Vector search at scale is a three-way trade-off between recall, latency, and memory. HNSW gives fast, accurate in-memory search; IVF-PQ trades recall for a fraction of the RAM; flat is exact but linear. Pick the index for your recall target, quantize to fit RAM, shard for throughput, and measure recall against exact neighbours — not vibes."
keyTakeaways:
  - "Recall, latency, and memory form a triangle — you tune two and the third moves. Decide your recall floor first."
  - "HNSW is the default for in-memory, high-recall search; IVF-PQ wins when vectors won't fit in RAM."
  - "Quantize aggressively, then rescore the top candidates with full-precision vectors to recover recall."
  - "Always measure recall@k against an exact brute-force baseline on a held-out query set."
  - "Filtered search is where naive pipelines fall apart — pre-filtering breaks the graph, post-filtering breaks recall."
faq:
  - q: "HNSW or IVF-PQ for a billion vectors?"
    a: "If the index fits in RAM and you need high recall at low latency, HNSW. At a billion vectors that usually means hundreds of GB of RAM per replica, so most teams move to IVF-PQ (or DiskANN-style on-disk graphs) to compress vectors and keep memory bounded, accepting a small recall hit they recover with rescoring."
  - q: "How do I actually measure recall?"
    a: "Take a held-out set of a few thousand query vectors, compute exact nearest neighbours with a flat (brute-force) search, then run your ANN index and report recall@k — the fraction of true neighbours your index returns. Tune index parameters until recall@10 clears your floor (often 0.95+), then optimize latency."
  - q: "Does a smaller embedding dimension help at scale?"
    a: "Yes — memory and distance-computation cost scale linearly with dimension. A 768-dim model is roughly half the RAM and faster to search than a 1536-dim one. Many 2026 models support Matryoshka truncation, so you can shorten dimensions and re-measure recall instead of swapping models."
howtoSteps:
  - name: "Set a recall floor"
    text: "Decide the minimum recall@k your application can tolerate (e.g. recall@10 ≥ 0.95) before touching any index parameters."
  - name: "Build an exact baseline"
    text: "Compute exact nearest neighbours for a held-out query set with a flat index so you can measure recall objectively."
  - name: "Pick an index family"
    text: "Choose HNSW if the vectors fit in RAM and you need high recall; choose IVF-PQ or an on-disk graph if memory is the binding constraint."
  - name: "Quantize and rescore"
    text: "Apply scalar, product, or binary quantization to cut memory, then rescore the top candidates with full-precision vectors to recover recall."
  - name: "Shard and replicate"
    text: "Partition vectors across shards for capacity and add read replicas for throughput; scatter-gather queries and merge results."
  - name: "Tune against latency targets"
    text: "Raise search-time parameters (efSearch / nprobe) until recall clears your floor, then trim until p99 latency meets your SLO."
keywords:
  - "vector search at scale"
  - "ANN index"
  - "HNSW"
  - "IVF-PQ"
  - "vector quantization"
  - "vector database sharding"
---

**Vector search at scale is a three-way trade-off between recall, latency, and memory — you can tune any two, and the third moves.** At a few hundred thousand vectors almost any approach works. At tens of millions to billions, the choices you make about the approximate nearest neighbour (ANN) index, quantization, and sharding decide whether queries return in 10ms or 10s, and whether a replica costs $50/month or $5,000.

This guide is about the engineering past the toy demo: how to keep recall high while keeping latency and the RAM bill bounded. For picking the [vector database](/glossary/vector-database) engine itself, see [Best Vector Database 2026](/guides/database/best-vector-database-2026).

## The recall–latency–memory triangle

Every decision below collapses to one triangle:

- **Recall** — what fraction of the *true* nearest neighbours your index actually returns. This is the quality knob; low recall silently degrades your [RAG](/glossary/rag) answers.
- **Latency** — p50 and, more importantly, p99 query time under concurrency.
- **Memory** — bytes per vector times count, which dominates cost.

You do not get all three. HNSW buys recall and latency by spending memory. Product quantization buys memory by spending recall. The discipline is to **fix your recall floor first** (e.g. recall@10 ≥ 0.95), then optimize the other two against it — never the reverse.

## ANN index families and their trade-offs

**Flat (brute force).** Exact, no recall loss, trivially correct — and O(n) per query. Use it as the *baseline* you measure recall against, and in production only for small or heavily pre-filtered candidate sets (think <100k vectors per shard).

**HNSW (Hierarchical Navigable Small World).** The default for in-memory search. Builds a layered proximity graph; queries greedily walk it. Fast and high-recall, with two key knobs: `M` (graph connectivity, build-time) and `efSearch` (candidate breadth, query-time — raise it for recall, lower it for latency). The catch is **memory**: HNSW stores full vectors plus graph edges, so a billion 1536-dim float32 vectors is roughly 6TB before edges. That's the wall most teams hit.

**IVF / IVF-PQ (inverted file + product quantization).** Clusters vectors into `nlist` partitions; queries probe the nearest `nprobe` partitions instead of the whole set. Layering product quantization on top compresses each vector to a handful of bytes. IVF-PQ is **disk-friendly and memory-cheap** — the same billion vectors can drop to tens of GB — at the cost of recall, which you claw back with rescoring (below). Tuning is `nprobe` (higher = better recall, slower).

**On-disk graphs (DiskANN-style).** A middle path: graph-based recall with most of the index on SSD and a quantized copy in RAM. Worth it when datasets exceed RAM but you still want graph-quality recall.

Rule of thumb: if the full-precision index fits in RAM, use HNSW. The moment it doesn't, move to IVF-PQ or an on-disk graph rather than throwing money at bigger machines.

## Measuring recall (do this before tuning anything)

Recall is the one number people skip and the one that matters most. To measure it:

1. Sample a held-out set of a few thousand real query vectors.
2. Run a **flat/exact** search to get the true top-k neighbours.
3. Run your ANN index and compute **recall@k** — overlap between the two sets.

Tune `efSearch` (HNSW) or `nprobe` (IVF) until recall@k clears your floor, *then* push latency down. Re-measure whenever you change the embedding model, dimension, or quantization. "It feels relevant" is not a measurement.

## Quantization: cutting memory without wrecking recall

Quantization trades numerical precision for bytes:

- **Scalar quantization (SQ8)** — float32 → int8 per dimension. ~4x smaller, near-lossless recall. The free lunch; turn it on by default.
- **Product quantization (PQ)** — splits the vector into subvectors and encodes each against a learned codebook. 16–64x smaller, with a real recall hit.
- **Binary quantization** — 1 bit per dimension, ~32x smaller, Hamming-distance search. Brutal compression, only viable for models trained for or robust to it.

The pattern that makes aggressive quantization safe is **two-stage rescoring**: search the compressed index to fetch an over-large candidate set (say top-200), then re-rank those candidates with full-precision vectors to return the final top-10. You pay compressed-search latency for the bulk of the work and full-precision accuracy only on a tiny set. This is also where a [reranking](/guides/concepts/hybrid-search-reranking) stage naturally slots in.

## Dimensions and the embedding model's cost lever

Memory and per-query distance math scale **linearly with dimension**. A 768-dim model is roughly half the footprint and compute of a 1536-dim one. Before reaching for bigger machines, ask whether you need every dimension — many 2026 [embedding](/glossary/embedding) models support Matryoshka truncation, letting you shorten dimensions and re-measure recall. Choosing the model is itself a cost decision; see [Choosing Embeddings 2026](/guides/concepts/choosing-embeddings-2026).

## Filtered search: where pipelines quietly break

Real queries combine vector similarity with metadata filters ("docs from this tenant, last 90 days"). Two naive approaches both fail:

- **Pre-filtering** (filter, then search the survivors) gives correct results but breaks the ANN graph — HNSW assumes the full graph is reachable, so heavy filtering tanks recall or forces a brute-force fallback.
- **Post-filtering** (search top-k, then filter) keeps the index intact but **drops recall**: if your filter is selective, most of the top-k get discarded and you're left with too few results.

The scalable answer is filter-aware indexing — partition by high-cardinality filters (tenant, region) into separate shards so a filter becomes shard selection, and use engines with native filtered-HNSW that maintain reachability under predicates. Match this to your access patterns up front.

## Sharding, replication, and freshness

**Sharding** partitions vectors across nodes for capacity; queries scatter to all shards and gather-merge the results. **Replicas** add read throughput and HA. Keep shards balanced — a hot shard sets your p99.

Index freshness is the operational tax everyone underestimates:

- **Inserts** are cheap for HNSW (incremental) but degrade IVF centroids over time.
- **Deletes** are usually tombstones, not real removals — graphs accumulate dead nodes and recall drifts.
- **Rebuilds** are unavoidable: schedule periodic full reindexing (often offline into a new shard, then atomic swap) to reset centroids and purge tombstones.

For the Postgres/pgvector path specifically, lean on the [postgres-index-strategist](/skills/database/postgres-index-strategist) skill, and use the [embedding-index-tuner](/skills/database/embedding-index-tuner) skill to dial in HNSW/IVF parameters against a recall target.

## A scaling playbook

1. **Set a recall floor** (e.g. recall@10 ≥ 0.95) before touching parameters.
2. **Build an exact baseline** on a held-out query set.
3. **Pick the index family** by the RAM question: fits → HNSW, doesn't → IVF-PQ / on-disk.
4. **Quantize and rescore** — SQ8 by default, PQ + full-precision rescoring when memory is tight.
5. **Shard and replicate** — partition for capacity (and filters), replicate for throughput.
6. **Tune against latency** — raise `efSearch`/`nprobe` to clear the floor, then trim until p99 meets your SLO.

Done in this order, scaling vector search stops being guesswork: every knob has a number behind it, and you always know what you traded to turn it.