---
title: "Preparing a Fine-Tuning Dataset: Cleaning, Synthetic Data, and Eval Splits"
seoTitle: "Fine-Tuning Dataset Prep: Cleaning, Synthetic Data, Eval Splits"
description: "The dataset is the model. How to build a fine-tuning dataset that works — format, curation, cleaning, synthetic augmentation, and a leak-free eval split."
author: "Imtiaz Rayhan"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["mlops-ai-infra"]
audience: ["ai-engineers"]
tags: ["fine-tuning", "dataset", "synthetic-data", "mlops", "evals"]
featured: false
summary: "Most fine-tuning failures are dataset failures. Fix the record format to match inference, remove exact and near-duplicates before you split, split by source so paraphrases cannot straddle train and eval, and validate synthetic rows like real ones. A sample JSONL record, a 40-line dedup-and-split script and a token-length check are below."
keyTakeaways:
  - "The dataset is the model: a few hundred to a few thousand clean, on-distribution examples usually beat tens of thousands of noisy ones."
  - "Fix the exact input/output format first — it must match how you'll actually call the model (chat messages, instruction-response), or training optimizes the wrong shape."
  - "Deduplicate before splitting, and catch near-duplicates as well as exact ones: a word-shingle Jaccard score of 0.8 is a workable first threshold to tune by reading the flagged pairs."
  - "Split by a stable group key (source document, customer, conversation) with a hash, not by shuffling rows, so related examples land on one side."
  - "Synthetic data fills coverage gaps, but validate it — unchecked generated data drifts, repeats, and bakes the teacher model's mistakes into yours."
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
    a: "Less than people expect, if it's clean. For parameter-efficient fine-tuning (LoRA/QLoRA) on a focused task, a few hundred to a few thousand high-quality, on-distribution examples is often enough to shift behavior reliably. For hosted fine-tuning, OpenAI's guide sets a minimum of 10 examples, reports improvements from 50 to 100, and recommends starting with 50 well-crafted ones. Scale up only when evals show the model still misses parts of the input distribution."
  - q: "Can I use synthetic data to fine-tune a model?"
    a: "Yes, and it's a standard way to fill coverage gaps — generate examples (often from a stronger 'teacher' model) for cases your real data under-represents. The catch is that unvalidated synthetic data degrades models: it repeats patterns, drifts from the real distribution, and bakes in the teacher's mistakes. Treat synthetic examples like real ones — review, deduplicate, and validate them, and keep them a deliberate supplement to real data rather than the whole dataset."
  - q: "Why do I need a separate eval split for fine-tuning?"
    a: "Because without one you can't tell whether the model learned the task or just memorized your data. A held-out eval/validation split — representative of real inputs and guaranteed not to overlap (even as near-duplicates) with training — is the only honest measure of generalization. It's also how you detect overfitting and compare fine-tuned versions. Carve it out before training; deciding the split after you've seen results is how leakage and self-deception creep in."
  - q: "What format should fine-tuning data be in?"
    a: "Whatever matches how you'll call the model at inference, expressed in the trainer's expected schema — most commonly JSONL where each line is a chat-style record (system/user/assistant messages) or an instruction-response pair. The key is consistency: the training format must mirror the production format (same roles, same structure, same tool-call shape), and every record should validate against the schema and fit within the model's context length."
  - q: "What train/eval split ratio should I use for fine-tuning?"
    a: "There is no universal ratio; size the eval set by how small a difference you need to detect, not by a percentage. With a few thousand examples, 10% held out is a common starting point. With a few hundred, hold out at least 50 to 100 examples even if that is 20% or more, because each eval example then moves the score by one to two points. Keep synthetic rows out of the eval set."
sources:
  - title: "Supervised fine-tuning (data format and example counts)"
    url: "https://platform.openai.com/docs/guides/supervised-fine-tuning"
    publisher: "OpenAI"
related: ["agent:finetuning-engineer", "skill:finetune-dataset-builder", "skill:qlora-finetune-runner", "guide:write-llm-evals", "guide:finetune-vs-rag-vs-prompt"]
---

Almost every fine-tuning failure is a dataset failure. The training run is the mechanical part; the model's quality is decided before training starts, by what's in the data. **The dataset is the model**: it learns exactly the distribution, format, and quality you feed it, including the mistakes.

If the raw text still needs labels, the [AI prelabeling workflow](/guides/data/ai-text-dataset-prelabeling) keeps suggestions separate from human responses. Resolve disputed examples with the [annotation adjudication workflow](/guides/data/adjudicate-ai-assisted-text-labels) before treating those labels as training targets.

## Quality and coverage beat size

