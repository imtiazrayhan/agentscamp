---
title: "The Best LLM Observability Tools in 2026: Langfuse vs LangSmith vs Braintrust vs Phoenix"
description: "Langfuse, LangSmith, Braintrust, Arize Phoenix, Logfire, Helicone and AgentOps compared on tracing, cost tracking, agent debugging, OpenTelemetry and self-hosting."
seoTitle: "Best LLM Observability Tools 2026: Langfuse & LangSmith Alternatives"
seoDescription: "The best Langfuse and LangSmith alternatives in 2026: Braintrust, Phoenix, Logfire, Helicone and AgentOps compared on self-hosting, OpenTelemetry and status."
author: "Imtiaz Rayhan"
date: "2026-09-11"
updated: "2026-11-27"
reviewed: "2026-11-27"
color: "green"
topics: ["mlops-ai-infra", "llm-evals", "ai-agents-systems"]
audience: ["ai-engineers", "devops"]
tags: ["comparison", "best-of", "llm-observability", "tracing", "opentelemetry", "self-hosted"]
keywords: ["langfuse alternatives", "alternatives to langfuse", "langfuse competitors", "langsmith alternatives", "langsmith free alternative", "braintrust alternatives", "self hosted braintrust alternative", "agentops monitoring agents", "prompt observability", "llm observability tools"]
summary: "Langfuse is the best default: MIT core, free self-hosting, native OpenTelemetry, ClickHouse-owned since January 2026. Pick LangSmith for LangChain stacks, Braintrust when evals gate releases, Phoenix for free source-available self-hosting, Logfire for AI and app traces in one tool. Skip Helicone (maintenance mode since March 2026) and AgentOps (no SDK release since August 2025) for new projects."
keyTakeaways:
  - "Langfuse is the lowest-regret default: an MIT core that self-hosts for free, native OTLP ingest, and steady releases since ClickHouse acquired it in January 2026."
  - "LangSmith wins inside LangChain and LangGraph stacks and Braintrust wins when evals already gate releases; both self-host only on Enterprise plans."
  - "Arize Phoenix is free to self-host, but it is licensed ELv2, which is source-available rather than OSI open source and bars offering it as a managed service."
  - "Helicone has been in maintenance mode since Mintlify acquired it in March 2026, and AgentOps has shipped no SDK release since August 2025, so neither is a safe start for a new project."
  - "Langfuse, LangSmith, Braintrust and Phoenix all accept OpenTelemetry traces natively and map the GenAI semantic conventions, and Pydantic Logfire is built on OpenTelemetry, so instrument with OTel and keep the backend swappable."
  - "This category covers production traces, cost and agent debugging; pair it with an offline eval framework instead of expecting one tool to do both jobs."
faq:
  - q: "What are the best Langfuse alternatives in 2026?"
    a: "LangSmith is the strongest alternative if you build on LangChain or LangGraph, Braintrust if evaluations drive your release process, Arize Phoenix if you want another free self-hosted option, and Pydantic Logfire if you want AI traces inside a full-stack observability tool. Phoenix is licensed ELv2, so it is source-available rather than OSI open source. Langfuse itself has been owned by ClickHouse since January 2026 and says no licensing changes are planned."
  - q: "What is the best free alternative to LangSmith?"
    a: "Self-hosted Langfuse is the closest free alternative: its MIT-licensed core runs on your own infrastructure and ingests OpenTelemetry traces natively. Arize Phoenix is also free to self-host and offers two free Phoenix Cloud instances. LangSmith itself has a free Developer plan limited to one seat."
  - q: "Is there a self-hosted alternative to Braintrust?"
    a: "Yes. Braintrust self-hosts only through its Enterprise plan, while Langfuse and Arize Phoenix are free to self-host with Docker or Kubernetes. Both include evals and prompt management alongside tracing."
  - q: "Is Helicone still maintained in 2026?"
    a: "Only in maintenance mode. Mintlify acquired Helicone on March 3, 2026, and Helicone says security updates, new model support and bug fixes continue while the service stays live for the foreseeable future, with no shutdown date announced. Mintlify has also said it will help customers migrate to another platform, so plan a move rather than starting a new project on it."
  - q: "Is AgentOps still a good choice for monitoring agents?"
    a: "AgentOps still offers session replay, cost tracking and integrations for frameworks such as CrewAI, AutoGen and the OpenAI Agents SDK. Its last SDK release, however, was 0.4.21 on August 29, 2025, and commits have been sparse since, so weigh that before putting it in your production path. LangSmith, Arize Phoenix and Braintrust all have actively developed agent tracing."
  - q: "Is Pydantic Logfire only for Pydantic AI?"
    a: "No. Logfire is a general observability platform built on OpenTelemetry, with native SDKs for Python, TypeScript and Rust and OTLP ingest for other languages. It instruments OpenAI, Anthropic and LiteLLM, ingests traces from more than 20 agent frameworks, and traces the rest of your application too. Pydantic AI is simply the deepest integration: two lines of code send every agent run to Logfire. The free Personal plan includes 10 million records a month."
  - q: "What is prompt observability?"
    a: "Prompt observability means linking every production trace to the exact prompt version that produced it, so you can see which change moved quality, cost or latency. Langfuse, LangSmith, Braintrust and Arize Phoenix all version prompts alongside their traces."
