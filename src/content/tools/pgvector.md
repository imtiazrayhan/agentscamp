---
name: "pgvector"
title: "pgvector"
description: "An open-source Postgres extension that adds a vector type and HNSW/IVFFlat indexes for similarity search inside your existing database."
url: "https://github.com/pgvector/pgvector"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/pgvector/pgvector"
license: "PostgreSQL"
sameAs: ["https://github.com/pgvector/pgvector"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["pinecone", "qdrant"]
color: "blue"
topics: ["data-ml", "rag-retrieval"]
tags: ["vector-database", "postgres", "rag", "open-source"]
featured: false
summary: "pgvector turns Postgres into a vector database: it adds a vector column type, distance operators, and HNSW/IVFFlat indexes so you can run similarity search next to your relational data, with full SQL filtering and transactions — no separate vector store to operate."
related: ["guide:best-vector-database-2026", "command:scaffold-pgvector-schema", "agent:vector-search-engineer", "tool:qdrant", "tool:pinecone"]
faq:
  - q: "What is pgvector?"
    a: "pgvector is an open-source extension that gives Postgres a native vector type, distance operators, and approximate-nearest-neighbour indexes (HNSW and IVFFlat). Your embeddings live in the same database as your relational data — searchable with ordinary SQL, filterable with WHERE, and consistent inside the same transaction — so there's no separate vector database to deploy or sync."
  - q: "Is pgvector free?"
    a: "Yes — free and open source under the permissive PostgreSQL License, and it ships in most managed Postgres offerings, including Supabase, Neon, RDS, and Cloud SQL."
  - q: "When does pgvector stop being enough?"
    a: "It's the pragmatic default when you already run Postgres and have up to a few million vectors. For billion-scale workloads or heavy out-of-the-box quantization and sharding, weigh a dedicated store; the pgvectorscale extension can also push past in-memory limits while staying in Postgres."
  - q: "Should I use HNSW or IVFFlat with pgvector?"
    a: "HNSW for high recall and low latency; IVFFlat for smaller memory footprints. Both expose tuning parameters for the recall/speed trade-off — and match the operator class to your embedding model's distance metric (vector_cosine_ops, vector_l2_ops, or vector_ip_ops), since a mismatch silently degrades recall."
---

pgvector is an open-source extension that gives Postgres a native `vector` type, distance operators, and approximate-nearest-neighbour indexes. With it, your embeddings live **in the same database as your relational data** — searchable with ordinary SQL, filterable with `WHERE`, and consistent inside the same transaction. For a large share of RAG and semantic-search workloads, that means there's no separate vector database to deploy, sync, or back up.

It is aimed at teams who already run Postgres and want vector search without adding a system. You install the extension, add a `vector` column, build an index, and query with the distance operators — the rest of your schema, joins, and tooling keep working as they always did.

## Highlights

- **Vector types in Postgres** — `vector`, `halfvec` (half-precision), and `sparsevec`, with distance operators for L2 (`<->`), cosine (`<=>`), and inner product (`<#>`).
- **HNSW & IVFFlat indexes** — HNSW for high recall and low latency, IVFFlat for smaller memory footprints; both expose tuning parameters for the recall/speed trade-off.
- **SQL-native filtering** — combine similarity search with any `WHERE` clause, join, or `ORDER BY` — no separate metadata-filter API to learn.
- **Transactional & consistent** — inserts and updates to vectors are ACID, just like the rest of your data.
- **Scales further with extensions** — `pgvectorscale` adds StreamingDiskANN and better quantization to push past in-memory limits while staying in Postgres.

## In an AI-assisted workflow

Enable the extension, store embeddings beside your rows, index them, and query with a distance operator and a normal filter:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE docs ADD COLUMN embedding vector(1536);
CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);

-- nearest neighbours to the query vector, filtered by metadata
SELECT id, content
FROM docs
WHERE product = 'billing'
ORDER BY embedding <=> $1   -- $1 is the embedded query
LIMIT 20;                   -- over-retrieve, then rerank
```

> [!TIP]
> Match the operator class to your embedding model's distance metric — `vector_cosine_ops` for cosine, `vector_l2_ops` for Euclidean, `vector_ip_ops` for inner product. A mismatch silently degrades recall. To scaffold the schema and index, see [Scaffold a pgvector Schema & HNSW Index](/commands/db/scaffold-pgvector-schema).

## Good to know

pgvector is free and open source under the permissive PostgreSQL License and ships in most managed Postgres offerings (Supabase, Neon, RDS, Cloud SQL). It's the pragmatic default when you already run Postgres and have up to a few million vectors; for billion-scale or heavy out-of-the-box quantization and sharding, weigh a dedicated store — see [Best Vector Database in 2026](/guides/database/best-vector-database-2026). Tune the HNSW parameters against your recall target with the [Embedding Index Tuner](/skills/database/embedding-index-tuner).
