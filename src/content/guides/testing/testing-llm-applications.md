---
title: "Testing LLM Applications: How to Test Non-Deterministic Software"
description: "How to test software that calls LLMs when outputs are non-deterministic — the testing pyramid, assertion strategies, golden datasets, and CI gating."
author: "AgentsCamp"
color: "green"
topics: ["llm-evals", "review-qa"]
tags: ["testing", "evals", "llm-as-judge", "regression", "ci"]
related: ["write-llm-evals", "best-llm-eval-tools-2026", "production-tool-calling", "prompt-regression-tester", "agent-trajectory-evaluator"]
featured: false
date: 2026-06-17
summary: "You can't assertEqual an LLM output. Split your app into a deterministic layer you test like normal code and a model-behavior layer you test with evals over a golden dataset. Validate structure deterministically, judge subjective quality with a rubric or an LLM judge, pin a baseline, and gate CI on the score — not on exact strings."
keyTakeaways:
  - "Exact-match assertions break the moment a model rewords an answer — test properties, not strings."
  - "Most of an LLM app is ordinary code (parsing, tools, retrieval): unit-test that layer deterministically with the model mocked."
  - "Test model behavior with evals over a frozen golden dataset, scored and compared against a committed baseline."
  - "Layer assertions cheapest-first: schema/regex, then semantic similarity, then an LLM-as-judge for subjective quality."
  - "For agents, evaluate the trajectory (tools called, order, arguments) — not just the final answer."
  - "Gate CI on the aggregate eval score and pin temperature/seed so a green build means something."
faq:
  - q: "Why can't I just use assertEqual on LLM output?"
    a: "Because the same correct answer can be phrased a hundred ways. Exact-match assertions fail on harmless rewording and pass only by luck, so they're either flaky or vacuous. Assert on properties instead — valid JSON, required fields present, an expected substring, a numeric range, or a similarity/judge score above a threshold."
  - q: "How do I make LLM tests deterministic enough for CI?"
    a: "You can't make generation fully deterministic, but you can reduce variance: set temperature to 0, pin a seed if the provider supports it, and pin the model version. Then gate on an aggregate score over a dataset rather than per-call exact output, so a single reworded response doesn't fail the build."
  - q: "Should I call the real model in CI?"
    a: "Mock it for the deterministic layer (parsing, tool dispatch, error handling) so those tests are fast and free. Call the real model only in the eval suite that measures behavior, and run that as a gated job — nightly or on prompt/model changes — because it costs tokens and time."
  - q: "How do I test an agent, not just a single call?"
    a: "Evaluate the trajectory: which tools were called, in what order, with what arguments, and whether it recovered from errors. A correct final answer reached by a broken path will break on the next input. Assert on the sequence of tool calls and on intermediate state, plus the final output."
howtoSteps:
  - name: "Split the app into a deterministic layer and a model-behavior layer"
    text: "Separate the code around the model (prompt assembly, parsing, tool dispatch, retrieval) from the model's output itself. The first is ordinary software; the second needs evals."
  - name: "Unit-test the deterministic layer with the model mocked"
    text: "Stub the LLM client to return canned responses, including malformed ones, and assert your parsing, validation, retries, and tool routing behave correctly. These tests are fast, free, and exact."
  - name: "Build a golden dataset for model behavior"
    text: "Collect representative inputs with expected behavior — required fields, expected substrings, an ideal answer, or a rubric. Freeze it and version it in the repo."
  - name: "Layer assertions cheapest-first"
    text: "Validate structure with schema/regex, then check semantic similarity against a reference, then use an LLM-as-judge with an explicit rubric only for subjective quality."
  - name: "Pin a baseline and gate CI on the score"
    text: "Set temperature to 0, pin model and seed, record the baseline score per metric, and fail the build when a prompt or model change drops the aggregate below threshold."
keywords: ["testing llm applications", "llm eval testing", "non-deterministic testing", "llm-as-judge", "agent trajectory evaluation", "prompt regression testing"]
---

**You cannot `assertEqual` an LLM. The fix is to split your app into a deterministic layer you test like normal code and a model-behavior layer you test with evals over a frozen golden dataset — validating structure deterministically, judging subjective quality with a rubric, pinning a baseline, and gating CI on the score instead of exact strings.**

## Why traditional assertions break

A unit test rests on one assumption: same input, same output. LLM calls violate it. The same prompt yields different wordings across runs, across temperatures, and across model versions — all of which can be correct. `assertEqual(output, "The capital is Paris.")` fails when the model returns "Paris is the capital." So engineers do one of two bad things: delete the assertion (now the test proves nothing) or pin the exact string (now the test is flaky and breaks on the next model bump).

The way out is to stop asserting on the *text* and start asserting on *properties* of the text — and to test most of your application without calling the model at all.

## The testing pyramid for LLM apps

Picture the classic pyramid, re-labeled:

