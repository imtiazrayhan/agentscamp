---
name: "Kiro"
title: "Kiro"
description: "AWS's agentic IDE and CLI that turns a prompt into a spec of requirements, design and tasks, then checks the code against it with property-based tests."
date: "2026-09-11"
url: "https://kiro.dev"
pricing: "freemium"
category: "ide"
os: ["macOS", "Windows", "Linux", "Web"]
color: "blue"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["ide", "cli", "spec-driven", "aws", "agent"]
featured: false
sameAs:
  - "https://github.com/kirodotdev"
  - "https://x.com/kirodotdev"
related: ["tool:claude-code", "tool:cursor", "guide:spec-driven-development", "guide:best-claude-code-alternatives-2026", "guide:best-github-copilot-alternatives-2026", "skill:property-test-designer"]
alternativeTo: ["cursor", "claude-code", "windsurf", "antigravity", "github-copilot", "codex-cli"]
summary: "Kiro is AWS's spec-driven coding agent for the IDE, terminal and web, with a free plan. It turns a prompt into requirements, a design and sequenced tasks, then checks the code against them with property-based tests. It is proprietary, and one agent harness carries specs, hooks and MCP servers across the IDE, the kiro-cli agent and Kiro Web."
faq:
  - q: "What does Kiro add over Claude Code?"
    a: "A structured spec workflow: Kiro turns a prompt into requirements, a design and sequenced tasks, then uses property-based testing to check the code against those requirements. One agent harness spans a desktop IDE, the kiro-cli terminal agent and cloud sandboxes in Kiro Web, and AWS operates the platform with enterprise options such as SSO and centralized billing."
  - q: "How do I install Kiro?"
    a: "For the terminal agent, run curl -fsSL https://cli.kiro.dev/install | bash, then start kiro-cli inside your project. For the IDE, download the installer for your operating system from kiro.dev/downloads. Kiro Web runs in the browser at app.kiro.dev on the Pro, Pro+, Pro Max and Power plans."
  - q: "Is Kiro free?"
    a: "Yes. As of September 2026, the Free plan includes 50 credits a month for open-weight models and Claude Sonnet 4.5, and paid plans run from $20 to $200 per user per month with more credits and premium models. Kiro itself is proprietary; only the Kiro Crew workspace is Apache-2.0."
---

Kiro is AWS's agentic development platform, built around **spec-driven development**: a prompt becomes a written spec of requirements, design decisions and sequenced tasks, and Kiro checks the finished code against that spec with property-based tests. Pick it when you want an agent that works from a reviewable plan across an IDE, a terminal and cloud sandboxes, rather than from a chat thread. It is proprietary, built and operated by AWS, and has a free plan.

Kiro reached general availability in November 2025, when the Kiro CLI launched alongside the IDE. That CLI replaces the Amazon Q Developer CLI, which AWS's docs say "has been rebranded to Kiro". Amazon Q Developer stopped taking new signups on May 15, 2026, and its IDE plugins and paid subscriptions reach end of support on April 30, 2027.

## Highlights

- **Specs before code.** A spec holds requirements, design decisions and implementation tasks, and Requirements Analysis flags contradictions and gaps before any code is written.
- **Property-based testing.** Kiro turns requirements into executable properties and runs them against generated inputs, catching cases "you wouldn't test deliberately".
- **One harness, every surface.** The desktop IDE, the `kiro-cli` terminal agent, Kiro Web and the open-source Kiro Crew workspace share one agent harness, so specs, steering, permissions, hooks, MCP servers and custom agents follow the project. An iOS app for paid plans launched in June 2026.
- **Cloud sessions.** A task starts in a managed sandbox, keeps running while you're away, and resumes from the IDE, CLI, Web or mobile; the feature launched in preview in August 2026.
- **Extensibility and guardrails.** Hooks, Steering, Powers, MCP, custom agents and Agent Skills extend it; permissions, `.kiroignore` and checkpoints you can rewind keep it in bounds.
- **Model choice with an Auto router.** Claude Opus, Sonnet and Haiku models (Claude Opus 5 since July 2026), DeepSeek v3.2 and MiniMax M2.5, plus GPT-5.6 Sol, Terra and Luna with credit multipliers, or an Auto mode that routes for you.

## In an AI-assisted workflow

The terminal agent installs with one command, per Kiro's docs:

```bash
curl -fsSL https://cli.kiro.dev/install | bash
cd my-project
kiro-cli
```

Then work spec-first:

```text
> Write a spec for password reset by email: requirements, design, and tasks
> Before we start, list any contradictions or gaps in the requirements
> Implement the first task and check it against the spec's properties
```

That spec, tasks, implement loop is the one our [spec-driven development guide](/guides/workflow/spec-driven-development) walks through with any agent. If you'd rather stay in [Claude Code](/tools/claude-code) and borrow only Kiro's correctness idea, the [Property Test Designer](/skills/testing/property-test-designer) skill designs property-based tests that assert invariants across hundreds of random inputs.

> [!TIP]
> Review the requirements before you approve the task list. A contradiction fixed in the spec costs a sentence; the same contradiction found in code review costs a rewrite.

## How it compares to Cursor, Antigravity and Claude Code

| Tool | Shape | What stands out |
|---|---|---|
| Kiro | IDE, CLI, Web | Specs plus property-based tests |
| [Cursor](/tools/cursor) | VS Code-based editor | Tab completion, parallel agents |
| [Google Antigravity](/tools/antigravity) | Desktop app plus `agy` CLI | Free Individual plan |
| Claude Code | Terminal, IDE, web | Anthropic's first-party agent |

Cursor is the closer rival for editor-first work. Antigravity is Google's answer, with a free Individual plan whose models include Claude Sonnet and Opus 4.6. Kiro's distinct bet is structure: the spec, not the chat, is the unit of work.

## Good to know

- **License:** proprietary. The `kirodotdev/Kiro` GitHub repo is a public issue and feedback tracker, not the product source. Only Kiro Crew (`kirodotdev/KiroCrew`), announced in August 2026, is Apache-2.0.
- **Platforms:** the IDE runs on macOS (Intel and Apple Silicon), 64-bit Windows 10 and 11, and Linux (Ubuntu 24+, Debian 13+, Fedora 40+, Arch, Mint 22+). The CLI runs on macOS, Windows 11 (PowerShell) and Linux with glibc 2.34+ or musl; Windows support arrived with Kiro CLI 2.0 in April 2026.
- **Pricing:** Plans, as of September 2026 from Kiro's pricing page: Free ($0, 50 credits a month, open-weight models and Claude Sonnet 4.5), Pro ($20 per user per month, 1,000 credits), Pro+ ($40, 2,000 credits), Pro Max ($100, 5,000 credits), Power ($200, 10,000 credits) and custom Enterprise with SSO, centralized billing and analytics. Add-on credits cost $0.04 each on paid plans and expire 12 months after purchase. Usage is metered in credits, and Free-tier model access is also subject to rate limits.
- **Recent changes:** Kiro Web launched in preview in May 2026 and reached general availability on September 1, 2026, cloud sessions in August 2026, and a free year of Kiro for students worldwide in September 2026.

For the wider field, see [the best Claude Code alternatives](/guides/comparisons/best-claude-code-alternatives-2026) and [the best GitHub Copilot alternatives](/guides/comparisons/best-github-copilot-alternatives-2026).
