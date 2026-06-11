---
name: "llama.cpp"
description: "The C/C++ inference engine that made local LLMs possible — GGUF quantization, every GPU backend, and an OpenAI-compatible server, with no dependencies."
date: 2026-06-11
url: "https://llama.app"
pricing: "open-source"
category: "cli"
repo: "https://github.com/ggml-org/llama.cpp"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "yellow"
topics: ["mlops-ai-infra"]
tags: ["local-llm", "inference", "gguf", "quantization", "cpp"]
featured: false
alternativeTo: ["ollama", "vllm", "lm-studio"]
sameAs:
  - "https://github.com/ggml-org/llama.cpp"
  - "https://github.com/ggml-org"
related: ["ollama", "lm-studio", "jan", "vllm", "best-local-llm-tools-2026", "quantization", "self-host-vs-api-llm"]
summary: "llama.cpp (ggml-org, MIT, ~116k stars) is the foundational local-inference engine: plain C/C++ with no dependencies, 1.5–8-bit GGUF quantization, and backends for everything — Apple Metal, CUDA, AMD HIP, Vulkan, SYCL, plain CPU. llama-server exposes an OpenAI-compatible API; llama-cli pulls models straight from Hugging Face. Ollama, LM Studio, and Jan all stand on its shoulders."
faq:
  - q: "What's the difference between llama.cpp and Ollama?"
    a: "Ollama is built on llama.cpp's lineage and packages it for convenience — model management, one-command serving, a polished workflow. llama.cpp is the engine itself: more knobs, every backend, newest features first (its repo is where the GGUF/ggml ecosystem develops), but you manage models and flags yourself. Power and freshness vs convenience."
  - q: "How do I install llama.cpp?"
    a: "Easiest paths: brew install llama.cpp on macOS/Linux, the one-line installer from llama.app, prebuilt release binaries, Docker, or compile from source for exact backend control. Then llama-cli -hf <org>/<model-GGUF> downloads and runs a model straight from Hugging Face, and llama-server serves it over an OpenAI-compatible API."
  - q: "What is GGUF?"
    a: "The model file format of the llama.cpp/ggml ecosystem — a single file carrying quantized weights plus metadata, designed for fast memory-mapped local loading. When you download a '4-bit GGUF' of a model, you're getting the format this project defined; Ollama, LM Studio, and Jan all consume it."
---

llama.cpp is the project that made local LLMs a thing: Georgi Gerganov's plain C/C++ engine (now stewarded by the **ggml-org**, ~116k stars) proved frontier-architecture models could run on consumer hardware, defined the **GGUF** format and the [quantization](/glossary/quantization) culture around it, and became the engine inside most local-AI products you've heard of — [Ollama](/tools/ollama), [LM Studio](/tools/lm-studio), and [Jan](/tools/jan) included.

## Highlights

- **No-dependency C/C++ core** — compiles anywhere, from a Raspberry Pi to a workstation; 1.5- to 8-bit integer quantization built in.
- **Every backend that matters** — Apple Metal/NEON, x86 AVX, NVIDIA CUDA, AMD HIP, Vulkan, SYCL, even RISC-V — with CPU+GPU hybrid offload for models bigger than VRAM.
- **`llama-server`** — an OpenAI-compatible HTTP server in the box: `llama-server -hf ggml-org/gemma-3-1b-it-GGUF` and you have an endpoint.
- **Direct Hugging Face integration** — `-hf` flags download models straight from the Hub.
- **Multimodal and current** — vision support landed in 2025; new model architectures (gpt-oss with native MXFP4, Qwen, Gemma, DeepSeek lines) arrive here first.
- **The ecosystem's development ground** — llama.cpp is the main playground for the ggml library; the GGUF spec lives in the same org.

## In an AI-assisted workflow

```bash
brew install llama.cpp
llama-server -hf ggml-org/gemma-3-1b-it-GGUF
# OpenAI-compatible API now at http://localhost:8080 — point any BYO-model tool at it
```

Reach for raw llama.cpp over its wrappers when you want the newest features and models the moment they merge, exact control of backends and quantization, or the smallest possible serving footprint on unusual hardware.

> [!NOTE]
> Naming and versioning quirks: the canonical repo is `ggml-org/llama.cpp` (the old `ggerganov` path redirects), releases are build-numbered (`b9596`) rather than semver and ship near-daily, and the official site is **llama.app** — not to be confused with Meta's llama.com.

## Good to know

MIT-licensed and extraordinarily active — among the most-contributed projects in AI. The practical decision is wrapper-vs-engine: most developers are best served by [Ollama](/tools/ollama) day-to-day and reach for llama.cpp directly when control matters; for GPU-fleet serving under concurrency, [vLLM](/guides/comparisons/vllm-vs-ollama) is the different tool for a different job. The whole local stack is mapped in [Best Tools for Running LLMs Locally](/guides/comparisons/best-local-llm-tools-2026).
