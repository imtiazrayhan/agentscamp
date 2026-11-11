---
name: "Opik"
title: "Opik"
description: "Comet's Apache-2.0 LLM observability and evaluation platform: tracing, experiments, LLM-as-a-judge, test suites and prompt optimization, self-hosted or cloud."
seoDescription: "Opik by Comet in October 2026: Apache-2.0 self-hosting, Free and Pro cloud prices, the Claude Code MCP server, and how it compares with Langfuse and LangSmith."
date: 2026-10-09
url: "https://www.comet.com/site/products/opik/"
pricing: "open-source"
category: "observability"
repo: "https://github.com/comet-ml/opik"
license: "Apache-2.0"
os: ["Web"]
color: "cyan"
topics: ["llm-evals"]
audience: ["ai-engineers", "devops"]
tags: ["opik", "observability", "tracing", "evals", "prompt-optimization", "open-source"]
featured: false
alternativeTo: ["langfuse", "langsmith", "arize-phoenix", "braintrust"]
sameAs:
  - "https://github.com/comet-ml/opik"
  - "https://pypi.org/project/opik/"
  - "https://www.npmjs.com/package/opik"
  - "https://www.comet.com/docs/opik/"
related: ["tool:langfuse", "tool:langsmith", "tool:arize-phoenix", "tool:braintrust", "guide:best-llm-observability-tools-2026", "guide:llm-observability-production", "agent:llm-observability-engineer", "glossary:llm-as-judge"]
keywords: ["Opik", "Opik Comet", "Opik vs Langfuse", "Opik pricing", "open source LLM observability", "Opik MCP server"]
summary: "Opik is Comet's Apache-2.0 LLM observability and evaluation platform: tracing, datasets and experiments, LLM-as-a-judge, test suites, an agent optimizer and Claude Code spend tracking. Self-host the full platform, or use the hosted cloud, whose Free tier is $0 and Pro tier $19 per month as of October 2026. About 22,800 GitHub stars as of October 2026."
faq:
  - q: "Is Opik free?"
    a: "Yes, in two ways. The full platform, backend included, is Apache-2.0 and self-hosts with a Docker Compose script or a Helm chart. The hosted cloud's Free plan is $0 as of October 2026 and covers up to 10 team members, 25k spans per month and 60-day retention; Pro Cloud is $19 per month as of October 2026 for up to 50 members and 100k spans per month, and Enterprise is custom."
  - q: "Opik vs Langfuse?"
    a: "Both are open-source, self-hostable platforms with hosted free tiers. Opik's whole platform is Apache-2.0 with no commercial modules, and it adds test suites, the Ollie assistant, an agent optimizer and Claude Code spend tracking. Langfuse has an MIT core with commercially licensed ee/ directories, has been owned by ClickHouse since January 2026, and is the more widely integrated OpenTelemetry-native option."
  - q: "Does Opik work with Claude Code and MCP?"
    a: "Yes. The uvx opik mcp configure command detects your AI client (Claude Code, Cursor, VS Code Copilot, Codex, opencode), picks the right server for your deployment, configures it and installs the Opik skill pack, so a coding agent can read traces, find failures, score them and fix code against real data. Cost Intelligence tracks Claude Code, Codex and Copilot usage across a team, and track_anthropic logs Anthropic SDK calls."
  - q: "Is Opik open source, unlike Arize Phoenix?"
    a: "Opik is Apache-2.0, an OSI-approved license, and the pricing page says the open-source edition is the same codebase as the hosted versions. Arize Phoenix is source-available under the Elastic License 2.0, which is not OSI-approved; LangSmith and Braintrust are closed, with self-hosting on Enterprise plans only."
---

Opik is Comet's answer to the question of what an LLM observability platform looks like when the whole thing is open source. The README calls it "the open-source LLM observability and evaluation platform for AI agent tracing, LLM evaluation, prompt management, and production monitoring", and is explicit that it is "Apache-2.0 licensed and free to self-host: the full platform, backend included, not just a client SDK". The product page's headline is "AI Observability & Evals For the Agentic Era".

It has about 22,800 GitHub stars as of October 2026 and ships near-daily; the latest release, 2.2.112, is dated 2026-10-21 on GitHub, PyPI and npm. Opik 2.0.0 landed on PyPI on 2026-04-17.

## Highlights

