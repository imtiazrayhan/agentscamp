---
name: "skill-auditor"
description: "Audit an installed set of Claude Code skills for the failure modes that make them misfire — overlapping descriptions that misroute tasks, trigger phrasing that never matches, bloated bodies, missing boundaries, and over-broad tool grants — and return a prioritized fix list with rewritten descriptions. Use when a skill fires on the wrong tasks, never fires at all, or a skills folder has grown past what anyone reviews."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-07-18
topics: ["workflow-prompting"]
related: ["what-are-claude-skills", "claude-code-skills-best-practices", "testing-and-debugging-skills", "create-skill", "plugin-scaffolder", "claude-settings-auditor"]
featured: false
summary: "Point this skill at a skills directory and it returns a health report: descriptions that overlap enough to misroute, triggers in implementation language that never match a real request, bloated bodies, missing boundaries, and over-broad allowed-tools grants — each finding paired with a concrete rewrite, in severity order."
---

An installed skill set degrades quietly: each individual SKILL.md looked fine when it was added, but collectively the descriptions overlap, the triggers drift from how people actually ask, and nobody has re-read the folder since. This skill audits the set as a *system* — because routing quality is a property of the whole collection, not any single file.

## When to use this skill

- A skill fires on tasks it shouldn't, or the wrong skill wins when two could apply.
- A skill you installed never triggers, even on tasks it obviously covers.
- The skills folder (project or personal) has grown past ten entries and nobody reviews it.
- Before packaging skills into a plugin for the team — audit first, ship clean.

## When NOT to use this skill

- You're writing a *new* skill — that's the **create-skill** command's job; this one reviews what exists.
- One specific skill misbehaves and you already know which — see [Testing and Debugging Skills](/guides/skills/testing-and-debugging-skills) for the single-skill fix loop.
- You want a security review of a repo's whole Claude Code config (permissions, hooks, MCP servers) — that's **claude-settings-auditor**; this skill stays inside the skills directory.

## Instructions

1. **Inventory the set.** Glob every `SKILL.md` under the target directory (default: the project's `.claude/skills/`, plus `~/.claude/skills/` if asked). For each, extract `name`, `description`, any triggering fields (`when_to_use`, `paths`, `disable-model-invocation`, `user-invocable`), `allowed-tools`, and the body length. Build the table before judging anything.
2. **Check descriptions pairwise for overlap.** Two descriptions overlap when a plausible user request matches both — test with concrete phrasings, not vibes ("split this commit" → does it match both the commit skill and the refactor skill?). Overlap is the highest-severity finding: it makes routing nondeterministic. For each collision, propose which skill owns the job and rewrite the other's description to cede it explicitly.
3. **Check each description for trigger quality.** Flag descriptions written in implementation language ("normalizes VCS metadata") rather than request language ("write a commit message"), descriptions missing a "Use when…" clause, and descriptions so broad they'd match half of all sessions. Rewrite each flagged one in the two-sentence shape: what it does, then when to use it, in the words a user would type.
4. **Check bodies for weight and boundaries.** Flag bodies that restate things the model already knows (generic best practices, tool tutorials), bodies over ~150 lines with no bundled files to absorb the detail, and — most important — procedures with side effects that lack an explicit boundary line ("writing the files is the whole job"). Propose the one-line boundary where missing.
5. **Check tool grants against the procedure.** For each `allowed-tools`, verify every granted tool is actually used by the body's steps. Flag grants broader than the procedure (bare `Bash` where `Bash(git diff:*)` would do) and destructive-capable skills that auto-invoke — those should carry `disable-model-invocation: true`.
6. **Check for dead weight.** Skills whose job is fully covered by a newer skill, skills duplicating a slash command name, and skills whose `paths` restriction no longer matches anything in the repo. Recommend deletion — a smaller set routes better.
7. **Deliver the report in severity order.** Misrouting collisions first, dead triggers second, missing boundaries third, everything else after. Every finding names the file, quotes the offending line, and includes the concrete rewrite — not advice, replacement text.

> [!WARNING]
> Do not edit any SKILL.md unless explicitly asked. The audit's product is the report; applying rewrites is a separate, reviewed step — descriptions are routing behavior, and changing five at once without review is how a working set breaks.

> [!TIP]
> Re-run the audit after adding every third or fourth skill rather than waiting for symptoms. Overlap is much easier to resolve when the newer skill is still fresh enough to rename.

## Output

A prioritized audit report: the inventory table (name, one-line description summary, body size, tool grants), findings grouped by severity with file and line references, a rewritten description for every routing-level finding, and a short keep/merge/delete verdict per skill for sets over ten.
