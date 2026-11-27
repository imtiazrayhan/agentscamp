---
name: "llm-output-schema-generator"
description: "Turn an example of the data you want from an LLM into a precise, validated output schema (Pydantic / Zod / JSON Schema) and wire it into structured-output calls. Use when adding typed LLM output, replacing brittle JSON parsing, or designing an extraction shape."
allowed-tools: "Read, Grep, Glob, Edit, Write"
user-invocable: true
version: "1.0.0"
color: "green"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["llm-app-dev"]
audience: ["developers"]
related: ["guide:structured-output-2026", "tool:instructor", "tool:baml", "agent:llm-integration-engineer", "skill:tool-definition-generator"]
featured: false
summary: "Infers a strict output schema from samples of the data you want an LLM to return, choosing types, enums, nullable fields, and model-facing descriptions, then wires it into a structured-output call (Instructor, BAML, or the AI SDK) with retry on validation failure. It designs the target shape; it is not a test-fixture or API-doc generator."
---

The reliable way to get data (not prose) from an LLM is to give it a schema and validate against it. This skill builds that schema from a concrete example of what you want back, then wires it into a structured-output call, so the model returns typed, validated objects and your code stops parsing free-form JSON by hand.

This is distinct from generating **test fixtures** (that's a mock-data factory) and from documenting an **existing API** (that's an OpenAPI doc writer): here the output *is the schema the LLM must conform to*. For the arguments a model passes *into* a tool, use [tool-definition-generator](/skills/api/tool-definition-generator).

## When to use this skill

- Adding typed/structured output to an LLM feature (extraction, classification, form-filling).
- Replacing fragile `JSON.parse` + try/catch around model output with a validated schema.
- Designing the exact shape for an extraction or tool-output contract.

## Instructions

1. **Start from real examples.** Ask for, or find in the repo, at least three samples of the desired output: a typical one, a sparse one where information is missing from the input, and an awkward one (multiple values, unusual formats). Infer fields from the data, not from a guess. If only one sample exists, list the assumptions you made about optionality and ask the user to confirm them.

2. **Type precisely.** Apply these rules field by field:

   | The sample shows | Use |
   |---|---|
   | A value from a closed set (`"open"`, `"paid"`) | an enum listing every allowed value |
   | Money | an integer in minor units plus a currency code, never a float |
   | A date or time | an ISO 8601 string (`YYYY-MM-DD` or full timestamp), stated in the description |
   | A value that may be absent from the source text | a nullable field, so the model can say "not present" instead of inventing one |
   | A list that may be empty | an array, never a comma-separated string |
   | Free text with a natural limit | a string with a maximum length |

3. **Add model-facing descriptions.** Field descriptions are prompt surface in structured-output libraries. Say what each field means, its unit and format, and what to do when the input does not contain it ("null if no due date is stated; do not infer one"). This improves accuracy, not only documentation.

4. **Constrain to make bad output impossible.** Add bounds, patterns, and enums so invalid values cannot validate, and put cross-field rules (total equals the sum of line items) in a validator that raises a clear message, because that message is what the model sees on retry. Prefer a flatter shape where it does not lose meaning; deeply nested schemas are harder for models to fill correctly. Put a short `reasoning` or `evidence` field *before* the fields it justifies if you want the model to work before it commits.

5. **Check provider limits before finishing.** Provider-native strict modes accept only a subset of JSON Schema. Common requirements are that every object sets `additionalProperties: false` and that every property is listed as required, with "may be absent" expressed as a nullable type. Numeric bounds, string patterns, and recursive schemas are the features most often unsupported or handled differently. Read the current limits for the provider in use, and keep the constraints the provider ignores as validation in your own code.

6. **Emit in the target stack.** Generate the schema as Pydantic (Python), Zod (TypeScript), a `.baml` type, or JSON Schema, matching the structured-output tool already in the project ([Instructor](/tools/instructor), [BAML](/tools/baml), or the [Vercel AI SDK](/tools/vercel-ai-sdk)). Do not add a second library when one is already installed.

7. **Wire and validate.** Hook the schema into the structured-output call with retry on validation failure, then run it against the original samples plus the sparse and awkward ones. Report per-sample pass or fail and fix the schema, not the sample, when a legitimate output is rejected.