- **Wide base — deterministic unit tests (fast, free, exact).** Everything around the model: prompt assembly, output parsing, JSON/[structured-output](/glossary/structured-output) handling, tool dispatch, retries, retrieval, and error paths. This is plain code. Mock the model and test it exhaustively.
- **Middle — eval-based behavior tests (scored, gated).** Does the model actually do the task well? Run a [golden dataset](/glossary/eval-dataset) through the real model and score it. This is where [LLM evals](/guides/evaluation/write-llm-evals) live.
- **Narrow top — a few end-to-end tests.** The whole pipeline against the live model on a handful of critical flows. Expensive and slowest, so keep it small.

The common mistake is inverting this: routing every test through the live model. You get a slow, costly, flaky suite that still doesn't measure quality because each case is a single non-deterministic sample.

## Mock the model for the deterministic layer

Most bugs in LLM apps aren't in the model — they're in your code's reaction to the model. A field renamed in the JSON, a markdown fence the parser didn't strip, a tool called with the wrong argument shape, a missing retry on a truncated response.

Stub the LLM client and feed it canned outputs — *including the ugly ones*: malformed JSON, an empty string, a refusal, a response that's 2x your token budget. Then assert your code does the right thing. These tests are deterministic, run in milliseconds, and cost nothing, so they belong on every commit.

## Assertion strategies, cheapest first

For the behavior layer, layer your checks from cheap-and-strict to expensive-and-fuzzy:

1. **Schema / structure validation.** Does it parse? Are required fields present and correctly typed? Use zod/Pydantic. This catches the most failures for zero model calls.
2. **Contains / regex / set membership.** Expected substring present, forbidden content absent, value within an enum or numeric range. Great for extraction and classification.
3. **Semantic similarity.** Compare the output to a reference answer via an [embedding](/glossary/embedding) and [cosine similarity](/glossary/cosine-similarity) above a threshold. Tolerant of rewording, but a blunt instrument — it measures "close in meaning," not "correct."
4. **[LLM-as-judge](/glossary/llm-as-judge).** A second model scores subjective qualities (helpfulness, tone, faithfulness) against an explicit rubric. Use it only when the first three can't express what "good" means. Pin the judge model and version it; judges drift and are themselves non-deterministic, so calibrate against human-labeled cases.

Reach for the lowest tier that captures the requirement. If "good" means "valid JSON with these fields," you don't need a judge.

## Golden datasets and regression testing

The single most valuable testing artifact is a **frozen, versioned dataset** of representative inputs with expected behavior — committed to the repo and changed only on purpose. With it, any prompt edit or model upgrade becomes a measurable diff against a recorded **baseline**.

The failure mode this kills: you tweak a prompt, the three examples you eyeballed look better, you ship — and twenty cases you didn't look at silently regressed. The [prompt-regression-tester](/skills/data/prompt-regression-tester) skill scaffolds exactly this harness: a fixed eval set, checkable assertions, and a baseline diff so "I improved the prompt" is a number, not a vibe.

Seed the dataset from real production traffic and, critically, from past incidents — every bug becomes a permanent regression case.

## Pin what you can; version the prompt

You can't make generation fully deterministic, but you can cut the variance:

- Set [temperature](/glossary/temperature) to 0 for tests so sampling is as stable as the provider allows.
- Pin the **model version** explicitly (`-2026-xx-xx`, not a floating alias) — a silent model swap is a silent behavior change.
- Use a **seed** if the provider supports it.

Treat the [prompt](/glossary/prompt-template) and [system prompt](/glossary/system-prompt) as versioned artifacts under test, not strings buried in code. When the prompt changes, the eval suite reruns and the baseline diff tells you whether it helped or hurt.

## Test agent trajectories, not just answers

For [agents](/glossary/ai-agent), the final answer is the tip of the iceberg. An agent that lands on the right answer by calling the wrong tool, in the wrong order, with malformed arguments, will fail on the next input. Evaluate the **trajectory**:

- Which tools were called, in what order, with what arguments (see [production tool calling](/guides/concepts/production-tool-calling)).
- Whether it recovered from a tool error instead of looping or hallucinating.
- Intermediate state at each step — not only the last message.

The [agent-trajectory-evaluator](/skills/data/agent-trajectory-evaluator) skill formalizes this: assert on the sequence of tool calls and intermediate decisions alongside the final output.

## Gate CI on the score

Wire the eval suite into CI as a **gated job**: it computes an aggregate score per metric and fails the build when a change drops below the committed baseline (allow a small tolerance for judge noise). Because real-model evals cost tokens and time, run the deterministic unit tests on every commit and the eval suite on prompt/model changes or nightly — not on every push.

A green build then means something concrete: the deterministic layer is correct, *and* model behavior hasn't regressed below the bar you agreed to defend.

## The procedure, end to end

1. **Split** the app into a deterministic layer and a model-behavior layer.
2. **Unit-test** the deterministic layer with the model mocked, including malformed responses.
3. **Build** a frozen, versioned golden dataset of inputs and expected behavior.
4. **Layer assertions** cheapest-first: schema/regex, then semantic similarity, then LLM-as-judge.
5. **Pin a baseline** (temperature 0, pinned model/seed) and **gate CI** on the aggregate score.

Do these five and your LLM feature stops being a thing you hope works and becomes a thing you can prove works — and keep proving as models change underneath you.