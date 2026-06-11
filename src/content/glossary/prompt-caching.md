---
term: "Prompt Caching"
description: "Prompt caching reuses the computed state of a repeated prompt prefix across requests — dramatically cutting cost and time-to-first-token for stable context."
date: 2026-06-11
topics: ["llm-app-dev"]
tags: ["prompt-caching", "cost", "latency", "llm"]
related: ["prompt-cache-optimizer", "llm-cost-latency-engineering", "kv-cache", "context-window", "system-prompt"]
faq:
  - q: "What actually gets cached in prompt caching?"
    a: "The model's internal computed state (the KV cache) for a prefix of your prompt — not the text, and not the response. When the next request starts with the exact same prefix, the provider skips recomputing it and starts where the cache ends. Cached input tokens are billed at a steep discount and processed near-instantly."
  - q: "Why does prompt structure matter for cache hits?"
    a: "Because caching is prefix-based and exact: everything before the first changed byte is cacheable, everything after is not. Put the stable parts first — system prompt, tool definitions, reference docs — and the variable parts (user question, latest messages) last. One timestamp or shuffled field at the top invalidates everything beneath it."
---

**Prompt caching is reusing the computation for a repeated prompt prefix across API requests: the provider stores the model's processed state for the stable beginning of your prompt, so subsequent requests pay full price only for what's new.**

It exploits how [inference](/glossary/inference) works — processing a prompt builds an internal [KV cache](/glossary/kv-cache); if the next request begins with an identical prefix, that state is reusable. Providers expose this with large discounts on cached input tokens and sharply reduced time-to-first-token. For applications with heavy stable context — long [system prompts](/glossary/system-prompt), tool schemas, agent scaffolding, documents queried repeatedly — it's routinely the single biggest cost lever available, which is why agentic tools like Claude Code lean on it constantly.

The engineering is all *prefix discipline*: stable content first, volatile content last, byte-exact consistency (no timestamps, no reordered JSON keys upstream of the cache point), and TTL awareness so steady traffic keeps caches warm. Restructuring a call for maximum hit rate is precisely what the [prompt-cache-optimizer](/skills/performance/prompt-cache-optimizer) skill does, inside the broader [cost and latency playbook](/guides/advanced/llm-cost-latency-engineering).
