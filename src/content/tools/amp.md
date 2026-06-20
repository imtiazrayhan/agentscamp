---
name: "Amp"
description: "Sourcegraph's agentic coding tool — a CLI and editor extensions tuned for frontier-model coding."
date: 2026-06-03
url: "https://ampcode.com"
pricing: "freemium"
category: "agent"
color: "purple"
topics: ["workflow-prompting"]
tags: ["agent", "sourcegraph"]
related: ["cody", "claude-code", "devin"]
featured: false
alternativeTo: ["claude-code", "codex-cli", "cody", "cursor", "devin"]
summary: "Amp is Sourcegraph's agentic coding tool: a CLI plus extensions for VS Code, Cursor, Windsurf, JetBrains, Neovim, and Zed that runs frontier models to read, edit, and run commands across a repository. Subagents parallelize independent sub-tasks, the Oracle adds a second-opinion reasoning model, and threads can be shared with a workspace."
faq:
  - q: "What is Amp?"
    a: "Amp is Sourcegraph's agentic coding tool. You drive it from the terminal or an editor extension, describe a task, and the agent reads, edits, and runs commands across your repository. It tracks the strongest available models rather than locking you to one, and adds subagents, a second-opinion Oracle model, and shareable threads."
  - q: "How much does Amp cost?"
    a: "Pricing is usage-based: Amp Free grants $10/day of credits (new sign-ups are currently paused), and beyond that you pay as you go for actual model usage with no markup for individuals and a $5 minimum top-up — there is no subscription. Enterprise pricing is 50% higher than individual rates and starts with a one-time $1,000 credit purchase."
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

Pricing is usage-based: Amp Free grants $10/day of credits at no cost — once ad-supported, now ad-free, though new sign-ups are currently paused. Beyond the free allowance you pay as you go for actual model usage with no markup for individuals — there is no subscription, and the minimum credit top-up is $5. Enterprise pricing is 50% higher than individual rates and starts at a one-time $1,000 credit purchase that also unlocks SSO and workspace governance. Because billing tracks real model calls, cost scales with how much you run the agent rather than a flat monthly fee.
