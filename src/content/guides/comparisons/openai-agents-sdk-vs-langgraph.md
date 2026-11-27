---
title: "OpenAI Agents SDK vs LangGraph: Minimal vs Controllable (2026)"
description: "OpenAI Agents SDK vs LangGraph with one handoff-plus-approval agent coded in both: who owns the loop, how runs pause and resume, licences and versions."
author: "Imtiaz Rayhan"
date: 2026-06-17
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems"]
audience: ["developers"]
tags: ["comparison", "versus", "openai-agents-sdk", "langgraph", "agent-frameworks"]
featured: false
summary: "The OpenAI Agents SDK runs the loop for you: agents, handoffs, guardrails, and sessions, with approvals surfaced as interruptions you serialize yourself. LangGraph makes you write the loop as a graph, and in return checkpoints every step to SQLite, Postgres, or MongoDB. Choose the SDK for speed, LangGraph when resume-after-crash must be built in."
keyTakeaways:
  - "The Agents SDK owns the agent loop; you supply agents, tools, handoffs, and guardrails. LangGraph has no built-in loop: you write nodes and edges over a typed state."
  - "Both pause for human approval. The SDK returns interruptions and a RunState you store and reload yourself; LangGraph's interrupt() writes to a checkpointer and resumes by thread_id."
  - "Sessions in the Agents SDK persist conversation history (SQLite, Redis, SQLAlchemy, MongoDB, Dapr, or OpenAI's Conversations API); they are not step-level checkpoints of a run."
  - "For crash-proof long runs the SDK's docs point to external engines: Temporal, Dapr, Restate, and DBOS integrations. LangGraph's durability is in the library."
  - "Both are MIT-licensed with Python and TypeScript libraries. The SDK is pre-1.0 (0.26.0 in November 2026); LangGraph has been 1.x since October 2025."
faq:
  - q: "Which is better for production: OpenAI Agents SDK or LangGraph?"
    a: "It depends on what failure costs. If a run that dies mid-way can simply be retried, the Agents SDK is less code and less to learn. If a run must resume exactly where it stopped, LangGraph's checkpointers do that with no extra system. With the SDK you get the same guarantee by pairing it with Temporal, Dapr, Restate, or DBOS, which is a second piece of infrastructure to run."
  - q: "Is the OpenAI Agents SDK locked to OpenAI models?"
    a: "No. It defaults to OpenAI's Responses API, but the README calls it provider-agnostic, and the models docs describe built-in integration points for other providers plus Any-LLM and LiteLLM adapters, which the docs label as best-effort beta as of November 2026. Some features assume OpenAI: hosted tools and the default tracing export go to OpenAI's platform."
  - q: "Does approving a tool call guarantee it runs exactly once?"
    a: "No, in either framework. The Agents SDK docs say so directly: if the process stops after the tool acts but before you store the updated run state, resuming the older snapshot can run the tool again. LangGraph re-executes a node from its start when it resumes after interrupt(), so any side effect placed before the interrupt call runs twice. In both, give consequential actions an idempotency key."
  - q: "Can I trace an Agents SDK app in LangSmith?"
    a: "Yes. The SDK's tracing is on by default and exports to OpenAI's Traces dashboard, but it supports custom trace processors, and the docs list LangSmith and Langfuse among the external options. Tracing to OpenAI is unavailable for organizations under a Zero Data Retention policy."
related: ["tool:openai-agents-sdk", "tool:langgraph", "guide:agent-frameworks-2026", "guide:multi-agent-orchestration", "guide:langgraph-vs-crewai", "tool:pydantic-ai"]
sources:
  - title: "OpenAI Agents SDK documentation"
    url: "https://openai.github.io/openai-agents-python/"
    publisher: "OpenAI"
  - title: "Human-in-the-loop (OpenAI Agents SDK)"
    url: "https://openai.github.io/openai-agents-python/human_in_the_loop/"
    publisher: "OpenAI"
  - title: "openai-agents-python repository"
    url: "https://github.com/openai/openai-agents-python"
    publisher: "OpenAI"
  - title: "LangGraph interrupts documentation"
    url: "https://docs.langchain.com/oss/python/langgraph/interrupts"
    publisher: "LangChain"
  - title: "LangGraph checkpointers documentation"
    url: "https://docs.langchain.com/oss/python/langgraph/checkpointers"
    publisher: "LangChain"
  - title: "LangGraph repository and README"
    url: "https://github.com/langchain-ai/langgraph"
    publisher: "LangChain"
---

OpenAI Agents SDK vs LangGraph is a question about who owns the agent loop. The SDK ships a loop and asks you for the parts: agents, tools, handoffs, guardrails. LangGraph ships no loop at all; you draw one as a graph and get durable state in exchange. Both run real multi-step [AI agents](/glossary/ai-agent) in production.

## The short answer

