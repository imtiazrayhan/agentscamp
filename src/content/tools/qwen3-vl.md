---
name: "Qwen3-VL"
title: "Qwen3-VL"
description: "Alibaba Qwen's open-weights vision-language model family (2B–235B, Apache-2.0): image and document understanding, OCR, visual reasoning, and video."
url: "https://github.com/QwenLM/Qwen3-VL"
date: 2026-06-04
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "platform"
repo: "https://github.com/QwenLM/Qwen3-VL"
license: "Apache-2.0"
sameAs: ["https://huggingface.co/Qwen", "https://github.com/QwenLM/Qwen3-VL"]
color: "orange"
topics: ["multimodal-ai", "mlops-ai-infra", "data-ml"]
audience: ["ai-engineers"]
tags: ["vision-language-model", "multimodal", "ocr", "open-weights", "qwen"]
featured: false
alternativeTo: ["mistral-ocr", "docling", "marker", "gemini"]
summary: "Qwen3-VL is Alibaba's Apache-2.0 vision-language model family, released September to October 2025: six sizes from 2B to 235B that read images, documents and video. It is no longer Qwen's newest vision model, since Qwen3.5, 3.6 and 3.8 are natively multimodal, but it still offers small sizes, FP8 and GGUF builds, and matching embedding and reranker models."
related: ["guide:vlm-ocr-documents", "skill:multimodal-document-extractor", "guide:self-host-vs-api-llm", "agent:llm-inference-engineer"]
faq:
  - q: "Is Qwen3-VL still the latest Qwen vision model?"
    a: "No. Qwen3-VL shipped between September 23 and October 21, 2025. Qwen3.5 followed in February 2026 as a natively multimodal family whose model card says it outperforms Qwen3-VL on visual understanding benchmarks, then Qwen3.6 in April 2026 and Qwen3.8 in August 2026, all published on Hugging Face as image-text-to-text models under Apache-2.0. Start a new project by testing the newer generation at the size you can host."
  - q: "How much GPU memory does Qwen3-VL need?"
    a: "The full-precision weights on Hugging Face are about 4.3 GB for 2B, 8.9 GB for 4B, 17.5 GB for 8B, 62 GB for 30B-A3B, 67 GB for 32B and 471 GB for 235B-A22B. Those are floors before context and image tokens. vLLM's recipe says the 235B model needs at least 8 GPUs with 80 GB each. Qwen also publishes FP8 and GGUF builds that need less."
  - q: "Is Qwen3-VL free for commercial use?"
    a: "Yes. The weights are Apache-2.0, on Hugging Face and ModelScope. You pay for compute, or for tokens if you call Alibaba Cloud Model Studio's hosted qwen3-vl-plus instead of running the weights."
  - q: "What is the difference between the Instruct and Thinking editions?"
    a: "Each size ships in both. Instruct answers directly and is the usual choice for OCR and extraction, where latency and output tokens matter. Thinking produces a reasoning trace before the answer and is meant for harder visual reasoning. They are separate checkpoints, so you choose at deploy time."
---

Qwen3-VL is the open-weights **vision-language model** family from Alibaba's Qwen team: models that read images, documents and video alongside text. It covers OCR and document parsing, visual question answering, 2D and 3D grounding, video understanding, and GUI agent tasks. The weights are **Apache-2.0** and were released in stages from September 23 to October 21, 2025.

It is aimed at teams that want multimodal understanding without sending documents to a proprietary API. One thing to know before you commit: Qwen3-VL is no longer the newest generation. Qwen3.5 (February 2026), Qwen3.6 (April 2026) and Qwen3.8 (August 2026) are natively multimodal, and the Qwen3.5 model card says that family outperforms Qwen3-VL on visual understanding benchmarks. Qwen3-VL remains a sensible pick when you need a 2B to 8B model, an official GGUF build, or the embedding and reranker models built on it.

## Highlights

- **Six sizes, two editions.** Dense 2B, 4B, 8B and 32B, plus mixture-of-experts 30B-A3B and 235B-A22B, each as Instruct and Thinking checkpoints.
- **OCR in 32 languages.** The README lists 32 supported languages (up from 10 in the previous generation), with better handling of blur, tilt, low light and long-document structure.
- **Long context and video.** A native 256K-token context that the README says can be extended to 1M with YaRN, for long documents and hours-long video.
- **Grounding and GUI use.** 2D and 3D grounding for object positions, and a visual-agent mode that reads PC and mobile interfaces.
- **Deployment formats.** Official FP8 and GGUF repositories alongside the full-precision weights, and support in vLLM, SGLang and Transformers.
- **Retrieval models.** `Qwen3-VL-Embedding` (2B, 8B) and `Qwen3-VL-Reranker` (2B, 8B), released in January 2026 for multimodal search.

