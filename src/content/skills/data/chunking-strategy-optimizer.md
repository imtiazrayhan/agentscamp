---
name: "chunking-strategy-optimizer"
description: "Find the chunking strategy and size that maximizes retrieval quality for a specific corpus, by sweeping configurations against a fixed eval set instead of guessing. Use when RAG answers miss obvious content, when standing up a new corpus, or when picking chunk size/overlap."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-03
topics: ["rag-retrieval"]
related: ["how-rag-works", "chonkie", "rag-pipeline-engineer", "embedding-set-inspector"]
featured: false
summary: "Chunking quietly sets the ceiling on RAG quality. This skill turns 'pick a chunk size' from a guess into a measured decision: build a small retrieval eval set, sweep chunk strategies and sizes, score recall@k, and recommend the smallest config that hits the target."
---

Chunking is the highest-leverage, most-overlooked knob in retrieval: if the right passage never lands in a single chunk, no reranker or bigger model recovers it. This skill replaces "512 tokens with 50 overlap, because that's what the tutorial said" with a measured choice — sweep candidate strategies over a fixed eval set and pick the one that actually retrieves the answers.

## When to use this skill

- Standing up retrieval for a new corpus and you need a defensible chunking default.
- RAG answers miss content you can see exists in the source documents.
- Deciding chunk size, overlap, or strategy (token vs. sentence vs. recursive vs. semantic).
- Migrating embedding models and want to re-confirm chunking still holds up.

## Instructions

1. **Build a retrieval eval set first.** Collect 20–50 real questions and, for each, the passage(s) that contain the answer (the "gold" spans). Hand-label if needed — even 20 cases beat eyeballing. This set is the ground truth every configuration is scored against; freeze it.
2. **Define the candidate configurations.** A small grid, not a search of everything: 2–3 strategies (e.g. recursive, sentence, semantic) × 2–3 sizes (e.g. 256 / 512 / 1024 tokens) × overlap (0 / 10–15%). Hold the embedding model and retriever fixed so chunking is the only variable.
3. **Run each configuration end to end.** For each config: chunk the corpus (e.g. with [Chonkie](/tools/chonkie)), embed the chunks with the fixed model, index them, and run the eval queries.
4. **Score retrieval, not generation.** Report **recall@k** (does a gold passage appear in the top-k?) and a rank-aware metric like **nDCG@k** for k ∈ {5, 10, 20}. Generation quality is downstream noise here — measure whether the right chunk is retrieved at all.
5. **Pick the smallest config that clears the bar.** Prefer the configuration with the fewest/smallest chunks that hits your recall target — smaller chunks mean lower embedding cost, lower storage, and tighter prompts. Report the full table so the trade-off is visible.
6. **Re-check after any upstream change.** New embedding model, new document types, or a corpus that grew in a new direction all invalidate the result — re-run the sweep.

> [!WARNING]
> Never tune chunking without a frozen eval set and a baseline number. "The answers look better" is how silent recall regressions ship. If no eval set exists, building one is your first deliverable.

> [!TIP]
> Semantic chunking often wins on heterogeneous prose but costs embeddings at ingestion time; fixed-size recursive chunking is cheaper and frequently close. Let the numbers, not the brochure, decide.

## Output

A ranked table of configurations with recall@k and nDCG@k, the recommended configuration with its rationale, and the eval set itself (so the decision is reproducible and re-runnable).
