---
title: "Structured Output vs JSON Mode vs Function Calling: Which to Use in 2026"
seoTitle: "Structured Output vs JSON Mode vs Function Calling (2026)"
description: "What JSON mode, function calling and native structured outputs each guarantee, the exact parameters on OpenAI, Claude, Gemini, Ollama and vLLM, with code."
author: "Imtiaz Rayhan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["llm-app-dev"]
audience: ["ai-engineers"]
tags: ["structured-output", "json-mode", "function-calling", "concepts"]
featured: true
summary: "For data your code consumes, use native structured outputs: a JSON Schema the provider enforces with constrained decoding. Use function calling when the model should take an action. JSON mode only guarantees valid JSON syntax, not your shape. Even with a schema, handle refusals and truncation and validate business rules yourself."
keyTakeaways:
  - "Prompt-and-parse ('return JSON') is the unreliable baseline: no structural guarantee, no validation."
  - "JSON mode guarantees valid JSON syntax, not that it matches your schema."
  - "Native structured outputs constrain decoding to a JSON Schema: OpenAI text.format or response_format, Claude output_config.format, Gemini response_format with a schema, Ollama format, vLLM response_format."
  - "Every provider supports only a subset of JSON Schema. Bounds like minimum, maxLength and uniqueItems are commonly dropped or ignored, so validate values in your own code."
  - "A schema does not prevent refusals or truncation. Check the stop reason before you parse."
  - "Function/tool calling is for when the model should do something. Libraries (Instructor, BAML, AI SDK) add typed schemas, validation and retries on top."
faq:
  - q: "What's the difference between JSON mode and structured outputs?"
    a: "JSON mode guarantees the model returns syntactically valid JSON, but fields can be missing, mistyped or extra. Structured outputs constrain generation to the JSON Schema you supply, so the output has the right fields, types and enums. OpenAI's docs call structured outputs 'the evolution of JSON mode' and recommend always using them instead when possible."
  - q: "Should I use function calling or structured outputs for extraction?"
    a: "Use structured outputs. OpenAI's own guidance draws the line this way: use function calling when you are connecting the model to tools, functions or data in your system, and a structured response format when you want to shape what the model returns to the user or your code. Forcing a single tool call to carry an extraction result still works, and some libraries do it for providers without native JSON output."
  - q: "Do I need a library like Instructor or can I use the provider's API directly?"
    a: "The provider SDKs now cover the basics themselves: OpenAI's responses.parse and Anthropic's messages.parse both take a Pydantic or Zod model and return a parsed object. Reach for Instructor, BAML or the AI SDK when you want one code path across providers, automatic retries that feed validation errors back to the model, or streaming of partial objects."
  - q: "Can structured outputs still return invalid data?"
    a: "Yes, in three ways. A refusal replaces the object (on Claude, stop_reason is 'refusal'; OpenAI exposes a refusal field). Truncation cuts the JSON off when the output token limit is hit (Claude stop_reason 'max_tokens'; OpenAI status 'incomplete'). And values can be schema-valid but wrong, such as a date in the wrong year. Check the stop reason first, then validate business rules."
  - q: "Why does asking the model to 'return JSON' in the prompt keep breaking?"
    a: "Because it is a request, not a guarantee. The model usually complies, then occasionally wraps the JSON in prose, uses the wrong type or omits a field, typically on inputs you did not test. Without a structural guarantee and validation those rare failures become production incidents."
related: ["guide:calling-any-model-gateways", "agent:llm-integration-engineer", "skill:llm-output-schema-generator", "tool:instructor", "tool:baml", "guide:production-tool-calling"]
---

When you need *data* from an LLM (extracted fields, a classification, a filled form), you want a typed object your code can rely on. There are four mechanisms, with different guarantees, and choosing the wrong one is why LLM features break on inputs nobody tested.

## The four approaches, weakest to strongest

### 1. Prompt-and-parse (avoid)

You add "respond with JSON" to the prompt and `JSON.parse` the result. It works in the demo. In production the model occasionally wraps the JSON in prose, mistypes a field or omits one. There is no structural guarantee and no validation.

### 2. JSON mode

The provider guarantees the output is **syntactically valid JSON**. That removes the "wrapped in prose" class of bugs but says nothing about your shape. On OpenAI this is `{"type": "json_object"}`; on Ollama it is `"format": "json"`.

