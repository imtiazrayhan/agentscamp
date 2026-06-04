---
name: "prompt-pii-redactor"
description: "Detect and redact PII and secrets from prompts (and logs/traces) before they reach an LLM provider — mask or tokenize emails, phone numbers, names, IDs, and API keys, reversibly where the response needs the real values back. Use when sending user or document data to a third-party model, or when LLM request logs may capture sensitive data."
allowed-tools: "Read, Grep, Glob, Bash, Write, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["ai-safety-security"]
related: ["llm-guardrails-designer", "llm-guard", "defending-prompt-injection", "secret-scanner"]
featured: false
summary: "Strips PII and secrets from prompts (and logs/traces) before they leave for an LLM provider: it detects emails, phones, names, IDs, and API keys and masks or tokenizes them — reversibly when the response needs the originals restored — so sensitive data isn't sent to a third party or captured in logs."
---

Every prompt you send to a hosted model leaves your environment, and every request you log may persist sensitive data. This skill puts a redaction layer in front of that boundary: it detects PII and secrets in outgoing prompts (and in traces/logs), masks or tokenizes them before they're sent, and — where the model's answer needs the real values — restores them on the way back. The goal is that third parties and log stores never see data they shouldn't.

## When to use this skill

- Sending user messages or document content to a third-party LLM API where PII/secrets shouldn't leave your environment.
- LLM request/response **logging or tracing** that could capture sensitive data in plaintext.
- A compliance or data-residency requirement to minimize personal data sent to or stored by external services.

## Instructions

1. **Define what's sensitive here.** Enumerate the categories that matter for this app and jurisdiction: direct identifiers (names, emails, phones, addresses), government/financial IDs (SSN, card numbers), and **secrets** (API keys, tokens, credentials). Don't over-redact data the task genuinely needs — redaction that breaks the use case gets turned off.
2. **Detect with layered methods.** Combine high-precision pattern/format detection (regex/validators for emails, cards, keys) with NER/model-based detection for free-form PII (names, locations). A library like [LLM Guard](/tools/llm-guard)'s anonymize/secrets scanners covers much of this; match it to your data.
3. **Choose mask vs. reversible tokenize.** For data the model never needs in the clear, **mask** (irreversible placeholder). For data the response must reference or return, **tokenize reversibly** — replace with a stable placeholder, then re-insert the original in the model's output (a vault/map held only in your environment).
4. **Apply at the boundary — both directions.** Redact on the request before it leaves for the provider, and de-tokenize on the response if you tokenized. Apply the same redaction to anything written to **logs/traces**, which are an equally common leak.
5. **Verify and measure.** Test against representative data for both misses (sensitive data that slipped through) and over-redaction (broke the task), and log redaction counts (not the values) so coverage is auditable.
6. **State the residual risk.** Detection is imperfect — novel formats and contextual PII evade detectors. Note what's covered and recommend pairing with least-data-collection and provider data-handling controls (no-retention/zero-retention options) rather than relying on redaction alone.

> [!WARNING]
> Reversible tokenization means the mapping from placeholder to real value lives in **your** environment and never in the prompt. If you send the model a key to reverse the tokens, you've sent the data — defeating the point. Keep the vault server-side and re-insert originals only after the response returns.

> [!NOTE]
> Don't forget the logs. Teams redact the prompt to the provider but log the raw request for debugging — and the sensitive data lands in the log store anyway. Redact on the way to logs/traces too, or scrub at the logging layer.

## Output

A redaction layer applied at the LLM boundary: the sensitive-data categories handled, the detection methods, the mask-vs-reversible-tokenize decisions, request/response and logging integration, and a coverage check (misses and over-redaction) — plus a clear statement of residual risk and the complementary controls (data minimization, provider no-retention) it should sit alongside.
