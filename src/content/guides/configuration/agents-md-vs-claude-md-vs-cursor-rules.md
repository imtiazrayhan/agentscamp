---
title: "AGENTS.md vs CLAUDE.md vs Cursor Rules: Which Instruction File Do You Need?"
seoTitle: "AGENTS.md vs CLAUDE.md vs Cursor Rules: Which File Do You Need?"
description: "AGENTS.md, CLAUDE.md, Cursor .mdc rules, GEMINI.md, Copilot instructions, Codex, Devin Desktop and Cline compared: who reads what, nesting, and migration."
seoDescription: "AGENTS.md vs CLAUDE.md vs Cursor rules, plus GEMINI.md, Copilot instructions, Codex, Devin Desktop and Cline: who reads what, nesting rules, and how to migrate."
author: "Imtiaz Rayhan"
date: 2026-10-14
color: "green"
depth: standard
topics: ["workflow-prompting", "coding-languages"]
audience: ["developers"]
tags: ["instruction-files", "agents-md", "claude-md", "cursor-rules", "configuration"]
keywords: ["AGENTS.md vs CLAUDE.md", "CLAUDE.md vs cursor rules", "AGENTS.md vs cursorrules", "coding agent instruction files", "AGENTS.md Claude Code"]
summary: "One agent: use its native file (CLAUDE.md for Claude Code, .cursor/rules/*.mdc for Cursor, GEMINI.md for Gemini CLI). Several agents: make AGENTS.md the shared base. Codex, Cursor, Copilot, Devin Desktop and Cline read it natively, Gemini CLI via a setting, and Claude Code since v2.1.277 when no CLAUDE.md exists. Keep tool-specific files thin."
keyTakeaways:
  - "AGENTS.md is plain Markdown with no required fields, stewarded by the Agentic AI Foundation under the Linux Foundation, and read by Codex, Cursor, Copilot, Gemini CLI (via a setting), Devin Desktop, Cline and, since v2.1.277, Claude Code."
  - "CLAUDE.md is Claude Code's native file: project, user, local and managed scopes concatenated from the filesystem root down, @path imports, and path-scoped .claude/rules/*.md. Claude reads AGENTS.md only when no CLAUDE.md exists in or above the working directory, unless you change the Project instructions setting."
  - "Cursor project rules are .cursor/rules/*.mdc files with description, globs and alwaysApply frontmatter; a plain .md there is ignored. The four types are now named Always Apply, Apply Intelligently, Apply to Specific Files and Apply Manually, and .cursorrules has dropped out of the docs."
  - "Nesting semantics differ: AGENTS.md and Copilot say the nearest file wins, Codex and Claude Code concatenate root-down so later files override, Devin Desktop turns a subdirectory AGENTS.md into a glob rule, and Codex caps the chain at 32 KiB by default."
  - "Single-agent setup: the native file. Multi-agent team: AGENTS.md as the base, plus a thin native file only for what that tool alone needs, such as path-scoped Cursor rules or Claude-specific hooks and imports."
  - "Migration is mostly built in: Claude Code's /init reads Cursor and Copilot files (and AGENTS.md, Devin, Windsurf and Cline files with CLAUDE_CODE_NEW_INIT=1), /import handles Codex, Gemini and Cursor, and a symlink keeps old filenames working."
