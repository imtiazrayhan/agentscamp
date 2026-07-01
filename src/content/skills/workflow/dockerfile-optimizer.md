---
name: "dockerfile-optimizer"
description: "Shrink and harden an existing Dockerfile — multi-stage builds, cache-friendly layer order, a lean pinned base image, a .dockerignore, and a non-root runtime user — without changing what the image runs. Use when an image is too large, builds are slow because the cache never hits, or a scan flags the container running as root."
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Dockerfile Optimizer"
date: 2026-07-01
topics: ["devops-infra"]
related: ["devcontainer-designer", "github-actions-optimizer", "cold-start-optimizer"]
featured: false
summary: "Takes a working Dockerfile and makes it smaller, faster to build, and safer to run: a multi-stage build that keeps compilers out of the final image, layer order that puts dependency manifests before source so the cache hits, a lean pinned base, a .dockerignore, and a non-root USER — behavior-preserving and verified with a real build and an image-size comparison."
faq:
  - q: "Why does reordering COPY lines make the build faster?"
    a: "Docker caches each layer and invalidates every layer after the first one whose inputs changed. If you COPY your whole source tree before installing dependencies, any code change busts the dependency-install layer and reinstalls everything. Copy just the dependency manifests (package.json, go.mod, requirements.txt, pom.xml) first, install, then copy the rest of the source — now editing a source file reuses the cached install layer and the build is seconds instead of minutes."
---

Take a Dockerfile that already works and make it smaller, faster to build, and safer to run — without changing what the container actually does. This skill reads the existing Dockerfile and build context, then applies the standard, high-leverage optimizations: multi-stage builds so build tools never ship in the final image, layer ordering that lets the cache hit on unchanged dependencies, a lean and pinned base image, a `.dockerignore`, and a non-root runtime user.

## When to use this skill

- The image is large (hundreds of MB to gigabytes) and you want it smaller.
- Builds are slow because a small source change reinstalls all dependencies (cache never hits).
- A scanner or reviewer flagged the container running as `root`, an unpinned `:latest` base, or secrets in a layer.
- You're preparing an image for production and want it lean and reproducible.

> [!NOTE]
> This is behavior-preserving. The optimized image must run the same command, expose the same ports, and produce the same result. Don't change the app's runtime behavior, upgrade its language version, or swap frameworks — only how the image is built and packaged.

## Instructions

1. **Read the current state.** Read the `Dockerfile`, any `.dockerignore`, and the build context layout. Identify the language/runtime, the build steps, and the final `CMD`/`ENTRYPOINT`. Build once to get a baseline: `docker build -t img:before .` and record the size with `docker images img:before`.
2. **Introduce (or tighten) a multi-stage build.** Put compilation, dev dependencies, and toolchains in a `builder` stage; copy only the produced artifacts (binary, `dist/`, wheels, `node_modules` for prod) into a minimal final stage. The final image should contain the runtime and the app — not compilers or package caches.
3. **Choose a lean, pinned base.** Prefer a slim or distroless runtime image over a full OS image where the app allows it. Pin to a specific tag (and ideally a digest) — never `:latest`. Match the base to the deployment target's architecture.
4. **Order layers for cache hits.** Copy dependency manifests first, install dependencies, *then* copy application source. This keeps the expensive install layer cached across ordinary code changes. Use BuildKit cache mounts (`RUN --mount=type=cache,...`) for package-manager caches where supported.
5. **Keep layers clean.** Combine related `RUN` steps, and in the same layer remove what you added — clear apt/apk lists (`rm -rf /var/lib/apt/lists/*`), don't `--no-install-recommends`-forget, and avoid leaving package caches. Never `COPY` secrets or `.git` into a layer; use build secrets or runtime env instead.
6. **Add a `.dockerignore`.** Exclude `.git`, `node_modules` (when installed inside the image), build output, test fixtures, local env files, and docs. A smaller build context means faster builds and no accidental secret leakage.
7. **Run as non-root.** Create a dedicated user/group and add `USER` before the final `CMD`. Ensure the app's files and any writable dirs are owned appropriately. Add a `HEALTHCHECK` if the platform uses it.
8. **Verify.** Build the optimized image (`docker build -t img:after .`), confirm it runs and behaves identically, and compare sizes. Report the before/after image size and build-time change with real numbers. If the project uses a scanner (Docker Scout, Trivy, Grype), run it and note the delta.

## Examples

A Node service that copied everything before installing, ran as root, and shipped the full build toolchain:

```dockerfile
# syntax=docker/dockerfile:1
# ---- builder ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# ---- runtime ----
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Report the outcome: image size before → after, whether the build cache now survives a source-only change, the non-root user added, and any scanner findings resolved. Note anything you intentionally left alone (e.g. a base image the app pins for a native dependency).
