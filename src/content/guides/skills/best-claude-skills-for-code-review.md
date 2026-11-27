---
title: "9 Best Claude Skills for Code Review"
description: "Choose Claude skills for security, correctness, maintainability, and focused pull request review without relying on one vague review prompt."
author: "Imtiaz Rayhan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "purple"
topics: ["workflow-prompting", "review-qa"]
audience: ["developers"]
tags: ["claude-skills", "code-review", "security", "pull-requests", "quality"]
featured: true
seoTitle: "9 Best Claude Skills for Code Review"
seoDescription: "Compare Claude skills and commands for reviewing a pull request: correctness, security, dependencies, secrets, auth, permissions, tests, and licenses."
summary: "Run the review-pr command on every pull request for a correctness, security, and style pass, then add specialists by what the diff touches: security-scan for request handlers, dependency-audit for lockfiles, secret-scanner for config, auth-flow-reviewer for protected routes, least-privilege-auditor for IAM and CI, and review-tests for tests."
keyTakeaways:
  - "Start with one general pass (review-pr), then pick specialists from the changed file paths instead of running everything."
  - "Six of the nine picks are skills and three are slash commands; all nine end in a report, and none is built to fix the code it reviews."
  - "auth-flow-reviewer, least-privilege-auditor, and review-tests are limited to Read, Grep, and Glob; the others also run shell commands such as npm audit, gh, or a coverage run."
  - "dependency-audit re-ranks advisories by reachability, so a transitive dev-only 'high' can sit below a 'medium' on the request path."
  - "coverage-gap-finder tells you which branches have no test; review-tests tells you whether the existing tests assert anything."
faq:
  - q: "What is the best Claude skill for code review?"
    a: "For a general pass, the review-pr command: it pulls the PR with the GitHub CLI, checks correctness, security, and style, and labels each finding Blocker, Should-fix, or Nit. No single skill covers everything, so add dependency-audit when the lockfile changes, auth-flow-reviewer for auth code, and least-privilege-auditor for IAM or CI permissions."
  - q: "Can Claude skills leave review comments on a pull request?"
    a: "The picks here write a report in the conversation and do not post anything. review-pr reads the PR with gh pr view, gh pr diff, and gh pr checks, and its instructions say not to approve or merge. Posting is a separate step you can ask for once you have read the findings."
  - q: "Should a review skill automatically fix every finding?"
    a: "No. All nine picks end in a report, and several say so explicitly: auth-flow-reviewer ends with 'No code modified', and least-privilege-auditor will not revoke access or edit policy unless you expand the task. Fix findings in a second step so each change is reviewed on its own."
  - q: "How do I install a Claude code-review skill?"
    a: "Run npx agentscamp add skills/<slug> for a skill or npx agentscamp add commands/<slug> for a command. Both install at project scope by default; add -g for your personal Claude directory. Each linked page also shows the complete file to copy by hand."
related: ["guide:best-claude-skills-2026", "guide:best-claude-skills-for-testing", "skill:least-privilege-auditor", "skill:dependency-audit", "skill:coverage-gap-finder", "skill:auth-flow-reviewer"]
---

A useful review setup is one general pass over the whole diff plus specialists chosen by what the diff touches. A dependency review needs advisory data and a reachability check; a permissions review needs a map of who can do what; a test review needs the production code next to the assertions. One prompt that says "review this PR" does all three shallowly.

The nine picks were selected on three rules: each ends in a report instead of a fix (review-pr checks out the PR branch and dependency-audit trial-applies version bumps to verify them, but neither commits anything), each cites a file and line or a package and version for every finding, and each has a trigger you can read off the changed files. Six are skills and three are slash commands.

| Pick | Run it when the diff touches | Needs | Finding labels |
| --- | --- | --- | --- |
| [review-pr](/commands/review/review-pr) (command) | Anything | PR number, `gh` CLI | Blocker / Should-fix / Nit |
| [security-scan](/commands/review/security-scan) (command) | Request handlers, queries, file or URL handling | Paths, or defaults to the current diff | Critical to Low, with confidence |
| [dependency-audit](/skills/security/dependency-audit) | A manifest or lockfile | The ecosystem's audit tool | Act now / Monitor / Suppressed |
| [secret-scanner](/skills/security/secret-scanner) | Config, CI, `.env*`, infrastructure | git; uses gitleaks or trufflehog if configured | True positive / false positive / review |
| [auth-flow-reviewer](/skills/security/auth-flow-reviewer) | Login, sessions, tokens, any route taking an object ID | Read access only | Critical / High / Medium |
| [least-privilege-auditor](/skills/security/least-privilege-auditor) | IAM policy, CI permissions, service accounts, agent tools | Read access only | Required / unused / excess scope / temporary / unverified |
| [review-tests](/commands/review/review-tests) (command) | Test files | A test file or area | High / Medium / Missing tests |
| [coverage-gap-finder](/skills/testing/coverage-gap-finder) | Branching logic, error handling, retries | The project's coverage tool | High / Medium value, Skip |
| [license-compliance-checker](/skills/security/license-compliance-checker) | New dependencies before a release | The ecosystem's license tool | High / Medium / Low |

