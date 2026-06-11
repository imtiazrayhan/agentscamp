---
name: "LangGraph"
title: "LangGraph"
description: "A low-level library for building stateful, controllable agents as graphs, with checkpointing and human-in-the-loop."
url: "https://www.langchain.com/langgraph"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/langchain-ai/langgraph"
license: "MIT"
sameAs: ["https://github.com/langchain-ai/langgraph", "https://langchain-ai.github.io/langgraph/"]
color: "blue"
topics: ["ai-agents-systems"]
tags: ["agents", "framework", "orchestration", "open-source", "python"]
featured: false
alternativeTo: ["crewai", "autogen", "openai-agents-sdk", "claude-agent-sdk"]
summary: "LangGraph models an agent as an explicit state graph of nodes and edges, trading some abstraction for control. Its built-in persistence (checkpointing), human-in-the-loop interrupts, and streaming make it a common choice for production agents that need to be debuggable and resumable."
related: ["crewai", "openai-agents-sdk", "autogen", "agent-frameworks-2026", "mem0"]
faq:
  - q: "What is LangGraph?"
    a: "LangGraph is a low-level orchestration library for building agents as explicit state graphs: you define nodes (steps), edges (transitions), and a shared state object, so the agent's control flow becomes something you can see, test, and resume. Built-in checkpointing, human-in-the-loop interrupts, and streaming make runs durable and debuggable. Despite the name, it does not require the rest of LangChain."
  - q: "Is LangGraph free?"
    a: "Yes — LangGraph is open source under MIT and free to self-host. The optional LangGraph Platform (hosted deployment) and LangSmith (observability) are commercial."
  - q: "LangGraph vs CrewAI?"
    a: "LangGraph trades one-line convenience for control: explicit graphs, persistence, and human-in-the-loop, which production agents tend to need once they outgrow a demo. For quick role-based multi-agent setups, a higher-level framework like CrewAI is faster to start."
---

LangGraph is a low-level orchestration library for building agents as **explicit state graphs**: you define nodes (steps), edges (transitions), and a shared state object, and the agent's control flow becomes something you can see, test, and resume. It trades the one-line convenience of higher-level frameworks for control — which is exactly what production agents tend to need once they outgrow a demo.

It is aimed at engineers building durable, multi-step or multi-agent systems where you care about persistence, branching logic, and being able to pause for human input. Despite the name, LangGraph does not require the rest of LangChain.

## Highlights

- **Graph-based control flow** — model loops, branches, and multi-agent handoffs as explicit nodes and edges instead of opaque prompt chains.
- **Persistence / checkpointing** — save and restore agent state, so runs are resumable and crash-safe.
- **Human-in-the-loop** — interrupt the graph for approval or input, then resume from the exact point.
- **Streaming** — stream tokens and intermediate steps for responsive UIs and debugging.
- **Deployable** — pairs with LangGraph Platform for hosted deployment, plus [LangSmith](/tools/langsmith) for tracing.

## In an AI-assisted workflow

```python
from langgraph.graph import StateGraph, START, END

g = StateGraph(State)
g.add_node("retrieve", retrieve)
g.add_node("generate", generate)
g.add_edge(START, "retrieve"); g.add_edge("retrieve", "generate"); g.add_edge("generate", END)
app = g.compile(checkpointer=checkpointer)  # resumable, interruptible
```

> [!TIP]
> Reach for LangGraph when you need control and durability (checkpoints, HITL, branching). For quick role-based multi-agent setups, a higher-level framework like [CrewAI](/tools/crewai) is faster to start — see [the framework comparison](/guides/concepts/agent-frameworks-2026).

## Good to know

LangGraph is open source (MIT) and free to self-host; the optional LangGraph Platform (hosted deployment) and LangSmith (observability) are commercial. It's lower-level than role-based frameworks, so expect to write more wiring in exchange for more control.
