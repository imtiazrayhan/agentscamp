---
title: "LLM Evaluation Metrics Explained: Which One to Use and When"
description: "A practical map of LLM and RAG evaluation metrics — why BLEU/ROUGE fail open-ended text, how LLM-as-judge and RAG metrics work, and which to pick per task."
author: "AgentsCamp"
date: 2026-06-17
color: "green"
topics: ["llm-evals"]
tags: ["evals", "metrics", "rag", "llm-as-judge", "retrieval"]
related:
  - "guide:write-llm-evals"
  - "guide:best-llm-eval-tools-2026"
  - "glossary:llm-as-judge"
  - "glossary:eval-dataset"
  - "glossary:grounding"
featured: false
summary: "There is no single LLM metric — you pick one that matches the task. Use exact match and F1 for closed tasks like extraction and routing, retrieval metrics (recall@k, MRR, NDCG) for the retriever, RAG metrics (faithfulness, answer relevance, context precision/recall) for grounded answers, and a calibrated LLM-as-judge or human preference for open-ended generation."
keyTakeaways:
  - "Match the metric to the task: closed tasks get exact match/F1, retrieval gets recall@k/MRR/NDCG, open generation gets LLM-as-judge or human preference."
  - "BLEU/ROUGE/exact-match reward surface overlap, not meaning — they punish correct paraphrases and miss subtle errors in open-ended text."
  - "Decompose RAG into retrieval and generation: faithfulness catches hallucination, context recall catches missing evidence, answer relevance catches off-topic answers."
  - "LLM-as-judge scales subjective scoring but has real biases (position, length, self-preference) and is non-deterministic — calibrate it against human labels first."
  - "Every metric needs a labeled eval set with known-correct answers; without it you are measuring nothing."
faq:
  - q: "Why are BLEU and ROUGE bad for evaluating LLMs?"
    a: "BLEU and ROUGE measure n-gram overlap against a reference string. They were built for machine translation and summarization where outputs are constrained. For open-ended generation a model can be completely correct while sharing few words with the reference (a valid paraphrase scores low), or wrong while sharing many (a fluent hallucination scores high). They have weak correlation with human judgments on free-form text, so use them only for tightly templated outputs, if at all."
  - q: "What metrics should I use to evaluate a RAG system?"
    a: "Decompose it. For retrieval, use recall@k and MRR or NDCG to check whether the right passages are fetched and ranked highly. For generation, use faithfulness/groundedness (is every claim supported by retrieved context?), answer relevance (does it address the question?), and context precision/recall (is the retrieved context on-point and complete?). Faithfulness and context recall together separate a retrieval problem from a generation problem."
  - q: "Is LLM-as-judge reliable enough to trust?"
    a: "Conditionally. It scales subjective scoring far cheaper than humans, but it has measurable biases — position bias (favoring the first answer in pairwise comparisons), length bias (preferring longer answers), and self-preference (favoring its own model family) — and it is non-deterministic. Make it reliable with an explicit rubric, a small discrete scale, randomized answer order, low temperature, and validation against human labels before you trust the numbers."
  - q: "When should I use human evaluation instead of automated metrics?"
    a: "Use humans to establish ground truth and to settle judgments that automated metrics cannot, such as taste, tone, safety nuance, and domain correctness. The efficient pattern is to human-label a few hundred cases once, use that set to calibrate an LLM judge or train automated checks, then run cheap automated metrics in CI and reserve fresh human review for periodic audits and ambiguous cases."
---

**There is no single "LLM accuracy" metric — you choose one that matches the shape of the task, and most real systems need three or four at once.** The mistake that wastes the most time in evaluation is reaching for a familiar number (BLEU, a single accuracy percentage) that has nothing to do with what the feature is actually graded on. This guide maps the metrics that matter, what each one catches, and where each one lies to you. For the surrounding workflow — building a dataset, baselining, and gating CI — see [Write Evals for an LLM App](/guides/evaluation/write-llm-evals).

## First, classify the task

Every metric assumes a task type. Sort your feature into one of these before picking anything:

- **Closed / verifiable** — extraction, classification, routing, structured output, math. There is a known-correct answer.
- **Retrieval** — a search or RAG retriever returning a ranked list of passages.
- **Grounded generation** — a RAG answer that must stay faithful to retrieved context.
- **Open-ended generation** — summaries, rewrites, chat, creative or advisory text with many acceptable answers.

The harder the task is to verify deterministically, the more you lean on judges and humans — and the more an [eval dataset](/glossary/eval-dataset) of labeled examples matters.

## Why classic NLP metrics are weak

BLEU, ROUGE, and exact-match all reward **surface overlap with a reference string**, not meaning. That worked when outputs were constrained (translation, headline summarization). For open-ended text it breaks two ways:

- A correct paraphrase that shares few words scores low (false negative).
- A fluent [hallucination](/glossary/hallucination) that reuses the question's vocabulary scores high (false positive).

