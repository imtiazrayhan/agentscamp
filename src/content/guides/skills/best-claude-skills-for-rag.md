---
title: "10 Best Claude Skills for RAG"
description: "Compare Claude skills and commands for RAG scaffolding, chunking, grounding checks, embeddings, reranking, pgvector, index tuning, and GraphRAG."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["rag-retrieval", "llm-evals"]
audience: ["ai-engineers", "developers"]
tags: ["claude-skills", "rag", "retrieval", "embeddings", "vector-search", "best-of"]
seoTitle: "10 Best Claude Skills for RAG"
seoDescription: "The best Claude skills for RAG: scaffold a pipeline, tune chunking, check hallucinations, inspect embeddings, benchmark rerankers, and tune vector indexes."
summary: "Scaffold with scaffold-rag-pipeline, then use chunking-strategy-optimizer when answers miss content, hallucination-evaluator when they invent it, and embedding-set-inspector or benchmark-rerankers when retrieval is weak. Add scaffold-pgvector-schema and embedding-index-tuner for the vector store; the GraphRAG, document, and web skills are specialists."
keyTakeaways:
  - "Build a frozen eval set of real questions and gold passages first; the tuning and benchmarking picks will not measure without one."
  - "Fix retrieval before generation: if the right chunk never reaches the top-k, no prompt, reranker, or bigger model recovers it."
  - "Split hallucinations into retrieval failures and generation failures, because they have different owners and different fixes."
  - "A reranker only reorders what first-stage retrieval found, so measure first-stage recall and prove the reranker's lift against its latency and cost."
  - "Quantization and a low ef_search can silently drop the right document; measure recall against exact neighbors before shipping a down-tuned index."
  - "GraphRAG pays off only for multi-hop and whole-corpus questions; prove the lift on a corpus slice before extracting everything."
faq:
  - q: "Are there Claude skills for RAG?"
    a: "Yes. The AgentsCamp library includes skills for chunking sweeps, embedding health checks, vector index tuning, hallucination evaluation, GraphRAG experiments, document extraction, and web research, plus slash commands that scaffold a RAG pipeline, scaffold a pgvector schema, and benchmark rerankers."
  - q: "Which Claude skill should I use first when RAG answers are wrong?"
    a: "Run hallucination-evaluator on a labeled set to learn whether the answer was missing from the retrieved context or ignored by the model. Retrieval failures point to chunking-strategy-optimizer and embedding-set-inspector; generation failures point to cite-or-abstain prompting or a stronger model."
  - q: "Can Claude Code build a RAG pipeline?"
    a: "The scaffold-rag-pipeline command generates an idempotent ingestion path (load, clean, chunk, embed, upsert) and a retrieval path (embed the query, search, optionally rerank, and build a grounded prompt with citations) in your project's existing stack. It states its chunking, embedding, vector-store, and top-k choices up front and leaves an evaluation stub for your data."
  - q: "Do I need a skill or an agent for RAG work?"
    a: "Skills handle one measured job, such as a chunking sweep or an index-parameter sweep. The rag-pipeline-engineer agent owns the whole chain from ingestion to grounded generation, retrieval-engineer focuses on recall and precision, and vector-search-engineer owns the database layer."
related: ["guide:best-claude-skills-for-ai-apps", "guide:rag-debugging-checklist", "command:scaffold-rag-pipeline", "skill:chunking-strategy-optimizer", "skill:embedding-set-inspector", "skill:hallucination-evaluator"]
---

The best Claude RAG skills measure each stage instead of guessing at it. Chunking, embeddings, the vector index, reranking, and grounded generation fail in different ways, and a fix at one stage cannot rescue a failure upstream: if the right passage never reaches the top-k, no prompt or bigger model recovers it.

The picks below follow the order teams usually hit problems: standing a pipeline up, finding out why answers miss or invent content, tuning the store, and then handling specialized corpora. Seven are skills; three are slash commands.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [scaffold-rag-pipeline](/commands/scaffold/scaffold-rag-pipeline) (command) | A first pipeline in your stack | Ingestion, retrieval, eval stub | Yes |
| [chunking-strategy-optimizer](/skills/data/chunking-strategy-optimizer) | Answers that miss content | Ranked chunking configs | Runs sweeps |
| [hallucination-evaluator](/skills/data/hallucination-evaluator) | Confident, unsupported answers | Groundedness score | Proposes CI gate |
| [embedding-set-inspector](/skills/data/embedding-set-inspector) | Weak recall | Embedding health report | No |
| [benchmark-rerankers](/commands/review/benchmark-rerankers) (command) | Deciding on a reranker | Before/after metrics table | No |
| [scaffold-pgvector-schema](/commands/db/scaffold-pgvector-schema) (command) | Vectors in Postgres | Migration and HNSW index | Yes |
| [embedding-index-tuner](/skills/database/embedding-index-tuner) | Slow or memory-hungry search | Parameter sweep table | Runs sweeps |
| [multimodal-document-extractor](/skills/data/multimodal-document-extractor) | Typed fields from scans | Schema, extractor, checks | Yes |
| [web-research-pipeline](/skills/data/web-research-pipeline) | The live web as a source | Cited research brief | Yes (brief) |
| [graphrag-scaffolder](/skills/data/graphrag-scaffolder) | Multi-hop and global questions | Slice experiment and verdict | Yes |

