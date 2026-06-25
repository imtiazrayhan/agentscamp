---
name: "Trae"
title: "Trae"
description: "Trae is an AI-native IDE from ByteDance — a VS Code-style editor with a built-in Builder agent and an autonomous SOLO mode that writes code across a project."
url: "https://www.trae.ai"
date: 2026-06-24
pricing: "freemium"
category: "ide"
os: ["macOS", "Windows", "Linux"]
sameAs: ["https://www.trae.ai", "https://docs.trae.ai"]
color: "red"
topics: ["coding-languages", "ai-agents-systems"]
tags: ["ide", "bytedance", "coding", "agent", "editor"]
featured: false
alternativeTo: ["cursor", "windsurf", "zed", "void", "kilo-code"]
summary: "Trae is an AI-native IDE from ByteDance, built on a fork of VS Code so existing settings and extensions carry over. Its built-in Builder agent plans and edits code across files, while SOLO mode runs as a more autonomous AI engineer that scaffolds whole projects from a prompt. It is freemium: a free tier plus paid plans."
related: ["cursor-vs-windsurf", "cursor-vs-claude-code-vs-copilot-vs-windsurf-2026", "ai-coding-agents-cli-2026", "ai-coding-statistics-2026"]
faq:
  - q: "What is Trae?"
    a: "Trae is an AI-native IDE from ByteDance, built on a fork of Visual Studio Code. It pairs a familiar VS Code-style editor with a built-in agent (Builder) and an autonomous SOLO mode that can plan a task, write code across multiple files, and run terminal commands. It bundles access to several frontier models and supports most VS Code extensions and imported settings."
  - q: "Is Trae free?"
    a: "Trae is freemium: it offers a free tier and paid plans. The free tier includes model access and agent usage at a capped level, and ByteDance has used a token-based pricing model for the paid tiers. Plans and limits have changed over time, so confirm the current tiers and quotas on the official site."
  - q: "How does Trae compare to Cursor?"
    a: "Both are AI-first editors forked from VS Code with an in-editor agent that edits across files. Trae is made by ByteDance and adds SOLO mode for more autonomous, project-scaffolding work, with a free tier that bundles model access; Cursor leans on its in-house Composer models and parallel agents. The right fit depends on pricing, model choice, and data-handling preferences — verify current details on each site."
---

Trae is an **AI-native IDE from ByteDance**, built on a fork of Visual Studio Code so existing extensions, themes, keybindings, and settings carry over. It pairs a familiar editor with AI at the center: a built-in **Builder** agent that reads, writes, and runs commands across your project, plus a more autonomous **SOLO mode** positioned as an "AI engineer" that takes a prompt, plans the work, and scaffolds code end to end.

It is aimed at developers who want an agent inside the editor rather than copying context between a browser and their codebase. Trae bundles access to several models and indexes your project so the agent can ground its edits in relevant files instead of just the buffer you have open.

## Highlights

- **VS Code-style editor** — forked from VS Code, so most extensions, themes, and settings import directly and the learning curve is mostly the AI layer on top.
- **Built-in Builder agent** — an in-editor agent that plans multi-step tasks, edits across files, and runs terminal commands, with diffs you review before accepting.
- **SOLO mode** — a more autonomous "AI engineer" mode that takes a natural-language description and scaffolds a project (frontend, backend, config, and commands) rather than completing one suggestion at a time.
- **Free tier with model access** — the free plan bundles autocomplete and agent requests against several frontier models, with paid plans raising the limits.

## In an AI-assisted workflow

A typical loop is to describe a change in Trae's chat panel, let Builder propose edits across the relevant files, then review and accept or reject each diff. For greenfield work, SOLO mode can take a single prompt and scaffold a runnable project that you then refine in the editor. Because Trae is VS Code-based, you can open an existing project, import your settings, and keep your usual extensions while adding the agent. For how this style of editor compares to other agentic IDEs, see [Cursor vs. Windsurf](/guides/comparisons/cursor-vs-windsurf).

```bash
# Trae is a GUI IDE — open a project from its launcher or "Open Folder",
# then drive Builder/SOLO from the chat panel. There is no CLI install.
```

> [!TIP]
> Builder and SOLO can run terminal commands and modify files. Review proposed diffs before accepting, especially in repositories with production or shared code.

## Good to know

Trae is proprietary, made by ByteDance, and runs on macOS, Windows, and Linux. It is freemium — a free tier plus paid plans, with a token-based pricing model that ByteDance has revised over time, so confirm the current tiers and quotas on the official site. Because the agent and editor send code and prompts to remote models, review the privacy and telemetry terms before using it on sensitive or proprietary repositories; data-handling considerations come with any cloud-backed AI editor. For broader context on how teams are adopting AI coding tools, see [AI Coding Statistics 2026](/guides/concepts/ai-coding-statistics-2026).
