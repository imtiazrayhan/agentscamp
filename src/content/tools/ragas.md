---
name: "RAGAS"
title: "RAGAS"
description: "An open-source framework for evaluating retrieval-augmented generation with reference-free RAG metrics."
url: "https://docs.ragas.io"
date: 2026-06-03
pricing: "open-source"
category: "evaluation"
repo: "https://github.com/explodinggradients/ragas"
license: "Apache-2.0"
sameAs: ["https://github.com/explodinggradients/ragas"]
color: "green"
topics: ["llm-evals", "rag-retrieval"]
tags: ["evals", "rag", "retrieval", "open-source", "python"]
featured: false
alternativeTo: ["deepeval"]
summary: "RAGAS is an open-source framework built specifically to evaluate RAG pipelines. Its metrics — faithfulness, answer relevancy, context precision, and context recall — pinpoint whether failures come from retrieval or generation, many of them reference-free so you can score without gold answers."
related: ["tool:deepeval", "guide:best-llm-eval-tools-2026", "guide:how-rag-works", "agent:rag-pipeline-engineer", "tool:langfuse"]
faq:
  - q: "What is RAGAS?"
    a: "RAGAS is an open-source framework purpose-built for evaluating retrieval-augmented generation. Its metrics — faithfulness, answer relevancy, context precision, and context recall — tell you whether a failure came from retrieval (the right context wasn't fetched) or generation (the model ignored or contradicted the context). Many metrics are reference-free, so you can score without gold answers."
  - q: "Is RAGAS free?"
    a: "Yes — free and open source under Apache-2.0. Its metrics call an LLM as judge, so expect token cost when you run a suite."
  - q: "How do I interpret RAGAS scores?"
    a: "Read them as a diagnosis: low context precision/recall means fix retrieval; high context scores but low faithfulness means fix generation — grounding and citations. Faithfulness is the core hallucination check: whether the answer is actually supported by the retrieved context."
  - q: "RAGAS vs DeepEval?"
    a: "RAGAS specializes in RAG metrics that split retrieval failures from generation failures; DeepEval is a general, pytest-style eval framework. They're often used together — RAGAS for pipeline diagnosis, DeepEval when you also need non-RAG metrics."
---

RAGAS is an open-source framework purpose-built for evaluating retrieval-augmented generation. Generic LLM metrics tell you an answer was bad; RAGAS tells you *why* — whether the **retrieval** half failed (the right context wasn't fetched) or the **generation** half did (the model ignored or contradicted the context it was given). That split is exactly the diagnosis a RAG team needs.

It is aimed at engineers building RAG who want metrics tuned to the pipeline rather than to generic chat. Many of its metrics are **reference-free**, meaning they can score outputs without a hand-written gold answer for every case — which makes building an eval set far cheaper.

## Highlights

- **Faithfulness** — is the answer actually supported by the retrieved context (the core hallucination check)?
- **Answer relevancy** — does the answer address the question?
- **Context precision / recall** — did retrieval surface the right passages, and rank them well?
- **Reference-free options** — score many metrics without gold answers, lowering the cost of an eval set.
- **Integrations** — works with common LLM/orchestration stacks and observability tools.

## In an AI-assisted workflow

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

scores = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_precision])
```

> [!TIP]
> Read the metrics as a diagnosis: low **context precision/recall** means fix retrieval ([Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking)); high context scores but low **faithfulness** means fix generation (grounding and citations).

## Good to know

RAGAS is free and open source (Apache-2.0); its metrics call an LLM as judge, so expect token cost when you run a suite. Use it alongside a general framework like [DeepEval](/tools/deepeval) if you also need non-RAG metrics, and see [How RAG Actually Works](/guides/concepts/how-rag-works) for where each metric maps onto the pipeline.
