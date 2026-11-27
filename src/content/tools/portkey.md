---
name: "Portkey"
title: "Portkey"
description: "An AI gateway with caching, retries, fallbacks, guardrails and observability. Owned by Palo Alto Networks and now sold as Prisma AIRS AI Gateway."
url: "https://portkey.ai"
date: 2026-06-04
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
repo: "https://github.com/Portkey-AI/gateway"
license: "MIT"
os: ["Web"]
sameAs: ["https://github.com/Portkey-AI/gateway", "https://portkey.ai/docs"]
color: "purple"
topics: ["devops-infra"]
audience: ["ai-engineers"]
tags: ["gateway", "caching", "observability", "cost-control", "llmops"]
featured: false
alternativeTo: ["litellm", "helicone", "openrouter"]
summary: "Portkey is an AI gateway and control plane: one API in front of many LLM providers, with retries, fallbacks, load balancing, caching, guardrails, logs and cost tracking. Palo Alto Networks closed its acquisition on May 29, 2026 and now sells the product as Prisma AIRS AI Gateway. The routing gateway remains open source under MIT."
related: ["guide:llm-gateways-compared", "tool:helicone", "tool:litellm", "guide:llm-cost-latency-engineering", "agent:llm-cost-optimizer"]
faq:
  - q: "Who owns Portkey now?"
    a: "Palo Alto Networks, which announced on May 29, 2026 that it had closed the acquisition. Portkey's site now reads \"Portkey is now PRISMA AIRS AI Gateway\", and Palo Alto Networks says Prisma AIRS AI Gateway has been generally available since July 16, 2026. The docs, the API host (api.portkey.ai) and the SDK names still carry the Portkey name."
  - q: "Is Portkey still open source?"
    a: "The routing gateway is. Portkey-AI/gateway on GitHub is MIT-licensed, had about 13,500 stars as of November 2026, and runs locally with npx @portkey-ai/gateway. The control plane (dashboards, prompt management, access control, the model catalog UI) is the hosted or enterprise product and is not in that repository."
  - q: "Is there a free Portkey plan?"
    a: "As of November 2026, Portkey's docs still describe a free Dev plan with 10,000 requests a month and 3 days of log retention, and a paid Pro plan above it. The portkey.ai/pricing URL now redirects to a Palo Alto Networks contact form, so there is no public price list to quote; check the plan shown in your account before you rely on a tier."
  - q: "Does Portkey work with the OpenAI and Anthropic SDKs?"
    a: "Yes. Point the OpenAI SDK's base URL at https://api.portkey.ai/v1 and add the x-portkey-api-key header, or point the Anthropic SDK at https://api.portkey.ai for the Messages API. Portkey's docs say the gateway accepts Chat Completions, Responses and Messages formats and translates between them across providers."
---

