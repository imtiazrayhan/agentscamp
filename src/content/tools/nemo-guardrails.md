---
name: "NeMo Guardrails"
title: "NeMo Guardrails"
description: "NVIDIA's open-source toolkit for adding programmable guardrails to LLM apps — input, dialog, retrieval, and output rails defined in the Colang language."
url: "https://github.com/NVIDIA-NeMo/Guardrails"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/NVIDIA-NeMo/Guardrails"
license: "Apache-2.0"
sameAs: ["https://github.com/NVIDIA-NeMo/Guardrails", "https://docs.nvidia.com/nemo/guardrails/latest/index.html"]
os: ["Linux", "macOS", "Windows"]
color: "green"
topics: ["ai-safety-security"]
tags: ["guardrails", "safety", "llm", "open-source"]
featured: false
related: ["llm-guardrails-designer", "llm-guard", "defending-prompt-injection", "owasp-agentic-top-10"]
summary: "NeMo Guardrails is NVIDIA's open-source toolkit (Apache-2.0) for adding programmable guardrails to LLM apps. You define rails — input, dialog, retrieval, and output — in the Colang modeling language to detect jailbreaks and injection, keep conversations on allowed topics, filter retrieved context, and moderate or fact-check responses."
faq:
  - q: "What is NeMo Guardrails?"
    a: "NeMo Guardrails is an open-source toolkit from NVIDIA for adding programmable guardrails to LLM-based applications. Instead of trusting a system prompt, you define explicit rails that run at specific points in the request/response flow — input rails for jailbreak/injection detection, dialog rails for staying on topic, retrieval rails for filtering context, and output rails for moderation and policy checks."
  - q: "Is NeMo Guardrails free?"
    a: "Yes — free and open source under Apache-2.0. It runs as a Python layer that wraps your LLM app, configured alongside it."
  - q: "NeMo Guardrails vs LLM Guard?"
    a: "Complementary rather than competing. NeMo Guardrails is strongest on programmable conversational rails authored in Colang — dialog control and flow logic — while LLM Guard is a ready-made library of input/output scanners for PII, secrets, prompt injection, and toxicity. Many teams use both."
---

NeMo Guardrails is an open-source toolkit from NVIDIA for adding **programmable guardrails** to LLM-based applications. Instead of trusting a system prompt to keep a model on-topic and safe, you define explicit **rails** — rules that run at specific points in the request/response flow — to constrain what the model sees, says, and does. It's a structured way to build the input/output validation layer that prompt-injection and safety defenses depend on.

It is aimed at developers who want enforceable boundaries around an LLM app: keeping a conversation on allowed topics, detecting jailbreak/injection attempts, moderating output, and checking responses against policy or for hallucination. Rails are authored in **Colang**, NeMo's modeling language for conversational guardrails, and configured alongside your app.

## Highlights

- **Multiple rail types** — input rails (e.g. jailbreak/injection detection), dialog rails (keep the conversation in bounds), retrieval rails (filter retrieved context), and output rails (moderation, fact-checking, policy).
- **Colang** — a purpose-built language for expressing conversational flows and guardrail logic declaratively.
- **Composable checks** — combine built-in and custom checks, and integrate third-party safety models/scanners as rails.
- **Framework-friendly** — works alongside common LLM app stacks and providers as a wrapping safety layer.

## In an AI-assisted workflow

Wrap your app with a guardrails config that defines the rails, then route calls through it:

```python
from nemoguardrails import RailsConfig, LLMRails

config = RailsConfig.from_path("./config")   # rails + Colang flows live here
rails = LLMRails(config)
response = rails.generate(messages=[{"role": "user", "content": user_input}])
# input/dialog/output rails run around the model call
```

> [!TIP]
> Guardrails are defense in depth, not prevention — pair NeMo Guardrails with least privilege and human approval for high-impact actions (see [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection)). Design which rails you actually need with the [llm-guardrails-designer](/skills/security/llm-guardrails-designer) skill.

## Good to know

NeMo Guardrails is free and open source under Apache-2.0 and runs as a Python layer around your LLM app. It's strongest on **programmable conversational rails**; for a ready-made library of input/output **scanners** (PII, secrets, prompt injection, toxicity), [LLM Guard](/tools/llm-guard) is complementary — many teams use both.
