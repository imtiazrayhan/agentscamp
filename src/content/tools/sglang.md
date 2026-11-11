---
name: "SGLang"
title: "SGLang"
description: "An Apache-2.0 inference engine and OpenAI- and Anthropic-compatible model server for LLM, vision-language and diffusion models, built for large-scale serving."
seoDescription: "SGLang in October 2026: Apache-2.0 serving engine with OpenAI- and Anthropic-compatible endpoints, Claude Code support, RadixArk backing, vLLM comparison."
date: 2026-10-08
url: "https://www.sglang.io"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/sgl-project/sglang"
license: "Apache-2.0"
os: ["Linux", "macOS"]
color: "green"
topics: ["mlops-ai-infra"]
audience: ["ai-engineers"]
tags: ["sglang", "inference", "llm-serving", "open-source", "anthropic-compatible", "diffusion"]
featured: false
alternativeTo: ["vllm", "llama-cpp"]
sameAs:
  - "https://github.com/sgl-project/sglang"
  - "https://pypi.org/project/sglang/"
  - "https://docs.sglang.io"
  - "https://x.com/sgl_project"
related: ["tool:vllm", "tool:llama-cpp", "tool:ollama", "tool:open-webui", "tool:anythingllm", "guide:best-local-llm-tools-2026", "guide:best-open-source-llms-2026", "glossary:gguf", "agent:llm-inference-engineer"]
keywords: ["SGLang", "SGLang vs vLLM", "SGLang Claude Code", "Anthropic-compatible API", "LLM inference engine", "RadixArk"]
summary: "SGLang is an Apache-2.0 inference engine and model server for LLMs, vision-language and diffusion models, with OpenAI-compatible endpoints and an Anthropic-compatible /v1/messages endpoint Claude Code can target directly. About 37,600 GitHub stars as of October 2026; latest release v0.5.22. LMSYS-hosted; core contributors launched RadixArk in May 2026."
faq:
  - q: "Is SGLang free?"
    a: "Yes. SGLang is Apache-2.0 and the project sells nothing itself. RadixArk, the company its core contributors launched in May 2026, builds managed infrastructure on top of it; we did not find a public price list for that, so no figures are quoted here."
  - q: "SGLang vs vLLM?"
    a: "Both are Python GPU serving engines with OpenAI-compatible servers under Apache-2.0. SGLang differentiates on RadixAttention prefix caching for agentic and RL workloads, a built-in diffusion engine for image and video in the same package, an Anthropic-compatible /v1/messages endpoint for Claude Code, and the widest hardware table (NVIDIA, AMD, TPU, Intel, Apple Silicon, Ascend). vLLM has the larger community and is the default in more hosted stacks. We do not cite benchmark numbers between them."
  - q: "Can Claude Code use SGLang?"
    a: "Yes. Every SGLang server registers an Anthropic-compatible /v1/messages endpoint (plus /v1/messages/count_tokens) with no extra flag, so the Anthropic SDKs and agentic CLIs such as Claude Code can talk to it without changes. The docs cover pointing Claude Code at the server, including the CLAUDE_CODE_ATTRIBUTION_HEADER setting that is required for good prefix-cache reuse."
  - q: "Does SGLang run on a Mac?"
    a: "As of v0.5.22 (October 2026) SGLang runs on Apple Silicon Macs with the standard PyTorch backend, alongside MLX. It is still built for multi-GPU datacenter serving, though; for one laptop or a CPU box, llama.cpp, Ollama or LM Studio are the simpler path."
---

SGLang is the serving engine you reach for when the workload looks like agents rather than chat: long shared prefixes, tool loops, RL rollouts, and clients that expect either the OpenAI or the Anthropic wire format. The README describes it as "an open-source inference framework for large language, vision-language, and diffusion models, optimized for agentic workloads, large-scale serving, and RL rollouts", and says the project is "hosted by LMSYS, a non-profit open-source organization".

Two numbers frame its momentum: about 37,600 GitHub stars as of October 2026, and a release cadence of roughly every two weeks, with v0.5.22 published on 2026-10-19 carrying "950 PRs from 245 contributors".

## Highlights

