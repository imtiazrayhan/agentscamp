---
name: "Pydantic AI"
description: "Type-safe agent framework from the Pydantic team: validated structured outputs, dependency injection, durable execution, 'that FastAPI feeling.'"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://ai.pydantic.dev"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/pydantic/pydantic-ai"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "red"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "framework", "python", "type-safety", "pydantic"]
featured: false
alternativeTo: ["langchain", "crewai", "openai-agents-sdk"]
sameAs:
  - "https://github.com/pydantic/pydantic-ai"
  - "https://pydantic.dev/docs/ai/overview/"
  - "https://pypi.org/project/pydantic-ai/"
related: ["guide:agent-frameworks-2026", "tool:langchain", "glossary:structured-output", "guide:production-tool-calling", "tool:langgraph", "tool:instructor"]
summary: "Pydantic AI (MIT, ~21k GitHub stars, V2 stable since June 2026) is the Pydantic team's typed agent framework for Python: outputs validated against your models, type-safe dependency injection, many providers, durable execution on Temporal, DBOS, Prefect or Restate, and MCP and AG-UI support. A separate Harness package adds memory and sub-agents."
faq:
  - q: "What makes Pydantic AI different from LangChain or CrewAI?"
    a: "Type safety as the organizing principle. Agents declare typed dependencies and typed outputs; Pydantic validates everything, so a schema mismatch is a write-time error, not a 3am production surprise. It deliberately feels like FastAPI — plain Python, explicit wiring, no DSL — where LangChain optimizes for ecosystem breadth and CrewAI for multi-agent metaphors."
  - q: "Is Pydantic AI production-ready?"
    a: "V1 went GA in September 2025, and V2, the current stable line, shipped on June 23, 2026. The version policy rules out intentional breaking changes in minor releases and promises V1 security fixes for at least six months after V2. The durable-execution integrations — Temporal, DBOS, Prefect, Restate — exist precisely for production: crash recovery and resumable long-running agents. The release cadence is fast (85 stable V2 releases from June to late November 2026, the latest being 2.76.0), so pin versions regardless."
  - q: "What is Pydantic AI Harness?"
    a: "A separate open-source package, pydantic-ai-harness, that supplies ready-made capabilities for long-running agents: memory, guardrails, sub-agents, planning, context management, file access and an allowlisted shell. Its Coder capability bundles these into a coding agent, and Pax (pydantic-ai-pax) is the terminal UI built on it. Capabilities attach to an ordinary Agent through the capabilities list."
  - q: "Which model providers does it support?"
    a: "Essentially all of them: OpenAI, Anthropic, Gemini, Bedrock, Azure, Groq, Mistral, Cohere, DeepSeek, Ollama, OpenRouter, Together, Hugging Face, LiteLLM and more — model-agnostic is a core design goal, not an adapter afterthought."
---

Pydantic AI is what happens when the team whose validation library underpins half the Python AI stack builds the agent layer themselves. The pitch — *"that FastAPI feeling"* — is precise: plain Python, type hints doing real work, and the framework disappearing into the language instead of imposing a DSL.

## Highlights

- **Type-safe by construction** — agent outputs validate against your Pydantic models; tools take typed arguments; mismatches fail at write-time. [Structured output](/glossary/structured-output) isn't a feature here, it's the foundation.
- **Dependency injection** — typed deps flow into tools and prompts (the FastAPI pattern), making agents testable and explicit about what they touch.
- **Model-agnostic, genuinely** — the broadest provider matrix in the category, swappable without rewrites.
- **Durable execution** — the README counts nine engines, including Temporal, DBOS, Prefect, Restate and AWS Lambda, the first five co-maintained with the vendor teams: agents that survive crashes and resume mid-run.
- **Capabilities and the Harness** — a capability bundles tools, instructions, hooks and model settings into one attachable unit (`WebSearch()`, `MCP(...)`, `TemporalDurability()`). The separate `pydantic-ai-harness` package adds memory, guardrails, sub-agents, planning and a `Coder` capability, with Pax as the terminal UI on top.
- **Standards interop** — MCP and AG-UI support, plus built-in human-in-the-loop tool approval. A2A moved out of the core package in V2 and now lives in `fasta2a`.
- **Observability without lock-in** — OpenTelemetry-native tracing (Pydantic Logfire is the polished home, any OTel backend works) and Pydantic Evals alongside.

## In an AI-assisted workflow

```python
# pip install pydantic-ai   (Python 3.11+; reads ANTHROPIC_API_KEY)
from typing import Literal
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext

class Sentiment(BaseModel):
    label: Literal["positive", "negative", "neutral"]
    score: float = Field(ge=-1, le=1)

agent = Agent("anthropic:claude-sonnet-5-5", output_type=Sentiment)

@agent.tool
def recent_reviews(ctx: RunContext, product: str) -> list[str]:
    """Fetch recent review snippets for a product."""
    return ["The new release fixed everything I complained about!"]  # example data

result = agent.run_sync("How are people feeling about the Extract app?")
print(result.output)   # label='positive' score=0.9
```

The tool's signature and docstring become its schema, arguments are validated before your code runs, and `result.output` is always a `Sentiment` or the run fails. Swapping providers is a change to the model string, such as `"openai:gpt-6.2-sol"`.

The natural adopters: Python teams already living in Pydantic/FastAPI idioms, and anyone whose agent failures have taught them that **untyped agent boundaries are where production incidents breed** ([the tool-calling discipline](/guides/concepts/production-tool-calling), enforced by the type system).

> [!TIP]
> In V2 a bare `pip install pydantic-ai` installs the OpenAI, Anthropic and Google providers plus the CLI, MCP, evals and Logfire integrations; other providers are extras, such as `pydantic-ai[bedrock,groq]`. For the leanest tree, install `pydantic-ai-slim[anthropic]` with only what you call.

## Good to know

MIT, Python-only (no JS), Python 3.11 or newer, and on 2.76.0 as of November 27, 2026, with a fast minor cadence — pin versions even under the stability pledge. Logfire and the Pydantic AI Gateway (one key for many providers, with failover and cost monitoring) are the commercial siblings; both are optional, since the telemetry is plain OTel and every provider can be called directly.

The trade-offs: it is an agent framework, not a retrieval framework, so for RAG you bring your own vector store and expose search as a tool, or pair it with something like [LlamaIndex](/tools/llamaindex). Multi-agent work is plain Python delegation, Harness sub-agents or Pydantic Graph, not a crew metaphor, which suits engineers more than no-code builders. And much pre-June-2026 material targets V1; the docs keep a V1 to V2 migration map.

Closest alternatives: the [OpenAI Agents SDK](/tools/openai-agents-sdk) is similarly small but leans on OpenAI's Responses API, and [Instructor](/tools/instructor) covers validated structured output alone if you do not need an agent loop. Against the field's other postures — LangChain's ecosystem, LangGraph's explicit graphs, CrewAI's crews — see [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026).
