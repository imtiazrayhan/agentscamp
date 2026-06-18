---
title: "Designing System Prompts for LLM Apps and Agents"
description: "How to write system prompts that hold up in production: what belongs there vs. the user turn, structure that survives long context, and format/refusal rules."
author: "AgentsCamp"
color: "green"
topics: ["workflow-prompting"]
tags: ["system-prompt", "prompting", "agents", "llm-app-dev", "output-format"]
related: ["prompt-patterns", "prompting-techniques-2026", "context-engineering", "structured-output-2026", "effective-tool-use"]
featured: false
date: 2026-06-17
summary: "The system prompt holds the durable contract: role, standing instructions, output format, constraints, and tool-use policy. Per-request facts belong in the user turn or retrieved context. Put the load-bearing rules first, say what to do (not just what to avoid), give the model an explicit out, and treat the prompt as a versioned, tested artifact."
keyTakeaways:
  - "The system prompt is the durable contract; per-request data goes in the user turn or retrieved context."
  - "Order matters: the most load-bearing instructions should be near the top, not buried mid-prompt where attention fades."
  - "Be specific and positive — 'always return ISO-8601 dates' beats 'don't use weird date formats.'"
  - "Always give the model an out: when to say 'I don't know,' refuse, or escalate to a human."
  - "Every token competes for attention; remove contradictions and bloat instead of adding caveats."
  - "Treat prompts as code: version them, diff them, and gate changes behind evals."
faq:
  - q: "What's the difference between the system prompt and the user message?"
    a: "The system prompt holds the durable contract that's true for every request — role, output format, constraints, tool policy. The user message holds the specific task and per-request data. A good test: if a value changes between requests (the question, the document, the customer ID), it belongs in the user turn or retrieved context, not the system prompt."
  - q: "Should I put few-shot examples in the system prompt?"
    a: "Yes, when the examples encode a durable format or style you want on every request — a canonical output shape, a tone, an edge case. Keep them short and varied; two or three small examples teach more than one long one. If the examples change per request, pass them in the user turn instead so they don't burn fixed context on every call."
  - q: "Why does my model ignore instructions in long conversations?"
    a: "Instructions placed once, mid-prompt, lose salience as the context fills with turns and retrieved text. Put load-bearing rules near the top of the system prompt, keep them concise, and for critical constraints repeat the single most important rule at the end of the prompt or re-assert it in the latest user turn."
  - q: "How do I stop a system prompt from contradicting itself?"
    a: "Bloat is the usual cause: rules accumulate over months and start to conflict ('be concise' next to 'explain your reasoning in detail'). Periodically read the whole prompt top to bottom, collapse overlapping rules, and resolve conflicts explicitly with priority ('prefer brevity; expand only when the user asks why'). Gate the rewrite behind your eval set."
howtoSteps:
  - name: "Decide what is durable vs. per-request"
    text: "List everything the model needs. Anything constant across requests (role, format, constraints, tool policy) goes in the system prompt; anything that changes per call (the task, documents, IDs) goes in the user turn or retrieved context."
  - name: "Draft sections in priority order"
    text: "Write the prompt as labeled sections — Role, Instructions, Output format, Constraints, Tools — with the most load-bearing rules near the top so they survive long contexts."
  - name: "Be specific and positive"
    text: "Replace vague adjectives and 'don't' rules with concrete, affirmative instructions: state the exact format, the allowed values, and what to do in each case."
  - name: "Specify output and uncertainty behavior"
    text: "Define the exact output shape (schema, JSON, or template) and tell the model what to do when it's unsure — say 'I don't know,' ask a clarifying question, refuse, or escalate."
  - name: "Add few-shot examples only where they earn their tokens"
    text: "Include two or three short, varied examples for formats or edge cases you can't describe crisply. Cut examples that just restate a rule you already gave in prose."
  - name: "Cut contradictions and bloat"
    text: "Read the whole prompt end to end. Merge overlapping rules, resolve conflicts with explicit priority, and delete anything that doesn't change the output."
  - name: "Version and test it"
    text: "Store the prompt as a tracked artifact with a version label, and run it against an eval set before shipping any change so you catch regressions."
keywords: ["system prompt design", "llm system prompt", "agent system prompt", "prompt engineering", "output format prompt", "prompt versioning"]
---

**The system prompt is the durable contract for an LLM call — role, standing instructions, output format, constraints, and tool-use policy — while anything that changes per request belongs in the user turn or retrieved context.** Get that split right, order the rules so the load-bearing ones survive long context, and treat the whole thing as a versioned, tested artifact. The rest of this guide is the specifics.

A [system prompt](/glossary/system-prompt) is not a place to dump everything you wish the model knew. It is the part of the input that stays constant across every request, so every token in it is paid for on every call and competes for the model's attention against the actual task. Design it like an interface, not a wishlist.

## What belongs in the system prompt (and what doesn't)

The system prompt holds what is true for every request:

- **Persona / role** — "You are a support agent for Acme's billing API." This sets defaults for tone, scope, and what the model assumes.
- **Durable instructions** — standing rules: house style, what's in scope, how to handle common cases.
- **Output format** — the schema, JSON shape, or template the response must follow.
- **Constraints** — hard limits: never reveal internal IDs, never invent prices, always cite a source.
- **Tool-use policy** — which tools exist, when to call them, when to stop.

What does *not* belong there: the user's actual question, the document to summarize, the customer's account ID, today's retrieved passages. Those change per request, so they go in the **user message** or in retrieved context. A simple test: if a value differs between two consecutive requests, it is not a system-prompt value. Putting per-request data in the system prompt wastes fixed budget and, worse, defeats [prompt caching](/glossary/prompt-caching) — the cached prefix changes every call, so you re-pay full price for the prompt each time.

