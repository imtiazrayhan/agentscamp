---
title: "Programmatic Prompt Optimization with DSPy: Stop Hand-Tuning Prompts"
description: "Hand-tuning prompts doesn't scale. DSPy treats prompting as programming — declare tasks as typed signatures and let an optimizer compile the prompts for you."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["workflow-prompting"]
tags: ["dspy", "prompt-optimization", "few-shot", "evals", "framework"]
featured: false
summary: "DSPy reframes prompting as programming: declare the task as a typed signature, compose modules, define a metric, and let an optimizer (BootstrapFewShot, MIPROv2, GEPA) search instructions and few-shot demonstrations against your data. The payoff is a prompt tuned to your metric that survives a model swap — you recompile instead of rewriting by hand."
keyTakeaways:
  - "DSPy treats an LLM program as code you compile, not prompt strings you hand-edit — you specify *what* the task is and the optimizer figures out *how* to prompt for it."
  - "You declare tasks as signatures (typed input → output), compose modules (Predict, ChainOfThought, ReAct), and optimize against a metric plus a small training set."
  - "Optimizers like BootstrapFewShot, MIPROv2, and GEPA search few-shot demonstrations and instruction wording automatically — often beating a hand-tuned prompt."
  - "The portability win is real: change models and you recompile against the new one instead of re-hand-tuning every prompt by feel."
  - "DSPy is evals-first — it needs a metric and example data, so it pays off most when output quality is measurable and you'll iterate more than once."
howtoSteps:
  - name: "Declare the task as a signature"
    text: "Define each step as a typed signature — the inputs and outputs by name, e.g. `question -> answer` or a class with field descriptions. You describe what the step does, not how to prompt it; DSPy generates the actual prompt from the signature."
  - name: "Compose modules into a program"
    text: "Wire signatures into a pipeline using modules like dspy.Predict, dspy.ChainOfThought, or dspy.ReAct. Multi-step programs (retrieve → reason → answer) are ordinary Python that calls these modules, so control flow and tools are just code."
  - name: "Write a metric"
    text: "Define a metric function that scores an output against an expected answer — exact match, an F1, a numeric tolerance, or an LLM-as-judge rubric. This is the objective the optimizer maximizes, so it must reflect what 'good' actually means for your task."
  - name: "Assemble a training and dev set"
    text: "Collect a modest set of labeled examples (often tens, not thousands), split into a set the optimizer learns from and a held-out set you evaluate on. Oversample the hard and adversarial cases — that's where optimization earns its keep."
  - name: "Compile with an optimizer"
    text: "Run an optimizer (teleprompter) — BootstrapFewShot to generate few-shot demos, MIPROv2 to jointly search instructions and demos, or GEPA for reflective instruction evolution. It searches against your metric and produces a compiled program with tuned prompts."
  - name: "Evaluate, then lock it in"
    text: "Score the compiled program on the held-out set against your baseline. Save the compiled artifact, and re-run the optimization when you change models or the task drifts — recompiling rather than rewriting prompts by hand."
faq:
  - q: "What is DSPy?"
    a: "DSPy is an open-source framework from Stanford NLP for programming language models instead of prompting them by hand. You declare each step of an LLM pipeline as a typed signature, compose those steps with modules (like ChainOfThought or ReAct), define a metric, and run an optimizer that automatically searches for the best instructions and few-shot examples against your data. The name stands for 'Declarative Self-improving Python.' The result is a compiled program whose prompts are tuned to your metric rather than written by feel."
  - q: "How is DSPy different from writing prompts by hand or with a template?"
    a: "A template still requires you to write and tune the actual prompt wording and pick the examples yourself. DSPy separates the *specification* of a task (the signature — what goes in, what comes out) from its *implementation* (the prompt string), and then has an optimizer generate and select that implementation for you against a metric. So instead of editing prompt text and eyeballing whether it got better, you change the metric or the data and recompile. It's the difference between hand-writing assembly and letting a compiler emit it."
  - q: "Do I still need prompt engineering if I use DSPy?"
    a: "Yes, but it moves up a level. You stop hand-wording every prompt and instead invest in the things DSPy optimizes against: a clear task signature, a metric that genuinely reflects quality, and a representative dataset including hard cases. Those are prompt-engineering decisions — DSPy just automates the tedious inner loop of trying instruction phrasings and example sets. Garbage metric in, garbage prompt out, so the craft shifts to defining the objective well."
  - q: "What does a DSPy optimizer actually do?"
    a: "An optimizer (DSPy calls them teleprompters) takes your program, metric, and training data and searches for the prompt configuration that maximizes the metric. Depending on the optimizer that means bootstrapping few-shot demonstrations from your data (BootstrapFewShot), jointly optimizing instructions and demonstrations with Bayesian search (MIPROv2), or reflectively evolving the instructions using feedback (GEPA). It compiles the result into your program so the next run uses the tuned prompts."
  - q: "When is DSPy overkill?"
    a: "When you have a single simple prompt, no way to measure quality, or a one-off task you won't iterate on. DSPy's value comes from automating repeated optimization against a metric, so if you can't define a metric or won't run the loop more than once, hand-tuning (or the prompt-optimizer skill) is faster. It earns its complexity on multi-step pipelines, tasks with measurable quality, and anything you'll need to re-tune as models change."
