---
name: "Hugging Face"
description: "The Git-based hub for open models, datasets and Spaces, with serverless Inference Providers, dedicated Inference Endpoints and Apache-2.0 libraries."
seoDescription: "Hugging Face in November 2026: the Hub, Inference Providers now routed through OpenRouter, Inference Endpoints, PRO and Team prices, and the key libraries."
date: 2026-11-10
reviewed: 2026-11-22
url: "https://huggingface.co"
pricing: "freemium"
category: "platform"
color: "yellow"
os: ["Web"]
topics: ["mlops-ai-infra", "data-ml"]
audience: ["ai-engineers", "developers"]
tags: ["hugging-face", "open-models", "model-hub", "inference", "transformers", "datasets"]
featured: false
alternativeTo: ["replicate", "together-ai", "modal", "fal", "ollama"]
sameAs: ["https://github.com/huggingface", "https://en.wikipedia.org/wiki/Hugging_Face", "https://x.com/huggingface", "https://www.linkedin.com/company/huggingface/"]
related: ["tool:replicate", "tool:together-ai", "tool:openrouter", "tool:ollama", "guide:best-llm-inference-providers-2026", "guide:best-open-source-llms-2026", "agent:open-model-scout", "skill:model-card-writer", "glossary:open-weights"]
keywords: ["Hugging Face", "Hugging Face Hub", "Hugging Face Inference Providers", "Hugging Face pricing", "Inference Endpoints", "Hugging Face PRO"]
summary: "Hugging Face is the Git-based hub for open models, datasets and Spaces, plus two ways to run models: serverless Inference Providers, at provider prices with no markup and with chat models routed through OpenRouter since November 16, 2026, and dedicated Inference Endpoints. Its libraries, including Transformers and Datasets, are Apache-2.0."
faq:
  - q: "Is Hugging Face free?"
    a: "Partly. A free account can host static Spaces and, if it is in good standing, up to two ZeroGPU Spaces at no cost (other Gradio and Docker Spaces now need a paid plan), but as of November 2026 free accounts get no monthly Inference Providers credits, so serverless inference needs purchased credits. As of November 2026 the PRO plan costs $9 per month and includes $2 of inference credits each month, and Team costs $20 per user per month."
  - q: "What changed with Hugging Face Inference Providers in November 2026?"
    a: "Since November 16, 2026, chat models on Inference Providers run through OpenRouter. Hugging Face's docs say 'Routing is powered by OpenRouter', and OpenRouter's announcement says 'your existing Hugging Face token and code keep working' and that 160 models from 38 labs were available that way when the change was announced. Hugging Face still charges the provider's rate with no additional fees."
  - q: "What is the difference between Inference Providers and Inference Endpoints?"
    a: "Inference Providers is serverless: you call open models hosted by partner providers through an OpenAI-compatible API and pay the provider's rate. Inference Endpoints is dedicated: you deploy a model from the Hub on autoscaling infrastructure reserved for you, which Hugging Face describes as production-ready with no cold starts, billed by the hour."
  - q: "Which Hugging Face libraries matter most?"
    a: "The core set is Transformers ('the model-definition framework for state-of-the-art machine learning models'), Datasets, Tokenizers, Diffusers, Accelerate, PEFT, TRL, Sentence Transformers, smolagents ('a barebones library for agents that think in code'), Transformers.js, Gradio, and huggingface_hub, the official CLI and Python client for the Hub. All are Apache-2.0. Text Generation Inference (TGI) is archived, and safetensors now lives in its own GitHub organization."
---

Hugging Face runs the Hub, where open models, datasets and demos are published. The Hub is, in the company's words, "the central place to explore, experiment, collaborate and build technology with Machine Learning", and it is "Git based and designed for collaboration at its core": models, datasets and Spaces (hosted demos) are repositories you clone, version and push. Around the Hub sit two ways to run models, serverless Inference Providers and dedicated Inference Endpoints, plus a family of Apache-2.0 libraries led by Transformers.

It is aimed at AI engineers and developers who pick, test, fine-tune and serve [open-weight models](/glossary/open-weights). Two recent changes matter if you last looked a while ago. Chat models on Inference Providers now route through OpenRouter (since November 16, 2026), and free accounts no longer receive monthly inference credits.

## Highlights

