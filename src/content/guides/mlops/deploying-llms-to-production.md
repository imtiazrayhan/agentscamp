---
title: "Deploying LLMs to Production: A Reliability & Cost Checklist"
description: "Take an LLM feature from prototype to production: API vs self-host, provider fallback, retries, caching, observability, eval gates, and safe rollout."
author: "AgentsCamp"
color: "green"
topics: ["mlops-ai-infra"]
tags: ["production", "reliability", "serving", "observability", "rollout"]
related:
  - "guide:self-host-vs-api-llm"
  - "guide:llm-cost-latency-engineering"
  - "guide:calling-any-model-gateways"
  - "skill:provider-fallback-wrapper"
  - "skill:token-usage-profiler"
featured: false
date: 2026-06-17
summary: "A prototype that works in a notebook is not a production system. Shipping an LLM feature means engineering around a slow, non-deterministic, rate-limited, occasionally-down dependency you don't control. The work that separates demo from production is reliability, observability, cost control, and safe rollout — not the prompt."
keyTakeaways:
  - "Treat every model call as an unreliable network dependency: timeouts, retries with backoff, and a fallback path are non-negotiable."
  - "Default to a hosted API; self-host only when sustained volume, latency, or data-residency math justifies the GPU and ops burden."
  - "Trace every call with token and cost metadata from day one — you cannot debug or budget what you don't measure."
  - "Gate deploys on an eval suite in CI and roll out behind a canary; prompt and model changes are code changes."
  - "Cost and latency are engineered, not discovered: streaming, caching, prompt-size discipline, and model routing are the levers."
faq:
  - q: "Should I use a hosted API or self-host my LLM in production?"
    a: "Default to a hosted API. Self-hosting only pays off at sustained high volume, when you need predictable low latency under your own control, or when data-residency rules forbid sending data to a third party. Below that threshold the GPU spend, on-call burden, and serving complexity outweigh per-token savings."
  - q: "What is the single most important thing to add before shipping an LLM feature?"
    a: "Tracing. Capture the full prompt, response, model, latency, token counts, and cost for every call. Without it you cannot debug failures, attribute spend, detect quality drift, or build evals from real traffic."
  - q: "How do I handle a provider outage or rate limit in production?"
    a: "Combine retries with exponential backoff and jitter (for transient 429s and 5xxs), a circuit breaker (to stop hammering a dead provider), and a fallback to a second provider or a smaller model. A gateway can centralize all three so your application code stays simple."
howtoSteps:
  - name: "Decide API vs self-host"
    text: "Estimate sustained tokens/second and check latency and data-residency constraints. Default to a hosted API unless the volume or compliance math forces self-hosting."
  - name: "Make calls reliable"
    text: "Wrap every model call with a timeout, retries with exponential backoff and jitter, a circuit breaker, and a fallback provider or smaller model."
  - name: "Engineer cost and latency"
    text: "Stream tokens to the user, cache deterministic and repeated calls, trim prompt size, and route easy requests to cheaper models."
  - name: "Instrument observability"
    text: "Trace every call with prompt, response, model, latency, tokens, and cost. Track spend per feature and monitor an eval score over time for drift."
  - name: "Roll out safely"
    text: "Gate the deploy on an eval suite in CI, release behind a canary to a small traffic slice, watch the metrics, and keep a one-click rollback."
keywords:
  - "deploy llm to production"
  - "llm production checklist"
  - "llm reliability"
  - "vllm serving"
  - "provider fallback"
  - "llm observability"
---

**A prototype that works in a notebook is not a production system.** Shipping an LLM feature means engineering around a slow, non-deterministic, rate-limited, occasionally-down dependency you do not control. The hard part is rarely the prompt — it is reliability, observability, cost control, and safe rollout. This is the production-readiness checklist.

## 1. Decide: hosted API or self-host

This is the first fork and it shapes everything downstream.

**Default to a hosted API** ([Anthropic](/guides/concepts/calling-any-model-gateways), OpenAI, etc.). You get [frontier-model](/glossary/frontier-model) quality, zero GPU ops, elastic capacity, and someone else on call. The trade-offs: per-token cost at scale, a hard dependency on a third party's uptime and rate limits, and your data leaving your perimeter.

**Self-host (open-weights)** only when the math forces it:

- **Volume** — at sustained high tokens/second, owning GPUs can beat per-token API pricing. Below that threshold it rarely does.
- **Latency / control** — you need predictable tail latency or custom batching the API won't give you.
- **Data residency** — compliance forbids sending data to a third party.

If none of those apply, self-hosting is a tax. There is also a middle ground: managed inference providers that host open models for you so you get open-weights flexibility without running GPUs — [Together AI](/tools/together-ai) and [Fireworks AI](/tools/fireworks-ai) for fast production inference, [Groq](/tools/groq) for ultra-low-latency serving, and [Replicate](/tools/replicate) or [Baseten](/tools/baseten) to deploy your own models on autoscaling GPUs. See [self-host vs API](/guides/mlops/self-host-vs-api-llm) for the full decision and break-even analysis.

### Serving a self-hosted model (high level)

If you do self-host, use a purpose-built inference server — **vLLM** is the de facto standard — not a naive `model.generate()` loop. The wins come from:

