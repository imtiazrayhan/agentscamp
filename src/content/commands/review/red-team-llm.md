---
description: "Red-team an LLM app or agent for prompt injection, jailbreaks, and data leakage — probe the real attack surface (input, RAG, tools, system prompt) with adversarial inputs and report what got through and how to fix it."
argument-hint: "<the app/endpoint/agent to test, or a description of its inputs, tools, and data>"
allowed-tools: "Read, Grep, Glob, Bash"
model: "sonnet"
title: "Red Team LLM"
color: "red"
date: 2026-06-04
topics: ["ai-safety-security"]
related: ["guide:defending-prompt-injection", "agent:prompt-injection-auditor", "tool:promptfoo", "guide:owasp-agentic-top-10"]
featured: false
summary: "A slash command that actively red-teams an LLM app or agent you are authorized to test: it maps every channel reaching the model — user input, RAG content, tool outputs, system prompt — runs adversarial probes for injection, jailbreaks, leakage, exfiltration, and tool misuse, records what got through with its blast radius, and recommends fixes."
---

## Scope

Treat `$ARGUMENTS` as the LLM app/agent to red-team — an endpoint, an agent, or a description of its inputs, tools, retrieved sources, and data. Restate the target and its attack surface in one sentence before probing.

> [!WARNING]
> Red-team only systems you are **authorized** to test. This command runs adversarial attacks; confirm you have permission for the target and use a non-production or isolated environment where possible. The aim is to find holes before an attacker does — on your own system.

Goal: probe the **real** attack surface with adversarial inputs, record what succeeds and its blast radius, and return prioritized fixes — an active attack campaign, complementary to the design review the [prompt-injection-auditor](/agents/quality-security/prompt-injection-auditor) performs.

## Step 1 — Map the attack surface

Enumerate every channel that reaches the model: direct user input, **retrieved/RAG content**, **tool outputs**, browsed pages or ingested files, and the system prompt. The indirect channels (content the system reads while working) are the ones most worth attacking.

## Step 2 — Choose attack categories

Cover the categories that matter for this target:

- **Direct prompt injection** — instruction-override in user input.
- **Indirect injection** — payloads planted in a document, tool result, or page the system ingests.
- **Jailbreak** — bypassing safety/policy constraints.
- **System-prompt leakage** — extracting the hidden instructions (LLM07).
- **Data exfiltration** — making the model reveal data or secrets it shouldn't.
- **Tool misuse** — inducing a harmful or out-of-scope tool call (for agents).

## Step 3 — Run the probes

Execute adversarial inputs for each category — automated with a red-teaming tool like [promptfoo](/tools/promptfoo) (injection/jailbreak suites) and/or targeted manual probes, including the **indirect** path (seed a poisoned document/tool result and see if the agent obeys it). Vary phrasings; a single failed attempt proves nothing.

## Step 4 — Record what got through and its blast radius

For each successful attack, capture the input, what the model did, and — critically — the **impact**: data leaked, action taken, constraint bypassed. Rank by blast radius (what it could actually cause), not by novelty.

## Step 5 — Recommend fixes and re-test

Map each finding to a mitigation — least privilege, human approval, trust boundaries, input/output guardrails, secrets out of context (see [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection)) — then re-run the successful attacks to confirm the fix contains them. An attack that now achieves nothing is the success criterion, not one you believe you blocked.

> [!NOTE]
> Report negatives honestly: state which attack categories you ran, which you didn't, and that passing today's probes is not proof of safety — red-teaming is continuous, because new bypasses appear. Gate releases on it, don't treat it as a one-time sign-off.
