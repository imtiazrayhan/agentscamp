---
name: "OpenRouter"
title: "OpenRouter"
description: "A hosted unified API to hundreds of models from many providers, with one key, one bill, and automatic fallbacks."
url: "https://openrouter.ai"
date: 2026-06-03
pricing: "freemium"
category: "platform"
sameAs: ["https://openrouter.ai/docs"]
color: "orange"
topics: ["llm-app-dev"]
tags: ["gateway", "multi-provider", "router", "api"]
featured: false
alternativeTo: ["litellm"]
summary: "OpenRouter is a hosted gateway to hundreds of models across providers behind one OpenAI-compatible API, one API key, and one bill. It handles routing, automatic fallbacks, and provider load-balancing — the zero-infrastructure way to call any model, including some free ones."
related: ["tool:litellm", "guide:calling-any-model-gateways", "tool:vercel-ai-sdk"]
faq:
  - q: "What is OpenRouter?"
    a: "OpenRouter is a hosted router that puts hundreds of models — from OpenAI, Anthropic, Google, Meta, and many open-weight providers — behind a single OpenAI-compatible API with one key and one bill. Because it sits in front of multiple upstream providers, it can fall back and load-balance across them, so one provider's outage or rate limit doesn't take your app down."
  - q: "How much does OpenRouter cost?"
    a: "It's a hosted service: you pay per token (with credits), typically with a small routing fee on top of provider pricing. Some models are available for free."
  - q: "OpenRouter vs LiteLLM?"
    a: "OpenRouter is the managed counterpart to running your own gateway — no proxy to operate, just an endpoint. LiteLLM's proxy is what you self-host when you need data control or custom policies. Choose hosted for zero infrastructure, self-hosted for control."
---

OpenRouter is a hosted router that puts hundreds of models — from OpenAI, Anthropic, Google, Meta, and many open-weight providers — behind a single OpenAI-compatible API. One API key, one bill, and you can switch models by changing a string. It's the managed counterpart to running your own gateway: no proxy to operate, just an endpoint.

It is aimed at developers and teams who want broad model access and resilience without infrastructure. Because OpenRouter sits in front of multiple upstream providers, it can **fall back** and **load-balance** across them, so a single provider's outage or rate limit doesn't take your app down.

## Highlights

- **One API, hundreds of models** — call any supported model through one OpenAI-compatible endpoint.
- **One key and one bill** — unified billing and credits across providers; no per-provider accounts.
- **Automatic fallbacks & routing** — route around outages and rate limits; pick by price or performance.
- **Free and paid models** — access some models at no cost, plus pay-as-you-go for the rest.
- **Usage analytics** — see spend and usage across models in one place.

## In an AI-assisted workflow

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"model":"anthropic/claude","messages":[{"role":"user","content":"hi"}]}'
```

Because it's OpenAI-compatible, most SDKs work by just changing the base URL and key.

> [!TIP]
> Use OpenRouter when you want multi-provider access and fallbacks with zero infrastructure. If you need to self-host the gateway for data control or custom policies, compare [LiteLLM](/tools/litellm)'s proxy.

## Good to know

OpenRouter is a hosted service: you pay per token (with credits), typically with a small routing fee on top of provider pricing, and some free models are available. As a third party in your request path, factor in its availability and that your prompts pass through it. See [Calling Any Model](/guides/concepts/calling-any-model-gateways) for hosted-vs-self-hosted gateway trade-offs.
