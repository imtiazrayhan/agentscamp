---
term: "Vector Database"
description: "A vector database stores embeddings and answers nearest-neighbor queries fast — the retrieval layer under RAG and semantic search, using ANN indexes like HNSW."
date: 2026-06-11
topics: ["rag-retrieval"]
tags: ["vector-database", "embeddings", "rag", "search", "hnsw"]
related: ["best-vector-database-2026", "embedding", "semantic-search", "rag", "pgvector", "qdrant", "embedding-index-tuner"]
faq:
  - q: "Do I need a dedicated vector database?"
    a: "Not always. pgvector adds vector search to the Postgres you already run, and at small-to-medium scale it's often the pragmatic choice. Dedicated engines (Qdrant, Pinecone, Weaviate, Milvus) earn their place with scale, filtering performance, hybrid search, and operational features — the decision tree is in our vector database guide."
  - q: "What is HNSW?"
    a: "Hierarchical Navigable Small World — the dominant approximate-nearest-neighbor index. It builds a layered graph over vectors so queries hop toward neighbors in logarithmic time instead of scanning everything, trading a little recall for orders-of-magnitude speed. Its parameters (M, efConstruction, efSearch) are the main tuning knobs."
---

**A vector database stores [embeddings](/glossary/embedding) and answers the query "which stored vectors are closest to this one?" fast enough for production — the retrieval layer beneath [RAG](/glossary/rag) and [semantic search](/glossary/semantic-search).**

The hard problem it solves is scale. Exact nearest-neighbor search means comparing the query against every vector — fine at ten thousand, hopeless at a hundred million. Vector databases use **approximate nearest neighbor (ANN)** indexes, dominated by HNSW graphs, to get sub-millisecond lookups at a small, tunable recall cost. Around that core they layer the production necessities: metadata filtering ("only docs from this tenant"), hybrid keyword+vector search, quantization to shrink memory, and replication.

The market splits three ways: **Postgres-native** ([pgvector](/tools/pgvector)) riding your existing database, **open-source engines** ([Qdrant](/tools/qdrant), Weaviate, Milvus, Chroma, LanceDB), and **managed services** (Pinecone). The honest decision guide — including when plain pgvector is the right answer — is [Best Vector Database in 2026](/guides/database/best-vector-database-2026); tuning the index you pick is the [embedding-index-tuner](/skills/database/embedding-index-tuner) skill's job.
