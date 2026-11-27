---
name: "Arize Phoenix"
title: "Arize Phoenix"
description: "A source-available (Elastic License 2.0) LLM observability and evaluation tool built on OpenTelemetry, runnable anywhere."
seoDescription: "Arize Phoenix is a source-available (ELv2) LLM observability and evaluation platform built on OpenTelemetry — self-hostable tracing, evals, and datasets."
url: "https://phoenix.arize.com"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
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
summary: "Arize Phoenix is a free, self-hosted LLM tracing and evaluation tool from Arize, built on OpenTelemetry and OpenInference and licensed under the Elastic License 2.0. Start it with one command, send traces from your app, then run evals, datasets, experiments and prompt tests in its UI. Arize's managed product is a separate platform, Arize AX."
related: ["tool:langfuse", "tool:langsmith", "guide:best-llm-eval-tools-2026", "agent:llm-observability-engineer"]
faq:
  - q: "What is Arize Phoenix?"
    a: "Arize Phoenix is a source-available observability and evaluation tool for LLM applications (Elastic License 2.0), built on OpenTelemetry and the OpenInference tracing standard. It captures the full trace of a run, runs evals (including LLM-as-judge) for response and retrieval quality, and adds datasets, experiments, a prompt playground and prompt management."
  - q: "Is Arize Phoenix free?"
    a: "Yes. Arize's self-hosting docs describe Phoenix as free to self-host with no license fees, usage limits or feature gates, and nothing is sent to Arize. You still pay for the infrastructure you run it on and for the LLM provider behind judge-based evals. The managed product, Arize AX, is priced separately: as of November 2026 its pricing page lists AX Free at $0 with 25,000 spans a month and AX Pro at $50 per month with 50,000."
  - q: "How do I use Arize Phoenix?"
    a: "Start it with pip install arize-phoenix and phoenix serve, or uvx arize-phoenix serve with no install. Then run npx @arizeai/phoenix-cli setup in your project so a coding agent adds the right OpenInference instrumentation, or wire it by hand with register() from phoenix.otel. Because Phoenix speaks OpenTelemetry, the same instrumentation can send traces to another OTel backend later."
  - q: "Arize Phoenix vs Langfuse?"
    a: "Both are free to self-host and both accept OpenTelemetry traces. Phoenix is licensed under ELv2, starts locally with one command, and has no hosted tier of its own (Arize points you to Arize AX). Langfuse has an MIT core plus commercially licensed enterprise directories, a managed cloud with a free tier, and a heavier self-hosted stack. LangSmith is the commercial, LangChain-native alternative."
---

Arize Phoenix is a source-available observability and evaluation tool for LLM applications, built by [Arize](https://arize.com). It is built on **OpenTelemetry** and the OpenInference tracing standard, captures the full trace of a run, and lets you evaluate the outputs. It runs on your machine or your infrastructure, so traces never have to leave your environment.

It is aimed at engineers who want vendor-neutral observability they can start in a terminal during development and self-host in production. Phoenix is the free, self-hosted product; Arize's managed platform is a separate product, **Arize AX**, and the same OpenInference instrumentation works with both.

## Highlights

- **OpenTelemetry-native tracing.** Instrumentation uses OpenInference packages for each framework or provider, so you are not tied to one vendor's SDK.
- **Evaluation.** LLM-as-judge evaluators for response and retrieval quality, run over traces or datasets.
- **Datasets and experiments.** Versioned datasets of examples, and experiments that track how a prompt, model or retrieval change scores against them.
- **Playground and prompt management.** Compare models, adjust parameters, replay a traced LLM call with a different prompt, and version and tag prompts.
- **Built for coding agents too.** Each Phoenix instance serves a remote MCP server at its `/mcp` endpoint, so Claude Code, Cursor and other MCP clients can query traces, datasets and experiments. A plugin for Claude Code and Codex registers that server and installs Phoenix's skills.
- **PXI (Phoenix Intelligence).** An assistant built into the UI for debugging traces and iterating on prompts.
- **Deploy anywhere.** A pip package, a Docker image at `arizephoenix/phoenix`, and a Helm chart for Kubernetes, with OAuth2, LDAP or local accounts for authentication.

## In an AI-assisted workflow

```bash
pip install arize-phoenix
phoenix serve              # local UI for traces + evals
# or, with no install:
uvx arize-phoenix serve

# in your project: let your coding agent add instrumentation
npx @arizeai/phoenix-cli setup
```

To wire tracing by hand, the docs' Python quickstart for an OpenAI app is one `register()` call after install:

```python
# pip install -U arize-phoenix-otel openai openinference-instrumentation-openai
from phoenix.otel import register

register(
    project_name="tracing-quickstart",
    protocol="http/protobuf",
    auto_instrument=True,  # instruments every installed OpenInference package
)
```

> [!TIP]
> Because Phoenix speaks OpenTelemetry, the instrumentation you add is portable: you can ship the same traces to another OTel-compatible backend later without re-instrumenting.

## Pricing

Phoenix itself has no price. Arize's self-hosting docs say it is free to self-host with no license fees, usage limits or feature gates. Your costs are the server and database you run it on and the model calls your evaluators make.

If you want it managed, the path Arize offers is Arize AX. As of November 2026, Arize's pricing page lists AX Free at $0 (25,000 trace spans and 1 GB of ingestion a month, 15-day retention), AX Pro at $50 per month (50,000 spans, 10 GB, 30-day retention) and a custom AX Enterprise plan that can be SaaS or self-hosted. All three include unlimited users and evals.

## Good to know

**The license is not OSI open source.** Phoenix is under the Elastic License 2.0, which bars offering it to third parties as a hosted or managed service. Arize's README still calls Phoenix "fully open source". For internal use the difference rarely matters; if you plan to resell observability, it does.

**It moves fast.** The server package reached `arize-phoenix` v22.1.0 on November 26, 2026, and the repository has about 12,500 GitHub stars as of November 2026. Major versions arrive often, so pin the version in production and read the release notes before upgrading.

**You run it.** There is no hosted Phoenix tier in Arize's current README, which describes Phoenix as "open-source and self-hosted". Retention, backups, upgrades and access control are yours to operate.

**Alternatives.** [Langfuse](/tools/langfuse) has an MIT core, a managed cloud with a free tier and a larger self-hosted stack to run. [LangSmith](/tools/langsmith) is the commercial choice for teams on LangChain or LangGraph. [Opik](/tools/opik) from Comet is Apache-2.0 if the ELv2 terms are a blocker. Pick Phoenix when you want something running locally in a minute and care most about OpenTelemetry portability; see [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026) for the wider field.
