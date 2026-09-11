---
name: "Cerebras"
title: "Cerebras"
description: "Cerebras Inference serves open-weight LLMs on wafer-scale chips for very fast output, through an OpenAI-compatible API with a free trial credit."
seoTitle: "Cerebras Inference: Speed, Pricing, OpenAI API, and Alternatives"
url: "https://www.cerebras.ai"
date: "2026-09-11"
pricing: "freemium"
category: "platform"
repo: "https://github.com/Cerebras/cerebras-cloud-sdk-python"
os: ["Web"]
color: "orange"
topics: ["mlops-ai-infra", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["inference", "llm-api", "low-latency", "open-models", "wafer-scale"]
featured: false
sameAs:
  - "https://github.com/Cerebras"
  - "https://inference-docs.cerebras.ai"
  - "https://pypi.org/project/cerebras_cloud_sdk/"
  - "https://huggingface.co/cerebras"
alternativeTo: ["groq", "together-ai", "fireworks-ai", "baseten"]
related: ["tool:groq", "tool:together-ai", "tool:fireworks-ai", "guide:best-llm-inference-providers-2026", "guide:llm-cost-latency-engineering", "skill:provider-fallback-wrapper"]
summary: "Cerebras Inference runs open-weight LLMs on Cerebras's wafer-scale chips behind an OpenAI-compatible API, and its pricing page lists GPT OSS 120B at about 3,000 tokens per second. The service is proprietary; its SDKs are Apache-2.0. As of September 2026 it serves two public models and bills per token after a $5 free-trial credit."
faq:
  - q: "Is the Cerebras API OpenAI-compatible?"
    a: "Yes, for many common workflows: point an OpenAI client at https://api.cerebras.ai/v1 with a Cerebras API key. The documented gaps are that n must be 1, images must be sent as base64 data URIs rather than HTTPS URLs, and gpt-oss-120b rejects requests that combine tools with response_format."
  - q: "Is Cerebras free?"
    a: "There is a free trial: as of September 2026, Cerebras's pricing page gives new accounts $5 in free credits with access to all its models, under tight rate limits. The self-serve Developer tier starts at $10 with 10x the free tier's rate limits, and Enterprise adds dedicated queue priority, custom weights and fine-tuning."
  - q: "Does Cerebras quantize or prune its models?"
    a: "Cerebras says its public endpoints serve the original, unpruned models. It applies weight-only quantization only for storage and dequantizes the weights on the fly, so computation runs at high precision."
---

Cerebras is the pick when **output speed** matters more than model choice. Cerebras Systems builds **wafer-scale processors** and sells access to them as Cerebras Inference, an OpenAI-compatible API with its console at cloud.cerebras.ai; its pricing page lists OpenAI's GPT OSS 120B at about 3,000 tokens per second. The trade-offs are a two-model public catalog and fine-tuning only on Enterprise.

## Highlights

- **Wafer-scale silicon.** The WSE-3T puts four trillion transistors and 250 petaflops on one wafer, and each chip keeps model weights on-chip in 44 GB of SRAM, which Cerebras credits for its speed. The CS-4 system combines three of them.
- **Published speeds.** As of September 2026 the pricing page lists GPT OSS 120B at ~3,000 tokens/s and Qwen 3.8 27B at ~1,500 tokens/s. Those are Cerebras's own figures, not independent benchmarks.
- **OpenAI-compatible API.** Point an OpenAI client at `https://api.cerebras.ai/v1`, or use the official Python and Node SDKs (Apache-2.0).
- **Unpruned models.** Public endpoints serve the original models. Weight-only quantization is used only in storage, and weights are dequantized on the fly.
- **A short catalog.** Two public production models as of September 2026: `gpt-oss-120b` and `qwen-3.8-27b`.
- **Other ways in.** Cerebras is also reachable through AWS Marketplace, OpenRouter, Hugging Face and Vercel, and its systems are available on premises.

## In an AI-assisted workflow

Cerebras's quickstart installs the Python SDK and makes one chat call:

```bash
pip install --upgrade cerebras_cloud_sdk
```

```python
import os
from cerebras.cloud.sdk import Cerebras

client = Cerebras(
    api_key=os.environ.get("CEREBRAS_API_KEY"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Why is fast inference important?",
        }
    ],
    model="qwen-3.8-27b",
)

print(chat_completion.choices[0].message.content)
```

For Node, install the SDK with `npm install @cerebras/cerebras_cloud_sdk@latest`. Because the API follows OpenAI's, existing OpenAI-client code often needs only a new base URL, key and model ID. Prompts like these get Claude Code to wire it in:

```text
Add Cerebras as a second provider in our chat service: use the OpenAI client
with base URL https://api.cerebras.ai/v1 and model gpt-oss-120b, and fall back
to our current provider on rate-limit errors.

Time our 20 most common prompts on Cerebras and on our current provider, then
write a table of time-to-first-token and output tokens per second.
```

A fast provider still needs a fallback, especially under the free trial's low rate limits. The [provider-fallback-wrapper](/skills/api/provider-fallback-wrapper) skill adds multi-provider fallback, bounded retries and timeouts. The [model-router-designer](/skills/data/model-router-designer) skill designs a router that sends easy requests to cheaper, faster models and escalates only the hard ones, gated by an eval set.

> [!TIP]
> Test your tool-calling path before you commit. Cerebras's docs say `gpt-oss-120b` rejects requests that combine `tools` with `response_format`, `n` must be 1, and images must be base64 data URIs rather than HTTPS URLs.

## How it compares

| Provider | Hardware | Catalog | Fine-tuning |
|---|---|---|---|
| Cerebras | Wafer-scale WSE-3T | Two public models | Enterprise only |
| [Groq](/tools/groq) | LPU; NVIDIA planned | Small, includes Whisper | None; enterprise LoRA serving |
| [Together AI](/tools/together-ai) | NVIDIA GPUs | Broad open-model catalog | LoRA and full; SFT, DPO |
| [Fireworks AI](/tools/fireworks-ai) | NVIDIA GPUs | 100+ models | SFT, DPO, reinforcement |
| [Baseten](/tools/baseten) | NVIDIA GPUs | Model APIs plus your own | Training product |

Groq is the closest match. Both serve GPT OSS 120B: Cerebras's pricing page lists it at ~3,000 tokens/s and Groq's models page at 500, but Groq charges less per token for it. Those are each vendor's own numbers, so time your own prompts before you switch. Pick Together AI or Fireworks AI when you need a model Cerebras doesn't serve, or fine-tuning without an enterprise contract. Our [inference provider roundup](/guides/comparisons/best-llm-inference-providers-2026) sorts all of them by workload.

## Good to know

Plans, as of September 2026 from Cerebras's pricing page: a Free Trial with $5 in credits and access to all Cerebras-powered models; a self-serve Developer tier starting at $10, with 10x the free tier's rate limits and higher-priority processing; and Enterprise, with the highest rate limits, dedicated queue priority, custom model weights, and fine-tuning and training services. On the same page, Developer-tier token prices are $0.35 per million input tokens and $0.75 per million output tokens for GPT OSS 120B, and $0.99 and $1.49 for Qwen 3.8 27B.

Cerebras Systems has been listed on Nasdaq under CBRS since May 2026. Since August 2026 it has also powered Ultrafast, a service tier in the OpenAI API that runs GPT-5.6 Sol at up to 750 output tokens per second, per Cerebras's announcement. OpenAI sells that tier, not Cerebras Cloud, and as of its August 2026 launch it was in limited preview for OpenAI customers. For where fast inference pays off in an app's latency budget, see [LLM cost and latency engineering](/guides/advanced/llm-cost-latency-engineering).
