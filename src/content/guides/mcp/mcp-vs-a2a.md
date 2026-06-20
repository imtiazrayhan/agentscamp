---
title: "MCP vs A2A: AI Agent Protocols Explained"
description: "What MCP and A2A each standardize, how Agent Cards and Tasks work, why the two protocols are complementary, and who governs them now (both Linux Foundation)."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["mcp", "architecture"]
tags: ["mcp", "a2a", "protocols", "agents", "interoperability"]
featured: false
summary: "MCP and A2A standardize different edges of an agent system: MCP connects an agent to its tools and data, A2A connects agents to each other via Agent Cards, stateful Tasks, Messages, and Artifacts. Officially complementary, not competing — and both now live under Linux Foundation governance: A2A since June 2025, MCP in the Agentic AI Foundation since December 2025."
keyTakeaways:
  - "The official framing fits one line: 'A2A focuses on agents partnering on tasks, whereas MCP focuses on agents using capabilities.'"
  - "MCP's primitives are tools, resources, and prompts a model can use; A2A's are Agent Cards (discovery), Tasks (stateful work with a lifecycle), Messages/Parts, and Artifacts (outputs)."
  - "A2A reached spec v1.0 in March 2026 under the Linux Foundation's Agent2Agent project (donated by Google, June 2025); MCP was donated by Anthropic to the LF's Agentic AI Foundation in December 2025 with ~97M monthly SDK downloads."
  - "You likely need MCP today; you need A2A when independently-operated agents — across teams, vendors, or companies — must collaborate without sharing internals."
  - "Architecturally they nest: an A2A remote agent typically uses MCP internally to reach its own tools."
faq:
  - q: "Is A2A a replacement for MCP?"
    a: "No — and both projects say so explicitly. MCP standardizes how an agent uses tools and data sources; A2A standardizes how agents communicate with each other. The A2A docs' own example: a mechanic talks to a diagnostic scanner over MCP, and talks to the customer and parts supplier over A2A. Real systems use both layers."
  - q: "What is the A2A protocol?"
    a: "Agent2Agent: an open protocol (created by Google, now a Linux Foundation project) for inter-agent collaboration. An agent publishes an Agent Card describing its identity, skills, endpoint, and auth; clients send it work as Tasks — stateful units with a lifecycle (submitted → working → completed/failed, with input-required and auth-required interrupts) — exchanging Messages and receiving Artifacts, over JSON-RPC, gRPC, or REST."
  - q: "When do I actually need A2A?"
    a: "When agents you don't control must work together: a vendor's support agent delegating to your billing agent, cross-team agents inside a large org, or marketplace-style agent ecosystems. If all your 'agents' are subagents inside one application, your framework's orchestration plus MCP for tools is simpler and enough."
  - q: "Who governs MCP and A2A?"
    a: "Both are Linux Foundation projects now. Google donated A2A in June 2025 (the Agent2Agent project, with AWS, Microsoft, Salesforce, SAP, and others); Anthropic donated MCP in December 2025 to the new Agentic AI Foundation, co-founded with Block and OpenAI. Neither protocol is single-vendor-controlled anymore."
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "building-an-mcp-server", "deploy-remote-mcp-server", "agent-frameworks-2026", "multi-agent-orchestration", "production-tool-calling"]
---

Two protocols keep getting compared as rivals when they standardize **different edges of the same system**. MCP is how an agent reaches its tools and data. [A2A](/glossary/a2a-protocol) is how agents reach each other. The cleanest summary is the official one, from the A2A documentation itself: *"A2A focuses on agents partnering on tasks, whereas MCP focuses on agents using capabilities."*

## What each protocol standardizes

**MCP (Model Context Protocol)** connects a model-driven application to capabilities: **tools** it can call, **resources** it can read, **prompts** it can reuse. A tool is a primitive — structured input, structured output, often stateless. MCP's explosive 2025 made it the de facto standard for this layer: thousands of public servers, adoption across every major agent product, ~97M monthly SDK downloads by year's end. (Practical side: [our setup guide](/guides/mcp/claude-code-mcp-setup) and the [2026 server shortlist](/guides/mcp/best-mcp-servers-2026).)

**A2A (Agent2Agent)** connects *agents* — things that reason, plan, hold state across a long interaction, and use many tools internally. Its primitives are built for delegation between peers that don't share internals:

- **Agent Card** — a JSON document an agent publishes describing its identity, skills, service endpoint, and auth requirements. Discovery, solved declaratively.
- **Task** — the unit of work, **stateful with a lifecycle**: `submitted → working → completed / failed / canceled`, with `input-required` and `auth-required` interrupt states for human-in-the-loop and credential handoffs.
- **Message / Parts** — conversation turns between client and agent, carrying text, files, or structured data.
- **Artifact** — the durable outputs of a task (documents, data, images).

Transport is pragmatic: JSON-RPC, gRPC, or plain HTTP+JSON, per the v1.0 spec.

## The auto-shop test

The A2A docs' canonical example survives because it maps to real systems. A repair shop: the **customer talks to the shop** (A2A — negotiation, clarification, a long-running task with updates), the shop's **mechanic talks to the parts supplier** (A2A again — two independent parties collaborating), and the mechanic **uses the diagnostic scanner** (MCP — a capability with structured inputs and outputs, no opinions of its own).

Swap in software: your support agent (A2A client) delegates a refund to the billing team's agent (A2A server), which internally calls Stripe and Postgres through MCP servers. **A2A between organizations and teams; MCP inside each agent.** They nest — which is why "versus" is the wrong preposition.

## Do you need A2A yet?

Honest answer for most builders in mid-2026: **MCP yes, A2A not yet.**

- If your "multiple agents" are subagents inside one application — one codebase, one operator — your [framework's orchestration](/guides/concepts/agent-frameworks-2026) plus MCP is simpler and sufficient. [Multi-agent orchestration patterns](/guides/advanced/multi-agent-orchestration) don't require a wire protocol between processes you already control.
- A2A starts paying when the agents are **independently operated**: different teams in a large org, different vendors, or a product that exposes an agent for *other people's* agents to call. There, Agent Cards (discovery), task lifecycles (long-running work with interrupts), and standardized auth are exactly the problems you'd otherwise hand-roll badly.
- The strategic signal is governance: A2A launched with AWS, Microsoft, Salesforce, SAP, and ServiceNow at the table and hit **spec v1.0 in March 2026** — enterprise agent-to-agent interop is being standardized ahead of mass demand, which is how useful protocols usually arrive.

## Governance: both grew up

Neither protocol is a single vendor's anymore, and that matters for betting a roadmap on them:

- **A2A** — created by Google (April 2025), **donated to the Linux Foundation in June 2025** as the Agent2Agent project; spec v1.0 landed March 2026; official SDKs in Python, JS, Java, Go, .NET, and Rust.
- **MCP** — created by Anthropic (November 2024), **donated to the Linux Foundation's new Agentic AI Foundation in December 2025**, co-founded with Block and OpenAI (alongside goose and AGENTS.md), with maintainers unchanged.

The practical upshot: build your tool layer on MCP today without lock-in anxiety, design your agent boundaries so a future A2A surface is a wrapper rather than a rewrite — an agent with clean task semantics and [well-built tools underneath](/guides/concepts/production-tool-calling) is already 80% of an A2A server — and re-evaluate A2A the day an agent you *don't* operate needs to call one you do.
