---
title: "Choosing Embeddings in 2026: OpenAI vs Cohere vs Voyage vs Open-Source"
description: "Embedding models compared: OpenAI, Cohere, Voyage, Gemini, BGE, Nomic and Qwen3 by dimensions, context length and licence, plus a recall@k bake-off script."
author: "Imtiaz Rayhan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["embeddings", "rag", "comparison", "retrieval"]
featured: false
summary: "No embedding model wins everywhere. Shortlist two or three by context length, dimensions and hosting, then measure recall@k on your own queries. Hosted options are OpenAI text-embedding-3, Cohere Embed v5, Voyage 4 and Gemini Embedding 2; open-weight options include BGE-M3, Nomic Embed and Qwen3-Embedding. Switching later means re-embedding the corpus."
keyTakeaways:
  - "Benchmarks (MTEB) build a shortlist, not a decision. Measure recall@k on your own corpus and queries; 50 labeled queries is enough to start."
  - "Context length now ranges from 512 tokens (older Cohere v3, BGE-large) to 32,000 (Voyage 4, Qwen3-Embedding) and 128k (Cohere Embed v4 and v5). It decides how you chunk."
  - "Most current models are Matryoshka-trained: OpenAI, Cohere, Voyage, Gemini, Nomic and Qwen3 all let you request or truncate to fewer dimensions."
  - "Storage scales linearly with dimensions: 1 million float32 vectors take about 4.1 GB at 1024 dimensions and 12.3 GB at 3072."
  - "Asymmetric inputs differ per model: Voyage takes input_type, Nomic needs search_document:/search_query: prefixes, Gemini Embedding 2 wants the task written into the prompt. Getting this wrong silently costs recall."
  - "Changing models means re-embedding and re-indexing everything. The one documented exception is within Voyage's 4 series, whose embeddings are compatible with each other."
faq:
  - q: "What is the best embedding model for RAG in 2026?"
    a: "There is no universal winner. It depends on your documents, languages, latency and cost budget, and whether data can leave your environment. A reasonable shortlist: OpenAI text-embedding-3-large if you are already on OpenAI, Voyage 4 or a Voyage domain model for retrieval-focused work, Cohere Embed v5 for long or mixed text-and-image documents, and BGE-M3 or Qwen3-Embedding when you must self-host. Run all candidates through the same recall@k test before choosing."
  - q: "Should I use a hosted embedding API or an open-source model?"
    a: "Use a hosted API when you want no model infrastructure and your text can be sent to a third party. Use an open-weight model (BGE-M3 is MIT; Nomic Embed v1.5 and Qwen3-Embedding are Apache-2.0) when you need data to stay in-house, want predictable cost at volume, or must run offline. Self-hosting means you own GPU capacity, throughput and model versioning."
  - q: "What embedding dimension should I use?"
    a: "The smallest one that still hits your recall target. Storage and search cost grow linearly with dimensions, and Matryoshka-trained models lose little when shortened: Nomic's own table shows its v1.5 model going from 62.28 at 768 dimensions to 61.04 at 256 on MTEB. Test 256, 512 and the default on your eval set and compare."
  - q: "Can I mix embeddings from different models in one index?"
    a: "No. Vectors from different models live in different spaces, and similarity between them is meaningless. Voyage documents one exception: embeddings from its 4 series (voyage-4-large, voyage-4, voyage-4-lite, voyage-4-nano) are compatible with each other, so you can index with one and query with another. Otherwise a model change means re-embedding the whole corpus."
  - q: "How many test queries do I need to compare embedding models?"
    a: "Start with 50 to 100 real queries, each labeled with the chunk or document that answers it. That is enough to separate a clearly better model from a clearly worse one. If two candidates land within a couple of points of each other, the difference is noise at that sample size; decide on cost, context length or hosting instead."
related: ["guide:how-rag-works", "tool:voyage-ai", "skill:embedding-set-inspector", "tool:cohere-rerank", "agent:data-scientist"]
---

The embedding model decides which passages count as "similar" to a question. Pick well and retrieval is easy; pick badly and no reranker fully recovers. The choice also carries lock-in, because switching models later means re-embedding and re-indexing everything, so it deserves a deliberate decision instead of whatever the tutorial used.

## The models, side by side

Specs below were read from each vendor's documentation or model card in November 2026. Prices are left out on purpose: every hosted model here bills per input token, rates change often, and each vendor's pricing page is the source.

### Hosted APIs

