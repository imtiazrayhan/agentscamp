---
name: "Unsloth"
title: "Unsloth"
description: "An open-source library that makes LoRA/QLoRA fine-tuning of LLMs roughly 2x faster and far more memory-efficient, so you can fine-tune on a single GPU."
url: "https://unsloth.ai"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/unslothai/unsloth"
license: "Apache-2.0"
sameAs: ["https://github.com/unslothai/unsloth", "https://unsloth.ai/docs"]
os: ["Linux", "Windows", "macOS"]
color: "pink"
topics: ["mlops-ai-infra"]
audience: ["ai-engineers"]
tags: ["fine-tuning", "lora", "qlora", "llm", "open-source"]
featured: false
related: ["agent:finetuning-engineer", "skill:qlora-finetune-runner", "guide:finetune-dataset-prep", "tool:vllm"]
alternativeTo: ["hugging-face", "together-ai", "fireworks-ai"]
summary: "Unsloth is an open-source fine-tuning library (Apache-2.0 core) that trains open-weight models about 2x faster with around 70% less VRAM, so LoRA and QLoRA runs fit on one GPU or a free Colab notebook. It comes as a Python package, a web UI (Studio), and a desktop app, and exports to GGUF for local serving. About 80,000 GitHub stars as of November 2026."
faq:
  - q: "What is Unsloth?"
    a: "Unsloth is an open-source project for fine-tuning and running open-weight models. The README claims training that is 2x faster with 70% less VRAM, which is what lets a LoRA or QLoRA run fit on a single consumer GPU or a free Colab notebook. You use it as a Python package (Unsloth Core), a web UI (Unsloth Studio), or a desktop app."
  - q: "Is Unsloth free?"
    a: "Yes. The core package is open source under Apache-2.0, and optional components such as the Unsloth Studio UI are AGPL-3.0. As of November 2026 the project publishes no paid plan or price list. Your cost is the GPU you train on, which can be a free Colab or Kaggle notebook."
  - q: "What hardware does Unsloth need?"
    a: "For the Python package, the docs list NVIDIA GPUs from 2018 onward with CUDA capability 7.0 or higher (T4, RTX 20 through 50 series, A100, H100), with Python 3.11 up to but not including 3.14. AMD and Intel GPUs have their own install guides, and Unsloth Studio also trains on Apple Silicon through MLX. The README says multi-GPU setups are supported."
  - q: "Can Unsloth do more than LoRA?"
    a: "Yes. The README lists LoRA, QLoRA, full fine-tuning, pretraining, reinforcement learning with GRPO, DPO, and FP8, across LLMs, diffusion, text-to-speech, and embedding models. Passing full_finetuning = True to from_pretrained switches a run from adapters to full fine-tuning."
---

Unsloth is an open-source library that makes fine-tuning open-weight models faster and lighter on memory. Its README puts the headline at "2× faster with 70% less VRAM," which is enough that a fine-tune that would otherwise need a multi-GPU box runs on a **single consumer or cloud GPU**, including free Colab notebooks. It has about 80,000 GitHub stars as of November 2026 and is a common default for parameter-efficient fine-tuning when you don't have a cluster.

It is aimed at engineers and researchers doing LoRA or QLoRA fine-tuning who want speed and a small memory footprint without rewriting their training stack. Training runs through Hugging Face TRL's `SFTTrainer`, so it slots into familiar code. The project is now also a local-model app: Unsloth Studio (a web UI) and Unsloth Desktop run, chat with, and train models without writing Python.

## Highlights

