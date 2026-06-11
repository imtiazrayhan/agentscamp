---
title: "Choosing the Right Model: Haiku vs Sonnet vs Opus"
description: "How to pick the right Claude model tier for an agent or task."
author: "AgentsCamp"
date: 2026-05-10
color: "green"
topics: ["workflow-prompting"]
summary: "Match each Claude Code agent to a tier: Haiku for mechanical, high-volume transformations; Sonnet as the balanced default for real coding work; Opus for architecture, security, and anything where a mistake is expensive. The model field is optional (defaults to inherit). Start on Sonnet; demote to Haiku when a task proves mechanical, promote to Opus on real reasoning failures."
keyTakeaways:
  - "Three tiers, three jobs: Haiku is fast and cheap for mechanical work, Sonnet is the balanced default, Opus is deepest reasoning for high-stakes problems."
  - "The rubric in order: mechanical and well-specified → Haiku; real coding within a known pattern → Sonnet; costly mistakes or cross-system reasoning → Opus."
  - "When two tiers feel plausible, weigh frequency against stakes — runs-hundreds-of-times leans cheaper, gates-a-release leans smarter."
  - "model: inherit makes an agent follow the main session — right for general helpers, wrong for agents whose quality must not silently degrade (pin your security auditor to opus)."
  - "Don't default to Opus for prestige: on simple tasks it costs more without being measurably better."
faq:
  - q: "Which Claude model tier should I use for coding agents?"
    a: "Sonnet, until proven otherwise — it handles real codebases, multi-step instructions, and quality diffs at sensible cost. Drop an agent to Haiku once you confirm its task is mechanical (formatting, extraction, classification). Promote to Opus only for genuinely hard reasoning or expensive-mistake territory: architecture, security audits, race conditions, migrations."
  - q: "What does model: inherit do in a subagent?"
    a: "The subagent runs on whatever model the main session is using instead of a pinned tier. It's the default when you omit the field, and it's right for general-purpose helpers that should match the room — but pin an explicit tier for agents whose quality depends on it, so they never silently run on something weaker."
  - q: "When is Opus actually worth the cost?"
    a: "When the problem is hard in a way that shows up as reasoning failures on Sonnet, or when the blast radius of a subtle mistake is large: designing a public API, auditing auth, planning a database migration, untangling concurrency bugs that span services. If you can't articulate why a task needs Opus, it belongs on Sonnet."
  - q: "Can skills and slash commands set a model too?"
    a: "Yes, but with different semantics: a skill or slash command's model field is a per-turn override that reverts to the session model on your next prompt, while a subagent's model pins the tier for every invocation of that agent."
---

A Claude Code subagent can set a model in its frontmatter — and that one line decides how fast, how cheap, and how smart the agent is. (It's optional: omit it and the agent inherits the main session's model.) Pick wrong and you either burn budget on trivial work or starve a hard problem of reasoning. This guide gives you a clear decision rubric and concrete per-agent examples so you can match each task to the right tier.

## The three tiers at a glance

Claude ships in three tiers, and Claude Code lets each subagent target one of them:

- **Haiku** — fastest and cheapest. Great for high-volume, mechanical, low-ambiguity work where the answer is mostly lookup or transformation.
- **Sonnet** — the balanced default. Strong general coding, refactoring, and analysis at a sensible cost. When in doubt, this is your pick.
- **Opus** — deepest reasoning. Reserve it for architecture, security review, tricky debugging, and anything where a wrong answer is expensive.

