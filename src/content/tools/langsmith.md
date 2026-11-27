---
name: "LangSmith"
title: "LangSmith"
description: "LangChain's platform for tracing, evaluating, and monitoring LLM apps — framework-agnostic."
seoDescription: "LangSmith is LangChain's platform for tracing, evaluating, and monitoring LLM apps — framework-agnostic, with datasets, evals, and dashboards."
url: "https://www.langchain.com/langsmith"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "observability"
sameAs: ["https://docs.langchain.com/langsmith"]
color: "blue"
topics: ["llm-evals"]
audience: ["ai-engineers", "devops"]
tags: ["observability", "tracing", "evals", "monitoring"]
featured: false
alternativeTo: ["langfuse", "arize-phoenix", "braintrust"]
summary: "LangSmith is LangChain's commercial platform for tracing, evaluating and monitoring LLM apps and agents, and it works with or without LangChain. The free Developer plan covers one seat and 5,000 base traces a month; Plus is $39 per seat as of November 2026. Base traces are kept 14 days, and self-hosting is reserved for the Enterprise plan."
related: ["tool:langfuse", "tool:arize-phoenix", "guide:best-llm-eval-tools-2026", "agent:llm-observability-engineer"]
faq:
  - q: "What is LangSmith?"
    a: "LangSmith is LangChain's platform for the operational side of LLM apps: tracing every step of a run, evaluating against datasets, and monitoring quality, latency and cost in production. Despite the name, it is framework-agnostic. You can instrument an app built with or without LangChain, and the same product now also hosts and deploys agents."
  - q: "How much does LangSmith cost?"
    a: "As of November 2026, LangChain's pricing page lists Developer at $0 for 1 seat with up to 5,000 base traces a month, Plus at $39 per seat per month with up to 10,000 base traces a month and unlimited seats, and Enterprise at custom pricing. Traces beyond the included amount are pay-as-you-go, and other services (agent hosting, Fleet, Engine, sandboxes) are metered in LangChain Standard Units at $1 per LSU."
  - q: "How long does LangSmith keep traces?"
    a: "It depends on the trace tier. LangChain's pricing FAQ says base traces are retained for 14 days and extended traces for 180 days, and that you can upgrade a base trace to an extended one for an additional fee. Extended retention is meant for traces that carry feedback from users, evaluators or human labelers."
  - q: "Can you self-host LangSmith?"
    a: "Only on the Enterprise plan. The pricing page lists Cloud hosting for Developer and Plus, in LangChain's US or EU cloud, and Cloud, Hybrid (SaaS control plane with a self-hosted data plane) or fully Self-Hosted in your own VPC for Enterprise. LangSmith's server is not open source; the Python SDK is MIT-licensed."
  - q: "LangSmith vs Langfuse?"
    a: "LangSmith is closed source, bills per seat plus traces, and fits best when you build on LangChain or LangGraph and want deployment in the same product. Langfuse has an MIT core you can self-host for free and bills its cloud by usage with unlimited users on paid plans. The Langfuse vs LangSmith guide covers the trade-offs."
---

LangSmith is LangChain's platform for the operational side of LLM apps: **tracing** every step of a run, **evaluating** against datasets, and **monitoring** quality, latency and cost in production. Despite the name, it is framework-agnostic: you can instrument an app built with or without LangChain.

It is aimed at teams who want one place to see what their chains and agents did, turn real traffic into evaluation datasets, and catch regressions before and after deploy. Tracing matters most for agents, where a single user request fans out into many tool calls and model invocations that are hard to debug from logs. LangSmith has also grown past observability: the same account covers agent deployment (Agent Server), sandboxes and an LLM gateway.

## Highlights