faq:
  - q: "Does Claude Code read AGENTS.md?"
    a: "Yes, natively since Claude Code v2.1.277 (September 18, 2026), but only when there is no CLAUDE.md, .claude/CLAUDE.md or CLAUDE.local.md in your working directory or any directory above it. If a CLAUDE.md exists, Claude reads only the CLAUDE.md files unless you set Project instructions to claude-md-and-agents-md in /config, or add an @AGENTS.md import to CLAUDE.md. AGENTS.local.md, AGENTS.override.md and anything under .agents/ are not read."
  - q: "Does Cursor read CLAUDE.md?"
    a: "Cursor's rules documentation does not mention CLAUDE.md at all. It reads .cursor/rules/*.mdc project rules, User Rules, Team Rules, and AGENTS.md in the project root and subdirectories. If you want one file shared between Cursor and Claude Code, AGENTS.md is the one both read."
  - q: "Is .cursorrules still supported?"
    a: "The current Cursor rules page no longer mentions .cursorrules. The last documented wording, from July 2025, said it was still supported but deprecated in favor of Project Rules. No primary source states that reading it was removed, so treat it as undocumented rather than confirmed dead, and migrate to .cursor/rules or AGENTS.md. Cline, for what it is worth, still auto-detects .cursorrules."
  - q: "Can one AGENTS.md serve Claude Code, Cursor, Codex and Copilot?"
    a: "For the shared instructions, yes: Codex, Cursor and Copilot read it natively, and Claude Code reads it when no CLAUDE.md exists. Keep it plain Markdown, since AGENTS.md has no frontmatter, and put tool-specific behavior in that tool's own file: glob-scoped rules in .cursor/rules, path-scoped rules in .claude/rules, Copilot path instructions in .github/instructions."
  - q: "How do I convert Cursor rules to CLAUDE.md or AGENTS.md?"
    a: "Run /init in Claude Code: it reads .cursor/rules and .cursorrules (and .github/copilot-instructions.md) and folds the relevant parts into the generated CLAUDE.md, or suggests improvements if one exists. /import cursor appends a one-time copy instead. For a repeatable, reviewable conversion across all of these formats, the instruction-file-migrator skill and the /convert-rules command on this site do the mapping and flag what does not translate, such as glob scoping that AGENTS.md cannot express."
sources:
  - title: "AGENTS.md"
    url: "https://agents.md/"
    publisher: "Agentic AI Foundation"
  - title: "Linux Foundation announces the formation of the Agentic AI Foundation"
    url: "https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation"
    publisher: "The Linux Foundation"
  - title: "How Claude remembers your project"
    url: "https://code.claude.com/docs/en/memory"
    publisher: "Anthropic"
  - title: "Rules (Cursor docs)"
    url: "https://cursor.com/docs/context/rules"
    publisher: "Cursor"
  - title: "GEMINI.md context files (Gemini CLI docs)"
    url: "https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md"
    publisher: "Google (GitHub)"
  - title: "Adding repository custom instructions for GitHub Copilot"
    url: "https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions"
    publisher: "GitHub"
  - title: "Custom instructions support in Copilot"
    url: "https://docs.github.com/en/copilot/reference/custom-instructions-support"
    publisher: "GitHub"
  - title: "Custom instructions with AGENTS.md (Codex)"
    url: "https://developers.openai.com/codex/guides/agents-md"
    publisher: "OpenAI"
  - title: "Memories and Rules (Devin Desktop docs)"
    url: "https://docs.windsurf.com/windsurf/cascade/memories"
    publisher: "Cognition"
  - title: "Cline Rules"
    url: "https://docs.cline.bot/features/cline-rules"
    publisher: "Cline"
  - title: "Claude Code CHANGELOG"
    url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md"
    publisher: "Anthropic (GitHub)"
related: ["guide:claude-md-best-practices", "guide:codex-agents-md", "glossary:agents-md", "glossary:claude-md", "glossary:cursor-rules", "guide:claude-code-memory-context", "tool:cursor", "tool:codex-cli", "tool:gemini-cli", "tool:github-copilot", "skill:instruction-file-migrator", "command:convert-rules", "tool:claude-code", "tool:windsurf", "tool:cline"]
---

If you use one [coding agent](/glossary/coding-agent), use its native file: `CLAUDE.md` for Claude Code, `.cursor/rules/*.mdc` for Cursor, `GEMINI.md` for Gemini CLI. If your team runs several agents against the same repository, make `AGENTS.md` the shared base. Codex, Cursor, GitHub Copilot, Devin Desktop and Cline read it natively, Gemini CLI reads it through one setting, and Claude Code reads it since v2.1.277 whenever no `CLAUDE.md` exists. Keep each tool's own file thin, limited to what only it can express, such as glob-scoped rules. The rest of this guide is the detail: what each file is, how each tool nests files, and how to migrate.

## The files, one by one

### AGENTS.md

