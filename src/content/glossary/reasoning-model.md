---
term: "Reasoning Model"
description: "A reasoning model is an LLM trained to think before answering — generating internal reasoning tokens it can spend adaptively on hard problems."
date: 2026-06-11
topics: ["llm-app-dev"]
tags: ["reasoning", "thinking", "llm", "models"]
related: ["glossary:chain-of-thought", "guide:choosing-the-right-model", "glossary:inference", "guide:llm-cost-latency-engineering"]
faq:
  - q: "How is a reasoning model different from a regular LLM?"
    a: "Training and inference budget. A standard model answers directly; a reasoning model first generates thinking tokens — exploring, checking, revising — then answers. It was trained (largely via reinforcement learning) for that deliberation to actually improve outcomes, and the thinking budget can scale with problem difficulty."
  - q: "When is a reasoning model worth the extra cost and latency?"
    a: "When the problem is genuinely multi-step and a wrong answer is expensive: hard debugging, architecture, math-flavored logic, intricate planning. For extraction, classification, and routine generation, thinking tokens are overhead — a fast standard tier does the job cheaper. Match the dial to the task, not the prestige."
---

**A reasoning model is a language model trained to deliberate before responding — it generates internal "thinking" tokens that work the problem, then produces the answer, spending more thinking on harder problems.**

The line of models that began in late 2024 turned [chain-of-thought](/glossary/chain-of-thought) from a prompting trick into an architecture: reinforcement learning taught models that extended deliberation should change conclusions, not just narrate them. The practical consequence is **test-time compute as a dial** — the same model can answer instantly or think for thousands of tokens, trading latency and cost for reliability on hard problems. Modern frontier models blend the modes, with thinking budgets that adapt or can be set explicitly.

For builders the implications are concrete: thinking tokens are billed [output tokens](/glossary/llm-token), so reasoning tiers change your [cost envelope](/guides/advanced/llm-cost-latency-engineering); prompts written for older models ("think step by step") may be redundant; and tier selection — when deliberation pays versus when it's overhead — becomes a real engineering decision, the same one [Choosing the Right Model](/guides/getting-started/choosing-the-right-model) walks through for Claude's tiers.
