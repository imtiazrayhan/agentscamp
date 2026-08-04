---
term: "Fine-Tuning"
description: "Fine-tuning continues training a pretrained model on your own examples, changing its weights to teach durable behavior, format, or domain style."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["fine-tuning", "training", "lora", "mlops"]
related: ["guide:finetune-vs-rag-vs-prompt", "glossary:lora", "guide:finetune-dataset-prep", "glossary:distillation", "agent:finetuning-engineer", "glossary:rag"]
faq:
  - q: "When should I fine-tune instead of using RAG or prompting?"
    a: "Fine-tune for behavior, retrieve for knowledge. If the gap is facts the model doesn't have (your docs, fresh data), RAG fixes it without training. If the gap is how the model behaves — a strict output format, a house style, a specialized task it keeps fumbling despite good prompts — fine-tuning encodes that durably. Exhaust prompting first; it's the cheapest experiment."
  - q: "Does fine-tuning teach the model new facts?"
    a: "Poorly. Weight updates from a modest dataset bias style and behavior effectively but store knowledge unreliably — and the knowledge goes stale the day after training. Facts belong in retrieval; that's why 'fine-tune vs RAG' is usually a false choice and production systems do both: tuned behavior over retrieved knowledge."
---

**Fine-tuning is continuing a pretrained model's training on your own dataset, updating its weights so desired behavior becomes part of the model itself rather than something you re-explain in every prompt.**

A base model knows language and the world; fine-tuning specializes it — your output format, your tone, your domain's conventions, a narrow task done exactly your way. The modern default is parameter-efficient tuning ([LoRA/QLoRA](/glossary/lora)), which trains small adapter matrices instead of all weights, putting real fine-tunes within reach of a single GPU.

The decision that matters comes before any training: **is your problem behavior or knowledge?** Behavior gaps fine-tune well; knowledge gaps belong in [RAG](/glossary/rag), and one-off instructions belong in the prompt. That decision tree — including when [distillation](/glossary/distillation) beats both — is mapped in [Fine-Tune vs RAG vs Prompt vs Distill](/guides/mlops/finetune-vs-rag-vs-prompt). And the unglamorous truth of the craft: the dataset is the model. Curation, cleaning, and eval splits ([the playbook](/guides/mlops/finetune-dataset-prep)) determine more of the outcome than any hyperparameter.
