---
title: "LLM-as-Judge: Build Evaluators You Can Actually Trust"
description: "Design and calibrate LLM-as-judge evaluators — rubrics, pointwise and pairwise scoring, bias controls, human agreement, reliability tests, and CI gates."
author: "AgentsCamp"
date: 2026-08-04
color: "purple"
topics: ["llm-evals", "llm-app-dev"]
tags: ["llm-as-judge", "evaluation", "rubrics", "quality", "testing"]
featured: true
summary: "LLM-as-judge turns subjective output quality into scalable evaluation, but the judge is another fallible model. Trust comes from an anchored rubric, structured output, blinded and randomized inputs, human-labeled calibration data, agreement measurement, and repeated reliability checks. Use deterministic assertions first and reserve model judgment for criteria that genuinely require semantics."
keyTakeaways:
  - "Use deterministic assertions for facts, formats, and constraints; use a judge only for semantic criteria that code cannot evaluate reliably."
  - "Score one criterion at a time with anchored examples instead of asking for a vague overall quality number."
  - "Pointwise scoring supports release thresholds; pairwise comparison is often easier when choosing between two prompt or model variants."
  - "Control position, verbosity, style, and self-preference bias through blinding, order swaps, and a diverse calibration set."
  - "Validate judge agreement against human labels before scaling, and version the judge prompt, model, rubric, and dataset together."
faq:
  - q: "What is LLM-as-judge?"
    a: "LLM-as-judge is the use of one language model to evaluate another model's output against an explicit rubric. It is useful for semantic qualities such as faithfulness, relevance, tone, and completeness that are difficult to score with exact-match code."
  - q: "Is LLM-as-judge reliable?"
    a: "It can be reliable enough for product evaluation when calibrated against human labels and tested for stability and bias. An uncalibrated judge with a vague prompt is not a ground truth source; it is another model output with a number attached."
  - q: "Should I use pointwise or pairwise judging?"
    a: "Use pointwise scoring when you need an absolute threshold, longitudinal metric, or pass/fail gate. Use pairwise comparison when selecting between two variants; models often distinguish which output is better more consistently than assigning an absolute score."
  - q: "Can the same model judge its own answers?"
    a: "It can, but self-preference and shared failure modes make the result riskier. Prefer a capable independent judge, blind model identity, and verify agreement with humans. If self-judging is unavoidable, make the limitation explicit and increase human spot checks."
related: ["llm-as-judge", "write-llm-evals", "llm-evaluation-metrics-explained", "llm-as-judge-scorer", "llm-evaluation-engineer", "eval-dataset", "prompt-regression-tester"]
howtoSteps:
  - name: "Choose a semantic criterion"
    text: "Define the one quality dimension the judge must evaluate and confirm a deterministic assertion cannot score it more reliably."
  - name: "Write an anchored rubric"
    text: "Describe observable evidence for each score or pass/fail outcome and include representative boundary examples."
  - name: "Build a human-labeled calibration set"
    text: "Collect real and adversarial cases, have qualified reviewers label them independently, and resolve disagreements into a reference set."
  - name: "Measure agreement and bias"
    text: "Compare judge output with human labels, swap pairwise order, vary length and style, and repeat a sample to measure instability."
  - name: "Version and monitor the evaluator"
    text: "Pin the judge model and prompt, store raw decisions, gate releases on validated thresholds, and recalibrate when the model, rubric, or traffic changes."
---

**LLM-as-judge uses a language model to score another model's output against a rubric.** It is the practical bridge between exact-match metrics, which are cheap but narrow, and human review, which is rich but expensive.

The method is useful for criteria such as faithfulness, relevance, completeness, tone, and instruction following. It is also easy to misuse. A judge is not ground truth: it has biases, stochastic behavior, blind spots, and failure modes that can correlate with the system it evaluates.

The question is not “Can a model produce a score?” It plainly can. The question is whether that score agrees with qualified humans often enough, remains stable across irrelevant changes, and detects the regressions your product actually cares about.

## Start with the metric hierarchy

Use the cheapest reliable evaluator for each criterion:

1. **Deterministic assertion** — schema validity, exact fields, numeric bounds, forbidden strings, citation presence, latency, or cost.
2. **Programmatic semantic metric** — retrieval recall, string similarity, classifier output, or another task-specific check.
3. **LLM judge** — meaning-dependent criteria that resist code.
4. **Human review** — novel, high-stakes, disputed, or calibration cases.

Do not ask a judge whether JSON parses, whether a field is present, or whether a number is inside a range. Code answers those questions more cheaply and consistently. Save model judgment for the dimensions that require language understanding.

## Score one thing at a time

“Rate this answer's overall quality from 1–10” produces a number that is difficult to interpret or repair. Break quality into orthogonal criteria:

