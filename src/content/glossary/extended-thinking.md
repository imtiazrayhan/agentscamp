---
term: "Extended Thinking"
description: "Extended thinking is the reasoning tokens a model generates before its final answer, trading latency and cost for higher accuracy on hard problems."
date: 2026-06-17
topics: ["workflow-prompting"]
tags: ["reasoning", "thinking", "tokens", "accuracy"]
related: ["reasoning-model", "chain-of-thought", "llm-token", "test-time-compute", "context-engineering"]
faq:
  - q: "What's the difference between extended thinking and chain-of-thought prompting?"
    a: "Chain-of-thought is a prompting technique you trigger with instructions like 'think step by step.' Extended thinking is a built-in model capability: the model produces a dedicated stream of reasoning tokens before answering, often with a budget you control. The mechanism overlaps, but extended thinking is native rather than coaxed."
  - q: "When is extended thinking worth the extra cost?"
    a: "Use it for math, multi-step planning, complex coding, and analysis where one wrong step derails the answer. Skip it for simple lookups, formatting, or chat — the latency and token cost buy nothing there. Tune the thinking budget to the difficulty of the task rather than maxing it out by default."
---

**Extended thinking is a model's ability to generate a stream of internal reasoning [tokens](/glossary/llm-token) — sometimes called thinking or reasoning tokens — before committing to a final answer, spending more computation to solve harder problems.**

It's the defining feature of [reasoning models](/glossary/reasoning-model): Claude's extended thinking and OpenAI's o-series both work this way, producing a separate block of step-by-step reasoning that the model uses to check its own work before responding. This is the same idea as [chain-of-thought](/glossary/chain-of-thought), but native to the model rather than prompted — and typically you set a *thinking budget* (a token cap) that scales how long the model deliberates.

The tradeoff is direct: more thinking means more tokens, higher latency, and higher cost, in exchange for measurably better accuracy on math, planning, and complex coding. The practical caveat is that thinking isn't free quality — on simple tasks it adds delay and expense for no gain, and an overlarge budget can let a model overthink a question it would have nailed instantly. Match the budget to the problem.
