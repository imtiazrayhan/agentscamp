---
name: "qlora-finetune-runner"
description: "Run a QLoRA (4-bit LoRA) fine-tune of an open-weight model from a prepared dataset — set up the config, train memory-efficiently (e.g. with Unsloth/PEFT), watch for overfitting, save the adapter, and run a quick eval against the prepared split. Use when you have a clean dataset and want to execute a parameter-efficient fine-tune on a single GPU."
allowed-tools: "Read, Grep, Glob, Bash, Write, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["mlops-ai-infra"]
related: ["unsloth", "finetuning-engineer", "finetune-dataset-builder", "finetune-dataset-prep"]
featured: false
summary: "Executes a QLoRA fine-tune from a prepared dataset: it sets a sane 4-bit + LoRA config (rank/alpha/target modules, LR, epochs), trains memory-efficiently on a single GPU, watches validation loss for overfitting, saves the adapter, and runs a quick eval against the held-out split — the training run, done reproducibly."
---

QLoRA makes fine-tuning a real option on one modest GPU: it quantizes the base model to 4-bit and trains only small LoRA adapters on top, so a model that wouldn't fit in memory for full fine-tuning trains comfortably. This skill executes that run from a **prepared** dataset — it sets a sensible config, trains, watches for the failure modes, saves the adapter, and sanity-checks the result, reproducibly.

## When to use this skill

- You have a cleaned, split dataset (see the [Fine-Tune Dataset Builder](/skills/data/finetune-dataset-builder)) and want to run a parameter-efficient fine-tune.
- Fine-tuning on a single GPU where full fine-tuning won't fit — QLoRA's 4-bit base makes it possible.
- Iterating on a fine-tune: adjusting LoRA rank, learning rate, or epochs and re-running cleanly.

## Instructions

1. **Verify the dataset is ready.** Confirm it's in the trainer's format (typically JSONL chat/instruction records), deduped, and has a held-out eval split that does not overlap training. If it isn't prepared, stop and prepare it first — the run is only as good as the data. (See [Preparing a Fine-Tuning Dataset](/guides/mlops/finetune-dataset-prep).)
2. **Detect the environment.** Check the GPU/VRAM, framework, and whether [Unsloth](/tools/unsloth), TRL/PEFT, or another trainer is in use; match the project's existing setup rather than introducing a new stack.
3. **Set a sane QLoRA config.** 4-bit base (NF4), LoRA on the attention (and often MLP) projection modules, a modest rank (e.g. 8–32) and matching alpha, a low learning rate, and a small number of epochs (1–3 — more usually overfits). State each choice; they're the knobs you'll tune.
4. **Train with the eval split wired in.** Run training with periodic evaluation on the held-out split so you can see validation loss, not just training loss. Keep it reproducible: fixed seed, logged config, recorded dataset version.
5. **Watch for the failure modes.** Stop or adjust if validation loss climbs while training loss falls (**overfitting**), or if outputs lose general ability (**catastrophic forgetting**). The fix is usually fewer epochs or better data, not a bigger rank.
6. **Save the adapter and sanity-check.** Save the LoRA adapter (and a merged model if you'll serve it merged), then run a quick eval on held-out examples to confirm the behavior changed in the intended direction before handing off to a full evaluation.

> [!WARNING]
> Training loss going down means the model is memorizing, not that it's good. Always evaluate on the **held-out split** — and if it never saw a real eval set, this run can't be trusted regardless of how clean the loss curve looks.

> [!NOTE]
> QLoRA's 4-bit quantization is for fitting the *base* model in memory during training; it's separate from quantizing the final model for serving. Note which you mean, and re-check quality after any serving-time quantization.

## Output

A trained LoRA adapter plus the run's record: the QLoRA config (quantization, rank/alpha, target modules, LR, epochs, seed), the training/validation loss curves, the dataset version, and a quick held-out eval confirming the intended behavior change — reproducible enough to re-run or tune. Full evaluation and the ship/no-ship call belong to the [finetuning-engineer](/agents/data-ai/finetuning-engineer).
