---
name: "license-compliance-checker"
description: "Audit the licenses of a project's dependencies for compatibility with how the project is distributed — flagging copyleft (GPL/AGPL/LGPL), missing or unknown licenses, and other obligations that conflict with your own license or SaaS/proprietary model. Use before shipping or open-sourcing, when adding a dependency, or when legal/procurement asks for a license inventory. This is a licensing review, not a vulnerability scan."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "License Compliance Checker"
date: 2026-07-01
topics: ["devops-infra"]
related: ["skill:dependency-audit", "skill:dependency-upgrade-planner", "skill:secret-scanner"]
featured: false
summary: "Builds a license inventory of the dependency tree and judges each license against how the project ships (SaaS, distributed binary, or library). It flags strong copyleft (GPL/AGPL) conflicting with a proprietary model, weak-copyleft (LGPL/MPL) obligations, missing or unknown licenses, and Apache-2.0 NOTICE requirements, then reports risk tiers with remediation. Not legal advice."
faq:
  - q: "Why is AGPL a problem for a SaaS app when the code never ships to users?"
    a: "The AGPL's network clause is written exactly for this case: if users interact with the software over a network, you must offer them the complete corresponding source of the AGPL-covered work and your modifications, even though you never distribute a binary. For a closed-source SaaS that's usually unacceptable, so an AGPL dependency is a high-priority flag — replace it, isolate it behind a separate process with its source offered, or get explicit legal sign-off."
---

Produce a license inventory of the project's dependencies and judge it against how the project is actually distributed — because the same license can be fine for one project and a blocker for another. This skill enumerates direct and transitive dependency licenses, classifies each by obligation, and flags the ones that conflict with your project's own license and distribution model (a closed-source SaaS, a distributed binary/app, or an open-source library have very different constraints).

> [!IMPORTANT]
> This is an engineering aid, not legal advice. It surfaces likely conflicts and obligations so a human — and, for anything material, a lawyer — can make the call. Never assert that a particular use is "legal"; report the license, the obligation, and the risk.

## When to use this skill

- Before a release, an open-sourcing, or shipping a distributed binary/app.
- When adding or upgrading a dependency and you want to know what it drags in.
- When legal, security, or procurement asks for a Software Bill of Materials or license list.
- When a dependency has no license, an ambiguous one, or a copyleft license you didn't expect.

## Instructions

1. **Establish the project's own terms.** Read the project's `LICENSE` and package manifest license field, and determine the distribution model: closed-source SaaS, distributed proprietary binary/app, or open-source library. This decides which dependency licenses are actually a problem.
2. **Enumerate dependency licenses.** Use the ecosystem's native tooling over the *installed* tree (which includes transitives):
   - Node: `npx license-checker --summary` (or `--json`), or `npm ls --all`.
   - Python: `pip-licenses` (or read package metadata).
   - Go: `go-licenses report ./...`.
   - Rust: `cargo license` / `cargo deny check licenses`.
   - Java: the Maven/Gradle license plugin.
   Capture the package, version, and declared license (SPDX id where possible).
3. **Classify each license by obligation:**
   - **Permissive** — MIT, BSD-2/3, ISC, Apache-2.0, Zlib. Low risk; Apache-2.0 adds NOTICE-file and patent terms to honor.
   - **Weak copyleft** — LGPL, MPL-2.0, EPL. File- or library-scoped reciprocity; usually OK if you don't modify the library and link it dynamically, but note the obligation.
   - **Strong copyleft** — GPL-2.0/3.0, AGPL-3.0. Reciprocal over the whole combined work; AGPL extends to network use. High risk for proprietary/SaaS.
   - **Unknown / missing / custom / proprietary** — treat as high risk until resolved; "no license" means no grant of rights by default.
4. **Judge against the distribution model.** Flag the real conflicts: AGPL in a SaaS; GPL in a distributed proprietary product; copyleft incompatible with your library's own license; missing/unknown licenses anywhere; Apache-2.0 NOTICE/patent obligations left unmet. Don't flag permissive licenses that fit.
5. **Propose remediation per flagged item.** Options in order of preference: replace with a permissively-licensed equivalent; isolate the component (separate process/service with its source offered) so reciprocity doesn't reach your code; move a build-only tool out of the shipped artifact; comply with the obligation (publish source, add NOTICE); or escalate to legal with the specifics.
6. **Report as risk tiers.** Group findings High → Medium → Low with, for each, the package, version, license, why it conflicts with *this* project, and the recommended action. Include a one-line inventory summary (counts per license class).

## Examples

A closed-source SaaS whose dependency tree includes an AGPL-3.0 library and two packages with no license field:

```text
HIGH
- chart-lib@2.1.0 — AGPL-3.0 — network-use reciprocity conflicts with closed-source SaaS.
  → Replace with an MIT/Apache charting lib, or isolate behind a separate service that offers its source.
- odd-utils@0.3.2 — NO LICENSE — no rights granted by default; cannot rely on it as-is.
  → Contact maintainer / find a licensed alternative before shipping.

MEDIUM
- fast-parse@1.4.0 — MPL-2.0 — file-level copyleft; fine if unmodified, but note the obligation.

LOW
- 214 packages MIT/BSD/ISC/Apache-2.0. Ensure Apache-2.0 NOTICE files are aggregated in the distribution.
```

State clearly that findings are informational and material conflicts should be confirmed with legal counsel.
