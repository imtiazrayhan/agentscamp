---
title: "Prompt Patterns for Coding Agents"
description: "Practical prompting patterns: chaining, few-shot, context management, tool use, and output structuring."
author: "AgentsCamp"
date: 2026-05-20
color: "green"
topics: ["workflow-prompting"]
featured: true
related: ["guide:prompting-techniques-2026", "guide:context-engineering", "guide:effective-tool-use", "command:breakdown-task"]
summary: "Five patterns make coding agents reliable: chain big asks into verifiable steps, pin conventions with few-shot examples instead of adjectives, manage context (point precisely, persist durable facts in CLAUDE.md, offload noise to subagents), verify-act-reverify with tools, and demand structured output. They compose — and each fixes a specific failure mode."
keyTakeaways:
  - "Chaining surfaces intermediate decisions where they're cheap to correct — a mega-prompt buries them inside one response."
  - "Few-shot beats adjectives: one canonical example pins error handling, validation, and return shape without enumerating them; two or three short varied examples beat one long one."
  - "Context management is deciding what the agent should NOT see — point at exact files and symbols, and let subagents absorb the noisy investigations."
  - "The tool-use pattern that pays is verify → act → re-verify: gather ground truth before changing anything, confirm after instead of assuming."
  - "Structured output (a demanded JSON shape, a diff, a table) is what makes results consumable by scripts, CI, and the next prompt in the chain."
faq:
  - q: "What is prompt chaining for coding agents?"
    a: "Breaking one ambitious request into a sequence of smaller, verifiable steps where each step's output feeds the next — read the module, then design the schema, then implement against it. Each step is independently checkable, so a wrong assumption gets fixed before any code depends on it. Encode recurring chains as slash commands so you never retype them."
  - q: "When should I use few-shot examples in a prompt?"
    a: "Whenever the output should match a convention that's easier to show than describe — API handlers, tests, migrations in house style. Paste one canonical example and ask for the next instance; format, validation, and error handling carry over automatically. Use two or three short, varied examples to teach the pattern's boundaries."
  - q: "How do I stop an agent's context from filling with noise?"
    a: "Three habits: reference exact files and symbols instead of letting it grep the repo; persist durable conventions in CLAUDE.md instead of re-explaining them; and delegate heavy investigations to subagents, which do the noisy reading in their own window and return only a summary."
  - q: "What is the verify-then-act pattern?"
    a: "Ask the agent to gather ground truth before changing anything (run the typecheck, paste the current errors), make the change, then re-verify afterward (run it again, confirm the errors are gone and no new ones appeared). It forces the agent to work against observed reality instead of its prediction of the codebase — where most silent failures originate."
---

Coding agents like Claude Code do their best work when the request is shaped, not just asked. A prompt is an interface: the clearer the contract, the more reliable the output. This guide consolidates five patterns that consistently improve results when you're driving an agent through real engineering work. Each pattern includes a concrete coding example you can adapt.

## Prompt Chaining

Chaining breaks one ambitious request into a sequence of smaller, verifiable steps, where each step's output becomes the next step's input. Instead of asking for "add auth to the app" in a single shot, you decompose it so the agent can confirm assumptions before writing code that depends on them.

The mechanism matters: a single mega-prompt forces the model to guess at intermediate decisions and bury them in one response. A chain surfaces those decisions where you can correct them cheaply.

```text
Step 1: Read src/lib/db.ts and list every exported function and its signature.
Step 2: Using that list, design a UserSession table migration. Show only the SQL.
Step 3: Implement getSession() and createSession() against the schema from Step 2.
```

Each step is independently checkable. If Step 2 invents a column that doesn't fit your conventions, you fix it before any implementation code exists.

> [!TIP]
> Encode a reusable chain as a slash command. Files in `.claude/commands/` are plain Markdown prompts; a `.claude/commands/add-feature.md` file becomes `/add-feature` and can lay out the read → design → implement → test sequence once so you never retype it.

## Few-Shot Examples

