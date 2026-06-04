---
name: "Unsloth"
title: "Unsloth"
description: "An open-source library that makes LoRA/QLoRA fine-tuning of LLMs roughly 2x faster and far more memory-efficient, so you can fine-tune on a single GPU."
url: "https://unsloth.ai"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/unslothai/unsloth"
license: "Apache-2.0"
sameAs: ["https://github.com/unslothai/unsloth", "https://unsloth.ai/docs"]
os: ["Linux", "Windows"]
color: "pink"
topics: ["mlops-ai-infra"]
tags: ["fine-tuning", "lora", "qlora", "llm", "open-source"]
featured: false
related: ["finetuning-engineer", "qlora-finetune-runner", "finetune-dataset-prep", "vllm"]
---

Unsloth is an open-source library that makes fine-tuning open-weight LLMs dramatically faster and lighter on memory. Through hand-optimized kernels and a QLoRA-first design, it cuts training time and VRAM use enough that a fine-tune which would otherwise need a big multi-GPU box runs on a **single consumer or cloud GPU** — including free Colab notebooks. It's a common default for parameter-efficient fine-tuning when you don't have a cluster.

It is aimed at engineers and researchers doing LoRA/QLoRA fine-tuning who want speed and a small memory footprint without rewriting their training stack. Unsloth integrates with the Hugging Face ecosystem (TRL/PEFT), so it slots into familiar training code.

## Highlights

- **Faster, lighter fine-tuning** — optimized kernels deliver roughly 2x faster training with substantially lower VRAM than a standard setup.
- **QLoRA-first** — 4-bit base + LoRA adapters so large models fit and train on a single GPU.
- **Broad model support** — Llama, Mistral, Qwen, Gemma, Phi, and other popular open architectures.
- **Hugging Face-native** — works with TRL/PEFT and standard datasets, so it drops into existing workflows.
- **Ready-made notebooks** — free Colab/Kaggle notebooks to fine-tune end to end without local setup.

## In an AI-assisted workflow

Load a model in 4-bit, attach LoRA adapters, and train on a prepared dataset:

```python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    "unsloth/llama-3.1-8b-bnb-4bit", load_in_4bit=True, max_seq_length=2048,
)
model = FastLanguageModel.get_peft_model(model, r=16)  # LoRA rank
# ...then train with TRL's SFTTrainer on your formatted dataset
```

> [!TIP]
> Speed doesn't fix data. Unsloth makes the *run* cheap, but the result is still decided by the dataset — prepare it carefully first (see [Preparing a Fine-Tuning Dataset](/guides/mlops/finetune-dataset-prep)) and drive the run with the [QLoRA Fine-Tune Runner](/skills/data/qlora-finetune-runner).

## Good to know

Unsloth's core package is free and open source under Apache-2.0 (the optional Unsloth Studio UI is AGPL-3.0); it targets Linux and Windows with NVIDIA GPUs and runs in hosted notebooks, with an Unsloth Pro/Enterprise option for optimized multi-GPU and multi-node scaling. It handles the *training* side; for serving the resulting model in production, pair it with [vLLM](/tools/vllm), and for the end-to-end decision and evaluation, the [finetuning-engineer](/agents/data-ai/finetuning-engineer).
