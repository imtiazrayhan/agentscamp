---
name: "GitHub MCP Server"
description: "GitHub's official MCP server — repos, issues, PRs, Actions, and security data for your agent, as a free hosted remote or a local Docker server."
date: 2026-06-11
url: "https://github.com/mcp"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/github/github-mcp-server"
license: "MIT"
os: ["Web", "macOS", "Windows", "Linux"]
color: "blue"
topics: ["mcp"]
tags: ["mcp", "github", "git", "ci", "code-review"]
featured: true
sameAs:
  - "https://github.com/github/github-mcp-server"
  - "https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "git-github-expert", "create-pr", "review-pr", "claude-code-ci-github-actions"]
summary: "GitHub's official MCP server gives agents the full GitHub surface — repositories, issues, pull requests, Actions, code and secret scanning, Dependabot, discussions, projects — organized into toolsets you can enable selectively, each with a read-only variant. Use the hosted remote at api.githubcopilot.com/mcp with a PAT or OAuth, or run it locally via Docker."
faq:
  - q: "How do I add the GitHub MCP server to Claude Code?"
    a: "Hosted remote with a PAT: claude mcp add --transport http github https://api.githubcopilot.com/mcp -H \"Authorization: Bearer YOUR_GITHUB_PAT\". Locally instead: claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_PAT -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server."
  - q: "What can the GitHub MCP server do?"
    a: "Seventeen toolsets cover most of GitHub: repos, issues, pull_requests, actions, code_security, secret_protection, dependabot, discussions, gists, git, labels, notifications, orgs, projects, and more. You scope what's exposed by enabling toolsets per URL or env var, and any toolset can be mounted read-only."
  - q: "Do I need a Copilot subscription to use it?"
    a: "No — the server is MIT-licensed and the hosted remote is free with a GitHub account and a PAT. The one exception is the remote-only create_pull_request_with_copilot tool, which delegates work to the Copilot coding agent and requires a Copilot plan."
---

The GitHub MCP Server is GitHub's official bridge between agents and everything on github.com — and the most consequential MCP server for day-to-day development work. Issues become readable context, PRs become something the agent can review and update, Actions logs become debuggable, and security findings become fixable, all without leaving the session.

## Highlights

- **Seventeen toolsets, enabled selectively** — `repos`, `issues`, `pull_requests`, `actions`, `code_security`, `secret_protection`, `dependabot`, `discussions`, `projects`, and more. Mount only what the task needs.
- **Read-only variants** — every toolset has one (append `/readonly` to the hosted URL); the right default for review-and-triage agents.
- **Hosted or local** — the free hosted remote at `api.githubcopilot.com/mcp` (OAuth 2.1 or PAT), or the same MIT server self-hosted via Docker, including GitHub Enterprise support.
- **Per-toolset URLs** — `…/mcp/x/issues` exposes just the issues toolset; clean composition for narrowly-scoped agents.
- **Copilot handoff** — the remote-only `create_pull_request_with_copilot` tool delegates a task to the Copilot coding agent (Copilot subscription required).

## In an AI-assisted workflow

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp \
  -H "Authorization: Bearer YOUR_GITHUB_PAT"
# then:
# > Triage the open issues labeled "bug", reproduce the top one, and draft a fix PR
```

The agent reads the issue thread, checks related PRs and CI runs, and works the task with real project state instead of your paraphrase of it.

> [!WARNING]
> The server can do whatever your token can. Use a fine-grained PAT scoped to the repos and permissions the agent actually needs (the docs' minimum: `repo`, `read:packages`, `read:org`), and prefer read-only toolsets for agents that shouldn't write. Then mirror those limits in [Claude Code's own permission rules](/guides/configuration/claude-code-settings-permissions) — `mcp__github__*` deny rules are your second fence.

## Good to know

MIT-licensed, ~30k GitHub stars, and actively developed by GitHub itself — the hosted remote went GA in late 2025 with OAuth 2.1 + PKCE. One Windows-specific gotcha from GitHub's own install guide: if `claude mcp add-json` fails with "Invalid input", use the `--transport http` form shown above instead. For driving GitHub from CI rather than a session, the same plumbing powers the [Claude Code GitHub Action](/guides/advanced/claude-code-ci-github-actions).
