---
term: "Test-Time Compute"
description: "Test-time compute is spending more computation at inference — longer reasoning, sampling, or search — to improve answers without retraining the model."
date: 2026-06-17
topics: ["data-ml"]
tags: ["inference", "scaling", "reasoning", "compute"]
related: ["glossary:reasoning-model", "glossary:chain-of-thought", "glossary:extended-thinking"]
faq:
  - q: "How is test-time compute different from training-time scaling?"
    a: "Training-time scaling makes a model smarter by using more data and compute to set its weights once, up front. Test-time compute leaves the weights fixed and instead spends more effort per query at inference. It's a separate scaling axis: a fixed model can produce better answers simply by being allowed to think, sample, or search more."
  - q: "What are common ways to spend test-time compute?"
    a: "The main techniques are longer chains of reasoning, sampling many candidate answers and picking the best (such as majority vote or best-of-N), and explicit search over solution paths. Reasoning models bundle this into their generation. All of them cost more tokens and latency per query, so you trade speed and money for accuracy."
---

**Test-time compute is the strategy of spending more computation at inference time — generating longer reasoning, sampling many candidate answers, or searching over solutions — to get better results from a fixed model without retraining it.**

It's the scaling axis behind [reasoning models](/glossary/reasoning-model). For years, gains came almost entirely from training larger models on more data; test-time compute showed that a model can also improve simply by being given more room to work at the moment it answers. In practice that means extended [chain-of-thought](/glossary/chain-of-thought) reasoning (see [extended thinking](/glossary/extended-thinking)), drawing multiple samples and aggregating them, or running a search procedure over candidate steps.

This matters because it's tunable per query: hard problems get more compute, easy ones get less, and you can buy accuracy on demand rather than retraining. The tradeoff is cost and latency — every extra reasoning token or sampled candidate is paid for at inference, and returns diminish past a point. Beyond some budget, more thinking stops helping and just slows the response, so test-time compute is a dial to set against task difficulty, not a constant to crank.
