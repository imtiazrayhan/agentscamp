---
title: "10 Best Claude Skills for Building AI Applications"
description: "Compare Claude skills for structured output, fallbacks, evals, hallucinations, routing, token cost, semantic caching, PII, guardrails, and tools."
author: "Imtiaz Rayhan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "purple"
topics: ["llm-app-dev", "llm-evals"]
audience: ["developers"]
tags: ["claude-skills", "llm-applications", "evals", "structured-output", "guardrails", "ai-agents"]
featured: true
seoTitle: "10 Best Claude Skills for Building AI Applications"
seoDescription: "Find Claude skills for structured LLM output, provider fallback, evals, hallucination checks, model routing, token cost, caching, PII, guardrails, and tools."
summary: "Start with llm-output-schema-generator and provider-fallback-wrapper at the model call, then llm-eval-suite-scaffolder and prompt-regression-tester so changes are measured. Add token-usage-profiler, model-router-designer, and semantic-cache-designer once you have spend to cut, and prompt-pii-redactor and llm-guardrails-designer before real user data flows."
keyTakeaways:
  - "Six of the ten change your repo (schema, fallback wrapper, eval suite, regression harness, redaction layer, guardrails); the other four produce a design or a report you act on."
  - "llm-eval-suite-scaffolder builds the suite once; prompt-regression-tester diffs a candidate prompt or model against a committed baseline, case by case."
  - "The cost skills run in a fixed order: profile spend by feature tag, then route easy traffic to a cheaper model, then cache repeats."
  - "semantic-cache-designer calibrates its similarity threshold on 100-300 labeled query pairs from your logs, so it needs production traffic first."
  - "Guardrails and PII redaction are probabilistic. Both skills end by stating what they do not cover."
faq:
  - q: "Which Claude skills should I use for my first AI feature?"
    a: "Install llm-output-schema-generator, provider-fallback-wrapper, and llm-eval-suite-scaffolder first. They cover a typed response, an outage path, and a baseline score. Add prompt-pii-redactor before user data reaches a hosted model, and token-usage-profiler once the feature has a week of traffic to measure."
  - q: "What is the difference between prompt-regression-tester and llm-eval-suite-scaffolder?"
    a: "llm-eval-suite-scaffolder sets up a suite in DeepEval, promptfoo, or RAGAS with a 20-50 case dataset, two or three metrics, a baseline, and a CI step. prompt-regression-tester builds a smaller harness (evals/cases.jsonl, baseline.json, a runner) that compares a candidate against the baseline per case and exits non-zero when a case that used to pass now fails."
  - q: "How do I reduce AI costs without hurting quality?"
    a: "Run token-usage-profiler to rank spend by feature tag, then apply its levers in order: trim input, cap output, downshift the model, cache stable prefixes. Use model-router-designer for the downshift and semantic-cache-designer for repeated questions. Both gate their changes on a labeled eval set."
  - q: "Is there a skill for writing tool definitions for an agent?"
    a: "Yes, tool-definition-generator, which derives JSON Schema tool definitions from real function signatures. It is covered in the API development roundup because it sits at the API boundary. Pair it with llm-guardrails-designer when the tools have side effects."
related: ["guide:best-claude-skills-for-api-development", "guide:best-claude-skills-for-security", "skill:llm-output-schema-generator", "skill:llm-eval-suite-scaffolder", "skill:model-router-designer", "skill:llm-guardrails-designer"]
---

The useful Claude skills for AI applications cover the engineering around the model call: a typed response, a failure path, a way to measure a change, a way to see the bill, and limits on what data goes in and what comes out.

These ten were picked from the AgentsCamp library on three criteria: each owns one job with no overlap in its trigger, each states a concrete output (a file, a table, a threshold) instead of advice, and together they follow the order a feature matures in. Skills that only matter for retrieval are in the [RAG roundup](/guides/skills/best-claude-skills-for-rag).

