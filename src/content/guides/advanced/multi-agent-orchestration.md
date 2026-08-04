---
title: "Multi-Agent Orchestration"
description: "Four patterns for coordinating multiple agents — fan-out, pipeline, orchestrator-worker, and verify/critic — and when each earns its overhead."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting", "architecture"]
related: ["agent:workflow-orchestrator", "guide:building-multi-step-workflows", "agent:agent-architect", "guide:parallel-claude-code-worktrees"]
featured: false
summary: "Multi-agent orchestration buys one thing: a clean, purpose-built context per agent. Four shapes arrange the hand-offs — fan-out for independent slices, pipeline for ordered stages with narrowing between them, orchestrator-worker for dynamic decomposition, and verify/critic for adversarial checking in a fresh window. Default to a single thread; promote only when a pattern clearly fits."
keyTakeaways:
  - "Context isolation is the actual product: focus (the reviewer sees only the diff), bounded cost (40 files burn in the subagent's window, 12 lines return), and independence (separate contexts agreeing is real corroboration)."
  - "Fan-out for independent slices — parallelize reads and analysis freely, serialize writes that touch shared files."
  - "A pipeline narrows between stages — stage 3 sees the approved schema, not the research transcript — so gate every boundary or a confident-wrong stage 1 poisons everything after it."
  - "Orchestrator-worker fits dynamic decomposition; strip Edit/Write from the orchestrator so the process owner physically can't do a worker's job."
  - "The critic only works in a clean window: let it inherit the author's context and it inherits the author's blind spots and rubber-stamps."
  - "Coordination isn't free — every hand-off spends tokens and risks dropping a detail. One sequential thread is the right default."
faq:
  - q: "What is multi-agent orchestration?"
    a: "Coordinating several agents — each in its own context window, each returning only a summary — so every stage of a hard task works from a clean, purpose-built context instead of one thread's accumulated noise. The four standard shapes are fan-out, pipeline, orchestrator-worker, and verify/critic."
  - q: "When is multi-agent actually better than a single agent?"
    a: "Three conditions: the work splits into independent slices or cleanly ordered stages; one context would overflow or degrade; or you need independent corroboration (a critic whose value is precisely that it didn't watch the work happen). Outside those, the hand-offs cost more than they return — stay in one thread."
  - q: "Why must the critic agent get a fresh context?"
    a: "Because the isolation is load-bearing: an author believes its own output, having rationalized every decision. A critic that sees only the artifact and the requirements has no stake and no inherited blind spots. Give it the author's reasoning and you've built an expensive rubber stamp."
  - q: "Can subagents see each other's work or the main conversation?"
    a: "No — each starts blank and returns only its summary. That's what makes parallelism safe and corroboration meaningful, but it means every constraint ('the DB is Postgres', 'don't touch legacy/') must be written into each task prompt explicitly. Nothing crosses the boundary unless you pass it."
---

A single agent on a hard task accumulates everything in one context window: the files it read, the dead ends it explored, the half-formed plan it revised twice. By the time it reaches the part that matters, the signal is buried in its own history. Multi-agent orchestration is the fix — not because two agents are smarter than one, but because each agent gets a **clean, purpose-built context** and hands back only what the next stage needs.

That's the whole thesis. The patterns below are different ways of arranging that hand-off. The skill is knowing which shape fits the work, and recognizing the cases where coordination costs more than it returns.

## Context isolation is the actual product

Every subagent in Claude Code runs in its **own context window** and returns only a summary to its caller. Nothing else crosses the boundary — not the parent's conversation, not sibling agents' work, not the raw tool output the subagent generated to reach its answer.

This isolation is what you're really buying. It gives you three things a single thread cannot:

- **Focus.** A reviewer that only ever sees a diff and a checklist can't be distracted by the implementation chatter that produced the diff.
- **Bounded context.** A scan that reads 40 files burns those tokens in the subagent's window, then returns a 12-line report. The parent never pays for the 40 files.
- **Independence.** Two agents reaching the same conclusion from separate contexts is genuine corroboration. Two passes in one context just agree with themselves.

> [!NOTE]
> Isolation cuts both ways. A subagent starts blank — it cannot see a constraint the user mentioned three turns ago. Anything it must know ("the DB is Postgres", "don't touch the `legacy/` folder") has to be written into the task prompt you hand it.

## Pattern 1 — Fan-out (parallel, independent)

Fan-out dispatches several agents at once, each on a slice of work that shares no state with the others, then merges their results. It's the right pattern when the slices are genuinely independent — no slice needs another's output to start.

In Claude Code you fan out by launching multiple subagents (via the Agent tool) in a single turn. They run concurrently, each returns a summary, and the parent reconciles.

