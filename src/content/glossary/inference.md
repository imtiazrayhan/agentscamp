---
term: "Inference"
description: "Inference is running a trained model to produce output — for LLMs, generating tokens one at a time. Its cost and latency define the economics of AI products."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["inference", "serving", "latency", "llm"]
related: ["guide:llm-cost-latency-engineering", "glossary:kv-cache", "glossary:quantization", "glossary:speculative-decoding", "tool:vllm", "guide:self-host-vs-api-llm"]
faq:
  - q: "Why is LLM inference expensive?"
    a: "Generation is sequential: each output token requires a full forward pass over billions of weights, and you can't produce token N+1 before token N. Reading the prompt parallelizes well; writing the answer doesn't. That asymmetry is why output tokens cost more than input tokens and why long answers dominate latency."
  - q: "What's the difference between time-to-first-token and throughput?"
    a: "TTFT is how long before the first token appears — dominated by prompt processing, it's what makes chat feel responsive (and what streaming exploits). Throughput is tokens per second once generation is rolling — what determines total time and serving capacity. Optimizations often trade one against the other; know which one your product feels."
---

**Inference is using a trained model rather than training it: for LLMs, the process of generating output tokens one at a time, each requiring a full pass through the model's weights.**

Two phases with different physics: **prefill** processes the whole prompt in parallel (compute-bound, sets time-to-first-token), then **decode** generates autoregressively, one token per step (memory-bandwidth-bound, sets tokens-per-second). The [KV cache](/glossary/kv-cache) keeps decode from re-reading the prompt each step; [quantization](/glossary/quantization) shrinks the weights being streamed; [speculative decoding](/glossary/speculative-decoding) drafts several tokens per big-model step; engines like [vLLM](/tools/vllm) batch many requests over the same weights.

Inference economics shape every LLM product decision: API pricing per [token](/glossary/llm-token), the [self-host vs API question](/guides/mlops/self-host-vs-api-llm) (which is really "can your utilization beat a provider's"), and the latency budget your UX can absorb. The applied playbook — caching, right-sizing models, p95 budgets — is [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering).
