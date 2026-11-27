---
title: "Calling Any Model: Unified LLM Gateways & SDKs in 2026"
description: "LiteLLM, OpenRouter, Vercel AI Gateway, Cloudflare AI Gateway and Portkey compared: hosting, fee model, fallback config, caching, keys and latency overhead."
author: "Imtiaz Rayhan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["llm-app-dev"]
audience: ["ai-engineers"]
tags: ["gateway", "multi-provider", "litellm", "openrouter", "comparison"]
featured: false
summary: "Put one layer between your app and model providers so a model swap or a fallback is a config change. Self-host LiteLLM when you must own the request path. Use OpenRouter, Vercel AI Gateway or Cloudflare AI Gateway when you want a hosted router; all three pass provider prices through without a token markup. The Vercel AI SDK is app code, not a gateway."
keyTakeaways:
  - "A unified layer avoids provider lock-in: swap or mix models with a config change, not a rewrite."
  - "Gateways add resilience (fallback across models and providers) and control (central keys, budgets, logs, rate limits)."
  - "Self-hosted: LiteLLM (MIT core) as a Python library or proxy. Its own benchmark reports single-digit to low double-digit milliseconds of p95 gateway overhead."
  - "Hosted: OpenRouter, Vercel AI Gateway and Cloudflare AI Gateway pass provider token prices through with no markup and charge elsewhere, mostly as fees on credit purchases."
  - "Fallback is one line in each: a fallbacks map in LiteLLM, a models array in OpenRouter, providerOptions.gateway.models in Vercel AI Gateway."
  - "Check ownership before you commit: Portkey's docs now carry the Prisma AIRS AI Gateway name, and Helicone went into maintenance mode after its 2026 acquisition."
faq:
  - q: "What is an LLM gateway?"
    a: "An LLM gateway is a layer between your app and one or more model providers. You call the gateway with one interface, usually OpenAI-compatible, and it routes to the chosen model. Gateways typically add fallback across providers, central API-key management, cost tracking, caching and rate limiting."
  - q: "LiteLLM vs OpenRouter: which should I use?"
    a: "LiteLLM is open source: use it as a Python library, or run its proxy yourself when you need the request path inside your own network, custom policy, or per-team virtual keys and budgets. OpenRouter is a hosted service: one API key and one credit balance across many providers, with nothing to operate. Choose LiteLLM to own the gateway and OpenRouter to avoid running one."
  - q: "Do hosted gateways mark up token prices?"
    a: "As of November 2026, OpenRouter, Vercel AI Gateway and Cloudflare AI Gateway all state that provider inference pricing is passed through without markup. They charge in other places: OpenRouter and Cloudflare apply a percentage fee when you buy credits, and OpenRouter charges a percentage fee on bring-your-own-key usage above a monthly allowance. Check each pricing page for current figures."
  - q: "How much latency does a gateway add?"
    a: "For a self-hosted LiteLLM proxy, LiteLLM's published short-prompt benchmark reports 8 ms p95 gateway overhead across four instances at 1,170 requests per second, and 29 ms p95 on two instances. A hosted router adds a network hop to its region instead, which depends on where you and the provider are. Either number is small next to model generation time, but measure time to first token on your own traffic."
  - q: "Is the Vercel AI SDK a gateway?"
    a: "No. The AI SDK is a TypeScript toolkit that runs in your application and gives you provider-agnostic calls, streaming, structured output and tool calling. Vercel AI Gateway is a separate hosted API (ai-gateway.vercel.sh) that handles keys, routing, fallbacks, logs and budgets. They work together, and the gateway also accepts the OpenAI and Anthropic SDKs."
  - q: "Do I need a gateway for a simple app?"
    a: "No. If you call one model and do not need fallback, shared keys or per-team cost attribution, a direct provider SDK is simpler and has one fewer thing to fail. Add a gateway when you need multi-provider resilience, one bill, or a single control point for keys, budgets and rate limits across several apps."
related: ["guide:structured-output-2026", "tool:litellm", "tool:openrouter", "tool:vercel-ai-sdk", "skill:provider-fallback-wrapper", "agent:llm-integration-engineer"]
---

