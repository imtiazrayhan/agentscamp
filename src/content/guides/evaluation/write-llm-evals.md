---
title: "Write Evals for an LLM App: From Zero to a CI Gate"
description: "How to evaluate an LLM feature — build a dataset, choose metrics, set a baseline, score offline, add an LLM judge, and gate CI so quality changes are measured."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["llm-evals"]
tags: ["evals", "testing", "llm-as-judge", "ci", "concepts"]
featured: true
summary: "Evals turn 'this feels better' into a number. The method is the same whatever the feature: build a frozen dataset of real cases, pick the two or three metrics it's graded on, record a baseline, score every change offline, validate any LLM-as-judge against human labels, gate CI on the result, then monitor live traffic. Without a fixed eval set you are shipping on vibes."
keyTakeaways:
  - "Build the dataset first and freeze it — 20–50 real cases, oversampling the hard and adversarial ones, beat a thousand synthetic ones."
  - "Pick the two or three metrics the feature is actually graded on; prefer deterministic checks over an LLM judge where possible."
  - "Record a baseline, then change one variable at a time and compare against it."
  - "An LLM-as-judge must be calibrated and validated against human labels before you trust its scores."
  - "Make evals a CI gate, then monitor production and feed real failures back into the dataset."
howtoSteps:
  - name: "Define the scoring unit"
    text: "State exactly what a correct output is and how one is judged — exact match, schema-valid, numeric tolerance, or a rubric. Resolve ambiguity before writing a metric."
  - name: "Build and freeze a dataset"
    text: "Collect 20–50 representative inputs with expected behavior, oversampling hard and adversarial cases (empty input, ambiguity, the format that broke last time). Commit it under version control."
  - name: "Choose the few metrics that matter"
    text: "Pick the two or three the feature is graded on. Prefer deterministic checks (exact match, schema validity) where they apply; use an LLM-as-judge only for genuinely subjective criteria."
  - name: "Record a baseline"
    text: "Run the current or naive system over the full dataset and save the score. Every later result is compared to this number."
  - name: "Validate any LLM judge"
    text: "If you use an LLM-as-judge, give it an explicit rubric and reference examples, then check its agreement against 20–30 human-labeled cases before relying on it."
  - name: "Gate CI"
    text: "Wire the suite into CI so a metric dropping below threshold fails the build — quality changes are caught in PRs, not in production."
  - name: "Monitor and feed back"
    text: "Trace production, score a sample of live traffic, and add real failures to the eval dataset so the same bug can't return."
faq:
  - q: "How do I evaluate an LLM application?"
    a: "Build a frozen dataset of representative inputs with expected behavior, choose the two or three metrics the feature is graded on, record a baseline score, then score every prompt or model change against the dataset. For subjective outputs, use a calibrated LLM-as-judge validated against human labels. Finally, gate CI on the metrics and monitor production. The key is a fixed dataset and a baseline — without them, 'better' is just a feeling."
  - q: "How many test cases do I need for an LLM eval?"
    a: "Start with 20–50 real, well-chosen cases. Coverage of failure modes matters far more than volume — deliberately include the hard, ambiguous, and adversarial inputs that break things. Twenty thoughtful cases beat a thousand bland synthetic ones; grow the set over time by adding real production failures."
  - q: "Is LLM-as-a-judge reliable?"
    a: "It can be, if you build it carefully: an explicit rubric, a small discrete scale with anchors, reference examples, and controls for known biases (length, position, self-preference). Crucially, validate it against human labels before trusting it — an uncalibrated judge is confident noise. Prefer a deterministic check whenever one applies."
  - q: "What's the difference between offline evals and online evals?"
    a: "Offline evals run a fixed dataset before you ship — they're your regression gate in CI. Online evals score a sample of real production traffic after you ship — they catch drift and failure modes your dataset didn't cover. You need both: offline to prevent regressions, online to discover what to add to the offline set."
related: ["best-llm-eval-tools-2026", "llm-evaluation-engineer", "llm-eval-suite-scaffolder", "llm-as-judge-scorer", "run-evals", "prompt-engineer"]
---

You changed the prompt. Is the feature better, or did you just fix the three examples you happened to look at while quietly breaking twenty you didn't? Without evals, you cannot answer that — and LLM features regress silently, because a change that helps one input often hurts another. **Evals turn "this feels better" into a number you can defend.** This guide is the practical method, the same whether you're building extraction, RAG, an agent, or a chatbot.

## The one rule: a frozen dataset and a baseline

Everything else is detail. If you have a fixed set of cases with expected behavior and a recorded baseline score, you can measure any change. If you don't, you're guessing. So the first deliverable is never a metric or a tool — it's the **dataset**.

## Build the dataset first

Collect 20–50 representative inputs and what good output looks like for each. The instinct to generate thousands of synthetic cases is a trap: **coverage of failure modes beats volume.** Deliberately oversample the cases that break things — empty or malformed input, ambiguity, the edge case that caused last month's incident, the prompt-injection attempt. Then freeze the set under version control. A moving eval set can't measure progress.

> [!TIP]
> Twenty real, adversarial cases you understand are worth more than a thousand bland synthetic ones. Grow the set by harvesting real production failures over time, not by generating filler.

## Choose the few metrics that matter

Pick the two or three the feature is actually graded on, not every metric a framework offers — [the metrics catalog](/guides/evaluation/llm-evaluation-metrics-explained) maps each one to its task type:

- **Deterministic checks** — exact match, JSON-schema validity, a regex, a numeric tolerance. Cheap, fast, perfectly consistent. Use them wherever they apply.
- **RAG metrics** — faithfulness (is the answer grounded in the retrieved context?), answer relevancy, context precision/recall. (See [RAGAS](/tools/ragas) and [How RAG Actually Works](/guides/concepts/how-rag-works).)
- **LLM-as-judge** — for genuinely subjective output (tone, helpfulness, summary quality). Powerful but easy to get wrong; build it deliberately (next section).

## Score offline, then add a judge

Run your metrics over the frozen dataset to get a **baseline**, then change one variable at a time and compare. For subjective criteria, an **LLM-as-judge** scales human judgment — but only if calibrated: an explicit rubric, a small anchored scale, reference examples, and controls for length/position/self-preference bias. **Validate the judge against 20–30 human-labeled cases before you trust it** (the [llm-as-judge-scorer](/skills/data/llm-as-judge-scorer) skill walks this). An unvalidated judge is just confident noise with a number attached.

## Make it a CI gate

An eval suite you run by hand is an eval suite you'll stop running. Wire it into CI so a metric falling below threshold **fails the build** — now every prompt or model change is scored automatically, and regressions are caught in the PR. The [run-evals](/commands/testing/run-evals) command and [llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder) skill set this up; [DeepEval](/tools/deepeval) and [promptfoo](/tools/promptfoo) are built for it.

> [!WARNING]
> Never tune against the cases you report on, and never relax a threshold just to go green. A gamed suite is worse than none — it manufactures false confidence. If a threshold is genuinely wrong, change it in its own commit with a rationale.

## Then watch production

Offline evals prevent regressions; they can't predict every real-world input. After you ship, **trace production and run online evals** on a sample of live traffic to catch drift and new failure modes — then add those failures back to the offline dataset so the same bug can't return. That feedback loop is what the [llm-observability-engineer](/agents/data-ai/llm-observability-engineer) and [llm-evaluation-engineer](/agents/data-ai/llm-evaluation-engineer) own together.

For which tool to build all this on, see [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026).
