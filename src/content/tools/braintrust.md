---
name: "Braintrust"
title: "Braintrust"
description: "A hosted platform for LLM evals, tracing and prompt iteration, with an AI agent (Loop) that investigates traces. Free Starter tier; Pro has a platform fee."
url: "https://www.braintrust.dev"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "evaluation"
sameAs: ["https://www.braintrust.dev/docs"]
color: "pink"
topics: ["llm-evals"]
audience: ["ai-engineers"]
tags: ["evals", "observability", "prompt-engineering", "platform"]
featured: false
alternativeTo: ["langsmith", "langfuse"]
summary: "Braintrust is a hosted platform that joins LLM evaluation, tracing, datasets and a prompt playground: log production traffic, turn failures into datasets, and run scored experiments in code, the UI or CI. Its Loop agent queries traces and writes scorers in natural language. Starter is free with usage limits; Pro adds a monthly platform fee."
related: ["tool:deepeval", "guide:best-llm-eval-tools-2026", "tool:langsmith"]
faq:
  - q: "How much does Braintrust cost?"
    a: "As of November 2026, Starter has a $0 platform fee and includes 1 GB of processed data and 10,000 scores a month, then $4 per GB and $2.50 per 1,000 scores, with 14-day retention. Pro is $249 a month with 5 GB and 50,000 scores included, then $3 per GB and $1.50 per 1,000 scores, with 30-day retention. Enterprise is custom. Users, projects, experiments and datasets are unlimited on every plan."
  - q: "Can I self-host Braintrust?"
    a: "Not as a free open-source install. Braintrust is SaaS by default; its docs describe a bring-your-own-cloud (BYOC) deployment on AWS that keeps application data in your cloud account while Braintrust operates the data plane, and the pricing page lists on-prem or hosted deployment under Enterprise. If you need to run the whole stack yourself, Langfuse is the usual open-source comparison."
  - q: "How do I run a Braintrust eval?"
    a: "Install the SDK (pip install braintrust openai autoevals, or the npm packages of the same names), write an Eval with three parts, data, a task function and a list of scorers, and run it with the bt eval CLI. Each run is saved as an experiment you can compare against a baseline. The same file runs in CI through GitHub Actions or bt eval."
  - q: "What is Loop in Braintrust?"
    a: "Loop is Braintrust's built-in AI agent. The docs describe it querying logs, diagnosing traces, writing scorers, running experiments and building dashboards from natural-language requests, and it can run on a schedule and post results to Slack. Loop and the related Patterns feature draw on Braintrust credits, so heavy use has a cost beyond the platform fee."
---

Braintrust is a commercial, hosted platform that puts the LLM development loop in one place: **tracing** production traffic, building **datasets** from it, running scored **experiments**, and iterating on prompts in a **playground**. Its docs now describe the product as "the observability agent, built on Brainstore, the observability database", reflecting a shift from eval dashboards toward an agent, Loop, that investigates traces for you.

It suits teams that want a managed workflow for shipping LLM features: compare prompt and model variants side by side, fail CI on a regression, and turn a bad production trace into a test case without stitching an eval library to a separate observability tool.

## Highlights

- **Experiments.** An eval is data, a task and scorers. Run it from code with the SDK and the `bt eval` CLI, in the UI with no local setup, or in CI. Each run is stored as an immutable experiment, and comparing against a baseline shows which test cases improved or regressed.
- **Scorers.** Use Autoevals, Braintrust's library of pre-built scorers such as `Factuality`, write LLM-as-a-judge scorers in natural language, or write custom code. The same scorers can run asynchronously on production traces for online monitoring.
- **Tracing.** SDKs for Python, TypeScript and Go, plus OpenTelemetry-based integrations, log LLM calls and application spans. The docs also cover tracing coding agents such as Claude Code, Codex and Cursor.
- **Loop and Patterns.** Loop answers questions about your logs, writes scorers and runs experiments from a chat prompt. Patterns finds recurring problems across traces and suggests fixes backed by trace evidence.
- **Topics.** Automatic classification of logs by task, sentiment and issue, which you can turn into datasets, scorers and review queues.
- **Prompts as versioned objects.** Author prompts in the UI or in code, pin environments to a version, and call them from your app; an AI gateway routes calls to model providers.
- **MCP server.** Connects Claude Code, Cursor, Codex and other MCP clients to your Braintrust projects, experiments and logs.

## In an AI-assisted workflow

The Python example from Braintrust's docs, with a dataset already created in the project:

```bash
pip install braintrust openai autoevals
```

```python
# my_eval.py
from braintrust import Eval, init_dataset
from autoevals import Factuality

Eval(
    "My project",
    experiment_name="My experiment",
    data=init_dataset(project="My project", name="My dataset"),
    task=lambda input: call_model(input),  # your LLM call here
    scores=[Factuality],
)
```

```bash
bt eval my_eval.py          # add --watch to re-run on file changes
```

The run prints summary metrics and a link to the experiment. A workable loop from there: log production traffic, send the failing and interesting traces to a dataset, change the prompt in the playground, then run the experiment again and compare it with the previous one before you ship.

> [!NOTE]
> LLM-as-a-judge scorers call a model on every row. Counting scores (which Braintrust bills) and judge tokens (which your provider bills) before you run a large dataset avoids a surprise.

## Pricing

As of November 2026, the [Braintrust pricing page](https://www.braintrust.dev/pricing) lists:

| | Starter | Pro | Enterprise |
| --- | --- | --- | --- |
| Platform fee | $0 a month | $249 a month | Custom |
| Processed data | 1 GB a month, then $4 per GB | 5 GB a month, then $3 per GB | Custom |
| Scores | 10,000 a month, then $2.50 per 1,000 | 50,000 a month, then $1.50 per 1,000 | Custom |
| Data retention | 14 days | 30 days, then $0.50 per GB a month | Custom |

Users, projects, playgrounds, experiments and datasets are unlimited on all three. Starter needs no credit card. SAML SSO, custom retention policies, S3 export, a BAA for HIPAA and an uptime SLA are Enterprise features.

## Good to know

- **Closed and hosted.** The platform is not open source. The `braintrust` SDK packages on PyPI and npm are MIT-licensed, but the service that stores and displays your data is Braintrust's.
- **Deployment.** SaaS is the default. The docs describe bring-your-own-cloud on AWS, where application data stays in your account and Braintrust operates the data plane, and the pricing page puts on-prem or hosted deployment in the Enterprise plan.
- **Short retention on the free tier.** Fourteen days is enough to evaluate the product, not to keep a history of production behaviour.
- **Usage pricing needs watching.** Processed data and scores both meter, and Loop, Patterns and Topics spend Braintrust credits.

Against the alternatives: [Langfuse](/tools/langfuse) is open source and self-hostable, the usual pick when data must stay on your infrastructure. [LangSmith](/tools/langsmith) is the closest hosted equivalent and fits best if you already build on LangChain or LangGraph. [DeepEval](/tools/deepeval) is a free, code-first eval library you run yourself, with no hosted UI required. [Arize Phoenix](/tools/arize-phoenix) is another self-hostable tracing and eval option. The wider field is in [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026).