## Structure: sections, and order that survives long context

Write the prompt in labeled sections — `## Role`, `## Instructions`, `## Output format`, `## Constraints`, `## Tools`. Headings aren't decoration; they give the model anchors and give *you* something to diff.

Order is load-bearing. Models attend unevenly across a long input, and the middle of a long context is where instructions quietly stop being followed (the [needle-in-a-haystack](/glossary/needle-in-a-haystack) problem applies to your own rules, not just retrieved data). Put the most important instructions near the top. For a single non-negotiable rule — "never fabricate a refund amount" — repeat it at the very end of the prompt too; recency helps as much as primacy.

## Be specific and positive

Vague adjectives are the most common failure. "Be professional," "keep it concise," "format nicely" don't constrain anything measurable. Replace them:

- Bad: "Don't use weird date formats."
- Good: "Return all dates as ISO-8601 (`YYYY-MM-DD`)."

State what *to do*, not just what to avoid. A list of prohibitions leaves the model guessing about the allowed path; an affirmative instruction names it. When you do need a prohibition, pair it with the alternative: "Do not guess prices; if the price isn't in the provided catalog, say you don't have it."

## Specify output format and uncertainty behavior

If the output feeds a script, CI, or the next prompt in a chain, demand a [structured output](/glossary/structured-output) and show the exact shape. Prefer your provider's native schema/JSON-mode enforcement over hoping the prose instruction holds — see [Structured output in 2026](/guides/concepts/structured-output-2026) for the trade-offs.

Equally important and usually missing: tell the model what to do when it doesn't know. Give it an explicit out. Without one, the model fills the gap — that's how you get confident [hallucination](/glossary/hallucination). Spell out the branches:

- If the answer isn't in the provided context, respond exactly: "I don't have that information."
- If the request is ambiguous, ask one clarifying question instead of guessing.
- If the request violates policy, refuse briefly and state the reason.

An explicit "say I don't know" instruction is one of the highest-leverage lines you can add.

## Few-shot examples: when they earn their tokens

Putting [few-shot](/glossary/few-shot-prompting) examples in the system prompt is right when they encode a *durable* format or edge case you can't describe crisply in prose — a canonical JSON response, a tricky tone, the way to handle an empty result. One good example often pins error handling, field names, and return shape better than a paragraph of rules.

Keep them short and varied: two or three small examples teach the boundary better than one long one. And don't include examples that merely restate a rule you already gave — that's bloat. If the examples need to change per request, pass them in the user turn instead, so they don't tax every call.

## Avoid contradiction and bloat

System prompts rot. Rules get bolted on after each incident until "be concise" sits three lines above "always explain your reasoning in detail." The model can't satisfy both, so it picks one unpredictably. Periodically read the prompt end to end and:

- Merge overlapping rules.
- Resolve conflicts with explicit priority: "Prefer brevity; expand only when asked why."
- Delete any line that doesn't change the output.

Every token competes for attention. A tight 400-token prompt usually beats a sprawling 2,000-token one — fewer places for the model to lose the thread. This is [context engineering](/guides/prompting/context-engineering) applied to your own instructions.

## Treat the prompt as a versioned, tested artifact

Prompts are code that happens to be English. Store them in the repo, not pasted into a dashboard. Label versions. When you change a rule, you want to know what else moved — so gate changes behind an eval set ([how to write LLM evals](/guides/evaluation/write-llm-evals)) rather than eyeballing a few cases. A prompt change that fixes one report and silently breaks five others is the default outcome without evals. The [prompt-optimizer](/skills/workflow/prompt-optimizer) skill helps tighten wording against examples once you have that harness.

## Agent system prompts

[Agent](/glossary/ai-agent) system prompts carry extra weight because the model acts in a loop, not once. Beyond role and format, define:

- **Tools** — what each does, its inputs, and *when* to use it. Vague tool descriptions cause both over-calling and skipped calls; see [effective tool use](/guides/prompting/effective-tool-use).
- **When to stop** — the single most under-specified rule. State the termination condition explicitly: "Stop when the test suite passes" or "Stop and ask the user before any destructive action." Without it, agents loop or quit early.
- **How to plan** — for multi-step work, instruct the model to outline a plan before acting and to re-verify after each tool call (gather ground truth, act, confirm) rather than assuming success.
- **Memory** — what to persist across steps and what to discard. The [agent-memory-designer](/skills/workflow/agent-memory-designer) skill is built for designing that layer.

For more on the wording-level techniques themselves, see [prompt patterns](/guides/prompting/prompt-patterns) and [prompting techniques for 2026](/guides/prompting/prompting-techniques-2026).

## Build a system prompt step by step

1. **Decide what is durable vs. per-request.** Constant values go in the system prompt; anything that changes per call goes in the user turn or retrieved context.
2. **Draft sections in priority order.** Labeled sections, load-bearing rules near the top.
3. **Be specific and positive.** Replace adjectives and "don't" rules with concrete, affirmative instructions.
4. **Specify output and uncertainty behavior.** Define the exact shape and the branches for "unsure," "ambiguous," and "out of policy."
5. **Add few-shot examples only where they earn their tokens.** Two or three short, varied examples for formats you can't describe crisply.
6. **Cut contradictions and bloat.** Read end to end; merge, prioritize, delete.
7. **Version and test it.** Track it as an artifact and run it against evals before shipping any change.