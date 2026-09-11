---
name: "Warp"
description: "A modern, AI-powered terminal with an agent mode that can run and chain commands across your codebase."
date: 2026-06-03
updated: "2026-09-11"
reviewed: "2026-09-11"
url: "https://www.warp.dev"
repo: "https://github.com/warpdotdev/warp"
pricing: "freemium"
category: "terminal"
color: "blue"
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["terminal", "agent"]
featured: false
related: ["tool:claude-code", "tool:codex-cli", "tool:wave-terminal", "guide:ai-coding-agents-cli-2026"]
alternativeTo: ["claude-code", "codex-cli", "gemini-cli", "opencode"]
summary: "Warp is an AI-powered terminal whose agent can plan, run, and chain commands while you approve what executes. Output is grouped into navigable blocks, workflows share vetted commands, and the agent grounds itself in your indexed codebase. A standalone Warp Agent CLI followed in August 2026. The client is open source (mostly AGPL-3.0), with a free tier."
faq:
  - q: "What is Warp?"
    a: "Warp is a rebuilt, AI-powered terminal that pairs a fast, modern CLI experience with a built-in coding agent. Output is grouped into navigable blocks instead of endless scrollback, the input editor behaves like a real text editor, and Warp Agent can read your repo, propose and run commands, and chain multi-step tasks with permission controls over what executes."
  - q: "Is Warp free?"
    a: "The client is open source (mostly AGPL-3.0, UI-framework crates under MIT). As of September 2026 the Free tier includes the terminal, limited agent and cloud-agent access, and reload credits at pay-as-you-go rates rather than a bundled monthly allowance. Build is $20/month ($18 annually) for 1,500 credits and full agent access; Max is $200/month for 18,000 credits; Business ($50/user/month, up to 25 seats) adds 1,500 credits per seat, SAML SSO, and admin-configurable data controls with Zero Data Retention; Enterprise adds unlimited seats, custom shared credit pools, and self-hosted cloud agents. Bring-your-own inference starts on the Free tier and carries up through the paid plans."
  - q: "Does Warp replace Claude Code?"
    a: "Partly. Since August 2026 Warp also ships the standalone Warp Agent CLI (the warp command), a multi-model coding agent that runs in any terminal and competes directly with Claude Code. The Warp terminal app still complements other agents too: you can run Claude Code, Codex, or OpenCode inside it and let Warp's blocks, workflows, and shell context speed up everything around it."
---

Warp is a rebuilt terminal that pairs a fast, modern command-line interface with a built-in coding agent. Output is grouped into navigable **blocks** instead of an endless scrollback, and the input editor behaves like a real text editor with selections, cursor positioning, and autocomplete. On top of that, Warp Agent can read your repo, propose and run commands, and chain multi-step tasks while you stay in control of what executes.

It is aimed at developers who live in the terminal and want AI help that understands shell context — failing builds, stack traces, unfamiliar CLI flags — without copy-pasting into a browser. Warp has grown from a terminal into what the team calls an "agentic development environment," and the client is open source on GitHub (mostly AGPL-3.0, with the UI-framework crates under MIT), with OpenAI as the founding sponsor of the repo.

## Highlights

- **Warp Agent** — describe a task in natural language and the agent plans, runs, and chains commands, reading command output to decide its next step (with permission controls over what it can execute).
- **Blocks** — each command and its output are grouped into one atomic unit you can copy, share, bookmark, or re-run, replacing flat scrollback with structured history.
- **Workflows** — save and reuse parameterized commands from Warp Drive, so your team shares the same vetted CLI snippets instead of pasting them around.
- **Model choice** — route to frontier models from Anthropic, OpenAI, and Google, or bring your own API key (BYOK) on any plan, including Free.
- **Codebase indexing** — Warp indexes your project so the agent grounds its suggestions in your actual files rather than guessing.
- **Multi-agent orchestration** — run several agent sessions at once, locally or in the cloud, and join any session with a click.

## In an AI-assisted workflow

Warp shines on the loop terminal users already run: try a command, read the error, fix it, retry. Instead of pasting a stack trace into a chat window, you hand the failing block to the agent and let it diagnose and re-run in place:

```text
# A test run just failed — ask the agent to investigate the failing block
This command failed. Find the cause and fix it, then re-run the test.
```

The agent reads the command, its output, and relevant repo files, then proposes the next commands. You approve each one (or set broader permissions for trusted tasks) so nothing destructive runs silently.

> [!TIP]
> Warp's terminal also hosts other agents — run a dedicated coding agent like Claude Code inside it and let Warp's own blocks, workflows, and shell context speed up everything around it. If you would rather use Warp's own agent in a different terminal, that is what the standalone Warp Agent CLI is for.

## Good to know

Warp is available on macOS, Windows (x64 and ARM64), and Linux (`.deb`, `.rpm`, `.tar.zst`, AppImage); the client is open source (mostly AGPL-3.0, with the UI-framework crates under MIT) at [github.com/warpdotdev/warp](https://github.com/warpdotdev/warp). Plans, as of September 2026 from warp.dev/pricing: the **Free** tier includes the terminal, limited agent and cloud-agent access, and reload credits at pay-as-you-go rates rather than a bundled monthly allowance. **Build** ($20/month, or $18 billed annually) gives 1,500 credits — $20 of included agent usage at API rates — plus full agent access across frontier Anthropic, OpenAI, and Google models. **Max** ($200/month) raises that to 18,000 credits. **Business** ($50/user/month, up to 25 seats) adds 1,500 credits per seat, SAML SSO, admin-configurable data controls with Zero Data Retention, and team usage metrics. **Enterprise** offers unlimited seats, custom shared credit pools, bring-your-own-LLM, and self-hosted cloud agents. AI features run on a credit budget — bring-your-own inference starts on the Free tier if you prefer to pay your model provider directly.
