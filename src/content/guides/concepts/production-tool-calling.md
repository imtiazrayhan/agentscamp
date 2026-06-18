---
title: "Production Tool & Function Calling: Feed Errors Back as Observations"
description: "How agents use tools — the call/observe/retry loop, why errors must return to the model, and the schemas, idempotency, and limits that keep it reliable."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["ai-agents-systems"]
tags: ["agents", "tool-calling", "function-calling", "reliability", "concepts"]
featured: false
summary: "Tool calling is a loop: the model proposes a call, your code runs it, and the result — success OR error — goes back to the model as an observation it reasons about. The reliability comes from the engineering around that loop: schemas the model can't misuse, errors returned (never swallowed), bounded retries, idempotent side effects, and human gates on irreversible actions."
keyTakeaways:
  - "Tool calling is a loop: propose call → execute → return result as an observation → repeat until done."
  - "Feed errors back to the model as observations — a swallowed error makes the agent assume success and act wrongly."
  - "Tool definitions are prompt surface: precise schemas, enums, and descriptions prevent most bad calls."
  - "Bound retries, distinguish retryable from non-retryable failures, and make side-effecting tools idempotent."
  - "Gate irreversible actions behind human approval, enforced at the tool layer, not in the prompt."
howtoSteps:
  - name: "Define tools precisely"
    text: "Give each tool a model-facing description, typed arguments, honest required fields, and enums. A well-specified schema prevents most malformed calls (see tool-definition-generator)."
  - name: "Let the model propose a call"
    text: "The model returns a structured tool call (name + arguments) when it decides a tool is needed, rather than free text."
  - name: "Validate, then execute"
    text: "Validate the arguments against the schema before running. For consequential actions, pass through a human-approval gate first."
  - name: "Return the result as an observation"
    text: "Feed the tool's output back into the conversation as an observation the model reasons about on the next step."
  - name: "Feed errors back too"
    text: "On failure, return a clear, structured error (e.g. '404: invoice not found') as the observation so the agent can adapt — never swallow it or crash silently."
  - name: "Retry within limits"
    text: "Retry transient failures (timeout, rate limit) with backoff and a hard cap; don't retry non-retryable errors (bad request, auth). Make side-effecting tools idempotent so retries are safe."
  - name: "Loop to completion"
    text: "Repeat propose-execute-observe until the task is done or a step/budget cap is hit — always have a termination condition."
faq:
  - q: "How does function calling work in an LLM agent?"
    a: "You describe a set of tools (functions) with typed schemas. When the model decides a tool is needed, it returns a structured call — the tool name plus arguments — instead of plain text. Your code validates and executes that call, then returns the result back to the model as an observation. The model reads the observation and either calls another tool or produces a final answer. It's a loop of propose → execute → observe, repeated until the task is done."
  - q: "What should an agent do when a tool call fails?"
    a: "Return the error to the model as an observation — a clear, structured message like '404: invoice not found' or 'rate limited, retry later' — so the agent can reason about it and adapt (fix the arguments, try another tool, or report the problem). The worst thing you can do is swallow the error or crash: a silent failure makes the agent assume the call succeeded and act on a result that doesn't exist, producing a confidently wrong outcome."
  - q: "Why does my agent call the wrong tool or pass bad arguments?"
    a: "Almost always because the tool definitions are weak, not because the model is dumb. Vague descriptions, free-string arguments that should be enums, and required fields marked optional all invite mistakes. Tighten the schemas: write descriptions for the model (what it does and when to use it), constrain arguments with types and enums, and keep the tool set small so tools aren't confusable."
  - q: "How do I make tool calls safe in production?"
    a: "Validate arguments before executing; feed errors back as observations; bound retries and distinguish retryable from non-retryable failures; make side-effecting tools idempotent so a retry can't double-charge or duplicate; and gate irreversible actions (payments, deletes, deploys, sends) behind human approval enforced at the tool layer. Then add step/budget caps so the loop always terminates."
related: ["agent-frameworks-2026", "agent-tool-integration-engineer", "tool-definition-generator", "agent-reliability-reviewer", "effective-tool-use"]
---

An agent is a language model in a loop with tools. The model can't do anything in the world by itself — it can only emit text, including a structured request to call a tool. Everything an agent *does* — search, query a database, send an email, run code — happens because your code executed a tool call and handed the result back. Getting that loop right is most of what makes an agent reliable.

## The loop

Tool calling is a cycle, not a one-shot:

1. You give the model a set of **tools** with schemas.
2. The model **proposes a call** — a tool name and arguments — when it decides one is needed.
3. Your code **validates and executes** it.
4. You **return the result as an observation** to the model.
5. The model reads the observation and either calls another tool or answers.

Repeat until the task is done. The model is the planner; your tool layer is the hands — and the safety system.

## The one rule: errors are observations, not exceptions

The single most important — and most violated — principle: **when a tool fails, return the error to the model as an observation.** Not a swallowed exception, not a crash, not nothing. An agent that receives `"404: invoice not found"` can adapt: fix the ID, try another tool, or tell the user. An agent that receives *nothing* assumes the call worked and proceeds on a result that doesn't exist — the classic "silent failure, then confidently wrong action."

> [!WARNING]
> Swallowing tool errors is the most common and most damaging agent bug. A failed payment that the agent thinks succeeded, a missing record it hallucinates around — these come from errors that never made it back to the model.

## What makes it production-grade

The loop is simple; the reliability is in the engineering around it:

- **Schemas the model can't misuse.** Tool definitions are prompt surface — precise types, enums, honest required fields, and model-facing descriptions prevent most bad calls before they happen (the [tool-definition-generator](/skills/api/tool-definition-generator) skill builds these). See also [Effective Tool Use](/guides/prompting/effective-tool-use) on scoping the toolset.
- **Bounded retries.** Retry transient failures (timeouts, rate limits) with backoff and a hard cap; don't retry non-retryable ones (bad request, auth) — that just burns budget.
- **Idempotent side effects.** For tools that change state, use idempotency keys or pre-checks so a retry or re-run can't double-charge or duplicate.
- **Human gates on irreversible actions.** Payments, deletions, deploys, outbound messages — gate behind approval enforced at the tool layer, not requested in the prompt ([human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate)) — [designing human-in-the-loop workflows](/guides/workflow/human-in-the-loop-ai-workflows) covers where those gates belong.
- **Termination.** Always cap steps and budget so the loop can't run forever.
- **Safe parallelism.** Run independent calls concurrently for latency, but keep dependent or state-mutating calls ordered.

Most agent frameworks ([the comparison](/guides/concepts/agent-frameworks-2026)) implement the loop for you — but the schema quality, error handling, idempotency, and gates are still yours to get right. The [agent-tool-integration-engineer](/agents/data-ai/agent-tool-integration-engineer) builds this layer, and the [agent-reliability-reviewer](/agents/meta-orchestration/agent-reliability-reviewer) audits it before you ship.
