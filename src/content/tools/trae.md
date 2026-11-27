---
name: "Trae"
title: "Trae"
description: "Trae is an AI IDE from ByteDance with an autonomous SOLO mode, an Agent window for parallel tasks, CUE autocomplete, and dollar-denominated usage plans."
url: "https://www.trae.ai"
date: 2026-06-24
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "ide"
os: ["macOS", "Windows", "Linux"]
sameAs: ["https://www.trae.ai", "https://docs.trae.ai"]
color: "red"
topics: ["coding-languages", "ai-agents-systems"]
audience: ["developers"]
tags: ["ide", "bytedance", "coding", "agent", "editor"]
featured: false
alternativeTo: ["cursor", "windsurf", "zed", "void", "kilo-code"]
summary: "Trae is an AI IDE that originated at ByteDance. Its desktop app has an Agent window for running tasks in parallel and an IDE window with a hands-on IDE mode and an autonomous SOLO mode, plus CUE autocomplete. The Free plan is Auto mode only with a one-time usage allowance; paid plans include a monthly dollar balance of model usage."
related: ["guide:cursor-vs-windsurf", "guide:cursor-vs-claude-code-vs-copilot-vs-windsurf-2026", "guide:ai-coding-agents-cli-2026", "guide:ai-coding-statistics-2026"]
faq:
  - q: "How much does Trae cost?"
    a: "As of November 2026, trae.ai/pricing lists Free at $0, Pro at $20 a month, Pro+ at $60 and Ultra at $200. Each paid plan includes a usage balance equal to its price ($20, $60 or $200 a month), unlimited autocomplete and a fast queue, with 10, 15 or 20 concurrent cloud tasks. Enterprise sales go through BytePlus."
  - q: "What does Trae's free plan include?"
    a: "As of November 2026 the Free plan is Auto mode only, so you cannot pick a model, with limited usage and limited autocomplete. Trae's pricing FAQ says the free usage balance is a one-time allowance that does not reset monthly, unlike paid plans, which refresh at the start of each subscription period."
  - q: "Which models does Trae offer?"
    a: "It depends on your region. As of November 2026 the docs list, outside the U.S., Seed-2.1-Turbo alongside GPT-6 and GPT-5 series models, GLM-5.2, DeepSeek V4, Kimi K3 and Gemini 4 Neon; the U.S. list has GPT, Grok 4.7 and 4.6, Gemini and Kimi models. No Claude model is in either built-in list, though you can add one as a custom model with your own API key."
  - q: "Does Trae train on my code?"
    a: "Trae's docs describe a Privacy mode: when it is enabled, Trae does not use your chats, code snippets or AI-generated outputs for data analysis, product optimization or model training, and codebase files remain on your local device. The docs do not say whether it is on by default, so check the setting and read the privacy policy for your region before opening proprietary code."
---

Trae is an **AI IDE that originated at ByteDance**. It combines a VS Code-compatible editor with agents that plan work, edit across files and run commands, and it is best known for **SOLO mode**, where the AI takes a requirement in natural language or by voice and drives the task from planning through code generation and testing to a running result.

The product is mid-rename. As of November 2026 the download page still offers two apps, TraeCode (the coding IDE) and TraeWork (a general work assistant), while the docs announce that both have been merged into a single "all-new TRAE" available on desktop, web and mobile. Expect either name depending on where you land.

## Highlights

- **Two windows.** TRAE Desktop has an Agent window, a task workspace for running several agents across projects and handing long tasks to the cloud, and an IDE window centered on the code editor.
- **IDE mode and SOLO mode.** Inside the IDE window, IDE mode keeps the familiar editor, terminal, debugger and source control for fine-grained control. SOLO mode lets the AI lead: it plans, generates code, tests, previews and summarizes changes.
- **CUE.** Trae's autocomplete: code completion, multi-line edits, next-edit prediction, smart imports and smart renaming, with import and rename help for Python, TypeScript and Go.
- **Custom agents.** Define agents with their own prompts, MCP servers and toolsets. A marketplace offers plugins and skills.
- **Models.** Several built-in models plus custom models through an API key, using either the OpenAI Chat Completions or the Anthropic Messages format.
- **Developer basics.** VS Code extension support, built-in Git with AI commit messages, AI code review of uncommitted changes or branch diffs, and remote development over Remote SSH or WSL.
- **Safety controls.** Privacy mode, and sandboxed execution that runs agent-generated commands in a restricted environment with file access controls and high-risk command blocking.

## In an AI-assisted workflow

Trae has no install command: download the desktop app from trae.ai/download (macOS 12 or later, Windows 10 and 11, or a `.deb`/`.rpm` package for Linux), sign in, and open a folder.

For a change in an existing codebase, stay in IDE mode and give the agent a scoped task:

```text
Add rate limiting to the POST /login handler in src/routes/auth.ts
(5 attempts per minute per IP). Reuse the Redis client in src/lib/redis.ts
and add a test.
```

For greenfield work, switch to SOLO mode, and describe the app. If you need a model that is not built in, add it as a custom model: pick the API format, enter the request URL, the model ID and your key.

> [!TIP]
> Turn on Privacy mode and sandboxed execution before pointing SOLO at a real repository. SOLO runs commands on its own, and the sandbox is what stops a bad one.

## Pricing

As of November 2026, from trae.ai/pricing:

| Plan | Price | Included |
| --- | --- | --- |
| Free | $0 | Auto mode only, limited usage, limited autocomplete, standard queue |
| Pro | $20/month | Auto plus all models, $20 of usage a month, unlimited autocomplete, fast queue, up to 10 concurrent cloud tasks |
| Pro+ | $60/month | $60 of usage a month (3x Pro), up to 15 concurrent cloud tasks |
| Ultra | $200/month | $200 of usage a month (10x Pro), first access to new models, up to 20 concurrent cloud tasks |

"Usage" is a dollar balance consumed as you make AI requests, charged at the per-model token rates in Trae's docs. Paid balances refresh each subscription period. The free balance is a one-time allowance and does not reset. Enterprise customers are directed to BytePlus.

## Good to know

Model access is regional. The built-in lists differ between the U.S. and everywhere else, and neither includes Claude as of November 2026. If your workflow depends on a specific model, check the list for your region or plan to bring your own key.

Ownership and terms also vary by region. The terms of service served to U.S. visitors as of November 2026 say Trae is operated in the United States by TikTok USDS Joint Venture LLC, working with other service providers. Read the terms and privacy policy shown in your country before using it on proprietary code.

Trae is proprietary. The desktop app runs on macOS, Windows and Linux, with web and mobile clients for starting and monitoring tasks.

Alternatives: [Cursor](/tools/cursor) has a similar Agents Window and its own Grok and Composer models; [Google Antigravity](/tools/antigravity) has a generally available free plan built on Gemini; [Kilo Code](/tools/kilo-code) is open source and runs inside stock VS Code with your own keys. For how agentic editors compare, see [Cursor vs. Windsurf](/guides/comparisons/cursor-vs-windsurf), and for adoption data see [AI Coding Statistics 2026](/guides/concepts/ai-coding-statistics-2026).
