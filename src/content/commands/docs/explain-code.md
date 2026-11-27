---
description: "Explain what the given code does, in clear prose with a short summary."
seoDescription: "/explain-code explains what the given code does in clear prose — a Claude Code slash command that leads with a short summary, then covers the tricky parts."
date: 2026-06-03
argument-hint: "[file or symbol]"
allowed-tools: "Read, Grep, Glob"
updated: 2026-11-27
reviewed: 2026-11-27
title: "Explain Code"
color: "purple"
topics: ["workflow-prompting"]
audience: ["developers"]
related: ["agent:documentation-engineer", "skill:architecture-diagram-generator", "skill:onboarding-guide-writer", "command:trace-data-flow", "guide:skills-vs-agents-vs-commands"]
summary: "Explains what a file, function, class, or line range does, read-only. It reads the actual source and its callers, traces purpose, inputs, outputs, control flow, and dependencies, then returns a short summary, an execution-order walkthrough, an inputs and outputs table, and the edge cases, with file and line references."
---

Explain the code identified by `$ARGUMENTS`. The argument may be a file path, a function or class name, a module, or a line range. Produce an explanation that a teammate could read once and understand without opening the source themselves.

If `$ARGUMENTS` is empty, ask which file or symbol to explain.

## When to use

- You are about to change, review, or debug code you did not write and need an accurate picture of one file, function, or class first.
- Not for following one value across many modules: use [/trace-data-flow](/commands/analyze/trace-data-flow). Not for writing the explanation into the source as comments: use [/add-docstrings](/commands/docs/add-docstrings).

This command is read-only. It uses Read, Grep, and Glob, and does not run the code, so describe runtime behavior as what the source says will happen, not as something you observed.

## Locate the target

Resolve `$ARGUMENTS` before explaining anything.

- If it is a path (e.g. `src/auth/session.ts`), read that file.
- If it is a symbol (e.g. `validateToken` or `class UserStore`), search the codebase to find its definition, then read the surrounding context.
- If it is a path with a range (e.g. `parser.go:40-120`), read those lines plus enough above and below to understand the scope.
- If it is ambiguous or matches multiple results, list the candidates and ask which one is meant. Do not guess.
- For a symbol, also Grep for its call sites and read one or two. How code is called often explains why it is written the way it is.
- For a whole file over a few hundred lines, explain its structure and main entry points first, then offer to go deeper on a named part instead of narrating every function.

> [!NOTE]
> Read the actual source before writing a single word of explanation. Never describe code from the name alone.

## Understand before you write

Trace the behavior, not just the syntax. Before drafting, work out:

- The **purpose**: what problem this code solves and who calls it.
- The **inputs**: parameters, arguments, environment, or global state it reads.
- The **outputs**: return values, mutations, writes, network calls, or thrown errors.
- The **control flow**: branches, loops, early returns, and the happy path versus edge cases.
- The **dependencies**: other functions, modules, or services it relies on.
- Any **non-obvious details**: concurrency, caching, side effects, or subtle correctness concerns.

## Output format

Structure the response with these sections.

### Summary

Two or three sentences in plain language stating what the code does and why it exists. A reader should be able to stop here and have the gist.

### How it works

Walk through the logic in execution order. Use prose for the narrative and a short list for distinct steps. Quote only the small, load-bearing fragments that matter — do not paste the whole file back. Anchor each step to its location as `path:line` so the reader can jump to it.

```text
1. Receives <input> and validates <condition>.
2. Transforms it via <step>.
3. Returns <output> or raises <error> when <edge case>.
```

### Inputs and outputs

Be precise about types and contracts.

| Aspect | Detail |
| --- | --- |
| Inputs | parameters, types, expected shape |
| Returns | return type and meaning |
| Side effects | I/O, mutations, network, logging |
| Errors | what is thrown or returned on failure |

### Edge cases and gotchas

Call out anything surprising: silent failure modes, off-by-one risks, assumptions about input, thread safety, or behavior that contradicts the function name.

## Guidelines

- Match the explanation's depth to the code's complexity. A three-line helper needs a sentence; a state machine needs the full breakdown.
- Use the project's own terminology — variable and domain names as they appear in the source.
- Prefer correctness over completeness. If you are unsure how something behaves, say so explicitly rather than inventing an explanation.
- When behavior depends on code you did not open (a library call, a config value, a remote service), name it as an assumption instead of describing it as fact.

> [!WARNING]
> Do not modify the code. This command only explains. If you spot a bug while reading, mention it in the gotchas section but make no edits.
