---
title: "How RAG Actually Works: Ingestion, Chunking, Retrieval & Reranking"
description: "A clear, practical walkthrough of the retrieval-augmented generation pipeline — what each stage does, where it fails, and how the pieces fit together."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["rag-retrieval"]
tags: ["rag", "retrieval", "embeddings", "concepts"]
featured: true
summary: "RAG works by retrieving relevant passages from your data and putting them in the model's context before it answers. The quality of the answer is capped by the quality of retrieval — so most of the engineering is in ingestion, chunking, embeddings, indexing, retrieval, and reranking, not in the prompt."
keyTakeaways:
  - "RAG = retrieve relevant context, then generate an answer grounded in it. The model only knows what you retrieve."
  - "Answer quality is capped by retrieval quality — a failure in an early stage can't be fixed by a later one."
  - "The pipeline is ingestion → chunking → embedding → indexing → retrieval → reranking → grounded generation."
  - "Chunking quietly sets the ceiling: if the answer never lands in one chunk, nothing downstream recovers it."
  - "Force citations and allow 'not found' — grounding the model in retrieved context is the main hallucination defense."
howtoSteps:
  - name: "Ingest"
    text: "Load source documents (docs, tickets, code, PDFs) and clean them — strip boilerplate, navigation, and duplicated headers/footers that would otherwise crowd retrieval."
  - name: "Chunk"
    text: "Split documents into passages sized to your embedding model and retrieval granularity. This is the highest-leverage knob; sweep strategies rather than guessing."
  - name: "Embed"
    text: "Turn each chunk into a vector with a retrieval-tuned embedding model, using the document input type for the corpus and the query input type at search time."
  - name: "Index"
    text: "Store vectors plus metadata in a vector database so you can run fast nearest-neighbour search with payload filtering."
  - name: "Retrieve"
    text: "Embed the question and pull a wide candidate set (top-25–50), ideally with hybrid dense + sparse search so exact terms aren't missed."
  - name: "Rerank"
    text: "Reorder the candidates with a cross-encoder and keep only the few most relevant passages to put in the prompt."
  - name: "Generate"
    text: "Give the model the question plus the top passages, instruct it to answer only from that context and cite sources, and allow an honest 'not enough information.'"
faq:
  - q: "What is retrieval-augmented generation (RAG)?"
    a: "RAG is a technique where, instead of relying only on what a model learned in training, you retrieve relevant passages from your own data at query time and put them in the model's context so it can answer grounded in current, specific information. It's how you make an LLM answer questions about your private docs, code, or knowledge base."
  - q: "Why does my RAG system hallucinate or miss obvious answers?"
    a: "Almost always because retrieval failed — the right passage never made it into the model's context. The model can only use what you retrieve, so if chunking, embeddings, or retrieval are weak, the model fills the gap by guessing. Fix retrieval (measure recall@k) before touching the prompt."
  - q: "Do I still need RAG if models have huge context windows?"
    a: "Often yes. Large context windows let you stuff more in, but cost, latency, and the 'lost in the middle' effect all grow with context size, and you still can't fit a whole knowledge base. RAG retrieves just the relevant slice, which is usually cheaper, faster, and more accurate than dumping everything in."
  - q: "What's the difference between RAG and fine-tuning?"
    a: "RAG injects knowledge at query time via retrieval; fine-tuning bakes behavior or style into the model's weights via training. RAG is the right tool for changing, factual knowledge you need cited; fine-tuning is for teaching a consistent format, tone, or task. They're complementary, not competitors."
related: ["hybrid-search-reranking", "choosing-embeddings-2026", "rag-pipeline-engineer", "chunking-strategy-optimizer", "building-an-mcp-server", "ml-engineer"]
---

Retrieval-augmented generation (RAG) is the most common way to make a language model answer questions about *your* data — private docs, a codebase, support tickets, contracts — instead of only what it absorbed in training. The idea is simple: **retrieve the relevant passages, then ask the model to answer using them.** The engineering is in making retrieval good, because **the answer can only be as good as what you retrieve.**

This guide walks the whole pipeline, what each stage is for, and where it tends to break.

## The one principle that explains everything