- **Continuous batching** — pack many in-flight requests onto the GPU instead of one at a time. This is the biggest throughput lever.
- **KV cache management** — vLLM's paged [KV cache](/glossary/kv-cache) is what makes batching efficient; size GPU memory around it.
- **GPU sizing** — pick VRAM by model weights + KV cache headroom. [Quantization](/glossary/quantization) (e.g. 8-bit/4-bit) cuts memory and cost at a small quality hit; a [small language model](/glossary/small-language-model) may fit one GPU where a large one needs several.

Treat the serving layer as its own service with its own SLOs.

## 2. Make every call reliable

The model call is a network call to an unreliable dependency. Wrap it accordingly. The four primitives:

- **Timeouts** — never block forever. Set a hard ceiling per call; for streaming, set a time-to-first-token timeout separate from the total.
- **Retries with exponential backoff + jitter** — retry transient `429` and `5xx` only, never a `400`. Jitter prevents synchronized retry storms.
- **Circuit breaker** — after N consecutive failures, stop calling the dead provider for a cooldown window so you fail fast instead of piling up timeouts.
- **Fallback / graceful degradation** — on failure, fall back to a second provider or a cheaper model, or degrade the feature (return cached output, a simpler heuristic, or an honest "try again") rather than 500.

Multi-provider fallback is the highest-leverage reliability move because outages tend to be correlated within a provider but not across providers. A [model gateway](/guides/concepts/calling-any-model-gateways) centralizes routing, retries, and fallback so application code stays clean; the [provider-fallback-wrapper](/skills/api/provider-fallback-wrapper) skill scaffolds the pattern directly.

## 3. Engineer cost and latency

Cost and latency are engineered, not discovered. The levers, in order of impact:

- **Stream tokens** — [token streaming](/glossary/token-streaming) doesn't reduce total latency but slashes *perceived* latency. Ship it for any user-facing text.
- **Cache** — [prompt caching](/glossary/prompt-caching) cuts cost and latency on repeated prefixes (long system prompts, RAG context); [semantic caching](/glossary/semantic-caching) serves near-duplicate queries from cache entirely.
- **Prompt-size discipline** — you pay for every input token. Trim bloated [system prompts](/glossary/system-prompt), retrieve fewer/better chunks, and don't dump whole documents into the [context window](/glossary/context-window) when a slice will do.
- **Model routing** — send easy requests to a cheap fast model and escalate only the hard ones to a frontier model. The biggest spend reductions usually come from *not using the expensive model* on most traffic.

[LLM cost & latency engineering](/guides/advanced/llm-cost-latency-engineering) goes deeper on each lever.

## 4. Instrument observability

You cannot operate what you cannot see. Before you scale traffic, every call must emit:

- **[Tracing](/glossary/tracing)** — full prompt, response, model version, parameters, latency, and outcome for every call. This is your debugger, your eval-dataset source, and your audit log.
- **Token and cost tracking** — attribute [token](/glossary/llm-token) usage and spend per feature, per user, per route. Cost surprises are nearly always a missing dashboard. The [token-usage-profiler](/skills/data/token-usage-profiler) skill helps here.
- **Eval monitoring and drift** — run an [LLM-as-judge](/glossary/llm-as-judge) or rule-based eval against a sample of live traffic and chart the score over time. A provider model update, a prompt edit, or shifting input distribution can silently degrade quality; a drift line catches it before users do.

## 5. Roll out safely

A prompt change is a code change. A model-version bump is a dependency upgrade. Both can regress quality with zero warning, so gate them.

1. **Eval gate in CI** — keep an [eval dataset](/glossary/eval-dataset) of representative inputs with expected behavior, and fail the build if the score drops below threshold. This is the single best defense against prompt/model regressions.
2. **Canary / staged rollout** — release to 1–5% of traffic first, watch latency, error rate, cost, and eval score, then ramp. The [canary-release-planner](/skills/release/canary-release-planner) skill structures this.
3. **One-click rollback** — pin the model version and prompt as deployable config so you can revert instantly. Never let "latest" float in production.

## The production-readiness checklist

Before you flip a feature on for real traffic, confirm:

- **Sourcing** — API-vs-self-host decision made deliberately, with a cost/latency/residency rationale.
- **Reliability** — timeout, retry+backoff+jitter, circuit breaker, and fallback on every call path.
- **Cost/latency** — streaming on, caching where applicable, prompts trimmed, routing in place.
- **Observability** — tracing, per-feature cost tracking, and an eval-drift signal live.
- **Rollout** — eval gate in CI, canary plan, instant rollback.
- **Rate limits & quotas** — your throughput modeled against the provider's limits, with backpressure (a queue) so a spike degrades gracefully instead of mass-429ing.
- **Secrets** — API keys in a secrets manager (never in code, env files in the repo, or client bundles), scoped and rotatable; per-environment keys so a leak is contained.

The prompt got you the demo. This list gets you to production.

## Continue exploring

- [Scaffold Dockerfile](/commands/scaffold/scaffold-dockerfile) — Scaffold a production-grade multi-stage Dockerfile and `.dockerignore` for the current project.
