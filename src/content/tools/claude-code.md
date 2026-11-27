---
name: "Claude Code"
description: "Anthropic's agentic coding tool for the terminal, IDE, desktop app and web."
seoDescription: "Claude Code is Anthropic's agentic coding tool for terminal, IDE, desktop and web: install commands, plan prices, limits and the main alternatives."
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
os: ["macOS", "Windows", "Linux", "Web"]
sameAs: ["https://code.claude.com/docs/en/overview", "https://github.com/anthropics/claude-code"]
url: "https://claude.com/product/claude-code"
pricing: "paid"
category: "cli"
color: "orange"
topics: ["workflow-prompting"]
tags: ["cli", "agent", "anthropic"]
featured: true
alternativeTo: ["codex-cli", "aider", "gemini-cli", "cursor", "amp"]
summary: "Claude Code is Anthropic's agentic coding tool: it reads your codebase, edits files, runs commands and iterates on test output. It runs in the terminal, VS Code, JetBrains, a desktop app and the browser, and extends through CLAUDE.md, skills, subagents, hooks, MCP and plugins. It needs a paid Claude plan, a Console account or a cloud provider."
faq:
  - q: "How much does Claude Code cost?"
    a: "There is no free tier: Anthropic's setup docs say the free claude.ai plan does not include Claude Code. As of November 2026 it is included in Pro at $20 a month ($17 a month billed annually), Max at $100, Ultra at $200, and Team and Enterprise seats, or you can pay per token through a Console account or a cloud provider. Anthropic's cost docs put the enterprise average at around $13 per developer per active day."
  - q: "How do I install Claude Code?"
    a: "The recommended method is the native installer: curl -fsSL https://claude.ai/install.sh | bash on macOS, Linux and WSL, or irm https://claude.ai/install.ps1 | iex in Windows PowerShell. Homebrew (brew install --cask claude-code), WinGet and an npm package that needs Node.js 22 or later also work. Then run claude in a project directory and log in."
  - q: "Can Claude Code use models other than Claude?"
    a: "It is built for Anthropic's models. You can reach them through a Claude subscription, the Anthropic Console, Amazon Bedrock, Google Cloud's Agent Platform or Microsoft Foundry, and the terminal CLI, VS Code and JetBrains support those third-party providers. If you want a terminal agent that is model-agnostic by design, look at Aider or OpenCode."
  - q: "Is Claude Code open source?"
    a: "No. The anthropics/claude-code repository on GitHub hosts the issue tracker, plugins and examples, and the npm package's license field points to Anthropic's terms, with use governed by the Commercial Terms of Service. Open-source terminal agents include Codex CLI, Aider, Gemini CLI and OpenCode."
audience: ["developers"]
related: ["guide:what-is-claude-code", "guide:installing-claude-code", "guide:claude-code-tips", "tool:claude-agent-sdk", "glossary:agent-harness", "glossary:subagent"]
---

Claude Code is Anthropic's agentic coding tool. It reads your codebase, plans a change, edits files across the project, runs commands and tests, and iterates on the output until the task is done. The same engine runs in the terminal, in VS Code and JetBrains IDEs, in a desktop app and in the browser at claude.ai/code, so a repository's `CLAUDE.md` files, settings and MCP servers work on every surface.

It is aimed at developers who want an agent working inside a real project with repository context, not a chat window to copy snippets from. The trade-off is that it is a paid, closed product built around Anthropic's models.

## Highlights

- **Five surfaces.** A full CLI, a VS Code extension with inline diffs and plan review, a JetBrains plugin, a desktop app for running sessions side by side, and web sessions for long-running tasks on repositories you do not have locally.
- **Project memory.** `CLAUDE.md` in the project root is read at the start of every session; the docs note Claude Code can read an existing `AGENTS.md` in its place.
- **Extension points.** Skills package repeatable workflows such as `/review-pr`; hooks run shell commands before or after its actions; [MCP](/guides/mcp/claude-code-mcp-setup) connects external tools and data; plugins bundle these for sharing through marketplaces.
- **Parallel agents.** [Subagents](/glossary/subagent) work on parts of a task at once under a lead agent, and background agents let you run and watch several full sessions.
- **Git and CI.** It stages changes, writes commit messages, creates branches and opens pull requests, and runs in GitHub Actions or GitLab CI/CD for review and issue triage.
- **Scriptable.** `claude -p` runs a single prompt non-interactively, so you can pipe logs or diffs into it from a shell script or CI job.
- **Scheduling and handoff.** Cloud scheduled tasks run while your machine is off; Remote Control continues a local session from a phone, and `claude --teleport` pulls a web session into your terminal.

