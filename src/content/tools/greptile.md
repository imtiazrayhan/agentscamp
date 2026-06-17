---
name: "Greptile"
description: "An AI code review agent that reviews pull requests with full-codebase context — catching multi-file logical bugs and learning your team's standards."
date: 2026-06-11
url: "https://www.greptile.com"
pricing: "paid"
category: "review"
os: ["Web"]
color: "green"
topics: ["review-qa"]
tags: ["code-review", "ai-review", "pull-requests", "ci"]
featured: false
alternativeTo: ["coderabbit"]
sameAs:
  - "https://github.com/greptileai"
  - "https://twitter.com/greptile"
  - "https://www.linkedin.com/company/greptile"
related: ["coderabbit", "qodo", "best-ai-code-review-tools-2026", "code-reviewer", "review-pr", "claude-code-ci-github-actions"]
summary: "Greptile reviews pull requests with full context of the codebase — not just the diff — so it catches multi-file logical bugs diff-scoped reviewers miss. It learns team standards from your engineers' own PR comments, takes custom rules in plain English (and reads CLAUDE.md/.cursorrules), and hands fixes off to Claude Code or Cursor. Paid per seat, 14-day trial; free for qualifying open source."
faq:
  - q: "What makes Greptile different from other AI code reviewers?"
    a: "Codebase-wide context and learned standards. It indexes the whole repository, so a review considers callers, conventions, and side effects beyond the diff — and its v4 architecture learns from how your engineers actually comment on PRs, cutting nitpick noise over time. Custom rules are plain English, and it auto-detects CLAUDE.md and .cursorrules files."
  - q: "How much does Greptile cost?"
    a: "It's a paid product — Pro runs $30 per seat/month with 50 reviews per seat included ($1 per extra review), with a 14-day trial, a 50% startup discount, and custom Enterprise plans. There's no permanent free tier, but qualifying open-source projects (MIT/Apache/GPL, non-commercial) get it free."
  - q: "Does Greptile work with GitLab and self-hosting?"
    a: "Yes on both: GitHub (Cloud and Enterprise Server) and GitLab (Cloud and Self-Managed) are supported, and the platform is SOC 2 Type II with self-hosted deployment via Docker Compose or Kubernetes — including air-gapped setups with custom LLMs for stricter environments."
---

Greptile attacks the weakness of diff-scoped review: most real bugs aren't visible in the changed lines alone. It indexes your **entire codebase** and reviews every pull request against that context — the callers of the function you changed, the convention the rest of the module follows, the invariant two files away — which is how it catches the multi-file logical bugs that pattern-matching reviewers wave through.

## Highlights

- **Full-codebase context** — reviews reason over the repository, not the diff, targeting cross-file logic errors.
- **Learns your standards** — the v4 agent architecture (March 2026) learns from your engineers' own PR comments, so the bot's taste converges on the team's and nitpick noise drops.
- **Rules in plain English** — codify standards conversationally; it also auto-detects existing `CLAUDE.md` and `.cursorrules` files as conventions.
- **Agent handoff** — "Fix with your Agent" sends findings straight to Claude Code, Cursor, or Codex; an MCP server exposes reviews and patterns inside those tools.
- **CLI for local review** — `npm i -g greptile` reviews branches from the terminal before a PR exists.
- **Enterprise posture** — SOC 2 Type II, SSO, audit logs, and self-hosting (Docker/Kubernetes, air-gapped with custom LLMs).

## In an AI-assisted workflow

Install the GitHub or GitLab app, select repos, and reviews start appearing on PRs within minutes. The compounding loop is the point: agents write more of the code, Greptile reviews it with repo-wide context, and its findings route back to the agent that wrote it — closing the [write → review → fix](/guides/advanced/claude-code-ci-github-actions) cycle without a human ferrying comments.

> [!TIP]
> Treat the learning period deliberately: keep human review on high-stakes paths for the first weeks while Greptile absorbs your team's comment patterns — its precision visibly improves as it learns what your engineers actually flag.

## Good to know

Greptile is a proprietary SaaS (the GitHub org hosts integrations, not the product), backed by a $25M Series A led by Benchmark (September 2025) and used by 9,000+ teams including Brex and PostHog by mid-2026. Reviews are metered per seat (50/month on Pro, then per-review) — relevant for very high-PR-volume teams. GitHub and GitLab only; Bitbucket/Azure DevOps shops should look at [Qodo](/tools/qodo). How it stacks against the field is in [Best AI Code Review Tools in 2026](/guides/comparisons/best-ai-code-review-tools-2026).
