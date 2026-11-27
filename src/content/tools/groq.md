---
name: "Groq"
title: "Groq"
description: "GroqCloud runs open-weight LLMs on custom LPU hardware for very fast, low-latency inference through an OpenAI-compatible API."
url: "https://groq.com"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
repo: "https://github.com/groq/groq-python"
sameAs: ["https://github.com/groq", "https://console.groq.com/docs"]
color: "orange"
topics: ["mlops-ai-infra", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["inference", "llm-api", "low-latency", "open-models"]
featured: false
alternativeTo: ["together-ai", "fireworks-ai", "cerebras", "openrouter", "replicate", "baseten"]
summary: "Groq is a hosted inference service that serves open-weight models — OpenAI GPT-OSS, Whisper, enterprise-only Llama, and Qwen in preview — on its custom LPU chips for unusually high tokens-per-second and low latency. The GroqCloud API is OpenAI-compatible, so most SDKs work by changing the base URL, and pricing is per-token with a free tier."
related: ["guide:deploying-llms-to-production", "guide:self-host-vs-api-llm", "guide:llm-cost-latency-engineering", "guide:choosing-the-right-model", "guide:calling-any-model-gateways"]
faq:
  - q: "What is Groq?"
    a: "Groq is an AI inference company that runs open-weight large language models on its own custom silicon, the Language Processing Unit (LPU). Through GroqCloud, it serves models like OpenAI's open-weight GPT-OSS and Whisper at very high throughput and low latency over an OpenAI-compatible API; its Llama models are now enterprise-only, and Qwen models are in preview. Note: this is Groq the hardware/inference company, not Grok the chatbot."
  - q: "Is Groq free?"
    a: "Groq is freemium. GroqCloud has a genuinely usable free tier (rate-limited) for prototyping, then paid usage billed per token on a Developer tier, plus Enterprise plans. The official Groq SDKs (Python, TypeScript) are open source under Apache-2.0, but the hosted LPU service itself is a commercial product."
  - q: "How do I use Groq?"
    a: "Sign up at console.groq.com, create an API key, and call the OpenAI-compatible endpoint at https://api.groq.com/openai/v1. Because it mirrors the OpenAI API, most existing OpenAI SDKs and tools work by swapping the base URL and key; Groq also ships official Python and TypeScript libraries."
  - q: "How much does Groq cost?"
    a: "As of November 2026, Groq's models page lists GPT-OSS 120B at $0.15 per million input tokens and $0.60 per million output tokens, GPT-OSS 20B at $0.075 and $0.30, Whisper Large V3 at $0.111 per hour of audio, and Whisper Large V3 Turbo at $0.04 per hour. Llama 3.1 8B and Llama 3.3 70B are enterprise-only and priced through sales."
  - q: "Is Groq fully OpenAI-compatible?"
    a: "Mostly. Chat Completions, audio transcription, and the Responses API work through the https://api.groq.com/openai/v1 base URL, but Groq's docs list gaps: logprobs, logit_bias, top_logprobs, and messages[].name return a 400 error, n must be 1, and a temperature of 0 is converted to 1e-8."
---

Groq is an AI inference company built around custom silicon. Where most providers serve models on GPUs, Groq designed the **LPU (Language Processing Unit)** specifically for inference, and the result is unusually high tokens-per-second and low time-to-first-token. Its hosted platform, **GroqCloud**, exposes that hardware through an OpenAI-compatible API, so you call a model and never manage the chips.

The catalog is **open-weight models** rather than closed frontier models. The draw is speed and per-token pricing on those models, not exclusive access to a proprietary model family.

> [!NOTE]
> Groq (the LPU inference company) is unrelated to Grok, the xAI chatbot — they're easy to confuse but different products.

## Highlights

- **Published speeds per model.** Groq's models page lists about 1,000 tokens per second for OpenAI's GPT-OSS 20B and about 500 for GPT-OSS 120B, both with a 131,072-token context window and up to 65,536 completion tokens.
- **Production models.** As of November 2026 the production list is `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `whisper-large-v3`, and `whisper-large-v3-turbo`, plus Llama 3.1 8B and Llama 3.3 70B, which are enterprise-only with contact-sales pricing.
- **Preview models.** In preview as of November 2026: `qwen/qwen3.8-27b`, Canopy Labs Orpheus text-to-speech, Llama Prompt Guard 2, and `openai/gpt-oss-safeguard-20b`, with Meta's Muse Spark Open and MiniMax M2.7 limited to enterprise accounts. Groq says preview models are for evaluation only and can be discontinued at short notice.
- **OpenAI-compatible API.** Point an OpenAI client at `https://api.groq.com/openai/v1` with a Groq key. Chat Completions, audio transcription, and the Responses API are supported.
- **Official SDKs.** `groq` for Python and `groq-sdk` for JavaScript and TypeScript, both typed, with synchronous and asynchronous clients.
- **Batch and Flex processing.** Available on the paid Developer tier, along with higher rate limits than the Free tier.

## In an AI-assisted workflow

Create a key at console.groq.com, export it as `GROQ_API_KEY`, and install the SDK with `pip install groq`:

```python
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

chat_completion = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[{"role": "user", "content": "Summarize this stack trace in two sentences: ..."}],
)
print(chat_completion.choices[0].message.content)
```

Existing OpenAI code needs only a new base URL and key:

```python
import os
import openai

client = openai.OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY"),
)
```

Groq earns its place where latency is the product: voice agents that must answer inside a conversational pause, classification and routing steps inside a larger agent loop, and fast first drafts that a stronger model reviews. Many teams reach it through a gateway rather than directly; see [calling any model through gateways](/guides/concepts/calling-any-model-gateways). If you're weighing a hosted API against running models yourself, see [self-host vs API](/guides/mlops/self-host-vs-api-llm) and [LLM cost and latency engineering](/guides/advanced/llm-cost-latency-engineering).

## Pricing

Groq bills per token. There is a rate-limited Free tier, and adding a payment method moves you to the pay-as-you-go Developer tier. As of November 2026, Groq's models page lists GPT-OSS 120B at $0.15 per million input tokens and $0.60 per million output tokens, GPT-OSS 20B at $0.075 and $0.30, the Qwen 3.8 27B preview at $0.80 and $4.00, Whisper Large V3 at $0.111 per hour of audio, and Whisper Large V3 Turbo at $0.04 per hour. The same page shows Developer-tier limits of 250,000 tokens and 1,000 requests per minute for the GPT-OSS models; limits apply per organization, and the API returns HTTP 429 with a `retry-after` header when you exceed one. Enterprise-only models are priced through sales.

## Good to know

**Compatibility has gaps.** Groq's docs say `logprobs`, `logit_bias`, `top_logprobs`, and `messages[].name` return a 400 error, `n` must be 1, and a `temperature` of 0 is converted to `1e-8`.

**The catalog is narrow and it moves.** There are no closed frontier models, the Llama models moved behind enterprise contracts, and anything in preview can disappear. Read the model ID from the models page instead of hard-coding one from a tutorial.

**The company changed shape in 2025 and 2026.** On December 24, 2025, Groq announced a non-exclusive licensing agreement with NVIDIA for its inference technology. It was not an acquisition: founder Jonathan Ross, president Sunny Madra, and other team members joined NVIDIA, Simon Edwards became CEO, and Groq said it would keep operating as an independent company with GroqCloud running without interruption. In August 2026 Groq became an NVIDIA Cloud Partner, said it would be among the first to deploy NVIDIA Groq 3 LPX alongside Vera Rubin NVL72 systems, and announced a $350 million Series A led by Disruptive.

Groq sits alongside other hosted open-model inference services. [Cerebras](/tools/cerebras) is the closest match, another custom-silicon provider competing on tokens per second. [Together AI](/tools/together-ai) and [Fireworks AI](/tools/fireworks-ai) run on GPUs with much larger model catalogs and fine-tuning, and [Baseten](/tools/baseten) is the pick when you need to deploy your own model on dedicated hardware.