sources:
  - title: "ClickHouse acquires Langfuse"
    url: "https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability"
    publisher: "ClickHouse"
  - title: "Langfuse OpenTelemetry integration"
    url: "https://langfuse.com/integrations/native/opentelemetry"
    publisher: "Langfuse"
  - title: "Self-hosting Langfuse"
    url: "https://langfuse.com/self-hosting"
    publisher: "Langfuse"
  - title: "Langfuse v4.0.0 release"
    url: "https://github.com/langfuse/langfuse/releases/tag/v4.0.0"
    publisher: "Langfuse (GitHub)"
  - title: "Trace with OpenTelemetry"
    url: "https://docs.langchain.com/langsmith/trace-with-opentelemetry"
    publisher: "LangChain"
  - title: "Introducing LangSmith Engine"
    url: "https://www.langchain.com/blog/introducing-langsmith-engine"
    publisher: "LangChain"
  - title: "Braintrust documentation"
    url: "https://www.braintrust.dev/docs"
    publisher: "Braintrust"
  - title: "Braintrust OpenTelemetry integration"
    url: "https://www.braintrust.dev/docs/integrations/sdk-integrations/opentelemetry"
    publisher: "Braintrust"
  - title: "Arize Phoenix license"
    url: "https://github.com/Arize-ai/phoenix/blob/main/LICENSE"
    publisher: "Arize AI (GitHub)"
  - title: "Phoenix release notes"
    url: "https://arize.com/docs/phoenix/release-notes"
    publisher: "Arize AI"
  - title: "Mintlify acquires Helicone"
    url: "https://www.mintlify.com/blog/mintlify-acquires-helicone"
    publisher: "Mintlify"
  - title: "Pydantic Logfire"
    url: "https://pydantic.dev/logfire"
    publisher: "Pydantic"
  - title: "Logfire pricing"
    url: "https://pydantic.dev/pricing"
    publisher: "Pydantic"
  - title: "Self-hosted Logfire"
    url: "https://pydantic.dev/docs/logfire/deploy/self-hosted-deployment/overview/"
    publisher: "Pydantic"
  - title: "AgentOps documentation"
    url: "https://docs.agentops.ai/v2/introduction"
    publisher: "AgentOps"
related: ["tool:langfuse", "tool:langsmith", "tool:braintrust", "tool:arize-phoenix", "tool:helicone", "tool:agentops", "tool:pydantic-ai", "guide:llm-observability-production", "guide:best-llm-eval-tools-2026"]
---

**[Langfuse](/tools/langfuse) is the best default LLM observability tool for most teams in 2026**: its MIT core self-hosts for free, it ingests OpenTelemetry natively, and it has kept shipping since ClickHouse acquired it in January 2026. Choose [LangSmith](/tools/langsmith) on LangChain or LangGraph, [Braintrust](/tools/braintrust) when evals already gate your releases, and [Arize Phoenix](/tools/arize-phoenix) for a free, source-available tracer you run yourself. This page covers production tracing, cost and agent debugging; offline eval frameworks such as DeepEval and promptfoo are compared in [the LLM eval tools roundup](/guides/evaluation/best-llm-eval-tools-2026).

*Last reviewed: November 2026.*

