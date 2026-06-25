---
name: "Factory"
title: "Factory"
description: "Factory is an agent-native software development platform whose Droids plan, write, test, and ship code from the terminal, IDE, and web with org context."
url: "https://factory.ai"
date: 2026-06-24
pricing: "paid"
category: "agent"
sameAs:
  - "https://factory.ai"
  - "https://docs.factory.ai"
  - "https://x.com/FactoryAI"
  - "https://github.com/Factory-AI"
color: "purple"
topics: ["ai-agents-systems", "coding-languages"]
tags: ["agents", "coding", "droids", "cli", "automation"]
featured: false
alternativeTo: ["devin", "claude-code", "codex-cli", "cursor", "amp"]
summary: "Factory is an agent-native software development platform. Its autonomous coding agents, called Droids, plan, write, test, and ship code across the terminal (Droid CLI), IDE, and web, pulling in organizational context from GitHub, Jira, Slack, and your codebase. It targets individual developers and enterprise engineering teams."
related: ["ai-coding-agents-cli-2026", "claude-code-vs-codex-cli", "best-ai-app-builders-2026", "ai-coding-statistics-2026"]
faq:
  - q: "What is Factory?"
    a: "Factory is an agent-native software development platform. Its autonomous coding agents are called Droids: you describe a task in natural language and a Droid plans, writes, tests, and ships code, turning a prompt into a pull request. Droids run in the terminal via the Droid CLI, inside IDEs like VS Code and JetBrains, and on the web, and they pull context from your codebase and tools such as GitHub, Jira, and Slack."
  - q: "How much does Factory cost?"
    a: "Factory is a proprietary paid product. Individual plans are Pro at $20/month, Plus at $100/month, and Max at $200/month, with higher tiers offering more usage and earlier access to features. Teams and Enterprise plans are custom-priced. There is no standing free tier, though Droid Core lets you keep working on a set of open-weight models with separate rate limits. Confirm current plans on the official pricing page."
  - q: "How does Factory compare to Devin?"
    a: "Both are autonomous coding agents that take a task and produce working code. Devin is positioned as a standalone AI software engineer you assign tickets to, while Factory centers on Droids that meet developers where they work — terminal, IDE, and web — and emphasizes organizational context and enterprise deployment options (SaaS, hybrid, on-premise, air-gapped). Factory's Droid is also model-flexible, running Claude, GPT, and Gemini among others."
---

Factory is an agent-native software development platform built around **Droids** — autonomous coding agents that plan, write, test, and ship code from a natural-language prompt. You hand a Droid a task and it works across your codebase, aiming to turn "one prompt to PR" rather than just autocompleting lines.

It is aimed at individual developers who want a capable agent in their existing workflow, and at engineering organizations that need agents with real codebase and org context. Droids run in the terminal through the **Droid CLI**, inside IDEs such as VS Code and JetBrains, and on the web, so the same agent meets you wherever you already work. In an AI-assisted workflow, that means delegating multi-step engineering tasks — refactors, fixes, coordinated changes across many files — to an agent that understands your repository instead of starting from a blank context each time.

## Highlights

- **Autonomous Droids** — agents that plan, write, test, and open pull requests from a single instruction, with adjustable autonomy from fully supervised to fire-and-forget.
- **Runs across terminal, IDE, and web** — the Droid CLI, IDE integrations, and a browser interface share the same agent, so you can switch surfaces without losing context.
- **Org and codebase context** — native integrations with GitHub/GitLab, Jira, Slack, and PagerDuty, plus codebase indexing, so a Droid sees the tickets, architecture, and code you do.
- **Model-flexible execution** — Droids work with multiple models (Claude, GPT, Gemini, and others) and can run locally or in the cloud for long-running, delegated tasks.

## In an AI-assisted workflow

Factory fits into a terminal tab or your editor. A typical loop is to install the Droid CLI, start a session in your project, and describe the change; the Droid plans, edits across files, and prepares a PR while you review. See [AI Coding Agents & CLIs in 2026](/guides/prompting/ai-coding-agents-cli-2026) for how this pattern compares across tools.

```bash
curl -fsSL https://app.factory.ai/cli | sh
cd your-project
droid
# then: "Add input validation to the signup endpoint and write tests for it."
```

> [!TIP]
> Start a Droid with a tightly scoped task and review the diff before merging. Tighten or loosen its autonomy per task — supervised for risky changes, fire-and-forget for well-defined ones.

## Good to know

Factory is a proprietary SaaS product, not open source. Individual plans run from Pro at $20/month up through Plus and Max, with custom-priced Teams and Enterprise tiers and deployment options spanning SaaS, hybrid, on-premise, and air-gapped. There is no standing free tier, though Droid Core keeps you working on open-weight models with separate rate limits. Plans and limits change, so confirm current details on the official pricing page. For broader context on how agentic coding tools are being adopted, see [AI Coding Statistics 2026](/guides/concepts/ai-coding-statistics-2026).
