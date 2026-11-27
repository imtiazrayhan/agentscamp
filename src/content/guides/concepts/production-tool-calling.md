---
title: "Production Tool & Function Calling: Feed Errors Back as Observations"
description: "How agents use tools: the call, observe, retry loop, a weak vs strict tool schema, error results the model can act on, idempotency keys, and default caps."
author: "Imtiaz Rayhan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "tool-calling", "function-calling", "reliability", "concepts"]
featured: false
summary: "Tool calling is a loop: the model proposes a call, your code runs it, and the result, success or error, goes back as an observation. Reliability comes from the code around the loop: strict schemas, errors returned with a next step instead of swallowed, capped retries, idempotency keys on side effects, and approval gates on irreversible actions."
keyTakeaways:
  - "Tool calling is a loop: propose call, execute, return the result as an observation, repeat until done or a cap is hit."
  - "Return failures to the model. On the Claude API that is a tool_result with is_error: true and a message saying what went wrong and what to try next."
  - "Tool definitions are prompt surface: a 3-4 sentence description, enums, honest required fields and strict: true prevent most bad calls."
  - "Cap everything: steps per run, retries per call, seconds per tool, characters per result. An uncapped loop is an incident waiting for a trigger."
  - "Derive idempotency keys in your code from the run and the tool call, never from model output, so a retry cannot double-charge."
  - "Gate irreversible actions behind human approval enforced at the tool layer, not requested in the prompt."
howtoSteps:
  - name: "Define tools precisely"
    text: "Give each tool a model-facing description of what it does, when to use it and what it returns, typed arguments, honest required fields and enums. Turn on strict mode so arguments are guaranteed to match the schema."
  - name: "Let the model propose a call"
    text: "The model returns a structured tool call (name plus arguments) when it decides a tool is needed, and the response stops with a tool-use stop reason instead of final text."
  - name: "Validate, then execute"
    text: "Check business rules the schema cannot express (the invoice exists, the amount is within the refundable balance). For consequential actions, pass through a human-approval gate first. Run the tool under a timeout."
  - name: "Return the result as an observation"
    text: "Send the tool's output back, matched to the call's id, truncated to a size limit. Return every result for one assistant turn in a single message."
  - name: "Feed errors back too"
    text: "On failure, return an error result that names the problem and the next step ('invoice_id inv_9041 not found; call list_invoices to get valid ids'). Never swallow it or substitute an empty success."
  - name: "Retry within limits"
    text: "Retry transient failures (timeout, 429, 5xx) with backoff and a hard cap inside the tool wrapper. Do not retry bad requests or auth failures. Make side-effecting tools idempotent so a retry is safe."
  - name: "Loop to completion"
    text: "Repeat propose, execute, observe until the model answers or a step, token or time cap is hit. When a cap is hit, stop and report; do not silently return a partial result as success."
faq:
  - q: "How does function calling work in an LLM agent?"
    a: "You describe a set of tools with typed schemas. When the model decides a tool is needed, it returns a structured call (the tool name plus arguments) instead of plain text. Your code validates and executes that call, then returns the result to the model as an observation. The model reads it and either calls another tool or produces a final answer. The loop repeats until the task is done or a cap stops it."
  - q: "What should an agent do when a tool call fails?"
    a: "Return the error to the model as the tool result, flagged as an error, with enough detail to act on: what failed and what to try next. Anthropic's docs give the example 'Rate limit exceeded. Retry after 60 seconds.' in place of a generic 'failed'. The model can then fix the arguments, pick another tool or tell the user. A swallowed error makes the agent assume success and act on a result that does not exist."
  - q: "Why does my agent call the wrong tool or pass bad arguments?"
    a: "Usually the tool definitions are weak. Vague one-line descriptions, free-string arguments that should be enums, and required fields left optional all invite mistakes. Anthropic's guidance is at least 3-4 sentences per tool description. Strict mode removes type errors (a string '2' where an integer is expected) but cannot fix a model that picked the wrong tool because two descriptions overlap."
  - q: "Does strict mode make validation unnecessary?"
    a: "No. Strict mode guarantees the arguments match your JSON Schema: types, enums, required fields. It cannot know that invoice inv_9041 does not exist, that the refund exceeds the charge, or that this user may not touch that account. Keep business-rule validation and authorization in your tool code, and return failures as error results."
  - q: "Should tool calls run in parallel?"
    a: "Independent, read-only calls can run concurrently for lower latency. Run calls with side effects, shared state or ordering requirements sequentially. Current Claude models make parallel tool calls by default; you can turn that off with disable_parallel_tool_use: true inside tool_choice."
related: ["guide:agent-frameworks-2026", "agent:agent-tool-integration-engineer", "skill:tool-definition-generator", "agent:agent-reliability-reviewer", "guide:effective-tool-use"]
---

