---
name: "Langfuse"
title: "Langfuse"
description: "An open-source LLM engineering platform for tracing, evals, prompt management, and metrics."
seoDescription: "Langfuse is an open-source LLM engineering platform for tracing, evals, prompt management, and metrics — self-hosted or cloud. Pricing and alternatives."
url: "https://langfuse.com"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "observability"
repo: "https://github.com/langfuse/langfuse"
license: "MIT (core; ee/ commercial)"
sameAs: ["https://github.com/langfuse/langfuse", "https://langfuse.com/docs"]
color: "cyan"
topics: ["llm-evals"]
audience: ["ai-engineers", "devops"]
tags: ["observability", "tracing", "evals", "prompt-management", "open-source"]
featured: false
alternativeTo: ["langsmith", "arize-phoenix", "braintrust"]
summary: "Langfuse is an open-source LLM engineering platform, part of ClickHouse since January 2026, that combines tracing, evaluations, prompt management and cost and latency metrics. The core is MIT-licensed and free to self-host; Langfuse Cloud has a free Hobby plan and paid plans billed by usage, not by seat. It is framework-agnostic and built on OpenTelemetry."
related: ["tool:arize-phoenix", "tool:langsmith", "guide:best-llm-eval-tools-2026", "agent:llm-observability-engineer"]
faq:
  - q: "What is Langfuse?"
    a: "Langfuse is an open-source LLM engineering platform that brings tracing, evaluation, prompt management and metrics together. It captures nested traces of LLM calls, tool calls and agent steps with cost and latency per span, lets you score runs manually, with LLM-as-judge or from user feedback, and versions prompts you can release without redeploying your app."
  - q: "Is Langfuse free?"
    a: "Self-hosting is free: the core is MIT-licensed and Langfuse says all core features run without limits. On Langfuse Cloud, as of November 2026, Hobby is free with 50,000 units a month, 30 days of data access and 2 users; Core is $29 per month and Pro $199 per month, each with 100,000 units included and additional usage at $8 per 100,000 units; Enterprise is $2,499 per month. Paid plans include unlimited users."
  - q: "Who owns Langfuse?"
    a: "ClickHouse. The acquisition was announced in January 2026, the repository's banner now reads \"Langfuse by ClickHouse\", and the license file's copyright line names ClickHouse, Inc. The core remains MIT-licensed and self-hostable; code under the ee/ directories is under a separate commercial license."
  - q: "Langfuse vs LangSmith?"
    a: "Langfuse has an MIT core you can self-host for free and prices its cloud by usage with unlimited users on paid plans. LangSmith is closed source, charges per seat plus traces, and reserves self-hosting for its Enterprise plan, but integrates most tightly with LangChain and LangGraph and adds agent deployment. The Langfuse vs LangSmith guide compares them in detail."
---

Langfuse is an open-source LLM engineering platform that brings tracing, evaluation, prompt management and metrics together. It captures detailed traces of your LLM and agent runs, lets you score them (manually, with LLM-as-judge, or from user feedback), manages and versions prompts, and tracks cost and latency, in a tool you can self-host or use as a managed cloud. Langfuse has been part of ClickHouse since January 2026.

It is aimed at teams who want a vendor-neutral, open-source backbone for LLM observability and evals, with the option of self-hosting for privacy or cost control. It is framework-agnostic and built on OpenTelemetry.

## Highlights

- **Tracing.** Nested traces of LLM calls, tool calls and agent steps, with sessions, users, and token and cost tracking per span.
- **Evaluations.** LLM-as-judge evaluators, human annotation queues, custom scores, user feedback, datasets and experiments from the SDK or the UI.
- **Prompt management.** Versioned prompts with release labels, a playground and prompt experiments; prompts are cached client-side by the SDKs so fetching them does not add latency to every call.
- **Metrics and dashboards.** Custom dashboards and alerts over quality, cost and latency.
- **OpenTelemetry in.** Python and JavaScript SDKs built on OpenTelemetry, plus a native OTLP endpoint (`/api/public/otel`) for Java, Go or any other OTel exporter.
- **AI Gateway.** One endpoint for calls to your model providers, with central provider keys and spend tracking per user and key. The README marks it beta as of November 2026.
- **Self-host or cloud.** Docker Compose for a single machine, a Helm chart for Kubernetes, or Langfuse Cloud in EU, US, Japan and HIPAA regions.

## In an AI-assisted workflow

```bash
pip install langfuse openai
export LANGFUSE_SECRET_KEY="sk-lf-..."
export LANGFUSE_PUBLIC_KEY="pk-lf-..."
export LANGFUSE_BASE_URL="https://cloud.langfuse.com"   # EU; US is https://us.cloud.langfuse.com
```

```python
from langfuse import observe
from langfuse.openai import openai  # drop-in OpenAI integration

@observe()
def answer(question: str) -> str:
    return openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": question}],
    ).choices[0].message.content  # traced: inputs, outputs, latency, cost

answer("What is Langfuse?")
```

To run it yourself instead:

```bash
git clone --depth=1 https://github.com/langfuse/langfuse.git
cd langfuse
docker compose up
```

> [!TIP]
> Manage prompts in Langfuse rather than in code: you can iterate and roll back prompt versions in production without a deploy, and tie each version to its eval scores.

## Pricing

As of November 2026, Langfuse Cloud's pricing page lists four plans, billed by usage "units" and not by seat:

- **Hobby**: free, 50,000 units a month, 30 days of data access, 2 users, community support.
- **Core**: $29 per month, 100,000 units included, then $8 per 100,000 units (less at volume), 90 days of data access, unlimited users.
- **Pro**: $199 per month, the same usage terms, 3 years of data access, data retention management, high rate limits, SOC 2 and ISO 27001 reports and a HIPAA-ready region. An optional Teams add-on at $300 per month adds enterprise SSO, SSO enforcement and fine-grained RBAC.
- **Enterprise**: $2,499 per month, adding audit logs, a SCIM API, custom rate limits and uptime and support SLAs.

Self-hosting the open-source version is free. The self-hosted Enterprise edition is custom-priced, adds project-level RBAC, data retention policies and audit logs, and, per Langfuse's self-host pricing page, is bundled with a ClickHouse commercial plan.

## Good to know

**Licensing.** The core is MIT. Code under the `ee/` directories is commercially licensed, and some self-hosted add-on features need a license key.

**Self-hosting is a real stack.** A Langfuse deployment runs web and worker containers plus PostgreSQL for transactional data, ClickHouse for traces and scores, Redis or Valkey for queues and caching, and S3-compatible blob storage. Docker Compose hides that on one machine; in production you operate all four.

**Release pace.** Langfuse shipped v4.88.0 on November 26, 2026, and releases land several times a week. The repository has about 37,900 GitHub stars as of November 2026.

**Limits on the free tier.** Hobby caps you at 2 users, one annotation queue, 2 alerts and 30 days of history, so a team outgrows it quickly even at low volume. You also bring your own LLM provider key for judge-based evals.

**Alternatives.** [LangSmith](/tools/langsmith) is the commercial choice for LangChain and LangGraph teams; [Langfuse vs LangSmith](/guides/comparisons/langfuse-vs-langsmith) covers that decision. [Braintrust](/tools/braintrust) is a commercial platform centered on evals. [Arize Phoenix](/tools/arize-phoenix) is OTel-native, source-available under ELv2, and starts locally with one command. [Opik](/tools/opik) is Comet's fully Apache-2.0 platform with a hosted free tier, and [W&B Weave](/tools/weave) is now part of CoreWeave.
