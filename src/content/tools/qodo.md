---
name: "Qodo"
description: "An AI code review platform (formerly CodiumAI): multi-agent pull request review against your team's rules, plus review skills for coding agents."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.qodo.ai"
pricing: "paid"
category: "review"
os: ["Web", "macOS", "Windows", "Linux"]
color: "purple"
topics: ["review-qa"]
audience: ["developers"]
tags: ["code-review", "ai-review", "pull-requests", "testing"]
featured: false
alternativeTo: ["coderabbit", "greptile"]
sameAs:
  - "https://github.com/qodo-ai"
  - "https://x.com/QodoAI"
  - "https://www.linkedin.com/company/qodoai"
related: ["tool:coderabbit", "tool:greptile", "guide:best-ai-code-review-tools-2026", "command:review-pr", "agent:code-reviewer", "agent:test-engineer"]
summary: "Qodo (formerly CodiumAI) is an AI code review platform. Qodo 2.0, released in February 2026, reviews pull requests with specialized agents and a rules system on GitHub, GitLab, Bitbucket and Azure DevOps. Billing is by pooled workspace credits after a 14-day trial, with no permanent free tier. The IDE plugin was retired on October 30, 2026."
faq:
  - q: "Is Qodo free?"
    a: "Not after the trial. As of November 2026, every workspace starts with a 14-day free trial with no credit card, and Qodo's pricing page says it does not offer a permanent free tier; after that, Pro Team credit packs start at $30 a month for 2,000 credits. PR-Agent's README says Qodo offers a free version for open-source projects."
  - q: "Is PR-Agent the free version of Qodo?"
    a: "No. PR-Agent is the open-source reviewer Qodo originally built and has since donated to the community. It lives at The-PR-Agent/pr-agent under the MIT license, is community-owned, and its README calls it a community-maintained legacy project that is distinct from Qodo's product. You self-host it and bring your own model key."
  - q: "What happened to the Qodo IDE plugin and Qodo Command?"
    a: "Both are gone. The Qodo IDE plugin for VS Code, JetBrains IDEs and Visual Studio was retired on October 30, 2026 on every plan and deployment type, and reinstalling it does not restore it. Qodo's docs also list the Qodo Command CLI (@qodo/command) and Qodo Gen CLI as deprecated. The replacement for local review is the Qodo Agentic Toolbox."
  - q: "Which Git platforms does Qodo support?"
    a: "GitHub, GitLab, Bitbucket and Azure DevOps on the Pro Team plan, in multi-tenant SaaS. Gerrit support, single-tenant SaaS, on-premises and air-gapped deployment, and bring-your-own LLM keys are Enterprise only, as of November 2026."
---

Qodo, the company formerly called CodiumAI (it renamed itself in September 2024), sells AI code review: a service that reviews every pull request against your codebase's history and your team's rules. **Qodo 2.0**, released on February 4, 2026, replaced single-pass review with a multi-agent design in which specialized agents each handle one kind of analysis.

The product has narrowed during 2026. The IDE plugin, the Qodo Command CLI and the open-source test generator are retired, deprecated or unmaintained, and PR-Agent has been handed to the community. What remains is PR review, a rules system, and a toolbox that brings both into coding agents.

## Highlights

- **Multi-agent PR review.** Specialized agents each review a pull request for one kind of issue, with their own context, which Qodo says is how it keeps both recall and precision on real PRs.
- **Context Engine.** Reviews draw on codebase knowledge and PR history, so a finding can cite how a similar change was handled before. Cross-repository review and a Software Map of repository relationships cover changes that break another repo.
- **Rules system.** Review Standards are central rules the reviewer enforces, with no limit on rule count on either plan, and Qodo suggests new rules mined from past reviews.
- **Agentic Toolbox.** Skills for coding agents: Review (local changes before a PR), Review Resolver (fix findings from a PR review), Codebase Wisdom, Get Rules and Manage Standards. It installs through a CLI or connects over MCP, with plugins for Claude Code, Codex and Kiro.
- **Git coverage.** GitHub, GitLab, Bitbucket and Azure DevOps on Pro Team; Gerrit on Enterprise.
- **Usage billing.** One pooled credit balance per workspace, unlimited users, no seat fees.

## In an AI-assisted workflow

Set up PR review in three steps, per Qodo's quickstart:

1. Sign in at app.qodo.ai with Google, GitHub or email. The 14-day trial starts at signup.
2. In the portal, click **+** next to Git providers, choose your provider, and follow the wizard. For GitHub you need organization admin access; Qodo recommends installing from its portal, not from GitHub Marketplace, so every feature is configured.
3. Open a pull request. Reviews post on it automatically.

To review locally from a coding agent, install the Agentic Toolbox (Node.js 20 or later):

```bash
# macOS, Linux, Git Bash and WSL
curl -fsSL https://get.qodo.ai | sh
```

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -Command "irm https://get.qodo.ai/install.ps1 | iex"
```

The installer configures Qodo's skills for the agent environments it finds. You sign in to Qodo when the agent first uses one, then ask the agent to review your changes before you open the PR.

> [!NOTE]
> PR-Agent is not Qodo any more. Qodo donated it to the community; it lives at The-PR-Agent/pr-agent, is MIT-licensed and community-owned, and had about 16,700 GitHub stars as of November 2026. Choose PR-Agent if you want a self-hosted reviewer you run with your own model keys, and Qodo if you want the hosted platform with rules and cross-repo context.

## Pricing

As of November 2026, from qodo.ai/pricing, every workspace starts with a 14-day free trial that costs $0 and needs no credit card, capped at 100 code reviews a day. There is no permanent free tier: when the trial ends, reviews pause until you pick a plan.

As of November 2026, Pro Team is sold as monthly credit packs at $0.015 per credit, with packs listed at $30, $60 and $240 a month. Qodo's page, as of November 2026, equates the $30 pack to 2,000 credits, or roughly 19 PR reviews. Credits are pooled across the workspace, larger and more complex PRs draw more, and overage is billed at the same rate up to a spending cap you set. There are no rate limits and no annual commitment.

Enterprise is custom-priced and adds single-tenant SaaS, on-premises and air-gapped deployment, Gerrit, bring-your-own LLM keys, audit logs and an SLA.

## Good to know

Going by Qodo's own estimate, the entry pack works out to more than a dollar and a half per review, so model your PR volume before choosing a pack. A team that merges 200 PRs a month needs roughly ten times the entry pack.

Expect product churn. Qodo retired the IDE plugin in October 2026, its docs list both older CLIs as deprecated, and the README of [Qodo Cover](https://github.com/qodo-ai/qodo-cover), its AGPL-3.0 test-generation tool, says the repository is no longer maintained. Older tutorials that tell you to install the VS Code extension or run `npm install -g @qodo/command` no longer apply.

Against the alternatives: [Greptile](/tools/greptile) also bills per review and keeps a free tier for one developer; [CodeRabbit](/tools/coderabbit) is the other mainstream hosted PR reviewer. Qodo's edge is platform coverage (Azure DevOps and Gerrit) and central rule management for large organizations. For a no-service option inside Claude Code, see the [/review-pr command](/commands/review/review-pr) and the [code-reviewer agent](/agents/quality-security/code-reviewer). [Best AI Code Review Tools in 2026](/guides/comparisons/best-ai-code-review-tools-2026) compares them all.
