---
term: "A2A (Agent2Agent Protocol)"
description: "A2A is an open protocol that lets AI agents discover each other's capabilities and delegate tasks across vendors, complementing MCP's tool connections."
date: 2026-06-17
topics: ["ai-agents-systems"]
tags: ["a2a", "interoperability", "agents", "protocol"]
related: ["ai-agent", "agentic-ai", "computer-use"]
faq:
  - q: "How does A2A relate to MCP?"
    a: "They solve different problems and work together. MCP (Model Context Protocol) connects a single agent to tools, data sources, and APIs. A2A connects agents to each other so they can delegate tasks and collaborate. A typical system uses MCP to give each agent its tools and A2A to let those agents coordinate across vendors."
  - q: "Who maintains A2A?"
    a: "A2A was introduced by Google and later donated to the Linux Foundation, which now stewards it as a vendor-neutral open project. That governance is the point: the protocol's value depends on broad, cross-vendor adoption, so keeping it independent of any single company makes agents from different providers able to interoperate."
---

**A2A (Agent2Agent Protocol) is an open standard for agent-to-agent interoperability, letting [AI agents](/glossary/ai-agent) discover one another's capabilities and delegate tasks across different vendors and frameworks.**

Agents advertise what they can do through *Agent Cards* — machine-readable descriptions of their skills and endpoints — so another agent can find a suitable collaborator and hand it a task, then receive results back, even when the two were built by different teams or companies. Originally introduced by Google, A2A was donated to the Linux Foundation, which now maintains it as a vendor-neutral standard.

It matters because real systems increasingly involve many specialized agents rather than one monolith, and without a common protocol each integration is bespoke. A2A complements MCP (the Model Context Protocol): MCP connects an agent to its tools and data, while A2A connects agents to each other. The practical caveat is that interoperability is only as good as adoption — a protocol delivers value when many vendors implement it, and the ecosystem is still maturing, so expect uneven support across platforms today. For how the two protocols divide responsibilities, see [MCP vs A2A](/guides/mcp/mcp-vs-a2a).
