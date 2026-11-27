---
name: "RAGAS"
title: "RAGAS"
description: "An open-source Python framework for evaluating RAG pipelines and LLM apps, with metrics that separate retrieval failures from generation failures."
url: "https://docs.ragas.io"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "evaluation"
repo: "https://github.com/vibrantlabsai/ragas"
license: "Apache-2.0"
sameAs: ["https://github.com/vibrantlabsai/ragas"]
color: "green"
topics: ["llm-evals", "rag-retrieval"]
audience: ["ai-engineers"]
tags: ["evals", "rag", "retrieval", "open-source", "python"]
featured: false
alternativeTo: ["deepeval", "promptfoo", "braintrust", "arize-phoenix"]
summary: "Ragas is an Apache-2.0 Python library for scoring RAG pipelines. Metrics such as faithfulness, context precision and context recall show whether a bad answer came from retrieval or from generation, and several need no hand-written reference answer. Install with pip install ragas; most metrics call an LLM as judge, so each run costs tokens."
related: ["tool:deepeval", "guide:best-llm-eval-tools-2026", "guide:how-rag-works", "agent:rag-pipeline-engineer", "tool:langfuse"]
faq:
  - q: "Is RAGAS free?"
    a: "Yes. The library is free and Apache-2.0. The cost is the judge model: most Ragas metrics make one or more LLM calls per sample, so a suite over a few hundred samples with three or four metrics adds up to thousands of calls."
  - q: "Do I need ground-truth answers to use RAGAS?"
    a: "Not for every metric. Faithfulness and response relevancy score a sample from user_input, retrieved_contexts and response alone. Context recall and factual correctness compare against a reference field, so they need a reference answer for each sample. Ragas can also generate a synthetic test set from your documents."
  - q: "Does RAGAS collect telemetry?"
    a: "Yes, by default. The README says Ragas collects minimal, anonymized usage data with no personal or company-identifying information, and that the collection code is open source. Set the RAGAS_DO_NOT_TRACK environment variable to true to opt out."
  - q: "RAGAS vs DeepEval?"
    a: "Ragas specializes in RAG metrics that split retrieval failures from generation failures, plus test-set generation. DeepEval is a general, pytest-style eval framework. Teams often use both: Ragas to diagnose the pipeline, DeepEval when they also want non-RAG metrics inside a test runner."
---

Ragas (often written RAGAS) is an open-source Python framework for evaluating retrieval-augmented generation and other LLM applications, maintained by VibrantLabs. A generic quality score tells you an answer was bad. Ragas tells you which half of the pipeline failed: **retrieval**, where the right passage was never fetched, or **generation**, where the model ignored or contradicted the passage it was given.

The repository lives at `vibrantlabsai/ragas`, is Apache-2.0, and had about 16,400 GitHub stars as of November 2026. The latest release that month was v0.4.4.

## Highlights

- **RAG metrics.** The docs list Context Precision, Context Recall, Context Entities Recall, Noise Sensitivity, Response Relevancy and Faithfulness.
- **Reference-free scoring.** Faithfulness checks the response against the retrieved contexts, so it needs no gold answer. Metrics that need one, such as context recall and factual correctness, read it from the `reference` field.
- **Agent and tool-use metrics.** Topic Adherence, Tool Call Accuracy, Tool Call F1 and Agent Goal Accuracy.
- **Non-LLM metrics.** BLEU, ROUGE, CHRF, exact match, string presence and string similarity, which cost nothing to run.
- **Custom metrics.** Aspect Critic, rubric-based scoring, and `DiscreteMetric`, where you write the judging prompt and the allowed output values.
- **Test data generation.** Builds a knowledge graph from your documents and generates evaluation scenarios for RAG and for agents.
- **Project scaffold.** `ragas quickstart rag_eval` creates a starter RAG evaluation project.

## In an AI-assisted workflow

Each sample is a dict with four fields. `evaluate` takes the dataset, a list of metric objects and a judge model:

```python
# pip install ragas langchain-openai
from langchain_openai import ChatOpenAI
from ragas import EvaluationDataset, evaluate
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import LLMContextRecall, Faithfulness, FactualCorrectness

dataset = [
    {
        "user_input": "Who introduced the theory of relativity?",
        "retrieved_contexts": ["Albert Einstein proposed the theory of relativity."],
        "response": "Albert Einstein introduced the theory of relativity.",
        "reference": "Albert Einstein proposed the theory of relativity.",
    },
]

evaluator_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o"))
result = evaluate(
    dataset=EvaluationDataset.from_list(dataset),
    metrics=[LLMContextRecall(), Faithfulness(), FactualCorrectness()],
    llm=evaluator_llm,
)
print(result)
```

On the docs' five-question sample set this prints `{'context_recall': 1.0000, 'faithfulness': 0.8571, 'factual_correctness': 0.7280}`.

> [!TIP]
> Read the scores as a diagnosis. Low context precision or recall means fix retrieval ([Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking)). High context scores with low faithfulness means fix generation: grounding instructions and citations.

## Good to know

Ragas scores are produced by an LLM judge, so they inherit its variance. The same dataset can score slightly differently between runs or after a judge-model change. Pin the judge model, compare runs made with the same judge, and treat small differences as noise. [LLM-as-judge](/glossary/llm-as-judge) explains the technique and its failure modes.

The API has changed across versions. Older tutorials import lowercase metric instances such as `faithfulness` and use `question`, `answer` and `contexts` columns; current docs use metric classes and the `user_input`, `response`, `retrieved_contexts` and `reference` fields shown above. Check which version a snippet targets before copying it.

Ragas is a library that returns scores; to track them over time, log them to a tracing or experiment tool. Telemetry is on by default; set `RAGAS_DO_NOT_TRACK=true` to disable it.

Alternatives: [DeepEval](/tools/deepeval) is a broader pytest-style framework, [Promptfoo](/tools/promptfoo) is config-driven and suited to CI, and [Langfuse](/tools/langfuse) covers tracing with evals attached. [DeepEval vs RAGAS](/guides/comparisons/deepeval-vs-ragas) compares the first pair, and [How RAG Actually Works](/guides/concepts/how-rag-works) shows where each metric maps onto the pipeline.
