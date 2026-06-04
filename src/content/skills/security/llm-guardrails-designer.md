---
name: "llm-guardrails-designer"
description: "Design input and output guardrails for an LLM app — decide what to check (injection patterns, PII, secrets, policy, schema, leakage, toxicity), place them as input vs. output rails, implement with a library like NeMo Guardrails or LLM Guard, and fail closed. Use when adding a safety/validation layer around an LLM, not relying on the prompt alone."
allowed-tools: "Read, Grep, Glob, Bash, Write, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["ai-safety-security"]
related: ["defending-prompt-injection", "nemo-guardrails", "llm-guard", "prompt-pii-redactor", "prompt-injection-auditor"]
featured: false
summary: "Designs the input/output guardrail layer for an LLM app: it decides what to validate (injection, PII, secrets, policy, schema, leakage), places each check as an input or output rail, implements it with a library like NeMo Guardrails or LLM Guard, and fails closed — defense in depth around the model, not a clever system prompt."
---

A guardrail is the validation layer around an LLM that a system prompt can't be: programmatic checks on what goes *into* the model and what comes *out*, enforced in code rather than requested in text. This skill designs that layer — deciding which checks matter for your app, placing them as input or output rails, implementing them with a guardrails library, and making them fail closed — as defense in depth, not a wall.

## When to use this skill

- Adding a safety/validation layer to an LLM app instead of trusting the prompt to police itself.
- Enforcing output structure, policy, or PII/secret-leakage checks before responses reach users or downstream systems.
- Hardening a RAG or agent app against injection and unsafe actions as part of [defending against prompt injection](/guides/ai-safety/defending-prompt-injection).

## Instructions

1. **Threat-model the app first.** Identify the untrusted inputs (user, retrieved content, tool output), the sensitive data/actions to protect, and the unacceptable outputs (leaked secrets, policy violations, malformed structure). Guardrails follow the threats — don't add checks with no threat behind them.
2. **Choose input rails.** On the way in, decide what to scan and reject/sanitize: prompt-injection patterns, PII/secret stripping (often via the [prompt-pii-redactor](/skills/security/prompt-pii-redactor)), banned topics, and input size/token limits. Input rails reduce what reaches the model.
3. **Choose output rails.** On the way out, validate before the response is trusted: **schema/structure** conformance, **policy** and safety (toxicity, disallowed content), **leakage** (PII, secrets, system-prompt disclosure), and grounding/relevance for RAG. Output rails are your last line before a user or a tool acts on the response.
4. **Implement with a library, not from scratch.** Use [NeMo Guardrails](/tools/nemo-guardrails) (programmable rails, Colang) or [LLM Guard](/tools/llm-guard) (ready-made input/output scanners) rather than hand-rolling detectors. Match the choice to the stack and the checks you need.
5. **Fail closed and make it observable.** When a guardrail trips, default to the safe action (block, sanitize, or escalate to a human) rather than passing through. Log every trigger with enough context to tune it — guardrails you can't see are guardrails you can't trust.
6. **Acknowledge the limits.** State plainly that guardrails are **defense in depth**, not prevention — they raise the cost of an attack and catch known patterns, but they don't replace least privilege and human approval for high-impact actions. Don't let a guardrail create false confidence.

> [!WARNING]
> Guardrails are probabilistic and bypassable — a detector for injection or toxicity will miss novel phrasings. Layer them with architectural controls (least privilege, approvals, output validation), and never let "we have guardrails" substitute for limiting what the model can actually do.

> [!TIP]
> Fail closed by default. A guardrail that, on error or uncertainty, lets the request through is worse than none — it gives you confidence without protection. The safe default when a check can't run or is unsure is to block or route to a human.

## Output

A guardrail design and implementation: the threat model it addresses, the input and output rails with what each checks and its fail-closed behavior, the library wiring (NeMo Guardrails or LLM Guard), logging for each trigger, and an explicit statement of what the guardrails do and do not cover — so they're treated as one layer of defense, not the whole defense.
