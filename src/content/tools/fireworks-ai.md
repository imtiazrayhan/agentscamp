---
name: "Fireworks AI"
title: "Fireworks AI"
description: "Hosted inference for open models: per-token serverless in several speed modes, per-second GPU deployments, training, and OpenAI- and Anthropic-compatible APIs."
url: "https://fireworks.ai"
date: 2026-06-19
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "freemium"
category: "platform"
os: ["Web"]
sameAs: ["https://fireworks.ai", "https://docs.fireworks.ai"]
color: "red"
topics: ["mlops-ai-infra", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["inference", "open-models", "fine-tuning", "serverless", "gpu"]
featured: false
alternativeTo: ["together-ai", "groq", "baseten", "replicate", "openrouter"]
summary: "Fireworks AI is a hosted inference platform for open models. Serverless bills per token and offers Standard, Priority, Fast, Batch and Spot modes on one endpoint; on-demand deployments bill per GPU-second; and training runs on the same platform. The API is OpenAI-compatible at api.fireworks.ai/inference/v1, with an Anthropic-compatible endpoint as well."
related: ["guide:deploying-llms-to-production", "guide:self-host-vs-api-llm", "guide:llm-cost-latency-engineering", "guide:best-local-llm-tools-2026", "guide:choosing-the-right-model"]
faq:
  - q: "What is the Fireworks AI base URL?"
    a: "For OpenAI SDKs it is https://api.fireworks.ai/inference/v1, and for Anthropic SDKs it is https://api.fireworks.ai/inference. Model ids take the form accounts/fireworks/models/<name>, for example accounts/fireworks/models/glm-5p3-flash in the quickstart. Authenticate with a key from the Fireworks dashboard, conventionally stored in FIREWORKS_API_KEY."
  - q: "What are Fireworks AI's rate limits?"
    a: "Two layers. Account-wide, Fireworks' quota docs give 10 requests per minute with no payment method or credits, and a fixed ceiling of 6,000 requests per minute once you have a payment method and active credits. On serverless, each model also has its own adaptive tokens-per-minute limits that grow and shrink with your recent usage of that model, so hitting the limit on one model does not throttle another. On-demand deployments are bounded by GPU quota instead, 16 GPUs each of H100, H200, B200 and B300 by default."
  - q: "Is Fireworks AI free?"
    a: "Not beyond a trial. Fireworks runs on prepaid credits, and its docs describe a $1 starter credit as of November 2026; after that you add a payment method and buy credits, with Auto Reload and a monthly spend limit to control usage. Hitting 100% of the spend limit pauses all API requests until you raise it."
  - q: "When should I move from serverless to a dedicated deployment?"
    a: "Serverless runs on shared capacity and is the place to start: nothing to provision and you pay only for tokens. An on-demand deployment gives you dedicated GPUs billed per GPU-second, is not subject to the serverless tokens-per-minute ceilings, and is how you serve models and fine-tunes that are not on the serverless list. Reserved Throughput sits in between, guaranteeing serverless capacity under an SLA in exchange for a commitment."
---

[Fireworks AI](https://fireworks.ai) is a hosted inference platform for open models. You call models such as GLM, Kimi, DeepSeek and Qwen through an OpenAI-compatible API, paying per token on shared serverless capacity or per GPU-second on dedicated deployments, and you can train your own variants on the same platform. Fireworks is a closed, managed service: the models are open, the serving stack is not.

## Highlights

- **Serverless with speed modes.** Every serverless request bills on input, cached input and output tokens, and you pick a mode per request on the same endpoint: Standard, Priority for peak-load precedence, Fast (aimed at 100+ tokens per second), Batch for jobs that can wait, and Spot on best-effort capacity. An Ultra-fast mode is in preview on specific models as of November 2026.
- **Cheap cached input.** Fireworks' pricing page says cached input bills at half price or less with no cache-write fee.
- **On-demand deployments.** Dedicated H100, H200, B200, B300 and GB300 GPUs billed per GPU-second, with no charge for start-up time. By default a deployment scales to zero after an hour unused.
- **Reserved Throughput and Sovereign.** Reserved Throughput guarantees serverless capacity under an SLA with 99.9% uptime terms. Fireworks Sovereign, which runs Fireworks-managed inference on GPUs in your own cloud account or data center, is in private preview for Enterprise as of November 2026.
- **Training.** A Serverless Training API billed per token and a Dedicated Training API billed per GPU-hour, with trained LoRA adapters deployable on on-demand GPUs.
- **Two compatible APIs.** OpenAI-style at `https://api.fireworks.ai/inference/v1` and Anthropic Messages-style at `https://api.fireworks.ai/inference`, plus Fireworks' own Python SDK (`pip install --upgrade fireworks-ai`).

## In an AI-assisted workflow

Existing OpenAI code moves over by changing the base URL, key and model name:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("FIREWORKS_API_KEY"),
    base_url="https://api.fireworks.ai/inference/v1",
)

response = client.chat.completions.create(
    model="accounts/fireworks/models/glm-5p3-flash",
    messages=[{"role": "user", "content": "Say hello in Spanish"}],
)

print(response.choices[0].message.content)
```

A sensible progression: prototype on serverless Standard, move background and evaluation jobs to Batch or Spot, and create an on-demand deployment once traffic is steady or you need a model that serverless does not list. `firectl quota list` shows your current rate limits, GPU quotas and spend limit. The trade-offs between this and running your own GPUs are in [self-host vs API](/guides/mlops/self-host-vs-api-llm).

## Pricing

As of November 2026, fireworks.ai/pricing lists serverless Standard rates per 1M input and output tokens that include $0.05 and $0.20 for NVIDIA Nemotron 3.5 Lightning 30B, $0.15 and $0.50 for GLM 5.3 Flash, $0.15 and $0.60 for OpenAI GPT OSS 120B, $0.30 and $1.20 for DeepSeek V4.1 Flash, $1.40 and $4.40 for GLM 5.3, and $3.00 and $15.00 for Kimi K3. Priority costs more per token, Batch is 50% off input and output, and Spot is 50% off Standard, currently on GLM 5.3 only.

On-demand GPU rates, as of November 2026 from the same page: $8.00 an hour for an H100 80 GB or an H200 141 GB, $13.00 for a B200 180 GB, $15.00 for a B300 288 GB and $20.00 for a GB300 288 GB, billed per GPU-second. Preemptible deployments are half the on-demand rate. Dedicated training uses the same GPU rate card, and embeddings start at $0.008 per 1M input tokens as of November 2026.

## Good to know

Billing is prepaid. You buy credits, usage draws them down, and Auto Reload tops up when the balance is low. The monthly spend limit is a hard stop on non-enterprise accounts: at 100% all API requests pause across serverless, deployments and training. Spending tiers, which rise as you add or spend credits, set the base ceilings for serverless adaptive limits.

Watch three things. Spot throughput can drop to zero, so code a retry or a fallback to Standard. A deployment with minimum replicas set to 0 is deleted automatically after seven days without traffic. And a 429 on a dedicated deployment usually means the GPUs are saturated, not that you hit a tier cap.

Against the alternatives: [Together AI](/tools/together-ai) is the closest like-for-like, with serverless open models plus dedicated endpoints and fine-tuning. [Groq](/tools/groq) runs open models on its own LPU hardware and competes on raw speed. [Baseten](/tools/baseten) centres on deploying your own models on autoscaling GPUs. [OpenRouter](/tools/openrouter) is a gateway that puts many inference providers behind one key. The [inference provider roundup](/guides/comparisons/best-llm-inference-providers-2026) compares them side by side.