| Skill | What you hand it | What you get back | Edits code? |
| --- | --- | --- | --- |
| [llm-output-schema-generator](/skills/api/llm-output-schema-generator) | Example outputs, including edge cases | Pydantic, Zod, BAML, or JSON Schema wired into the call | Yes |
| [provider-fallback-wrapper](/skills/api/provider-fallback-wrapper) | The existing LLM call sites | Wrapper with timeout, retries, fallback, logging | Yes |
| [llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder) | 20-50 real inputs with expected behavior | Suite, baseline score, CI gate | Yes |
| [prompt-regression-tester](/skills/data/prompt-regression-tester) | A prompt or model change | Per-case regression report, non-zero exit | Writes `evals/` |
| [hallucination-evaluator](/skills/data/hallucination-evaluator) | Question, context, answer triples | Groundedness score, retrieval vs generation split | No |
| [token-usage-profiler](/skills/data/token-usage-profiler) | Call sites and provider `usage` data | Spend table by feature tag, ranked levers | No |
| [model-router-designer](/skills/data/model-router-designer) | A sample of real requests | Tiers, thresholds, escalation cascade | Design only |
| [semantic-cache-designer](/skills/data/semantic-cache-designer) | 100-300 labeled query pairs | Threshold, cache key, TTL, no-cache rules | Design only |
| [prompt-pii-redactor](/skills/security/prompt-pii-redactor) | The data categories that are sensitive | Redaction layer on requests, responses, logs | Yes |
| [llm-guardrails-designer](/skills/security/llm-guardrails-designer) | Untrusted inputs and unacceptable outputs | Input and output rails, fail-closed | Yes |

Every skill here can be triggered by describing the task or by typing its name as a slash command, for example `/token-usage-profiler`.

## One feature, start to finish

Take a fictional example: Acme's helpdesk wants a button that summarizes a support ticket thread into a status, a one-paragraph summary, and a next action. The skills fire in this order.

| Step | Prompt to Claude | Skill | What lands |
| --- | --- | --- | --- |
| 1 | "Here are three summaries we want back. Generate a Zod schema and wire it into `summarizeThread()`." | llm-output-schema-generator | `status` as an enum, field descriptions, retry on validation failure |
| 2 | "Wrap the `summarizeThread` model call so a 429 or timeout doesn't fail the request." | provider-fallback-wrapper | Deadline, backoff with jitter, fallback model, re-validation after fallback |
| 3 | "Scaffold an eval suite for ticket summaries from `fixtures/tickets/`." | llm-eval-suite-scaffolder | Frozen dataset, format-validity and accuracy metrics, committed baseline |
| 4 | "Tickets contain emails and card numbers. Redact before the provider call and in our traces." | prompt-pii-redactor | Reversible tokens for names the summary must mention, masks for card numbers |
| 5 | "I shortened the system prompt. Did anything regress?" | prompt-regression-tester | Report listing regressions and fixes by case ID |
| 6 | "The summary feature has a week of traffic. Where is the spend going?" | token-usage-profiler | Cost by tag, input and output separated |

Step 5 is where the setup pays for itself. The report format comes from the skill's own template:

```text
42 cases | 39 pass / 3 fail   (baseline: 40 pass / 2 fail)
REGRESSIONS (2)  ← blocks merge
  refund-001   json_schema: missing field "reason"
  tone-014     judge(2/3): newly apologetic where baseline was neutral
FIXES (1)
  parse-007    regex: now matches order-id format
Exit code: 1 (regressions present)
```

A candidate that fixes two cases and breaks two others has the same pass rate as the baseline. The per-case list is what catches it.

## 1. llm-output-schema-generator: typed responses from real examples

[llm-output-schema-generator](/skills/api/llm-output-schema-generator) infers fields and types from sample outputs you give it, not from a guess, and asks for edge cases so optional fields and unions come out right. It uses enums for closed sets, adds bounds and patterns, and writes a description on every field with units and formats ("ISO 8601", "USD cents"), because structured-output libraries pass those descriptions to the model. Output is Pydantic, Zod, a `.baml` type, or JSON Schema to match [Instructor](/tools/instructor), [BAML](/tools/baml), or the [Vercel AI SDK](/tools/vercel-ai-sdk), wired into the call with retry on validation failure.

