---
description: "Measure whether adding a reranker actually improves retrieval, by scoring reranked vs. un-reranked results on a labeled query set."
argument-hint: "<path to eval set / retrieval results, or a description of the pipeline>"
allowed-tools: "Read, Grep, Glob, Bash, Write, Edit"
model: "sonnet"
title: "Benchmark Rerankers"
color: "blue"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["rag-retrieval"]
audience: ["developers", "ai-engineers"]
related: ["guide:hybrid-search-reranking", "tool:cohere-rerank", "agent:retrieval-engineer"]
featured: false
summary: "Scores first-stage retrieval against reranked retrieval on a labeled query set and reports hit rate, nDCG, and MRR at k = 3, 5, and 10, plus per-query wins and losses and the added latency. It writes a small scoring script and a results file, then gives a ship, skip, or retune verdict from the numbers."
---

## Scope

Treat `$ARGUMENTS` as the retrieval setup to benchmark: a path to an eval set and retrieval results, or a description of the pipeline (retriever, candidate count, reranker). Restate what you are comparing in one sentence before running anything. If `$ARGUMENTS` is empty, ask for the eval set path and which reranker to test.

Goal: quantify the lift a **reranker** adds over first-stage retrieval, so the decision to ship it and pay its latency and cost is measured.

Files this command may create: a scoring script and result files under `evals/rerank/` (or the project's existing eval directory). It does not change the retrieval pipeline.

> [!NOTE]
> A reranker reorders candidates the retriever already found. It cannot recover a passage the first stage missed, so retrieve a deep pool (25 to 50 candidates) and measure first-stage recall on that pool before judging the reranker.

## When to use

- Before adding a reranker to a RAG pipeline, or when choosing between two rerank models or candidate depths.
- After changing the embedding model or chunking, since either can change how much a reranker helps.
- Not when there is no labeled data and no time to make any: without gold passages the result is opinion.

## Step 1: Establish the eval set

Look for an existing labeled set (Grep for `gold`, `relevant`, `qrels`, or look in `evals/`, `tests/`, `data/`). The target format is one JSON object per line:

```json
{"qid": "q-001", "query": "How do I rotate an API key?", "gold": ["doc-412#3", "doc-412#4"]}
```

`gold` holds the ids of the chunks that answer the query, using the same ids the index returns.

If none exists, say so and help build one before benchmarking: 30 to 50 real queries (from logs or support tickets, not written from the documents), each labeled with its answering chunk ids. Below about 30 queries, report results as indicative only.

## Step 2: Produce two result sets from one candidate pool

For each query, run the project's retriever once at depth N (default 50), then rerank those same N candidates with the reranker under test, such as [Cohere Rerank](/tools/cohere-rerank) or a local cross-encoder. Use the project's existing retrieval and rerank code. If a rerank call does not exist yet, write the smallest one, taking the model id and API call from the provider's current docs.

Time each rerank call (`time.perf_counter()` around the call only) and write one line per query to `evals/rerank/runs.jsonl`:

```json
{"qid": "q-001", "gold": ["doc-412#3"], "retriever": ["doc-88#1", "doc-412#3", "..."], "reranked": ["doc-412#3", "doc-88#1", "..."], "rerank_ms": 84.2}
```

Both lists are ordered best first and contain the same ids.

## Step 3: Score both

Write this to `evals/rerank/score.py` (standard library only) and run it with `python evals/rerank/score.py evals/rerank/runs.jsonl`:

```python
import json, math, statistics, sys

def hit(ranked, gold, k):
    return 1.0 if any(d in gold for d in ranked[:k]) else 0.0

def ndcg(ranked, gold, k):
    dcg = sum(1 / math.log2(i + 2) for i, d in enumerate(ranked[:k]) if d in gold)
    ideal = sum(1 / math.log2(i + 2) for i in range(min(len(gold), k)))
    return dcg / ideal if ideal else 0.0

def rr(ranked, gold):
    return next((1 / (i + 1) for i, d in enumerate(ranked) if d in gold), 0.0)

rows = [json.loads(line) for line in open(sys.argv[1]) if line.strip()]
mean = lambda xs: sum(xs) / len(xs)

pool = mean([hit(r["retriever"], set(r["gold"]), len(r["retriever"])) for r in rows])
print(f"queries={len(rows)}  first-stage hit rate on full pool={pool:.3f}")

for k in (3, 5, 10):
    for name, fn in (("hit", hit), ("ndcg", ndcg)):
        a = mean([fn(r["retriever"], set(r["gold"]), k) for r in rows])
        b = mean([fn(r["reranked"], set(r["gold"]), k) for r in rows])
        print(f"{name}@{k}: retriever={a:.3f} reranked={b:.3f} delta={b - a:+.3f}")

a = mean([rr(r["retriever"], set(r["gold"])) for r in rows])
b = mean([rr(r["reranked"], set(r["gold"])) for r in rows])
print(f"mrr: retriever={a:.3f} reranked={b:.3f} delta={b - a:+.3f}")

diffs = [ndcg(r["reranked"], set(r["gold"]), 10) - ndcg(r["retriever"], set(r["gold"]), 10) for r in rows]
print(f"per-query ndcg@10: better={sum(d > 0 for d in diffs)} worse={sum(d < 0 for d in diffs)} same={sum(d == 0 for d in diffs)}")

ms = sorted(r["rerank_ms"] for r in rows if "rerank_ms" in r)
if ms:
    print(f"rerank latency ms: p50={statistics.median(ms):.0f} p95={ms[max(0, math.ceil(0.95 * len(ms)) - 1)]:.0f}")
```

What the metrics mean:

- **hit@k**: fraction of queries with at least one gold chunk in the top k (often reported as recall@k when each query has one gold chunk).
- **nDCG@k**: rank-aware quality with binary relevance; rewards placing gold chunks higher.
- **MRR**: mean reciprocal rank of the first gold chunk.
- **First-stage hit rate on the full pool**: the ceiling. If it is low, fix retrieval first; no reranker can help those queries.

## Step 4: Weigh the cost

- **Latency**: report p50 and p95 of the rerank call from the script output.
- **Cost**: read the provider's pricing unit from its pricing page (per search, per token, or GPU time for a self-hosted model) and multiply by expected query volume. If you cannot read the current price, state the formula and leave the number for the user. Do not guess a price.

## Step 5: Recommend

Default decision rules; say which one applied:

- **Fix retrieval first** if the first-stage hit rate on the full pool is under 0.90: the reranker's ceiling is too low to judge it.
- **Skip** if the nDCG@10 delta is under +0.02, or if nearly as many queries got worse as got better. That is noise at this sample size.
- **Ship** if nDCG@5 or hit@3 improves clearly (around +0.05 or more), more queries improve than regress by a wide margin, and p95 rerank latency fits the feature's latency budget.
- **Retune** in between: try a smaller N (less latency) or a larger N (more recall), or a different rerank model, and re-run Steps 2 and 3.

## Output

```markdown
## Reranker benchmark: <retriever> vs <retriever> + <reranker>
Eval set: <n> queries (`<path>`), candidate pool N=<n>, first-stage hit rate on pool: <x>

| Metric | Retriever only | + Reranker | Delta |
| --- | --- | --- | --- |
| hit@3 / hit@5 / hit@10 | ... | ... | ... |
| nDCG@3 / nDCG@5 / nDCG@10 | ... | ... | ... |
| MRR | ... | ... | ... |

Per-query nDCG@10: <b> better, <w> worse, <s> unchanged
Rerank latency: p50 <x> ms, p95 <y> ms | Cost: <figure or formula>

**Verdict: <ship | skip | retune | fix retrieval first>** because <the numbers that decided it>
Queries the reranker made worse: <up to 5 qids with a one-line note each>
Files written: `evals/rerank/runs.jsonl`, `evals/rerank/score.py`
```

> [!WARNING]
> Report every metric, including the ones that went down, and do not tune the reranker or candidate depth against the same queries you report on. If you iterate, hold out part of the set for the final number.
