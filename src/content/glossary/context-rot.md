---
term: "Context Rot"
description: "Context rot is the decline in an LLM's ability to recall and use information accurately as the number of tokens in its context window grows."
date: 2026-10-09
topics: ["workflow-prompting", "llm-app-dev"]
audience: ["developers", "ai-engineers"]
tags: ["context-rot", "context-window", "long-context", "context-engineering", "llm"]
related: ["guide:context-engineering", "glossary:context-window", "guide:claude-code-memory-context", "glossary:context-engineering", "guide:claude-code-usage-limits"]
faq:
  - q: "Where does the term context rot come from?"
    a: "From the title of Chroma Research's July 2025 technical report, Context Rot: How Increasing Input Tokens Impacts LLM Performance, which evaluated 18 models and found performance degrading with input length even on minimal tasks. The report never defines the phrase in prose; the clearest primary-source definition is Anthropic's September 2025 context-engineering post, which describes recall decreasing as tokens in the window increase."
  - q: "Is context rot the same as running out of context?"
    a: "No. Running out means the window is full and the model cannot take more input. Context rot happens well before that: the window has room, but the model's accuracy on what is already there declines as the input grows, and distractors and loosely related content make it worse."
  - q: "How do I reduce context rot in practice?"
    a: "Treat the window as a budget: include only what the task needs, keep instruction files short, summarize or clear long histories, and move verbose work into subagents or on-demand loading. Chroma's experiments found far higher performance on focused prompts of a few hundred tokens than on the full inputs they were drawn from."
summary: "Context rot is the degradation of an LLM's recall and reasoning as its context window fills: as the number of tokens grows, the model's ability to use what is already there declines, often unevenly. The term comes from Chroma Research's July 2025 report across 18 models; Anthropic defines it as recall accuracy decreasing as tokens in the window increase."
---

**Context rot is the degradation in a language model's ability to recall and use information accurately as the number of tokens in its [context window](/glossary/context-window) increases.** The model does not run out of room; it gets worse at using the room it has.

The phrase comes from the title of Chroma Research's July 2025 technical report, "Context Rot: How Increasing Input Tokens Impacts LLM Performance." The report itself never defines the term in a sentence; its headline finding stands in for one: "even under these minimal conditions, model performance degrades as input length increases, often in surprising and non-uniform ways." The experiments held task difficulty constant across 18 closed and open-weight models while varying only input length. Degradation accelerated when the question and the relevant passage were only loosely similar in wording, distractors hurt more as inputs grew, and on the LongMemEval benchmark every model scored significantly higher on focused prompts averaging around 300 tokens than on the full 113,000-token inputs those prompts were drawn from.

The clearest primary-source definition is Anthropic's, from its September 29, 2025 post on context engineering: "as the number of tokens in the context window increases, the model's ability to accurately recall information from that context decreases." The same post draws the practical conclusion: context "must be treated as a finite resource with diminishing marginal returns," because models have an attention budget they spend as they parse it.

That framing is why [context engineering](/guides/prompting/context-engineering) treats the window as a budget rather than a backpack: the useful question is never whether something fits but whether adding it makes the next answer better or worse. For [coding agents](/glossary/coding-agent) the same logic drives session hygiene, short instruction files and on-demand loading, covered in [Claude Code memory and context](/guides/configuration/claude-code-memory-context). Context rot also has a cost dimension, since a long session is re-sent on every turn; see [Claude Code usage limits](/guides/getting-started/claude-code-usage-limits).
