---
term: "A2A (Agent2Agent Protocol)"
description: "A2A is an open protocol that lets AI agents discover each other's capabilities and delegate tasks across vendors, complementing MCP's tool connections."
summary: "A2A is an open standard that lets AI agents built by different teams work together: each publishes an Agent Card describing its skills and endpoint, so another agent can find it, hand off a task, and get results back. It complements MCP, which connects an agent to its tools, where A2A connects agents to each other."
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
topics: ["ai-agents-systems"]
audience: ["developers"]
tags: ["a2a", "interoperability", "agents", "protocol"]
related: ["glossary:ai-agent", "glossary:agentic-ai", "glossary:model-context-protocol", "glossary:subagent", "glossary:multi-agent-system"]
faq:
  - q: "How does A2A relate to MCP?"
    a: "They solve different problems and work together. MCP (Model Context Protocol) connects a single agent to tools, data sources, and APIs. A2A connects agents to each other so they can delegate tasks and collaborate. A typical system uses MCP to give each agent its tools and A2A to let those agents coordinate across vendors."
  - q: "Who maintains A2A?"
    a: "Google introduced A2A in April 2025 and contributed it to the Linux Foundation, which launched the Agent2Agent project on June 23, 2025 and stewards it as a vendor-neutral open project under the Apache 2.0 license. The first stable specification, v1.0, shipped in March 2026, and in August 2026 A2A joined the Agentic AI Foundation, the Linux Foundation fund that also hosts MCP. That governance is the point: the protocol's value depends on broad, cross-vendor adoption, so keeping it independent of any single company makes agents from different providers able to interoperate."
  - q: "What is an A2A Agent Card?"
    a: "A JSON document that describes an A2A server: its name, description, and provider, the URL of its A2A endpoint, supported capabilities such as streaming and push notifications, the authentication schemes it requires, and a list of skills with example inputs. Clients usually fetch it from /.well-known/agent-card.json on the agent's domain, or look it up in a registry of cards."
---

**A2A (Agent2Agent Protocol) is an open standard for agent-to-agent interoperability, letting [AI agents](/glossary/ai-agent) discover one another's capabilities and delegate tasks across different vendors and frameworks.**

Agents advertise what they can do through *Agent Cards*: JSON documents listing the agent's name and provider, its service URL, the authentication schemes it requires, and its skills. The standard place to publish one is `https://{agent-server-domain}/.well-known/agent-card.json`. A travel-planning agent that needs flights, for example, fetches `https://flights.example.com/.well-known/agent-card.json`, sees a flight-search skill and an OAuth requirement, authenticates, and sends the task over JSON-RPC 2.0 on HTTPS. The two agents can come from different teams or companies and never see each other's internals.

Google launched A2A in April 2025 and contributed it to the Linux Foundation, which announced the Agent2Agent project on June 23, 2025 and maintains it as a vendor-neutral, Apache-2.0 open-source project. The first stable specification, v1.0, shipped in March 2026, and in August 2026 A2A joined the Agentic AI Foundation (AAIF), the Linux Foundation fund that has hosted MCP since December 2025.

It matters because real systems increasingly involve many specialized agents rather than one monolith, and without a common protocol each integration is bespoke. A2A complements MCP (the [Model Context Protocol](/glossary/model-context-protocol)): MCP connects an agent to its tools and data, while A2A connects agents to each other. It also differs from a [subagent](/glossary/subagent), which one agent spawns and controls inside its own runtime; an A2A peer is an independent service with its own owner, model, and credentials.

The practical caveat is that interoperability is only as good as adoption — a protocol delivers value when many vendors implement it, so check that the platforms you depend on actually speak A2A before you design around it. For how the two protocols divide responsibilities, see [MCP vs A2A](/guides/mcp/mcp-vs-a2a).
