---
name: "LangSmith"
title: "LangSmith"
description: "LangChain's platform for tracing, evaluating, and monitoring LLM apps — framework-agnostic."
url: "https://www.langchain.com/langsmith"
date: 2026-06-03
pricing: "freemium"
category: "observability"
sameAs: ["https://docs.smith.langchain.com"]
color: "blue"
topics: ["llm-evals"]
tags: ["observability", "tracing", "evals", "monitoring"]
featured: false
alternativeTo: ["langfuse", "arize-phoenix", "braintrust"]
summary: "LangSmith is LangChain's hosted platform for tracing, evaluating, and monitoring LLM applications. It captures every step of a chain or agent run, lets you build datasets and run offline/online evals, and works whether or not you use LangChain."
related: ["langfuse", "arize-phoenix", "best-llm-eval-tools-2026", "llm-observability-engineer"]
---

LangSmith is LangChain's platform for the operational side of LLM apps: **tracing** every step of a run, **evaluating** against datasets, and **monitoring** quality, latency, and cost in production. Despite the name, it is framework-agnostic — you can instrument an app built with or without LangChain.

It is aimed at teams who want one place to see what their chains and agents actually did, turn real traffic into evaluation datasets, and catch regressions before and after deploy. Its tracing is especially useful for agents, where a single user request can fan out into many tool calls and model invocations that are hard to debug from logs alone.

## Highlights

- **Tracing** — capture the full tree of LLM calls, tool calls, and intermediate steps for any run.
- **Datasets & evals** — build datasets from traces, run offline evals (including LLM-as-judge), and compare versions.
- **Online evaluation & monitoring** — score production traffic and track quality/latency/cost over time.
- **Prompt management & playground** — version prompts and iterate with a hosted playground.
- **Framework-agnostic** — SDKs and OpenTelemetry-style instrumentation for any stack.

## In an AI-assisted workflow

Set a few environment variables and your runs start showing up as traces:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=...
```

Then promote interesting traces into a dataset and run evaluations against it as you change prompts or models.

> [!NOTE]
> Tracing is the foundation for everything else: you can't evaluate or debug what you can't see. Instrument first, then build datasets from real traffic.

## Good to know

LangSmith is a commercial platform with a free tier and usage-based paid plans. It is hosted (a self-hostable enterprise option exists). For fully open-source alternatives, compare [Langfuse](/tools/langfuse) and [Arize Phoenix](/tools/arize-phoenix); see [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026) for the full landscape.
