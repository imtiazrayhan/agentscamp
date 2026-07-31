---
description: "Scaffold a production-grade multi-stage Dockerfile and .dockerignore for the current project."
seoDescription: "/scaffold-dockerfile generates a production-grade multi-stage Dockerfile and .dockerignore tuned to the current project — a Claude Code slash command."
date: 2026-06-17
argument-hint: "<optional: stack/runtime hint>"
allowed-tools: "Read, Write, Glob, Grep"
title: "Scaffold Dockerfile"
color: "purple"
topics: ["devops-infra"]
related: ["devops-engineer", "setup-claude-ci", "cloud-architect"]
featured: false
summary: "A slash command that detects the project's stack from its manifests (or a $ARGUMENTS hint), then writes a multi-stage Dockerfile with a pinned minimal base, a non-root user, cache-friendly layer ordering, a HEALTHCHECK, and a matching .dockerignore — reporting the build and run commands at the end."
---

Scaffold a production Dockerfile and `.dockerignore` for this repository. Treat `$ARGUMENTS` as an optional stack/runtime hint (e.g. `node 22`, `go`, `python 3.12 fastapi`, `bun`). If `$ARGUMENTS` is empty, detect the stack from the repo's manifests — never ask the user a question you can answer by reading a file.

## Scope

Produce exactly two files at the repo root: `Dockerfile` and `.dockerignore`. The Dockerfile must be **multi-stage** (a builder stage that installs build/dev dependencies, a final stage that copies only runtime artifacts), run as a **non-root user**, pin a **specific minimal base image**, and order layers so dependency installs cache across source-only changes.

> [!WARNING]
> If a `Dockerfile` already exists, do not silently overwrite it. Read it, and either propose targeted improvements in your report or write the new one to `Dockerfile.new` and say so. Never clobber working infra.

## Step 1 — Detect the stack

Use the `$ARGUMENTS` hint if given, then confirm it against the repo. With no hint, identify the stack from manifests with `Glob`/`Read`:

- **Node/Bun/Deno** — `package.json` (read `engines.node`, `packageManager`, and `scripts.build`/`scripts.start`), `bun.lockb`, `deno.json`. The lockfile (`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` / `bun.lockb`) decides the package manager and the deterministic install command.
- **Go** — `go.mod` (read the `go` directive for the version); produces a static binary, so the final stage can be `distroless/static` or `scratch`.
- **Python** — `requirements.txt`, `pyproject.toml` (+ `poetry.lock`/`uv.lock`), `Pipfile`. Note the entrypoint (`uvicorn`, `gunicorn`, `python app.py`).
- **Rust** — `Cargo.toml`; final stage can be `distroless/cc` or `debian:*-slim`.
- **JVM** — `pom.xml` / `build.gradle`; build a jar in the builder, run on a JRE-only base.

Record: the **language + version**, the **package manager + lockfile**, the **build command**, the **start command**, and the **listening port** (grep source/config for `listen`, `PORT`, `EXPOSE`, framework defaults).

> [!NOTE]
> Pin the base image to a specific minor + digest-able tag (e.g. `node:22.12-slim`, `python:3.12-slim`, `golang:1.23-alpine`). Match the major/minor to the version declared in the manifest — do not invent a version the project does not use.

## Step 2 — Write the multi-stage Dockerfile

Builder stage installs dependencies first (copy only manifests + lockfile), then copies source and builds. The final stage starts from a clean minimal base and copies only what runtime needs. The snippet below is illustrative for Node — adapt the base, install, build, and CMD to the stack found in Step 1.

```dockerfile
# syntax=docker/dockerfile:1

# --- builder ---
FROM node:22.12-slim AS builder
WORKDIR /app
# Copy manifests first so deps cache survives source-only changes
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# --- runtime ---
FROM node:22.12-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
# Run as the unprivileged user the base image already ships
USER node
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server.js"]
```

Rules for whatever stack you target:

- **Copy manifests + lockfile before source**, install, then `COPY` the rest. This is the single most important line-ordering decision for cache reuse.
- Use the **deterministic install** for the detected package manager (`npm ci`, `pnpm install --frozen-lockfile`, `pip install --no-cache-dir -r requirements.txt`, `go mod download`).
- **Final stage carries artifacts only** — built binary/`dist`/wheel + runtime deps, never the compiler, dev dependencies, or source tree. For Go/Rust static binaries, copy the single binary into `distroless`/`scratch`.
- **Non-root**: use the base image's built-in unprivileged user (`USER node`, distroless `nonroot`) or create one (`RUN adduser -D app && USER app`). `COPY --chown` so the runtime user owns its files.
- **`HEALTHCHECK`** only when the container exposes a port and has (or can have) a health endpoint. For a one-shot/CLI image, omit it rather than faking one.
- **`EXPOSE`** the detected port and use the **exec-form `CMD`** (`["node","dist/server.js"]`) so signals reach PID 1.

> [!WARNING]
> Never bake secrets into the image. Do not `COPY .env`, and do not pass tokens via `ARG`/`ENV` — build args land in the image history and `docker history` will expose them. For private registry installs, use `RUN --mount=type=secret` so the credential never persists in a layer.

## Step 3 — Write the .dockerignore

Write `.dockerignore` before relying on `COPY . .` — without it the whole working tree (including `.git` and local secrets) ships into the build context and into layers.

```
.git
.gitignore
node_modules
dist
build
.next
target
__pycache__
*.pyc
.venv
.env
.env.*
*.log
.DS_Store
Dockerfile
.dockerignore
README.md
coverage
.cache
```

- Always exclude `.git`, `node_modules`/`target`/`.venv`, build output, `.env*`, and editor/OS cruft.
- Tailor it to the detected stack (Python: `__pycache__`, `*.pyc`; Go: vendored caches; JS: `.next`, `coverage`).
- Excluding heavy/irrelevant paths shrinks the build context, speeds uploads, and removes a whole class of accidental secret leaks.

## Step 4 — Report

Deliver the result as your message:

- **Files written** — `Dockerfile` and `.dockerignore` (or `Dockerfile.new` if you avoided overwriting), and the detected stack + version + package manager they were built for.
- **Key decisions** — base image and why (slim vs. distroless vs. alpine), the runtime user, the cache-ordering choice, and whether a `HEALTHCHECK` was included or skipped.
- **Build & run** — the exact commands, e.g. `docker build -t myapp .` then `docker run --rm -p 3000:3000 myapp`. Note any required secrets/env (`docker run -e ...` or `--secret`).
- **Follow-ups** — anything the user must supply (a `/health` endpoint for the healthcheck, the real start command if it was ambiguous) and a one-line check to confirm non-root: `docker run --rm myapp id`.