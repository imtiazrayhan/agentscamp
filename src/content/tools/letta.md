---
name: "Letta"
description: "Stateful agents from the MemGPT team: Letta Code, an open-source harness whose agents keep git-versioned memory across sessions, models and machines."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.letta.com"
pricing: "freemium"
category: "platform"
repo: "https://github.com/letta-ai/letta-code"
license: "Apache-2.0"
os: ["Web", "macOS", "Windows", "Linux"]
color: "pink"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["memory", "agents", "memgpt", "stateful", "coding-agents"]
featured: false
alternativeTo: ["mem0", "zep"]
sameAs:
  - "https://github.com/letta-ai"
  - "https://x.com/letta_ai"
related: ["guide:mem0-vs-zep-vs-letta", "glossary:agent-memory", "tool:mem0", "tool:zep", "guide:claude-code-vs-opencode", "guide:agent-memory-architecture"]
summary: "Letta, formerly MemGPT, builds agents that keep their own memory. Its product is now Letta Code, an Apache-2.0 agent harness with a CLI, web app and TypeScript Agent SDK. Each agent keeps its memory in MemFS, a git-versioned filesystem it edits itself, across conversations, models and computers. It runs locally with no account or on Letta Cloud."
faq:
  - q: "How does Letta's memory differ from Mem0 or Zep?"
    a: "Locus of control. Mem0 and Zep are memory layers that a separate agent calls. In Letta the memory belongs to the agent runtime: the agent reads, writes and reorganises its own memory files in MemFS, a git-backed filesystem, and background dreaming subagents consolidate lessons from recent conversations. You adopt Letta as the agent harness, not as a memory API attached to another one."
  - q: "What happened to the Letta server and the MemGPT repo?"
    a: "The letta-ai/letta repository now says the current source code lives in letta-ai/letta-code, which contains the harness, terminal UI, App Server, channels and the runtime behind the desktop and web apps. The retired Letta V1 API server sits on that repository's archive branch, with old tags and releases kept for reproducibility. Tutorials written against the V1 server and its Python client describe a product that is no longer developed."
  - q: "Can I run Letta without a Letta account?"
    a: "Yes. With the local backend the CLI runs agents in-process and keeps messages, memory and provider connections on your machine. Connect a provider with a command such as letta --backend local connect ollama, and run letta server --backend local to host agents on an always-on machine for use through the Agent SDK. Remote computers and shared secrets require signing in with Letta."
  - q: "Which models does Letta Code work with?"
    a: "It is model-agnostic. Letta's docs list API providers including Anthropic, OpenAI, Google Gemini, Amazon Bedrock, Azure OpenAI, xAI, Mistral, DeepSeek, Groq and Fireworks; coding plans such as ChatGPT Plus/Pro and GitHub Copilot; local inference through Ollama, LM Studio and llama.cpp; and gateways such as OpenRouter. /connect adds a provider and /model switches model mid-conversation."
---

