---
title: "pgvector vs Pinecone: Do You Need a Vector Database? (2026)"
description: "pgvector vs Pinecone with SQL and SDK examples: HNSW indexes, filtered search, dimension limits, read-unit math at 1M and 10M vectors, and when to move."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["rag-retrieval"]
audience: ["developers"]
tags: ["comparison", "pgvector", "pinecone", "postgres", "vector-database", "versus"]
featured: false
summary: "If you already run Postgres, start with pgvector: an HNSW index, a WHERE clause for filters, and embeddings in the same transaction as your rows. Move to Pinecone when you need serverless scale without operating a database, or per-tenant namespaces by the hundred thousand. Pinecone bills each query by namespace size, so partitioning decides the cost."
keyTakeaways:
  - "pgvector adds vector types and HNSW or IVFFlat indexes to Postgres. Filtering is ordinary SQL, and embeddings commit in the same transaction as the rows they describe."
  - "pgvector's index limit is 2,000 dimensions for the vector type and 4,000 for halfvec, so 3,072-dimension embeddings need half-precision indexing or binary quantization."
  - "Filters run after an approximate index scan in pgvector. Since 0.8.0, iterative index scans keep scanning until enough rows pass the filter."
  - "Pinecone meters storage, read units, and write units. A query costs 1 read unit per GB of the namespace searched (minimum 0.25), whatever top_k is."
  - "Pinecone now publishes pg_pinecone, an Apache-2.0 Postgres extension that can keep your SQL and move the index to Pinecone later, which lowers the cost of starting in Postgres."
faq:
  - q: "How far does pgvector scale?"
    a: "The hard limits are high: a non-partitioned Postgres table holds 32 TB by default, and a vector can have up to 16,000 dimensions (2,000 if you want to index it as a full-precision vector). The practical limit is memory. HNSW is fast while the graph fits in RAM, and index builds slow sharply once the graph no longer fits in maintenance_work_mem. Past that point the README's advice is halfvec, binary quantization with re-ranking, replicas, or sharding with Citus."
  - q: "What do I give up by choosing pgvector?"
    a: "Elastic scaling and a hands-off operations model. Your vectors share CPU, memory, and I/O with your transactional queries unless you move search to a replica. You tune the index yourself (m, ef_construction, ef_search). And in a shared HNSW index, one tenant's vectors affect recall and speed for others unless you partition."
  - q: "When is Pinecone the right call?"
    a: "When no one on the team should be operating a database for search, when traffic is spiky enough that paying per query beats paying for an idle instance, or when you need very many isolated tenants: namespaces per index range from 100 on the free Starter plan to 1,000,000 on Enterprise. It also fits when you want keyword and semantic search on the same text without running a second system."
  - q: "Can I use Pinecone from inside Postgres?"
    a: "Yes. pg_pinecone is an open-source extension for PostgreSQL 17 and 18 with three engines: pgvector's own index, a native engine that runs Pinecone's search inside Postgres with no account, and a remote engine that syncs the vector column to a Pinecone index while the rows stay in Postgres. Queries use pgvector's SQL operators on all three. It needs superuser access to install, so it does not run on every managed Postgres."
related: ["tool:pgvector", "tool:pinecone", "guide:best-vector-database-2026", "guide:qdrant-vs-pinecone", "command:scaffold-pgvector-schema", "guide:postgres-indexing-at-scale"]
sources:
  - title: "pgvector README"
    url: "https://github.com/pgvector/pgvector"
    publisher: "pgvector"
  - title: "pgvector changelog"
    url: "https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md"
    publisher: "pgvector"
  - title: "Understand Pinecone cost"
    url: "https://docs.pinecone.io/guides/cost/understand-cost"
    publisher: "Pinecone"
  - title: "Pinecone pricing and plan limits"
    url: "https://www.pinecone.io/pricing/"
    publisher: "Pinecone"
  - title: "Pinecone Database operation limits"
    url: "https://docs.pinecone.io/reference/api/database-limits/operation-limits"
    publisher: "Pinecone"
  - title: "pg_pinecone overview"
    url: "https://docs.pinecone.io/guides/pg-pinecone/overview"
    publisher: "Pinecone"
---

This comparison hides a better question: **do you need a separate vector database at all?** [pgvector](/tools/pgvector) is an extension that adds vector search to Postgres so that the answer can be "not yet". For many RAG applications, "not yet" lasts the life of the product.

## The short answer

- **Already on Postgres, corpus up to a few million vectors** → **pgvector**. One database, real SQL, no new vendor.
- **No appetite for running a database, spiky traffic, or thousands of isolated tenants** → **[Pinecone](/tools/pinecone)**.
- **Outgrowing pgvector but want to stay self-hosted** → a dedicated open-source engine; see [Qdrant vs Pinecone](/guides/comparisons/qdrant-vs-pinecone).

## The facts side by side