## 1. scaffold-rag-pipeline: stand up a grounded pipeline in your stack

[scaffold-rag-pipeline](/commands/scaffold/scaffold-rag-pipeline) takes your data source and use case as its argument and first greps for the LLM clients and vector stores the project already uses, so it extends them instead of adding a parallel stack. It writes its key choices at the top of the generated code: natural-boundary chunking at roughly 400–800 tokens with 10–15% overlap, one pinned embedding model and dimension shared by both halves, and a top-k of 8–12 with an optional rerank down to 3–5.

Ingestion upserts by a content-derived ID, so re-runs replace changed chunks instead of duplicating them. Retrieval returns answers with their sources and says it has no information when nothing relevant comes back. It leaves an evaluation stub empty for your own question and source pairs.

## 2. chunking-strategy-optimizer: fix answers that miss obvious content

When RAG misses a passage you can see in the source, chunking is the first suspect. [chunking-strategy-optimizer](/skills/data/chunking-strategy-optimizer) builds a frozen eval set of 20–50 real questions with their gold passages, then sweeps a small grid: two or three strategies (recursive, sentence, semantic), two or three sizes, and overlap, with the embedding model and retriever held fixed. It scores retrieval only, with recall@k and nDCG@k, not the generated answers.

It recommends the smallest configuration that clears your recall target, since smaller chunks cost less to embed and store, and tells you to re-run the sweep after a new embedding model or new document types arrive.

## 3. hallucination-evaluator: measure what the answer invents

[hallucination-evaluator](/skills/data/hallucination-evaluator) grades faithfulness to the retrieved source, not world truth. It splits each answer into atomic claims and labels each supported, not supported, or contradicted, using an NLI model or an LLM judge told to use only the provided source. Its eval set deliberately includes questions whose answer is not in the context, where the correct behavior is to abstain.

For RAG, its most useful output is the split: was the answer present in what was retrieved? If not, fix retrieval; if it was and the model ignored it, fix the prompt or model. It reports a groundedness score plus abstention accuracy and sets a CI threshold. The [AI applications list](/guides/skills/best-claude-skills-for-ai-apps) covers it as a general grounding check.

## 4. embedding-set-inspector: rule out the embeddings

Before tuning the retriever, [embedding-set-inspector](/skills/data/embedding-set-inspector) checks that the vectors are sound: the expected dimensionality, normalization that matches the distance metric, and no zero, NaN, or near-zero-norm vectors left by failed chunks. It confirms documents and queries were embedded with the right input types, profiles pairwise similarity, finds near-duplicate boilerplate crowding the top-k, and spot-checks query neighbors.

Findings come back as severity, issue, affected count, and fix. It checks for a normalization or distance-metric mismatch first, which the skill calls the single most common embedding bug.

## 5. benchmark-rerankers: prove the reranker earns its latency

[benchmark-rerankers](/commands/review/benchmark-rerankers) scores the same candidate pool before and after reranking on a labeled query set, reporting recall@k, nDCG@k, and MRR at k of 3, 5, and 10 in a side-by-side table with deltas. It adds the per-query latency and cost of the rerank call and ends with a verdict: ship the reranker, skip it, or change the candidate depth or model.

Because a reranker can only reorder what the retriever found, it tells you to over-retrieve the top 25–50 candidates and to measure first-stage recall too. [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking) explains the mechanics.

## 6. scaffold-pgvector-schema: store vectors in Postgres correctly

[scaffold-pgvector-schema](/commands/db/scaffold-pgvector-schema) generates a migration in your project's existing tool (Prisma, Drizzle, Alembic, Flyway, and others) rather than hand-run DDL. It enables the `vector` extension, sizes the `vector(N)` column to the embedding model's exact dimension, matches the operator class to the metric (`vector_cosine_ops`, `vector_l2_ops`, or `vector_ip_ops`), adds an HNSW index plus B-tree indexes on filter columns, and emits a filtered nearest-neighbor query that over-retrieves for reranking.

