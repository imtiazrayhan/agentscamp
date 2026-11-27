---
name: "llama.cpp"
description: "The MIT-licensed C/C++ engine behind most local LLM tools: GGUF models, backends for nearly every GPU and CPU, and an OpenAI-compatible server in one binary."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://llama.app"
pricing: "open-source"
category: "cli"
repo: "https://github.com/ggml-org/llama.cpp"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "yellow"
topics: ["mlops-ai-infra"]
audience: ["developers"]
tags: ["local-llm", "inference", "gguf", "quantization", "cpp"]
featured: false
alternativeTo: ["ollama", "vllm", "lm-studio"]
sameAs:
  - "https://github.com/ggml-org/llama.cpp"
  - "https://github.com/ggml-org"
related: ["tool:ollama", "tool:lm-studio", "tool:jan", "tool:vllm", "guide:best-local-llm-tools-2026", "glossary:quantization", "guide:self-host-vs-api-llm"]
summary: "llama.cpp is the MIT-licensed C/C++ inference engine that most local-LLM tools build on. It runs GGUF models on CPUs and nearly any GPU, pulls them from Hugging Face with -hf, and serves them through llama serve, an OpenAI- and Anthropic-compatible HTTP server with a built-in chat app. It reached v1.0.0 with semantic versioning in November 2026."
faq:
  - q: "What's the difference between llama.cpp and Ollama?"
    a: "llama.cpp is the engine: a C/C++ library plus the llama command, with every backend and server flag exposed, and you choose the GGUF file and settings. Ollama is a packaged runtime with its own model library, a background service and one-word model names. Pick llama.cpp for control and the newest engine features, and Ollama for convenience."
  - q: "How do I install llama.cpp?"
    a: "Run curl -LsSf https://llama.app/install.sh | sh on macOS or Linux, or irm https://llama.app/install.ps1 | iex in PowerShell. Homebrew (brew install llama.cpp), Winget (winget install llama.cpp), conda-forge, MacPorts, Nix, Docker images and source builds also work. Then llama cli -hf <user>/<model> chats with a model from Hugging Face and llama serve -hf <user>/<model> serves it."
  - q: "What port does the llama.cpp server use?"
    a: "The server's documented default is 127.0.0.1 port 9931, set with --host and --port. Older tutorials, and the project's own Docker examples, use port 8080 by passing --port 8080 explicitly, so check which one your command sets before pointing a client at it."
  - q: "What is GGUF?"
    a: "GGUF is the single-file model format llama.cpp requires, holding the weights (usually quantized) and metadata such as the chat template. With -hf <user>/<model>[:quant] the quantization defaults to Q4_K_M when the repository has one. Models in other formats are converted with the convert_*.py scripts in the repository or Hugging Face's GGUF-my-repo space."
---

llama.cpp is the open-source C/C++ engine that made running LLMs on ordinary hardware practical. Started by Georgi Gerganov in 2023 and now developed under the **ggml-org** organization by a team at Hugging Face, it defined the [**GGUF**](/glossary/gguf) model format and the [quantization](/glossary/quantization) habits around it, and it is the engine inside or behind many local-AI tools, including [LM Studio](/tools/lm-studio) and [Jan](/tools/jan). The repository has about 136,000 GitHub stars as of November 2026.

November 2026 changed how the project ships. Release **v1.0.0** on November 13 introduced semantic versioning, with a major-version bump for any breaking change to the public C API. The command line is now a single `llama` command with subcommands, and the team's site offers Llama, a small desktop app for macOS and Windows built on the same engine.

## Highlights

- **One command, two main modes.** `llama cli` chats in the terminal; `llama serve` starts an HTTP server. Both take `-hf <user>/<model>[:quant]` to download a GGUF from [Hugging Face](/tools/hugging-face), defaulting to the Q4_K_M quantization.
- **A real server.** `llama serve` exposes OpenAI-compatible chat completions, responses and embeddings routes, an Anthropic Messages-compatible route, a reranking endpoint, schema-constrained JSON output and function calling. It supports parallel decoding with continuous batching, and includes Llama Chat, a built-in web chat app.
- **Router mode.** Start the server without a model and it loads and unloads models on demand from a `--models-dir`, with `--models-max` (default 4) capping how many stay loaded.
- **Backends for almost everything.** The build guide covers Apple Metal, NVIDIA CUDA, AMD HIP, Vulkan, SYCL, OpenCL, OpenVINO, WebGPU, Huawei CANN and Moore Threads MUSA, plus CPU builds with BLAS options. `-ngl` sets how many layers go to VRAM (default `auto`), so a model larger than your GPU memory can be split between GPU and CPU.
- **Multimodal.** Vision models load their projector file automatically when you use `-hf`, and the server accepts images through the OpenAI-compatible API.
- **A stable library.** `libllama` and `libggml` are the versioned C libraries downstream apps link against. The project says it supports more than 150 model architecture variants.

## In an AI-assisted workflow

```bash
# macOS / Linux (Windows PowerShell: irm https://llama.app/install.ps1 | iex)
curl -LsSf https://llama.app/install.sh | sh

# chat in the terminal
llama cli -hf ggml-org/Qwen3.5-0.8B-GGUF

# serve an OpenAI-compatible API on http://127.0.0.1:9931
llama serve -hf ggml-org/Qwen3.5-0.8B-GGUF
```

Any OpenAI client then works by changing the base URL:

```bash
curl http://127.0.0.1:9931/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Say hello in five words."}]}'
```

The flags that matter most: `-c` sets the context size (the default reads it from the model), `-ngl` controls GPU offload, `-np` sets the number of parallel slots, and `--api-key` protects the endpoint if you bind it beyond localhost with `--host`.

> [!NOTE]
> Names and numbers are in transition. Much of the documentation still uses the older `llama-server` and `llama-cli` binary names. Versioned releases (v1.1.0 is current as of November 2026) reach you through the install script and package managers, while nightly builds are numbered like `b12110`. The server's default port is 9931; older guides assume 8080.

## Good to know

- **Cost and licence.** MIT-licensed and free. Your cost is hardware.
- **You manage the details.** There is no curated model library. You pick a GGUF repository and quantization, and you set context size and offload yourself. Memory needs follow the file: the GGUF has to fit in RAM plus VRAM with room left for the context.
- **Not a fleet server.** `llama serve` handles several users with parallel slots, but for high-throughput GPU serving in production, [vLLM](/tools/vllm) is the usual choice.
- **Site.** The official site is [llama.app](https://llama.app), not Meta's llama.com. The Llama desktop app there serves the same OpenAI-compatible API at `localhost:9931/v1`.

Against the alternatives: [Ollama](/tools/ollama) trades control for convenience, with a model library, a background service and optional cloud models. [LM Studio](/tools/lm-studio) is a desktop app for browsing and tuning models visually. vLLM is built for concurrent GPU serving ([vLLM vs Ollama](/guides/comparisons/vllm-vs-ollama) explains that split). The whole local stack is mapped in [Best Tools for Running LLMs Locally](/guides/comparisons/best-local-llm-tools-2026).
