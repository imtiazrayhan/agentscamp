---
name: "OpenAI Agents SDK"
title: "OpenAI Agents SDK"
description: "OpenAI's MIT-licensed agent framework for Python and TypeScript: agents, handoffs, guardrails, sessions, sandbox and voice agents, with built-in tracing."
url: "https://openai.github.io/openai-agents-python/"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/openai/openai-agents-python"
license: "MIT"
sameAs: ["https://github.com/openai/openai-agents-python"]
color: "green"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "framework", "openai", "open-source", "python"]
featured: false
alternativeTo: ["langgraph", "crewai", "autogen"]
summary: "The OpenAI Agents SDK is a small, MIT-licensed framework for multi-agent apps: an agent loop plus handoffs, guardrails, sessions, human-in-the-loop approvals and tracing, with sandbox, realtime and voice agents on top. It defaults to the OpenAI Responses API and reaches other providers through OpenAI-compatible endpoints or beta adapters."
related: ["tool:langgraph", "tool:crewai", "tool:autogen", "guide:agent-frameworks-2026"]
faq:
  - q: "Is the OpenAI Agents SDK free?"
    a: "Yes. The SDK is open source under MIT, and you pay only for the model tokens and hosted tools your agents use. Viewing traces in the OpenAI Traces dashboard is free, including for runs on non-OpenAI models if you give the tracing exporter an OpenAI API key."
  - q: "Does the OpenAI Agents SDK work with non-OpenAI models?"
    a: "Yes, with caveats. Any provider with an OpenAI-compatible endpoint works through set_default_openai_client, a ModelProvider or a per-agent model object, usually over Chat Completions. For wider coverage the docs offer LiteLLM and Any-LLM adapters, both described as best-effort beta as of November 2026. Some features, such as hosted tools and deferred tool loading, need the Responses API."
  - q: "What model does the Agents SDK use by default?"
    a: "As of November 2026, the docs say an agent with no model set runs on gpt-5.6-luna with reasoning effort none and low verbosity, chosen for cost-sensitive, high-volume workflows. Override it per agent with model=, per run with RunConfig(model=...), or globally with the OPENAI_DEFAULT_MODEL environment variable."
  - q: "OpenAI Agents SDK vs LangGraph?"
    a: "The Agents SDK gives you a ready-made loop and lets the model decide when to hand off, so there is little to design up front. LangGraph makes you draw the state graph yourself, which is more work and gives you explicit control over branching, checkpoints and resumption. Pick the SDK for a standard tool-using agent, LangGraph when the control flow is the product."
---

The OpenAI Agents SDK is OpenAI's open-source framework for building agentic apps, described in its docs as a production-ready upgrade of the earlier Swarm experiment. The design goal is few primitives: an **agent** (a model with instructions and tools), **handoffs** or agents-as-tools for delegation, and **guardrails** for validation, all driven by a built-in loop that runs until the task is done. The Python repository is MIT-licensed with about 30,900 GitHub stars as of November 2026; the current release is 0.26.0 (November 24, 2026) and needs Python 3.10 or newer. A separate TypeScript SDK ships as `@openai/agents` on npm.

It suits developers who want a managed agent loop without learning a graph DSL. If you want to own the loop and tool dispatch yourself, the docs say plainly to use the Responses API directly.

## Highlights

- **Agent loop.** `Runner.run()` calls the model, executes tool calls, feeds results back and repeats until there is a final output.
- **Function tools.** Decorate a Python function with `@function_tool` and the SDK generates the schema and validates arguments with Pydantic. Remote MCP servers and OpenAI's hosted tools plug in the same way.
- **Handoffs and agents as tools.** List other agents in `handoffs=[...]` and the model can transfer the conversation to a specialist, or expose an agent as a callable tool and keep control.
- **Guardrails.** Input and output checks run in parallel with the agent and fail fast when a check trips.
- **Sessions.** Pass a session object such as `SQLiteSession("conversation_123")` and history is stored and replayed across runs; a Redis backend is an optional extra.
- **Human in the loop.** Approval-gated tools pause a run until your application approves or rejects the call.
- **Sandbox, realtime and voice agents.** `SandboxAgent` works inside an isolated workspace (local Unix, Docker or hosted) for long file-and-command tasks; `RealtimeAgent` runs low-latency voice over WebSocket; `VoicePipeline` chains speech-to-text, an agent and text-to-speech.
- **Tracing.** On by default, recording model calls, tool calls, handoffs and guardrails to the OpenAI Traces dashboard.

## In an AI-assisted workflow

```python
# pip install openai-agents ; export OPENAI_API_KEY=...
from agents import Agent, Runner, SQLiteSession, function_tool

@function_tool
def lookup_invoice(invoice_id: str) -> str:
    """Return the status of an invoice."""
    return f"Invoice {invoice_id}: charged once on 2026-11-03 (example data)"

billing = Agent(
    name="Billing",
    instructions="Resolve billing questions. Look up the invoice before answering.",
    tools=[lookup_invoice],
)
triage = Agent(
    name="Triage",
    instructions="Route billing questions to the Billing agent.",
    handoffs=[billing],
)

session = SQLiteSession("conversation_123")
result = Runner.run_sync(triage, "Was invoice INV-42 charged twice?", session=session)
print(result.final_output)
```

Run it again with the same session id and the agent sees the earlier turns. To pin a model, add `model="gpt-6.2-sol"` (or any current id) to an `Agent`, or set `OPENAI_DEFAULT_MODEL`.

> [!WARNING]
> Tracing is enabled by default and exports run data to OpenAI; generation and function spans store model and tool inputs and outputs unless you set `RunConfig.trace_include_sensitive_data` to false. Set `OPENAI_AGENTS_DISABLE_TRACING=1` or call `set_tracing_disabled(True)` to turn it off, and note that tracing is unavailable to organizations under a Zero Data Retention policy.

## Good to know

**Provider-agnostic, OpenAI-first.** The README claims support for 100+ LLMs, and that is true through adapters. But the SDK defaults to the Responses API, and the docs list features that are rejected on Chat Completions models and non-Responses backends. The LiteLLM (`openai-agents[litellm]`) and Any-LLM (`openai-agents[any-llm]`) adapters are labelled best-effort beta as of November 2026, and some providers behind them do not report token usage unless you set `ModelSettings(include_usage=True)`. Test structured output and tool calling on the exact backend you plan to ship.

**Still 0.x.** The version number is below 1.0 and releases are frequent, so pin it. The TypeScript package (0.22.0 on npm as of November 2026) versions separately from Python.

**Handoffs trade control for brevity.** The model decides when to hand off. That is quick to build and harder to make deterministic; when a step must always happen, call it in plain Python between runs instead of hoping the model routes there.

**Durability comes from integrations.** Sessions persist conversation history, not a crashed run's position. For runs that must survive long waits, retries or process restarts, the docs point to durable-execution integrations with Dapr, Temporal, Restate and DBOS, which means running one of those alongside the SDK.

**Contributions are closed.** The README says pull requests are limited to repository collaborators, so fixes arrive on OpenAI's schedule.

Against the alternatives: [LangGraph](/tools/langgraph) gives explicit state graphs with checkpointing when you need to control and resume every step. [Pydantic AI](/tools/pydantic-ai) is the closest in spirit, a small Python framework, with typed dependency injection and first-class support for many providers. [CrewAI](/tools/crewai) models agents as a role-based crew. The [Claude Agent SDK](/tools/claude-agent-sdk) is the counterpart built around Claude's coding-agent harness. [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026) compares them side by side.