It prefers flat shapes, so expect pushback on deeply nested output. It does not generate test fixtures or document an existing API.

## 2. provider-fallback-wrapper: an outage path for every call

[provider-fallback-wrapper](/skills/api/provider-fallback-wrapper) puts a deadline on each call, retries only timeouts, `429`, and `5xx` with exponential backoff, jitter, and an attempt cap, and never retries `400`, `401`, or content-policy refusals. After retries are exhausted it falls back to another model or provider while keeping the response shape stable, re-runs structured-output validation on the fallback's answer, and logs which provider served each request so you can see when the primary is degraded.

If you already run a gateway such as [LiteLLM](/tools/litellm) or [OpenRouter](/tools/openrouter), the skill points you to its built-in fallback instead of writing a second one. For agents that execute tools, it warns that retrying the model call is safe only when the side effects are idempotent.

## 3. llm-eval-suite-scaffolder: a baseline before you tune

[llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder) starts by forcing one decision: how a single output is scored (exact match, schema-valid, numeric tolerance, or a judge rubric). It then collects 20-50 real inputs that oversample hard cases (empty input, ambiguity, a prompt-injection attempt), picks two or three metrics, and generates the suite in [DeepEval](/tools/deepeval), [promptfoo](/tools/promptfoo), or [RAGAS](/tools/ragas). It runs the current prompt once, commits the score as the baseline, and adds a CI step that fails below threshold.

It will not pad the dataset with hundreds of synthetic cases; the skill says twenty well-chosen real ones beat a thousand bland ones.

## 4. prompt-regression-tester: diff a change against the baseline

[prompt-regression-tester](/skills/data/prompt-regression-tester) first greps for the prompt, model ID, and SDK call so the harness reproduces the production call exactly. It freezes 15-40 cases in `evals/cases.jsonl`, including every input that has failed before, and attaches the tightest assertion that fits: `exact`, `contains`, `regex`, `json_schema`, `structural`, or an LLM judge with a discrete verdict for qualities code cannot check.

```json
{"id": "refund-001", "input": "...", "assert": [
  {"type": "json_schema", "schema": "schema/refund.json"},
  {"type": "not_contains", "value": "As an AI"}
]}
```

Baseline and candidate run in the same invocation. Judge-scored cases run three times and need a majority before they count as a regression. The baseline file changes only through an explicit accept step, committed alongside the prompt change.

## 5. hallucination-evaluator: score claims against the source

[hallucination-evaluator](/skills/data/hallucination-evaluator) measures faithfulness to the context you supplied, not truth about the world. It splits each answer into atomic claims, labels each `supported`, `not_supported`, or `contradicted` with an NLI model or a judge told to use only the provided source, and includes questions whose answer is absent so abstention gets tested. The report gives groundedness (supported claims over total), abstention accuracy, and separate rates for retrieval failures and generation failures.

Use it on any feature that summarizes or answers from provided documents. It reads and runs; it does not change your prompt.

## 6. token-usage-profiler: find which feature owns the bill

[token-usage-profiler](/skills/data/token-usage-profiler) greps for every model call site and plans a feature tag for each (plus tenant where billing matters), taking token counts from the provider's `usage` object instead of a local tokenizer. Over a representative window such as seven days it computes cost with input and output in separate columns, sorts by tag, and labels each top driver as a per-call problem or a volume problem. Levers come in a fixed order: trim input, cap output, downshift the model, cache stable prefixes. It finishes with a baseline and an alert threshold per tag.

Without tags it stops at a grand total, so expect the first pass to be instrumentation.

## 7. model-router-designer: send easy requests to a cheaper model

