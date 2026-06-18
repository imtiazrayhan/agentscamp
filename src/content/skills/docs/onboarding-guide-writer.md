---
name: "onboarding-guide-writer"
title: "Onboarding Guide Writer"
description: "Write a developer onboarding guide that gets a new contributor from clone to first merged change fast — a verified golden path, a quick architecture map, the real workflow conventions, and the gotchas that live only in senior engineers' heads. Use when a repo has no onboarding doc, when new hires keep asking the same setup questions, or when the README is a marketing page instead of a contributor guide."
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["workflow-prompting"]
related: ["readme-generator", "runbook-writer", "adr-writer"]
featured: false
summary: "A skill that writes a developer onboarding guide grounded in the real repo: a verified golden path from clone to first merged change, a brief architecture orientation, the actual branch/PR/CI conventions, and the gotchas that live in senior engineers' heads — linking to deeper docs instead of duplicating them so it doesn't rot."
---

Write the doc a new contributor opens on day one and uses to ship their first change by lunch. The center of gravity is the **golden path**: the exact, copy-pasteable sequence from `git clone` to a trivial verified change — every command grounded in the repo's real scripts and tooling, not invented `make` targets. Around it sit a quick architecture map (where to look, not a spec), the workflow conventions that gate a PR, and the troubleshooting that currently lives only in tribal knowledge. Deeper material is linked, never duplicated, so the guide stays true as the code moves.

## When to use this skill

- A repo has no onboarding/CONTRIBUTING doc and new contributors reverse-engineer setup from CI configs and Slack threads.
- New hires repeatedly ask the same setup questions (which Node version, what env vars, why does the build fail the first time).
- The README is marketing prose — what the product does — rather than how a developer runs and contributes to it.
- Onboarding currently means a senior engineer pairing for two hours to get someone to a passing test suite.

## Instructions

1. **Reconstruct the golden path from real tooling — verify every command exists.** Read the manifest that exists (`package.json` scripts/`engines`, `Makefile` targets, `pyproject.toml`, `go.mod`, `Justfile`, `Taskfile.yml`) and the lockfile to pick the package manager. Read CI config (`.github/workflows/*.yml`, `.gitlab-ci.yml`) — CI is the ground truth for the steps that actually pass. Build the path in execution order: clone → install deps → set up env/config → run locally → run tests → make a trivial change and verify it. Quote each command verbatim from a script that exists; if a step has no backing script, say so explicitly rather than inventing one.
2. **Surface the prerequisites a fresh machine actually needs.** Pin the runtime version (from `engines`, `.nvmrc`, `.tool-versions`, `go.mod`, `python_requires`) and any system deps (a database, Docker, a specific package manager). List them before the install step — a clone that fails on a missing Postgres is the most common day-one wall.
3. **Handle env and config concretely.** Find `.env.example` / `.env.sample` / `config.example.*`. Tell the contributor to copy it (`cp .env.example .env`) and call out which variables must be filled to run locally versus which have working defaults. Name the ones that need a secret or a teammate to provide — that is the question that otherwise hits Slack.
4. **Prove the setup with a trivial verified change.** End the golden path with a concrete, reversible first change — flip a string, add a log line, fix a typo — then the exact command that confirms it (the dev server reloads, a test passes, the page shows the new text). This is what turns "I think it's set up" into "it works." Don't skip it: it's the difference between an install guide and an onboarding guide.
5. **Write a brief architecture orientation — a map, not a spec.** Glob the top-level layout and name where the entry points are, how the main pieces fit (request → handler → data, or CLI → command → core), and where a newcomer should look first for a given task. Then list the **3–5 things that would surprise a newcomer**: the non-obvious build step, the directory that isn't what its name implies, the generated file you must never hand-edit. Keep it to a screen; point to deeper design docs for the rest.
6. **Document the real workflow conventions.** Extract them from evidence, not assumption: branch naming (from existing branches / contributing notes), commit and PR style (from `.gitmessage`, PR template, recent history), how to run lint and typecheck (the real script names), and how CI gates a PR (which checks are required, from the workflow files). A contributor needs to know what will block their merge before they open the PR, not after.
7. **Capture the tribal-knowledge gotchas and troubleshooting.** Write down the fixes that live in senior engineers' heads: the first build that fails until you run a generate step, the test that's flaky on certain OSes, the port that conflicts, the cache you clear when things go weird. Format as symptom → fix so a stuck contributor can scan to their error.
8. **Link to deeper docs instead of duplicating them.** For anything with a canonical home — full architecture docs, API reference, ADRs, deployment runbooks — link to it in one line. Duplicated detail is detail that will silently go stale; a link stays correct or visibly 404s.
9. **Order for action and skim.** Golden path first (it's what they need in the next five minutes), then architecture, conventions, troubleshooting, links. Lead each section with the action. Save it as `CONTRIBUTING.md` or `docs/onboarding.md` per the repo's convention, and report which commands you verified against real scripts and which you flagged as unverified.

> [!WARNING]
> An onboarding guide whose setup commands don't actually work is worse than no guide — it burns the new contributor's trust on day one and makes them distrust every other line in the doc. Verify each command against a script that exists in the repo. Never paste a `make dev` or `npm run setup` you haven't confirmed.

> [!WARNING]
> Do not re-explain the architecture in depth here. Detailed design that belongs in code comments, ADRs, or a design doc is guaranteed to drift once it's copied into onboarding. Give the orientation map and link to the canonical source.

## Output

A drop-in `CONTRIBUTING.md` (or `docs/onboarding.md`), structured for action:

````md
# Contributing

## Golden path: clone → first change

**Prerequisites:** Node 20 (`.nvmrc`), pnpm 9, Docker (for the local DB).

```bash
git clone git@github.com:acme/taskflow.git && cd taskflow
pnpm install                 # lockfile: pnpm-lock.yaml
cp .env.example .env         # fill DATABASE_URL — ask #eng for the dev value
docker compose up -d db      # local Postgres on :5432
pnpm db:migrate              # apply schema
pnpm dev                     # http://localhost:3000
pnpm test                    # vitest — should be all green before you start
```

**Your first change:** edit the heading in `src/app/page.tsx`, save —
the dev server hot-reloads and the new text shows at `localhost:3000`.
That confirms your setup end to end.

## How the code fits
- Entry points: `src/app/` (routes), `src/server/` (API handlers), `prisma/` (schema).
- Flow: route → handler in `src/server/` → Prisma → Postgres.
- Surprises for newcomers:
  - `pnpm db:generate` must run after editing `prisma/schema.prisma` — the client is generated, never hand-edited.
  - `src/lib/legacy/` is frozen; new code goes in `src/lib/`.
  - The first `pnpm build` after install fails unless `pnpm db:generate` has run.

## Workflow
- Branch: `feat/<short-desc>` or `fix/<short-desc>` off `main`.
- Commits: Conventional Commits (`.gitmessage`); PRs use the template.
- Before pushing: `pnpm lint && pnpm typecheck`.
- CI gates merge on: lint, typecheck, `vitest`, and a preview deploy.

## Troubleshooting
- `ECONNREFUSED 5432` → `docker compose up -d db` isn't running.
- `Prisma client not generated` → `pnpm db:generate`.
- Port 3000 in use → `pnpm dev -- --port 3001`.

## Deeper docs
- Architecture & design decisions → `docs/architecture.md`, `docs/adr/`
- Deploy & on-call → `docs/runbooks/`
````

Every command above is quoted from a real script; the report lists exactly which were verified against the repo and which (if any) were flagged unverified for the maintainer to confirm.
