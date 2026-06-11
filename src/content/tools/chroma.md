---
name: "Chroma"
title: "Chroma"
description: "An open-source, Python-first vector database that runs in-process — the fastest path from pip install to a working retrieval prototype."
url: "https://www.trychroma.com"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/chroma-core/chroma"
license: "Apache-2.0"
sameAs: ["https://github.com/chroma-core/chroma", "https://docs.trychroma.com"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["lancedb", "qdrant", "pgvector"]
color: "orange"
topics: ["rag-retrieval", "data-ml"]
tags: ["vector-database", "rag", "python", "open-source"]
featured: false
summary: "Chroma is an open-source, Python-first vector database that runs embedded in your process: pip install, create a collection, add documents, and query — often without wiring an embedding model yourself. The default for prototypes and notebooks, with a client-server mode and Chroma Cloud when you outgrow embedded."
related: ["best-vector-database-2026", "lancedb", "how-rag-works", "vector-search-engineer"]
faq:
  - q: "What is Chroma?"
    a: "Chroma is an open-source, Python-first vector database that runs in-process by default — no server to start. You pip install chromadb, create a collection, add documents, and query, and it ships a default embedding function so you don't have to wire an embedding provider to get started. That low-friction path is why it's the most common first vector store in prototypes and notebooks."
  - q: "Is Chroma free?"
    a: "Yes — Chroma is free and open source under Apache-2.0. When you outgrow embedded mode, it also runs as a client-server deployment, and Chroma Cloud offers a managed, serverless option with the same API."
  - q: "Chroma vs LanceDB?"
    a: "Chroma is the fastest store to start with. For embedded use at larger scale on disk or object storage, compare LanceDB; for an always-on server you operate, compare Qdrant."
---

Chroma is an open-source vector database designed for developer experience. It runs **in-process** by default — no server to start — so you can go from `pip install chromadb` to a working retrieval loop in a handful of lines, and it ships a default embedding function so you don't even have to wire an embedding provider to get started. That low-friction path is why Chroma is the most common first vector store in prototypes, notebooks, and demos.

It is aimed at developers building and iterating on retrieval who want to move fast and add infrastructure only when they need it. When you outgrow embedded, Chroma also runs as a **client-server** deployment, and **Chroma Cloud** offers a managed, serverless option with the same API.

## Highlights

- **Embedded by default** — runs inside your application process against local persistence; no separate service to deploy.
- **Batteries-included DX** — collections, a default embedding function, and metadata filtering in a small, friendly Python (and JS) API.
- **Metadata filtering** — attach metadata to documents and filter on it (`where` clauses) at query time.
- **Grows with you** — the same API runs in-process, as a client-server backend, or on managed Chroma Cloud.

## In an AI-assisted workflow

Create a collection, add documents (Chroma can embed them for you), and query:

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma")
docs = client.get_or_create_collection("docs")

docs.add(ids=["doc-1"], documents=["How to rotate API keys..."],
         metadatas=[{"product": "billing"}])

res = docs.query(
    query_texts=["How do I rotate API keys?"],
    n_results=20,                               # over-retrieve, then rerank
    where={"product": "billing"},
)
```

> [!TIP]
> Chroma's default embedding function is convenient for prototyping, but for production retrieval choose a retrieval-tuned model deliberately — see [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026). Switching the embedding model later means re-adding (re-embedding) your documents.

## Good to know

Chroma is free and open source under Apache-2.0. It's the fastest store to *start* with; for embedded use at larger scale on disk or object storage, compare it with [LanceDB](/tools/lancedb), and for a server you operate, with [Qdrant](/tools/qdrant). See [Best Vector Database in 2026](/guides/database/best-vector-database-2026) for where each fits.