### 3. Native structured outputs (the default for data)

You supply a **JSON Schema** and the provider constrains decoding to it, so the output is valid JSON that has your fields, types and enums. This is the mechanism to use for typed data.

### 4. Function / tool calling

The model returns a **call**: a function name plus arguments matching a schema. It is the right mechanism when the model should *do* something. With `strict: true` on the tool (OpenAI and Claude both use that flag), the arguments get the same schema guarantee as structured outputs. See [Production Tool & Function Calling](/guides/concepts/production-tool-calling) for the action case.

## Provider matrix

Checked against each provider's documentation in November 2026.

| | Structured output parameter | Schema limits to know |
| --- | --- | --- |
| **OpenAI** | Responses API: `text.format` with `type: "json_schema"`, `strict: true`. Chat Completions: `response_format` with `type: "json_schema"`. SDK helper: `responses.parse(text_format=Model)` | Root must be an object, not `anyOf`. All fields required (emulate optional with a `null` union). `additionalProperties: false` on every object. Up to 5,000 properties and 10 levels of nesting |
| **Claude API** | `output_config.format` with `type: "json_schema"`. SDK helper: `messages.parse(output_format=Model)` | No recursive schemas; no numeric bounds (`minimum`, `maximum`, `multipleOf`). `additionalProperties: false` required. Per request: 24 optional parameters, 16 union-typed parameters, 20 strict tools. Not compatible with citations or prefilling |
| **Gemini API** | `response_format` with `type: "text"`, `mime_type: "application/json"` and `schema` (Interactions API) | A subset of JSON Schema. `minLength`, `maxLength`, `uniqueItems`, `minProperties` and similar are accepted but not enforced. Schemas past the state-machine limits fail with `400 INVALID_ARGUMENT` |
| **[Ollama](/tools/ollama)** | `format` set to a JSON Schema object | Depends on the local model; validate the response |
| **[vLLM](/tools/vllm)** | OpenAI-compatible `response_format` with `type: "json_schema"`, or `extra_body={"structured_outputs": {...}}` for `json`, `regex`, `choice`, `grammar` | The old `guided_json`, `guided_regex` and `guided_choice` fields were removed in v0.12.0. Backends are xgrammar and guidance |

Two operational facts that apply to the hosted APIs:

- **First use of a schema is slower.** Claude compiles the schema into a grammar on first use and caches it for 24 hours from last use. OpenAI's docs also describe extra latency on the first request with a new schema.
- **Claude's old parameter moved.** `output_format` on the request became `output_config.format`, which needs no extra header. As of November 2026 the old top-level parameter is deprecated and returns a 400 unless you send the `structured-outputs-2025-11-13` beta header.

## One extraction, four ways

The task: pull a support ticket out of an email. The schema, as Pydantic:

```python
from typing import Literal
from pydantic import BaseModel

class Ticket(BaseModel):
    customer_email: str
    product: str
    severity: Literal["low", "medium", "high"]
    summary: str

EMAIL = "From dana@example.com: checkout on the Acme mobile app has thrown a 500 on every order since 9am. We are losing sales."
```

**Raw API (Claude).** You pass the JSON Schema yourself and parse the text block:

```python
import json
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": f"Extract the support ticket: {EMAIL}"}],
    output_config={
        "format": {
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "customer_email": {"type": "string"},
                    "product": {"type": "string"},
                    "severity": {"type": "string", "enum": ["low", "medium", "high"]},
                    "summary": {"type": "string"},
                },
                "required": ["customer_email", "product", "severity", "summary"],
                "additionalProperties": False,
            },
        }
    },
)

if response.stop_reason in ("refusal", "max_tokens"):
    raise RuntimeError(f"No usable object: {response.stop_reason}")

text = next(block.text for block in response.content if block.type == "text")
ticket = Ticket.model_validate(json.loads(text))
```

**Provider SDK helper (OpenAI).** The SDK builds the schema from the model and returns a parsed object:

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.parse(
    model="gpt-6.2-astra",
    input=[
        {"role": "system", "content": "Extract the support ticket."},
        {"role": "user", "content": EMAIL},
    ],
    text_format=Ticket,
)

ticket = response.output_parsed
```

Anthropic's SDK has the equivalent: `client.messages.parse(..., output_format=Ticket)` returns the object in `response.parsed_output`.

**[Instructor](/tools/instructor).** One interface across providers, with validation errors fed back to the model on retry:

```python
import instructor

