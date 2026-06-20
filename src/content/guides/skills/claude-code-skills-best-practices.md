---
title: "Claude Code Skills: Best Practices"
description: "The patterns that make Claude Code skills reliable: trigger-first descriptions, one job per skill, lean bodies, bundled scripts, and scoped tools."
author: "AgentsCamp"
date: 2026-06-20
color: "green"
topics: ["workflow-prompting"]
tags: ["skills", "claude-code", "prompting", "agents", "workflow"]
featured: false
summary: "A skill is reliable when its description fires at the right time, it does one job, its body stays lean, deterministic work lives in bundled scripts, and its tools and boundaries are scoped tight. The description is the single field that matters most: it's the only thing loaded until the skill triggers. Fix triggering there first."
keyTakeaways:
  - "The trigger-first description is the highest-leverage field — it's the only thing loaded until the skill fires, so write it as what it does plus when to use it, in the words people actually type."
  - "One job per skill. An '…and it can also…' branch is a second skill. Narrow skills trigger reliably and stay accurate; kitchen-sink skills fire on the wrong tasks and rot."
  - "Keep the body lean (under 500 lines): once a skill loads it stays in context across turns, so every line is a recurring token cost. Push reference material into separate files."
  - "Move deterministic work into bundled scripts. Ten lines of Python the skill runs beats prose the model interprets — more reliable and it keeps the body short."
  - "Scope allowed-tools to what the procedure runs often, and set explicit boundaries ('do X, never Y'). allowed-tools removes friction; disallowed-tools and permissions actually restrict."
  - "If the capability is really a live integration to an external system, you wanted an MCP server, not a skill. Skills are know-how; MCP servers are connections."
faq:
  - q: "What's the most important part of a Claude Code skill?"
    a: "The description. It's the routing signal and, most of the time, the only field Claude has loaded — the body stays on disk until the description matches the task. A vague description never fires; an over-broad one fires on unrelated work. Write it as what the skill does plus when to use it, using the verbs and nouns people actually type. Fix triggering here before touching anything else."
  - q: "How long should a SKILL.md body be?"
    a: "Lean — keep it under 500 lines, and shorter is better. Once a skill loads, its content stays in your context across turns, so every line is a recurring token cost, not a one-time read. State what to do, not why; cut anything the model already knows; and move large reference material, examples, or specs into separate files the body links to so they load only when a step reaches for them."
  - q: "How do I stop a skill from triggering on the wrong tasks?"
    a: "Tighten the description. If a skill fires when it shouldn't, the description is too broad ('helps with code' will load on nearly everything) — make it name the specific situations that should activate it. If it must only ever run when you type its name, add disable-model-invocation: true so Claude never auto-loads it."
  - q: "When should something be an MCP server instead of a skill?"
    a: "When the capability is a live connection to an external system — a database, a SaaS API, a ticketing tool — that needs real-time data, auth, and structured tool calls. Skills are know-how loaded into context; MCP servers are integrations that expose tools and resources. If you find yourself describing API endpoints and credentials in a SKILL.md, you wanted a server."
  - q: "Does allowed-tools sandbox a skill?"
    a: "No. allowed-tools pre-approves listed tools so Claude can use them without a permission prompt while the skill is active — it removes friction, it doesn't restrict. Every other tool stays callable under your normal permission settings. To actually keep a tool out of a skill's reach, use disallowed-tools, and for a hard block across everything, add deny rules in your permission settings."
related: ["writing-your-first-skill", "skills-vs-agents-vs-commands", "writing-a-custom-agent", "claude-md-best-practices", "skills-vs-mcp-servers", "testing-and-debugging-skills"]
---

You can write a skill that works in five minutes. Writing one that fires when it should, stays quiet when it shouldn't, does exactly one thing, and still works six months from now is a different discipline. The mechanics are easy; the reliability is the craft. This guide is about the craft — the handful of patterns that separate a skill you trust from one you keep re-explaining or quietly disabling.

If you haven't built one yet, start with [Writing Your First Skill](/guides/skills/writing-your-first-skill) — this guide assumes you know what a `SKILL.md` is, where it lives, and how progressive disclosure works, and goes straight to the decisions that make or break it in practice.

## The description is the whole game

Everything else in this guide is a distant second. The `description` is the only field Claude has loaded until the skill fires — the body sits on disk until the description matches the task. So the description is doing two jobs at once: it's documentation, and it's the **routing decision**. Get it wrong and nothing else you wrote ever runs.

