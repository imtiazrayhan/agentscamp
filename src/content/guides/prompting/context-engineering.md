---
title: "Context Engineering"
description: "Treating the context window as a finite budget — what to load, what to leave out, and when to reset."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting"]
featured: false
related: ["guide:prompt-patterns", "guide:choosing-the-right-model", "guide:claude-md-best-practices", "guide:claude-code-memory-context"]
summary: "Context engineering treats the window as a budget: load the 2–4 files the task touches, not the repo; keep durable facts in CLAUDE.md and ephemeral ones in the prompt; scope asks so discovery stays cheap; /clear at task boundaries and /compact mid-task; and push noisy investigations into subagents that return only the verdict. Signal-to-noise beats raw token count."
keyTakeaways:
  - "The window is a budget, not a backpack: a focused 8K-token context routinely outperforms a 120K one that contains the same answer somewhere inside it."
  - "Durable facts go in CLAUDE.md, task-specific facts go in the prompt — the most common mistake is the reverse."
  - "Scoping the ask is the cheapest optimization: one extra sentence of precision saves thousands of tokens of exploratory noise."
  - "/clear at every task boundary is the single highest-leverage habit; /compact is for long sessions whose conclusions still matter."
  - "Whole-repo dumps fail three ways: attention dilutes, the agent 'improves' files you never mentioned, and tokens spent on noise aren't available for reasoning."
faq:
  - q: "What is context engineering?"
    a: "The discipline of spending an agent's finite context window deliberately — deciding what loads (the files in play, the one error message, durable conventions), what stays out (whole-repo dumps, stale transcripts, passing-test logs), and when to reset. It's distinct from prompt wording: a perfect request still fails inside a noisy window."
  - q: "Doesn't a bigger context window make this unnecessary?"
    a: "No. Long context isn't infinite attention — as the window fills, the model gets worse at finding the relevant fact and tends to lose things buried in the middle. The useful question is never 'does it fit' but 'does adding this make the next answer better or worse.'"
  - q: "When should I use /clear versus /compact?"
    a: "/clear at task boundaries: the finished task's transcript is pure noise for the next one, and a fresh window with a sharp prompt beats a stale one that 'remembers everything.' /compact mid-task: it summarizes a long but relevant session so earlier decisions survive while the bulk frees up."
  - q: "Why not just give the agent the whole codebase for context?"
    a: "Three concrete failures: attention dilutes (3 relevant files among 80 collapses signal-to-noise), it invites scope creep (the agent helpfully touches code that was merely visible), and it crowds out the actual work — tokens on irrelevant files aren't available for reasoning and the diff. Curation beats accumulation."
---

Every token an agent reads competes for the same finite window. Fill it with the right three files and Claude reasons sharply; fill it with a `git ls-files` dump and the signal you actually care about gets buried under noise the model still has to weigh. Context engineering is the discipline of spending that budget deliberately — deciding what loads, what stays out, and when to clear the table and start fresh.

This isn't prompt wording. A perfectly phrased request still fails if the surrounding context is full of stale diffs, irrelevant files, and a 40-turn transcript the model now has to reconcile. The window is the workspace; this guide is about keeping it clean.

## The window is a budget, not a backpack

Long context does not mean infinite attention. As a window fills, two things degrade together: the model's ability to find the relevant fact among everything else, and its tendency to lose facts buried in the middle of a long window while over-weighting whatever appears at the very start and end. A 200K window holds a lot, but the useful question is never "does it fit" — it's "does adding this make the *next* answer better or worse."

Treat every addition as a withdrawal from a budget:

| Spend on | Don't spend on |
|----------|----------------|
| The 2–4 files the task actually touches | The whole repo "for context" |
| Exact function signatures and types in play | Generated code, lockfiles, `dist/` |
| The one error message you're debugging | Twenty pages of passing test logs |
| Durable conventions (in `CLAUDE.md`) | Conventions re-pasted every prompt |

> [!NOTE]
> Signal-to-noise is the metric that matters, not raw token count. A focused 8K-token context routinely outperforms a 120K-token context that happens to contain the same answer somewhere inside it.

## Signal vs. noise

Signal is anything the model needs to reason about *this* task and couldn't reliably infer. Noise is everything else that happens to be in the window — and noise is not neutral. It costs attention, invites the model to "fix" things you didn't ask about, and dilutes the instructions that matter.

Common noise that sneaks in:

- **Whole-file reads when you needed one function.** Reading a 1,200-line module to discuss one method drags 1,150 irrelevant lines along.
- **Stale transcript.** A finished migration discussion three tasks ago is still being re-read on every turn.
- **Build and test output.** Most of a CI log is reassurance you didn't need; the three failing lines are the signal.
- **Defensive over-pasting.** Dumping a schema, a config, and two utils "just in case" when the task touches one of them.

The fix is to point precisely. Reference exact paths and symbols — `src/billing/invoice.ts`, `computeTax()` — so the agent reads the slice that matters instead of grepping the tree and pulling in everything adjacent.

## CLAUDE.md vs. the prompt

The most common context mistake is putting durable facts in prompts and ephemeral facts in `CLAUDE.md`. It should be the reverse.

`CLAUDE.md` loads on every session, so it's the right home for things that are true across *all* tasks and expensive to re-explain: the package manager, the test command, directory layout, naming conventions, the "never do X" rules. Earn its place — every line here is paid for on every single turn, forever.

The prompt is for what's true about *this* task only: which files, which bug, which acceptance criteria.

