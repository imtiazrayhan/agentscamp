---
term: "LLMOps"
description: "LLMOps is the practices and tooling for running LLM apps in production: prompt versioning, evals, tracing, cost and latency monitoring, and guardrails."
date: 2026-06-17
topics: ["mlops-ai-infra"]
tags: ["llmops", "mlops", "observability", "production"]
related: ["glossary:tracing", "glossary:llm-as-judge", "glossary:eval-dataset", "glossary:prompt-caching"]
faq:
  - q: "How is LLMOps different from MLOps?"
    a: "MLOps centers on training, deploying, and monitoring models you own — versioning weights, watching data drift, retraining. LLMOps assumes the model is a hosted API you call, so the work shifts to what surrounds it: prompts, retrieval, tool definitions, evals, and cost. The discipline is the same idea (operate it reliably); the surface area moves from model internals to the application around the model."
  - q: "What do you actually monitor in production?"
    a: "Quality (via offline eval suites and online sampling), cost per request and per user, latency and time-to-first-token, error and refusal rates, and guardrail trips. Because the same prompt can drift in quality when a provider updates a model, regression evals on a fixed dataset are the early-warning system."
---

**LLMOps is the practice of operating LLM-powered applications in production — versioning prompts, running [evals](/glossary/eval-dataset), instrumenting [tracing](/glossary/tracing), and monitoring cost, latency, and guardrails — the LLM-specific evolution of MLOps.**

The shift from MLOps is one of surface area. When the model is a hosted API rather than weights you train, the moving parts that break are the prompts, retrieval context, tool definitions, and chained calls around it. So LLMOps tooling tracks prompt versions like code, captures every call as a trace you can replay, and scores outputs with eval datasets — often using an [LLM-as-judge](/glossary/llm-as-judge) to grade quality at scale rather than reading transcripts by hand.

The reason it matters: an LLM app can silently regress without any code change — a provider updates the model, a prompt edit shifts behavior, retrieval quality slips. Regression evals on a fixed dataset catch that before users do, while cost and latency dashboards (and tactics like [prompt caching](/glossary/prompt-caching)) keep the economics sane. The caveat is that none of this is free: building good eval coverage is real engineering, and a thin LLMOps layer gives false confidence.
