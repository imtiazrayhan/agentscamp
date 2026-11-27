---
name: "pgvector"
title: "pgvector"
description: "An open-source Postgres extension that adds a vector type and HNSW/IVFFlat indexes for similarity search inside your existing database."
url: "https://github.com/pgvector/pgvector"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/pgvector/pgvector"
license: "PostgreSQL"
sameAs: ["https://github.com/pgvector/pgvector"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["pinecone", "qdrant"]
color: "blue"
topics: ["data-ml", "rag-retrieval"]
audience: ["ai-engineers"]
tags: ["vector-database", "postgres", "rag", "open-source"]
featured: false
summary: "pgvector adds vector search to Postgres: vector, halfvec, bit and sparsevec types, six distance functions, and HNSW and IVFFlat indexes, queried with plain SQL next to your relational data. It is free under the PostgreSQL License. Two limits to know: indexed vector columns top out at 2,000 dimensions, and filters apply after an approximate index scan."
related: ["guide:best-vector-database-2026", "command:scaffold-pgvector-schema", "agent:vector-search-engineer", "tool:qdrant", "tool:pinecone"]
faq:
  - q: "What is the maximum vector size in pgvector?"
    a: "It depends on whether you index. A vector column can store up to 16,000 dimensions, but HNSW and IVFFlat indexes support the vector type only up to 2,000 dimensions. For larger embeddings, index as halfvec (up to 4,000 dimensions), binary-quantize to bit (up to 64,000), or use sparsevec (up to 1,000 non-zero elements)."
  - q: "Why does my filtered pgvector query return too few rows?"
    a: "With an approximate index, the WHERE clause is applied after the index scan. The README's example: if a filter matches 10% of rows and hnsw.ef_search is at its default of 40, only about 4 rows survive. Since 0.8.0 you can SET hnsw.iterative_scan = strict_order (or relaxed_order) so the scan keeps going until enough rows match, or use a partial index or partitioning."
  - q: "Should I use HNSW or IVFFlat with pgvector?"
    a: "HNSW is the usual choice: better speed-recall trade-off, and it can be created on an empty table. It builds slower and uses more memory. IVFFlat builds faster and smaller but needs data in the table first to pick its lists, and recall depends on the probes setting, which defaults to 1."
  - q: "Is pgvector free?"
    a: "Yes. It is open source under the PostgreSQL License with no paid edition. You pay for the Postgres it runs in, self-hosted or managed; the README links a list of hosted providers that include it."
---

pgvector is an open-source extension that gives Postgres vector types, distance operators, and approximate-nearest-neighbour indexes. Your embeddings live **in the same database as your relational data**: searchable with ordinary SQL, filterable with `WHERE`, joinable, and covered by the same transactions, backups and point-in-time recovery. The project has about 23,800 GitHub stars as of November 2026. The current release is 0.8.7 (October 1, 2026), which supports Postgres 13 and newer; the unreleased 0.9.0 changelog drops Postgres 13 and 14.

It is aimed at teams that already run Postgres and want vector search without operating a second system.

## Highlights

- **Four vector types.** `vector` (single precision), `halfvec` (half precision, half the storage), `bit` (binary) and `sparsevec` (sparse).
- **Six distance functions.** L2 (`<->`), inner product (`<#>`), cosine (`<=>`), L1 (`<+>`), plus Hamming (`<~>`) and Jaccard (`<%>`) for binary vectors.
- **HNSW and IVFFlat indexes.** [HNSW](/glossary/hnsw) defaults to `m = 16` and `ef_construction = 64`, with `hnsw.ef_search` (default 40) set per session or transaction at query time. IVFFlat takes a `lists` count at build time and `ivfflat.probes` at query time.
- **Exact search without an index.** Skip the index and you get exact nearest neighbours, which is often fast enough for a filtered subset of a few thousand rows.
- **Iterative index scans.** Added in 0.8.0: the scan continues until enough rows pass your filter, bounded by `hnsw.max_scan_tuples` (default 20,000).
- **Quantization built in.** Index a `vector` column as `halfvec` through an expression index, or binary-quantize with `binary_quantize()` and re-rank the top results by the original vectors.
- **Hybrid search.** Combine with Postgres full-text search and merge results with Reciprocal Rank Fusion or a cross-encoder.

## In an AI-assisted workflow

Install it (or use the Docker image), then enable it once per database:

```sh
docker pull pgvector/pgvector:pg19-trixie   # Postgres with pgvector preinstalled
# or: brew install pgvector  /  sudo apt install postgresql-19-pgvector
```

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE docs ADD COLUMN embedding vector(1536);
CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);

-- nearest neighbours to the query vector, filtered by metadata
BEGIN;
SET LOCAL hnsw.iterative_scan = strict_order;  -- keep scanning until 20 rows pass the filter
SELECT id, content
FROM docs
WHERE product = 'billing'
ORDER BY embedding <=> $1   -- $1 is the embedded query
LIMIT 20;                   -- over-retrieve, then rerank
COMMIT;
```

For a 3,072-dimension embedding model, the `vector` index limit forces a half-precision expression index instead:

```sql
CREATE INDEX ON docs USING hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);
SELECT id FROM docs ORDER BY embedding::halfvec(3072) <=> $1 LIMIT 20;
```

> [!TIP]
> Match the operator class to your embedding model's distance metric: `vector_cosine_ops`, `vector_l2_ops` or `vector_ip_ops` (and the `halfvec_` equivalents). The query operator must match the index's operator class or Postgres will not use the index. To generate the schema and index, see [Scaffold a pgvector Schema & HNSW Index](/commands/db/scaffold-pgvector-schema).

## Good to know

**Filtering happens after the index scan.** This is the most common pgvector surprise. A selective `WHERE` on top of an HNSW query can return fewer rows than your `LIMIT`. Fixes, in order of effort: iterative scans, a B-tree index on the filter column (so the planner can choose exact search on the subset), a partial index per value when there are few values, or partitioning when there are many.

**Index builds need memory.** HNSW builds are much faster when the graph fits in `maintenance_work_mem`; Postgres prints a notice when it no longer does. Raise it for the build session and add `max_parallel_maintenance_workers`, without exhausting the server.

**Recall is tunable, and unmeasured by default.** `ef_search = 40` and `probes = 1` are starting points. Build a small labelled query set and measure recall against exact search before trusting either; the [Embedding Index Tuner](/skills/database/embedding-index-tuner) skill walks through that.

**Storage adds up.** Each `vector` takes `4 * dimensions + 8` bytes, so a 1,536-dimension embedding is about 6 KB per row before the index. `halfvec` halves that.

**It scales with Postgres, not beyond it.** There is no built-in sharding. Past what one node handles comfortably you are into read replicas, partitioning, or an add-on such as pgvectorscale, a separate extension that adds a StreamingDiskANN index and its own quantization.

**Check the version your host gives you.** Run `SELECT extversion FROM pg_extension WHERE extname = 'vector';`. Iterative scans need 0.8.0 or later, and 0.8.6 and 0.8.7 fixed buffer overflows in IVFFlat index builds.

Against the alternatives: [Pinecone](/tools/pinecone) is a managed, serverless vector database with no servers to run and usage-based billing, at the cost of a second data store to keep in sync ([pgvector vs Pinecone](/guides/comparisons/pgvector-vs-pinecone) goes deeper). [Qdrant](/tools/qdrant) is an open-source dedicated vector engine with payload filtering, hybrid dense and sparse search, and on-disk quantization built in. If you already run Postgres and have up to a few million vectors, start here and move only when measurements say so. [Best Vector Database in 2026](/guides/database/best-vector-database-2026) lays out the wider field.
