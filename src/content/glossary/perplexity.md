---
term: "Perplexity"
description: "Perplexity measures how well a language model predicts a text sample — the exponential of its average per-token negative log-likelihood. Lower is better."
date: 2026-06-17
topics: ["llm-evals"]
tags: ["perplexity", "evaluation", "metrics", "language-modeling"]
related: ["inference", "llm-token", "eval-dataset", "write-llm-evals", "distillation"]
faq:
  - q: "Does lower perplexity mean a better assistant?"
    a: "Not directly. Perplexity only measures how well the model predicts a fixed reference text. A model can have great perplexity on web text and still be unhelpful, untruthful, or bad at your task. Use perplexity for cheap intrinsic checks during training, and task evals for whether the product actually works."
  - q: "Can I compare perplexity across two different models?"
    a: "Only if they share the same tokenizer and you measure on the exact same held-out text. Perplexity is reported per token, so a model that splits text into more tokens looks artificially better. Different vocabularies or datasets make the numbers incomparable; switch to task metrics instead."
---

**Perplexity is an intrinsic measure of how well a language model predicts a text sample — the exponential of the average negative log-likelihood it assigns per [token](/glossary/llm-token) — so it acts like the model's average "branching factor," and lower is better.**

Intuitively, perplexity is how *surprised* the model is by the next token on average. A perplexity of 10 means the model is, in effect, choosing among about 10 equally likely options at each step. As a model trains and improves, it assigns higher probability to the tokens that actually appear, the negative log-likelihood drops, and perplexity falls toward 1. Because it only needs the model's own probabilities on a held-out text, it is cheap to compute during [inference](/glossary/inference) — no human labels or graders required.

That cheapness makes perplexity useful for comparing checkpoints of the same model, picking training hyperparameters, or detecting domain mismatch (perplexity on legal text spikes for a model trained on chat). It is also a common proxy when validating a [distilled](/glossary/distillation) or quantized model against its parent.

The key caveat: perplexity scores prediction of a reference text, not task quality, helpfulness, or factuality — a fluent, confidently wrong answer can have low perplexity. It is also not comparable across different tokenizers or datasets, since the per-token unit shifts. For "does this actually work," use task-level [evals](/glossary/eval-dataset); see [How to Write LLM Evals](/guides/evaluation/write-llm-evals).