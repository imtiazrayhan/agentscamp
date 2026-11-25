---
title: "API Rate Limiting Design: Algorithms, Distributed State & LLM Quotas"
description: "Design production API rate limiting with token bucket vs sliding window algorithms, atomic Redis state, per-tier keys, 429 headers, and LLM token budgets."
author: "Imtiaz Rayhan"
date: 2026-11-25
color: "purple"
topics: ["architecture", "llm-app-dev"]
audience: ["developers", "ai-engineers"]
tags: ["api", "rate-limiting", "redis", "distributed-systems", "llm-api"]
featured: false
summary: "Reliable API rate limiting picks the right algorithm for burst tolerance (token bucket or sliding-window counter), keys limits by tenant or API key rather than raw IP alone, enforces state atomically across replicas via Redis Lua scripts, returns standard 429 and Retry-After signals, and separates request limits (RPM) from cost-weighted or token limits (TPM) for AI endpoints."
keyTakeaways:
  - "Choose token bucket when short bursts are legitimate (interactive UIs, webhook spikes); choose sliding-window counter when you need strict per-window caps without fixed-window boundary spikes."
  - "In-memory rate limiters silently multiply your limit by replica count and reset on every deploy — use atomic cross-instance state (Redis Lua script or edge KV/Durable Objects)."
  - "Key by authenticated principal (tenant ID, API key, user ID) for product tiers, and keep IP-based limits only as a coarse pre-auth abuse shield."
  - "Return HTTP 429 with Retry-After and RateLimit headers so well-behaved SDKs back off cleanly instead of retry-storming your origin."
  - "AI and LLM endpoints cannot rely on requests-per-minute alone — enforce dual RPM + token/cost budgets and reserve headroom before streaming begins."
faq:
  - q: "Which rate-limiting algorithm should I use by default?"
    a: "Token bucket is the best default for most APIs because it enforces a steady average rate while allowing brief, legitimate bursts without throwing false 429s. If your billing or upstream contract requires a hard ceiling per rolling minute with no burst allowance, use a sliding-window counter."
  - q: "Why do fixed-window rate limiters fail under traffic?"
    a: "A fixed-window counter resets at clock boundaries (for example, :00 of every minute). A client can send a full minute's quota at 12:00:59 and another full quota at 12:01:01 — doubling your allowed traffic in two seconds and overwhelming downstream databases."
  - q: "How should rate limiting work for LLM and AI endpoints?"
    a: "Pair a request-rate limit (RPM) with a token or credit budget (TPM). Estimate max input plus expected output tokens up front before starting a stream, then reconcile actual usage from the provider response when the stream completes so one huge prompt cannot monopolize shared capacity."
  - q: "Should a rate limiter fail open or fail closed if Redis is unreachable?"
    a: "Fail open with a loud alert for standard user-facing product APIs where an internal Redis hiccup shouldn't take down paying traffic. Fail closed (or drop to a strict local fallback) on expensive unauthenticated routes, login/OTP endpoints, and metered LLM generation endpoints where abuse causes direct financial loss."
related: ["skill:rate-limiter-designer", "guide:idempotency-keys-api-design", "agent:api-architect", "skill:webhook-handler-scaffolder", "skill:pagination-designer", "skill:provider-fallback-wrapper"]
howtoSteps:
  - name: "Choose the algorithm and burst profile"
    text: "Match token bucket, leaky bucket, or sliding-window counter to whether legitimate callers burst or must stay under a strict rolling ceiling."
  - name: "Define limiting keys and tier budgets"
    text: "Separate pre-auth IP shields from per-tenant or per-API-key quotas, and add token or cost weights for expensive routes."
  - name: "Move enforcement to atomic shared state"
    text: "Execute read-check-increment in a single Redis Lua script or edge counter so concurrent replicas cannot race past the limit."
  - name: "Emit standard 429 and RateLimit headers"
    text: "Return HTTP 429 with Retry-After and remaining-quota headers so clients back off cleanly without retry storms."
  - name: "Verify under concurrency and failure"
    text: "Load-test across multiple replicas, test boundary bursts, and confirm your chosen fail-open or fail-closed fallback behaves as designed."
---

**An API rate limiter protects availability, fairness, and unit economics by bounding how much work any single caller can trigger over time.** Most teams bolt on a quick in-memory middleware when a scraper hits production, then discover months later that it broke the moment they scaled past one replica — or that a single 100K-token prompt bypassed a requests-per-minute cap and blew through their LLM spend budget.

Designing rate limiting deliberately takes four decisions: the algorithm, the limiting key, the shared state mechanism, and the client-facing HTTP contract.

## Pick the algorithm by burst tolerance

Every rate limiter trades memory, implementation complexity, and boundary precision:

| Algorithm | Burst behavior | State per key | Best fit |
| --- | --- | --- | --- |
| **Token bucket** | Allows short bursts up to bucket capacity, refills steadily | 2 numbers (tokens + timestamp) | General REST/GraphQL APIs, interactive web/mobile clients |
| **Sliding-window counter** | Smooths boundary spikes using weighted current + previous window | 2 counters (current + prior window) | Strict per-minute/hour tier quotas, high-throughput gateways |
| **Fixed-window counter** | Allows up to 2× burst across window boundary | 1 integer with TTL | Coarse abuse shields where exact edges do not matter |
| **Leaky bucket (queue)** | Smooths output to a flat constant rate | Queue depth / drain timestamp | Downstream webhook delivery or fragile third-party APIs |
| **Sliding-window log** | Exact rolling count, zero boundary error | Sorted set of every timestamp | Low-volume, high-value endpoints (password resets, payouts) |