| Model | Default dims (options) | Max input tokens | Matryoshka | Notes |
| --- | --- | --- | --- | --- |
| OpenAI `text-embedding-3-small` | 1536 (shorten with `dimensions`) | 8,192 | Yes | OpenAI lists 62.3% on MTEB |
| OpenAI `text-embedding-3-large` | 3072 (shorten with `dimensions`) | 8,192 | Yes | OpenAI lists 64.6% on MTEB |
| Cohere `embed-v5.0-pro` / `embed-v5.0-fast` | 2048 (256, 512, 768, 1024, 1536) | 128k | Yes | Text, images and mixed pages such as PDFs; 100+ languages; `float`, `int8` or `binary` output |
| Cohere `embed-v4.0` | 1536 (256, 512, 1024) | 128k | Yes | Text and images |
| Voyage `voyage-4-large` / `voyage-4` / `voyage-4-lite` | 1024 (256, 512, 2048) | 32,000 | Yes | General-purpose and multilingual; 4-series embeddings are mutually compatible |
| Voyage `voyage-code-4` | 1024 (256, 512, 2048) | 32,000 | Yes | Code retrieval. Domain models `voyage-finance-2` (32,000 tokens) and `voyage-law-2` (16,000) are fixed at 1024 |
| Google `gemini-embedding-2` | 3072 (128 to 3072; 768, 1536, 3072 recommended) | 8,192, shared across modalities | Yes | Text, images, video, audio and documents in one space; 100+ languages |

### Open-weight models

| Model | Dims | Max input tokens | Licence | Notes |
| --- | --- | --- | --- | --- |
| `BAAI/bge-m3` | 1024 | 8,192 | MIT | Multilingual; dense, sparse and ColBERT-style multi-vector output from one model |
| `nomic-ai/nomic-embed-text-v1.5` | 768 (Matryoshka down to 64) | 8,192 | Apache-2.0 | English; requires task prefixes |
| `Qwen/Qwen3-Embedding-0.6B` / `4B` / `8B` | 1024 / 2560 / 4096 (user-defined, from 32 up) | 32k | Apache-2.0 | 100+ languages including programming languages; instruction-aware |
| `voyage-4-nano` | 1024 (256, 512, 2048) | 32,000 | Apache-2.0 | Open-weight member of the Voyage 4 series, compatible with the hosted 4-series models |

[Voyage AI](/tools/voyage-ai) is part of MongoDB. Cohere's embedding models pair with [Cohere Rerank](/tools/cohere-rerank) for a hosted retrieve-and-rerank stack. The older Cohere v3 models (`embed-english-v3.0`, `embed-multilingual-v3.0`) are still listed, at 1024 dimensions with a 512-token limit.

## What to weigh

