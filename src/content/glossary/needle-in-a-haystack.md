---
term: "Needle in a Haystack"
seoTitle: "What Is the Needle-in-a-Haystack Test?"
description: "Needle in a haystack is a long-context eval that hides a fact in filler text and tests whether the model can retrieve it at varying depths and lengths."
summary: "A needle-in-a-haystack test plants one fact inside a large body of filler and sweeps two dimensions, the needle's depth and the total input length, producing a grid of where retrieval holds and where it breaks. It turns a long-context claim into a measured number, but it only tests recall of an exact string."
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
topics: ["llm-evals"]
audience: ["ai-engineers"]
tags: ["eval", "long-context", "retrieval", "benchmark"]
related: ["glossary:context-window", "glossary:context-rot", "glossary:eval-dataset", "glossary:rag"]
faq:
  - q: "What does a needle-in-a-haystack test actually measure?"
    a: "It measures whether a model can reliably find and use a specific fact placed somewhere inside a long input. By sweeping the needle's position (depth) and the total input length, it produces a grid showing where retrieval holds up and where it breaks down. A perfect score is full retrieval at every depth and length."
  - q: "Why do models fail in the middle of long contexts?"
    a: "This is the 'lost in the middle' effect: models tend to attend most strongly to the beginning and end of a long input and weight the middle less, so a fact buried mid-context is more likely missed. The needle test exposes exactly this weakness, which is why it became a standard check for long-context claims."
  - q: "How do I run a needle-in-a-haystack test myself?"
    a: "Greg Kamradt's open-source LLMTest_NeedleInAHaystack project is the usual starting point. Install it with pip install needlehaystack, then run niah demo, which sweeps two context lengths by three depths against a model and writes results.jsonl. Custom runs use YAML files that set the context lengths, depth percentages, task type, and model."
---

**Needle in a haystack is a long-[context window](/glossary/context-window) evaluation that embeds a specific fact (the "needle") inside a large body of unrelated filler text (the "haystack") and tests whether the model can retrieve it.**

The test systematically varies two dimensions: the *depth* at which the needle sits within the input and the total *length* of the context. Running every combination produces a grid that reveals not just whether a model can use its full window, but where retrieval degrades — most famously the "lost in the middle" weakness described by Liu et al. in July 2023, where performance is highest when the relevant information sits at the beginning or end of the input and drops when it is in the middle.

The best-known implementation is Greg Kamradt's open-source `LLMTest_NeedleInAHaystack`. After `pip install needlehaystack`, its `niah` command sweeps context length against needle depth, scores each cell, and writes one result row per cell to a JSONL file; the bundled haystack is a set of Paul Graham essays. The current version adds harder tasks than a single planted sentence: multi-fact recall and UUID chains, where the model has to follow several hops spread through the context.

It matters because a model advertising a huge context window may not use all of it equally well, and this eval turns that claim into a measurable [eval dataset](/glossary/eval-dataset) rather than a marketing number. The caveat is that finding a single planted fact is an easy task — it tests recall of an exact string, not reasoning across scattered evidence or synthesizing many passages, so strong needle scores don't guarantee strong real-world long-context performance.

That is also how it differs from [context rot](/glossary/context-rot), the broader finding that recall and reasoning degrade as input grows: a needle test probes one narrow slice of that degradation. For how this informs the retrieval-versus-long-context choice, see [RAG vs long context](/guides/concepts/rag-vs-long-context).