- **Three model families, one package.** LLMs, vision-language models and, through SGLang Diffusion, image and video generation, all in the `sglang` Python package.
- **OpenAI-compatible endpoints.** Chat completions, completions, vision and embeddings, so existing clients keep working.
- **Anthropic-compatible endpoint.** `/v1/messages` and `/v1/messages/count_tokens` are registered automatically on every server, so the Anthropic SDKs and agentic CLIs such as Claude Code work without changes.
- **Wide hardware support.** NVIDIA (B200 through RTX 30/40/50, DGX Spark, Jetson Orin), AMD Instinct MI300X to MI355X, Google TPU v6e and v7, Intel Arc and Xeon, Apple Silicon via Metal and MLX, Huawei Ascend and Moore Threads.
- **Agent and RL ecosystem.** SpecForge for training [speculative-decoding](/glossary/speculative-decoding) draft models; RL frameworks Miles, slime, AReaL, Tunix and verl; orchestration with SMG, RBG, llm-d, Ray Serve and NVIDIA Dynamo.
- **SGLang Omni.** Audio model serving for text-to-speech and speech recognition.

## In an AI-assisted workflow

The quickstart targets Linux with an NVIDIA GPU and a CUDA 13-compatible driver:

```bash
docker pull lmsysorg/sglang:latest
docker run --rm --gpus all --ipc=host -p 30000:30000 lmsysorg/sglang:latest \
  sglang serve MODEL_PATH --host 0.0.0.0 --port 30000

# or without Docker:
uv pip install --prerelease=allow sglang
sglang serve MODEL_PATH --host 0.0.0.0 --port 30000
```

Verify with a `curl` to `http://localhost:30000/v1/chat/completions`. The same server also answers on `/v1/messages`, which is the part that matters for coding agents: point Claude Code at it and the Anthropic SDK or CLI needs no changes, and the docs call out the `CLAUDE_CODE_ATTRIBUTION_HEADER` setting as required for good prefix-cache reuse. The [Claude Code tips](/guides/getting-started/claude-code-tips) guide covers the client side. For a chat front end, [Open WebUI](/tools/open-webui) or [AnythingLLM](/tools/anythingllm) can sit on the OpenAI-compatible endpoint.

> [!WARNING]
> SGLang loads Hugging Face checkpoints, not [GGUF](/glossary/gguf) files, and it targets multi-GPU and multi-node serving (tensor and expert parallelism, PD disaggregation, speculative decoding). For a single Mac or CPU box, [llama.cpp](/tools/llama-cpp), [Ollama](/tools/ollama) or [LM Studio](/tools/lm-studio) are the simpler path; Apple Silicon support only arrived in v0.5.22.

> [!NOTE]
> The default CUDA version moved to 13.0 across SGLang, sgl-kernel and the Docker images in the v0.5.11 era, with PyTorch upgraded from 2.9 to 2.11. The homepage still documents a CUDA 12.9 install through extra index URLs if your driver is older.

## Good to know

**License and governance.** Apache-2.0, and the LICENSE file, the GitHub API and the README badge agree. The open-source project remains under sgl-project and LMSYS; on 2026-05-05 core contributors launched RadixArk with a 100 million dollar seed round at a 400 million dollar post-money valuation, led by Accel and co-led by Spark Capital, with NVentures, AMD, MediaTek and Databricks among the participants, to "grow SGLang and Miles" and "build managed infrastructure for teams developing AI at scale". RadixArk's post does not mention LMSYS and the README still says LMSYS-hosted; no formal stewardship transfer has been stated on a primary source. No prices are published for the managed platform.

**2026 changes.** The January blog post on SGLang-Diffusion reported the diffusion engine (Flux, Qwen-Image, Wan2.2) running "up to 2.5x faster than our initial release". v0.5.10 (April) enabled piecewise CUDA graphs by default and added elastic expert parallelism, HiSparse sparse attention and LoRA for MoE layers. Day-0 support posts followed for DeepSeek-V4 (April), Inkling (July) and Kimi K3 (July). v0.5.22 (October) says models load "10x faster with the new InstantTensor loader", claims up to 27 percent more throughput from PD disaggregation, adds the Apple Silicon PyTorch backend, and lists new models including EmbeddingGemma 2 and HunyuanImage-3.0. SGLang Summit 2026 runs November 12 to 13 in San Francisco.

Against the alternatives: [vLLM](/tools/vllm) is the closer comparison, a sibling Apache-2.0 Python engine with a bigger community and a place in more hosted stacks; SGLang's case is prefix caching for agent traffic, the diffusion engine in the same package, the Anthropic endpoint and the hardware table. [llama.cpp](/tools/llama-cpp) is a different job: a C/C++ engine for GGUF models on laptops, CPUs and single-GPU boxes. The [best local LLM tools](/guides/comparisons/best-local-llm-tools-2026) roundup draws the line where local ends and serving begins, and the [open-source LLM roundup](/guides/comparisons/best-open-source-llms-2026) lists the models worth serving on either engine.
