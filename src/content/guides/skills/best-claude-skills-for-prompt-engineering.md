---
title: "9 Best Claude Skills for Prompt Engineering"
description: "Compare Claude skills for prompt rewrites, regression harnesses, output schemas, tool definitions, prompt caching, PII redaction, and CLAUDE.md memory."
author: "Imtiaz Rayhan"
date: "2026-10-08"
color: "green"
topics: ["workflow-prompting", "llm-app-dev"]
audience: ["ai-engineers", "developers"]
tags: ["claude-skills", "prompt-engineering", "prompts", "structured-output", "tool-calling", "best-of"]
seoTitle: "9 Best Claude Skills for Prompt Engineering"
seoDescription: "The best Claude skills for prompt engineering: rewrite flaky prompts, build regression harnesses, generate output and tool schemas, and cut token cost."
summary: "Start with prompt-optimizer to diagnose and rewrite a prompt, then prompt-regression-tester to measure the edit. Add llm-output-schema-generator and tool-definition-generator when code or an agent consumes the output, prompt-cache-optimizer when input tokens dominate cost, prompt-pii-redactor at the API boundary, and agent-memory-designer for CLAUDE.md."
keyTakeaways:
  - "Diagnose the failure mode before rewriting: format drift, missing examples, no output contract, and weak reasoning each have a different fix, and prompt-optimizer applies one at a time."
  - "Freeze an eval set and a committed baseline before editing a production prompt; prompt-regression-tester turns 'it looks better' into a per-case regression list."
  - "When code or an agent consumes the output, move the contract out of prose and into a schema: llm-output-schema-generator for responses, tool-definition-generator for tool calls."
  - "Order prompts static first and variable last so the cacheable prefix stays identical across calls; prompt-cache-optimizer measures the hit rate rather than assuming the discount."
  - "Prompt engineering and context engineering are different jobs: the prompt-engineer agent fixes how instructions are written, the context-engineer agent fixes what is in the window."
faq:
  - q: "Is there a Claude skill for prompt engineering?"
    a: "Yes. prompt-optimizer diagnoses why a prompt underperforms and rewrites it with the one technique that fixes that failure mode, returning the rationale and what to measure. prompt-regression-tester then builds the harness that proves the edit helped, and llm-output-schema-generator and tool-definition-generator handle the schemas a prompt depends on."
  - q: "Which Claude skill should I use to test a prompt change?"
    a: "prompt-regression-tester. It freezes 15 to 40 inputs including every case that previously failed, attaches machine-checkable assertions, runs the baseline and the candidate in the same invocation, and reports a per-case list of regressions and fixes. Once a fuller suite exists, the run-evals command reports every metric against its threshold."
  - q: "Can Claude write a system prompt for me?"
    a: "For an existing prompt, prompt-optimizer returns an improved version with the reasoning for each change. For a new feature, the prompt-engineer agent builds the eval set first, then writes the instructions, examples, and tool schemas and scores every change against a baseline. Designing System Prompts covers the structure either one will follow."
  - q: "What is the difference between prompt-optimizer and the prompt-engineer agent?"
    a: "prompt-optimizer optimizes the one prompt in front of it and tells you what to measure; it does not own a regression suite. prompt-engineer owns the full lifecycle: eval set, baseline, instructions, few-shot examples, tool schemas, one-change-at-a-time iteration, cost trimming, and a CI gate."
  - q: "Do these skills only work with Claude models?"
    a: "No. prompt-regression-tester reads the model ID and generation parameters from your code and tests that exact configuration, whatever the provider. prompt-cache-optimizer checks how the target provider caches before restructuring the prompt, and the schema generators emit Pydantic, Zod, BAML, or JSON Schema for whichever structured-output library you use."
related: ["skill:prompt-optimizer", "skill:prompt-regression-tester", "skill:llm-output-schema-generator", "skill:tool-definition-generator", "skill:prompt-cache-optimizer", "skill:prompt-pii-redactor", "skill:agent-memory-designer", "command:run-evals", "command:red-team-llm", "agent:prompt-engineer", "agent:context-engineer", "guide:designing-system-prompts", "guide:prompt-patterns"]
---