> [!TIP]
> Let the schema carry the instructions. A well-named field with a clear description and an enum often replaces a paragraph of prompt. See [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).

## Worked example

Input the user wants parsed (fictional): `"Invoice INV-2041 from Acme Supplies, due 12 Dec 2026. 3 x toner at $40.00, shipping $12.50. Total $132.50."`

Desired output sample:

```json
{
  "invoice_number": "INV-2041",
  "vendor": "Acme Supplies",
  "due_date": "2026-12-12",
  "currency": "USD",
  "line_items": [
    { "description": "toner", "quantity": 3, "unit_price_cents": 4000 },
    { "description": "shipping", "quantity": 1, "unit_price_cents": 1250 }
  ],
  "total_cents": 13250
}
```

Pydantic, wired through Instructor:

```python
from typing import Literal
import instructor
from pydantic import BaseModel, Field, model_validator


class LineItem(BaseModel):
    description: str = Field(description="What was billed, as written on the invoice")
    quantity: int = Field(ge=1, description="Number of units; 1 for flat fees such as shipping")
    unit_price_cents: int = Field(ge=0, description="Price per unit in minor units, e.g. $40.00 -> 4000")


class Invoice(BaseModel):
    invoice_number: str = Field(description="Identifier exactly as printed, e.g. INV-2041")
    vendor: str = Field(description="Legal or trading name of the seller")
    due_date: str | None = Field(
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Payment due date as YYYY-MM-DD; null if none is stated. Do not infer one.",
    )
    currency: Literal["USD", "EUR", "GBP"] = Field(description="ISO 4217 code")
    line_items: list[LineItem] = Field(min_length=1)
    total_cents: int = Field(ge=0, description="Invoice total in minor units")

    @model_validator(mode="after")
    def total_matches_lines(self):
        computed = sum(i.quantity * i.unit_price_cents for i in self.line_items)
        if computed != self.total_cents:
            raise ValueError(f"total_cents is {self.total_cents} but line items sum to {computed}")
        return self


client = instructor.from_provider("<provider>/<model-id>")  # e.g. the model the app already uses
invoice = client.chat.completions.create(
    response_model=Invoice,
    messages=[{"role": "user", "content": invoice_text}],
    max_retries=2,  # re-asks with the validation error when the output fails
)
```

The same shape in Zod, wired through the AI SDK's `generateText` with `Output.object`:

```ts
import { generateText, Output } from 'ai';
import { z } from 'zod';

const Invoice = z.object({
  invoice_number: z.string().describe('Identifier exactly as printed, e.g. INV-2041'),
  vendor: z.string().describe('Legal or trading name of the seller'),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .describe('Payment due date as YYYY-MM-DD; null if none is stated. Do not infer one.'),
  currency: z.enum(['USD', 'EUR', 'GBP']).describe('ISO 4217 code'),
  line_items: z
    .array(
      z.object({
        description: z.string().describe('What was billed, as written on the invoice'),
        quantity: z.number().int().min(1),
        unit_price_cents: z.number().int().min(0).describe('Minor units, e.g. $40.00 -> 4000'),
      }),
    )
    .min(1),
  total_cents: z.number().int().min(0).describe('Invoice total in minor units'),
});

const { output } = await generateText({
  model, // the provider model instance the app already configures
  output: Output.object({ schema: Invoice }),
  prompt: `Extract the invoice.\n\n${invoiceText}`,
});
```

Design decisions this example makes, which you should state for every schema you generate: money is integer cents so totals can be checked exactly; `due_date` is nullable so a missing date is not hallucinated; `currency` is an enum so "dollars" cannot validate; the total check lives in a validator so the retry message tells the model what to fix.

## Output

Return:

1. The schema in the target language, with typed and constrained fields and a description on every field.
2. The structured-output call it is wired into, with retry on validation failure.
3. A decision list: one line per non-obvious choice (enum members, nullable fields, units, anything flattened).
4. A validation table: each sample input, pass or fail, and the error for any failure.
5. Constraints the provider's strict mode does not enforce and where they are enforced instead.
