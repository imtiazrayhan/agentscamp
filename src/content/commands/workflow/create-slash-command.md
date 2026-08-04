---
description: "Scaffold a new Claude Code slash command into .claude/commands/ — a valid Markdown file with frontmatter, a least-privilege allowed-tools allowlist, and a $ARGUMENTS-driven body of numbered steps ending in a Report."
argument-hint: "<what the command should do>"
allowed-tools: "Read, Write, Glob, Grep"
title: "Create Slash Command"
color: "purple"
topics: ["workflow-prompting"]
related: ["command:create-subagent", "command:create-skill", "command:plan-feature"]
featured: false
date: 2026-06-17
summary: "A slash command that writes another slash command into .claude/commands/<slug>.md: it derives a slug from your description, picks the minimum allowed-tools, and generates a valid file with frontmatter plus a $ARGUMENTS-driven body — numbered steps, an empty-args branch, and a final Report — then tells you exactly how to invoke it."
faq:
  - q: "Where does the new command file go?"
    a: "Project commands live in .claude/commands/<slug>.md (committed, shared with the team). Use ~/.claude/commands/<slug>.md for a personal command available in every repo. The filename — not any frontmatter field — becomes the command name."
  - q: "How does $ARGUMENTS work?"
    a: "Everything typed after the command name is substituted for the literal token $ARGUMENTS in the body at invocation time. A command must restate it, and explicitly handle the case where it is empty rather than inventing input."
---

## Scope

Treat `$ARGUMENTS` as the **purpose of the command you are about to create** — for example, "review a PR for security issues" or "summarize today's git log". Restate it in one sentence, then commit to a slug and a tool allowlist before writing anything.

If `$ARGUMENTS` is empty, ask one focused question: *"What should the new command do?"* Do not scaffold a placeholder command from a guessed purpose — an empty stub is worse than no file.

Your deliverable is one valid file at `.claude/commands/<slug>.md` plus instructions for running it. You write exactly one new file; you do not modify existing commands.

## Step 1 — Derive the slug and check for collisions

Turn the purpose into a short, kebab-case verb-phrase slug (`review-pr`, `summarize-log`, `audit-deps`) — that filename *is* the command name. Then `Glob` `.claude/commands/**/*.md` and `~/.claude/commands/**/*.md`.

- If `<slug>.md` already exists, stop and report it. Propose a distinct slug or ask whether to overwrite — never silently clobber a command the team relies on.
- To group related commands, use a subfolder: `.claude/commands/git/review.md` is invoked as `/git:review` (the folder becomes a `:` namespace).

> [!WARNING]
> Default to the **project** scope `.claude/commands/`, which is committed and shared. Only write to `~/.claude/commands/` if the user explicitly asks for a personal, all-repos command.

## Step 2 — Choose the minimum allowed-tools

Pick the smallest tool set the command's job actually needs — this is the command's permission boundary, and Claude cannot exceed it at runtime.

- Read-only analysis (review, summarize, explain): `Read, Grep, Glob`.
- Generates a file: add `Write`. Edits in place: add `Edit`.
- Needs to run commands (tests, git, build): add `Bash` — the heaviest grant; justify it.

Omit `allowed-tools` only if the command should inherit the session's full tool access; for a shareable command, prefer an explicit allowlist.

## Step 3 — Write the frontmatter

Emit only the keys Claude Code recognizes. A command frontmatter block uses:

```yaml
---
description: <one sentence — shown in the /help list>
argument-hint: <e.g. "<pr number>" — omit if the command takes no args>
allowed-tools: <comma list from Step 2 — omit to inherit>
model: <haiku|sonnet|opus — omit to inherit; set opus only for heavy reasoning>
---
```

> [!NOTE]
> The command name comes from the **filename**, not a `name:` key. There is no `name` field in command frontmatter — adding one is just dead text.

## Step 4 — Write the body

Structure the body the same way this command is structured. It must:

1. Open with a **Scope** section that restates `$ARGUMENTS` as the command's real input and defines the deliverable.
2. **Handle empty `$ARGUMENTS` explicitly** — ask one specific question instead of guessing.
3. Lay out the work as **numbered Steps** (`## Step 1 — …`), each concrete and referencing only the tools declared in `allowed-tools`.
4. Reference `$ARGUMENTS` wherever the user's input drives behavior.
5. End with a **## Report** section stating exactly what the command outputs (a written answer, a created path, a diff summary).

Keep instructions decision-dense: prefer "Grep for `TODO(` and list each with file:line" over "look for issues".

## Step 5 — Write the file and self-check

`Write` the assembled frontmatter + body to the chosen path. Before reporting, verify:

- YAML frontmatter is fenced by `---` lines and parses.
- Every tool the body tells Claude to use appears in `allowed-tools`.
- `$ARGUMENTS` appears in the body and the empty case is handled.
- There is a final Report section.

## Report

Report:

1. The **absolute path** of the file you created (or the collision you stopped on).
2. The exact **invocation**, including namespace if any: `/<slug> <args>` (e.g. `/review-pr 482` or `/git:review HEAD~1`).
3. The `allowed-tools` you granted and the one-line reason.

End with a reminder to commit the file (project scope) so the team picks it up, and a suggested first test invocation.
