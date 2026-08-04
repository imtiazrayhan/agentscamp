---
title: "LLM Observability in Production: Traces, Evals, Cost, and Feedback"
description: "Instrument production LLM applications with end-to-end traces, online evals, cost and latency metrics, privacy controls, alerts, and a failure-feedback loop."
author: "AgentsCamp"
date: 2026-08-04
color: "orange"
topics: ["llm-evals", "mlops-ai-infra"]
tags: ["llm-observability", "tracing", "online-evals", "monitoring", "llmops"]
featured: true
summary: "LLM observability connects each user outcome to the retrieval, model, tool, and parser steps that produced it. Production coverage needs end-to-end traces, stable version metadata, cost and latency per span, sampled online quality evaluation, privacy-aware payload capture, and alerts tied to user impact. The loop closes when real failures become reproducible offline eval cases."
keyTakeaways:
  - "Trace the full request tree—retrieval, model calls, tools, parsers, retries, and fallbacks—under one correlation ID."
  - "Attach prompt, model, dataset, route, and application versions so regressions can be compared and rolled back."
  - "Monitor four pillars together: quality, latency, cost, and reliability; optimizing one can silently damage another."
  - "Capture inputs and outputs according to a deliberate privacy policy, with redaction, sampling, access controls, and retention limits."
  - "Turn production failures and user feedback into labeled offline eval cases so every incident improves future release gates."
faq:
  - q: "What is LLM observability?"
    a: "LLM observability is the instrumentation and analysis needed to explain a model-driven outcome. It combines traces of prompts, retrieval, tool calls, and model responses with quality evaluation, cost, latency, errors, and user feedback."
  - q: "How is LLM observability different from normal application monitoring?"
    a: "Traditional monitoring shows whether a request succeeded and how long it took. LLM observability must also show the probabilistic path and quality: which context was retrieved, which prompt and model ran, which tools acted, what the output cost, and whether the answer was useful or grounded."
  - q: "Should I log every LLM prompt and response?"
    a: "Not automatically. Raw payloads are valuable for debugging but may contain personal data, secrets, customer content, or regulated information. Define field-level redaction, sampling, access, encryption, and retention before capture, and allow metadata-only tracing where content storage is inappropriate."
  - q: "What should an LLM dashboard include?"
    a: "At minimum: quality score or task-success proxy, p50 and p95 latency, cost and tokens per successful request, error and fallback rates, and slices by model, route, prompt version, tenant, and task. Agent systems should also show tool failure and step-count distributions."
related: ["tracing", "llmops", "llm-observability-engineer", "dashboard-designer", "structured-logging-designer", "langfuse", "arize-phoenix", "langsmith", "write-llm-evals"]
howtoSteps:
  - name: "Define observable outcomes"
    text: "Name the user-visible success, quality, latency, cost, and reliability measures for each important LLM task before choosing a platform."
  - name: "Instrument the full trace"
    text: "Connect retrieval, model, tool, parser, retry, and fallback spans under one request ID with version and routing metadata."
  - name: "Apply a data policy"
    text: "Classify payload fields, redact sensitive values, choose sampling and retention, and restrict access before storing production content."
  - name: "Add online evaluation and alerts"
    text: "Score a representative traffic sample, combine it with deterministic checks and user feedback, and alert on sustained impact rather than isolated noise."
  - name: "Close the offline loop"
    text: "Promote confirmed production failures into a labeled eval dataset, reproduce them locally, and gate future releases against the regression."
---

**LLM observability explains why a model-driven request produced its outcome.** A normal application trace may say an endpoint returned `200` in 1.8 seconds. An LLM trace needs to reveal that retrieval missed the authoritative document, the model called a tool twice, a fallback changed providers, the parser repaired malformed output, and the final answer still failed the task.

Production observability therefore combines three disciplines:

- **Tracing** — the complete execution path for one request.
- **Evaluation** — whether the output was correct, grounded, useful, safe, or otherwise fit for purpose.
- **Operations** — latency, cost, errors, saturation, alerts, access, and retention.

Any one alone leaves a blind spot. A quality score without a trace cannot explain a regression. A trace without evaluation shows what happened but not whether it was good. A dashboard without data governance can become a second copy of every sensitive conversation.

## Start with the user outcome

Define observability around tasks, not model calls. “Chat completion succeeded” is infrastructure health; “support question answered correctly without escalation” is product health.

For each important task, define:

- **Success:** the user-visible or downstream outcome
- **Quality:** accuracy, faithfulness, completion, format validity, or another task metric
- **Latency:** time to first useful output and total completion time
- **Cost:** tokens and provider spend per successful task
- **Reliability:** error, timeout, fallback, retry, and abandonment rates

These measures create the questions the instrumentation must answer. Tools come afterward.

## Trace the whole request tree

Use one correlation or trace ID from the incoming request through every LLM-specific step:

