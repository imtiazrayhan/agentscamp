---
name: "llm-as-judge-scorer"
description: "Design a reliable LLM-as-judge metric — a calibrated rubric, a clear scoring scale, and bias controls — and validate it against human labels before trusting it. Use when grading open-ended LLM output (summaries, answers, tone) that exact-match can't score."
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "purple"
date: 2026-06-03
topics: ["llm-evals"]
related: ["write-llm-evals", "llm-eval-suite-scaffolder", "deepeval", "prompt-engineer"]
featured: false
summary: "LLM-as-judge is the only practical way to score open-ended output at scale — but a sloppy judge is just confident noise. This skill builds a calibrated, bias-controlled judge: explicit rubric, discrete scale, reference examples, and agreement-checked against human labels before you rely on it."
---

When output is open-ended — a summary, a support answer, tone, helpfulness — you can't score it with exact match, and human grading doesn't scale. An **LLM-as-judge** does, but only if it's built carefully: an uncalibrated judge produces confident, inconsistent scores that quietly corrupt every downstream decision. This skill designs a judge you can actually trust.

## When to use this skill

- Grading subjective or open-ended outputs where there's no single correct string.
- Replacing slow, inconsistent manual review in an eval loop.
- An existing LLM-as-judge gives scores that don't match your own judgment.

## Instructions

1. **Define the rubric explicitly.** State precisely what's being judged and the criteria. Vague instructions ("rate quality 1–10") produce noise; concrete criteria ("deduct if the answer omits the rotation step, hallucinates a flag, or exceeds 3 sentences") produce signal.
2. **Use a discrete scale with anchors.** Prefer a small scale (e.g. pass/fail or 1–5) with a written description of what each level means. Discrete, anchored scales are far more consistent than a bare 1–10.
3. **Provide reference examples.** Include a few scored examples in the judge prompt — especially boundary cases — so the model calibrates to your standard rather than its own.
4. **Control known biases.** LLM judges favor longer answers, their own model family's style, and the first option in a pairwise test. Mitigate: randomize order in pairwise comparisons, instruct length-neutrality, and consider a different model as judge than the one under test.
5. **Validate against human labels.** Hand-label 20–30 cases, run the judge, and measure agreement. If the judge disagrees with you often, fix the rubric — do not deploy a judge you haven't checked against ground truth.
6. **Wire it in.** Implement as a custom metric in your framework (e.g. DeepEval's G-Eval or a custom scorer) and add it to the suite with a threshold.

> [!WARNING]
> An LLM judge you haven't validated against human labels is not a metric — it's an opinion with a number attached. Calibrate before you trust it, and re-check when you change the judge model.

> [!NOTE]
> Where possible, prefer a deterministic check (schema validity, exact match, a regex) over an LLM judge — it's cheaper, faster, and perfectly consistent. Reserve the judge for what genuinely needs judgment.

## Output

A validated judge: the rubric and scale, reference examples, the bias controls applied, the human-agreement score, and the metric wired into the eval suite.
