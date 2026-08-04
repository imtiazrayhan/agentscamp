---
term: "LoRA (Low-Rank Adaptation)"
description: "LoRA fine-tunes a model by training small low-rank adapter matrices instead of all weights — a fraction of the memory and cost, nearly full-tune quality."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["lora", "qlora", "fine-tuning", "peft"]
related: ["glossary:fine-tuning", "glossary:quantization", "skill:qlora-finetune-runner", "tool:unsloth", "guide:finetune-dataset-prep"]
faq:
  - q: "What's the difference between LoRA and QLoRA?"
    a: "QLoRA is LoRA on top of a quantized base model: the frozen weights are loaded in 4-bit precision while the trainable adapters stay higher-precision. That cuts memory enough to fine-tune models in the 7–70B class on a single consumer or prosumer GPU, at a small quality cost that's usually acceptable."
  - q: "Do LoRA adapters change the original model?"
    a: "No — the base weights stay frozen. Training produces a small adapter file (often tens of megabytes) that's applied on top at inference, or merged into the weights for deployment. That's the operational win: one base model, many cheap task adapters, swappable per workload."
---

**LoRA (Low-Rank Adaptation) is the technique that made fine-tuning affordable: instead of updating a model's billions of weights, it freezes them and trains small low-rank matrices injected alongside — typically well under 1% of parameters — capturing most of the quality of a full fine-tune.**

The insight is that the *change* a fine-tune needs is low-rank: representable as the product of two thin matrices per adapted layer. Training only those slashes GPU memory (no optimizer state for frozen weights), produces megabyte-scale adapter artifacts instead of full model copies, and lets one base model serve many tasks by swapping adapters. **QLoRA** stacks [quantization](/glossary/quantization) underneath — a 4-bit frozen base with trainable adapters — bringing 7–70B-class [fine-tuning](/glossary/fine-tuning) onto single GPUs.

In practice LoRA/QLoRA is the default for open-weight model tuning, with libraries like [Unsloth](/tools/unsloth) optimizing the loop. The end-to-end procedure — dataset to adapter to eval — is packaged in the [qlora-finetune-runner](/skills/data/qlora-finetune-runner) skill; whether you should be fine-tuning at all is the [decision-tree guide](/guides/mlops/finetune-vs-rag-vs-prompt)'s question.