```text
request
├── input policy / redaction
├── retrieval
│   ├── query rewrite
│   ├── vector search
│   └── rerank
├── model call
│   ├── prompt render
│   ├── provider request
│   └── streamed response
├── tool call
│   ├── argument validation
│   └── external API
├── output parser / guardrail
└── retry, escalation, or fallback
```

Each span should capture its duration, status, input and output sizes, errors, and the identifiers needed to compare behavior across deployments. For model spans, record tokens, cost, cache usage, finish reason, and provider request ID when available. For retrieval, record query, filters, document IDs, scores, and selected chunks. For tools, record the tool name, validated arguments or a safe digest, result status, and side-effect classification.

Prefer portable telemetry standards such as OpenTelemetry and LLM-oriented semantic conventions when they fit the stack. Backend portability matters less than consistent instrumentation, but open spans reduce the cost of changing the storage and analysis layer later.

## Version every behavior-changing input

Many regressions are impossible to explain because the trace says only “model X.” Attach:

- application and Git revision
- prompt template and system-instruction version
- model, provider, and relevant inference configuration
- retrieval index, embedding model, and reranker version
- tool schema version
- routing and fallback policy version
- evaluation rubric and judge version
- experiment or feature-flag cohort

Store stable IDs rather than pasting whole configuration objects into every span. A trace should let you answer “what changed between the healthy and unhealthy cohort?” without reconstructing deployment history from memory.

## Monitor four pillars together

### Quality

Use deterministic checks for schema validity, citations, and business rules. Apply a calibrated [LLM-as-judge](/guides/evaluation/llm-as-judge-guide) to a sampled subset for semantic criteria. Combine those signals with explicit user feedback, edits, retries, abandonment, and downstream task completion.

No single score is truth. A thumbs-up rate is selection-biased; a judge inherits model bias; task completion can be delayed. Triangulate and slice.

### Latency

Track end-to-end p50, p95, and p99 plus span-level contribution. Separate time to first token from total duration for streaming interfaces. Watch queueing, retrieval, tools, retries, and fallback rather than blaming the model for the entire request.

### Cost

Measure input, cached input, output, tool, embedding, reranking, and judge cost. Report cost per **successful task**, not only per request. A cheap model that retries and escalates may cost more than a stronger one that finishes once.

### Reliability

Track provider errors, timeouts, malformed outputs, guardrail blocks, tool failures, retry counts, route changes, and user-visible failure. Agent systems also need step count and loop detection: a technically successful 40-step run can be an operational failure.

## Slice before averaging

Global averages conceal the failures users feel. Break dashboards down by:

- task and endpoint
- prompt, model, and route version
- language and input length
- tenant or customer tier, with privacy-safe aggregation
- tool or retrieval path
- experiment cohort
- success, retry, escalation, and fallback outcome

Compare releases on matched slices. If traffic mix shifted toward easier queries, a better aggregate quality score may say nothing about the new prompt.

## Make payload capture a policy decision

Prompts, retrieved documents, and tool output can contain personal data, credentials, source code, customer secrets, or regulated information. Decide before production:

- which fields may be stored raw
- which must be redacted, hashed, tokenized, or omitted
- whether content capture is sampled or metadata-only
- who can query raw traces
- how data is encrypted and isolated
- how long each class is retained
- how deletion and tenant boundaries are enforced

Redact before export when possible. A dashboard access control does not undo sensitive data already copied into logs. Test redaction with adversarial payloads, not only well-formed examples.

## Alert on user impact

Avoid alerting on every noisy model score. Useful alerts combine magnitude, duration, sample size, and a task-level slice:

- schema-valid rate below the release floor for 15 minutes
- p95 latency above the user budget with enough traffic
- cost per successful task rising beyond a configured band
- fallback rate spiking for one provider or route
- faithfulness falling on a sustained sampled window
- tool-loop count exceeding a safe limit

Link alerts directly to filtered traces and the deployment or configuration change most likely responsible. An alert that begins with ten minutes of dashboard archaeology is incomplete.

## Turn failures into eval cases

The observability loop closes when a confirmed production failure becomes reproducible:

1. Locate the trace and identify the failing span.
2. Sanitize and minimize the input while preserving the failure.
3. Label the expected behavior and failure category.
4. Add it to the offline eval dataset.
5. Reproduce the current failure.
6. Fix the prompt, retrieval, tool, routing, or code.
7. Gate future releases on the new regression case.

This is the LLM equivalent of turning an incident into a unit test. Over time, the eval dataset becomes a compressed history of what production has taught the team.

> [!TIP]
> Instrument before optimizing. Without spans and version metadata, cost or quality work becomes a sequence of plausible guesses that cannot be attributed or rolled back confidently.

The [LLM Observability Engineer](/agents/data-ai/llm-observability-engineer) packages this rollout as an implementation workflow; [Langfuse](/tools/langfuse), [Arize Phoenix](/tools/arize-phoenix), and [LangSmith](/tools/langsmith) are cataloged backends for storing and exploring the resulting traces and evaluations.