The best Claude skills for prompt engineering treat a prompt as production code: diagnose before rewriting, measure before shipping, and move any contract that code depends on out of prose and into a schema. Most prompt failures that look like model weakness are structure problems, and most "improvements" shipped without an eval set are regressions nobody measured.

Seven are skills and two are slash commands, in the order a prompt usually moves through: a first rewrite, a regression harness, structured output, tool schemas, cost, privacy, and the project memory Claude Code reads on every turn. Each entry names the allowed tools, what it writes, and when to pick it over its neighbours.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [prompt-optimizer](/skills/workflow/prompt-optimizer) | A flaky or bloated prompt | Optimized prompt with rationale | Proposes; can edit the prompt file |
| [prompt-regression-tester](/skills/data/prompt-regression-tester) | A production prompt edit or model migration | evals/ harness and regression report | Yes |
| [llm-output-schema-generator](/skills/api/llm-output-schema-generator) | Output consumed by code | Pydantic, Zod, or JSON Schema plus wired call | Yes |
| [tool-definition-generator](/skills/api/tool-definition-generator) | An agent that misuses tools | Tool and function schemas | Yes |
| [prompt-cache-optimizer](/skills/performance/prompt-cache-optimizer) | Repeated large context | Reordered prompt and cache metrics | Yes |
| [prompt-pii-redactor](/skills/security/prompt-pii-redactor) | User or document data sent to a provider | Redaction layer and coverage check | Yes |
| [agent-memory-designer](/skills/workflow/agent-memory-designer) | A missing or bloated CLAUDE.md | CLAUDE.md draft with keep and cut rationale | Proposes the file |
| [run-evals](/commands/testing/run-evals) (command) | Gating a prompt change | Metric vs threshold table and verdict | No |
| [red-team-llm](/commands/review/red-team-llm) (command) | Hardening a system prompt | Findings ranked by blast radius | No |

## 1. prompt-optimizer: diagnose before you rewrite

[prompt-optimizer](/skills/workflow/prompt-optimizer) takes one underperforming prompt and returns a better one with the reasoning attached. It names the failure mode before changing anything (vague instructions, format drift, missing examples, no output contract, weak reasoning on multi-step cases, or token bloat) and applies the one technique that fixes it. Structure comes before wording: lead with the role and the single job, separate instructions from data with delimiters, state the output format, prefer positive instructions. Few-shot examples are added only when the failure is format or convention, and chain-of-thought only for multi-step tasks on a non-reasoning model.

Every run ends with the single change made, why, and the check that would confirm it: a handful of held-out cases, an exact-match or schema-valid rate. Tools are Read, Grep, Glob, Edit, and Write, with no Bash, so it edits text and runs nothing. It produces a candidate, not a verdict, which is why the next pick exists. Its audience includes sales and marketers as well as engineers; for product work that needs no code at all, see [9 Best Claude Skills for Product Managers](/guides/skills/best-claude-skills-for-product-managers). [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026) compares the techniques it chooses between.

## 2. prompt-regression-tester: make the edit provable

[prompt-regression-tester](/skills/data/prompt-regression-tester) turns "I tweaked the prompt" into evidence. It greps for the prompt text, model ID, and SDK call so the harness reproduces the exact production parameters, freezes 15 to 40 inputs in `evals/cases.jsonl` including every input that previously failed, and attaches the tightest machine-checkable assertion to each: `exact`, `contains`, `regex`, `json_schema`, or a structural check. A judge is used only for qualities code cannot decide, such as tone.

Baseline and candidate run in the same invocation, each case is classified as regression, fix, or unchanged, and the per-case regression list is the gate rather than the aggregate pass rate. The committed `evals/baseline.json` moves only through an explicit accept step. Tools are Read, Grep, Glob, Bash, and Write; a non-zero exit on any regression makes it a CI step. [8 Best Claude Skills for LLM Evals](/guides/skills/best-claude-skills-for-llm-evals) covers the fuller suite when a feature needs one.

