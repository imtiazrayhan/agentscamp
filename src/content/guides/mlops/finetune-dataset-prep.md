---
title: "Preparing a Fine-Tuning Dataset: Cleaning, Synthetic Data, and Eval Splits"
description: "The dataset is the model. How to build a fine-tuning dataset that works — format, curation, cleaning, synthetic augmentation, and a leak-free eval split."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["mlops-ai-infra"]
tags: ["fine-tuning", "dataset", "synthetic-data", "mlops", "evals"]
featured: false
summary: "In fine-tuning, the dataset is the model — quality and coverage matter far more than size. Define the exact input/output format, curate high-quality real examples, clean and deduplicate ruthlessly, augment thin spots with validated synthetic data, and hold out a representative eval split before you train. Most fine-tuning failures are dataset failures, not training failures."
keyTakeaways:
  - "The dataset is the model: a few hundred to a few thousand clean, on-distribution examples usually beat tens of thousands of noisy ones."
  - "Fix the exact input/output format first — it must match how you'll actually call the model (chat messages, instruction-response), or training optimizes the wrong shape."
  - "Clean and deduplicate ruthlessly: duplicates, near-duplicates, label errors, and PII all degrade the model or leak into eval."
  - "Synthetic data fills coverage gaps, but validate it — unchecked generated data drifts, repeats, and bakes the teacher model's mistakes into yours."
  - "Hold out a representative eval/validation split before training and never let it leak into the training set — it's the only honest measure of generalization."
howtoSteps:
  - name: "Define the task and exact format"
    text: "Decide the precise input→output shape the model will see in production (chat messages, instruction-response, tool-call traces) and commit to it. The training format must match the inference format, or you optimize a shape you'll never use."
  - name: "Curate high-quality real examples"
    text: "Gather real examples that cover the actual distribution of inputs you expect — including the hard and edge cases. Prioritize quality and coverage over raw count; a small, representative, correct set beats a large noisy one."
  - name: "Clean and deduplicate"
    text: "Remove exact and near-duplicate examples (they cause memorization and inflate eval), fix label/answer errors, strip PII and secrets, normalize formatting, and balance the set so no single pattern dominates."
  - name: "Augment thin spots with synthetic data"
    text: "Where real coverage is sparse, generate additional examples (often from a stronger model) for the under-represented cases — then validate them as carefully as real data. Unvalidated synthetic data introduces repetition, drift, and the teacher's errors."
  - name: "Carve out a leak-free eval split"
    text: "Before training, hold out a representative validation/test split and guarantee none of it (including near-duplicates) appears in training. This is the only honest signal of whether the model generalizes rather than memorizes."
  - name: "Format, validate, and version"
    text: "Convert to the trainer's expected format (commonly JSONL with the chat/instruction schema), validate every record against the schema, check token lengths against the context limit, and version the dataset so a result is reproducible."
faq:
  - q: "How much data do I need to fine-tune a model?"
    a: "Less than people expect, if it's clean. For parameter-efficient fine-tuning (LoRA/QLoRA) on a focused task, a few hundred to a few thousand high-quality, on-distribution examples is often enough to shift behavior reliably. Quality and coverage dominate quantity — a thousand correct, representative examples beat ten thousand noisy ones. Scale up only when evals show the model still misses parts of the input distribution, and add data where the gaps actually are."
  - q: "Can I use synthetic data to fine-tune a model?"
    a: "Yes, and it's a standard way to fill coverage gaps — generate examples (often from a stronger 'teacher' model) for cases your real data under-represents. The catch is that unvalidated synthetic data degrades models: it repeats patterns, drifts from the real distribution, and bakes in the teacher's mistakes. Treat synthetic examples like real ones — review, deduplicate, and validate them, and keep them a deliberate supplement to real data rather than the whole dataset."
  - q: "Why do I need a separate eval split for fine-tuning?"
    a: "Because without one you can't tell whether the model learned the task or just memorized your data. A held-out eval/validation split — representative of real inputs and guaranteed not to overlap (even as near-duplicates) with training — is the only honest measure of generalization. It's also how you detect overfitting and compare fine-tuned versions. Carve it out before training; deciding the split after you've seen results is how leakage and self-deception creep in."
  - q: "What format should fine-tuning data be in?"
    a: "Whatever matches how you'll call the model at inference, expressed in the trainer's expected schema — most commonly JSONL where each line is a chat-style record (system/user/assistant messages) or an instruction-response pair. The key is consistency: the training format must mirror the production format (same roles, same structure, same tool-call shape), and every record should validate against the schema and fit within the model's context length."
