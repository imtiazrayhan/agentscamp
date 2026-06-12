---
name: "Pydantic AI"
description: "The type-safe agent framework from the Pydantic team — validated structured outputs, dependency injection, durable execution, and 'that FastAPI feeling' for agents."
date: 2026-06-11
url: "https://ai.pydantic.dev"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/pydantic/pydantic-ai"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "red"
topics: ["ai-agents-systems"]
tags: ["agents", "framework", "python", "type-safety", "pydantic"]
featured: false
alternativeTo: ["langchain", "crewai", "openai-agents-sdk"]
sameAs:
  - "https://github.com/pydantic/pydantic-ai"
  - "https://pydantic.dev/docs/ai/overview/"
  - "https://pypi.org/project/pydantic-ai/"
related: ["agent-frameworks-2026", "langchain", "structured-output", "production-tool-calling", "langgraph", "instructor"]
summary: "Pydantic AI (MIT, ~18k stars, v1 GA September 2025) brings the Pydantic team's type discipline to agents: outputs validated against your models so errors move from runtime to write-time, type-safe dependency injection for tools, the broadest model-agnostic provider list, durable execution via Temporal/DBOS/Prefect/Restate, and MCP/A2A interop."
faq:
  - q: "What makes Pydantic AI different from LangChain or CrewAI?"
    a: "Type safety as the organizing principle. Agents declare typed dependencies and typed outputs; Pydantic validates everything, so a schema mismatch is a write-time error, not a 3am production surprise. It deliberately feels like FastAPI — plain Python, explicit wiring, no DSL — where LangChain optimizes for ecosystem breadth and CrewAI for multi-agent metaphors."
  - q: "Is Pydantic AI production-ready?"
    a: "v1 went GA in September 2025 with an explicit stability pledge (no breaking changes for at least six months; v1 supported well past any v2), and the durable-execution integrations — Temporal, DBOS, Prefect, Restate — exist precisely for production: crash recovery and resumable long-running agents. The release cadence is fast (100+ minors since GA), so pin versions regardless."
  - q: "Which model providers does it support?"
    a: "Essentially all of them: OpenAI, Anthropic, Gemini, Bedrock, Azure, Groq, Mistral, Cohere, DeepSeek, Ollama, OpenRouter, Together, Hugging Face, LiteLLM and more — model-agnostic is a core design goal, not an adapter afterthought."
---

Pydantic AI is what happens when the team whose validation library underpins half the Python AI stack builds the agent layer themselves. The pitch — *"that FastAPI feeling"* — is precise: plain Python, type hints doing real work, and the framework disappearing into the language instead of imposing a DSL.

## Highlights

- **Type-safe by construction** — agent outputs validate against your Pydantic models; tools take typed arguments; mismatches fail at write-time. [Structured output](/glossary/structured-output) isn't a feature here, it's the foundation.
- **Dependency injection** — typed deps flow into tools and prompts (the FastAPI pattern), making agents testable and explicit about what they touch.
- **Model-agnostic, genuinely** — the broadest provider matrix in the category, swappable without rewrites.
- **Durable execution** — first-class Temporal, DBOS, Prefect, and Restate integrations: agents that survive crashes and resume mid-run.
- **Standards interop** — MCP, A2A, and AG-UI support, plus built-in human-in-the-loop tool approval.
- **Observability without lock-in** — OpenTelemetry-native tracing (Pydantic Logfire is the polished home, any OTel backend works) and Pydantic Evals alongside.

## In an AI-assisted workflow

```bash
pip install pydantic-ai      # production: pydantic-ai-slim[openai,...] for lean deps
# agent = Agent("anthropic:claude-sonnet-4-6", output_type=Invoice, deps_type=DB)
```

The natural adopters: Python teams already living in Pydantic/FastAPI idioms, and anyone whose agent failures have taught them that **untyped agent boundaries are where production incidents breed** ([the tool-calling discipline](/guides/concepts/production-tool-calling), enforced by the type system).

> [!TIP]
> Install the slim package with extras in production — the full `pydantic-ai` pulls every provider's dependencies; `pydantic-ai-slim[anthropic]` keeps the tree honest.

## Good to know

MIT, Python-only (no JS), v1.x with a fast minor cadence — pin versions even under the stability pledge. Logfire is the commercial sibling, optional by design since the telemetry is plain OTel. Against the field's other postures — LangChain's ecosystem, LangGraph's explicit graphs, CrewAI's crews — see [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026).
