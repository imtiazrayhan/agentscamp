---
title: "CLAUDE.md Best Practices"
description: "How to write a CLAUDE.md that actually helps — what to include, what to leave out, and how to keep it current."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting"]
featured: false
related: ["what-is-claude-code", "context-engineering"]
summary: "CLAUDE.md loads into context on every turn, so it should read like onboarding for a fast new engineer: exact build/test commands, conventions a linter can't enforce, a few-line architecture map, and the gotchas that have burned someone — and nothing the model already knows. Target under 200 lines, split by scope, and update it in the same PR that changes reality."
keyTakeaways:
  - "The filter for every line: would a sharp engineer get this wrong on their first day despite reading the code? If the code makes it obvious, cut it."
  - "Four categories carry the value: exact commands (with the non-obvious flags), conventions no linter enforces, a terse architecture map, and the landmines."
  - "Length is a recurring cost — the file loads on every turn. Target under 200 lines; terse bullets and fenced commands beat prose."
  - "Three scopes: the committed project file (true for the team), CLAUDE.local.md (true for you, here), ~/.claude/CLAUDE.md (true for you, everywhere) — plus nested files, .claude/rules/, and @path imports for big repos."
  - "Stale is worse than missing: update CLAUDE.md in the same PR that changes the command it documents, and prune on a cadence."
faq:
  - q: "What is CLAUDE.md?"
    a: "The Markdown file Claude Code automatically loads into context at the start of every session — persistent project memory for the durable facts about a codebase: how to build and test it, the conventions that matter, where things live, and what not to touch. It's the highest-leverage configuration file in a Claude Code setup."
  - q: "What should I put in CLAUDE.md?"
    a: "Four things: exact build/test/run commands including non-obvious flags; project conventions a linter can't enforce; a few-line architecture map so Claude reads the right files instead of grepping; and the gotchas that have burned someone before. Leave out anything the model already knows or the code makes obvious."
  - q: "How long should CLAUDE.md be?"
    a: "Anthropic recommends targeting under 200 lines, and a tight, high-signal file lands well under that. The file loads on every turn, so a 600-line CLAUDE.md isn't 600 lines of help — it's 600 lines competing for attention against the actual task, every single response."
  - q: "What's the difference between CLAUDE.md, CLAUDE.local.md, and ~/.claude/CLAUDE.md?"
    a: "Scope. The project CLAUDE.md is committed and shared — team conventions, commands, gotchas. CLAUDE.local.md is gitignored and personal to you in this project — local paths, machine-specific notes. ~/.claude/CLAUDE.md follows you across every project — your personal style rules. Team-true → committed; you-everywhere → user file; you-here → local."
  - q: "Can I put secrets in CLAUDE.md?"
    a: "Never. It's committed to version control and loaded verbatim into model context every session — treat it as fully public. Document how secrets are loaded (.env.local, your secrets manager), never the values themselves."
---

`CLAUDE.md` is the one file Claude Code reads automatically on every session, before you've typed a word. That makes it the highest-leverage configuration you own — and the easiest to get wrong. A tight `CLAUDE.md` saves you from re-explaining the build command, the test runner, and the one migration gotcha that breaks production. A bloated one quietly taxes every single turn, burning context budget on instructions the model either already knew or didn't need yet.

This guide is about writing the version that earns its place: what to put in, what to ruthlessly leave out, where memory lives, and how to stop it from rotting.

## What CLAUDE.md is for

When Claude Code starts in a repo, it loads `CLAUDE.md` from the project root (and any parent directories) into context automatically. It is persistent project memory — the durable facts about *this* codebase that you'd otherwise repeat in prompt after prompt.

The mental model that keeps it useful: **CLAUDE.md is onboarding for a fast new engineer who already knows how to code.** You don't teach them React. You tell them this repo uses `pnpm` not `npm`, that tests run with `vitest --run`, and that the `legacy/` directory is frozen and must not be touched. Everything that passes that filter belongs; everything that fails it is noise.

