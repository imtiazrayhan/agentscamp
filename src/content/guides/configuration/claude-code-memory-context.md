---
title: "Managing Claude Code Memory & Context: CLAUDE.md, /compact, and Auto-Memory"
seoTitle: "Claude Code Memory & Context: CLAUDE.md, /compact, Auto-Memory"
description: "How Claude Code remembers: every CLAUDE.md scope and load order, AGENTS.md, path-scoped rules, auto memory limits, and what survives /compact."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "memory", "context", "claude-md", "configuration"]
featured: false
summary: "Claude Code loads CLAUDE.md files by scope at launch, loads subdirectory files and path-scoped rules on demand, and keeps its own auto memory: a MEMORY.md index read up to 200 lines or 25KB. /context shows what fills the window, /compact summarizes the conversation and re-injects root CLAUDE.md and auto memory from disk, and /clear starts over."
keyTakeaways:
  - "Two different problems: context is what the model sees right now (finite, per session); memory is what persists across sessions (CLAUDE.md, rules, auto memory). Manage them separately."
  - "CLAUDE.md files are concatenated, not overridden: managed policy first, then files from the filesystem root down to your working directory, with CLAUDE.local.md appended after CLAUDE.md at each level. Subdirectory files load on demand."
  - "Path-scoped rules (.claude/rules/*.md with paths: frontmatter) load only when Claude touches matching files. @imports organize a long CLAUDE.md but do not save context, because imported files load with it."
  - "Auto memory is a per-repository folder with a MEMORY.md index (first 200 lines or 25KB loaded at session start) plus topic files read on demand. It is machine-local and shared across worktrees."
  - "After /compact, the project-root CLAUDE.md, unscoped rules and auto memory are re-injected from disk. Conversation-only instructions, nested CLAUDE.md files and path-scoped rules are summarized away until they reload."
  - "The old # quick-memory prefix is not in the current docs. Ask Claude to remember something (auto memory) or say 'add this to CLAUDE.md'."
howtoSteps:
  - name: "Audit with /context"
    text: "Run /context (or /context all for the per-item breakdown) to see what is consuming the window: system prompt, memory files, MCP tools, skills, conversation. Check that the CLAUDE.md files you expect appear under Memory files."
  - name: "Trim CLAUDE.md to invariants"
    text: "Target under 200 lines per CLAUDE.md file: build commands, conventions, hard constraints. Move multi-step procedures into skills, which load when invoked. Do not rely on @imports to save context; imported files load at launch with the file that imports them."
  - name: "Scope the rest by path"
    text: "Split per-area instructions into .claude/rules/*.md with paths: frontmatter (for example src/**/*.tsx) so frontend rules load only when Claude reads or edits frontend files."
  - name: "Compact deliberately, not desperately"
    text: "Do not wait for auto-compaction at the window's edge. At a natural milestone, run /compact with focus instructions, such as '/compact keep the failing test output and the migration plan', so the summary preserves what the next phase needs."
  - name: "Promote decisions to a file"
    text: "When something should outlive the session, tell Claude to remember it (it goes to auto memory) or say 'add this to CLAUDE.md'. Open /memory to review and edit what is stored."