Default to **token bucket** when callers naturally batch requests (a dashboard loading six widgets at once, then going quiet). Choose **sliding-window counter** when you advertise a crisp ceiling ("120 requests/minute") and want to eliminate the 2× boundary spike without storing per-request timestamps.

## Choose limiting keys that match the threat

One global IP limiter is never enough: corporate offices, universities, and mobile carriers put thousands of legitimate users behind one NAT IP, while distributed scrapers rotate thousands of IPs per minute. Layer your keys instead:

1. **Pre-auth edge shield (IP + route class):** stops credential stuffing, scraping, and accidental tight loops before requests hit your application tier.
2. **Authenticated tenant or API key (tier quota):** enforces Free, Pro, and Enterprise allowances consistently across every user inside a workspace.
3. **Per-endpoint cost weight:** a lightweight `GET /health` and a heavy `POST /reports/export` should not consume the same budget. Assign integer weights (`cost = 1` vs `cost = 25`) to the same token bucket.
4. **Concurrency limit (in-flight cap):** caps how many slow or streaming requests a single tenant can hold open simultaneously — essential for SSE streams, database exports, and agent runs where ten 60-second requests saturate workers without tripping an RPM limit.

## Make distributed state atomic

An in-memory `Map` inside Node.js or Python fails in two predictable ways: scaling to 8 replicas multiplies the real limit by 8, and every deploy or autoscaling event wipes every counter back to zero.

Across multiple replicas, execute the check-and-decrement **atomically** in shared storage — typically a Redis Lua script so no two concurrent requests can both read "1 token left" and both pass:

```lua
-- KEYS[1] = bucket key
-- ARGV[1] = capacity, ARGV[2] = refill_per_sec, ARGV[3] = now_ms, ARGV[4] = cost
local data = redis.call("HMGET", KEYS[1], "tokens", "ts")
local tokens = tonumber(data[1]) or tonumber(ARGV[1])
local last_ts = tonumber(data[2]) or tonumber(ARGV[3])

local elapsed = math.max(0, (tonumber(ARGV[3]) - last_ts) / 1000.0)
tokens = math.min(tonumber(ARGV[1]), tokens + elapsed * tonumber(ARGV[2]))

if tokens < tonumber(ARGV[4]) then
  local retry_after = math.ceil((tonumber(ARGV[4]) - tokens) / tonumber(ARGV[2]))
  return {0, math.floor(tokens), retry_after}
end

tokens = tokens - tonumber(ARGV[4])
redis.call("HMSET", KEYS[1], "tokens", tokens, "ts", ARGV[3])
redis.call("PEXPIRE", KEYS[1], math.ceil((tonumber(ARGV[1]) / tonumber(ARGV[2])) * 1000) * 2)
return {1, math.floor(tokens), 0}
```

Set a TTL (`PEXPIRE`) slightly longer than the time required to refill an empty bucket so inactive keys expire automatically instead of leaking Redis memory.

## Return standard 429 signals so clients back off

When you reject a request, tell well-behaved clients exactly when to come back. Returning a bare `429` with no hint causes naive retry loops to hammer your servers every 100 ms:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 12
RateLimit-Limit: 120
RateLimit-Remaining: 0
RateLimit-Reset: 12
Content-Type: application/problem+json
```

Pair rate limiting with [idempotency keys](/guides/api/idempotency-keys-api-design) on every mutating endpoint. Clients *will* retry after `429` or `503` responses — idempotency guarantees that an automated retry never double-charges or duplicates a record when a request times out right at the edge.

## Rate-limiting LLM and AI endpoints

Standard RPM limits break down on AI APIs because one request might process 200 tokens while the next sends 120,000 tokens of context and streams 8,000 output tokens. Treat AI endpoints with a three-part budget:

1. **RPM + concurrency cap:** bounds open streaming connections and prevents webhook or agent loops from exhausting worker pools.
2. **Pre-flight token reservation (TPM):** count input tokens plus a bounded `max_tokens` estimate and deduct from the tenant's token bucket *before* calling the upstream model.
3. **Post-stream reconciliation:** once the model returns actual `usage` counts, refund unused reserved tokens (or debit the delta) back to the bucket.

For upstream provider 429s — when Anthropic, OpenAI, or Gemini throttles *your* backend — pair your inbound limiter with a [provider fallback wrapper](/skills/api/provider-fallback-wrapper) and the queueing patterns in [LLM Cost & Latency Engineering](/guides/advanced/llm-cost-latency-engineering).

## Decide fail-open vs fail-closed before an outage

Your rate-limiting store will eventually have a network blip. Decide explicitly per route class:

- **Fail open (with metrics + alert):** core authenticated read/write APIs where letting a brief burst through is far better than locking out paying users.
- **Fail closed (or tight in-process fallback):** login, password reset, SMS/OTP triggers, and expensive LLM generation routes where an unthrottled flood creates immediate security or billing damage.

> [!TIP]
> Emit metrics for `rate_limit_allowed`, `rate_limit_denied`, and `rate_limit_store_errors` tagged by route class and tier — never by raw user ID or IP — so dashboards stay fast and never blow up metric cardinality.

Use the [Rate Limiter Designer](/skills/api/rate-limiter-designer) skill to generate a concrete Redis Lua limiter and middleware for your stack, and pair it with [Idempotency Keys: Design APIs That Are Safe to Retry](/guides/api/idempotency-keys-api-design) to make retries safe end to end.

## Continue exploring

- [api-architect](/agents/core-development/api-architect) — Design API resource models, versioning, pagination, rate-limit contracts, and error schemas.
- [Idempotency Keys: Design APIs That Are Safe to Retry](/guides/api/idempotency-keys-api-design) — Make every retryable mutation safe against network timeouts and duplicate delivery.
