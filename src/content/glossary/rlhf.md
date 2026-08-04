---
term: "RLHF (Reinforcement Learning from Human Feedback)"
description: "RLHF trains a model against human preferences: people rank outputs, a reward model learns the ranking, and the LLM is optimized to produce preferred responses."
date: 2026-06-12
topics: ["mlops-ai-infra"]
tags: ["rlhf", "alignment", "training", "post-training"]
related: ["glossary:dpo", "glossary:constitutional-ai", "glossary:fine-tuning", "glossary:reasoning-model"]
faq:
  - q: "What does RLHF actually change about a model?"
    a: "It shapes behavior, not knowledge: after pretraining (next-token prediction over the internet) and instruction tuning, RLHF optimizes the model toward responses humans prefer — helpful, honest, harmless, well-formatted. It's the stage that turned raw text predictors into usable assistants; ChatGPT's 2022 breakthrough was substantially an RLHF story."
  - q: "What are RLHF's known weaknesses?"
    a: "It optimizes for what raters PREFER, which isn't always what's TRUE — producing sycophancy, confident hedging, and reward hacking (gaming the reward model's blind spots). It's also expensive and unstable to run, which is why simpler preference methods like DPO and AI-feedback variants (RLAIF, Constitutional AI) took over much of the work."
---

**RLHF (reinforcement learning from human feedback) is the post-training technique that aligns a model with human preferences: humans rank candidate outputs, a reward model learns those rankings, and the LLM is optimized — via reinforcement learning — to score highly.**

It's the stage that made modern assistants possible: pretraining teaches language and knowledge; RLHF teaches *behavior* — follow instructions, be helpful, refuse harm, format sanely. The classic pipeline (preference data → reward model → PPO optimization) is heavyweight, which spawned a family of successors: [DPO](/glossary/dpo) optimizes on preferences directly without a separate reward model; RLAIF and [Constitutional AI](/glossary/constitutional-ai) substitute AI feedback guided by principles for armies of human raters; and the [reasoning-model](/glossary/reasoning-model) era extended RL beyond preferences to *verifiable rewards* (did the math check out, did the code pass) — arguably the most consequential RL development since.

For practitioners the takeaway is interpretive: model quirks like sycophancy and over-hedging are RLHF artifacts — the model optimizing for approval — worth remembering when [designing evals](/guides/evaluation/write-llm-evals) that measure truth rather than likability.