[model-router-designer](/skills/data/model-router-designer) buckets a sample of real requests into mechanical, moderate, and hard, and stops if the easy share is too small to matter. It picks the cheapest signal that separates the tiers (endpoint, input length, or a capability flag before a classifier, and a classifier before an LLM router), writes thresholds as explicit rules, and designs a cascade: default to the cheap tier, validate the output, retry on the strong tier on failure. High-stakes paths always route strong.

The output is a design document with per-route cost, latency, and quality targets. It names default model IDs for each tier; check those against your provider's current lineup before adopting them.

## 8. semantic-cache-designer: reuse answers without serving the wrong one

[semantic-cache-designer](/skills/data/semantic-cache-designer) makes two decisions explicit. The threshold is calibrated by sweeping roughly 0.80 to 0.97 over 100-300 labeled query pairs and reading false-hit and false-miss rates off the curve. The key is composite, `tenant + locale + model@version + prompt@version + context@version`, plus the user for personalized answers. It adds TTLs, invalidation tied to document versions, and a written no-cache rule for time-sensitive, multi-turn, and side-effecting requests.

Its own example of the failure it prevents: "How do I cancel my subscription?" and "How do I cancel my order?" sit close together in embedding space.

## 9. prompt-pii-redactor: keep sensitive values out of prompts and logs

[prompt-pii-redactor](/skills/security/prompt-pii-redactor) lists the categories that matter for your app (identifiers, government and financial IDs, secrets), detects them with regex and validators plus NER for free-form names, and chooses per category between an irreversible mask and a reversible token whose mapping stays in your environment. It applies the layer to outgoing requests, to responses when de-tokenizing, and to logs and traces, then tests for both misses and over-redaction. It can build on [LLM Guard](/tools/llm-guard)'s scanners.

The last step is a residual-risk statement: novel formats and contextual PII get through, so it recommends data minimization and provider no-retention settings alongside.

## 10. llm-guardrails-designer: checks in code around the model

[llm-guardrails-designer](/skills/security/llm-guardrails-designer) begins with a threat model: which inputs are untrusted (user, retrieved content, tool output) and which outputs are unacceptable. Input rails cover injection patterns, PII stripping, banned topics, and size limits. Output rails cover schema conformance, policy, leakage of secrets or the system prompt, and grounding for RAG. It implements them with [NeMo Guardrails](/tools/nemo-guardrails) or [LLM Guard](/tools/llm-guard), makes each rail block or escalate when it trips or errors, and logs every trigger.

It is explicit that rails are one layer. Least privilege and human approval for consequential actions still have to exist outside it.

## Where these skills overlap

- **Eval suite vs regression tester.** Scaffold the suite once per feature; run the regression tester on every prompt or model change. If you only install one, take the scaffolder for a new feature and the tester for a prompt that already shipped.
- **Profiler vs router vs cache.** The profiler tells you whether routing or caching is worth doing. Skip it and you are guessing which lever matters.
- **Redactor vs guardrails.** The redactor is one input rail. The guardrails skill calls it out as the usual way to implement PII stripping.

## Recommended AI application stack

```bash
npx agentscamp add skills/llm-output-schema-generator
npx agentscamp add skills/provider-fallback-wrapper
npx agentscamp add skills/llm-eval-suite-scaffolder
npx agentscamp add skills/prompt-regression-tester
npx agentscamp add skills/prompt-pii-redactor
```

Add `token-usage-profiler` after the first week of traffic, and the router and cache skills only if its table says the spend is there.

## Continue exploring

- [10 Best Claude Skills for API Development](/guides/skills/best-claude-skills-for-api-development) — Error contracts, idempotency, pagination, webhooks, OpenAPI, tool definitions, and MCP servers.
- [10 Best Claude Skills for Security Work](/guides/skills/best-claude-skills-for-security) — Secrets, dependencies, permissions, auth, threat models, headers, PII, and LLM guardrails.
- [Best Claude Skills for LLM Evals](/guides/skills/best-claude-skills-for-llm-evals) — Judges, trajectories, and regression gates beyond the two eval skills above.
