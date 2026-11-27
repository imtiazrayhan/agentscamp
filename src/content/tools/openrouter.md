---
name: "OpenRouter"
title: "OpenRouter"
description: "A hosted gateway to 600+ models from 80+ providers behind one OpenAI-compatible API, with one key, prepaid credits and automatic provider fallback."
url: "https://openrouter.ai"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
os: ["Web"]
sameAs: ["https://openrouter.ai/docs"]
color: "orange"
topics: ["llm-app-dev"]
audience: ["ai-engineers"]
tags: ["gateway", "multi-provider", "router", "api"]
featured: false
alternativeTo: ["litellm", "portkey"]
summary: "OpenRouter is a hosted gateway that puts 600+ models from 80+ providers behind one OpenAI-compatible API, one key and one prepaid balance. It falls back to another provider when one errors, and you can list backup models. Inference is billed at provider list price; OpenRouter's fee is charged when you buy credits. A free plan covers 25+ free models."
related: ["tool:litellm", "guide:calling-any-model-gateways", "tool:vercel-ai-sdk"]
faq:
  - q: "How much does OpenRouter cost?"
    a: "As of November 2026, OpenRouter bills inference at the provider's list price on every plan and charges its fee when you buy credits: 5.5% on Standard, with a $0.80 minimum per the docs, and 8% on Business. Bring-your-own-key usage is free of OpenRouter fees up to $25,000 of list-price inference a month, then 5% of what the request would have cost on OpenRouter. Enterprise pricing is by contract."
  - q: "What are the limits on OpenRouter's free models?"
    a: "Free models are capped at 20 requests per minute and 50 per day, rising to 1,000 per day once your account has bought at least $10 of credits, as of November 2026. Failed attempts count toward the daily cap, and a negative balance blocks free models until you add credits. Paid models have no plan-based limit; limits there come from the upstream provider."
  - q: "Does OpenRouter log my prompts?"
    a: "Not by default. OpenRouter's FAQ says it logs request metadata such as timestamps, model and token counts, and logs prompts and completions only if you opt in, which earns a 1% discount. Each upstream provider has its own retention policy, and data-policy-based routing on paid plans lets you exclude providers that do not meet yours."
  - q: "OpenRouter vs LiteLLM?"
    a: "OpenRouter is a managed service: no proxy to run, one bill, and it buys the inference for you. LiteLLM is an open-source library and proxy you host yourself with your own provider keys, which gives you control over data flow and policy at the cost of operating it. Choose hosted for zero infrastructure, self-hosted for control."
---

[OpenRouter](https://openrouter.ai) is a hosted router that puts models from OpenAI, Anthropic, Google, Meta and dozens of open-weight hosts behind a single OpenAI-compatible API. You hold one API key and one prepaid balance, and you switch models by changing a string. Its pricing page counts 600+ models from 80+ providers as of November 2026. It is the managed alternative to running your own gateway.

The second thing it sells is resilience. OpenRouter sits in front of several upstream providers for the same model, so when one returns an error it retries on the next, and you can name fallback models of your own in the request.

## Highlights

- **One API for every model.** An OpenAI-compatible API under `https://openrouter.ai/api/v1`, usable from the OpenAI SDK by setting `base_url` and your OpenRouter key. The quickstart examples call the Responses endpoint, `/api/v1/responses`.
- **Provider fallback and model fallback.** Automatic retry across providers, plus a `models` array that lists models in priority order. Failed attempts are not billed, so you pay only for the run that answers.
- **Routing shortcuts.** Append `:nitro` to a model id to sort providers by throughput or `:floor` to sort by price, and use `:free` for the free variant of a model where one exists. `openrouter/auto` picks a model for you and adds no fee.
- **Bring your own key.** Route through your own provider accounts while keeping OpenRouter's unified API and logs.
- **Spend controls.** Per-key credit caps, budgets, and workspaces that give each environment its own keys and limits: 5 workspaces on Free and Standard, 1,000 on Business.
- **Regional routing.** On Business and Enterprise, `eu.openrouter.ai` and `us.openrouter.ai` keep inference with providers in that region.
- **Coding-agent support.** OpenRouter documents a Claude Code setup that points `ANTHROPIC_BASE_URL` at `https://openrouter.ai/api`; [Claude Code with other models](/guides/configuration/claude-code-with-other-models) lists the caveats.

## In an AI-assisted workflow

```bash
curl -s https://openrouter.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "models": ["~anthropic/claude-sonnet-latest", "gryphe/mythomax-l2-13b"],
    "input": "What is the meaning of life?"
  }'
```

This is the request from OpenRouter's model-fallback docs: if the first model errors, the request goes to the second. For a single model, send `"model"` with one id; with the OpenAI SDK, pass the `models` array through `extra_body`. The optional `HTTP-Referer` and `X-OpenRouter-Title` headers attribute your app in OpenRouter's public rankings; leave them out if you do not want that.

A common setup is to develop against OpenRouter for breadth, then decide per workload whether to stay, go direct to one provider, or move to a gateway you host. [Calling any model](/guides/concepts/calling-any-model-gateways) and [LLM gateways compared](/guides/advanced/llm-gateways-compared) cover that decision.

> [!TIP]
> Pin an explicit model id, and a provider if latency consistency matters. Routing improves reliability, but OpenRouter's own FAQ notes that latency varies by model, provider and region.

## Pricing

As of November 2026, openrouter.ai/pricing lists four plans. Free has no platform fee and covers 25+ free models from 4 providers at 50 requests a day. Standard is pay-as-you-go with a 5.5% fee on credit purchases. Business charges 8% and adds in-region routing, workload identity federation and advanced notifications, with no contract or minimum spend. Enterprise is negotiated, with SSO/SAML, contractual SLAs, invoicing and discounted fees.

Model prices themselves are the providers' list prices on every plan, per token, whether or not you stream. As of November 2026 the docs add a $0.80 minimum fee on a credit purchase and a 5% fee on crypto payments. OpenRouter reserves the right to expire unused credits a year after purchase, and refunds for unused credits must be requested within 24 hours.

## Good to know

OpenRouter is a third party in your request path. Its availability becomes part of yours, your prompts pass through it on the way to the provider, and each provider behind it has its own data policy, so set provider preferences if you have compliance rules. Prompt logging by OpenRouter itself is opt-in.

Other things to know: a deprecated model starts returning 404 with "no endpoints for this model found", so watch model lifecycles on anything you pin. If a provider changes its price, your requests keep working and are billed at the new rate. And web search or file parsing that ran before a failed completion may still be billed even though the model tokens are not.

Against the alternatives: [LiteLLM](/tools/litellm) is the self-hosted route, an open-source library and proxy that uses your own provider keys, and [LiteLLM vs OpenRouter](/guides/comparisons/litellm-vs-openrouter) compares the two. [Portkey](/tools/portkey) is a gateway with caching, guardrails and observability built in. If you only ever call one provider, going direct removes a hop and the credit-purchase fee.
