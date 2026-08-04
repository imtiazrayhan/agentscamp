---
name: "tool-definition-generator"
description: "Generate clean function/tool schemas for an LLM agent from existing code or a spec — accurate JSON Schema, model-facing descriptions, honest required fields, and enums that make invalid calls impossible. Use when wiring functions into an agent's tool-calling loop."
allowed-tools: "Read, Grep, Glob, Edit, Write"
user-invocable: true
version: "1.0.0"
color: "green"
date: 2026-06-03
topics: ["ai-agents-systems"]
related: ["guide:production-tool-calling", "agent:agent-tool-integration-engineer", "skill:openapi-doc-writer", "guide:agent-frameworks-2026"]
featured: false
summary: "Most bad tool calls come from bad tool definitions, not a weak model. This skill turns a function or API spec into a clean tool/function schema written for the model: precise types, honest required fields, enums that constrain choices, and descriptions that say when and how to call it — so invalid calls become structurally impossible."
---

When an agent calls the wrong tool or passes garbage arguments, the instinct is to blame the model. Far more often, the **tool definition** is the problem: a vague description, an enum left as a free-string, a required field marked optional. This skill generates tool/function schemas that are written *for the model*, so correct calls are easy and invalid ones are impossible.

## When to use this skill

- Wiring existing functions or API endpoints into an agent's tool-calling loop.
- An agent picks the wrong tool, omits required arguments, or passes malformed values.
- Standardizing tool schemas across an agent codebase.

## Instructions

1. **Read the source of truth.** Derive the schema from the actual function signature, types, and docstring (or an OpenAPI spec) — never hand-wave argument names. Inspect call sites to learn real usage.
2. **Name and describe for the model, not the compiler.** The tool name and description are prompt surface: state plainly *what it does and when to use it* (and when not to). Ambiguous descriptions cause more bad calls than a weak system prompt.
3. **Type every argument precisely.** Use JSON Schema types, mark fields **`required` honestly** (don't mark everything optional to be safe — that invites omissions), and add per-argument descriptions with units and formats ("ISO 8601 date", "USD cents").
4. **Constrain with enums and bounds.** Replace free-strings with `enum` where the set is known, add min/max and patterns where they apply. A constrained schema makes an invalid call structurally impossible rather than merely discouraged.
5. **Keep the surface tight.** Fewer, well-scoped tools beat many overlapping ones. If two tools are easily confused, disambiguate their descriptions or merge them.
6. **Emit in the target format.** Produce the schema in the shape the framework expects (OpenAI/Anthropic tool format, or the agent SDK's decorator), and verify it validates.

> [!TIP]
> The description is doing prompt engineering. "Refund a charge. Use only after confirming the charge exists and the amount; do not use for subscription cancellations." prevents more misfires than any amount of system-prompt nagging.

> [!NOTE]
> This generates the *interface* the model calls. The runtime still needs error handling and (for consequential actions) a [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate) — a good schema reduces bad calls but doesn't replace guardrails.

## Output

Validated tool/function schemas in the target format: precise types, honest required fields, model-facing descriptions, and enums/bounds that constrain inputs — ready to drop into the agent's tool list.