Write it as **what the skill does, plus when to use it**, in the third person, leading with the key use case, and naming the concrete situations that should activate it — in the verbs and nouns people actually type:

```yaml
description: >
  Scaffolds a new React component with a colocated test and Storybook
  story following the repo's conventions. Use when the user asks to
  create, add, or generate a new component.
```

The trigger phrases — "create, add, or generate a new component" — are what Claude pattern-matches against the real request. That's the part that fires the skill. Compare it to "Employs a multi-phase component generation strategy," which describes the *mechanism* and matches nothing a user would say. **Front-load the trigger; save the mechanics for the body.**

Two failure modes, two fixes:

- **Never fires.** The description is too vague or written in implementation language. Add the concrete phrases a user would type. If you have a separate `when_to_use` field, that's exactly where extra trigger phrases and example requests go.
- **Fires too often.** The description is too broad. "Helps with code" loads on nearly every request and burns the context budget the skill was supposed to save. Make it specific enough that it stays silent when the task isn't its job.

One more thing worth knowing: descriptions aren't free at scale. Claude Code loads every skill's description into a budget that scales with the model's context window, and when you have many skills installed it **shortens or drops the least-used ones to fit** — which can strip the very keywords a skill needs to trigger. The combined description text is also capped (currently 1,536 characters) in the listing. Two consequences: keep descriptions tight and keyword-dense rather than padded, and if a skill mysteriously stops firing, check whether its description is being truncated (`/doctor` reports this) before you rewrite the body.

## One job per skill

The second-biggest reliability lever is scope. A skill should do **one job**. The moment your body grows an "…and it can also…" branch, that's a signal you have two skills wearing one folder.

Narrow skills win on every axis that matters:

- **They trigger accurately.** A description that promises one thing matches cleanly. A description that promises five things matches fuzzily, firing on tasks it half-fits and missing tasks it should own.
- **They stay correct.** A focused 40-line body is something you can actually re-read and keep accurate. A 400-line everything-skill rots, accumulates quiet contradictions, and nobody audits it.
- **They compose.** Two sharp skills can both fire on a task that needs both. One overloaded skill forces Claude to wade through irrelevant steps every time.

If you already have an overloaded skill, split it along its natural seams. A "release" skill that bumps the version, writes the changelog, tags, and deploys is four skills — and the deploy step in particular should be a deliberate, manually-triggered one (see boundaries, below). Splitting also lets each piece carry its own tight description instead of one description trying to cover four unrelated triggers.

This is the same instinct that keeps a [CLAUDE.md lean](/guides/configuration/claude-md-best-practices) and a [custom agent single-purpose](/guides/getting-started/writing-a-custom-agent): a tool that tries to do everything is reliably good at nothing.

## Keep the body lean

Progressive disclosure makes an *installed* skill cheap — but once a skill **loads**, its body enters the conversation and stays there across turns. It is not a one-time read; it's a recurring token cost on every subsequent turn until the session ends or compacts. A bloated body taxes the entire rest of the task.

So treat the body like a runbook, not an essay:

- **State what to do, not why.** The model doesn't need motivation or background; it needs the steps. Cut every sentence that explains a concept the model already has.
- **Delete prose the model already knows.** "Remember to write clean, maintainable code" is pure waste. "Match the props pattern in `src/components/Button/`" is signal. Spend the body only on what's specific to *this* procedure and *this* repo.
- **Push reference material out.** Large examples, API specs, style guides, lookup tables — these belong in separate files in the skill directory that the body links to, so they load only when a step actually reaches for them. Keep `SKILL.md` under 500 lines; if it's heading past that, you have files to extract or a skill to split.

A good test: read your body and ask, for each line, "would a competent engineer who knows this repo need to be told this?" If no, cut it.

## Push deterministic work into scripts

Anything with a single correct output should be **code the skill runs, not prose the model interprets**. Parsing git log, transforming JSON, validating a schema, generating a file from a template, computing a timestamp — a model can do these by hand, but it does them more slowly, less reliably, and at the cost of context. Ten lines of Python that always produce the same result is strictly better.

Bundle the script in the skill directory and call it by path. Claude Code exposes the skill's directory so scripts are portable:

```markdown
Run `python3 ${CLAUDE_SKILL_DIR}/scripts/format_changelog.py <last-tag>`
to produce the grouped commit list, then fill the template with the result.
```

