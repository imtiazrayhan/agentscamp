---
title: "Few-Shot vs Chain-of-Thought vs Structured Prompting: What to Use When (2026)"
description: "When to reach for few-shot examples, chain-of-thought reasoning, or structured/output-constrained prompting — a 2026 decision guide to the core techniques."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["workflow-prompting"]
tags: ["prompting", "few-shot", "chain-of-thought", "structured-output", "comparison"]
featured: false
summary: "Few-shot teaches format and style by example; chain-of-thought trades tokens and latency for accuracy on multi-step reasoning; structured prompting constrains the output shape so it's machine-parseable. They're complementary, not rivals. This guide maps each technique to the tasks it fits, the cost it carries, and the failure modes to watch in 2026."
keyTakeaways:
  - "Few-shot prompting shows the model the shape of the answer with examples — the most reliable lever for fixing format, tone, and house-style drift."
  - "Chain-of-thought (\"think step by step\") lifts accuracy on multi-step reasoning but costs tokens and latency, and adds little on simple tasks."
  - "Structured prompting constrains the output to a schema so it's parseable downstream — back it with native structured-output/JSON mode, not just prose instructions."
  - "Modern reasoning models do much of the chain-of-thought internally, so an explicit \"think step by step\" adds less than it used to — and is sometimes redundant."
  - "The techniques compose: few-shot examples + an output contract + reasoning where the task needs it is the common production combination."
  - "Pick by failure mode — wrong format → few-shot/structured; wrong answer on hard reasoning → chain-of-thought; unparseable output → structured output."
faq:
  - q: "What's the difference between few-shot and chain-of-thought prompting?"
    a: "Few-shot prompting puts a handful of input→output examples in the prompt so the model imitates their format, style, and conventions — it teaches the model what a good answer looks like. Chain-of-thought prompting instead asks the model to reason through intermediate steps before answering, which improves accuracy on tasks that need multi-step logic (math, planning, complex extraction). They solve different problems: few-shot fixes the shape of the answer, chain-of-thought improves the correctness of the reasoning behind it. You can use both at once — few-shot examples that themselves demonstrate the reasoning steps."
  - q: "Does chain-of-thought still help with 2026 reasoning models?"
    a: "Less than it did with older models. Reasoning models (the o-series, Claude's extended thinking, and similar) already produce internal chain-of-thought before answering, so an explicit \"think step by step\" is often redundant and can even hurt by constraining how the model reasons. On those models, spend your prompt budget on a clear task spec and good examples rather than reasoning instructions. On standard (non-reasoning) models, explicit chain-of-thought still meaningfully lifts accuracy on multi-step problems. Match the technique to the model class."
  - q: "When should I use structured prompting or structured output?"
    a: "Whenever the model's output is consumed by code rather than read by a human — extraction, classification, form-filling, tool arguments, anything you'll parse. Structured prompting means specifying the exact output shape (a JSON schema, a table, a fixed set of fields), and it's most reliable when paired with the provider's native structured-output or JSON mode and a validate-and-retry loop, rather than just asking for JSON in prose. If the output is free-form text for a person to read, you usually don't need it."
  - q: "Can I combine few-shot, chain-of-thought, and structured prompting?"
    a: "Yes — that's the normal production pattern, not an exception. A robust prompt often pins the output shape with a structured-output spec, includes two or three few-shot examples that demonstrate that exact shape (and the tricky edge cases), and adds reasoning only where the task genuinely needs multi-step logic. The techniques target different failure modes — format, accuracy, parseability — so they stack rather than compete. Add them one at a time and measure, so you know which one actually moved the metric."
  - q: "How many few-shot examples should I use?"
    a: "Usually two to five. The goal is to demonstrate the pattern and its boundaries — including the edge cases and the desired \"unknown\"/refusal behavior — not to flood the context. A little variety across examples teaches the limits of the pattern better than one long example, which tends to overfit to its own specifics. More examples cost tokens and latency and can over-anchor the model, so add them only when an eval slice shows the model getting a case wrong that an example would fix."
related: ["prompt-patterns", "dspy-prompt-optimization", "dspy", "prompt-optimizer", "structured-output-2026", "context-engineering", "prompt-engineer"]
---

"Few-shot," "chain-of-thought," and "structured output" get talked about as if you have to choose one. You don't — they fix different problems. Few-shot fixes the *shape* of the answer, chain-of-thought improves the *correctness* of hard reasoning, and structured prompting makes the output *parseable*. The skill is knowing which failure mode you're staring at and reaching for the technique that addresses it — then composing them. This guide is that decision map for 2026.

