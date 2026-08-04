---
name: "llm-eval-suite-scaffolder"
description: "Stand up an evaluation suite for an LLM feature from scratch — a representative dataset, the right metrics, a baseline score, and a CI gate — using DeepEval, promptfoo, or RAGAS. Use when a feature has no evals, before tuning a prompt, or when adding an LLM feature to CI."
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-03
topics: ["llm-evals"]
related: ["guide:write-llm-evals", "tool:deepeval", "tool:promptfoo", "skill:llm-as-judge-scorer", "command:run-evals"]
featured: false
summary: "Turns 'we should add evals' into a running suite: it builds a representative dataset (oversampling the hard cases), picks the two or three metrics the feature is actually graded on, records a baseline, and wires the suite into CI so prompt and model changes are scored, not guessed."
---

The hardest part of LLM evaluation is starting. This skill scaffolds a complete, runnable eval suite for a feature — dataset, metrics, baseline, and CI wiring — using the framework that fits the stack (DeepEval for Python/pytest, promptfoo for config-driven CLI, RAGAS for RAG-specific metrics).

## When to use this skill

- An LLM feature ships with no evals and you need a gate before changing it further.
- You're about to tune a prompt or swap a model and want to measure the change, not guess.
- You're adding an LLM feature to CI and need a suite that fails on regressions.

## Instructions

1. **Pin the task and the unit of scoring.** State exactly what the feature must produce and how one output is judged: exact match, JSON-schema valid, a numeric tolerance, or an LLM-as-judge rubric. An ambiguous success criterion is the real bug — resolve it first.
2. **Build a representative dataset.** Collect 20–50 real inputs with expected behavior, deliberately oversampling hard and adversarial cases (empty input, ambiguity, the format that broke last time, the prompt-injection attempt). Freeze it under version control. For RAG, capture the gold passages too.
3. **Pick the few metrics that matter.** Two or three the feature is actually graded on — not every metric the framework offers. Faithfulness and answer relevancy for RAG; task accuracy and format validity for extraction; a calibrated rubric ([llm-as-judge-scorer](/skills/data/llm-as-judge-scorer)) for open-ended output.
4. **Choose the framework and scaffold it.** Generate the suite: [DeepEval](/tools/deepeval) (pytest-style assertions), [promptfoo](/tools/promptfoo) (YAML matrix), or [RAGAS](/tools/ragas) (RAG metrics). Wire the dataset and metrics in, with thresholds.
5. **Record a baseline.** Run the current/naive prompt over the full set and commit the score. Every later number is compared to this.
6. **Wire the CI gate.** Add a `run-evals` step that fails the build when a metric drops below threshold, so regressions are caught in PRs — see the [Run Evals](/commands/testing/run-evals) command.

> [!WARNING]
> Don't generate hundreds of synthetic cases and call it an eval set. Twenty real, well-chosen cases — including the adversarial ones — beat a thousand bland synthetic ones. Quality and coverage of failure modes, not volume.

## Output

A runnable eval suite committed to the repo: the frozen dataset, the chosen metrics with thresholds, a recorded baseline score, and a CI step that gates merges on it.
