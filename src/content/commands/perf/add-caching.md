---
description: "Add a caching layer to one expensive function or endpoint correctly — confirm it's cacheable, design the cache key/TTL/layer/invalidation, handle stampedes, wrap the call in one place, and report the design."
argument-hint: "<function or endpoint to cache>"
allowed-tools: "Read, Grep, Glob, Edit"
title: "Add Caching"
color: "purple"
date: 2026-06-17
topics: ["devops-infra"]
related: ["command:find-n-plus-one", "skill:connection-pool-tuner", "command:set-perf-budget"]
featured: false
summary: "A slash command that adds caching to one expensive function/endpoint correctly: it confirms the work is cacheable, then designs the cache key (every result-changing input — args, user/tenant, locale, version), a TTL tied to tolerated staleness, the layer (in-process vs Redis), and invalidation (TTL vs explicit bust). It guards stampedes, wraps the call once, and reports it."
faq:
  - q: "Why is an incomplete cache key a security bug, not just a perf bug?"
    a: "If the key omits an input that changes the result — most often the user/tenant ID — two different requests hash to the same key and the cache serves one user the other user's data. That's a cross-account data leak, not a stale-content nuisance. The key must include every input the result depends on, including the caller's identity scope."
  - q: "When should I NOT cache something?"
    a: "Skip caching when the result is non-deterministic per call, when the data is write-heavy and must always be fresh (balances, inventory, auth state), or when you have no plan to invalidate mutable data. Caching mutable data without invalidation serves stale results indefinitely — measure the cost first; an unindexed query or N+1 is usually the real fix."
---

## Scope

Treat `$ARGUMENTS` as the single function or endpoint to add caching to — name it precisely (`getUserDashboard`, `GET /api/products/:id`, `computeRecommendations`). Restate the target in one sentence before touching anything.

If `$ARGUMENTS` is empty, ask one question: *which function or endpoint is slow, and roughly how slow?* Do not guess and cache the wrong layer.

> [!WARNING]
> Caching is the second-best fix. Before adding a cache, check whether the cost is a missing index, an N+1, or an over-fetch — those should be fixed at the source, not papered over. Cache only after the work is genuinely expensive *and* repeated.

## Step 1 — Confirm it is actually cacheable

Read the target with `Read`/`Grep` and answer three questions before designing anything. If any answer is "no", stop and tell the user instead of caching:

- **Deterministic enough?** Same inputs → same (or acceptably-close) output. A function that returns `now()`, a random sample, or live external state is not cacheable as-is.
- **Read-heavy?** It's called far more than the underlying data changes. Caching a value that's read once per write saves nothing.
- **Staleness-tolerant?** The caller can accept data that's a few seconds/minutes old. Balances, inventory counts, permissions, and auth checks usually cannot — say so and stop.

## Step 2 — Locate and size the cost

Find *what* is expensive inside the target so you cache the right boundary: a DB round-trip, an external API call, a heavy CPU computation, or fan-out. Grep the body for the query/fetch/compute that dominates. State the cost honestly ("one external API call, ~300ms, called per page load") so the TTL and layer choices below are grounded, not arbitrary.

## Step 3 — Design the cache key

This is the step that breaks correctness if done wrong. The key must include **every input that changes the result**:

- the function's own arguments (normalized — sort/canonicalize so `{a,b}` and `{b,a}` collide intentionally, not accidentally);
- the **identity scope**: user ID, tenant/org ID, or whatever isolation boundary the data belongs to;
- request-shaping context that changes output: locale/language, feature flags, role/permission tier, currency;
- a **version token** for the schema or serialization, so a deploy that changes the output shape doesn't serve old-shaped values.

> [!WARNING]
> An incomplete cache key is a cross-user data leak, not a perf nuisance. Omit the user/tenant from a per-user result and you will serve one account another account's data. When in doubt, over-scope the key — a too-specific key just lowers the hit rate; a too-broad key leaks.

## Step 4 — Choose TTL and layer

**TTL** = how stale the data is allowed to be, not a round number. Tie it to the write cadence: if the source changes every few minutes and 60s of staleness is fine, TTL is ~60s. A short TTL with no invalidation is often the simplest correct design.

**Layer** — pick deliberately:

- **In-process (LRU/`Map`):** fastest, zero infra, but **per-node** — caches diverge across a multi-instance fleet, and one node can serve stale data while another is fresh. Fine for single-instance, immutable, or short-TTL data.
- **Shared (Redis/Memcached):** consistent across the fleet and survives restarts, at the cost of a network hop and a dependency. Use it when correctness across instances matters or the cache must be invalidated fleet-wide.

> [!NOTE]
> Don't reflexively reach for Redis. If the service runs as one process, or the data is effectively immutable for the TTL window, an in-process cache is simpler and faster. Reach for shared cache the moment you need explicit invalidation or cross-instance consistency.

## Step 5 — Decide invalidation

State exactly how a cached value stops being served:

- **TTL expiry only** — simplest; acceptable when bounded staleness is fine. No write-path coupling.
- **Explicit bust on write** — when a write must be visible immediately, delete/overwrite the key in the same code path that mutates the underlying data. The bust must reconstruct the *exact same key* from Step 3, or it deletes nothing. Co-locate the bust with the write so they can't drift apart.

If the data is mutable and the user can't tolerate staleness, you need explicit invalidation — TTL alone will serve stale results until it expires.

## Step 6 — Guard against the stampede

When a hot key expires, many concurrent callers miss at once and all recompute the expensive work simultaneously (thundering herd) — the cache that was protecting the backend now amplifies load. Add one defense:

- **Single-flight / request coalescing:** the first miss computes; concurrent callers for the same key await that one in-flight computation instead of launching their own.
- **Jittered TTL:** add a small random spread to each TTL so keys populated together don't all expire on the same tick.

Pick the one that fits the layer (single-flight for in-process is trivial; jitter is the cheap shared-cache option).

## Step 7 — Implement at the boundary, not in the callers

Wrap the expensive call **in one place** — a decorator, a cache-aside helper, or a thin wrapper around the function — so every caller benefits and the key/TTL/invalidation logic lives in exactly one spot. Use `Edit` to add the wrapper around the existing call site; do not sprinkle `cache.get`/`cache.set` through every caller (that's where keys drift and busts get forgotten). Keep the cache check, compute-on-miss, and store in the same function the call already flows through.

> [!NOTE]
> Cache-aside is the default shape: on call, look up the key; on hit return it; on miss compute, store with the TTL, return. Failures to reach the cache (e.g. Redis down) must fall through to computing the real value, never error the request.

## Report

Deliver, as your message: the **cache design** as a compact spec — **key** (every input included), **TTL** (with the staleness it implies), **layer** (in-process vs shared, and why), **invalidation** (TTL-only or explicit bust + where), and **stampede guard**. Then summarize the **change you made** (which boundary you wrapped, file:line). Close with the one verification step the user should run — confirm the hit rate and that a write is reflected within the expected window.