Checked on November 27, 2026.

| | pgvector | Pinecone |
| --- | --- | --- |
| What it is | Postgres extension | Managed service (serverless, plus bring-your-own-cloud) |
| Licence | PostgreSQL License (open source) | Proprietary service |
| Latest version | 0.8.7 (October 1, 2026) | Python SDK 10.3.0; API version 2026-07 |
| Index types | HNSW, IVFFlat; exact search with no index | Managed; you choose fields, not algorithms |
| Max indexed dimensions | 2,000 (`vector`), 4,000 (`halfvec`), 64,000 (`bit`) | 20,000 per dense vector |
| Storage per 1,536-dim vector | 6,152 bytes (`vector`), 3,080 bytes (`halfvec`) | 6,144 bytes plus ID and metadata |
| Filtering | SQL `WHERE`, joins to any table | Metadata filter operators (`$eq`, `$in`, `$gt`, `$and`), up to 40 KB of filterable metadata per document |
| Keyword search | Postgres full-text search, combined in SQL | BM25 full-text fields on the same index |
| Tenant isolation | Partitioning, partial indexes, or separate tables | Namespaces: 100 (Starter) to 1,000,000 (Enterprise) per index |
| Consistency with source rows | Same transaction | Asynchronous indexing after upsert |
| Pricing model | Free; you pay for the Postgres instance | Free Starter tier; paid plans meter storage, read units, write units, egress |

## pgvector in practice

The page's core claim is that filtering is a `WHERE` clause, so here it is.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
    id         bigserial PRIMARY KEY,
    tenant_id  bigint NOT NULL,
    doc_type   text NOT NULL,
    body       text NOT NULL,
    embedding  vector(1536)
);

-- Approximate index for cosine distance
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Ordinary B-tree for the filter column
CREATE INDEX ON chunks (tenant_id);

-- Filtered nearest-neighbor query
SET hnsw.iterative_scan = strict_order;

SELECT id, body, embedding <=> $1 AS distance
FROM chunks
WHERE tenant_id = 42 AND doc_type = 'policy'
ORDER BY embedding <=> $1
LIMIT 5;
```

A few details in that snippet matter more than they look.

**HNSW vs IVFFlat.** The README's summary: HNSW has a better speed-recall tradeoff, but builds slower and uses more memory, and it can be created on an empty table because it has no training step. IVFFlat builds faster and uses less memory but should be created after the table has data. Default to HNSW. Its defaults are `m = 16`, `ef_construction = 64`, and `hnsw.ef_search = 40` at query time; raise `ef_search` for recall at the cost of speed.

**Filters run after the index scan.** With an approximate index, pgvector scans the graph first and applies `WHERE` to what comes back. The README's own example: if a condition matches 10% of rows, with the default `ef_search` of 40 only about 4 rows survive. That is why the snippet sets `hnsw.iterative_scan`. Available since 0.8.0, it keeps scanning until enough rows pass the filter or it reaches `hnsw.max_scan_tuples` (20,000 by default). `relaxed_order` gives better recall with slightly out-of-order results.

**Other filtering tools.** For a filter that matches few rows, the B-tree index alone can give fast exact search. For a handful of distinct values, use a partial HNSW index (`WHERE (category_id = 123)`). For many values, such as tenants, use list partitioning so each tenant gets its own index.

**Dimension limits.** A `vector` column can hold 16,000 dimensions but can only be indexed up to 2,000. For 3,072-dimension embeddings, index at half precision:

```sql
CREATE INDEX ON chunks USING hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);
```

`halfvec` also halves storage (2 bytes per dimension instead of 4), and binary quantization with re-ranking shrinks the index further.

**Build time.** Index builds are much faster when the graph fits in `maintenance_work_mem`; Postgres prints a notice when it no longer does. On a production database, build on a replica or off-peak, because a large build competes with your application queries.

The [scaffold-pgvector-schema](/commands/db/scaffold-pgvector-schema) command generates a schema and index along these lines, and [Indexing Postgres at Scale](/guides/database/postgres-indexing-at-scale) covers the Postgres-side discipline.

## Pinecone in practice

Pinecone's current API centers on document indexes: typed JSON documents with a schema that declares which fields are searchable. (Indexes created through the older Vectors API still work and are labeled legacy in the docs.) Here is the same filtered search with your own embeddings:

```python
import os, time
from pinecone import Pinecone, SchemaBuilder

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

schema = (
    SchemaBuilder()
      .add_dense_vector_field(name="embedding", dimension=1536, metric="cosine")
      .build()
)
pc.indexes.create(name="chunks", schema=schema)
while not pc.indexes.describe(name="chunks").status.ready:
    time.sleep(2)
index = pc.index(name="chunks")

index.documents.upsert(
    namespace="tenant-42",
    documents=[
        {"_id": "1", "embedding": [0.1] * 1536, "doc_type": "policy",
         "body": "Refund requests must be submitted within 30 days."},
    ],
)

