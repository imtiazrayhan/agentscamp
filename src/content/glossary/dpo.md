---
term: "DPO (Direct Preference Optimization)"
description: "DPO aligns a model to preferences directly from chosen-vs-rejected pairs — no reward model, no RL loop — simpler and more stable than classic RLHF."
date: 2026-06-12
topics: ["mlops-ai-infra"]
tags: ["dpo", "alignment", "training", "post-training"]
related: ["rlhf", "fine-tuning", "constitutional-ai", "finetune-dataset-prep"]
faq:
  - q: "How is DPO different from RLHF?"
    a: "RLHF is two systems: train a reward model on preference rankings, then run reinforcement learning against it. DPO collapses that into one supervised-style step — a loss function that directly raises the probability of chosen responses over rejected ones. Same preference data, no reward model, no PPO instability."
  - q: "When would I use DPO myself?"
    a: "When fine-tuning an open-weights model on behavior with a quality gradient — tone, format adherence, refusal style — and you can collect chosen/rejected pairs (often by generating two candidates and picking). It's the accessible alignment step after SFT: standard libraries support it, and it trains like ordinary fine-tuning."
---

**DPO (Direct Preference Optimization) trains a model on preference pairs — this response was chosen, that one rejected — directly through a supervised-style loss, achieving what classic [RLHF](/glossary/rlhf) does without training a reward model or running reinforcement learning.**

The 2023 insight behind it: the RLHF objective has a closed-form solution that can be optimized directly on preference data. Practically that deleted the hardest parts of alignment — the separate reward model, the notoriously twitchy PPO loop — and replaced them with something that trains like ordinary [fine-tuning](/glossary/fine-tuning). The cost: simplicity trades some ceiling. Frontier labs still run full RL pipelines (now increasingly against *verifiable* rewards, not just preferences); DPO and its descendants own the broad middle — open-weights post-training, domain alignment, behavioral polish.

For practitioners, DPO is the reachable rung: after supervised fine-tuning, a few thousand chosen/rejected pairs (curation discipline per [the dataset guide](/guides/mlops/finetune-dataset-prep)) teach preferences a prompt can't reliably hold — the difference between asking for a style and *baking it in*.