RAG is a pipeline of stages, and **a failure in an early stage cannot be repaired by a later one.** If the chunk containing the answer is never retrieved, no amount of prompt engineering or a bigger model will produce a correct, grounded answer — the model simply doesn't have the information. So the order of priority is: get retrieval right first, then improve generation. Teams who invert this — polishing the prompt while retrieval quietly fails — ship confident, wrong answers.

## The pipeline, stage by stage

### Ingestion

You load the source material and clean it. Messy formats are where this gets hard — PDFs, scans, and tables rarely come as clean text, so most teams reach for a parser like [LlamaParse](/tools/llamaparse), [Unstructured](/tools/unstructured), or [Docling](/tools/docling) to turn raw files into chunk-ready markdown or JSON. The unglamorous part matters: stripping navigation, repeated headers/footers, and boilerplate prevents that text from later dominating retrieval and crowding out real answers.

### Chunking

You split documents into passages — the units you'll embed and retrieve. This is the **highest-leverage and most-overlooked** stage. Chunks that are too large dilute meaning (and retrieve "sort of relevant" pages); too small and they lose the context that makes them answerable. There's no universal best size — it depends on your documents and embedding model — so you measure it rather than guess. (The [chunking-strategy-optimizer](/skills/data/chunking-strategy-optimizer) skill sweeps configurations against an eval set.)

### Embedding

Each chunk becomes a **vector** — a list of numbers positioning it in a semantic space where similar meanings sit close together. A retrieval-tuned embedding model is what makes "how do I rotate keys?" land near a passage titled "Credential rotation." Picking the model is a real decision with lock-in (changing it means re-embedding everything) — see [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026).

> [!NOTE]
> Many embedding models are *asymmetric*: embed your corpus with the "document" input type and the question with the "query" input type. Getting this wrong silently hurts retrieval.

### Indexing

Vectors (plus metadata like source, date, and tenant) go into a **vector database** built for fast nearest-neighbour search with filtering — for example [Qdrant](/tools/qdrant). The metadata lets you constrain retrieval ("only this product's docs") without losing recall.

### Retrieval

At query time you embed the question and pull the nearest chunks. The key move is to **over-retrieve** — grab a wide candidate set (top-25–50) — and to use **hybrid search** (dense vectors plus sparse/keyword matching) so that exact terms like error codes, IDs, and product names aren't missed by pure semantic similarity. The next guide, [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking), covers this in depth.

### Reranking

A first-stage retriever is fast but approximate. A **reranker** is a slower, more accurate cross-encoder that reads the query and each candidate *together* and reorders them by true relevance. You rerank the wide candidate set down to the few passages you actually put in the prompt. It's one of the cheapest, highest-impact upgrades to RAG quality.

### Generation

Finally, the model gets the question plus the top passages. Instruct it to **answer only from the provided context, cite the sources** it used, and say "I don't have enough information" when the context doesn't contain the answer. That grounding — not a clever system prompt — is your primary defense against hallucination.

## Where RAG goes wrong (and which stage to blame)

- **Wrong or vague answers** → usually **retrieval**: the right chunk wasn't in context. Measure recall@k before touching the prompt.
- **Misses exact terms** (codes, IDs, names) → add a **sparse/keyword** component (hybrid search).
- **Relevant chunk retrieved but ignored** → improve **reranking** or reduce the number of low-quality passages in the prompt.
- **Confident hallucinations** → tighten **generation**: enforce grounding, citations, and a valid "not found" path.
- **"Invisible" documents** → an **ingestion/chunking/embedding** bug (empty chunks, boilerplate domination, normalization mismatch). The [embedding-set-inspector](/skills/data/embedding-set-inspector) skill catches these.

## How to build it well

The throughline: treat RAG as a measured system. Build a small eval set of real questions with their gold passages, get **retrieval** right against it first, then layer reranking and grounded generation, and re-run the eval as a regression gate. For the end-to-end build, the [rag-pipeline-engineer](/agents/data-ai/rag-pipeline-engineer) agent owns exactly this workflow; for tuning the retrieval half in isolation, the [retrieval-engineer](/agents/data-ai/retrieval-engineer) does.
