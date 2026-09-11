---
name: "Groq"
title: "Groq"
description: "GroqCloud runs open-weight LLMs on custom LPU hardware for very fast, low-latency inference through an OpenAI-compatible API."
url: "https://groq.com"
date: 2026-06-19
updated: "2026-09-11"
pricing: "freemium"
category: "platform"
repo: "https://github.com/groq/groq-python"
sameAs: ["https://github.com/groq", "https://console.groq.com/docs"]
color: "orange"
topics: ["mlops-ai-infra", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["inference", "llm-api", "low-latency", "open-models"]
featured: false
alternativeTo: ["together-ai", "fireworks-ai", "openrouter", "replicate", "baseten"]
summary: "Groq is a hosted inference service that serves open-weight models — OpenAI GPT-OSS, Whisper, enterprise-only Llama, and Qwen in preview — on its custom LPU chips for unusually high tokens-per-second and low latency. The GroqCloud API is OpenAI-compatible, so most SDKs work by changing the base URL, and pricing is per-token with a free tier."
related: ["guide:deploying-llms-to-production", "guide:self-host-vs-api-llm", "guide:llm-cost-latency-engineering", "guide:choosing-the-right-model", "guide:calling-any-model-gateways"]
faq:
  - q: "What is Groq?"
    a: "Groq is an AI inference company that runs open-weight large language models on its own custom silicon, the Language Processing Unit (LPU). Through GroqCloud, it serves models like OpenAI's open-weight GPT-OSS and Whisper at very high throughput and low latency over an OpenAI-compatible API; its Llama models are now enterprise-only, and Qwen models are in preview. Note: this is Groq the hardware/inference company, not Grok the chatbot."
  - q: "Is Groq free?"
    a: "Groq is freemium. GroqCloud has a genuinely usable free tier (rate-limited) for prototyping, then paid usage billed per token on a Developer tier, plus Enterprise plans. The official Groq SDKs (Python, TypeScript) are open source under Apache-2.0, but the hosted LPU service itself is a commercial product."
  - q: "How do I use Groq?"
    a: "Sign up at console.groq.com, create an API key, and call the OpenAI-compatible endpoint at https://api.groq.com/openai/v1. Because it mirrors the OpenAI API, most existing OpenAI SDKs and tools work by swapping the base URL and key; Groq also ships official Python and TypeScript libraries."
---

Groq is an AI inference company built around custom silicon. Where most providers serve models on GPUs, Groq designed the **LPU (Language Processing Unit)** specifically for inference, and the result is unusually high tokens-per-second and low time-to-first-token. Its hosted platform, **GroqCloud**, exposes that hardware through a simple API so you don't manage any of it yourself.

In December 2025 Groq entered a non-exclusive licensing agreement with NVIDIA for its inference technology. It was not an acquisition: founder Jonathan Ross and other team members joined NVIDIA, while Groq continues as an independent company and GroqCloud kept running without interruption. In August 2026 Groq became an NVIDIA Cloud Partner and said it will also deploy NVIDIA hardware, including Groq 3 LPX, in its cloud.

The catalog is **open-weight models** rather than closed frontier models. As of September 2026 its production models are OpenAI's GPT-OSS 120B and 20B, Whisper for speech-to-text, and Llama 3.1 8B and Llama 3.3 70B, which are now enterprise-only with contact-sales pricing; Qwen models are in preview. The draw is speed and predictable per-token pricing on those open models, not exclusive access to a proprietary model family.

The API is **OpenAI-compatible**: point an OpenAI client at `https://api.groq.com/openai/v1` with a Groq key and most existing code, SDKs, and tooling work with a one-line change. There is a usable free tier for prototyping, then per-token Developer pricing and Enterprise plans.

> [!NOTE]
> Groq (the LPU inference company) is unrelated to Grok, the xAI chatbot — they're easy to confuse but different products.

Groq sits alongside other hosted open-model inference services like [Together AI](/tools/together-ai), [Fireworks AI](/tools/fireworks-ai), and [Baseten](/tools/baseten); its differentiator is latency and throughput from the LPU. If you're weighing a hosted API against running models yourself, see [self-host vs API](/guides/mlops/self-host-vs-api-llm) and [LLM cost and latency engineering](/guides/advanced/llm-cost-latency-engineering).
