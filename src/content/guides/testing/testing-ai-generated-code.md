---
title: "How to Test AI-Generated Code"
description: "AI writes the code; tests decide whether to trust it. The verification stack for agent-written changes — contracts, generated tests, and the review that's left."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["review-qa"]
tags: ["testing", "ai-code", "verification", "quality"]
featured: true
summary: "When AI writes the code, tests stop being quality assurance and become the acceptance contract — the thing that makes accepting a diff safe. The working stack: define done as a test before the agent starts, let agents generate broad coverage but review the assertions, keep mutation-level skepticism for critical paths, and reserve humans for what tests can't see — intent, security, design."
keyTakeaways:
  - "Role reversal: with human code, tests catch mistakes; with AI code, tests ARE the acceptance criteria — write 'done means this passes' before the agent starts."
  - "Beware the self-grading trap: an agent writing both code and tests can encode the same misunderstanding in both. Review the tests (small, readable) even when you skim the code."
  - "AI-generated tests are excellent at breadth (edge cases, table cases, regression scaffolds) and weak at knowing what MATTERS — humans supply the assertions that carry intent."
  - "Behavioral coverage beats line coverage for accepting agent code: a suite that exercises the contract honestly beats 95% lines of assertion-free execution."
  - "Tests can't see everything: injection that works correctly, quietly weakened checks, unmaintainable structure — that residue is exactly what human review and security scans still own."
faq:
  - q: "Should the same agent write the code and its tests?"
    a: "It's fine for breadth, dangerous for truth. An agent that misread the requirement writes code and tests that agree with each other — green suite, wrong behavior. The fixes: write (or review) the defining test yourself before implementation, have a separate session/agent test the diff blind from the requirements, and always read the assertions — they're short, and they're where the lie would live."
  - q: "Is line coverage a good bar for AI code?"
    a: "It's a floor, not a bar. Agents hit coverage targets effortlessly by executing lines with weak assertions. What you want is behavioral coverage: the contract's promises each pinned by a test that would actually fail if broken. Five honest assertions beat fifty smoke tests."
  - q: "What can't tests catch in AI-generated code?"
    a: "The classics: vulnerabilities that function correctly (injection, authz gaps — run security review separately), performance and resource behavior under load, architectural fitness (will anyone be able to extend this?), and silent scope drift — code that does more than asked. Tests verify the contract; humans verify the intent and the blast radius."
  - q: "How do I retrofit confidence onto an already-merged pile of AI code?"
    a: "Characterization first: generate tests that pin CURRENT behavior (the coverage-gap-finder skill targets the valuable untested paths), review those assertions against intent — every mismatch found is a latent bug surfaced — then refactor with the safety net in place. It's archaeology, but it converts 'nobody read this' into 'this is now specified.'"
related: ["tdd-with-ai-agents", "write-tests", "test-scaffolder", "coverage-gap-finder", "test-engineer", "vibe-coding-guide", "ai-code-review-workflow"]
---

The uncomfortable math of 2026: AI writes a huge share of new code, and nobody — not even the diligent — reads all of it the old way. That isn't a scandal; it's a redefinition. **Verification, not authorship, is now the engineering**, and tests are its primary instrument. Here's how testing changes when the code under test came from an agent.

## Tests become the contract, not the afterthought

With human code, tests trail implementation and catch slips. With agent code, the high-leverage move is inversion: **define "done" as an executable test before the agent starts.** "Implement rate limiting — done means `rate-limit.test.ts` passes, including the burst and clock-skew cases" turns acceptance from vibes into a checkable artifact — and you review the *test* (twenty readable lines of intent) instead of pretending to review three hundred lines of diff. This is the practical core of making [vibe-speed development](/guides/prompting/vibe-coding-guide) safe, and it's the agent-era version of [TDD](/guides/testing/tdd-with-ai-agents).

## The self-grading trap

The signature failure mode: one context writes both implementation and tests, so a misunderstanding lands in both, and the suite turns green around the wrong behavior. Defenses, in increasing strength:

- **Read the assertions.** Always. They're small, and they're where misunderstanding shows.
- **Anchor with your own defining test** — even one — written from the requirement, not the diff.
- **Blind-test the diff**: a separate session (or the [test-engineer](/agents/quality-security/test-engineer) agent) gets the requirements and the code, *not* the implementer's reasoning, and writes tests from spec. Disagreement between suites is signal, exactly like a [fresh-eyes critic](/guides/advanced/multi-agent-orchestration).

## What agents test well — and what you must add

Let agents do what they're excellent at: **breadth.** Edge cases humans skip (empty inputs, unicode, boundary values), table-driven case generation, regression scaffolds around legacy code ([test-scaffolder](/skills/testing/test-scaffolder) and [write-tests](/commands/testing/write-tests) package this). What they don't know is **what matters** — which behaviors carry the business, which invariants are sacred, which failure would page someone. That's the human contribution: a handful of assertions encoding intent, ranked effort via [coverage-gap-finder](/skills/testing/coverage-gap-finder) on the paths that count, and **mutation-level skepticism** on critical code — break the implementation deliberately and confirm the suite notices. A suite that can't fail is documentation cosplay.

## The residue humans still own

Tests verify the contract; they're blind to whole categories an agent can get wrong while staying green: **security that functions** (injection with correct output — run [security review](/commands/review/security-scan) as its own pass), **performance under load**, **architecture** (extensibility, coupling, the month-six bill), and **quiet scope creep** — code that does more than asked. That's the rubric for the human pass in your [review workflow](/guides/workflow/ai-code-review-workflow): skip re-deriving what tests already prove; spend entirely on what they can't see.

The summary discipline fits on a sticky note: **before** — a test defines done; **during** — the agent iterates against it; **after** — read assertions, scan security, judge design. Code volume scaled with AI; this is how confidence scales with it.
