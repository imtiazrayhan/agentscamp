---
name: "Milvus"
title: "Milvus"
description: "An open-source vector database built for billion-scale similarity search, with a distributed architecture and a wide menu of index types."
url: "https://milvus.io"
date: 2026-06-04
pricing: "open-source"
category: "platform"
repo: "https://github.com/milvus-io/milvus"
license: "Apache-2.0"
sameAs: ["https://github.com/milvus-io/milvus", "https://milvus.io/docs"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["qdrant", "weaviate", "pinecone"]
color: "cyan"
topics: ["rag-retrieval", "data-ml"]
tags: ["vector-database", "rag", "scale", "open-source"]
featured: false
summary: "Milvus is an open-source vector database engineered for scale — a distributed architecture that separates storage and compute and a broad set of index types (HNSW, IVF, DiskANN, GPU) for billion-vector search. Milvus Lite runs embedded for prototyping; Zilliz Cloud is the managed option."
related: ["best-vector-database-2026", "qdrant", "weaviate", "vector-search-engineer", "embedding-index-tuner"]
faq:
  - q: "What is Milvus?"
    a: "Milvus is an open-source vector database built for billion-scale similarity search. Its distributed architecture separates storage from compute so ingestion, indexing, and query capacity scale independently, and it offers a wide menu of index types — HNSW, IVF variants, DiskANN, and GPU-accelerated indexes. It's a graduated LF AI & Data Foundation project, originally from Zilliz."
  - q: "Is Milvus free?"
    a: "Yes — free and open source under Apache-2.0, self-hostable from a single binary up to a distributed cluster. Milvus Lite covers embedded/local prototyping with the same API, and Zilliz Cloud is the managed option when you don't want to operate the cluster."
  - q: "When should I choose Milvus over Qdrant or pgvector?"
    a: "When your scale genuinely justifies a distributed system — hundreds of millions to billions of vectors with independent scaling of storage and compute. A distributed Milvus cluster is real operational weight (sharding, replication, monitoring, capacity planning); for a few million vectors, a single Qdrant node or pgvector ships faster and costs less to run."
---

Milvus is an open-source vector database built from the ground up for **scale**. Its distributed architecture separates storage from compute, so you can grow ingestion, indexing, and query capacity independently and run similarity search over hundreds of millions to billions of vectors. It offers an unusually wide menu of index types — HNSW, IVF variants, DiskANN, and GPU-accelerated indexes — so you can match the index to your latency, memory, and cost constraints.

It is aimed at teams whose scale genuinely justifies a purpose-built, horizontally scalable system, and who want open source with a managed off-ramp. Milvus is a graduated project under the LF AI & Data Foundation, originally from Zilliz, which also offers the hosted Zilliz Cloud.

## Highlights

- **Built for billion-scale** — distributed, with separated storage and compute for independent scaling and high availability.
- **Many index types** — HNSW, IVF (Flat/PQ/SQ), DiskANN, and GPU indexes, so you can tune the recall/latency/cost trade-off precisely.
- **Hybrid search & filtering** — dense + sparse retrieval with fusion, plus scalar metadata filtering.
- **Milvus Lite** — a lightweight embedded build for local prototyping that uses the same API, so you can develop on a laptop and deploy to a cluster.
- **Managed option** — Zilliz Cloud runs Milvus for you when you don't want to operate the cluster.

## In an AI-assisted workflow

Develop against Milvus Lite locally with the same client you'll use in production:

```python
from pymilvus import MilvusClient

client = MilvusClient("docs.db")  # Milvus Lite (local file); same API as a cluster
client.create_collection(collection_name="docs", dimension=1536)

client.insert(collection_name="docs", data=[
    {"id": 1, "vector": embed(text), "product": "billing"},
])

res = client.search(
    collection_name="docs",
    data=[embed("How do I rotate API keys?")],
    filter='product == "billing"',
    limit=20,                                   # over-retrieve, then rerank
)
```

> [!WARNING]
> A distributed Milvus cluster is real operational weight — sharding, replication, monitoring, and capacity planning. Only take it on when your scale needs it; for a few million vectors, a single [Qdrant](/tools/qdrant) node or [pgvector](/tools/pgvector) ships faster and costs less to run.

## Good to know

Milvus is free and open source under Apache-2.0 and can be self-hosted from a single binary up to a distributed cluster; **Milvus Lite** covers embedded/local use and **Zilliz Cloud** the managed case. Choose it when you're genuinely at the scale that justifies its complexity — see where it fits in [Best Vector Database in 2026](/guides/database/best-vector-database-2026).