> [!NOTE]
> A subagent is a markdown file in `.claude/agents/` with `name` and `description` (required) plus optional `model`, `color`, and `tools` keys, followed by a system-prompt body. The `model` field is optional and defaults to `inherit` (the main session's model). Skills (`SKILL.md`) and slash commands (`.claude/commands/`, now merged into skills) also accept a `model` field — but theirs is a per-turn override that reverts to the session model on your next prompt, whereas a subagent's `model` pins the tier for that agent.

## A quick decision rubric

Ask these questions in order. The first "yes" usually tells you the tier.

1. **Is the task mechanical and well-specified?** (rename symbols, format files, extract a value, summarize a log) → **Haiku**
2. **Does it involve real code reasoning but within a known pattern?** (write a feature, refactor a module, fix a normal bug, review a PR) → **Sonnet**
3. **Is the cost of a subtle mistake high, or does the problem span many systems?** (design an API, audit auth, reason about a race condition, plan a migration) → **Opus**

If two tiers feel plausible, weigh frequency against stakes. A task that runs hundreds of times a day leans cheaper; a task that runs once but gates a release leans smarter.

## Haiku: fast, cheap, mechanical

Use Haiku when the work is closer to text processing than to engineering. It shines in agents that fire often and need to be snappy.

```markdown
---
name: changelog-formatter
description: Reformats raw commit messages into clean changelog entries.
model: haiku
color: cyan
---

You convert lists of commit messages into Keep a Changelog format.
Group entries under Added, Changed, Fixed, and Removed. Do not
invent changes — only reformat what you are given.
```

Other good Haiku fits: extracting fields from JSON, generating boilerplate test stubs, classifying issues by label, or producing short commit messages. The common thread is that there is little to reason about, just a transformation to apply.

## Sonnet: the balanced default

Sonnet is where most of your agents should live. It handles real codebases, follows multi-step instructions, and produces quality diffs without the cost of Opus.

```markdown
---
name: feature-builder
description: Implements small to medium features across the codebase.
model: sonnet
color: blue
---

You implement features end to end: read the relevant files, write
the code, add tests, and run the linter. Keep changes focused and
match the existing style. Explain any tradeoffs you made.
```

Reach for Sonnet for the bulk of day-to-day work: building features, ordinary debugging, writing tests, reviewing routine pull requests, and refactoring within a single module. If you can't articulate why a task needs Opus, it probably belongs here.

## Opus: deep reasoning for high-stakes work

Opus earns its cost when the problem is genuinely hard or the blast radius of a mistake is large. Architecture, security, and gnarly cross-cutting bugs are its home turf.

```markdown
---
name: security-auditor
description: Audits code for authentication, authorization, and injection flaws.
model: opus
color: red
---

You perform thorough security reviews. Trace untrusted input from
entry point to sink. Flag authn/authz gaps, injection vectors, and
unsafe deserialization. For each finding give severity, impact, and
a concrete fix. Prefer precision over breadth — no false alarms.
```

> [!TIP]
> Don't make Opus your default just because it's the strongest. On simple tasks it costs more and isn't measurably better; on hard tasks the extra reasoning is exactly what you're paying for. Spend it where mistakes are expensive.

Good Opus candidates: designing a public API, planning a database migration, reasoning about concurrency and race conditions, untangling a bug that touches several services, or making framework-level architectural decisions.

## Using `inherit` to follow the main session

If you set `model: inherit`, the subagent runs on whatever model the main Claude Code session is currently using instead of pinning a fixed tier.

```markdown
---
name: codebase-explorer
description: Searches and explains code across the repo.
model: inherit
color: green
---

You answer questions about this codebase by searching files and
reading the relevant ones. Cite absolute paths in your answers.
```

`inherit` is handy for general-purpose helper agents that should "match the room": when you upgrade the main session to a stronger model, these agents come along automatically. Avoid it for agents whose quality depends on a specific tier — a security auditor should pin `opus` so it never silently runs on something weaker.

## Putting it together

A healthy setup usually mixes all three. A typical split looks like:

- **Haiku** for the formatter, the classifier, and the boilerplate generator.
- **Sonnet** for the feature builder, the test writer, and the routine reviewer.
- **Opus** for the architect and the security auditor.

Start every new agent on Sonnet. Drop it to Haiku once you confirm the task is mechanical and you want it cheaper and faster. Promote it to Opus only when you see real reasoning failures or the stakes clearly justify the cost. Let the work — not the prestige of the model — decide the tier, and revisit the choice as each agent's responsibilities evolve.
