---
name: "turbopuffer"
title: "turbopuffer"
description: "A serverless vector and full-text search database built on object storage (S3/GCS/Azure) — usage-based pricing, hybrid search, and low cost per GB at scale."
url: "https://turbopuffer.com"
date: 2026-06-24
pricing: "paid"
category: "platform"
sameAs: ["https://turbopuffer.com", "https://turbopuffer.com/docs", "https://turbopuffer.com/blog", "https://x.com/turbopuffer"]
color: "blue"
topics: ["rag-retrieval", "mlops-ai-infra"]
tags: ["vector-database", "search", "serverless", "retrieval", "hybrid-search"]
featured: false
alternativeTo: ["pinecone", "qdrant", "weaviate", "lancedb", "pgvector"]
summary: "turbopuffer is a serverless vector and full-text search database built from first principles on object storage (S3, GCS, Azure Blob). Vectors and BM25 indexes live durably in cheap object storage and are cached on NVMe/RAM only when queried, so storage cost stays low at very large scale while hot data still serves fast. Pricing is usage-based across storage, writes, and queries."
related: ["best-vector-database-2026", "vector-search-at-scale", "pgvector-vs-pinecone", "how-embeddings-work", "hybrid-search-reranking"]
faq:
  - q: "What is turbopuffer?"
    a: "turbopuffer is a serverless vector and full-text search database built from first principles on object storage (S3, GCS, or Azure Blob). Your vectors and BM25 indexes are stored durably and cheaply in object storage, and pulled into an NVMe SSD and RAM cache only when queried — so storage stays inexpensive at very large scale while frequently accessed (warm) data still serves with low latency. It supports vector search, full-text/keyword search, and hybrid search, with namespaces for multi-tenancy."
  - q: "Is turbopuffer free, and how is it priced?"
    a: "turbopuffer is a proprietary, usage-based SaaS — you pay separately for storage, writes, and queries, which it positions as roughly 10x cheaper than RAM-first vector databases at scale. There is no perpetual free tier; plans carry minimum monthly commitments (a low-cost entry tier up through Scale and Enterprise tiers that add SSO, HIPAA BAA, BYOC, and private networking). Confirm current rates, tiers, and any trial credits on the official pricing page before you commit."
  - q: "How does turbopuffer compare to Pinecone?"
    a: "Both are managed, serverless vector search services, but the architectures differ. turbopuffer keeps data in object storage and caches hot data on NVMe/RAM, which makes cost-per-GB very low for large or mostly-cold corpora and many namespaces, at the cost of higher latency on cold reads. Pinecone is a more established managed service with its own serverless model. Choose turbopuffer when storage cost at scale and per-tenant isolation matter most; benchmark both on your own recall and latency targets."
---

turbopuffer is a **serverless vector and full-text search database built from first principles on object storage** (S3, Google Cloud Storage, or Azure Blob). Instead of keeping every vector in RAM, it stores your vectors, BM25 indexes, and metadata durably in cheap object storage and pulls data into an NVMe SSD and memory cache only when it's queried. The result is that storage cost stays low even at very large scale, while frequently accessed ("warm") data still serves with low latency.

It's aimed at teams that want low-cost vector search at scale — large RAG corpora, product search, and recommendation systems — especially when data outgrows a RAM-first database's price tag. The core tradeoff is latency: warm queries are fast, but the first ("cold") read of a namespace pays an object-storage round-trip. In a RAG or AI workflow, turbopuffer is the retrieval layer: you embed documents, upsert them, and query by vector and/or keyword to fetch context before generation.

## Highlights

- **Object-storage-backed** — vectors and indexes live durably in S3/GCS/Azure Blob, so storage cost per GB is low and you don't pay to keep everything in RAM.
- **Vector + full-text (hybrid) search** — combine dense vector search with BM25 keyword search in one engine to improve recall over either alone.
- **Usage-based pricing** — storage, writes, and queries are billed separately, which keeps mostly-cold datasets cheap; positioned as roughly 10x cheaper than RAM-first systems at scale.
- **Namespaces for multi-tenancy** — partition data into many independent namespaces, a natural fit for per-customer or per-tenant isolation at scale.

## In an AI-assisted workflow

Use turbopuffer as the retrieval store behind your generation step: write your embedded chunks into a namespace, then query by vector (optionally with a keyword/BM25 component and metadata filters) to pull context.

```ts
// Upsert embedded chunks into a per-tenant namespace
await ns.write({
  upsert_rows: [
    { id: "doc-1", vector: embed(text), content: text, product: "billing" },
  ],
});

// Query by vector, then over-retrieve and rerank downstream
const results = await ns.query({
  rank_by: ["vector", "ANN", embed("How do I rotate API keys?")],
  filters: ["product", "Eq", "billing"],
  top_k: 20,
});
```

Compare it against other engines in [Best Vector Database (2026)](/guides/database/best-vector-database-2026).

> [!TIP]
> turbopuffer shines when you have many namespaces or tenants and care about cost-per-GB more than absolute lowest latency. Keep in mind that cold reads from object storage carry a latency penalty (a cold namespace pays an object-storage round-trip before the NVMe/RAM cache warms up), so size your latency budget around warm-vs-cold access patterns and verify current numbers on the official site.

## Good to know

turbopuffer is a proprietary, usage-based SaaS — there's no public source and no perpetual free tier, with plans carrying minimum monthly commitments and higher tiers adding SSO, HIPAA BAA, BYOC, and private networking. Rates and tiers change, so confirm current storage/write/query pricing and any trial credits on the official pricing page before committing. For how object-storage-backed retrieval behaves as a corpus grows, see [Vector Search at Scale](/guides/database/vector-search-at-scale).
