---
term: "Top-p (Nucleus Sampling)"
description: "Top-p sampling restricts an LLM's next-token choices to the smallest set whose probabilities sum to p — cutting the long tail of unlikely tokens adaptively."
date: 2026-06-11
topics: ["llm-app-dev"]
tags: ["top-p", "sampling", "llm", "parameters"]
related: ["temperature", "llm-token", "structured-output"]
faq:
  - q: "What's the difference between top-p and temperature?"
    a: "Temperature reshapes the whole probability distribution (how bold the model is across all options); top-p truncates it (which options are even on the table — the smallest set summing to probability p). Temperature changes relative weights; top-p removes the tail. Standard advice: adjust one and leave the other at its default."
  - q: "Why 'nucleus' sampling?"
    a: "The candidate set it keeps — the smallest group of tokens whose combined probability reaches p — is called the nucleus. Its size adapts to the model's confidence: a near-certain next token yields a tiny nucleus, an open-ended continuation yields a large one. That adaptivity is its advantage over fixed top-k."
---

**Top-p (nucleus sampling) limits the model's next-token candidates to the smallest set whose cumulative probability reaches p — at p = 0.9, sampling happens only among tokens covering the top 90% of probability mass, and the unlikely tail is discarded.**

Its virtue over a fixed [top-k](/glossary/top-k) cutoff is adaptivity: when the model is confident, the nucleus may be two tokens; when many continuations are plausible, it widens automatically. That trims the failure mode of pure [temperature](/glossary/temperature) sampling — rare, incoherent tokens occasionally getting picked — while preserving variety where it's genuine.

In practice top-p is a set-and-forget parameter (defaults around 0.9–1.0), tuned downward when outputs wander, with temperature as the primary creativity dial. The same caveat applies as everywhere in sampling-land: machine-consumed output wants minimal randomness, and [reasoning models](/glossary/reasoning-model) may constrain these parameters — read the provider's current docs rather than cargo-culting 2023 settings.
