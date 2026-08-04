---
name: "BAML"
title: "BAML"
description: "A domain-specific language for type-safe LLM functions, with generated clients and schema-aligned parsing."
url: "https://www.boundaryml.com"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/BoundaryML/baml"
sameAs: ["https://github.com/BoundaryML/baml", "https://docs.boundaryml.com"]
color: "green"
topics: ["llm-app-dev"]
tags: ["structured-output", "type-safe", "dsl", "open-source"]
featured: false
alternativeTo: ["instructor"]
summary: "BAML is a small domain-specific language for defining LLM functions with typed inputs and outputs. You write the function and schema once in .baml files and generate type-safe clients for Python, TypeScript, and more; its schema-aligned parser reliably coerces messy model output into your types."
related: ["tool:instructor", "guide:structured-output-2026", "skill:llm-output-schema-generator"]
faq:
  - q: "What is BAML?"
    a: "BAML, by BoundaryML, is a small domain-specific language for type-safe LLM functions. You define an LLM function — its prompt, typed inputs, and typed output — in a .baml file, and BAML generates type-safe clients for Python, TypeScript, and other languages, with schema-aligned parsing that coerces the imperfect, almost-JSON models often emit into your declared types."
  - q: "Is BAML free?"
    a: "Yes — BAML is open source and free; you pay your model provider for tokens. It introduces a build step (generating clients from .baml files), which is the trade for cross-language type safety."
  - q: "BAML vs Instructor?"
    a: "BAML shines when the same prompts are consumed by multiple services or languages, or when you want prompts version-controlled, tested, and reviewed like any other code. For a single-language, in-code approach, Instructor is lighter weight."
---

BAML (by BoundaryML) takes a different angle on structured LLM output: instead of a library in one language, it's a small **domain-specific language**. You define an LLM function — its prompt, typed inputs, and typed output — in a `.baml` file, and BAML generates **type-safe clients** for Python, TypeScript, and other languages. Its **schema-aligned parsing** is built to coerce the imperfect, almost-JSON that models often emit into your declared types.

It is aimed at teams who want their LLM calls to be first-class, version-controlled, type-checked artifacts shared across a polyglot codebase, rather than prompt strings scattered through application code. The DSL also gives you a testing playground for prompts.

## Highlights

- **Typed LLM functions** — declare inputs, outputs, and the prompt in one place; get compile-time types in your app.
- **Multi-language clients** — generate idiomatic clients (Python, TypeScript, and more) from the same definition.
- **Schema-aligned parsing** — robustly parses real-world model output, including partial/streaming and malformed-ish JSON.
- **Prompt as code** — `.baml` files live in version control with tests and a playground.
- **Provider-agnostic** — works across model providers.

## In an AI-assisted workflow

```baml
class User { name string  age int }

function ExtractUser(text: string) -> User {
  client Claude
  prompt #"Extract the user from: {{ text }} {{ ctx.output_format }}"#
}
```

Generate clients, then call `ExtractUser(...)` from Python or TypeScript and get a typed `User` back.

> [!TIP]
> BAML shines when the same prompts are consumed by multiple services/languages, or when you want prompts under test and review like any other code. For a single-language, in-code approach, [Instructor](/tools/instructor) is lighter weight.

## Good to know

BAML is open source and free; you pay your model provider for tokens. It introduces a build step (generating clients from `.baml` files), which is the trade for cross-language type safety. See [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026) for when typed output is worth it.