- **Tracing and evaluation together.** Agent traces, datasets and experiments, and "30+ metrics for answer relevance, context precision, task completion, hallucination, and more" scored with [LLM-as-a-judge](/glossary/llm-as-judge).
- **Test suites.** "Define rules for what your agent should and shouldn't do, and get clear pass/fail results"; build them with Ollie, in the UI or via the SDK.
- **Ollie.** A conversational assistant inside Opik that sits next to every trace, dataset, experiment and prompt; paired with `opik connect`, it can read your source files and run your agent.
- **Agent Optimizer.** Six prompt-optimization algorithms (MetaPrompt, HRPO, Few-Shot Bayesian, Evolutionary, GEPA and Parameter optimizers) plus tool optimization for MCP.
- **Cost Intelligence.** Visibility into Claude Code, Codex and Copilot usage across engineering teams, "down to MCPs, skills, and models"; the vendor's recoverable-spend figure is its own claim.
- **Guardrails and CI.** Guardrail features for safe and responsible deployment, and a PyTest integration to test LLM pipelines on every commit.
- **Integrations.** The pricing page counts "40+ AI Frameworks, Model Providers, & AI Gateways", with OpenTelemetry for Ruby, Java and other languages; named integrations include Anthropic, OpenAI, LangChain, LangGraph, Google ADK, CrewAI, PydanticAI, Ollama and Together AI.

## In an AI-assisted workflow

The Python and TypeScript SDKs install from PyPI and npm; the self-hosted stack comes up from one script.

```bash
pip install opik && opik configure        # or: uv pip install opik
./opik.sh                                 # self-host via Docker Compose, UI on localhost:5173
./opik.sh --guardrails                    # optional guardrails service
uvx opik mcp configure                    # MCP server + skill pack for Claude Code, Cursor, Codex...
uvx opik mcp configure --local-server     # same, against a self-hosted instance
```

Once the MCP server is configured, a coding agent can "read the traces, find the ones that failed, score them, and fix the code against real data", which closes the loop the [LLM observability in production](/guides/mlops/llm-observability-production) guide describes. For Anthropic calls, `pip install opik anthropic` and wrap the client with `track_anthropic`; Opik then logs the prompt, model, token usage and response automatically. The cloud MCP endpoint is `https://www.comet.com/opik/api/v1/mcp`.

> [!TIP]
> Start on the Free Cloud plan if you only want to see whether the trace views fit your agent; the pricing page says the open-source edition is the same codebase, so moving to `./opik.sh` later is a configuration change rather than a migration.

> [!NOTE]
> Releases are near-daily. Pin the `opik` package version in production and read the docs changelog before bumping; 2026 entries include OpenAI Responses API support in the playground and judges (June), `evaluate_threads` judging RAG agents on retrieved context (August), OAuth2 token auth for custom providers (September), and automatic annotation-queue population plus a Jev classifier judge (October).

## Good to know

**License.** Apache-2.0, with the LICENSE file unchanged since the September 2024 initial commit.

**Pricing.** As of October 2026 the Comet pricing page lists four Opik plans: Open Source at $0 (full feature set, same codebase as hosted), Free Cloud at $0 (up to 10 team members, 25k spans per month, 60-day data retention, with an Ollie coding harness trial), Pro Cloud at $19 per month (up to 50 team members, 100k spans per month, customizable span limits and retention), and Enterprise at custom pricing (unlimited members, custom usage plans, flexible deployments, SSO, dedicated support and SLAs, and SOC 2, ISO 27001, ISO 9001, HIPAA and GDPR compliance).

**2026 timeline.** Opik 2.0 (April) with a new interface and prompt library; client-side prompt caching and `opik connect` improvements (May); Cost Intelligence for Claude Code, Codex and Copilot (June); Ollie explaining trace cells and per-evaluation spend budgets for judges (July); the Together AI integration and spans opened from the agent graph (October).

Against the alternatives, Opik's own README table (vendor claims, "per Opik's README") positions it as the only fully Apache-2.0 platform next to [Langfuse](/tools/langfuse) (MIT core with commercial enterprise modules), [Arize Phoenix](/tools/arize-phoenix) (source-available, Elastic License 2.0), and the closed [LangSmith](/tools/langsmith) and [Braintrust](/tools/braintrust), which self-host on Enterprise plans only. Langfuse remains the more widely integrated OpenTelemetry-native choice and the default in our [LLM observability roundup](/guides/comparisons/best-llm-observability-tools-2026); Opik is the pick when you want evals, test suites, prompt optimization and coding-agent spend in one Apache-2.0 codebase you can run locally. The [LLM observability engineer](/agents/data-ai/llm-observability-engineer) agent can plan the instrumentation either way.
