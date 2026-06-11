---
name: "Qwen3-VL"
title: "Qwen3-VL"
description: "Alibaba Qwen's open-weights vision-language model family (2B–235B, Apache-2.0): image and document understanding, OCR, visual reasoning, and video."
url: "https://github.com/QwenLM/Qwen3-VL"
date: 2026-06-04
pricing: "open-source"
category: "platform"
repo: "https://github.com/QwenLM/Qwen3-VL"
license: "Apache-2.0"
sameAs: ["https://huggingface.co/Qwen", "https://github.com/QwenLM/Qwen3-VL"]
color: "orange"
topics: ["mlops-ai-infra", "data-ml"]
tags: ["vision-language-model", "multimodal", "ocr", "open-weights", "qwen"]
featured: false
alternativeTo: []
summary: "Qwen3-VL is the vision-language model series from Alibaba's Qwen team: it reads images, documents, and video alongside text for OCR, visual reasoning, spatial grounding, and agentic use. Open-weights under Apache-2.0 (dense 2B–32B plus 30B-A3B and 235B-A22B MoE variants, Instruct and Thinking editions) on Hugging Face and ModelScope — a strong open VLM you can self-host."
related: ["vlm-ocr-documents", "multimodal-document-extractor", "self-host-vs-api-llm", "llm-inference-engineer"]
faq:
  - q: "What is Qwen3-VL?"
    a: "Qwen3-VL is the open-weights vision-language model family from Alibaba's Qwen team — models that read images, documents, and video alongside text. It covers OCR and document understanding, visual reasoning, spatial grounding, video comprehension, and agentic use, with dense models from 2B to 32B plus 30B-A3B and 235B-A22B MoE variants in Instruct and Thinking editions."
  - q: "Is Qwen3-VL free?"
    a: "Yes — the weights are released under Apache-2.0, free for research and commercial use, and available on Hugging Face and ModelScope. You provide the compute: self-host behind a serving engine like vLLM, or call the models through Alibaba Cloud's hosted API if you'd rather not run infrastructure."
  - q: "Which Qwen3-VL size should I use?"
    a: "Right-size to the task: a 2B–8B model often handles routine OCR and form extraction at a fraction of the cost and latency of the largest variants, while the 32B and MoE models are for the hardest reasoning. Measure on your own documents before committing."
---

Qwen3-VL is the open-weights **vision-language model** family from Alibaba's Qwen team — models that read images, documents, and video alongside text. It targets the full range of multimodal work: OCR and document understanding, visual reasoning, spatial grounding, video comprehension, and agentic use (driving tools from what it sees). Released under **Apache-2.0**, it's one of the strongest open VLMs you can download and run yourself.

It's aimed at teams who want capable multimodal understanding without sending documents or images to a proprietary API — for privacy, cost control at volume, offline operation, or simply control over the model.

## Highlights

- **Open weights (Apache-2.0)** — free for research and commercial use; self-hostable.
- **Document & OCR** — reads layout, tables, charts, and handwriting; strong on document understanding, not just transcription.
- **Visual reasoning & grounding** — answers questions about images, with spatial grounding and long-context understanding.
- **Video** — temporal understanding for captioning, search, and event detection.
- **A family of sizes** — dense models from 2B to 32B plus 30B-A3B and 235B-A22B MoE variants, in Instruct and Thinking editions, so you can fit the model to your hardware and latency budget.

## In an AI-assisted workflow

```bash
# pull the weights from Hugging Face and serve with a high-throughput engine
# e.g. Qwen/Qwen3-VL-8B-Instruct  ->  vLLM  ->  an OpenAI-compatible endpoint
```

You can self-host the weights (Hugging Face or ModelScope) behind a serving engine, or call the models through Alibaba Cloud's hosted API if you'd rather not run infrastructure.

> [!TIP]
> Right-size the variant to the task: a 2B–8B model often handles routine OCR and form extraction at a fraction of the cost and latency of the largest model — reserve the 32B/MoE variants for the hardest reasoning. Measure on your own documents before committing.

## Good to know

Qwen3-VL is open source (Apache-2.0) and the weights are free; you provide the compute (your own GPUs or a hosted endpoint). To decide between self-hosting and a hosted API, see [Self-Host vs API](/guides/mlops/self-host-vs-api-llm); to serve it efficiently, the [llm-inference-engineer](/agents/data-ai/llm-inference-engineer). For structured document extraction with it, use the [multimodal-document-extractor](/skills/data/multimodal-document-extractor) skill, and for the broader picture see [Using Vision-Language Models for OCR, Documents, and Video](/guides/vision/vlm-ocr-documents).
