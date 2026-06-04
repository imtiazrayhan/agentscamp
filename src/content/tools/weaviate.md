---
name: "Weaviate"
title: "Weaviate"
description: "An open-source vector database with built-in hybrid search, pluggable vectorizer modules, and GraphQL/REST/gRPC APIs."
url: "https://weaviate.io"
date: 2026-06-04
pricing: "open-source"
category: "platform"
repo: "https://github.com/weaviate/weaviate"
license: "BSD-3-Clause"
sameAs: ["https://github.com/weaviate/weaviate", "https://docs.weaviate.io/weaviate"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["qdrant", "milvus", "pinecone"]
color: "green"
topics: ["rag-retrieval", "data-ml"]
tags: ["vector-database", "rag", "hybrid-search", "open-source"]
featured: false
summary: "Weaviate is an open-source, Go-based vector database with first-class hybrid search, a module system that can vectorize your data for you, and GraphQL/REST/gRPC APIs. Batteries-included is the pitch: it can embed, store, filter, and hybrid-search out of the box, self-hosted or as a managed cloud."
related: ["best-vector-database-2026", "qdrant", "milvus", "pinecone", "vector-search-engineer"]
---

Weaviate is an open-source vector database written in Go, built around the idea that the store should do more than hold vectors. Its **module system** can call an embedding provider (or a local model) to vectorize your objects on insert, so you can hand it raw text and let it manage embeddings — and its **hybrid search** fuses keyword (BM25) and vector scores natively rather than leaving you to wire fusion yourself.

It is aimed at teams who want a feature-rich, open-source store they can self-host or run as a managed cloud, with strong defaults for hybrid retrieval and multi-tenancy. You interact with it through GraphQL, REST, or gRPC and a set of well-supported client libraries.

## Highlights

- **Built-in hybrid search** — combine BM25 keyword scoring and vector similarity with a single query and tunable fusion weighting.
- **Vectorizer modules** — optional integrations that embed your data on ingest (OpenAI, Cohere, Hugging Face, local models), so the store owns the embedding step if you want it to.
- **Rich filtering & schema** — typed properties with metadata filtering, cross-references, and a defined collection schema.
- **Multi-tenancy** — isolate many tenants within a class efficiently, built for SaaS retrieval.
- **Self-host or managed** — run it via Docker/Kubernetes or use Weaviate Cloud; the core is open source.

## In an AI-assisted workflow

Query with hybrid search and a metadata filter using the Python client:

```python
import weaviate
from weaviate.classes.query import Filter

client = weaviate.connect_to_local()
docs = client.collections.get("Docs")

res = docs.query.hybrid(
    query="How do I rotate API keys?",
    alpha=0.5,                                  # 0 = keyword only, 1 = vector only
    filters=Filter.by_property("product").equal("billing"),
    limit=20,                                   # over-retrieve, then rerank
)
```

> [!NOTE]
> If you use a vectorizer module, Weaviate embeds both your objects and your queries with the same model automatically — convenient, but it means switching embedding models still requires re-vectorizing the collection, the same lock-in as any store.

## Good to know

Weaviate is free and open source under BSD-3-Clause and can be self-hosted with Docker or Kubernetes; **Weaviate Cloud** is the managed option with a free sandbox to start. Its module system is a real differentiator if you want the database to own embedding — otherwise, a leaner store like [Qdrant](/tools/qdrant) may be simpler. Compare the options in [Best Vector Database in 2026](/guides/database/best-vector-database-2026).
