---
title: "LLM Gateways Compared: Portkey vs Helicone vs LiteLLM for Caching & Cost Control"
description: "How Portkey, Helicone, and LiteLLM compare for caching, cost control, and observability — each one's 2026 status and which fits self-hosted vs. hosted."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["devops-infra"]
tags: ["gateway", "caching", "cost-control", "observability", "comparison"]
featured: false
summary: "An LLM gateway centralizes caching, fallback, cost tracking, and budgets across your model traffic. Portkey is a gateway-plus-LLMOps platform; LiteLLM is an open-source library or self-hosted proxy; Helicone is observability-first with a one-line proxy, but is now in maintenance mode after its 2026 Mintlify acquisition. Pick by what you'll operate and the control plane you need."
keyTakeaways:
  - "A gateway is a single control point for LLM traffic — caching, fallback, cost tracking, budgets, and rate limits — turning model access into managed infrastructure."
  - "Portkey is the most platform-complete: an open-source (MIT) routing gateway plus a freemium hosted control plane with caching, observability, prompt management, and governance."
  - "LiteLLM is the flexible open-source option — a Python library or a self-hosted proxy you fully own; best when you want control and no third party in the request path."
  - "Helicone pioneered one-line observability + proxy caching, but after Mintlify's March 2026 acquisition it's in maintenance mode — fine to self-host the Apache-2.0 proxy, but no longer actively developed."
  - "Self-hosting a gateway is security-sensitive: it sees every prompt and key. LiteLLM's 2026 supply-chain and CVE incidents (both remediated) are the reminder to pin versions, patch fast, and verify package integrity."
  - "Choose by operating model: hosted control plane → Portkey; self-host and own it → LiteLLM; already on Helicone → keep self-hosted, but weigh its status for new projects."
faq:
  - q: "What is an LLM gateway and why use one?"
    a: "An LLM gateway is a single layer that sits between your apps and one or more model providers, so model access becomes managed infrastructure instead of scattered direct calls. A gateway typically adds caching (to cut cost and latency on repeated calls), fallback and load balancing (for resilience), centralized API-key management, cost tracking and per-team budgets, and rate limiting. You reach for one when you want a single control point for caching, cost, and reliability across many apps — rather than reimplementing those in every service."
  - q: "Portkey vs LiteLLM — which should I choose?"
    a: "Both put many models behind one OpenAI-compatible interface with caching and fallback. The difference is how much platform you want. Portkey pairs an open-source (MIT) routing gateway with a freemium hosted control plane — observability, prompt management, virtual keys, budgets, and governance out of the box. LiteLLM is an open-source Python library or a self-hosted proxy you run and own end-to-end, with no third party in the path. Choose Portkey for a managed control plane with batteries included; choose LiteLLM when you want to fully self-host and control the gateway yourself."
  - q: "Is Helicone still a good choice in 2026?"
    a: "Helicone remains a capable open-source observability platform with a one-line proxy and proxy-level caching, and it's still used by many teams in production. But there's an important caveat: Mintlify acquired Helicone in March 2026, and the product is now in maintenance mode — security patches, bug fixes, and new-model support continue, but there are no new features or roadmap, and Mintlify is helping customers migrate. The Apache-2.0 proxy still works and is self-hostable, so existing deployments are fine; for a new project, weigh that it's no longer actively developed and consider actively-maintained alternatives like Langfuse or LangSmith for observability and Portkey or LiteLLM for the gateway."
  - q: "Which gateway is best for caching and cost control?"
    a: "For caching and cost control specifically, Portkey is the most complete out of the box: it offers both simple and semantic caching plus cost tracking, budgets, and rate limits in one managed control plane. LiteLLM's proxy also supports caching, fallbacks, and cost tracking and lets you own all of it self-hosted. Helicone provides proxy-level caching and excellent cost/latency visibility, with the maintenance-mode caveat above. If your priority is a managed, batteries-included cost-control plane, Portkey; if it's self-hosted control, LiteLLM."
  - q: "Is it safe to self-host an LLM gateway?"
    a: "Yes, with the right practices — but treat it as security-sensitive infrastructure, because a gateway sees every prompt and every API key you route through it. 2026 made this concrete: LiteLLM had a supply-chain incident (briefly backdoored PyPI packages, fixed in a clean release with a hardened CI pipeline) and a critical proxy SQL-injection vulnerability (CVE-2026-42208, patched) that was exploited soon after disclosure. The lesson isn't to avoid gateways — it's to operate them well: pin and verify package versions, patch promptly, restrict network and key access, and monitor the proxy. The same care applies to any self-hosted gateway, Portkey's included."