[Letta](https://www.letta.com) is the company that grew out of MemGPT, the research project that treated an agent's context as something the agent should manage for itself. Its product today is **Letta Code**: an open-source harness for stateful agents that keep an identity and a long-term memory across conversations, across models, and across the computers they run on. You can use it as a coding agent in the terminal, as a personal agent in the browser, or as the runtime behind agents in your own application.

The project's centre of gravity has moved. The [letta-ai/letta](https://github.com/letta-ai/letta) repository, which has about 25,600 GitHub stars as of November 2026, now points to [letta-ai/letta-code](https://github.com/letta-ai/letta-code) as the current source and keeps the retired V1 API server on an archive branch.

## Highlights

- **MemFS.** Agent memory lives in a git-backed filesystem that the agent can inspect and edit. Memory is shared across all of an agent's conversations, and you can sync it to your own GitHub repository.
- **Teaching and dreaming.** `/init` bootstraps memory for a project by inspecting the repository, `/remember` saves a specific lesson, and dreaming runs background subagents that review recent conversations and update memory. `/sleeptime` sets when dreaming runs.
- **Skills, subagents and schedules.** Agents load global, project and agent-scoped skills, call built-in or other agents as subagents, and run one-time or recurring prompts on a schedule.
- **Many surfaces, one agent.** The CLI, [chat.letta.com](https://chat.letta.com) in the browser and on mobile, a desktop app, and messaging channels including Slack, Telegram, Discord, WhatsApp and Signal.
- **Model-agnostic.** API providers, coding-plan subscriptions, local endpoints and gateways, switched with `/connect` and `/model`.
- **Agent SDK.** A TypeScript SDK that wraps the harness so your application can create an agent once and resume it from anywhere.
- **Local or cloud.** Letta Cloud stores agent state while the harness runs on a laptop, a cloud sandbox or a remote computer. The local backend keeps everything on-device with no account.

## In an AI-assisted workflow

```bash
npm install -g @letta-ai/letta-code    # needs Node.js 22.19+
cd your-project
letta                                  # first launch: sign in, or proceed locally
# inside the session:
# > /connect                           # add your own model API keys or a coding plan
# > /init                              # build memory for this repository
# > /remember always use pnpm in this repo
```

`uv tool install letta` and `pipx install letta` are alternatives that bundle Node.js. To embed an agent in an application, the Agent SDK looks like this:

```typescript
import { LettaAgentClient } from "@letta-ai/letta-agent-sdk";

const client = new LettaAgentClient({ backend: "cloud" });

// Create the agent once...
const agentId = await client.createAgent({
  persona: "You are Nora, a research analyst who tracks our competitors.",
});

// ...then resume it, from anywhere, for as long as it lives.
await using session = client.resumeSession(agentId);
await session.send("What changed since last week?");
for await (const message of session.stream()) {
  if (message.type === "assistant") process.stdout.write(message.content);
}
```

The distinctive loop is time. Run the agent on one repository for a few weeks and its memory of your conventions, gotchas and past decisions accumulates, where a [stateless harness](/guides/comparisons/claude-code-vs-opencode) starts each session from its instruction files.

## Pricing

As of November 2026, docs.letta.com/pricing lists a Free plan at $0 a month with up to 3 stateful agents and 5 MiB of storage per memory repository, on your own API keys or an external coding plan, and Pro at $20 a month, which includes $20 in monthly credits usable on any model and on remote sandboxes, up to 20 stateful agents and 50 MiB per memory repository. Adding members to an organization requires Teams Pro, whose price the docs page did not show when checked.

Metered extras, as of November 2026: cloud sandbox runtime costs $0.24, $0.47 or $0.70 per running hour by size, and server-side tools on the Letta API bill CPU time at $0.00015 per second. Bring-your-own-key usage goes through your provider account and consumes no Letta credits. Letta's own guidance is blunt about volume: as of November 2026 it estimates casual coding of a few hours a day at around $100 a month or more in usage, so the Pro allowance covers chat-level use, not daily coding.

## Good to know

Letta Code is Apache-2.0 and releases often; the latest as of November 2026 is v0.34.71, published November 26, 2026. Expect change, and expect older material to mislead: guides that describe the Letta server, the Agent Development Environment or a Python client target the retired V1 stack.

Practical limits: the npm install needs Node.js 22.19 or newer. Wheels for the uv and pipx route cover glibc Linux, macOS 14+ and Windows x64, but not Alpine, 32-bit systems or Windows on ARM. Automatic client-side dreaming is off by default on native Windows. Free accounts are capped at three agents. And when you self-host, built-in tools run on whichever machine runs the harness, so sandboxing is your job.

Against the alternatives: [Mem0](/tools/mem0) is a memory layer you add to an existing agent, and [Zep](/tools/zep) builds agent memory on temporal knowledge graphs. Both leave your agent framework in place, while Letta asks you to adopt its runtime. [Mem0 vs Zep vs Letta](/guides/comparisons/mem0-vs-zep-vs-letta) compares the three, and [agent memory architecture](/guides/concepts/agent-memory-architecture) covers the design space behind them.