Exact-match is binary and brutal: "$1,200.00" vs "1200 dollars" is a miss. These metrics are fine for genuinely templated outputs and as a cheap sanity check, but they correlate poorly with human judgment on free-form generation. Do not ship a chat or summarization feature gated on ROUGE alone.

One classic metric is deliberately absent here: [perplexity](/glossary/perplexity) measures how well a model *intrinsically* predicts text, which is useful for comparing base models and quantization trade-offs — but it says nothing about whether your feature's output is correct, so it has no place in a task-quality eval.

## Reference-based vs reference-free

Two families:

- **Reference-based** metrics compare the output to a gold answer you wrote (exact match, F1, BLEU/ROUGE, semantic similarity). They need labeled data but give a stable target.
- **Reference-free** metrics judge the output against the input or context with no gold answer (faithfulness, answer relevance, most LLM-as-judge rubrics). They scale to cases where writing a single correct answer is impossible.

Most production stacks mix both: reference-based for the verifiable slice, reference-free for the open slice. Wiring these metrics into a repeatable test suite is its own discipline — see [Testing LLM Applications](/guides/testing/testing-llm-applications).

## Closed tasks: precision, recall, F1, exact match

For extraction, classification, and routing, treat it as a classification problem:

- **Precision** — of what the model returned, how much was correct (penalizes false positives).
- **Recall** — of what should have been returned, how much it caught (penalizes false negatives).
- **F1** — their harmonic mean, the default when both matter.
- **Exact match / accuracy** — for single-label routing or fully constrained outputs.

Pick based on cost asymmetry: a PII-redaction system optimizes recall (a miss is a leak); a routing layer that triggers expensive actions optimizes precision. These metrics are deterministic and cheap, so prefer them over any judge whenever the task fits.

## Retrieval metrics: recall@k, MRR, NDCG

Before grading a RAG answer, grade the retriever — answer quality is capped by retrieval quality.

- **Recall@k** — is the relevant passage in the top *k*? The single most important RAG retrieval metric; if it's low, no prompting fixes the answer.
- **MRR (Mean Reciprocal Rank)** — how high the first relevant result lands; good when one right passage is enough.
- **NDCG** — rank-weighted relevance across the whole list; use it when multiple passages matter and order matters (e.g., before [reranking](/glossary/reranking)).

Tune *k* to your context budget, then measure recall@k at that *k*. This is where [hybrid search and reranking](/guides/concepts/hybrid-search-reranking) earn or lose their keep.

## RAG generation metrics

Once retrieval is solid, decompose the answer:

- **Faithfulness / [groundedness](/glossary/grounding)** — is every claim supported by the retrieved context? This is your hallucination detector. Typically scored by an LLM judge that checks each claim against the passages.
- **Answer relevance** — does the response actually address the question, or wander?
- **Context precision** — is the retrieved context on-point, or padded with noise that distracts the model?
- **Context recall** — does the retrieved context contain everything needed to answer fully?

The diagnostic power is in the split: low context recall is a retriever problem; high context recall but low faithfulness is a generation/prompting problem. Tooling like Ragas and DeepEval implement these directly.

## Open-ended generation: LLM-as-judge and human preference

When there's no gold answer, you have two scalable options.

**[LLM-as-judge](/glossary/llm-as-judge)** comes in two modes:

- **Rubric / pointwise scoring** — the judge rates one output against explicit criteria on a small discrete scale.
- **Pairwise preference** — the judge picks the better of two outputs. More reliable than absolute scores, and the natural fit for comparing model or prompt versions.

The pitfalls are real and must be controlled:

- **Position bias** — favoring the first (or last) answer. Randomize order, or score both orderings and average.
- **Length bias** — preferring longer answers regardless of quality. Anchor the rubric on substance.
- **Self-preference** — judges favor outputs from their own model family. Use a different model as judge where you can.
- **Non-determinism** — set low [temperature](/glossary/temperature), but expect run-to-run variance; report it.

A judge is only trustworthy after you've checked its agreement against human labels. An uncalibrated judge is confident noise.

**Human evaluation** is the ground truth everything else calibrates to. It's slow and expensive, so spend it deliberately: label a few hundred representative cases once, use them to validate the judge, then audit periodically. Pairwise human preference (A vs B) is more consistent than asking humans for absolute 1–10 scores.

## How to choose your metrics

1. **Classify the task** as closed, retrieval, grounded generation, or open-ended — this rules most metrics in or out immediately.
2. **Prefer deterministic checks** (exact match, F1, schema validity) wherever the task allows; they're cheap, stable, and CI-friendly.
3. **For RAG, measure retrieval and generation separately** — recall@k/NDCG for the retriever, faithfulness plus context precision/recall for the answer.
4. **Use an LLM-as-judge only for genuinely subjective criteria**, with an explicit rubric, randomized order, and low temperature.
5. **Validate any judge against human labels** before trusting its scores, and re-check periodically.
6. **Build a labeled eval set** of 20–50+ real cases (oversampling the hard ones) so every metric has ground truth to score against.

Pick the two or three metrics the feature is actually graded on, baseline them, and wire them into CI. More metrics is not more rigor — the right metric on a real dataset is.