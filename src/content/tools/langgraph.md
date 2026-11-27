---
name: "LangGraph"
title: "LangGraph"
description: "A low-level, MIT-licensed library and runtime for building stateful agents as graphs, with checkpointing, human-in-the-loop interrupts and streaming."
url: "https://www.langchain.com/langgraph"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/langchain-ai/langgraph"
license: "MIT"
sameAs: ["https://github.com/langchain-ai/langgraph", "https://docs.langchain.com/oss/python/langgraph/overview"]
color: "blue"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "framework", "orchestration", "open-source", "python"]
featured: false
alternativeTo: ["crewai", "autogen", "openai-agents-sdk", "claude-agent-sdk"]
summary: "LangGraph models an agent as an explicit state graph of nodes and edges, trading some abstraction for control. Its built-in persistence (checkpointing), human-in-the-loop interrupts, and streaming make it a common choice for production agents that need to be debuggable and resumable."
related: ["tool:crewai", "tool:openai-agents-sdk", "tool:autogen", "guide:agent-frameworks-2026", "tool:mem0"]
faq:
  - q: "What is LangGraph?"
    a: "LangGraph is a low-level orchestration library for building agents as explicit state graphs: you define nodes (steps), edges (transitions), and a shared state object, so the agent's control flow becomes something you can see, test, and resume. Built-in checkpointing, human-in-the-loop interrupts, and streaming make runs durable and debuggable. Despite the name, it does not require the rest of LangChain."
  - q: "Is LangGraph free?"
    a: "Yes. LangGraph is open source under MIT and free to self-host, including its checkpointers. Hosting is the paid part: LangSmith Deployment (renamed from LangGraph Platform in October 2025) runs graphs on managed Agent Servers. As of November 2026, LangSmith's pricing page lists Plus at $39 per seat per month with one small serverless Agent Server included and further servers billed by resource usage; the free Developer plan does not include Agent Server."
  - q: "LangGraph vs CrewAI?"
    a: "LangGraph trades one-line convenience for control: explicit graphs, persistence, and human-in-the-loop, which production agents tend to need once they outgrow a demo. For quick role-based multi-agent setups, a higher-level framework like CrewAI is faster to start."
  - q: "Do I need LangChain to use LangGraph?"
    a: "No. LangGraph's docs say it does not require LangChain; nodes are plain Python functions and you can call any model SDK inside them. The dependency runs the other way: LangChain's create_agent is built on LangGraph, and LangGraph's own create_react_agent prebuilt was deprecated in favor of it."
  - q: "Where does LangGraph store checkpoints?"
    a: "In whatever checkpointer you compile the graph with. InMemorySaver keeps state in RAM and loses it on restart, SqliteSaver writes a local file for development, and PostgresSaver is the production option with async support. Each run is keyed by a thread_id in the config, and with PostgresSaver that ID must stay under 255 characters."
---

LangGraph is a low-level orchestration library for building agents as **explicit state graphs**: you define nodes (steps), edges (transitions), and a shared state object, and the agent's control flow becomes something you can see, test, and resume. It trades the one-line convenience of higher-level frameworks for control — which is exactly what production agents tend to need once they outgrow a demo.

It is aimed at engineers building durable, multi-step or multi-agent systems where you care about persistence, branching logic, and being able to pause for human input. Despite the name, LangGraph does not require the rest of LangChain.

The latest Python release is 1.2.24, published on November 20, 2026; the JavaScript package `@langchain/langgraph` is at 1.7.5. The repository has about 45,500 GitHub stars as of November 2026.

## Highlights

- **Graph-based control flow** — model loops, branches, and multi-agent handoffs as explicit nodes and edges instead of opaque prompt chains.
- **Persistence / checkpointing** — save and restore agent state, so runs are resumable and crash-safe.
- **Human-in-the-loop** — interrupt the graph for approval or input, then resume from the exact point.
- **Streaming** — stream tokens and intermediate steps for responsive UIs and debugging.
- **Memory** — short-term state per thread through the checkpointer, and a separate store for longer-term memory across threads.
- **Deployable** — pairs with LangSmith Deployment (formerly LangGraph Platform) and its Agent Server runtime for hosted deployment, plus [LangSmith](/tools/langsmith) for tracing.

## In an AI-assisted workflow

```bash
pip install -U langgraph        # JS/TS: npm install @langchain/langgraph
```

A complete graph with a checkpoint and a human approval step:

```python
from typing import TypedDict

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt


class State(TypedDict):
    draft: str
    approved: bool


def write_draft(state: State):
    return {"draft": "Refund order #1001 for $40"}   # call your model here


def human_review(state: State):
    approved = interrupt({"question": "Approve this action?", "draft": state["draft"]})
    return {"approved": approved}


g = StateGraph(State)
g.add_node("write_draft", write_draft)
g.add_node("human_review", human_review)
g.add_edge(START, "write_draft")
g.add_edge("write_draft", "human_review")
g.add_edge("human_review", END)
app = g.compile(checkpointer=InMemorySaver())        # resumable, interruptible

config = {"configurable": {"thread_id": "order-1001"}}
result = app.invoke({"draft": "", "approved": False}, config)
print(result["__interrupt__"])                       # paused, waiting for a person

final = app.invoke(Command(resume=True), config)     # resumes from the checkpoint
print(final["approved"])                             # True
```

The second `invoke` can run in a different process hours later, as long as the checkpointer is persistent and the `thread_id` matches.

> [!TIP]
> Reach for LangGraph when you need control and durability (checkpoints, HITL, branching). For quick role-based multi-agent setups, a higher-level framework like [CrewAI](/tools/crewai) is faster to start — see [the framework comparison](/guides/concepts/agent-frameworks-2026).

## Good to know

LangGraph is open source (MIT) and free to self-host; the optional LangSmith Deployment (hosted deployment; LangChain renamed it from LangGraph Platform in October 2025) and LangSmith (observability) are commercial. As of November 2026, LangSmith's pricing page includes one small serverless Agent Server on the Plus plan ($39 per seat per month) and bills additional servers by compute and memory usage.

It's lower-level than role-based frameworks, so expect to write more wiring in exchange for more control. Things that catch teams out:

- **`InMemorySaver` is for demos.** It keeps checkpoints in RAM and loses them on restart. Use `PostgresSaver` in production (`SqliteSaver` for local development), and plan to prune old checkpoints.
- **Interrupts need a checkpointer and a `thread_id`.** Without both there is nothing to resume from. On resume the node restarts from its beginning, not from the `interrupt()` line, so keep code before the call free of side effects or make it idempotent. On resume the node restarts from its beginning, not from the `interrupt()` line, so keep code before the call free of side effects or make it idempotent.
- **The prebuilt agent moved.** `create_react_agent` in LangGraph is deprecated; the maintained high-level loop is `create_agent` in [LangChain](/tools/langchain), which runs on LangGraph.
- **It prescribes nothing about prompts or agent design.** That is the point, but it means you bring your own model calls, tools and architecture.

Among alternatives, [CrewAI](/tools/crewai) trades this control for role-based crews you can stand up quickly ([LangGraph vs CrewAI](/guides/comparisons/langgraph-vs-crewai)). The [OpenAI Agents SDK](/tools/openai-agents-sdk) is a smaller handoff-based loop ([comparison](/guides/comparisons/openai-agents-sdk-vs-langgraph)), and the [Claude Agent SDK](/tools/claude-agent-sdk) ships a finished coding-agent harness in place of graph primitives.