- **Faithfulness:** Are claims supported by the supplied context?
- **Relevance:** Does the answer address the user's request directly?
- **Completeness:** Does it cover every required element?
- **Tone:** Does it match the defined communication standard?
- **Actionability:** Can the user take the next step from the answer?

Each criterion needs its own rubric and output field. When a release score drops, you should know which property regressed.

## Write anchored rubrics

A rubric should describe observable evidence, not adjectives:

```text
Evaluate FAITHFULNESS only.

2 = Every material claim is supported by the supplied context.
1 = The central answer is supported, but one secondary claim is unsupported
    or overstates the context.
0 = A central claim contradicts or cannot be derived from the context.

Do not reward writing style, length, or helpful details beyond the context.
Return JSON: {"score": 0|1|2, "unsupported_claims": [string], "reason": string}
```

The middle anchor matters. Without it, the judge invents its own boundary between pass and fail. Include examples near that boundary and cases that should be rejected despite fluent wording.

## Pointwise versus pairwise

**Pointwise judging** scores one output against a fixed rubric. It is useful for absolute thresholds, dashboards, and release gates because every run produces a comparable value.

**Pairwise judging** compares output A with output B. It is useful when choosing between a prompt, model, or retrieval variant because “which better satisfies this criterion?” is often easier than assigning an absolute score.

Pairwise results require order controls. Run both `A/B` and `B/A`, hide system identity, and count an order-sensitive disagreement as uncertainty rather than forcing a winner. For several variants, randomize order and use a tournament or balanced comparison design rather than always presenting the incumbent first.

## Build the calibration set

The judge needs a test suite of its own. Create a small, carefully labeled set containing:

- ordinary production-shaped examples
- known good and known bad outputs
- borderline cases where reasonable people may disagree
- long and short answers with equivalent quality
- polished nonsense and awkward but correct answers
- failures your application has already shipped
- examples from every important language, route, or user segment

Have at least two qualified humans label the cases independently before resolving disagreements. Their disagreement is information: if people cannot apply the rubric consistently, the judge will not rescue it. Rewrite the criterion before tuning the model prompt.

Measure exact agreement for categorical outcomes, correlation for ordered scores, and an agreement statistic such as Cohen's kappa when chance agreement matters. Also inspect the confusion matrix. A judge that agrees overall but routinely passes the most dangerous failure class is not acceptable.

## Test known judge biases

Run targeted probes before trusting the metric:

- **Position bias:** Swap A and B in pairwise comparisons.
- **Verbosity bias:** Compare equivalent answers with different lengths.
- **Style bias:** Vary polish, headings, and confidence without changing correctness.
- **Self-preference:** Blind which model or provider produced the output.
- **Reference leakage:** Ensure hidden labels or expected answers are not accidentally visible.
- **Instability:** Repeat a representative sample and measure score variance.

Use a deterministic sampling configuration when supported, but do not mistake a low temperature for guaranteed repeatability. Cache evaluator results for identical versioned inputs and rerun enough cases after judge-model changes to establish a new baseline.

## Separate the evidence from the verdict

Require structured output containing both the score and the specific evidence behind it. Store the raw evaluated input, candidate output, rubric version, judge prompt, judge model, result, and timestamp.

Reasons are not proof that the verdict is correct, but they make debugging possible. They reveal whether the judge applied the wrong criterion, rewarded irrelevant style, missed a citation, or encountered an ambiguous rubric.

For faithfulness, ask for unsupported claims rather than a general explanation. For completeness, ask for missing requirements. Make the evidence schema reflect the criterion.

## Use the judge in CI carefully

A calibrated judge can gate releases, but the gate should acknowledge uncertainty:

- combine judge scores with deterministic invariants
- require a minimum sample size
- compare against a frozen baseline on the same dataset
- define an allowable regression band before seeing results
- fail hard on critical safety cases even when the aggregate score is healthy
- send borderline or contradictory results to human review

Track scores by slice, not only as one average. A gain on simple requests can hide a collapse on long-context, multilingual, or high-stakes traffic.

## Recalibrate when the system moves

Treat the evaluator as versioned production code. A new judge model, rewritten rubric, changed prompt, or shifted traffic distribution can invalidate the historical scale. Pin versions, preserve old results, and rerun the calibration set before comparing across the change.

Sample production outputs for ongoing human review. Promote newly discovered failures into both the product eval set and the judge's calibration set. This creates a closed loop: real errors improve the system and the measurement system used to judge it.

> [!WARNING]
> Never let an unvalidated judge become the sole approval mechanism for high-impact actions. Use it to prioritize and scale review, while deterministic controls and accountable humans retain the final safety boundary.

The companion [LLM-as-Judge Scorer](/skills/data/llm-as-judge-scorer) skill turns this method into a reusable workflow, while [Writing LLM Evals](/guides/evaluation/write-llm-evals) shows how the judge fits inside a complete evaluation suite.
