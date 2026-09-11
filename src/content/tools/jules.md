---
name: "Jules"
title: "Jules"
description: "Google's asynchronous coding agent: it clones your GitHub repo into a cloud VM, proposes a plan built with Gemini, and opens a pull request once you approve."
date: "2026-09-11"
url: "https://jules.google"
pricing: "freemium"
category: "agent"
os: ["Web"]
color: "blue"
topics: ["coding-languages", "workflow-prompting"]
audience: ["developers", "ai-engineers"]
tags: ["agent", "async", "cloud", "github", "google"]
featured: false
sameAs:
  - "https://www.npmjs.com/package/@google/jules"
  - "https://github.com/google-labs-code"
related: ["tool:devin", "tool:codex-cli", "tool:claude-code", "tool:antigravity", "guide:best-claude-code-alternatives-2026", "guide:claude-code-ci-github-actions"]
alternativeTo: ["devin", "codex-cli", "factory", "github-copilot", "antigravity", "claude-code"]
summary: "Jules is Google Labs' asynchronous coding agent, free for up to 15 tasks a day. You connect a GitHub repo and describe a task; Jules works in a Google-hosted VM, proposes a Gemini-built plan, shows diffs for approval and opens a pull request. It is proprietary and labeled experimental, and its changelog's latest entry is March 9, 2026."
faq:
  - q: "What does Jules add over Claude Code?"
    a: "Jules is fully asynchronous: tasks run in Google-hosted cloud VMs against your GitHub repository, not in a terminal session on your machine, so you can queue work and walk away. It runs up to 60 tasks at once on the Google AI Ultra tier and automatically fixes failing GitHub Actions checks."
  - q: "How do I start using Jules?"
    a: "Sign in at jules.google with a Google account, connect GitHub, pick a repository and describe the task. You can also assign a GitHub issue to it by adding the jules label. For the terminal, install the Jules Tools CLI with npm install -g @google/jules and run jules to open its dashboard."
  - q: "Is Jules free?"
    a: "Yes. As of September 2026, the free tier allows 15 tasks per rolling 24 hours with 3 running at once. A Google AI Pro plan raises that to 100 tasks and 15 concurrent, and Google AI Ultra to 300 tasks and 60 concurrent."
---

Jules is Google's **asynchronous coding agent**: you hand it a task against a GitHub repository, it works in a virtual machine on Google's infrastructure, and you come back to a plan, a diff and a pull request. Pick it when you want to queue well-scoped tasks without keeping a local session open; the free tier covers 15 tasks a day as of September 2026. Google Labs still calls it "an experimental coding agent", and its public changelog's latest entry is dated March 9, 2026.

## Highlights

- **Async cloud VM.** Jules clones your code, installs dependencies and modifies files in its own VM, so there's no local session to babysit.
- **Plan, approve, PR.** It proposes a plan and shows diffs for approval before opening a pull request. Adding the `jules` label to a GitHub issue assigns that issue to it.
- **CI failure fixes.** It detects failed GitHub Actions checks and fixes them, with configurable commit authorship (changelog, February 2026).
- **MCP integrations.** Linear, Stitch, Neon, Tinybird, [Context7](/tools/context7) and Supabase connect over MCP (changelog, February 2026).
- **Planning Critic.** A second agent reviews auto-approved plans; Google's changelog reports a 9.5% lower failure rate, a vendor figure (January 2026). Jules also looks for performance optimizations on its own.
- **Gemini models, more ways in.** Plans are built with Gemini models, and Gemini 3.1 Pro reached Pro-plan users in March 2026. Beyond the web app there's the Jules Tools CLI, a REST API and the MIT-licensed `google-labs-code/jules-action` GitHub Action.

## In an AI-assisted workflow

Start in the browser: sign in at jules.google, connect GitHub, pick a repository and describe the task. For the terminal, the Jules Tools CLI installs from npm, per Google's CLI reference:

```bash
npm install -g @google/jules
```

Run `jules` on its own for a TUI dashboard, or use the `jules remote` subcommands (`new`, `list` and `pull`) to work with remote tasks. Tasks written like tickets give the planner the most to work with:

```text
Add cursor-based pagination to GET /api/orders, update the OpenAPI spec, and add tests.
Bump Express to the latest minor version and fix anything the upgrade breaks.
```

Review what comes back like any contributor's PR: our [review-pr command](/commands/review/review-pr) has [Claude Code](/tools/claude-code) check a pull request for correctness, security and style. If you want GitHub-triggered automation with Claude instead, [Running Claude Code in CI](/guides/advanced/claude-code-ci-github-actions) covers headless mode and the official GitHub Action.

> [!TIP]
> Reject a wrong plan rather than a wrong PR. Jules shows its plan before it edits, and a two-line correction at that stage is cheaper than reviewing a diff built on a misunderstanding.

## How it compares to Devin, Codex and Antigravity

| Tool | Where the work runs | Free option |
|---|---|---|
| Jules | Google cloud VMs, from GitHub | 15 tasks per 24 hours |
| [Devin](/tools/devin) | Cloud VMs, plus Devin Desktop and Devin CLI | Free plan, limited usage |
| [Codex](/tools/codex-cli) | Codex Web in the cloud, plus the local CLI | Included in ChatGPT Free and Go |
| [Google Antigravity](/tools/antigravity) | Desktop app and `agy` CLI | Free Individual plan |

Devin is the closest match in shape, and one Devin plan also covers Devin Desktop, the IDE called Windsurf until its June 2026 rename. Codex pairs a cloud agent with a local CLI and is included even in ChatGPT's Free and Go plans. Antigravity is Google's other agent product, built around a desktop app and a CLI rather than GitHub-driven cloud tasks.

## Good to know

- **License:** proprietary. Only the `jules-action` GitHub Action is open source (MIT).
- **Platforms:** Jules is a web app that runs in any browser. The CLI installs through npm, and Google doesn't list supported operating systems for it.
- **Freshness:** as of September 2026, the changelog's latest entry is dated March 9, 2026 (Gemini 3.1 Pro for Pro-plan users), and the `@google/jules` npm package was last published in December 2025, at version 0.1.42. Check both before you build a team workflow on it.
- **Limits:** higher task and concurrency limits come with a Google AI Pro or Ultra subscription; there's no separate Jules purchase in the usage docs.

Comparing cloud agents with terminal ones? [The best Claude Code alternatives](/guides/comparisons/best-claude-code-alternatives-2026) covers both.
