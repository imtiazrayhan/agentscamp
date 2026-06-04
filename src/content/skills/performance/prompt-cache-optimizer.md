---
name: "prompt-cache-optimizer"
description: "Restructure an LLM call to maximize prompt-cache hit rate and add response/semantic caching — move the stable prefix (system prompt, instructions, few-shot, context) to the front and variable input to the end, set cache breakpoints, and measure the hit rate and savings. Use when repeated calls share large common context and token cost or latency is too high."
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["devops-infra"]
related: ["llm-cost-latency-engineering", "llm-gateways-compared", "llm-cost-optimizer", "set-perf-budget", "prompt-optimizer"]
featured: false
summary: "Prompt caching bills a repeated prefix at a discount and serves it faster — but only if the prefix is stable and comes first. This skill reorders a prompt so the static part (system, instructions, few-shot, context) leads as the cacheable prefix and variable input trails it, sets cache breakpoints where supported, adds response/semantic caching, and verifies the hit rate and cost/latency drop."
---

Most providers cache the **longest common prefix** of your prompt: send the same opening tokens again within the cache window and you pay a fraction of the price and get a faster first token. The catch is that caching is prefix-based and order-sensitive — one varying token near the top busts the whole cache. This skill restructures calls so the cache actually hits, and adds higher-level caching where it pays.

## When to use this skill

- Many calls share a large, stable chunk — a long system prompt, a fixed instruction block, few-shot examples, a retrieved document, or a tool schema.
- Token cost is dominated by **input** tokens repeated across calls.
- Time-to-first-token is too slow on prompts with a big static preamble.
- You have repeated or near-duplicate queries that could be served from a response cache instead of the model.

## Instructions

1. **Confirm how the target provider caches.** Check whether it's automatic prefix caching or requires explicit cache breakpoints/control, the minimum cacheable length, the cache TTL/window, and the discount on cached tokens. The strategy follows from the mechanism — don't assume one provider's rules apply to another.
2. **Put the stable prefix first.** Order the prompt **static → dynamic**: system prompt, durable instructions, few-shot examples, tool definitions, and long shared context at the top; the per-request user input and anything that changes every call at the **end**. The goal is the longest possible identical prefix across calls.
3. **Hunt for cache-busters near the top.** A timestamp, a request ID, a per-user name, or shuffled few-shot order in the preamble invalidates the prefix for every call. Move all of it below the cacheable block, or remove it.
4. **Set cache breakpoints where supported.** On providers with explicit cache control, mark the end of the stable block so the prefix up to that point is cached; keep the marked prefix byte-for-byte identical between requests.
5. **Add response/semantic caching above the model.** For exact-repeat queries, cache the full response keyed on the normalized request. For near-duplicate queries (FAQs, classification), consider semantic caching at the gateway ([Portkey](/tools/portkey), [Helicone](/tools/helicone)) — with a TTL and invalidation that match how often the underlying answer changes.
6. **Measure the hit rate and the savings.** Instrument cached vs. uncached tokens (or cache-hit count) and compare cost and time-to-first-token before and after. A cache you can't see the hit rate of is a cache you can't trust — report the real numbers, not the theoretical discount.

> [!WARNING]
> Don't cache what shouldn't be reused. Response/semantic caches can serve a stale or wrong answer for an input that *looks* similar but isn't (different user, different entitlements, time-sensitive data). Scope the cache key correctly and set a TTL that matches volatility — a cache bug is a correctness bug, not just a cost one.

> [!NOTE]
> Prompt caching changes economics but not quality: the model sees the same tokens, just cheaper and faster. Pair this with model right-sizing and prompt trimming (the [llm-cost-optimizer](/agents/data-ai/llm-cost-optimizer)) for the full cost win, and see [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering) for the broader playbook.

## Output

The restructured prompt (static prefix first, variable input last, cache breakpoints set where supported), any response/semantic caching added with its key and TTL, and a before/after measurement of cache-hit rate, input-token cost, and time-to-first-token — so the change is proven, not assumed.