## How it fits an AI-assisted workflow

Install with the native installer, then start it from a project root:

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash
# Windows PowerShell:  irm https://claude.ai/install.ps1 | iex

cd your-project
claude
```

Native installs update themselves in the background. Homebrew (`brew install --cask claude-code`), WinGet (`winget install Anthropic.ClaudeCode`) and npm (`npm install -g @anthropic-ai/claude-code@latest`, Node.js 22 or later) are alternatives; the Homebrew and WinGet installs do not auto-update.

Two patterns cover most use. Interactively, describe a task, read the plan and the diff, and let it run the tests before you commit:

```bash
claude "write tests for the auth module, run them, and fix any failures"
```

Non-interactively, use it as a Unix tool:

```bash
git diff main --name-only | claude -p "review these changed files for security issues"
```

Put build commands, architecture notes and conventions in `CLAUDE.md` so every session starts with them. Our [installation guide](/guides/getting-started/installing-claude-code) and [what Claude Code is](/guides/getting-started/what-is-claude-code) cover the first hour.

## Pricing

Claude Code has no free tier. As of November 2026, [Anthropic's pricing page](https://claude.com/pricing) includes it in these plans:

- **Pro:** $20 a month, or $17 a month billed annually.
- **Max:** $100 a month, with 5x Pro usage. **Ultra:** $200 a month, with 10x Pro usage each week.
- **Team:** $25 per standard seat or $125 per premium seat a month ($20 and $100 billed annually), for 2 to 150 people.
- **Enterprise:** $20 per seat a month billed annually with a 20-seat minimum, plus usage that scales with model and task.

You can also pay per token with an Anthropic Console account, or through Amazon Bedrock, Google Cloud's Agent Platform or Microsoft Foundry. Anthropic's cost documentation says that across enterprise deployments the average is around $13 per developer per active day, and below $30 per active day for 90% of users, as of November 2026. Subscription usage is shared with the rest of your Claude account; [Claude plans compared](/guides/getting-started/claude-plans-compared-2026) explains which tier fits.

## Good to know

> [!NOTE]
> Claude Code runs commands and modifies files on your machine. Review what it proposes, work on a version-controlled branch, and widen its permissions only as far as the task needs.

- **Requirements.** macOS 13.0+, Windows 10 1809+, Ubuntu 20.04+, Debian 10+ or Alpine 3.19+, with 4 GB or more of RAM and an internet connection. The desktop app on Ubuntu and Debian is in beta as of November 2026.
- **Not open source.** The [GitHub repository](https://github.com/anthropics/claude-code), with about 157,000 stars as of November 2026, is the issue tracker and plugin home, not a licence to fork the agent.
- **Model lock-in.** It is built for Claude models. You choose the billing route, not the model family.
- **Fast release cadence.** The npm package is at 2.1.332 as of November 2026, with a `stable` channel roughly a week behind `latest`. Behaviour and flags change often, so check the docs when a tutorial does not match.

Against the alternatives: [Codex CLI](/tools/codex-cli) is OpenAI's open-source terminal agent with an OS-level sandbox ([comparison](/guides/comparisons/claude-code-vs-codex-cli)). [Aider](/tools/aider) is a free, model-agnostic pair programmer that commits each edit to Git ([comparison](/guides/comparisons/aider-vs-claude-code)). [Cursor](/tools/cursor) puts the agent inside an editor instead of a terminal ([comparison](/guides/comparisons/claude-code-vs-cursor)). [The best Claude Code alternatives](/guides/comparisons/best-claude-code-alternatives-2026) sorts the wider field by why you would switch: cost, open source, local models, an IDE, or async cloud agents.
