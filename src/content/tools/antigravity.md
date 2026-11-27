---
name: "Google Antigravity"
title: "Google Antigravity"
description: "Google's agentic development platform: a desktop app, IDE, IDE extensions, the agy CLI and a Python SDK for running Gemini-powered agents in parallel."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://antigravity.google"
pricing: "freemium"
category: "ide"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["ide", "agent", "multi-agent", "google", "browser-automation"]
featured: false
alternativeTo: ["gemini-cli", "cursor", "windsurf"]
sameAs:
  - "https://github.com/google-antigravity"
  - "https://en.wikipedia.org/wiki/Google_Antigravity"
  - "https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/"
related: ["tool:gemini-cli", "tool:cursor", "tool:windsurf", "tool:claude-code", "guide:cursor-vs-claude-code-vs-copilot-vs-windsurf-2026"]
summary: "Google Antigravity is Google's agentic development platform: a desktop app for managing parallel agents, an agent-first IDE, IDE extensions, the agy terminal CLI and a Python SDK. The $0 individual plan is generally available with a weekly quota and Gemini 4 Hydrogen; Google AI Pro and Ultra add Gemini 4 Neon and Carbon, Orchestrator and higher limits."
faq:
  - q: "Is Google Antigravity free?"
    a: "Yes, for individuals. As of November 2026 the $0 plan is labeled Generally Available and covers the app, CLI, IDE extensions and Python SDK, with parallel background agents, subagents, browser use and scheduled tasks on a baseline quota refreshed weekly. Google AI Pro and Ultra raise the quota and refresh it every 5 hours. Gemini Enterprise seats for organizations start at $30 per seat per month."
  - q: "Which models does Antigravity include?"
    a: "As of November 2026 the free plan includes Gemini 4 Hydrogen, with Gemini 3.8 Flash, Claude Sonnet 4.6, Claude Opus 4.6 and GPT-OSS-120b listed for removal on November 30, 2026. Google AI Pro adds Gemini 4 Neon, Carbon and Argon, Orchestrator, and Claude Sonnet 5.5 and Opus 5.5 on non-trial subscriptions. Ultra has the same top models with the highest quotas."
  - q: "How do I install the Antigravity CLI?"
    a: "On macOS or Linux run curl -fsSL https://antigravity.google/cli/install.sh | bash, which puts the agy binary in ~/.local/bin. On Windows the docs give curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd. Check it with agy --version, then run agy in a project directory to open the terminal UI."
  - q: "Is Antigravity open source?"
    a: "Only partly. The Python SDK repository, google-antigravity/antigravity-sdk-python, is Apache-2.0. The antigravity-cli repository on GitHub carries no licence that GitHub detects, and the app and IDE are proprietary downloads. That is a change from Gemini CLI, which was Apache-2.0."
---

Google Antigravity is Google's **agentic development platform**, launched alongside Gemini 3 in November 2025. It began as an agent-first IDE with a manager view for supervising several agents at once, and has since become a family of five products that share one agent harness: the **Antigravity App**, the **Antigravity IDE**, **IDE Extensions**, the **Antigravity CLI** (`agy`) and a Python **SDK**.

Agents act across the editor, the terminal and a browser, and report back with **Artifacts** such as plans, task lists, screenshots and browser recordings that you can check without reading raw logs. Antigravity is also where Google sends former [Gemini CLI](/tools/gemini-cli) users: Google unified its developer agents into Antigravity at I/O 2026 and stopped serving Gemini CLI for free, Pro and Ultra accounts in June 2026, and the docs include a Gemini CLI migration guide.

## Highlights

- **Antigravity App.** Google calls it a command center for managing multiple local agents in parallel: group conversations into Projects, work across several workspaces, and automate routine tasks with scheduled messages.
- **Antigravity IDE.** The full agentic IDE, with the agent manager, artifacts and codebase understanding.
- **Antigravity CLI.** A terminal-first surface for running coding agents, executing shell commands and managing background subagents.
- **Browser use.** Agents can drive a browser to verify what they built; it is included on the free plan.
- **Orchestrator.** Pairs a top-tier planner model with a faster executor model in the same conversation. Pro and Ultra let you pick both models.
- **Thinking levels.** Low, Medium and High on most adjustable Gemini models, with an Extra level on Gemini 4 Neon and Gemini 4 Hydrogen (`--effort xhigh` in the CLI).
- **Python SDK.** Apache-2.0, for prototyping custom agents and running evaluations on the Antigravity harness.

## In an AI-assisted workflow

The app and IDE install from antigravity.google; the CLI is one line:

```bash
# macOS / Linux: installs agy to ~/.local/bin
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy --version

mkdir agy-demo && cd agy-demo
agy                      # interactive TUI in the current directory
```

Coming from Gemini CLI, the migration guide converts extensions into Antigravity plugins, turns legacy custom commands into skills, and reformats MCP configuration.

> [!TIP]
> Antigravity's distinctive bet is verification. On UI work, ask the agent for a browser recording or screenshot of the result and review that Artifact, not just the diff.

## Pricing

As of November 2026, antigravity.google/pricing lists four routes.

| Plan | Cost | Quota and models |
| --- | --- | --- |
| Individual | $0/month, generally available | Baseline agent quota refreshed weekly; Gemini 4 Hydrogen |
| Google AI Pro | Your Google AI Pro subscription | Quota refreshed every 5 hours plus higher weekly limits; Gemini 4 Neon, Carbon and Argon, Orchestrator, `/boost`, Remote Control, optional AI credit overages |
| Google AI Ultra | Your Google AI Ultra subscription | Highest quotas; full access to third-party partner models |
| Business (Google Cloud) | Gemini Enterprise Standard/Plus from $30 per seat/month, or pay-as-you-go with a $0 seat fee | Consumption-based API pricing, spend caps, central admin controls |

The pricing page does not quote dollar figures for Pro and Ultra; those are Google AI subscriptions, priced on Google's own subscription pages. Pro and Ultra require a personal Google Account, so a Google Workspace login has to use a personal account, a Google Cloud project, or Gemini Enterprise.

## Good to know

The model list moves fast. As of November 2026 Google's own tables mark Gemini 3.8 Flash, Gemini 4 Argon, Claude Sonnet 4.6, Claude Opus 4.6 and GPT-OSS-120b for removal on November 30, 2026, which leaves the free plan with Gemini 4 Hydrogen. Check the model table before you build a workflow around a specific model.

Quotas are not published as numbers. Google says rate limits vary by plan, trial status and task complexity, and that free trials may get lower quotas and fewer models.

Antigravity is mostly closed source. Only the Python SDK has an open licence, which matters if you moved from the Apache-2.0 Gemini CLI. It runs on macOS, Windows and Linux.

Alternatives: [Cursor](/tools/cursor) is the comparable multi-agent editor, now built around Grok and Composer models; [Claude Code](/tools/claude-code) is a terminal-first agent on Anthropic's models; [OpenCode](/tools/opencode) and [Codex CLI](/tools/codex-cli) are the open-source terminal agents to consider if licence matters to your team.
