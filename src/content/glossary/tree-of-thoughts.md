---
term: "Tree of Thoughts"
description: "Tree of Thoughts is a prompting method that explores multiple reasoning branches as a search tree, evaluating and backtracking among them."
date: 2026-06-17
topics: ["workflow-prompting"]
tags: ["prompting", "reasoning", "search", "tree-of-thoughts"]
related: ["chain-of-thought", "reasoning-model", "test-time-compute"]
faq:
  - q: "How is Tree of Thoughts different from chain-of-thought?"
    a: "Chain-of-thought produces one linear sequence of reasoning steps. Tree of Thoughts generalizes that into a search: it generates several candidate next steps at each point, scores them, and explores or abandons branches — so it can recover from a bad step instead of committing to a single line. It trades far more compute for the ability to backtrack."
  - q: "When is it worth the extra cost?"
    a: "On problems that need exploration and lookahead — puzzles, planning, math with multiple viable paths — where the first idea is often wrong. For straightforward tasks the overhead (many more model calls and tokens) buys little, and a plain chain-of-thought or a reasoning model is cheaper and good enough."
---

**Tree of Thoughts is a prompting and search method that generalizes [chain-of-thought](/glossary/chain-of-thought) into a branching tree: the model generates multiple candidate reasoning steps, evaluates them, and explores or backtracks among branches to reach a solution.**

Where chain-of-thought commits to one linear sequence, Tree of Thoughts treats reasoning as a search problem. At each step it proposes several possible "thoughts," scores how promising each is, and expands the best ones — depth-first or breadth-first — discarding dead ends. Because it can abandon a bad path and try another, it outperforms linear prompting on tasks that need lookahead and exploration, like puzzles and multi-step planning where the first idea is frequently wrong.

The cost is the catch. Exploring a tree means many more model calls and far more tokens than a single pass, which is a deliberate spend of [test-time compute](/glossary/test-time-compute) — trading inference budget for accuracy. That tradeoff also overlaps with what a [reasoning model](/glossary/reasoning-model) does internally, so before orchestrating an explicit tree, it's worth checking whether a reasoning model already gives you enough exploration for far less plumbing.
