---
term: "Quantization"
description: "Quantization shrinks a model by storing weights in lower precision (8-, 4-, even 2-bit) — cutting memory and speeding inference at a small accuracy cost."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["quantization", "inference", "local-llm", "optimization"]
related: ["inference", "lora", "self-host-vs-api-llm", "ollama", "vllm", "embedding-index-tuner"]
faq:
  - q: "How much quality does quantization cost?"
    a: "Less than intuition suggests, down to a point. 8-bit is near-lossless for most models; well-made 4-bit typically costs a few percent on benchmarks and is the local-inference default; below 4-bit degradation gets noticeable and task-dependent. Bigger models tolerate quantization better — a 4-bit 70B usually beats a full-precision 7B."
  - q: "Why does quantization matter for running models locally?"
    a: "It's the difference between fitting and not fitting. A 7B model needs ~14 GB at 16-bit but ~4 GB at 4-bit — laptop territory. Tools like Ollama and LM Studio serve quantized GGUF builds by default, which is what makes local LLMs practical on consumer hardware at all."
---

**Quantization is compressing a model by representing its weights (and sometimes activations) in lower-precision numbers — 8-bit, 4-bit, or below instead of 16-bit floats — trading a small amount of accuracy for large savings in memory and speed.**

Model weights are just numbers, and most of their precision is redundant. Mapping them onto a coarser grid shrinks a model ~4× at 4-bit, which compounds: less VRAM to fit, less memory bandwidth per token (the real bottleneck of [inference](/glossary/inference)), bigger batches per GPU. The cost is quantization error — typically a few percent at 4-bit, near-zero at 8-bit, and increasingly visible below.

It shows up everywhere in the stack: **local inference** runs on quantized GGUF builds via [Ollama](/tools/ollama) and LM Studio; **serving economics** in [self-host deployments](/guides/mlops/self-host-vs-api-llm) lean on 8/4-bit to multiply throughput per GPU; **QLoRA** fine-tunes against a quantized base ([LoRA](/glossary/lora)); and even [vector databases](/glossary/vector-database) quantize embeddings to shrink indexes. The recurring engineering move is the same: measure the quality delta on *your* task, then take the free memory.
