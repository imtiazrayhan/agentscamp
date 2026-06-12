---
term: "Tracing (LLM)"
description: "LLM tracing records every step of a model-driven request — prompts, tool calls, retrievals, tokens, latency — so multi-step behavior is debuggable."
date: 2026-06-12
topics: ["llm-evals"]
tags: ["tracing", "observability", "debugging", "llmops"]
related: ["langfuse-vs-langsmith", "llm-observability-engineer", "debugging-ai-agents", "write-llm-evals", "llm-cost-latency-engineering"]
faq:
  - q: "What does an LLM trace actually contain?"
    a: "The full request tree: each model call with its exact prompt and response, every tool invocation with arguments and results, retrieval steps with what was fetched, token counts and cost per step, latency per span, and errors — nested to mirror the application's structure (a trace contains spans; an agent run contains its tool-call spans)."
  - q: "Why is tracing non-negotiable for agents?"
    a: "Because agent failures hide in the middle of multi-step runs: without the trace you see 'the answer was wrong'; with it you see step 7 retrieved the wrong document and everything after faithfully built on the mistake. Debugging, cost attribution, and eval-case mining all start from the same trace data."
---

**LLM tracing is recording the complete execution of a model-driven request — every prompt, response, tool call, retrieval, token count, and latency, structured as nested spans — making systems whose behavior is probabilistic at least *inspectable*.**

It's distributed tracing adapted to a new failure surface: in LLM apps the bug is rarely an exception — it's a wrong retrieval at step 3, a malformed tool argument at step 7, a context that drifted. The trace is where those become visible ([the first move in agent debugging](/guides/troubleshooting/debugging-ai-agents)), and it moonlights as the system's economic ledger (cost per request, per step, per user — the raw data of [cost engineering](/guides/advanced/llm-cost-latency-engineering)) and as the quarry for [eval datasets](/glossary/eval-dataset) — yesterday's traced failure is tomorrow's regression case.

The tooling is mature: [Langfuse and LangSmith](/guides/comparisons/langfuse-vs-langsmith) lead the dedicated platforms (with Phoenix, Braintrust, and OpenTelemetry-native options around them), all converging on the same model — instrument once, then debug, monitor, and evaluate from the same captured truth. The production discipline this enables — tracing every step, scoring live traffic — is the [llm-observability-engineer](/agents/data-ai/llm-observability-engineer)'s whole brief.
