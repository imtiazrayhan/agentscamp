---
name: "Chroma"
title: "Chroma"
description: "An open-source vector database that runs in-process from pip install chromadb, with a single-node server mode and the usage-billed, serverless Chroma Cloud."
url: "https://www.trychroma.com"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/chroma-core/chroma"
license: "Apache-2.0"
sameAs: ["https://github.com/chroma-core/chroma", "https://docs.trychroma.com"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["lancedb", "qdrant", "pgvector"]
color: "orange"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["vector-database", "rag", "python", "open-source"]
featured: false
summary: "Chroma is an Apache-2.0 vector database that runs inside your Python or JavaScript process, embeds documents for you with a default model, and filters on metadata and document text. The same API runs as a single-node server or on Chroma Cloud, a serverless service billed by data written, stored and queried."
related: ["guide:best-vector-database-2026", "tool:lancedb", "guide:how-rag-works", "agent:vector-search-engineer"]
faq:
  - q: "How much does Chroma Cloud cost?"
    a: "As of November 2026, Chroma's pricing page lists a Starter plan at $0 a month plus usage with $5 in free credits, a Team plan at $250 a month plus usage with $100 of included usage, and custom Enterprise pricing. Usage is $2.50 per GiB written, $0.33 per GiB stored per month, $0.0075 per TiB queried and $0.09 per GiB returned. The open-source database itself is free under Apache-2.0."
  - q: "How many vectors can Chroma handle on one machine?"
    a: "Chroma's single-node index is HNSW held in RAM, so memory sets the ceiling. Its own benchmark, with 1,024-dimension embeddings and small documents, puts the approximate maximum at 250,000 records on 2 GB of RAM, 1.7 million on 8 GB, and 15 million on 64 GB. The architecture docs describe single-node as suited to fewer than 10 million records across a handful of collections."
  - q: "Which embedding model does Chroma use by default?"
    a: "If you add documents without embeddings, Chroma embeds them with the Sentence Transformers model all-MiniLM-L6-v2, run locally. You can pass a different embedding function when you create a collection, or supply your own vectors. In JavaScript the default model lives in a separate package, @chroma-core/default-embed."
  - q: "Does Chroma support hybrid search?"
    a: "On Chroma Cloud, yes: the Search API combines dense and sparse vectors and fuses rankings with Reciprocal Rank Fusion. Chroma's docs say the Search API is available in Chroma Cloud only, with single-node support planned. Local and single-node Chroma offer dense vector search plus metadata filters and document filters ($contains and $regex)."
---

Chroma is an open-source vector database from the company of the same name, licensed Apache-2.0. It runs **in-process** by default: `pip install chromadb`, create a collection, add documents, and query, with no server to start and no embedding provider to wire up. The same API also runs as a single-node server and on **Chroma Cloud**, the company's managed, serverless version of its distributed architecture.

The latest tagged release is 1.5.9, published in May 2026, and the repository has about 29,800 GitHub stars as of November 2026.

## Highlights

- **Three ways to run it.** `chromadb.Client()` keeps data in memory, `chromadb.PersistentClient(path=...)` writes to local disk, and `chroma run --path /db_path` starts a server you reach with `HttpClient`. `chromadb.CloudClient(...)` connects to Chroma Cloud.
- **Embeds for you.** Add raw text and Chroma embeds it with the Sentence Transformers model `all-MiniLM-L6-v2` unless you pass another embedding function or your own vectors.
- **Filters on metadata and text.** `where` filters on metadata; `where_document` filters on document text with `$contains`, `$not_contains`, `$regex` and `$not_regex`.
- **Python, JavaScript and Rust clients.** `pip install chromadb`, `npm install chromadb`, and a Rust crate share the same collection model.
- **Cloud-only features.** The Search API (dense, sparse and hybrid search with Reciprocal Rank Fusion), copy-on-write collection forking, and Sync (ingest from S3, GitHub repositories and websites) run on Chroma Cloud. The docs say Search API support for single-node Chroma is planned.

## In an AI-assisted workflow

Install it, then create a collection, add documents and query:

```bash
pip install chromadb
```

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma")
docs = client.get_or_create_collection("docs")

docs.add(
    ids=["doc-1"],
    documents=["How to rotate API keys..."],
    metadatas=[{"product": "billing"}],
)

res = docs.query(
    query_texts=["How do I rotate API keys?"],
    n_results=20,                               # over-retrieve, then rerank
    where={"product": "billing"},
)
```

To move the same code to a server, start one with `chroma run --path ./chroma` and swap the client for `chromadb.HttpClient()`. For Chroma Cloud, set `CHROMA_API_KEY`, `CHROMA_TENANT` and `CHROMA_DATABASE` and call `chromadb.CloudClient()` with no arguments.

> [!TIP]
> The default embedding model is convenient for prototyping. For production retrieval, pick a retrieval-tuned model on purpose (see [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026)). Switching models later means re-embedding and re-adding every document.

## Pricing

The database is free under Apache-2.0; you pay only for the machine it runs on. Chroma Cloud is usage-billed. As of November 2026, Chroma's pricing page lists:

| Plan | Monthly fee | Included |
| - | - | - |
| Starter | $0 + usage | $5 in free credits, 10 databases, 10 team members |
| Team | $250 + usage | $100 of usage a month, 100 databases, 30 team members, SOC 2, Slack support |
| Enterprise | Custom | Unlimited databases and members, single-tenant clusters, SLAs |

Usage rates, as of November 2026, are $2.50 per GiB written, $0.33 per GiB stored per month, $0.0075 per TiB queried and $0.09 per GiB returned. Each metadata or full-text predicate in a query counts as an extra query, so heavily filtered workloads cost more to read than plain vector search. Forking a collection costs $0.03 per request as of November 2026.

## Good to know

**Single-node scale is bounded by RAM.** Local and single-node Chroma index vectors with HNSW, and the index has to fit in memory. Chroma's own benchmark (1,024-dimension embeddings, small documents, three metadata fields) gives approximate maximum collection sizes of 250,000 records on 2 GB of RAM, 1.7 million on 8 GB, 7.5 million on 32 GB and 15 million on 64 GB. Past the limit, the OS starts swapping and latency spikes. The architecture docs position single-node for "fewer than 10 million records across a handful of collections".

**Chroma Cloud has default quotas.** Per the quotas page: 5,000,000 records per collection, 1,000,000 collections, 300 records per write, 300 results per query, embeddings up to 4,096 dimensions, documents up to 16,384 bytes, 32 metadata keys per record, and 10 concurrent reads and 10 concurrent writes per collection. Chroma says most can be raised on request. The 16 KB document cap means you chunk before you add.

**Local and Cloud are not feature-identical.** If your retrieval design depends on hybrid search with sparse vectors, plan for Chroma Cloud or handle the keyword side yourself.

Among alternatives, [LanceDB](/tools/lancedb) is also embedded but keeps its indexes on disk or object storage, so it is the usual next step when a dataset outgrows RAM. [Qdrant](/tools/qdrant) is a dedicated server with built-in hybrid search and quantization, for when you want an always-on service you operate. [pgvector](/tools/pgvector) fits when your data already lives in Postgres and you want vectors next to it. [Best Vector Database in 2026](/guides/database/best-vector-database-2026) compares where each fits.
