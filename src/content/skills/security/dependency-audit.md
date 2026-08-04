---
name: "dependency-audit"
description: "Audit project dependencies for known vulnerabilities and turn the raw scanner output into a triaged, prioritized upgrade plan. Use when an audit is noisy, a CVE was reported, or you need to know which advisories actually matter."
date: 2026-06-03
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["devops-infra"]
related: ["software-supply-chain-security", "dependency-manager", "security-auditor"]
featured: false
summary: "A skill that runs the ecosystem's native vulnerability audit and triages the output: it traces each flagged package to actual imports to judge reachability, rewrites severity in context so unreachable criticals stop outranking reachable moderates, computes minimal safe version bumps, verifies with tests and a re-audit, and reports prioritized tiers."
---

Run the ecosystem's vulnerability audit, then do the part the scanner won't: separate exploitable, reachable advisories from transitive noise and propose the minimal upgrade that closes the real risk. The skill reads the actual lockfile, runs the native audit tool, traces each flagged package to how it's used in the codebase, and rewrites the severity in context — so a critical-rated advisory in a build-only dependency you never call doesn't outrank a moderate one on the request path.

## When to use this skill

- An audit (`npm audit`, `pip-audit`, `cargo audit`, …) prints a wall of advisories and you need to know which ones to act on first.
- A specific CVE or GitHub advisory landed and you want to confirm whether your usage is actually reachable.
- You want the smallest safe set of version bumps — not a blanket `npm audit fix --force` that breaks the build.
- A security gate is failing CI and you need to justify a documented downgrade or suppression.

> [!WARNING]
> A vulnerability's CVSS score rates the flaw in the abstract, not your exposure to it. Never act on severity alone — an unreachable "critical" is lower priority than a reachable "moderate" on your request path. This skill exists to make that distinction explicit.

## Instructions

1. **Locate the manifest and lockfile.** Find the dependency files (`package.json` + `package-lock.json`/`pnpm-lock.yaml`/`yarn.lock`, `requirements.txt`/`poetry.lock`/`Pipfile.lock`, `Cargo.lock`, `go.mod`/`go.sum`, `Gemfile.lock`). The lockfile is the source of truth for resolved versions — audit that, not the loose ranges in the manifest.
2. **Detect the audit tool — do not guess.** Match the ecosystem and run its native auditor: `npm audit --json` (or `pnpm audit --json` / `yarn npm audit`), `pip-audit -r requirements.txt -f json` (or `poetry`/`uv` equivalents), `cargo audit --json`, `govulncheck ./...`, `bundle audit`. Prefer the JSON output so you can parse advisories programmatically.
3. **Classify each advisory by reachability.** For every flagged package, determine: is it a **direct** or **transitive** dependency? Is it a runtime, dev, build, or test-only dependency? Then `grep`/`Glob` the codebase for actual imports and calls of the vulnerable API. A package present in the tree but never imported — or imported only in tooling that never runs in production — is **not reachable** and should be downgraded in priority.
4. **Rewrite severity in context.** State the original score, then the *contextual* priority with a one-line reason: the affected code path, whether attacker-controlled input can reach it, and the deployment surface (public endpoint vs. local CLI vs. CI-only). `govulncheck` does call-graph reachability natively — trust it over a flat `npm audit` when available.
5. **Compute the minimal safe upgrade.** For each issue worth fixing, find the lowest patched version that resolves it. Prefer in-range patch/minor bumps; flag major bumps and transitive-only fixes (which may need an `overrides`/`resolutions` pin or a dependency-tree update) separately as higher-effort. Never blanket-run `--force` fixes.
6. **Verify the fix.** Apply the proposed bumps in a scratch step, re-run the audit, and run the build/test command to confirm nothing broke (`npm ci && npm test`, `pytest`, `cargo build`, …). Re-running the auditor must show the targeted advisories cleared.
7. **Report and flag gaps.** Produce a triaged summary: **act now** (reachable, fixable), **monitor** (unreachable or no patch yet), and **suppressed** (false positive / accepted risk, with reason). Call out any advisory with no fix available and any transitive issue you couldn't resolve without a major upgrade.

> [!TIP]
> If an advisory is genuinely not applicable, record it in the tool's ignore file (`.npmrc` audit overrides, `pip-audit --ignore-vuln`, `cargo audit`'s `audit.toml`, `.trivyignore`) **with a dated justification comment** — don't silently suppress it, and don't leave it failing CI for the next person to re-triage.

## Examples

Input — raw `npm audit` reports two advisories at face value:

```
# npm audit report
minimatch  <3.0.5   high     ReDoS via brace expansion   (transitive, via glob → eslint)
axios      <1.6.0   medium   XSRF-TOKEN leak to cross-origin hosts  (direct, used in src/api/client.ts)
```

After tracing usage, the triaged summary downgrades the unreachable one and prioritizes the reachable one:

```
Dependency audit — 2 advisories, 1 actionable

[ACT NOW]  axios  0.27.2 → 1.6.0   (medium, contextually HIGH)
  CSRF / XSRF-TOKEN leak to cross-origin hosts (CVE-2023-45857). axios is
  on the live request path in src/api/client.ts and forwards a user-supplied
  `targetUrl` — the XSRF-TOKEN cookie can leak to attacker-controlled hosts.
  In-range minor bump; no breaking API changes used.

[MONITOR]  minimatch  3.0.4 → 3.0.5   (high, contextually LOW)
  ReDoS via brace expansion. Pulled in transitively by eslint (dev only);
  never bundled or executed in production, and no untrusted pattern reaches
  it. Patched by `npm dedupe` or an override — fix opportunistically, not
  blocking. Original "high" score reflects the flaw, not our exposure.

Verification: applied axios bump, `npm ci && npm test` green,
re-ran `npm audit` → axios advisory cleared.
Gap: minimatch fix requires an eslint transitive bump; left for the next
dep-update PR.
```