> [!NOTE]
> CLAUDE.md is not a prompt you fire once — it loads on *every* turn for the whole session. A 600-line file isn't 600 lines of help; it's 600 lines competing for attention against the actual task on every single response. See [Context Engineering](/guides/prompting/context-engineering) for why that competition is real.

## What to include

Aim for the things Claude cannot reliably infer from the code in the first thirty seconds and will need constantly. Four categories cover most of it.

**Build, test, and run commands.** The exact invocations, including the non-obvious flags. This is the single highest-value thing in the file, because Claude runs these constantly and guessing wastes a turn each time.

```markdown
## Commands
- `pnpm dev` — dev server on :3000 (Turbopack)
- `pnpm test` — vitest, watch mode; use `pnpm test --run` in CI / one-shot
- `pnpm typecheck` — tsc --noEmit, run before every commit
- `pnpm db:migrate` — apply Prisma migrations (NEVER edit applied migration files)
```

**Project conventions** that aren't enforced by a linter. If ESLint or Prettier already catches it, leave it out — the tooling is the source of truth. Document the human conventions a formatter can't see: "API routes return `Response.json`, never `NextResponse`," "all dates stored as UTC ISO strings," "feature flags live in `src/flags.ts`, not env vars."

**An architecture map** — a few lines that orient, not a textbook. Where the important things live and how data flows, so Claude reads the right two files instead of grepping the whole tree.

```markdown
## Architecture
- `src/app/` — Next.js App Router pages (all Server Components, SSG)
- `src/lib/db/` — Prisma client + query helpers; the ONLY place that imports `@prisma/client`
- `src/lib/auth/` — session logic; `getSession()` is the entry point
- Data flow: Server Component → query helper → Prisma → Postgres. No client-side DB access.
```

**Gotchas and landmines** — the things that have burned someone before. This is where `CLAUDE.md` pays for itself. "Migrations are irreversible in prod; never `db:reset` against a real DB." "The `staging` branch auto-deploys on push." "`utils/legacy.ts` is used by the billing cron — do not refactor."

> [!TIP]
> A good test for any line: would a sharp engineer get this wrong on their first day *despite* reading the code? If yes, it belongs. If the code makes it obvious, cut it.

## Keep it tight

Because the file loads every session, length is a recurring cost, not a one-time one. The discipline is the same as writing a good system prompt: spend tokens only on what's specific and load-bearing.

| Symptom | Fix |
|---------|-----|
| File is over ~200 lines | You're documenting, not orienting. Anthropic recommends targeting under 200 lines per file; in practice a tight, high-signal one stays well under that. Cut to the durable essentials. |
| A section restates the README | Link to it instead of duplicating; the README can drift independently. |
| Paragraphs of prose | Convert to terse bullets and command blocks — Claude parses them faster and so do you. |
| "Remember to always..." lists | Keep only the non-obvious rules; drop generic best-practice reminders. |

Terse beats prose. `pnpm test --run` in a code block is worth more than a sentence explaining how testing works. Bullets and fenced commands are denser and less ambiguous than paragraphs.

## Project-level vs. user-level memory

Claude Code reads from more than one place, and putting a fact in the wrong scope either leaks your preferences into a shared repo or fails to follow you between projects.

| Location | Scope | Put here |
|----------|-------|----------|
| `./CLAUDE.md` or `./.claude/CLAUDE.md` | This project, **committed and shared** | Build commands, architecture, team conventions, gotchas |
| `./CLAUDE.local.md` | This project, **yours only** (gitignored) | Local paths, personal scratch notes, machine-specific setup |
| `~/.claude/CLAUDE.md` | **Every** project you work on | Your personal style: "prefer named exports," "always run typecheck before committing" |

The rule of thumb: if it's true for everyone on the team, it goes in the committed project file. If it's true for *you* everywhere, it goes in user memory. If it's true for you *only here*, it goes in the local file.

> [!TIP]
> You can nest `CLAUDE.md` files in subdirectories. A `CLAUDE.md` inside `packages/api/` loads when Claude is working in that package — ideal for a monorepo where each package has its own commands and conventions, keeping the root file lean. For large repos you have two more tools: move file-type-specific instructions into `.claude/rules/` (path-scoped rules loaded only when Claude works with matching files), and use `@path` imports to break the file into focused modules without changing load behavior.