## In an AI-assisted workflow

Serve a small model behind an OpenAI-compatible endpoint with vLLM. The Qwen README requires `vllm>=0.11.0`:

```bash
uv pip install -U vllm
pip install qwen-vl-utils==0.0.14

vllm serve Qwen/Qwen3-VL-8B-Instruct \
  --limit-mm-per-prompt.video 0 \
  --async-scheduling \
  --host 0.0.0.0 --port 8000
```

`--limit-mm-per-prompt.video 0` restricts the server to images, which is what vLLM's Qwen3-VL recipe uses to save memory. Then send an image with the standard OpenAI client:

```python
from openai import OpenAI

client = OpenAI(api_key="EMPTY", base_url="http://127.0.0.1:8000/v1")

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-8B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": "https://example.com/receipt.png"}},
            {"type": "text", "text": "Read all the text in the image."},
        ],
    }],
    max_tokens=2048,
)
print(response.choices[0].message.content)
```

The same request shape works against Alibaba Cloud Model Studio's OpenAI-compatible endpoint if you would rather not run GPUs.

> [!TIP]
> Right-size the variant to the task. Start routine OCR and form extraction on the 4B or 8B Instruct model and move up only if your own documents show errors. Measure on your files, not on a leaderboard.

## Hardware by size

Weight sizes below are the full-precision safetensors files on Hugging Face, as of November 2026. Treat each as the minimum GPU memory for the weights alone; context, image tokens and batching add to it.

| Model | Parameters | Weights on disk |
| --- | --- | --- |
| Qwen3-VL-2B-Instruct | 2.1B | 4.3 GB |
| Qwen3-VL-4B-Instruct | 4.4B | 8.9 GB |
| Qwen3-VL-8B-Instruct | 8.8B | 17.5 GB |
| Qwen3-VL-30B-A3B-Instruct | 31.1B | 62.1 GB |
| Qwen3-VL-32B-Instruct | 33.4B | 66.7 GB |
| Qwen3-VL-235B-A22B-Instruct | 235.7B | 471.3 GB |

For the 235B model, vLLM's recipe states a minimum of 8 GPUs with at least 80 GB each (A100, H100 or H200), and recommends the FP8 checkpoint on H100. FP8 builds store weights in 8 bits instead of 16, and the GGUF builds run under llama.cpp-based runtimes.

## Pricing

The weights are free. Hosted, Alibaba Cloud Model Studio sells `qwen3-vl-plus` by the token with tiered rates: as of November 2026 its international (Singapore) price is $0.20 per million input tokens and $1.60 per million output tokens for requests of up to 32K input tokens, rising to $0.60 and $4.80 for requests between 128K and 256K. New accounts get a 1 million token free quota in the Singapore region for 90 days, as of November 2026.

## Good to know

- **Superseded, not deprecated.** The repository's last code push was in January 2026 and newer Qwen generations fold vision into the main model line. The weights stay available under Apache-2.0.
- **Images cost tokens.** High-resolution pages and video frames consume context quickly. Cap image resolution and frame count in your serving config before you blame the model for latency.
- **Thinking checkpoints are slower.** They emit reasoning tokens first, which you pay for in time on your own GPUs or in output tokens on a hosted API.
- **Validate extraction.** A VLM can return a confident, wrong number from a table. Check totals and required fields in code; the [multimodal-document-extractor](/skills/data/multimodal-document-extractor) skill builds that step in.

Alternatives depend on the job. For document parsing as a managed API, [Mistral OCR](/tools/mistral-ocr) is the hosted option; for a local pipeline that outputs Markdown without a general VLM, look at [Docling](/tools/docling) or [Marker](/tools/marker); for a proprietary multimodal model with nothing to host, [Gemini](/tools/gemini). To serve Qwen3-VL efficiently see [vLLM](/tools/vllm) and the [llm-inference-engineer](/agents/data-ai/llm-inference-engineer) agent, to choose between hosting and an API see [Self-Host vs API](/guides/mlops/self-host-vs-api-llm), and for the wider picture [Using Vision-Language Models for OCR, Documents, and Video](/guides/vision/vlm-ocr-documents).