[AGENTS.md](/glossary/agents-md) is "a simple, open format for guiding coding agents", pitched on its site as a README for agents. It is plain Markdown: "Are there required fields? No. AGENTS.md is just standard Markdown. Use any headings you like; the agent simply parses the text you provide." It was released by OpenAI in August 2025 and is now stewarded by the Agentic AI Foundation under the Linux Foundation, whose charter was adopted on December 8, 2025; the site says it is used by over 60,000 open-source projects.

Nesting is part of the format: "place another AGENTS.md inside each package. Agents automatically read the nearest file in the directory tree, so the closest one takes precedence," and on conflicts, "The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything." The site's compatibility list has 23 entries, from Codex, Cursor and Gemini CLI to Copilot, VS Code, Zed, Devin and Windsurf; Claude Code and Cline are not on it, even though both read the file.

The [Codex AGENTS.md guide](/guides/configuration/codex-agents-md) has a starter template and a verification workflow.

### CLAUDE.md

[CLAUDE.md](/glossary/claude-md) is Claude Code's instruction file, and Anthropic's memory page now carries the title "How Claude remembers your project." Four scopes load in order from broadest to most specific: a managed policy file deployed by an organization, `~/.claude/CLAUDE.md` for all your projects, `./CLAUDE.md` or `./.claude/CLAUDE.md` for the project (committed and shared), and `./CLAUDE.local.md` for personal project notes you add to `.gitignore`.

Discovery walks up: "Claude Code loads `CLAUDE.md` and `CLAUDE.local.md` from your current working directory and every directory above it." Nothing overrides anything; "All discovered files are concatenated into context rather than overriding each other," ordered from the filesystem root down to your working directory, with each `CLAUDE.local.md` appended after its `CLAUDE.md`. Files in subdirectories load on demand, once Claude reads, writes or edits a file there.

Two features have no equivalent in the other formats. `@path/to/import` pulls other files into context at launch, relative or absolute, up to four hops deep; a path in backticks is not imported, and an import that resolves outside the working directory triggers a one-time approval dialog. And `.claude/rules/*.md` holds rule files that load at launch, or only when Claude touches a file matching a `paths:` glob in their frontmatter.

Two caveats worth knowing. The content "is delivered as a user message after the system prompt, not as part of the system prompt itself," and Claude treats it "as context, not enforced configuration," so anything that must always happen belongs in a hook, not a sentence. And the old `#` shortcut for quick memory entries was removed in v2.0.70 in mid-December 2025; today you ask Claude to edit CLAUDE.md, open it with `/memory`, or let the separate auto-memory system take notes. [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices) covers what to put in the file; [memory and context](/guides/configuration/claude-code-memory-context) covers the loading mechanics.

### Cursor rules

[Cursor rules](/glossary/cursor-rules) come in three layers. **Project Rules** "live in `.cursor/rules` as `.mdc` files and are version-controlled." Each has frontmatter with `description`, `globs` and `alwaysApply`, and "A plain `.md` file in `.cursor/rules` is ignored by the rules system because it has no frontmatter." The four rule types have been renamed since mid-2025 and are now **Always Apply** (every chat session), **Apply Intelligently** (the agent decides from the description), **Apply to Specific Files** (a glob matches), and **Apply Manually** (`@`-mentioned in chat); the earlier names were Always, Agent Requested, Auto Attached and Manual. **User Rules** are global preferences set under Customize → Rules. **Team Rules** are free-form text managed from the Team or Enterprise dashboard, with glob support and an enforce toggle; precedence is "Team Rules → Project Rules → User Rules," earlier sources winning on conflict.

Three things changed. The `.cursorrules (Legacy)` section is gone from the docs; the last documented wording, from July 2025, called it "still supported, but deprecated." The nested `.cursor/rules` section is gone too; nesting is now documented only for AGENTS.md, which Cursor "supports in the project root and subdirectories," combining nested files with more specific instructions taking precedence. And `/Generate Cursor Rules` was removed in Cursor 2.0; the current command is `/create-rule`. One detail that trips people: a file mention inside a rule, such as `@migration-template.sql`, tells the agent where to look but does not inline the file. CLAUDE.md is not mentioned anywhere on Cursor's rules page.