An agent is a language model in a loop with tools. The model cannot do anything in the world on its own; it can only emit text, including a structured request to call a tool. Search, a database query, a sent email, a refund: each happens because your code executed a tool call and handed the result back. Getting that loop right is most of what makes an agent reliable.

## The loop

1. You give the model a set of **tools** with schemas.
2. The model **proposes a call**: a tool name and arguments.
3. Your code **validates and executes** it.
4. You **return the result as an observation**.
5. The model reads the observation and either calls another tool or answers.

The model is the planner. Your tool layer is the hands, and the safety system.

## Schemas: a weak definition and a tightened one

Tool definitions are prompt surface. This is the kind of definition that produces bad calls:

```json
{
  "name": "refund",
  "description": "Refunds a payment.",
  "input_schema": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "amount": { "type": "string" },
      "reason": { "type": "string" }
    }
  }
}
```

Nothing says which id (customer, order, invoice?), whether `amount` is dollars or cents, which reasons are valid, or what is required. The tightened version, in the Claude API's tool format:

```json
{
  "name": "refund_invoice",
  "description": "Refund part or all of a paid invoice to the original payment method. Use only after the user has confirmed the amount. Fails if the invoice is unpaid or the amount exceeds the refundable balance; call get_invoice first to check both. Returns the refund id and the remaining refundable balance.",
  "strict": true,
  "input_schema": {
    "type": "object",
    "properties": {
      "invoice_id": {
        "type": "string",
        "description": "Invoice id as returned by get_invoice or list_invoices, e.g. inv_9041"
      },
      "amount_cents": {
        "type": "integer",
        "description": "Amount to refund in the invoice currency's minor unit, e.g. 1250 for 12.50"
      },
      "reason": {
        "type": "string",
        "enum": ["duplicate", "fraudulent", "requested_by_customer"]
      }
    },
    "required": ["invoice_id", "amount_cents", "reason"],
    "additionalProperties": false
  }
}
```

What changed, and why each change matters:

- **A name that says the object.** `refund_invoice` cannot be confused with a `refund_order` sitting next to it.
- **A description with when-to-use, failure conditions and return value.** Anthropic's tool docs call detailed descriptions "by far the most important factor in tool performance" and suggest at least 3-4 sentences per tool.
- **Units in the field name.** `amount_cents` as an integer removes the "12.50" vs "1250" ambiguity.
- **An enum for the closed set.** The model cannot invent a reason your payment provider rejects.
- **`strict: true` with `additionalProperties: false`.** On the Claude API this constrains sampling so tool inputs always match the schema. OpenAI's function calling has the same `strict` flag with the same `additionalProperties: false` requirement.

The [tool-definition-generator](/skills/api/tool-definition-generator) skill produces definitions in this shape; [Effective Tool Use](/guides/prompting/effective-tool-use) covers keeping the tool set small enough that tools are not confusable.

## Errors are observations, not exceptions

When a tool fails, return the failure to the model. Not a swallowed exception, not a crash, not an empty success. On the Claude API the exchange looks like this. The model proposes a call:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "refund_invoice",
      "input": { "invoice_id": "inv_9041", "amount_cents": 1250, "reason": "duplicate" }
    }
  ]
}
```

Your tool finds the refund is too large, and you send that back as a `tool_result` with `is_error`:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: amount_cents 1250 exceeds refundable balance 900 on inv_9041. Refund at most 900, or ask the user to confirm a partial refund.",
      "is_error": true
    }
  ]
}
```

An agent that receives this can ask the user about a partial refund. An agent that receives nothing assumes the refund worked and tells the customer so.

Three details from the API docs that bite in production:

- **Say what to try next.** Anthropic's example of a useful error is `"Rate limit exceeded. Retry after 60 seconds."`, not `"failed"`.
- **Results go first, and together.** In the user message that answers tool calls, `tool_result` blocks must come before any text (text first is a 400 error), and all results for one assistant turn go in a single message. Splitting them across messages also teaches the model to stop calling tools in parallel.
- **The model may retry on its own.** After an error result, Claude may call the tool again with new arguments, which is why the loop needs a cap.

OpenAI's Responses API uses a different shape for the same idea: you append an item of type `function_call_output` carrying the call's id and your output string, and an error is conveyed in that string.

> [!WARNING]
> Swallowing tool errors is the most common and most damaging agent bug. A failed payment the agent thinks succeeded, a missing record it invents around: both come from errors that never reached the model.

## Retries and idempotency

Two different retries exist, and they need different handling:

- **Transport retries** happen inside your tool wrapper, invisible to the model: a timeout, a 429, a 5xx. Retry with backoff, cap the attempts, then return an error result.
- **Model retries** happen when the model reads an error result and calls again. These count against the step cap.

