---
term: "Distillation"
description: "Distillation trains a smaller model to imitate a larger one — using its outputs as training data to get most of the capability at a fraction of the cost."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["distillation", "training", "small-models", "mlops"]
related: ["fine-tuning", "finetune-vs-rag-vs-prompt", "synthetic-data", "quantization", "finetune-dataset-prep"]
faq:
  - q: "How is distillation different from fine-tuning?"
    a: "Distillation is a kind of fine-tuning where the training data comes from a teacher model: you collect the big model's outputs on your task (a form of synthetic data) and train a small model to reproduce them. Classic fine-tuning uses human-curated examples; distillation manufactures them from a model you wish you could afford to run everywhere."
  - q: "When does distillation make sense for an LLM product?"
    a: "When a frontier model nails your task but its cost or latency doesn't fit production scale — and the task is narrow enough for a small model to learn. Classification, extraction, routing, and templated generation distill beautifully; open-ended reasoning distills poorly. Check the model provider's terms first: many restrict using outputs to train competing models."
---

**Distillation is training a smaller "student" model on a larger "teacher" model's outputs, transferring most of the teacher's capability on a task into a model that's far cheaper and faster to run.**

The pattern in practice: run the frontier model over thousands of representative inputs, capture its outputs (often with reasoning included), curate the best, and [fine-tune](/glossary/fine-tuning) a small model on the result — [synthetic data](/glossary/synthetic-data) generation and training in one loop. For narrow tasks (classify, extract, route, rewrite), a distilled small model frequently reaches within a few points of the teacher at a tiny fraction of the per-call cost, which is the whole economics of "GPT-quality at Haiku prices" on your specific workload.

Its boundaries: breadth doesn't transfer (the student learns *your task*, not general intelligence), quality ceilings inherit from the teacher, and provider terms of service often restrict training on outputs — read them. Where distillation sits against prompting, RAG, and ordinary fine-tuning is mapped in [the 2026 decision tree](/guides/mlops/finetune-vs-rag-vs-prompt).
