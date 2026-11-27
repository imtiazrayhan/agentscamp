---
title: "MCP vs A2A: AI Agent Protocols Explained"
description: "What MCP and A2A each standardize, how Agent Cards and Tasks work, why the two protocols are complementary, and who governs them now (both Linux Foundation)."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["mcp", "architecture"]
audience: ["developers", "ai-engineers"]
tags: ["mcp", "a2a", "protocols", "agents", "interoperability"]
featured: false
summary: "MCP connects an agent to tools and data; A2A connects agents to each other through Agent Cards, stateful Tasks, Messages and Artifacts. They are complementary, and since August 2026 both sit in the Linux Foundation's Agentic AI Foundation. Most builders need MCP now and A2A only when an agent they don't operate has to call one they do."
keyTakeaways:
  - "The A2A docs' own one-liner: \"A2A is about agents partnering on tasks; MCP is more about agents using capabilities.\""
  - "MCP's primitives are tools, resources, and prompts a model can use; A2A's are Agent Cards (discovery), Tasks (stateful work with a lifecycle), Messages/Parts, and Artifacts (outputs)."
  - "A2A v1.0.0 was released on March 12, 2026, with JSON-RPC, gRPC and HTTP+JSON bindings, an `A2A-Version` header for negotiation, and signed Agent Cards."
  - "Governance converged: Anthropic donated MCP to the Agentic AI Foundation in December 2025, and A2A (a Linux Foundation project since June 2025) joined the same foundation in August 2026."
  - "Architecturally they nest: an A2A remote agent typically uses MCP internally to reach its own tools."
faq:
  - q: "Is A2A a replacement for MCP?"
    a: "No — and both projects say so explicitly. MCP standardizes how an agent uses tools and data sources; A2A standardizes how agents communicate with each other. In the A2A docs' own example, a mechanic agent reaches its diagnostic scanner and repair manuals over MCP, while the customer, the shop manager and the parts supplier talk to each other over A2A. Real systems use both layers."
  - q: "What is the A2A protocol?"
    a: "Agent2Agent: an open protocol (created by Google, now a Linux Foundation project inside the Agentic AI Foundation) for inter-agent collaboration. An agent publishes an Agent Card describing its identity, skills, interfaces, and auth; clients send it work as Tasks — stateful units that move from submitted to working to a terminal state (completed, failed, canceled or rejected), with input-required and auth-required interrupts — exchanging Messages and receiving Artifacts, over JSON-RPC, gRPC, or HTTP+JSON."
  - q: "When do I actually need A2A?"
    a: "When agents you don't control must work together: a vendor's support agent delegating to your billing agent, cross-team agents inside a large org, or marketplace-style agent ecosystems. If all your 'agents' are subagents inside one application, your framework's orchestration plus MCP for tools is simpler and enough."
  - q: "Who governs MCP and A2A?"
    a: "Both are Linux Foundation projects, and since August 2026 both are hosted by the same body, the Agentic AI Foundation (AAIF). Anthropic donated MCP to the AAIF in December 2025, co-founding it with Block and OpenAI. Google donated A2A to the Linux Foundation in June 2025 with AWS, Cisco, Microsoft, Salesforce, SAP and ServiceNow as founding organizations, and A2A joined the AAIF as a hosted project in August 2026."
  - q: "Where does an A2A agent publish its Agent Card?"
    a: "The v1.0 specification registers a well-known URI: https://{server_domain}/.well-known/agent-card.json. Clients fetch that JSON document to learn the agent's skills, supported protocol bindings and authentication requirements. Cards can also be distributed through a registry or configured directly, and v1.0 added signatures so a client can verify a card's origin."
sources:
  - title: "A2A Protocol Specification (v1.0)"
    url: "https://a2a-protocol.org/latest/specification/"
    publisher: "A2A Project, Linux Foundation"
  - title: "A2A and MCP"
    url: "https://a2a-protocol.org/latest/topics/a2a-and-mcp/"
    publisher: "A2A Project, Linux Foundation"
  - title: "A2A releases (v1.0.0, 2026-03-12)"
    url: "https://github.com/a2aproject/A2A/releases"
    publisher: "A2A Project"
  - title: "A2A joins AAIF's open agentic stack"
    url: "https://aaif.io/blog/a2a-joins-aaif"
    publisher: "Agentic AI Foundation"
  - title: "Linux Foundation Launches the Agent2Agent Protocol Project"
    url: "https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents"
    publisher: "Linux Foundation"
  - title: "Donating the Model Context Protocol and establishing the Agentic AI Foundation"
    url: "https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation"
    publisher: "Anthropic"
  - title: "A2A SDKs"
    url: "https://a2a-protocol.org/latest/sdk/"
    publisher: "A2A Project, Linux Foundation"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:building-an-mcp-server", "guide:deploy-remote-mcp-server", "guide:agent-frameworks-2026", "guide:multi-agent-orchestration", "guide:production-tool-calling"]