results = index.documents.search(
    namespace="tenant-42",
    top_k=5,
    score_by=[{"type": "dense_vector", "fields": ["embedding"], "values": [0.1] * 1536}],
    filter={"doc_type": {"$eq": "policy"}},
    include_fields=["body"],
)
```

Nothing here names an index algorithm, a memory setting, or a replica. That is the product. Two things to know:

- **Tenancy goes in the namespace, not the filter.** Pinecone's multitenancy guide calls filtering one big namespace by user ID an anti-pattern, because query cost follows namespace size.
- **Writes are indexed asynchronously.** The quickstart sleeps for ten seconds after an upsert before searching. If your application needs read-your-writes on vectors, that is a design constraint pgvector does not have.

Pinecone can also embed text for you (integrated embedding) and run BM25 on the same field, which removes two components from a RAG pipeline.

## Cost at 1M and 10M vectors

Dollar rates are on the [Pinecone tool page](/tools/pinecone); the arithmetic below is in the units Pinecone bills, which change less often. Assume 1,536-dimension embeddings and roughly 500 bytes of ID and metadata per document.

| | 1M vectors | 10M vectors |
| --- | --- | --- |
| Pinecone index size | about 6.6 GB | about 66 GB |
| Read units per query, one namespace | about 6.6 | about 66 |
| Read units per query, 1,000 equal tenant namespaces | 0.25 (the minimum) | 0.25 (the minimum) |
| pgvector table data, `vector` | about 6.2 GB | about 62 GB |
| pgvector table data, `halfvec` | about 3.1 GB | about 31 GB |

What this shows:

- **Pinecone query cost is linear in namespace size.** The docs give the rule directly: 1 read unit per GB of namespace, minimum 0.25, and `top_k` does not change it. A tenfold larger single namespace is ten times the cost per query. Splitting by tenant cuts it by orders of magnitude.
- **The free Starter tier does not fit this example.** It caps storage at 2 GB, about 300,000 such vectors.
- **pgvector's cost is the instance.** The table figures above exclude the HNSW index, which takes additional space, so plan memory for more than the raw data if you want the index cached. At 1M vectors that is a mid-sized instance you may already be paying for. At 10M full-precision vectors it is a large-memory instance, which is the point where `halfvec`, quantization, or a dedicated service starts to pay.
- **Query volume flips the answer.** A Postgres instance costs the same at one query per minute or a hundred per second. Pinecone at low volume costs close to its plan minimum; at sustained high volume on a large namespace, read units dominate, and Pinecone sells Dedicated Read Nodes as the fixed-capacity alternative.

## Where each one loses

**pgvector loses on isolation and elasticity.** Vector search and checkout queries share a buffer cache. A shared HNSW index lets one tenant's data affect another's recall. Scaling out means replicas or a sharding layer you operate. And every tuning decision (index parameters, memory, vacuum) is yours.

**Pinecone loses on joins, consistency, and exit cost.** Results come back as IDs and fields that you then join to your own database in application code. Indexing lags writes. You maintain a sync pipeline between your source of truth and the index, and a bug there means stale or missing search results. It is a proprietary service: there is no self-hosted Pinecone to fall back to, though bring-your-own-cloud runs it inside your cloud account.

## The middle path: pg_pinecone

Pinecone now ships [pg_pinecone](https://docs.pinecone.io/guides/pg-pinecone/overview), an Apache-2.0 extension for PostgreSQL 17 and 18. It keeps pgvector's SQL (`ORDER BY embedding <=> $1`) and lets you choose the engine per table: pgvector's index, a `native` engine that runs Pinecone's IVF-based search inside Postgres with no account, or a `remote` engine that searches on Pinecone while Postgres stays the system of record. Pinecone's docs position `native` for filtered, per-tenant search and `remote` for tables that outgrow one server. It needs superuser access to install, which rules out some managed Postgres services. It is new enough that you should test it on your own data before depending on it.

## How to choose

1. **Count vectors and dimensions, then do the memory math above.** Under a few million vectors at 1,536 dimensions or fewer, pgvector on your existing instance is the default.
2. **Look at your filters.** Selective filters on a shared index are pgvector's weak spot; turn on iterative scans and partition by tenant before concluding you have outgrown it.
3. **Decide whether transactional consistency matters.** If a document's permissions change and search must reflect it immediately, keeping vectors in the same transaction is worth a lot.
4. **Price the second system honestly.** Pinecone's bill is one line. The sync pipeline, the consistency bugs, and the second set of dashboards are the rest.
5. **Keep ingestion vendor-neutral.** Store chunks and metadata in your primary database either way. Then moving is an export and re-upsert, not a rewrite.

For the wider field, including Qdrant, Weaviate, Milvus, and the embedded engines, see [Best Vector Database in 2026](/guides/database/best-vector-database-2026).
