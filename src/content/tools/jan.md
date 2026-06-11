---
name: "Jan"
description: "An open-source ChatGPT alternative that runs fully offline — a polished desktop app over llama.cpp with a model hub, MCP support, and a local API server."
date: 2026-06-11
url: "https://jan.ai"
pricing: "open-source"
category: "platform"
repo: "https://github.com/janhq/jan"
license: "Apache-2.0"
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mlops-ai-infra"]
tags: ["local-llm", "desktop", "privacy", "open-source"]
featured: false
alternativeTo: ["lm-studio", "ollama"]
sameAs:
  - "https://github.com/janhq/jan"
  - "https://huggingface.co/janhq"
  - "https://x.com/jandotai"
related: ["lm-studio", "ollama", "llama-cpp", "best-local-llm-tools-2026", "quantization", "model-context-protocol"]
summary: "Jan (janhq/jan, Apache-2.0, ~43k stars, by Menlo Research) is the open-source answer to LM Studio: a Tauri desktop app that downloads and runs local models via a llama.cpp engine, exposes an OpenAI-compatible API on localhost:1337, supports MCP for agentic use, and optionally connects cloud providers with your own keys. 100% offline-capable; 5.7M+ downloads."
faq:
  - q: "Jan vs LM Studio — what's the real difference?"
    a: "Licensing and philosophy. Both are polished desktop apps for running local models on a llama.cpp foundation. Jan is fully open source (Apache-2.0, relicensed from AGPL in May 2025), community-driven, and privacy-framed ('answers only to you'); LM Studio is proprietary freemium with arguably more hardware-tuning surface. If open source is a requirement, Jan is the pick of the desktop class."
  - q: "Does Jan have an API other apps can use?"
    a: "Yes — it runs an OpenAI-compatible server on localhost:1337, so BYO-model tools can target Jan exactly as they would Ollama. Combined with stable MCP support (since v0.6.9), Jan works as a local backend for agentic setups, not just a chat window."
  - q: "Can Jan use cloud models too?"
    a: "Optionally — bring your own keys for OpenAI, Anthropic, Mistral, Groq and others (plus Anthropic-compatible custom providers), alongside local models in one interface. Local stays the default and the point; cloud is an add-on, and there's no hosted Jan service."
---

Jan is the open-source desktop app for local AI — "an open-source ChatGPT alternative that runs 100% offline," in the project's own words. Built by **Menlo Research** as a Tauri (Rust) app over a [llama.cpp](/tools/llama-cpp) engine, it wraps model discovery, chat, a local API, and MCP into something a non-terminal user can love — while staying Apache-2.0 all the way down.

## Highlights

- **Model hub built in** — browse and download open-weight models (Llama, Gemma, Qwen, gpt-oss, …) from Hugging Face inside the app.
- **OpenAI-compatible local API on `localhost:1337`** — other tools and agents target Jan like any provider.
- **MCP support** — stable since v0.6.9 (August 2025), making Jan a local host for [Model Context Protocol](/glossary/model-context-protocol) tooling.
- **Cloud as an option, not a default** — connect OpenAI/Anthropic/Mistral/Groq with your own keys alongside local models.
- **Active engine work** — llama.cpp auto-tuning (v0.7), a unified router with multi-token prediction (v0.8), AMD ROCm on Linux (v0.8.2, June 2026).
- **Genuinely open** — Apache-2.0 (relicensed from AGPL in May 2025), ~43k stars, 5.7M+ downloads.

## In an AI-assisted workflow

Download from jan.ai, pull a model that fits your hardware (the [quantization](/glossary/quantization) literacy applies), and chat — or flip on the local server and point your BYO-model tools at `localhost:1337`. The privacy story is the cleanest in the desktop class: with local models, nothing leaves the machine.

> [!TIP]
> Jan + MCP is an underrated combo for a fully-local agent playground: local model, local tools, zero cloud surface — useful both for sensitive work and for understanding agent mechanics without an API bill.

## Good to know

Runs on macOS 13.6+, Windows 10+, and Linux (deb/AppImage, Flathub, Microsoft Store). One citation quirk: GitHub's license API reports "Other" because of a custom copyright header — the LICENSE text is standard Apache-2.0. There's no hosted/cloud Jan; it's desktop-first by design. Where it sits against [LM Studio](/guides/comparisons/ollama-vs-lm-studio)'s polish and [Ollama](/tools/ollama)'s headless ubiquity is mapped in [Best Tools for Running LLMs Locally](/guides/comparisons/best-local-llm-tools-2026).