## A review run on one pull request

Take a fictional PR at Acme: it adds `GET /api/invoices/:id/export`, bumps `axios`, and edits `.github/workflows/deploy.yml`. The file paths decide which picks run.

| Step | You type | Why this pick |
| --- | --- | --- |
| 1 | `/review-pr 482` | General pass over the whole diff, CI status included |
| 2 | "Review the auth on the new invoice export route." | A route takes an object ID, so auth-flow-reviewer fires |
| 3 | "Audit the dependency changes in this branch." | `package-lock.json` changed, so dependency-audit fires |
| 4 | "Check the permissions in deploy.yml for excess scope." | CI permissions changed, so least-privilege-auditor fires |
| 5 | `/review-tests src/routes/invoices.test.ts` | New tests were added; check they assert something |

The findings below use the output formats and example findings from the skills' own files, so they show the shape of a report, not a real run.

From auth-flow-reviewer (step 2):

```text
CRITICAL
- IDOR on invoice fetch — src/routes/invoices.ts:41
  Impact: any logged-in user reads any invoice; `findById(req.params.id)` has no
          owner check. GET /api/invoices/123 returns 123 to anyone.
  Fix:    scope the query — findOne({ id, ownerId: req.session.userId }); 404 on miss.
```

From dependency-audit (step 3):

```text
[ACT NOW]  axios  0.27.2 → 1.6.0   (medium, contextually HIGH)
  ... axios is on the live request path in src/api/client.ts ...
[MONITOR]  minimatch  3.0.4 → 3.0.5   (high, contextually LOW)
  ... Pulled in transitively by eslint (dev only); never bundled or executed
  in production ...
```

From review-tests (step 5):

```text
### High — weak or misleading tests
- `cart.test.ts:42` — [Weak assertion] only asserts `toBeDefined()`; the discount
  math is never checked. Assert the exact total for a known cart.
```

The general pass in step 1 would likely mention the missing owner check too. The specialist earns its run by enumerating every endpoint and checking each one, not only the lines in the diff.

## 1. review-pr: the general pass

[review-pr](/commands/review/review-pr) takes a PR number. It runs `gh pr view`, `gh pr diff`, and `gh pr checks`, reads the description and linked issues to learn the intended behavior, and checks the branch out so it can read surrounding code and run the tests and linter. It evaluates correctness (off-by-one errors, unhandled null, races, leaks), security (injection, missing authorization, committed secrets), and maintainability, then writes a verdict of Approve, Request changes, or Comment with findings under Blockers, Should-fix, and Nits, each with a `file:line` and a proposed fix.

It does not approve or merge. It needs an authenticated `gh` and a real pull request; for a local branch with no PR, the [code-reviewer agent](/agents/quality-security/code-reviewer) reviews `git diff` against the merge base and adds a confidence level per finding.

## 2. security-scan: untrusted input to dangerous sink

[security-scan](/commands/review/security-scan) defaults to the current diff, or to the paths you pass. It first maps where untrusted input enters (request bodies, params, headers, uploads, webhook payloads, CLI args) and traces each value to where it is used. Then it checks, in order: SQL, command, and template injection; missing object-level authorization; hardcoded secrets; SSRF, path traversal, and unsafe deserialization; and missing input validation, including mass assignment.

The report separates **Confirmed** findings, where it traced input to a sink, from **To double-check** items that depend on a guard it could not see. It never prints a secret's value. It is a grep-and-trace pass, not a replacement for a dedicated scanner in CI.

## 3. dependency-audit: which advisories actually matter

[dependency-audit](/skills/security/dependency-audit) audits the lockfile with the native tool (`npm audit --json`, `pip-audit`, `cargo audit --json`, `govulncheck ./...`, `bundle audit`), then does the triage the tool skips. For each advisory it records whether the package is direct or transitive, runtime or dev-only, and greps for real imports of the vulnerable API. It restates severity in context with a one-line reason, finds the lowest patched version, applies the bump in a scratch step, and re-runs the audit and the test suite to confirm.

It never runs `--force` fixes. Advisories that are not applicable go into the tool's ignore file with a dated justification, not a silent suppression.

## 4. secret-scanner: credentials in the diff or in history

[secret-scanner](/skills/security/secret-scanner) scans the working tree, a diff such as `git diff main...HEAD`, or full history. If gitleaks, trufflehog, or detect-secrets is already configured it runs that and honors the allowlist. Otherwise it greps for provider key prefixes, private key headers, JWTs, and connection strings with embedded credentials, globs for committed `.env` and key files, and flags high-entropy values next to secret-like names.

Every hit is triaged: fixtures, `*.example` files, and placeholders are false positives; unclear cases are marked `review`. For a true positive the remediation is always two steps in this order: rotate the credential, then scrub history with `git filter-repo` or BFG. Deleting the line is not a fix, because the value stays in every earlier commit.

## 5. auth-flow-reviewer: who can read whose data

