---
name: "llm-output-schema-generator"
description: "Turn an example of the data you want from an LLM into a precise, validated output schema (Pydantic / Zod / JSON Schema) and wire it into structured-output calls. Use when adding typed LLM output, replacing brittle JSON parsing, or designing an extraction shape."
allowed-tools: "Read, Grep, Glob, Edit, Write"
user-invocable: true
version: "1.0.0"
color: "green"
date: 2026-06-03
topics: ["llm-app-dev"]
related: ["structured-output-2026", "instructor", "baml", "llm-integration-engineer", "tool-definition-generator"]
featured: false
summary: "Infers a strict output schema from a sample of the data you want an LLM to return — choosing types, enums, optionals, and descriptions — then wires it into a structured-output call (Instructor, BAML, or the AI SDK). It designs the target shape; it is not a test-fixture or API-doc generator."
---

The reliable way to get data (not prose) from an LLM is to give it a schema and validate against it. This skill builds that schema from a concrete example of what you want back, then wires it into a structured-output call — so the model returns typed, validated objects and your code stops parsing free-form JSON by hand.

This is distinct from generating **test fixtures** (that's a mock-data factory) and from documenting an **existing API** (that's an OpenAPI doc writer): here the output *is the schema the LLM must conform to*.

## When to use this skill

- Adding typed/structured output to an LLM feature (extraction, classification, form-filling).
- Replacing fragile `JSON.parse` + try/catch around model output with a validated schema.
- Designing the exact shape for an extraction or tool-output contract.

## Instructions

1. **Start from a real example.** Take a representative sample of the desired output (or a few). Infer fields and types from the data, not from a guess — and gather a couple of edge-case examples so optionality and unions are right.
2. **Type precisely.** Choose specific types (int vs. float, date vs. string), mark genuinely optional fields optional and required fields required, and use **enums** for closed sets rather than free strings.
3. **Add model-facing descriptions.** Field descriptions are prompt surface in structured-output libraries — say what each field means, with units and formats ("ISO 8601", "USD cents"). This improves the model's accuracy, not just documentation.
4. **Constrain to make bad output impossible.** Add bounds, patterns, and enums so invalid values can't validate. Prefer a flatter shape where it doesn't lose meaning — deeply nested schemas are harder for models to fill correctly.
5. **Emit in the target stack.** Generate the schema as Pydantic (Python), Zod (TypeScript), a `.baml` type, or JSON Schema — matching the structured-output tool in use ([Instructor](/tools/instructor), [BAML](/tools/baml), or the [Vercel AI SDK](/tools/vercel-ai-sdk)).
6. **Wire and validate.** Hook it into the structured-output call with retry-on-validation-failure, and test it against the original examples plus the edge cases.

> [!TIP]
> Let the schema carry the instructions. A well-named field with a clear description and an enum often replaces a paragraph of prompt — see [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).

## Output

A validated output schema in the target language, with typed/constrained fields and descriptions, wired into a structured-output call with retry — verified against the example outputs.
