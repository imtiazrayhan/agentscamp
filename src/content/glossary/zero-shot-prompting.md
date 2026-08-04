---
term: "Zero-Shot Prompting"
description: "Zero-shot prompting asks a model to perform a task from instructions alone, with no examples — the default mode for capable modern LLMs."
date: 2026-06-11
topics: ["workflow-prompting"]
tags: ["zero-shot", "prompting", "instructions", "llm"]
related: ["glossary:few-shot-prompting", "guide:prompting-techniques-2026", "glossary:system-prompt", "guide:prompt-patterns"]
faq:
  - q: "Is zero-shot worse than few-shot?"
    a: "Not inherently — modern instruction-tuned models handle most well-specified tasks zero-shot, and examples cost tokens on every call. Few-shot earns its cost when outputs must match a pattern that's hard to verbalize (formats, style, fuzzy boundaries). The practical rule: start zero-shot with sharp instructions; add examples to fix the specific failures you observe."
  - q: "What makes a zero-shot prompt work well?"
    a: "Specification quality. State the role, the task, the constraints, and the exact output format; bound the edge cases ('if no date is present, return null'). Most zero-shot failures are underspecification wearing a model-quality costume — the model guessed because the prompt left the decision open."
---

**Zero-shot prompting is instructing a model to do a task with no demonstrations — just the description: "Classify this ticket as billing, bug, or feature-request. Respond with the label only."**

The term comes from the ML literature (performing a task with zero training examples), and its practicality is a product of instruction tuning: models are explicitly trained to follow natural-language task descriptions, so clear instructions alone now cover most well-defined work. That makes zero-shot the sensible *starting point* — cheapest in tokens, easiest to maintain, no example set to curate or go stale.

Its limits define when to escalate: when output must match a pattern easier shown than told, add [few-shot examples](/glossary/few-shot-prompting); when the task needs visible multi-step reasoning on a non-reasoning model, add [chain-of-thought](/glossary/chain-of-thought); when code consumes the output, enforce [structure](/glossary/structured-output) rather than describing it. The escalation path — and when each step actually pays — is the subject of [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026).
