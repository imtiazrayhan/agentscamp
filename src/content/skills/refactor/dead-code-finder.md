---
name: "dead-code-finder"
description: "Find genuinely unused code — unreferenced exports, unreachable files, and unused dependencies — and remove it safely with build/test verification. Use when trimming a codebase or untangling years of accreted cruft."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
related: ["refactoring-specialist", "refactor"]
featured: false
---

Hunt down code that nothing references and delete it without breaking the build. The skill walks the dependency graph from the project's real entry points, flags exports no module imports, files no path reaches, and dependencies no source line uses — then removes them one at a time, re-running the build and tests after each deletion so a false positive surfaces immediately instead of in production.

## When to use this skill

- A codebase has accumulated dead exports, orphaned files, or leftover utilities after refactors and feature removals.
- `package.json` lists dependencies you suspect nothing imports anymore.
- You want a measured, verifiable cleanup pass — not a risky bulk delete.

> [!WARNING]
> "Unreferenced" is not the same as "unused." Code can be reached at runtime in ways static search misses: string-based requires (`require(`./handlers/${name}`)`), reflection/DI containers, framework entrypoints (route files, migrations, CLI commands, test setup), config-driven plugin loading, and anything that is part of a published **public API**. Treat these as live until proven otherwise. Verify every removal with the build **and** tests before moving to the next one.

## Instructions

1. **Locate the entry points.** Identify where execution actually begins — `main`/`exports`/`bin` in `package.json`, `next.config`/route conventions, `if __name__ == "__main__"`, CLI definitions, test runners. Everything reachable from these is live; the dead set is the complement.
2. **Detect the right tooling — do not guess.** Match the ecosystem and prefer purpose-built tools over hand-rolled grep:
   - TS/JS: `knip` (exports, files, and deps in one pass), `ts-prune`, `depcheck`, or `eslint`'s `no-unused-vars`.
   - Python: `vulture`, `deptry`, `ruff check --select F401`.
   - Go: `staticcheck`/`go vet`, `golangci-lint`. Rust: `cargo +nightly udeps`, dead-code warnings.
   Read the config these tools already respect; honor existing ignore lists.
3. **Build the candidate list, then triage.** For each candidate (unreferenced export, unreached file, unused dependency), grep the **whole repo** — including configs, test setup, CI scripts, dynamic-import strings, and docs — before trusting the tool. Drop anything matched by the dynamic-usage patterns in the warning above, and anything re-exported from a package's public entry point.
4. **Remove one thing at a time.** Delete a single export/file/dependency, then run the project's build and test commands. Never batch deletions across the verification step — a green-then-red transition must point at exactly one change.
5. **Verify after each removal.** Run the real commands (`npm run build && npm test`, `pytest`, `go build ./... && go test ./...`). A clean build and passing suite is the proof. If anything breaks, revert that single change and mark the candidate as a live-via-dynamic-usage false positive.
6. **Report and flag gaps.** List what was removed (with the verifying command output), what was kept and why, and any candidates that need human judgment — public-API surface, generated code, or dynamic usage your search could not rule out.

> [!NOTE]
> Run the cleanup on a branch and keep each removal as its own commit. If a deletion only surfaces a failure in CI or a downstream consumer, a granular history makes the exact revert trivial.

## Examples

Confirming an export is truly unused before deleting it — `formatLegacyDate` in `src/utils/date.ts`:

```bash
# 1. Tool flags it as an unreferenced export
$ npx knip --include exports
src/utils/date.ts:42:14 - 'formatLegacyDate' is unused (exports)

# 2. Verify by hand across the WHOLE repo, including dynamic strings and configs
$ grep -rIn "formatLegacyDate" --include='*.ts' --include='*.tsx' --include='*.js' --include='*.json' --include='*.md' --include='*.yml' .
src/utils/date.ts:42:export function formatLegacyDate(d: Date): string {
# Only the definition — no importers, no string references, no re-export in index.ts
```

One self-reference and nothing else: safe to delete. Remove it, then prove the codebase still compiles and passes:

```bash
$ npm run build && npm test
✓ build succeeded
✓ 214 passed
```

Contrast with a false positive — an export `knip` also flags, but grep finds reached dynamically:

```bash
$ grep -rIn "handlers/" --include='*.ts' .
src/router.ts:18:  const mod = await import(`./handlers/${route.name}`);
```

The static tool can't follow the template-literal import, so `handlers/checkout.ts` only *looks* orphaned. Keep it, document the dynamic load, and report it as a manual-review case rather than deleting it.
