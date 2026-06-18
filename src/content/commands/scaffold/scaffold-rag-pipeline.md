---
description: "Scaffold a Retrieval-Augmented Generation pipeline — ingestion (load, chunk, embed, upsert) and retrieval (search, rerank, grounded prompt with citations) — fitted to the project's stack."
argument-hint: "<data source and use case>"
allowed-tools: "Read, Write, Glob, Grep"
title: "Scaffold RAG Pipeline"
color: "purple"
topics: ["rag-retrieval", "llm-app-dev"]
related: ["add-streaming-endpoint", "agent-memory-designer"]
featured: false
date: 2026-06-17
summary: "Scaffolds a Retrieval-Augmented Generation pipeline fitted to the project's stack: an idempotent ingestion half (load, clean, chunk, embed, upsert) and a retrieval half (embed query, vector search, optional rerank, assemble a grounded prompt with source citations). States the chunking, embedding, vector-store, and top-k choices up front and leaves a slot for evaluation."
faq:
  - q: "What chunking strategy should a RAG pipeline use?"
    a: "Chunk on natural boundaries (headings, paragraphs, code blocks) rather than a fixed character count, target roughly 400-800 tokens per chunk with 10-15% overlap, and attach source metadata (path, title, heading, line range) to every chunk. Chunk quality dominates retrieval quality — get this right before tuning anything else."
  - q: "How does the pipeline avoid hallucinated answers?"
    a: "Retrieval assembles a prompt that includes only the retrieved chunks and instructs the model to answer strictly from that context, cite each claim by source, and say it doesn't know when the context is insufficient — never falling back to parametric knowledge for grounded questions."
---

## Scope

Treat `$ARGUMENTS` as the data source(s) and the use case — e.g. "our markdown docs, for an in-app Q&A assistant" or "support tickets in Postgres, for answer suggestions". Restate it in one sentence to confirm before scaffolding.

If `$ARGUMENTS` is empty, ask one focused question: *"What are you retrieving over, and what's the use case?"* Do not scaffold a generic pipeline against an imagined corpus.

> [!WARNING]
> Chunking quality dominates retrieval quality. A great embedding model and a great vector store cannot rescue chunks that split a sentence in half or merge three unrelated sections. Spend your attention on Step 3, not on picking a fancier model.

## Step 1 — Detect the stack and existing AI dependencies

Before writing anything, ground the scaffold in what's already here:

1. Identify the language/runtime — `Glob` for `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, etc.
2. `Grep` for AI/RAG deps already in use: `openai`, `@anthropic-ai/sdk`, `anthropic`, `langchain`, `llamaindex`, `@ai-sdk`, and any vector store client (`pinecone`, `weaviate`, `chromadb`, `qdrant`, `pgvector`, `@supabase`).
3. `Grep` for an existing embeddings/vector call so you extend the project's conventions instead of introducing a parallel one.

Match the scaffold to what you find. If the project already has a vector store or an LLM client, build on it rather than adding a competing dependency.

## Step 2 — Decide and state the key choices

Write these decisions at the top of the generated code as a comment block, so they're reviewable and tunable. Pick concrete defaults — don't punt to "configurable":

- **Chunking** — split on natural boundaries (headings, paragraphs, code blocks), not a blind character count. Default: ~400-800 tokens per chunk, 10-15% overlap. Attach metadata to every chunk: `source`, `title`, `heading`, and a line/char range for citation.
- **Embedding model** — use the project's existing provider if one is present; otherwise pick a current general-purpose embedding model and pin the dimension. State it explicitly so ingestion and retrieval can never drift apart.
- **Vector store** — reuse what's installed; if nothing exists, default to whatever the deployment already runs (e.g. `pgvector` if there's a Postgres, otherwise a local store). Store the chunk text alongside the vector and metadata.
- **Retrieval** — default top-k of 8-12 candidates, then an optional rerank pass down to the 3-5 chunks actually placed in the prompt.
- **Generation** — when a generation model is needed (answer synthesis, rerank-by-LLM), default to Anthropic's latest, most capable model: `claude-opus-4-8`.

> [!NOTE]
> Pin the embedding model and dimension in one shared constant imported by both halves. If ingestion embeds with one model and retrieval queries with another, every search silently returns noise — and there's no error to catch it.

## Step 3 — Scaffold ingestion (idempotent, re-runnable)

Generate the ingestion path as: **load → clean → chunk → embed → upsert**.

- **Load** the source(s) from `$ARGUMENTS`.
- **Clean** — strip boilerplate, normalize whitespace, drop empty fragments.
- **Chunk** per the Step 2 strategy, carrying source metadata into each chunk.
- **Embed** each chunk in batches with retry/backoff.
- **Upsert** by a stable content-derived ID (e.g. a hash of `source` + chunk index + chunk text) so re-running the pipeline replaces changed chunks and skips unchanged ones instead of duplicating them.

Make it safe to run repeatedly against a partially-populated store — that's the whole point of a content-derived key.

## Step 4 — Scaffold retrieval (grounded, with citations)

Generate the query path as: **embed query → vector search → optional rerank → assemble grounded prompt**.

- Embed the incoming query with the **same** pinned model from Step 2.
- Vector-search for top-k candidates.
- Optionally rerank (cross-encoder or LLM-as-reranker) down to the few chunks that go in the prompt.
- Assemble a prompt that includes the selected chunks **and their source attributions**, instructing the model to answer only from the provided context, cite each claim by source, and say it doesn't know when the context doesn't cover the question.
- Return the answer **with the source list**, so the caller can render citations.

> [!WARNING]
> Never return an ungrounded answer. If retrieval finds nothing relevant, the pipeline must surface "I don't have information on that" — not let the model answer from parametric memory. An unsourced answer in a RAG system is a bug, not a fallback.

## Step 5 — Leave a slot for evaluation

Stub an evaluation entry point next to retrieval — a small harness that takes question/expected-source pairs and reports retrieval hit-rate and answer faithfulness. Leave it empty but wired in, with a comment on what to measure. Don't fabricate eval data; let the user supply it.

## Report

List every file you created and what each one does (ingestion, retrieval, shared config, eval stub). Then give the exact next steps to make it live:

1. Which credentials/env vars to set (embedding + generation API keys, vector-store connection).
2. The command to run ingestion against the real `$ARGUMENTS` source.
3. The single first query to verify retrieval returns grounded, cited results.

End with the one decision most worth revisiting after a first run — almost always the chunking strategy.