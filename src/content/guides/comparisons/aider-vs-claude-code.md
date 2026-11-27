---
title: "Aider vs Claude Code: Open-Source vs Anthropic's Agent (2026)"
description: "Aider vs Claude Code: the Apache-2.0, bring-your-own-model pair programmer against Anthropic's terminal agent, on models, git, cost, and release pace."
author: "Imtiaz Rayhan"
date: 2026-06-17
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems"]
audience: ["developers"]
tags: ["comparison", "versus", "aider", "claude-code", "cli-agents"]
featured: false
summary: "Choose Aider for an open-source (Apache-2.0) tool that works with almost any model, including local ones, and commits every edit to git. Choose Claude Code for an agent that runs tests, delegates to subagents and connects to MCP servers on Claude models. Aider's last release was v0.86.2 in February 2026."
keyTakeaways:
  - "Aider is Apache-2.0 and model-agnostic: you bring an API key for Anthropic, OpenAI, Gemini, DeepSeek or OpenRouter, or point it at a local model through Ollama. Claude Code is proprietary Anthropic software that runs Claude models."
  - "Aider commits each edit with a generated message and /undo reverts the last one. Claude Code edits the working tree and commits or opens a PR when you ask."
  - "Cost differs in kind. Aider bills per token through whichever provider you choose. Claude Code is included in the Pro, Max and Ultra plans with 5-hour and weekly limits, or billed per token through a Console account, Amazon Bedrock, Google Cloud or Microsoft Foundry."
  - "Claude Code has subagents, MCP, hooks, skills, plugins and background sessions. Aider has four chat modes, lint and test hooks, and a scripting flag, and its release notes mention no MCP support."
  - "Release pace is now a real difference: Aider's latest release is v0.86.2 from February 12, 2026 and its main branch was last updated in May 2026, as checked in November 2026."
faq:
  - q: "Is Aider really free and open source?"
    a: "Yes. Aider is licensed Apache-2.0 and free to run. The model is what costs money: you bring an API key for a provider such as Anthropic, OpenAI, Gemini or DeepSeek, or run a local model through Ollama with no per-token charge. Claude Code is not open source. Its repository licence reads \"© Anthropic PBC. All rights reserved\" and it needs a paid Claude plan or API account."
  - q: "Can Aider use Claude models?"
    a: "Yes. Set ANTHROPIC_API_KEY and run aider --model sonnet, or pass a full model name; aider --list-models anthropic/ shows what it knows about. Support for the newest Claude releases can lag: the Claude 4.5 and 4.6 aliases are in Aider's main branch but not in the v0.86.2 release, so you may need to pass the full model ID."
  - q: "Which has better git integration?"
    a: "They take opposite defaults. Aider commits every edit with a descriptive message, commits your own uncommitted changes first so they stay separate, and marks its commits with \"(aider)\" in the git metadata. Claude Code leaves edits uncommitted until you ask it to commit or open a pull request. Aider's default suits line-by-line review; turn it off with --no-auto-commits."
  - q: "Is Aider still maintained?"
    a: "It is public and usable, but slower than it was. As of November 2026 the latest release on PyPI is v0.86.2, published February 12, 2026, and the previous one was in August 2025. The main branch on GitHub last changed in May 2026. If you depend on same-week support for new models, check the release history before standardizing on it."
  - q: "Can I run both in the same repo?"
    a: "Yes. Both work on a normal git checkout and neither needs exclusive access. A common split is Aider with a cheap or local model for small, reviewable edits and Claude Code for multi-file tasks that need test runs. Give each its own instructions file: CONVENTIONS.md loaded with --read for Aider, CLAUDE.md for Claude Code."
related: ["tool:aider", "tool:claude-code", "guide:claude-code-vs-codex-cli", "guide:claude-code-vs-opencode", "guide:ai-coding-agents-cli-2026", "tool:opencode"]
---

Aider and Claude Code both edit your repository from the terminal. They disagree on two things: who chooses the model, and how much the tool should do without you.

## The short answer

- **You need model freedom**, including local models or a provider your company already pays for: **[Aider](/tools/aider)**.
- **You want an agent that plans, runs tests, delegates and iterates** on Anthropic's models: **[Claude Code](/tools/claude-code)**.
- **You want every AI edit as its own git commit**: Aider.
- **You want a flat monthly plan instead of a per-token bill**: Claude Code on a Claude subscription.
- **You need a tool with frequent releases**: Claude Code. Aider's release pace has slowed sharply (details below).

## Facts side by side

Checked against each project's documentation and repositories in November 2026.

| | Aider | Claude Code |
| --- | --- | --- |
| Maker | Aider-AI (open-source project) | Anthropic |
| Licence | Apache-2.0 | Proprietary ("All rights reserved") |
| Install | `python -m pip install aider-install` then `aider-install` | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Latest release | v0.86.2, February 12, 2026 | 2.1.332 on npm in November 2026 |
| Models | Almost any LLM by API key; local models through Ollama | Claude models only (aliases `sonnet`, `opus`, `haiku`, `fable`) |
| Account needed | None for the tool; a key for your chosen provider | Pro, Max, Ultra, Team, Enterprise or Console account, or a cloud provider |
| Billing | Per token, paid to the model provider | Included in a Claude plan with usage limits, or per token |
| Git behaviour | Auto-commit per edit, `/undo`, `/diff`, `/commit` | Commits and opens PRs on request |
| Modes | `code`, `ask`, `architect`, `help` | Plan mode plus permission modes |
| Project instructions | Any file loaded with `--read`, such as `CONVENTIONS.md` | `CLAUDE.md`, loaded automatically |
| Lint and test loop | `--lint-cmd`, `--test-cmd`, `--auto-test` | Runs your commands as part of the agent loop |
| Extension surface | None documented beyond config and scripting | Subagents, MCP servers, hooks, skills, plugins |
| Non-interactive use | `aider --message "..." file.py` | `claude -p "..."` |
| Surfaces | Terminal | Terminal, VS Code and JetBrains extensions, desktop app, web |
| GitHub stars | About 50,300 as of November 2026 | Not comparable (closed source) |

