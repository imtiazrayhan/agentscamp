---
name: "Arize Phoenix"
title: "Arize Phoenix"
description: "A source-available (Elastic License 2.0) LLM observability and evaluation tool built on OpenTelemetry, runnable anywhere."
seoDescription: "Arize Phoenix is a source-available (ELv2) LLM observability and evaluation platform built on OpenTelemetry — self-hostable tracing, evals, and datasets."
url: "https://phoenix.arize.com"
date: 2026-06-03
updated: "2026-09-11"
pricing: "free"
category: "observability"
repo: "https://github.com/Arize-ai/phoenix"
license: "Elastic-2.0"
sameAs: ["https://github.com/Arize-ai/phoenix", "https://arize.com/docs/phoenix"]
color: "orange"
topics: ["llm-evals"]
audience: ["ai-engineers", "devops"]
tags: ["observability", "tracing", "evals", "source-available", "opentelemetry"]
featured: false
alternativeTo: ["langfuse", "langsmith"]
summary: "Arize Phoenix is a source-available (ELv2) LLM tracing and evaluation tool built on OpenTelemetry/OpenInference. Run it locally in a notebook or self-host it to capture traces, run evals (including LLM-as-judge), and debug RAG and agent runs without sending data to a vendor."
related: ["tool:langfuse", "tool:langsmith", "guide:best-llm-eval-tools-2026", "agent:llm-observability-engineer"]
faq:
  - q: "What is Arize Phoenix?"
    a: "Arize Phoenix is a source-available observability and evaluation tool for LLM applications (Elastic License 2.0), built on OpenTelemetry and the OpenInference tracing standard. It captures the full trace of a run, runs evals (including LLM-as-judge) for relevance, hallucination, and RAG quality, and lets you debug RAG and agent runs by inspecting the span tree behind an answer."
  - q: "Is Arize Phoenix free?"
    a: "Yes — Phoenix is free to self-host under the Elastic License 2.0 (source-available; it bars offering Phoenix to others as a hosted service), and because it runs locally or self-hosted, your traces never have to leave your environment. You bring an LLM provider for judge-based evals, and Arize offers a managed commercial platform if you outgrow it."
  - q: "How do I use Arize Phoenix?"
    a: "Start it locally with phoenix serve (or uvx arize-phoenix serve, with no install), auto-instrument your LLM or agent calls, then inspect spans and run evaluators in the local UI. Because Phoenix speaks OpenTelemetry, the instrumentation is portable — you can ship the same traces to another OTel-compatible backend later without re-instrumenting."
  - q: "Arize Phoenix vs Langfuse?"
    a: "Both are free to self-host. Phoenix is source-available (ELv2), OpenTelemetry-native, and built to run anywhere — in a notebook during development or self-hosted in production — while Langfuse is open source (MIT core) with a managed cloud and first-class self-hosting; LangSmith is the commercial LangChain-native alternative."
---

Arize Phoenix is a source-available observability and evaluation tool for LLM applications. Built on **OpenTelemetry** and the OpenInference tracing standard, it captures the full trace of a run and lets you evaluate outputs — and because it runs locally or self-hosted, your traces never have to leave your environment.

It is aimed at engineers who want vendor-neutral observability they can spin up in a notebook during development and self-host in production. Phoenix is the free, self-hostable companion to Arize's commercial platform, so you can start free and graduate to the managed product if you outgrow it.

## Highlights

- **OpenTelemetry-native tracing** — instrument with open standards (OpenInference), avoiding lock-in to one vendor's SDK.
- **Run anywhere** — launch locally in a notebook for dev, or self-host for team/production use.
- **Built-in evals** — LLM-as-judge and other evaluators for relevance, hallucination, and RAG quality.
- **RAG & agent debugging** — inspect retrieval steps, tool calls, and the full span tree behind an answer.
- **Framework-agnostic** — works across common LLM and orchestration stacks via auto-instrumentation.

## In an AI-assisted workflow

```bash
phoenix serve              # local UI for traces + evals
# or, with no install:
uvx arize-phoenix serve
# then auto-instrument your LLM/agent calls, inspect spans, and run evaluators
```

> [!TIP]
> Because Phoenix speaks OpenTelemetry, the instrumentation you add is portable — you can ship the same traces to another OTel-compatible backend later without re-instrumenting.

## Good to know

Phoenix is free to self-host, but it is source-available rather than OSI open source: the Elastic License 2.0 bars offering it to third parties as a hosted or managed service, even though Arize's README still calls Phoenix open source. You bring an LLM provider for judge-based evals. Arize also offers a managed platform for teams that want hosted scale and support. For an open-source (MIT core) option with a managed cloud and first-class self-hosting, compare [Langfuse](/tools/langfuse); for the commercial LangChain-native option, [LangSmith](/tools/langsmith).
