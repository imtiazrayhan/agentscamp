---
name: "Pinecone"
title: "Pinecone"
description: "A managed, serverless vector database with dense, sparse and full-text search in one index, hosted embedding and reranking, and a free Starter plan."
url: "https://www.pinecone.io"
date: 2026-06-04
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
sameAs: ["https://github.com/pinecone-io", "https://docs.pinecone.io"]
os: ["Web"]
alternativeTo: ["qdrant", "weaviate", "pgvector"]
color: "blue"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["vector-database", "rag", "managed", "serverless"]
featured: false
summary: "Pinecone is a managed, serverless vector database: you upsert records and search them through an API, and Pinecone runs the storage, scaling and indexing. One document index can search by meaning and by exact terms, with hosted embedding and reranking models. It is closed source; a free Starter plan and usage-based paid plans sit on top."
related: ["guide:best-vector-database-2026", "tool:qdrant", "tool:weaviate", "tool:pgvector", "agent:vector-search-engineer"]
faq:
  - q: "Is Pinecone free?"
    a: "There is a free Starter plan. As of November 2026 it includes up to 2 GB of storage, 2 million write units and 1 million read units a month, up to 5 indexes, 100 namespaces per index, one project and two users, on AWS us-east-1 only. When you hit a monthly allowance, requests are blocked until the next billing period instead of being billed."
  - q: "How much does Pinecone cost?"
    a: "As of November 2026, Builder is a flat $20 a month with no overages, Standard bills pay-as-you-go with a $50 monthly minimum, and Enterprise has a $500 monthly minimum. On Standard, storage is $0.33 per GB a month, writes are $4 to $4.50 per million write units and reads are $16 to $18 per million read units, depending on cloud and region."
  - q: "Can I self-host Pinecone or run it locally?"
    a: "No. Pinecone is a closed-source hosted service. The closest option is Bring Your Own Cloud on the Enterprise plan, which runs Pinecone inside your own AWS, GCP or Azure account. Pinecone Local, the Docker emulator once used for local testing, reached end of life in October 2026; Pinecone's docs now point you to a separate project or a mocked API for tests."
  - q: "Does Pinecone support keyword search?"
    a: "Yes. Full-text search became generally available in September 2026 on the Documents API. A document index can hold full-text (BM25), dense-vector and sparse-vector fields together, and full-text search is included on every plan, billed in read units like any other query."
---