## 3. llm-output-schema-generator: let the schema carry the instructions

When code consumes the output, [llm-output-schema-generator](/skills/api/llm-output-schema-generator) replaces "return JSON with these fields" with a validated schema inferred from real examples of the data you want back. It types fields precisely, marks optional fields honestly, uses enums for closed sets, writes model-facing descriptions with units and formats, adds bounds and patterns so invalid values cannot validate, and prefers a flat shape. It emits Pydantic, Zod, a `.baml` type, or JSON Schema to match [Instructor](/tools/instructor), [BAML](/tools/baml), or the [Vercel AI SDK](/tools/vercel-ai-sdk), wires the call with retry on validation failure, and tests it against the examples. Tools are Read, Grep, Glob, Edit, and Write. [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026) explains which mechanism to pair it with.

## 4. tool-definition-generator: fix the tool call at the definition

When an agent picks the wrong tool or passes malformed arguments, [tool-definition-generator](/skills/api/tool-definition-generator) fixes the definitions before blaming the model. It derives each schema from the real function signature, docstring, or OpenAPI spec and inspects call sites for actual usage. The name and description say what the tool does, when to use it, and when not to; every argument gets a precise JSON Schema type, honest `required` marking, and enums or bounds where the set is known, so an invalid call becomes structurally impossible. It emits the OpenAI or Anthropic tool format or the SDK's decorator. Tools are Read, Grep, Glob, Edit, and Write. It generates the interface only; error handling and an approval gate for consequential actions are separate work. [Effective Tool Use](/guides/prompting/effective-tool-use) covers how many tools an agent should have.

## 5. prompt-cache-optimizer: order the prompt for the cache

Providers cache the longest common prefix of a prompt, so one varying token near the top busts the cache for every call. [prompt-cache-optimizer](/skills/performance/prompt-cache-optimizer) first confirms how the target provider caches (automatic prefix caching or explicit breakpoints, minimum length, cache window), then reorders the prompt static first and dynamic last: system prompt, instructions, few-shot examples, tool definitions, and shared context at the top, per-request input at the end. It hunts for cache-busters in the preamble (a timestamp, a request ID, a per-user name, shuffled example order), sets breakpoints where supported, adds response or semantic caching at a gateway such as [Portkey](/tools/portkey) or [Helicone](/tools/helicone) with a TTL, and measures cached versus uncached tokens, cost, and time-to-first-token before and after. Tools are Read, Grep, Glob, Edit, Write, and Bash.

## 6. prompt-pii-redactor: redact before the prompt leaves

Every prompt sent to a hosted model leaves your environment, and every logged request may persist it. [prompt-pii-redactor](/skills/security/prompt-pii-redactor) puts a redaction layer at that boundary: it enumerates the categories that matter (direct identifiers, government and financial IDs, API keys), detects them with regex and validators plus NER for free-form PII ([LLM Guard](/tools/llm-guard) is one option), and chooses per category between irreversible masking and reversible tokenization, with the vault that restores originals kept server-side. It applies the same redaction to logs and traces, tests for misses and over-redaction, and states the residual risk. Tools are Read, Grep, Glob, Bash, Write, and Edit.

## 7. agent-memory-designer: write the prompt Claude Code reads every turn

`CLAUDE.md` is loaded into every prompt for the whole session, which makes it the highest-leverage prompt in a repository and the easiest to bloat. [agent-memory-designer](/skills/workflow/agent-memory-designer) reads the repo before writing a word: the build manifest for the real commands, the lint and test invocations CI runs, the directories that matter, and the gotchas you cannot infer from a glance. It sorts every fact into keep (stable conventions, exact commands, hard rules) or cut (transient state, secrets, anything derivable from the code), writes the result imperative and skimmable at around 50 lines, and places facts in the right tier: project, user, or local memory. Tools are Read, Grep, Glob, and Write; it proposes the file and runs no commands. An enforced rule is a hook, not memory. [Context Engineering](/guides/prompting/context-engineering) covers what belongs in the window at all.

