---
name: "LLM Guard"
title: "LLM Guard"
description: "An open-source security toolkit of input and output scanners for LLM apps — prompt injection, PII/anonymize, secrets, toxicity, and more, from Protect AI."
url: "https://protectai.github.io/llm-guard"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/protectai/llm-guard"
license: "MIT"
sameAs: ["https://github.com/protectai/llm-guard", "https://protectai.com/llm-guard"]
os: ["Linux", "macOS", "Windows"]
color: "blue"
topics: ["ai-safety-security"]
tags: ["guardrails", "security", "pii", "prompt-injection", "open-source"]
featured: false
related: ["tool:nemo-guardrails", "skill:llm-guardrails-designer", "skill:prompt-pii-redactor", "guide:defending-prompt-injection", "tool:promptfoo"]
alternativeTo: ["nemo-guardrails", "portkey", "promptfoo"]
summary: "LLM Guard is an open-source (MIT) toolkit of input and output scanners for securing LLM apps. Input scanners detect prompt injection, anonymize PII, catch secrets, and ban topics; output scanners check responses for leakage, relevance, and unsafe content. Built by Protect AI, it runs self-hosted so scanned data never leaves your environment."
faq:
  - q: "What is LLM Guard?"
    a: "LLM Guard is an open-source security toolkit for LLM interactions from Protect AI (acquired by Palo Alto Networks in 2025). It provides a library of composable input and output scanners — prompt-injection detection, PII anonymization, secrets detection, leakage and safety checks — that you chain into a guardrail layer around your model calls."
  - q: "Is LLM Guard free?"
    a: "Yes — free and open source under the MIT license. It's self-hosted and runs in your own environment, so the data being scanned never leaves it."
  - q: "LLM Guard vs NeMo Guardrails?"
    a: "They're complementary. LLM Guard is a ready-made library of input/output scanners (PII, secrets, prompt injection, toxicity), while NeMo Guardrails provides programmable conversational rails defined in Colang for dialog control. Many teams use both — scanners for validation, rails for flow."
---

LLM Guard is an open-source security toolkit for LLM interactions, built around a library of **input and output scanners** you compose into a guardrail layer. On the way in, it can detect and sanitize prompt injection, strip PII, catch secrets, and ban topics; on the way out, it can check responses for sensitive-data leakage, relevance, and unsafe content. It's the ready-made scanner library you reach for when you don't want to hand-roll each detector.

It is aimed at developers hardening an LLM app who want practical, drop-in checks rather than building injection/PII/secret detection from scratch. LLM Guard comes from **Protect AI** (acquired by Palo Alto Networks in 2025) and is widely used as the input/output validation layer in production LLM stacks.

## Highlights

- **Input scanners** — prompt-injection detection, PII anonymization, secrets detection, banned topics/substrings, token-limit and more, to sanitize prompts before the model sees them.
- **Output scanners** — sensitive-data and PII leakage, relevance, no-refusal, and safety checks before a response is trusted.
- **Composable** — enable the scanners you need and chain them; each returns a sanitized value and a risk signal.
- **Self-hosted** — runs in your environment, so the data being scanned never leaves it.

## In an AI-assisted workflow

Scan and sanitize the prompt before sending it, then scan the model's output before using it:

```python
from llm_guard.input_scanners import PromptInjection, Anonymize
from llm_guard import scan_prompt

sanitized, results, scores = scan_prompt(
    [Anonymize(vault), PromptInjection()], user_input,
)
# ...call the model with `sanitized`, then run output scanners on the response
```

> [!TIP]
> LLM Guard's `Anonymize` scanner pairs with a vault to restore PII in the response — the same reversible-tokenization pattern as the [prompt-pii-redactor](/skills/security/prompt-pii-redactor) skill. Treat scanners as defense in depth alongside least privilege, per [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection).

## Good to know

LLM Guard is free and open source under MIT and self-hosted, so scanned data stays in your environment. It's a **scanner library**; for programmable conversational **rails** (Colang flows, dialog control) it pairs naturally with [NeMo Guardrails](/tools/nemo-guardrails), and for adversarially testing whether your guardrails hold, with [promptfoo](/tools/promptfoo).