It asks for the dimension if you do not give it, because changing it later means re-embedding the corpus. It does not embed or ingest data, and it recommends `CREATE INDEX CONCURRENTLY` on a large existing table.

## 7. embedding-index-tuner: hit a recall target at lower latency

[embedding-index-tuner](/skills/database/embedding-index-tuner) computes exact nearest neighbors for a fixed query set once, then measures the approximate index against them. It states the budget (recall target, p95 latency, memory), sweeps query-time `ef_search` first because it needs no rebuild, then `m`, `ef_construction`, and scalar, product, or binary quantization. It recommends the cheapest configuration that still clears the recall bar and gives the exact index change to apply.

The [database list](/guides/skills/best-claude-skills-for-database-work) frames it as general tuning; for RAG, run it when recall drops after quantization or search latency breaks the budget.

## 8. multimodal-document-extractor: pull typed fields from scans

[multimodal-document-extractor](/skills/data/multimodal-document-extractor) is for invoices, forms, receipts, statements, and IDs whose values must land in a schema for a database or downstream system, not as free text. It defines the schema first, prompts a vision-language model to fill it with structured output, splits multi-page documents while keeping page references, and verifies critical values with arithmetic and cross-field checks, routing low-confidence pages to human review.

It is not a general PDF-to-text parser; the skill itself says plain document Q&A needs only a VLM call. For parsing whole documents into chunks, compare the [document parsers for RAG](/guides/comparisons/best-document-parsers-for-rag-2026).

## 9. web-research-pipeline: retrieve from the live web with citations

When the source is the current web rather than an index, [web-research-pipeline](/skills/data/web-research-pipeline) breaks the question into two to five search angles, runs them through the available search tools, and reads the top three to six sources in full rather than trusting snippets. It tags each claim with its source and date, cross-checks load-bearing claims against a second independent source, and writes a brief in three layers: verified, reported but unverified, and unknown. It treats fetched pages as untrusted input, never as instructions.

## 10. graphrag-scaffolder: test GraphRAG on a slice first

[graphrag-scaffolder](/skills/data/graphrag-scaffolder) starts by collecting 15–30 queries your vector pipeline fails and classifying each as lookup, multi-hop, or global. If multi-hop and global questions do not dominate, it stops and counts that as a successful outcome. Otherwise it scopes a minimal ontology, builds extraction, entity resolution, community detection, and summaries on a 5–10% corpus slice, keeps the vector path behind a router, and reports per-class lift with full-corpus and re-indexing cost projections. Read [GraphRAG Explained](/guides/concepts/graph-rag) before committing to one.

## Agents for the whole pipeline

Three subagents cover larger RAG work. [rag-pipeline-engineer](/agents/data-ai/rag-pipeline-engineer) owns the chain from ingestion to grounded generation and gates each stage on a frozen eval set. [retrieval-engineer](/agents/data-ai/retrieval-engineer) raises recall and precision with hybrid search, reranking, and query transformation. [vector-search-engineer](/agents/data-ai/vector-search-engineer) designs the store's schema, index, filtering, and ingestion against a recall, latency, and cost budget.

## Recommended RAG stacks

For a new pipeline, scaffold it and install the measurement skills that catch the most common failures:

```bash
npx agentscamp add commands/scaffold-rag-pipeline
npx agentscamp add skills/chunking-strategy-optimizer
npx agentscamp add skills/hallucination-evaluator
npx agentscamp add skills/embedding-set-inspector
```

For a pipeline already running on Postgres, add the store and ranking tools:

```bash
npx agentscamp add commands/scaffold-pgvector-schema
npx agentscamp add skills/embedding-index-tuner
npx agentscamp add commands/benchmark-rerankers
```

Freeze the eval set before changing anything, and ask Claude to report recall@k, groundedness, and latency before and after each change. When a failure is hard to place, the [RAG debugging checklist](/guides/troubleshooting/rag-debugging-checklist) localizes it to ingestion, retrieval, ranking, or generation.

## Continue exploring

- [The Best Claude Skills to Install in 2026](/guides/skills/best-claude-skills-2026) — A skills-only tour of the AgentsCamp library, organized by the job each skill does.
- [How to Install Claude Skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
- [How RAG Actually Works](/guides/concepts/how-rag-works) — A practical walkthrough of each pipeline stage, where it fails, and how the pieces fit.
