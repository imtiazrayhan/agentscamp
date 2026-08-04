---
title: "Writing Your First Custom Agent"
description: "A step-by-step guide to authoring a focused, effective custom subagent."
seoDescription: "A step-by-step guide to authoring a focused Claude Code subagent — scoping the job, writing the description, picking tools, and testing the result."
author: "AgentsCamp"
date: 2026-05-06
color: "green"
topics: ["workflow-prompting"]
featured: true
related: ["agent:code-reviewer", "agent:debugger"]
summary: "A good custom subagent comes from five decisions: one nameable job (split anything joined by 'and'), a description written as a routing signal with 'Examples —' triggers, a minimum toolset (read-only for reviewers), a model matched to cognitive load (sonnet by default), and a system prompt well under 100 lines that says only what the model couldn't already guess."
howtoSteps:
  - name: "Pick one job-to-be-done"
    text: "Scope the agent to one task a human could name in a sentence — 'reviews PR diffs for bugs', 'investigates a failing test'. If the description needs an 'and' joining unrelated tasks, that's two agents."
  - name: "Write a description that earns delegation"
    text: "The description field is the routing signal, not documentation. State when to use the agent and include 'Examples —' with realistic situations phrased the way people actually ask; that's what Claude pattern-matches against."
  - name: "Scope the tools"
    text: "Grant only what the job needs via the tools field. A reviewer gets Read, Grep, Glob, Bash and physically cannot edit code; a refactorer adds Edit and Write. Minimum first — widening later is easy, tightening is hard."
  - name: "Pick the model"
    text: "Match the tier to cognitive load: haiku for mechanical high-volume work, sonnet as the default for review/debugging/coding agents, opus only for genuinely hard reasoning like architecture or subtle concurrency."
  - name: "Keep the system prompt under ~100 lines"
    text: "Structure it as role, when to use / when not, workflow, and output shape. Cut generic advice the model already knows — spend the budget only on what's specific to this job. A prompt past a couple hundred lines means the agent has too many jobs."
  - name: "Reload and verify delegation"
    text: "Restart or reload Claude Code, then give it a task that should trigger the agent. If it doesn't delegate, tighten the description first — it's the lever that controls routing."
faq:
  - q: "How do I create a custom agent in Claude Code?"
    a: "Add a Markdown file to .claude/agents/ (project) or ~/.claude/agents/ (personal): YAML frontmatter with name, description, and optional model/color/tools, followed by a body that becomes the agent's system prompt. Reload Claude Code and it's available for delegation — that file is the entire format."
  - q: "Why doesn't Claude delegate to my custom agent?"
    a: "Almost always the description. It's the routing signal Claude reads when deciding whether to hand work over — write it in terms of when to use the agent, and add 'Examples —' with situations phrased the way you'd actually ask. Vague descriptions leave agents sitting unused."
  - q: "How long should a subagent's system prompt be?"
    a: "Usually well under 100 lines. Long prompts dilute attention, accumulate contradictions, cost context on every invocation, and rot unmaintained. If yours is growing past a couple hundred lines, the agent is doing too many jobs — split it before you patch it."
  - q: "What tools should a review agent have?"
    a: "Read-only: Read, Grep, Glob, and Bash for running checks. With no write tools it physically cannot edit your code, and the restriction sharpens behavior — an agent that can only read naturally produces analysis instead of drifting into making changes."
---

A custom subagent is one of the highest-leverage things you can add to a Claude Code setup. Done well, it gives Claude a specialist it can hand work to — a code reviewer, a debugger, a migration assistant — that runs in its own context window with its own focused instructions and a restricted toolset. Done poorly, it becomes a 1,500-line prompt that nobody trusts and Claude never delegates to.

This guide walks through authoring your first one: where it lives, the five decisions that determine whether it's good, and the trap most people fall into.

## What a subagent actually is

A subagent is a single Markdown file in `.claude/agents/`. Project agents live in `.claude/agents/` at your repo root; personal agents live in `~/.claude/agents/` and follow you across projects. The file has YAML frontmatter plus a body that becomes the agent's system prompt.

```markdown
---
name: db-migration-reviewer
description: Reviews database migration files for safety before they run. Use when a migration is added or changed.
model: sonnet
color: orange
tools: Read, Grep, Glob, Bash
---

You are a database migration reviewer. Your one job is to catch
migrations that could cause downtime or data loss before they ship.
```

That's the whole format. Everything below is about filling those fields in well.

