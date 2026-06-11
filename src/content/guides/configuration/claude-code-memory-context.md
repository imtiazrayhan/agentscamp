---
title: "Managing Claude Code Memory & Context: CLAUDE.md, /compact, and Auto-Memory"
description: "How Claude Code remembers — every CLAUDE.md scope and load order, path-scoped rules, the auto-memory system, and the context commands that keep sessions sharp."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "memory", "context", "claude-md", "configuration"]
featured: false
summary: "Claude Code's memory is layered: CLAUDE.md files load by scope (managed → user → project → local, plus on-demand subdirectory files), .claude/rules/ adds path-scoped instructions, and auto-memory persists learnings across sessions. In-session, /context shows what's eating the window, /compact summarizes deliberately, /clear resets — knowing what survives each is the skill."
keyTakeaways:
  - "Two different problems: context is what the model sees right now (finite, per-session); memory is what persists across sessions (CLAUDE.md, rules, auto-memory). Manage them separately."
  - "CLAUDE.md loads managed-policy first, then ~/.claude/CLAUDE.md, then the project file, then CLAUDE.local.md — and subdirectory CLAUDE.md files load on demand when Claude reads files there."
  - "Path-scoped rules (.claude/rules/*.md with a paths: frontmatter) load only when matching files are touched — instructions without the standing context tax."
  - "Auto-memory gives Claude a per-project notebook: a MEMORY.md index loaded at startup plus topic files read on demand, shared across worktrees, editable via /memory."
  - "/compact re-reads CLAUDE.md and keeps rules and memory but summarizes the conversation — anything important said only in-chat should be promoted to a file before long sessions."
howtoSteps:
  - name: "Audit with /context"
    text: "Run /context to see exactly what's consuming the window — system prompt, CLAUDE.md files, MCP tool definitions, conversation. You can't manage what you haven't measured."
  - name: "Trim CLAUDE.md to invariants"
    text: "Keep the always-loaded file under ~200 lines: commands, conventions, hard constraints. Move long procedures into skills and reference docs behind @imports so they load when needed, not always."
  - name: "Scope the rest by path"
    text: "Split per-area instructions into .claude/rules/*.md with paths: frontmatter (e.g. src/**/*.tsx) so frontend rules load only when frontend files are touched."
  - name: "Compact deliberately, not desperately"
    text: "Don't wait for auto-compact at the window's edge. At a natural milestone, run /compact with instructions — '/compact keep the failing test output and the migration plan' — so the summary preserves what the next phase needs."
  - name: "Promote decisions to memory"
    text: "When something should outlive the session — a build quirk, a chosen approach — say '# remember: …' or edit via /memory so it lands in CLAUDE.md or auto-memory instead of dying with the conversation."
faq:
  - q: "What is CLAUDE.md and where does it go?"
    a: "CLAUDE.md is the instruction file Claude Code loads at session start. It exists at four scopes, loaded in order: a managed policy file (admin-deployed), ~/.claude/CLAUDE.md (your personal defaults), the project's CLAUDE.md (checked in, team-shared), and CLAUDE.local.md (personal, gitignored). Subdirectory CLAUDE.md files load on demand when Claude works with files in that directory."
  - q: "What's the difference between /clear and /compact?"
    a: "/clear starts a fresh conversation — context empties, though the old session stays recoverable via /resume. /compact summarizes the current conversation in place, preserving continuity while freeing the window; you can steer it with instructions, like /compact focus on the API changes. Use /clear between unrelated tasks, /compact mid-task."
  - q: "Does Claude Code remember things between sessions?"
    a: "Yes, three ways: whatever you put in CLAUDE.md and .claude/rules/ (explicit, versioned), auto-memory (Claude's own per-project notes under ~/.claude/projects/<project>/memory, with a MEMORY.md index loaded each session), and past conversations reachable via /resume. The conversation itself doesn't carry over — files do."
  - q: "What survives /compact?"
    a: "Your project CLAUDE.md is re-read from disk, .claude/rules/ files persist, and auto-memory is untouched. What gets summarized is the conversation — so instructions given only in chat can fade. If it must survive, it belongs in a file, not just a message."
  - q: "How do I add something to Claude Code's memory quickly?"
    a: "Start a message with # — e.g. '# always use pnpm in this repo' — and Claude Code saves it to memory. Run /memory to browse and edit everything that's stored: CLAUDE.md files, rules, and the auto-memory folder."
related: ["claude-md-best-practices", "context-engineering", "claude-code-settings-permissions", "claude-code-hooks", "claude-code-tips", "parallel-claude-code-worktrees", "claude-code"]
---

