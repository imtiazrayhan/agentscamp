---
name: "Helicone"
title: "Helicone"
description: "Open-source LLM observability and AI gateway with one-line integration — logging, tracing, caching, and cost/latency tracking across providers."
url: "https://helicone.ai"
date: 2026-06-04
pricing: "open-source"
category: "observability"
repo: "https://github.com/Helicone/helicone"
license: "Apache-2.0"
sameAs: ["https://github.com/Helicone/helicone", "https://docs.helicone.ai"]
color: "pink"
topics: ["devops-infra"]
tags: ["observability", "gateway", "caching", "cost-control", "open-source"]
featured: false
alternativeTo: ["langfuse", "langsmith", "portkey"]
summary: "Helicone is an open-source LLM observability platform and AI gateway with a one-line integration — logging, tracing, caching, and cost/latency tracking across providers. Note: Mintlify acquired Helicone in March 2026 and it's now in maintenance mode (security and bug fixes only, no new features), though the Apache-2.0 proxy still works and is self-hostable."
related: ["llm-gateways-compared", "portkey", "litellm", "llm-cost-latency-engineering", "langfuse"]
---

Helicone is an open-source **LLM observability** platform with a built-in **AI gateway**, known for a famously low-friction setup: change your base URL (or add a header) and your calls are logged, traced, and analyzed — no SDK rewrite. On top of monitoring it offers caching and rate limiting at the proxy, cost and latency tracking, prompt management, and datasets/evals.

For a cost-and-latency stack its draw is the one-line on-ramp to **per-call cost and latency visibility** — you can't optimize what you can't see — plus proxy-level **caching** to cut spend on repeated calls.

## Highlights

- **One-line integration** — proxy via a base-URL change, or async logging; no rewrite of your call sites.
- **Observability** — requests, sessions, and traces with cost and latency per call, user, and model.
- **Caching & rate limiting** — at the proxy, to cut the cost and latency of repeated calls.
- **Prompt management, datasets & evals** — version prompts and score traffic.
- **Open source & self-hostable** — Apache-2.0, with Docker/Helm for self-hosting.

## In an AI-assisted workflow

```python
# point the OpenAI client at Helicone's proxy — one line, then traffic is observable
from openai import OpenAI
client = OpenAI(base_url="https://oai.helicone.ai/v1",
                default_headers={"Helicone-Auth": f"Bearer {HELICONE_API_KEY}"})
```

> [!WARNING]
> **Status (2026):** [Mintlify acquired Helicone](https://www.helicone.ai/blog/joining-mintlify) in March 2026, and the product is now in **maintenance mode** — security patches, bug fixes, and new-model support continue, but there are no new features or roadmap, and Mintlify is helping customers migrate to other platforms. The open-source proxy still works and the Docker image is current, so existing self-hosted deployments keep running; new projects should weigh that it is no longer actively developed.

## Good to know

Helicone is open source (Apache-2.0) and free to self-host; a hosted cloud with a free tier and paid plans is also available. It was used in production by 16,000+ organizations at the time of the acquisition. Given the maintenance-mode status above, teams starting fresh should compare actively-developed observability platforms like [Langfuse](/tools/langfuse) and [LangSmith](/tools/langsmith), and the gateway-first [Portkey](/tools/portkey) — see [LLM Gateways Compared](/guides/advanced/llm-gateways-compared).
