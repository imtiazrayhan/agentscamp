---
name: "embedding-index-tuner"
description: "Tune a vector index — HNSW graph parameters and quantization — to hit a recall target at the lowest latency and memory, by sweeping settings against a fixed query set instead of trusting defaults. Use when vector search is slow or memory-hungry, when recall dropped after enabling quantization, or when standing up an index and you need defensible parameters."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["data-ml", "rag-retrieval"]
related: ["best-vector-database-2026", "vector-search-engineer", "pgvector", "qdrant", "embedding-set-inspector"]
featured: false
summary: "Vector-index defaults are rarely right for your workload. This skill makes index tuning measured: fix a query set and recall target, sweep HNSW parameters (m, ef_construction, ef_search) and quantization modes, and recommend the cheapest, fastest configuration that still clears the recall bar."
---

A vector index has knobs, and the defaults are a guess about a workload that isn't yours. HNSW graph parameters and quantization each trade **recall** against **latency** and **memory** — and the recall loss is invisible unless you measure it. This skill replaces "enable quantization and hope" with a sweep: hold the data and queries fixed, vary the index settings, and pick the configuration that hits your recall target at the lowest cost.

## When to use this skill

- Vector search is too slow (p95 latency over budget) or uses too much memory, and you want to know which parameter to move.
- Recall dropped after you enabled quantization or lowered an HNSW search parameter, and you need to find a safe setting.
- Standing up a new index and you want defensible parameters instead of copy-pasted defaults.
- Validating that an index still meets its recall target after a corpus or embedding-model change.

## Instructions

1. **Fix the ground truth.** Use a labeled query set (20–50+ queries with known-relevant document IDs). For an approximate index, the gold standard is the **exact** (brute-force / flat) nearest neighbours for each query — compute them once so you can measure recall *of the approximate index against exact search*, not just against human labels.
2. **State the budget.** Write down the recall target (e.g. recall@10 ≥ 0.95), the p95 latency ceiling, and the memory/storage ceiling. The sweep optimizes cost subject to these.
3. **Sweep HNSW build/search parameters.** Vary `m` and `ef_construction` (build-time: higher = better recall, more memory and slower builds) and `ef_search` / `hnsw.ef_search` (query-time: higher = better recall, slower queries). Query-time parameters are cheap to sweep because they don't require a rebuild — sweep those first.
4. **Sweep quantization.** Test scalar, product, and binary quantization (and binary + rescoring where supported). Each shrinks memory and speeds search at some recall cost; measure the cost rather than assuming it's acceptable.
5. **Measure each configuration the same way.** For every setting, record recall@k (vs. exact neighbours), p95 query latency, and index memory/size. Hold the embedding model, data, and query set constant so the index is the only variable.
6. **Recommend the cheapest config that clears the bar.** Report the full sweep as a table and pick the lowest-latency/lowest-memory setting that still hits the recall target. Note the trade-off explicitly (e.g. "binary quantization with rescoring: recall@10 0.96, p95 −60%, memory −75%").

> [!WARNING]
> "Search still returns results" is not a recall measurement. Quantization and low `ef_search` can quietly drop the right document from the top-k while still returning *something* plausible. Always measure recall against exact neighbours before shipping a down-tuned index.

> [!NOTE]
> Query-time parameters (`ef_search`) tune without a rebuild — sweep them first and you may hit your latency budget without touching build parameters or quantization at all. Build-time parameters (`m`, `ef_construction`) and quantization mode require re-indexing, so change them deliberately.

## Output

A sweep table (configuration → recall@k, p95 latency, memory), the recommended configuration with its rationale, and the exact index-definition change (DDL or client call) to apply it — reproducible, so the next corpus change can re-run the same sweep.
