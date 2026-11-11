---
title: "Best Open-Source LLMs in 2026: The Open-Weight Families Compared"
description: "The open-weight LLM families current in October 2026, from DeepSeek and Qwen to Gemma 4 and Muse, with sizes, context, the exact licence and where to run them."
seoTitle: "Best Open-Source LLMs in 2026 (Open-Weight Models Compared)"
seoDescription: "Every major open-weight LLM family as of October 2026: release dates, total and active parameters, context, the licence on the model card, and how to run each."
author: "Imtiaz Rayhan"
date: 2026-10-20
reviewed: 2026-10-20
color: "green"
depth: standard
topics: ["mlops-ai-infra"]
audience: ["ai-engineers", "developers"]
tags: ["comparison", "open-source", "open-weights", "llm", "best-of"]
keywords: ["best open source llm 2026", "open weight models 2026", "deepseek v4.1 license", "qwen3.8 license", "gemma 4 apache 2.0", "run open source llm locally"]
summary: "As of October 2026 the strongest open-weight LLMs are DeepSeek V4.1-Flash (MIT), Qwen3.8 (Apache-2.0 at 27B, a custom licence at 2.4T), GLM-5.3 and GLM-5.3-Flash, Kimi K3, Meta's Muse line, Mistral Small 4 and Medium 3.5, gpt-oss, Gemma 4 (Apache-2.0), Nemotron 3.5 and Granite 4.2. The licence, not the parameter count, now decides which one you can ship."
keyTakeaways:
  - "Fully permissive and frontier-scale: DeepSeek V4.1-Flash is MIT, Gemma 4 is the first Gemma under Apache-2.0, and Qwen3.8-27B, Mistral Small 4, gpt-oss and Granite 4.2 are Apache-2.0."
  - "Licences are tightening at the top: GLM-5.3 left MIT for a custom licence, Kimi K3 has its own licence, Qwen's 2.4T flagship is no longer Apache, and MiniMax M3 is non-commercial by default."
  - "Meta has moved off the Llama brand: Llama 4 (April 2025) is the last Llama, and the 2026 open weights are Muse Glimmer 30B (Apache-2.0) and the gated Muse Spark Open 816B-A42B."
  - "Three names in launch posts are not downloadable as of October 2026: Mistral Large 4 (preview API, weights promised by end of month), DeepSeek V4.1-Pro and Qwen3.7-Plus."
  - "Vendor benchmark numbers are self-reports on different harnesses; Kimi K3 scores 77.8 on ProgramBench on its own card and 17.5 on DeepSeek's and Z.ai's. Compare within one table only."
  - "Run GGUF checkpoints with Ollama, llama.cpp, LM Studio or Jan, and native safetensors weights with vLLM or SGLang; vLLM's GGUF path is an experimental external plugin."
faq:
  - q: "What is the best open source LLM in 2026?"
    a: "It depends on licence and hardware more than on a leaderboard. For a permissive licence at frontier scale, DeepSeek V4.1-Flash (MIT) and GLM-5.3-Flash (MIT) lead; for a single GPU, Gemma 4 31B, Qwen3.8-27B and gpt-oss-120b are all Apache-2.0; for a laptop, Gemma 4 E2B/E4B, gpt-oss-20b and Granite 4.2 8B. Vendor cards for the largest models (Qwen3.8-2.4T-A95B, Kimi K3, GLM-5.3) report the highest agentic-coding figures, but each uses its own harness, so rerun your own tasks before choosing."
  - q: "Is Llama still open source?"
    a: "Llama 4 Scout and Maverick (April 5, 2025) are still downloadable under the Llama 4 Community License Agreement, a custom licence with a 700 million monthly-active-user clause, and nothing newer carries the Llama name. Meta's 2026 open weights are branded Muse: Muse Glimmer 30B is Apache-2.0, and Muse Spark Open 816B-A42B is gated under the Muse Model License, which requires a separate agreement for model-as-a-service businesses above a revenue threshold."
  - q: "Which open-weight LLMs are Apache-2.0 or MIT?"
    a: "As of October 2026: DeepSeek V4 and V4.1 (MIT), Qwen3.8-27B and all of Qwen3.6 and Qwen3.5 (Apache-2.0), GLM-5.3-Flash and GLM-5.2 (MIT), Gemma 4 (Apache-2.0), Mistral Small 4 and Mistral Large 3 (Apache-2.0), gpt-oss (Apache-2.0), Granite 4.x (Apache-2.0), Olmo 3.1 (Apache-2.0), Phi-4 (MIT), Muse Glimmer 30B (Apache-2.0), plus Tencent Hy4-preview, Xiaomi MiMo, Ant Ling-3.1, Meituan LongCat-2.0, Cohere Command A+ and LG K-EXAONE 2.0."
  - q: "Can I run these models on a laptop?"
    a: "The small end, yes. OpenAI states gpt-oss-20b runs within 16GB of memory; Gemma 4 E2B and E4B are the small end of that family; Granite 4.2 ships 3B and 8B; Meta describes Muse Glimmer 30B as purpose-built for consumer hardware. Anything with hundreds of billions of total parameters needs server GPUs: gpt-oss-120b fits a single 80GB GPU, and Muse Spark Open needs at least 700GB of VRAM at NVFP4 per its card."
  - q: "Is DeepSeek V4.1 open source?"
    a: "Its weights are open under the MIT licence; every V4 and V4.1 instruct card states the repository and weights are MIT-licensed. The newest checkpoint is DeepSeek-V4.1-Flash-1017 (October 17, 2026) with a 1M-token context and image input. DeepSeek V4.1-Pro has been named but not released, and V4-Pro API requests route to V4.1-Flash until it launches."
