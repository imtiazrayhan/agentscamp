---
name: "LangChain"
description: "The provider-agnostic agent framework, post-1.0: a standard create_agent loop on the LangGraph runtime, middleware hooks, and the largest integration ecosystem."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.langchain.com"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/langchain-ai/langchain"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "green"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "framework", "python", "typescript", "llm"]
featured: false
alternativeTo: ["llamaindex", "crewai", "openai-agents-sdk"]
sameAs:
  - "https://github.com/langchain-ai/langchain"
  - "https://docs.langchain.com"
  - "https://pypi.org/project/langchain/"
related: ["guide:langchain-vs-llamaindex", "guide:agent-frameworks-2026", "tool:langgraph", "tool:langsmith", "tool:llamaindex", "tool:pydantic-ai"]
summary: "LangChain 1.0 (October 2025) answered its own bloat discourse by shrinking: the framework now centers on create_agent — a standard tool-calling loop running on the LangGraph runtime — plus middleware hooks and normalized content blocks across providers. Legacy chains moved to langchain-classic. MIT, Python and JS; LangSmith is the commercial layer."
faq:
  - q: "Do I still need LangChain in 2026?"
    a: "The honest framing the 1.0 release itself embraced: if you're on one provider, a first-party SDK or direct API calls cover simple agents with fewer layers. LangChain's remaining case is real, though — provider-agnosticism (swap models without rewrites), middleware around the agent loop, and the seamless path down to LangGraph for control and out to LangSmith for observability."
  - q: "What changed in LangChain 1.0?"
    a: "Radical narrowing. The sprawling chain zoo moved out to langchain-classic; what remains is create_agent (a production tool-calling loop built on the LangGraph runtime), middleware at every step, standardized content blocks for reasoning/citations/tool-calls across providers, and structured output generated inside the main loop. Both Python and JS shipped together, with a no-breaking-changes-until-2.0 pledge."
  - q: "LangChain vs LangGraph — which do I use?"
    a: "They're layers, not rivals: create_agent IS LangGraph underneath. Start with LangChain's high-level API; drop to LangGraph when you need custom graphs, durable state, or long-running orchestration. Same runtime, two altitudes."
---

LangChain spent two years as both the most-used and most-criticized framework in AI — then 1.0 (October 2025) did the unusual thing: it agreed with the critics and **shrank**. The repo now calls itself "the agent engineering platform," and the framework's center is one well-built thing instead of forty abstractions.

## Highlights

- **`create_agent`** — a standard, production-grade tool-calling agent loop, running on the LangGraph runtime, in one call.
- **Middleware** — hooks at every step of the loop, with built-ins that matter: human-in-the-loop approval, context summarization, PII redaction.
- **Normalized content blocks** — reasoning traces, citations, and tool calls in one shape across providers; the swap-the-model promise made real.
- **In-loop structured output** — typed results generated inside the agent loop, not via an extra LLM call.
- **The ecosystem moat** — the largest integration surface in the category (`langchain-*` packages for every model, vector store, and tool), in Python and JS.
- **A clean escalation path** — drop down to [LangGraph](/tools/langgraph) for custom graphs and durable state; out to [LangSmith](/tools/langsmith) for tracing and evals.

## In an AI-assisted workflow

```bash
pip install -U langchain "langchain[anthropic]"   # or: npm install langchain
```

```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver


def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"


agent = create_agent(
    model="claude-sonnet-4-6",          # or "openai:..." / "google_genai:..."
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
    checkpointer=InMemorySaver(),       # required for human-in-the-loop pauses
    middleware=[
        HumanInTheLoopMiddleware(interrupt_on={"get_weather": True}),
    ],
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]},
    {"configurable": {"thread_id": "demo-1"}},
)
```

Swapping providers is a one-string change to `model` plus the matching `langchain-<provider>` package. The built-in middleware list is long: tool and model retry, model fallback, summarization, human-in-the-loop, model and tool call limits, PII detection, context editing and more.

The 2026 fit: teams that want a standard agent loop **without marrying a provider**, and that value the graduated stack (LangChain → LangGraph → LangSmith) over assembling equivalents.

> [!WARNING]
> The pre-1.0 tutorial corpus is enormous and now misleading — most of it references APIs exiled to `langchain-classic`. Check dates before following anything, and treat "LangChain is bloated" takes as describing the 0.x era the team itself retired.

## Good to know

MIT, about 150,000 GitHub stars as of November 2026, free. The latest `langchain` release on PyPI is 1.5.2 (November 18, 2026), which requires Python 3.11 or later; the npm package is at 1.6.8. The company monetizes [LangSmith](/tools/langsmith): as of November 2026 its pricing page lists a Developer plan at $0 with one seat and 5,000 base traces a month, Plus at $39 per seat per month, and custom Enterprise pricing, each with pay-as-you-go usage on top.

Two things to weigh. LangChain is still a layer: on a single provider, the first-party SDK has fewer moving parts and exposes new model features sooner. And the stack now has three altitudes, so pick deliberately: the docs point to Deep Agents (planning, subagents, a virtual filesystem) for a batteries-included harness, `create_agent` for a customizable one, and LangGraph for workflows that mix deterministic and agentic steps.

Among alternatives, [LlamaIndex](/tools/llamaindex) comes from the data and retrieval side, [Pydantic AI](/tools/pydantic-ai) is a smaller typed-Python agent framework, and the [OpenAI Agents SDK](/tools/openai-agents-sdk) is the lean option if you are staying on one provider. Where it sits against the data-framework lineage of LlamaIndex — the classic confusion — is exactly the [LangChain vs LlamaIndex](/guides/comparisons/langchain-vs-llamaindex) question; the wider field is [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026).
