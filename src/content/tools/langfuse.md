---
name: "Langfuse"
title: "Langfuse"
description: "An open-source LLM engineering platform for tracing, evals, prompt management, and metrics."
seoDescription: "Langfuse is an open-source LLM engineering platform for tracing, evals, prompt management, and metrics — self-hosted or cloud. Pricing and alternatives."
url: "https://langfuse.com"
date: 2026-06-03
pricing: "open-source"
category: "observability"
repo: "https://github.com/langfuse/langfuse"
license: "MIT"
sameAs: ["https://github.com/langfuse/langfuse", "https://langfuse.com/docs"]
color: "cyan"
topics: ["llm-evals"]
tags: ["observability", "tracing", "evals", "prompt-management", "open-source"]
featured: false
alternativeTo: ["langsmith", "arize-phoenix", "braintrust"]
summary: "Langfuse is an open-source LLM engineering platform combining tracing, evaluations, prompt management, and cost/latency metrics. Self-host it or use the managed cloud; it's framework-agnostic and a popular open alternative to LangSmith."
related: ["tool:arize-phoenix", "tool:langsmith", "guide:best-llm-eval-tools-2026", "agent:llm-observability-engineer"]
faq:
  - q: "What is Langfuse?"
    a: "Langfuse is an open-source LLM engineering platform that brings tracing, evaluation, prompt management, and metrics together. It captures nested traces of LLM calls, tool calls, and agent steps with cost and latency per span, lets you score runs manually, with LLM-as-judge, or via user feedback, and versions prompts you can deploy without redeploying your app."
  - q: "Is Langfuse free?"
    a: "Yes — Langfuse is open source under MIT and free to self-host; a managed cloud with a free tier and paid plans is also available. You bring an LLM provider for judge-based evals."
  - q: "Langfuse vs LangSmith?"
    a: "Langfuse is a popular open-source alternative to LangSmith: MIT-licensed, framework-agnostic, and fully self-hostable for privacy or cost control. LangSmith and Braintrust are the commercial comparisons, and Arize Phoenix is the OTel-native open-source one."
---

Langfuse is an open-source LLM engineering platform that brings tracing, evaluation, prompt management, and metrics together. It captures detailed traces of your LLM and agent runs, lets you score them (manually, with LLM-as-judge, or via user feedback), manages and versions prompts, and tracks cost and latency — all in a tool you can self-host or run as a managed cloud.

It is aimed at teams who want a vendor-neutral, open-source backbone for LLM observability and evals, with the option of self-hosting for privacy or cost control. It is framework-agnostic and integrates broadly across the LLM tooling ecosystem.

## Highlights

- **Tracing** — nested traces of LLM calls, tool calls, and agent steps, with cost and latency per span.
- **Evaluations** — LLM-as-judge, manual scoring, and user-feedback signals on traced runs.
- **Prompt management** — version, deploy, and A/B prompts without redeploying your app.
- **Metrics & dashboards** — quality, cost, and latency over time, sliced by version or user.
- **Self-host or cloud** — run it entirely in your own environment, or use the managed service.

## In an AI-assisted workflow

Instrument your app with the SDK (or an OpenTelemetry integration), then traces, costs, and scores flow into Langfuse where you can build datasets and run evals against real traffic.

```python
from langfuse import observe

@observe()
def answer(question: str) -> str:
    ...  # traced automatically: inputs, outputs, latency, cost
```

> [!TIP]
> Manage prompts in Langfuse rather than in code: you can iterate and roll back prompt versions in production without a deploy, and tie each version to its eval scores.

## Good to know

Langfuse is open source (MIT) and free to self-host; a managed cloud with a free tier and paid plans is also available. You bring an LLM provider for judge-based evals. Compare with the commercial [LangSmith](/tools/langsmith) and [Braintrust](/tools/braintrust), and the OTel-native [Arize Phoenix](/tools/arize-phoenix).
