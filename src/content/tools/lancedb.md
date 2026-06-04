---
name: "LanceDB"
title: "LanceDB"
description: "An open-source embedded vector database built on the Lance columnar format — serverless, multimodal, and designed to scale on local disk or object storage."
url: "https://lancedb.com"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/lancedb/lancedb"
license: "Apache-2.0"
sameAs: ["https://github.com/lancedb/lancedb", "https://lancedb.github.io/lancedb/"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["chroma", "qdrant", "pgvector"]
color: "pink"
topics: ["rag-retrieval", "data-ml"]
tags: ["vector-database", "rag", "embedded", "multimodal", "open-source"]
featured: false
summary: "LanceDB is an open-source embedded vector database built on the Lance columnar format: it runs in-process with no server, persists to local disk or object storage (S3), and stores vectors alongside raw multimodal data and metadata — bridging laptop prototype to large-scale dataset without changing systems."
related: ["best-vector-database-2026", "chroma", "vector-search-engineer", "embedding-index-tuner"]
---

LanceDB is an open-source, **embedded** vector database built on **Lance**, a modern columnar data format optimized for ML. Like Chroma it runs in-process with no server to operate, but it's designed to scale: it persists to local disk or directly to **object storage** (S3 and friends), so the same code that runs a laptop prototype can search a very large dataset without standing up a cluster. Because it's built on a columnar format, it stores vectors, the original multimodal data, and metadata together in one place.

It is aimed at engineers who want embedded simplicity *and* a path to scale — RAG over large corpora, multimodal search, or feature/embedding storage — without running and paying for a dedicated search service. You query it as a library, and storage is just files (locally or in a bucket).

## Highlights

- **Embedded & serverless** — runs in your process; no separate service, and data is just Lance files on disk or in object storage.
- **Scales on object storage** — point it at S3 and search large datasets without provisioning nodes; storage and compute are decoupled by design.
- **Multimodal** — store vectors next to the raw data (text, images, and more) and metadata in the same table, thanks to the Lance columnar format.
- **Disk-based ANN** — IVF-PQ and related indexes search efficiently from disk, keeping memory cost low for large indexes.
- **Hybrid search & filtering** — combine vector search with full-text/keyword search and SQL-style metadata filters.

## In an AI-assisted workflow

Open a database (a directory or an S3 URI), create a table, and search it as a library:

```python
import lancedb

db = lancedb.connect("./lancedb")              # or "s3://bucket/lancedb"
table = db.create_table("docs", data=[
    {"vector": embed(text), "content": text, "product": "billing"},
])

res = (table.search(embed("How do I rotate API keys?"))
            .where("product = 'billing'")
            .limit(20)                          # over-retrieve, then rerank
            .to_list())
```

> [!TIP]
> LanceDB's object-storage backend makes it cost-effective for large, mostly-cold datasets — you pay for storage, not a running cluster. For high-QPS, low-latency serving you may still prefer an always-on server like [Qdrant](/tools/qdrant); compare the trade-offs in [Best Vector Database in 2026](/guides/database/best-vector-database-2026).

## Good to know

LanceDB is free and open source under Apache-2.0, with managed LanceDB Cloud/Enterprise options for teams that want them. It's the embedded store to reach for when [Chroma](/tools/chroma) is too small for your data but a dedicated server is more than you want to operate. Tune its disk index against your recall target with the [Embedding Index Tuner](/skills/database/embedding-index-tuner).