The convention is a `scripts/` directory for executables, a `references/` directory for docs the model reads, and `assets/` for templates and binaries. Scripts follow the same progressive-disclosure rule as everything else bundled — a 300-line helper costs nothing until a step invokes it. The division of labor is the point: **the script does the deterministic work, Claude handles the orchestration and judgment.** Reserve the model's attention for the parts that genuinely need a model.

## Scope tools, set boundaries

Two kinds of scoping make a skill safe to leave running.

**Scope `allowed-tools` to what the procedure actually runs.** This field pre-approves tools so Claude can use them without a permission prompt while the skill is active — it's about removing friction, not about sandboxing. List only the tools the skill calls often enough that prompting each time would be annoying, and prefer specific grants over blanket ones:

```yaml
allowed-tools: Read, Grep, Glob, Bash(git add *), Bash(git commit *)
```

Be deliberate here: `allowed-tools` is a grant. For project skills checked into a repo, those grants take effect once you trust the workspace — so review a repo's skills before trusting it, the same way you'd review its settings. To genuinely keep a tool out of a skill's reach, use `disallowed-tools`; to block something everywhere, use deny rules in your permission settings. `allowed-tools` widens access without prompting; it never narrows it.

**Set explicit boundaries in the body.** The most reliable skills tell Claude not just what to do but where to stop. State the negative space:

```markdown
Do not run the migration. Creating the file is the whole job.
Do not edit any file outside `migrations/`.
Never write an irreversible migration without flagging it explicitly.
```

A "do X, never Y" boundary is what stops a scaffolding skill from "helpfully" deploying, or a formatting skill from refactoring logic. For consequential, irreversible actions — deploying, publishing, sending — go further: add `disable-model-invocation: true` so the skill can *only* run when you explicitly type its name. You don't want Claude deciding to deploy because the tests happened to pass.

## The anti-patterns

Most unreliable skills are one of these:

- **The vague description.** "Helps with the codebase." It either never fires or fires on everything. This is the number-one reason skills don't work — fix the description before suspecting anything else.
- **The kitchen-sink skill.** One skill that scaffolds, tests, reviews, and deploys. The description can't trigger cleanly, the body is too long to stay correct, and most of it is irrelevant on any given task. Split it.
- **Prose the model already knows.** Bodies padded with "write clean code," "follow best practices," generic explanations of git or REST. It's recurring token cost for zero signal. The model brought that knowledge; spend the body on what's specific to *you*.
- **The skill that should have been a script.** A SKILL.md walking the model step-by-step through deterministic string-munging it gets wrong half the time. If the output is deterministic, write the script.
- **The skill that should have been an MCP server.** This is the subtle one. If your "skill" is really about connecting to an external system — querying a live database, hitting a SaaS API, reading from a ticketing tool — with credentials, real-time data, and structured tool calls, you don't want a skill. **Skills are know-how loaded into context; MCP servers are live integrations that expose tools and resources.** A SKILL.md describing API endpoints and how to authenticate is a server wearing the wrong costume. See [Skills vs MCP Servers](/guides/skills/skills-vs-mcp-servers) for where the line actually falls.

## Test it like you mean it

A skill isn't done when it parses — it's done when you've confirmed it fires and improves the result. The honest test is a **baseline comparison**: collect a few realistic prompts, run each in a *fresh* session with the skill available, then run them again with the skill disabled, and compare. The fresh session matters — leftover context from authoring the skill will paper over gaps in what you actually wrote down, making a skill look like it works when it only works because you primed it.

Watch for both failure directions: prompts that *should* trigger the skill but don't (description too narrow or wrong keywords), and prompts that *shouldn't* but do (description too broad). [Testing and Debugging Skills](/guides/skills/testing-and-debugging-skills) covers the full loop, including what to do when a skill loads but stops influencing behavior partway through a task.

## Putting it together

The order of operations when a skill misbehaves is almost always the same. Doesn't fire? The description. Fires on the wrong tasks? The description. Fires but does too much or drifts? The body is too long or the scope too wide — split it and trim it. Gets a deterministic step wrong? Move that step into a script. Wants to reach for the wrong tool, or stops where it shouldn't? Scope `allowed-tools` and write the boundary.

A reliable skill is small: a sharp trigger-first description, one job, a lean body, scripts for the deterministic parts, the minimum tools, and an explicit "never." Build it that way and it earns a permanent spot in your toolkit instead of becoming the next thing you disable. For where skills sit alongside agents and commands, see [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands).
