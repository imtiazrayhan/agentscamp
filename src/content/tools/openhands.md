---
name: "OpenHands"
title: "OpenHands"
description: "Open-source platform for AI coding agents (formerly OpenDevin): Agent Canvas runs OpenHands, Claude Code or Codex on your machine, in Docker or in the cloud."
url: "https://www.openhands.dev"
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "agent"
repo: "https://github.com/OpenHands/OpenHands"
related: ["tool:swe-agent", "tool:devin", "tool:goose"]
license: "MIT"
os: ["Web", "macOS", "Linux", "Windows"]
sameAs: ["https://github.com/OpenHands/OpenHands", "https://www.openhands.dev"]
color: "green"
topics: ["ai-agents-systems"]
audience: ["developers", "ai-engineers"]
tags: ["ai-agent", "coding-agent", "autonomous", "open-source", "sandbox"]
featured: false
alternativeTo: ["devin", "swe-agent"]
summary: "OpenHands (formerly OpenDevin) is an MIT-licensed platform for running AI coding agents. Its main app, Agent Canvas, installs with one npm command and runs the OpenHands agent, Claude Code, Codex or Gemini CLI on your laptop, in Docker or on a server, with your own LLM key. A free hosted cloud and paid self-hosted Teams and Enterprise plans sit on top."
faq:
  - q: "Is OpenHands free and open source?"
    a: "Yes. Agent Canvas, the Software Agent SDK and the Agent Server are MIT-licensed and free to self-host; you pay your model provider for tokens. OpenHands Cloud is a free hosted version for a single user with a limit on how many conversations you can run. As of November 2026, the paid plans are Teams at $500 a month with 10 users included and a custom-priced Enterprise plan, both self-hosted."
  - q: "What happened to the openhands serve command?"
    a: "It is deprecated. OpenHands's docs call the old Docker-based web GUI the legacy local GUI, say its launcher, openhands serve, is no longer actively maintained, and say the setup page will be removed. Local installs now go through Agent Canvas: npm install -g @openhands/agent-canvas, then agent-canvas."
  - q: "Can OpenHands run Claude Code or Codex?"
    a: "Yes. Agent Canvas talks to agents over the Agent Client Protocol (ACP), so besides the built-in OpenHands agent it can drive Claude Code, Codex, Gemini CLI, Pi and OpenCode. The backend launches the provider's own CLI, so it needs that provider's subscription login or API key. Pi and OpenCode run on local or self-hosted backends only, not on OpenHands Cloud."
  - q: "How does OpenHands compare to Devin?"
    a: "Devin, from Cognition, is a closed commercial agent that runs in the vendor's cloud. OpenHands began in 2024 as OpenDevin, an open-source answer to it, and is still MIT-licensed, model-agnostic and self-hostable. Pick OpenHands when you want to choose the model and keep the agent on your own infrastructure; pick Devin when you want a managed product and accept the lock-in."
---

**OpenHands is an open-source, MIT-licensed platform for running AI coding agents, formerly called OpenDevin.** An agent gets a task, then edits files, runs shell commands and tests, reads the output and repeats until the work is done. You bring the model: any LLM provider key, or an existing agent subscription such as Claude Code or Codex.

The product changed shape in 2026. The main repository now ships **Agent Canvas**, which its README describes as a "self-hosted developer control center for coding agents and automations". The older Docker-based web GUI and its `openhands serve` launcher are deprecated. The project has about 94,000 GitHub stars as of November 2026.

## Highlights

