---
title: "Vibe Coding in 2026: What It Is, When It Works, When It Bites"
description: "An honest guide to vibe coding — where prompt-and-accept development genuinely pays, where it accumulates risk, and the guardrails that make it professional."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["workflow-prompting"]
tags: ["vibe-coding", "ai-coding", "workflow", "agents"]
featured: true
summary: "Vibe coding means describing what you want and accepting AI-written code, judging it by running it instead of reading it. It fits prototypes, internal tools and exploration, and bites on auth, payments and long-lived code. The professional version keeps the speed and adds checkpoints, test-first prompts, permission rules and review scaled to risk."
keyTakeaways:
  - "The term (Karpathy, February 2025) named a real shift: the bottleneck moved from writing code to specifying intent and verifying behavior."
  - "Vibe coding is a risk posture, not a skill level — the question is never 'is it okay' but 'what happens if this code is wrong here.'"
  - "Where it shines: prototypes, internal tools, one-off scripts, UI exploration, learning — places where iteration speed beats rigor and failure is cheap."
  - "Where it bites: auth, payments, data handling, anything maintained for years by people who never read it — silent assumptions and security holes compound."
  - "The professional adaptation isn't reading every line; it's engineering the verification: tests define done, permissions bound the agent, git checkpoints make wrong turns cheap, review scales with stakes."
faq:
  - q: "What does vibe coding actually mean?"
    a: "Building software by telling an AI what you want and accepting its implementation, evaluating results by running them rather than line-by-line review. Karpathy's framing — 'fully give in to the vibes' — described the pure form; in practice it spans a spectrum from accept-everything prototyping to agent-assisted engineering with verification."
  - q: "Is vibe coding bad engineering?"
    a: "It's mismatched engineering when stakes and verification don't line up. Unreviewed code in a throwaway prototype is fine; in a payment path it's negligence. The craft in 2026 is choosing your point on the spectrum per task — and building the verification (tests, types, CI, review) that lets you accept code safely instead of just hopefully."
  - q: "How do I vibe code without shipping garbage?"
    a: "Four habits: commit before every agent task so rollback is one command; write (or have the agent write) the test first so 'done' is checkable; scope what the agent may touch with permissions; and review proportional to blast radius — skim the throwaway script, read the auth change like it's radioactive. Speed comes from the agent; safety comes from the harness."
  - q: "Did vibe coding replace programming jobs?"
    a: "It replaced the blank page and the boilerplate. What it amplified is everything around the code: specifying intent precisely, designing verification, reviewing consequential changes, owning architecture. In Stack Overflow's 2026 developer survey, 73% of respondents use coding assistants or agents daily, yet trust is conditional: 48% trust AI when they can easily validate the answer, and only 16% extend that trust to most tasks that are not important work decisions. The job tilted toward direction and judgment."
  - q: "How many developers actually vibe code?"
    a: "Fewer than the discourse suggests. In Stack Overflow's 2025 developer survey, 72% of respondents said vibe coding was not part of their professional work and another 5% were emphatic that it was not, even though 84% were using or planning to use AI tools. Most professional use is AI-assisted engineering with review, not accept-everything."
sources:
  - title: "Andrej Karpathy's original 'vibe coding' post"
    url: "https://x.com/karpathy/status/1886192184808149383"
    publisher: "X"
  - title: "2025 Stack Overflow Developer Survey: AI"
    url: "https://survey.stackoverflow.co/2025/ai"
    publisher: "Stack Overflow"
  - title: "2026 Stack Overflow Developer Survey: AI"
    url: "https://survey.stackoverflow.co/2026/ai"
    publisher: "Stack Overflow"
  - title: "Claude Code: configure permissions"
    url: "https://code.claude.com/docs/en/permissions"
    publisher: "Anthropic"
  - title: "Claude Code: hooks reference"
    url: "https://code.claude.com/docs/en/hooks"
    publisher: "Anthropic"
related: ["glossary:vibe-coding", "guide:what-is-claude-code", "guide:spec-driven-development", "guide:best-ai-app-builders-2026", "guide:prompt-patterns", "guide:claude-code-settings-permissions", "guide:testing-ai-generated-code"]
audience: ["ai-engineers", "founders"]
---

[Vibe coding](/glossary/vibe-coding) got named as a joke and stuck as a fact: describing intent and accepting AI-written code is now how a great deal of software begins. The discourse split into cheerleading and doom; both miss the useful question. Vibe coding isn't good or bad. **It's a risk posture**, and the craft is matching it to stakes.

## What actually changed

Andrej Karpathy coined the term in February 2025: "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists." The same post is candid about the method ("I 'Accept All' always, I don't read the diffs anymore") and about its scope: "It's not too bad for throwaway weekend projects." The caveat got quoted less than the slogan.

The mechanical shift underneath: agents made *implementation* cheap and fast, so the binding constraints moved to **specification** (can you say precisely what you want?) and **verification** (can you tell whether you got it?). Prompt, accept, run, re-prompt is development where verification is just *running the thing*. That's a sound loop **when running the thing is sufficient verification**, and a trap when it isn't.

Survey data says most professionals know the difference. In Stack Overflow's 2025 developer survey, 84% of respondents were using or planning to use AI tools, yet 72% said vibe coding was not part of their professional work, more developers distrusted the accuracy of AI output (46%) than trusted it (33%), and the top frustration, cited by 66%, was "AI solutions that are almost right, but not quite". The 2026 edition reports 73% using coding assistants and agents daily, with trust still conditional: 48% trust AI when they can easily validate the answer.

## Where the pure form genuinely shines

