---
name: "Together AI"
title: "Together AI"
description: "A cloud for running, fine-tuning, and deploying open-source models (Llama, DeepSeek, Qwen) via an OpenAI-compatible API plus dedicated GPU endpoints."
url: "https://www.together.ai"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "paid"
category: "platform"
sameAs:
  - "https://github.com/togethercomputer"
  - "https://github.com/togethercomputer/together-python"
  - "https://docs.together.ai"
color: "blue"
topics: ["mlops-ai-infra", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["inference", "fine-tuning", "open-models", "gpu", "openai-compatible"]
featured: false
alternativeTo: ["fireworks-ai", "groq", "replicate", "baseten", "openrouter"]
summary: "Together AI is a hosted cloud for open-weight models. Serverless inference covers 100+ models behind an OpenAI-compatible API billed per token; above that sit batch inference, provisioned throughput, dedicated deployments billed by the minute, fine-tuning and GPU clusters. It is prepaid, with no free trial and a $15 first credit purchase."
related: ["guide:deploying-llms-to-production", "guide:self-host-vs-api-llm", "guide:best-local-llm-tools-2026", "guide:finetune-vs-rag-vs-prompt", "guide:choosing-the-right-model"]
faq:
  - q: "Is Together AI free?"
    a: "No. As of November 2026 Together's billing docs say it does not offer free trials: you must buy at least $15 of credits before you can use the playground or create an API key, and later top-ups have a $5 minimum. The platform is fully prepaid, so API access is suspended when the balance reaches zero. Purchased credits do not currently expire."
  - q: "How is Together AI priced?"
    a: "By product. Serverless inference is billed per million input and output tokens at per-model rates. Dedicated model inference is billed by the minute for the hardware each replica runs on, regardless of tokens. Fine-tuning is billed per token processed in training and validation. GPU clusters are billed per GPU-hour by capacity type, with storage billed separately."
  - q: "Does Together AI work with the OpenAI SDK?"
    a: "Yes. Set the OpenAI client's base_url to https://api.together.ai/v1 and its api_key to your Together key, then pass a Together model ID. Together also ships its own SDKs: pip install together for Python and npm install together-ai for TypeScript."
  - q: "How does Together AI compare to OpenRouter or Groq?"
    a: "OpenRouter is a router that forwards requests to many providers. Groq serves a smaller catalog on its own inference chips for speed. Together runs the models on its own GPU fleet and adds the rest of the lifecycle: fine-tuning, dedicated deployments and raw GPU clusters, so one account covers serving, customising and scaling open weights."
---

[Together AI](https://www.together.ai) is a hosted cloud built around **open-weight models**. Instead of running inference servers yourself, you call models from families such as Llama, DeepSeek, Qwen, Gemma, GLM and Kimi through an **OpenAI-compatible API**, so existing SDK code works after a base-URL and key change. Its docs put the serverless catalog at 100+ models across chat, vision, image, audio, video, embeddings, rerank and moderation.

The same account reaches further down the stack: batch inference, provisioned throughput with an SLA, dedicated deployments on reserved GPUs, managed fine-tuning, and GPU clusters for training.

## Highlights

- **Serverless inference.** Per-token pricing with no provisioning. Performance is best-effort; under heavy demand you can get `429` or `503` responses and should retry with backoff.
- **Batch inference.** Upload a JSONL file of requests and collect results within a 24-hour window, on a separate rate-limit pool. Selected models run at 50% off in batch.
- **Provisioned throughput.** Reserved token capacity for a model or model family with a defined SLA, arranged through sales.
- **Dedicated model inference.** Single-tenant deployments billed by the minute per ready replica. A deployment scaled to zero costs nothing.
- **Fine-tuning.** Managed supervised (SFT) and DPO jobs, as LoRA adapters or full fine-tunes, billed per token processed. A separate Post-Training product lets you write your own RL or SFT loop.
- **GPU clusters.** H100, H200, B200 and B300 capacity as reserved, on-demand, scheduled or preemptible nodes, with Kubernetes or Slurm.
- **Together Link.** As of November 2026 this is in beta: a launcher that points Claude Code, Codex, OpenCode and other agents at Together-hosted models.

## In an AI-assisted workflow

Buy credits, create a key, and install the SDK:

```bash
pip install together          # or: npm install together-ai
export TOGETHER_API_KEY="your-api-key"
```

```python
from together import Together

client = Together()  # reads TOGETHER_API_KEY from the environment

response = client.chat.completions.create(
    model="MiniMaxAI/MiniMax-M3.1-Flash",
    messages=[{"role": "user", "content": "What are the top 3 things to do in New York?"}],
)
print(response.choices[0].message.content)
```

The model ID above is the one Together's quickstart used in November 2026; pick yours from the model library, since the catalog turns over. With the OpenAI SDK, the only changes are the client arguments:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("TOGETHER_API_KEY"),
    base_url="https://api.together.ai/v1",
)
```

> [!TIP]
> A sensible path on an open-weight stack: prototype on serverless, move offline jobs such as evals and classification to batch, fine-tune the model that wins, then put steady traffic on a dedicated deployment where cost depends on running replicas, not tokens.

For when to self-host open weights instead, see [Self-host vs. API](/guides/mlops/self-host-vs-api-llm); for which model to pick, [Choosing the Right Model](/guides/getting-started/choosing-the-right-model).

## Pricing

Together is prepaid. As of November 2026, the first credit purchase must be at least $15 and later purchases at least $5, there is no free trial, and API access stops when the balance hits zero unless auto-recharge is on.

Serverless rates are per million tokens and differ for every model, so read them on the [pricing page](https://www.together.ai/pricing) for the model you intend to use. Hardware rates are easier to quote. As of November 2026:

| Product | Hardware | Rate per GPU-hour |
| --- | --- | --- |
| Dedicated model inference | H100 80GB | $5.49 |
| Dedicated model inference | B200 180GB | $9.29 |
| GPU cluster, on-demand | HGX H100 | $3.99 |
| GPU cluster, on-demand | HGX H200 | $5.99 |
| GPU cluster, on-demand | HGX B200 | $9.29 |
| GPU cluster, preemptible | HGX H100 | $1.99 |

Reserved clusters cost less than on-demand at every reservation length, and multi-GPU dedicated configs cost proportionally more. Fine-tuning is billed on `(epochs × training tokens) + (evals × validation tokens)` at per-model rates, and hosting the result on a dedicated deployment is billed separately.

## Good to know

- **Serverless has no throughput guarantee.** If you need committed capacity, that is provisioned throughput or a dedicated deployment, both priced differently from per-token serverless.
- **Dedicated bills while replicas are ready.** Idle replicas cost the same as busy ones. Set replica bounds or scale to zero when traffic stops.
- **The catalog changes.** Models are added and retired regularly; pin model IDs in config and watch for deprecation notices.
- **Batch is not instant.** The 24-hour window is a best-effort target, and the docs advise waiting up to 72 hours on a job still marked `IN_PROGRESS` before treating it as stuck.
- **Proprietary platform, open SDKs.** The service is closed; the Python SDK is Apache-2.0.

Alternatives: [Fireworks AI](/tools/fireworks-ai) is the closest like-for-like open-model cloud. [Groq](/tools/groq) trades catalog breadth for speed on its own chips. [OpenRouter](/tools/openrouter) gives you one key across many providers without a fine-tuning or GPU layer. [Baseten](/tools/baseten) centres on deploying your own models on dedicated infrastructure. Before paying for fine-tuning at all, check [Fine-tune vs. RAG vs. Prompt](/guides/mlops/finetune-vs-rag-vs-prompt).
