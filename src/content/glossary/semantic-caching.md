---
term: "Semantic Caching"
description: "Semantic caching reuses LLM responses keyed by meaning rather than exact text, matching queries by embedding similarity to cut cost and latency."
date: 2026-06-17
topics: ["llm-app-dev"]
tags: ["caching", "embeddings", "latency", "cost"]
related: ["embedding", "semantic-search", "prompt-caching"]
faq:
  - q: "How is semantic caching different from prompt caching?"
    a: "They solve different problems. Prompt caching (a provider feature) caches a long prompt prefix so repeated requests reprocess it cheaply — it still calls the model. Semantic caching sits in your application and returns a stored answer with no model call at all when a new query means roughly the same thing as a past one. You can use both: prompt caching to cheapen the calls you make, semantic caching to skip calls entirely."
  - q: "What is the main risk?"
    a: "False cache hits. Two queries can be close in embedding space but need different answers — 'flights to Paris' versus 'flights from Paris.' Set the similarity threshold too loosely and you serve confidently wrong cached responses. Tuning that threshold, and excluding queries where freshness or precision matters, is the core engineering work."
---

**Semantic caching stores LLM responses keyed by the *meaning* of a query — using [embedding](/glossary/embedding) similarity rather than exact string match — so a new question that means roughly the same as a past one reuses the cached answer instead of calling the model.**

A normal cache only hits on identical text, which almost never happens with natural-language prompts. Semantic caching embeds the incoming query and runs a [semantic search](/glossary/semantic-search) against past queries; if the closest match exceeds a similarity threshold, it returns the stored response. That skips the model call entirely, cutting both cost and latency to near zero on repeated or paraphrased questions — valuable for FAQ-style traffic and popular prompts.

The risk is the threshold. Set it too loose and semantically *near* but materially *different* queries collide, serving a confidently wrong cached answer. This is distinct from [prompt caching](/glossary/prompt-caching), which caches the prompt prefix at the provider and still invokes the model — semantic caching avoids the call altogether. Practical deployments tune the threshold carefully, scope the cache per user or context where needed, and exclude queries where freshness or exactness is non-negotiable.