The instinct to gather "as much data as possible" is usually wrong. A few hundred to a few thousand **clean, on-distribution** examples typically outperform tens of thousands of noisy ones, especially for parameter-efficient methods like LoRA/QLoRA. Hosted fine-tuning needs even less to start: OpenAI's supervised fine-tuning guide sets a minimum of 10 examples, says improvements show up at 50 to 100, and recommends starting with 50 well-crafted demonstrations and evaluating before adding more. More data with errors, duplicates, or off-distribution noise teaches the model the noise. Optimize for *representativeness* and *correctness*, then add volume only where evals show a gap.

## The format is a decision, not a detail

Decide the exact input→output shape the model will see **in production**, and make the training data match it precisely: same system prompt, same roles, same structure, same tool-call format. If you fine-tune on a format you don't serve, the gains evaporate at inference.

A working record for a support-ticket classifier, in the chat-messages JSONL shape that OpenAI's fine-tuning API and most open-source trainers accept (the ticket is invented):

```json
{"messages": [{"role": "system", "content": "Classify the support ticket. Reply with JSON: {\"intent\": ..., \"needs_human\": ...}"}, {"role": "user", "content": "I was charged twice for order #4411. Please send one payment back."}, {"role": "assistant", "content": "{\"intent\": \"refund\", \"needs_human\": false}"}], "meta": {"id": "r0001", "source_id": "ticket-88213", "origin": "real"}}
```

One JSON object per line. The `meta` block is yours, not the trainer's: `id` identifies the row, `source_id` names the ticket, document or customer the row came from, and `origin` records whether it is real or synthetic. You need all three for the steps below, and you strip `meta` when you write the final files.

## Clean ruthlessly

- **Deduplicate** exact and *near*-duplicates. They cause memorization and leak into your eval split, inflating scores.
- **Fix label/answer errors.** A wrong target is worse than a missing one; the model faithfully learns the mistake. Read a random sample of at least 100 rows end to end before you trust the set.
- **Strip PII and secrets.** Both a privacy obligation and a way to stop the model regurgitating sensitive strings.
- **Normalize and balance.** Consistent formatting, and no single pattern so dominant it crowds out the rest. Count rows per label; a class with under 20 examples is a candidate for targeted collection or synthetic fill.

### A near-duplicate recipe

Exact-match dedup misses the rows that hurt most: the same ticket with a different greeting, a trailing signature, or a changed order number. Two passes catch them:

1. **Lexical pass (cheap, run on everything).** Lowercase the input, strip punctuation, break it into overlapping five-word shingles, and compare sets with Jaccard similarity. Treat pairs at or above 0.8 as duplicates and keep the first.
2. **Semantic pass (for paraphrases).** Embed each input, find nearest neighbours, and review pairs above a high cosine similarity. Start around 0.92 to 0.95 and read what it flags; the right cut-off depends on the embedding model and how templated your data is.

Both numbers are starting points. Sort the flagged pairs by score, read 30 around the threshold, and move it until what sits just above is a true duplicate and what sits just below is not.

## Dedup and split in one script

Split **after** dedup, and split by group, not by row. If three rows came from the same ticket, all three go to the same side. A hash of the group key does this deterministically, so the split never changes when you add data later. The script below uses only the Python standard library:

```python
# prep.py — usage: python prep.py raw.jsonl
import hashlib, json, re, sys

def user_text(rec):
    return " ".join(m["content"] for m in rec["messages"] if m["role"] == "user")

def shingles(text, n=5):
    words = re.sub(r"[^a-z0-9 ]+", " ", text.lower()).split()
    return {" ".join(words[i:i + n]) for i in range(max(1, len(words) - n + 1))}

def jaccard(a, b):
    return len(a & b) / len(a | b) if a | b else 1.0

def dedupe(records, threshold=0.8):
    kept, kept_shingles, dropped = [], [], []
    for rec in records:
        s = shingles(user_text(rec))
        dup_of = next((i for i, k in enumerate(kept_shingles) if jaccard(s, k) >= threshold), None)
        if dup_of is None:
            kept.append(rec)
            kept_shingles.append(s)
        else:
            dropped.append((rec["meta"]["id"], kept[dup_of]["meta"]["id"]))
    return kept, dropped

def bucket(group_key, eval_pct=10):
    h = int(hashlib.sha256(group_key.encode()).hexdigest(), 16)
    return "eval" if h % 100 < eval_pct else "train"

records = [json.loads(line) for line in open(sys.argv[1]) if line.strip()]
kept, dropped = dedupe(records)

splits = {"train": [], "eval": []}
for rec in kept:
    splits[bucket(rec["meta"]["source_id"])].append(rec)

for name, rows in splits.items():
    with open(f"{name}.jsonl", "w") as f:
        for rec in rows:
            f.write(json.dumps({"messages": rec["messages"]}) + "\n")

print(f"in={len(records)} kept={len(kept)} dropped={len(dropped)} "
      f"train={len(splits['train'])} eval={len(splits['eval'])}")
for dup, original in dropped:
    print(f"  near-duplicate: {dup} ~ {original}")
```

