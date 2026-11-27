---
name: "AutoGen"
title: "AutoGen (AG2)"
description: "Microsoft's multi-agent conversation framework, now archived in favour of Microsoft Agent Framework. AG2 is the community fork that is still developed."
url: "https://microsoft.github.io/autogen/"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/microsoft/autogen"
license: "MIT"
sameAs: ["https://github.com/microsoft/autogen", "https://github.com/ag2ai/ag2"]
color: "cyan"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "framework", "multi-agent", "open-source", "microsoft"]
featured: false
alternativeTo: ["langgraph", "crewai", "openai-agents-sdk"]
summary: "AutoGen popularized multi-agent systems as conversations between agents. Microsoft has archived the microsoft/autogen repository: it gets no bug or security fixes, and new users are sent to Microsoft Agent Framework. AG2, the community fork, is still released, but v1.0 changed its API and moved the classic autogen namespace to a separate package."
related: ["tool:langgraph", "tool:crewai", "tool:openai-agents-sdk", "guide:agent-frameworks-2026"]
faq:
  - q: "Is AutoGen still maintained?"
    a: "Not by Microsoft. As of November 2026 the microsoft/autogen repository is archived, and its README says Microsoft is not providing bug fixes, security fixes, new features or support. The last tagged Python release is v0.7.5 from September 30, 2025. Microsoft directs new users to Microsoft Agent Framework and publishes an AutoGen migration guide."
  - q: "What is the difference between AutoGen and AG2?"
    a: "AG2 is a community fork of AutoGen under the ag2ai organization, licensed Apache-2.0, and it is still actively released (v1.3.4 on November 22, 2026). Since AG2 v1.0, pip install ag2 gives you a new framework imported as ag2. The original ConversableAgent and GroupChat classes live in a separate package, ag2-classic, which keeps the import name autogen."
  - q: "Is AutoGen free?"
    a: "Yes. The code in microsoft/autogen is MIT-licensed (its documentation is CC-BY-4.0) and AG2 is Apache-2.0. Neither has a paid tier; you pay your model provider for tokens."
  - q: "Should I start a new project on AutoGen?"
    a: "No. The archived Microsoft packages still install from PyPI, but they will not receive security fixes. For new work in the Microsoft ecosystem use Microsoft Agent Framework; if you want the AutoGen programming model with a maintained codebase, use AG2 or AG2 Classic; otherwise compare LangGraph, CrewAI and the OpenAI Agents SDK."
---

AutoGen is an open-source framework from Microsoft Research that models multi-agent systems as **conversations**: specialized agents, and optionally a human, exchange messages to solve a task. It popularized group chats between agents and the assistant-plus-executor loop in which one agent writes code and another runs it.

The important fact in November 2026 is its status. **Microsoft has archived the `microsoft/autogen` repository.** The README says the project is no longer maintained, receives no bug fixes or security fixes, and stays up for reference. New users are sent to **Microsoft Agent Framework**, which Microsoft describes as AutoGen's enterprise-ready successor, built by the AutoGen and Semantic Kernel teams. The community fork, **AG2**, continues separately.

## Highlights

- **Conversable agents.** Agents communicate by passing messages, and a multi-agent solution is a conversation among them.
- **Group chat.** Several agents, and a human if you want one, share a conversation while a manager decides who speaks next. The current packages ship this as team classes such as `RoundRobinGroupChat` and `MagenticOneGroupChat`.
- **Code execution.** An executor runs code another agent wrote and feeds the result back, giving a generate, run, debug loop.
- **Two API generations.** AutoGen v0.2 used `ConversableAgent` and `import autogen`. Later releases split into `autogen-core` (message passing and an event-driven runtime), `autogen-agentchat` (the simpler API on top) and `autogen-ext`, and moving between the two needs the project's migration guide.
- **AutoGen Studio.** A no-code GUI installed with `pip install -U "autogenstudio"`.
- **Adoption.** About 62,000 GitHub stars as of November 2026, which is why so many tutorials still point at it.

## In an AI-assisted workflow

To read or run code written for the current AutoGen packages (Python 3.10 or later), this is the hello-world from the archived README:

```bash
pip install -U "autogen-agentchat" "autogen-ext[openai]"
export OPENAI_API_KEY="sk-..."
```

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main() -> None:
    model_client = OpenAIChatCompletionClient(model="gpt-4.1")
    agent = AssistantAgent("assistant", model_client=model_client)
    print(await agent.run(task="Say 'Hello World!'"))
    await model_client.close()

asyncio.run(main())
```

AG2 v1 looks different. It is async throughout, and `Agent.ask()` returns a reply whose text is in `reply.body`:

```bash
pip install 'ag2[openai]'
```

```python
import asyncio

from ag2 import Agent
from ag2.config import OpenAICompletionsConfig

agent = Agent(
    "assistant",
    prompt="You are a helpful assistant.",
    config=OpenAICompletionsConfig(model="gpt-4o-mini"),
)

async def main() -> None:
    reply = await agent.ask("Summarize the main differences between Python lists and tuples.")
    print(reply.body)

asyncio.run(main())
```

> [!WARNING]
> Three incompatible things answer to the name "AutoGen": Microsoft's archived packages (`autogen_agentchat`), AG2 Classic (`pip install ag2-classic`, `import autogen`), and AG2 v1 (`pip install ag2`, `import ag2`). Check the import lines in any tutorial before you install, and tell your coding assistant which one you are on.

## Good to know

**If you run AutoGen today**, plan a migration. Microsoft's [AutoGen to Microsoft Agent Framework migration guide](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/) maps model clients, single-agent features, tools and MCP support, and the group-chat patterns onto Agent Framework's workflows, which add checkpointing and middleware. The archived README is blunt about the alternative: without maintenance, vulnerabilities in AutoGen and its dependencies may stay unpatched, and it says AutoGen was developed for research and experimentation.

**If you are on the old 0.2 API**, AG2 Classic is the closest maintained home for `ConversableAgent`, `UserProxyAgent` and `GroupChat`. AG2's README says to stay on Classic if those names appear in your code, because AG2 v1.0 is not a drop-in upgrade: the agent model, orchestration and imports all changed, and multi-agent work moved to a hub-and-channels model it calls Network. AG2 has about 5,100 GitHub stars as of November 2026, a much smaller community than the original.

**If you are choosing a framework now**, the conversational pattern is no longer unique to AutoGen. [LangGraph](/tools/langgraph) gives you an explicit state graph with checkpoints, [CrewAI](/tools/crewai) organizes agents by role and task, and the [OpenAI Agents SDK](/tools/openai-agents-sdk) covers handoffs between agents with less machinery. [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026) compares them.

AutoGen's code is MIT-licensed and AG2 is Apache-2.0. Both are free; you bring your own model provider.
