---
name: "Arize Phoenix"
title: "Arize Phoenix"
description: "An open-source LLM observability and evaluation tool built on OpenTelemetry, runnable anywhere."
url: "https://phoenix.arize.com"
date: 2026-06-03
pricing: "open-source"
category: "observability"
repo: "https://github.com/Arize-ai/phoenix"
sameAs: ["https://github.com/Arize-ai/phoenix", "https://docs.arize.com/phoenix"]
color: "orange"
topics: ["llm-evals"]
tags: ["observability", "tracing", "evals", "open-source", "opentelemetry"]
featured: false
alternativeTo: ["langfuse", "langsmith"]
summary: "Arize Phoenix is an open-source LLM tracing and evaluation tool built on OpenTelemetry/OpenInference. Run it locally in a notebook or self-host it to capture traces, run evals (including LLM-as-judge), and debug RAG and agent runs without sending data to a vendor."
related: ["langfuse", "langsmith", "best-llm-eval-tools-2026", "llm-observability-engineer"]
---

Arize Phoenix is an open-source observability and evaluation tool for LLM applications. Built on **OpenTelemetry** and the OpenInference tracing standard, it captures the full trace of a run and lets you evaluate outputs — and because it's open source and runs locally or self-hosted, your traces never have to leave your environment.

It is aimed at engineers who want vendor-neutral observability they can spin up in a notebook during development and self-host in production. Phoenix is the open-source companion to Arize's commercial platform, so you can start free and graduate to the managed product if you outgrow it.

## Highlights

- **OpenTelemetry-native tracing** — instrument with open standards (OpenInference), avoiding lock-in to one vendor's SDK.
- **Run anywhere** — launch locally in a notebook for dev, or self-host for team/production use.
- **Built-in evals** — LLM-as-judge and other evaluators for relevance, hallucination, and RAG quality.
- **RAG & agent debugging** — inspect retrieval steps, tool calls, and the full span tree behind an answer.
- **Framework-agnostic** — works across common LLM and orchestration stacks via auto-instrumentation.

## In an AI-assisted workflow

```python
import phoenix as px
px.launch_app()          # local UI for traces + evals
# auto-instrument your LLM/agent calls, then inspect spans and run evaluators
```

> [!TIP]
> Because Phoenix speaks OpenTelemetry, the instrumentation you add is portable — you can ship the same traces to another OTel-compatible backend later without re-instrumenting.

## Good to know

Phoenix is open source and free to self-host; you bring an LLM provider for judge-based evals. Arize also offers a managed platform for teams that want hosted scale and support. For a hosted-first open-source option, compare [Langfuse](/tools/langfuse); for the commercial LangChain-native option, [LangSmith](/tools/langsmith).
