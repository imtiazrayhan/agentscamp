---
name: "vLLM"
title: "vLLM"
description: "A high-throughput, memory-efficient inference and serving engine for LLMs, with PagedAttention, continuous batching, and an OpenAI-compatible API server."
url: "https://docs.vllm.ai"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/vllm-project/vllm"
license: "Apache-2.0"
sameAs: ["https://github.com/vllm-project/vllm", "https://docs.vllm.ai"]
os: ["Linux"]
color: "red"
topics: ["mlops-ai-infra"]
audience: ["ai-engineers"]
tags: ["llm", "inference", "serving", "gpu", "open-source"]
featured: false
related: ["agent:llm-inference-engineer", "guide:self-host-vs-api-llm", "command:scaffold-vllm-config", "tool:ollama", "tool:lm-studio"]
alternativeTo: ["ollama", "lm-studio", "llama-cpp", "litellm"]
summary: "vLLM is an Apache-2.0 inference and serving engine for open-weight LLMs, started at UC Berkeley's Sky Computing Lab. PagedAttention and continuous batching keep a GPU busy under concurrent load, and `vllm serve` exposes an OpenAI-compatible API on port 8000. It targets Linux with Python 3.11 to 3.14; the latest release is v0.34.0, from November 2026."
faq:
  - q: "How do I install vLLM and serve a model?"
    a: "On Linux with Python 3.11 to 3.14, run uv pip install vllm --torch-backend=auto, then vllm serve Qwen/Qwen2.5-1.5B-Instruct. The server listens on http://localhost:8000 and hosts one model per process. Point any OpenAI client at http://localhost:8000/v1; pass --api-key or set VLLM_API_KEY if you want the server to check a key."
  - q: "Does vLLM run on Windows or macOS?"
    a: "Not natively on Windows: the docs say to use WSL with a Linux distribution. On macOS, the docs describe vLLM-Metal for Apple Silicon GPUs, which needs macOS Sonoma or later and Python 3.14. The main target remains Linux with NVIDIA GPUs; AMD ROCm and Intel GPU builds are documented separately."
  - q: "Which CUDA version does vLLM need?"
    a: "Release wheels are built against CUDA 13.0 by default. The installation docs say vLLM 0.32.0 was the last release with CUDA 12.9 binaries, so later releases need an NVIDIA driver that supports CUDA 13, and NVIDIA Blackwell GPUs (B200, GB200) need at least CUDA 12.8."
  - q: "vLLM vs Ollama: which should I use?"
    a: "They do different jobs. vLLM is serving infrastructure for Linux GPU machines where many requests arrive at once and cost per token matters. Ollama and LM Studio are built for one person running a model on a laptop. Prototype on Ollama, then move to vLLM when concurrent users hit a self-hosted model."
---

vLLM is an open-source library for LLM inference and serving, built to run open-weight models with **high throughput** on GPUs. It started in the Sky Computing Lab at UC Berkeley and is now maintained by a community the project counts at more than 2,000 contributors. Its original idea, **PagedAttention**, manages the attention key-value cache the way an operating system pages virtual memory, so less GPU memory is lost to fragmentation. Combined with **continuous batching**, where new requests join a running batch, that keeps the hardware busy when many requests arrive at once.

The repository is Apache-2.0 licensed and had about 97.7k GitHub stars as of November 2026. The latest release, v0.34.0, shipped on November 16, 2026.

## Highlights

- **PagedAttention and continuous batching.** The two techniques behind the throughput numbers, alongside chunked prefill and prefix caching.
- **OpenAI-compatible server.** `vllm serve <model>` exposes `/v1/chat/completions`, `/v1/completions` and `/v1/models` on port 8000. The README also lists an Anthropic Messages API and gRPC.
- **Quantization.** FP8, INT8, INT4, GPTQ, AWQ and GGUF among others, to fit a larger model into less memory at some cost in quality.
- **Parallelism.** Tensor, pipeline, data, expert and context parallelism for spreading one model across GPUs or nodes.
- **Structured output and tools.** Constrained generation through xgrammar or guidance, plus tool-calling and reasoning parsers that you enable per model (`--enable-auto-tool-choice`, `--tool-call-parser`).
- **Multi-LoRA.** Serve several LoRA adapters on one base model.
- **Model and hardware coverage.** More than 200 model architectures on Hugging Face (Llama, Qwen, Gemma, Mixtral, DeepSeek, multimodal and embedding models) on NVIDIA, AMD and Intel GPUs, and x86, ARM and PowerPC CPUs.

## In an AI-assisted workflow

Install it, start a server, and call it with the OpenAI client you already use:

```bash
# Linux, Python 3.11-3.14; uv picks the PyTorch build that matches your CUDA driver
uv pip install vllm --torch-backend=auto

# start an OpenAI-compatible server on http://localhost:8000
vllm serve Qwen/Qwen2.5-1.5B-Instruct
```

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
reply = client.chat.completions.create(
    model="Qwen/Qwen2.5-1.5B-Instruct",
    messages=[{"role": "user", "content": "Summarize PagedAttention in one sentence."}],
)
print(reply.choices[0].message.content)
```

The `model` value must match the name you passed to `vllm serve`. A server process hosts one model, so run one process per model and put a router such as [LiteLLM](/tools/litellm) in front if clients need several.

> [!TIP]
> Most of vLLM's throughput comes from keeping the batch full. Tune `--max-num-seqs`, `--gpu-memory-utilization`, `--max-model-len` and, for a model that spans GPUs, `--tensor-parallel-size` against your GPU and latency target. The [llm-inference-engineer](/agents/data-ai/llm-inference-engineer) agent tunes these against a p95 and cost budget, and [Scaffold a vLLM Serving Config](/commands/scaffold/scaffold-vllm-config) writes a starting config.

## Good to know

- **Platform.** The docs list Linux and Python 3.11 to 3.14. Windows is not supported natively; use WSL. Apple Silicon is covered by vLLM-Metal on macOS Sonoma or later.
- **CUDA.** Release wheels target CUDA 13.0. vLLM 0.32.0 was the last release with CUDA 12.9 binaries, so check your NVIDIA driver before upgrading an older node.
- **Sampling defaults.** The server applies the model repository's `generation_config.json` if one exists, which can override default sampling parameters. Pass `--generation-config vllm` to use vLLM's own defaults when results differ from what you expect.
- **No auth by default.** The server accepts any request unless you set `--api-key` or `VLLM_API_KEY`. Keep it behind your own network boundary or gateway either way.
- **Fast release cadence.** v0.34.0 alone contains 1,061 commits. Pin the version in production and read the release notes before upgrading.
- **Cost.** The software is free; you pay for the GPUs. Whether that beats a hosted API depends on utilization, which [Self-Host vs API](/guides/mlops/self-host-vs-api-llm) works through.

For a single developer running a model on a laptop, [Ollama](/tools/ollama) or [LM Studio](/tools/lm-studio) is the simpler fit, and [llama.cpp](/tools/llama-cpp) is the engine to reach for on CPUs and Apple Silicon. The closest Apache-2.0 alternative for GPU serving is [SGLang](/tools/sglang), which competes on the same workloads and is worth benchmarking on your own traffic before you commit.
