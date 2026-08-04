---
title: "How Embeddings Work: Vectors, Similarity, and Choosing a Model"
description: "What an embedding actually is, how similarity is measured, how the models are trained, and the practical rules for using embeddings well in search and RAG."
author: "AgentsCamp"
color: "green"
topics: ["data-ml", "rag-retrieval"]
tags: ["embeddings", "vectors", "semantic-search", "rag", "concepts"]
related: ["glossary:embedding", "glossary:cosine-similarity", "glossary:vector-database", "guide:choosing-embeddings-2026", "guide:how-rag-works"]
featured: false
date: 2026-06-17
summary: "An embedding turns text or images into a vector positioned so that semantic similarity becomes geometric closeness. Search, RAG, clustering, and dedup all reduce to comparing those vectors. The non-negotiable rules: queries and documents must use the same model, vectors should be normalized, and changing models means re-embedding everything."
keyTakeaways:
  - "An embedding maps content to a fixed-length vector where 'similar meaning' becomes 'close in space.'"
  - "Cosine similarity is the default metric; on normalized vectors it equals the dot product."
  - "Query and document MUST be embedded with the same model — mixing models produces meaningless distances."
  - "Choosing a model is a trade-off between retrieval quality, dimension (storage/speed), cost, and max input length."
  - "Switching embedding models invalidates your whole index: you must re-embed every document."
  - "Embeddings capture similarity, not truth or freshness — they don't know facts, only resemblance."
faq:
  - q: "Cosine similarity or dot product — which should I use?"
    a: "If your vectors are L2-normalized (unit length), cosine similarity and dot product are mathematically identical, and most modern embedding models output normalized vectors. Use cosine (or its faster equivalent, dot product on normalized vectors) unless your model's docs explicitly say otherwise. Euclidean distance also ranks the same way on normalized vectors."
  - q: "Can I mix two different embedding models for queries and documents?"
    a: "No. Each model defines its own coordinate space, so a vector from model A and a vector from model B are not comparable — the distances between them are noise. Embed your documents and your queries with the exact same model and version. If you upgrade the model, you must re-embed the entire corpus."
  - q: "Does a higher dimension always mean better quality?"
    a: "No. More dimensions can capture more nuance but cost more storage and slow down search, and many high-dimension models are beaten by smaller, better-trained ones. Pick based on benchmark quality for your domain, then treat dimension as a cost/latency knob — some models (Matryoshka-style) even let you truncate dimensions with graceful quality loss."
howtoSteps:
  - name: "Pick one embedding model"
    text: "Choose a single model based on retrieval quality for your domain, max input length, dimension (storage/latency), and cost. Pin the exact version."
  - name: "Chunk your documents"
    text: "Split documents into passages that fit the model's context and represent one idea each. Smaller chunks = sharper matches; larger = more context per hit."
  - name: "Embed documents and store the vectors"
    text: "Run every chunk through the model and store the resulting vectors (plus metadata and source text) in a vector database. Normalize if the model doesn't already."
  - name: "Embed the query with the SAME model"
    text: "At query time, embed the user's query with the identical model and version, then search the index by cosine similarity / dot product."
  - name: "Re-embed when you change models"
    text: "If you swap embedding models, rebuild the entire index — old and new vectors live in incompatible spaces and cannot be compared."
---

**An embedding turns a piece of text (or an image) into a vector — a list of numbers — positioned so that things with similar meaning land close together in that space.** That single property is what powers semantic search, [RAG](/guides/concepts/how-rag-works), clustering, dedup, and recommendations: instead of matching exact words, you compare geometry.

## What an embedding actually is

An [embedding](/glossary/embedding) is a fixed-length vector — say 768 or 1536 numbers — produced by a neural model from your input. The model is trained so that inputs meaning similar things get vectors pointing in similar directions, and unrelated inputs get vectors pointing elsewhere.

"Dog" and "puppy" land near each other. "Dog" and "tax form" land far apart. The vector itself is opaque — you can't read meaning out of position 412 — but distances between vectors are meaningful, and that's all you need.

The key shift from keyword search: embeddings match on *meaning*, not *spelling*. A query for "how do I cancel my subscription" can retrieve a passage titled "ending your plan" with zero shared keywords, because the two sit close in vector space.

## How similarity is measured

Once everything is a vector, "is X like Y?" becomes "how close are these two vectors?" The standard metric is [cosine similarity](/glossary/cosine-similarity): the cosine of the angle between two vectors, ranging from 1 (same direction) to -1 (opposite).

Cosine measures *direction*, not *magnitude* — which is what you want, because the meaning of text shouldn't depend on its vector's length. Two practical facts:

- **On normalized (unit-length) vectors, cosine similarity equals the dot product.** Most modern models output normalized vectors, so vector databases just compute dot products — it's faster and identical.
- **Euclidean distance ranks identically to cosine on normalized vectors.** So the metric choice is mostly about whether your vectors are normalized, not about quality.

