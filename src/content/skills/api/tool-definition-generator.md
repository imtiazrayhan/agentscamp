---
name: "tool-definition-generator"
description: "Generate clean function/tool schemas for an LLM agent from existing code or a spec — accurate JSON Schema, model-facing descriptions, honest required fields, and enums that make invalid calls impossible. Use when wiring functions into an agent's tool-calling loop."
allowed-tools: "Read, Grep, Glob, Edit, Write"
user-invocable: true
version: "1.0.0"
color: "green"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["ai-agents-systems"]
audience: ["developers"]
related: ["guide:production-tool-calling", "agent:agent-tool-integration-engineer", "skill:openapi-doc-writer", "guide:agent-frameworks-2026", "skill:llm-output-schema-generator"]
featured: false
summary: "Most bad tool calls come from bad tool definitions, not a weak model. This skill turns a function or API operation into a tool schema written for the model: precise types, honest required fields, enums and bounds, and a description that says when to call it and when not to, plus test requests that check the model picks it correctly."
---

When an agent calls the wrong tool or passes garbage arguments, the instinct is to blame the model. Far more often, the **tool definition** is the problem: a vague description, an enum left as a free string, a required field marked optional. This skill generates tool/function schemas that are written *for the model*, so correct calls are easy and invalid ones are impossible.

It defines the arguments a model passes *into* a function. For the shape of data a model returns as its final answer, use [llm-output-schema-generator](/skills/api/llm-output-schema-generator).

## When to use this skill

- Wiring existing functions or API endpoints into an agent's tool-calling loop.
- An agent picks the wrong tool, omits required arguments, or passes malformed values.
- Standardizing tool schemas across an agent codebase.

## Instructions

1. **Read the source of truth.** Derive the schema from the actual function signature, types, and docstring (or an OpenAPI operation). Then `Grep` for call sites to learn which arguments real callers pass, which defaults they rely on, and which combinations never occur. Never invent an argument name.

2. **Decide what the model should not control.** Remove from the schema anything the runtime must supply: user or tenant IDs, auth tokens, idempotency keys, internal flags. Inject those in the tool executor. An argument the model can set is an argument a prompt injection can set.

3. **Name and describe for the model, not the compiler.** Use a `verb_noun` name that is unambiguous next to the other tools. Write a description of three or four sentences that covers: what the tool does, when to use it, when *not* to use it and which tool to use instead, and what it returns, including what an empty result or an error looks like.

4. **Type every argument precisely.** Use JSON Schema types and give each argument a description with units, format, and one example ("ISO 8601 date, e.g. 2026-11-28", "amount in USD cents"). Mark fields **`required` honestly**: required when the function cannot run without it, optional only when a real default exists, and say what the default is.

5. **Constrain with enums and bounds.** Replace free strings with `enum` where the set is known, add `minimum`, `maximum`, and `pattern` where they apply, and set `additionalProperties: false` so invented arguments are rejected. A constrained schema makes an invalid call structurally impossible instead of merely discouraged.

6. **Keep the surface tight.** Fewer, well-scoped tools beat many overlapping ones. If two tools are easily confused, name the other tool in each description or merge them. If one tool has a `mode` argument that switches between unrelated behaviors, split it.

7. **Emit in the target format.** The schema body is the same everywhere; the envelope differs. Anthropic's Messages API takes `name`, `description`, and `input_schema`. OpenAI's Responses API takes `type: "function"`, `name`, `description`, and `parameters`. Agent SDKs usually derive both from a decorated function or a Zod or Pydantic model, in which case edit the source types and docstrings and let the SDK generate. Both providers accept `strict: true` on a tool to guarantee arguments match the schema, and strict modes support a subset of JSON Schema, so check the provider's current limitations before relying on bounds or patterns there.

8. **Verify.** Validate the schema with a JSON Schema validator. Then write three or four realistic user requests per tool, including one that should *not* trigger it, and check that the arguments the model produces validate and match what a careful human would pass.

> [!TIP]
> The description is doing prompt engineering. "Refund a charge. Use only after confirming the charge exists and the amount; do not use for subscription cancellations." prevents more misfires than any amount of system-prompt nagging.

> [!NOTE]
> This generates the *interface* the model calls. The runtime still needs error handling and (for consequential actions) a [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate). A good schema reduces bad calls but doesn't replace guardrails.

## Worked example

Source function (fictional):

```python
def refund_charge(charge_id: str, amount_cents: int | None = None, reason: str = "requested_by_customer") -> Refund:
    """Refund a charge fully or partially. Raises ChargeNotFound, AlreadyRefunded."""
```

A weak definition that mirrors the signature and nothing else:

```json
{
  "name": "refund",
  "description": "Refunds a charge.",
  "input_schema": {
    "type": "object",
    "properties": {
      "charge_id": { "type": "string" },
      "amount_cents": { "type": "number" },
      "reason": { "type": "string" }
    }
  }
}
```

Nothing is required, `reason` accepts any string, the amount can be negative or fractional, and the model cannot tell this tool from a subscription-cancel tool.

The generated definition, in Anthropic's tool format:

```json
{
  "name": "refund_charge",
  "description": "Refund a single card charge, fully or partially, back to the original payment method. Use only after you have looked up the charge with get_charge and the user has confirmed the amount. Do not use to cancel a subscription (use cancel_subscription) or to refund a charge that get_charge reports as already refunded. Returns the refund ID and status; returns an error with code charge_not_found or already_refunded if the refund cannot be made.",
  "input_schema": {
    "type": "object",
    "properties": {
      "charge_id": {
        "type": "string",
        "pattern": "^ch_[A-Za-z0-9]+$",
        "description": "ID of the charge to refund, exactly as returned by get_charge, e.g. ch_3Abc123"
      },
      "amount_cents": {
        "type": "integer",
        "minimum": 1,
        "description": "Amount to refund in the charge's currency, in minor units (USD $12.50 -> 1250). Omit to refund the full remaining amount."
      },
      "reason": {
        "type": "string",
        "enum": ["requested_by_customer", "duplicate", "fraudulent"],
        "description": "Why the refund is being issued. Defaults to requested_by_customer when omitted."
      }
    },
    "required": ["charge_id"],
    "additionalProperties": false
  }
}
```

For OpenAI's Responses API the same definition becomes `{"type": "function", "name": "refund_charge", "description": "...", "parameters": { ...the same schema... }}`.

Test requests for the verification step: "refund order 1042's charge in full" (expect a `get_charge` call first, then `refund_charge` with no `amount_cents`); "give them $5 back on ch_3Abc123" (expect `amount_cents: 500`); "cancel my plan and refund me" (expect `cancel_subscription`, not this tool, as the first call).

## Output

For each tool, return:

1. The definition in the target format, with a description on the tool and on every argument.
2. A short change list against the previous definition or the raw signature: what became required, which strings became enums, which arguments were removed from the model's control.
3. The test requests with expected tool and arguments, and the result of running them if a model was available.
4. Open questions where the source did not settle a type, a default, or an allowed value.