---

Two protocols keep getting compared as rivals when they standardize **different edges of the same system**. MCP is how an agent reaches its tools and data. [A2A](/glossary/a2a-protocol) is how agents reach each other. The cleanest summary is the official one, from the A2A documentation itself: *"A2A is about agents partnering on tasks; MCP is more about agents using capabilities."* The A2A project describes MCP as the vertical layer and A2A as the horizontal one.

## MCP vs A2A at a glance

| | MCP | A2A |
| --- | --- | --- |
| Connects | An agent (or AI app) to tools and data | An agent to another, independently operated agent |
| Primitives | Tools, resources, prompts | Agent Card, Task, Message/Part, Artifact |
| Interaction shape | A call with structured input and output | A stateful task with a lifecycle, streaming and interrupts |
| Discovery | Client is configured with servers; an official registry lists public ones | Agent Card at `/.well-known/agent-card.json` |
| Wire format | JSON-RPC over stdio or Streamable HTTP | JSON-RPC, gRPC or HTTP+JSON |
| Created by | Anthropic, November 2024 | Google, April 2025 |
| Governance | Agentic AI Foundation (Linux Foundation), since December 2025 | Linux Foundation since June 2025; Agentic AI Foundation since August 2026 |
| Current spec | Dated revisions; latest is 2026-07-28 | v1.0.0, released March 12, 2026 |
| Official SDKs | Ten; Tier 1 are TypeScript, Python, C#, Go, Rust and Ruby | Six: Python, Go, Java, JavaScript, C#/.NET, Rust |

## What each protocol standardizes

**MCP (Model Context Protocol)** connects a model-driven application to capabilities: **tools** it can call, **resources** it can read, **prompts** it can reuse. A tool is a primitive with structured input and structured output, often stateless. It is the de facto standard for this layer: when Anthropic donated it in December 2025 it counted more than 10,000 active public servers, and the registries show the core SDKs at roughly 388 million npm downloads (`@modelcontextprotocol/sdk`) and 341 million PyPI downloads (`mcp`) in the 30 days to late November 2026. The fuller series is in [MCP ecosystem statistics](/guides/mcp/mcp-ecosystem-statistics). (Practical side: [our setup guide](/guides/mcp/claude-code-mcp-setup) and the [2026 server shortlist](/guides/mcp/best-mcp-servers-2026).)

**A2A (Agent2Agent)** connects *agents*: things that reason, plan, hold state across a long interaction, and use many tools internally. Its primitives are built for delegation between peers that don't share internals:

- **Agent Card** — a JSON document an agent publishes describing its identity, skills, interfaces, and auth requirements.
- **Task** — the unit of work, **stateful with a lifecycle**. In v1.0 the states are `TASK_STATE_SUBMITTED`, `TASK_STATE_WORKING`, the terminal states `TASK_STATE_COMPLETED`, `TASK_STATE_FAILED`, `TASK_STATE_CANCELED` and `TASK_STATE_REJECTED`, and two interrupts, `TASK_STATE_INPUT_REQUIRED` and `TASK_STATE_AUTH_REQUIRED`, for human-in-the-loop and credential handoffs.
- **Message / Parts** — conversation turns between client and agent, carrying text, files, or structured data.
- **Artifact** — the durable outputs of a task (documents, data, images).

Transport is pragmatic: the v1.0 spec defines JSON-RPC, gRPC, and HTTP+JSON bindings, and an agent lists the ones it supports in its card.

## What an Agent Card looks like

This card follows the field names in the v1.0 specification's sample; the agent and URLs are invented:

```json
{
  "name": "Acme Billing Agent",
  "description": "Looks up invoices and issues refunds for Acme customers.",
  "supportedInterfaces": [
    {"url": "https://billing.example.com/a2a/v1", "protocolBinding": "JSONRPC", "protocolVersion": "1.0"},
    {"url": "https://billing.example.com/a2a/json", "protocolBinding": "HTTP+JSON", "protocolVersion": "1.0"}
  ],
  "version": "1.2.0",
  "capabilities": {"streaming": true, "pushNotifications": false},
  "defaultInputModes": ["text/plain", "application/json"],
  "defaultOutputModes": ["application/json"],
  "skills": [
    {
      "id": "issue-refund",
      "name": "Issue refund",
      "description": "Refunds a charge on an invoice after checking refund policy.",
      "tags": ["billing", "refunds"],
      "examples": ["Refund the duplicate charge on invoice INV-1042."]
    }
  ]
}
```

