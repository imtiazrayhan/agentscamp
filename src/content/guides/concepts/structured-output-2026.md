---
title: "Structured Output vs JSON Mode vs Function Calling: Which to Use in 2026"
description: "The reliable ways to get typed data out of an LLM — what JSON mode, function calling, and native structured outputs each guarantee, and when to use which."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["llm-app-dev"]
tags: ["structured-output", "json-mode", "function-calling", "concepts"]
featured: true
summary: "For data (not prose) from an LLM, don't prompt-and-parse. Use native structured outputs (a JSON Schema the model is constrained to follow) for data you consume, and function/tool calling when the model should invoke an action. JSON mode only guarantees valid JSON syntax, not your shape. Libraries like Instructor, BAML, and the AI SDK wrap these with validation and auto-retry."
keyTakeaways:
  - "Prompt-and-parse ('return JSON') is the unreliable baseline — it breaks on the edge cases that matter."
  - "JSON mode guarantees valid JSON syntax, not that it matches your schema."
  - "Native structured outputs constrain the model to a JSON Schema — valid AND conformant; the default for data."
  - "Function/tool calling is for when the model should DO something (call a tool), not just return data."
  - "Libraries (Instructor, BAML, Vercel AI SDK) add validation + auto-retry on top of these mechanisms."
faq:
  - q: "What's the difference between JSON mode and structured outputs?"
    a: "JSON mode guarantees the model returns syntactically valid JSON — but not that it matches your schema; fields can be missing, mistyped, or extra. Structured outputs (a.k.a. constrained decoding against a JSON Schema) guarantee the output conforms to the exact schema you specify — correct fields, types, and enums. For data your code depends on, use structured outputs; JSON mode is a weaker, legacy guarantee."
  - q: "Should I use function calling or structured outputs for extraction?"
    a: "Use structured outputs. Function/tool calling is designed for the model to invoke an action — call a tool with arguments — and you can coerce it into returning data, but native structured outputs are the more direct, reliable mechanism when you just want typed data back. Reserve function calling for when the model should actually do something."
  - q: "Do I need a library like Instructor or can I use the provider's API directly?"
    a: "You can use the provider's structured-output API directly. Libraries like Instructor, BAML, and the Vercel AI SDK add value on top: define the schema with your language's types, automatic validation, retry-on-failure with the errors fed back, streaming of partial objects, and provider-agnostic code. For anything beyond a one-off, the library ergonomics are worth it."
  - q: "Why does asking the model to 'return JSON' in the prompt keep breaking?"
    a: "Because it's a request, not a guarantee. The model will usually comply, then occasionally wrap the JSON in prose, add a trailing comment, use the wrong type, or omit a field — exactly on the inputs you didn't test. Without a structural guarantee and validation, those rare failures become production incidents. Use structured outputs (or a library that validates and retries) instead."
related: ["calling-any-model-gateways", "llm-integration-engineer", "llm-output-schema-generator", "instructor", "baml", "production-tool-calling"]
---

When you need *data* from an LLM — extracted fields, a classification, a filled form — prose is the enemy. You want a typed object your code can rely on. In 2026 there are several mechanisms for that, with genuinely different guarantees, and choosing the wrong one is why so many LLM features break in production on inputs nobody tested.

## The four approaches, weakest to strongest

### 1. Prompt-and-parse (avoid)

You add "respond with JSON" to the prompt and `JSON.parse` the result. It works in the demo and fails in production: the model occasionally wraps the JSON in prose, adds a comment, mistypes a field, or omits one — usually on the edge case that matters. There's **no structural guarantee and no validation**. This is the baseline everything else exists to replace.

### 2. JSON mode

The provider guarantees the output is **syntactically valid JSON**. That removes the "wrapped in prose / trailing comma" class of bugs — but it does **not** guarantee your *shape*. Fields can be missing, mistyped, or extra. JSON mode is a real improvement over prompt-and-parse and a weaker, older guarantee than what comes next.

### 3. Native structured outputs (the default for data)

The model is **constrained to a JSON Schema** you provide (via constrained decoding), so the output is valid JSON **and conforms to your schema** — the right fields, types, and enums. This is the strongest native guarantee and, in 2026, the default mechanism when you want typed data. You define the schema; the provider enforces it.

### 4. Function / tool calling

Function (tool) calling has the model return a **call** — a function name plus arguments matching a schema. It was the original structured mechanism and is still the right tool when the model should **do something** (invoke a tool, take an action) rather than just hand back data. You *can* coerce it into pure extraction, but for "just give me the object," native structured outputs are more direct. See [Production Tool & Function Calling](/guides/concepts/production-tool-calling) for the action case.

## Where the libraries fit

[Instructor](/tools/instructor), [BAML](/tools/baml), and the [Vercel AI SDK](/tools/vercel-ai-sdk) sit on top of these provider mechanisms and add the ergonomics you'd otherwise hand-roll:

- **Schema from your types** — define the shape as Pydantic/Zod/a DSL instead of raw JSON Schema.
- **Validation + auto-retry** — if output doesn't validate, re-ask with the errors, so you get conforming data or a clean failure.
- **Streaming partials** and **provider-agnostic** calls.

Design the schema itself with the [llm-output-schema-generator](/skills/api/llm-output-schema-generator) skill.

## How to choose

- **You want typed data your code consumes** → **native structured outputs**, ideally via a library (Instructor/BAML/AI SDK) for validation + retry.
- **You want the model to take an action** → **function/tool calling**.
- **You only need valid JSON, not a strict shape** → **JSON mode** (rare; usually you want structured outputs).
- **Never** → prompt-and-parse for anything that matters.

> [!TIP]
> Whatever the mechanism, keep schemas tight and flat: clear field names, descriptions, enums for closed sets, honest required/optional flags. The schema is doing prompt engineering — a good one prevents more errors than a long instruction.

For wiring all this into a real app — with streaming, fallback, and cost control — see the [llm-integration-engineer](/agents/data-ai/llm-integration-engineer) and the model-access layer in [Calling Any Model](/guides/concepts/calling-any-model-gateways).