related: ["tool:dspy", "guide:prompting-techniques-2026", "skill:prompt-optimizer", "agent:prompt-engineer", "guide:structured-output-2026"]
---

Hand-tuning prompts is the part of LLM work that doesn't scale. You tweak a sentence, eyeball three outputs, decide it's "better," and ship — then a model upgrade silently undoes all of it and you start over. [DSPy](/tools/dspy) (from Stanford NLP) takes a different stance: treat an LLM pipeline as a **program you compile**, where you specify *what* each step does and an optimizer works out *how* to prompt for it against a metric you define.

## The core idea: specify, don't phrase

The shift is separating a task's **specification** from its **implementation**. In ordinary prompting those are the same thing — the prompt string *is* both the spec and the implementation, so improving it means editing text by feel. DSPy splits them:

- You write a **signature** — a typed declaration of inputs and outputs (`question -> answer`, or a class with field descriptions). That's the spec.
- DSPy generates the actual prompt from the signature, and an **optimizer** tunes that prompt's instructions and few-shot examples. That's the implementation, and you don't hand-write it.

So you stop arguing with prompt wording and start improving the things that actually determine quality: the task spec, the metric, and the data.

## The building blocks

- **Signatures** — declarative input→output specs. `summarize: document -> summary`, with optional field descriptions and types.
- **Modules** — the strategies that turn a signature into a call: `dspy.Predict` (direct), `dspy.ChainOfThought` (reason first), `dspy.ReAct` (the [ReAct](/glossary/react-agent) reason-and-act loop). You compose them like layers in a network.
- **Metrics** — a function that scores an output against the expected one. This is the objective the optimizer maximizes, so it has to mean something.
- **Optimizers (teleprompters)** — `BootstrapFewShot` generates few-shot demonstrations from your data; `MIPROv2` jointly searches instructions and demonstrations; `GEPA` reflectively evolves instructions from feedback. They compile your program into tuned prompts.

```python
import dspy

# 1. specify the task, don't phrase the prompt
classify = dspy.ChainOfThought("ticket -> category, urgency")

# 2. a metric that scores an output
def metric(example, pred, trace=None):
    return pred.category == example.category and pred.urgency == example.urgency

# 3. let an optimizer compile the prompt + demos against your data
optimized = dspy.MIPROv2(metric=metric).compile(classify, trainset=train)
```

## Why it's worth the ceremony

Two payoffs justify the upfront cost of a metric and a dataset:

1. **It often beats hand-tuning.** An optimizer will try instruction phrasings and example sets you wouldn't have the patience to, and keep only what moves the metric.
2. **Portability.** When you switch models — a cheaper one, a newer one — you **recompile** against the new model instead of re-hand-tuning every prompt. Your prompts are no longer welded to one model's quirks.

> [!NOTE]
> DSPy is **evals-first**. It can't optimize what it can't measure, so the work moves from wording prompts to defining a metric that genuinely reflects quality and assembling a dataset that includes the hard cases. That's the same discipline behind the [prompt-engineer](/agents/data-ai/prompt-engineer) agent — DSPy just automates the inner loop.

## When to reach for it (and when not)

Use DSPy when you have a **multi-step pipeline**, **measurable quality**, and a task you'll **iterate on or re-tune across models**. Skip it for a single simple prompt, a one-off, or anything where you can't define a metric — there, hand-tuning or the [prompt-optimizer](/skills/workflow/prompt-optimizer) skill is faster, and the techniques in [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026) cover what you'd be doing by hand. When the output needs to be machine-parseable, pair DSPy with the patterns in [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).
