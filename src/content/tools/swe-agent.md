---
name: "SWE-agent"
description: "Open-source autonomous coding agent from Princeton/Stanford that turns an LLM into a software engineer to fix real GitHub issues."
url: "https://swe-agent.com"
pricing: open-source
category: agent
repo: "https://github.com/SWE-agent/SWE-agent"
license: "MIT"
os:
  - macOS
  - Linux
  - Windows
alternativeTo:
  - "openhands"
  - "devin"
  - "aider"
sameAs:
  - "https://github.com/SWE-agent/SWE-agent"
  - "https://github.com/SWE-agent"
topics:
  - ai-agents-systems
  - llm-evals
tags:
  - autonomous-agent
  - swe-bench
  - github-issues
  - open-source
  - research
color: blue
date: 2026-06-17
featured: false
summary: "SWE-agent is a free, MIT-licensed autonomous coding agent from the Princeton NLP group that lets a language model of your choice fix bugs in real GitHub repositories. It pioneered the agent-computer interface (ACI) and posts strong SWE-bench results; the simpler mini-swe-agent now supersedes it for most use."
faq:
  - q: "Is SWE-agent free?"
    a: "Yes. SWE-agent is fully open source under the MIT license and free to run; you supply your own LLM API key (e.g. an OpenAI or Anthropic key), so costs come from model usage rather than the tool itself."
  - q: "Who built SWE-agent?"
    a: "It is an academic project started at Princeton University by John Yang, Carlos E. Jimenez, Alexander Wettig, Kilian Lieret, Shunyu Yao, Karthik Narasimhan, and Ofir Press, with collaborators at Stanford. It was published at NeurIPS 2024."
  - q: "How does it relate to SWE-bench?"
    a: "SWE-bench is the benchmark of real GitHub issues used to evaluate coding agents; SWE-agent is one such agent, evaluated on SWE-bench, where it has posted state-of-the-art results among open systems."
---

**SWE-agent is an open-source, MIT-licensed autonomous coding agent from the Princeton NLP group that turns a language model of your choice into a software engineer capable of fixing real GitHub issues.**

Given a GitHub issue, SWE-agent drives an LLM (such as GPT-4o or Claude Sonnet) to read code, edit files, run commands, and iterate until it produces a candidate fix. Its key research contribution is the agent-computer interface (ACI): a purpose-built set of commands and feedback formats that make a repository easier for a model to navigate than a raw shell, which materially improves task-solving reliability. The project was published at NeurIPS 2024 and is evaluated on SWE-bench, the benchmark of real-world GitHub issues, where it has posted state-of-the-art results among open systems.

It is aimed at researchers and engineers who want a transparent, hackable agent rather than a closed product. You bring your own model API key, so the tool is free while costs accrue from LLM usage. Beyond issue fixing, it can be pointed at custom tasks, competitive coding, or offensive-security challenges.

Compared with alternatives: Devin is a closed, hosted commercial agent, whereas SWE-agent is fully open and self-hosted. OpenHands (formerly OpenDevin) is a broader open-source agent platform with a richer UI and ecosystem, while SWE-agent is more research-focused and minimal. Aider is an interactive pair-programming CLI rather than an autonomous issue-solver.

Notable recent status: the maintainers have released mini-swe-agent, a roughly 100-line agent that reaches comparable SWE-bench scores with far less configuration, and now recommend it for most users going forward. Per the official docs, SWE-agent itself is in maintenance mode while active development focuses on mini-swe-agent. The project is hosted under the dedicated `SWE-agent` GitHub organization, and the license remains MIT.