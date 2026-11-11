---
description: "Convert one agent instruction file to another format (for example .cursorrules to CLAUDE.md, or CLAUDE.md to AGENTS.md), preserving wording and path scoping, and list the rules that did not map."
seoDescription: "/convert-rules converts one agent instruction file to another format (.cursorrules, CLAUDE.md, AGENTS.md, Copilot, Cline) and lists the rules that did not map."
date: 2026-10-15
argument-hint: "<source file> <target format>"
allowed-tools: "Read, Glob, Write"
title: "Convert Rules"
color: "purple"
topics: ["workflow-prompting"]
audience: ["developers"]
featured: false
related: ["skill:instruction-file-migrator", "guide:claude-md-best-practices", "guide:codex-agents-md", "glossary:agents-md", "skill:agent-memory-designer", "command:create-skill"]
summary: "A slash command that converts one agent instruction file into another format: it detects the source (CLAUDE.md, AGENTS.md, Cursor rules, GEMINI.md, Copilot, Windsurf, Cline), parses it into rules with their scope, writes the target at its conventional path keeps personal rules out of shared files, and reports every rule that did not map."
---

Convert one instruction file into the format another coding agent reads, without losing the wording or the scoping. This command is the single-file version of the [instruction-file-migrator](/skills/workflow/instruction-file-migrator) skill: one source, one target, one report of what did not carry over. Use the skill when several files must be kept in sync or when two existing files need a drift report.

## Scope

`$ARGUMENTS` is `<source file> <target format>`.

- **Source file**: a path. Detect the format from the path and content: `CLAUDE.md` or `CLAUDE.local.md` (with `@path` imports), `AGENTS.md`, `.cursor/rules/*.mdc` (frontmatter with `description`, `globs`, `alwaysApply`) or legacy `.cursorrules`, `GEMINI.md`, `.github/copilot-instructions.md` or `*.instructions.md` (with `applyTo`), `.windsurf/rules/*.md` or `.windsurfrules`, `.clinerules` or a file inside `.clinerules/`.
- **Target format**: one of `claude-md`, `agents-md`, `cursor`, `gemini-md`, `copilot`, `windsurf`, `cline`.

If the source is missing, ask for it. If the target is missing or not in the list, print the list and stop. If the target file already exists, show what would change and ask before overwriting. If the source is a personal file (`CLAUDE.local.md`, a user-level file), refuse to write it into a shared target and offer the target's personal equivalent instead.

## Step 1 — Parse the source into rules

`Read` the file and split it on headings and list items. For each rule record the text verbatim (commands and code blocks byte-for-byte), its section, and its scope: always-on, path-scoped (with its globs), on-demand (Cursor `description` with `alwaysApply: false` and no globs), or manual. Resolve `@path` imports in a CLAUDE.md by reading the imported files and marking their rules with the origin path.

## Step 2 — Map scope to the target

| Target | Always-on rules go to | Path-scoped rules go to | On-demand rules |
| --- | --- | --- | --- |
| `claude-md` | `CLAUDE.md` body | `.claude/rules/<name>.md` | ask: promote or scope |
| `agents-md` | `AGENTS.md` body | a heading naming the paths, or a nested `AGENTS.md` in that directory | ask |
| `cursor` | `.cursor/rules/<name>.mdc` with `alwaysApply: true` | `.cursor/rules/<name>.mdc` with `globs:` | `description:` only |
| `gemini-md` | `GEMINI.md` body | a heading naming the paths, or a nested `GEMINI.md` | ask |
| `copilot` | `.github/copilot-instructions.md` | `.github/instructions/<name>.instructions.md` with `applyTo:` | ask |
| `windsurf` | `.windsurf/rules/<name>.md`, always-on trigger | same file with a glob trigger | model-decision trigger |
| `cline` | `.clinerules/<name>.md` | a heading naming the paths | ask |

Never promote an on-demand rule to always-on silently; list it and ask. When a target has no path mechanism, keep the paths visible in a heading so a reader still knows the scope, and mark the rule "advisory" in the report.

## Step 3 — Write the target

Same section order, same wording. Add only the frontmatter the target needs. Drop rules that name another tool's features ("use Composer", "run /review") and list them as left out; [AGENTS.md](/glossary/agents-md) in particular is read by several agents and should stay tool-neutral. Write to the conventional path from the table; create the directory if needed.

> [!WARNING]
> Personal files carry local paths and sometimes credentials. This command never writes `CLAUDE.local.md` or a home-directory file into a committed target. If you want those rules shared, edit them into the shared source first, deliberately.

## Step 4 — Report

```markdown
## /convert-rules: .cursorrules -> claude-md

Source: .cursorrules (legacy single file), 14 rules, all always-on
Written: CLAUDE.md (12 rules), .claude/rules/ui.md (1 rule, scoped to src/ui/**)

| Rule (first line)                                 | Source scope | Target                       | Status             |
| ------------------------------------------------- | ------------ | ---------------------------- | ------------------ |
| Run `pnpm test --filter <pkg>` before committing  | always       | CLAUDE.md > Commands         | mapped             |
| Components in src/ui use named exports only       | always       | .claude/rules/ui.md          | mapped, scope inferred (confirm glob) |
| Prefer the Composer agent for refactors           | always       | (none)                       | left out: tool-specific |

Did not map one-to-one: 1. Scope inferred: 1. Asked: 0.
```

## Step 5 — Suggest the follow-up

If the repository now has two instruction files, say which one should be the source of truth and point to the [instruction-file-migrator](/skills/workflow/instruction-file-migrator) skill's sync mode for keeping them aligned. What belongs in the Claude file is covered in [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices); what belongs in the Codex file is covered in [Codex and AGENTS.md](/guides/configuration/codex-agents-md). If the source was thin, the [agent-memory-designer](/skills/workflow/agent-memory-designer) skill writes a better one from the repository itself.
