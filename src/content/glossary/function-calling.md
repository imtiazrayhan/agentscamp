---
term: "Function Calling (Tool Calling)"
description: "Function calling lets an LLM request structured invocations of your code: describe tools with schemas, the model emits typed calls, your app executes them."
date: 2026-06-11
topics: ["ai-agents-systems"]
tags: ["function-calling", "tool-use", "agents", "api"]
related: ["guide:production-tool-calling", "glossary:ai-agent", "glossary:structured-output", "glossary:model-context-protocol", "skill:tool-definition-generator", "agent:agent-tool-integration-engineer"]
faq:
  - q: "Does the model actually execute the function?"
    a: "No — it only emits a structured request (the function name plus JSON arguments matching your schema). Your application executes the real call and returns the result to the model as an observation. The model proposes; your code disposes — which is also where validation, permissions, and safety checks belong."
  - q: "How does function calling relate to MCP?"
    a: "Function calling is the model-level mechanism (emit a structured call); MCP is the protocol layer that standardizes where tools come from — servers any client can connect to, with discovery and transport handled. MCP tools are surfaced to the model as functions; one is the interface, the other the ecosystem."
---

**Function calling (tool calling) is the mechanism that lets language models act: you declare functions with JSON-schema parameters, the model responds with a structured call — name plus typed arguments — and your application executes it and feeds back the result.**

It's the bridge from text generation to action, and the atom every [agent](/glossary/ai-agent) loop is built from: model emits call → app executes → result returns as an observation → model decides the next step. The model never runs anything itself; it produces *intentions* shaped by your schemas, which is exactly why the engineering quality lives in those schemas — sharp names, described parameters, disjoint purposes ([tool-definition-generator](/skills/api/tool-definition-generator) automates the shape).

Production reliability has one golden rule: **feed errors back as observations.** A failed call isn't an exception to crash on — it's information the model uses to retry correctly ("invalid date format" → reformatted call). That pattern, plus validation, idempotency, and permission gating, is the substance of [Production Tool & Function Calling](/guides/concepts/production-tool-calling). The [Model Context Protocol](/glossary/model-context-protocol) standardizes the layer above: where tools come from and how clients discover them.
