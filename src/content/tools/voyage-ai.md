---
name: "Voyage AI"
title: "Voyage AI"
description: "Embedding and reranking models tuned for retrieval, now part of MongoDB."
seoDescription: "Voyage AI builds embedding and reranking models tuned for retrieval quality, now part of MongoDB — model lineup, pricing, and alternatives."
url: "https://www.voyageai.com"
date: 2026-06-03
pricing: "freemium"
category: "platform"
sameAs: ["https://docs.voyageai.com"]
color: "purple"
topics: ["rag-retrieval", "data-ml"]
tags: ["embeddings", "reranking", "rag", "api"]
featured: false
alternativeTo: ["cohere-rerank"]
summary: "Voyage AI provides retrieval-tuned embedding and reranking models accessible via API, consistently among the top performers on retrieval benchmarks. Acquired by MongoDB in 2025, it offers general-purpose and domain-specific (code, finance, law) embeddings plus rerankers."
related: ["choosing-embeddings-2026", "cohere-rerank", "qdrant", "embedding-set-inspector"]
faq:
  - q: "What is Voyage AI?"
    a: "Voyage AI provides embedding and reranking models through a simple API, tuned specifically for retrieval quality rather than general-purpose representation. Its models consistently rank among the top performers on retrieval benchmarks, with general-purpose and domain-specific variants (code, finance, law) plus cross-encoder rerankers. It was acquired by MongoDB in 2025."
  - q: "Is Voyage AI free?"
    a: "It's a hosted API with a free tier of monthly tokens to start, then usage-based pricing."
  - q: "How do I use Voyage AI in a RAG pipeline?"
    a: "Embed documents at ingestion with input_type='document' and the question with input_type='query' — asymmetric embedding improves retrieval quality. Store vectors in a database like Qdrant, then optionally rerank candidates to reorder them by true relevance. Note that switching embedding models later means re-embedding and re-indexing your whole corpus."
---

Voyage AI provides **embedding** and **reranking** models accessible through a simple API, tuned specifically for retrieval quality rather than general-purpose representation. Its models consistently rank among the top performers on retrieval benchmarks, which is why many teams reach for Voyage embeddings when retrieval accuracy is the bottleneck in their RAG system. Voyage AI was acquired by MongoDB in 2025.

It is aimed at engineers building search and RAG who want strong out-of-the-box retrieval without training their own models. Beyond general-purpose embeddings, Voyage ships **domain-specific** variants (code, finance, law) and **rerankers** that reorder candidate passages by true relevance.

## Highlights

- **Retrieval-tuned embeddings** — general-purpose and domain-specific models that punch above their size on retrieval tasks.
- **Rerankers** — cross-encoder models that take a query plus candidate passages and return them sorted by relevance.
- **Long context & flexible dimensions** — large input lengths and configurable output dimensions to trade quality against storage cost.
- **Quantization-friendly** — int8 and binary output options to shrink vector storage in your database.

## In an AI-assisted workflow

Embed documents at ingestion and the query at search time, store the vectors in a database like [Qdrant](/tools/qdrant), then optionally rerank the candidates:

```python
import voyageai
vo = voyageai.Client()  # reads VOYAGE_API_KEY

doc_vectors = vo.embed(chunks, model="voyage-3", input_type="document").embeddings
query_vector = vo.embed([question], model="voyage-3", input_type="query").embeddings[0]
# ...nearest-neighbour search in your vector DB, then:
reranked = vo.rerank(question, candidates, model="rerank-2", top_k=5)
```

> [!NOTE]
> Use `input_type="document"` when embedding your corpus and `input_type="query"` when embedding the question — asymmetric embedding improves retrieval quality.

## Good to know

Voyage AI is a hosted API with a free tier of monthly tokens to start, then usage-based pricing. Because embeddings from different models are not interchangeable, switching embedding models later means re-embedding (and re-indexing) your whole corpus — see [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026) before you commit.
