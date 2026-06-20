---
name: "DSPy"
title: "DSPy"
description: "Program language models instead of prompting them: declare tasks as typed signatures and let optimizers compile the prompts and few-shot examples for you."
url: "https://dspy.ai"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/stanfordnlp/dspy"
license: "MIT"
os: ["Linux", "macOS", "Windows"]
sameAs: ["https://github.com/stanfordnlp/dspy", "https://dspy.ai"]
color: "purple"
topics: ["workflow-prompting"]
tags: ["prompt-optimization", "framework", "open-source", "python", "stanford"]
featured: false
alternativeTo: ["langchain", "baml", "pydantic-ai"]
summary: "DSPy (from Stanford NLP) lets you build LLM pipelines as Python code rather than brittle prompt strings. You declare each step as a typed signature, compose modules like ChainOfThought and ReAct, then run an optimizer (BootstrapFewShot, MIPROv2, GEPA) that searches instructions and few-shot demonstrations against your metric and data. Change models and you recompile, not rewrite."
related: ["dspy-prompt-optimization", "prompting-techniques-2026", "prompt-optimizer"]
faq:
  - q: "What is DSPy?"
    a: "DSPy is a framework from Stanford NLP for programming language models rather than prompting them. You declare each pipeline step as a typed signature, compose modules like ChainOfThought and ReAct, and let an optimizer (BootstrapFewShot, MIPROv2, GEPA) generate and tune the actual prompts — instructions and few-shot examples — against a metric you define."
  - q: "Is DSPy free?"
    a: "Yes — DSPy is open source under MIT and free. You pay your model provider for tokens during compilation and at runtime. It's a Python framework, so it fits Python-based LLM stacks most naturally."
  - q: "How do I use DSPy?"
    a: "Declare a task as typed inputs and outputs — e.g. classify = dspy.ChainOfThought('ticket -> category, urgency') — then compile it with an optimizer like dspy.MIPROv2(metric=metric).compile(classify, trainset=train). You specify the task and the metric; the optimizer figures out the prompt. Invest first in a metric that genuinely reflects quality and a dataset that includes the hard cases."
---

DSPy is a framework for **programming** language models rather than prompting them. Instead of hand-writing and hand-tuning prompt strings, you declare what each step of a pipeline does as a typed **signature**, compose those steps with **modules**, and let an **optimizer** generate and tune the actual prompts — instructions and few-shot examples — against a metric you define. It comes out of Stanford NLP and has become the reference tool for treating prompts as something you compile, not craft.

It is aimed at developers building LLM pipelines whose quality is measurable and who are tired of the hand-tuning treadmill — especially multi-step systems (retrieve → reason → answer) where prompt changes ripple and a model upgrade silently undoes weeks of tweaking.

## Highlights

- **Signatures** — declare a task as typed inputs → outputs (`question -> answer`); DSPy generates the prompt from the spec.
- **Modules** — compose strategies like `dspy.Predict`, `dspy.ChainOfThought`, and `dspy.ReAct` into a pipeline that's ordinary Python.
- **Optimizers** — `BootstrapFewShot`, `MIPROv2`, and `GEPA` search demonstrations and instruction wording against your metric, often beating hand-tuned prompts.
- **Portability** — change models and recompile instead of re-hand-tuning every prompt.
- **Evals-first** — optimization is driven by a metric and example data, so quality is measured, not eyeballed.

## In an AI-assisted workflow

```python
import dspy

classify = dspy.ChainOfThought("ticket -> category, urgency")  # specify, don't phrase
optimized = dspy.MIPROv2(metric=metric).compile(classify, trainset=train)  # compile the prompt
```

You specify the task and the metric; the optimizer figures out the prompt.

> [!TIP]
> DSPy can't optimize what it can't measure. Invest first in a metric that genuinely reflects quality and a dataset that includes the hard cases — that's where the leverage is. See [Programmatic Prompt Optimization with DSPy](/guides/prompting/dspy-prompt-optimization).

## Good to know

DSPy is open source (MIT) and free; you pay your model provider for tokens during compilation and at runtime. It's a Python framework, so it fits Python-based LLM stacks most naturally. It's most worth its complexity on multi-step pipelines with measurable quality — for a single simple prompt, hand-tuning or the [prompt-optimizer](/skills/workflow/prompt-optimizer) skill is faster. Background on the techniques it automates: [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026).
