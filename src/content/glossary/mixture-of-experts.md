---
term: "Mixture of Experts (MoE)"
description: "MoE is a model architecture where a router activates only a few expert subnetworks per token — huge total capacity, a fraction of the compute per token."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["moe", "architecture", "inference", "models"]
related: ["glossary:inference", "glossary:quantization", "guide:self-host-vs-api-llm", "glossary:reasoning-model"]
faq:
  - q: "Why are so many frontier models MoE now?"
    a: "Because it decouples capacity from per-token cost. A dense model spends every parameter on every token; an MoE holds far more total parameters but routes each token through only a few experts — frontier-scale knowledge at mid-size compute. Most large open-weight releases of 2024–2026 (Mixtral, DeepSeek's V-series, Qwen MoE variants, gpt-oss) took this shape."
  - q: "What's the catch with MoE models?"
    a: "Memory and serving complexity. All experts must be loaded even though few run per token, so VRAM requirements track total parameters while speed tracks active ones — a 100B+ MoE can generate like a mid-size model but still needs big-model memory. Self-hosters feel this hardest; quantization and expert-offloading are the usual relief valves."
---

**Mixture of Experts (MoE) is a transformer architecture where feed-forward layers are split into many "expert" subnetworks and a learned router sends each token to only a few of them — so a model can have enormous total parameters while spending only a fraction per token.**

The accounting is the whole story: an MoE quotes two numbers — total parameters (what it knows, what must fit in memory) and **active** parameters (what each token costs). A model with hundreds of billions total but tens of billions active generates at mid-size speed with near-frontier capability, which is why the architecture swept open-weight releases from Mixtral onward and underpins many frontier APIs.

For practitioners the implications land in serving: memory requirements follow *total* parameters even though throughput follows *active* ones, making [quantization](/glossary/quantization) and careful [inference](/glossary/inference) engineering more valuable, and shifting the [self-host economics](/guides/mlops/self-host-vs-api-llm) — an MoE you can't fit is capability you don't have, however cheap its tokens would have been.