- **Fastest path to a working agent, small API, OpenAI-first stack** → **[OpenAI Agents SDK](/tools/openai-agents-sdk)**.
- **Runs that must pause, survive a restart, and resume at the same step without extra infrastructure** → **[LangGraph](/tools/langgraph)**.
- **Control flow that is not "a model picks the next tool"** (fixed pipelines, fan-out and join, loops with exit conditions you define) → LangGraph.
- **Not sure of the design yet** → read [the orchestration patterns guide](/guides/advanced/multi-agent-orchestration) before picking either.

## The facts side by side

Versions and stars were checked on November 27, 2026.

| | OpenAI Agents SDK | LangGraph |
| --- | --- | --- |
| Maintainer | OpenAI | LangChain Inc |
| Licence | MIT | MIT |
| Latest release | Python 0.26.0, JS 0.22.0 (pre-1.0) | Python 1.2.24, JS 1.7.5 (1.0 shipped October 17, 2025) |
| Install | `pip install openai-agents` / `npm install @openai/agents zod` | `pip install -U langgraph`; `@langchain/langgraph` on npm |
| GitHub stars (November 2026) | about 30,900 (Python repo) | about 45,500 (Python repo) |
| Primitives | Agents, handoffs or agents-as-tools, guardrails, sessions | `StateGraph`, nodes, edges, state reducers, checkpointers |
| Who runs the loop | The SDK's `Runner` | You, as graph edges |
| Default model path | OpenAI Responses API; other providers through integration points or adapters | None; you call any model inside a node |
| Conversation memory | Sessions: SQLite, Redis, SQLAlchemy, MongoDB, Dapr, OpenAI Conversations | Checkpointer per thread, plus a store for cross-thread memory |
| Step-level durability | Not built in; Temporal, Dapr, Restate, DBOS integrations | Built in: checkpoint at every super-step |
| Human approval | `needs_approval` on a tool, then `RunState` approve or reject | `interrupt()` in any node, then `Command(resume=...)` |
| Tracing | On by default, exported to OpenAI's Traces dashboard | Opt-in through LangSmith or any tracer you wire up |
| Hosting | Run it yourself | Run it yourself, or LangSmith Agent Server |

## The same agent in both

The agent: a triage step routes a refund request to a refund specialist, and the refund itself needs a human's approval before it executes.

### OpenAI Agents SDK

```python
import asyncio

from agents import Agent, Runner
from agents.decorators import tool


@tool(needs_approval=True)
async def issue_refund(order_id: int) -> str:
    return f"Refunded order {order_id}"


refund_agent = Agent(
    name="Refund agent",
    instructions="Issue refunds with the issue_refund tool.",
    tools=[issue_refund],
)
triage_agent = Agent(
    name="Triage agent",
    instructions="Send refund requests to the refund agent. Answer everything else yourself.",
    handoffs=[refund_agent],
)


async def main() -> None:
    result = await Runner.run(triage_agent, "Order 1234 arrived broken. Refund it.")

    while result.interruptions:
        state = result.to_state()  # serialize with state.to_string() to wait across processes
        for item in result.interruptions:
            print(f"{item.agent.name} wants {item.name}({item.arguments})")
            state.approve(item)  # or state.reject(item)
        result = await Runner.run(triage_agent, state)

    print(result.final_output)


asyncio.run(main())
```

The handoff is one keyword argument: the model sees a tool named `transfer_to_refund_agent` and decides when to call it. The approval is one flag on the tool. Note that you resume with the original top-level agent (`triage_agent`), even though the interruption came from the agent it handed off to; the docs are explicit that approvals are run-wide.

What you do not see is where the paused run lives. `result.to_state()` gives you a `RunState`; persisting it between the pause and the decision is your job (`state.to_string()`, then `RunState.from_string(...)` or `RunState.from_json(...)` later). The docs warn that a serialized `RunState` is not authenticated, so keep it in server-side storage and never round-trip it through a browser.

### LangGraph

```python
from typing import Literal, TypedDict

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt


class State(TypedDict):
    request: str
    order_id: int
    status: str


def triage(state: State) -> Command[Literal["refund", "answer"]]:
    # Replace this rule with a model call that returns a structured route.
    is_refund = "refund" in state["request"].lower()
    return Command(goto="refund" if is_refund else "answer")


def refund(state: State):
    approved = interrupt({"question": "Approve refund?", "order_id": state["order_id"]})
    if not approved:
        return {"status": "refund rejected"}
    # Call the payment API here, after the interrupt, so it runs once.
    return {"status": f"refunded order {state['order_id']}"}


def answer(state: State):
    return {"status": "answered"}


builder = StateGraph(State)
builder.add_node("triage", triage)
builder.add_node("refund", refund)
builder.add_node("answer", answer)
builder.add_edge(START, "triage")
builder.add_edge("refund", END)
builder.add_edge("answer", END)
graph = builder.compile(checkpointer=InMemorySaver())  # PostgresSaver in production

config = {"configurable": {"thread_id": "ticket-1234"}}
paused = graph.invoke(
    {"request": "Order 1234 arrived broken. Refund it.", "order_id": 1234},
    config=config,
    version="v2",
)
print(paused.interrupts)

done = graph.invoke(Command(resume=True), config=config, version="v2")
print(done.value["status"])
```

