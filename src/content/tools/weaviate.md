---
name: "Weaviate"
title: "Weaviate"
description: "An open-source vector database written in Go, with built-in hybrid search, vectorizer integrations, multi-tenancy and a managed cloud with a free plan."
url: "https://weaviate.io"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "platform"
repo: "https://github.com/weaviate/weaviate"
license: "BSD-3-Clause"
sameAs: ["https://github.com/weaviate/weaviate", "https://docs.weaviate.io/weaviate"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["qdrant", "milvus", "pinecone"]
color: "green"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["vector-database", "rag", "hybrid-search", "open-source"]
featured: false
summary: "Weaviate is an open-source vector database written in Go. It can embed your data on insert through model-provider integrations, fuses BM25 and vector scores in one hybrid query, and isolates tenants inside a collection. Run the BSD-3-Clause Community Edition yourself, or use Weaviate Cloud, which has an always-free plan."
related: ["guide:best-vector-database-2026", "tool:qdrant", "tool:milvus", "tool:pinecone", "agent:vector-search-engineer"]
faq:
  - q: "Is Weaviate open source?"
    a: "Mostly. The Community Edition, everything outside the wl/ directory of the weaviate/weaviate repository, is BSD-3-Clause. Since v1.40 the same repository and Docker image also contain Enterprise Edition code under a commercial Weaviate License, which stays switched off unless you start Weaviate with a license key."
  - q: "How much does Weaviate Cloud cost?"
    a: "As of November 2026, the Free plan is $0 a month for one cluster per user, capped at 100,000 objects, 1 GB of memory, 10 GB of disk and one collection with up to 3 tenants; Flex is pay-as-you-go and starts at $45 a month. Premium is a prepaid contract on shared or dedicated infrastructure, priced by sales."
  - q: "What is in the Enterprise Edition that the Community Edition lacks?"
    a: "As of v1.41, four features: shard self-recovery, deduplicated backups and API key expiration in the Enterprise Edition, plus namespaces (isolated virtual clusters per team) in the Platform Edition. Hybrid search, vector compression, replication, multi-tenancy and RBAC are all in the Community Edition."
  - q: "Which languages have official Weaviate clients?"
    a: "Python, JavaScript/TypeScript, Java, Go and C#/.NET, with further community-maintained libraries. Underneath, Weaviate exposes REST, gRPC and GraphQL APIs, so any language that can call one of those can use it."
---

Weaviate is an open-source vector database written in Go, built on the idea that the store should do more than hold vectors. Its **model-provider integrations** can call an embedding model to vectorize objects on insert and queries at search time, and its **hybrid search** fuses keyword ([BM25](/glossary/bm25)) and vector scores inside the database. The company behind it, Weaviate B.V., also runs it as a managed service, Weaviate Cloud.

It suits teams that want one system to embed, store, filter and search, with the choice of self-hosting or handing operations to the vendor. The repository has about 17,000 GitHub stars as of November 2026, and the latest release is v1.41.0 (November 23, 2026).

## Highlights

- **Hybrid search in one query.** Combine BM25 and vector similarity with an `alpha` weight between 0 (keyword only) and 1 (vector only), plus metadata filters, in a single call.
- **Vectorizer integrations.** Weaviate can embed data at import through providers including OpenAI, Cohere, Hugging Face and Google, or through a local model such as Model2Vec. You can also bring your own vectors.
- **Built-in RAG and reranking.** Generative search and reranker integrations run a retrieve-then-generate or retrieve-then-rerank step from the same query.
- **Multi-tenancy.** Many tenants live inside one collection with their data isolated, which fits SaaS products that keep a separate index per customer.
- **Vector compression and index choice.** Quantization cuts memory use, and Weaviate Cloud's calculator offers an in-memory HNSW profile or a lower-cost HFresh profile.
- **Scale-out and access control.** Horizontal scaling, replication, RBAC and per-collection object TTL are in the open-source edition.
- **Clients and APIs.** Official clients for Python, JavaScript/TypeScript, Java, Go and C#/.NET over REST, gRPC and GraphQL.

## In an AI-assisted workflow

Start a local instance with Docker, with a small embedding model beside it (adapted from the project README):

```yaml
# docker-compose.yml
services:
  weaviate:
    image: cr.weaviate.io/semitechnologies/weaviate:1.41.0
    ports:
      - "8080:8080"
      - "50051:50051"
    environment:
      ENABLE_MODULES: text2vec-model2vec
      MODEL2VEC_INFERENCE_API: http://text2vec-model2vec:8080
  text2vec-model2vec:
    image: cr.weaviate.io/semitechnologies/model2vec-inference:minishlab-potion-base-32M
```

```bash
docker compose up -d
pip install -U weaviate-client
```

Then query with hybrid search and a metadata filter:

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
client.close()
```

> [!NOTE]
> With a vectorizer configured, Weaviate embeds both your objects and your queries with the same model. That is convenient, but switching embedding models still means re-vectorizing the collection, the same lock-in as any store.

## Pricing

Self-hosting the Community Edition is free; you pay for your own servers and any embedding provider you call.

As of November 2026, from Weaviate's pricing page, Weaviate Cloud's Free plan costs $0 a month with no credit card, for one cluster per user limited to 100,000 objects, 1 GB of memory, 10 GB of disk and one collection with up to 3 tenants. It has no backups and no replication. Flex is pay-as-you-go from $45 a month on shared infrastructure, with replication, 7-day backup retention and a 99.5% uptime target, as of November 2026. Premium is a prepaid contract, on shared or dedicated clusters, with SSO on both and HIPAA and AWS PrivateLink on dedicated only.

Two add-on services are billed by usage. As of November 2026, Weaviate Embeddings costs $0.025 to $0.065 per million tokens depending on the model, and the Query Agent, which turns natural-language questions into database operations, is free for 1,000 requests a month and then $30 per organization a month with 4,000 requests included.

## Good to know

"Open source" needs one qualifier now. Since v1.40 the repository holds two licenses: BSD-3-Clause for everything outside the `wl/` directory, and a commercial Weaviate License for the Enterprise Edition code inside it. Both ship in the same Docker image, and the licensed features stay off without a `LICENSE_KEY`. As of v1.41 those features are shard self-recovery, deduplicated backups, API key expiration and, in the Platform Edition, namespaces. Check the edition table in the docs before you plan around a new operational feature.

Weaviate asks more of you than a leaner store. You define a collection schema, choose index and compression settings, and run a stateful service (or a cluster) if you self-host. If you already compute embeddings elsewhere, the vectorizer layer is something you configure and then do not use.

Compared with the alternatives: [Qdrant](/tools/qdrant) is a leaner open-source engine if you want the database to store and filter vectors and nothing else; [Pinecone](/tools/pinecone) is fully managed with no self-hosted edition; [Milvus](/tools/milvus) is the open-source option built for the largest clusters. [Best Vector Database in 2026](/guides/database/best-vector-database-2026) compares them side by side.
