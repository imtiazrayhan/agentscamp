---
name: "bundle-analyzer"
description: "Analyze a JS/TS production bundle and surface the biggest size wins — heavy dependencies, duplicate packages, missing code-splitting, oversized polyfills, and dev/server code leaking into the client. Use when a bundle is too large and you need a ranked, actionable reduction plan."
date: 2026-06-03
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
related: ["agent:performance-engineer", "agent:frontend-developer"]
featured: false
summary: "A skill that analyzes a JS/TS production bundle to find where the bytes actually go: it builds a stats report with the project's own analyzer, attributes weight to packages, and hunts heavy dependencies, duplicate versions, missing code-splitting, oversized polyfills, and leaked server code — returning a plan ranked by estimated gzip savings."
---

Inspect a JavaScript/TypeScript production bundle and find where the bytes actually go. The skill builds a stats report, attributes weight to specific modules and packages, and hunts for the patterns that bloat bundles in practice — a 200KB date library imported for one helper, two copies of the same package at different versions, a route that ships eagerly instead of lazily, a polyfill set targeting browsers you dropped years ago, or server-only code that slipped past the client boundary. It returns a ranked list of concrete reductions with the estimated savings of each, so you fix the 80KB win before the 4KB one.

## When to use this skill

- A production bundle (or a specific route/chunk) has grown past budget and you need to know exactly what to cut.
- You suspect duplicate packages, a heavyweight dependency, or a barrel import dragging in a whole library.
- A first-load or main chunk is too big and you want to know what should be code-split or deferred.
- You want to confirm dev-only tooling, source maps, or server code is not leaking into the client bundle.

> [!NOTE]
> Always measure the **production** build, not dev. Dev bundles include HMR runtime, unminified source, and no tree-shaking, so their sizes are meaningless for this analysis. Compare **gzip/brotli** transfer sizes, not raw bytes — that is what users actually download.

## Instructions

1. **Locate the build and detect the bundler.** Identify the toolchain before doing anything — do not guess. Check `package.json` scripts and lockfiles for `next`, `vite`, `webpack`, `rollup`, `esbuild`, or `@remix-run`. Note the package manager (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`) since duplicate-detection commands differ per manager.
2. **Produce a stats report using the project's own analyzer.** Match existing config rather than bolting on a new tool:
   - **Next.js** — run the production build and read its per-route First Load JS table; if `@next/bundle-analyzer` is wired up, run `ANALYZE=true npm run build`.
   - **Vite/Rollup** — use `rollup-plugin-visualizer` if present, or build and inspect `dist/assets/*` sizes.
   - **Webpack** — generate `--json` stats (`webpack --profile --json=stats.json`, which writes the file directly so console warnings don't corrupt the JSON) and analyze, e.g. with `source-map-explorer` over the emitted bundle + map.
   - If no analyzer is configured, fall back to `npx source-map-explorer 'dist/**/*.js'` against the built output and its source maps.
3. **Attribute weight to packages, not just files.** Map the largest modules back to their npm packages. For each heavyweight dependency, determine whether it is fully used or pulled in by a barrel/side-effect import, and whether a lighter alternative exists (e.g. `date-fns`/`dayjs` over `moment`, native `Intl` over `numeral`, `lodash-es` with named imports over `lodash`).
4. **Detect duplicates and version skew.** Run `npm ls <pkg>` / `pnpm why <pkg>` / `yarn why <pkg>` on suspect packages to find the same library bundled at multiple versions, and check for both ESM and CJS copies of the same dep. Flag candidates for `resolutions`/`overrides` or dedupe.
5. **Find missing code-splitting and oversized polyfills.** Look for large modules in the entry/main chunk that are only needed on one route or behind an interaction (charts, editors, markdown renderers, PDF libs) — these belong behind `import()` / `next/dynamic` / `React.lazy`. Inspect the polyfill/transpile target (`browserslist`, `target` in `tsconfig`/`vite`/`tsup`) for `core-js` or regenerator-runtime bloat aimed at browsers you no longer support.
6. **Hunt for leaked dev/server code.** Grep the client bundle and imports for things that should never ship: test/mock files, `process.env` debug branches, server-only modules (`fs`, `crypto` server usage, DB clients, secrets), and dev dependencies imported from app code. In Next.js, confirm Server Component / `"use client"` boundaries are not dragging server modules into client chunks.
7. **Verify each proposed cut.** Do not estimate from intuition alone. Where feasible, apply the change behind the analyzer (or `--dry`) and re-run the build to measure the real delta. At minimum, cite the measured pre-change size from the stats report for every finding.
8. **Report a ranked plan.** Output findings ordered by estimated gzip savings, each with: the module/package, current size, the specific fix, the expected reduction, and a rough effort/risk rating. Flag anything you could not measure precisely so the user knows what to confirm.

> [!WARNING]
> Tree-shaking only works on side-effect-free ESM. A default or namespace import from a CJS package (or a package missing `"sideEffects": false`) pulls in the **whole** module regardless of what you use — so "import one helper" can still cost the full library. Verify the import shape, not just the import statement.

## Examples

A ranked findings report for a Next.js app whose largest route shipped 412 KB of First Load JS:

```text
Bundle analysis — route /dashboard (First Load JS: 412 KB gzip → target 180 KB)
Ranked by estimated gzip savings:

1. moment + moment-timezone .................. 71 KB  [HIGH]
   Imported in 3 files for formatting only. Replace with date-fns
   named imports (tree-shakeable). Est. -64 KB. Effort: M, Risk: low.

2. Duplicate react (18.2.0 + 18.3.1) .......... 44 KB  [HIGH]
   `npm ls react` shows two copies via an old @charting/core dep.
   Add an override to pin a single version + dedupe. Est. -44 KB.
   Effort: S, Risk: low.

3. recharts loaded eagerly in entry chunk ..... 38 KB  [HIGH]
   Only rendered below the fold on /dashboard. Move behind
   next/dynamic({ ssr: false }). Est. -38 KB from First Load.
   Effort: S, Risk: low.

4. lodash default import (whole library) ...... 24 KB  [MED]
   `import _ from "lodash"`. Switch to `lodash-es` + named imports
   (debounce, groupBy). Est. -21 KB. Effort: S, Risk: low.

5. core-js polyfills for IE11 ................. 19 KB  [MED]
   browserslist still includes "ie 11". Drop it (no IE traffic in
   analytics). Est. -19 KB. Effort: S, Risk: med (confirm targets).

6. server-only `pg` Pool pulled into client ... 12 KB  [HIGH]
   db/client.ts imported from a "use client" component. Move the
   query behind a Server Action / route handler. Est. -12 KB +
   removes a secret-leak vector. Effort: M, Risk: med.

Estimated total reduction: ~198 KB gzip (412 → ~214 KB).
Top 3 fixes alone recover 146 KB. Re-run the analyzer after each.
```

Re-run the build after applying the top findings to confirm the measured First Load JS dropped as projected, and re-check `npm ls` to verify the duplicate is gone.
