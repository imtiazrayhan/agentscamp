---
title: "Skills vs Agents vs Commands"
description: "How Claude Code's two extension mechanisms — subagents and skills — differ across three invocation patterns, with a decision table for choosing the right one."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting"]
related: ["guide:what-are-claude-skills", "guide:writing-a-custom-agent", "guide:writing-your-first-skill", "guide:getting-started-with-agents", "guide:claude-code-plugins"]
featured: false
summary: "Two mechanisms, three patterns: a subagent is a delegate Claude routes to (own context window, own tools); a skill is on-demand knowledge loaded into the main context when the task matches; a slash command is just a skill with disable-model-invocation: true, so you pull the trigger. Decide on two axes — who invokes it, and whether the work needs an isolated context."
keyTakeaways:
  - "Custom commands merged into skills: .claude/commands/*.md still works as legacy, but .claude/skills/<name>/SKILL.md is canonical, and every skill is invocable as /<name>."
  - "A subagent is a worker with isolation; a skill is knowledge in your main context; a 'slash command' is a skill you trigger by name."
  - "The fastest filter is who pulls the trigger — you (command) or Claude (agent/skill). The second is isolation: only subagents get their own context window by default."
  - "Noisy middle, clean summary → subagent. 'The way we do X here' recipe → skill. A prompt you retype → slash command."
  - "The classic mistake: building a subagent for something you always invoke yourself — the isolation buys nothing and the auto-delegation never fires. You wanted a command."
faq:
  - q: "What's the difference between a skill and a subagent in Claude Code?"
    a: "A subagent is a separate worker: Claude delegates to it based on its description, it runs in its own context window with its own toolset, and only a summary comes back. A skill is knowledge: it loads into the main context when the task matches and shapes how Claude does the work directly. Worker vs. know-how, isolated vs. in-context."
  - q: "Are slash commands deprecated?"
    a: "Merged, not dead. .claude/commands/*.md files still work as a legacy path, but skills are the canonical mechanism — any .claude/skills/<name>/SKILL.md is invocable as /<name>, and adding disable-model-invocation: true makes it fire only when you type it, which is exactly the old slash-command behavior plus support for bundled files and arguments."
  - q: "When should I use a subagent instead of a skill?"
    a: "When the work has a noisy middle and a clean summary — running a test suite, sweeping logs, auditing files. The subagent churns through hundreds of lines in its own window and hands back three sentences. If you're really just teaching Claude a procedure and don't need isolation, that's a skill (which can still opt into a forked context with context: fork)."
  - q: "How do I make a skill run only when I type it?"
    a: "Set disable-model-invocation: true in its frontmatter. Without it, Claude may auto-load the skill whenever it judges the task relevant; with it, the skill fires only on its /name. Skills also take arguments — $0 for the first (substitution is 0-indexed), $ARGUMENTS for all — plus an argument-hint, which makes them feel like CLI subcommands for your repo."
---

Claude Code really has **two** extension mechanisms, and they get conflated constantly because all three patterns are Markdown-based with YAML frontmatter (a skill is a folder whose `SKILL.md` carries the frontmatter, and can bundle supporting scripts and templates alongside it). But they answer three different questions. A **subagent** answers "who should Claude hand this off to?" A **skill** answers "what does Claude need to know to do this well?" A **skill invoked as a slash command** answers "what do I want to type to kick this off?" Pick the wrong one and you end up fighting the tool — a skill that never loads, an agent that never gets delegated to, a command nobody remembers exists.

> [!NOTE]
> Custom commands have been merged into skills. `.claude/commands/*.md` files still work as a legacy path, but `.claude/skills/<name>/SKILL.md` is now canonical. Invoke any skill with `/<name>`; set `disable-model-invocation: true` to prevent Claude from auto-loading it. So when this guide talks about a "slash command," it means a skill you trigger by name rather than a separate file type.

This guide draws the lines clearly, gives you a decision table, and walks through real "I want to..." cases so you reach for the right one on the first try.

## Two mechanisms, three invocation patterns

Everything lives under `.claude/` (project-local) or `~/.claude/` (personal, follows you everywhere). There are two real mechanisms — subagents and skills — and the third "slash command" pattern is just a skill you trigger by name.

```text
.claude/
├── agents/                  # subagents — isolated delegates Claude calls on its own
│   └── code-reviewer.md
├── skills/                  # skills — auto-loaded knowledge OR user-invoked /commands
│   ├── changelog/SKILL.md   # auto-loads when relevant
│   └── ship/SKILL.md        # disable-model-invocation: true → only fires on /ship
└── commands/                # legacy slash commands — still work, but skills are canonical
    └── ship.md
```

