---
term: "Needle in a Haystack"
description: "Needle in a haystack is a long-context eval that hides a fact in filler text and tests whether the model can retrieve it at varying depths and lengths."
date: 2026-06-17
topics: ["llm-evals"]
tags: ["eval", "long-context", "retrieval", "benchmark"]
related: ["glossary:context-window", "glossary:eval-dataset", "glossary:rag"]
faq:
  - q: "What does a needle-in-a-haystack test actually measure?"
    a: "It measures whether a model can reliably find and use a specific fact placed somewhere inside a long input. By sweeping the needle's position (depth) and the total input length, it produces a grid showing where retrieval holds up and where it breaks down. A perfect score is full retrieval at every depth and length."
  - q: "Why do models fail in the middle of long contexts?"
    a: "This is the 'lost in the middle' effect: models tend to attend most strongly to the beginning and end of a long input and weight the middle less, so a fact buried mid-context is more likely missed. The needle test exposes exactly this weakness, which is why it became a standard check for long-context claims."
---

**Needle in a haystack is a long-[context window](/glossary/context-window) evaluation that embeds a specific fact (the "needle") inside a large body of unrelated filler text (the "haystack") and tests whether the model can retrieve it.**

The test systematically varies two dimensions: the *depth* at which the needle sits within the input and the total *length* of the context. Running every combination produces a grid that reveals not just whether a model can use its full window, but where retrieval degrades — most famously the "lost in the middle" weakness, where facts placed mid-context are recalled far less reliably than those near the start or end.

It matters because a model advertising a huge context window may not use all of it equally well, and this eval turns that claim into a measurable [eval dataset](/glossary/eval-dataset) rather than a marketing number. The caveat is that finding a single planted fact is an easy task — it tests recall of an exact string, not reasoning across scattered evidence or synthesizing many passages, so strong needle scores don't guarantee strong real-world long-context performance. For how this informs the retrieval-versus-long-context choice, see [RAG vs long context](/guides/concepts/rag-vs-long-context).
