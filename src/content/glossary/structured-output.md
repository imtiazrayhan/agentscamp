---
term: "Structured Output"
description: "Structured output makes an LLM return data in a guaranteed shape — JSON matching your schema — so code can consume model responses without parsing prose."
date: 2026-06-11
topics: ["llm-app-dev"]
tags: ["structured-output", "json", "schemas", "llm"]
related: ["guide:structured-output-2026", "glossary:function-calling", "skill:llm-output-schema-generator", "tool:instructor", "tool:baml"]
faq:
  - q: "What's the difference between JSON mode and structured outputs?"
    a: "JSON mode guarantees syntactically valid JSON — but any JSON: fields can be missing, renamed, or mistyped. Structured outputs (schema-constrained generation) guarantee conformance to your specific schema, enforced during decoding. If code consumes the result, schema enforcement is the one you want."
  - q: "Do I still need validation with structured outputs?"
    a: "Yes — schema conformance isn't semantic correctness. The shape can be right while the values are wrong (a plausible-but-invented ID, a date outside your range). Validate semantics in code, and keep a retry path that feeds validation errors back to the model; libraries like Instructor package that loop."
---

**Structured output is getting typed, machine-consumable data from an LLM — the model's response constrained to match a schema you define, instead of prose your code has to parse and pray over.**

It's the feature that turns models into software components. Extraction, classification, routing, agent decisions — all of it wants `{"category": "billing", "priority": 2}`, not three paragraphs containing that information somewhere. Providers offer escalating guarantees: prompt-and-hope, **JSON mode** (valid JSON, arbitrary shape), and **schema-constrained generation** (decoding restricted so output *must* match your schema) — with [function calling](/glossary/function-calling) as the closely related mechanism where the "output" is a tool invocation.

The engineering around it: design schemas the model can fill well (described fields, enums over free strings — the [llm-output-schema-generator](/skills/api/llm-output-schema-generator) skill infers one from an example), validate semantics even when syntax is guaranteed, and wrap a validate-and-retry loop — the pattern libraries like [Instructor](/tools/instructor) and [BAML](/tools/baml) productize. Which guarantee to use when, per provider, is the [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026) decision guide.