[Pinecone](https://www.pinecone.io) is a managed, **serverless** vector database from Pinecone Systems. You create an index, upsert records, and search them through an API; Pinecone runs the storage, scaling, replication and index maintenance. There are no nodes to size and no index parameters to tune. It is closed source and hosted only, which is the trade you make for not operating a search tier yourself.

It fits teams that want retrieval to be a dependency they call. If you need to run the database on your own hardware, or you already run Postgres and want vectors next to your rows, look at the alternatives at the end of this page first.

## Highlights

- **Document indexes.** Since the Documents API became generally available in September 2026, one schema-based index can combine full-text (BM25), dense-vector and sparse-vector fields. You search by meaning or by exact terms such as IDs and error codes, and narrow either search with a metadata filter.
- **Integrated embedding.** Declare a text field with `embed` and Pinecone embeds it at upsert and query time. The default model is `llama-text-embed-v2` at 1,024 dimensions; `text-embedding-3-small`, `text-embedding-3-large`, `multilingual-e5-large`, `pinecone-sparse-english-v0` and `gemini-embedding-2` are also listed on the pricing page.
- **Integrated reranking.** `bge-reranker-v2-m3` is available on every plan; `pinecone-rerank-v0` and `cohere-rerank-4-fast` need Standard or Enterprise.
- **Namespaces.** Partition an index per tenant. A query costs read units in proportion to the size of the namespace it searches, so namespaces also keep queries cheap.
- **Dedicated Read Nodes.** On Standard and Enterprise you can move a large, steady-traffic index to provisioned read capacity at a fixed hourly rate, with no read rate limits.
- **Bring Your Own Cloud.** On Enterprise, Pinecone runs inside your AWS, GCP or Azure account and VPC, with no inbound access needed.
- **Around the database.** Pinecone Assistant (hosted chat over your files), Pinecone Nexus (a knowledge engine for agents, generally available since August 2026) and `pg_pinecone`, an Apache-2.0 Postgres extension released in October 2026.

## In an AI-assisted workflow

Install the SDK and set `PINECONE_API_KEY`. The Python SDK at v10 or later supports Python 3.10 to 3.14.

```bash
pip install --upgrade "pinecone>=10.1.0"
export PINECONE_API_KEY="YOUR_API_KEY"
```

Create a document index with one text field that is both keyword-searchable and embedded, upsert plain text, and search it by meaning with a filter. This is the pattern from Pinecone's quickstart:

```python
import os, time
from pinecone import Pinecone, SchemaBuilder

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

schema = (
    SchemaBuilder()
      .add_string_field("chunk_text", full_text_search={"language": "en"}, embed={})
      .build()
)
if not pc.indexes.exists(name="quickstart"):
    pc.indexes.create(name="quickstart", schema=schema)
while not pc.indexes.describe(name="quickstart").status.ready:
    time.sleep(2)

index = pc.index(name="quickstart")
index.documents.upsert(
    namespace="__default__",
    documents=[
        {"_id": "1", "chunk_text": "Refund requests must be submitted within 30 days of purchase.", "category": "policy"},
        {"_id": "3", "chunk_text": "Error E1042: the connection timed out after 30 seconds.", "category": "log"},
    ],
)
time.sleep(10)  # documents are indexed asynchronously

hits = index.documents.search(
    namespace="__default__",
    top_k=3,
    score_by=[{"type": "embed", "fields": ["chunk_text"], "query": "how do I get my money back?"}],
    filter={"category": {"$eq": "policy"}},
    include_fields=["chunk_text"],
)
```

Change `"type": "embed"` to `"type": "text"` and the query to `E1042` to run a keyword search over the same field. The two searches return scores on different scales, so Pinecone's docs tell you to merge them with reciprocal rank fusion in your own code. If you already have embeddings, the bring-your-own-vectors path still takes raw vectors.

> [!TIP]
> Over-retrieve (top 20 to 50) and rerank before sending the top few passages to the model. See [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking).

## Pricing

As of November 2026, Pinecone's pricing page lists four plans: Starter (free), Builder at a flat $20 a month, Standard with a $50 monthly minimum, and Enterprise with a $500 monthly minimum.

| | Starter | Builder | Standard |
| --- | --- | --- | --- |
| Storage | Up to 2 GB | Up to 10 GB | Unlimited, billed per GB |
| Write units | 2M a month | 5M a month | Pay as you go |
| Read units | 1M a month | 2M a month | Pay as you go |
| Indexes | Up to 5 | 10 per project | 20 per project |
| Namespaces per index | 100 | 1,000 | 100,000 |
| Clouds | AWS us-east-1 | AWS, Azure, GCP | AWS, Azure, GCP |

As of November 2026, Standard rates are $0.33 per GB of storage a month, $4 to $4.50 per million write units and $16 to $18 per million read units depending on cloud and region, and $0.10 per GB of egress beyond the 100 GB included each month. Your usage counts toward the minimum, and Starter or Builder organizations can trial Standard for three weeks with $300 in credits, as of November 2026. Enterprise adds a 99.95% uptime SLA, private endpoints, customer-managed encryption keys and audit logs at higher unit rates.

How the units work: a query uses 1 read unit per GB of the namespace it searches, with a minimum of 0.25, regardless of how many results come back. An upsert uses 1 write unit per KB of the request, with a minimum of 5 per request, so batching matters. Integrated embedding is billed separately by token.

## Good to know

- **Hard stops on the fixed plans.** Starter and Builder block usage past a monthly allowance until the next billing period; they do not bill overages.
- **Query cost grows with namespace size.** A 10 GB namespace uses 10 read units per query. Split by tenant, or price Dedicated Read Nodes once traffic is steady.
- **No file parsing.** Pinecone does not extract or chunk files; do that in your own code before you upsert. An index with an `embed` field accepts up to 96 documents per upsert.
- **Writes are asynchronous.** A document is not searchable the instant the upsert returns.
- **No local emulator.** Pinecone Local reached end of life in October 2026.

Against the alternatives: [Qdrant](/tools/qdrant) is Apache-2.0 and runs anywhere from one Docker container to a cluster, so you keep a self-host option. [pgvector](/tools/pgvector) keeps vectors in the Postgres you already operate. [Weaviate](/tools/weaviate) is open source with its own managed cloud. Pinecone is the pick when nobody on the team should be operating a database at all. For a head-to-head see [Qdrant vs Pinecone](/guides/comparisons/qdrant-vs-pinecone), and for the wider field [Best Vector Database in 2026](/guides/database/best-vector-database-2026).
