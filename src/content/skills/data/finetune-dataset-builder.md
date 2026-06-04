---
name: "finetune-dataset-builder"
description: "Turn raw examples into a training-ready fine-tuning dataset — normalize to the trainer's chat/instruction format, deduplicate (including near-duplicates), strip PII, balance, validate the schema and token lengths, and carve a leak-free eval split. Use when you have raw examples and need a clean, formatted, split dataset before training."
allowed-tools: "Read, Grep, Glob, Bash, Write, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["mlops-ai-infra"]
related: ["finetune-dataset-prep", "qlora-finetune-runner", "finetuning-engineer"]
featured: false
summary: "Builds a training-ready fine-tuning dataset from raw examples: normalizes to the trainer's chat/instruction format, deduplicates (including near-duplicates), strips PII, balances, validates schema and token lengths, and carves a leak-free eval split — because the dataset is the model, and most fine-tuning failures are dataset failures."
---

The dataset is the model — so this skill treats building it as the real work, not a preprocessing afterthought. It takes raw examples and produces a clean, correctly-formatted, deduplicated dataset with a leak-free eval split, ready to hand to a trainer. Get this right and the training run is mechanical; get it wrong and no amount of tuning saves the result.

## When to use this skill

- You have raw examples (logs, labeled pairs, exported conversations) and need them formatted, cleaned, and split before fine-tuning.
- An existing dataset gave a disappointing fine-tune and you suspect duplicates, leakage, PII, or off-distribution noise.
- Standing up a repeatable dataset pipeline so each fine-tune is reproducible.

## Instructions

1. **Fix the target format first.** Determine the trainer's expected schema (commonly JSONL chat records: system/user/assistant, or instruction-response) and that it matches how the model is called in production. Normalize every example to that exact shape — the training format must mirror the inference format.
2. **Deduplicate, including near-duplicates.** Remove exact duplicates and fuzzy/near-duplicates (normalized text, embedding similarity). Near-duplicates are the main cause of memorization and the silent leak that inflates eval scores, so be aggressive here.
3. **Clean and correct.** Fix label/answer errors, drop malformed records, normalize whitespace/formatting, and **strip PII and secrets**. A wrong target teaches the wrong thing; sensitive strings risk being memorized and regurgitated.
4. **Balance and check coverage.** Make sure no single pattern or class dominates, and that the set covers the real input distribution including edge cases. Flag thin slices that may need real or validated synthetic examples (see [Preparing a Fine-Tuning Dataset](/guides/mlops/finetune-dataset-prep)).
5. **Validate the schema and token lengths.** Confirm every record parses against the schema and fits within the model's context length; quarantine the ones that don't rather than silently truncating.
6. **Carve a leak-free split.** Split into train/validation (and test) **by a stable key** (source document, entity, or user) so paraphrases of the same item can't land on both sides, and deduplicate *across* the split boundary. Report the split sizes and the dedup/cleaning counts so the dataset is auditable.

> [!WARNING]
> Split by a stable key, not by random row. Random splitting lets near-duplicates and paraphrases of the same underlying item appear in both train and eval — leakage that produces beautiful offline numbers and a model that fails in production.

> [!TIP]
> Version the output dataset (and record the cleaning/dedup counts and split keys). Reproducibility is what lets you attribute a fine-tune's quality to a specific dataset and iterate deliberately instead of guessing.

## Output

A training-ready dataset: normalized to the trainer's format, deduplicated and cleaned (with PII stripped), balanced, schema- and length-validated, and split by a stable key into leak-free train/validation/test files — plus a short report of record counts, duplicates removed, and split sizes so the dataset is auditable and reproducible.
