---
name: "Devin"
description: "Cognition's autonomous AI software engineer that works in its own cloud workspace with an editor, terminal, and browser."
url: "https://devin.ai"
pricing: "freemium"
category: "agent"
color: "blue"
topics: ["coding-languages", "workflow-prompting"]
tags: ["autonomous", "agent", "cloud"]
featured: false
related: ["claude-code", "goose", "amp"]
---

Devin is an autonomous AI software engineer from Cognition. You hand it a task — a bug, a refactor, a migration, a ticket — and it works on its own in a sandboxed cloud workspace that has a code editor, a terminal, and a browser. Rather than suggesting edits inside your editor, Devin plans the work, runs commands, reads logs, navigates docs, and opens a pull request you review at the end.

It is aimed at teams who want to delegate well-scoped engineering work to an agent that runs unattended in the background, in parallel, rather than pairing on it keystroke by keystroke. Devin is most at home on chores and large mechanical jobs — dependency bumps, test backfills, framework migrations, and bug triage — where the spec is clear enough to run without supervision.

## Highlights

- **Own cloud workspace** — each session gets an isolated VM with an editor, terminal, and headless browser, so Devin can install dependencies, run tests, and read its own output instead of guessing.
- **Ships pull requests** — Devin works against your repo, pushes a branch, opens a PR, and responds to review comments, so its output lands in the normal GitHub flow.
- **Parallel sessions** — you can spin up multiple Devins at once (up to 10 concurrent on Free and Pro; unlimited on Max, Teams, and Enterprise) to fan a large job across independent workstreams.
- **Chat and ticket triggers** — tag Devin in Slack, Microsoft Teams, or assign it a Linear ticket and it picks up the context and starts a session without you opening a dashboard.
- **Devin Wiki and Ask Devin** — it indexes your codebase into a searchable wiki and a Q&A interface, so the same workspace doubles as a way to understand the code, not just change it.
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

Devin is a cloud-hosted product with no self-managed install option. Self-serve tiers are Free (a limited quota to try it), Pro at $20/month, and Max at $200/month, each with daily and weekly usage quotas that refresh automatically. Teams is $80/month base plus $40/month per full developer seat with unlimited concurrent sessions; Enterprise is custom-priced. Usage is measured in ACUs (Agent Compute Units — Cognition's normalized measure of VM time, model inference, and bandwidth, roughly 15 minutes of active work per ACU); extra usage beyond included quotas can be purchased at API pricing. Note that Cognition also acquired the Windsurf editor (July 2025), so devin.ai now spans more than the autonomous agent — this entry covers Devin, the agent itself.