sources:
  - title: "DeepSeek-V4.1-Flash-1017 model card"
    url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017"
    publisher: "DeepSeek"
  - title: "Qwen3.8-2.4T-A95B model card and licence"
    url: "https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B"
    publisher: "Alibaba Qwen"
  - title: "Qwen3.8-27B model card"
    url: "https://huggingface.co/Qwen/Qwen3.8-27B"
    publisher: "Alibaba Qwen"
  - title: "GLM-5.3 model card and licence"
    url: "https://huggingface.co/zai-org/GLM-5.3"
    publisher: "Z.ai"
  - title: "Kimi K3 model card and licence"
    url: "https://huggingface.co/moonshotai/Kimi-K3"
    publisher: "Moonshot AI"
  - title: "MiniMax-M3 model card and Community License"
    url: "https://huggingface.co/MiniMaxAI/MiniMax-M3"
    publisher: "MiniMax"
  - title: "Muse Spark Open 816B-A42B model card"
    url: "https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B"
    publisher: "Meta"
  - title: "Muse Glimmer 30B model card"
    url: "https://huggingface.co/meta-models/Muse-Glimmer-30B"
    publisher: "Meta"
  - title: "Mistral Large 4 announcement"
    url: "https://mistral.ai/news/mistral-large-4"
    publisher: "Mistral AI"
  - title: "Mistral Medium 3.5 announcement"
    url: "https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5"
    publisher: "Mistral AI"
  - title: "gpt-oss-120b model card"
    url: "https://huggingface.co/openai/gpt-oss-120b"
    publisher: "OpenAI"
  - title: "Gemma 4 launch post"
    url: "https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/"
    publisher: "Google"
  - title: "Nemotron 3.5 Super VL 120B-A12B model card"
    url: "https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16"
    publisher: "NVIDIA"
  - title: "Granite 4.2 30B model card"
    url: "https://huggingface.co/ibm-granite/granite-4.2-30b"
    publisher: "IBM"
related: ["tool:ollama", "tool:vllm", "tool:sglang", "tool:open-webui", "tool:llama-cpp", "tool:lm-studio", "glossary:open-weights", "glossary:gguf", "glossary:mixture-of-experts", "guide:best-local-llm-tools-2026", "guide:self-host-vs-api-llm", "guide:choosing-the-right-model"]
---
"Open source LLM" is what people search for; "open weights" is what they get, and in 2026 the gap between the two is the story. Every family below publishes a downloadable checkpoint on Hugging Face, but the licence on the card now runs from Apache-2.0 and MIT through custom community licences with revenue clauses to non-commercial terms. This page lists the families current as of October 2026, what each vendor claims on its own model card, and the licence exactly as the card states it. Benchmark figures are vendor self-reports on different harnesses, never compared across vendors here; dates are the vendor's where a dated post exists and Hugging Face's otherwise.

## The open-weight families at a glance

