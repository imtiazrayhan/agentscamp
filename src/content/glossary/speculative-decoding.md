---
term: "Speculative Decoding"
description: "Speculative decoding speeds up generation: a small draft model proposes tokens, the large model verifies them in one parallel pass — same output, fewer steps."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["speculative-decoding", "inference", "performance", "serving"]
related: ["inference", "kv-cache", "quantization", "vllm", "llm-inference-engineer"]
faq:
  - q: "Does speculative decoding change the model's output?"
    a: "No — that's its defining property. The large model verifies every drafted token and rejects any it wouldn't have produced, falling back to its own choice. Accepted-or-corrected, the final sequence is distributed exactly as if the large model generated alone; you trade nothing but the draft model's overhead."
  - q: "When does it actually speed things up?"
    a: "When the draft model agrees with the target often enough — predictable text (code, structured output, boilerplate) accepts long runs; high-entropy creative text accepts fewer. Speedups of 2–3x are common in the good cases. It's a serving-side optimization: providers and engines like vLLM apply it under the hood."
---

**Speculative decoding accelerates generation by pairing models: a small, fast draft model proposes a run of tokens, and the large target model verifies them all in a single parallel pass — accepting the correct prefix and fixing the first mistake.**

It attacks the core bottleneck of [inference](/glossary/inference): decode is sequential, one expensive step per token. Verification, though, is parallelizable — checking K proposed tokens costs about one large-model step. So if the draft model guesses well (and on predictable text like code it often does), you bank several tokens per expensive step, with **provably identical output distribution** — rejected guesses are replaced by what the big model wanted anyway.

It's one of a family of lossless or near-lossless serving accelerations — alongside [KV-cache](/glossary/kv-cache) management and [quantization](/glossary/quantization) — that engines like [vLLM](/tools/vllm) and the major API providers run beneath the surface; variants (self-speculation, multi-token prediction heads like Medusa/EAGLE-style approaches) trade draft-model overhead for built-in drafting. If you're serving models yourself, it's a standard tool on the [inference engineer's](/agents/data-ai/llm-inference-engineer) bench.
