---
name: "LiteLLM"
title: "LiteLLM"
description: "Call 100+ LLM APIs with one OpenAI-format interface — as a Python library or a self-hosted gateway/proxy."
url: "https://www.litellm.ai"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/BerriAI/litellm"
license: "MIT"
sameAs: ["https://github.com/BerriAI/litellm", "https://docs.litellm.ai"]
color: "blue"
topics: ["llm-app-dev", "devops-infra"]
tags: ["gateway", "proxy", "multi-provider", "open-source", "python"]
featured: false
alternativeTo: ["openrouter", "vercel-ai-sdk", "portkey"]
summary: "LiteLLM lets you call 100+ LLMs (OpenAI, Anthropic, Google, Bedrock, local, and more) through one OpenAI-compatible interface. Use it as a Python library, or run its proxy as a self-hosted gateway with central keys, fallbacks, retries, caching, cost tracking, and rate limits."
related: ["tool:openrouter", "guide:calling-any-model-gateways", "guide:llm-gateways-compared", "skill:provider-fallback-wrapper", "tool:vercel-ai-sdk"]
faq:
  - q: "What is LiteLLM?"
    a: "LiteLLM is an open-source tool that lets you call 100+ LLM providers — Anthropic, Google, Azure, AWS Bedrock, local models, and more — through one OpenAI-format interface. It comes as a Python library for in-process calls and as a proxy server you run as a centralized gateway with key management, fallbacks, retries, caching, and cost tracking."
  - q: "Is LiteLLM free?"
    a: "Yes — LiteLLM is open source under MIT and free to self-host. An enterprise edition adds advanced gateway features and support."
  - q: "LiteLLM vs OpenRouter?"
    a: "Both put many models behind one OpenAI-compatible interface. LiteLLM is software you run — a library or a self-hosted proxy you operate, with full control over keys and policies — while OpenRouter is a fully hosted gateway with one key and one bill. Choose by whether you want to operate the gateway yourself."
  - q: "When should I use the LiteLLM proxy instead of the library?"
    a: "Use the library for simple multi-provider code inside one app. Run the proxy when you want a single control point for many apps — central API-key management, per-team budgets and rate limits, fallbacks, and cost tracking across the org."
---

LiteLLM gives you one interface to call virtually any LLM. Write your code once against the OpenAI format and LiteLLM translates to 100+ providers — Anthropic, Google, Azure, AWS Bedrock, local models, and more — so switching or mixing models is a config change, not a rewrite. It comes in two forms: a **Python library** for in-process calls, and a **proxy server** you run as a centralized gateway.

It is aimed at teams who don't want to be locked to one provider's SDK, and at platform teams who want a single control point for all LLM traffic. The proxy is where it becomes infrastructure: central API-key management, **fallbacks** across providers, retries, caching, **cost tracking**, and rate limits for every app behind it.

## Highlights

- **One format, many providers** — OpenAI-compatible calls to 100+ models; swap models via config.
- **Gateway/proxy** — self-hosted control point with key management, budgets, and per-team rate limits.
- **Fallbacks & retries** — automatically route around a failing or rate-limited provider.
- **Caching & cost tracking** — cut spend and latency, and attribute cost per key/team.
- **Library or server** — embed in code or run centrally for the whole org.

## In an AI-assisted workflow

```python
from litellm import completion
# same call, any provider — just change the model string
completion(model="anthropic/claude", messages=[...])
completion(model="gpt-5",            messages=[...])
```

Run the proxy and point every app at it to centralize keys, fallbacks, and cost.

> [!TIP]
> Use the library for simple multi-provider code; run the proxy when you want one place to manage keys, budgets, fallbacks, and cost across many apps — the gateway pattern in [Calling Any Model](/guides/concepts/calling-any-model-gateways).

## Good to know

LiteLLM is open source (MIT) and free to self-host; an enterprise edition adds advanced gateway features and support. As a hosted-key gateway it's infrastructure you operate — plan for its availability. Compare the fully-hosted [OpenRouter](/tools/openrouter) if you'd rather not run a proxy.
