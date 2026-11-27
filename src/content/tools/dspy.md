---
name: "DSPy"
title: "DSPy"
description: "Program language models instead of prompting them: declare tasks as typed signatures and let optimizers compile the prompts and few-shot examples for you."
url: "https://dspy.ai"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/stanfordnlp/dspy"
license: "MIT"
os: ["Linux", "macOS", "Windows"]
sameAs: ["https://github.com/stanfordnlp/dspy", "https://dspy.ai"]
color: "purple"
topics: ["workflow-prompting"]
audience: ["ai-engineers"]
tags: ["prompt-optimization", "framework", "open-source", "python", "stanford"]
featured: false
alternativeTo: ["langchain", "baml", "pydantic-ai"]
summary: "DSPy, from Stanford NLP, lets you build LLM pipelines as Python code instead of prompt strings. You declare each step as a typed signature, compose modules like ChainOfThought and ReAct, then run an optimizer (BootstrapFewShot, MIPROv2, GEPA) that tunes instructions and few-shot examples against your metric. Change models and you recompile."
related: ["guide:dspy-prompt-optimization", "guide:prompting-techniques-2026", "skill:prompt-optimizer"]
faq:
  - q: "What is DSPy?"
    a: "DSPy is a framework from Stanford NLP for programming language models rather than prompting them. You declare each pipeline step as a typed signature, compose modules like ChainOfThought and ReAct, and let an optimizer (BootstrapFewShot, MIPROv2, GEPA) generate and tune the actual prompts — instructions and few-shot examples — against a metric you define."
  - q: "Is DSPy free?"
    a: "Yes. DSPy is open source under the MIT license and free. You pay your model provider for tokens, both at runtime and during optimization, when an optimizer runs your program many times over the training set. The optimizer docs suggest about 10 examples for BootstrapFewShot and 200 or more for a long MIPROv2 run, so budget optimization as a batch job, not a per-request cost."
  - q: "How do I use DSPy?"
    a: "Run pip install dspy, point it at a model with dspy.configure(lm=dspy.LM('provider/model')), and declare a task as typed inputs and outputs, for example dspy.ChainOfThought('ticket -> category, urgency'). Then compile it: dspy.MIPROv2(metric=metric, auto='light').compile(classify, trainset=train). Save the result with optimized.save(path); the file is plain-text JSON you can read and commit."
  - q: "Which DSPy optimizer should I start with?"
    a: "DSPy's own guidance: with around 10 examples, start with BootstrapFewShot; with 50 or more, try BootstrapFewShotWithRandomSearch; for instruction-only (zero-shot) tuning or longer runs with 200 or more examples, use MIPROv2. GEPA reflects on program traces and can use textual feedback from your metric, and BootstrapFinetune distills a prompted program into a fine-tuned smaller model."
---

DSPy is a framework for **programming** language models rather than prompting them. Instead of hand-writing and hand-tuning prompt strings, you declare what each step of a pipeline does as a typed **signature**, compose those steps with **modules**, and let an **optimizer** generate and tune the actual prompts — instructions and few-shot examples — against a metric you define. It comes out of Stanford NLP and has become the reference tool for treating prompts as something you compile, not craft. The latest release is 3.5.0, published on November 10, 2026, and the repository has about 39,300 GitHub stars as of November 2026.

It is aimed at developers building LLM pipelines whose quality is measurable and who are tired of the hand-tuning treadmill — especially multi-step systems (retrieve → reason → answer) where prompt changes ripple and a model upgrade silently undoes weeks of tweaking.

## Highlights

- **Signatures** — declare a task as typed inputs → outputs (`question -> answer`); DSPy generates the prompt from the spec.
- **Modules** — compose strategies like `dspy.Predict`, `dspy.ChainOfThought`, and `dspy.ReAct` into a pipeline that's ordinary Python.
- **Optimizers** — `BootstrapFewShot`, `MIPROv2`, and `GEPA` search demonstrations and instruction wording against your metric, often beating hand-tuned prompts. `BootstrapFinetune` goes further and distills a prompted program into fine-tuned model weights.
- **Portability** — change models and recompile instead of re-hand-tuning every prompt.
- **Evals-first** — optimization is driven by a metric and example data, so quality is measured, not eyeballed.

## In an AI-assisted workflow

```bash
pip install dspy
```

```python
import dspy

dspy.configure(lm=dspy.LM("openai/gpt-5.4-nano"))  # any provider/model string

classify = dspy.ChainOfThought("ticket -> category, urgency")  # specify, don't phrase

# A few labeled examples and a metric that returns True/False (or a score)
train = [
    dspy.Example(ticket="Card was charged twice", category="billing", urgency="high").with_inputs("ticket"),
    dspy.Example(ticket="How do I export my data?", category="how-to", urgency="low").with_inputs("ticket"),
    # ...more examples, including the hard cases
]

def metric(example, pred, trace=None):
    return example.category == pred.category and example.urgency == pred.urgency

optimizer = dspy.MIPROv2(metric=metric, auto="light")   # light, medium or heavy
optimized = optimizer.compile(classify, trainset=train)  # compile the prompt

optimized.save("classify.json")                          # plain-text JSON, safe to commit
print(optimized(ticket="I can't log in after resetting my password"))
```

You specify the task and the metric; the optimizer figures out the prompt.

> [!TIP]
> DSPy can't optimize what it can't measure. Invest first in a metric that genuinely reflects quality and a dataset that includes the hard cases — that's where the leverage is. See [Programmatic Prompt Optimization with DSPy](/guides/prompting/dspy-prompt-optimization).

## Good to know

DSPy is open source (MIT) and free; you pay your model provider for tokens during compilation and at runtime. It's a Python framework (Python 3.10 or later), so it fits Python-based LLM stacks most naturally.

Optimization is the expensive part: an optimizer runs your program many times over the training set, and DSPy's guidance is to bring around 10 examples for `BootstrapFewShot`, 50 or more for `BootstrapFewShotWithRandomSearch`, and 200 or more for a long `MIPROv2` run so it does not overfit. An optimized program is also tied to the model it was compiled for, so plan to recompile when you switch models.

If what you need is typed, validated output from a single call, [Instructor](/tools/instructor) or [BAML](/tools/baml) is lighter; [Pydantic AI](/tools/pydantic-ai) and [LangChain](/tools/langchain) are the usual picks for agent loops and integrations, without an optimizer. It's most worth its complexity on multi-step pipelines with measurable quality — for a single simple prompt, hand-tuning or the [prompt-optimizer](/skills/workflow/prompt-optimizer) skill is faster. Background on the techniques it automates: [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026).
