---
name: "semantic-cache-designer"
description: "Design a semantic cache for LLM responses — serve a cached answer when a new query is similar enough to a past one — to cut cost and latency on repetitive traffic, with the similarity threshold calibrated on real query pairs and a cache key that prevents cross-user/model leaks. Use when an LLM app sees many near-duplicate prompts (FAQs, support, search), when token spend on repetitive queries is high, or when latency on common questions matters."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Semantic Cache Designer"
date: 2026-06-17
topics: ["llm-app-dev"]
related: ["skill:embedding-set-inspector", "skill:prompt-cache-optimizer", "skill:chunking-strategy-optimizer"]
featured: false
summary: "A semantic cache reuses a past LLM answer when a new query is similar enough — saving tokens and latency on repetitive prompts. The whole design hinges on the similarity threshold and a complete cache key. This skill calibrates the threshold on real query pairs, builds a key that won't leak answers across users or models, and tracks hit quality, not just hit rate."
---

A semantic cache turns "I've answered this before" into a skipped LLM call: embed the incoming query, find the nearest past query, and if it's close enough, return that cached answer. Done right it slashes cost and tail latency on FAQ/support/search traffic. Done wrong it confidently returns a *different* question's answer, or leaks one user's answer to another. This skill makes the two load-bearing decisions — the similarity threshold and the cache key — explicit and calibrated, instead of trusting a vibe-picked cosine cutoff.

## When to use this skill

- An LLM app gets many near-duplicate prompts — FAQs, support tickets, product search, "explain X" — and most calls re-derive the same answer.
- Token spend is dominated by repetitive traffic and you want to stop paying for the same completion twice.
- Latency on common questions matters (p50/p95) and a cache hit would return in milliseconds instead of seconds.
- You're about to bolt a `GPTCache`-style layer onto a RAG or chat app and need the threshold/key/TTL decided before it ships.

## Instructions

1. **Pin down what a "correct hit" means before touching code.** A hit is only correct if the cached answer would still be the *right* answer for the new query. Write down the inputs that change the correct answer beyond the query text — user/tenant, locale/language, the retrieved-context version (for RAG), the model + version, system-prompt version, and any personalization. This list becomes the cache key in step 5; everything else flows from it.
2. **Design the lookup.** Embed the incoming query with the *same* model and input-type used for the stored queries (a query/document asymmetry mismatch quietly wrecks similarity — see `embedding-set-inspector`). Look up the single nearest stored entry by vector similarity (cosine on normalized vectors), scoped to the exact key from step 5. Return the cached answer only if `similarity >= threshold`; otherwise it's a miss → call the LLM and write the new entry.
3. **Calibrate the threshold on real query pairs — do not pick it from a blog post.** Pull ~100-300 query pairs from production logs and label each pair as "same intent / cached answer is correct" or "different intent / would be wrong." Sweep the threshold (e.g. 0.80→0.97) and at each value compute false-hit rate (returned a wrong answer) and false-miss rate (missed a valid reuse). Pick the threshold from this curve, not by feel.
4. **Bias toward false-miss when a wrong answer is costly.** A false miss costs one extra LLM call; a false hit ships a confidently wrong answer to a user. For support/medical/financial/legal surfaces, choose the stricter threshold even if hit rate drops — a missed hit is cheap, a wrong hit is a trust incident.
5. **Build the full cache key — never key on query text alone.** Namespace the cache (or the embedding lookup) by every input from step 1: `tenant + locale + model@version + prompt@version + context@version`. Personalized or per-user answers must include the user/tenant in the key. Omitting any of these is how you serve user A's answer to user B, or a `claude-opus-4` answer out of a `claude-haiku` cache after a model swap.
6. **Set TTL and invalidation for answers that go stale.** Static facts can live long; RAG answers over changing data must expire (or be invalidated) when the underlying documents change — tag entries with the `context@version`/document IDs they depended on and evict on update. Time-sensitive answers ("current status", "today's price") get a short TTL or land in the no-cache list (step 7).
7. **Decide explicitly what NOT to cache.** Exclude personalized/account-specific answers that lack a per-user key, time-sensitive or real-time responses, stateful/multi-turn replies that depend on conversation history, and anything with side effects (tool calls, writes). Caching these is worse than no cache. Write the no-cache predicate down as a rule, not a hope.
8. **Measure hit *quality*, not just hit rate.** Track cache hit rate, token/cost saved, and latency delta — but also sample a slice of live hits (e.g. 1-2%) and judge whether the cached answer was actually right for the new query (LLM-as-judge or human review). Report false-hit rate as a first-class metric. A 60% hit rate that's 10% wrong is worse than a 35% hit rate that's clean.

> [!WARNING]
> A too-loose threshold is the signature failure of semantic caching: "How do I cancel my subscription?" and "How do I cancel my *order*?" are highly similar in embedding space, so the cache serves a fluent, confident answer to the *wrong* question. The user can't tell it's a stale match. Always validate the threshold against labeled different-intent pairs, not just same-intent ones.

> [!WARNING]
> Omitting context/user/model from the cache key leaks answers across boundaries — across users (privacy incident), across locales (wrong language), or across model/prompt versions (you keep serving the old model's answers after a deploy). The key must change whenever the correct answer would change.

## Output

- **Lookup design** — embedding model + input-type, similarity metric, nearest-neighbor scoping, and the hit/miss decision rule.
- **Calibrated threshold** — the chosen value plus the false-hit / false-miss curve it came from and the labeled query-pair set used (and the false-miss bias rationale if applicable).
- **Full cache key** — the exact composite key (`tenant + locale + model@version + prompt@version + context@version + user`), with a note on which fields apply to this app.
- **TTL + invalidation + no-cache rules** — per-class TTLs, the document-version invalidation trigger for RAG entries, and the explicit no-cache predicate.
- **Metrics** — hit rate, token/cost saved, latency delta, and the sampled hit-quality / false-hit measurement to track in production.