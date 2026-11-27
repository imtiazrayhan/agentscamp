---
title: "LangGraph vs CrewAI: Agent Frameworks Compared (2026)"
description: "LangGraph vs CrewAI with the same task coded in both: explicit graph and checkpointers vs roles, tasks and Flows. Licences, versions, hosting."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems"]
audience: ["developers"]
tags: ["comparison", "langgraph", "crewai", "agent-frameworks", "versus"]
featured: false
summary: "Pick LangGraph when you need to own control flow: you write nodes and edges, a checkpointer saves state every step, and interrupt() pauses a run for approval. Pick CrewAI when the job is role-shaped: declare agents and tasks and a crew runs them, with Flows for explicit routing. Both are MIT-licensed; LangGraph adds a JS port, CrewAI is Python-only."
keyTakeaways:
  - "LangGraph models an agent system as a graph you author: typed state, nodes, edges, and a checkpointer that snapshots state at every super-step so runs can pause, resume, and replay."
  - "CrewAI has two layers: Crews (role-based agents running tasks sequentially or hierarchically) and Flows (event-driven methods wired with @start, @listen, and @router)."
  - "Both are MIT-licensed and free to self-host. LangGraph ships Python and JavaScript libraries; CrewAI is Python-only and has no LangChain dependency."
  - "Human approval differs in kind: LangGraph's interrupt() works anywhere in a node and resumes from the checkpoint; CrewAI offers human_input on a task or the @human_feedback decorator in a Flow."
  - "The paid layers are separate products: LangSmith (tracing plus Agent Server hosting) for LangGraph, CrewAI AMP (visual studio, managed deployment, governance) for CrewAI."
faq:
  - q: "Which is better for production: LangGraph or CrewAI?"
    a: "For runs that must survive a crash or wait hours for a person, LangGraph is the safer base: Postgres, SQLite, MongoDB, and Cosmos DB checkpointers exist as packages, and a paused thread resumes from its last checkpoint by thread_id. CrewAI runs in production too, but durable pause-and-resume lives in Flows (@persist, async @human_feedback providers) or in the paid AMP platform, not in a plain crew."
  - q: "Does CrewAI depend on LangChain?"
    a: "No. The crewai package on PyPI lists no LangChain packages among its required dependencies as of November 2026; it talks to model providers through its own LLM layer and uses the OpenAI API by default. LangGraph, by contrast, requires langchain-core, though you can use it without the higher-level langchain package."
  - q: "Can I use CrewAI and LangGraph together?"
    a: "Yes, in two ways. You can call crew.kickoff() from inside a LangGraph node, which gives a crew LangGraph's checkpointing around it. And LangSmith's Agent Server documents deploying CrewAI and other frameworks through its Functional API or the deployments-wrap-sdk package, so one hosting layer can run both."
  - q: "Can I start with CrewAI and move to LangGraph later?"
    a: "Yes. Prototype the multi-agent design as a crew to learn what the system should do, then rebuild the parts that need hard guarantees as a graph. Keep tools as plain Python functions and prompts in files, and the rewrite is mostly orchestration code."
related: ["tool:langgraph", "tool:crewai", "guide:agent-frameworks-2026", "guide:multi-agent-orchestration", "agent:agent-reliability-reviewer", "tool:openai-agents-sdk"]
sources:
  - title: "LangGraph repository and README"
    url: "https://github.com/langchain-ai/langgraph"
    publisher: "LangChain"
  - title: "LangGraph interrupts documentation"
    url: "https://docs.langchain.com/oss/python/langgraph/interrupts"
    publisher: "LangChain"
  - title: "LangGraph checkpointers documentation"
    url: "https://docs.langchain.com/oss/python/langgraph/checkpointers"
    publisher: "LangChain"
  - title: "LangSmith plans and pricing"
    url: "https://www.langchain.com/pricing"
    publisher: "LangChain"
  - title: "CrewAI repository and README"
    url: "https://github.com/crewAIInc/crewAI"
    publisher: "CrewAI"
  - title: "Human feedback in Flows"
    url: "https://docs.crewai.com/en/learn/human-feedback-in-flows"
    publisher: "CrewAI"
  - title: "CrewAI pricing"
    url: "https://www.crewai.com/pricing"
    publisher: "CrewAI"
---

LangGraph vs CrewAI comes down to who writes the control flow. In LangGraph you write it: a graph of nodes and edges over a typed state object. In CrewAI you describe a team (agents with roles, tasks with expected outputs) and the framework runs it. Both build real [multi-agent systems](/glossary/multi-agent-system); they differ in what they make easy and what they leave to you.

## The short answer