- **Faster, lighter fine-tuning.** The notebook table in the README lists per-model results, from 1.5x faster with 50% less memory to 2x faster with 70 to 80% less.
- **QLoRA-first, not QLoRA-only.** Load a base model in 4-bit and attach LoRA adapters, or switch to 16-bit LoRA or full fine-tuning. Pretraining, GRPO reinforcement learning, DPO, and FP8 are also supported.
- **More than chat LLMs.** Vision, text-to-speech, embedding, and diffusion models can be trained with the same package.
- **Three ways to use it.** Unsloth Core is the Python package, Unsloth Studio is the web UI (`unsloth studio`), and Unsloth Desktop is an installer for Windows, macOS, and Linux.
- **Export for serving.** Save to GGUF, NVFP4, or FP8, then serve the result with llama.cpp or vLLM.
- **Ready-made notebooks.** Free Colab and Kaggle notebooks cover current models, including gpt-oss (20B), Gemma 4, and Qwen3.5.
- **Agent hookup.** `unsloth start claude` (or `codex`, `opencode`, `vscode`) points a coding agent at a local model with one command.

## In an AI-assisted workflow

Install the package on Linux or WSL:

```bash
uv venv unsloth_env --python 3.13
source unsloth_env/bin/activate
uv pip install unsloth --torch-backend=auto
```

Then load a model in 4-bit, attach LoRA adapters, and train on a prepared dataset. This is the shape of the official gpt-oss (20B) notebook:

```python
from unsloth import FastLanguageModel
from trl import SFTConfig, SFTTrainer

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/gpt-oss-20b",
    max_seq_length = 1024,
    load_in_4bit = True,       # 4-bit quantization to reduce memory
    full_finetuning = False,   # True switches from LoRA to full fine-tuning
)

model = FastLanguageModel.get_peft_model(
    model,
    r = 8,                     # LoRA rank; suggested 8, 16, 32, 64, 128
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                      "gate_proj", "up_proj", "down_proj"],
    lora_alpha = 16,
    use_gradient_checkpointing = "unsloth",
)

trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,   # your formatted dataset
    args = SFTConfig(
        per_device_train_batch_size = 1,
        gradient_accumulation_steps = 4,
        max_steps = 30,
        learning_rate = 2e-4,
        optim = "adamw_8bit",
        output_dir = "outputs",
    ),
)
trainer.train()
```

Swap `model_name` for any model in Unsloth's Hugging Face catalog. `max_steps = 30` is the notebook's smoke-test value; set `num_train_epochs` for a real run.

> [!TIP]
> Speed doesn't fix data. Unsloth makes the *run* cheap, but the result is still decided by the dataset — prepare it carefully first (see [Preparing a Fine-Tuning Dataset](/guides/mlops/finetune-dataset-prep)) and drive the run with the [QLoRA Fine-Tune Runner](/skills/data/qlora-finetune-runner).

## Good to know

**License.** The README describes "a dual-licensing model of Apache 2.0 and AGPL-3.0": the core package is Apache-2.0, and optional components such as the Unsloth Studio UI are AGPL-3.0. That matters if you plan to embed Studio in a product; the Python package has no such constraint.

**Platforms.** The README says Unsloth works on Windows, Linux, WSL, and macOS, with NVIDIA, AMD, and Intel GPUs. The details are narrower. The Python package targets Linux and Windows with NVIDIA GPUs at CUDA capability 7.0 or higher. AMD and Intel need their own install guides. On a Mac, training goes through Studio and MLX. On Windows, install `torchao` before `unsloth`, or the one-step install can silently resolve an old version.

**Limits.** The speed and memory figures are the project's own, measured on its notebooks, so benchmark on your model and data before you plan around them. Unsloth handles training and local inference; it is not a production serving engine. The docs point multi-user deployments to [vLLM](/tools/vllm).

Against the alternatives: the [Hugging Face](/tools/hugging-face) libraries (Transformers, PEFT, TRL) are what Unsloth builds on, and using them directly gives you the same adapters without Unsloth's optimizations or its opinions. [Together AI](/tools/together-ai) and [Fireworks AI](/tools/fireworks-ai) run fine-tuning as a managed service: you upload a dataset and get a hosted endpoint, with no GPU to manage and no local copy of the training loop. Pick Unsloth when you want the weights and the run on hardware you control. For the end-to-end decision and evaluation, use the [finetuning-engineer](/agents/data-ai/finetuning-engineer) agent.
