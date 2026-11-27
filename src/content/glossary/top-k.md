---
term: "Top-k Sampling"
description: "Top-k sampling restricts an LLM's next-token choice to the k most probable tokens before sampling; lower k is more deterministic, higher k more diverse."
summary: "Top-k keeps only the k highest-probability next tokens, renormalizes, and samples from that set, so improbable tokens are excluded before any randomness applies. A small k is safer and more deterministic; a large one admits variety. A fixed k ignores how confident the model is, which is why many prefer top-p."
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
topics: ["workflow-prompting"]
audience: ["ai-engineers"]
tags: ["sampling", "decoding", "top-k", "generation"]
related: ["glossary:temperature", "glossary:top-p", "glossary:token-streaming"]
faq:
  - q: "How does top-k differ from top-p?"
    a: "Top-k always keeps a fixed number of candidates (the k most probable), regardless of how confident the model is. Top-p (nucleus sampling) keeps a variable number — the smallest set whose probabilities sum to p — so it widens when the model is uncertain and narrows when it's confident. Top-p adapts to the distribution; top-k doesn't, which is why top-p is often preferred."
  - q: "Should I tune top-k or temperature?"
    a: "They do different jobs and are usually set together. Top-k truncates the candidate pool; temperature reshapes the probabilities within whatever pool remains. For most tasks, leaving top-k at a default and adjusting temperature is enough — reach for top-k mainly to hard-cap rare, off-distribution tokens."
  - q: "What is a typical top-k value?"
    a: "It depends on the runtime. Ollama documents a default top_k of 40 and suggests about 10 for more conservative output and about 100 for more diverse output. A value of 1 turns sampling into greedy decoding, where the single most likely token is always chosen."
---

**Top-k sampling is a decoding setting that limits the model's next-token choice to the k most probable candidates, then samples from that truncated set — so improbable tokens are excluded before any randomness is applied.**

At each step the model produces a probability over its whole vocabulary. Top-k keeps only the k highest-ranked tokens and renormalizes, discarding the long tail. Suppose the next-token probabilities are "the" 0.40, "a" 0.25, "this" 0.15, "one" 0.10, with the last 0.10 spread over thousands of other tokens. With k = 3 only the first three survive, and dividing each by their 0.80 total gives 0.50, 0.31, and 0.19. The model then samples from those three, so "one" and the whole tail can no longer appear. With k = 1 it always takes "the", which is greedy decoding.

A small k makes generation safer and more deterministic by ruling out unlikely words; a large k admits more variety and surprise. Not every API exposes the setting, but local runtimes usually do: [Ollama](/tools/ollama)'s documented default is `top_k` 40 alongside `top_p` 0.9. It's one of the standard knobs next to [temperature](/glossary/temperature), which reshapes the probabilities.

The nearest neighbour is [top-p](/glossary/top-p) (nucleus sampling). Top-k keeps a fixed number of tokens; top-p keeps however many it takes to reach a cumulative probability, so its cutoff moves with the model's confidence.

In practice these combine: a typical pipeline applies top-k or top-p to truncate the candidate pool, then temperature to control how sharply it samples from what remains. The caveat is that a fixed k ignores how confident the model is — it keeps k candidates whether the distribution is sharp or flat — which is why many setups favor top-p, and why these parameters affect each token emitted during [streaming](/glossary/token-streaming).
