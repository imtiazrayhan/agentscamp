---
name: "Ollama"
title: "Ollama"
description: "An open-source tool to run open-weight LLMs locally with a single command, including a local OpenAI-compatible API."
url: "https://ollama.com"
date: 2026-06-04
pricing: "open-source"
category: "cli"
repo: "https://github.com/ollama/ollama"
license: "MIT"
sameAs: ["https://github.com/ollama/ollama", "https://ollama.com"]
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mlops-ai-infra"]
tags: ["local-llm", "cli", "inference", "open-source"]
featured: false
related: ["lm-studio", "self-host-vs-api-llm", "llm-inference-engineer", "vllm"]
---

Ollama is the simplest way to run open-weight LLMs **on your own machine**. Install it, run `ollama run llama3`, and you have a model answering prompts locally — no API key, no account, and nothing leaving your computer. It handles downloading and quantizing models, manages a local model library, and exposes a **local API** (including OpenAI-compatible endpoints) so you can build against a model running on localhost.

It is aimed at developers who want a model for local development, prototyping, privacy-sensitive work, or offline use. Ollama is about single-machine convenience — it's how you try an open model or wire one into an app on your laptop, not how you serve thousands of concurrent users.

## Highlights

- **One-command run** — `ollama run <model>` pulls and runs a model with no setup; a curated library covers popular open models.
- **Local API** — a REST API plus OpenAI-compatible endpoints, so app code can target a local model by changing the base URL.
- **Customizable** — a `Modelfile` lets you set system prompts, parameters, and templates, or import your own GGUF weights.
- **Cross-platform** — native apps for macOS, Windows, and Linux; runs on CPU or GPU depending on your hardware.
- **Private and offline** — models run entirely on your machine, so no data leaves it and it works without a connection.

## In an AI-assisted workflow

Run a model and call its local OpenAI-compatible endpoint from your app:

```bash
ollama run llama3.1            # pull + chat in the terminal
# or serve and call it like OpenAI:
#   base_url="http://localhost:11434/v1"  (any OpenAI client)
```

> [!TIP]
> Model size and quantization decide whether a model fits your RAM/VRAM and how fast it runs — start with a smaller or more-quantized variant and size up. For a GUI alternative to the CLI, see [LM Studio](/tools/lm-studio).

## Good to know

Ollama is free and open source under MIT for local use on your own machine, and runs on macOS, Windows, and Linux; an optional paid Ollama Cloud (Pro/Max) runs larger hosted models but isn't required. It's built for local, single-user use; when you need to serve a model to many concurrent users in production, move to a dedicated serving engine like [vLLM](/tools/vllm) and weigh the trade-offs in [Self-Host vs API](/guides/mlops/self-host-vs-api-llm).