- **Context length against your chunks.** A 512-token model forces small chunks. An 8,192-token model fits a long section. At 32,000 or 128k tokens you can embed whole documents, which helps "which document is this about" queries and hurts "which sentence answers this" queries, because one vector has to summarize everything. Long context is an option, not a reason to stop [chunking](/glossary/chunking).
- **Dimensions against storage.** A float32 vector costs 4 bytes per dimension before index overhead:

  | Dimensions | 1M vectors | 10M vectors |
  | --- | --- | --- |
  | 256 | 1.0 GB | 10 GB |
  | 1024 | 4.1 GB | 41 GB |
  | 1536 | 6.1 GB | 61 GB |
  | 3072 | 12.3 GB | 123 GB |

  Shortening a Matryoshka model from 3072 to 1024 cuts that by two thirds. `int8` or `binary` output (Cohere, Voyage's `output_dtype`) or quantization in the vector database cuts it further. See [embedding dimension](/glossary/embedding-dimension).
- **Languages and domain.** If the content is not English-only, check the model card's language list. For code, law or finance, a domain model is worth one slot on the shortlist.
- **Modalities.** If you index scanned PDFs, slides or screenshots, Cohere Embed v4/v5 and Gemini Embedding 2 take images directly and skip a lossy OCR step.
- **Where the data can go.** A hosted API sends your text to a third party. If that is not allowed, the open-weight table is your list.
- **Lock-in.** Re-embedding cost grows with the corpus. Keep the raw chunks and the model name and dimension stored next to every vector so a migration is a batch job, not an archaeology project.

## Read benchmarks, then test on your own data

The [MTEB](https://huggingface.co/spaces/mteb/leaderboard) leaderboard is the standard reference and is fine for building a shortlist. Its rank is measured on public datasets, not your documents, your jargon or your users' phrasing, and vendors report scores from different MTEB versions that are not comparable with each other. The numbers on your data are the ones that decide.

### A recall@k bake-off

You need two files:

```text
chunks.jsonl    {"id": "doc12#3", "text": "Refunds are issued to the original payment method within 5 business days."}
queries.jsonl   {"query": "how long do refunds take", "relevant_id": "doc12#3"}
```

Take queries from real search logs or support tickets where you can. If you write them yourself, do not copy phrases from the chunk, or you are testing string overlap.

```python
import json
import numpy as np
from openai import OpenAI
import voyageai

chunks = [json.loads(line) for line in open("chunks.jsonl")]
queries = [json.loads(line) for line in open("queries.jsonl")]
chunk_ids = [c["id"] for c in chunks]

oai = OpenAI()
vo = voyageai.Client()

def batched(items, n=96):
    for i in range(0, len(items), n):
        yield items[i:i + n]

def openai_embed(texts, kind, dims=1024):
    out = []
    for batch in batched(texts):
        r = oai.embeddings.create(model="text-embedding-3-large", input=batch, dimensions=dims)
        out += [d.embedding for d in r.data]
    return out

def voyage_embed(texts, kind, dims=1024):
    out = []
    for batch in batched(texts):
        r = vo.embed(batch, model="voyage-4", input_type=kind, output_dimension=dims)
        out += r.embeddings
    return out

def recall_at_k(embed, k=5):
    docs = np.array(embed([c["text"] for c in chunks], "document"), dtype=np.float32)
    qs = np.array(embed([q["query"] for q in queries], "query"), dtype=np.float32)
    docs /= np.linalg.norm(docs, axis=1, keepdims=True)
    qs /= np.linalg.norm(qs, axis=1, keepdims=True)
    scores = qs @ docs.T                                # cosine similarity
    top = np.argsort(-scores, axis=1)[:, :k]
    hits = [q["relevant_id"] in {chunk_ids[i] for i in row} for q, row in zip(queries, top)]
    return sum(hits) / len(hits)

for name, fn in [("openai-3-large@1024", openai_embed), ("voyage-4@1024", voyage_embed)]:
    print(f"{name}: recall@5 = {recall_at_k(fn):.3f}")
```

How to read the result:

- **Fix the dimension** across candidates first (1024 here) so you compare models, then rerun the winner at 256 and 512 to see what shortening costs.
- **A gap of a couple of points on 50 queries is noise.** Add queries or decide on other criteria.
- **Look at the misses.** Print the queries that failed for every model. If the same ones fail everywhere, the problem is chunking or missing content, and no embedding swap will fix it.
- **If you rerank, measure recall@50 as well.** The embedding model's job is then to get the answer into the candidate set, and the [reranker](/glossary/reranking) orders it.
- **Add an open-weight candidate** by writing one more `embed` function around `sentence-transformers` or a local server. The [embedding-set-inspector](/skills/data/embedding-set-inspector) skill checks the resulting vectors for normalization problems, near-duplicates and degenerate rows before you trust the numbers.

Brute-force NumPy search is exact, which is what you want for a model comparison. Index tuning (HNSW parameters, quantization) is a separate experiment.

## Mistakes that cost recall without an error message

> [!WARNING]
> None of these raise an exception. Retrieval gets worse and nothing tells you why.

- **Wrong or missing input type.** Voyage takes `input_type="query"` or `"document"` and prepends a different prompt for each. Nomic v1.5 requires the text to start with `search_document: ` or `search_query: `. Gemini Embedding 2 does not accept `task_type`; you write the task into the prompt. Qwen3-Embedding is instruction-aware on the query side.
- **Wrong distance metric.** Match the index metric to the model. Cohere documents cosine, dot product and Euclidean for its models. If you truncate a Matryoshka vector yourself, re-normalize it before using dot product; Gemini Embedding 2 does this for you at non-default sizes.
- **Silent truncation.** Over-length inputs are cut, not rejected, by default on Voyage (`truncation=True`) and Gemini. A 20-page document embedded with an 8,192-token model is represented by its first pages only.
- **Mixed model versions in one index.** A partial re-embed after a model upgrade leaves two incompatible vector spaces side by side. Store the model name with each vector and filter on it.

## A decision shortcut

- **Already on OpenAI, want the least work**: `text-embedding-3-large`, shortened to 1024 if storage matters.
- **Retrieval quality is the bottleneck, hosted is fine**: Voyage 4, or `voyage-code-4`, `voyage-law-2` or `voyage-finance-2` for those domains.
- **Long documents, PDFs with figures, many languages**: Cohere Embed v5 or Gemini Embedding 2.
- **Data must stay in-house, or cost at volume dominates**: BGE-M3 (also gives you sparse vectors for [hybrid search](/glossary/hybrid-search)), Qwen3-Embedding, or Nomic Embed v1.5 for English.
- **Want to start hosted and keep a self-hosted exit**: the Voyage 4 series, since `voyage-4-nano` is open-weight and shares the embedding space.

Then confirm on your own data before you commit, because re-embedding a large corpus is the expensive way to learn the default was wrong.

For where embeddings sit in the wider system, see [How RAG Actually Works](/guides/concepts/how-rag-works). To hand the build to an agent, the [data-scientist](/agents/data-ai/data-scientist) and [rag-pipeline-engineer](/agents/data-ai/rag-pipeline-engineer) can take it from a shortlist to a measured choice.

## Continue exploring

- [Embedding Dimension](/glossary/embedding-dimension) — Embedding dimension is the length of an embedding vector — how many numbers represent each text — trading capacity against storage and search cost.