faq:
  - q: "What is CLAUDE.md and where does it go?"
    a: "CLAUDE.md is the instruction file Claude Code reads at the start of every session. It exists at four scopes: a managed policy file deployed by an admin, ~/.claude/CLAUDE.md for your personal defaults, the project's ./CLAUDE.md or ./.claude/CLAUDE.md checked into the repo, and ./CLAUDE.local.md for personal, gitignored notes. Files above your working directory load at launch; CLAUDE.md files in subdirectories load when Claude reads, writes or edits a file there."
  - q: "What's the difference between /clear and /compact?"
    a: "/clear starts a new conversation with empty context (aliases /reset and /new); the old one stays reachable through /resume. /compact summarizes the current conversation in place and takes optional focus instructions, like /compact focus on the API changes. Use /clear between unrelated tasks and /compact in the middle of one."
  - q: "Does Claude Code remember things between sessions?"
    a: "Yes, three ways: what you write in CLAUDE.md and .claude/rules/ (explicit, versioned), auto memory (Claude's own notes under ~/.claude/projects/<project>/memory/, with a MEMORY.md index loaded each session), and past conversations reachable via /resume. Auto memory is machine-local: it is not shared across machines or cloud environments."
  - q: "What survives /compact?"
    a: "The system prompt, the project-root CLAUDE.md, rules without paths: frontmatter and auto memory are all re-injected from disk. Up to five recently modified files Claude read or edited are re-read. The conversation itself is summarized, and nested CLAUDE.md files and path-scoped rules drop out until Claude touches a matching file again. An instruction given only in chat can be lost."
  - q: "Does the # shortcut still add to Claude Code memory?"
    a: "The current memory and interactive-mode docs no longer list a # prefix; the documented quick-input prefixes are ! for shell mode and @ for file mentions. To save something, ask in plain language, such as 'remember that the API tests require a local Redis instance', and Claude writes it to auto memory. To put it in CLAUDE.md instead, say 'add this to CLAUDE.md' or edit the file through /memory."
  - q: "Does Claude Code read AGENTS.md?"
    a: "Yes. From Claude Code v2.1.277, Claude reads a repository's AGENTS.md as project instructions when there is no CLAUDE.md, .claude/CLAUDE.md or CLAUDE.local.md in the working directory or above it. If both exist, only the CLAUDE.md files load by default; set Project instructions to claude-md-and-agents-md in /config to load both, or put an @AGENTS.md import in CLAUDE.md."
related: ["guide:claude-md-best-practices", "guide:context-engineering", "guide:claude-code-settings-permissions", "guide:claude-code-hooks", "guide:claude-code-tips", "guide:parallel-claude-code-worktrees", "tool:claude-code"]
audience: ["developers"]
---

Claude Code has two resources that get conflated: **context**, what the model can see right now in a finite per-session window, and **memory**, what persists when the session ends. Long sessions degrade when context fills with noise; new sessions start cold when nothing was persisted. Below is the map of both systems and the commands that move things between them, checked against the Claude Code docs in November 2026. For *what to write* in a CLAUDE.md, see [CLAUDE.md Best Practices](/guides/configuration/claude-md-best-practices).

## The memory layers

### CLAUDE.md, by scope

| Scope | Location | Notes |
| --- | --- | --- |
| Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux/WSL `/etc/claude-code/CLAUDE.md`, Windows `C:\Program Files\ClaudeCode\CLAUDE.md` | Org-wide; cannot be skipped with `claudeMdExcludes` |
| User | `~/.claude/CLAUDE.md` | Your defaults, every project |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Checked in; the team contract |
| Local | `./CLAUDE.local.md` | Personal; add it to `.gitignore` |
| Subdirectory | `subdir/CLAUDE.md` | **On demand**: loads when Claude reads, writes or edits a file there |

How they combine matters more than the list:

- **Files are concatenated, never overridden.** Claude Code loads `CLAUDE.md` and `CLAUDE.local.md` from your working directory and every directory above it, ordered from the filesystem root down, so the file closest to where you launched is read last. Within a directory, `CLAUDE.local.md` is appended after `CLAUDE.md`. Managed content loads before user and project files.
- **Subdirectory files cost nothing until used.** A `packages/api/CLAUDE.md` loads once Claude touches a file in `packages/api/`. On-demand files have a per-file limit (40,000 characters on a 200K context window); past it, Claude gets only the start plus a note to read the rest.
- **Launch-time files load whole** as long as each is 4 MiB or smaller. The 200-line figure for CLAUDE.md is a target for adherence, not a cutoff.
- **Imports organize; they do not defer.** `@docs/git-workflow.md` pulls another file in, relative to the importing file, nesting up to four hops. Imported files load alongside the CLAUDE.md that references them, so splitting a long file into imports does not reduce context.
- **HTML comments are free.** Block-level `<!-- maintainer notes -->` are stripped before the file reaches the model.
- **It is guidance, not enforcement.** CLAUDE.md arrives as a user message after the system prompt. For a rule that must hold regardless of what Claude decides, use a [hook](/guides/configuration/claude-code-hooks) or a permission rule.

