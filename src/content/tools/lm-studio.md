---
name: "LM Studio"
title: "LM Studio"
description: "A desktop app for discovering, downloading, and running open-weight LLMs locally with a GUI and a local OpenAI-compatible server."
url: "https://lmstudio.ai"
date: 2026-06-04
pricing: "freemium"
category: "platform"
sameAs: ["https://lmstudio.ai/docs", "https://github.com/lmstudio-ai"]
os: ["macOS", "Windows", "Linux"]
color: "orange"
topics: ["mlops-ai-infra"]
tags: ["local-llm", "desktop", "gui", "inference"]
featured: false
related: ["ollama", "vllm", "self-host-vs-api-llm", "llm-inference-engineer"]
---

LM Studio is a desktop application for running open-weight LLMs locally through a **graphical interface**. Where a CLI tool asks you to know the model name and flags, LM Studio lets you browse and download models, chat with them in a built-in UI, and tune parameters with sliders — then, when you're ready to build, flip on a **local server** that exposes an OpenAI-compatible API. It's the most approachable on-ramp to local models for people who'd rather not live in the terminal.

It is aimed at developers, researchers, and power users who want to experiment with local models, keep data on their own machine, and develop against a local endpoint — all without managing a Python environment. It runs GGUF (and on Apple Silicon, MLX) models on CPU or GPU.

## Highlights

- **Model discovery & download** — browse and pull open models from within the app, with guidance on what fits your hardware.
- **Built-in chat UI** — converse with a local model and adjust parameters visually, no code required.
- **Local OpenAI-compatible server** — serve the loaded model on localhost so your app's OpenAI client works unchanged.
- **GGUF & MLX** — runs quantized models efficiently on CPU/GPU, with native Apple Silicon (MLX) support.
- **Private by default** — everything runs locally; no account needed and no data leaves your machine.

## In an AI-assisted workflow

Download a model in the GUI, start the local server, and point your OpenAI client at it:

```bash
# in LM Studio: pick a model → "Local Server" → Start
#   base_url="http://localhost:1234/v1"   (any OpenAI client)
```

> [!TIP]
> LM Studio (GUI) and [Ollama](/tools/ollama) (CLI) solve the same problem — running models locally — from opposite ends. Choose by preference: a visual app for exploring and tuning, a command line for scripting and automation.

## Good to know

LM Studio is free to download and use for both personal and commercial/work use, and runs on macOS, Windows, and Linux; organizations can buy an optional Enterprise tier (SSO, governance). Like other local runners it's built for single-machine development and privacy, not high-concurrency production serving — for that, see [vLLM](/tools/vllm) and the [Self-Host vs API](/guides/mlops/self-host-vs-api-llm) trade-offs.
