---
name: "provider-fallback-wrapper"
description: "Wrap LLM calls so a provider outage, rate limit, or timeout degrades gracefully — with multi-provider fallback, bounded retries with backoff, and timeouts. Use when an app depends on a single model/provider and needs production resilience."
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "blue"
date: 2026-06-03
topics: ["llm-app-dev"]
related: ["guide:calling-any-model-gateways", "tool:litellm", "tool:openrouter", "agent:llm-integration-engineer"]
featured: false
summary: "A single-provider LLM call is a single point of failure. This skill wraps calls with timeouts, bounded retries with backoff (retrying only retryable errors), and fallback to an alternate model/provider — so a rate limit or outage degrades gracefully instead of taking the feature down."
---

LLM providers have outages, rate limits, and latency spikes. If your feature calls one model directly, every one of those is an incident. This skill wraps LLM calls with the resilience patterns that keep the feature up: timeouts, sensible retries, and fallback to an alternate model or provider.

## When to use this skill

- A production feature depends on a single model/provider and needs to survive outages and rate limits.
- You're seeing user-facing failures from transient `429`/`5xx`/timeout errors.
- You want a cheaper/faster primary model with a stronger fallback (or vice versa).

## Instructions

1. **Set a timeout.** Every call gets a deadline. A hung provider should fail fast into retry/fallback, not block the request indefinitely.
2. **Retry only what's retryable.** Retry transient failures — timeouts, rate limits (`429`), and `5xx` — with **exponential backoff and jitter** and a hard attempt cap. Do **not** retry non-retryable errors (`400` bad request, `401` auth, content-policy refusals); retrying those just wastes time and money.
3. **Fall back across providers/models.** On exhausting retries (or on specific errors), route to an alternate model or provider. Decide the order by cost/quality and keep the request/response shape stable so callers don't care which served it. A gateway like [LiteLLM](/tools/litellm) or [OpenRouter](/tools/openrouter) can do fallback for you; otherwise implement it explicitly.
4. **Mind semantic differences.** Fallback models may differ in format adherence and quality — re-apply structured-output validation after fallback, and don't silently downgrade a critical response without noting it.
5. **Make it observable.** Log which provider served each request, retry counts, and fallback events, and emit metrics so you can see when you're leaning on the fallback (a signal the primary is degraded).
6. **Guard cost.** Fallbacks and retries cost tokens; cap attempts and consider a circuit breaker that stops hammering a provider that's clearly down.

> [!WARNING]
> Don't retry non-idempotent, side-effecting calls blindly — for tool-executing agents, a naive retry can repeat an action. Retry the model call, but make any side effects idempotent (see the agent tool-calling guidance).

> [!NOTE]
> Fallback adds resilience, not correctness. A degraded fallback model can still produce worse output — validate it, and surface when you're running on the backup.

## Output

A wrapper around the app's LLM calls implementing timeouts, retryable-only backoff retries, multi-provider/model fallback, validation after fallback, and logging/metrics — with attempt and cost caps.