## 8. run-evals: ship the prompt on numbers

[run-evals](/commands/testing/run-evals) closes the loop once a suite exists. It locates the project's [DeepEval](/tools/deepeval), [promptfoo](/tools/promptfoo), or RAGAS suite and frozen dataset, runs the full set, and reports metric, score, threshold, baseline, pass or fail, and delta, ending with a pass or block verdict that names the likely stage. It is read-only (Read, Grep, Glob, Bash) and will not modify the prompt, the dataset, or a threshold to go green.

## 9. red-team-llm: attack the system prompt before users do

A system prompt is also an attack surface. [red-team-llm](/commands/review/red-team-llm) maps every channel reaching the model (user input, retrieved content, tool outputs, the system prompt itself) and runs probes for direct and indirect injection, jailbreaks, system-prompt leakage, data exfiltration, and tool misuse, records each success with its blast radius, and re-runs the attack after the fix. It is read-only, requires authorization to test the target, and reports which categories it did not run.

## Agents: prompt-engineer and context-engineer

[prompt-engineer](/agents/data-ai/prompt-engineer) owns a prompt's lifecycle: it builds and freezes an eval set of 20 to 100 cases before touching the prompt, records a baseline, writes structured instructions, adds few-shot examples only where an eval slice demands them, shapes tool schemas, changes one thing at a time and re-runs the full set, trims cost last, and wires the eval into CI. It runs with Read, Grep, Glob, Edit, Write, and Bash and reports a diagnosis, the prompt and schemas, a before-and-after table, the token cost, and the regression threshold.

[context-engineer](/agents/meta-orchestration/context-engineer) decides what is in the window at all. It inventories every source entering context with real token counts, maps the symptom to a mechanism (a fact that fell out of the window, context rot, lost-in-the-middle, redundant tool output), classifies facts as stable, volatile, or retrievable, plans compaction before the window fills, and returns a budget table and an ordered change list. It is read-only (Read, Grep, Glob). The boundary: if the fix is "say it more clearly", it belongs to prompt-engineer; if the fix is "the model never had that fact", it belongs to context-engineer.

## Recommended prompt engineering stacks

For one LLM feature with a prompt that needs to be reliable, install the rewrite, the harness, the schema, and the gate:

```bash
npx agentscamp add skills/prompt-optimizer
npx agentscamp add skills/prompt-regression-tester
npx agentscamp add skills/llm-output-schema-generator
npx agentscamp add commands/run-evals
```

For an agent with tools, add the tool schemas, the cache and privacy layers, the red team, and both agents:

```bash
npx agentscamp add skills/tool-definition-generator
npx agentscamp add skills/prompt-cache-optimizer
npx agentscamp add skills/prompt-pii-redactor
npx agentscamp add commands/red-team-llm
npx agentscamp add agents/prompt-engineer
npx agentscamp add agents/context-engineer
```

For the Claude Code project itself, one skill covers the prompt you never see:

```bash
npx agentscamp add skills/agent-memory-designer
```

Whichever you run, ask Claude for the diagnosed failure mode, the single change it made, and the before-and-after numbers on the frozen set. When hand-tuning stops paying off, [Programmatic Prompt Optimization with DSPy](/guides/prompting/dspy-prompt-optimization) covers compiling prompts against a metric instead.

## Continue exploring

- [Designing System Prompts for LLM Apps and Agents](/guides/prompting/designing-system-prompts) — What belongs in a system prompt, how to order it, and how to version and test it.
- [Prompt Patterns for Coding Agents](/guides/prompting/prompt-patterns) — Reusable prompt structures for working with Claude Code and other coding agents.
- [The Best Claude Skills to Install in 2026](/guides/skills/best-claude-skills-2026) — A skills-only tour of the AgentsCamp library, organized by the job each skill does.