On a 124-row test file containing four lightly edited copies, its output starts:

```text
in=124 kept=120 dropped=4 train=108 eval=12
  near-duplicate: dup0 ~ r1
  near-duplicate: dup1 ~ r8
```

Three limits to know. The pairwise comparison is quadratic, which is fine to a few tens of thousands of rows; past that, use MinHash with locality-sensitive hashing or an approximate nearest-neighbour index. `eval_pct=10` assigns about 10% of *groups*, so the row ratio drifts if groups differ in size; check the printed counts. And because dedup runs before the split, a near-duplicate can never sit on both sides, which is the leak the next section is about.

## Check token lengths against the limit

A record longer than the training context is truncated or rejected, usually without an obvious error. Measure with the tokenizer of the model you are training:

```python
import json
from transformers import AutoTokenizer

BASE_MODEL = "your-org/your-base-model"   # placeholder: the model you will fine-tune
MAX_TOKENS = 4096                         # your training max sequence length

tok = AutoTokenizer.from_pretrained(BASE_MODEL)
lengths = []
for line in open("train.jsonl"):
    text = tok.apply_chat_template(json.loads(line)["messages"], tokenize=False)
    lengths.append(len(tok(text, add_special_tokens=False)["input_ids"]))

lengths.sort()
print("max", lengths[-1], "p95", lengths[int(len(lengths) * 0.95)],
      "over limit", sum(n > MAX_TOKENS for n in lengths))
```

Drop or shorten rows over the limit deliberately; silent truncation cuts off the assistant turn, which is the part you are training on.

## Augment with synthetic data, carefully

Where real coverage is thin (rare intents, edge cases), generate synthetic examples, often from a stronger teacher model, for the under-represented slices. Unchecked, synthetic data repeats itself, narrows diversity and under-covers the tails of the distribution (the "model collapse" failure mode), and imports the teacher's errors. A validation procedure that works:

1. **Generate against a gap list.** Name the slice ("refund requests that mention two orders") and ask for varied length, tone and phrasing. Do not ask for "more examples like these".
2. **Tag every row** with `"origin": "synthetic"` so you can measure and remove it later.
3. **Run the same pipeline.** Schema check, then the dedup pass against the *combined* real and synthetic set. A large share of rows dropped as near-duplicates means the generator is looping; change the prompt rather than keeping the survivors.
4. **Human-review a sample per slice** (50 rows, or all of them if the slice is smaller) for label correctness. If more than a few percent are wrong, fix the generation prompt and regenerate; do not hand-patch.
5. **Keep synthetic rows out of the eval split.** Score on real data only, so the number reflects production.
6. **Run the ablation.** Train with and without the synthetic rows and compare on the real eval set. Keep them only if they help the slice they were made for without hurting the rest.

## Split for eval before you train

The held-out set is your only honest measure of whether the model *generalizes* instead of memorizing, your overfitting detector, and the basis for comparing versions. Decide it before training; choosing the split after you've seen results is self-deception. Wire the eval set into your [eval harness](/guides/evaluation/write-llm-evals) so every fine-tune, and the un-tuned baseline, is scored the same way.

> [!WARNING]
> Data leakage between train and eval is the silent killer of fine-tuning projects: it produces great offline numbers and a model that flops in production. Deduplicate across the *whole* dataset before splitting, and split by a stable key (e.g. source document or entity) so paraphrases of the same item can't land on both sides.

Common ways a split leaks anyway: the same system prompt examples copied into few-shot evals, time leakage (training on tickets from after the eval period), a shared template that makes every row 90% identical, and re-splitting with a new random seed after adding data, which moves old eval rows into train.

## Before you start the training run

- Every line parses as JSON and has the roles your trainer expects, ending on an assistant turn.
- System prompt and output format are byte-identical to what production sends.
- Dedup report reviewed; threshold tuned on real flagged pairs.
- Label counts printed; no class is accidentally empty or dominant.
- PII and secrets scan is clean.
- Token-length report shows zero rows over the limit.
- Eval split is by group, contains no synthetic rows, and is committed.
- Dataset files have a version or content hash recorded next to the training config.
- The base model's score on the eval split is recorded, so the fine-tune has something to beat.

The [Fine-Tune Dataset Builder](/skills/data/finetune-dataset-builder) skill automates the cleaning, dedup, formatting, and splitting; the [finetuning-engineer](/agents/data-ai/finetuning-engineer) takes the prepared dataset through training and evaluation; and the [QLoRA Fine-Tune Runner](/skills/data/qlora-finetune-runner) runs the training itself. If you are not yet sure fine-tuning is the right tool, start with [fine-tuning vs RAG vs prompting](/guides/mlops/finetune-vs-rag-vs-prompt).
