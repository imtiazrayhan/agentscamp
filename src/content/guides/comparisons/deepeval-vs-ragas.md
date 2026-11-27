---
title: "DeepEval vs RAGAS: LLM Evaluation Frameworks Compared (2026)"
description: "DeepEval vs RAGAS with the same RAG test case written in both, a metric-by-metric mapping table, licences, versions, and when to run each. Checked Nov 2026."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["llm-evals"]
audience: ["developers"]
tags: ["comparison", "deepeval", "ragas", "evals", "versus"]
featured: false
summary: "Use DeepEval when you want evals that fail a build: it wraps metrics in pytest (or Vitest) tests with thresholds. Use Ragas when you want scores to study: its metrics are plain scorer objects you call on a sample. The four core RAG metrics exist in both, under slightly different names."
keyTakeaways:
  - "DeepEval's unit is a test case asserted against metrics with a pass threshold, run with `deepeval test run`. Ragas's unit is a metric object you call with `ascore()` to get a number."
  - "Faithfulness, answer relevancy, context precision and context recall exist in both; DeepEval prefixes the retrieval ones with \"Contextual\"."
  - "Both are Apache-2.0 Python libraries. DeepEval also ships a TypeScript package that plugs into Vitest."
  - "Ragas is no longer RAG-only: its metric list includes tool-call accuracy, agent goal accuracy, SQL equivalence and non-LLM scores such as BLEU and ROUGE."
  - "Ragas is mid-migration: metrics imported from `ragas.metrics.collections` are the current API, and the older pattern is marked legacy for removal in 1.0."
faq:
  - q: "Can DeepEval replace RAGAS for RAG evaluation?"
    a: "For a CI gate, yes. DeepEval has its own faithfulness, answer relevancy, contextual precision, contextual recall and contextual relevancy metrics, so you do not need Ragas installed to score a RAG pipeline. Ragas still has metrics DeepEval's RAG set does not name, such as noise sensitivity and context entities recall, and non-LLM variants that score retrieval without a judge model."
  - q: "Do the same-named metrics give the same score in both?"
    a: "No. The definitions are close, but each library uses its own prompts and scoring steps, and you may be running a different judge model in each. A 0.8 faithfulness in one is not a 0.8 in the other. Pick one implementation per metric, fix the judge model, and compare runs only against earlier runs of the same setup."
  - q: "Which judge model do they use?"
    a: "Whichever you configure. DeepEval's quickstart reads an `OPENAI_API_KEY` by default and each metric takes a `model` argument or a custom model class. Ragas has you build the judge explicitly with `llm_factory` and pass it to the metric. Either way you pay your model provider for every scored sample, so budget for it on large test sets."
  - q: "Where is the RAGAS repository now?"
    a: "At github.com/vibrantlabsai/ragas. The older explodinggradients/ragas address redirects there. The PyPI package is still `ragas`, and the docs are at docs.ragas.io."
related: ["tool:deepeval", "tool:ragas", "guide:best-llm-eval-tools-2026", "guide:write-llm-evals", "glossary:llm-as-judge", "skill:llm-eval-suite-scaffolder", "command:run-evals"]
sources:
  - title: "DeepEval repository"
    url: "https://github.com/confident-ai/deepeval"
    publisher: "Confident AI"
  - title: "DeepEval RAG evaluation quickstart"
    url: "https://deepeval.com/docs/getting-started-rag"
    publisher: "Confident AI"
  - title: "DeepEval: Introduction to LLM evaluation metrics"
    url: "https://deepeval.com/docs/metrics-introduction"
    publisher: "Confident AI"
  - title: "deepeval on PyPI"
    url: "https://pypi.org/project/deepeval/"
    publisher: "PyPI"
  - title: "Ragas repository"
    url: "https://github.com/vibrantlabsai/ragas"
    publisher: "Vibrant Labs"
  - title: "Ragas: List of available metrics"
    url: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/"
    publisher: "Vibrant Labs"
  - title: "Ragas: Faithfulness"
    url: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/"
    publisher: "Vibrant Labs"
  - title: "ragas on PyPI"
    url: "https://pypi.org/project/ragas/"
    publisher: "PyPI"
