---
name: "LanceDB"
title: "LanceDB"
description: "An open-source embedded vector database on the Lance columnar format, with vector, full-text and hybrid search on local disk or object storage."
url: "https://lancedb.com"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/lancedb/lancedb"
license: "Apache-2.0"
sameAs: ["https://github.com/lancedb/lancedb", "https://docs.lancedb.com"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["chroma", "qdrant", "pgvector"]
color: "pink"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["vector-database", "rag", "embedded", "multimodal", "open-source"]
featured: false
summary: "LanceDB is an Apache-2.0 embedded vector database built on the Lance columnar format. It runs in your process with no server, stores tables on local disk or in S3, GCS or Azure storage, and offers vector, full-text and hybrid search with disk-based IVF indexes. LanceDB Enterprise is the distributed, sales-priced edition."
related: ["guide:best-vector-database-2026", "tool:chroma", "agent:vector-search-engineer", "skill:embedding-index-tuner"]
faq:
  - q: "How much does LanceDB cost?"
    a: "LanceDB Embedded is free and open source under Apache-2.0; you pay for the disk or object storage and the compute your application already runs on. LanceDB Enterprise, the distributed edition, has no public price list as of November 2026: the lancedb.com pricing URL leads to a contact form, and the docs direct you to sales for a proof of concept."
  - q: "Is there still a LanceDB Cloud?"
    a: "As of November 2026, LanceDB's README and documentation describe two products: LanceDB Embedded (open source) and LanceDB Enterprise, which is offered as a managed private deployment or bring-your-own-cloud. The current docs do not describe a self-serve, usage-priced cloud tier, so confirm with LanceDB before planning around one."
  - q: "Which vector indexes does LanceDB support?"
    a: "LanceDB Embedded builds IVF_FLAT, IVF_PQ, IVF_RQ and IVF_HNSW_SQ indexes, with l2, cosine, dot and hamming distance metrics. The docs call IVF_PQ the general-purpose default, IVF_RQ the choice for maximum compression on high-dimensional vectors, and IVF_HNSW_SQ the best recall and latency for unfiltered search. Without an index, search is an exact brute-force scan."
  - q: "Do I need to run maintenance on LanceDB?"
    a: "On LanceDB Embedded, yes. You call optimize() yourself to compact data files, add new rows to existing indexes and remove old table versions, and you create indexes with create_index(). LanceDB Enterprise runs that work as background jobs."
---

LanceDB is an open-source, **embedded** vector database built on **Lance**, a columnar data format designed for ML workloads. Like Chroma it runs in-process with no server to operate, but its indexes live on disk, and a table can sit on local storage or directly in **object storage** (S3, GCS or Azure Blob). The same code that runs a laptop prototype can search a dataset far larger than memory. Because the format is columnar, vectors, the original multimodal data and metadata sit together in one table.

The latest release is 0.41.0, published on October 29, 2026 (the same version on PyPI and npm), and the repository has about 12,000 GitHub stars as of November 2026. The company behind it also sells **LanceDB Enterprise**, a distributed edition it positions as a multimodal lakehouse for search, data curation and model training.

## Highlights

- **Embedded and serverless.** `lancedb.connect("./path")` opens a directory. There is no daemon, and data is Lance files you can copy or back up like any others.
- **Object storage as a backend.** Pass an `s3://`, `gs://` or `az://` URI in place of the local path.
- **Three search modes.** Vector search, full-text search over an FTS index, and hybrid search that fuses both, plus built-in reranking and SQL-style `where` filters.
- **Disk-based vector indexes.** `IVF_FLAT`, `IVF_PQ`, `IVF_RQ` and `IVF_HNSW_SQ`, with `l2`, `cosine`, `dot` and `hamming` metrics. The metric is fixed once an index is built.
- **Scalar indexes.** `BTREE` for mostly distinct values, `BITMAP` for low-cardinality columns, and `LABEL_LIST` for list columns filtered with `array_has_any` or `array_has_all`.
- **SDKs.** Python (`pip install lancedb`, Python 3.10+), TypeScript (`npm install @lancedb/lancedb`) and Rust, with LangChain and LlamaIndex integrations and Arrow, Pandas, Polars and DuckDB interoperability.

## In an AI-assisted workflow

```bash
pip install lancedb
```

Open a database (a directory or a bucket URI), create a table, and search it as a library. `embed()` below stands for whatever embedding function you use:

```python
import lancedb

db = lancedb.connect("./lancedb")              # or "s3://your-bucket/path"
table = db.create_table("docs", data=[
    {"vector": embed(text), "content": text, "product": "billing"},
])

res = (table.search(embed("How do I rotate API keys?"))
            .where("product = 'billing'")
            .limit(20)                          # over-retrieve, then rerank
            .to_list())

# Once the table is large enough that brute-force scans are slow:
table.create_index(metric="cosine", vector_column_name="vector")
table.optimize()                                # compact files, fold new rows into indexes
```

Search works with no index at all: LanceDB scans every vector and returns exact nearest neighbours, which is fine for small tables and gives 100% recall. The docs give no fixed row count for when to add an index; they say to measure, because the break-even depends on dimensions, hardware and your latency target.

> [!TIP]
> The object-storage backend suits large, mostly cold datasets: you pay for storage, not a running cluster. For high-QPS, low-latency serving you may still prefer an always-on server like [Qdrant](/tools/qdrant); compare the trade-offs in [Best Vector Database in 2026](/guides/database/best-vector-database-2026).

## Good to know

**Pricing.** LanceDB Embedded is free under Apache-2.0. LanceDB Enterprise is sold through sales, either as a managed private deployment in LanceDB's cloud accounts or installed in yours (bring-your-own-cloud). As of November 2026 there is no public price list, and the pricing URL on lancedb.com leads to a contact form.

**What Enterprise adds.** Per the docs' edition comparison: distributed search, indexing and compaction across a cluster, a distributed NVMe data cache, automatic maintenance, SQL analytics over Arrow Flight SQL, materialized views and computed columns, authentication, authorization and audit logs, and Kubernetes deployment. LanceDB publishes one Enterprise benchmark of p50 28 ms and p99 58 ms at 1 billion rows of 1,536-dimension vectors on fully cached data.

**Limits of Embedded.** It is a single process on one host, so query throughput is bounded by your application's machine, and there is no built-in authentication or access control. Maintenance is your job: without periodic `optimize()` calls, small files pile up and new rows stay outside the index. Queries against object storage pay network latency that a local NVMe disk does not.

**Version number.** The library is still on 0.x releases, so read the release notes before upgrading across minor versions.

Among alternatives, [Chroma](/tools/chroma) is the simpler embedded store but keeps its single-node HNSW index in RAM, which caps collection size by memory. [Qdrant](/tools/qdrant) is a dedicated server for always-on, low-latency serving. [pgvector](/tools/pgvector) keeps vectors in Postgres next to your relational data. LanceDB is the one to reach for when the dataset is too large for RAM but a dedicated search service is more than you want to operate. Tune its index against your recall target with the [Embedding Index Tuner](/skills/database/embedding-index-tuner).
