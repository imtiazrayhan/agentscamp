---
term: "ReAct (Reasoning + Acting)"
description: "ReAct is an agent loop that interleaves reasoning with tool actions — Thought, Action, Observation, repeat — so the model plans, calls a tool, and revises."
summary: "A ReAct agent cycles through Thought, Action, and Observation: it writes a short reasoning trace, calls a tool, reads the tool's actual output, then revises before acting again. Grounding each step in a real result makes it robust to surprises, at the cost of a full model call per cycle."
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
topics: ["ai-agents-systems"]
audience: ["developers", "ai-engineers"]
tags: ["react", "agents", "tool-use", "reasoning"]
related: ["glossary:ai-agent", "glossary:function-calling", "glossary:chain-of-thought"]
faq:
  - q: "Is this related to React.js?"
    a: "No — despite the name, ReAct here stands for Reasoning + Acting and has nothing to do with the React JavaScript UI library. It's a prompting pattern for agents: the model alternates between thinking and taking actions in the world (calling tools, searching, running code)."
  - q: "Why interleave reasoning with actions instead of planning everything upfront?"
    a: "Because real tasks are uncertain — a search returns something unexpected, a tool errors, a file isn't where you assumed. ReAct lets the model observe the result of each action and revise its next step, rather than committing to a brittle plan made before it had any information. That feedback loop is what makes tool-using agents robust."
  - q: "Where does the ReAct pattern come from?"
    a: "From the paper ReAct: Synergizing Reasoning and Acting in Language Models by Yao and colleagues, submitted to arXiv in October 2022. It prompted a model with one or two worked examples of interleaved thoughts and actions, then evaluated it on HotpotQA and Fever using a simple Wikipedia API and on the ALFWorld and WebShop interactive benchmarks."
---

**ReAct (Reasoning + Acting) is an agent pattern that interleaves reasoning traces with tool actions and their observations — Thought, Action, Observation, then repeat — so the model plans a step, calls a tool, reads the result, and revises before acting again.**

Each cycle, the model writes a short reasoning trace (the "Thought"), chooses an action — typically a tool call via [function calling](/glossary/function-calling) — and then receives an Observation: the tool's actual output. That observation feeds the next Thought. A support agent for a fictional store might run:

```text
Thought: The customer asks why order A-1042 is late. Check its status first.
Action: get_order("A-1042")
Observation: {"status": "held", "reason": "address_unverified"}
Thought: It is held on an address check, not delayed in shipping. Explain and ask the customer to confirm the address.
Final answer: Your order is on hold until you confirm your delivery address.
```

The pattern comes from "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., October 2022), which tested it on question answering and fact checking against a Wikipedia API and on the ALFWorld and WebShop decision-making benchmarks.

Two neighbours are easy to confuse with it. [Chain-of-thought](/glossary/chain-of-thought) reasons in one pass with no contact with the world, so it cannot correct a wrong assumption; ReAct checks each step against a real result. Function calling is the mechanism for a single tool call; ReAct is the loop wrapped around many of them.

This is the canonical loop behind most tool-using [AI agents](/glossary/ai-agent), though current agents usually run it through native tool calls rather than literal "Thought:" lines. Its strength is robustness under uncertainty: the model recovers from surprising tool output, failed calls, or missing data because it observes before committing. The caveat is that each cycle costs a full model call, loops can wander or repeat themselves without step limits and clear stopping conditions, and a wrong observation early can mislead the entire trajectory.