Claude Code has two resources that get conflated: **context** — what the model can see right now, a finite per-session window — and **memory** — what persists when the session ends. Long sessions degrade when context fills with noise; new sessions start dumb when nothing was persisted. This guide is the map of both systems and the commands that move things between them. (For *what to write* in a CLAUDE.md, see [CLAUDE.md Best Practices](/guides/configuration/claude-md-best-practices) — this guide covers the machinery around it.)

## The memory layers

**CLAUDE.md, by scope.** Loaded in order at session start:

| Scope | Location | Notes |
| --- | --- | --- |
| Managed policy | OS-level admin path | Org-wide, can't be excluded |
| User | `~/.claude/CLAUDE.md` | Your defaults, every project |
| Project | `./CLAUDE.md` | Checked in — the team contract |
| Local | `./CLAUDE.local.md` | Personal, gitignored overrides |
| Subdirectory | `subdir/CLAUDE.md` | **On demand** — loads when Claude reads files there |

The on-demand behavior of subdirectory files is the underused one: a `packages/api/CLAUDE.md` costs nothing until the agent actually works in `packages/api/`. CLAUDE.md also supports **imports** — `See @docs/git-workflow.md` pulls another file in (imports can nest, with a depth cap) — so the always-loaded file can stay a thin index over deeper references.

**Path-scoped rules.** `.claude/rules/*.md` files load unconditionally — unless you give them a `paths:` frontmatter:

```markdown
---
paths:
  - "src/**/*.tsx"
---
# Frontend rules
Use the design-system components; never hand-roll buttons.
```

Now frontend rules ride along only when frontend files are touched. This is the answer to the bloated CLAUDE.md: invariants stay global, everything area-specific becomes a scoped rule. (`~/.claude/rules/` does the same across all your projects.)

**Auto-memory.** Claude keeps its own notebook per project at `~/.claude/projects/<project>/memory/`: a `MEMORY.md` index loaded at startup (capped around 200 lines so it can't bloat), plus topic files it reads on demand. Claude writes to it when it learns something durable — a build quirk, a debugging insight — and you stay in charge: it's plain Markdown, browsable and editable via `/memory`, toggleable with `autoMemoryEnabled` in settings. All worktrees of a repo share one memory, which is exactly what you want for [parallel sessions](/guides/advanced/parallel-claude-code-worktrees).

Quick capture for any layer: start a message with `#` — "`# integration tests need the docker stack up`" — and it's saved without breaking flow. `/init` bootstraps a project's CLAUDE.md in the first place (and reads an existing `AGENTS.md`, `.cursorrules`, etc. while it's at it).

## The context window, in practice

**See it: `/context`.** A visual breakdown of what's consuming the window — system prompt, CLAUDE.md, MCP tool definitions, conversation. Run it before optimizing anything; the answer is often "three MCP servers you forgot about."

**Reset it: `/clear`.** Between unrelated tasks, clearing beats carrying. The old conversation remains reachable via `/resume`, so clearing costs nothing but stale context.

**Compress it: `/compact`.** Mid-task, `/compact` summarizes the conversation and frees the window — and takes instructions: `/compact keep the failing test output and the refactor plan`. Auto-compaction fires on its own when the window fills, but a deliberate compact at a milestone beats an automatic one mid-thought. Know what survives: project CLAUDE.md is re-read from disk, rules and auto-memory persist — **conversation-only instructions are what fade**. The corollary is the core discipline: *if it must survive, put it in a file.*

**Time-travel it: `/rewind` and `/resume`.** `/rewind` rolls back to a checkpoint when a direction failed (cheaper than arguing the agent out of a bad path); `/resume` and `--continue` reattach to past sessions per directory.

## Keeping sessions lean

The habits that follow from the machinery:

1. **CLAUDE.md under ~200 lines.** It's loaded *every* session — every line taxes every task and dilutes adherence. Invariants only.
2. **Skills for procedures.** A 300-line release process belongs in a [skill](/guides/skills/writing-your-first-skill) that loads when invoked, not in standing context.
3. **Rules scoped by path**, as above.
4. **Subagents for verbose work.** A log dive or sweeping search in a subagent keeps thousands of lines in *its* context; only the conclusion returns to yours.
5. **Mind MCP tool definitions.** Every connected server ships its schemas into context — keep the per-project set tight ([details](/guides/mcp/claude-code-mcp-setup)).
6. **Big windows are budget, not license.** 1M-token modes exist on recent models, but a focused window still beats a full one — see [Context Engineering](/guides/prompting/context-engineering) for the why.

The mental model that makes all of this click: **context is RAM, files are disk.** CLAUDE.md, rules, and memory are what you've chosen to load at boot; `/compact` is swap; `#` and `/memory` are how you write things to disk before the power cycles.
