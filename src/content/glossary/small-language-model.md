---
term: "SLM (Small Language Model)"
description: "A small language model is a compact LLM — roughly 1–15B parameters — that runs cheaply or locally, trading peak capability for speed and deployability."
date: 2026-06-12
topics: ["mlops-ai-infra"]
tags: ["slm", "small-models", "local", "efficiency"]
related: ["glossary:frontier-model", "glossary:quantization", "glossary:distillation", "guide:best-local-llm-tools-2026", "tool:ollama"]
faq:
  - q: "What counts as a small language model?"
    a: "No hard line, but common usage centers on roughly 1–15B parameters — models that run on a laptop, phone, or single modest GPU, especially when quantized. The families everyone names: Phi, Gemma, Qwen's small tiers, Llama's compact variants, plus distilled task-specific models."
  - q: "What are SLMs actually good for?"
    a: "Narrow, high-volume, latency- or privacy-sensitive work: classification and routing, extraction, summarization, autocomplete, on-device assistants, and as distillation targets that capture a big model's behavior on one task. The pattern is pairing: an SLM handles the mechanical 80% while a frontier model takes the hard 20%."
---

**A small language model (SLM) is a deliberately compact LLM — typically single-digit billions of parameters — designed to run fast, cheap, and close to the user: on-device, on a single GPU, or at high volume where frontier pricing doesn't pencil.**

SLMs stopped being toys when two curves crossed: training recipes (better data, [distillation](/glossary/distillation) from larger teachers) pushed small-model quality up sharply, while [quantization](/glossary/quantization) pushed hardware requirements down — a 4-bit 8B model runs on an ordinary laptop via [Ollama](/tools/ollama) or [the local stack](/guides/comparisons/best-local-llm-tools-2026). The result: for *narrow* tasks — classify, extract, route, summarize — a well-chosen or fine-tuned SLM frequently matches frontier output at a tiny fraction of the cost and latency.

The architecture pattern that follows is **tiering**: SLMs as the high-volume workhorses, [frontier models](/glossary/frontier-model) reserved for reasoning-heavy steps — the same logic as [model tiering](/guides/getting-started/choosing-the-right-model) inside one provider, extended down to hardware you own. The boundary to respect: breadth. SLMs degrade fastest on open-ended reasoning and long agentic runs — exactly where the frontier earns its price.
