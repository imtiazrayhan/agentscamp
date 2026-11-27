---
name: "Qdrant"
title: "Qdrant"
description: "An open-source vector database written in Rust with payload filtering, hybrid search and quantization. Self-host it or use Qdrant Cloud's free tier."
url: "https://qdrant.tech"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "platform"
repo: "https://github.com/qdrant/qdrant"
license: "Apache-2.0"
sameAs: ["https://github.com/qdrant/qdrant", "https://qdrant.tech/documentation/"]
color: "red"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["vector-database", "rag", "rust", "open-source"]
featured: false
alternativeTo: ["pinecone", "weaviate", "milvus", "chroma", "pgvector"]
summary: "Qdrant is an Apache-2.0 vector database written in Rust. It stores embeddings with JSON payloads and runs filtered, hybrid (dense plus sparse) similarity search, with quantization to cut memory. Run it from one Docker container, scale it to a sharded cluster, or use Qdrant Cloud, which has a free single-node tier."
related: ["guide:hybrid-search-reranking", "agent:rag-pipeline-engineer", "tool:cohere-rerank", "tool:voyage-ai", "tool:chonkie"]
faq:
  - q: "Is Qdrant free?"
    a: "The database is free and open source under Apache-2.0, and you can self-host it with Docker or Kubernetes at no licence cost. Qdrant Cloud also has a Free Tier that the pricing page calls \"free forever\": as of November 2026 it is a single-node cluster with 0.5 vCPU, 1 GB of RAM and 4 GB of disk, meant for testing and prototypes."
  - q: "How is Qdrant Cloud priced?"
    a: "By the resources you provision, not per query. As of November 2026 the pricing page lists a Free Tier, a usage-based Standard Tier with dedicated resources and a 99.5% uptime SLA, and a Premium Tier with a minimum spend that adds SSO, private VPC links and a 99.9% SLA. Hybrid Cloud and Private Cloud run managed Qdrant on your own infrastructure. Qdrant publishes a calculator instead of a rate card."
  - q: "What is the latest Qdrant version?"
    a: "As of November 2026 the latest release is v1.20.2, published on November 16, 2026. Version 1.20.0 in October 2026 added BM25 scoring directly on the full-text payload index and the turbo8 and turbo16 vector datatypes from the TurboQuant work."
  - q: "Which languages have official Qdrant clients?"
    a: "Qdrant's quickstart shows official clients for Python, JavaScript/TypeScript, Rust, Go, Java and .NET, on top of the REST API on port 6333 and the gRPC API on port 6334. The Java, .NET and Go clients talk to the gRPC interface."
---

[Qdrant](https://qdrant.tech) is an open-source vector database for storing embeddings and retrieving the nearest matches to a query vector. It is written in Rust, licensed Apache-2.0, and developed by Qdrant, the Berlin company that also runs Qdrant Cloud. Its distinguishing feature is **payload filtering**: you attach JSON metadata to each point and constrain a search by tenant, date or document type inside the vector search itself.

It suits teams building RAG, semantic search, recommendations or deduplication who want a store they can run themselves and move to a managed service later, or the other way round. The repository had about 35,700 GitHub stars as of November 2026.

## Highlights

- **Hybrid search.** Store dense and sparse vectors on the same point, run both searches as prefetches in one Query API call, and fuse the results. Since v1.20.0 (October 2026), BM25 scoring also runs directly on the full-text payload index.
- **Payload filtering.** Filter on JSON payload fields during search, with payload indexes to keep filtered queries fast.
- **Quantization.** Scalar, product and binary quantization shrink the memory footprint, with on-disk storage for large collections. The TurboQuant datatypes (`turbo4` in v1.19.0, `turbo8` and `turbo16` in v1.20.0) store only the quantized vectors to save disk.
- **Distributed mode.** Sharding and replication for horizontal scale and high availability.
- **Clients.** Official SDKs for Python, JavaScript/TypeScript, Rust, Go, Java and .NET, plus REST and gRPC.
- **Deployment choices.** Self-hosted, Qdrant Cloud on AWS, Azure or GCP, Hybrid Cloud (managed clusters on your infrastructure) and Private Cloud (isolated or air-gapped). As of November 2026, Qdrant's site also lists Qdrant Edge as a beta and Qdrant Serverless behind a waitlist.

## In an AI-assisted workflow

Start a local instance. Data persists in `./qdrant_storage`, and a web UI is served at `localhost:6333/dashboard`:

```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant
```

Then create a collection, upsert points with payloads, and run a filtered query. This follows Qdrant's quickstart; replace the four-number vectors with your embedding model's output (see [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026)):

```python
# pip install qdrant-client
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue,
)

client = QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="test_collection",
    vectors_config=VectorParams(size=4, distance=Distance.DOT),
)

client.upsert(
    collection_name="test_collection",
    wait=True,
    points=[
        PointStruct(id=1, vector=[0.05, 0.61, 0.76, 0.74], payload={"city": "Berlin"}),
        PointStruct(id=2, vector=[0.19, 0.81, 0.75, 0.11], payload={"city": "London"}),
    ],
)

hits = client.query_points(
    collection_name="test_collection",
    query=[0.2, 0.1, 0.9, 0.7],
    query_filter=Filter(
        must=[FieldCondition(key="city", match=MatchValue(value="London"))]
    ),
    with_payload=True,
    limit=3,
).points
```

> [!TIP]
> Over-retrieve from Qdrant (top 20 to 50) and rerank with a cross-encoder like [Cohere Rerank](/tools/cohere-rerank) before sending the top 5 to the model. See [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking).

## Pricing

Self-hosting costs nothing in licence fees; you pay for the machines. Qdrant Cloud is priced by provisioned resources, and Qdrant publishes a calculator instead of a per-unit rate card. As of November 2026 the pricing page lists:

| Tier | What you get |
| --- | --- |
| Free Tier | "Free forever": single-node cluster, 0.5 vCPU, 1 GB RAM, 4 GB disk, free cloud inference with selected models |
| Standard Tier | Usage-based: dedicated resources, vertical and horizontal scaling, high availability, backups, 99.5% uptime SLA |
| Premium Tier | Minimum spend: SSO, private VPC links, 99.9% uptime SLA, extra support |
| Hybrid Cloud | Managed Qdrant clusters on your own compute, network and storage |
| Private Cloud | Dedicated, isolated deployment, including air-gapped setups |

## Good to know

- **You size it.** Unlike a serverless service, a Qdrant cluster has RAM, CPU and disk that you choose. Memory is the number to plan: vectors held in RAM are fast, and quantization or on-disk storage trade some speed or recall for a smaller footprint.
- **Self-hosting means operating it.** Backups, monitoring, upgrades and capacity are yours. The Free Tier is a single node with no replication, so do not put production traffic on it.
- **It stores vectors, it does not make them.** In a self-hosted setup you bring the embedding model. Qdrant Cloud adds Cloud Inference, with free models on the Free Tier and paid models on Standard.
- **Releases are frequent.** Three point releases landed between October 22 and November 16, 2026. Pin the image tag instead of running `latest`.

How it compares: [Pinecone](/tools/pinecone) is closed source and serverless, so there is nothing to size or operate, but no self-host path; [Qdrant vs Pinecone](/guides/comparisons/qdrant-vs-pinecone) goes through that choice. [pgvector](/tools/pgvector) keeps vectors in the Postgres you already run, which is simpler until filtering and scale demand a dedicated engine. [Milvus](/tools/milvus) is the other large open-source option, with more moving parts in its distributed form, and [Chroma](/tools/chroma) is lighter and aimed at prototypes and embedded use.