---

[DeepEval](/tools/deepeval) and [Ragas](/tools/ragas) overlap more than their reputations suggest. Both are open-source Python libraries that score LLM output with [LLM-as-judge](/glossary/llm-as-judge) metrics, and both cover the core [RAG](/glossary/rag) measurements. The difference is the shape of the API: DeepEval gives you tests that pass or fail, Ragas gives you scorers that return numbers.

## The short answer

- **You want a failing eval to block a pull request**: DeepEval.
- **You are tuning retrieval and want per-sample scores in a notebook or CSV**: Ragas.
- **You need to score retrieval without paying for a judge model**: Ragas, which has non-LLM context metrics and classic string scores.
- **Your team writes TypeScript**: DeepEval, which has a Vitest integration.
- **You are shipping a RAG product**: many teams use Ragas while tuning, then put the metrics they settled on behind a DeepEval gate. One library is also fine.

## At a glance

| | DeepEval | Ragas |
| --- | --- | --- |
| Maintainer | Confident AI | Vibrant Labs |
| Licence | Apache-2.0 | Apache-2.0 |
| Latest PyPI release | 4.3.6 (November 25, 2026) | 0.4.4 (November 14, 2026) |
| Python requirement | 3.10+ | 3.9+ |
| GitHub stars (November 2026) | About 19,700 | About 16,400 |
| Languages | Python (pytest), TypeScript (Vitest) | Python |
| Core unit | `LLMTestCase` + metrics + `assert_test()` | Metric object + `ascore()` / `score()` |
| Pass/fail | Built in: each metric has a `threshold` | You compare the returned value yourself |
| Runner | `deepeval test run file.py` | Plain Python; `ragas quickstart` scaffolds a project |
| Custom criteria | G-Eval, DAG metric | Aspect critic, rubric-based scoring |
| Synthetic test data | Golden Synthesizer (from documents or contexts) | `TestsetGenerator`, built on a knowledge graph of your documents |
| Hosted companion | Confident AI platform (optional, via `deepeval login`) | None required |

DeepEval's docs count "50+" ready-made metrics across RAG, agents, chatbots and safety. Ragas's list is shorter and organized by task: RAG, agents and tool use, natural-language comparison, SQL, general purpose and summarization.

## The same RAG check in both

The case: a user asks about a refund policy, the retriever returns one chunk, and you want to know whether the answer is grounded in that chunk. The data is fictional.

**DeepEval**, as a pytest file:

```python
# test_rag.py
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric


def test_refund_answer():
    test_case = LLMTestCase(
        input="What if these shoes don't fit?",
        actual_output="We offer a 30-day full refund at no extra cost.",
        retrieval_context=[
            "All customers are eligible for a 30 day full refund at no extra cost."
        ],
    )
    assert_test(
        test_case=test_case,
        metrics=[AnswerRelevancyMetric(), FaithfulnessMetric(threshold=0.7)],
    )
```

```bash
pip install -U deepeval
export OPENAI_API_KEY="sk-..."   # default judge; any model can be configured
deepeval test run test_rag.py
```

The test fails if faithfulness scores under 0.7. DeepEval's docs recommend `deepeval test run` over plain `pytest` because it adds eval-specific flags on top.

**Ragas**, as a script:

```python
# score_rag.py
import asyncio

from openai import AsyncOpenAI
from ragas.llms import llm_factory
from ragas.metrics.collections import Faithfulness


async def main():
    llm = llm_factory("gpt-4o-mini", client=AsyncOpenAI())
    scorer = Faithfulness(llm=llm)

    result = await scorer.ascore(
        user_input="What if these shoes don't fit?",
        response="We offer a 30-day full refund at no extra cost.",
        retrieved_contexts=[
            "All customers are eligible for a 30 day full refund at no extra cost."
        ],
    )
    print(f"Faithfulness: {result.value}")


asyncio.run(main())
```

```bash
pip install ragas
python score_rag.py
```

