---
term: "Open Weights"
description: "An open-weights model publishes its parameters for anyone to download and run — unlike API-only models — with licenses from permissive to restricted."
date: 2026-06-12
topics: ["mlops-ai-infra"]
tags: ["open-weights", "open-source", "models", "licensing"]
related: ["self-host-vs-api-llm", "quantization", "frontier-model", "llama-cpp", "fine-tuning"]
faq:
  - q: "Is open weights the same as open source?"
    a: "No — and the distinction matters. Open weights means the parameters are downloadable; open source traditionally requires the full recipe (training data, code) and an OSI license. Many 'open' models ship weights under custom licenses with use restrictions, and almost none publish training data. Read the license, not the marketing."
  - q: "Why choose open weights over a frontier API?"
    a: "Four durable reasons: data control (inference on your hardware, nothing leaves), cost at scale (high steady volume beats per-token pricing), customization (fine-tuning and quantization on your terms), and independence (no provider deprecation or policy change can take the model away). The trade is capability lag and the ops burden of serving it."
---

**An open-weights model is one whose trained parameters are published for download — you can run it on your own hardware, fine-tune it, and quantize it — as opposed to API-only models accessible solely through a provider.**

The term exists because "open source" got stretched: weights-available is not recipe-available, and licenses range from genuinely permissive (Apache-2.0/MIT — see [llama.cpp's ecosystem](/tools/llama-cpp)) through custom community licenses with scale or use restrictions. The honest taxonomy: *open weights* (downloadable parameters), *open source* (code/recipe under OSI terms), *open data* (training corpus) — most "open" models clear only the first bar.

Practically, open weights power everything the API economy can't: [self-hosting for privacy and unit economics](/guides/mlops/self-host-vs-api-llm), [fine-tuning](/glossary/fine-tuning) into specialists, [local inference](/guides/comparisons/best-local-llm-tools-2026), and air-gapped deployments. The strategic story of 2024–2026 is the gap to the [frontier](/glossary/frontier-model) narrowing — strong open-weight families (Llama, DeepSeek, Qwen, gpt-oss) now trail the leading edge by months rather than years, which keeps competitive pressure on API pricing everywhere.