### GEMINI.md

[Gemini CLI](/tools/gemini-cli) loads a global `~/.gemini/GEMINI.md`, then `GEMINI.md` files from the working directory and its parents up to the project root (a `.git` directory), then subdirectory files just in time when a tool touches that directory. Contents are concatenated with separators that show each file's origin, and "Content from files lower in this list (more specific) typically overrides or supplements content from files higher up." `@path/to/file.md` imports are supported. The filename is a setting: `context.fileName` accepts a string or an array, so `["AGENTS.md", "CONTEXT.md", "GEMINI.md"]` makes Gemini read all three. `/memory list`, `/memory refresh` and `/memory show` manage the loaded context; `/memory add` is no longer in the current reference.

### GitHub Copilot instructions

[Copilot](/tools/github-copilot) has three kinds. **Repository-wide** instructions live in `.github/copilot-instructions.md`. **Path-specific** instructions are `.github/instructions/NAME.instructions.md` files with an `applyTo` glob in frontmatter and an optional `excludeAgent` of `code-review` or `cloud-agent`. **Agent instructions** are "one or more `AGENTS.md` files, stored anywhere within the repository," where "the nearest `AGENTS.md` file in the directory tree will take precedence," or "a single `CLAUDE.md` or `GEMINI.md` file stored in the root of the repository." The cloud agent (formerly the coding agent), code review, Copilot CLI and Copilot Chat in VS Code read agent instructions; on GitHub.com, Copilot Chat ranks path-specific above repository-wide above agent instructions, while most other surfaces combine files without a defined order.

### Codex

[Codex](/tools/codex-cli) reads `AGENTS.md` before doing any work. Discovery is global first (`~/.codex/AGENTS.override.md` if it exists, otherwise `~/.codex/AGENTS.md`), then from the project root down to the current directory, checking each directory for `AGENTS.override.md`, then `AGENTS.md`, then any names in `project_doc_fallback_filenames`, and "Codex includes at most one file per directory." Files are concatenated root-down, so "Files closer to your current directory override earlier guidance because they appear later in the combined prompt." Codex "stops adding files once the combined size reaches the limit defined by `project_doc_max_bytes` (32 KiB by default)," and "Filenames not on this list are ignored for instruction discovery," so a `CLAUDE.md` is invisible to Codex unless you add it to the fallback list.

### Devin Desktop (formerly Windsurf)

The Windsurf docs are now branded Devin Docs, and the product is Devin Desktop. Workspace rules go in `.devin/rules/*.md` (preferred) or `.windsurf/rules/*.md` (fallback), one file per rule, limited to 12,000 characters each; the legacy single-file `.windsurfrules` is still read; the global file `~/.codeium/windsurf/memories/global_rules.md` is limited to 6,000 characters. Each rule declares a `trigger` in frontmatter: `always_on`, `model_decision`, `glob`, or `manual`. `AGENTS.md` flows into the same engine with the mode inferred from location: a root file is always-on, a subdirectory file becomes a glob rule for `<directory>/**`.

### Cline

[Cline](/tools/cline) reads workspace rules from `.clinerules/` or `.cline/rules/` and global rules from `~/Documents/Cline/Rules`; "Workspace rules take precedence when they conflict with global rules." Every rule has a toggle, and YAML frontmatter makes a rule path-conditional. Cline also auto-detects `.cursorrules` and `.windsurfrules`, and reads `AGENTS.md` plus a global `~/.agents/AGENTS.md`.

## Comparison table

