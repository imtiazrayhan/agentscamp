---
name: "AutoGen"
title: "AutoGen (AG2)"
description: "A multi-agent conversation framework where agents collaborate via message-passing, with group chat and code execution."
url: "https://microsoft.github.io/autogen/"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/microsoft/autogen"
license: "MIT"
sameAs: ["https://github.com/microsoft/autogen", "https://github.com/ag2ai/ag2"]
color: "cyan"
topics: ["ai-agents-systems"]
tags: ["agents", "framework", "multi-agent", "open-source", "microsoft"]
featured: false
alternativeTo: ["langgraph", "crewai", "openai-agents-sdk"]
summary: "AutoGen pioneered the conversational multi-agent pattern: agents (and humans) collaborate by passing messages, including group chats and a code-executing agent. It originated at Microsoft Research; AG2 is the community-driven fork that continues that lineage. Both are open source."
related: ["tool:langgraph", "tool:crewai", "tool:openai-agents-sdk", "guide:agent-frameworks-2026"]
faq:
  - q: "What is AutoGen?"
    a: "AutoGen is an open-source framework that models multi-agent systems as conversations: specialized agents — and optionally a human — exchange messages to solve a task together, including multi-agent group chats and a built-in code-executing agent that writes and runs code in a loop. It helped popularize the conversational multi-agent pattern many later frameworks built on."
  - q: "Is AutoGen free?"
    a: "Yes. AutoGen and the AG2 fork are open source under permissive licenses (the Microsoft repo is MIT) and free to use; you bring your own model provider."
  - q: "What is the difference between AutoGen and AG2?"
    a: "AutoGen originated at Microsoft Research; AG2 is the community-driven fork (formerly AutoGen) that carries the project forward, so you'll see both names in the ecosystem. Check which distribution you're adopting — Microsoft's autogen or the community ag2 — since APIs and momentum can differ."
  - q: "AutoGen vs LangGraph?"
    a: "AutoGen's conversational model is flexible and great for prototyping collaborative or self-correcting agent systems. For production you may want the explicit control of LangGraph or the structured roles of CrewAI."
---

AutoGen is an open-source framework that models multi-agent systems as **conversations**: specialized agents — and optionally a human — exchange messages to solve a task together, including multi-agent **group chats** and a built-in code-executing agent that can write and run code in a loop. It helped popularize the conversational multi-agent pattern that many later frameworks built on.

It is aimed at developers and researchers prototyping collaborative or self-correcting agent systems. A note on naming: AutoGen originated at Microsoft Research; **AG2** is the community-driven fork (formerly AutoGen) that carries the project forward, so you'll see both names in the ecosystem.

## Highlights

- **Conversable agents** — agents communicate by passing messages, composing into multi-agent solutions.
- **Group chat** — orchestrate several agents (and a human) in a shared conversation with a manager directing turns.
- **Code execution** — a built-in executor agent writes and runs code, enabling generate-run-debug loops.
- **Human-in-the-loop** — insert a human agent at any point in the conversation.
- **Model-flexible** — works across LLM providers.

## In an AI-assisted workflow

A common pattern is an assistant agent that proposes code and a user-proxy/executor agent that runs it and feeds back results, iterating until tests pass — collaboration as a conversation rather than a hardcoded pipeline.

> [!NOTE]
> Check which distribution you're adopting — Microsoft's `autogen` or the community `ag2` fork — since APIs and momentum can differ. Both are open source under permissive licenses.

## Good to know

AutoGen/AG2 is open source and free; you bring your own model provider. Its conversational model is flexible and great for prototyping, but for production you may want the explicit control of [LangGraph](/tools/langgraph) or the structured roles of [CrewAI](/tools/crewai) — see [the framework comparison](/guides/concepts/agent-frameworks-2026).
