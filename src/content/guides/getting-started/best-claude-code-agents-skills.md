---
title: "The Best Claude Code Agents, Skills & Commands to Install First"
description: "A curated starter kit from the AgentsCamp library — the subagents, skills, and slash commands that pay off immediately, by workflow."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "agents", "skills", "commands", "best-of", "starter-kit"]
featured: false
summary: "Start with five: the code-reviewer and debugger agents (delegate review and diagnosis), the conventional-commits skill and create-pr command (polish the git loop), and one domain specialist for your stack. Add the test-runner pattern, security-auditor, and workflow skills as friction appears. Everything here is a Markdown file — copy it in, restart, done."
keyTakeaways:
  - "Install for friction you actually have: each artifact is one Markdown file in ~/.claude/, so the cost of trying is near zero — but a curated five beats a hoarded fifty."
  - "Agents to start with: code-reviewer (fresh-eyes review on every diff), debugger (delegated diagnosis), then one specialist matching your stack (react, python, sql, terraform…)."
  - "Skills/commands that pay daily: conventional-commits, create-pr, write-tests, explain-error — the git-and-verify loop, automated."
  - "The Claude Code power tools are in the library too: hook-writer turns 'always do X' into enforcement, claude-settings-auditor hardens a new repo's config."
  - "Installation is copy-paste: agents → ~/.claude/agents/, skills → ~/.claude/skills/<name>/SKILL.md, commands → ~/.claude/commands/ — project-level .claude/ shares them with your team."
faq:
  - q: "How do I install a Claude Code agent or skill from AgentsCamp?"
    a: "Copy the file. Agents are single Markdown files for ~/.claude/agents/ (or .claude/agents/ in a repo to share with the team); skills are folders with a SKILL.md under ~/.claude/skills/<name>/; commands go in ~/.claude/commands/. Every item page has the install path and a copy button; start a new session and it's live."
  - q: "How many should I install?"
    a: "Fewer than you think. Subagent descriptions are read during delegation routing, so dozens of overlapping agents blur each other. A working set of five to eight focused items — review, debugging, your stack's specialist, your git loop — outperforms a hoard. Add when you feel friction, prune what never fires."
  - q: "Can I customize them?"
    a: "That's the point — they're plain Markdown with a frontmatter header and a system prompt. Edit the description to tune when Claude delegates, restrict tools, pin a model tier, and rewrite the body for house rules. The library entries are starting points engineered to be edited."
related: ["getting-started-with-agents", "writing-a-custom-agent", "skills-vs-agents-vs-commands", "code-reviewer", "debugger", "conventional-commits", "create-pr", "claude-code-tips"]
---

The fastest upgrade to a stock Claude Code setup isn't a prompt trick — it's installing a few well-built extensions. Everything below comes from this site's library, is a plain Markdown file, and installs by copy-paste. Here's the starter kit we'd give a new teammate, by workflow.

## The first five

1. **[code-reviewer](/agents/quality-security/code-reviewer)** (agent) — fresh-eyes review of every diff for correctness, security, and maintainability, in its own context. The single highest-value delegate: it reads what you've stopped seeing.
2. **[debugger](/agents/quality-security/debugger)** (agent) — hand it the failing test or stack trace; it reproduces, traces the root cause, and reports — noise stays in its window.
3. **[conventional-commits](/skills/git/conventional-commits)** (skill) — staged changes become clean Conventional Commits messages, every time.
4. **[create-pr](/commands/git/create-pr)** (command) — `/create-pr` pushes the branch and opens a PR with a real title and description drafted from the diff.
5. **One stack specialist** — match your daily language: [react-specialist](/agents/language-specialists/react-specialist), [python-pro](/agents/language-specialists/python-pro), [typescript-pro](/agents/language-specialists/typescript-pro), [sql-pro](/agents/language-specialists/sql-pro), or [terraform-specialist](/agents/infrastructure-devops/terraform-specialist).

## The second wave, by friction

- **Tests feel like a chore** → [write-tests](/commands/testing/write-tests) command + [test-scaffolder](/skills/testing/test-scaffolder) skill, and [fix-failing-test](/commands/testing/fix-failing-test) for the red ones.
- **Security review keeps slipping** → [security-auditor](/agents/quality-security/security-auditor) agent + [security-scan](/commands/review/security-scan) on diffs; [secret-scanner](/skills/security/secret-scanner) before pushes.
- **Errors eat your mornings** → [explain-error](/commands/analyze/explain-error) — paste the trace, get the diagnosis and fix.
- **Branches drift** → [sync-branch](/commands/git/sync-branch) and the [branch-rebaser](/skills/git/branch-rebaser) skill for conflict-walking rebases.
- **Docs rot** → [readme-generator](/skills/docs/readme-generator) and [update-readme](/commands/docs/update-readme), grounded in the actual repo.

## The Claude Code power tools

The library also extends Claude Code itself: [hook-writer](/skills/workflow/hook-writer) turns "always run prettier after edits" into an [enforced hook](/guides/configuration/claude-code-hooks); [claude-settings-auditor](/skills/workflow/claude-settings-auditor) reviews a repo's checked-in config before you trust it; [plugin-scaffolder](/skills/workflow/plugin-scaffolder) packages your setup for the team; [setup-claude-ci](/commands/workflow/setup-claude-ci) wires the [GitHub Action](/guides/advanced/claude-code-ci-github-actions).

## Install once, then make them yours

Mechanics in one breath: agents are files in `~/.claude/agents/`, skills are `~/.claude/skills/<name>/SKILL.md`, commands are `~/.claude/commands/` — use a repo's `.claude/` instead to share with the team, and start a new session to load. ([Full walkthrough](/guides/getting-started/getting-started-with-agents).) Then treat every install as a draft: tighten the `description` so delegation fires when *you'd* want it, restrict `tools` to the job, and rewrite house rules into the body. The library's real product isn't the files — it's working examples of [the craft](/guides/getting-started/writing-a-custom-agent), pre-installed.