> [!NOTE]
> `CLAUDE.local.md` lives only in the worktree where you created it — it doesn't follow you across git worktrees of the same repo. To share personal notes across worktrees, import a home-directory file instead: `@~/.claude/my-project-notes.md`.

## What NOT to put in it

What you leave out matters as much as what you include. Every line that doesn't earn its place is dead weight loaded on every turn.

- **Things the model already knows.** Don't explain what React hooks are, how Git works, or what REST means. Claude knows. "Write clean code" and "be helpful" are worse than useless — they consume attention and signal nothing.
- **Secrets.** No API keys, tokens, connection strings, or passwords. `CLAUDE.md` is committed and read into context; treat it as fully public. Point at how secrets are *loaded* (`.env.local`, your secrets manager), never the values.
- **Churny detail.** Anything that changes weekly — the current sprint goal, a list of open tickets, today's deploy status — rots immediately and is wrong more often than right. Durable facts only.
- **Full API/type documentation.** Claude can read the types from source on demand. Re-pasting a 200-line interface into memory just to have it loaded every turn is the exact anti-pattern context engineering warns about.
- **Anything the linter enforces.** If `eslint` or `prettier` already rejects it, documenting it duplicates a rule that can drift out of sync.

> [!WARNING]
> Never paste credentials, internal URLs you wouldn't post publicly, or customer data into `CLAUDE.md`. It lives in version control and is loaded verbatim into the model's context every session. Anything in it is effectively shared with everyone who can see the repo.

## Keep it current

A stale `CLAUDE.md` is worse than none: it actively misleads. If it says `npm test` but the project moved to `pnpm`, Claude confidently runs the wrong command and you debug a problem you created.

Keep it honest with a few habits:

- **Update it in the same PR that changes reality.** Renamed the test command, moved a module, added a deploy gotcha? Touch `CLAUDE.md` in the same diff. Treat it like code, because it is.
- **Let Claude maintain it.** The `/init` command bootstraps a `CLAUDE.md` by scanning the codebase, and you can ask Claude directly: *"Update CLAUDE.md — we switched from Jest to Vitest and the test command is now `pnpm test`."* It edits the file like any other.
- **Prune on a cadence.** Every month or two, re-read it top to bottom and delete anything no longer true or no longer needed. Files grow by accretion; only deliberate cutting keeps them tight.

## A compact skeleton

Anthropic recommends targeting under 200 lines per `CLAUDE.md`; in practice a tight, high-signal file lands well under that. Here's a complete skeleton you can adapt — note how much it accomplishes in how little space:

```markdown
# Acme API

Node/TypeScript service backing the Acme mobile app. Postgres + Prisma.

## Commands
- `pnpm dev` — local server on :4000
- `pnpm test --run` — vitest one-shot (watch mode is default; use --run in CI)
- `pnpm typecheck` — run before every commit
- `pnpm db:migrate` — apply migrations (NEVER edit an applied migration file)

## Architecture
- `src/routes/` — Express handlers, one file per resource
- `src/services/` — business logic; routes are thin, services do the work
- `src/db/` — Prisma client + queries; the only place that touches the DB
- Flow: route → service → db helper → Postgres

## Conventions
- Validate every request body with a Zod schema before use
- Money is stored in integer cents, never floats
- All timestamps are UTC ISO strings
- Secrets load from `.env` via `src/config.ts` — never hard-code them

## Gotchas
- `staging` branch auto-deploys on push
- The nightly `reconcile` cron depends on `src/services/billing.ts` — refactor with care
- `db:reset` wipes data; it is forbidden against any non-local database
```

That file tells Claude how to build, test, and run; where logic lives; which conventions a linter can't catch; and which three things will hurt if it gets them wrong — and nothing more. That's the bar. If your `CLAUDE.md` does that and stays current, it will quietly make every session better; if it tries to do more, it starts charging rent on every turn for help no one asked for.
