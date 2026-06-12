---
name: "LangChain"
description: "The provider-agnostic agent framework, post-1.0: a standard create_agent loop on the LangGraph runtime, middleware hooks, and the largest integration ecosystem."
date: 2026-06-11
url: "https://www.langchain.com"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/langchain-ai/langchain"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "green"
topics: ["ai-agents-systems"]
tags: ["agents", "framework", "python", "typescript", "llm"]
featured: false
alternativeTo: ["llamaindex", "crewai", "openai-agents-sdk"]
sameAs:
  - "https://github.com/langchain-ai/langchain"
  - "https://docs.langchain.com"
  - "https://pypi.org/project/langchain/"
related: ["langchain-vs-llamaindex", "agent-frameworks-2026", "langgraph", "langsmith", "llamaindex", "pydantic-ai"]
summary: "LangChain 1.0 (October 2025) answered its own bloat discourse by shrinking: the framework now centers on create_agent — a standard tool-calling loop running on the LangGraph runtime — plus middleware hooks and normalized content blocks across providers. Legacy chains moved to langchain-classic. MIT, Python and JS, ~139k stars; LangSmith is the commercial layer."
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
pip install langchain        # or: npm install langchain
# agent = create_agent(model, tools, middleware=[HumanInTheLoop()])
```

The 2026 fit: teams that want a standard agent loop **without marrying a provider**, and that value the graduated stack (LangChain → LangGraph → LangSmith) over assembling equivalents.

> [!WARNING]
> The pre-1.0 tutorial corpus is enormous and now misleading — most of it references APIs exiled to `langchain-classic`. Check dates before following anything, and treat "LangChain is bloated" takes as describing the 0.x era the team itself retired.

## Good to know

MIT, ~139k stars, free; the company monetizes LangSmith (freemium per-seat). Where it sits against the data-framework lineage of LlamaIndex — the classic confusion — is exactly the [LangChain vs LlamaIndex](/guides/comparisons/langchain-vs-llamaindex) question; the wider field is [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026).