> [!NOTE]
> Don't confuse subagents with the other two extension points. **Skills** are `SKILL.md` files that package reusable instructions and scripts. **Slash commands** live in `.claude/commands/` as Markdown prompts you trigger by name. A subagent is a delegate Claude calls on its own; a slash command is something *you* invoke.

## Step 1: Pick one job-to-be-done

The single most important decision is scope. A great subagent does one thing a human could name in a sentence: "reviews PR diffs for bugs," "investigates a failing test and proposes a fix," "audits a file for security issues."

The temptation is to build a do-everything assistant. Resist it. Narrow agents are easier for Claude to route to correctly, easier to give the right tools, and far easier to keep accurate. If you find yourself writing "...and it can also...", that's a second agent.

A quick test: if you can't write the agent's description without the word "and" joining two unrelated tasks, split it.

## Step 2: Write a description that earns delegation

The `description` field is not documentation — it's the routing signal. When Claude decides whether to hand a task to your agent, it reads this field. A vague description means your agent sits unused; a sharp one means it gets picked at the right moment.

Write it in terms of *when to use the agent*, and include concrete trigger examples:

```yaml
description: >
  Use this agent to review code changes for correctness and security
  before merging. Examples — reviewing a PR diff, auditing a new
  module, checking a refactor for regressions.
```

> [!TIP]
> Including "Examples —" with a few realistic situations measurably improves auto-delegation. Claude pattern-matches the user's actual request against those examples, so make them resemble how people really phrase the task.

Also state when *not* to use it. If your reviewer shouldn't write features, saying so in the body (or description) keeps Claude from over-delegating.

## Step 3: Scope the tools

By default a subagent inherits every tool the main thread has. That's rarely what you want. The `tools` field lets you grant only what the job needs, as a comma-separated list.

Scoping tools does two things. It prevents accidents — a review agent with no write tools physically cannot edit your code. And it sharpens behavior — an agent that can only `Read`, `Grep`, and `Glob` naturally produces analysis instead of drifting into making changes.

| Agent type | Reasonable toolset |
|------------|--------------------|
| Reviewer / auditor | `Read, Grep, Glob, Bash` (read-only) |
| Debugger | `Read, Grep, Glob, Bash, Edit` |
| Refactorer | `Read, Grep, Glob, Edit, Write, Bash` |

Grant the minimum that lets the agent finish its job. You can always widen later; tightening after the fact is harder because behavior already depends on the broad access.

## Step 4: Pick a model

The `model` field accepts `haiku`, `sonnet`, or `opus`. Match the model to the cognitive load of the task, not to prestige.

- **haiku** — fast, cheap, great for mechanical or high-volume work like formatting, simple lookups, or classification.
- **sonnet** — the balanced default. Most review, debugging, and coding agents belong here.
- **opus** — reserve for genuinely hard reasoning: architecture decisions, subtle concurrency bugs, multi-file refactors with tricky invariants.

If you're unsure, start with `sonnet`. Over-provisioning to `opus` for a trivial agent just makes it slower and more expensive without making it better.

## Step 5: Keep the system prompt focused

The body of the file is the system prompt, and this is where most custom agents go wrong. People treat it as a knowledge dump and write 1,500 lines covering every edge case they can imagine.

Long prompts are *worse*, for concrete reasons:

- **Diluted attention.** The model has to weigh every instruction. Bury the three rules that matter under 200 lines of "also consider..." and the important ones lose force.
- **Contradictions creep in.** Big prompts accumulate guidance that quietly conflicts, and the model has to guess which rule wins.
- **Context cost.** Every token of the prompt is loaded on every invocation, eating the budget that should go to the user's actual code.
- **Unmaintainable.** Nobody re-reads a wall of text, so it rots.

A good system prompt is usually well under 100 lines. Structure it like this:

```markdown
You are a [role]. Your job is to [one sentence].

## When to use
- ...

## When NOT to use
- ...

## Workflow
1. ...
2. ...

## Output
- State findings as blockers vs. suggestions, with confidence.
```

Give it a clear identity, the workflow it should follow, and the shape of its output. Leave out generic advice the model already knows ("write clean code," "be helpful"). Trust the base model for general competence; spend your prompt budget only on what's specific to *this* job.

> [!WARNING]
> If your prompt is growing past a couple hundred lines, that's almost always a sign the agent is doing too many jobs. Split it before you patch it.

## Putting it together

Create the file, restart or reload Claude Code so it picks up the new agent, and try a task that should trigger it. If Claude doesn't delegate, your `description` is the first thing to tighten — it's the lever that controls routing.

Start small and iterate. The best custom agents grow slowly: a tight description, a minimal toolset, the right model, and a system prompt that says only what the model couldn't already guess.