The crucial difference is **who pulls the trigger** and **where the work runs**.

- A **subagent** is a delegate. Claude decides, mid-task, that a chunk of work belongs to a specialist and hands it off. The subagent runs in its *own* context window with its *own* toolset and returns a summary. You don't invoke it directly; Claude routes to it based on its `description`.
- A **skill** is reusable expertise. It sits dormant until Claude notices the current task matches it, then loads its instructions into the *main* context to inform how Claude does the work. It's knowledge-on-demand, not a separate worker.
- A **skill invoked as a slash command** is that same mechanism, flipped to manual. Typing `/ship` expands a skill into the conversation as if you'd pasted it. It runs in your main context. The only difference from an auto-loaded skill is `disable-model-invocation: true`, which stops Claude from firing it on its own — so the trigger is always you.

> [!NOTE]
> "Skill" overloads two meanings. There are first-party Claude Code skills and Agent Skills (`SKILL.md` packages with optional scripts and resources). In both cases the defining trait is the same: Claude loads them *on demand when relevant*, rather than you invoking them or Claude spawning them as a separate worker.

## The decision table

| | Who invokes it | Own context window | Restricted tools | Typical use |
|---|---|---|---|---|
| **Subagent** | Claude (auto-delegated) | Yes — isolated | Yes (`tools:` field) | Hand off a self-contained job: review a diff, investigate a failing test, audit a file |
| **Skill** | Claude (loaded on match) | No (by default) — runs in main context | Optional (`allowed-tools:`) | Reusable procedure or domain knowledge: write a changelog, follow a house migration recipe |
| **Slash command** (a skill) | You (typed by name) | No (by default) — runs in main context | Optional (`allowed-tools:`) | A skill you run often and want by keystroke: `/ship`, `/review-pr`, `/scaffold` |

Read the table top to bottom on a single axis at a time. The **invocation** column is the fastest filter: if *you* want to be the one to press the button, it's a command. The **context** column is the next: only subagents get isolation, which is what makes them the right tool when a task would otherwise flood your main window with noise.

## When to reach for a subagent

Choose a subagent when the work is a **self-contained job with a noisy middle and a clean summary** — and you want Claude to decide when to run it.

The isolated context window is the whole point. A subagent that runs the test suite can churn through hundreds of lines of failing output, then hand back just "three tests fail, all from the same null-check in `parseDate()`." Your main thread never sees the logs. That's also why subagents are right for parallel fan-out: Claude can dispatch several at once without their transcripts colliding.

```markdown
---
name: test-runner
description: Runs the test suite and summarizes failures with root causes. Use after code changes or when a test is reported failing.
model: sonnet
tools: Read, Grep, Glob, Bash
---

You run the project's tests, read failing output, and report each
failure as: file, failing assertion, and most likely cause.
Do not fix code unless explicitly asked.
```

The `description` is the routing signal — it's how Claude decides to delegate, so write it in terms of *when to use this agent* with concrete triggers. Scope `tools` to the minimum the job needs; a read-only reviewer physically cannot edit your code.

> [!TIP]
> If a task would dump a lot of intermediate output you don't care about — build logs, grep sweeps, large file scans — that's the tell for a subagent. The isolation keeps your main context lean for the work that matters.

## When to reach for a skill

Choose a skill when there's a **repeatable procedure or body of knowledge** that should shape how Claude works, but only *when the task actually calls for it*.

The defining trait is on-demand loading. A skill's instructions don't sit in your context burning tokens every session — Claude pulls them in only when the current task matches the skill's `description`. That makes skills the right home for "the way we do X here" recipes: generating a release changelog, scaffolding a component to house conventions, following a specific data-migration playbook.

```markdown
---
name: changelog
description: Generate a release changelog from merged PRs since the last tag, grouped by type, following our house format.
allowed-tools: Bash, Read
---

When asked to write a changelog:
1. Find the last release tag with `git describe --tags --abbrev=0`.
2. List merged PRs since that tag.
3. Group entries under Added / Changed / Fixed and link each PR.
```

A skill differs from a subagent in two ways that decide between them: it runs in your **main context** (no isolation — Claude uses the loaded steps directly), and it's **knowledge, not a worker**. If you don't need a separate context window and you're really just teaching Claude a procedure, it's a skill.

