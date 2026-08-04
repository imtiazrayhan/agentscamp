---
name: "rate-limiter-designer"
description: "Design and implement API rate limiting that actually holds under load — pick the algorithm (token bucket vs sliding-window-counter vs fixed window) and justify it, choose the limiting key and per-tier limits, use cross-instance atomic storage, and return standard 429 signals. Use when protecting an API from abuse or scrapers, enforcing per-tier quotas, or replacing an in-memory limiter that breaks behind multiple replicas."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["architecture", "devops-infra"]
related: ["skill:webhook-handler-scaffolder", "skill:auth-flow-reviewer", "skill:provider-fallback-wrapper"]
featured: false
summary: "Most rate limiters fail in two ways: they live in process memory (so each replica enforces its own private quota) or they read-then-write without atomicity (so concurrent requests slip past the limit). This skill picks the right algorithm for the traffic shape, a key and limits per tier, cross-instance atomic storage, and standard 429 + RateLimit-* headers — then sketches the handler."
---

A rate limiter is only as correct as its storage and its atomicity. An in-memory counter behind three replicas enforces 3x the limit; a `GET` then `SET` without an atomic increment lets a burst of concurrent requests all read the same pre-increment value and pass. This skill makes the decisions explicit — algorithm, key, limits, storage, failure mode — and produces an implementation sketch that survives horizontal scaling and concurrency.

## When to use this skill

- You're protecting an API (public, partner, or internal) from abuse, scrapers, credential stuffing, or runaway clients.
- You need per-tier quotas (free vs pro vs enterprise) or per-endpoint limits (cheap reads vs expensive writes/exports).
- You have an existing in-memory limiter and the service now runs more than one instance, so the effective limit drifts with replica count.
- A downstream dependency (a paid API, a database, an LLM provider) needs protecting from your own traffic spikes.

## Instructions

1. **Pick the algorithm from the traffic shape, and justify it.** Three viable choices:
   - **Token bucket** — refills at a steady rate, allows configurable bursts up to bucket capacity. Use for interactive/bursty clients (a user clicking fast, batch jobs) where occasional bursts are legitimate. Default choice for most APIs.
   - **Sliding-window counter** — approximates a true sliding window by weighting the previous and current fixed windows. Use when you need *smooth* enforcement without burst spikes (protecting a fragile downstream). Cheap: two counters per key.
   - **Fixed window** — one counter per key per interval. Use *only* when simplicity outweighs correctness; it permits up to **2x the limit** across a window boundary (full quota at the end of window N plus full quota at the start of N+1). Never use it to protect something that genuinely caps at N.
   State which you chose and the burst/smoothness tradeoff that drove it.

2. **Choose the limiting key — and prefer a composite.** Options and their failure modes:
   - **IP** — defeated by NAT (one office shares an IP → collateral throttling) and by rotating proxies. Use only for unauthenticated traffic.
   - **API key / authenticated user** — the right granularity for quotas; ties the limit to identity, not network. Requires the limiter to run *after* auth.
   - **Composite** (e.g. `user + endpoint`, or `apiKey + route-class`) — lets expensive endpoints have tighter limits than cheap ones under the same identity.
   Pick the key per route class. Unauthenticated routes fall back to IP; authenticated routes key on identity.

3. **Set limits per tier, written down as a table.** Define explicit numbers: e.g. free = 60 req/min, pro = 600 req/min, enterprise = custom; expensive endpoints (export, search, LLM-backed) get their own lower limit. Don't invent one global number — the whole point is differentiation.

4. **Use storage that is shared and atomic.** The counter must live in a store all instances reach — **Redis** (or equivalent) — and the increment-and-check must be **atomic**. With Redis, use `INCR` + `EXPIRE` on the same key (or a single Lua script for token bucket, so read-refill-decrement is one atomic operation). A `GET` then `SET` from application code is a race: concurrent requests read the same value and all pass. In-memory (`Map`, an LRU) is correct only for a single-process service and is otherwise a silent bug — each replica keeps its own private quota.

5. **Return standard signals.** On limit exceeded, respond **`429 Too Many Requests`** with:
   - `Retry-After: <seconds>` — when the client may retry.
   - `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` — emit these on *every* response (not just 429s) so well-behaved clients self-throttle before hitting the wall. Reset is seconds-until-reset (or a Unix timestamp — be consistent and document which).

6. **Decide fail-open vs fail-closed when the store is down.** This is a deliberate choice, not a default:
   - **Fail-open** (allow when Redis is unreachable) — preserves availability; correct for limiters that protect against *abuse* where a brief gap is acceptable.
   - **Fail-closed** (reject) — correct when the limit guards a hard resource cap (a paid downstream, a quota you're contractually bound to). Wrap the store call in a short timeout so a slow store doesn't hang every request; on timeout, apply the chosen policy.

7. **Handle clock skew and bursts.** Compute windows from the **store's clock** (e.g. Redis `TIME`) or a single source, not each instance's wall clock — skewed instances otherwise disagree on window boundaries. For token bucket, set capacity = the largest legitimate burst and refill rate = the sustained limit; document both.

> [!WARNING]
> Per-instance in-memory limiting in a horizontally-scaled deploy is the most common rate-limiter bug: with N replicas and a round-robin load balancer, the effective limit is roughly N x the configured value, and it changes silently when you autoscale. If the service has more than one replica, the limiter state MUST be in shared storage.

> [!WARNING]
> Read-then-write without atomicity defeats the limiter under exactly the load it exists to stop. Concurrent requests all read the pre-increment count and all pass. Use an atomic `INCR` (fixed/sliding window) or a single Lua script (token bucket) — never `GET` then conditional `SET` from app code.

> [!NOTE]
> Don't rate-limit at the app when an upstream layer does it better. A CDN/WAF or API gateway (Vercel Firewall, Cloudflare, Kong) can enforce coarse IP limits at the edge before traffic reaches your origin; reserve app-level limiting for identity- and tier-aware quotas that need request context.

## Output

A short design block stating: the chosen **algorithm** + rationale, the **key** per route class, a **per-tier limits table**, the **storage** mechanism (and why it's atomic + cross-instance), and the **fail-open/closed** policy with timeout. Followed by a concrete middleware/handler sketch that performs the atomic increment-and-check against the store, sets `RateLimit-*` headers on every response, returns `429` + `Retry-After` on breach, and applies the chosen failure policy when the store is unreachable.
