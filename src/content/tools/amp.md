---
name: "Amp"
description: "Sourcegraph's agentic coding tool — a CLI and editor extensions tuned for frontier-model coding."
seoDescription: "Amp is Sourcegraph's agentic coding tool — a CLI and editor extensions tuned for frontier-model coding. What it does, pricing, and closest alternatives."
date: 2026-06-03
updated: 2026-09-10
reviewed: 2026-09-10
url: "https://ampcode.com"
pricing: "freemium"
category: "agent"
color: "purple"
topics: ["workflow-prompting"]
audience: ["developers", "ai-engineers"]
tags: ["agent", "sourcegraph"]
related: ["tool:cody", "tool:claude-code", "tool:devin"]
featured: false
alternativeTo: ["claude-code", "codex-cli", "cody", "cursor", "devin"]
summary: "Amp is Sourcegraph's agentic coding tool: a CLI plus extensions for VS Code, Cursor, Windsurf, JetBrains, Neovim, and Zed that runs frontier models to read, edit, and run commands across a repository. Subagents parallelize independent sub-tasks, the Oracle adds a second-opinion reasoning model, and threads can be shared with a workspace."
faq:
  - q: "What is Amp?"
    a: "Amp is Sourcegraph's agentic coding tool. You drive it from the terminal or an editor extension, describe a task, and the agent reads, edits, and runs commands across your repository. It tracks the strongest available models rather than locking you to one, and adds subagents, a second-opinion Oracle model, and shareable threads."
  - q: "How much does Amp cost?"
    a: "Plans, as of September 2026 from ampcode.com: Megawatt is $20/month with at least $20 of included agent usage and 750 hours of small orbs; Gigawatt is $200/month with at least $200 of included usage and 1,000 hours of xxlarge orbs; students and teachers pay $10/month. The Unconstrained tier drops the subscription and bills model tokens and orbs at API pricing, with no markup on providers' API prices for individuals and non-enterprise workspaces. Enterprise is custom-priced. Amp Free still exists and is now ad-free, but Sourcegraph has been reducing or pausing its daily allowance for less-active users, so treat it as a trial rather than a budget."
  - q: "How do I install Amp?"
    a: "Install the CLI with curl -fsSL https://ampcode.com/install.sh | bash, then run amp inside your project. The CLI runs on macOS, Linux, and Windows via WSL, with extensions for VS Code and its forks, JetBrains, Neovim, and Zed."
---

Amp is Sourcegraph's agentic coding tool, built to run frontier models with as little ceremony as possible. You drive it from the terminal or an editor extension, describe a task, and the agent reads, edits, and runs commands across your repository to carry it out. Its stated philosophy is to "go where the models take it" — no legacy modes or backward-compatibility shims — so the product tracks the strongest available models rather than locking you to one.

It is aimed at developers who want an autonomous agent for real work — multi-file changes, refactors, debugging — and teams who want to share and reuse what worked. If you have used Claude Code or Cody and want a usage-priced agent that spans the CLI and several editors, Amp is built for that audience.

## Highlights

- **Subagents** — spin off parallel agents for independent sub-tasks, keeping the main thread's context clean while work runs concurrently.
- **The Oracle** — a "second opinion" reasoning model you invoke for planning, deep analysis, or untangling a hard bug, separate from the agent doing the edits.
- **Shareable threads** — conversations carry full context and can be shared with a workspace, so teammates can reuse a successful run instead of re-prompting from scratch.
- **CLI plus editor extensions** — the same agent runs in the terminal and inside VS Code, Cursor, Windsurf, JetBrains, Neovim, and Zed.
- **Tools, MCP, and skills** — shell, file edits, and web access out of the box, extensible with MCP servers and task-specific skill packages.
- **Code review and cross-repo search** — built-in review with customizable checks, plus a librarian for searching code across repositories.

## In an AI-assisted workflow

Amp fits where you already work — a terminal tab or your editor's sidebar. A typical loop is to state the goal, let the agent draft a plan, then have it edit across files while you watch the diffs. For thornier work, ask the Oracle to reason about the approach before the agent commits to edits, and break wide changes into subagents that run in parallel.

```bash
curl -fsSL https://ampcode.com/install.sh | bash
cd your-project
amp
# then: "Migrate the auth module to the new session API and update all call sites.
#        Use the oracle to plan the migration first."
```

> [!TIP]
> Reach for the Oracle when planning or debugging matters more than speed, and use subagents for tasks that split cleanly into independent parts — both keep your main thread focused.

## Good to know

Amp is made by Sourcegraph (not to be confused with their earlier Cody assistant). The CLI runs on macOS, Linux, and Windows via WSL, with extensions for VS Code and its forks, JetBrains, Neovim, and Zed.

Plans, as of September 2026 from ampcode.com/docs/pricing: Megawatt is $20/month and includes at least $20 of agent usage plus 750 hours of small orbs; Gigawatt is $200/month with at least $200 of included usage and 1,000 hours of xxlarge orbs; students and teachers pay $10/month. An Unconstrained tier drops the subscription entirely and bills model tokens and orbs at API pricing — Amp adds no markup to providers' API prices for individuals and non-enterprise workspaces — and Enterprise is custom-priced, adding SCIM, admin controls, and retention policy. Included usage resets each billing period and does not roll over, and purchased credits expire twelve months after purchase. Amp Free is still around and no longer ad-supported, but Sourcegraph has been reducing or pausing its daily allowance for less-active users, so we no longer quote a figure for it.