A production card also declares `securitySchemes` and `securityRequirements` (the spec's sample uses OpenID Connect) and can carry `signatures`. If you wrote against a pre-1.0 draft, note what moved: `protocolVersion` now lives on each entry of `supportedInterfaces`, which replaced `preferredTransport` and `additionalInterfaces`, and the well-known path is `agent-card.json`.

## What a task looks like on the wire

With the HTTP+JSON binding, delegating work is one POST. The shape below is the spec's basic example with the content changed:

```http
POST /message:send HTTP/1.1
Host: billing.example.com
Content-Type: application/a2a+json
Authorization: Bearer token
A2A-Version: 1.0

{
  "message": {
    "role": "ROLE_USER",
    "parts": [{"text": "Refund the duplicate charge on invoice INV-1042."}],
    "messageId": "msg-uuid"
  }
}
```

```json
{
  "task": {
    "id": "task-uuid",
    "contextId": "context-uuid",
    "status": {"state": "TASK_STATE_COMPLETED"},
    "artifacts": [{
      "artifactId": "artifact-uuid",
      "name": "Refund confirmation",
      "parts": [{"text": "Refunded the duplicate charge on INV-1042."}]
    }]
  }
}
```

The same operation is `SendMessage` in the JSON-RPC binding, with `SendStreamingMessage`, `GetTask`, `ListTasks`, `CancelTask` and `SubscribeToTask` alongside it. Clients must send the `A2A-Version` header; the spec says an empty value is treated as 0.3, so a v1.0 client that omits it will be read as a pre-1.0 one. Compare that with an MCP tool call, which has no task id, no lifecycle and no notion of the other side asking you a question halfway through. That difference is the whole reason A2A exists.

## The auto-shop test

The A2A docs' canonical example survives because it maps to real systems. A repair shop staffed by agents: the **customer (or their assistant agent) talks to the Shop Manager agent** over A2A, a back-and-forth with clarifying questions. The **Mechanic agent uses its diagnostic scanner, repair manual and platform lift** over MCP, as structured calls such as `scan_vehicle_for_error_codes(vehicle_id='XYZ123')`. When a part is needed, the **Mechanic talks to a Parts Supplier agent** over A2A again, because the supplier is an independent party.

Swap in software: your support agent (A2A client) delegates a refund to the billing team's agent (A2A server), which internally calls Stripe and Postgres through MCP servers. **A2A between organizations and teams; MCP inside each agent.** They nest, which is why "versus" is the wrong preposition.

## Do you need A2A yet?

For most builders in late 2026 the answer is still **MCP yes, A2A when a boundary demands it.**

- If your "multiple agents" are subagents inside one application (one codebase, one operator), your [framework's orchestration](/guides/concepts/agent-frameworks-2026) plus MCP is simpler and sufficient. [Multi-agent orchestration patterns](/guides/advanced/multi-agent-orchestration) don't require a wire protocol between processes you already control.
- A2A starts paying when the agents are **independently operated**: different teams in a large org, different vendors, or a product that exposes an agent for *other people's* agents to call. There, Agent Cards (discovery), task lifecycles (long-running work with interrupts), and standardized auth are exactly the problems you'd otherwise hand-roll badly.
- Adoption is no longer hypothetical. The AAIF's August 2026 announcement counts more than 150 partner organizations and says A2A is running in production; the A2A project's own post lists native support in Google Cloud, AWS Bedrock AgentCore Runtime and Microsoft Azure AI Foundry, and in frameworks including LangGraph, CrewAI, Pydantic AI and AG2. The Python SDK (`a2a-sdk`, version 1.3.1 as of November 2026) was downloaded about 14 million times from PyPI in the last month. That is real, and still about 4% of the MCP Python SDK's volume.

**Where each one loses.** MCP gives you no standard way to hand off a long-running, multi-turn job to a peer that may come back with questions. A2A is heavier than you need for calling a function: you run a server, publish and secure a card, and handle task state, and far fewer off-the-shelf agents speak it than there are MCP servers.

## Governance: one foundation now

Neither protocol is a single vendor's anymore, and that matters for betting a roadmap on them:

- **MCP** — created by Anthropic (November 2024) and **donated in December 2025 to the Agentic AI Foundation**, a directed fund under the Linux Foundation co-founded by Anthropic, Block and OpenAI, where it sits beside goose and AGENTS.md. Anthropic's announcement says MCP's governance model stays unchanged.
- **A2A** — created by Google (April 2025) and **donated to the Linux Foundation on June 23, 2025** as the Agent2Agent project. IBM's Agent Communication Protocol merged into it in August 2025, spec v1.0 shipped in March 2026, and **in August 2026 A2A joined the Agentic AI Foundation as a hosted project**. Official SDKs cover Python, Go, Java, JavaScript, C#/.NET and Rust, and an A2A CLI was introduced in October 2026.

The practical upshot: build your tool layer on MCP today without lock-in anxiety, and design your agent boundaries so a future A2A surface is a wrapper rather than a rewrite. An agent with clean task semantics and [well-built tools underneath](/guides/concepts/production-tool-calling) is most of the way to an A2A server already. Re-evaluate A2A the day an agent you *don't* operate needs to call one you do.
