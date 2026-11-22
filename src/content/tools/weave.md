---
name: "W&B Weave"
description: "Weights & Biases' observability and evaluation platform for agents and LLM apps: OpenTelemetry tracing, scorers, evals and guardrails, now part of CoreWeave."
seoDescription: "W&B Weave in November 2026: agent tracing and evals, CoreWeave Forge pricing, the Agent Lens successor note, and the Apache-2.0 SDK repo. Still live."
date: 2026-11-15
reviewed: 2026-11-22
url: "https://wandb.ai/site/weave/"
pricing: "freemium"
category: "observability"
repo: "https://github.com/wandb/weave"
license: "Apache-2.0"
os: ["Web"]
color: "yellow"
topics: ["llm-evals", "mlops-ai-infra"]
audience: ["ai-engineers"]
tags: ["weave", "weights-and-biases", "coreweave", "observability", "tracing", "evals"]
featured: false
alternativeTo: ["langfuse", "langsmith", "braintrust", "opik", "arize-phoenix"]
sameAs: ["https://github.com/wandb/weave", "https://x.com/weights_biases", "https://www.linkedin.com/company/wandb/"]
related: ["tool:langfuse", "tool:langsmith", "tool:braintrust", "tool:opik", "tool:arize-phoenix", "guide:best-llm-observability-tools-2026", "guide:llm-observability-production", "agent:llm-observability-engineer", "glossary:tracing", "glossary:llm-as-judge"]
keywords: ["W&B Weave", "Weights & Biases Weave", "Weave pricing", "CoreWeave Agent Lens", "Weave vs Langfuse", "LLM tracing"]
summary: "W&B Weave is an observability and evaluation platform for agents and LLM apps: OpenTelemetry tracing, scorers and evaluations, versioned prompts and datasets, and production guardrails, with Python and TypeScript SDKs. W&B has been part of CoreWeave since May 2025. Weave is still live and Apache-2.0; CoreWeave's docs name Agent Lens its successor."
faq:
  - q: "Is W&B Weave being discontinued?"
    a: "We found no end-of-life date as of November 2026. The product is live, and its Apache-2.0 repository shipped v0.54.1 on November 5, 2026. CoreWeave's docs do introduce 'CoreWeave Agent Lens, the successor to Weights & Biases Weave' and say both services already receive your tracing data, so there is nothing to migrate. The Agent Lens product page says it 'complements W&B Weave', and Agent Lens is in preview as of November 2026."
  - q: "Who owns Weights & Biases?"
    a: "CoreWeave. It announced on May 5, 2025 that it had completed its acquisition of Weights & Biases, and said it 'continues to be committed to the interoperability of the Weights & Biases platform'. New users now create a CoreWeave Forge account, the W&B pricing page redirects to Forge pricing, and the Weave docs moved to docs.coreweave.com."
  - q: "How much does W&B Weave cost?"
    a: "As of November 2026 CoreWeave Forge pricing lists a Free plan at $0 a month with 1 GB of Weave data ingestion a month, and a Pro plan starting at $60 a month, billed monthly, with 1.5 GB of ingestion and extra ingestion at $0.10 per MB. Enterprise plans are custom, and academic research is free."
  - q: "Does W&B Weave work with Claude Code?"
    a: "Yes. Weave's docs say that for a supported third-party agent harness, 'such as Claude Code or OpenAI Agent SDK, Weave instruments it automatically with no additional code.' The product page adds that 'Using W&B skills and the MCP server, coding agents like Claude Code connect to Weave', so a coding agent can work with the traces it produced."
---

W&B Weave is Weights & Biases' platform for watching and grading LLM applications and agents. The docs describe it as "an observability and evaluation platform that helps you track, evaluate, and improve your agents and LLM applications", and the product page sums it up as "Observability and continuous improvement for production agents". You instrument code with the Python or TypeScript SDK, Weave records each call's inputs, outputs, cost, token count and latency, and you score those calls with the same scorers in development and in production.

The company around it has changed. CoreWeave completed its acquisition of Weights & Biases on May 5, 2025. At Fully Connected 2026 it announced CoreWeave Forge, and W&B's pricing page now redirects to Forge pricing. The Weave docs moved to docs.coreweave.com, where they introduce "CoreWeave Agent Lens, the successor to Weights & Biases Weave". Weave itself is still live. Its SDK repository is Apache-2.0 and shipped v0.54.1 on November 5, 2026, and we found no end-of-life date.