Hardwiring one provider's SDK into your app is a decision you regret the first time that provider has an outage, changes prices, or ships a worse model than a competitor. A unified model-access layer fixes that: you call one interface, and switching or mixing models becomes a config change. It also gives you fallback and a single place for keys and spend.

## What a unified layer gives you

- **No lock-in**: swap or mix providers and models by changing a string.
- **Resilience**: fall back to another model or provider when one is down or rate-limited.
- **Cost control**: central keys, per-team budgets, cost tracking and caching.
- **One interface**: usually OpenAI-compatible, so existing SDKs work unchanged.

## SDK or gateway?

They are different layers, and the names blur them.

- An **SDK** runs inside your application. The [Vercel AI SDK](/tools/vercel-ai-sdk) (TypeScript) and LiteLLM's Python library both give you one call shape across providers. Keys live in your app's environment; there is no shared control plane.
- A **gateway** is a network service every app calls. It holds the provider keys, applies routing and budgets, and logs every request. It can be self-hosted (LiteLLM proxy, Portkey's open-source gateway) or hosted (OpenRouter, Vercel AI Gateway, Cloudflare AI Gateway).

A common setup is both: an SDK in app code for ergonomics, pointed at a gateway for org-wide keys, fallback and cost.

## The options compared

Facts below were checked against each vendor's docs in November 2026. Fees are described by model; exact rates are on each vendor's pricing page.

| | Hosting | Fee model | Fallback | Caching | Keys | Observability |
| --- | --- | --- | --- | --- | --- | --- |
| **[LiteLLM](/tools/litellm)** | Self-hosted proxy or in-process Python library; MIT licence outside the `enterprise/` directory | No gateway fee for the open-source proxy; you pay providers directly and run the infrastructure | `fallbacks`, `context_window_fallbacks`, `content_policy_fallbacks`, tried in order after `num_retries` | Response cache you host (Redis and others; a `redis-semantic` option) | Your provider keys in config; the proxy issues virtual keys with budgets and rate limits | Callbacks to external tools; spend tracking in the proxy |
| **[OpenRouter](/tools/openrouter)** | Hosted | Provider pricing passed through with no inference markup; a percentage fee on credit purchases; BYOK usage is free up to a monthly allowance, then a percentage fee | `models` array in priority order; billed for the model that actually ran | Provider prompt caching passed through | One OpenRouter key, or bring your own provider keys | Activity log of usage and cost |
| **Vercel AI Gateway** | Hosted API at `ai-gateway.vercel.sh`; your app does not need to run on Vercel | No markup and no platform fee on tokens; pay-as-you-go credits; a free tier with a monthly credit on eligible models | `providerOptions.gateway.models` plus provider ordering | `caching: 'auto'` for provider prompt caching; response caching is left to your app | Vercel's provider keys or BYOK (paid tier) | Request logs with provider attempts, latency, tokens and cost; budgets per team, project, key or member |
| **Cloudflare AI Gateway** | Hosted on Cloudflare; available on all plans | Core features (analytics, caching, rate limiting) are free; provider pricing passed through with no markup; a percentage fee on credits bought through Unified Billing; log storage limits by plan | Request retries, model fallback, dynamic routes | Response caching at Cloudflare's edge | Your provider keys, or Unified Billing credits | Analytics and logging; Logpush export billed separately |
| **[Portkey](/tools/portkey)** | Hosted platform, plus an MIT-licensed open-source gateway | Freemium hosted tiers; see the tool page | JSON config with `"strategy": {"mode": "fallback"}` and ordered `targets`; triggers on any non-2xx by default, or on `on_status_codes` you list | Simple and semantic response cache | Provider keys stored in the platform | Built-in logs and tracing, guardrails |

Two status notes that affect a long-term choice:

- **Portkey** is now presented in its own docs as "Portkey (Prisma AIRS AI Gateway)", with links to Palo Alto Networks' AI Gateway product, as of November 2026. If you are evaluating it, confirm the roadmap for the open-source gateway and the hosted plans.
- **[Helicone](/tools/helicone)** offers an AI gateway at `ai-gateway.helicone.ai` alongside its observability product, but Mintlify acquired the company in March 2026 and placed it in maintenance mode (status last confirmed September 2026). Treat it as a tool you may already run, not a new adoption.

## Fallback, in each tool's own config

### LiteLLM proxy

`config.yaml`:

```yaml
model_list:
  - model_name: primary
    litellm_params:
      model: openai/gpt-6.1-sol
      api_key: os.environ/OPENAI_API_KEY
  - model_name: backup
    litellm_params:
      model: claude-opus-5
      api_key: os.environ/ANTHROPIC_API_KEY

litellm_settings:
  num_retries: 3          # per model group, before falling back
  request_timeout: 10     # seconds
  fallbacks: [{"primary": ["backup"]}]

router_settings:
  allowed_fails: 3        # cool a deployment down after 3 failures
  cooldown_time: 30       # seconds
```

Start it with `litellm --config /path/to/config.yaml` (it listens on port 4000), then point any OpenAI client at it:

```python
import openai

client = openai.OpenAI(api_key="<your-litellm-key>", base_url="http://0.0.0.0:4000")

response = client.chat.completions.create(
    model="primary",
    messages=[{"role": "user", "content": "Summarize this ticket in one line."}],
)
```

The app asks for `primary`; the proxy decides what that means. LiteLLM separates three fallback types: `context_window_fallbacks` for prompts that exceed a model's window, `content_policy_fallbacks` for moderation errors, and `fallbacks` for everything else, such as rate limits.

### OpenRouter

No config file. Pass a `models` array; with the OpenAI SDK it goes in `extra_body`:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="<OPENROUTER_API_KEY>",
)

