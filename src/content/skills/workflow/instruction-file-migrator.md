---
name: "instruction-file-migrator"
description: "Convert and synchronize agent instruction files between formats: CLAUDE.md with @imports and CLAUDE.local.md, AGENTS.md nested per directory, Cursor rules (.cursor/rules/*.mdc with description, globs, and alwaysApply frontmatter, plus the legacy .cursorrules), GEMINI.md, GitHub Copilot's copilot-instructions.md and *.instructions.md with applyTo, Windsurf rules, and .clinerules. It preserves each rule's wording, keeps always-on rules separate from path-scoped ones, and reports every rule that has no one-to-one equivalent in the target. Use when a team runs more than one coding agent and the files have drifted, or when switching tools."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Write, Edit"
user-invocable: true
color: "cyan"
date: 2026-10-14
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["claude", "claude-md", "agents-md", "cursor-rules", "configuration", "developers"]
featured: false
related: ["command:convert-rules", "guide:claude-md-best-practices", "guide:codex-agents-md", "glossary:agents-md", "skill:agent-memory-designer", "skill:claude-settings-auditor", "guide:claude-code-settings-permissions"]
seoDescription: "A Claude skill that converts and syncs CLAUDE.md, AGENTS.md, Cursor rules, GEMINI.md, Copilot instructions, and .clinerules without losing path scoping."
summary: "This skill parses an instruction file into rules with their scope (always-on, path-scoped, on-demand, or manual), renders them in the target format, keeps personal files out of shared ones, and lists every rule the target cannot hold one-to-one. It covers CLAUDE.md, AGENTS.md, Cursor rules, GEMINI.md, Copilot, Windsurf, and Cline, and diffs files for drift."
---

Teams rarely run one coding agent. Someone uses Claude Code, someone uses Cursor, the CI job runs Codex, and each tool reads its own instruction file. Within a month the files disagree about the test command. This skill treats the rules as the source and the files as renderings: it parses every rule out of a source file with its scope (always loaded, loaded for matching paths, loaded on request, or manual), writes the target format with the same wording, and tells you which rules could not be carried over because the target has no place for them. It converts in both directions and can diff two existing files to show drift.

## When to use this skill

- You adopted a second agent and want its instruction file to say what the first one says.
- A `.cursorrules` file from before Cursor's rules directory needs to become `.cursor/rules/*.mdc` or a `CLAUDE.md`.
- `CLAUDE.md` and `AGENTS.md` both exist, both are edited by hand, and nobody knows which is current.

## When NOT to use this skill

- You have no instruction file yet: the [agent-memory-designer](/skills/workflow/agent-memory-designer) skill explores the repository and writes a CLAUDE.md from its real commands and gotchas.
- One file, one target, right now: the [/convert-rules](/commands/workflow/convert-rules) command.
- Permission rules, hooks, and MCP servers live in settings files, not instruction files; the [claude-settings-auditor](/skills/workflow/claude-settings-auditor) skill covers those.

## Instructions

1. **Inventory the source files and their load semantics.** The formats differ in where they live and how a rule becomes active:

   | Format | Always-on | Path-scoped | On demand or manual | Nesting and imports |
   | --- | --- | --- | --- | --- |
   | [CLAUDE.md](/glossary/claude-md) | `CLAUDE.md` body; `~/.claude/CLAUDE.md` for the user | `.claude/rules/*.md` loaded for matching paths | none | nested `CLAUDE.md` per directory; `@path` imports; `CLAUDE.local.md` for personal, uncommitted rules |
   | [AGENTS.md](/glossary/agents-md) | file body | none | none | nested per directory, closest file wins; plain Markdown, no frontmatter |
   | [Cursor rules](/glossary/cursor-rules) | `.cursor/rules/*.mdc` with `alwaysApply: true` | `globs:` in frontmatter | `description:` only (the agent decides), or neither (manual mention) | nested `.cursor/rules` per directory; legacy single `.cursorrules` |
   | GEMINI.md | file body, global and project | none | none | hierarchical per directory; `@file` imports |
   | Copilot | `.github/copilot-instructions.md` | `.github/instructions/*.instructions.md` with `applyTo:` | none | none |
   | Windsurf | `.windsurf/rules/*.md` with an always-on trigger | glob trigger | model-decision or manual trigger | legacy `.windsurfrules`; per-file size caps |
   | Cline | `.clinerules` file or every file in `.clinerules/` | none | none | none |

2. **Parse the source into rule units.** Split on headings and list items. For each rule record the text verbatim, its section, its scope from the table, its globs if any, and whether it came from a personal file (`CLAUDE.local.md`, a user-level file) or a shared one. Keep code blocks and commands byte-for-byte; a rewritten command is a bug.
3. **Decide the mapping before writing.** Always-on rules go to the target's always-on surface. Path-scoped rules go to the target's path mechanism when it has one (Cursor `globs`, Copilot `applyTo`, a Windsurf glob trigger, Claude's `.claude/rules/`); when it has none (AGENTS.md, GEMINI.md, Cline), render them under a heading that names the paths ("## Rules for `packages/api/**`") so a reader still sees the scope, and list them in the report as "scope became advisory". Cursor's description-only rules have no equivalent elsewhere: ask whether to promote them to always-on or pin them to paths. Never make them always-on silently.
4. **Handle imports and personal files.** Inline `@path` imports when the target has no import syntax, with a comment naming the origin file. Never merge `CLAUDE.local.md` or a user-level file into a shared, committed target; write those rules to the target's personal equivalent if one exists, otherwise leave them out and say so.
5. **Write the target.** Same section order, same wording, same commands. Frontmatter per the target: Cursor `description`, `globs`, `alwaysApply`; Copilot `applyTo`; Windsurf trigger and globs. For nested formats, write one file per directory that had scoped rules. For targets with size caps, split by section and report the split.
6. **Sync mode.** When both files already exist, parse both into rule units, match by normalized text, and report rules present in one but not the other, rules whose wording differs, and rules whose scope differs. Propose a direction based on which file git history shows as newer, and apply only after the user picks.
7. **Report what did not map.** For each: the rule, its source scope, what the target offered, and what you did. This list is the point of the skill; a conversion that hides it cannot be trusted.

> [!WARNING]
> Personal files carry local paths, machine names, and sometimes credentials. A migration that folds `CLAUDE.local.md` into a committed `AGENTS.md` publishes them. Keep the personal and shared layers separate in every target, and say when a target has no personal layer at all.

> [!TIP]
> Pick one canonical source and generate the rest. If the team edits `CLAUDE.md`, treat `AGENTS.md` and the Cursor rules as build outputs and re-run this skill when the source changes. What belongs in the source is covered in [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices); what belongs in a tool-neutral AGENTS.md is in [Codex and AGENTS.md](/guides/configuration/codex-agents-md).

## Output

The target file or files, written to their conventional paths; a mapping table with columns Rule (first line), Source scope, Target placement, and Status (mapped, advisory, asked, left out); the list of rules that did not map one-to-one; and, in sync mode, the drift report with a proposed direction.