Ragas prints a score and stops. Deciding that 0.7 is the bar, and failing a build on it, is code you write. The field names also differ: `input` / `actual_output` / `retrieval_context` in DeepEval, `user_input` / `response` / `retrieved_contexts` in Ragas. Keep a small adapter if you feed one dataset to both.

## Metric-by-metric mapping

| What it measures | DeepEval | Ragas | Needs a reference answer |
| --- | --- | --- | --- |
| Is the answer grounded in the retrieved chunks? | `FaithfulnessMetric` | `Faithfulness` | No |
| Does the answer address the question? | `AnswerRelevancyMetric` | `AnswerRelevancy` (listed as Response Relevancy) | No |
| Are relevant chunks ranked above irrelevant ones? | `ContextualPrecisionMetric` | `ContextPrecision` | Yes (`expected_output` / `reference`) |
| Did retrieval fetch everything the ideal answer needs? | `ContextualRecallMetric` | `ContextRecall` | Yes |
| Is the retrieved context on topic for the question? | `ContextualRelevancyMetric` | Context Relevance (in the Nvidia metrics group) | No |
| Does the answer hold up when irrelevant chunks are added? | No direct equivalent | Noise Sensitivity | Yes |
| Do retrieved chunks contain the entities in the reference? | No direct equivalent | Context Entities Recall | Yes |
| Does the answer match the reference on facts? | G-Eval with a correctness criterion | Factual Correctness | Yes |
| Custom yes/no or rubric judgment | `GEval`, `DAGMetric` | Aspect critic, rubrics-based scoring | Depends |
| Agent tool use | Agent metrics such as `TaskCompletionMetric` | Tool call accuracy, tool call F1, agent goal accuracy | Varies |
| No-LLM scoring | Build your own on `BaseMetric` | Non-LLM context recall, BLEU, ROUGE, CHRF, exact match | Yes |

Two things worth knowing from the Ragas docs. Answer relevancy is not a pure judge score: the model generates questions from the answer, and the score is the cosine similarity between their embeddings and the original question, so you also need an embedding model. And context precision has several variants, including ones that judge against the response when you have no reference.

## Where each one loses

**DeepEval**

- The test-first framing is heavier than you need for exploration. To look at a distribution of scores across 500 samples you use `evaluate()` and export, not the pytest path.
- Several features lead toward the Confident AI platform (`deepeval login`, hosted reports). The library works without it, but expect the prompts.
- It releases often: PyPI was at 4.3.6 on the day this was checked while the latest tagged GitHub release was 4.2.4. Pin a version in CI.

**Ragas**

- No pass/fail or test runner of its own. You bring pytest, a threshold and the glue.
- The API is in transition. Metric pages show the collections-based API first and keep a "Legacy Metrics API" section that the docs say will be removed in 1.0. Tutorials still use the older `evaluate()` call with `EvaluationDataset`, so examples you find online may mix the two.
- Still pre-1.0 by version number, so minor releases can change behaviour.
- Python only.

Both share the limits of any judge-based metric: scores vary between runs, depend on the judge model, and cost a model call or several per sample. Treat them as relative signals. Fix the judge model, spot-check a sample against human labels before trusting a threshold, and compare runs only with earlier runs of the same setup.

## How to choose

Ask what happens to the number after it is computed.

If it should stop a merge, start with DeepEval. A test file, a threshold per metric and `deepeval test run` in a workflow step is the whole integration, and the [run-evals](/commands/testing/run-evals) command assumes that layout.

If it should inform a decision about chunk size, top-k or a reranker, start with Ragas. Call the scorers over your samples, keep the per-sample values, and look at where context recall and faithfulness disagree. Low recall with high faithfulness is a retrieval problem. High recall with low faithfulness is a generation problem. That split is what you need while tuning [hybrid search](/guides/concepts/hybrid-search-reranking) and [reranking](/glossary/reranking).

If you have no test set yet, that is the real blocker in either library. Both can generate one from your documents, but generated questions need a human pass before they are worth gating on. [Write Evals for an LLM App](/guides/evaluation/write-llm-evals) covers building the dataset, and the [llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder) skill sets up the files. For the hosted platforms that sit above these libraries (LangSmith, Langfuse, Braintrust, Phoenix), see [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026).