```text
Spawn three subagents in parallel, each read-only:
  1. List every component that re-renders on every keystroke (perf).
  2. Find inputs and forms missing labels or ARIA roles (a11y).
  3. Flag any user-supplied string rendered without escaping (security).
Each returns: severity | file:line | issue. Do not fix anything.
```

The win is wall-clock time *and* cleaner inputs: three narrow specialists produce sharper findings than one generalist sweeping for everything at once. The cost lands at merge time — the parent has to dedupe overlaps and resolve disagreements. Fan-out is cheap to start and real work to land.

> [!WARNING]
> Fan-out only on truly independent work. If two agents both edit `package.json`, you've created a merge conflict with no merge tool. Parallelize reads and analysis freely; serialize writes that touch shared files.

## Pattern 2 — Pipeline (staged hand-off)

A pipeline runs agents in sequence, where each stage's output is the next stage's input. Use it when the work is inherently ordered: you can't review a design that doesn't exist, or test code that isn't written.

```text
Stage 1 (research): map the current auth flow → return a flow summary.
Stage 2 (design):   given that summary, propose the session-table schema.
Stage 3 (build):    implement against the approved schema → return a diff.
```

What makes a pipeline more than "one long prompt" is the **narrowing** between stages. Stage 3 never sees the research transcript — only the approved schema. That keeps the implementer's context tight and means a wrong turn in Stage 1 surfaces at the Stage 1 hand-off, where it's cheap to correct, instead of after Stage 3 has built on it.

| | Fan-out | Pipeline |
|---|---|---|
| Dependency | none between slices | each stage feeds the next |
| Runs | concurrently | in order |
| Failure mode | conflicting/overlapping merges | error compounds down the chain |
| Add a checkpoint | at the final merge | between every stage |

The pipeline's risk is compounding error: a confident-but-wrong Stage 1 poisons everything after it. So gate the stages — review the artifact at each boundary before passing it on.

## Pattern 3 — Orchestrator-worker

An orchestrator-worker setup has one agent that owns the *process* and dispatches workers that own the *tasks*. The orchestrator decides how to decompose the goal, fans work out to workers, collects results, and decides what to do next — possibly another round. Workers are interchangeable and stateless between calls.

This is the pattern when the decomposition is dynamic — you don't know the full set of subtasks until you've started. "Migrate every call site of this deprecated API" can't be planned up front; the orchestrator discovers the call sites, then spins a worker per cluster.

```markdown
---
name: migration-orchestrator
description: Coordinates a deprecated-API migration across many files. Use for repo-wide mechanical migrations.
color: purple
tools: Read, Grep, Glob, Agent
---

You own the migration process; you do not edit code yourself.

1. Grep for all call sites of the deprecated API. Group them by file.
2. For each group, dispatch a worker subagent with: the file path, the
   old→new signature, and the house pattern to follow.
3. Collect each worker's diff. Re-run the build after every batch.
4. If a worker reports an ambiguous case, stop and surface it — do not guess.
```

Note the role separation: the orchestrator's `tools` exclude `Edit`/`Write` on purpose — it physically can't do a worker's job, which keeps the process owner and the task workers cleanly separated. (A subagent's `tools` field is a genuine allowlist — it restricts the agent to exactly those tools.) You can set a per-worker model in the agent definition's frontmatter: the [`model:` field](https://code.claude.com/docs/en/sub-agents) accepts an alias (`sonnet`, `opus`, `haiku`, `fable`), a full model ID, or `inherit` (the default). Claude Code resolves it in order — the `CLAUDE_CODE_SUBAGENT_MODEL` env var, then a per-invocation `model` parameter, then the frontmatter `model`, then the main conversation's model — so you can pin a worker's model in the file or override it at invocation time. The overhead here is highest of any pattern, so reserve it for work with many similar subtasks or a coordination logic worth naming and reusing.

## Pattern 4 — Verify / critic (adversarial checking)

The most underused pattern: after work is produced, a **separate** agent with a fresh context and no stake in the result tries to find what's wrong with it. The author agent believes its own output — it just rationalized every decision it made. A critic that sees only the artifact and the requirements has no such bias.

```text
Launch a critic subagent. Give it ONLY:
  - the diff
  - the original requirements
Ask: does this fully meet the requirements? What breaks under edge cases,
concurrency, or bad input? Return a verdict (ship / fix) plus concrete concerns.
Do not let it see the author's reasoning.
```

The isolation is load-bearing. If the critic inherits the author's context, it inherits the author's blind spots and rubber-stamps the work. A clean window is the entire point. Pair this with mechanical checks (build, lint, tests) — those catch what's objectively broken; the critic catches what's subtly wrong but compiles fine.