- **You need durable state, replay, and approval gates you control** → **[LangGraph](/tools/langgraph)**.
- **The work is shaped like a team handing off documents** (research, write, review) and you want it running today → **[CrewAI](/tools/crewai)**.
- **You need TypeScript** → LangGraph. CrewAI has no JavaScript library.
- **Undecided on the design itself** → read [the orchestration patterns guide](/guides/advanced/multi-agent-orchestration) first; the pattern matters more than the framework.

## The facts side by side

Versions, stars, and plan details below were checked on November 27, 2026.

| | LangGraph | CrewAI |
| --- | --- | --- |
| Maintainer | LangChain Inc | CrewAI Inc |
| Licence | MIT | MIT |
| Latest release | 1.2.24 on PyPI (1.0 shipped October 17, 2025) | 1.15.45 |
| Languages | Python 3.10+, plus LangGraph.js for TypeScript | Python 3.10 to 3.13 only |
| GitHub stars (November 2026) | about 45,500 | about 61,300 |
| Core abstraction | `StateGraph`: typed state, nodes, edges | `Agent`, `Task`, `Crew`; `Flow` for event-driven control |
| Control flow | You write every edge; `Command(goto=...)` routes from inside a node | Sequential or hierarchical process; Flows add `@start`, `@listen`, `@router` |
| State persistence | Checkpointer saves state at every super-step | `@persist` on a Flow saves state, SQLite by default |
| Persistence backends | In-memory, SQLite, Postgres, MongoDB, Azure Cosmos DB | SQLite (`SQLiteFlowPersistence`) out of the box |
| Human approval | `interrupt()` in any node, resume with `Command(resume=...)` | `human_input=True` on a task; `@human_feedback` in Flows (1.8.0+) |
| LangChain dependency | Requires `langchain-core` | None |
| Hosted product | LangSmith: free Developer seat, per-seat Plus, usage-billed Agent Server | CrewAI AMP: free tier capped at 50 workflow executions a month, custom Enterprise |

## The same task in both

The task: research a topic, draft a short brief, and get a human's sign-off before it is published.

### CrewAI: declare the team

Install with `uv tool install crewai` (or `pip install crewai`). Agents use the OpenAI API by default, so set `OPENAI_API_KEY`.

```python
from crewai import Agent, Crew, Process, Task

researcher = Agent(
    role="Researcher",
    goal="Find three verifiable facts about {topic}",
    backstory="A careful analyst who cites sources.",
)
writer = Agent(
    role="Writer",
    goal="Turn research notes into a 100-word brief",
    backstory="An editor who writes plainly.",
)

research = Task(
    description="Research {topic}.",
    expected_output="Three bullet points, each with a source.",
    agent=researcher,
)
draft = Task(
    description="Write a 100-word brief from the research.",
    expected_output="A 100-word brief.",
    agent=writer,
    context=[research],
    human_input=True,  # a person reviews the final answer before the task completes
)

crew = Crew(agents=[researcher, writer], tasks=[research, draft], process=Process.sequential)
print(crew.kickoff(inputs={"topic": "vector databases"}))
```

Thirty lines, no control flow. The cost is what you cannot see: the prompt each agent receives, how many tool-use turns it takes, and what happens if the process dies while it waits for the reviewer. `human_input=True` blocks on the console in the same process.

Running `crewai create crew <name>` scaffolds a project instead of a script. As of the 1.15 line that scaffold is JSON-first (`agents/*.jsonc` and `crew.jsonc`, run with `crewai run`); pass `--classic` for the older `crew.py` plus YAML layout.

### LangGraph: write the machine

Install with `pip install -U langgraph langchain`, plus the provider package for your model.

```python
from typing import Literal, TypedDict

from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

model = init_chat_model("claude-sonnet-4-6")


class State(TypedDict):
    topic: str
    notes: str
    brief: str
    status: str


def research(state: State):
    reply = model.invoke(f"List three verifiable facts about {state['topic']}, with sources.")
    return {"notes": reply.content}


def write(state: State):
    reply = model.invoke(f"Write a 100-word brief from these notes:\n{state['notes']}")
    return {"brief": reply.content}


def approve(state: State) -> Command[Literal["publish", "write"]]:
    ok = interrupt({"question": "Publish this brief?", "brief": state["brief"]})
    return Command(goto="publish" if ok else "write")


def publish(state: State):
    return {"status": "published"}


builder = StateGraph(State)
builder.add_node("research", research)
builder.add_node("write", write)
builder.add_node("approve", approve)
builder.add_node("publish", publish)
builder.add_edge(START, "research")
builder.add_edge("research", "write")
builder.add_edge("write", "approve")
builder.add_edge("publish", END)
graph = builder.compile(checkpointer=InMemorySaver())  # use PostgresSaver in production

config = {"configurable": {"thread_id": "brief-1"}}
paused = graph.invoke({"topic": "vector databases"}, config=config, version="v2")
print(paused.interrupts)  # the payload passed to interrupt()

done = graph.invoke(Command(resume=True), config=config, version="v2")
print(done.value["status"])
```

