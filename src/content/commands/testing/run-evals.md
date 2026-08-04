---
description: "Run the project's LLM evaluation suite (DeepEval, promptfoo, or RAGAS) and report scores against thresholds before a merge."
argument-hint: "<eval suite path / config, or the feature to evaluate>"
allowed-tools: "Read, Grep, Glob, Bash"
model: "sonnet"
title: "Run Evals"
color: "blue"
date: 2026-06-03
topics: ["llm-evals"]
related: ["guide:write-llm-evals", "tool:deepeval", "tool:promptfoo", "agent:llm-evaluation-engineer"]
featured: false
summary: "Runs the LLM eval suite — not the unit tests — and reports each metric against its threshold and baseline, so a prompt or model change is shipped on numbers, not vibes. Surfaces regressions as a clear pass/fail before merge."
---

## Scope

Treat `$ARGUMENTS` as the eval target — a path to the eval suite/config, or the feature whose suite should run. Restate what you're evaluating in one sentence first.

This command runs the **LLM evaluation suite** (e.g. [DeepEval](/tools/deepeval), [promptfoo](/tools/promptfoo), or [RAGAS](/tools/ragas)) — it is **not** a unit-test runner. If the project has no eval suite yet, say so and point to scaffolding one rather than inventing ad-hoc checks.

> [!NOTE]
> Evals are non-deterministic and cost tokens (judge metrics call an LLM). Run the full frozen dataset, not a cherry-picked subset, or the result is meaningless.

## Step 1 — Locate the suite

Find the eval config/tests (e.g. `deepeval`/pytest eval files, `promptfooconfig.yaml`, or a RAGAS script) and the frozen dataset. Confirm the metrics and their thresholds. If none exists, stop and recommend scaffolding one — do not fabricate a suite.

## Step 2 — Run it

Execute the suite over the **full** dataset using the project's runner. Capture the raw output. Do not modify prompts or the dataset to make it pass.

## Step 3 — Report against thresholds and baseline

Produce a table: metric | score | threshold | baseline | pass/fail | delta vs baseline. Call out any metric below threshold or regressed from baseline explicitly.

## Step 4 — Verdict

Give a clear merge verdict: **pass** (all metrics clear threshold, no regression) or **block** (which metric failed, by how much). For a block, point at the likely stage — retrieval, prompt, or model — rather than guessing a fix.

> [!WARNING]
> Never tune the prompt against the same cases you're reporting on in the same run, and never relax a threshold just to go green. If a threshold is wrong, change it deliberately in its own commit with a rationale.
