---
name: "model-card-writer"
title: "Model Card Writer"
description: "Write or update the Hugging Face model card for a fine-tuned model: the repo's README.md with a YAML metadata block (license, language, library_name, pipeline_tag, base_model, datasets, metrics, tags, and a model-index for eval results) followed by the sections of Hugging Face's model card template. Every value comes from the training config, dataset references, and eval output in the repo; anything the repo cannot support is written as [More Information Needed], and no eval number is ever invented. Use when publishing a fine-tune or adapter to the Hub, or when an existing card has no metadata, no limitations section, or scores nobody can trace."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Write, Edit, Bash"
user-invocable: true
color: "cyan"
date: 2026-11-10
topics: ["mlops-ai-infra", "data-ml"]
audience: ["ai-engineers", "developers"]
tags: ["claude", "hugging-face", "model-cards", "fine-tuning", "documentation", "ai-engineers"]
featured: false
related: ["command:model-card", "tool:hugging-face", "agent:open-model-scout", "agent:finetuning-engineer", "skill:qlora-finetune-runner", "skill:finetune-dataset-builder", "glossary:open-weights", "glossary:fine-tuning"]
seoDescription: "A Claude skill that writes a Hugging Face model card for a fine-tune: YAML metadata, template sections, and eval results taken only from files in the repo."
summary: "Point this skill at a fine-tuned model and it writes the Hugging Face model card: a README.md whose YAML block sets license, language, library_name, pipeline_tag, base_model, datasets, and model-index, then the template's sections. Every value comes from the training config and eval files; gaps become [More Information Needed], and no score is invented."
---

On the Hugging Face Hub, a model card is the `README.md` in the model repo: Markdown with a YAML metadata section at the top. The metadata is what the Hub works with (filtering by task and license, choosing the inference widget, linking the model to its base model, showing evaluation results), and the Hub validates it when you push the README. The prose tells a reader what the model is for, what it was trained on, how it was evaluated, and where it fails. This skill writes both halves for a model you fine-tuned, taking every fact from the repo: the training config, the dataset references, the eval output, and the base model's own card. When a fact is not in the repo, the card says `[More Information Needed]`, the template's own placeholder, instead of a plausible guess.

## When to use this skill

- You trained a fine-tune or adapter and are about to push it to the Hub.
- A model repo has a README with no YAML block, or a YAML block missing `license`, `base_model`, or `datasets`.
- The card reports eval scores and nobody can say which run, dataset, or split produced them.
- An internal model registry wants the same structure (uses, limitations, training, evaluation) for models that never leave the company.

## When NOT to use this skill

- Choosing which base model to fine-tune: the [open-model-scout](/agents/data-ai/open-model-scout) agent shortlists Hub models against license, size, context, and gating constraints.
- Running training or evaluation: the [qlora-finetune-runner](/skills/data/qlora-finetune-runner) skill and the [finetuning-engineer](/agents/data-ai/finetuning-engineer) agent produce the config and held-out results this card reports.
- Dataset cards. A dataset repo's README is a dataset card with its own YAML keys (`task_categories`, `size_categories`, `source_datasets`, and others); this skill writes model cards only.
- Deciding whether a license permits your use. The skill records licenses and flags mismatches; it does not give legal sign-off.

## Instructions