[Portkey](https://portkey.ai) is an **[AI gateway](/glossary/ai-gateway)** paired with a control plane. The gateway puts many LLM providers behind one API and adds the reliability and cost levers you would otherwise build yourself: retries, fallbacks, load balancing and caching. The control plane adds logs, traces, cost tracking, prompt management, guardrails and access control.

The ownership changed in 2026. Palo Alto Networks closed its acquisition of Portkey on May 29, 2026 and now sells the product as **Prisma AIRS AI Gateway**, generally available since July 16, 2026. The Portkey docs, the `api.portkey.ai` host and the `portkey-ai` SDKs are still in use, and the docs are titled "Portkey (Prisma AIRS AI Gateway)".

## Highlights

- **One API, three formats.** The gateway accepts OpenAI Chat Completions, the Responses API and Anthropic's Messages format, and translates between them for any provider. The open-source README counts 1,600+ models across 45+ providers.
- **Reliability in a config.** Automatic retries, fallbacks across models or providers, load balancing, conditional routing and request timeouts are declared in a JSON config and attached per request or per API key.
- **Caching.** Simple (exact-match) caching is on every hosted plan. Semantic caching matches similar requests by cosine similarity, for requests under 8,191 tokens and at most 4 messages.
- **Guardrails.** Input and output checks that can deny or retry a request. The README lists 40+ pre-built guardrails, and partner integrations include Palo Alto's own Prisma AIRS scanning.
- **Model Catalog.** Provider credentials live in the catalog and are referenced as `@provider-slug/model-name`. This replaced virtual keys, which the docs mark as deprecated.
- **MCP Gateway.** Centralised authentication, access control and logging for MCP servers.
- **Observability.** Logs, traces, feedback, custom metadata and cost per request.

## In an AI-assisted workflow

Run the open-source gateway locally (needs Node.js and npm):

```bash
npx @portkey-ai/gateway
# Gateway:  http://localhost:8787/v1
# Console:  http://localhost:8787/public/
```

Or call the hosted gateway. Here the request falls back from one provider to another only when the first returns a 429:

```bash
curl https://api.portkey.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-portkey-api-key: $PORTKEY_API_KEY" \
  -H 'x-portkey-config: {"strategy":{"mode":"fallback","on_status_codes":[429]},"targets":[{"provider":"@openai-prod"},{"provider":"@azure-prod"}]}' \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"hi"}]}'
```

`@openai-prod` and `@azure-prod` are example slugs; yours are whatever you named the providers in Model Catalog. In practice you save the config in the dashboard and pass its `pc-...` ID instead of inline JSON. Existing OpenAI SDK code needs only a new base URL (`https://api.portkey.ai/v1`) and the `x-portkey-api-key` header.

> [!TIP]
> Start with simple caching and measure the hit rate before you plan around semantic caching. Portkey's cache docs say semantic caching "requires a vector database and is only available on select Enterprise plans", while the plan comparison page lists it under Pro, so confirm what your plan includes.

## Pricing

Portkey no longer has a public price list. As of November 2026, `portkey.ai/pricing` redirects to a Palo Alto Networks contact form for Prisma AIRS AI Gateway, and the Enterprise links in the docs go to the same place.

What the docs' plan comparison still describes, as of November 2026:

| | Dev | Pro | Enterprise |
| --- | --- | --- | --- |
| Price | Free | Paid monthly | Custom |
| Requests per month | 10K, no overage | 100K, paid overage | Custom |
| Log retention | 3 days | 30 days | Custom |
| Simple cache | 1-day TTL | Unlimited TTL | Unlimited TTL |
| Prompt templates | Up to 3 | Unlimited | Unlimited |

The self-hosted open-source gateway is free under MIT with no request limit. Treat the Dev and Pro columns as provisional: the pricing page they used to sit on is gone, and the product is being folded into an enterprise security platform that is sold through demos.

## Good to know

- **It sits in your request path.** Every LLM call and every provider credential goes through the gateway. Decide whether you trust the hosted service with that or run the gateway yourself.
- **The open-source repo is not the whole product.** It covers routing, retries, fallbacks, load balancing and guardrails, with a local log console. Dashboards, prompt management and team access control are in the hosted or enterprise product. The repo's latest tagged release, v1.15.2, dates from January 2026, though commits continued into November 2026.
- **The roadmap now follows Prisma AIRS.** The July and September 2026 changelogs lead with guardrail and security-scanning work for agentic clients and MCP tool calls, and the docs describe a staged rewrite of the enterprise gateway in Rust from version 2.30.0. If you wanted a vendor-neutral developer tool, weigh that.
- **Model IDs in examples go stale.** The docs' own samples use older model names; pass whatever current model ID your provider accepts.

Alternatives: [LiteLLM](/tools/litellm) is the open-source proxy and Python library you run yourself. [Helicone](/tools/helicone) starts from observability and adds gateway features. [OpenRouter](/tools/openrouter) is a hosted router that sells model access on one bill, where Portkey expects you to bring your own provider keys. [LLM Gateways Compared](/guides/advanced/llm-gateways-compared) covers the trade-offs.
