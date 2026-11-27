---
name: "Ollama"
title: "Ollama"
description: "An open-source tool that runs open-weight LLMs locally with one command and serves them through OpenAI- and Anthropic-compatible APIs, plus paid cloud models."
url: "https://ollama.com"
date: 2026-06-04
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "cli"
repo: "https://github.com/ollama/ollama"
license: "MIT"
sameAs: ["https://github.com/ollama/ollama", "https://ollama.com"]
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mlops-ai-infra"]
audience: ["developers"]
tags: ["local-llm", "cli", "inference", "open-source"]
featured: false
related: ["tool:lm-studio", "guide:self-host-vs-api-llm", "agent:llm-inference-engineer", "tool:vllm"]
alternativeTo: ["lm-studio", "llama-cpp", "jan", "vllm"]
summary: "Ollama is an MIT-licensed runtime for open-weight LLMs. ollama run gemma4 downloads a model and starts a chat with no account, and a local server on port 11434 speaks the Ollama, OpenAI and Anthropic API formats. Local use is free. Ollama Cloud runs larger models on Ollama's servers, pay per token or on Pro and Max plans with monthly usage credits."
faq:
  - q: "Is Ollama free?"
    a: "Running models on your own machine is free and open source under the MIT license, with no account. Ollama Cloud is the paid part: as of November 2026 the pay-as-you-go tier has no subscription and bills cloud models per token, Pro is $20 a month with $60 of usage credits, Max is $100 a month with $300 of credits, and Team, in early access, is $500 a month with $1,000 of shared credits."
  - q: "How much RAM or VRAM do I need for Ollama?"
    a: "Enough to hold the model file plus its context. Ollama's library lists a size for each tag: for Gemma 4, about 4.6 to 7.5 GB for e2b, 7.7 to 8.0 GB for 12b and 19 to 20 GB for 31b. Ollama also sets the default context from your VRAM: 4k tokens under 24 GiB, 32k from 24 to 48 GiB, and 256k at 48 GiB or more. Run ollama ps to see whether a loaded model is fully on the GPU."
  - q: "Does Ollama send my prompts to its servers?"
    a: "Not for local models: Ollama's FAQ says it does not see your prompts or data when you run locally. Cloud models are processed on Ollama's servers under what its docs call a zero data retention policy, without storing, logging or training on the content. To rule cloud use out entirely, set OLLAMA_NO_CLOUD=1 or disable_ollama_cloud in ~/.ollama/server.json."
  - q: "Ollama vs LM Studio?"
    a: "Both run open models locally. Ollama is a background service with a CLI and API first, which suits scripts, coding agents and apps that call localhost; it also has a desktop app. LM Studio is a GUI for browsing, downloading and tuning models visually. Neither is built for high-concurrency production serving; use a dedicated engine such as vLLM for that."
---

Ollama is an open-source runtime for running open-weight LLMs **on your own machine**. Install it, run `ollama run gemma4`, and a model is answering prompts locally with no API key and no account. It downloads models from its own library, keeps a local server running on port 11434, and exposes that server in three API formats: Ollama's own, OpenAI's and Anthropic's.

It is aimed at developers who want a model for local development, prototyping, privacy-sensitive work or offline use, and increasingly at people who want to point a coding agent at an open model. The company also sells Ollama Cloud, which runs larger models on Ollama's hardware through the same CLI and API.

## Highlights

- **One-command run.** `ollama run <model>` pulls a model and opens a chat; `ollama pull`, `ollama ps` and `ollama create` manage the local library. Model names are short tags such as `gemma4:e2b` or `qwen3.5:9b`.
- **Three API formats on localhost.** `/api/chat` is the native API; `/v1/chat/completions` and `/v1/responses` follow OpenAI's; `/v1/messages` follows Anthropic's. The OpenAI-compatible routes support vision and tool calling. The Responses route is stateless, so `previous_response_id` is not supported.
- **Agent launcher.** `ollama launch claude`, `ollama launch codex` and `ollama launch opencode` start a coding agent wired to an Ollama model, and the macOS app can connect Claude Desktop and ChatGPT Desktop.
- **Modelfile.** A `Modelfile` sets a base model with `FROM`, parameters such as `num_ctx` and `temperature`, and a `SYSTEM` prompt. It also imports your own GGUF file or a directory of Safetensors weights.
- **Broad GPU support.** NVIDIA cards with compute capability 5.0 or higher and driver 550 or newer, AMD Radeon through ROCm, Apple GPUs through Metal, and additional Windows and Linux GPUs through Vulkan. Without a supported GPU it runs on the CPU.
- **Ollama Cloud.** Cloud models run from the same app, CLI and API, or directly at `https://ollama.com/api` with an API key and no local install. Cloud models do not support structured outputs as of November 2026.

