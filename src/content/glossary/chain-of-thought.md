---
term: "Chain-of-Thought (CoT)"
description: "Chain-of-thought prompting has a model work through intermediate reasoning steps before answering — improving accuracy on multi-step problems."
date: 2026-06-11
topics: ["workflow-prompting"]
tags: ["chain-of-thought", "prompting", "reasoning", "llm"]
related: ["prompting-techniques-2026", "reasoning-model", "few-shot-prompting", "prompt-patterns"]
faq:
  - q: "Does 'think step by step' still help on modern models?"
    a: "Less than it used to, and sometimes not at all. Reasoning models think internally by default, so an explicit CoT instruction is often redundant — and can add latency without accuracy. CoT prompting still earns its keep on non-reasoning models and on tasks where you want the steps visible for auditing."
  - q: "Is chain-of-thought the same as a reasoning model's thinking?"
    a: "Same idea, different layer. CoT is a prompting technique — you ask the model to externalize steps in its answer. Reasoning models bake it in: they're trained to generate internal thinking tokens before responding, no prompt trick required. The technique became the architecture."
---

**Chain-of-thought (CoT) is the technique of having a language model produce intermediate reasoning steps before its final answer — decomposing a problem in writing instead of jumping to a conclusion.**

It works because generation is sequential: each reasoning token the model writes becomes context for the next, effectively giving the model scratch space. On arithmetic, logic, and multi-step planning, eliciting steps ("think step by step", or [few-shot examples](/glossary/few-shot-prompting) that demonstrate worked reasoning) historically delivered large accuracy gains.

Its 2026 status is nuanced: CoT *prompting* became less necessary as [reasoning models](/glossary/reasoning-model) internalized the behavior — they generate thinking tokens natively, and redundant "think step by step" instructions can just add cost. The technique still matters on non-reasoning tiers, in [LLM-as-judge](/glossary/llm-as-judge) rubrics where visible reasoning aids auditability, and as the conceptual ancestor of both branching methods like [Tree of Thoughts](/glossary/tree-of-thoughts) and the reasoning-model era. When to reach for explicit CoT versus structure versus examples is mapped in [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026).
