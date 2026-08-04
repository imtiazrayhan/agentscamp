---
term: "Flash Attention"
description: "FlashAttention is an IO-aware, exact attention algorithm that runs standard attention far faster and with less memory by tiling on-chip."
date: 2026-06-17
topics: ["mlops-ai-infra"]
tags: ["flash-attention", "gpu", "attention", "inference", "kernels"]
related: ["glossary:context-window", "glossary:inference", "glossary:kv-cache", "glossary:speculative-decoding", "glossary:batch-inference"]
faq:
  - q: "Does FlashAttention change the model's output?"
    a: "No. FlashAttention is exact, not an approximation — it computes the same numbers standard attention would, just in a different order that avoids writing the full attention matrix to slow memory. You get identical results (up to tiny floating-point reordering differences) at higher speed and lower memory, which is why it can be swapped in without retraining."
  - q: "Why is FlashAttention faster if it does the same math?"
    a: "Modern GPUs are bottlenecked on memory bandwidth, not arithmetic. Standard attention repeatedly reads and writes a large N×N matrix to slow high-bandwidth memory. FlashAttention is IO-aware: it tiles the computation so each block stays in fast on-chip SRAM and is never fully materialized, so it moves far less data and finishes sooner."
---

**FlashAttention is an IO-aware, exact algorithm for computing transformer attention that produces the same result as the standard formulation but runs much faster and uses far less memory, by tiling the computation to keep intermediate values in fast on-chip GPU SRAM and never materializing the full N×N attention matrix in slower memory.**

Standard attention computes scores between every pair of tokens, forming an N×N matrix that scales quadratically with sequence length. Writing that matrix to and from a GPU's high-bandwidth memory is the real bottleneck — not the math. FlashAttention restructures the work into small tiles that fit in SRAM, computing softmax incrementally (with a running max and sum for numerical stability) and fusing the steps into a single kernel, so the giant matrix is never stored in full.

It matters because the saving is nearly free: the result is **exact**, not a lossy approximation, so it can replace standard attention with no change to model quality. The payoff is longer practical [context windows](/glossary/context-window) and faster training and [inference](/glossary/inference), since attention memory grows linearly rather than quadratically in sequence length. It pairs naturally with the [KV cache](/glossary/kv-cache) during autoregressive decoding.

FlashAttention is a kernel-level optimization living below the model, now standard in transformer training and serving stacks. The one caveat: it is hardware- and implementation-specific, so its gains depend on having a supported GPU and a compatible kernel.