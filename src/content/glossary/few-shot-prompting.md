---
term: "Few-Shot Prompting"
description: "Few-shot prompting includes worked examples in the prompt so the model learns the task's pattern from demonstrations instead of instructions alone."
date: 2026-06-11
topics: ["workflow-prompting"]
tags: ["few-shot", "prompting", "examples", "llm"]
related: ["prompting-techniques-2026", "zero-shot-prompting", "prompt-patterns", "chain-of-thought", "prompt-optimizer"]
faq:
  - q: "How many examples should a few-shot prompt include?"
    a: "Two to five short, varied ones usually beat both one long example (overfits its specifics) and ten (diminishing returns, token cost, and on long prompts, diluted attention). Cover the boundaries: a typical case, an edge case, and the tricky case the model keeps getting wrong — including a 'when unsure, output X' demonstration."
  - q: "When does few-shot beat just writing better instructions?"
    a: "When the requirement is easier to show than say: exact output formats, house style, subtle classification boundaries, conventions like 'how we write API handlers.' Adjectives drift; demonstrations pin. For behavior that's genuinely rule-like ('never include PII'), instructions remain the right tool — most strong prompts use both."
---

**Few-shot prompting is teaching a model the task by example: the prompt includes a handful of input→output demonstrations, and the model infers the pattern — format, style, decision boundary — from them.**

It exploits in-context learning, the emergent ability of LLMs to pick up a task from demonstrations without any weight updates. Its sweet spot is everything that's easier to show than to describe: an exact JSON shape, the house convention for a route handler, where the line falls between "bug" and "feature request." One canonical example carries error handling, naming, and structure that would take a paragraph of brittle adjectives to specify — which is why it's a core [prompt pattern for coding agents](/guides/prompting/prompt-patterns).

The craft is selection: short, varied examples that mark the task's boundaries, including the edge case the model fumbles. Contrast [zero-shot](/glossary/zero-shot-prompting) (instructions only — the modern default for capable models on clear tasks) and see [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026) for when each technique earns its tokens.
