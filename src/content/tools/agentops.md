---
name: "AgentOps"
title: "AgentOps"
description: "Observability for AI agents: session replay, cost and latency tracking, and debugging for multi-step runs, from a Python SDK that starts with two lines."
url: "https://www.agentops.ai"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "observability"
repo: "https://github.com/AgentOps-AI/agentops"
sameAs: ["https://github.com/AgentOps-AI/agentops", "https://docs.agentops.ai"]
color: "orange"
topics: ["ai-agents-systems"]
audience: ["ai-engineers", "devops"]
tags: ["observability", "agents", "monitoring", "debugging"]
featured: false
alternativeTo: ["langfuse", "arize-phoenix"]
summary: "AgentOps is an observability platform for AI agents. Its MIT-licensed Python SDK records each run as a session you can replay step by step, with LLM calls, tool calls, errors and cost attached. The hosted dashboard has a free tier. Development has slowed, though: the last SDK release is from August 2025, so weigh that before adopting it for a new project."
related: ["agent:agent-reliability-reviewer", "tool:langfuse", "tool:arize-phoenix", "guide:agent-frameworks-2026"]
faq:
  - q: "What is AgentOps?"
    a: "AgentOps is an observability platform built for AI agents. A Python SDK instruments your agent, and the hosted dashboard shows each run as a session replay: a step-by-step timeline of every LLM call, tool call and error, with token counts and cost attached, plus analytics across runs."
  - q: "Is AgentOps free?"
    a: "There is a free tier. As of November 2026, the pricing section on agentops.ai lists Basic at $0 per month, free up to 5,000 events; Pro starting at $40 per month, pay as you go, with no event limit and unlimited log retention; and a custom-priced Enterprise plan with SSO, an SLA and on-premise or self-hosted deployment. The Python SDK is MIT-licensed."
  - q: "How do I use AgentOps?"
    a: "Run pip install agentops, set AGENTOPS_API_KEY, and call agentops.init() at the start of your program. Supported frameworks and LLM clients are then traced automatically. For your own code, decorators from agentops.sdk.decorators (@session, @agent, @operation, @task, @workflow) mark the spans you want to see in the replay."
  - q: "Is AgentOps still maintained?"
    a: "Lightly. As of November 2026 the latest SDK release on GitHub is 0.4.21 from August 29, 2025, and the main branch has had three commits since October 2025, the most recent a bug fix in June 2026. The hosted product and pricing page are still live. If release cadence matters to you, compare Langfuse and Arize Phoenix, which both shipped releases in November 2026."
---

[AgentOps](https://www.agentops.ai) is an observability platform built for AI agents. One user request to an agent fans out into a tree of LLM calls, tool calls and decisions, and plain logs stop being readable quickly. AgentOps records the run as a **session replay**: a timeline of everything the agent did, with cost, latency and errors on each step.

It is aimed at developers running agents in development or production who need to see why a run went wrong, what it cost and where it slowed down. The Python SDK integrates with the common agent frameworks, and the dashboard is hosted at app.agentops.ai.

## Highlights

- **Session replay.** A timeline of LLM calls, tool calls and steps for any run, which AgentOps calls time travel debugging: rewind and replay a run at a chosen point in time.
- **Cost and token tracking.** Spend per run and per agent, with token counts split by prompt and completion. AgentOps says its price table covers more than 400 LLMs.
- **Framework integrations.** The repository lists CrewAI, Agno, the OpenAI Agents SDK, LangChain, AutoGen, AG2 and CamelAI, along with provider clients such as OpenAI, Anthropic, Cohere and Mistral.
- **Decorators for your own code.** `@session`, `@agent`, `@operation`, `@task` and `@workflow` create nested spans, and work on async and generator functions.
- **Audit trail.** AgentOps says the dashboard keeps a full data trail of logs, errors and prompt injection attacks from prototype to production.

## In an AI-assisted workflow

```bash
pip install agentops
export AGENTOPS_API_KEY=<your_key>
```

```python
import agentops
from agentops.sdk.decorators import agent, operation, session

agentops.init()  # reads AGENTOPS_API_KEY; supported frameworks are traced from here

@agent
class Researcher:
    @operation
    def summarize(self, text: str) -> str:
        return text[:200]  # each call becomes a span in the replay

@session
def run() -> str:
    return Researcher().summarize("Acme Corp quarterly notes ...")

run()
```

For CrewAI, installing `crewai[agentops]` and setting the key is enough, with no decorators needed.

> [!TIP]
> Pair agent-specific replay (AgentOps) with general LLM observability ([Langfuse](/tools/langfuse), [Arize Phoenix](/tools/arize-phoenix)) depending on whether you're debugging the agent's control flow or the underlying model calls.

## Pricing

As of November 2026, the pricing section on agentops.ai lists three plans. **Basic** is $0 per month and free up to 5,000 events, with the SDK, LLM cost tracking and replay analytics. **Pro** starts at $40 per month on a pay-as-you-go basis and adds an unlimited event limit, unlimited log retention, session and event export, role-based permissions and Slack and email support. **Enterprise** is custom-priced and adds SSO, an SLA, custom data retention, on-premise or self-hosted deployment on AWS, GCP or Azure, and compliance programs (the site names SOC 2, HIPAA and NIST AI RMF).

## Good to know

**Maintenance has slowed.** As of November 2026, the latest SDK release on GitHub is 0.4.21, published August 29, 2025. The main branch has had only a few commits since: one in October 2025, a docs link fix in March 2026 and a bug fix in June 2026. The repository has about 6,000 GitHub stars as of November 2026 and is not archived, but a tool that instruments fast-moving agent frameworks needs frequent releases to keep its integrations working, so test it against the framework versions you run.

**Licensing is split.** The SDK is MIT. The repository also holds the full app (dashboard plus API backend) for self-hosting, and the README calls it MIT, while the `app/` folder's own LICENSE file is the Elastic License 2.0. Read that file before you host it for anyone else.

**Python first.** The core SDK and decorators are Python. If your agents are in TypeScript, check the current docs for coverage before committing.

**Alternatives.** [Langfuse](/tools/langfuse) is the broader open-source choice: tracing, evals and prompt management with an MIT core and active releases. [Arize Phoenix](/tools/arize-phoenix) is OpenTelemetry-native and runs locally with one command. [LangSmith](/tools/langsmith) fits teams already on LangChain or LangGraph. AgentOps is still the simplest route to a replay view for a CrewAI or AG2 prototype; for anything long-lived, the maintenance pace is the deciding factor. Once traces show you where an agent fails, [agent-reliability-reviewer](/agents/meta-orchestration/agent-reliability-reviewer) helps harden it.
