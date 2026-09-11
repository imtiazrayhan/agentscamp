---
name: "Devin"
description: "Cognition's autonomous AI software engineer that works in its own cloud workspace with an editor, terminal, and browser."
date: 2026-06-03
updated: "2026-09-11"
reviewed: "2026-09-11"
url: "https://devin.ai"
pricing: "freemium"
category: "agent"
color: "blue"
topics: ["coding-languages", "workflow-prompting"]
audience: ["developers", "ai-engineers"]
tags: ["autonomous", "agent", "cloud"]
featured: false
related: ["tool:claude-code", "tool:goose", "tool:amp"]
alternativeTo: ["openhands", "swe-agent", "amp", "goose", "claude-code"]
summary: "Devin is Cognition's autonomous AI software engineer. You hand it a task — a bug, refactor, or ticket — and it works unattended in a sandboxed cloud VM with an editor, terminal, and browser, then opens a pull request you review. Trigger it from Slack, Teams, or Linear, run sessions in parallel, and pay through usage quotas plus prepaid on-demand credits."
faq:
  - q: "What is Devin?"
    a: "Devin is an autonomous AI software engineer from Cognition. You hand it a task and it works on its own in a sandboxed cloud workspace with a code editor, terminal, and browser — planning the work, running commands, reading logs, and opening a pull request you review at the end. It is most at home on well-scoped chores like dependency bumps, test backfills, migrations, and bug triage."
  - q: "How much does Devin cost?"
    a: "Self-serve tiers, as of September 2026 from docs.devin.ai: Free (a limited quota to try it, single member), Pro at $20/month, and Max at $200/month, each with daily and weekly usage quotas that refresh automatically. Teams has an $80/month minimum, with full seats at $40/month each (including Devin Desktop), alongside free flex seats that draw on the workspace credit pool; Enterprise is custom-priced. Self-serve usage past the included quota runs on prepaid on-demand credits that roll over, while Enterprise contracts are billed in ACUs (Agent Compute Units) at the rate set in the order form."
  - q: "How do I use Devin?"
    a: "Write a clear, self-contained task and hand it off — tag Devin in Slack or Microsoft Teams, assign it a Linear ticket, or drive it from the CLI, desktop app, or API. It works in its cloud VM, pushes a branch, opens a PR, and responds to review comments, so you review the diff like any other contributor's."
---

Devin is an autonomous AI software engineer from Cognition. You hand it a task — a bug, a refactor, a migration, a ticket — and it works on its own in a sandboxed cloud workspace that has a code editor, a terminal, and a browser. Rather than suggesting edits inside your editor, Devin plans the work, runs commands, reads logs, navigates docs, and opens a pull request you review at the end.

It is aimed at teams who want to delegate well-scoped engineering work to an agent that runs unattended in the background, in parallel, rather than pairing on it keystroke by keystroke. Devin is most at home on chores and large mechanical jobs — dependency bumps, test backfills, framework migrations, and bug triage — where the spec is clear enough to run without supervision.

## Highlights

- **Own cloud workspace** — each session gets an isolated VM with an editor, terminal, and headless browser, so Devin can install dependencies, run tests, and read its own output instead of guessing.
- **Ships pull requests** — Devin works against your repo, pushes a branch, opens a PR, and responds to review comments, so its output lands in the normal GitHub flow.
- **Parallel sessions** — you can spin up multiple Devins at once (Devin's usage docs say there are no concurrent session limits) to fan a large job across independent workstreams.
- **Chat and ticket triggers** — tag Devin in Slack, Microsoft Teams, or assign it a Linear ticket and it picks up the context and starts a session without you opening a dashboard.
- **DeepWiki and Ask Devin** — it indexes your codebase into an auto-generated wiki and a Q&A interface, so the same workspace doubles as a way to understand the code, not just change it.
- **CLI, Desktop, and API** — drive Devin from the command line, a desktop app, or programmatically, and integrate with 100+ tools (Datadog, Stripe, Sentry, Linear, and more).

## In an AI-assisted workflow

Devin fits the "delegate and review" end of the spectrum: you write a clear, self-contained task, hand it off, and check back when the PR is ready. A typical loop is to assign a ticket or message it the scope, let it work in its cloud VM, then review the diff like any other contributor's.

```text
@Devin The /api/export endpoint times out on large accounts.
Reproduce it, find the slow query, add an index + a regression test,
and open a PR against main.
```

> [!TIP]
> Devin is strongest on well-scoped, verifiable tasks where it can run tests to confirm its own work. Vague or sprawling asks ("refactor the codebase") burn through usage and tend to drift — break them into ticket-sized units and review each PR.

> [!NOTE]
> Because Devin runs autonomously and pushes branches, treat its sessions like an external contributor: scope repo permissions, require PR review, and keep secrets out of the workspace.

## Good to know

Devin's agent sessions run in Cognition's cloud, but the product line now includes the local Devin CLI, the Devin Desktop IDE (usable with local-only agents), and self-hosted workers through Devin Outposts. Self-serve tiers, as of September 2026 from docs.devin.ai: Free (a limited quota to try it, one member), Pro at $20/month, and Max at $200/month, each with daily and weekly usage quotas that refresh automatically — Max drops the daily cap and runs on a larger weekly allowance. Teams has an $80/month minimum, with full seats at $40/month each (including Devin Desktop), plus free flex seats that draw on the workspace's shared on-demand credits; Enterprise is custom-priced. Self-serve usage beyond the included quota runs on prepaid on-demand credits that roll over month to month, while Enterprise contracts are billed in ACUs (Agent Compute Units — Cognition's normalized unit of agent effort, reflecting the actions Devin takes plus VM time and bandwidth) at the rate set in the order form. Cognition also acquired the Windsurf editor (July 2025), which became Devin Desktop on June 2, 2026; self-serve plans now cover Devin sessions, the Devin CLI, and Devin Desktop together. This entry covers Devin, the agent itself; see [Devin Desktop](/tools/windsurf) for the editor.
