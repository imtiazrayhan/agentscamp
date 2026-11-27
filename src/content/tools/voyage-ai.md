---
name: "Voyage AI"
title: "Voyage AI"
description: "Embedding and reranking models tuned for retrieval, now part of MongoDB."
seoDescription: "Voyage AI, part of MongoDB, sells embedding and reranking models tuned for retrieval: the voyage-4 series, rerank-3, free tokens and limits."
url: "https://www.voyageai.com"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "freemium"
category: "platform"
sameAs: ["https://docs.voyageai.com", "https://github.com/voyage-ai"]
color: "purple"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["embeddings", "reranking", "rag", "api"]
featured: false
alternativeTo: ["cohere-rerank"]
summary: "Voyage AI, owned by MongoDB since February 2025, sells embedding and reranking models through a hosted API. The current lineup is the voyage-4 text series, voyage-code-4, voyage-context-4, multimodal embeddings and the rerank-3 rerankers. Each account gets 200 million free tokens on current models, then pays per token."
related: ["guide:choosing-embeddings-2026", "tool:cohere-rerank", "tool:qdrant", "skill:embedding-set-inspector"]
faq:
  - q: "Who owns Voyage AI?"
    a: "MongoDB. It announced the acquisition on February 24, 2025, and the site now brands the product Voyage AI by MongoDB. The standalone API at api.voyageai.com and its docs still operate, and the models are also sold through the AWS and Azure marketplaces."
  - q: "Is Voyage AI free?"
    a: "Partly. As of November 2026, every account gets the first 200 million tokens free on voyage-4-large, voyage-4, voyage-4-lite, voyage-context-4 and voyage-code-4, 50 million on voyage-finance-2 and voyage-law-2, and 200 million on rerank-3 and rerank-3-lite; after that voyage-4 costs $0.06 per million tokens. Older models and Batch API usage get no free tokens."
  - q: "Can I mix Voyage 4 models in one index?"
    a: "Yes, within the 4 series. Voyage's docs say all embeddings created with the 4 series are compatible with each other, so you can embed a corpus with voyage-4-large and embed queries with voyage-4-lite. Vectors from earlier generations such as voyage-3.5 are not interchangeable with them, so upgrading from those means re-embedding."
  - q: "Can I run Voyage models locally?"
    a: "Only one. voyage-4-nano is an open-weight model published on Hugging Face with the same output dimensions as the hosted 4 series. Every other Voyage model, including the rerankers, is available only through the API or a cloud marketplace deployment."
---

Voyage AI builds **embedding** and **reranking** models tuned for retrieval and sells them through a hosted API. MongoDB acquired the company in February 2025, and the product is now branded Voyage AI by MongoDB. You send text (or images) and get vectors back; you store and search those vectors in whatever database you already use.

It suits teams whose RAG or search quality is limited by retrieval, and who would rather call an API than train or host an embedding model.

## Highlights

- **voyage-4 series.** `voyage-4-large` (best quality), `voyage-4` (balanced) and `voyage-4-lite` (cheapest and fastest), released January 2026. Each takes 32,000 tokens of input and returns 1,024 dimensions by default, with 256, 512 and 2,048 as options. Embeddings from any 4-series model are compatible with each other.
- **Specialised embeddings.** `voyage-code-4` for code retrieval and coding agents, `voyage-finance-2` and `voyage-law-2` for those domains, and `voyage-multimodal-3.5` for text, images and video.
- **Contextualized chunks.** `voyage-context-4` embeds each chunk with the rest of its document in view, so a chunk that says "the company" still carries which company. It accepts up to 120,000 tokens across inputs with auto-chunking on.
- **Rerankers.** `rerank-3` and `rerank-3-lite` are cross-encoders with a 32,000-token context. One call takes a query of up to 8,000 tokens and up to 1,000 documents.
- **Smaller vectors.** The 4 series can return `int8`, `uint8`, `binary` or `ubinary` values instead of floats, and binary output is one-eighth the length of the chosen dimension. Combine that with a shorter `output_dimension` to cut storage.
- **Batch API.** A 12-hour completion window at a 33% discount for bulk embedding jobs.

## In an AI-assisted workflow

Install the Python package and set your key:

```bash
pip install -U voyageai
export VOYAGE_API_KEY="<your secret key>"
```

Embed documents at ingestion and the query at search time, store the vectors in a database such as [Qdrant](/tools/qdrant), then rerank the candidates:

```python
import voyageai

vo = voyageai.Client()  # reads VOYAGE_API_KEY

doc_vectors = vo.embed(chunks, model="voyage-4", input_type="document").embeddings
query_vector = vo.embed([question], model="voyage-4", input_type="query").embeddings[0]

# ...nearest-neighbour search in your vector DB returns `candidates`, then:
reranked = vo.rerank(question, candidates, model="rerank-3", top_k=5)
for r in reranked.results:
    print(r.relevance_score, r.document)
```

There is also an official TypeScript library, `voyageai` on npm, and a plain HTTP API.

> [!NOTE]
> Set `input_type="document"` for your corpus and `input_type="query"` for questions. Voyage prepends a different retrieval prompt for each ("Represent the query for retrieving supporting documents: " and "Represent the document for retrieval: "), which is what makes the two sides line up.

## Pricing

As of November 2026, from Voyage's pricing docs, text embeddings cost $0.12 per million tokens for `voyage-4-large`, `voyage-context-4` and `voyage-code-4`, $0.06 for `voyage-4` and $0.02 for `voyage-4-lite`, after the first 200 million tokens per account, which are free. The domain models `voyage-finance-2` and `voyage-law-2` cost $0.12 per million after 50 million free tokens, as of November 2026.

As of November 2026, `rerank-3` costs $0.05 per million tokens and `rerank-3-lite` $0.02, after 200 million free tokens. Reranker tokens are counted as (query tokens × number of documents) + all document tokens, so a long query against many candidates costs more than it looks. Multimodal embeddings are billed at $0.12 per million text tokens plus $0.60 per billion pixels as of November 2026.

Free tokens apply only to current models and never to the Batch API. Older models such as `voyage-3-large` are still served but, as of November 2026, cost more ($0.18 per million tokens) than the newer model that replaces them.

## Good to know

Rate limits start at 2,000 requests a minute for every model once a payment method is on file, with token limits per minute that vary by model: 3M for `voyage-4-large`, 8M for `voyage-4`, 16M for `voyage-4-lite` and 2M for `rerank-3`. As of November 2026, limits double after $100 of paid usage and triple after $1,000. A single embed call takes at most 1,000 texts, and at most 120K total tokens for `voyage-4-large`, 320K for `voyage-4` or 1M for `voyage-4-lite`, so batch your ingestion accordingly.

The costs you carry are the usual ones for hosted embeddings. Your text leaves your infrastructure on every call, there is no self-hosted option apart from the open-weight `voyage-4-nano`, and changing to a model outside the 4 series means re-embedding and re-indexing the corpus. Read [Choosing Embeddings in 2026](/guides/concepts/choosing-embeddings-2026) before you commit to a model.

For reranking only, [Cohere Rerank](/tools/cohere-rerank) is the closest substitute and plugs into the same place in a pipeline. If you would rather not run a separate embedding call at all, [Weaviate](/tools/weaviate) can call an embedding provider for you at insert and query time, and [Pinecone](/tools/pinecone) offers hosted embedding and reranking models alongside its index. [Hybrid Search and Reranking](/guides/concepts/hybrid-search-reranking) covers where a reranker fits.
