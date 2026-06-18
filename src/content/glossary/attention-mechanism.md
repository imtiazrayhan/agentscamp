---
term: "Attention Mechanism"
description: "Attention lets a model weigh how relevant every other token is to each token, building a context-aware representation as a weighted blend of their values."
date: 2026-06-17
topics: ["data-ml"]
tags: ["attention", "self-attention", "transformer", "deep-learning", "neural-networks"]
related: ["context-window", "kv-cache", "llm-token", "tokenization", "embedding"]
faq:
  - q: "What is self-attention?"
    a: "Self-attention is attention applied within a single sequence: every token attends to every other token in the same input (including itself), so each position's representation is recomputed as a relevance-weighted blend of all the others. It is the core operation inside a transformer block, and it is what lets a model resolve a pronoun against a noun fifty words back."
  - q: "Why is attention computationally expensive?"
    a: "Standard attention compares every token against every other token, so compute and memory grow with the square of the sequence length (O(n2)). Doubling the context roughly quadruples the work, which is why long context windows are pricey and why optimizations like FlashAttention and the KV cache exist to cut memory traffic and recomputation."
---

**An attention mechanism is the operation that, for each token, computes how relevant every other token is and builds a new representation of that token as a weighted sum of the others — so meaning is shaped by context rather than position alone.**

The intuition is query/key/value. Each token emits a *query* ("what am I looking for?"), every token also exposes a *key* ("what do I offer?"), and the query is matched against all keys to produce relevance scores. Those scores are scaled and normalized (softmax) into weights, then used to blend the tokens' *value* vectors. A token attending to its grammatical subject ten words earlier simply lands a high weight on that key. When a sequence attends to itself this way it is called self-attention — the core operation inside a [transformer](/glossary/transformer) block.

Real models run **multi-head attention**: several attention patterns in parallel, each free to track a different relationship (syntax, coreference, topic), with the per-head results concatenated and projected. This captures long-range dependencies directly — any token can reach any other in one step — and the comparisons are parallelizable across the whole sequence rather than processed left-to-right.

The catch is cost: comparing every token with every other is quadratic in sequence length, so doubling the [context window](/glossary/context-window) roughly quadruples the compute and memory. That scaling is exactly what motivates optimizations like the [KV cache](/glossary/kv-cache), which reuses already-computed keys and values during generation, and [FlashAttention](/glossary/flash-attention), which restructures the computation to avoid materializing the full attention matrix.