In a monorepo where other teams' files get picked up, skip them with `claudeMdExcludes` in settings:

```json
{
  "claudeMdExcludes": [
    "**/monorepo/CLAUDE.md",
    "/home/user/monorepo/other-team/.claude/rules/**"
  ]
}
```

### AGENTS.md

Since Claude Code v2.1.277, a repository that only has an [AGENTS.md](/glossary/agents-md) works without a CLAUDE.md. The default (`claude-md-or-agents-md`) reads `AGENTS.md` only when no `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` exists in the working directory or above it. One trap: adding a `CLAUDE.local.md` for personal notes counts, and stops `AGENTS.md` from loading. Fix that by setting **Project instructions** to `claude-md-and-agents-md` in `/config`, or keep one shared file with an import:

```markdown
@AGENTS.md

## Claude Code

Use plan mode for changes under `src/billing/`.
```

See [AGENTS.md vs CLAUDE.md vs Cursor rules](/guides/configuration/agents-md-vs-claude-md-vs-cursor-rules) for the cross-tool picture.

### Path-scoped rules

`.claude/rules/*.md` files load at launch with the same priority as `.claude/CLAUDE.md`, unless you give them `paths:` frontmatter:

```markdown
---
paths:
  - "src/**/*.tsx"
---
# Frontend rules
Use the design-system components; never hand-roll buttons.
```

Now the frontend rules load only when Claude works with matching files. This is the answer to a bloated CLAUDE.md: invariants stay global, everything area-specific becomes a scoped rule. `~/.claude/rules/` does the same across all your projects.

### Auto memory

Claude keeps its own notes per repository at `~/.claude/projects/<project>/memory/`:

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md           # Index, one line per memory, loaded at session start
├── user_role.md        # One memory
├── feedback_testing.md # One memory
└── ...
```

- **What loads:** the first 200 lines or 25KB of `MEMORY.md`, whichever comes first. Topic files are read on demand with the normal file tools. Anything past the limit is dropped on the next load, so the index has to stay one line per entry.
- **What Claude saves:** four types, recorded in each file's frontmatter: `user` (your role and preferences), `feedback` (corrections and confirmed approaches), `project` (ongoing work and decisions not derivable from code or git history), and `reference` (where outside information lives). It skips what it can derive from the codebase and what CLAUDE.md already says.
- **Where it lives:** on this machine only. All worktrees and subdirectories of one git repository share a directory, which suits [parallel sessions](/guides/advanced/parallel-claude-code-worktrees); nothing syncs across machines or cloud environments. `autoMemoryDirectory` in settings moves it.
- **How to turn it off:** the toggle in `/memory`, `"autoMemoryEnabled": false` in a project's settings, or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`. It is on by default in local sessions.

`/memory` lists every CLAUDE.md location, holds the auto memory toggle, and opens the memory folder. Everything in it is plain Markdown you can edit or delete.

> [!NOTE]
> Older guides (including earlier versions of this page) describe starting a message with `#` to save a memory. The current docs do not list that prefix. Ask Claude to remember something and it writes to auto memory; say "add this to CLAUDE.md" when you want it in the instruction file.

### Subagents and memory

[Subagents](/guides/configuration/claude-code-subagents) do not see everything the main session does:

- The built-in **Explore** and **Plan** subagents start without your CLAUDE.md files and the git status snapshot, to keep research fast.
- A custom subagent can opt out the same way with `omitClaudeMd: true` in its frontmatter (requires v2.1.271 or later). Managed policy files still load.
- The main conversation's auto memory is not loaded into subagents, except a fork, which inherits the parent conversation.
- A subagent gets its own persistent notes with the `memory` field, scoped `user` (`~/.claude/agent-memory/<name>/`), `project` (`.claude/agent-memory/<name>/`) or `local` (`.claude/agent-memory-local/<name>/`), with the same 200-line or 25KB `MEMORY.md` limit.