| File | Read by | Scope / nesting | Frontmatter | Path-scoping |
| --- | --- | --- | --- | --- |
| `AGENTS.md` | Codex, Cursor, Copilot, Gemini CLI (via `context.fileName`), Devin Desktop, Cline, Claude Code (v2.1.277+, when no CLAUDE.md) | Root plus nested files; spec says the closest file wins, Codex and Claude Code concatenate root-down | None | Only by placing a file in a subdirectory |
| `CLAUDE.md` family | Claude Code; Copilot (single root file) | Managed, user, project, local; concatenated root to cwd; subdirectories on demand | None in CLAUDE.md; `paths:` in `.claude/rules/*.md` | `.claude/rules/*.md` with `paths:` globs; `@path` imports |
| `.cursor/rules/*.mdc` | Cursor | Project-level, plus Team and User rules; nesting no longer documented | `description`, `globs`, `alwaysApply` | `globs` (Apply to Specific Files) |
| `GEMINI.md` | Gemini CLI; Copilot (single root file) | Global, project root and ancestors, subdirectories just in time; concatenated with origin separators | None | By directory; `@path` imports |
| `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` | Copilot | Repository-wide plus path-specific files | `applyTo`, `excludeAgent` | `applyTo` globs |
| `.devin/rules/*.md` (`.windsurf/rules/*.md`, `.windsurfrules`) | Devin Desktop | Workspace plus global file; parent directories to the git root | `trigger`, `description`, `globs` | `glob` trigger; 12,000-character limit per rule |
| `.clinerules/` or `.cline/rules/` | Cline | Workspace plus global; workspace wins on conflict | Optional YAML for conditional rules | Path-conditional frontmatter |

As of October 2026, Cursor, Devin Desktop and Cline do not mention CLAUDE.md in their docs, Codex ignores it unless it is in the fallback list, and Claude Code does not read `AGENTS.local.md`, `AGENTS.override.md` or anything under `.agents/`.

## Recommendation: single agent vs. a multi-agent team

**One agent.** Use its native file and nothing else. You get the features the shared format lacks: imports and path-scoped rules in Claude Code, glob and manual rules in Cursor, `applyTo` in Copilot. A second file only drifts.

**Several agents on one repo.** Put the shared material in `AGENTS.md`: the project map, build and test commands, conventions, and the checks that define done. Then wire each tool:

- **Claude Code:** either rely on native reading (v2.1.277 or later and no CLAUDE.md anywhere above the working directory) or keep a thin `CLAUDE.md` whose first line is `@AGENTS.md`, followed by Claude-only notes. The docs still recommend the import as the fallback; it never makes Claude read `AGENTS.md` twice. To read both files side by side without an import, set Project instructions to `claude-md-and-agents-md` in `/config`.
- **Cursor:** AGENTS.md is the documented alternative "for straightforward use cases"; add `.mdc` rules only for glob-scoped or manual rules.
- **Copilot, Codex, Devin Desktop, Cline:** nothing to do; they read AGENTS.md as is. For Gemini CLI, add `AGENTS.md` to `context.fileName`.

Mind the nesting semantics. The AGENTS.md spec and Copilot say the nearest file wins; Codex and Claude Code concatenate from the root down so later files override on conflict; Devin Desktop scopes a subdirectory file to that directory; Codex stops at 32 KiB. Write nested files so they make sense under both readings: specific additions, not contradictions of the root file.

## Migration

Most of the work is built into the tools:

- **Into Claude Code.** "Running `/init` reads other tools' instruction files and incorporates the relevant parts into the generated `CLAUDE.md`": Cursor rules in `.cursor/rules/` or `.cursorrules`, and Copilot's `.github/copilot-instructions.md`. With `CLAUDE_CODE_NEW_INIT=1` set, it also reads `AGENTS.md`, `.devin/rules/`, `.windsurf/rules/` or `.windsurfrules`, and `.clinerules`. `/import codex`, `/import gemini` and `/import cursor` append a one-time copy of the other tool's instruction files to CLAUDE.md and carry over MCP servers, commands, subagents and skills. `/doctor prompt-audit` then checks CLAUDE.md, CLAUDE.local.md and AGENTS.md for stale references and contradictions.
- **Into AGENTS.md.** The site's own advice for an older filename is a rename plus a symlink: `mv AGENT.md AGENTS.md && ln -s AGENTS.md AGENT.md`. The same trick works in the other direction for Claude Code, `ln -s AGENTS.md CLAUDE.md`, with the docs' caveats about Windows symlinks and the Edit tool.

For a repeatable conversion that keeps the semantics straight, use the [instruction-file-migrator](/skills/workflow/instruction-file-migrator) skill or run the [/convert-rules](/commands/workflow/convert-rules) command. Both map each format's scoping onto the target's and flag what cannot be expressed.
