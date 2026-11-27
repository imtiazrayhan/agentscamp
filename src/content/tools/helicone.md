---
name: "Helicone"
title: "Helicone"
description: "Open-source LLM observability and AI gateway with one-line integration — logging, tracing, caching, and cost/latency tracking across providers."
url: "https://helicone.ai"
date: 2026-06-04
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "observability"
repo: "https://github.com/Helicone/helicone"
license: "Apache-2.0"
sameAs: ["https://github.com/Helicone/helicone", "https://docs.helicone.ai"]
color: "pink"
topics: ["devops-infra"]
audience: ["ai-engineers", "devops"]
tags: ["observability", "gateway", "caching", "cost-control", "open-source"]
featured: false
alternativeTo: ["langfuse", "langsmith", "portkey"]
summary: "Helicone is an Apache-2.0 LLM observability platform and AI gateway: change a base URL and your calls are logged with cost and latency. Its future is unsettled. Mintlify acquired it in March 2026 and put it in maintenance mode, and as of November 2026 helicone.ai says it is now part of Experiential Labs, with details to come."
related: ["guide:llm-gateways-compared", "tool:portkey", "tool:litellm", "guide:llm-cost-latency-engineering", "tool:langfuse"]
faq:
  - q: "What is Helicone?"
    a: "Helicone is an open-source LLM observability platform with a built-in AI gateway. You change your client's base URL, or add a header, and requests are logged with cost, latency, user and session data. It adds caching and rate limiting at the proxy, prompt management, a playground, datasets and scores."
  - q: "Who owns Helicone now?"
    a: "Mintlify announced on March 3, 2026 that it was acquiring Helicone and that Helicone would continue in maintenance mode, with security updates, bug fixes and new models still shipping. As of November 2026, a banner on helicone.ai reads \"Helicone is now part of Experiential Labs. Details to come soon.\" Neither company had published terms or a product roadmap on Helicone's site when this page was checked on November 27, 2026."
  - q: "Is Helicone free?"
    a: "The code is Apache-2.0 and free to self-host with Docker Compose. On the hosted cloud, as of November 2026 the pricing page lists Hobby as free with 10,000 requests a month, 1 GB of storage, one seat and 7-day retention; Pro at $79 per month with unlimited seats and one-month retention; Team at $799 per month with five organizations and three-month retention; and a custom Enterprise plan. Paid plans add usage-based charges beyond the free allowance."
  - q: "How do I use Helicone?"
    a: "Point your client at the proxy, for example OpenAI(base_url='https://oai.helicone.ai/v1', default_headers={'Helicone-Auth': f'Bearer {HELICONE_API_KEY}'}), and traffic becomes observable with no SDK rewrite. Add the header Helicone-Cache-Enabled: true to cache responses; the default cache lifetime is 7 days. The README's current quick start uses the AI Gateway at https://ai-gateway.helicone.ai with a Helicone API key instead of your provider key."
---

Helicone is an open-source **LLM observability** platform with a built-in **[AI gateway](/glossary/ai-gateway)**, known for a low-friction setup: change your base URL (or add a header) and your calls are logged, traced and analyzed with no SDK rewrite. On top of monitoring it offers caching and rate limiting at the proxy, cost and latency tracking, prompt management, and datasets and scores.

Its draw for a cost-and-latency stack is the one-line route to **per-call cost and latency visibility**, plus proxy-level **caching** to cut spend on repeated calls. The catch in late 2026 is ownership, covered in the warning below.

## Highlights

- **One-line integration.** Proxy your calls through a base-URL change, or log asynchronously if you would rather not put a proxy in the request path.
- **AI Gateway.** One Helicone API key and the OpenAI API format reach 100+ models, with routing and automatic fallbacks, per the project README.
- **Observability.** Requests, sessions and traces with cost and latency per call, user and model, plus custom properties, alerts and reports. HQL, Helicone's query language, is on Pro and above.
- **Caching and rate limiting.** Set `Helicone-Cache-Enabled: true` on a request to serve repeats from cache; `Cache-Control` sets the lifetime, which defaults to 7 days.
- **Prompts and testing.** A playground, versioned prompts deployed through the gateway, scores and datasets.
- **Open source and self-hostable.** Apache-2.0, with a Docker Compose setup in the repo. The Helm chart is available on request for enterprise use.

## In an AI-assisted workflow

```python
# point the OpenAI client at Helicone's proxy, then traffic is observable
from openai import OpenAI
client = OpenAI(base_url="https://oai.helicone.ai/v1",
                default_headers={"Helicone-Auth": f"Bearer {HELICONE_API_KEY}",
                                 "Helicone-Cache-Enabled": "true"})  # optional: cache repeats
```

To self-host, the README's steps are:

```bash
git clone https://github.com/Helicone/helicone.git
cd docker
cp .env.example .env
./helicone-compose.sh helicone up
```

> [!WARNING]
> **Status, November 2026:** [Mintlify announced it was acquiring Helicone](https://www.mintlify.com/blog/mintlify-acquires-helicone) on March 3, 2026, said the product would continue in **maintenance mode** (security updates, bug fixes and new models), and said it would help customers migrate to another platform. As of November 2026, a banner on helicone.ai reads "Helicone is now part of Experiential Labs. Details to come soon." No further detail was published there when this page was checked. Treat the hosted service's long-term plans as unknown until the new owner states them.

## Pricing

As of November 2026, Helicone's pricing page lists four cloud plans. **Hobby** is free: 10,000 requests a month, 1 GB of storage, one seat, one organization and 7-day retention. **Pro** is $79 per month with unlimited seats, alerts, reports, HQL and one-month retention. **Team** is $799 per month with five organizations, SOC 2 and HIPAA compliance, a dedicated Slack channel and three-month retention. **Enterprise** is custom, with SAML SSO, on-prem deployment and retention without a limit. Paid plans include the same 10,000 requests and 1 GB, then charge by usage; the page has a calculator for it. Startups under two years old with less than $5M in funding get 50% off the first year.

Self-hosting is free under Apache-2.0.

## Good to know

**Self-hosted images are old.** As of November 2026, the newest images under Helicone's Docker Hub organization date from August 2025, and the latest tagged GitHub release is v2025.08.21-1. The repository itself is still active: commits through November 2026 are mostly security fixes and hardening, synced from a private repo. If you self-host, plan to build from source to pick those fixes up.

**History.** When Mintlify announced the deal, it said Helicone had been used in production across 16,000 organizations. The repository has about 6,300 GitHub stars as of November 2026.

**Proxy in the path.** The base-URL integration routes every model call through Helicone's proxy, which adds a dependency and a network hop to each request. Async logging avoids that at the cost of gateway features such as caching.

**Alternatives.** For observability under active development, [Langfuse](/tools/langfuse) is open source with an MIT core and a managed cloud, and [LangSmith](/tools/langsmith) is the commercial option from LangChain. For the gateway half, [Portkey](/tools/portkey) is gateway-first with routing, fallbacks and guardrails, and [LiteLLM](/tools/litellm) is an open-source proxy you host yourself. [LLM Gateways Compared](/guides/advanced/llm-gateways-compared) sets them side by side. Existing Helicone users do not need to move today, but new projects should pick a tool whose owner has published a roadmap.