- **Agent Canvas.** One web UI for running several agent conversations in parallel. It starts a backend on your machine by default and can also connect to an Agent Server in Docker, on a VM, or in OpenHands Cloud, and you switch between those backends from the same screen.
- **More than one agent.** The built-in OpenHands agent is the default. Through the Agent Client Protocol (ACP), Canvas also drives Claude Code, Codex, Gemini CLI, Pi and OpenCode by launching each provider's own CLI as a subprocess.
- **Bring your own model.** OpenHands calls models through LiteLLM, so you paste a key from Anthropic, OpenAI, Google or another supported provider, or use an OpenHands Cloud API key instead of managing provider accounts.
- **Automations.** An automation has a trigger (a schedule, or a webhook event such as a pull request opening on GitHub or a new issue in Linear) and an action (a prompt that runs one agent conversation, or a script). The docs' examples are pull request review, issue triage and weekly reports.
- **Skills, plugins and MCP.** Skills add reusable instructions triggered by keyword or file path; plugins bundle skills, hooks, MCP servers, agents and commands.
- **Software Agent SDK.** A Python SDK and a REST Agent Server sit under every product, so you can build your own agent or embed one in internal tools.

## In an AI-assisted workflow

The quickest local install needs Node.js 24 or later and `uv`:

```bash
npm install -g @openhands/agent-canvas
agent-canvas
# opens http://localhost:8000 - pick an agent, check the backend, paste an LLM key
```

That runs the Agent Server directly on your machine, with your user account's file access. For a boundary, use the Docker image, which only sees the project directory you mount:

```bash
export PROJECTS_PATH="$HOME/projects"
docker run -it --rm \
  -p 127.0.0.1:8000:8000 \
  -e AGENT_CANVAS_ALLOW_LAN_SESSION_KEY=true \
  -v openhands-state:/home/openhands/.openhands \
  -v "${PROJECTS_PATH}:/projects" \
  ghcr.io/openhands/agent-canvas:1.46.0
# then open http://localhost:8000/canvas
```

Setting `OH_CONVERSATION_RUNTIME=docker` before `agent-canvas` goes one step further and gives each new conversation its own container. A desktop app with Node.js and `uv` bundled is in preview as of November 2026; the docs note the macOS build is not yet signed or notarized.

> [!WARNING]
> The npm install is not a sandbox. OpenHands's own docs say to treat agents and ACP processes as untrusted, because they run shell commands and read or write files with your permissions. Use the Docker image or a VM for anything you would not hand to a stranger, and keep each concurrent conversation in its own directory or worktree so agents do not overwrite each other.

## Pricing

As of November 2026, the [OpenHands pricing page](https://www.openhands.dev/pricing) lists three plans:

- **Open Source: free.** MIT-licensed, runs on your laptop or a shared VM, single user or shared identity, your own LLM key, automations included.
- **Teams: $500 a month** with 10 users included and $50 a month for each extra seat, after a 30-day trial. Self-hosted, with multi-user identity and role-based access, SSO/SAML, budgeting controls and built-in integrations. It is capped at 5,000 sessions a month.
- **Enterprise: custom pricing.** Unlimited seats, an enterprise agreement, SLA-based support and a customer success manager.

Separately, the docs describe **OpenHands Cloud** at app.all-hands.dev as the free hosted version for a single user, with hosted sandboxes, Git and Slack integrations and a limit on how many conversations you can run. In every plan the model bill is yours.

## Good to know

OpenHands is a toolkit you operate, so expect setup work a hosted agent hides: a current Node.js, a model key, backend choices and, for teams, a server to keep patched. Results depend heavily on the model you connect. Docs and tutorials written before the Agent Canvas change still describe the old GUI and `openhands serve`, so check dates before following one. The latest release is v1.46.0 as of November 2026, and releases are frequent.

The project was renamed from OpenDevin in 2024. The company, formerly All Hands AI (the cloud app still lives at app.all-hands.dev), lists Robert Brennan as CEO, Graham Neubig as Chief Scientist and Xingyao Wang as Chief AI Officer.

Against the alternatives: [Devin](/tools/devin) is the closed, vendor-hosted agent OpenHands was created to answer. [SWE-agent](/tools/swe-agent) and its successor mini-swe-agent are research-oriented command-line agents with no UI or automations, a better fit for benchmarks and experiments. [Goose](/tools/goose) is another open-source, model-agnostic agent that runs locally as a desktop app and CLI. For the wider field, read [Best Claude Code Alternatives](/guides/comparisons/best-claude-code-alternatives-2026) or browse [OpenHands alternatives](/tools/openhands/alternatives).
