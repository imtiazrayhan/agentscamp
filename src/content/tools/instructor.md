---
name: "Instructor"
title: "Instructor"
description: "Get structured, validated output from LLMs using plain type definitions, with automatic retries on validation failure."
url: "https://python.useinstructor.com"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/567-labs/instructor"
license: "MIT"
sameAs: ["https://github.com/567-labs/instructor"]
color: "purple"
topics: ["llm-app-dev"]
tags: ["structured-output", "pydantic", "validation", "open-source", "python"]
featured: false
alternativeTo: ["baml", "vercel-ai-sdk"]
summary: "Instructor turns an LLM into a typed function: define a Pydantic model (or a Zod/equivalent schema in its ports), and Instructor coerces the model's output into that shape, validating it and automatically re-asking on failure. The simplest way to get reliable structured data out of an LLM."
related: ["baml", "structured-output-2026", "llm-output-schema-generator", "vercel-ai-sdk"]
faq:
  - q: "What is Instructor?"
    a: "Instructor makes structured output from LLMs feel like calling a typed function. You define the shape you want as a Pydantic model (Python, with ports for TypeScript, Go, and others), and Instructor instructs the model, parses the response into your type, validates it, and automatically retries with the validation errors fed back if the output doesn't conform."
  - q: "Is Instructor free?"
    a: "Yes — Instructor is free and open source under MIT; you pay your model provider for tokens. Because it builds on providers' native function-calling and structured-output capabilities, it stays a thin, focused library rather than a framework you build your app around."
  - q: "Instructor vs BAML?"
    a: "Instructor is the in-code, single-language approach: types defined with Pydantic (or a port's equivalent) right in your application. BAML is the cross-language, schema-first alternative with its own DSL and a build step that generates clients for multiple languages."
---

Instructor makes structured output from LLMs feel like calling a typed function. You define the shape you want as a Pydantic model (Python — with ports for TypeScript, Go, and others), pass it in, and Instructor handles the rest: it instructs the model, parses the response into your type, **validates** it, and **automatically retries** with the validation errors fed back if the output doesn't conform.

It is aimed at developers who want data, not prose, from an LLM — extraction, classification, form-filling — without writing brittle JSON parsing and retry loops by hand. Because it builds on the providers' native function-calling/structured-output capabilities, it's thin and reliable rather than a heavy framework.

## Highlights

- **Types as the schema** — define output with Pydantic (or the language port's equivalent); no hand-written JSON Schema.
- **Validation + auto-retry** — invalid output is re-requested with the errors, so you get conforming data or a clear failure.
- **Provider-agnostic** — works across OpenAI, Anthropic, and many other models.
- **Streaming partials** — stream structured objects as they're produced.
- **Minimal footprint** — a focused library, not a framework you build your app around.

## In an AI-assisted workflow

```python
import instructor
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

client = instructor.from_provider("anthropic/claude")
user = client.chat.completions.create(response_model=User, messages=[...])  # -> validated User
```

> [!TIP]
> Let your types do the prompting: a well-named model with field descriptions and constraints (enums, ranges) often beats paragraphs of instructions for getting the exact structure you want.

## Good to know

Instructor is free and open source (MIT); you pay your model provider for tokens. For a cross-language, schema-first approach with its own DSL, compare [BAML](/tools/baml); for a TypeScript-native app toolkit that also does structured output, see the [Vercel AI SDK](/tools/vercel-ai-sdk). Background on the techniques: [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).
