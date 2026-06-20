---
name: "Qdrant"
title: "Qdrant"
description: "An open-source vector database written in Rust, built for low-latency similarity search at scale."
url: "https://qdrant.tech"
date: 2026-06-03
pricing: "open-source"
category: "platform"
repo: "https://github.com/qdrant/qdrant"
license: "Apache-2.0"
sameAs: ["https://github.com/qdrant/qdrant", "https://qdrant.tech/documentation/"]
color: "red"
topics: ["rag-retrieval", "data-ml"]
tags: ["vector-database", "rag", "rust", "open-source"]
featured: false
alternativeTo: ["pinecone", "weaviate", "milvus", "chroma", "pgvector"]
summary: "Qdrant is an open-source, Rust-based vector database for storing embeddings and running fast similarity search with rich payload filtering, hybrid (dense + sparse) search, and on-disk quantization — the retrieval store behind many production RAG systems."
related: ["hybrid-search-reranking", "rag-pipeline-engineer", "cohere-rerank", "voyage-ai", "chonkie"]
faq:
  - q: "What is Qdrant?"
    a: "Qdrant is an open-source vector database written in Rust for storing embeddings and retrieving the nearest matches to a query vector. It pairs low-latency similarity search with structured payload filtering, hybrid dense + sparse search, and quantization options — and scales from a single Docker container to a distributed, sharded cluster."
  - q: "Is Qdrant free?"
    a: "Yes — free and open source under Apache-2.0, self-hostable with Docker or Kubernetes. Qdrant Cloud offers a managed option with a free tier for getting started."
  - q: "How do I use Qdrant in a RAG pipeline?"
    a: "Embed your chunks, upsert them as points with JSON metadata, then query with the embedded question plus an optional payload filter. A common pattern is to over-retrieve (top-20–50) and rerank with a cross-encoder before sending the top few passages to the model. Official SDKs cover Python, TypeScript/JavaScript, Rust, Go, and Java, plus REST and gRPC APIs."
---

Qdrant is an open-source vector database for storing embeddings and retrieving the nearest matches to a query vector. Written in Rust, it is built for low-latency search over large collections, and it pairs vector similarity with structured **payload filtering** so you can constrain results by metadata (tenant, date, document type) without sacrificing recall.

It is aimed at teams building retrieval-augmented generation (RAG), semantic search, recommendations, and deduplication who want a store they can self-host or run as a managed service. You can start with a single Docker container and scale to a distributed, sharded cluster as your data grows.

## Highlights

- **Hybrid search** — combine dense vectors with sparse (keyword/BM25-style) vectors and fuse the results, the pattern most production RAG systems converge on.
- **Payload filtering** — attach JSON metadata to each point and filter on it during search, with indexes that keep filtered queries fast.
- **Quantization** — scalar, product, and binary quantization shrink the memory footprint and speed up search, with optional on-disk storage for very large collections.
- **Distributed & resilient** — sharding and replication for horizontal scale and high availability.
- **Clients everywhere** — official SDKs for Python, TypeScript/JavaScript, Rust, Go, and Java, plus a REST and gRPC API.

## In an AI-assisted workflow

A typical RAG loop: embed your chunks (see [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026)), upsert them as points with metadata, then query with the embedded question and an optional filter.

```python
from qdrant_client import QdrantClient, models

client = QdrantClient(url="http://localhost:6333")
client.query_points(
    collection_name="docs",
    query=embed("How do I rotate API keys?"),
    query_filter=models.Filter(must=[
        models.FieldCondition(key="product", match=models.MatchValue(value="billing"))
    ]),
    limit=20,  # over-retrieve, then rerank down to top-5
)
```

> [!TIP]
> Over-retrieve from Qdrant (top-20–50) and rerank with a cross-encoder like [Cohere Rerank](/tools/cohere-rerank) before sending the top 5 to the model — see [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking).

## Good to know

Qdrant is free and open source under Apache-2.0 and can be self-hosted with Docker or Kubernetes. **Qdrant Cloud** offers a managed option with a free tier for getting started. Because it is infrastructure rather than a desktop app, plan for the operational basics — backups, monitoring, and capacity for your index size.
