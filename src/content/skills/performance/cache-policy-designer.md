---
name: "cache-policy-designer"
title: "Cache Policy Designer"
description: "Design a cache policy from data ownership, freshness, privacy, invalidation, and failure requirements across browser, CDN, reverse-proxy, application, and data caches. Use when adding caching, debugging stale responses, reviewing Cache-Control behavior, reducing origin load, or deciding whether a value can be cached safely at all."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "orange"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["devops-infra", "architecture"]
audience: ["developers", "devops"]
related: ["guide:best-claude-skills-for-performance", "skill:web-vitals-optimizer", "skill:cold-start-optimizer", "skill:load-test-designer", "skill:semantic-cache-designer", "agent:api-architect"]
featured: true
summary: "Designs cache behavior per object and layer by identifying ownership, variation keys, freshness bounds, invalidation events, privacy constraints, stampede protection, stale-on-failure behavior, and observability. It produces explicit headers or key rules plus correctness tests rather than applying one TTL everywhere."
faq:
  - q: "What is the hardest part of caching?"
    a: "Correct invalidation and variation. A fast cache that serves another user's data or an obsolete business state is a correctness incident, so policy starts with ownership and change events before TTL."
  - q: "Should authenticated responses ever be cached?"
    a: "Only with an explicit private or identity-partitioned policy and verified variation keys. Shared caches must not store personalized responses unless the design proves tenant and user isolation."
---

Design caching as a correctness contract with a performance benefit. Work one object class at a time (a route, an asset type, a computed value) and write its policy down before changing any header or key.

## Workflow

1. **Inventory the cacheable object.** Name the response or value, authoritative source, readers, writers, sensitivity, size, cost to recompute, and consequence of serving it stale. Ask the owner one question and record the answer as a number: "how old may this be before a user is harmed or misled?" That number, not convenience, bounds every TTL below.

2. **Map every cache layer.** Trace browser, service worker, CDN, gateway, reverse proxy, framework, application, ORM, and database caches. Record which layer currently owns freshness and invalidation. Read what is actually served before reading the code:

   ```bash
   curl -sI https://example.com/api/products/42 | grep -iE "cache-control|age|etag|last-modified|vary|expires|x-cache|cf-cache-status"
   ```

   Run it twice. A rising `Age` or a hit status on the second response shows a shared cache is storing it. A response with a validator and no `Cache-Control` can still be cached heuristically, so "no header" does not mean "not cached".

3. **Define identity and variation.** Specify the complete cache key: resource, tenant, user or authorization class, locale, encoding, version, query shape, and any header that changes the representation. For HTTP, every request header that changes the body must appear in `Vary` or in the CDN's key configuration. For application caches, write the key template explicitly:

   ```text
   v3:tenant:{tenant_id}:product:{product_id}:locale:{locale}
   ```

   The version prefix lets a deploy that changes the serialized shape abandon old entries without a purge. Normalize or drop parameters that do not change the response (tracking parameters, parameter order) to protect hit ratio, but never collapse a security boundary.

4. **Choose freshness semantics.** Pick the directive set from the object's class, then set numbers from step 1:

   | Object class | Starting policy |
   |---|---|
   | Fingerprinted static asset (hash in filename) | `Cache-Control: public, max-age=31536000, immutable` |
   | HTML or any document that references fingerprinted assets | `Cache-Control: no-cache` with an `ETag`, so every use revalidates |
   | Public API response, tolerable staleness of N seconds | `Cache-Control: public, max-age=<browser>, s-maxage=<N>, stale-while-revalidate=<N>, stale-if-error=<outage budget>` |
   | Per-user response | `Cache-Control: private, max-age=<small>` or `private, no-cache` |
   | Tokens, payment data, anything that must never be stored | `Cache-Control: no-store` |

   `no-cache` means "store, but revalidate before use"; `no-store` means "do not store". `s-maxage` applies to shared caches only and overrides `max-age` there. Support for `stale-while-revalidate` and `stale-if-error` varies by CDN, so confirm it in the CDN's documentation before depending on it.

5. **Design invalidation.** List every write path and event that changes the object, including admin tools, background jobs, and imports. For each, choose a mechanism: purge by URL, purge by tag or surrogate key, versioned keys, write-through update, or expiry only. Then state how a missed invalidation heals: the TTL is the backstop, so maximum staleness after a lost purge equals the TTL. If that is unacceptable, shorten the TTL or make invalidation transactional.

6. **Control concurrency.** Prevent cold-key stampedes with request coalescing (one recompute per key, other callers wait), a lock with a bounded lease, or early refresh before expiry. Add jitter of about 10% to TTLs so keys written together do not expire together. Define what callers get while a recompute is slow: the stale value, a wait with a timeout, or an error.

7. **Specify privacy and failure rules.** Mark values that must never enter a shared cache. Any response that depends on `Authorization` or a session cookie is `private` unless the key provably includes the identity or tenant. Decide negative caching (how long a 404 or empty result is stored), whether errors are ever cached (default: no, or a few seconds to shed load), fail-open versus fail-closed when the cache is unreachable, and the maximum stale age served during an origin outage.

8. **Verify and observe.** Write one test per behavior and state the expected result:

   - miss then hit: second request is served from cache with `Age` greater than 0
   - revalidation: a request with `If-None-Match: <etag>` returns `304`
   - invalidation: write, then read returns the new value within the stated bound
   - isolation: two users or tenants requesting the same URL never receive each other's body
   - expiry under load: concurrent requests at expiry trigger one origin call
   - origin failure: stale is served up to the outage budget, then an error

   Measure hit ratio per route and status, `Age` distribution, evictions, origin request rate, stale serves, and key cardinality.

> [!WARNING]
> Do not add `public` caching or omit authorization from a key merely to improve hit rate. Cross-user cache leakage is a security failure, not a tuning tradeoff.

## Output

Return a layer-by-layer policy with key dimensions, freshness directives, invalidation events, stampede controls, outage behavior, privacy exclusions, implementation locations, verification cases, and metrics. Call out unknown writers or variation inputs that block safe caching.

One policy block per object class (fictional example):

```markdown
## Object: GET /api/products/{id} (public catalog data)
Freshness bound: price may be up to 60s old (owner: catalog team)

| Layer | Policy | Key / Vary | Invalidation |
|---|---|---|---|
| Browser | max-age=0, revalidate with ETag | URL | n/a |
| CDN | s-maxage=60, stale-while-revalidate=60, stale-if-error=3600 | URL + Accept-Language; tracking params stripped | purge tag product-{id} on product.updated |
| App cache | TTL 300s with 10% jitter | v3:product:{id}:locale:{locale} | delete on write; TTL backstop |

Header: Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=60, stale-if-error=3600
Vary: Accept-Language, Accept-Encoding
Stampede control: single-flight per key in the app cache
Outage behavior: serve stale up to 1 hour, then 503
Never cached: /api/products/{id}/cost (internal margin data) -> no-store
Blocking unknown: the nightly ERP import writes prices directly to the database and emits no event; until it does, worst-case staleness is 300s, not 60s.
Verification: the six cases from step 8, with isolation tested across two tenants.
```
