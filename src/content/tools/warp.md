---
name: "Warp"
description: "A modern, AI-powered terminal with an agent mode that can run and chain commands across your codebase."
url: "https://www.warp.dev"
repo: "https://github.com/warpdotdev/warp"
pricing: "open-source"
category: "terminal"
color: "blue"
topics: ["workflow-prompting"]
tags: ["terminal", "agent"]
featured: false
related: ["claude-code", "codex-cli"]
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
> Warp complements rather than replaces an agent like Claude Code — run a dedicated coding agent inside Warp's terminal and let Warp's own blocks, workflows, and shell context speed up everything around it.

## Good to know

Warp is available on macOS, Windows (x64 and ARM64), and Linux (`.deb`, `.rpm`, `.tar.zst`, AppImage); the client is open source (mostly AGPL-3.0, with the UI-framework crates under MIT) at [github.com/warpdotdev/warp](https://github.com/warpdotdev/warp). The **Free** tier includes the terminal plus 75 AI credits/month (150 for the first two months) and limited agent access. The **Build** plan ($20/mo) gives 1,500 monthly credits, full agent access across frontier Anthropic, OpenAI, and Google models, and rollover reload credits. **Business** ($50/user/mo, up to 25 seats) adds SAML SSO, Zero Data Retention controls, shared team reload credits, and admin usage metrics. **Enterprise** offers unlimited seats, custom credit pools, bring-your-own-LLM, and self-hosted cloud agents. AI features run on a credit budget — BYOK is available on every tier if you prefer to pay your model provider directly.
