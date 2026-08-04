---
description: "Scaffold a vLLM serving config for a model on a target GPU — pick precision/quantization and parallelism to fit, set batching and context length, and expose an OpenAI-compatible server."
argument-hint: "<model + target GPU(s) and VRAM, or a description of the serving workload>"
allowed-tools: "Read, Grep, Glob, Bash, Edit, Write"
model: "sonnet"
title: "Scaffold a vLLM Serving Config"
color: "red"
date: 2026-06-04
topics: ["mlops-ai-infra"]
related: ["tool:vllm", "agent:llm-inference-engineer", "guide:self-host-vs-api-llm", "tool:ollama"]
featured: false
summary: "A slash command that scaffolds a runnable vLLM serving config for a model on a target GPU: it sizes the model against VRAM, picks the highest precision or quantization that fits, sets context length, memory utilization, concurrency, and tensor parallelism, exposes an OpenAI-compatible endpoint, and emits the command plus a curl smoke test."
---

## Scope

Treat `$ARGUMENTS` as what to serve: a model (id/size), the target GPU(s) and VRAM, and ideally the workload shape (chat vs. batch, prompt/response lengths, target concurrency). If the GPU/VRAM isn't given, ask — it determines whether the model fits at all and at what precision.

Goal: a **runnable, fits-the-GPU** vLLM serving config with an OpenAI-compatible endpoint — sane defaults a human can then load-test and tune, not a guess that OOMs on first launch.

> [!NOTE]
> This scaffolds a starting config; it does not load-test or tune to an SLO. For benchmarking and tuning throughput/p95 against a budget, hand off to the [llm-inference-engineer](/agents/data-ai/llm-inference-engineer). For local single-user running, [Ollama](/tools/ollama) is simpler than vLLM.

## Step 1 — Size the model against the GPU

Estimate the model's memory at candidate precisions (FP16/BF16 vs. FP8 vs. AWQ/GPTQ int4) plus KV-cache headroom for your context length and concurrency. Decide whether it fits one GPU or needs **tensor parallelism** (`--tensor-parallel-size N`). State the assumption.

## Step 2 — Choose precision/quantization

Pick the highest precision that fits with headroom; drop to FP8 or 4-bit quantization only as needed to fit, and **flag that quantization can affect quality** so it gets re-checked against an eval set, not assumed safe.

## Step 3 — Set the core serving flags

Produce the `vllm serve` invocation (or equivalent config) with the parameters that matter:

- `--max-model-len` — context length sized to your prompts (don't over-allocate; it costs KV-cache memory).
- `--gpu-memory-utilization` — how much VRAM vLLM may use (leave headroom).
- `--max-num-seqs` — concurrency / batch width.
- `--tensor-parallel-size` — for multi-GPU models.
- quantization flag if used.

## Step 4 — Expose the OpenAI-compatible endpoint

Confirm the server exposes `/v1/chat/completions` (and `/v1/completions`) so existing OpenAI clients work by changing the base URL. Note the host/port and any served-model-name.

## Step 5 — Emit the config and a smoke test

Output the final command/config plus a one-line `curl` (or OpenAI-client snippet) to verify the endpoint responds, and the env/launch notes (GPU visibility, model download/cache). 

> [!WARNING]
> The two failure modes to pre-empt: an out-of-memory crash on launch (precision/context/concurrency too high for the VRAM) and a silent quality drop from quantization. Size conservatively with KV-cache headroom, and re-run your eval set after any quantization before trusting the deployment — see [vLLM](/tools/vllm).
