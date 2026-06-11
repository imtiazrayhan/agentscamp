---
term: "Embedding"
description: "An embedding is a vector of numbers representing text's meaning, placed so similar texts land close together — the foundation of semantic search and RAG."
date: 2026-06-11
topics: ["rag-retrieval"]
tags: ["embeddings", "vectors", "semantic-search", "rag"]
related: ["choosing-embeddings-2026", "vector-database", "semantic-search", "rag", "embedding-set-inspector", "voyage-ai"]
faq:
  - q: "What is an embedding in simple terms?"
    a: "A list of numbers (often 256–3,072 of them) that captures what a text means. An embedding model maps 'How do I reset my password?' and 'I forgot my login credentials' to nearby points, even though they share almost no words — which is what lets search work by meaning instead of keywords."
  - q: "Do embeddings from different models mix?"
    a: "No. Each embedding model defines its own vector space — vectors from one model are meaningless next to vectors from another, and even versions of the same model differ. Switching embedding models means re-embedding the whole corpus, which is why the choice deserves real evaluation up front."
---

**An embedding is a numeric vector representing a piece of text (or image, or code) in a high-dimensional space arranged by meaning — texts that say similar things get vectors that sit close together.**

An *embedding model* does the mapping: text in, a few hundred to a few thousand floating-point numbers out. Distance in that space approximates semantic similarity, which turns "find documents about X" into geometry: embed the query, find the nearest stored vectors. That single trick underlies [semantic search](/glossary/semantic-search), [RAG](/glossary/rag) retrieval, recommendation, clustering, and deduplication.

Two practical truths dominate embedding work. First, **the model choice is load-bearing and sticky** — quality varies by domain and language, and switching models later means re-embedding everything; the trade-offs across OpenAI, Cohere, Voyage, and open-source options are mapped in [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026). Second, **embeddings are stored and searched in a [vector database](/glossary/vector-database)**, whose indexing choices set your speed/recall trade-off. When retrieval misbehaves, diagnose the embedding set before blaming the retriever — that's exactly what the [embedding-set-inspector](/skills/data/embedding-set-inspector) skill does.
