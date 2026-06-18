---
name: "OpenHands"
title: "OpenHands"
description: "Open-source autonomous AI software-development agent (formerly OpenDevin) — writes code, runs commands, and browses the web in a sandbox."
url: "https://www.openhands.dev"
date: 2026-06-17
pricing: "open-source"
category: "agent"
repo: "https://github.com/All-Hands-AI/OpenHands"
related: ["swe-agent", "devin", "goose"]
license: "MIT"
os: ["Web", "macOS", "Linux", "Windows"]
sameAs: ["https://github.com/All-Hands-AI/OpenHands", "https://www.openhands.dev"]
color: "green"
topics: ["ai-agents-systems"]
tags: ["ai-agent", "coding-agent", "autonomous", "open-source", "sandbox"]
featured: false
alternativeTo: ["devin", "swe-agent"]
summary: "OpenHands (formerly OpenDevin) is an open-source platform for autonomous AI software-development agents that write code, run shell commands, and browse the web inside a sandbox. The core is MIT-licensed and runs locally with your own LLM key; a hosted OpenHands Cloud adds a free individual tier and paid enterprise options."
faq:
  - q: "What is OpenHands?"
    a: "OpenHands is an open-source platform for AI software-development agents. The agents do what a human developer can: edit code, run shell commands, browse the web, and call APIs inside a sandbox to complete coding tasks. It was previously named OpenDevin and is maintained by All Hands AI."
  - q: "Is OpenHands free and open source?"
    a: "The core OpenHands project is MIT-licensed and free to self-host with your own LLM API key. A separate hosted product, OpenHands Cloud, offers a free individual tier plus paid enterprise plans; some Cloud/enterprise components use a separate license rather than MIT."
  - q: "How does OpenHands compare to Devin?"
    a: "Devin (by Cognition) is a closed, paid commercial agent. OpenHands started as OpenDevin, an open-source effort to replicate and extend that capability, and remains community-driven and MIT-licensed. SWE-agent is another open alternative focused on resolving GitHub issues."
---

**OpenHands is an open-source platform for autonomous AI software-development agents (formerly OpenDevin) that write code, run commands, and browse the web inside a sandbox.** It is built by All Hands AI and aims to let an LLM-driven agent do what a human developer can: modify a codebase, execute shell commands, call APIs, and use a browser to complete real engineering tasks.

It is aimed at developers who want a self-hostable, model-agnostic coding agent rather than a closed product. The core runs locally with your own LLM key and exposes a web GUI and a CLI; agents operate in a sandboxed runtime so generated commands and code execution stay isolated.

## How it works

An agent receives a task, then plans and executes a loop of actions — editing files, running tests, reading output, and browsing — observing the results and iterating until the task is done. Because it is model-agnostic, you supply the LLM (a frontier model or your own provider).

## How it compares

OpenHands began as **OpenDevin**, a community response to Cognition's proprietary **Devin**. Unlike Devin, OpenHands is open source under the MIT license and can be self-hosted. **SWE-agent** is a related open alternative more narrowly focused on resolving GitHub issues, whereas OpenHands targets a broader agent platform with a GUI, CLI, and integrations.

## Status and licensing

The project was renamed from OpenDevin to OpenHands in 2024 and is maintained by All Hands AI (founded by Graham Neubig, Robert Brennan, and Xingyao Wang). The core repository is MIT-licensed, while a separate `enterprise/` directory and the hosted OpenHands Cloud use different licensing. OpenHands Cloud is a managed SaaS with a free individual tier and paid enterprise/self-hosted plans.