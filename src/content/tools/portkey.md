---
name: "Portkey"
title: "Portkey"
description: "An AI gateway and LLMOps platform: route to many LLMs through one API with caching, retries, fallbacks, load balancing, guardrails, and full observability."
url: "https://portkey.ai"
date: 2026-06-04
pricing: "freemium"
category: "platform"
repo: "https://github.com/Portkey-AI/gateway"
license: "MIT"
os: ["Web"]
sameAs: ["https://github.com/Portkey-AI/gateway", "https://portkey.ai/docs"]
color: "purple"
topics: ["devops-infra"]
tags: ["gateway", "caching", "observability", "cost-control", "llmops"]
featured: false
alternativeTo: ["litellm", "helicone", "openrouter"]
summary: "Portkey is an AI gateway and LLMOps platform: route to 1,600+ LLMs through one OpenAI-compatible API with simple and semantic caching, automatic retries, fallbacks, and load balancing — plus observability (logs, traces, cost and latency), prompt management, guardrails, virtual keys, and budgets. The fast routing gateway is open source (MIT) and self-hostable; the hosted control plane is freemium."
related: ["llm-gateways-compared", "helicone", "litellm", "llm-cost-latency-engineering", "llm-cost-optimizer"]
---

Portkey is an **AI gateway** paired with an **LLMOps control plane**. The gateway puts 1,600+ models behind one OpenAI-compatible API and adds the reliability and cost levers you'd otherwise build yourself — caching, retries, fallbacks, load balancing — while the hosted platform layers on observability, prompt management, and governance. It's aimed at teams who want one managed control point for all their LLM traffic, with caching and cost control built in rather than bolted on.

It earns its place in a **cost-and-latency** stack specifically: caching cuts the cost and latency of repeated calls, routing lets you right-size models per request, observability attributes spend per key/team, and virtual keys with budgets and rate limits cap runaway cost.

## Highlights

- **Unified API to 1,600+ LLMs** — one OpenAI-compatible endpoint across 45+ providers; swap models by changing a string.
- **Caching** — both **simple** and **semantic** caching to cut repeat-call cost and latency.
- **Reliability** — automatic retries, fallbacks across providers, and load balancing across keys.
- **Observability** — logs, traces, and cost/latency metrics per request, key, and team.
- **Governance** — virtual keys, per-team budgets, rate limits, and 50+ guardrails.

## In an AI-assisted workflow

```bash
# OpenAI-compatible: point your existing client at the gateway
curl https://api.portkey.ai/v1/chat/completions \
  -H "x-portkey-api-key: $PORTKEY_API_KEY" \
  -d '{"model":"anthropic/claude","messages":[{"role":"user","content":"hi"}]}'
```

Most SDKs work by swapping the base URL and adding Portkey's header, so adoption is a config change.

> [!TIP]
> Turn on **semantic caching** for workloads with repetitive or near-duplicate prompts (FAQs, classification, retrieval-augmented answers): it serves a cached response for semantically similar inputs, cutting both spend and p95 latency. Measure the hit rate so you know it's paying off.

## Good to know

The Portkey **gateway is open source (MIT)** and self-hostable from [its repo](https://github.com/Portkey-AI/gateway); the **hosted platform is freemium** — a free tier for prototyping, a paid production tier, and enterprise plans with governance and compliance. As a gateway it sits in your request path and handles your provider keys, so treat it as infrastructure you operate or trust. In 2026, **Palo Alto Networks completed its acquisition of Portkey** (closed May 2026), folding the gateway into its enterprise AI-security platform; Portkey continues as an actively developed product. Compare the library-or-self-hosted [LiteLLM](/tools/litellm) and the observability-first [Helicone](/tools/helicone) in [LLM Gateways Compared](/guides/advanced/llm-gateways-compared).
