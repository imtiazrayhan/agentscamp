---
term: "Guardrails"
description: "Guardrails are programmatic checks around an LLM — validating inputs and outputs in code — enforcing safety and format rules a prompt alone can't guarantee."
date: 2026-06-11
topics: ["ai-safety-security"]
tags: ["guardrails", "safety", "validation", "llm"]
related: ["skill:llm-guardrails-designer", "guide:defending-prompt-injection", "tool:nemo-guardrails", "tool:llm-guard", "guide:claude-code-hooks", "glossary:structured-output"]
faq:
  - q: "How are guardrails different from the system prompt?"
    a: "A system prompt asks; a guardrail enforces. Instructions shape model behavior probabilistically and can be overridden or ignored. Guardrails run as code outside the model — schema validators, PII scanners, policy classifiers, permission gates — and deterministically block, redact, or rewrite what violates the rules, no matter what the model 'wants'."
  - q: "What do guardrails typically check?"
    a: "Inbound: prompt-injection patterns, PII and secrets, jailbreak attempts, off-topic abuse. Outbound: format and schema validity, toxicity and policy compliance, leaked secrets, hallucinated claims against sources, and unsafe tool calls. Each check sits at a chokepoint — before the model, after it, or around a tool invocation."
---

**Guardrails are deterministic checks wrapped around a language model — code that validates what goes in and what comes out, enforcing the rules a prompt can only request.**

The distinction that matters is *ask versus enforce*. Everything inside the model is probabilistic: instructions usually hold, until a [prompt injection](/glossary/prompt-injection) or an odd input bends them. Guardrails sit outside that uncertainty: an input scanner that strips PII before the model sees it, an output validator that rejects malformed JSON, a policy classifier that blocks disallowed content, a permission gate that stops a dangerous tool call. The model proposes; the rails dispose.

In practice they're layered at three chokepoints — input, output, and around tool/action execution — using a mix of plain validators ([structured-output](/glossary/structured-output) schemas), specialized scanners ([LLM Guard](/tools/llm-guard)), and rule engines ([NeMo Guardrails](/tools/nemo-guardrails)). Agentic systems add a fourth surface: deterministic action gates, which is exactly what [Claude Code hooks](/guides/configuration/claude-code-hooks) implement. Designing the right set for an app — without strangling it — is the [llm-guardrails-designer](/skills/security/llm-guardrails-designer) skill's job.
