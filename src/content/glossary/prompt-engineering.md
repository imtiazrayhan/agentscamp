---
term: "Prompt Engineering"
description: "Prompt engineering is the practice of designing an LLM's inputs — instructions, context, examples, and format — to reliably get the output you want."
date: 2026-06-17
topics: ["workflow-prompting"]
tags: ["prompting", "llm", "instructions", "few-shot"]
related: ["system-prompt", "few-shot-prompting", "chain-of-thought", "context-engineering"]
faq:
  - q: "How is prompt engineering different from fine-tuning?"
    a: "Prompt engineering shapes the model's behavior purely through its inputs — instructions, examples, and format — and changes nothing about the model itself. Fine-tuning retrains the model's weights on your data to bake in new behavior. Prompting is fast, cheap, and reversible, so you try it first; fine-tuning is worth the cost only when prompting can't get you there reliably."
  - q: "Is prompt engineering still relevant for agents?"
    a: "Yes, but it's part of a larger discipline. For multi-step agents, what matters most is everything assembled into the context window across turns — retrieved data, tool results, and history — which is called context engineering. Prompt engineering remains the core skill for the static instructions, but context engineering governs the dynamic parts."
---

**Prompt engineering is the practice of designing the inputs to a large language model — instructions, context, examples, and output format — to reliably get the response you want, without changing the model's weights.**

The core levers are few and learnable. Write clear, specific instructions and put durable behavior in a [system prompt](/glossary/system-prompt). Show the model what good looks like with [few-shot examples](/glossary/few-shot-prompting). Specify the output format you need (JSON, a list, a single word). For hard problems, decompose the task or ask the model to reason step by step, the idea behind [chain-of-thought](/glossary/chain-of-thought) prompting. And give the model an out — permission to say "I don't know" — so it stops guessing when it lacks the answer.

Prompt engineering is empirical, not theoretical: small wording changes shift behavior in ways you can't fully predict, so you iterate and test against real examples rather than reasoning your way to the perfect prompt. It contrasts with [fine-tuning](/glossary/fine-tuning), which alters the model itself; prompting leaves the model untouched and is faster, cheaper, and reversible.

As applications grew into agents, the focus expanded from wording one prompt to curating everything that enters the model's window — a shift toward [context engineering](/glossary/context-engineering). For a catalog of reusable techniques, see the [prompt patterns guide](/guides/prompting/prompt-patterns).