related: ["portkey", "helicone", "litellm", "llm-cost-latency-engineering", "prompt-cache-optimizer", "llm-cost-optimizer", "calling-any-model-gateways", "openrouter"]
---

Once more than one app talks to an LLM, you start wanting a single place to handle caching, fallback, keys, cost, and budgets — instead of reimplementing them in every service. That place is an **LLM gateway**. This guide compares the three most common choices for **caching and cost control** — [Portkey](/tools/portkey), [LiteLLM](/tools/litellm), and [Helicone](/tools/helicone) — including each one's current status, which matters more than usual in 2026.

## What a gateway gives you

- **Caching** — serve repeated calls from cache to cut cost and latency (the cost lever that matters most).
- **Reliability** — fallback across providers and load balancing so one outage doesn't take you down.
- **Cost control** — central key management, per-team budgets, cost tracking, and rate limits.
- **One interface** — usually OpenAI-compatible, so existing code and SDKs work with a base-URL change.

## The three, by shape

### [Portkey](/tools/portkey) — gateway + LLMOps control plane

The most platform-complete option. An **open-source (MIT) routing gateway** — 1,600+ models, retries, fallbacks, load balancing, and both **simple and semantic caching** — paired with a **freemium hosted control plane** for observability, prompt management, virtual keys, budgets, guardrails, and governance — the [LLMOps](/glossary/llmops) layer on top of the raw gateway. Best when you want caching and cost control as a managed, batteries-included service. (Palo Alto Networks acquired Portkey in 2026 — unlike Helicone's, a continuity move: it becomes the gateway in PANW's AI-security platform and stays actively developed.)

### [LiteLLM](/tools/litellm) — open-source library or self-hosted proxy

Call 100+ models through one OpenAI-format interface as a **library**, or run its **proxy** as a self-hosted gateway with central keys, fallbacks, caching, cost tracking, and rate limits. Best when you want to **own** the gateway end-to-end — for data control, custom policy, or on-prem — with no third party in the request path. (It's also the unified-access layer covered in [Calling Any Model](/guides/concepts/calling-any-model-gateways).)

### [Helicone](/tools/helicone) — observability-first, one-line proxy

Famous for the lowest-friction on-ramp: change your base URL and your calls are logged, traced, and analyzed, with proxy-level **caching** and great cost/latency visibility. Open source (Apache-2.0) and self-hostable.

> [!WARNING]
> **Helicone's 2026 status:** Mintlify [acquired Helicone](https://www.helicone.ai/blog/joining-mintlify) in March 2026, and it's now in **maintenance mode** — security and bug fixes only, no new features or roadmap, with migration assistance for customers. The open-source proxy still works and self-hosts fine, so existing users aren't stranded, but for a **new** project weigh that it's no longer actively developed.

## Caching & cost control, head to head

All three cache and track cost; the difference is how much is managed for you:

| | Caching | Cost control | Form factor | 2026 status |
|---|---|---|---|---|
| **Portkey** | Simple + semantic | Budgets, virtual keys, rate limits, cost analytics | OSS gateway + hosted plane | Actively developed |
| **LiteLLM** | Proxy cache | Cost tracking, budgets, rate limits (self-run) | Library or self-hosted proxy | Actively developed |
| **Helicone** | Proxy cache | Cost/latency analytics | One-line proxy / self-host | Maintenance mode |

## Operate a self-hosted gateway like security infrastructure

A gateway sees **every prompt and every key** you route through it, so self-hosting one is a security decision, not just an ops one. 2026 made this concrete for LiteLLM: a brief **supply-chain compromise** of its PyPI packages (remediated in a clean release with a hardened CI pipeline) and a critical proxy **SQL-injection vulnerability** (CVE-2026-42208, patched) that was exploited soon after disclosure. None of this makes LiteLLM a bad choice — it's a mature, widely used project that responded with hardening — but it's the reminder that applies to **any** self-hosted gateway, Portkey's included: pin and verify package versions, patch promptly, lock down network and key access, and monitor the proxy.

## How to choose

- **Want a managed, batteries-included caching + cost-control plane** → **Portkey**.
- **Want to self-host and fully own the gateway** → **LiteLLM**.
- **Already running Helicone** → keep the self-hosted proxy if it serves you; **starting fresh** → factor in its maintenance-mode status and consider the actively-developed options.
- **Just need a hosted router with zero ops** (not a full control plane) → the hosted [OpenRouter](/tools/openrouter) is the lighter-weight cousin.

For the techniques these gateways automate — caching, right-sizing, and p95 budgets — see [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering), restructure prompts for cache hits with the [prompt-cache-optimizer](/skills/performance/prompt-cache-optimizer), and let the [llm-cost-optimizer](/agents/data-ai/llm-cost-optimizer) run the whole optimization loop.