Few-shot prompting shows the agent the shape of the answer instead of describing it. For coding tasks this is far more precise than adjectives like "idiomatic" or "consistent" — you demonstrate the convention and the model matches it.

This is especially effective for repetitive, structured code: API handlers, test cases, reducers, or migrations that should all follow one house style.

```typescript
// Follow this exact pattern for every new route handler:
//
// export async function POST(req: Request) {
//   const body = createUserSchema.parse(await req.json());
//   const user = await db.users.create(body);
//   return Response.json(user, { status: 201 });
// }
//
// Now write the POST handler for /api/teams using createTeamSchema.
```

By pinning one canonical example, you eliminate drift: error handling, validation, and return-shape all carry over without you having to enumerate them.

> [!NOTE]
> Two or three short examples usually beat one long one. Variety in the examples teaches the boundaries of the pattern, while a single example can be over-fit to its specific details.

## Context Management

Agents reason over a finite context window. Quality degrades when that window fills with irrelevant files, stale output, or a sprawling transcript. Managing context is mostly about deciding what the agent should *not* see.

Practical tactics:

- **Point precisely.** Reference exact files and symbols (`src/auth/session.ts`, `validateToken()`) rather than asking the agent to grep the whole repo.
- **Persist durable facts.** Put project-wide conventions in `CLAUDE.md` so they load every session instead of being re-explained.
- **Offload heavy investigations to subagents.** A subagent runs in its own context window and returns only a summary, keeping your main thread lean.

A Claude Code subagent is just a Markdown file in `.claude/agents/` with frontmatter plus a system-prompt body:

```markdown
---
name: test-runner
description: Runs the test suite and summarizes failures with root causes.
model: sonnet
color: green
---

You run the project's tests, read failing output, and report each
failure as: file, failing assertion, and the most likely cause.
Do not fix code unless explicitly asked.
```

When the main agent delegates to `test-runner`, the noisy test logs stay in the subagent's window; your main conversation only receives the distilled report.

## Tool-Use Patterns

Coding agents act through tools — running shell commands, editing files, searching code. The pattern that pays off is **verify, then act, then re-verify**. Ask the agent to gather ground truth before it changes anything, and to confirm the result afterward rather than assuming success.

```text
Before editing: run `npm run typecheck` and paste the current errors.
Then: fix only the errors in src/components/Cart.tsx.
After editing: re-run `npm run typecheck` and confirm those errors are gone
without introducing new ones.
```

This closes the loop. The agent works against observed reality instead of its prediction of the codebase, which is where most silent failures originate.

For recurring, well-scoped capabilities, package the procedure as a **skill**. A skill is a `SKILL.md` file describing when and how to perform a task; the agent loads it on demand, so the instructions don't sit in context until they're actually needed. Skills are ideal for things like "generate a release changelog" or "scaffold a new component" where the steps and tools are stable.

> [!WARNING]
> Be explicit about destructive operations. If a tool can delete files, force-push, or drop tables, say so in the prompt and require confirmation. Agents will run what you ask; the guardrails are yours to set.

## Output Structuring

Telling the agent how to format its answer makes the result usable downstream — by you, by a script, or by the next link in a chain. Unstructured prose is hard to diff, parse, or act on.

Common structuring moves:

- Demand a specific format (a unified diff, a JSON object, a table).
- Constrain scope ("change only these two functions; do not touch imports").
- Ask for a plan before code when the task is non-trivial, so you can approve the approach first.

```text
Output a single fenced ```json block matching this shape, nothing else:

{
  "files_changed": ["string"],
  "summary": "one sentence per file",
  "risk": "low | medium | high"
}
```

When the output is machine-readable, you can feed it into CI, a review script, or another prompt without manual cleanup — which is exactly what makes chaining and automation possible.

## Putting It Together

These patterns compose. A strong workflow often chains steps, where each step uses a few-shot example to fix the style, runs in a context-managed subagent, verifies through tools, and returns structured output for the next step to consume. Start with one pattern that fixes your most painful failure mode, then layer the others as your agent workflows mature.