Either kind can repeat a side effect unless the tool is idempotent. Derive the key in code from things that are stable for this logical call. Do not ask the model to supply it.

```python
import hashlib, json, time

RETRYABLE = {408, 429, 500, 502, 503, 504}

def idempotency_key(run_id: str, tool_use_id: str, args: dict) -> str:
    payload = json.dumps(args, sort_keys=True)
    return hashlib.sha256(f"{run_id}:{tool_use_id}:{payload}".encode()).hexdigest()

def call_with_retries(send, args: dict, key: str, attempts: int = 3) -> dict:
    """send(args, idempotency_key=...) returns an object with .status and .text"""
    for attempt in range(attempts):
        resp = send(args, idempotency_key=key)   # same key on every attempt
        if resp.status < 400:
            return {"content": resp.text, "is_error": False}
        if resp.status not in RETRYABLE:
            break                                 # 400/401/403/404: retrying will not help
        time.sleep(min(2 ** attempt, 8))          # 1s, 2s, 4s
    return {
        "content": f"Error: HTTP {resp.status} from payments API after {attempt + 1} attempt(s): {resp.text[:300]}",
        "is_error": True,
    }
```

Keying on the tool call id makes a transport retry safe. If the model issues a *new* call for the same refund, the id changes, so a duplicate-sensitive tool also needs a server-side pre-check (does a refund for this invoice and amount already exist?). [Idempotency Keys: Design APIs That Are Safe to Retry](/guides/api/idempotency-keys-api-design) covers the server half.

## Starting caps

These are starting points to tune against your own traces, not vendor limits:

| Control | Starting value | Why |
| --- | --- | --- |
| Steps per run (model turns) | 10-25 | Most tasks finish well under this; a run that hits it is usually looping |
| Transport retries per call | 2-3, exponential backoff | More rarely succeeds and multiplies latency |
| Identical failing call | Stop after 2 | Same tool, same arguments, same error means the model is stuck |
| Timeout per tool | 10-30 s; longer jobs return a job id to poll | A hung tool otherwise hangs the run |
| Tool result size | Truncate around 10,000 characters and say it was truncated | One large payload can crowd out the task |
| Run budget | A token or cost ceiling, plus wall-clock time | The backstop when the other caps miss |
| Tools exposed | Roughly 20 or fewer per agent (rule of thumb) | Similar tools get confused, and every definition is billed as input tokens |

When a cap trips, end the run with a clear status ("stopped: step limit reached after 25 turns, last error: ...") instead of returning whatever the model last said.

## Parallel calls

Current Claude models call multiple tools in one response by default. Run independent, read-only calls concurrently; run anything with side effects, shared state or an ordering requirement sequentially. If your tools are not safe to interleave, turn parallelism off at the API: on Claude, `"tool_choice": {"type": "auto", "disable_parallel_tool_use": true}` limits the model to one tool per response.

## Human gates

Payments, deletions, deploys and outbound messages need approval enforced in the tool layer: the tool refuses to run without an approval record, whatever the prompt says. The [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate) skill builds that gate, and [designing human-in-the-loop workflows](/guides/workflow/human-in-the-loop-ai-workflows) covers where gates belong.

## Where this goes wrong

- **Empty success on failure.** A wrapper catches an exception and returns `{}` or `"ok"`.
- **Stack traces as results.** A 4,000-token Python traceback is noise; return the one line that says what to change.
- **Schema-only validation.** The arguments are well-typed and still wrong. Check existence, ownership and limits in code.
- **Model-supplied idempotency keys.** The model will generate a fresh one on every retry.
- **Retrying non-retryable errors.** A 401 will be a 401 next time; it only burns budget.
- **No termination.** The loop has no step cap, and a tool that always errors runs until the bill arrives.

Most agent frameworks ([the comparison](/guides/concepts/agent-frameworks-2026)) implement the loop for you, but schema quality, error handling, idempotency and gates are still yours to get right. The [agent-tool-integration-engineer](/agents/data-ai/agent-tool-integration-engineer) builds this layer, and the [agent-reliability-reviewer](/agents/meta-orchestration/agent-reliability-reviewer) audits it before you ship.

## Continue exploring

- [Idempotency Keys: Design APIs That Are Safe to Retry](/guides/api/idempotency-keys-api-design) — Design idempotent API mutations with client keys, atomic claims, response replay, payload fingerprints, in-flight handling, TTLs, and downstream safety.
- [The AI Engineer Roadmap for 2026](/guides/getting-started/ai-engineer-roadmap-2026) — A staged path from API calls to production agents — the skills that matter in 2026, what to skip, and the guides and tools for each stage, in order.