A skill can opt into isolation with `context: fork` in its frontmatter, which executes it in a forked subagent — useful when a skill's work would otherwise flood your main thread. That blurs the line a little, but the default and common case is main-context execution; reach for a full subagent when isolation is the *point*, not an afterthought.

> [!NOTE]
> Skills can ship more than text — an Agent Skill can bundle scripts and resource files alongside `SKILL.md`. Reach for that when the procedure needs deterministic helpers (a formatter, a generator) rather than instructions alone.

## When to reach for a slash command

Choose this pattern — a skill you only ever trigger by name — when **you** want to be the one who pulls the trigger, and it's a prompt you'd otherwise retype.

There's no autonomy and no isolation here — it's a saved prompt that happens to live in a skill. Typing `/ship` drops the skill's contents into the conversation. That's exactly what you want for deliberate, you-initiated workflows: the multi-step sequence you run before every PR, the scaffolding prompt you fire at the start of a feature, the review checklist you want on demand rather than whenever Claude guesses you want it. The one frontmatter flag that makes it user-only is `disable-model-invocation: true`.

```markdown
---
description: Open a PR — summarize the diff, draft a title and body, push and create it.
argument-hint: [base-branch]
allowed-tools: Bash, Read
disable-model-invocation: true
---

1. Run `git diff $0...HEAD` and summarize the changes.
2. Draft a PR title (imperative) and a body with a Summary and Test plan.
3. Push the branch and open the PR with `gh pr create`.
```

Skills accept arguments (`$0` for the first argument, `$1` for the second, or `$ARGUMENTS` for all arguments as a single string) and an `argument-hint`, which makes them feel like CLI subcommands for your repo. Note the substitution is **0-indexed**: `$0` is the first argument, so a single-argument `argument-hint: [base-branch]` lands in `$0`, not `$1`. The decision between a user-triggered command and an auto-loaded skill comes down to invocation: if you want to *type the name yourself*, set `disable-model-invocation: true`; if you want Claude to *reach for it automatically* when the task fits, leave it off.

> [!NOTE]
> Add `disable-model-invocation: true` to any skill you only want to run on your explicit trigger — otherwise Claude may auto-invoke it when it judges the task relevant, and the "saved prompt I fire myself" behavior won't hold.

> [!TIP]
> Same procedure, different trigger? You can have both. Encode the steps once as a skill so Claude applies them when relevant, and add a thin slash command that says "run the changelog skill now" for when you want to force it.

## Worked examples: "I want to..."

**"I want Claude to review every diff for bugs before I merge — without me asking each time."**
That's a **subagent**. The work is a self-contained job, it benefits from isolation (the review reasoning stays out of your main thread), and you want *Claude* to delegate to it automatically when a diff appears. Give it a sharp `description` with trigger examples and a read-only toolset.

**"I want changelogs to always follow our exact house format, whenever one gets written."**
That's a **skill**. It's a reusable procedure that should shape how Claude works *when the task comes up* — no separate context needed, and you don't want to type a command every time. Claude loads it on demand whenever a changelog is in play.

**"I want to type one thing before every PR that summarizes the diff, drafts the description, and opens the PR."**
That's a **slash command** — i.e. a skill with `disable-model-invocation: true`. *You* are the trigger, it runs in your main context, and it's a fixed prompt you fire repeatedly. `/create-pr [base]` and you're done.

> [!WARNING]
> The classic mistake is building a subagent for something you always invoke yourself. If you're the one deciding when it runs every single time, the isolation buys you nothing and the auto-delegation never fires — you wanted a slash command. Conversely, don't cram a noisy, self-contained investigation into a command; without its own context window it floods your main thread.

## Putting it together

Map the request to the question it answers. *Who pulls the trigger* — you (command) or Claude (agent/skill)? *Does it need its own context window* — yes (agent) or no (skill/command)? *Is it knowledge that shapes the work, or a worker that goes off and does the work* — skill or agent?

The three compose well. A slash command can lay out a sequence that delegates a noisy step to a subagent and leans on a skill for house conventions along the way. Start with the one that fixes your most repeated friction — usually a slash command for a workflow you retype, or a subagent for a task that keeps drowning your context — then layer the others as your setup matures.

## Continue exploring

- [Create Slash Command](/commands/workflow/create-slash-command) — Scaffold a new Claude Code slash command into .claude/commands/ — a valid Markdown file with frontmatter, a least-privilege allowed-tools allowlist, and a $ARGUMENTS-driven…