More lines, and the routing is yours to write (the example uses a string rule to stay short; in practice the triage node calls a model). What you get back is that the pause needs no storage code. `interrupt()` saves the thread to the checkpointer; the resume call can come from another process days later with nothing but the `thread_id`. Swap `InMemorySaver` for `PostgresSaver.from_conn_string(...)` from `langgraph-checkpoint-postgres` and that survives a deploy.

## Durability and human-in-the-loop, specifically

The two snippets hide the main architectural difference, so here it is spelled out.

**What is saved, and when.** LangGraph writes a checkpoint at every super-step, plus per-node writes inside a step, so a crash loses at most the node that was running. Checkpointer packages exist for SQLite, Postgres, MongoDB, and Azure Cosmos DB. The Agents SDK saves two different things, neither of them automatically at each step: a session stores conversation items so the next `Runner.run` has history, and a `RunState` snapshot exists only when you create one, typically at an interruption.

**Recovering from a crash mid-run.** In LangGraph, invoke the same `thread_id` again and the graph continues from the last checkpoint, skipping nodes whose writes already landed. In the Agents SDK there is no mid-run recovery in the library; the docs route that need to durable-execution integrations (Temporal, Dapr, Restate, DBOS), which wrap each model and tool call as a recorded step.

**Approval scope.** The SDK gates tool calls: `needs_approval` accepts `True` or an async function that inspects the arguments, and it also works on `Agent.as_tool`, shell and patch tools, and MCP servers. Decisions can be made sticky with `always_approve=True`. LangGraph gates anything: `interrupt()` can sit before a tool call, after a draft, or in the middle of a node to ask a clarifying question, and it can take a typed response schema.

**The re-execution trap.** When a LangGraph node resumes, it runs again from its first line and `interrupt()` returns the resume value instead of pausing. Code above the interrupt therefore runs twice. Put side effects after it, or in a separate node.

**Guardrails.** The SDK has them as a primitive: input and output checks that run in parallel with the agent and fail fast. LangGraph has no guardrail type; a check is another node and an edge.

## Tracing and deployment cost

Both libraries are free and MIT-licensed. The surrounding services are priced differently.

Agents SDK tracing is on by default and exports to OpenAI's Traces dashboard, which the docs describe as free to view; set `OPENAI_AGENTS_DISABLE_TRACING=1` to turn it off. You pay OpenAI for model tokens and hosted tools, and you host the agent process yourself. There is no OpenAI-run deployment service specific to the SDK.

LangGraph has no tracing of its own. The usual pairing is [LangSmith](/tools/langsmith): a free single-seat Developer plan with a monthly base-trace allowance, a per-seat Plus plan, and pay-as-you-go traces beyond the allowance. Deployment is optional. LangSmith Agent Server hosts graphs with managed persistence; Plus includes one small serverless server and bills additional ones on resource usage, and Enterprise adds hybrid and self-hosted options. A graph with your own Postgres checkpointer on your own containers costs only the infrastructure.

## Where each one loses

**The Agents SDK loses when the model should not be in charge of control flow.** Handoffs are tool calls the model chooses to make; if a step must always follow another, you enforce that in Python around the runner, not in the framework. It is also pre-1.0, so minor versions may break APIs, and the Any-LLM and LiteLLM adapters for other providers carry a beta label as of November 2026.

**LangGraph loses on simple agents.** A single agent with five tools is a `while` loop, and wrapping it in a graph adds concepts (reducers, super-steps, serialization rules) without adding capability. It requires `langchain-core`, and the checkpoint tables grow with every step of every thread, so long-lived deployments need a retention plan.

## How to choose

Ask three things.

1. **How long does a run wait?** Seconds to minutes inside one request: either works, and the SDK is less code. Hours or days waiting on a person or an external event: LangGraph, or the SDK plus a durable-execution engine you already operate.
2. **Who decides the next step?** If the model does, the SDK's handoffs and agents-as-tools are the shortest path. If your code does, with fixed stages and explicit branches, a graph states that directly.
3. **What is your stack already?** Teams on OpenAI's platform get tracing, hosted tools, and the Conversations API with no extra setup. Teams already running LangSmith or needing several model vendors on equal footing fit LangGraph better.

The two also combine: a LangGraph node can call `Runner.run`, which puts the SDK's agent loop inside a checkpointed graph. For the role-based alternative see [LangGraph vs CrewAI](/guides/comparisons/langgraph-vs-crewai); for the wider field, including [Pydantic AI](/tools/pydantic-ai), see [the 2026 framework guide](/guides/concepts/agent-frameworks-2026). Both frameworks speak [function calling](/glossary/function-calling) and [structured output](/glossary/structured-output), and both support [human-in-the-loop](/glossary/human-in-the-loop) gates, so tools and prompts kept as plain functions and files stay portable between them.