client = instructor.from_provider("openai/gpt-6-luna")

ticket = client.create(
    response_model=Ticket,
    messages=[{"role": "user", "content": f"Extract the support ticket: {EMAIL}"}],
    max_retries=3,
)
```

**[Vercel AI SDK](/tools/vercel-ai-sdk).** In TypeScript, with Zod. The current docs put structured output on `generateText` through the `output` property (older tutorials use a separate `generateObject` call):

```ts
import { generateText, Output } from 'ai';
import { z } from 'zod';

const { output } = await generateText({
  model: 'anthropic/claude-sonnet-5.5',
  output: Output.object({
    schema: z.object({
      customer_email: z.string(),
      product: z.string(),
      severity: z.enum(['low', 'medium', 'high']),
      summary: z.string(),
    }),
  }),
  prompt: `Extract the support ticket: ${email}`,
});
```

If the response cannot be parsed or validated, `generateText` rejects with `AI_NoObjectGeneratedError`. `streamText` with the same `output` gives you a `partialOutputStream` of the object as it fills in.

Each version returns the same shape:

```json
{
  "customer_email": "dana@example.com",
  "product": "Acme mobile app",
  "severity": "high",
  "summary": "Checkout returns a 500 on every order since 9am."
}
```

## What a schema does not protect you from

- **Refusals.** On Claude the response has `stop_reason: "refusal"`, a 200 status, and content that may not match your schema. OpenAI exposes a `refusal` you can detect in code.
- **Truncation.** Hit the output token limit and the JSON stops mid-object. Claude reports `stop_reason: "max_tokens"`; OpenAI's Responses API reports `status == "incomplete"` with `incomplete_details.reason == "max_output_tokens"`. Raise the limit and retry.
- **Dropped constraints.** `minimum: 0` or `maxLength: 80` in your Pydantic or Zod model may never reach the model as a hard constraint. Anthropic's SDK helpers strip unsupported bounds from the wire schema, append them to the field description, and validate the response client-side. Gemini accepts several of these keywords and ignores them. Keep a validation step.
- **Schema-valid nonsense.** `severity: "low"` for an outage is valid. Constrained decoding guarantees form, not judgment; that needs evals.
- **Reasoning fields.** A `reasoning` or `chain_of_thought` property invites long output and, on Claude, can trigger a `reasoning_extraction` refusal. Ask for a short `explanation` if you need one.
- **Streaming.** With the raw APIs, accumulate the full response before deserializing. Partial-object streaming is a library feature.

## Where the libraries fit

[Instructor](/tools/instructor), [BAML](/tools/baml) and the [Vercel AI SDK](/tools/vercel-ai-sdk) sit on top of the provider mechanisms:

- **Schema from your types**: Pydantic, Zod or BAML's own DSL instead of hand-written JSON Schema.
- **Validation plus retry**: when output fails validation, re-ask with the errors (Instructor's `max_retries`).
- **Streaming partials** and **one code path across providers**.

Design the schema itself with the [llm-output-schema-generator](/skills/api/llm-output-schema-generator) skill.

## How to choose

| Situation | Use |
| --- | --- |
| One provider, typed data, Python or TypeScript | The provider SDK's `parse` helper |
| Several providers, or you want validation-error retries | Instructor (Python) or the AI SDK (TypeScript) |
| Schema comes from a file, an OpenAPI spec or runtime code | The raw schema parameter from the matrix above |
| The model should take an action | Function/tool calling with `strict: true` |
| Self-hosted open-weight model | Ollama `format` or vLLM `response_format`, plus your own validation |
| You need regex, a fixed choice list or a grammar, not JSON | vLLM `structured_outputs` (`regex`, `choice`, `grammar`) |
| You need citations alongside the data on Claude | Not JSON outputs (the API returns a 400 with citations enabled); extract in a second call |

> [!TIP]
> Keep schemas tight and flat: clear field names, descriptions, enums for closed sets, and as few optional fields as you can manage. On Claude, optional and union-typed parameters are counted against per-request limits (24 and 16) because they make the grammar expensive to compile.

For wiring this into a real app with streaming, fallback and cost control, see the [llm-integration-engineer](/agents/data-ai/llm-integration-engineer) and the model-access layer in [Calling Any Model](/guides/concepts/calling-any-model-gateways).
