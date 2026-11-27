---
name: "Greptile"
description: "An AI code review agent that reviews pull requests with full-codebase context, learns your team's standards, and tests PRs end to end with TREX."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.greptile.com"
pricing: "freemium"
category: "review"
os: ["Web"]
color: "green"
topics: ["review-qa"]
audience: ["developers"]
tags: ["code-review", "ai-review", "pull-requests", "ci"]
featured: false
alternativeTo: ["coderabbit"]
sameAs:
  - "https://github.com/greptileai"
  - "https://twitter.com/greptile"
  - "https://www.linkedin.com/company/greptile"
related: ["tool:coderabbit", "tool:qodo", "guide:best-ai-code-review-tools-2026", "agent:code-reviewer", "command:review-pr", "guide:claude-code-ci-github-actions"]
summary: "Greptile reviews pull requests against a graph of the whole repository, not only the diff, so it can flag callers and contracts a change breaks. It learns from your team's reactions, takes rules in plain English, and hands fixes to a coding agent. Starter is free for one developer; Pro has no seat fee and bills per review credit."
faq:
  - q: "How much does Greptile cost?"
    a: "As of November 2026, from greptile.com/pricing: Starter is free for one active developer with 50 credits a month, and Pro has no seat fees and sells credits at $1 each, shared across the organization. A Base review costs 1 credit, Plus 3, Apex 10, and a TREX run 3 on top of the review. Enterprise is custom-priced."
  - q: "Which code hosts does Greptile support?"
    a: "On Greptile Cloud, on all plans: GitHub Cloud, GitLab.com and Bitbucket Cloud, plus Cursor Origin, which is in beta as of November 2026. GitHub Enterprise Server, GitHub Enterprise Cloud with data residency, GitLab Self-Managed, Bitbucket Data Center and Gitea need the Enterprise plan, and Perforce works only in on-premises deployments."
  - q: "What is TREX?"
    a: "Greptile's end-to-end testing agent. It builds and starts your app in a sandbox from a per-repository environment, clicks through the flows a pull request affects (or custom flows you write), and posts findings on the PR with a recording of each flow. It works with any review tier."
  - q: "Can I run Greptile before opening a pull request?"
    a: "Yes. The Greptile CLI reviews a local branch against the default branch: install it with npm install -g greptile@latest or Homebrew, run greptile login once, then greptile review from the repository root. It reviews committed, unmerged changes and ignores uncommitted ones."
---

Greptile is an AI code review agent built around one idea: most real bugs are not visible in the changed lines alone. It builds a graph of your repository (functions, classes, imports, dependencies) and reviews each pull request against it, which is how it flags the caller you forgot to update or the validation that every sibling endpoint has and yours lacks. The company raised a $25M Series A led by Benchmark in September 2025, and its site says over 22,000 teams use it.

## Highlights

- **Full-codebase context.** Reviews reason over the repository graph and, if you set up repo clusters, over related repositories too.
- **Review tiers.** Base, Plus and Apex set how deep a review goes; Auto picks a tier per PR from its size, risk and complexity. Tier rules let you force Apex on PRs into `main` or on PRs that touch more than 30 files.
- **Learns your standards.** Thumbs up, thumbs down and short replies on its comments teach it what your team ignores and prefers. Custom rules are written in plain English, and repo-level behaviour lives in `greptile.json` or a `.greptile/` directory.
- **TREX.** An end-to-end testing agent that runs the PR branch in a sandbox and posts a recording of each flow it tested.
- **Fix with your Agent.** Each comment has a button that sends the issue, with file paths, line numbers and suggested code, to Claude Code, Codex, Conductor, Cursor or Devin. An MCP server and a Claude Code plugin expose the same review data inside the editor.
- **CLI.** `greptile review` checks a local branch before a PR exists.
- **Deployment.** Cloud is SOC 2 Type II. Enterprise can self-host with Docker Compose (up to about 100 developers) or Kubernetes, including air-gapped setups with your own LLM provider.

## In an AI-assisted workflow

For PR review, sign up at app.greptile.com, open **Code Providers**, install the Greptile GitHub App (or add a GitLab access token), and enable repositories. Reviews then post on new pull requests.

To review before you push:

```bash
npm install -g greptile@latest     # needs Node.js 22+; or: brew install greptileai/tap/greptile
greptile login
git checkout new-feature
greptile review                    # compares with the default branch
greptile review --branch main      # or name the base branch
```

Inside Claude Code, the plugin connects Greptile's MCP server so you can ask the agent to fetch and fix a PR's unaddressed comments:

```text
/plugin marketplace add greptileai/claude-plugin
/plugin install greptile@greptile-claude-plugin
```

Repo-level settings go in `greptile.json`, for example:

```json
{
  "strictness": 2,
  "commentTypes": ["logic", "syntax", "style"],
  "ignorePatterns": "**/*.test.js\n**/vendor/**"
}
```

That closes the loop the [CI review guide](/guides/advanced/claude-code-ci-github-actions) describes: an agent writes the code, Greptile reviews it with repo-wide context, and the findings go back to the agent that wrote it.

> [!TIP]
> Keep human review on high-stakes paths for the first weeks. Greptile's signal improves as it collects your team's reactions, and auto-approve, which is in beta as of November 2026, is meant only for PRs it rates low-risk with a clean 5/5 review.

## Pricing

Greptile dropped per-seat pricing; you now pay per review. As of November 2026, from greptile.com/pricing, Starter is free for one active developer with unlimited repositories and 50 credits a month. Pro, as of November 2026, has unlimited developers and agents with no seat fees, and credits cost $1 each, shared across the organization. Pro adds learning and custom context, cross-repo context, the Knowledge Base MCP, a team analytics dashboard and the Jira, Linear and Notion integrations. Enterprise is custom-priced and adds self-hosting, SSO and SAML, role-based access control and the self-managed code hosts.

Credits map to review depth: a Base review is 1 credit, Plus is 3, Apex is 10, and a TREX run is 3 on top of the review. So, as of November 2026, an Apex review with TREX costs $13 on Pro, and a team on Auto pays whatever tier ran for each PR.

Qualified non-commercial projects with an OSI-approved license are free. As of November 2026, pre-Series A startups with 20 or fewer employees and under $2M in revenue get 500 free credits a month for six months.

## Good to know

Usage pricing cuts both ways. A small team that opens few PRs pays less than it would per seat, while a team whose agents open dozens of PRs a day should set tier rules and a default tier before turning it on, because Auto can choose a 10-credit Apex review on its own.

Greptile is proprietary SaaS; its GitHub organization hosts the CLI, plugins and integrations, not the review engine. Self-hosting needs a real server: Greptile's sizing table starts at 4 cores and 16 GB of RAM for 5 to 10 developers, plus PostgreSQL with pgvector and Redis.

Among the alternatives, [CodeRabbit](/tools/coderabbit) is the closest like-for-like PR reviewer, and [Qodo](/tools/qodo) adds Azure DevOps and Gerrit support and a rules system aimed at large organizations. If you only want a second opinion inside an agent session, the [code-reviewer agent](/agents/quality-security/code-reviewer) and the [/review-pr command](/commands/review/review-pr) run in Claude Code with no extra service. [Best AI Code Review Tools in 2026](/guides/comparisons/best-ai-code-review-tools-2026) ranks the field.