response = client.responses.create(
    model="~openai/gpt-sol-latest",
    extra_body={
        "models": ["~anthropic/claude-sonnet-latest", "gryphe/mythomax-l2-13b"],
    },
    input="Summarize this ticket in one line.",
)
```

By default any error can trigger the fallback, including context-length validation errors, moderation flags and rate limiting. You are billed for the model that ran, which the response's `model` attribute names, so log it.

### Vercel AI Gateway

With the AI SDK, fallbacks are a provider option:

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-fable-5',
  prompt: 'Summarize this ticket in one line.',
  providerOptions: {
    gateway: {
      models: ['anthropic/claude-opus-5', 'google/gemini-3.1-pro-preview'],
    },
  },
});
```

The same `providerOptions.gateway.models` field works through the OpenAI SDK's `extra_body` when you call the gateway from Python.

## What fallback does not fix

- **Different models, different behavior.** A prompt tuned for one model can fail on its fallback: other tool-call habits, other structured-output limits, a smaller context window. Run your evals against the fallback model too.
- **Silent cost changes.** If the fallback is pricier, an outage raises your bill. Alert on which model served the request.
- **Feature mismatch.** Provider-specific features (prompt caching controls, citations, strict schemas) do not always translate through an OpenAI-compatible surface. Test the ones you depend on.
- **The gateway is now a dependency.** A hosted router is a third party in your request path that sees your prompts. A self-hosted proxy is infrastructure you patch, scale and monitor; LiteLLM's own benchmark runs multiple instances behind a load balancer.
- **Retries multiply.** SDK retries times gateway retries times fallbacks can turn one user request into a dozen provider calls. Set retries in one layer.

## How to choose

- **TypeScript app, one team, want model choice without ops**: the Vercel AI SDK, optionally through Vercel AI Gateway.
- **Prompts must stay inside your network, or you need per-team virtual keys and budgets you control**: LiteLLM proxy.
- **Widest model catalog with one key and nothing to run**: OpenRouter.
- **Already on Cloudflare, want edge response caching and rate limiting in front of provider keys you hold**: Cloudflare AI Gateway.
- **Need guardrails and governance in the gateway itself**: Portkey, after checking its direction under the Prisma AIRS name.
- **One model, simple app**: a direct provider SDK. Skip the gateway.

Add the application-side resilience patterns (timeouts, bounded retries, fallback) with the [provider-fallback-wrapper](/skills/api/provider-fallback-wrapper) skill, and let the [llm-integration-engineer](/agents/data-ai/llm-integration-engineer) wire the whole access layer. For a deeper feature-by-feature comparison, see [LLM gateways compared](/guides/advanced/llm-gateways-compared); for the definition, the [AI gateway](/glossary/ai-gateway) glossary entry.

Once you can reach any model, make the responses reliable: [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).