## What working in each looks like

**Aider** is a pair programmer with a narrow contract. You add files to the chat, describe a change, and it edits those files and commits.

```bash
python -m pip install aider-install
aider-install

cd /path/to/your/project
export ANTHROPIC_API_KEY=<key>
aider --model sonnet src/billing.py tests/test_billing.py

# inside the chat
> /architect split calculate_invoice into pure functions
> /test pytest tests/test_billing.py
> /undo
```

`architect` mode has one model propose the change and a second "editor" model turn it into file edits, which helps reasoning models that are weak at producing clean diffs. `/tokens` reports how much context the session is using. For a local model, set `OLLAMA_API_BASE=http://127.0.0.1:11434` and run `aider --model ollama_chat/<model>`.

**Claude Code** is an agent with a wide contract. You state an outcome and it searches the repo, edits across files, runs commands, reads failures and repeats.

```bash
curl -fsSL https://claude.ai/install.sh | bash

cd /path/to/your/project
claude
> the billing tests fail on leap years. find the cause, fix it, and run the suite

# headless, for scripts and CI
claude -p "summarize the changes on this branch as release notes"
```

Around that loop sits the extension surface: [subagents](/glossary/subagent) for delegated work in a separate context, [MCP](/glossary/model-context-protocol) servers for external tools, hooks for rules that must always run, and skills for packaged procedures. Parallel work is built in through [worktrees](/guides/advanced/parallel-claude-code-worktrees).

## Cost: how to compare without guessing

The two tools charge on different axes, so compare them on your own usage.

**Aider** has no price. Your bill is tokens in and out multiplied by your provider's rates, and Aider sends the files you added plus a repository map on every request. Two levers change the bill by an order of magnitude: which model you pick, and how many files you keep in the chat. A local model through Ollama removes the per-token cost and adds a hardware one.

**Claude Code** has two routes. On a Pro, Max or Ultra plan, usage is included up to limits that reset every five hours and every week; Max is listed at 5x Pro usage and Ultra at 10x Pro weekly usage with no five-hour limit. On a Console account or a cloud provider you pay per token, and `/usage` shows the session's token counts.

A workable method for a team deciding between them:

1. Pick three tasks you really do: a one-file fix, a multi-file feature, a test-repair loop.
2. Run each in Aider with the model you would use, check context size with `/tokens`, and read the actual charge in your provider's usage dashboard.
3. Run each in Claude Code on an API key and read the totals in `/usage`.
4. Multiply by your weekly task count. If the Claude Code total is well above a plan's price, the plan is the cheaper route; if your Aider total on a cheaper model is far below it, Aider wins on cost.

Agentic runs use more tokens than single edits because the agent reads files, runs commands and retries. Expect Claude Code to spend more per task and to finish more of the task without you. Current plan and API prices are on the [Claude Code](/tools/claude-code) and [Aider](/tools/aider) tool pages.

## Where each one loses

**Aider**

- Release pace. One release since August 2025 (v0.86.2 in February 2026), and the newest Claude and GPT aliases sit unreleased on the main branch. The documentation still names Claude 3.7 Sonnet as the Anthropic default.
- No delegation. There are no subagents, no MCP client in the release notes and no hook system, so anything beyond editing files and running a lint or test command is up to you.
- You manage context by hand. Forgetting to `/add` a file is the usual cause of a bad edit.
- The pip installer supports Python 3.8 to 3.13 and installs its own Python 3.12, which is one more runtime to manage in locked-down environments.

**Claude Code**

- Claude models only. Anthropic supports it on its own API and on Amazon Bedrock, Google Cloud and Microsoft Foundry; see [Claude Code with other models](/guides/configuration/claude-code-with-other-models) for what that does and does not cover.
- Not open source, so you cannot audit or fork the harness.
- Plan limits. Heavy agentic sessions can hit the five-hour or weekly limit on Pro, and the free Claude plan does not include Claude Code.
- More machinery than a surgical edit needs. If all you want is one reviewed diff per prompt, the harness is overhead.

## How to decide

Start with the constraint that cannot move. If policy or budget dictates the model (a self-hosted model, an existing OpenAI or Gemini contract, an air-gapped machine), Aider is the only one of the two that fits. If you are free to use Claude and the work is multi-step, Claude Code does more per prompt.

Then weigh maintenance risk. A tool that edits your code should track new models and fix bugs quickly. Claude Code does. For Aider, check the [release history](https://aider.chat/HISTORY.html) on the day you decide.

If you want model freedom and an actively developed agent harness together, compare [OpenCode](/tools/opencode) and the wider [open-source CLI field](/guides/prompting/ai-coding-agents-cli-2026). If your real choice is between two vendor agents, see [Claude Code vs Codex CLI](/guides/comparisons/claude-code-vs-codex-cli).