[auth-flow-reviewer](/skills/security/auth-flow-reviewer) has only Read, Grep, and Glob. It lists every endpoint and tags it public, authenticated, or authorized, then checks cookie flags (`HttpOnly`, `Secure`, `SameSite`), CSRF protection on cookie-authenticated writes, JWT algorithm pinning and expiry, refresh-token rotation and reuse detection, reset and verification tokens (high-entropy, single-use, short-lived, no user enumeration), and OAuth `redirect_uri` exact matching, `state`, and PKCE.

Most of its effort goes to step 8: for every route that accepts an object ID, does the handler check that the current user may act on that object? The report opens with a scope line such as "12 endpoints enumerated (3 public, 5 authenticated, 4 authorized)". It reviews code as written and cannot tell you how the deployed system is configured.

## 6. least-privilege-auditor: permissions the change does not need

[least-privilege-auditor](/skills/security/least-privilege-auditor) inventories principals (service accounts, cloud roles, database users, CI tokens, agents, MCP servers, long-lived keys), expands what each is granted including inherited roles and wildcards, and compares that with what the code and workflows actually require. Each grant is classified `required`, `unused`, `excess scope`, `temporary`, or `unverified`, and findings are ordered by blast radius: wildcard write or admin access and cross-environment scope come before read-only excess.

The output includes a proposed policy diff and a staged rollout: create the reduced role beside the old one, canary it, watch for denials, then remove the old role. It warns against dropping a permission only because a short log window shows no use; recovery and failover paths need an owner and a test first.

## 7. review-tests: do the tests verify anything

[review-tests](/commands/review/review-tests) takes a test file or area and reads each test beside the production code it covers. It is read-only and does not run the suite. It sorts weaknesses into six categories: change-detector tests coupled to implementation, happy-path only, weak assertions (`toBeDefined`, "didn't throw"), non-deterministic or non-isolated tests, over-mocking, and coverage theatre. It then lists the highest-value missing tests by blast radius, each with a specific input and expected result.

With no argument it asks which area to review instead of scanning everything.

## 8. coverage-gap-finder: which untested branches to cover first

[coverage-gap-finder](/skills/testing/coverage-gap-finder) runs the coverage tool the project already uses and parses the machine-readable report, for example:

```bash
npx vitest run --coverage --coverage.reporter=json
```

It ranks gaps by risk, not size: uncovered `catch` blocks, branches with no covered alternative, input validation, and central modules such as auth, payments, and persistence rank above getters and generated code. For each top gap it names the uncovered branch and proposes test cases specific enough to hand to [test-scaffolder](/skills/testing/test-scaffolder). It also lists what to skip and says when the remaining gaps are not worth testing.

It complements review-tests: one finds code with no test, the other finds tests with no teeth.

## 9. license-compliance-checker: what a new dependency obliges you to do

[license-compliance-checker](/skills/security/license-compliance-checker) first establishes your own license and distribution model (closed-source SaaS, distributed binary, or open-source library), because the same dependency license can be fine for one and a blocker for another. It enumerates licenses across the installed tree with `license-checker`, `pip-licenses`, `go-licenses`, or `cargo deny`, classifies each as permissive, weak copyleft, strong copyleft, or unknown, and flags only real conflicts, such as AGPL in a SaaS or a package with no license at all.

Its output is an engineering aid. The skill states that it is not legal advice and that material conflicts go to counsel.

## Situational picks

Three skills that appeared in earlier versions of this list are useful around a review but are not reviewers of a diff:

- [bundle-analyzer](/skills/performance/bundle-analyzer) measures the production build and ranks size reductions. Run it when a PR adds a client-side package.
- [dead-code-finder](/skills/refactor/dead-code-finder) finds unreferenced exports, files, and dependencies, then deletes them one at a time with a build and test run after each. It changes code, so run it as its own cleanup PR.
- [skill-auditor](/skills/workflow/skill-auditor) audits a whole `.claude/skills/` directory for overlapping descriptions, weak triggers, and tool grants broader than the procedure. Run it when a PR adds a skill.

## A practical review stack

```bash
npx agentscamp add commands/review-pr
npx agentscamp add commands/security-scan
npx agentscamp add skills/dependency-audit
npx agentscamp add skills/auth-flow-reviewer
npx agentscamp add skills/coverage-gap-finder
```

Add `least-privilege-auditor` if the repo holds infrastructure or CI configuration, `secret-scanner` if no scanner runs in pre-commit, and `license-compliance-checker` if you ship a binary or a closed-source service.

## Continue exploring

- [9 Best Claude Skills for Software Testing](/guides/skills/best-claude-skills-for-testing) — Scaffolding, coverage, mutation, contract, and end-to-end testing skills.
- [10 Best Claude Skills for Security Work](/guides/skills/best-claude-skills-for-security) — The security picks above in a full security workflow, plus threat modeling and headers.
- [10 Best Claude Skills for Refactoring](/guides/skills/best-claude-skills-for-refactoring) — What to run after the review, when findings call for structural change.