- **Prototypes and demos** — the artifact's job is to exist by Friday; the [app builders](/guides/comparisons/best-ai-app-builders-2026) industrialized exactly this.
- **Internal tools and one-off scripts** — small blast radius, observable behavior, short lifespan.
- **UI exploration** — taste is the test; iterating on looks via prompts beats hand-coding variants.
- **Learning and spiking** — watching an agent build something is a fast way to map unfamiliar territory.

The common thread: **failure is cheap and visible**. If wrong code can't hurt much and you'd notice, accept away.

## Where it bites

The failure mode isn't dramatic. It's *accumulation*. Generated code carries silent assumptions (happy paths, trusted inputs, naive concurrency) that run fine in the demo and fail under real use. The classic bite points: **auth and permissions**, **money**, **data handling and migrations**, **anything secured**, and, most underrated, **anything that will be maintained for years by people who never read it**. Behavior-testing can't see a SQL injection that works correctly, a quietly disabled check, or an architecture nobody can extend. At month six, unreviewed accept-streams become a codebase no human holds in their head.

## The professional version

Teams that get the speed without the wreckage don't read every line. They **engineer the acceptance**:

1. **Checkpoint relentlessly.** Commit before every agent task; a wrong turn becomes `git reset`, not archaeology. (Worktrees make [parallel vibe-sessions](/guides/advanced/parallel-claude-code-worktrees) safe too.)
2. **Make tests the contract.** "Done = this test passes" turns vibes into verification. The agent can write the test first, and you review *the test* (small, readable) instead of the diff. The full discipline: [Testing AI-Generated Code](/guides/testing/testing-ai-generated-code).
3. **Bound the agent.** [Permissions](/guides/configuration/claude-code-settings-permissions) and [hooks](/guides/configuration/claude-code-hooks) define what's accept-without-asking versus gated, so you encode your risk posture once instead of deciding per prompt.
4. **Scale review to blast radius.** Skim the script, read the middleware, *interrogate* the auth change.
5. **Specify before big work.** For anything substantial, a written spec the agent implements against beats twenty corrective prompts. That's [spec-driven development](/guides/workflow/spec-driven-development), vibe coding's grown-up sibling.

## One feature, with the guardrails on

Here is the whole loop for a small real change: adding CSV export to an orders page. The examples use Claude Code's configuration format; other agents have equivalents.

**Checkpoint.** Start from a clean tree on a branch, so undoing the session is one command:

```bash
git switch -c feat/orders-csv-export
git status --short          # should print nothing
# ...agent works...
git diff --stat             # what changed, at a glance
git reset --hard && git clean -fd   # throw the attempt away: reverts edits, deletes new files
```

**Test-first prompt.** Ask for the test, stop, and read it before any implementation exists:

```text
Write a failing test first, then stop.

Feature: GET /orders/export.csv returns the signed-in user's orders as CSV.
Test file: tests/orders/export.test.ts
Cases: (1) header row is id,created_at,total,status
       (2) only the signed-in user's orders are included
       (3) a value containing a comma or quote is escaped correctly
       (4) an unauthenticated request gets 401

Do not write the implementation yet. Run the test and show me that it fails.
```

Case 2 and case 4 are the ones a happy-path generation skips, which is why you name them. Once the test reads right, the second prompt is short: "Implement it until these tests pass. Do not edit the test file."

**Permission rules.** In `.claude/settings.json`, pre-approve the boring commands and deny the dangerous ones. Anything not listed still prompts:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)"
    ],
    "deny": [
      "Bash(git push *)",
      "Read(./.env)",
      "Read(./secrets/**)",
      "Edit(/migrations/**)"
    ]
  }
}
```

Deny rules win over allow rules. They are a guardrail, not a sandbox: Anthropic's docs note that a `Bash` deny rule doesn't match the same program invoked by path or inside `sh -c`, so pair them with sandboxing when a restriction must hold.

**A hook for the check you always forget.** This runs a script after every file edit; with `PostToolUse` the edit has already happened, and whatever the script prints to stderr is shown to the agent so it can fix the problem:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "/path/to/lint-check.sh" }
        ]
      }
    ]
  }
}
```

**Review by blast radius.** Decide the depth before you open the diff:

| What changed | If it's wrong | Review depth |
| --- | --- | --- |
| Throwaway script, prototype, spike | You rerun it | Run it; skim for anything destructive |
| UI copy, styling, layout | Visible immediately | Look at the result, not the code |
| Internal tool with real data | Bad report, wasted hour | Read the data-touching parts; check queries |
| Business logic in production | Wrong numbers reach users | Read the diff; require tests for each rule |
| Auth, payments, permissions, migrations, anything parsing untrusted input | Breach, lost money, lost data | Read every line; second reviewer; test the failure paths yourself |
| Dependencies, CI, build and deploy config | Supply-chain or pipeline compromise | Verify each new package and each permission change by hand |

For the CSV export, the row is "business logic in production" with one "auth" cell: read the query that scopes orders to the signed-in user as if it were the only line in the diff, because for security purposes it is.

## How it still goes wrong with guardrails

- **The agent edits the test to pass.** State "do not edit the test file", and check `git diff --stat` for it.
- **Tests that assert the implementation, not the behavior.** A test written after the code tends to bless whatever the code does. Test first, or review the test hardest.
- **Checkpoint drift.** Twenty accepted turns without a commit is one giant unreviewable diff. Commit at every green state.
- **Permission fatigue.** If you approve every prompt without reading, the gate is decoration. Allow more of the safe commands so the remaining prompts mean something.
- **Review inflation.** Reading everything "carefully" means reading nothing carefully. Spend the attention where the table says to.

The endpoint is a useful redefinition: vibe coding isn't the absence of engineering. It's engineering relocated from writing code to **directing and verifying** it. Do that deliberately and you keep the speed that made the term famous without the month-six bill.
