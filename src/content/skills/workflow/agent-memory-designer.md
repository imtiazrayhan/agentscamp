---
name: "agent-memory-designer"
description: "Design a project's CLAUDE.md and memory hierarchy by exploring the repo to learn its real build/test/lint commands, architecture, and non-obvious gotchas, then writing a concise, skimmable memory that keeps only what belongs in context. Use when onboarding a repo to Claude Code with no CLAUDE.md, or when an existing one is bloated, stale, or being ignored."
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Agent Memory Designer"
date: 2026-06-17
topics: ["workflow-prompting", "ai-agents-systems"]
related: ["hook-writer", "claude-settings-auditor", "plugin-scaffolder"]
featured: false
summary: "CLAUDE.md is always in context, so every token spent on filler dilutes the rules that matter. This skill explores your repo to learn its real commands, architecture, and gotchas, then drafts a tight, skimmable project memory — keeping stable conventions and hard rules, excluding transient state, secrets, and anything derivable by reading the code."
---

CLAUDE.md is loaded into every prompt for the whole session, so it is the highest-leverage and most easily-abused file in the repo: a sharp 40-line memory steers every turn, while a 400-line dump of prose gets skimmed, diluted, and quietly ignored. This skill explores the actual project, decides what earns a permanent slot in context, and writes a memory the model will actually follow.

## When to use this skill

- You're onboarding an existing repo to Claude Code and there is no CLAUDE.md (or `/init` produced a generic one that restates the obvious).
- The current CLAUDE.md is long, stale, or contradicts the code, and Claude keeps running the wrong test command or ignoring a stated rule.
- You want to split repo facts (project CLAUDE.md) from personal cross-project preferences (user `~/.claude/CLAUDE.md`) and aren't sure what goes where.

## When NOT to use this skill

- You want an automatically enforced rule (format on save, block edits to a path) — that's a hook, not memory; memory is advisory and the model can deviate from it.
- You want a reusable procedure with its own tool scope, invoked on demand — that's a skill, not a fact that must sit in context every turn.

## Instructions

1. **Read the repo before writing a word.** Glob for the build manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Makefile`) and read its scripts/targets to get the *real* commands — never invent `npm test` if the script is `npm run test:unit`. Grep configs (`tsconfig`, `.eslintrc`, `ruff.toml`, CI workflow YAML) for the lint/typecheck/test invocations CI actually runs; those are the commands that must pass.
2. **Map the architecture in five lines or fewer.** Identify the entry points, the 3–6 directories that matter, and the one data-flow or layering rule that, if violated, breaks the build (e.g. "client components must not import `lib/db`"). Write the *map and the rule*, not a tour of every folder — the model can read the tree itself.
3. **Mine the non-obvious gotchas.** These are the highest-value lines: footguns you can't infer from a glance — a generated file that must be regenerated after content changes, a port that isn't the default, a test that needs a service running, a "looks unused but isn't" module. Surface them from READMEs, CI steps, and conspicuous comments.
4. **Sort every candidate fact into KEEP or CUT.** KEEP: stable conventions, exact commands, the architecture map, hard rules ("never commit to main"), and recurring pitfalls. CUT: transient task state, secrets/tokens, anything derivable by reading the code (function signatures, the full dependency list), and long explanatory prose. If a line only helps once, it doesn't belong in always-on context.
5. **Write it imperative and skimmable.** Short headings, bullet lists, one rule per line in the imperative ("Stage by explicit path", not "It is generally preferable that..."). Put the hardest rules first. Aim for a memory a person can read in under a minute; if it's over ~50 lines, you kept things that should have been cut.
6. **Place facts in the right tier.** Repo-specific facts → project `./CLAUDE.md` (committed, team-shared). Personal habits that apply across all your repos (preferred commit style, "explain before large refactors") → user `~/.claude/CLAUDE.md`. Machine-local, uncommitted notes → `./CLAUDE.local.md`. Never put a personal preference in the shared project file, or a repo command in user memory.
7. **State the freshness contract.** End the draft with a one-line note on what makes it go stale (commands renamed, directories moved) and the expectation that it's updated in the same PR that changes those facts — a wrong command in memory is worse than no command.

> [!WARNING]
> Do not paste the codebase into CLAUDE.md. Memory that duplicates code (full module lists, copied function signatures, exhaustive API surfaces) goes stale silently and burns context on every turn — and stale memory actively misleads, because the model trusts it over the file it didn't read. Keep facts that are stable and expensive to rediscover; let the model read everything else.

> [!CAUTION]
> Never write secrets, API keys, tokens, or internal URLs into CLAUDE.md — it is committed and shipped. If a command needs a secret, reference the env var name, not the value.

> [!TIP]
> Brevity is a feature, not a limitation. When two lines say the same thing, cut one. A memory the model reads fully every time beats a thorough one it learns to skim.

## Output

A ready-to-write `CLAUDE.md` draft tailored to this repo — Project Overview (2–3 lines), exact build/test/lint commands verified against the manifest, a five-line architecture map, hard rules, and known gotchas — plus a short rationale listing what was KEPT vs CUT and why, and a note on which facts (if any) belong in user memory instead. The skill proposes the file via Write; it does not run commands or alter code.
