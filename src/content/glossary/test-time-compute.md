---
term: "Test-Time Compute"
description: "Test-time compute is spending more computation at inference — longer reasoning, sampling, or search — to improve answers without retraining the model."
summary: "Test-time compute is a scaling axis separate from training: the weights stay fixed and the model is given more room to work when it answers, through longer reasoning, sampling many candidates, or search. It is tunable per query, so you buy accuracy on demand, but returns diminish and every token costs."
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
topics: ["data-ml"]
audience: ["ai-engineers"]
tags: ["inference", "scaling", "reasoning", "compute"]
related: ["glossary:reasoning-model", "glossary:chain-of-thought", "glossary:extended-thinking", "glossary:tree-of-thoughts"]
faq:
  - q: "How is test-time compute different from training-time scaling?"
    a: "Training-time scaling makes a model smarter by using more data and compute to set its weights once, up front. Test-time compute leaves the weights fixed and instead spends more effort per query at inference. It's a separate scaling axis: a fixed model can produce better answers simply by being allowed to think, sample, or search more."
  - q: "What are common ways to spend test-time compute?"
    a: "The main techniques are longer chains of reasoning, sampling many candidate answers and picking the best (such as majority vote or best-of-N), and explicit search over solution paths. Reasoning models bundle this into their generation. All of them cost more tokens and latency per query, so you trade speed and money for accuracy."
  - q: "How do I control test-time compute through an API?"
    a: "Through a per-request setting. OpenAI's reasoning models accept a reasoning.effort value, with the supported levels depending on the model, and Anthropic's manual extended thinking accepts a budget_tokens cap on reasoning tokens, which has to stay below max_tokens. Outside the model you control it yourself: the number of samples in a best-of-N or self-consistency loop is a compute budget too."
---

**Test-time compute is the strategy of spending more computation at inference time — generating longer reasoning, sampling many candidate answers, or searching over solutions — to get better results from a fixed model without retraining it.**

It's the scaling axis behind [reasoning models](/glossary/reasoning-model). For years, gains came almost entirely from training larger models on more data; test-time compute showed that a model can also improve simply by being given more room to work at the moment it answers. OpenAI's o1, announced on September 12, 2024, was the first widely used model sold on that idea: OpenAI described it as trained "to spend more time thinking through problems before they respond."

The dial now sits in the API. OpenAI's reasoning models take a `reasoning.effort` setting, and Anthropic's manual [extended thinking](/glossary/extended-thinking) takes `thinking: {type: "enabled", budget_tokens: N}`, a cap on reasoning tokens for that request. You can also spend the compute outside the model. Self-consistency (Wang et al., 2022) samples several [chain-of-thought](/glossary/chain-of-thought) answers and keeps the most common one: ask a hard arithmetic question five times, get 42, 42, 17, 42 and 36, and return 42, at five times the token cost. [Tree of thoughts](/glossary/tree-of-thoughts) goes further and searches over partial solutions.

A reasoning model is one product of this idea, a model trained to use a thinking budget internally. Test-time compute is the wider term: it also covers sampling and search wrapped around any model, reasoning-trained or not.

This matters because it's tunable per query: hard problems get more compute, easy ones get less, and you can buy accuracy on demand rather than retraining. The tradeoff is cost and latency — every extra reasoning token or sampled candidate is paid for at inference, and returns diminish past a point. Beyond some budget, more thinking stops helping and just slows the response, so test-time compute is a dial to set against task difficulty, not a constant to crank.
