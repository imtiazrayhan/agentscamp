---
term: "Cosine Similarity"
description: "Cosine similarity measures how alike two embeddings are by the angle between them — the standard relevance score behind semantic search and RAG retrieval."
date: 2026-06-12
topics: ["rag-retrieval"]
tags: ["cosine-similarity", "embeddings", "vectors", "search"]
related: ["embedding", "semantic-search", "vector-database", "embedding-dimension", "reranking"]
faq:
  - q: "Why cosine similarity instead of plain distance?"
    a: "Because direction carries the meaning in embedding space, not length. Cosine compares angle only, ignoring vector magnitude — and with normalized vectors (most modern embedding models normalize), cosine similarity, dot product, and Euclidean distance rank results identically, so engines default to the cheapest equivalent computation."
  - q: "What's a 'good' cosine similarity score?"
    a: "There's no universal threshold — score scales differ by embedding model, and 0.8 from one model can mean less than 0.6 from another. Use scores comparatively (rank candidates, take top-k) rather than absolutely, and calibrate any cutoff empirically on your own data if you need one."
---

**Cosine similarity scores how similar two [embeddings](/glossary/embedding) are by measuring the angle between them: 1.0 means pointing the same way (very similar), 0 means unrelated — the default relevance metric of [semantic search](/glossary/semantic-search).**

It won the default slot because embedding spaces encode meaning *directionally*: two texts about the same thing point the same way regardless of length or emphasis, so comparing angles (and ignoring magnitude) matches semantic intuition. A practical simplification follows: most modern embedding models output **normalized** vectors, where cosine similarity equals the dot product and ranks identically to Euclidean distance — the metric choice in your [vector database](/glossary/vector-database) matters less than tutorials imply, as long as it matches what the embedding model was trained for (check the model card).

Two field notes save real debugging time. **Scores aren't portable**: each model has its own score distribution, so thresholds like "similarity > 0.8" must be calibrated per model, never copied. And **similarity isn't relevance**: cosine retrieves what's *alike*, which is why pipelines add [reranking](/glossary/reranking) to sort the genuinely-relevant out of the merely-similar.