related: ["finetuning-engineer", "finetune-dataset-builder", "qlora-finetune-runner", "write-llm-evals", "finetune-vs-rag-vs-prompt"]
---

Almost every fine-tuning failure is a dataset failure. The training run is the easy, mechanical part; the model's quality is decided before training starts, by what's in the data. **The dataset is the model** — it learns exactly the distribution, format, and quality you feed it, including the mistakes. So the work is in preparation: the right format, clean and representative examples, careful augmentation, and an honest eval split.

## Quality and coverage beat size

The instinct to gather "as much data as possible" is usually wrong. A few hundred to a few thousand **clean, on-distribution** examples typically outperform tens of thousands of noisy ones, especially for parameter-efficient methods like LoRA/QLoRA. More data with errors, duplicates, or off-distribution noise doesn't help — it teaches the model the noise. Optimize for *representativeness* (does the set cover the real inputs, including the hard cases?) and *correctness*, then add volume only where evals show a gap.

## The format is a decision, not a detail

Decide the exact input→output shape the model will see **in production**, and make the training data match it precisely — same roles, same structure, same tool-call format. If you fine-tune on a format you don't serve, you optimize a shape you'll never use and the gains evaporate at inference. Settle this first; everything downstream formats to it.

## Clean ruthlessly

This is the unglamorous step that matters most:

- **Deduplicate** exact and *near*-duplicates — they cause memorization and silently leak into your eval split, inflating scores.
- **Fix label/answer errors** — a wrong target is worse than a missing one; the model faithfully learns the mistake.
- **Strip PII and secrets** — both a privacy obligation and a way to stop the model regurgitating sensitive strings.
- **Normalize and balance** — consistent formatting, and no single pattern so dominant it crowds out the rest.

## Augment with synthetic data — carefully

Where real coverage is thin (rare intents, edge cases), generate synthetic examples, often from a stronger teacher model, for the under-represented slices. The discipline is to **validate synthetic data as rigorously as real data**: unchecked, it repeats itself, narrows diversity and under-covers the distribution's tails (the "model collapse" failure mode), and imports the teacher's errors and biases. Keep it a deliberate supplement that fills known gaps — checked for coverage and variety, not just per-example correctness — and never a bulk substitute for real examples.

## Split for eval before you train

Carve out a representative validation/test split **before** training and guarantee it doesn't overlap training — including near-duplicates, the most common leak. This held-out set is your only honest measure of whether the model *generalizes* instead of memorizing, your overfitting detector, and the basis for comparing versions. Deciding the split after you've seen results is self-deception. Wire the eval set into your [eval harness](/guides/evaluation/write-llm-evals) so every fine-tune is scored the same way.

> [!WARNING]
> Data leakage between train and eval is the silent killer of fine-tuning projects: it produces great offline numbers and a model that flops in production. Deduplicate across the *whole* dataset before splitting, and split by a stable key (e.g. source document or entity) so paraphrases of the same item can't land on both sides.

## Putting it together

Build the dataset like it's the deliverable, because it is: fix the production-matching **format**, **curate** representative real examples, **clean and dedup** without mercy, **augment** thin spots with validated synthetic data, and reserve a **leak-free eval split** before training. Then format to the trainer's schema, validate, and version it.

The [Fine-Tune Dataset Builder](/skills/data/finetune-dataset-builder) skill automates the cleaning, dedup, formatting, and splitting; the [finetuning-engineer](/agents/data-ai/finetuning-engineer) takes the prepared dataset through training and evaluation; and the [QLoRA Fine-Tune Runner](/skills/data/qlora-finetune-runner) runs the training itself.
