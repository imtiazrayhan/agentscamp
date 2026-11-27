---
name: "Zed"
description: "A high-performance, multiplayer code editor with built-in AI assistance."
seoDescription: "Zed is a high-performance, multiplayer code editor with built-in AI assistance — agentic editing, collaboration, and speed. Pricing and alternatives."
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://zed.dev"
pricing: "open-source"
category: "ide"
repo: "https://github.com/zed-industries/zed"
related: ["tool:cursor", "tool:void", "tool:windsurf"]
alternativeTo: ["cursor", "void", "windsurf", "antigravity"]
color: "pink"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["ide", "editor", "rust"]
summary: "Zed is a code editor written in Rust with GPU-accelerated rendering, real-time multiplayer collaboration, and built-in AI: edit predictions, an agent panel that runs hosted models, your own API keys or local models through Ollama, and external agents such as Claude Agent and Codex. The editor is open source and free on macOS, Linux, and Windows."
faq:
  - q: "What is Zed?"
    a: "Zed is a code editor written in Rust and built for speed, using GPU-accelerated rendering (via its own GPUI framework) to keep typing, scrolling, and search responsive even on large files. It targets developers who want a lightweight native editor without Electron overhead, while still getting real-time collaboration and integrated AI."
  - q: "Is Zed free?"
    a: "Yes for the editor: Zed is open source (GPL-3.0 and Apache-2.0, depending on component) and free to download, running natively on macOS, Linux, and Windows. Hosted AI is paid: as of November 2026 the Personal plan is $0 and covers unlimited use with your own API keys or external agents, Pro is $10 per month with unlimited edit predictions and $5 of tokens included, and Business is $30 per seat per month. Pro has a 14-day free trial with no credit card."
  - q: "How does AI work in Zed?"
    a: "Zed offers inline completions and an agent panel that can read your codebase, propose multi-file edits you review before applying, and run shell commands as tools. It runs on Zed-hosted models (Pro and Business), on your own keys for providers such as Anthropic, OpenAI, Google AI, and OpenRouter, or on local models through Ollama and LM Studio, with the default model set in a JSON settings file. External agents such as Claude Agent and Codex plug in through the Agent Client Protocol."
  - q: "Which model id goes in Zed's settings?"
    a: "The agent.default_model setting takes a provider and a model id, for example provider anthropic and model claude-opus-4-6, which is the example Zed's own agent-settings docs still use as of November 2026. Any model your provider exposes works; picking a model in the Agent Panel's model selector writes the setting for you, so you do not have to type an id by hand."
---

Zed is a code editor written in Rust and built for speed. It uses GPU-accelerated rendering (via its own GPUI framework) to keep typing, scrolling, and search responsive even on large files. Zed is aimed at developers who want a lightweight native editor without the overhead of an Electron-based IDE, while still getting modern features like real-time collaboration and integrated AI.

## Highlights

- **Native performance**: Rust core with GPU rendering for low-latency editing.
- **Multiplayer editing**: Share a project and pair-program with shared cursors, voice channels, and screen sharing.
- **AI assistant**: Edit predictions and an agent panel that can read your codebase, run edits, use tools, and compact long threads with `/compact`.
- **External agents**: Claude Agent, Codex, and other agents install from the ACP Registry (`zed: acp registry`) and run inside the Agent Panel through the Agent Client Protocol. Claude Agent handles its own authentication and billing.
- **Language support**: Tree-sitter syntax parsing and built-in Language Server Protocol (LSP) integration.
- **Vim mode** and an extensible, themeable configuration via JSON.

## AI-assisted workflow

Zed's agent panel runs on Zed-hosted models, on your own API keys (Anthropic, OpenAI, Google AI, OpenRouter, Amazon Bedrock, and others), or on local models through Ollama and LM Studio. The default model is a `provider` plus a `model` id in `settings.json`. This is the example from Zed's agent-settings docs, verbatim as of November 2026:

```json
{
  "agent": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-opus-4-6"
    }
  }
}
```

The id in that example is an older Claude model that Anthropic still serves; Zed's docs have not moved the sample forward. Swap in the id of whichever model you use, or choose one in the Agent Panel's model selector and let Zed write the setting. As of November 2026 Zed's hosted list includes Claude Fable 5.2, Claude Opus 5.5, Claude Sonnet 5.5, GPT-6.2 Astra, and the Gemini 4 models. A separate `agent.compaction_model` and `agent.subagent_model` take the same shape if you want a cheaper model for compaction or subagents.

The assistant can reference open buffers and project files, propose multi-file edits you review before applying, and run shell commands as tools, fitting alongside terminal-driven agents rather than replacing them.

## Good to know

Zed is open source (GPL-3.0 and Apache-2.0, depending on component) and free to download. It runs natively on macOS, Linux, and Windows; the latest stable release is v1.30.2, published November 25, 2026. Collaboration and hosted AI rely on Zed's cloud services, and bring-your-own API keys are supported for AI providers.

## Pricing

As of November 2026, Zed's pricing page lists three plans: Personal at $0 (the editor plus unlimited use with your own API keys or external agents), Pro at $10 per month (unlimited edit predictions, $5 of tokens included, usage-based billing beyond that), and Business at $30 per seat per month (org-wide AI model policies, data governance controls, unified spend visibility, and role-based access controls, with no seat minimum). Hosted usage on Pro is billed at API list price plus 10%, and you can set a spending cap. Pro has a 14-day trial with $5 of usage, as of November 2026 limited to one hosted model. SSO, SAML, and SCIM are listed as planned, not available.

The trade-off on Business: seats do not bundle model credits, so a team pays for seats and then for hosted usage or its own provider keys.

Compare Zed against [Cursor](/tools/cursor) and [Devin Desktop (formerly Windsurf)](/tools/windsurf) in [Best GitHub Copilot Alternatives](/guides/comparisons/best-github-copilot-alternatives-2026), or browse [Zed alternatives](/tools/zed/alternatives).