If a rule must reach a subagent, put it in the delegation prompt or the agent's own definition instead of assuming CLAUDE.md carried it.

## The context window, in practice

**See it: `/context`.** A colored grid of what is consuming the window, with suggestions for context-heavy tools and memory bloat. `/context all` expands the per-item breakdown, including the **Memory files** list, which is the quickest way to confirm a CLAUDE.md actually loaded.

**Reset it: `/clear`.** Between unrelated tasks, clearing beats carrying. Pass a name (`/clear auth-refactor`) to label the old conversation in the `/resume` picker.

**Compress it: `/compact`.** Mid-task, `/compact` replaces the conversation with a structured summary and takes focus instructions: `/compact keep the failing test output and the refactor plan`. Auto-compaction fires when the window fills, but a deliberate compact at a milestone beats an automatic one mid-thought.

| What | After compaction |
| --- | --- |
| System prompt, output style | Still apply |
| Project-root CLAUDE.md, unscoped rules | Re-injected from disk |
| Auto memory | Re-injected from disk |
| Plan written in plan mode | Re-injected from disk |
| Files Claude read or edited | Up to five re-read, most recently modified first; a file over 5,000 tokens returns as a path reference |
| Invoked skill bodies | Re-injected, capped at 5,000 tokens per skill and 25,000 total |
| Rules with `paths:`, nested CLAUDE.md | Gone until Claude touches a matching file again |
| Conversation, hook-added context | Summarized |

The corollary is the core discipline: *if it must survive, put it in a file*, and if a path-scoped rule must survive compaction, drop its `paths:` frontmatter or move it to the root CLAUDE.md.

**Time-travel it: `/rewind` and `/resume`.** `/rewind` rolls conversation and/or code back to a [checkpoint](/guides/getting-started/claude-code-checkpoints) when a direction failed; `/resume` (alias `/continue`) reopens a past session by ID, name or picker.

## When instructions are not followed

1. Run `/context all` and check **Memory files**. If the file is not listed, Claude cannot see it. Subdirectory files will not appear there until they load.
2. Look for contradictions across CLAUDE.md files and rules; when two disagree, Claude may pick either. `/doctor prompt-audit` (v2.1.283 or later) reports outdated or conflicting instructions and proposes edits.
3. Make the instruction specific. "Use 2-space indentation" works better than "format code nicely."
4. If it disappeared after `/compact`, it was conversation-only, nested, or path-scoped. Move it.
5. If it must run at a fixed point, such as before every commit, write a hook. The `InstructionsLoaded` hook logs which instruction files load and why.

## Keeping sessions lean

1. **CLAUDE.md under 200 lines.** It loads every session; longer files consume more context and reduce adherence.
2. **Skills for procedures.** A 300-line release process belongs in a [skill](/guides/skills/writing-your-first-skill) that loads when invoked, not in standing context.
3. **Rules scoped by path**, as above.
4. **Subagents for verbose work.** A log dive or sweeping search in a subagent keeps thousands of lines in *its* context; only the summary returns to yours.
5. **Mind MCP servers.** Connected servers add to the startup context; keep the per-project set tight ([details](/guides/mcp/claude-code-mcp-setup)).
6. **Big windows are budget, not license.** 1M-token context windows exist on recent models, but a focused window still beats a full one. See [Context Engineering](/guides/prompting/context-engineering) for the why.

The mental model: **context is RAM, files are disk.** CLAUDE.md, rules and auto memory are what loads at boot; `/compact` frees RAM and reloads the boot set; asking Claude to remember something, or editing through `/memory`, is how you write to disk before the power cycles.

## Continue exploring

- [25 Claude Code Tips, Shortcuts, and Power Features](/guides/getting-started/claude-code-tips) — The 25 highest-leverage Claude Code tips: keyboard shortcuts, shell and file prefixes, memory, session commands, model tricks, and features most people miss.