## In an AI-assisted workflow

```bash
# macOS / Linux (Windows PowerShell: irm https://ollama.com/install.ps1 | iex)
curl -fsSL https://ollama.com/install.sh | sh

ollama run gemma4:e2b        # pull + chat in the terminal

# call it like OpenAI from any client or script
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma4:e2b",
    "messages": [{"role": "user", "content": "Say hello in one sentence."}]
  }'
```

Existing OpenAI SDK code works by setting the base URL to `http://localhost:11434/v1`.

Sizing is the part that decides whether local works for you:

| Gemma 4 tag | Download size listed by Ollama | Context window |
| --- | --- | --- |
| `gemma4:e2b` | 4.6 to 7.5 GB | 128K |
| `gemma4:12b` | 7.7 to 8.0 GB | 256K |
| `gemma4:26b` | 16 to 19 GB | 256K |
| `gemma4:31b` | 19 to 20 GB | 256K |

The model has to fit in memory with room for the context, and a model that spills from VRAM to CPU slows down sharply. `ollama ps` shows the split in its `PROCESSOR` column; aim for `100% GPU`.

> [!TIP]
> The default context is small on most machines: 4k tokens below 24 GiB of VRAM and 32k from 24 to 48 GiB. Ollama's docs say agents, coding tools and web search need at least 64,000 tokens, so raise it in the app's settings or with `OLLAMA_CONTEXT_LENGTH=64000 ollama serve` before blaming the model for forgetting things.

## Pricing

Local use is free. Ollama Cloud prices, as of November 2026 from [ollama.com/pricing](https://ollama.com/pricing):

- **Pay as you go: $0 subscription.** Pay per token for cloud models, with 3 concurrent requests.
- **Pro: $20 a month** (or $200 a year), including $60 of usage credits a month and access to larger models.
- **Max: $100 a month**, including $300 of usage credits, 10 concurrent requests and early access to new models.
- **Team: $500 a month**, in early access as of November 2026, with unlimited users and $1,000 of shared credits. **Enterprise** is custom.

Per-token rates vary by model and some models have cheaper off-peak rates, so check the pricing page's model table for the one you plan to use.

## Good to know

- **Single-machine by design.** Requests beyond what memory allows are queued (512 by default), and on most backends each model handles one request at a time unless you set `OLLAMA_NUM_PARALLEL`. Parallel requests multiply context memory.
- **Local means local only if you keep it that way.** Cloud models and web search go through ollama.com. `OLLAMA_NO_CLOUD=1` turns those features off.
- **Version.** v0.40.18 is the latest release as of November 2026; the project has about 188,000 GitHub stars.
- **Old tutorials.** Many guides still use `llama3` or `llama3.1`, which remain in the library but date from 2024. Pick a current family such as Gemma 4 or Qwen 3.5 unless you need to reproduce older results.

Against the alternatives: [LM Studio](/tools/lm-studio) is the GUI-first option ([Ollama vs LM Studio](/guides/comparisons/ollama-vs-lm-studio)). [llama.cpp](/tools/llama-cpp) gives you the engine directly, with every flag and backend exposed and no model library. [vLLM](/tools/vllm) is the tool for serving one model to many concurrent users on GPUs ([vLLM vs Ollama](/guides/comparisons/vllm-vs-ollama)). To decide whether to self-host at all, read [Self-Host vs API](/guides/mlops/self-host-vs-api-llm).
