---
term: "Top-k Sampling"
description: "Top-k sampling restricts an LLM's next-token choice to the k most probable tokens before sampling; lower k is more deterministic, higher k more diverse."
date: 2026-06-17
topics: ["workflow-prompting"]
tags: ["sampling", "decoding", "top-k", "generation"]
related: ["glossary:temperature", "glossary:top-p", "glossary:token-streaming"]
faq:
  - q: "How does top-k differ from top-p?"
    a: "Top-k always keeps a fixed number of candidates (the k most probable), regardless of how confident the model is. Top-p (nucleus sampling) keeps a variable number — the smallest set whose probabilities sum to p — so it widens when the model is uncertain and narrows when it's confident. Top-p adapts to the distribution; top-k doesn't, which is why top-p is often preferred."
  - q: "Should I tune top-k or temperature?"
    a: "They do different jobs and are usually set together. Top-k truncates the candidate pool; temperature reshapes the probabilities within whatever pool remains. For most tasks, leaving top-k at a default and adjusting temperature is enough — reach for top-k mainly to hard-cap rare, off-distribution tokens."
---

**Top-k sampling is a decoding setting that limits the model's next-token choice to the k most probable candidates, then samples from that truncated set — so improbable tokens are excluded before any randomness is applied.**

At each step the model produces a probability over its whole vocabulary. Top-k keeps only the k highest-ranked tokens and renormalizes, discarding the long tail. A small k (say 5) makes generation safer and more deterministic by ruling out unlikely words; a large k admits more variety and surprise. It's one of the standard knobs alongside [temperature](/glossary/temperature), which reshapes the probabilities, and [top-p](/glossary/top-p) (nucleus sampling), which keeps a variable-size set instead of a fixed count.

In practice these combine: a typical pipeline applies top-k or top-p to truncate the candidate pool, then temperature to control how sharply it samples from what remains. The caveat is that a fixed k ignores how confident the model is — it keeps k candidates whether the distribution is sharp or flat — which is why many setups favor top-p, and why these parameters affect each token emitted during [streaming](/glossary/token-streaming).
