---
term: "Temperature"
description: "Temperature controls how random an LLM's token choices are: low values make output focused and repeatable, high values make it varied and creative."
date: 2026-06-11
topics: ["llm-app-dev"]
tags: ["temperature", "sampling", "llm", "parameters"]
related: ["top-p", "structured-output", "llm-token", "prompting-techniques-2026"]
faq:
  - q: "What temperature should I use?"
    a: "Match it to the task's tolerance for variation: at or near 0 for extraction, classification, code, and anything tests or parsers consume; moderate (~0.5–0.8) for general assistance; higher (~0.8–1.2) for brainstorming and creative variety. When in doubt, lower it — most production failures from sampling are too-much-randomness, not too-little."
  - q: "Does temperature 0 make outputs deterministic?"
    a: "Mostly but not perfectly. It selects the highest-probability token (greedy decoding), which removes sampling randomness — but ties, floating-point nondeterminism, and provider-side batching can still produce occasional variation. Treat temperature 0 as 'maximally consistent', not a cryptographic guarantee."
---

**Temperature is the sampling parameter that scales how confidently an LLM commits to its top token choices: near 0, it almost always picks the most probable next token; higher, it spreads probability across alternatives and output gets more varied.**

Mechanically, the model produces a probability distribution over its vocabulary for each [token](/glossary/llm-token); temperature divides the logits before sampling. Low temperature sharpens the distribution (focused, repeatable, sometimes repetitive), high temperature flattens it (diverse, surprising, occasionally off the rails). It pairs with [top-p](/glossary/top-p), which truncates the candidate pool rather than reshaping it — common guidance is to tune one, not both.

The practical defaults: deterministic-leaning for anything machine-consumed ([structured output](/glossary/structured-output), code, extraction), moderate for chat, higher only when variety is the point. And note the era's caveat: [reasoning models](/glossary/reasoning-model) often fix or constrain sampling parameters during thinking — check your provider's docs before assuming the dial does what it did in 2023.