| Family (lab) | Newest open release and date | Size (total / active) | Context | Licence as the card states it | Modality | Download |
| --- | --- | --- | --- | --- | --- | --- |
| DeepSeek V4.1 | V4.1-Flash-1017 (2026-10-17, vendor) | 552B backbone / 8B prefill, 16B decode | 1M | `mit` ("MIT License") | text + image | [deepseek-ai](https://huggingface.co/deepseek-ai) |
| Qwen3.8 (Alibaba) | Qwen3.8-2.4T-A95B (2026-08-12, vendor); Qwen3.8-27B (2026-08-14) | 2.4T / 95B; 27B dense | 262,144 native, extensible to about 1M | 2.4T: `other`, "Qwen3.8-Max License"; 27B: `apache-2.0` | 2.4T text only; 27B text, image, video | [Qwen](https://huggingface.co/Qwen) |
| GLM-5.3 (Z.ai) | GLM-5.3 (2026-08-18, vendor); GLM-5.3-Flash (2026-08-26) | 744B / 40B; Flash 320B / 18B | 1M (128K max output) | GLM-5.3: `other`, "GLM-5.3 License"; Flash: `mit` | GLM-5.3 text only; Flash image, video, text, file | [zai-org](https://huggingface.co/zai-org) |
| Kimi K3 (Moonshot AI) | Kimi-K3 (weights 2026-07-27, HF) | 2.8T / 104B | 1,048,576 | `other`, "Kimi K3 License" | text + image | [moonshotai](https://huggingface.co/moonshotai) |
| MiniMax M3 | MiniMax-M3 (2026-06-12, HF) | about 428B / 23B | 1M | `other`, "MiniMax Community License" (non-commercial by default) | text, image, video | [MiniMaxAI](https://huggingface.co/MiniMaxAI) |
| Meta Muse | Muse Spark Open 816B-A42B (2026-10-15, card); Muse Glimmer 30B (August 2026, card) | 816B / 42B; 29.6B dense | 1M at inference; 131,072+ | Spark Open: `other`, "Muse Model License" (gated); Glimmer: `apache-2.0` | Spark Open text, image, video, audio; Glimmer text + image | [meta-models](https://huggingface.co/meta-models) |
| Meta Llama 4 | Llama 4 Scout and Maverick (2025-04-05, card) | 109B / 17B; 400B / 17B | 10M; 1M | `other`, "Llama 4 Community License Agreement" (gated) | text + image | [meta-llama](https://huggingface.co/meta-llama) |
| Mistral AI | Mistral Medium 3.5 (2026-05-22, vendor); Mistral Small 4 (2026-03-16) | 128B dense; 119B / 6.5B | 256k | Medium 3.5: `other`, "Modified MIT License"; Small 4: `apache-2.0` | text + image | [mistralai](https://huggingface.co/mistralai) |
| OpenAI gpt-oss | gpt-oss-120b and gpt-oss-20b (2025-08-04, HF) | 117B / 5.1B; 21B / 3.6B | 131,072 (config.json) | `apache-2.0` | text only | [openai](https://huggingface.co/openai) |
| Google Gemma 4 | E2B, E4B, 26B A4B, 31B (2026-03-31 release log, blogs 2026-04-02); 12B (2026-06-03) | 30.7B dense; 25.2B / 3.8B; 11.95B | 256K (12B, 26B, 31B); 128K (E2B, E4B) | `apache-2.0` | text + image (audio on E2B, E4B, 12B) | [google](https://huggingface.co/google) |
| NVIDIA Nemotron 3.5 | Super VL 120B-A12B and Bolt 74B-A9B (2026-10-15, card) | 120B / 12B; 74B / 9B | up to 1M; up to 256K | `openmdw-1.1` ("OpenMDW License Agreement v1.1") | text, image, video | [nvidia](https://huggingface.co/nvidia) |
| IBM Granite 4.2 | Granite 4.2 3B, 8B, 30B (2026-08-25, card) | dense 3B, 8B, 30B | 128K native, extension to 512K | `apache-2.0` | text | [ibm-granite](https://huggingface.co/ibm-granite) |
| Ai2 OLMo | Olmo 3.1 32B Think and Instruct (2025-12-12, blog) | 32B dense | 65,536 | `apache-2.0` (weights, data, code) | text | [allenai](https://huggingface.co/allenai) |

Not downloadable as of October 2026: Mistral Large 4 (preview API since October 6, 2026; weights promised by end of month), DeepSeek V4.1-Pro (named, no repository) and Qwen3.7-Plus (hosted only; no `Qwen/Qwen3.7*` repository exists).

## DeepSeek V4 and V4.1

Every V4 and V4.1 instruct card states "This repository and the model weights are licensed under the MIT License," which makes DeepSeek the most permissively licensed frontier-scale family. The current model, DeepSeek-V4.1-Flash-1017, is "a minor update to DeepSeek-V4.1-Flash": a multimodal [mixture-of-experts](/glossary/mixture-of-experts) model with 552B backbone parameters that activates 8B per token during prefill and 16B during decode, a 1M-token context, and a reasoning effort setting from 1 to 100. Card figures for the 1017 release: Terminal-Bench 4.0 42.3, DeepSWE v1.1 77.0, HLE without tools 42.6. V4-Pro (1.6T / 49B) is being phased out; its API requests route to V4.1-Flash "until V4.1-Pro launches."

## Qwen3.8, 3.6 and 3.5 (Alibaba)

Qwen3.8 is "the most capable generation in the Qwen open-model family to date," and the licence split matters: Qwen3.8-27B and every Qwen3.6 and Qwen3.5 checkpoint are Apache-2.0, while the 2.4T-A95B flagship ships under a custom "Qwen3.8-Max License" and Qwen3.8-Flash-Next (125B with 6B active) under the "Qwen Community License 1.0." Native context is 262,144 tokens, extensible to about one million; the 2.4T model is text-only and "requires thinking mode for all interactions." Card figures for Qwen3.8-27B: Terminal Bench 2.1 (Terminus) 73.0, SWE-bench Pro 61.7, GPQA Diamond 89.2. The flagship card's column is labelled "Qwen3.8-Max," the hosted version of the 2.4T checkpoint: Terminal Bench 2.1 86.6, SWE-bench Pro 67.7, GPQA Diamond 92.6.

## GLM-5.3 and GLM-5.3-Flash (Z.ai)

GLM-5.3 "uses the same base model as GLM-5.2," a 744B / 40B MoE, and Z.ai calls it "the most capable open-weights model for coding, with a 50% improvement over GLM-5.2 on our in-house Z.ai Code Bench." Card figures: Terminal Bench 2.1 88.2, DeepSWE v1.1 66.9, CyberGym 84.5. It is text-only with a 1M context, and reasoning cannot be disabled. The licence changed with this release: GLM-5, 5.1, 5.2 and GLM-5.3-Flash are MIT, while GLM-5.3 ships under a custom "GLM-5.3 License." GLM-5.3-Flash, "the first natively multimodal model in the GLM-5 series" at 320B / 18B with image, video, text and file input, is the MIT-licensed pick.

## Kimi K3 (Moonshot AI)

Kimi K3 is "an open-weight, native multimodal agentic model" with 2.8T total and 104B activated parameters, "the world's first open 3T-class model," with a 1,048,576-token context, always-on thinking and MXFP4 quantization-aware-trained weights. Card figures at max effort: GPQA Diamond 93.5, Terminal-Bench 2.1 88.3, DeepSWE 67.5, BrowseComp 91.2. K2 through K2.7-Code used a "Modified MIT" licence; K3 introduces a new "Kimi K3 License." K3's card reports ProgramBench 77.8 while DeepSeek's and Z.ai's cards report K3 at 17.5 on a differently defined ProgramBench: cross-vendor comparison fails.

## MiniMax M3

MiniMax-M3 is "a native multimodal model with 1M context" at roughly 428B total and 23B active parameters, with text, image and video input and a `thinking` parameter that can be enabled, adaptive or disabled. Its benchmark figures exist only as an image on the card (SWE-Bench Verified 80.5 "using Claude Code as the scaffolding"). The licence is why M3 sits lower on shortlists: the MiniMax Community License grants rights "for non-commercial purposes," and commercial use requires displaying "Built with MiniMax M3" and written authorization above a yearly revenue threshold of 20 million US dollars. Its predecessor M2.7 is under a "NON-COMMERCIAL LICENSE" outright.

## Meta: Llama 4 and the Muse line

Llama 4 Scout and Maverick (April 5, 2025) remain the last models branded Llama, under the "Llama 4 Community License Agreement" with its 700 million monthly-active-user clause; nothing newer exists under `meta-llama`. Meta's 2026 open weights are branded Muse and live under `meta-models`. Muse Glimmer is "a 30-billion-parameter causal language model with a dedicated perception encoder, distilled from Muse Spark and purpose-built for autonomous agentic tasks on consumer hardware," Apache-2.0, with a card figure of SWE-Bench Verified 76.0. Muse Spark Open (October 15, 2026) is "an 816B total/42B active parameter open weights model with a context window of 1M tokens," gated under the "Muse Model License" and "requires a GPU with at least 700GB of VRAM for NVFP4 and 2TB for BF16." Card figures at xhigh effort: GPQA Diamond 89.0, OSWorld Verified 80.4.

## Mistral Small 4, Medium 3.5 and Large 4

Mistral Small 4 (March 16, 2026) unifies "Magistral for reasoning, Pixtral for multimodal, and Devstral for agentic coding, into a single, versatile model": 119B total, 6.5B active, 256k context, text and image input, Apache-2.0. Mistral Medium 3.5 (May 22, 2026) is a dense 128B model "released as open weights, under a modified MIT license," which Mistral says "scores 77.6% on SWE-Bench Verified." Mistral Large 4, "a 1 trillion-parameter natively multimodal model with 52 billion active parameters," launched as a preview API on October 6, 2026 with the line "Weights drop end of this month"; as of October 2026 no repository exists and the licence is not stated by the vendor.

## gpt-oss (OpenAI)

gpt-oss-120b ("117B parameters with 5.1B active parameters") and gpt-oss-20b ("21B parameters with 3.6B active parameters") are Apache-2.0, text-only, and trained on OpenAI's harmony response format, which the card says they "should only be used with." MXFP4 post-training lets the 120b run on a single 80GB GPU and the 20b within 16GB of memory; context is 131,072 tokens per config.json. Benchmark figures are not stated on the model card, and there has been no new gpt-oss release since August 2025.

## Gemma 4 (Google DeepMind)

Gemma 4 is the counter-trend: Google calls it "the first in the Gemmaverse to be released under the OSI-approved Apache 2.0 license." Five sizes ship: E2B, E4B, 12B, 26B A4B (25.2B total, 3.8B active) and 31B dense (30.7B), all with "configurable thinking modes" and native function calling. Card figures for the 31B: MMLU Pro 85.2%, GPQA Diamond 84.3%, LiveCodeBench v6 80.0%. Gemma 3 and 3n stay under the Gemma Terms of Use.

## Nemotron 3 and 3.5 (NVIDIA)

NVIDIA describes Nemotron as "a family of open models with open weights, training data, and recipes." The 2026 line is hybrid Mamba-2 plus MoE: Nemotron 3 Ultra 550B-A55B (June 4, 2026), Nemotron 3.5 Lightning 30B-A3B (August 11) and, on October 15, Nemotron 3.5 Super VL 120B-A12B and Bolt 74B-A9B. Nemotron 3 Ultra and every 3.5 model use the Linux Foundation's OpenMDW License Agreement v1.1; Nemotron 3 Nano and Super stayed on the NVIDIA Nemotron Open Model License. Card figures for 3.5 Super VL: GPQA-Diamond 89.52, LiveCodeBench v6 88.22, SWE-bench Verified 71.10, SWE-bench Pro 51.78.

## Granite 4.2 (IBM)

Granite 4.2 (August 25, 2026) comes in dense 3B, 8B and 30B sizes with built-in thinking, "Reasoning-Augmented Tool Calling," and 128K native context with extension to 512K. IBM states "All Granite models are released under the Apache 2.0 license, enabling unrestricted commercial and academic use." Card figures for the 30B: SWE Bench Verified 57, AIME25 89.17, MMLU-Pro 77.60.

## Phi, OLMo, Trinity and other verified families

Microsoft's newest Phi is Phi-4-reasoning-vision-15B (March 4, 2026, MIT); no Phi-5 exists as of October 2026. Ai2's Olmo 3.1 32B (December 12, 2025) is the fully open option: Apache-2.0 weights plus the Dolma 3 and Dolci datasets and all training code. Arcee's Trinity-Large-Thinking (398B / 13B) moved from Apache-2.0 to OpenMDW-1.1 on May 28, 2026. Also verified: Tencent Hy4-preview (770B / 49B, Apache-2.0, August 2026), Xiaomi MiMo-V2.6-Pro (1.02T / 42B, MIT, September 2026), Ant Group Ling-3.1-flash (560B / 25B, MIT, October 13, 2026), Meituan LongCat-2.0 (1.6T / 48B, MIT), Cohere Command A+ (218B / 25B, Apache-2.0, May 2026), LG K-EXAONE 2.0 (750B / 37B, Apache-2.0) and StepFun Step-5-Preview (600B / 27B, "StepFun Model License 1.0").

## Licences: Apache-2.0 and MIT versus custom and non-commercial

[Open weights](/glossary/open-weights) is not open source, and in 2026 the licence tier matters more than the parameter count. The permissive tier is every row above tagged `apache-2.0` or `mit`. The custom tier adds scale or service clauses: Qwen3.8-2.4T-A95B requires attribution above 100 million monthly users or 20 million US dollars of monthly revenue and a separate licence for model-as-a-service businesses above 50 million US dollars in twelve months; GLM-5.3 requires a Z.ai security review for model-as-a-service operators above 10 billion US dollars; Kimi K3 requires a separate agreement above 20 million US dollars of model-as-a-service revenue; Muse Spark Open requires notifying Meta above the same threshold and displaying "Built with Muse Spark Open"; Nemotron 3 Ultra, Nemotron 3.5 and Trinity use OpenMDW-1.1. The non-commercial tier is MiniMax M3 and M2.7.

The direction of travel is toward the middle tier (GLM-5.3 left MIT, Kimi K3 replaced Modified MIT, Arcee and NVIDIA adopted OpenMDW); Gemma 4 and Cohere's Command A+ moved the other way, to Apache-2.0. Read the LICENSE file, not the tag; several cards tag `other` and put the real terms in that file.

## Where to run them

Tool by tool, see [Best Tools for Running LLMs Locally](/guides/comparisons/best-local-llm-tools-2026). In short:

- **One machine, one user.** [Ollama](/tools/ollama) imports a single-file [GGUF](/glossary/gguf) checkpoint with a Modelfile line `FROM /path/to/file.gguf`, [llama.cpp](/tools/llama-cpp) runs the same files directly (`llama serve -hf ggml-org/Qwen3.5-0.8B-GGUF`), and [LM Studio](/tools/lm-studio) and [Jan](/tools/jan) wrap llama.cpp for the desktop.
- **A chat front end.** [Open WebUI](/tools/open-webui) sits in front of Ollama or any OpenAI-compatible endpoint.
- **A server with real traffic.** [vLLM](/tools/vllm) and [SGLang](/tools/sglang) are the engines the Qwen and DeepSeek cards name for the native safetensors weights; Qwen's reference command is `vllm serve Qwen/Qwen3.8-27B --reasoning-parser qwen3 --enable-auto-tool-choice --tool-call-parser qwen3_coder`. GGUF in vLLM is "highly experimental" and lives in an external `vllm-gguf-plugin`.

## How to choose

**You want a permissive licence and no legal review.** DeepSeek V4.1-Flash (MIT) at the top end, Gemma 4 31B or Qwen3.8-27B (Apache-2.0) in the 30B class, gpt-oss or Granite 4.2 below that.

**You are on a laptop or a single consumer GPU.** Gemma 4 E2B, E4B or 12B, gpt-oss-20b, Granite 4.2 8B, Ministral 3, or Muse Glimmer 30B, built "for autonomous agentic tasks on consumer hardware."

**You need the strongest open coding agent and can host a large MoE.** The vendor-reported leaders are GLM-5.3 or GLM-5.3-Flash, DeepSeek V4.1-Flash-1017, Qwen3.8-2.4T-A95B and Kimi K3. Rerun your own tasks; the harness differences explained in [LLM Benchmarks Explained](/guides/evaluation/llm-benchmarks-explained-2026) are larger than the gaps between these cards.

**You need vision, video or audio input.** Gemma 4, Qwen3.8-27B, GLM-5.3-Flash, Kimi K3, MiniMax M3, Nemotron 3.5 Super VL, or Muse Spark Open for audio.

**You need the training data and code, or a million tokens of context.** Olmo 3.1 and Nemotron publish data and code; DeepSeek V4.1, GLM-5.3, Kimi K3, MiniMax M3, Nemotron and Muse Spark Open carry 1M-token contexts.

**You are choosing between an open model and a hosted frontier API.** [Choosing the Right Model](/guides/getting-started/choosing-the-right-model) and the [self-hosting versus API guide](/guides/mlops/self-host-vs-api-llm) cover it.
