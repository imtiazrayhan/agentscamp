---
description: "Scaffold a new Claude Code subagent definition file into .claude/agents/ with a routing-ready description, scoped tools, and a system prompt."
argument-hint: "<what the subagent should do>"
allowed-tools: "Read, Write, Glob, Grep"
title: "Create Subagent"
color: "purple"
topics: ["workflow-prompting", "ai-agents-systems"]
related: ["command:create-skill", "command:create-slash-command", "skill:agent-memory-designer"]
featured: false
date: 2026-06-17
summary: "A slash command that scaffolds a new Claude Code subagent into .claude/agents/<slug>.md. It narrows $ARGUMENTS to one job, asks one round of clarifying questions if vague, then writes a valid agent file: real-format frontmatter (name, trigger-rich description, model, color, tools allowlist) plus a system prompt with a role, when-to-use boundaries, a numbered workflow, and an output contract."
faq:
  - q: "Why does the description field matter so much?"
    a: "The orchestrator reads each subagent's description to decide when to delegate. A description without concrete 'Use this agent when...' triggers will never get routed to — the field is the routing logic, not documentation."
  - q: "Where is the subagent installed?"
    a: "Into .claude/agents/<slug>.md in the current project by default. Move it to ~/.claude/agents/ to make it available across all your projects."
---

## Scope

Treat `$ARGUMENTS` as the **purpose** of a new subagent — what specialized job it should own (`review database migrations for lock risk`, `write conventional-commit messages from a diff`, `triage incoming Sentry errors`). A subagent is a single-purpose persona the main agent can delegate to, with its own context window, tool allowlist, and system prompt. Restate the purpose in one sentence and narrow it to **one job** before writing anything — broad agents ("does backend stuff") never get routed to reliably.

If `$ARGUMENTS` is empty or vague, ask **one** focused round of clarifying questions, then proceed:

1. **Domain & job** — what is the one task this agent should be the expert at?
2. **Tools** — does it need to write/edit files and run commands, or is it read-only (review, analysis, planning)?
3. **Model tier** — `haiku` (fast, mechanical), `sonnet` (default, most work), or `opus` (deep reasoning / architecture)?

Do not ask more than once. If the user is terse, pick sane defaults (read-only, `sonnet`), state them, and write the file.

> [!WARNING]
> You only create the agent definition. Do not invoke the new subagent, run its workflow, or modify other files. Your single output is `.claude/agents/<slug>.md`.

## Step 1 — Derive the slug and check for collisions

Convert the purpose into a kebab-case `name` that reads like a role, not a sentence: `migration-reviewer`, `commit-message-writer`, `sentry-triager`. The filename **is** the slug, so `name` must match `<slug>.md`.

Use `Glob` on `.claude/agents/*.md` and `~/.claude/agents/*.md` to check the slug is not already taken. If it collides, `Read` the existing file: if it covers the same job, tell the user it already exists and stop; otherwise pick a more specific slug rather than overwriting.

## Step 2 — Decide the tool allowlist (least privilege)

The `tools` field restricts what the subagent can do; **omit it to inherit all tools**, or list the minimum it needs. Match tools to the job from Step 1:

- **Read-only roles** (reviewers, analyzers, planners): `Read, Grep, Glob`. No `Write`, `Edit`, or `Bash`.
- **Editing roles** (fixers, refactorers, scaffolders): add `Write, Edit` and only the `Bash` commands they need (e.g. the test runner).
- **Investigators** that run commands but never edit: `Read, Grep, Glob, Bash`.

> [!NOTE]
> A subagent runs in its **own** context window — it does not see your conversation, only the prompt the orchestrator hands it plus what its tools surface. That is why the system prompt below must be self-contained: state the workflow and conventions explicitly; the agent cannot rely on chat history.

## Step 3 — Write a description that triggers delegation

This is the most important field. The main agent scans every subagent's `description` to decide what to route where, so it must read as a routing rule, not a label. Pack it with **concrete trigger phrases**:

- Lead with the capability, then add explicit `Use this agent when...` / `Use proactively when...` cues tied to real situations and keywords a user would say.
- Name the inputs it expects (a diff, a file path, an error payload) so the orchestrator delegates with the right context.

A weak description (`"Reviews code."`) gets ignored. A strong one — `"Reviews database migration files for locking and downtime risk. Use this agent when the user adds or edits files under db/migrations, mentions ALTER TABLE, adding columns/indexes, or asks 'is this migration safe to run in prod?'"` — gets routed reliably.

## Step 4 — Write the agent file

`Write` `.claude/agents/<slug>.md` (create `.claude/agents/` if missing) in exactly this shape. Fill every placeholder with content specific to the purpose — no generic filler.

```markdown
---
name: <slug>
description: <capability + concrete "Use this agent when..." triggers from Step 3>
tools: <minimum allowlist from Step 2, or omit the line to inherit all>
model: <haiku | sonnet | opus>
color: <a distinct color, e.g. cyan, green, orange>
---

You are <role> — a focused specialist in <domain>. <One sentence on the
standard you hold and the value you add.>

## When to use me
- <concrete situation 1>
- <concrete situation 2>

## When NOT to use me
- <adjacent job that belongs to a different agent / the main agent>
- <scope you must refuse and hand back instead of guessing>

## Workflow
1. <first concrete step, naming the tools you'll use>
2. <gather context: which files/patterns to Read/Grep before acting>
3. <do the core work>
4. <self-check against the standard in your role statement>

## Output contract
- <exact format you return: a review with severity-tagged findings, a
  unified diff, a checklist, a single recommendation — be specific>
- <what you must NOT do: e.g. never edit beyond the named files; flag,
  don't fix, anything outside scope>
```

Field rationale to honor while filling it in:

- **`name`** must equal the filename slug — that is how the agent is addressed.
- **`description`** is the delegation trigger (Step 3); spend your effort here.
- **`model`** controls cost vs. depth — don't default everything to `opus`.
- **`color`** is just the UI label color; pick one not already used by a sibling agent.
- **`tools`** is the security boundary — narrower is safer and keeps the agent on task.

## Report

Tell the user, in your message:

1. The exact path written — `.claude/agents/<slug>.md` (and whether it's project- or user-scoped).
2. How to invoke it — it triggers automatically when a request matches its `description`, or explicitly via *"use the `<slug>` subagent to ..."*.
3. The one knob most likely to need tuning: if the agent isn't getting picked up, sharpen the `description` triggers (Step 3) — that is almost always the cause.

Note that moving the file to `~/.claude/agents/` makes the subagent available across all projects.
