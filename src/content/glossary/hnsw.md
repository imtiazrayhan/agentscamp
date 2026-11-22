---
term: "HNSW (Hierarchical Navigable Small World)"
description: "HNSW is a graph-based approximate nearest-neighbor index that searches layered proximity graphs from the top down, the core of fast vector search."
date: 2026-11-10
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers", "developers"]
tags: ["hnsw", "ann", "vector-search", "vector-database", "indexing"]
related: ["glossary:vector-database", "skill:embedding-index-tuner", "guide:vector-search-at-scale", "tool:pgvector", "agent:vector-search-engineer", "glossary:bm25"]
faq:
  - q: "What do M and ef mean in HNSW?"
    a: "In the original paper, M is the number of connections each new element establishes, efConstruction is the size of the dynamic candidate list used while building the graph, and ef is the size of that list at search time. The paper notes that memory use is proportional to M and gives 5 to 48 as a reasonable range. Qdrant's docs describe a larger search beam as more accurate but slower, and hnswlib notes that a bigger ef_construction means longer construction but better index quality."
  - q: "What are the default HNSW parameters?"
    a: "There is no single default. Each engine names the knobs differently and picks its own values. In their docs as of November 2026, pgvector uses m = 16, ef_construction = 64 and hnsw.ef_search = 40; Qdrant uses m 16 and ef_construct 100, with search ef equal to ef_construct by default; Weaviate defaults maxConnections to 32 and efConstruction to 128 with dynamic ef; and Milvus defaults M to 30 and efConstruction to 360. Check your engine's docs before copying numbers from another."
  - q: "Is HNSW better than IVFFlat?"
    a: "It trades differently. pgvector's documentation says HNSW has better query performance than IVFFlat but slower build times and higher memory use. Which matters more depends on how often you rebuild the index and how much memory you can give it."
summary: "HNSW is an approximate nearest-neighbor index that stacks proximity graphs in layers. A search starts in the sparse top layer and descends, giving logarithmic complexity scaling. Malkov and Yashunin introduced it in 2016. Its parameters, M and ef, trade recall against memory and speed, and their defaults differ by engine."
---

**HNSW (Hierarchical Navigable Small World) is a graph-based index for approximate nearest-neighbor search: it links stored vectors into layered proximity graphs and answers a query by walking those graphs from a sparse top layer down to a dense bottom one, instead of comparing the query against every vector.**

Yu. A. Malkov and D. A. Yashunin introduced it in arXiv 1603.09320, first posted in March 2016 and published in IEEE Transactions on Pattern Analysis and Machine Intelligence in 2020. The index "incrementally builds a multi-layer structure consisting from hierarchical set of proximity graphs (layers) for nested subsets of the stored elements," and the highest layer an element reaches is chosen at random with exponentially decaying probability. Few elements reach the upper layers, so a search takes long jumps there before refining below. The authors compare the structure to a skip list and report that starting from the upper layer "allows a logarithmic complexity scaling."

Three parameters do most of the work. M sets how many connections each element gets, and memory use grows with it. efConstruction sizes the candidate list during the build, and ef sizes it at query time, so raising ef buys recall at the cost of latency. Engines rename and re-default these knobs: pgvector uses `m` 16, `ef_construction` 64 and `hnsw.ef_search` 40; Qdrant uses `m` 16 and `ef_construct` 100; Weaviate's `maxConnections` defaults to 32; Milvus defaults `M` to 30. None of these is a universal default, and none is a proven optimum.

HNSW serves the dense half of retrieval in a [vector database](/glossary/vector-database); the lexical half usually comes from a keyword scorer such as [BM25](/glossary/bm25). [Vector Search at Scale](/guides/database/vector-search-at-scale) covers memory limits and sharding, and the [embedding-index-tuner](/skills/database/embedding-index-tuner) skill sweeps M and ef against a recall target.