> [!TIP]
> Make the critic's verdict structured (`ship | fix` plus a bulleted concern list) so the orchestrator can branch on it automatically: ship → proceed, fix → loop back to the author with the concerns attached.

## When multi-agent genuinely helps — and when it doesn't

Coordination is not free. Every hand-off spends tokens, adds latency, and risks losing a detail in the summary. Reach for multiple agents only when the benefit clears that bar.

**Worth it when:**

- The work splits into **independent** slices (fan-out) or **ordered** stages with clean hand-offs (pipeline).
- A single context would **overflow** — the task reads more than fits, or the transcript gets so long quality degrades.
- You want **independent corroboration** — a verify step whose value depends on a separate context.

**Skip it when:**

- Steps are tightly coupled and share mutable state — splitting them just moves the complexity into the hand-off.
- The whole task fits comfortably in one window and you want to watch and steer each step live.
- You'd spend more tokens negotiating handoffs than doing the work — when the coordination surface of a pattern costs more than the slices it splits, collapse it back to one thread.

> [!WARNING]
> Don't add agents for their own sake. The default should be a single sequential thread; promote to multi-agent only when a specific pattern above clearly fits. "More agents" is not "more capable" — it's more coordination surface to get wrong.

## Keeping the results trustworthy

Whichever pattern you pick, agents are optimistic and will report success on code that doesn't compile — so never let an orchestrated run end on a worker's own say-so. Close every non-trivial run with mechanical checks (build, lint, tests) and the fresh-eyes critic from Pattern 4, the one combination that catches both what's objectively broken and what's subtly wrong but compiles fine.

The two mechanics that make every pattern here survivable — passing constraints into each task prompt because a subagent can't see the parent conversation, and persisting durable facts to a `PLAN.md` because summaries drop detail over long runs — are covered in depth in [Building Multi-Step Agent Workflows](/guides/advanced/building-multi-step-workflows).

## Worked example: parallel review, then synthesis

Combine fan-out and verify into one trustworthy review of a PR — three reviewers across orthogonal dimensions, then a synthesizer that reconciles them into a single verdict.

**Stage 1 — fan out three reviewers, each read-only, each in its own context:**

```text
Review PR #482 (diff attached). Spawn three subagents in parallel:

  correctness:  logic errors, off-by-ones, unhandled errors, race conditions.
  security:     injection, authz gaps, secrets, unsafe deserialization.
  maintainability: naming, dead code, duplicated logic, missing tests.

Each returns ONLY a table: severity | file:line | finding | suggested fix.
None of them edits code. None of them sees the others' output.
```

Each reviewer sees the same diff but a different lens, so their findings don't bleed together. Because they're isolated, "security and correctness both flagged `parseToken()`" is real, independent agreement — a strong signal to act.

**Stage 2 — fan in with a synthesizer:**

```text
Launch a synthesizer subagent. Give it the three findings tables and the
PR's stated goal. It must:
  1. Merge into one list; collapse duplicates (note when >1 reviewer agreed).
  2. Sort by severity, then by reviewer agreement.
  3. Drop findings that contradict the PR's intent; flag the contradiction.
  4. Return a verdict: BLOCK (with must-fix list) or APPROVE-WITH-NITS.
```

The synthesizer is doing the fan-in that doesn't happen by itself — three tables don't merge themselves, and overlaps need a decision. Its verdict is structured, so a slash command or CI step can branch on it: `BLOCK` posts the must-fix list and fails the check; `APPROVE-WITH-NITS` posts nits and passes.

The result is more trustworthy than one agent reviewing everything, for reasons that trace straight back to isolation: each dimension got full attention in a clean window, agreement across independent contexts is meaningful, and a final pass with no stake in any single review made the call.

## Putting it together

Pick the shape from the work, not the other way round. Independent slices fan out; ordered stages pipeline; dynamic, repeated decomposition wants an orchestrator-worker; anything you need to trust gets a verify/critic pass. Underneath all four, the lever is the same — give each agent a clean context and a narrow job, pass constraints in explicitly, persist what you can't afford to lose, and verify before you believe. Start with one agent. Add the next only when a pattern here obviously fits, and the coordination clearly pays for itself.

## Continue exploring

- [Create Subagent](/commands/workflow/create-subagent) — Scaffold a Claude Code subagent with a routing-ready description, scoped tools, and a focused system prompt.
- [agent-architect](/agents/meta-orchestration/agent-architect) — Use this agent to design a new Claude Code subagent or review an existing one — scoping, description, toolset, model, and output contract.
- [Estimate Effort](/commands/plan/estimate-effort) — Produce a grounded effort and complexity estimate for a task by exploring the codebase read-only.
- [Write Design Doc](/commands/plan/write-design-doc) — Explore the codebase and write a decision-oriented design doc / RFC for a feature or system change.
