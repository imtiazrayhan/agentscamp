---
name: "graphrag-scaffolder"
description: "Stand up a GraphRAG experiment the disciplined way: audit whether your failed queries are actually connection-shaped, scope a minimal entity/relationship ontology, build extraction → graph → community-summary indexing on a corpus slice, and measure against vector-RAG baselines before committing. Use when multi-hop or whole-corpus questions keep failing plain RAG."
allowed-tools: "Read, Grep, Glob, Write, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "green"
date: 2026-06-12
topics: ["rag-retrieval"]
related: ["graph-rag", "agentic-rag", "how-rag-works", "rag-pipeline-engineer", "vector-database", "zep"]
featured: false
summary: "A skill that builds GraphRAG as an experiment, not a leap of faith: it collects the queries vector RAG fails, confirms they're connection- or global-shaped, scopes the smallest ontology that serves them, scaffolds the pipeline on a corpus slice, and reports lift against the vector baseline with honest cost accounting — including the re-indexing bill."
---

GraphRAG is the most oversold upgrade in retrieval — and genuinely transformative for the right query shapes. This skill keeps you on the right side of that line: it builds the smallest GraphRAG that could prove value on *your* failures, measures it against your existing pipeline, and prices the ongoing bill before you commit.

## When to use this skill

- Multi-hop questions ("how is A exposed to C through B?") keep failing your vector RAG and you suspect structure is the answer.
- You need "global" answers over a whole corpus (themes, patterns, summaries) that top-k chunks structurally can't provide.
- Someone said "let's add a knowledge graph" and you want evidence before infrastructure.

## When NOT to use this skill

- Your RAG failures are ranking problems (right doc exists, wrong position) — fix retrieval first: hybrid search and reranking are cheaper and usually sufficient.
- The corpus churns rapidly — GraphRAG's re-extraction cost on updates may dominate; consider it only with an incremental-update plan.
- You need agent memory with temporal structure rather than corpus QA — that's a memory platform (Zep/Graphiti), not corpus GraphRAG.

## Instructions

1. **Build the failure set first.** Collect 15–30 real queries the current pipeline fails, and classify each: lookup (vector should handle — fix retrieval instead), multi-hop (graph traversal candidate), or global (community-summary candidate). If multi-hop+global don't dominate, stop and say so — that's a successful outcome of this skill.
2. **Scope the minimal ontology.** From the failure set, derive only the entity and relationship types those queries traverse (e.g. Company—supplies→Company, Service—depends-on→Service). Resist "extract everything": every extra type inflates extraction cost and noise.
3. **Scaffold the pipeline on a slice.** Pick a representative 5–10% corpus slice. Build: an LLM extraction pass emitting entities/relations per the ontology (with source-chunk provenance), graph assembly with entity resolution (merge duplicates deliberately), community detection, and LLM-written community summaries at 1–2 levels. Storage per scale: in-memory/parquet or Postgres first; a graph database only when scale demands.
4. **Wire the two query paths.** Local: resolve query entities → traverse 1–3 hops → collect connected evidence + provenance chunks → synthesize. Global: route corpus-level questions to community summaries. Keep the existing vector path alive — the end state is a router, not a replacement.
5. **Measure against baseline.** Run the failure set through both pipelines; score answer quality (human or LLM-judge with a rubric) and report per-class lift: GraphRAG should win multi-hop/global decisively and roughly tie lookups. Include extraction cost actually incurred, extrapolated to full corpus, plus the per-update re-indexing estimate.
6. **Recommend with the bill attached.** Ship the verdict: adopt (with the router architecture and update strategy), adopt-partially (graph for one domain), or don't (retrieval fixes suffice) — each with the evidence and the standing costs stated plainly.

> [!WARNING]
> Extraction quality is the whole game: a missed relationship is an unanswerable question, a hallucinated one is a wrong answer with confidence. Spot-check extractions against source text on every run, and keep provenance so any graph fact traces to its chunk.

> [!TIP]
> The slice-first discipline is the budget saver — full-corpus extraction before validation is how GraphRAG projects die. Prove lift on 10%, then spend.

## Output

A working GraphRAG experiment: the classified failure set, the scoped ontology, the pipeline code (extraction → graph → summaries → both query paths) on the corpus slice, the baseline-vs-graph evaluation with per-class results, full-corpus cost projections, and the adopt/partial/don't recommendation with its evidence.
