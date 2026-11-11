---
term: "Tool Poisoning (MCP)"
description: "Tool poisoning is an MCP attack in which malicious instructions hidden in a tool's description steer the model without the user seeing them."
date: 2026-10-11
topics: ["ai-safety-security", "mcp"]
audience: ["developers", "security"]
tags: ["tool-poisoning", "mcp", "security", "prompt-injection", "supply-chain"]
related: ["guide:govern-mcp-servers", "glossary:prompt-injection", "glossary:model-context-protocol", "skill:mcp-config-auditor", "agent:mcp-security-reviewer", "guide:claude-code-mcp-setup"]
faq:
  - q: "Who coined the term tool poisoning?"
    a: "Invariant Labs, in a security notification published on April 1, 2025, which described Tool Poisoning Attacks as a specialized form of indirect prompt injection against MCP. The MCP specification itself never uses the phrase; its protection is the principle that tool descriptions and annotations are untrusted unless they come from a trusted server, and that hosts must obtain explicit user consent before invoking any tool."
  - q: "What is an MCP rug pull?"
    a: "A variant where a server changes a tool's description after the client has already approved it. The user trusted the original, benign description, and the malicious version arrives later without a new approval prompt. Invariant's proposed defense is pinning: verifying a hash or checksum of the tool description before each use."
  - q: "How do I defend against tool poisoning?"
    a: "Connect only servers you trust, read full tool descriptions rather than the UI summary, keep approval prompts on for tool calls, pin server versions, and separate servers so one cannot shadow another's tools. Scanners such as Snyk's agent-scan, the successor to Invariant's mcp-scan, flag poisoned descriptions and cross-server shadowing."
summary: "Tool poisoning is an attack on MCP tools in which malicious instructions are embedded in a tool's description, invisible to the user but read by the model, steering the agent into leaking data or unauthorized actions. Invariant Labs coined it in April 2025; defenses are trusted servers, visible descriptions, consent prompts and pinning."
---

**Tool poisoning is an attack on [Model Context Protocol](/glossary/model-context-protocol) tools in which malicious instructions are hidden inside a tool's description, where the model reads them but the user does not.** The term comes from Invariant Labs, whose April 1, 2025 security notification defined it: "A Tool Poisoning Attack occurs when malicious instructions are embedded within MCP tool descriptions that are invisible to users but visible to AI models." It is, in their words, "a specialized form of indirect prompt injections," so it belongs to the same family as [prompt injection](/glossary/prompt-injection) through web pages or documents.

The attack works because the model sees the complete description while the user typically sees a simplified summary in the UI. Two variants extend it. In a **rug pull**, "a malicious server can change the tool description after the client has already approved it." In **cross-server tool shadowing**, a malicious server's description "modifies the agent's behavior with respect to a trusted service or tool," so it can exfiltrate data through a legitimate server without its own tool ever being called. Later academic work measured the exposure: the MCPTox benchmark (August 2025), built on 45 live servers and 353 tools, reported an attack success rate of 72.8% against o1-mini.

The MCP specification never uses the phrase. Its defense is a principle in the current (2026-07-28) spec: "descriptions of tool behavior such as annotations should be considered untrusted, unless obtained from a trusted server," and "Hosts must obtain explicit user consent before invoking any tool." In practice that means connecting only servers you trust, reading full descriptions, keeping approval prompts on, pinning server versions (Invariant recommends hashing the description itself), and isolating servers from each other. Invariant's scanner, `mcp-scan`, now lives on as Snyk's `agent-scan`, with issue codes for tool poisoning and tool shadowing. The [MCP governance guide](/guides/mcp/govern-mcp-servers) covers fleet controls; the [mcp-config-auditor](/skills/security/mcp-config-auditor) skill and [mcp-security-reviewer](/agents/quality-security/mcp-security-reviewer) agent check a configuration before you trust it.
