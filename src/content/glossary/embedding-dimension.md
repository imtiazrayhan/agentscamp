---
term: "Embedding Dimension"
description: "Embedding dimension is the length of an embedding vector — how many numbers represent each text — trading capacity against storage and search cost."
date: 2026-06-12
topics: ["rag-retrieval"]
tags: ["embeddings", "dimensions", "vectors", "rag"]
related: ["glossary:embedding", "glossary:vector-database", "glossary:cosine-similarity", "guide:choosing-embeddings-2026", "glossary:quantization"]
faq:
  - q: "Are more embedding dimensions better?"
    a: "Capacity rises with dimension, but with hard diminishing returns — and cost rises linearly: every dimension is paid in storage, memory, and search compute on every vector forever. Modern models at 512–1,536 dimensions routinely match older 3,072-dim quality. Benchmark retrieval quality per dimension on your corpus; don't default to the maximum."
  - q: "What is Matryoshka embedding?"
    a: "A training technique (Matryoshka Representation Learning) that packs the most important information into the leading dimensions, so one model serves multiple sizes — truncate a 1,536-dim vector to 512 and it still works with modest quality loss. Many current embedding APIs expose this as a dimensions parameter: one model, your choice of cost point."
---

**Embedding dimension is the length of the vector an [embedding](/glossary/embedding) model produces — 384, 768, 1536, 3072 numbers per text — setting the trade between how much meaning a vector can carry and what every vector costs to store and search.**

The economics are unforgiving because they're multiplicative: dimension × corpus size × bytes-per-float is your index's memory footprint, and search compute scales with it too. Double the dimensions and a 100M-vector index doubles in RAM — which is why dimension choice belongs in [vector-database](/glossary/vector-database) capacity planning, alongside [quantization](/glossary/quantization) of the vectors themselves.

Two modern developments take the sting out. **Matryoshka-style models** front-load information so vectors truncate gracefully — one model, several deployable sizes via an API parameter. And benchmark reality: today's well-trained 512–1,024-dim models frequently match yesterday's larger vectors, so the right process is empirical — test retrieval quality at two or three dimension settings on *your* corpus ([the embedding-selection guide](/guides/concepts/choosing-embeddings-2026)) and buy only the dimensions that earn their keep. One hard rule survives every choice: dimension is fixed per index — changing it means re-embedding everything.
