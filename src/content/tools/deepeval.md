---
name: "DeepEval"
title: "DeepEval"
description: "An open-source Python framework for evaluating LLM apps: pytest-style tests, ready-made metrics for RAG, agents, chat and voice, and a CLI that gates CI."
url: "https://deepeval.com"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "evaluation"
repo: "https://github.com/confident-ai/deepeval"
license: "Apache-2.0"
sameAs: ["https://github.com/confident-ai/deepeval", "https://docs.confident-ai.com"]
color: "purple"
topics: ["llm-evals"]
audience: ["ai-engineers"]
tags: ["evals", "testing", "rag", "open-source", "python"]
featured: false
alternativeTo: ["ragas", "promptfoo"]
summary: "DeepEval is an Apache-2.0 Python framework that makes LLM evaluation look like unit testing: write an LLMTestCase, attach metrics such as G-Eval, faithfulness or task completion, and run deepeval test run so a failing score fails the build. It covers RAG, agents, multi-turn chat and voice. Confident AI is the optional paid cloud from the same company."
related: ["tool:ragas", "guide:best-llm-eval-tools-2026", "guide:write-llm-evals", "skill:llm-eval-suite-scaffolder", "command:run-evals"]
faq:
  - q: "Is DeepEval free?"
    a: "Yes. DeepEval is open source under Apache-2.0 and runs on your machine. Most metrics use an LLM as the judge, so you pay your model provider for those calls. Confident AI, the hosted platform from the same company, is separate: as of November 2026 it has a free tier limited to 2 seats, 1 project and 5 test runs a week, then Starter at $200 a month and Team at $2,000 a month."
  - q: "How do I use DeepEval?"
    a: "Run pip install -U deepeval (Python 3.10 or later), write a test file with an LLMTestCase and one or more metrics, call assert_test, and run deepeval test run test_file.py. Every metric returns a score from 0 to 1 and passes or fails against its threshold. Set OPENAI_API_KEY for the default judge, or configure another model."
  - q: "Do I need a Confident AI account to use DeepEval?"
    a: "No. The README calls creating an account highly recommended, and deepeval login sends test results to Confident AI for shareable reports, but the metrics and the test runner work without it. If your test data is sensitive, skip the login step and results stay local."
  - q: "DeepEval vs RAGAS?"
    a: "DeepEval is a general evaluation framework with pytest ergonomics that covers RAG, agents, chat, voice and safety metrics. RAGAS is a narrower library focused on RAG metrics. DeepEval also ships a RAGAS metric that averages answer relevancy, faithfulness, contextual precision and contextual recall. Our DeepEval vs RAGAS comparison goes into the differences."
---

DeepEval is an open-source evaluation framework, built by Confident AI, that makes testing an LLM application feel like writing unit tests. If you know `pytest`, you know the shape: a test case holds the input and your app's actual output, you attach metrics, and `assert_test` fails when a score falls below its threshold. The difference is that the assertions are LLM-as-a-judge and statistical metrics instead of exact-match checks.

It is aimed at engineers who want evaluation to be a repeatable gate in CI, not a spreadsheet. The library runs locally, is licensed Apache-2.0, and has about 19,700 GitHub stars as of November 2026.

## Highlights

- **Pytest-style API.** `LLMTestCase` plus `assert_test`, run with `deepeval test run`. Each metric scores from 0 to 1 and comes with an explanation of the score.
- **Custom metrics.** G-Eval scores any criteria you describe in plain language. DAG builds a deterministic, graph-based judge when you need repeatable decisions. JevEval is a newer custom metric scored by a model that returns probabilities.
- **RAG metrics.** Answer relevancy, faithfulness, contextual recall, contextual precision and contextual relevancy.
- **Agent metrics.** Task completion, tool correctness, argument correctness, step efficiency, plan adherence and plan quality, plus metrics for MCP use.
- **Conversation and voice.** Multi-turn metrics such as knowledge retention and role adherence, and voice-agent metrics such as turn-taking naturalness and transcription accuracy, with connectors for Vapi, ElevenLabs, LiveKit and Pipecat.
- **Component-level evals.** Evaluate the whole app as a black box, or trace it and score individual LLM calls, tool calls and retrieval steps. Integrations cover LangChain, LangGraph, Pydantic AI, CrewAI, LlamaIndex, the OpenAI Agents SDK and others.
- **Datasets and benchmarks.** Generate single-turn and multi-turn synthetic datasets, and run public benchmarks such as MMLU, HumanEval and GSM8K against any model.

## In an AI-assisted workflow

The first test from DeepEval's README:

```bash
pip install -U deepeval
export OPENAI_API_KEY="..."
```

```python
# test_ai_agent.py
from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, SingleTurnParams

def test_case():
    correctness_metric = GEval(
        name="Correctness",
        criteria="Determine if the 'actual output' is correct based on the 'expected output'.",
        evaluation_params=[SingleTurnParams.ACTUAL_OUTPUT, SingleTurnParams.EXPECTED_OUTPUT],
        threshold=0.5,
    )
    test_case = LLMTestCase(
        input="What if these shoes don't fit?",
        # replace with the real output from your application
        actual_output="You have 30 days to get a full refund at no extra cost.",
        expected_output="We offer a 30-day full refund at no extra costs.",
    )
    assert_test(test_case, [correctness_metric])
```

```bash
deepeval test run test_ai_agent.py
```

Run the same command in CI and a metric that misses its threshold fails the test run, so a prompt or model change is scored before it merges.

> [!TIP]
> Start with 15 to 30 representative cases, including the inputs that broke before, and two or three metrics your feature is actually judged on. A suite of twenty metrics on every case is slow, expensive and hard to read.

## Good to know

- **Judge cost and variance.** LLM-judged metrics cost tokens on every case and can score the same output differently between runs. Pin the judge model, set thresholds with some margin, and use DAG or code-based checks where you need determinism.
- **Python only.** The framework requires Python 3.10 or later. For a language-neutral YAML workflow, promptfoo is the usual alternative.
- **Version churn.** The current release is 4.3.6 as of November 2026. Class names have changed between major versions (the README now imports `SingleTurnParams`), so older tutorials may not run unmodified.
- **The cloud is optional and separate.** Confident AI adds hosted reports, tracing, datasets and production monitoring. As of November 2026 its plans are Free ($0, 2 seats, 1 project, 5 test runs a week), Starter at $200 a month, Team at $2,000 a month, and custom Enterprise pricing.

Against the alternatives: [RAGAS](/tools/ragas) is the focused choice when retrieval quality is your only question ([DeepEval vs RAGAS](/guides/comparisons/deepeval-vs-ragas)). [promptfoo](/tools/promptfoo) is a YAML-driven CLI that compares prompts and models side by side and adds red teaming. [Braintrust](/tools/braintrust) is a hosted platform with a UI for experiments and production traces. To design the suite itself, read [how to write LLM evals](/guides/evaluation/write-llm-evals), or see the full field in [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026).