## Few-shot: teach the shape by example

Few-shot prompting puts a small set of input→output examples in the prompt and lets the model imitate them. For coding and data tasks it's far more precise than adjectives — "idiomatic," "consistent," "concise" are vague; a worked example is unambiguous.

It's the highest-leverage technique when the problem is *format or convention*: API handlers that should all follow one house style, extraction that must return the same fields every time, a tone you can show but struggle to describe.

```text
Classify each support ticket. Follow these examples exactly:

Input: "card declined twice at checkout"     → {"category": "billing", "urgency": "high"}
Input: "how do I export my data?"            → {"category": "how-to", "urgency": "low"}
Input: "site is completely down for our team" → {"category": "outage",  "urgency": "high"}

Input: "the dashboard chart looks wrong"      →
```

Three short, varied examples beat one long one: variety teaches the *boundaries* of the pattern, while a single example tends to overfit to its own specifics. Deliberately include the edge cases — the ambiguous input, the empty field, the "unknown" answer — so the model learns the behavior you want there too.

## Chain-of-thought: reason before answering

Chain-of-thought (CoT) asks the model to work through intermediate steps before committing to an answer. On tasks that need multi-step logic — arithmetic, planning, multi-hop extraction, anything where the answer depends on a chain of sub-decisions — it reliably improves accuracy, because the model commits to its reasoning where it can't skip a step.

The cost is real: more output tokens, higher latency, and a longer trace to read. And on *simple* tasks it can actually hurt — asking a model to over-explain a one-step answer invites it to talk itself into a wrong one.

> [!NOTE]
> Reasoning models change the calculus. Models with built-in reasoning (the o-series, Claude's extended thinking, and peers) already produce internal chain-of-thought before they answer, so an explicit "think step by step" is often redundant — and occasionally counterproductive, by constraining reasoning the model would have done better on its own. On those models, spend the prompt on a crisp task spec and good examples. Save explicit CoT for standard models, where it still pays.

## Structured prompting: constrain the output

Structured prompting pins the *output shape* — a JSON object, a table, a fixed set of fields — so the result is machine-parseable instead of free-form prose you have to scrape. It's what makes an LLM call a dependable step in a pipeline rather than a thing a human reads.

The key in 2026: don't just *ask* for JSON in prose and hope. Back the request with the provider's **native structured-output or JSON mode** and a **validate-and-retry** loop, so malformed output is caught and re-requested rather than crashing a downstream parser. (The full breakdown of the mechanisms — JSON mode vs. function calling vs. constrained decoding — is in [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).)

```text
Respond with ONLY a JSON object matching this shape — no prose, no code fence:
{ "category": "billing | how-to | outage | other", "urgency": "low | medium | high" }
```

Enums and explicit field names do more work than a paragraph of instructions: they make an invalid answer structurally hard to produce.

## How to choose

Diagnose by the failure you're seeing, then apply the matching lever:

| Symptom | Reach for |
|---|---|
| Output format keeps drifting / wrong style | **Few-shot** (and/or a structured-output spec) |
| Wrong answer on multi-step reasoning | **Chain-of-thought** (on non-reasoning models) |
| Output isn't reliably parseable by code | **Structured prompting** + native structured output |
| Model fumbles edge cases (empty, ambiguous) | **Few-shot** examples that *cover those cases* |
| Right answer, far too many tokens | Drop redundant CoT; trim examples to the few that pay |

## They compose

The strongest production prompts stack all three: a **structured-output contract** for the shape, **two or three few-shot examples** that demonstrate that exact shape and its edge cases, and **reasoning only where the task needs it**. Because each technique targets a different failure mode, they add up instead of fighting.

The discipline is to add them **one at a time and measure** — change a single thing, re-run your eval set, keep it only if the score moves. That's the difference between prompting and guessing, and it's the core of the [prompt-engineer](/agents/data-ai/prompt-engineer) agent's workflow. When hand-tuning stops scaling, the next step is to let an optimizer search instructions and examples for you — see [Programmatic Prompt Optimization with DSPy](/guides/prompting/dspy-prompt-optimization), or hand a single underperforming prompt to the [prompt-optimizer](/skills/workflow/prompt-optimizer) skill. For the broader patterns that wrap these techniques into agent workflows, see [Prompt Patterns for Coding Agents](/guides/prompting/prompt-patterns).
