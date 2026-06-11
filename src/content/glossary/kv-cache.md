---
term: "KV Cache"
description: "The KV cache stores each token's attention keys and values so an LLM doesn't recompute the whole context per new token — the memory that makes generation fast."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["kv-cache", "inference", "attention", "performance"]
related: ["inference", "prompt-caching", "context-window", "vllm", "speculative-decoding"]
faq:
  - q: "Why does the KV cache matter for serving costs?"
    a: "Because it's the VRAM your context occupies. Every token in flight holds its keys and values in GPU memory, growing linearly with context length and concurrent requests — long-context serving is usually KV-memory-bound before it's compute-bound. Engines like vLLM exist largely to manage this memory well (PagedAttention), and tricks like KV quantization stretch it."
  - q: "Is prompt caching the same as the KV cache?"
    a: "Prompt caching is built on it. The KV cache is the in-memory structure during a single generation; provider-level prompt caching persists the KV state of a stable prompt prefix between requests, so repeated context skips recomputation entirely. One is mechanism, the other is product."
---

**The KV cache is the stored attention state — the key and value vectors for every processed token — that lets a transformer generate each new token by attending over cached history instead of recomputing the entire context from scratch.**

Without it, producing token N would mean reprocessing all N−1 prior tokens — quadratic waste. With it, [inference](/glossary/inference) splits cleanly: prefill computes the prompt's KV once, then each decode step computes one new token's attention against the cache. The trade is memory: KV state grows with context length × batch size, which is why long-[context](/glossary/context-window) serving exhausts VRAM before compute, why serving engines like [vLLM](/tools/vllm) build their architecture around KV memory management, and why KV quantization and eviction schemes are an active frontier.

Two product-level features sit on top of it: [prompt caching](/glossary/prompt-caching) persists prefix KV state across requests for cost savings, and [speculative decoding](/glossary/speculative-decoding) exploits cheap cache-backed verification to accept multiple drafted tokens per step.
