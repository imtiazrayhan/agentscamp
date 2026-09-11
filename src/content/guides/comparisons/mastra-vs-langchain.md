---
title: "Mastra vs LangChain (2026): TypeScript Agent Frameworks Compared"
description: "Mastra vs LangChain.js and LangGraph.js in 2026: license, workflows, memory, evals, observability and deployment compared, plus where the Vercel AI SDK fits."
seoTitle: "Mastra vs LangChain & LangGraph.js (2026): TypeScript Agent Stacks"
author: "Imtiaz Rayhan"
date: "2026-09-11"
reviewed: "2026-09-11"
color: "green"
topics: ["ai-agents-systems", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["comparison", "versus", "mastra", "langchain", "langgraph", "typescript", "agent-frameworks"]
keywords: ["mastra vs langchain", "langchain vs mastra", "mastra alternatives", "mastra ai alternative", "langgraph typescript alternative", "ai sdk alternatives", "langgraph.js"]
summary: "Choose Mastra if your team is TypeScript-only and wants agents, workflows, memory, evals and tracing in one framework. Choose LangChain.js with LangGraph.js for Python parity, checkpointed durable execution, or LangSmith. LangChain is MIT; Mastra is Apache-2.0 except ee/ folders, which need a commercial agreement for production use since August 24, 2026."
keyTakeaways:
  - "Mastra is TypeScript-only and batteries-included: agents, step-based workflows, four memory types, RAG helpers, scorers, an MCP client and server, and built-in tracing ship in one framework."
  - "LangChain 1.0 narrowed LangChain to createAgent plus middleware on the LangGraph runtime; LangGraph.js is the low-level layer for durable, checkpointed, long-running agents."
  - "Licensing differs: LangChain.js and LangGraph.js are MIT, while Mastra is Apache-2.0 except its ee/ folders, which need a written agreement for production use since August 24, 2026."
  - "Mastra interoperates with the Vercel AI SDK through AI SDK v6 models and AI SDK UI streams, and AI SDK 7's own agent classes may make a framework unnecessary for a single agent."
  - "Observability follows the same split: LangChain's native path is LangSmith, while Mastra exports to Langfuse, Braintrust, Arize, LangSmith or any OpenTelemetry backend."
  - "Decide by team language and platform appetite, not feature lists: TypeScript-only teams lean Mastra, while polyglot teams and LangSmith buyers lean LangChain."
faq:
  - q: "Is Mastra better than LangChain?"
    a: "Neither wins across the board. Mastra is the simpler choice for a TypeScript-only team that wants agents, workflows, memory, evals and tracing from one framework. LangChain.js with LangGraph.js suits teams that need Python parity, LangGraph's checkpointed durable execution, or LangSmith for tracing and deployment."
  - q: "Is Mastra open source?"
    a: "Mostly. Code outside any ee/ directory is Apache-2.0, but everything under ee/ falls under the Mastra Enterprise Edition License, effective August 24, 2026, which allows production use only with a written agreement with Kepler Software, Inc. LangChain.js and LangGraph.js are MIT throughout."
  - q: "What is the best TypeScript alternative to LangGraph?"
    a: "Mastra is the main TypeScript-native alternative: its workflows chain steps with branching, parallel runs, loops, suspend and resume, and human-in-the-loop. If you like LangGraph's model but not Python, LangGraph itself ships a TypeScript version, LangGraph.js, with docs parallel to the Python ones."
  - q: "Do I need Mastra or LangChain if I already use the Vercel AI SDK?"
    a: "Not necessarily. ToolLoopAgent, introduced in AI SDK 6, and the WorkflowAgent that AI SDK 7 added for durable, resumable execution may be enough for a single agent with tools. Add Mastra when you want memory, workflows, evals and tracing as framework features, since it works with AI SDK v6 models and AI SDK UI hooks, or LangGraph.js when you need checkpointed graph control."
  - q: "What are the main alternatives to Mastra?"
    a: "In TypeScript, the realistic alternatives are LangChain.js with LangGraph.js, the Vercel AI SDK's own agent classes, and the OpenAI Agents SDK, which also ships a TypeScript version. If your team works in Python, LangGraph, CrewAI and Pydantic AI open up, because Mastra has no Python SDK."
sources:
  - title: "Mastra LICENSE.md"
    url: "https://github.com/mastra-ai/mastra/blob/main/LICENSE.md"
    publisher: "Mastra (GitHub)"
  - title: "Announcing Mastra 1.0"
    url: "https://mastra.ai/blog/announcing-mastra-1"
    publisher: "Mastra"
  - title: "Mastra documentation"
    url: "https://mastra.ai/docs"
    publisher: "Mastra"
  - title: "Using Mastra with the AI SDK"
    url: "https://mastra.ai/docs/frameworks/agentic-uis/ai-sdk"
    publisher: "Mastra"
  - title: "Mastra deployment overview"
    url: "https://mastra.ai/docs/deployment/overview"
    publisher: "Mastra"
  - title: "Mastra OpenTelemetry exporter"
    url: "https://mastra.ai/docs/observability/tracing/exporters/otel"
    publisher: "Mastra"
  - title: "Choosing a JS agent framework"
    url: "https://mastra.ai/blog/choosing-a-js-agent-framework"
    publisher: "Mastra"
  - title: "LangChain and LangGraph 1.0"
    url: "https://www.langchain.com/blog/langchain-langgraph-1dot0"
    publisher: "LangChain"
  - title: "LangChain overview (JavaScript)"
    url: "https://docs.langchain.com/oss/javascript/langchain/overview"
    publisher: "LangChain"
  - title: "LangGraph overview (JavaScript)"
    url: "https://docs.langchain.com/oss/javascript/langgraph/overview"
    publisher: "LangChain"
  - title: "LangGraph durable execution (JavaScript)"
    url: "https://docs.langchain.com/oss/javascript/langgraph/durable-execution"
    publisher: "LangChain"
  - title: "LangSmith Deployment"
    url: "https://www.langchain.com/langsmith/deployment"
    publisher: "LangChain"
  - title: "AI SDK 7"
    url: "https://vercel.com/blog/ai-sdk-7"
    publisher: "Vercel"
related: ["tool:mastra", "tool:langchain", "tool:langgraph", "tool:vercel-ai-sdk", "tool:langsmith", "guide:agent-frameworks-2026", "guide:langgraph-vs-crewai", "guide:openai-agents-sdk-vs-langgraph"]
---

**Pick [Mastra](/tools/mastra) if your team writes only TypeScript and wants one framework that ships agents, workflows, memory, evals and tracing together; pick [LangChain](/tools/langchain) with [LangGraph](/tools/langgraph) if you need Python parity, LangGraph's checkpointed runtime, or the [LangSmith](/tools/langsmith) platform.** Both shipped 1.0 recently (LangChain and LangGraph in October 2025, Mastra on January 20, 2026), so the decision turns on shape and licensing rather than maturity. LangChain.js and LangGraph.js are MIT throughout, while Mastra is Apache-2.0 except its `ee/` folders, which need a commercial agreement for production use since August 24, 2026.

*Last reviewed: September 2026.*

## What each project is in 2026

### Mastra: one TypeScript framework, batteries included

Mastra describes itself as "a TypeScript framework for building AI agents and applications," built by the team behind Gatsby. It is TypeScript only: the repository is about 99% TypeScript and there is no Python SDK. Version 1.0 shipped on January 20, 2026 with the message that "APIs are locked, server adapters are the new default," adding adapters for Express, Hono, Fastify and Koa plus support for AI SDK v6. As of September 2026, `@mastra/core` is at 1.66.0, releases ship roughly weekly, and the repository has 27,937 GitHub stars. Mastra raised a Series A led by Spark Capital in April 2026.

The scope is deliberately wide:

- **Agents** take instructions, a model chosen by a `provider/model` string, and tools defined with `createTool()`.
- **Workflows** are built from `createWorkflow` and `createStep`, with control flow through `.then()`, `.parallel()`, `.branch()`, `.foreach()`, `.dountil()`, `.dowhile()`, `.map()`, `.sleep()` and `.sleepUntil()`, plus suspend and resume, [human-in-the-loop](/glossary/human-in-the-loop) steps, `restart()` and `resumeStream`.
- **Memory** comes in four forms: message history (on by default), working memory, semantic recall, and observational memory, which "uses background agents to maintain a dense observation log that replaces raw message history as it grows."
- **RAG** helpers include recursive and sliding-window chunking, plus vector stores "including pgvector, OracleDB, Pinecone, Qdrant, and MongoDB."
- **Evals** run through scorers that use "model-graded, rule-based, and statistical methods." They can score live traffic at a sampling rate, persist results to a `mastra_scorers` table, and also run in CI and Studio experiments.
- **MCP** works in both directions: `MCPClient` consumes servers, and `MCPServer` exposes "Mastra agents, tools, workflows, prompts, and resources" over stdio or HTTP with OAuth.
- **Observability** records spans for every agent run, workflow step, tool call and model call, stored in DuckDB for development and ClickHouse or PostgreSQL for production.

Around the framework sit two commercial pieces. Mastra Platform is a hosted cloud with a free Starter tier. Mastra Factory, an agent-driven issue-to-PR pipeline, entered beta on September 8, 2026.

Read the license carefully. Code outside any `ee/` directory is Apache-2.0. Everything under an `ee/` directory falls under the Mastra Enterprise Edition License, effective August 24, 2026, which permits production use only under a written agreement with Kepler Software, Inc. The license file names `@mastra/core/auth/ee`, `@mastra/core/agent-builder/ee` and `@mastra/editor/ee` as examples. npm still lists `@mastra/core` as Apache-2.0, so check your import paths for `/ee` rather than trusting package metadata.

### LangChain.js and LangGraph.js: two layers, one runtime

LangChain 1.0 and LangGraph 1.0 shipped together for Python and JavaScript in October 2025, with parallel docs and a promise of "no breaking changes until 2.0." The release narrowed LangChain to one job. At its center is `createAgent`, which the docs call "a minimal, highly configurable agent harness." Around it sits middleware, "hooks that allow you to customize behavior in the agent loop," with built-ins for human-in-the-loop approval, summarization and PII redaction. Legacy code moved out to `@langchain/classic` (`langchain-classic` in Python), and "LangChain agents are built on top of LangGraph."

LangGraph.js is the layer underneath, "a low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents." Deterministic, hand-coded steps and LLM-driven steps share one graph. Durable execution lets agents "persist through failures and can run for extended periods, resuming from where they left off." Checkpointers store thread state: `MemorySaver` for development, and `PostgresSaver` and `SqliteSaver` beyond it. Stores hold long-term memory across threads. The docs name Klarna, Uber and J.P. Morgan as users.

The docs now steer newcomers three ways:
- "Start with Deep Agents for a 'batteries-included' agent."
- Use LangChain "for a highly customizable harness."
- Use LangGraph "for advanced needs combining deterministic and agentic workflows."

Deep Agents exists in JavaScript as well as Python.

As of September 2026, the npm packages are at `langchain` 1.5.11, `@langchain/core` 1.2.10 and `@langchain/langgraph` 1.4.14. TypeScript teams should note two cautions:
- The Python and JS version numbers differ; Python `langchain` is at 1.4.0.
- Exact feature parity isn't documented, so confirm any Python feature you depend on in the JS docs.

The JS repositories are also much smaller by GitHub stars: 18,179 for langchainjs against 146,121 for Python LangChain, as of September 2026.

The commercial layer is LangSmith: tracing, evals and LangSmith Deployment. LangSmith Deployment is the October 2025 rename of LangGraph Platform, and it runs agents on Agent Server. You can run it in the cloud, as a hybrid, self-hosted on the Enterprise plan, or as a standalone server on Docker or Kubernetes.

## Where the Vercel AI SDK fits

Many TypeScript apps already use the [Vercel AI SDK](/tools/vercel-ai-sdk) (npm `ai`, Apache-2.0) for model calls, streaming and UI hooks. AI SDK 7, released June 25, 2026, moved up the stack:
- `ToolLoopAgent`, carried over from AI SDK 6 and extended.
- A `WorkflowAgent` for "durable, resumable agent execution."
- An experimental `HarnessAgent` for Claude Code, Codex and Pi.
- Tool approvals.
- OpenTelemetry telemetry that uses the GenAI semantic conventions.

Mastra interoperates with it at two points. Mastra 1.0 added "full support for AI SDK v6, including LanguageModelV3 models and ToolLoopAgent." The `@mastra/ai-sdk` package then streams Mastra agents in AI SDK-compatible formats for `useChat()`, `useCompletion()` and `useObject()`. Its handlers default to AI SDK v5 formats for backward compatibility; pass `version: 'v7'` for AI SDK v7. LangChain.js brings its own provider packages instead, such as `@langchain/anthropic`.

The decision rule:
- If one agent with tools and a streaming chat UI is the whole job, AI SDK 7 on its own may be enough.
- Add Mastra when you want memory, workflows, evals and tracing as framework features.
- Add LangGraph.js when you need explicit, checkpointed graph control.

## Mastra vs LangChain, side by side

| | Mastra | LangChain.js + LangGraph.js |
| --- | --- | --- |
| Language | TypeScript only | TypeScript and Python, parallel docs |
| Core abstractions | Agent, Tool, Workflow, Memory, Scorers | `createAgent` + middleware; graphs, checkpointers, stores; Deep Agents |
| Workflows and durability | Step workflows with suspend, resume, `restart()`; Inngest runner option | Checkpointed graphs that resume after failures |
| Memory | History, working memory, semantic recall, observational memory | Thread checkpoints plus cross-thread Stores |
| RAG | Built-in chunking; pgvector, Pinecone, Qdrant and more | Integration packages for models, vector stores and tools |
| Evals | Built-in scorers, live sampling, CI | Through LangSmith |
| MCP | `MCPClient` and `MCPServer` | Check current docs |
| Observability | Built-in tracing; Langfuse, Braintrust, Arize, LangSmith, OTel exporters | LangSmith native; third-party integrations |
| Deployment | Hono server, adapters, Vercel/Netlify/Cloudflare deployers | Self-host or LangSmith Deployment |
| Commercial layer | Mastra Platform (free Starter tier) | LangSmith (free Developer plan) |
| License | Apache-2.0; `ee/` commercial | MIT |
| 1.0 | January 20, 2026 | October 2025 |

The MCP cell for LangChain.js says "Check current docs" because the sources behind this page don't cover it. Confirm it before relying on it.

The pattern is integration versus layering. Mastra puts memory, evals, RAG helpers, MCP and tracing inside one framework, so a new TypeScript project gets them without choosing extra products. LangChain splits the job into layers:
- `createAgent` for the loop.
- LangGraph for durable control.
- LangSmith for tracing, evals and deployment, which also serve its Python users.

Observability follows the same split. Mastra's exporters feed Langfuse, Braintrust, Arize, LangSmith or any OpenTelemetry backend, and its OTel exporter "follows OpenTelemetry Semantic Conventions for GenAI v1.38.0." LangChain's native path is LangSmith, which also accepts OTLP, and Braintrust, Phoenix and Langfuse all document LangChain or LangGraph integrations. The [observability tools roundup](/guides/comparisons/best-llm-observability-tools-2026) compares those backends.

## Choose Mastra if…

- Your product and team are TypeScript end to end, and you don't want a separate Python service for the agent layer.
- You want memory, evals and tracing to arrive with the framework, not as separate products to evaluate.
- You already build on the Vercel AI SDK and want to keep its UI hooks on the front end.
- You deploy to Vercel, Netlify or Cloudflare, which have built-in deployers, or want a Hono, Express, Fastify or Koa server. AWS, Azure, DigitalOcean, Render, Next.js and Astro are documented too.
- You can keep `ee/` code out of production, or you're willing to sign Mastra's enterprise agreement.

Mastra's own comparison post from April 2025 frames it the same way. It suggests Mastra when "You want a local development environment with tracing built-in" and when "Memory management is important."

## Choose LangChain.js and LangGraph.js if…

- Your organization also builds agents in Python and wants one set of concepts, with parallel docs in both languages.
- You need long-running agents with explicit graph control, where checkpointers let runs survive failures and resume.
- You want one vendor for tracing, evals and hosted agents: LangSmith, including LangSmith Deployment (formerly LangGraph Platform, renamed October 2025).
- You want a permissive license everywhere: langchainjs and langgraphjs are both MIT.
- You want a batteries-included agent without leaving this ecosystem. Start with Deep Agents, as the docs now suggest.

The same Mastra post suggests LangGraph.js when "You're already using other LangChain tools" or "You like the graph-based workflow syntax."

## Migrating between them

Switching frameworks means rewriting the orchestration layer rather than porting it. Tools and prompts carry over if you kept them framework-agnostic. The closest concept matches:

| LangChain.js / LangGraph.js | Closest Mastra concept |
| --- | --- |
| `createAgent` with tools | `Agent` with instructions, a model and `createTool()` tools |
| LangGraph graph with a checkpointer | Workflow from `createWorkflow`/`createStep` with suspend and resume |
| Human-in-the-loop middleware | Human-in-the-loop workflow steps |
| Summarization middleware | Observational memory |
| Stores for cross-thread memory | Working memory and semantic recall |
| LangSmith tracing | Built-in tracing with an exporter |

Three practical notes:
- **Keeping LangSmith after a move to Mastra:** Mastra documents a LangSmith exporter, `@mastra/langsmith`. LangSmith also ingests OTLP and maps `gen_ai.*` attributes, and Mastra's OTel exporter follows those conventions, so the OTel route works as a fallback.
- **Moving gradually:** Mastra's `MCPClient` can consume tools you've already wrapped as [MCP](/glossary/model-context-protocol) servers.
- **Moving from Python LangChain to Mastra:** this is also a language change, because Mastra has no Python SDK.

## Next steps

Scaffold both and compare them on one real task. These install commands are copied verbatim from each project's docs:

```bash
npm create mastra@latest
```

```bash
npm install langchain zod @langchain/anthropic
```

```bash
npm install @langchain/langgraph @langchain/core
```

Then widen the lens:
- [The 2026 agent framework guide](/guides/concepts/agent-frameworks-2026) covers the wider field.
- [LangGraph vs CrewAI](/guides/comparisons/langgraph-vs-crewai) and [OpenAI Agents SDK vs LangGraph](/guides/comparisons/openai-agents-sdk-vs-langgraph) cover LangGraph's other rivals.
- [The RAG frameworks roundup](/guides/comparisons/best-rag-frameworks-2026) covers retrieval, and [LangChain vs LlamaIndex](/guides/comparisons/langchain-vs-llamaindex) covers LangChain's other classic matchup.

For design work that outlasts either framework, read [agent memory architecture](/guides/concepts/agent-memory-architecture) and [building multi-step workflows](/guides/advanced/building-multi-step-workflows). Before you ship, run the [agent reliability reviewer](/agents/meta-orchestration/agent-reliability-reviewer).
