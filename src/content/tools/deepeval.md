---
name: "DeepEval"
title: "DeepEval"
description: "An open-source evaluation framework for LLM apps — 'Pytest for LLMs' with ready-made metrics and CI integration."
url: "https://deepeval.com"
date: 2026-06-03
pricing: "open-source"
category: "evaluation"
repo: "https://github.com/confident-ai/deepeval"
license: "Apache-2.0"
sameAs: ["https://github.com/confident-ai/deepeval", "https://docs.confident-ai.com"]
color: "purple"
topics: ["llm-evals"]
tags: ["evals", "testing", "rag", "open-source", "python"]
featured: false
alternativeTo: ["ragas", "promptfoo"]
summary: "DeepEval is an open-source Python framework that brings unit-testing ergonomics to LLM evaluation. It ships research-backed metrics (G-Eval, faithfulness, answer relevancy, hallucination, RAG and agent metrics) you assert on like pytest, so eval becomes a CI gate instead of a vibe check."
related: ["ragas", "best-llm-eval-tools-2026", "write-llm-evals", "llm-eval-suite-scaffolder", "run-evals"]
faq:
  - q: "What is DeepEval?"
    a: "DeepEval is an open-source evaluation framework that makes testing an LLM application feel like writing unit tests. You write test cases with inputs and expected behavior, attach research-backed metrics — G-Eval, faithfulness, answer relevancy, hallucination, plus RAG and agent/tool-use metrics — and assert that the scores clear a threshold, pytest-style."
  - q: "Is DeepEval free?"
    a: "Yes — DeepEval is free and open source under Apache-2.0. You bring an LLM provider for the judge-based metrics, so those incur token cost; the optional Confident AI cloud adds hosted reporting, dashboards, and dataset management."
  - q: "How do I use DeepEval?"
    a: "Define an LLMTestCase, attach metrics like AnswerRelevancyMetric(threshold=0.7), and call assert_test — then run the suite from the CLI and wire deepeval test run into CI so a build fails when a metric regresses. Start with 15–30 representative cases, including the adversarial ones that broke before."
  - q: "DeepEval vs RAGAS?"
    a: "DeepEval is a general LLM eval framework with pytest ergonomics that includes RAG metrics like contextual precision and recall. RAGAS is the RAG-specific metric set — compare the two if retrieval evaluation is your main need."
---

DeepEval is an open-source evaluation framework that makes testing an LLM application feel like writing unit tests. If you know `pytest`, you already know the shape: you write test cases with inputs and expected behavior, attach metrics, and assert that the scores clear a threshold — except the "assertions" are research-backed LLM metrics rather than exact-match checks.

It is aimed at engineers who want evaluation to be a repeatable, automatable gate rather than a one-off spreadsheet. DeepEval runs locally, integrates with CI, and pairs with the Confident AI platform if you want hosted dashboards and dataset management.

## Highlights

- **Pytest-style API** — define test cases, attach metrics, and `assert_test`; run the whole suite from the CLI or CI.
- **Ready-made metrics** — G-Eval (LLM-as-judge with custom rubrics), faithfulness, answer relevancy, hallucination, plus **RAG metrics** (contextual precision/recall) and agent/tool-use metrics.
- **Custom metrics** — define your own LLM-as-judge or deterministic metrics when the built-ins don't fit.
- **Synthetic data & datasets** — generate test cases and manage evaluation datasets.
- **CI-native** — fail a build when a metric regresses, so prompt or model changes are scored, not guessed.

## In an AI-assisted workflow

```python
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric

def test_answer_is_relevant():
    case = LLMTestCase(input="How do I rotate API keys?", actual_output=app(query))
    assert_test(case, [AnswerRelevancyMetric(threshold=0.7)])
```

> [!TIP]
> Start with 15–30 representative cases (include the adversarial ones that broke before), pick the two or three metrics your feature is actually graded on, and wire `deepeval test run` into CI before tuning prompts.

## Good to know

DeepEval is free and open source (Apache-2.0); you bring an LLM provider for the judge metrics, so those incur token cost. The optional Confident AI cloud adds hosted reporting and collaboration. For a RAG-specific metric set, compare with [RAGAS](/tools/ragas); for the full landscape see [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026).
