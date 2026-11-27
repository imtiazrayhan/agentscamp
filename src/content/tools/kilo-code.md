---
name: "Kilo Code"
description: "Open-source (MIT) AI coding agent for VS Code, JetBrains and the CLI, begun as a Roo Code fork and rebuilt on OpenCode, with 500+ models at provider rates."
url: "https://kilo.ai/"
pricing: "freemium"
category: "extension"
repo: "https://github.com/Kilo-Org/kilocode"
related: ["tool:roo-code", "tool:cline", "tool:continue", "guide:ai-coding-agents-cli-2026"]
license: "MIT"
os:
  - macOS
  - Windows
  - Linux
alternativeTo:
  - "cline"
  - "roo-code"
  - "cursor"
sameAs:
  - "https://github.com/Kilo-Org/kilocode"
  - "https://marketplace.visualstudio.com/items?itemName=kilocode.Kilo-Code"
topics:
  - ai-agents-systems
audience: ["developers"]
tags:
  - ai-agent
  - vscode-extension
  - open-source
  - coding-assistant
  - mcp
color: blue
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
featured: false
summary: "Kilo Code is an MIT-licensed AI coding agent for VS Code, JetBrains and the terminal. It began as a Roo Code fork and its current v7 line is built on OpenCode. It ships Code, Plan, Ask and Debug agents and routes to 500+ models at provider rates. The agent is free; you pay for inference through your own keys, Kilo Gateway credits, or Kilo Pass."
faq:
  - q: "Is Kilo Code free?"
    a: "The agent is free and MIT-licensed. As of November 2026 the individual platform plan is $0 and Teams is $15 per user per month; inference is separate. You can use free models, local models or your own keys at no charge from Kilo, buy Kilo Gateway credits at provider rates with a 5% processing fee on credit purchases, or subscribe to Kilo Pass from $19 a month for bonus credits."
  - q: "How does Kilo Code relate to Roo Code, Cline and OpenCode?"
    a: "Kilo Code began in 2025 as a fork of Roo Code, which itself forked Cline. The current product is a different codebase: the README says Kilo CLI is a fork of OpenCode, and the v7 extension is built on it. The legacy Roo-derived VS Code extension and JetBrains plugin reached end of life on July 31, 2026, and that repository is archived."
  - q: "How do I install the Kilo CLI?"
    a: "Run npm install -g @kilocode/cli, or curl -fsSL https://kilo.ai/cli/install | bash, or brew install Kilo-Org/tap/kilo on macOS and Linux. Then run kilo in a project directory. For CI, kilo run --auto \"run tests and fix any failures\" runs with no prompts."
  - q: "What is Kilo Pass?"
    a: "Kilo Pass is a monthly credit subscription for Kilo Gateway. As of November 2026 the tiers are Starter at $19, Pro at $49 and Expert at $199 a month, and Kilo adds bonus credits on top of what you pay, up to 50%. It is prepaid inference credit, not a flat unlimited plan."
---

**Kilo Code is an open-source, MIT-licensed AI coding agent that runs in VS Code, JetBrains IDEs and the terminal.** It began in 2025 as a Roo Code fork; the current v7 line is a rebuild on [OpenCode](/tools/opencode), and the README states plainly that Kilo CLI is a fork of OpenCode. The repository had about 28,100 GitHub stars as of November 2026; the latest release that month was v7.8.40.

The company behind it, Kilo, sells the parts around the agent: a model gateway, cloud agents, automated code review and team administration. The agent itself costs nothing and works with your own keys.

## Highlights

- **Four built-in agents.** Code (the default) implements and edits; Plan designs architecture and writes an implementation plan before any code; Ask answers questions about the codebase without touching files; Debug traces issues. You can define custom agents as well.
- **500+ models, switchable mid-task.** Through Kilo Gateway you pay the model provider's rate with zero markup. Bring-your-own-key and local models through Ollama or LM Studio also work.
- **Auto Model.** Pick a tier (Frontier, Efficient or Free) and Kilo routes each request to a model for that budget.
- **Inline autocomplete.** Ghost-text suggestions with tab to accept, alongside the chat agent.
- **Terminal and browser control.** The agent runs commands and can automate a browser.
- **Kilo Marketplace.** Install agents, skills, [MCP](/glossary/model-context-protocol) servers and plugins.
- **Other surfaces.** A cloud agent at app.kilo.ai/cloud and automated pull-request reviews at app.kilo.ai/code-reviews.

## In an AI-assisted workflow

Install the extension from the VS Code Marketplace or the JetBrains Marketplace, or use the CLI:

```bash
npm install -g @kilocode/cli
# or: curl -fsSL https://kilo.ai/cli/install | bash
# or: brew install Kilo-Org/tap/kilo

kilo                 # interactive session in the current project

# CI: no prompts, auto-approves unless a rule denies the action
kilo run --auto "run tests and fix any failures"
```

Start a non-trivial change in Plan, read the plan, then hand it to Code. Use Ask when you only want an explanation, since it cannot edit files.

> [!WARNING]
> `--auto` approves every permission prompt that a rule does not explicitly deny. Kilo's README says to use it only in trusted environments.

## Pricing

As of November 2026, Kilo splits pricing into three parts.

| Part | What it costs |
| --- | --- |
| Platform plan | Individual $0; Teams $15 per user per month; Enterprise custom |
| Inference | Free models, local models or your own keys: $0 to Kilo. Kilo Gateway: exact provider rates, with a 5% processing fee on credit purchases. Kilo Pass: Starter $19, Pro $49 or Expert $199 a month, with up to 50% bonus credits |
| Cloud compute | Code Review $0.33 an hour; Cloud Agent $0.60 an hour (Small) or $1.20 an hour (Standard), billed per second |

Teams adds usage analytics, shared custom agents, centralized billing and shared BYOK. Enterprise adds SSO, OIDC and SCIM, audit logs, model and provider limits, and an SLA. Model inference is always charged separately from cloud compute.

## Good to know

"Zero markup" describes token rates. The 5% fee applies when you buy gateway credits, so compare the all-in cost against paying a provider directly with your own key.

If you used Kilo Code before v7, you are on a different product now. The legacy Roo-derived extension and JetBrains plugin reached end of life on July 31, 2026, and Kilo no longer ships updates, bug fixes or security patches for it. That repository is archived; check any custom modes and settings carried over before you rely on them.

Against its relatives: [Cline](/tools/cline) is Apache-2.0, keeps a stricter approve-each-step loop, and offers a flat ClinePass for open-weight models. [Roo Code](/tools/roo-code), Kilo's original upstream, was shut down in May 2026. [Cursor](/tools/cursor) is a closed-source editor with its own models and subscription tiers. Read [Cline vs Kilo Code vs Roo Code](/guides/comparisons/cline-vs-kilo-code-vs-roo-code), check [Best GitHub Copilot Alternatives](/guides/comparisons/best-github-copilot-alternatives-2026), or explore [Kilo Code alternatives](/tools/kilo-code/alternatives).