1. **Inventory the evidence.** In the model directory (or the repo root), find the training config (YAML or JSON configs, a training script's arguments, a launch script or `Makefile` target), the dataset references and preprocessing code, the eval output (result JSON or CSV files, eval logs, saved notebook output), any existing `README.md`, and the license file. Record each fact with the file it came from. This list is the only material the card may use.

2. **Read the base model's card.** Take the base model ID from the training config, then pull that card's metadata and text with the `hf` CLI that ships with `huggingface_hub`:

   ```bash
   hf models card <base-model-id> --metadata --format json
   hf models card <base-model-id> --text
   ```

   Note its `license` (plus `license_name` and `license_link` if the license is `other`), `language`, and `pipeline_tag`, and any limitations it states. If the license the user intends for the fine-tune differs from the base model's, stop and flag it. Do not pick a license on the user's behalf.

3. **Write the YAML metadata block** at the top of `README.md`, between `---` lines, with the exact keys from the Hub's model card spec:

   | Key | What goes in it | Where the value comes from |
   | --- | --- | --- |
   | `license` | A Hub license ID such as `apache-2.0`; for a custom license, `license: other` plus `license_name` and `license_link` (a URL, or `LICENSE` / `LICENSE.md` for a file in the repo) | the repo's license file and the user's decision |
   | `language` | A list of ISO 639-1 codes (`en`, `fr`) | training and eval data |
   | `library_name` | The library that loads the weights. Set it even for `transformers`: for model repos created after August 2024 the Hub no longer assumes it, so write `library_name: transformers` explicitly | the training and loading code |
   | `pipeline_tag` | The task. It drives task filtering on the Hub and the widget; for `transformers` models it is inferred from `config.json`, so set it for anything else | the training objective |
   | `base_model` | One model ID, or a list of base models | the training config |
   | `base_model_relation` | Optional: `adapter`, `merge`, `quantized`, or `finetune`, when you want to state the relation instead of leaving it to the Hub's inference | how the weights were produced |
   | `datasets` | Hub dataset identifiers (`owner/name`); describe private or local data in the text instead | the data-loading code |
   | `metrics` | Metric IDs used in evaluation, for example `accuracy` or `wer` | the eval code |
   | `tags` | Free-form discovery tags | the user |

   You do not need to add paper tags: the Hub turns arXiv links in the card into `arxiv:<PAPER ID>` tags itself.

4. **Report eval results in `model-index`, and only results you can trace.** Each result needs `task.type`, `dataset.type`, `dataset.name`, and for each metric a `type` and a `value`. Add `dataset.split`, `dataset.config`, and `dataset.revision` when the eval output records them. A `source` block is optional, but once present it needs `source.url`. Copy every value from an eval output file and note which file in your report. Never round, recompute, average, or fill in a metric. If the repo has no eval output, leave `model-index` out and write `[More Information Needed]` under Evaluation > Results. The Hub's newer `.eval_results/*.yaml` format is a work in progress as of November 2026, so use `model-index` unless the repo already uses the new format.

5. **Write the sections in the template's order.** Hugging Face's template (`modelcard_template.md` in `huggingface_hub`) runs:

   `# Model Card for <model id>` → `## Model Details` (`### Model Description` with Developed by, Funded by, Shared by, Model type, Language(s) (NLP), License, Finetuned from model; `### Model Sources` with Repository, Paper, Demo) → `## Uses` (`### Direct Use`, `### Downstream Use`, `### Out-of-Scope Use`) → `## Bias, Risks, and Limitations` (`### Recommendations`) → `## How to Get Started with the Model` → `## Training Details` (`### Training Data`, `### Training Procedure` with Preprocessing, Training Hyperparameters, and Speeds, Sizes, Times) → `## Evaluation` (`### Testing Data, Factors & Metrics`, `### Results`, `#### Summary`) → `## Model Examination` → `## Environmental Impact` → `## Technical Specifications` → `## Citation` → `## Glossary` → `## More Information` → `## Model Card Authors` → `## Model Card Contact`.

   The template marks Funded by, Shared by, Finetuned from model, Model Sources, Downstream Use, Preprocessing, Speeds/Sizes/Times, Model Examination, Technical Specifications, Citation, Glossary, More Information, and Model Card Authors as optional; drop those when the repo has nothing for them. Keep the rest, with `[More Information Needed]` where a fact is missing.

6. **Fill each section from the evidence.**
   - **Training Hyperparameters:** copy the values from the config (learning rate, epochs, batch size, adapter rank and alpha, precision, seed) as a list, and name the config file.
   - **Training Data:** name the dataset by Hub ID, or describe the private source, its size if recorded, and the preprocessing the code actually performs. Do not describe data you cannot see.
   - **Out-of-Scope Use:** the template asks for "misuse, malicious use, and uses that the model will not work well for". Derive the last part from the evidence (languages or domains absent from the training data, input lengths never evaluated) and ask the user to confirm the misuse cases.
   - **Bias, Risks, and Limitations:** the template means both technical and sociotechnical limits. Write the technical ones you can support (data coverage, gaps in the evaluation, limits stated on the base model's card) and leave `[More Information Needed]` for a person to complete the rest.
   - **How to Get Started:** a minimal loading snippet for the `library_name` you set. Run it if the environment allows; if you could not, say so in the report.
   - **Environmental Impact:** Hardware Type, Hours used, Cloud Provider, Compute Region, Carbon Emitted. Fill hardware and hours from logs when they were recorded. Fill carbon only if someone computed it; the template asks for grams of CO2eq and points to the ML Impact calculator (Lacoste et al., 2019).

7. **Validate before anyone pushes.** With `huggingface_hub` installed:

   ```python
   from huggingface_hub import ModelCard

   card = ModelCard.load("README.md")
   card.validate()  # checks the metadata the way the Hub will; needs internet access
   ```

   Fix whatever it reports and run it again. If you would rather generate the card from code, `ModelCard.from_template(card_data, ...)` renders the same Jinja2 template from a `ModelCardData` object. Pushing (`card.push_to_hub(...)` or a git push) stays with the user.

8. **Report.** List every metadata key and section as Filled (with its source file), Needs information, or Flagged (a license mismatch, a number with no file behind it).

> [!WARNING]
> Scores on a model card get copied into comparisons and spreadsheets by people who never see your repo. A number with no eval file behind it is worse than an empty Results section. If the only source for a score is someone's memory or a chat message, write `[More Information Needed]` and list it in the report.

> [!NOTE]
> The Hub validates metadata when you push changes to `README.md`. Running `validate()` locally catches the same problems before the push, while the training context is still fresh.

> [!TIP]
> The [/model-card](/commands/docs/model-card) command runs this procedure on a model directory from inside Claude Code. If the model is not chosen yet, start with the [open-model-scout](/agents/data-ai/open-model-scout) agent and the [open-weights](/glossary/open-weights) entry for what "open" does and does not promise.

## Output

The `README.md`, written new or edited in place (keeping prose the user already wrote), and a report table with columns Item, Status (Filled, Needs information, Flagged), and Source.

## Example

Excerpt for a fictional full fine-tune, `acme/support-tone-8b`:

```markdown
---
license: apache-2.0
language:
- en
library_name: transformers
pipeline_tag: text-generation
base_model: acme/acme-base-8b
base_model_relation: finetune
datasets:
- acme/support-replies-2026
metrics:
- accuracy
tags:
- customer-support
model-index:
- name: support-tone-8b
  results:
  - task:
      type: text-generation
    dataset:
      type: acme/support-replies-2026
      name: Acme support replies (held-out)
      split: test
    metrics:
    - type: accuracy
      value: 0.81            # copied from eval/heldout_results.json
      name: Format accuracy
---

# Model Card for acme/support-tone-8b

## Environmental Impact

- **Hardware Type:** 1x A100 80GB (from logs/train.log)
- **Hours used:** 6.5 (from logs/train.log)
- **Cloud Provider:** [More Information Needed]
- **Compute Region:** [More Information Needed]
- **Carbon Emitted:** [More Information Needed]
```

```markdown
| Item | Status | Source |
| --- | --- | --- |
| license | Flagged | base model card says `license: other`; the user confirmed apache-2.0, so the pair needs a license review before release |
| model-index accuracy | Filled | eval/heldout_results.json |
| Out-of-Scope Use | Needs information | misuse cases need the owner's confirmation |
```