Twice the code, and every line is yours. The pause is real: `interrupt()` saves the thread to the checkpointer and returns control to the caller. The resume can come a week later from a different process, as long as it uses the same `thread_id` and a persistent checkpointer. Rejecting (`Command(resume=False)`) loops back to `write` because you wrote that edge.

## State, durability, and approvals

This is where the two diverge most.

**LangGraph** checkpoints at every super-step (one tick of the graph in which all scheduled nodes run). If one node in a parallel step fails, the writes of the nodes that succeeded are kept as pending writes and are not re-run on resume. The checkpoint history also gives you time travel: reload any earlier checkpoint and fork from it. `InMemorySaver` ships in the box; `langgraph-checkpoint-sqlite`, `langgraph-checkpoint-postgres`, and `langgraph-checkpoint-mongodb` install separately, and the Postgres one is what LangSmith's own hosting uses. A separate store interface holds cross-thread, long-term memory.

**CrewAI** keeps durable state in Flows, not crews. Decorate a Flow class or method with `@persist` and its state is written to a local SQLite database under the flow's UUID; `kickoff(restore_from_state_id=...)` forks a new run from a saved state. For approvals, `@human_feedback` (CrewAI 1.8.0 or later) pauses a Flow method, collects free-text feedback, and, when you pass `emit=[...]`, uses an LLM to collapse that feedback into one of your named outcomes, which then triggers the matching `@listen`. By default it blocks on console input. For a web app you write a `HumanFeedbackProvider` that raises `HumanFeedbackPending`; the framework persists the flow, and you call `ReviewFlow.from_pending(flow_id).resume(feedback)` when the answer arrives. Webhook-based human input for deployed crews is an AMP feature.

In short, both can pause for a person, but LangGraph gives you one mechanism that works in any node with any backend, and CrewAI gives you a simple flag for scripts and a more involved path for services.

## Hosting and paid layers

Both libraries are free. What you pay for is optional and separate.

**LangSmith** is LangChain's tracing, evaluation, and deployment product. It has a free single-seat Developer plan with a monthly allowance of base traces, a per-seat Plus plan, and Enterprise with self-hosted and hybrid options. Deployment runs on LangSmith Agent Server (the product previously called LangSmith Deployment): the Plus plan includes one small serverless Agent Server, and additional servers are billed on resource usage. Agent Server is not LangGraph-only; its docs cover deploying CrewAI, the Claude Agent SDK, and others. Details are on the [LangSmith](/tools/langsmith) page.

**CrewAI AMP** is CrewAI's commercial platform: a visual editor with an AI copilot, managed deployment, tracing, and governance features (SSO, RBAC, PII redaction) on the Enterprise tier. The free tier is capped at 50 workflow executions a month. Enterprise is custom-priced and can run on CrewAI's cloud, your VPC, or your own infrastructure.

Neither is required. A LangGraph graph with a Postgres checkpointer or a CrewAI Flow with `@persist` runs anywhere Python runs.

## Where each one loses

**LangGraph loses on time-to-first-result and on ceremony.** A plain tool-calling loop does not need a graph, and teams routinely build one anyway. You also take on concepts (reducers, super-steps, checkpointer serialization) before anything runs, and it pulls in `langchain-core` whether or not you use the rest of LangChain. The README itself now points people who want speed to Deep Agents, a higher-level package built on top.

**CrewAI loses on visibility and on languages.** A crew's prompts and turn-taking are the framework's, so when output is wrong you debug through an abstraction. Control flow the role metaphor did not anticipate pushes you into Flows, at which point you are writing explicit orchestration anyway, in a second API. There is no TypeScript version. And production pause-and-resume takes more assembly than LangGraph's single `interrupt()` call.

## How to choose

Three questions settle most cases.

1. **Can a run be lost?** If a process restart mid-run costs money or an audit trail, start with LangGraph and a Postgres checkpointer. If a failed run just gets re-run, CrewAI's simpler model is enough.
2. **Who will read the code in six months?** A graph is longer but says exactly what happens. A crew is shorter but its behavior depends on prompts the framework assembles. Teams with on-call duty for the agent tend to prefer the former.
3. **Is the problem actually team-shaped?** Research, write, and review pipelines map cleanly onto roles and tasks. A support agent with branching policy logic, retries, and escalation maps onto a state machine.

If you are still weighing other options, [OpenAI Agents SDK vs LangGraph](/guides/comparisons/openai-agents-sdk-vs-langgraph) covers the minimal-library alternative, and [the 2026 framework guide](/guides/concepts/agent-frameworks-2026) covers the wider field, including the Claude Agent SDK's harness-first approach and [Mastra](/tools/mastra), an open-source TypeScript framework with agents, workflows, and built-in observability.
