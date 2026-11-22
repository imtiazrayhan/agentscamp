---
description: "Write or update the Hugging Face model card (README.md with YAML metadata) for a fine-tuned model directory, using only its training config and eval files and marking every gap as needed."
seoDescription: "/model-card writes a Hugging Face model card for a fine-tuned model: YAML metadata, template sections, and eval scores traced to files, with gaps marked."
date: 2026-11-11
argument-hint: "[model dir]"
allowed-tools: "Read, Grep, Glob, Write, Edit, Bash"
title: "Model Card"
color: "purple"
topics: ["mlops-ai-infra", "data-ml"]
audience: ["ai-engineers", "developers"]
featured: false
related: ["skill:model-card-writer", "tool:hugging-face", "agent:finetuning-engineer", "agent:open-model-scout", "skill:qlora-finetune-runner", "command:update-readme"]
summary: "A slash command that runs the model-card-writer procedure on a model directory: it inventories the training config and eval output, reads the base model's card with the hf CLI, writes the YAML metadata and the template's sections into README.md, validates the metadata with huggingface_hub, and reports every field as filled, needs information, or flagged."
---

Write the Hugging Face model card for the fine-tuned model in `$ARGUMENTS`. This command runs the same procedure as the [model-card-writer](/skills/docs/model-card-writer) skill with the file handling decided for you: it finds the evidence, writes `README.md` in the model directory, validates the metadata, and reports what it could not fill. Every value on the card comes from a file in the repo or from the base model's own card. Nothing is estimated.

## Scope

Interpret `$ARGUMENTS` as follows:

1. Empty: the current directory is the model directory.
2. A directory path: use it. The card goes to `<dir>/README.md`.
3. If the directory has neither a training config nor model files (a `config.json`, weight files, or an adapter folder), stop and list the paths you checked. Do not write a card for a model you cannot find.

If `README.md` already exists, edit it in place: keep prose the user wrote, add or correct the YAML block, and fill only the sections that are missing or say `[More Information Needed]`.

## Step 1 — Inventory the evidence

Find the training config (YAML or JSON, a training script's arguments, a launch script), the dataset references and preprocessing code, the eval output (result files, eval logs), and the license file. Keep a list of each fact with its source file. Ask the user only for what no file can tell you: the intended license, who developed and funds the model, and the contact.

## Step 2 — Read the base model's card

```bash
hf models card <base-model-id> --metadata --format json
hf models card <base-model-id> --text
```

Record its `license` (and `license_name` / `license_link` if it is `other`), `language`, `pipeline_tag`, and stated limitations. If the user's intended license differs from the base model's, flag it and continue only after the user confirms.

## Step 3 — Write the metadata

Between `---` lines at the top of `README.md`: `license`, `language` (ISO 639-1 list), `library_name` (always set; repos created after August 2024 need `library_name: transformers` written explicitly), `pipeline_tag`, `base_model`, optional `base_model_relation` (`adapter`, `merge`, `quantized`, or `finetune`), `datasets` (Hub IDs), `metrics`, and `tags`. Add `model-index` only for results that exist in an eval output file, with the required `task.type`, `dataset.type`, `dataset.name`, `metrics[].type`, and `metrics[].value`.

> [!WARNING]
> Never write a score that is not in an eval output file, and never round or recompute one. Missing results become `[More Information Needed]` under Evaluation > Results and a line in the report.

## Step 4 — Write the sections

Follow the order of Hugging Face's template: Model Details, Uses (Direct, Downstream, Out-of-Scope), Bias, Risks, and Limitations, How to Get Started with the Model, Training Details (Training Data, Training Procedure), Evaluation, Environmental Impact, then the optional tail (Technical Specifications, Citation, More Information, Model Card Authors) and Model Card Contact. Drop optional sections with no evidence; keep core sections with `[More Information Needed]` where facts are missing.

## Step 5 — Validate

```bash
python -c 'from huggingface_hub import ModelCard; ModelCard.load("README.md").validate(); print("metadata ok")'
```

Run it from the model directory. `validate()` needs internet access. If it fails, fix the metadata and run it again. Do not push to the Hub; that is the user's call.

## Step 6 — Report

```markdown
## /model-card: acme/support-tone-8b

Written: models/support-tone-8b/README.md (new)
Metadata: validated with huggingface_hub

| Item | Status | Source |
| --- | --- | --- |
| license | Filled | user, matches base model card |
| base_model | Filled | configs/train.yaml |
| model-index (accuracy, test split) | Filled | eval/heldout_results.json |
| Bias, Risks, and Limitations | Needs information | technical limits written; sociotechnical review pending |
| Carbon Emitted | Needs information | no measurement in the repo |

Not run: How to Get Started snippet (no GPU in this environment)
```

> [!TIP]
> To choose a base model before training, use the [open-model-scout](/agents/data-ai/open-model-scout) agent. The [Hugging Face](/tools/hugging-face) tool page covers the Hub itself.