```markdown
# CLAUDE.md — durable, every session
- Package manager: pnpm (never npm)
- Tests: `pnpm test`; typecheck: `pnpm typecheck`
- Routes are Server Components by default; mark client with "use client"
- Never edit files in `generated/` — they're rebuilt from schema.prisma
```

```text
# Prompt — ephemeral, this task only
Fix the off-by-one in pagination in src/api/list.ts (getPage).
Reproduce with `pnpm test list.test.ts`, then make it pass.
```

> [!TIP]
> A good test for any `CLAUDE.md` line: would you be annoyed to re-type it for the tenth time this week? If yes, it belongs there. If it's specific to today's task, it belongs in the prompt and should leave the window when the task ends.

> [!WARNING]
> A bloated `CLAUDE.md` is a permanent tax. A 600-line one that documents every edge case burns budget on every turn and buries the ten rules that matter. Keep it tight; link out to docs the agent can read on demand instead of inlining them.

## Scope the task so it loads only what it needs

How you frame a task determines what the agent pulls into the window. A vague ask forces exploration — grepping, listing, reading whole files to orient — and every byte of that exploration stays resident. A scoped ask lets it go straight to the relevant slice.

Compare:

```text
# Unscoped — agent reads half the repo to figure out where things are
"The checkout total is sometimes wrong, can you fix it?"

# Scoped — agent loads exactly what it needs
"In src/cart/total.ts, applyDiscount() double-counts percentage coupons
when two stack. Read that function and its test, fix the math, keep the
signature."
```

Both can land the fix. The first does it after dragging routing, components, and three unrelated utils into context; the second never loads them. Scoping is the cheapest context optimization you have — it costs one extra sentence and saves thousands of tokens of noise.

When you genuinely don't know where the problem lives, make *discovery* the explicit first step and keep it cheap: "List the files that touch checkout totals; don't read them yet." Then scope the real task to the answer.

## Clear and compact: resetting the window

Context accumulates whether or not it's still useful. The two levers for resetting it are `/clear` and `/compact`, and they're for different situations.

- **`/clear`** wipes the conversation and starts fresh. Reach for it at task boundaries — you finished the migration, now you're fixing an unrelated bug. The old transcript has zero value to the new task and is pure noise; clearing it is the single highest-leverage habit in this guide.
- **`/compact`** summarizes the conversation so far into a compact form and continues, preserving the thread. Use it mid-task when a long, *relevant* session is getting heavy but you still need its conclusions — a multi-step refactor where the decisions made early still matter.

> [!TIP]
> Default to `/clear` between unrelated tasks rather than letting one mega-session run all day. A fresh window with a sharp prompt beats a stale window that technically "remembers everything" but spends attention reconciling ten tasks' worth of history.

A useful tell: if you find yourself re-explaining what you're doing because the agent seems to be acting on something from an hour ago, the window is overloaded. Clear it and restate the current task cleanly.

## Delegate to subagents to isolate context

Subagents are a context tool as much as a delegation tool. Each one runs in its own separate window and returns only its final summary to your main thread. That means a noisy investigation — reading twenty files, running the suite, trawling logs — happens *somewhere else*, and your main conversation receives the distilled answer instead of the mess that produced it.

```markdown
---
name: failure-investigator
description: Reproduces a failing test, finds the root cause, reports back. Use when a test fails and you need the cause, not a fix.
model: sonnet
tools: Read, Grep, Glob, Bash
---

Reproduce the failing test, trace the root cause, and report:
the failing assertion, the responsible file and line, and the most
likely cause in 2–3 sentences. Do not edit code.
```

The subagent might read fifteen files and a hundred lines of stack trace to do its job. Your main window never sees any of it — only the three-sentence verdict comes back. This is how you investigate a hard bug without poisoning the context you'll use to actually fix it. (For picking the right model per delegate, see [choosing-the-right-model](/guides/getting-started/choosing-the-right-model).)

## Why dumping the whole codebase backfires

The instinct that "more context can't hurt" is wrong, and it fails in three concrete ways.

1. **Attention dilutes.** The model weighs everything in the window. Hand it 80 files when 3 are relevant and the signal-to-noise ratio collapses; the right answer is in there, but so is everything that distracts from it.
2. **It invites scope creep.** An agent that can see your entire repo will helpfully "improve" files you never mentioned — touching code you didn't want changed because it was simply *there*.
3. **It crowds out the work.** Tokens spent on irrelevant files are tokens not available for reasoning, the diff, and your follow-ups. You hit the ceiling faster and get shorter, shallower answers.

A whole-repo dump feels thorough but trades a small, sharp working set for a large, blurry one. The skill is curation, not accumulation.

## Concrete dos and don'ts

**Do**

- Name exact files and symbols; let the agent read the slice, not the tree.
- Put durable, cross-task facts in `CLAUDE.md`; keep it lean.
- `/clear` at every task boundary.
- Push noisy investigations into subagents and keep only their summaries.
- Scope the request so discovery is cheap or unnecessary.

**Don't**

- Paste an entire file to discuss one function.
- Leave a finished task's transcript sitting in the window for the next one.
- Re-explain conventions every prompt instead of writing them down once.
- Dump the repo "for context" and hope the model sorts it out.
- Let one session run all day across five unrelated tasks.

Context is the one resource you control completely on every turn. Spend it on signal, evict noise the moment it stops paying rent, and reset without hesitation when the task changes — and the model will reward you with sharper, more reliable work on a smaller, cleaner window.
