---
term: "ReAct (Reasoning + Acting)"
description: "ReAct is an agent loop that interleaves reasoning with tool actions — Thought, Action, Observation, repeat — so the model plans, calls a tool, and revises."
date: 2026-06-17
topics: ["ai-agents-systems"]
tags: ["react", "agents", "tool-use", "reasoning"]
related: ["glossary:ai-agent", "glossary:function-calling", "glossary:chain-of-thought"]
faq:
  - q: "Is this related to React.js?"
    a: "No — despite the name, ReAct here stands for Reasoning + Acting and has nothing to do with the React JavaScript UI library. It's a prompting pattern for agents: the model alternates between thinking and taking actions in the world (calling tools, searching, running code)."
  - q: "Why interleave reasoning with actions instead of planning everything upfront?"
    a: "Because real tasks are uncertain — a search returns something unexpected, a tool errors, a file isn't where you assumed. ReAct lets the model observe the result of each action and revise its next step, rather than committing to a brittle plan made before it had any information. That feedback loop is what makes tool-using agents robust."
---

**ReAct (Reasoning + Acting) is an agent pattern that interleaves reasoning traces with tool actions and their observations — Thought, Action, Observation, then repeat — so the model plans a step, calls a tool, reads the result, and revises before acting again.**

Each cycle, the model writes a short reasoning trace (the "Thought"), chooses an action — typically a tool call via [function calling](/glossary/function-calling) — and then receives an Observation: the tool's actual output. That observation feeds the next Thought, so the loop grounds reasoning in real results instead of guessing the whole plan in advance. It is essentially [chain-of-thought](/glossary/chain-of-thought) extended with the ability to act in the world and learn from what happens.

This is the canonical loop behind most tool-using [AI agents](/glossary/ai-agent). Its strength is robustness under uncertainty — the model recovers from surprising tool output, failed calls, or missing data because it observes before committing. The caveat is that each cycle costs a full model call, loops can wander or repeat themselves without step limits and clear stopping conditions, and a wrong observation early can mislead the entire trajectory.
