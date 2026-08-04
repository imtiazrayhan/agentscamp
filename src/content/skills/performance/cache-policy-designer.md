---
name: "cache-policy-designer"
title: "Cache Policy Designer"
description: "Design a cache policy from data ownership, freshness, privacy, invalidation, and failure requirements across browser, CDN, reverse-proxy, application, and data caches. Use when adding caching, debugging stale responses, reviewing Cache-Control behavior, reducing origin load, or deciding whether a value can be cached safely at all."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "orange"
date: 2026-08-04
topics: ["devops-infra", "architecture"]
related: ["best-claude-skills-for-performance", "web-vitals-optimizer", "cold-start-optimizer", "load-test-designer", "semantic-cache-designer", "api-architect"]
featured: true
summary: "Designs cache behavior per object and layer by identifying ownership, variation keys, freshness bounds, invalidation events, privacy constraints, stampede protection, stale-on-failure behavior, and observability. It produces explicit headers or key rules plus correctness tests rather than applying one TTL everywhere."
faq:
  - q: "What is the hardest part of caching?"
    a: "Correct invalidation and variation. A fast cache that serves another user's data or an obsolete business state is a correctness incident, so policy starts with ownership and change events before TTL."
  - q: "Should authenticated responses ever be cached?"
    a: "Only with an explicit private or identity-partitioned policy and verified variation keys. Shared caches must not store personalized responses unless the design proves tenant and user isolation."
---

Design caching as a correctness contract with a performance benefit.

## Workflow

1. **Inventory the cacheable object.** Name the response or value, authoritative source, readers, writers, sensitivity, size, cost to recompute, and consequence of serving it stale.
2. **Map every cache layer.** Trace browser, service worker, CDN, gateway, reverse proxy, framework, application, ORM, and database caches. Record which layer currently owns freshness and invalidation.
3. **Define identity and variation.** Specify the complete cache key: resource, tenant, user or authorization class, locale, encoding, version, query shape, and any header that changes representation. Remove unnecessary variants but never collapse security boundaries.
4. **Choose freshness semantics.** Set max age from the business freshness bound, not a convenient round number. Decide whether revalidation, `stale-while-revalidate`, or `stale-if-error` preserves acceptable behavior.
5. **Design invalidation.** Identify every write or event that changes the object. Choose purge, versioned keys, tag invalidation, write-through, or bounded expiration, and state how missed events heal.
6. **Control concurrency.** Prevent cold-key stampedes with request coalescing, locks with bounded leases, probabilistic early refresh, or jitter. Define behavior when the origin is slow or unavailable.
7. **Specify privacy and failure rules.** Mark values that must never enter a shared cache. Define fail-open versus fail-closed, negative caching, error caching, and the maximum stale age during outages.
8. **Verify and observe.** Test hit, miss, revalidation, invalidation, authorization variation, purge failure, origin failure, and concurrent expiry. Measure hit ratio by status, age, evictions, origin savings, stale serves, and key cardinality.

> [!WARNING]
> Do not add `public` caching or omit authorization from a key merely to improve hit rate. Cross-user cache leakage is a security failure, not a tuning tradeoff.

## Output

Return a layer-by-layer policy with key dimensions, freshness directives, invalidation events, stampede controls, outage behavior, privacy exclusions, implementation locations, verification cases, and metrics. Call out unknown writers or variation inputs that block safe caching.