- **Tracing.** The full tree of LLM calls, tool calls and intermediate steps for any run, from the SDK's `@traceable` decorator, client wrappers such as `wrap_openai`, or LangChain and LangGraph automatically.
- **Datasets and evals.** Build datasets from traces, run offline evals (including LLM-as-judge), compare versions, and collect human feedback in annotation queues.
- **Online evaluation and monitoring.** Score production traffic and track quality, latency and cost over time.
- **Prompt Hub and Playground.** Version prompts and iterate on them in a hosted playground.
- **OpenTelemetry ingest.** LangSmith accepts OTLP traces; the endpoint is your LangSmith API URL plus `/otel`.
- **Deployment.** Agent Server hosts long-running agents with streaming, cron scheduling and scale-to-zero; the Plus plan includes one small serverless Agent Server.

## In an AI-assisted workflow

```bash
pip install -U langsmith openai
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your-langsmith-api-key>"
# EU accounts also need:
# export LANGSMITH_ENDPOINT="https://eu.api.smith.langchain.com"
```

```python
from openai import OpenAI
from langsmith import traceable
from langsmith.wrappers import wrap_openai

client = wrap_openai(OpenAI())  # log every OpenAI call automatically

@traceable(run_type="tool")  # trace this as a tool span
def get_context(question: str) -> str:
    return "Acme's refund window is 30 days."  # stand-in for a retriever

@traceable  # capture the full pipeline as a single trace
def assistant(question: str) -> str:
    context = get_context(question)
    response = client.chat.completions.create(
        model="gpt-6-luna",
        messages=[{"role": "user", "content": f"{context}\n\n{question}"}],
    )
    return response.choices[0].message.content
```

Then promote interesting traces into a dataset and run evaluations against it as you change prompts or models.

> [!NOTE]
> Tracing is the foundation for everything else: you can't evaluate or debug what you can't see. Instrument first, then build datasets from real traffic.

## Pricing

As of November 2026, LangChain's pricing page lists three plans:

- **Developer**: $0, 1 seat, up to 5,000 base traces a month, community support.
- **Plus**: $39 per seat per month, unlimited seats, up to 10,000 base traces a month, plus access to Agent Server and Engine.
- **Enterprise**: custom pricing, with self-hosted and hybrid deployment, custom SSO, RBAC and ABAC, and a support SLA. Enterprise plans are invoiced annually.

Usage past the included traces is pay-as-you-go and billed monthly in arrears. The page shows the per-trace rates in a calculator and tooltips, so check it for your volume. Base traces are retained for 14 days and extended traces for 180 days, and upgrading a trace to extended retention costs extra. Everything beyond tracing is metered in LangChain Standard Units, priced at $1 per LSU as of November 2026. LangChain also offers startups up to $10,000 in credits.

## Good to know

**Seats add up.** Pricing is per seat plus usage, so a ten-person team on Plus pays for ten seats before the first overage trace. Tools that bill by usage alone can be cheaper for wide teams with modest volume.

**Short default retention.** Fourteen days is enough for debugging and too short for trend analysis. Decide early which traces to upgrade to extended retention, since that is a per-trace cost.

**Closed source, self-hosting behind Enterprise.** Developer and Plus run only in LangChain's cloud, in a US or EU region. Hybrid and fully self-hosted deployments need an Enterprise contract.

**SDK repos moved.** The combined `langsmith-sdk` repository was archived on October 16, 2026; the Python SDK now lives in `langchain-ai/langsmith-python` and the JavaScript SDK in `langchain-ai/langsmith-javascript`.

**Compared with the alternatives.** [Langfuse](/tools/langfuse) covers the same ground (tracing, evals, prompt management) with an MIT core, free self-hosting and usage-based cloud pricing with unlimited users on paid plans. [Arize Phoenix](/tools/arize-phoenix) is free to self-host under the Elastic License 2.0, is OpenTelemetry-native and starts locally with one command, but has no hosted tier of its own. [Braintrust](/tools/braintrust) is the closest commercial rival and is centered on evals. LangSmith is the natural pick when you are already on LangChain or LangGraph, where tracing needs only two environment variables, or when you want deployment and observability from one vendor. See [Langfuse vs LangSmith](/guides/comparisons/langfuse-vs-langsmith) and [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026) for the full landscape.
