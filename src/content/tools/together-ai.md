---
name: "Together AI"
title: "Together AI"
description: "A cloud for running, fine-tuning, and deploying open-source models (Llama, DeepSeek, Qwen) via an OpenAI-compatible API plus dedicated GPU endpoints."
url: "https://www.together.ai"
date: 2026-06-19
pricing: "freemium"
category: "platform"
sameAs:
  - "https://github.com/togethercomputer"
  - "https://github.com/togethercomputer/together-python"
  - "https://docs.together.ai"
color: "blue"
topics: ["mlops-ai-infra", "llm-app-dev"]
tags: ["inference", "fine-tuning", "open-models", "gpu", "openai-compatible"]
featured: false
alternativeTo: ["fireworks-ai", "groq", "replicate", "baseten", "openrouter"]
summary: "Together AI is a hosted cloud for open-source models: serverless inference across a broad catalog (Llama, DeepSeek, Qwen, and more) behind an OpenAI-compatible API, plus fine-tuning and dedicated GPU endpoints and clusters. It's the managed way to run open-weight models without operating your own inference stack."
related: ["deploying-llms-to-production", "self-host-vs-api-llm", "best-local-llm-tools-2026", "finetune-vs-rag-vs-prompt", "choosing-the-right-model"]
faq:
  - q: "What is Together AI?"
    a: "Together AI is a hosted cloud platform for open-source models. It offers serverless inference over a large catalog of open-weight models — Llama, DeepSeek, Qwen, and many others — behind an OpenAI-compatible API, plus fine-tuning (LoRA and full) and dedicated GPU endpoints and clusters for teams that need reserved capacity."
  - q: "Is Together AI free?"
    a: "It's freemium: you start with free credits, then pay as you go. Serverless inference is billed per million input and output tokens, with a batch discount for asynchronous jobs; dedicated endpoints and GPU clusters are billed per GPU-hour. The platform is proprietary, but the official Python SDK is open source (Apache-2.0)."
  - q: "How does Together AI compare to OpenRouter or Groq?"
    a: "All expose open and hosted models through an OpenAI-compatible API, but the center of gravity differs. OpenRouter is a router across many providers; Groq optimizes for very low-latency inference on its own hardware. Together AI is a full open-model cloud — inference plus fine-tuning, dedicated endpoints, and raw GPU clusters — so the same team can serve, customize, and scale open weights in one place."
---

Together AI is a hosted cloud built around **open-source models**. Instead of running your own inference servers, you call a large catalog of open-weight models — Llama, DeepSeek, Qwen, and many others — through an **OpenAI-compatible API**, so existing SDKs work by changing the base URL and key. It targets developers and ML teams who want production access to open models without operating the underlying GPU stack.

Beyond serverless inference, the platform spans the full lifecycle of open weights: **fine-tuning** (supervised fine-tuning, preference optimization, LoRA and full), **dedicated endpoints** that keep a single-tenant model warm, and **GPU clusters** for training and large-scale workloads. For bursty pipelines, an asynchronous batch API trades latency for a meaningful discount over synchronous calls.

## Highlights

- **Broad open-model catalog** — serverless inference across a large set of open-weight chat, code, embedding, image, and reranking models.
- **OpenAI-compatible API** — drop-in for the OpenAI SDK; swap providers by changing the base URL and key.
- **Fine-tuning without infra** — adapt open models (SFT, DPO, LoRA, or full) through the API, no training cluster to manage.
- **Dedicated endpoints and GPU clusters** — reserve single-tenant capacity per GPU-hour, up to on-demand and reserved clusters on current NVIDIA hardware.

## In an AI-assisted workflow

```bash
curl https://api.together.xyz/v1/chat/completions \
  -H "Authorization: Bearer $TOGETHER_API_KEY" \
  -d '{"model":"<open-weight-model>","messages":[{"role":"user","content":"hi"}]}'
```

Because the API is OpenAI-compatible, it slots into the same gateways and frameworks as other providers. For when to self-host open weights versus calling a hosted API like this, see [Self-host vs. API](/guides/mlops/self-host-vs-api-llm); for deciding which open model to use, see [Choosing the Right Model](/guides/getting-started/choosing-the-right-model).

> [!TIP]
> Together AI fits when your stack is open-weight: prototype on serverless inference, fine-tune the model that wins, then move steady traffic to a dedicated endpoint for predictable per-hour cost — all without leaving the platform.

## Good to know

The platform is proprietary SaaS; the official Python SDK is open source under Apache-2.0. Pricing is freemium — free credits to start, then per-token serverless rates, per-GPU-hour dedicated and cluster pricing, and a batch discount for asynchronous jobs. Exact rates and the model catalog change over time, so confirm current details on the official pricing page before committing. Compare with [Fine-tune vs. RAG vs. Prompt](/guides/concepts/finetune-vs-rag-vs-prompt) when deciding whether fine-tuning is even the right lever.
