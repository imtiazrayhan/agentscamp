---
name: "Milvus"
title: "Milvus"
description: "An open-source vector database that runs from an in-process Lite build to a distributed cluster, with many index types and built-in BM25 hybrid search."
url: "https://milvus.io"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "platform"
repo: "https://github.com/milvus-io/milvus"
license: "Apache-2.0"
sameAs: ["https://github.com/milvus-io/milvus", "https://milvus.io/docs"]
os: ["Linux", "macOS", "Windows"]
alternativeTo: ["qdrant", "weaviate", "pinecone"]
color: "cyan"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["vector-database", "rag", "scale", "open-source"]
featured: false
summary: "Milvus is an Apache-2.0 vector database created by Zilliz and built for scale: compute and storage are separated, and query, data and index nodes scale independently. It offers HNSW, IVF, DiskANN, RaBitQ and GPU indexes plus BM25 full-text and hybrid search. Milvus Lite runs in-process for prototypes, and Zilliz Cloud is the managed version."
related: ["guide:best-vector-database-2026", "tool:qdrant", "tool:weaviate", "agent:vector-search-engineer", "skill:embedding-index-tuner"]
faq:
  - q: "What is new in Milvus 3.0?"
    a: "Milvus 3.0, released in July 2026, adds lake-native features on top of the 2.6 engine: external collections that index Parquet, Lance, Iceberg or Vortex files in place, point-in-time snapshots, online schema changes, server-side aggregation and ORDER BY, TEXT fields for long documents, and StructArray multi-vector entities. Storage V3 is off by default in 3.0.x, and several of those features need it switched on."
  - q: "What are Milvus Lite's limits?"
    a: "Milvus Lite 3.2.2 implements a subset of Milvus. Its docs say concurrent writes to one collection are not safe, there is no authentication, RBAC or TLS, binary, float16, bfloat16 and int8 vectors and Product Quantization indexes are unsupported, and unsupported operations return UNIMPLEMENTED. It needs Python 3.10 or newer, and a 3.x install cannot open a database file created by the 2.x package."
  - q: "Is Milvus free?"
    a: "Yes. Milvus is open source under Apache-2.0 and free to self-host in every deployment mode. You pay for the machines and object storage you run it on, and for the engineering time to operate it. Zilliz Cloud, the managed service from the company that created Milvus, is the paid alternative when you do not want to run the cluster."
  - q: "When should I choose Milvus over Qdrant or pgvector?"
    a: "When scale or deployment constraints call for it. Milvus's own guidance recommends self-hosted Milvus for workloads from hundreds of millions of vectors upward, high query rates, or data that must stay on-premises, and suggests pgvector or the database you already run when the dataset is a few million vectors or fewer and the app is already on PostgreSQL."
---

[Milvus](https://milvus.io) is an open-source vector database built for scale. Compute and storage are separated, data lives in object storage such as S3, and query, data and index nodes scale independently, which is how the project supports deployments it says reach 100 billion vectors. It was created by Zilliz, is a graduated project of the LF AI & Data Foundation, and is licensed Apache-2.0. The [repository](https://github.com/milvus-io/milvus) has about 46,700 GitHub stars as of November 2026.

The same API covers three sizes: Milvus Lite in-process on a laptop, Milvus Standalone on one machine with Docker, and Milvus Distributed on Kubernetes.

## Highlights

- **Many index types.** [HNSW](/glossary/hnsw), IVF variants, DiskANN, RaBitQ quantization and GPU CAGRA from the Knowhere engine, so you can trade recall, latency and memory against each other.
- **Hybrid and full-text search.** Dense and sparse vectors in one engine, built-in [BM25](/glossary/bm25) full-text search, and fusion by RRF or weighted ranking for [hybrid search](/glossary/hybrid-search).
- **Filtering and multi-tenancy.** Scalar metadata filters on searches, plus partition keys for tenant isolation.
- **Cost controls.** Tiered storage loads only what queries touch, and disk-based and quantized indexes plus mmap cut memory use.
- **Lake-native in 3.0.** External collections search Parquet, Lance, Iceberg or Vortex files without copying them into Milvus, and snapshots give read-only point-in-time views of a collection.
- **Tooling.** Attu is a desktop and web GUI for browsing collections, and Milvus Backup handles backup and restore.
- **Managed option.** Zilliz Cloud runs Milvus for you, and Milvus code and SDKs work against it unchanged.

## In an AI-assisted workflow

Prototype on Milvus Lite, then point the same client at a server. Install both packages, quoting the extra so zsh does not eat the brackets:

```bash
python -m pip install "pymilvus[milvus-lite]==3.0.3" "milvus-lite==3.2.2"
```

```python
from pymilvus import MilvusClient
import numpy as np

client = MilvusClient("./milvus_demo.db")   # Milvus Lite; creates a local directory
client.create_collection(collection_name="demo_collection", dimension=384)

docs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
]
# Random vectors to show the API; use an embedding model for real search.
rng = np.random.default_rng(7)
vectors = rng.uniform(-1, 1, size=(len(docs), 384)).tolist()

client.insert(
    collection_name="demo_collection",
    data=[{"id": i, "vector": vectors[i], "text": docs[i], "subject": "history"}
          for i in range(len(docs))],
)

res = client.search(
    collection_name="demo_collection",
    data=[vectors[0]],
    filter="subject == 'history'",
    limit=2,
    output_fields=["text", "subject"],
)
print(res)
```

To move to a server, change the constructor to `MilvusClient(uri="http://localhost:19530", token="username:password")` and review which features differ. The versions above are the ones Milvus's docs pin as of November 2026; check PyPI before you copy them into a requirements file.

> [!WARNING]
> A distributed Milvus cluster is real operational weight: Kubernetes, object storage, monitoring, upgrades and capacity planning. Take it on when your scale needs it. For a few million vectors, a single [Qdrant](/tools/qdrant) node or [pgvector](/tools/pgvector) ships faster and costs less to run.

## Good to know

Two release lines are supported as of November 2026: 3.0.x, with v3.0.6 published November 11, 2026, and 2.6.x, at v2.6.27. Upgrades from 2.6 to 3.0 can be rolled back until you use a feature that changes the data format.

Things that catch people out:

- **Storage V3 is off by default in 3.0.x.** External collections, TEXT fields and snapshots need it enabled, so read the 3.0.0 release notes before planning around them.
- **Milvus Lite is for development.** It has no auth or TLS and does not support concurrent writes. Since the 3.x rewrite the `.db` path is a directory, not a single portable file, and it cannot open 2.x databases in place.
- **Milvus Lite is a separate install.** Installing `pymilvus` alone no longer brings the Lite backend with it in the SDK version above.
- **Index before search.** A vector field must be indexed and the collection loaded before it can be searched.

Against the alternatives: [Qdrant](/tools/qdrant) is simpler to run on a single node and a common choice below the scale where Milvus's architecture pays off. [Weaviate](/tools/weaviate) is another open-source engine with hybrid search and a managed cloud. [Pinecone](/tools/pinecone) is a managed service, for teams that want no database to operate. [Best vector database in 2026](/guides/database/best-vector-database-2026) ranks them by use case, and [vector search at scale](/guides/database/vector-search-at-scale) covers the index and sharding decisions that matter once you are in Milvus territory.