Two familiar names need a warning up front: [Helicone](/tools/helicone) has been in maintenance mode since Mintlify acquired it in March 2026, and [AgentOps](/tools/agentops) has not shipped an SDK release since August 2025. Prices change often; each tool page lists current pricing.

## The summary table

| Tool | Owner and status | License | Self-host | Native OTLP | Best for |
| --- | --- | --- | --- | --- | --- |
| [Langfuse](/tools/langfuse) | ClickHouse (acquired Jan 2026); very active | MIT core, commercial `ee/` | Free: Docker, Helm | Yes | The open default |
| [LangSmith](/tools/langsmith) | LangChain; active | Proprietary; MIT SDK | Enterprise add-on | Yes | LangChain and LangGraph stacks |
| [Braintrust](/tools/braintrust) | Independent; active | Proprietary; open SDKs | Enterprise only | Yes | Eval-driven teams |
| [Arize Phoenix](/tools/arize-phoenix) | Arize AI; very active | ELv2, source-available | Free: Docker, Helm | Yes | Free local and self-hosted tracing |
| [Logfire](https://pydantic.dev/logfire) | Pydantic; very active | SDKs MIT; platform proprietary | Enterprise only | Yes | AI traces next to app, logs and infrastructure |
| [Helicone](/tools/helicone) | Mintlify (acquired Mar 2026); maintenance mode | Apache-2.0 | Yes; images from Aug 2025 | Via OpenLLMetry | Existing users planning a move |
| [AgentOps](/tools/agentops) | Independent; no SDK release since Aug 2025 | MIT SDK; app license unclear | Docker Compose | OTel-based SDK | Agent replay, if you accept the risk |

## Pick by need

| Need | Pick | Why |
| --- | --- | --- |
| Traces stay on your infrastructure, on a budget | Langfuse or Phoenix | Free self-hosting. Langfuse needs Postgres, ClickHouse, Redis or Valkey, and blob storage; Phoenix starts with `phoenix serve` |
| You build on LangChain or LangGraph | LangSmith | Native tracing of chains and graph nodes. Hosts agents via LangSmith Deployment (renamed from LangGraph Platform, October 2025) |
| AI traces next to the rest of your telemetry | Logfire | General observability built on OpenTelemetry, with LLM, agent and eval views on the same traces |
| Evals decide what ships | Braintrust | Experiments, scorers and online scoring are the core; it now calls itself an "active observability platform" |
| Debugging multi-step agents | LangSmith, Phoenix or Braintrust | See below |
| Cost per user, model or step | Any of the seven | All compute token costs; see below |
| Prompt observability | Langfuse, LangSmith, Braintrust or Phoenix | All version prompts next to the traces they produce; LangSmith does it in its Prompt & Context Hub |
| No lock-in | Any of the first five | Instrument with OpenTelemetry; the endpoints are listed further down |
| You already run Helicone | Plan a migration | Maintenance mode since March 2026; Mintlify has offered to help customers move |

For agent debugging:
- **LangSmith** has thread views, and its LangSmith Engine clusters failing traces into named issues.
- **Phoenix** has persistent agent sessions, span-topology filters and its PXI assistant.
- **Braintrust** has a thread view and multi-turn scoring.
- **Logfire** finds agent runs automatically from OTel GenAI, OpenInference and OpenLLMetry spans.
- **AgentOps** is built around replay, but weigh its release gap first.

For cost:
- **Langfuse** breaks cost down by `userId`.
- **LangSmith** accepts custom costs on tool and retrieval steps.
- **Phoenix** lets you override its price table.
- **Logfire** estimates cost per model from Pydantic's open-source `genai-prices` dataset.

Caching and routing are a separate gateway decision; see [LLM gateways compared](/guides/advanced/llm-gateways-compared).

## The seven tools, one at a time

### Langfuse: the open-source default, now owned by ClickHouse

ClickHouse announced its acquisition of Langfuse on January 16, 2026, and Langfuse's own post was explicit: "Langfuse stays open source and self‑hostable" and "No licensing changes planned." Development has stayed very active. The v4 platform release reached GitHub on July 29, 2026 and brought three features to self-hosted deployments:
- full-text search;
- monitors and alerts;
- v2 Observations and Metrics APIs.

The v3 line still gets patches. The repository has 34,476 GitHub stars as of September 2026.

Tracing covers LLM and non-LLM calls, including retrieval, embeddings and API calls. It adds agent graph visualization and multi-turn sessions. On the same traces, Langfuse runs:
- per-user cost tracking;
- quality, cost and latency dashboards;
- prompt management;
- evals: LLM-as-a-judge, code evaluators, annotation queues and datasets.

The v4 SDK is "a thin layer on top of the official OpenTelemetry client," so this decorator emits OTel spans:

```python
from langfuse import observe

@observe()
def my_data_processing_function(data, parameter):
    return {"processed_data": data, "status": "ok"}
```

Read the license before you build on enterprise features. Everything is MIT except the `ee/`, `web/src/ee/` and `worker/src/ee/` folders, which are commercially licensed. Some self-hosted add-ons, such as the Instance Management API, also need a license key. Self-hosting runs on Docker Compose for testing and Helm on Kubernetes for production, and the Langfuse team maintains options for AWS, Azure and GCP.

**Verdict:** the lowest-regret choice when you want to own your traces or haven't committed to a framework. Budget for operating ClickHouse if you self-host.

### LangSmith: native tracing for LangChain and LangGraph

LangSmith is LangChain's proprietary platform; its SDK is MIT. It traces the full tree of LLM, tool and intermediate steps. Tracing is native for LangChain and LangGraph, and the docs name OpenAI, Anthropic, CrewAI, the Vercel AI SDK and Pydantic AI among supported frameworks and providers. Dashboards, alerts, rules, webhooks, online evaluations and annotation queues cover production monitoring. Costs come from token usage and a built-in price table for most OpenAI, Anthropic and Gemini models. Tool and retrieval steps can carry their own cost through `usage_metadata.total_cost`.

For agents, the August–September 2026 changelog added thread-level operations and extended thread evaluations. LangSmith Engine launched as a public beta on May 13, 2026. It "watches your production traces, clusters failures into named issues, diagnoses root causes against your code, and proposes fixes and eval coverage," including opening pull requests. Tracing starts with two environment variables:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your-langsmith-api-key>"
```

Pricing is per seat plus usage, with a free single-seat Developer plan. Self-hosting is an Enterprise add-on. LangGraph Platform was renamed LangSmith Deployment in October 2025.

**Verdict:** the pick for LangChain and LangGraph shops, which get zero-setup instrumentation of chains and graph nodes. Outside that ecosystem it competes on even terms, and it costs you per-seat pricing and Enterprise-only self-hosting.

### Braintrust: evals first, now selling "active observability"

Braintrust built its product around evaluation, and experiments, scorers, playgrounds and online scoring remain its core. Its docs now call it "the active observability platform for instrumenting, understanding, and improving agents." It announced a Series B in February 2026. The platform is proprietary. The JavaScript SDK is Apache-2.0, and the autoevals library is MIT.

Production features include:
- a thread view and multi-turn agent scoring;
- a coding-agent observability recipe;
- prompt versioning with environment tags;
- custom model costs;
- Loop, an assistant that builds scorers, datasets and dashboards from your data;
- a gateway that routes OpenAI and Anthropic calls with tracing.

Integrations fall into three groups:
- **Libraries:** the AI SDK, LangChain, LlamaIndex and LiteLLM.
- **Agent frameworks:** from the OpenAI Agents SDK and Claude Agent SDK to LangGraph and CrewAI.
- **Developer tools:** Claude Code, Cursor and Codex.

The free Starter plan has unlimited users. Self-hosting means an Enterprise deployment, either on-prem or with a self-hosted data plane.

**Verdict:** the best fit when the same scorers should gate releases and grade live traffic. If you want that loop without a vendor-run data plane or an Enterprise contract, Langfuse and Phoenix are the self-hosted alternatives.

### Arize Phoenix: free, source-available and OTel-native

Phoenix is built on OpenTelemetry and OpenInference. Since May 15, 2026, it converts OTel GenAI semantic-convention attributes automatically at ingest. Releases come often: PyPI shows 20.9.0 on September 8, 2026. Mid-2026 added:
- PXI, "the AI engineering agent built into Phoenix" (June 2);
- a remote MCP server with OAuth2 (July 17);
- persistent agent sessions (August 11);
- a trace filter language with span topology (August 17).

Cost tracking uses a built-in price table that you can override under Settings > Models. Evals include LLM and code evaluators, human labels, and "Evals as Tests" with pytest and Vitest or Jest. Starting it locally is one command:

```bash
phoenix serve
# or, no install:
uvx arize-phoenix serve
```

Self-hosting is free through Docker images, a Helm chart or Docker Compose. Arize adds two free Phoenix Cloud instances; Arize AX is its separate managed product. The license is Elastic License 2.0, which Arize's product page labels "ELv2 licensed." That makes Phoenix source-available, not OSI open source. Its key limitation is that you "may not provide the software to third parties as a hosted or managed service."

**Verdict:** the best free tracer for local development and internal self-hosting. ELv2's key restriction targets offering Phoenix as a managed service, not running it for your own team.

### Pydantic Logfire: AI traces inside full-stack observability

[Logfire](https://pydantic.dev/logfire), from the team behind Pydantic, is a general observability platform for application traces, logs, metrics and infrastructure, with LLM, agent and eval views on top. A model call therefore sits in the same trace as the database queries and HTTP requests around it. Logfire is built on OpenTelemetry and accepts OTLP from any OpenTelemetry SDK, with native SDKs for Python, TypeScript and Rust. The SDKs are MIT; the platform is proprietary.

For AI workloads it adds:
- an LLMs view with calls, errors, latency, tokens, cache reads and cost per model, estimated from Pydantic's open-source `genai-prices` dataset rather than your provider invoice;
- LLM panels that show the messages, tool calls, tokens and cost of each model call;
- an Agents view that finds agent runs automatically from OTel GenAI, OpenInference and OpenLLMetry spans;
- offline evals, live evals on production traffic (added April 30, 2026) and human review;
- SQL over every trace, with PostgreSQL-like syntax, plus dashboards and alerts to Slack and PagerDuty;
- a hosted remote MCP server, so a coding agent can query your traces.

The Pydantic AI integration is two lines, from Logfire's docs:

```python
import logfire

logfire.configure()
logfire.instrument_pydantic_ai()
```

Similar one-line calls cover OpenAI, Anthropic and LiteLLM, and the docs have setup guides for 26 agent-framework integrations across Python, TypeScript, Go, Rust and .NET, including the OpenAI Agents SDK, CrewAI, Google ADK, the Claude Agent SDK and Mastra. LangChain and LangGraph traces arrive through LangSmith's OpenTelemetry settings; use OpenInference instead if you want those runs on the Agents page.

Pricing counts records, where one span, log or metric is one record. As of November 2026, the free Personal plan needs no card and includes 10 million records a month with 30-day retention, and it never bills overage. Evals and human review start on Team. Team costs $49 a month with five seats, and Growth costs $249 a month with unlimited seats and up to 90-day retention; both include 10 million records, then charge $2 per million. Self-hosting is Enterprise-only, on Kubernetes with a Helm chart. Data stays in a US or EU region, Logfire is SOC 2 Type II certified, and Growth offers a boilerplate HIPAA BAA on request.

**Verdict:** the pick when you want LLM and agent traces in the same tool as the rest of your application's telemetry, especially on Pydantic AI. If you need free self-hosting, use Langfuse or Phoenix instead.

### Helicone: maintenance mode since March 2026

Mintlify acquired Helicone on March 3, 2026. Helicone said at the time (in a post since removed from its blog) that its services "will remain live for the foreseeable future in maintenance mode," with "security updates, new models, bug & performance fixes" continuing and no shutdown date announced. Mintlify says it will "work closely with every customer to support a smooth migration to another platform." As of November 2026, a banner on helicone.ai reads "Helicone is now part of Experiential Labs. Details to come soon," with no terms or roadmap published.

The repository tells the same story:
- The last GitHub release dates from August 21, 2025.
- The `helicone/jawn` and `helicone/web` Docker Hub tags were last updated that same day.
- Commits continue, most recently a security-hardening change on August 31, 2026.

The code is Apache-2.0. The quickstart now leads with Helicone's OpenAI-compatible AI Gateway, and async logging runs through OpenLLMetry.

In practice, an existing deployment keeps working and getting security fixes, but as of September 2026 its self-hosted images are over a year old and its new owner is helping customers leave. Replace the observability half with Langfuse or Phoenix; for the gateway half, see [LLM gateways compared](/guides/advanced/llm-gateways-compared).

**Verdict:** don't start a new project on Helicone in September 2026. Existing users are safe for now, but schedule the move instead of waiting for a shutdown date.

### AgentOps: agent replay with a development stall

AgentOps calls itself "the leading developer platform for building AI agents and LLM apps." Its product is built around agent sessions:
- "Time Travel Debugging," which rewinds and replays runs;
- a session waterfall;
- cost tracking;
- a `@trace` decorator.

Integrations cover CrewAI, AutoGen, AG2, LangChain, LangGraph, Google ADK and the OpenAI Agents SDK, among others. Setup is one call:

```python
import agentops
agentops.init(<INSERT YOUR API KEY HERE>)
```

The problem is activity. The last SDK release is 0.4.21, from August 29, 2025, and 2026 has seen only sparse commits, the latest on June 25. The license needs care too. The root MIT license covers the SDK, but the self-hostable app in `app/` ships an Elastic License 2.0 file while the README calls it MIT. Treat only the SDK as MIT until that's resolved.

**Verdict:** the replay-first design still fits agent debugging, but a year without an SDK release is a real risk for code in your request path. If you adopt it, pin the version and keep an OTel-native backend as your exit.

## OpenTelemetry keeps your options open

Langfuse, LangSmith, Braintrust and Phoenix all accept OTLP traces natively. They also map the OpenTelemetry GenAI semantic conventions, the `gen_ai.*` attributes for model calls, tokens and tools. Logfire is built on OpenTelemetry and reads `gen_ai.*` attributes for its LLM views. That makes the backend a configuration choice, not a rewrite.

| Backend | OTLP ingest | GenAI conventions |
| --- | --- | --- |
| Langfuse | `/api/public/otel` (HTTP; no gRPC yet) | "Aims to be compliant" |
| LangSmith | `https://api.smith.langchain.com/otel` | Maps `gen_ai.*`, OpenInference, Traceloop |
| Braintrust | `https://api.braintrust.dev/otel/v1/traces` | Implements them, plus `braintrust.*` |
| Phoenix | Built on OTel and OpenInference | Auto-converts since May 2026 |
| Logfire | `https://logfire-us.pydantic.dev` or `https://logfire-eu.pydantic.dev`; HTTP or gRPC; write token in the `Authorization` header | Reads `gen_ai.*` attributes for its LLM views |

For example, switching between Langfuse Cloud and LangSmith is an exporter setting. Both snippets are copied from the vendors' docs:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT="https://cloud.langfuse.com/api/public/otel" # EU
# US: https://us.cloud.langfuse.com/api/public/otel
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic ${AUTH_STRING},x-langfuse-ingestion-version=4"
```

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.smith.langchain.com/otel
OTEL_EXPORTER_OTLP_HEADERS="x-api-key=<your_api_key>"
```

LangSmith's docs note that OTel HTTP exporters append `/v1/traces` themselves, so leave it off the endpoint.

Frameworks increasingly emit these conventions for you:
- **Mastra's** OTel exporter follows GenAI semantic conventions v1.38.0.
- **AI SDK 7's** telemetry names Langfuse and Braintrust as supported platforms.

Both are covered in [Mastra vs LangChain](/guides/comparisons/mastra-vs-langchain).

The outliers: Helicone, in maintenance mode since March 2026, logs through OpenLLMetry, and AgentOps' SDK exports OTLP to its own backend.

For your own services, the [distributed tracing instrumenter](/skills/observability/distributed-tracing-instrumenter) skill covers context propagation and trace-wide sampling.

## Open source, source-available or managed

"Open source" means something different for nearly every tool here. The license decides whether self-hosting is free, restricted or contract-only.

| Tool | What you can self-host | Free managed tier (as of September 2026 unless noted) |
| --- | --- | --- |
| Langfuse | MIT core free; `ee/` add-ons need a key | Hobby: 50k units a month, 30-day data access |
| LangSmith | Enterprise add-on only | Developer: 1 seat, 5k base traces a month |
| Braintrust | Enterprise only | Starter: unlimited users, 1 GB processed data |
| Arize Phoenix | Free, under ELv2 | Two free Phoenix Cloud instances |
| Logfire | Enterprise only, on Kubernetes with Helm | Personal: 10M records a month, 30-day retention (November 2026) |
| Helicone | Apache-2.0, stale images; maintenance mode since March 2026 | Hobby: 10,000 requests |
| AgentOps | App via Docker Compose; license unclear | Basic: up to 5,000 events |

What this means in practice:
- **Data residency without an Enterprise budget:** the list shrinks to Langfuse and Phoenix.
- **No appetite for running ClickHouse:** a managed tier is less work, and OTel instrumentation keeps self-hosting open for later.
- **Retention:** LangSmith keeps base traces for 14 days, and Braintrust's Starter plan keeps data for 14 days.

## What changed in 2026

- **January 16:** ClickHouse announced it is acquiring Langfuse, and the Langfuse LICENSE copyright now reads "ClickHouse, Inc."
- **February 17:** Braintrust announced its Series B, led by ICONIQ. Its docs now describe it as an "active observability platform."
- **March 3:** Mintlify acquired Helicone, which moved to maintenance mode.
- **March 10:** Langfuse Python SDK v4 shipped, described as a thin layer over the OpenTelemetry client.
- **April 30:** Pydantic's Logfire added live evals on production traffic, followed by an Evals Workbench on August 4.
- **May 13:** LangChain launched LangSmith Engine, which clusters production failures into named issues.
- **May 15 and June 2:** Phoenix began auto-converting GenAI semantic-convention attributes, then shipped its PXI agent.
- **July 29 and August 17:** the Langfuse v4 platform release landed, followed by the "Langfuse v4 is live" post, which says dashboards over longer time ranges load "at least 10x faster in large projects."
- **All year:** no AgentOps SDK release followed 0.4.21 (August 29, 2025).

Also on the market:
- **OpenLLMetry:** its maker, Traceloop, joined ServiceNow, which called the acquisition "recently completed" in May 2026.
- **[W&B Weave](/tools/weave):** CoreWeave has owned its maker, Weights & Biases, since May 2025; CoreWeave's docs now call Agent Lens (in preview as of November 2026) Weave's successor, while Weave itself remains live.
- **Datadog:** its product is now titled "Agent Observability," and it accepts OTel GenAI traces without Datadog's SDK.
- **[Opik](/tools/opik) (Comet), Laminar and OpenLIT:** self-hostable Apache-2.0 platforms; Opik also ships an MCP server and skill pack for Claude Code.

## How to evaluate on your own workload

Trial candidates on your own traces:

1. **Instrument once, with OpenTelemetry**, through your framework's exporter or an OTel-based vendor SDK. [LLM observability in production](/guides/mlops/llm-observability-production) lists the spans and version metadata to capture.
2. **Send identical traffic to two candidates for a sprint**, for example through an OpenTelemetry Collector with two exporters.
3. **Replay your worst agent run.** Every tool call, retry and sub-agent should appear, and you should be able to find the run by user, session or error. [Why your agent loops](/guides/troubleshooting/debugging-ai-agents) lists the failure signatures a good trace should expose.
4. **Check cost attribution** against numbers you trust. The [token usage profiler](/skills/data/token-usage-profiler) skill attributes tokens and cost by feature, route, model and tenant.
5. **Audit the data path.** Check where traces are stored, how long your plan retains them, and what you can redact. For a self-hosted Langfuse, decide who runs Postgres, ClickHouse, Redis and blob storage.
6. **Test alerting.** Set one cost alert and one latency alert, and confirm each links to the offending traces.

## How to choose

- **Default:** Langfuse, self-hosted or cloud. The head-to-head is in [Langfuse vs LangSmith](/guides/comparisons/langfuse-vs-langsmith).
- **LangChain or LangGraph stack:** LangSmith.
- **Evals run your release process:** Braintrust.
- **Free, local and source-available:** Phoenix.
- **AI traces alongside your app, logs and infrastructure, or a Pydantic AI stack:** Logfire.
- **On Helicone today:** migrate on your own schedule; it has been in maintenance mode since March 2026.
- **On AgentOps today:** pin the SDK and keep an OTel exit path.

Observability is half the loop: pair the platform with an offline eval gate from [the eval tools roundup](/guides/evaluation/best-llm-eval-tools-2026), hand instrumentation planning to the [LLM observability engineer](/agents/data-ai/llm-observability-engineer) agent, and turn to [LLM cost and latency engineering](/guides/advanced/llm-cost-latency-engineering) once traces exist.