## Highlights

- **Tracing on open standards.** "Agent tracing is built on OpenTelemetry (OTel) and the GenAI semantic conventions." See [tracing](/glossary/tracing) for what a trace holds.
- **Automatic instrumentation for agent harnesses.** Supported harnesses, "such as Claude Code or OpenAI Agent SDK", are instrumented "with no additional code".
- **Ops and Calls.** "Add one line to any function to track inputs, outputs, cost, token count, and latency."
- **Evaluations and scorers.** "Define metrics to evaluate responses using one or more scoring functions", then "compare two or more different evaluations over multiple metrics".
- **Versioning.** "Weave tracks versions of your prompts, datasets, and model configurations."
- **Playground.** "Bring your API keys to test prompts and compare responses from different commercial models."
- **Guardrails and monitors.** "Score production traffic with the same scorers you use in evaluation." Safety scorers "include toxicity, bias, PII detection, and hallucinations".
- **A loop for coding agents.** "Using W&B skills and the MCP server, coding agents like Claude Code connect to Weave."

## In an AI-assisted workflow

Both SDKs install from the usual registries:

```bash
pip install weave     # Python SDK
npm install weave     # TypeScript SDK
```

To get started, "create a CoreWeave Forge account and an API key in User settings", then instrument the functions that call models. If your agent runs on Claude Code or the OpenAI Agent SDK, tracing starts without code changes, which makes Weave a quick way to see what a coding agent did on a long task. Once traces arrive, build a small evaluation set from real failures and attach scorers to it; when exact checks are not enough, a scoring function is where an [LLM-as-a-judge](/glossary/llm-as-judge) rubric goes. The [LLM observability in production](/guides/mlops/llm-observability-production) guide describes that loop end to end, and the [LLM observability engineer](/agents/data-ai/llm-observability-engineer) agent can plan the instrumentation for your stack.

> [!NOTE]
> On Agent Lens: CoreWeave's docs call it "the successor to Weights & Biases Weave" and say "Both services already receive your agent tracing data, so there is nothing to migrate." The Agent Lens product page frames it differently: "Agent Lens complements W&B Weave. If you use Weave … you can use Agent Lens at no additional cost." Agent Lens is labeled a preview as of November 2026, so treat Weave as the supported product and Agent Lens as an extra view you can try.

## Pricing

As of November 2026 the W&B pricing URL redirects to CoreWeave Forge pricing, which lists Free at $0 a month with AI application evaluations, tracing and scorers, 1 GB a month of Weave data ingestion, 5 GB of storage and up to 5 model seats. As of November 2026 Pro "Starts at $60/month, billed monthly", with a 30-day free trial, for early-stage teams of fewer than 50 employees, and includes 1.5 GB a month of Weave ingestion, additional ingestion at $0.10 per MB, 100 GB of storage and up to 10 model seats. As of November 2026 Enterprise plans are custom, with additional ingestion at $0.20 per MB, a HIPAA option, SSO and audit logs. Forge pricing also lists a plan that is "Free forever for academic research".

## Good to know

- **License.** The [wandb/weave](https://github.com/wandb/weave) repository is Apache-2.0, with about 1,150 GitHub stars as of November 2026. The main `wandb` SDK is MIT.
- **Deployment.** The default is the hosted web app. Dedicated and self-managed options exist, and the docs list a separate OpenTelemetry endpoint for Dedicated Cloud and Self-Managed instances.
- **TypeScript gaps.** "Some advanced features, such as class-based Models and Scorers, aren't available in the Weave TypeScript SDK."
- **Large traces.** "Weave sometimes truncates large trace data objects," so check the limits page before you log big documents or images.
- **Ownership.** CoreWeave says it "continues to be committed to the interoperability of the Weights & Biases platform".

Weave makes most sense if your team already uses Weights & Biases or CoreWeave Forge, or if you want agent tracing that instruments Claude Code with no code changes. [Langfuse](/tools/langfuse), [LangSmith](/tools/langsmith), [Braintrust](/tools/braintrust), [Opik](/tools/opik) and [Arize Phoenix](/tools/arize-phoenix) are the main alternatives, and the [LLM observability roundup](/guides/comparisons/best-llm-observability-tools-2026) compares them in depth. See all [W&B Weave alternatives](/tools/weave/alternatives).
