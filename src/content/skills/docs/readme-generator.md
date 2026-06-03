---
name: "readme-generator"
description: "Generate or refresh a project README grounded in the actual repository. Use when a project has no README, a stale one, or you want install/usage/scripts/structure sections that match the real code."
date: 2026-06-03
allowed-tools: "Read, Grep, Glob, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["workflow-prompting"]
related: ["documentation-engineer", "openapi-doc-writer"]
featured: false
---

Produce a `README.md` that reflects what the repository actually contains — not a generic template. The skill detects the stack, build tooling, runnable scripts, entry points, and directory layout by reading real manifest files, then assembles a title, a one-line plus short description, and install / usage / scripts / project-structure sections. Every command it prints is one the project can actually run, so a new contributor can clone, install, and start without guessing.

## When to use this skill

- A project has no README, or an outdated one that no longer matches the code.
- You want install and usage instructions derived from the real `package.json` / `Makefile` / `pyproject.toml`, not boilerplate.
- You need a consistent, scannable README with the standard sections (install, usage, scripts, structure) in one pass.

> [!WARNING]
> Never invent features, flags, or commands. If a script, entry point, or env var is not in the repo, it does not go in the README. When something is genuinely unknown (license, deploy target), insert a clearly marked `<!-- TODO -->` rather than fabricating it.

## Instructions

1. **Locate the project root and existing README.** Glob for `README*` at the root. If one exists, read it — preserve hand-written prose (project purpose, badges, screenshots, license) and only regenerate the mechanical sections. Treat the code as the source of truth where they disagree.
2. **Detect the stack — do not guess.** Read the manifest that exists rather than assuming:
   - Node/TS: `package.json` (name, description, `scripts`, `bin`, `type`, `engines`), plus `tsconfig.json`, lockfile (`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` / `bun.lock` / `bun.lockb`) to pick the right package manager.
   - Python: `pyproject.toml` / `setup.py` / `requirements.txt`.
   - Go: `go.mod`. Rust: `Cargo.toml`. Make-driven: `Makefile` targets.
   Frameworks: infer from dependencies (`next`, `react`, `fastapi`, `express`) — do not claim a framework that isn't a dependency.
3. **Extract install and usage facts.** Map the detected manager to the install command (`npm install`, `pnpm install`, `pip install -e .`, `cargo build`). Find the entry point (`main`/`bin` in `package.json`, `cmd/` in Go, `__main__.py`). Pull the dev/start/build commands straight from `scripts` or `Makefile` targets — quote them verbatim.
4. **Map the structure.** Glob the top-level directories and a shallow level below, ignoring `node_modules`, `.git`, `dist`, `build`, and `.next`. Annotate each meaningful directory with one short phrase describing what lives there, based on what you actually find.
5. **Assemble the README.** Write `README.md` with: an `#` H1 title (from manifest `name`), a one-line tagline, a short paragraph, then `## Installation`, `## Usage`, `## Scripts` (a table of every script + its command), and `## Project structure` (a fenced tree). Keep it scannable; prefer fenced code blocks over prose for commands.
6. **Verify against the repo.** Re-check that every script in the table exists in the manifest and every path in the tree exists on disk. Run `npm run` (or `make`) to confirm the script list matches, if available.
7. **Report and flag gaps.** Summarize what was detected and list what you could not determine (license, badges, env-var docs, deployment) so the user can fill those `<!-- TODO -->` markers.

> [!TIP]
> Generate the scripts table directly from the `scripts` object so it never drifts. If two scripts are obvious wrappers (`build` calling `prebuild`), document the public one and mention the dependency in a single line rather than listing internals.

## Examples

For a detected Node/TypeScript project (`package.json` with `name: "taskflow"`, a `next dev` style `scripts` block, and `src/` + `public/`), the skill emits:

````md
# taskflow

A task-board API and dashboard built with Next.js and TypeScript.

TaskFlow exposes a REST API for boards, lists, and cards, with a server-rendered
dashboard. State is persisted to Postgres via Prisma.

## Installation

```bash
pnpm install   # lockfile detected: pnpm-lock.yaml
```

## Usage

```bash
pnpm dev       # start the dev server on http://localhost:3000
```

## Scripts

| Script  | Command          | Description                       |
| ------- | ---------------- | --------------------------------- |
| `dev`   | `next dev`       | Run the dev server with HMR       |
| `build` | `next build`     | Production build                  |
| `start` | `next start`     | Serve the production build        |
| `lint`  | `eslint .`       | Lint with the flat ESLint config  |
| `test`  | `vitest run`     | Run the test suite once           |

## Project structure

```text
src/
  app/        Next.js App Router routes and layouts
  lib/        data access and shared utilities
  components/ shared UI components
public/       static assets served as-is
prisma/       schema and migrations
```

<!-- TODO: add license, CI badges, and DATABASE_URL setup notes -->
````

Every command above came from the project's real `scripts`; the tree lists only directories that exist. Fill the `TODO` marker before publishing.
