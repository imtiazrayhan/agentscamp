---
name: "Chonkie"
title: "Chonkie"
description: "A lightweight, fast chunking library for RAG with many splitting strategies in one API."
url: "https://chonkie.ai"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/chonkie-inc/chonkie"
license: "MIT"
sameAs: ["https://github.com/chonkie-inc/chonkie", "https://docs.chonkie.ai"]
color: "green"
topics: ["rag-retrieval"]
tags: ["chunking", "rag", "python", "open-source"]
featured: false
summary: "Chonkie is a lightweight open-source library that turns documents into retrieval-ready chunks, with token, sentence, recursive, semantic, and code-aware chunkers behind one small API. Chunking quality sets the ceiling on RAG quality, and Chonkie makes good strategies easy to swap."
related: ["chunking-strategy-optimizer", "how-rag-works", "rag-pipeline-engineer", "qdrant"]
---

Chonkie is a lightweight, no-nonsense **chunking** library for RAG. Chunking — splitting documents into the passages you embed and retrieve — is the step that quietly sets the ceiling on retrieval quality, and Chonkie packages the strategies that matter behind one small, fast API so you can swap approaches without rewriting your pipeline.

It is aimed at engineers building retrieval pipelines who want sensible chunking without hand-rolling splitters or pulling in a heavy framework. Chonkie is small, has minimal dependencies, and is designed to be fast on large corpora.

## Highlights

- **Many chunkers, one API** — token, sentence, recursive, semantic, and code-aware splitting, swappable with a one-line change.
- **Semantic chunking** — group sentences by embedding similarity so chunks align with meaning, not just length.
- **Overlap and size control** — tune chunk size and overlap to match your embedding model's context and your retrieval granularity.
- **Lightweight & fast** — minimal dependencies and a small footprint, suitable for batch-processing large document sets.

## In an AI-assisted workflow

Chunk at ingestion, then embed and store the chunks:

```python
from chonkie import RecursiveChunker

chunker = RecursiveChunker(chunk_size=512)
chunks = chunker(document_text)
# embed each chunk and upsert into your vector DB (e.g. Qdrant)
```

> [!TIP]
> There is no universal best chunk size — it depends on your documents and embedding model. Try a few strategies and measure retrieval quality; the [Chunking Strategy Optimizer](/skills/data/chunking-strategy-optimizer) skill automates that sweep.

## Good to know

Chonkie is free and open source (MIT). It handles the chunking stage only — you bring your own embedding model and vector database for the rest of the pipeline (see [How RAG Actually Works](/guides/concepts/how-rag-works)).