- **The Hub.** Models, datasets and Spaces live as Git repositories. Spaces "are one of the most popular ways to share ML applications and demos with the world", and the CPU Basic and ZeroGPU hardware tiers are free.
- **Inference Providers.** Serverless access to "the best open models for text, image, video and audio, ready to call from your app or your coding agent, at the provider's price with no markup". The API is a "drop-in replacement for the OpenAI chat completions API", and for chat models "Routing is powered by OpenRouter".
- **Inference Endpoints.** "Deploy any ML model on dedicated and autoscaling infrastructure, right from the HF Hub. Secure, production-ready, with no cold starts."
- **One token for the stack.** "One Hugging Face token gives you the whole stack: storage, compute with Jobs, dedicated inference with Inference Endpoints and serverless inference with Inference Providers."
- **Organization guardrails.** Administrators "can also set a spending limit and disable a set of Inference Providers from the organization's settings".
- **The libraries.** Transformers ("the model-definition framework for state-of-the-art machine learning models", about 169,000 GitHub stars as of November 2026), Datasets, Diffusers, Tokenizers, Accelerate, PEFT, TRL, Sentence Transformers, smolagents ("a barebones library for agents that think in code"), Transformers.js, LeRobot, Text Embeddings Inference, Gradio, and huggingface_hub, which provides the `hf` CLI. Every one is Apache-2.0.

## In an AI-assisted workflow

A common path runs from the Hub to production in three steps. Shortlist models on the Hub. Prototype against Inference Providers with your Hugging Face token, since the OpenAI-compatible API means code written for that API needs little change. Then move steady or specialized traffic to an Inference Endpoint. A coding agent such as [Claude Code](/tools/claude-code) or [Junie](/tools/junie) can run the comparison step for you. A fictional example:

```text
Compare three open chat models for summarizing support tickets. Call each
through Hugging Face Inference Providers using the OpenAI-compatible chat
completions API and my Hugging Face token from the environment. Run the 20
sample tickets in ./samples (fictional Acme data) and write a table of
output notes, latency and token counts. Never print or hard-code the token.
```

To keep a record of those runs, [W&B Weave](/tools/weave) traces each call's inputs, outputs, cost, token count and latency.

If you fine-tune the winner, the [QLoRA fine-tune runner](/skills/data/qlora-finetune-runner) skill runs a 4-bit LoRA fine-tune from a prepared dataset, and the [fine-tuning engineer](/agents/data-ai/finetuning-engineer) agent checks that the result beats the prompted baseline. For the shortlisting and publishing ends of the same loop, see the [open-model scout](/agents/data-ai/open-model-scout) agent and the [model card writer](/skills/docs/model-card-writer) skill.

> [!TIP]
> Set the organization's spending limit before you give a token to a coding agent. Inference Providers spends credits on every call, and an agent stuck in a retry loop can make many calls quickly.

## Pricing

As of November 2026 Hugging Face's pricing page lists PRO at $9 per month, with 10× private storage, $2 of included inference credits monthly, 8× ZeroGPU quota with the highest queue priority, Spaces Dev Mode and the Dataset Viewer for private datasets. As of November 2026 Team costs $20 per user per month and adds SSO (SAML and OIDC), audit logs, Resource Groups and Storage Regions, while Enterprise is listed at $500 per user per month through sales. As of November 2026 the monthly Inference Providers credits are none for free users, $2.00 for PRO users and $2.00 per seat for Team or Enterprise, and those credits can also pay for Inference Endpoints, upgraded Spaces hardware and Jobs.

As of November 2026 Spaces run from free CPU Basic and ZeroGPU up to $0.40 an hour for an Nvidia T4 small and $2.50 an hour for an Nvidia A100 large. As of November 2026 dedicated Inference Endpoints start at $0.033 an hour, with an AWS-hosted NVIDIA H200 (141 GB) listed at $5.00 an hour. As of November 2026 storage costs $12 per TB per month for public repositories and $18 per TB per month for private ones, with volume discounts from 50 TB.

## Good to know

- **No markup on inference.** "Hugging Face charges you the same rates as the provider, with no additional fees."
- **The house provider is mostly CPU.** "As of July 2025, hf-inference focuses mostly on CPU inference", so GPU-heavy chat models come from partner providers.
- **TGI is archived.** The text-generation-inference repository was archived after its last push on March 21, 2026. For serving open models yourself, see [vLLM vs Ollama](/guides/comparisons/vllm-vs-ollama).
- **safetensors moved.** It now lives at github.com/safetensors/safetensors, outside the huggingface organization.
- **Storage Buckets.** OpenRouter can "send a trace of each request to a Hugging Face Storage Bucket you own", a Broadcast destination that is in beta as of November 2026.
- **Platforms.** The Hub is a web product, with the `hf` CLI and Python and JavaScript SDKs alongside.

[Replicate](/tools/replicate), [Together AI](/tools/together-ai), [Modal](/tools/modal) and [fal](/tools/fal) compete with its inference services, and [Ollama](/tools/ollama) is the option for running weights on your own machine. The [LLM inference providers roundup](/guides/comparisons/best-llm-inference-providers-2026) compares the hosted options, and the [open-source LLMs guide](/guides/comparisons/best-open-source-llms-2026) covers the model families you will find on the Hub. See all [Hugging Face alternatives](/tools/hugging-face/alternatives).
