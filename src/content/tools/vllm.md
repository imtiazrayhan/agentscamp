---
name: "vLLM"
title: "vLLM"
description: "A high-throughput, memory-efficient inference and serving engine for LLMs, with PagedAttention, continuous batching, and an OpenAI-compatible API server."
url: "https://docs.vllm.ai"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/vllm-project/vllm"
license: "Apache-2.0"
sameAs: ["https://github.com/vllm-project/vllm", "https://docs.vllm.ai"]
os: ["Linux"]
color: "red"
topics: ["mlops-ai-infra"]
tags: ["llm", "inference", "serving", "gpu", "open-source"]
featured: false
related: ["llm-inference-engineer", "self-host-vs-api-llm", "scaffold-vllm-config", "ollama", "lm-studio"]
---

vLLM is an open-source inference and serving engine built to run open-weight LLMs with **high throughput** and efficient GPU memory use. Its headline innovation, **PagedAttention**, manages the KV cache like virtual memory so the GPU wastes far less on fragmentation and padding — which, combined with **continuous (in-flight) batching**, keeps the hardware saturated and pushes far more tokens per second than naive serving. It's the engine most teams reach for when self-hosting an LLM for production traffic.

It is aimed at engineers serving open models at scale who need concurrency, low cost-per-token, and a drop-in API. vLLM ships an **OpenAI-compatible server**, so existing client code can point at your self-hosted model by changing a base URL.

## Highlights

- **PagedAttention** — KV-cache management that minimizes memory waste and enables high concurrency.
- **Continuous batching** — new requests join the batch in flight instead of waiting, so the GPU isn't idle between requests.
- **OpenAI-compatible API** — serve `/v1/chat/completions` and friends; existing OpenAI clients work by swapping the base URL.
- **Quantization & parallelism** — supports AWQ/GPTQ/FP8 and tensor/pipeline parallelism to fit large models and trade quality for footprint.
- **Broad model support** — runs most popular open architectures (Llama, Mistral, Qwen, Gemma, and more).

## In an AI-assisted workflow

Serve a model with an OpenAI-compatible endpoint, then call it like any OpenAI client:

```bash
# start the server (single GPU; add --tensor-parallel-size N for multi-GPU)
vllm serve meta-llama/Llama-3.1-8B-Instruct --max-model-len 8192

# now hit it with any OpenAI client, just change the base URL:
#   base_url="http://localhost:8000/v1"
```

> [!TIP]
> Most of vLLM's throughput comes from keeping the batch full — tune `--max-num-seqs`, `--gpu-memory-utilization`, and (for big models) `--tensor-parallel-size` to your GPU and SLO. The [llm-inference-engineer](/agents/data-ai/llm-inference-engineer) tunes these against a p95 and cost target; [Scaffold a vLLM Serving Config](/commands/scaffold/scaffold-vllm-config) gets you a sane starting config.

## Good to know

vLLM is free and open source under Apache-2.0 and targets Linux with NVIDIA (and other) accelerators — it's production-serving infrastructure, not a local desktop app. For running a model locally on a laptop for development, [Ollama](/tools/ollama) or [LM Studio](/tools/lm-studio) are the simpler fit; weigh self-hosting against a hosted API in [Self-Host vs API](/guides/mlops/self-host-vs-api-llm).