Rule of thumb: normalize your vectors (if the model doesn't already) and use cosine / dot product. Don't overthink the metric.

## What the dimensions mean (and don't)

A 1536-dimension embedding has 1536 numbers, but no single dimension corresponds to a human concept like "is about sports." Meaning is distributed across the whole vector — it's the overall geometry that carries information, not individual axes.

So more dimensions ≠ smarter. They give the model more room to encode nuance, but they also cost more to store and are slower to search. Plenty of 768-dim models beat 3072-dim ones on real retrieval benchmarks. Treat dimension as a **cost and latency knob**, and judge quality separately on benchmarks. Some models use Matryoshka representation learning, which lets you truncate the vector (e.g. 1536 → 512) with only modest quality loss — a cheap way to shrink your index.

## How embedding models are trained (high level)

Embedding models are trained with **contrastive learning**: show the model pairs that *should* be similar (a question and its answer, a sentence and its paraphrase) and pairs that should not, then nudge the weights so similar pairs get closer and dissimilar pairs get pushed apart.

Two consequences matter in practice:

- The model only "knows" the kinds of similarity it saw in training. A model trained on web text and Q&A pairs will be great at general semantic search and mediocre at, say, matching legal clauses or genomic sequences.
- The output space is entirely defined by that specific model's training. **There is no universal embedding space.** Vectors from two different models are not comparable.

## Choosing an embedding model

This is the decision that determines your retrieval ceiling. See [choosing embeddings in 2026](/guides/concepts/choosing-embeddings-2026) for current model comparisons; the trade-off axes are:

- **Retrieval quality** — the only thing that matters to users. Check benchmarks (MTEB and friends), but ideally measure on *your* data with a small labeled query set.
- **Dimension** — drives storage and search latency. Lower is cheaper; pick the smallest dimension that holds quality.
- **Max input length** — if your chunks exceed it, the model truncates silently and you lose the tail. Match chunk size to this limit.
- **Cost / hosting** — API per-token pricing vs. self-hosting an open-weights model. High-volume re-embedding can dominate cost.
- **Domain fit** — a general model on specialized text (medical, legal, code) often underperforms a domain-tuned one.

Don't pick the biggest model by default. Pick the one with the best measured quality on your domain at an acceptable dimension and cost.

## The rules that bite people

These are the failure modes that quietly wreck retrieval:

- **Query and document must use the same model and version.** Each model defines its own space; mixing models compares apples to a coordinate system. This is the #1 silent bug — relevance just looks "off."
- **Re-embed everything when you change models.** Upgrading the model invalidates the entire index. You cannot incrementally migrate; old vectors live in an incompatible space. Budget for a full rebuild.
- **Domain mismatch degrades quietly.** If your content is far from the model's training distribution, similarity scores compress and ranking gets noisy. Evaluate before trusting it.
- **Chunk size shapes results.** Small chunks give sharp, precise matches but may lack context; large chunks retrieve more context per hit but dilute the signal so the relevant sentence gets averaged away. Tune chunk size against your eval set.
- **Normalize consistently.** If some vectors are normalized and others aren't, magnitude leaks into your distances. Normalize at ingestion and query time both.

## What embeddings are good for — and their limits

Strong fits:

- **Semantic search & RAG** — retrieve passages by meaning to ground an LLM's answer.
- **Clustering** — group similar items without labels.
- **Deduplication** — near-duplicates have near-identical vectors.
- **Classification** — embed, then train a light classifier on top.
- **Recommendations** — "more like this" via nearest neighbors.

All of these store vectors in a [vector database](/glossary/vector-database) and run nearest-neighbor search.

The limits are just as important:

- Embeddings capture **similarity, not truth.** "The drug is safe" and "the drug is not safe" can sit close together — opposite meaning, similar surface. Pure vector search can't reliably distinguish them.
- They have **no notion of freshness or facts.** A vector doesn't know which document is current or correct; that's metadata's job.
- Dense retrieval can miss **exact-match needs** like product codes, error strings, or rare names — which is why hybrid search (combining embeddings with keyword/BM25) and reranking usually beat embeddings alone.

Embeddings are the right primitive for "find me things that mean roughly this." For anything requiring precision, logic, or recency, pair them with keyword search, metadata filters, and a reranker.

## Steps to use embeddings well

1. **Pick one embedding model** based on retrieval quality for your domain, max input length, dimension, and cost. Pin the exact version.
2. **Chunk your documents** into passages that fit the model's context and capture one idea each.
3. **Embed documents and store the vectors** (plus metadata and source text) in a vector database; normalize if the model doesn't.
4. **Embed the query with the same model** and search by cosine similarity / dot product.
5. **Re-embed when you change models** — rebuild the entire index, since old and new vectors live in incompatible spaces.

## Continue exploring

- [Multimodal Embeddings and Image Search](/guides/vision/multimodal-embeddings-and-image-search) — How multimodal embeddings put images and text in one vector space, and how to build text-to-image and image-to-image search on top of it.
