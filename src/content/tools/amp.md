---
name: "Amp"
description: "Agentic coding tool, independent of Sourcegraph since December 2025: a CLI plus apps for the web, Mac, iPhone, and iPad, tuned for frontier-model coding."
seoDescription: "Amp is an agentic coding tool that spun out of Sourcegraph in 2025: a CLI plus web and Apple apps for frontier models. Features, pricing, and alternatives."
date: 2026-06-03
updated: "2026-09-11"
reviewed: "2026-09-11"
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
summary: "Amp is an agentic coding tool that spun out of Sourcegraph in December 2025: a CLI plus apps for the web, Mac, iPhone, and iPad that run frontier models to read, edit, and run commands across a repository. Subagents parallelize independent sub-tasks, the Oracle adds a second-opinion reasoning model, and threads can be shared with a workspace."
faq:
  - q: "What is Amp?"
    a: "Amp is an agentic coding tool made by Amp, which spun out of Sourcegraph as an independent company in December 2025. You drive it from the terminal CLI or Amp's apps for the web, Mac, iPhone, and iPad, describe a task, and the agent reads, edits, and runs commands across your repository. It tracks the strongest available models rather than locking you to one, and adds subagents, a second-opinion Oracle model, and shareable threads."
  - q: "How much does Amp cost?"
    a: "Plans, as of September 2026 from ampcode.com/pricing: Hobby is free, with bring-your-own keys, linked ChatGPT and other subscriptions, pay-as-you-go orbs (or your own runners at no charge), and no Amp token fees. Individual is $20/month for the Megawatt tier, which includes 45,000 minutes (750 hours) of orb time. On Teams, members keep their own Hobby, Megawatt, or Gigawatt plans at no extra charge, and Enterprise is custom-priced. Amp Free closed to new users in February 2026."
  - q: "How do I install Amp?"
    a: "Install the CLI with curl -fsSL https://ampcode.com/install.sh | bash, then run amp inside your project. The CLI runs on macOS, Linux, and Windows via WSL. Amp retired its editor extensions in February 2026; the CLI, the web app, and the Mac, iPhone, and iPad apps are the current surfaces."
---

Amp is an agentic coding tool built to run frontier models with as little ceremony as possible. It began at Sourcegraph and has been developed by an independent company since December 2025. You drive it from the terminal or Amp's apps for the web, Mac, iPhone, and iPad, describe a task, and the agent reads, edits, and runs commands across your repository to carry it out. Its stated philosophy is that Amp "goes where the models take it" — "no backward compatibility, no legacy features" — so the product tracks the strongest available models rather than locking you to one.

It is aimed at developers who want an autonomous agent for real work — multi-file changes, refactors, debugging — and teams who want to share and reuse what worked. If you have used Claude Code or Cody and want a usage-priced agent that spans the CLI, the web, and remote machines, Amp is built for that audience.

## Highlights

- **Subagents** — spin off parallel agents for independent sub-tasks, keeping the main thread's context clean while work runs concurrently.
- **The Oracle** — a "second opinion" reasoning model you invoke for planning, deep analysis, or untangling a hard bug, separate from the agent doing the edits.
- **Shareable threads** — conversations carry full context and can be shared with a workspace, so teammates can reuse a successful run instead of re-prompting from scratch.
- **The Dial** — since July 2026, the `low`, `medium`, `high`, and `ultra` modes trade cost against capability, replacing the older `smart`, `deep`, `rush`, and `large` modes.
- **CLI, apps, and remote orbs** — the CLI (rebuilt in May 2026) runs in your terminal, apps cover the web, Mac, iPhone, and iPad, and orbs run agents on remote machines that keep working after you close your laptop. Amp retired its editor extensions in February 2026.
- **Tools, MCP, and skills** — shell, file edits, and web access out of the box, extensible with MCP servers and task-specific skill packages.
- **Code review and cross-repo search** — built-in review with customizable checks, plus a librarian for searching code across repositories.

## In an AI-assisted workflow

Amp fits where you already work — usually a terminal tab. A typical loop is to state the goal, let the agent draft a plan, then have it edit across files while you watch the diffs. For thornier work, ask the Oracle to reason about the approach before the agent commits to edits, and break wide changes into subagents that run in parallel.

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

Amp started at Sourcegraph (not to be confused with Sourcegraph's Cody assistant) and has been an independent company since December 2025. The CLI runs on macOS, Linux, and Windows via WSL; Amp retired its editor extensions in February 2026.

Plans, as of September 2026 from ampcode.com/pricing: Hobby is free, with bring-your-own keys, linked ChatGPT and other subscriptions, pay-as-you-go orbs (or your own runners at no charge), and no Amp token fees. Individual is $20/month for the Megawatt tier, which includes 45,000 minutes (750 hours) of orb time. On Teams, members keep their own Hobby, Megawatt, or Gigawatt plans at no extra charge, and Enterprise is custom-priced, adding SCIM, admin controls, and retention policy. Included usage resets each billing period and does not roll over, and purchased credits expire twelve months after purchase. Amp Free closed to new users in February 2026; Hobby is now the free plan.
