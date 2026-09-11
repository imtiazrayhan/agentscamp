---
title: "10 Best Claude Skills for Debugging"
description: "Compare Claude skills and commands for stack traces, failing and flaky tests, regressions, slow queries, memory leaks, CPU hotspots, deadlocks, and agents."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["review-qa", "workflow-prompting"]
audience: ["developers"]
tags: ["claude-skills", "debugging", "root-cause-analysis", "flaky-tests", "incident-response", "best-of"]
seoTitle: "10 Best Claude Skills for Debugging"
seoDescription: "The best Claude debugging skills and commands for stack traces, failing and flaky tests, git bisect, slow queries, memory leaks, CPU profiles, and deadlocks."
summary: "Match the tool to your evidence: explain-error and fix-failing-test for everyday failures, flaky-test-diagnoser for unstable tests, and git-bisect for regressions. For production incidents add query-plan-analyzer, memory-leak-hunter, flamegraph-analyzer, and deadlock-diagnoser; use agent-trajectory-evaluator when an AI agent is failing."
keyTakeaways:
  - "Choose a debugging tool by the evidence you hold: an error, a failing or flaky test, a known-good commit, a query plan, a heap snapshot, a CPU profile, or a deadlock report."
  - "Nearly every pick starts by reproducing or capturing the failure; a diagnosis without a reproduction is still a hypothesis."
  - "explain-error, find-bug, and git-blame-investigator stop at a diagnosis, while fix-failing-test and the debugger agent apply the fix and re-run the tests."
  - "Retries and longer timeouts only contain flaky tests and deadlocks; both skills fix the underlying state, timing, or lock order first."
  - "For AI agents, grade the trajectory (tool choice, arguments, steps, recovery, completion), not just the final answer."
faq:
  - q: "Is there a debugging skill for Claude Code?"
    a: "Yes. For a pasted error or stack trace, the explain-error command finds the root cause without changing files, and fix-failing-test repairs one failing test after deciding whether the test or the code is wrong. Skills such as flaky-test-diagnoser, memory-leak-hunter, and deadlock-diagnoser cover intermittent and production-only failures."
  - q: "What does a diagnoser skill do in Claude?"
    a: "flaky-test-diagnoser reruns an unstable test in repeated, reordered, isolated, parallel, and seeded configurations to isolate what flips the result. deadlock-diagnoser reads the database engine's own deadlock report, reconstructs the lock cycle, and fixes the lock-acquisition order before adding a retry for the victim."
  - q: "Should I use a debugging command, a skill, or the debugger agent?"
    a: "Use a command for one bounded procedure you trigger yourself, such as explain-error on a stack trace. Use a skill when the job needs a specialist method, such as diffing heap snapshots or reading a query plan. Use the debugger subagent to hand off the whole reproduce, hypothesize, fix, and verify loop."
  - q: "Can these skills debug production systems safely?"
    a: "The production skills work from evidence such as EXPLAIN ANALYZE output, heap snapshots, CPU profiles, and deadlock reports, and their allowed tools include Bash but not Edit. Review each command before it runs against a live system; query-plan-analyzer wraps write queries in a rolled-back transaction because EXPLAIN ANALYZE executes them."
related: ["guide:best-claude-skills-for-testing", "guide:debugging-ai-agents", "command:explain-error", "skill:flaky-test-diagnoser", "skill:memory-leak-hunter", "skill:deadlock-diagnoser"]
---

The best Claude debugging skill is the one that matches the evidence in front of you. A stack trace, a failing test, a flaky CI run, a known-good commit, a slow query plan, a growing heap, a hot CPU profile, and a deadlock report each call for a different method, and asking Claude to "find the bug" without that evidence invites guesses.

The picks below run from the problems developers hit daily to rarer production incidents. Three are slash commands; the other seven are skills.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [explain-error](/commands/analyze/explain-error) (command) | An error or stack trace | Root cause and proposed fix | No |
| [fix-failing-test](/commands/testing/fix-failing-test) (command) | One failing test | Fix to the test or the code | Yes |
| [flaky-test-diagnoser](/skills/testing/flaky-test-diagnoser) | Intermittent test failures | Trigger, failure rate, fix | Proposes fix |
| [git-bisect](/commands/git/git-bisect) (command) | A regression with a known-good ref | First bad commit and cause | No (checks out commits) |
| [git-blame-investigator](/skills/git/git-blame-investigator) | A suspicious line | Origin commit and verdict | Only an ignore-revs file |
| [query-plan-analyzer](/skills/database/query-plan-analyzer) | One query that got slow | Annotated plan, before/after | No; runs queries and DDL |
| [memory-leak-hunter](/skills/performance/memory-leak-hunter) | Memory that climbs to OOM | Heap diff and retention path | Proposes diff |
| [flamegraph-analyzer](/skills/performance/flamegraph-analyzer) | CPU-bound slowness | Hotspot report | Proposes fix |
| [deadlock-diagnoser](/skills/database/deadlock-diagnoser) | Deadlock errors under load | Lock cycle and ordering fix | Proposes fix |
| [agent-trajectory-evaluator](/skills/data/agent-trajectory-evaluator) | A misbehaving AI agent | Scores and baseline diff | Report and code |

## 1. explain-error: turn a stack trace into a root cause

[explain-error](/commands/analyze/explain-error) is a slash command that takes the raw error as its argument: an exception, a stack trace, a compiler or type error, or failing log output. It finds the first stack frame inside your repository rather than in `node_modules` or the standard library, reads the code around it, and states the root cause one level beneath the message. It confirms the hypothesis with read-only checks, such as re-running the failing command, and never changes files.

When the cause is ambiguous, it returns ranked candidates, each with the one read-only check that would confirm or rule it out. Use it first on any new error: it is the cheapest way to turn "Cannot read properties of undefined" into "this Promise is never awaited".

## 2. fix-failing-test: decide which side is wrong

[fix-failing-test](/commands/testing/fix-failing-test) scopes the run to one test, reads the expected and actual values, and traces from the assertion back to the code under test. Its key step is an explicit verdict before any edit: is the test wrong (a stale expectation, bad fixture, or brittle snapshot) or is the code wrong? It then applies the smallest fix to that side and re-runs the target, the file, and the full suite.

It refuses the shortcuts that turn a red test green without fixing anything: loosening an exact match, widening a tolerance, adding `.skip`, or editing the expected value to match buggy output. It leaves the change uncommitted for you to review.

## 3. flaky-test-diagnoser: find the condition that flips the result

[flaky-test-diagnoser](/skills/testing/flaky-test-diagnoser) handles the test that passes and fails without a relevant code change. It records the failure signature, measures a baseline failure rate over repeated runs, then varies one dimension at a time: isolated versus full suite, serial versus parallel, fixed versus random order, controlled versus real time. It classifies the trigger (leaked state, fixed ports, unseeded randomness, clock assumptions, or a true race) and bisects preceding tests when order matters.

Before adding waits or mocks, it asks whether the test exposed a real product race, and if the cause stays unknown it names the next experiment. The [testing list](/guides/skills/best-claude-skills-for-testing) points to it as a follow-on; here it is the default for any test that fails one run in twenty.

## 4. git-bisect: pin the first bad commit

[git-bisect](/commands/git/git-bisect) is for regressions with a known-good point, such as a release tag. Its first job is a fast, deterministic reproduction that exits 0 on good code and non-zero on bad. It runs that command several times on the bad ref and stops if the result varies, because a flaky reproduction makes bisect blame the wrong commit. It then drives `git bisect run`, using exit code 125 to skip commits that will not build, and reads the culprit's diff to explain the cause rather than just reporting a SHA.

It requires a clean working tree and will not stash on your behalf. It always finishes with `git bisect reset`, so you are not left on a detached HEAD.

## 5. git-blame-investigator: learn why the suspect line exists

Once you have a suspect commit or a line that looks wrong, [git-blame-investigator](/skills/git/git-blame-investigator) reconstructs its intent before you delete it. It sees past formatting and rename commits with `--ignore-rev` and a `.git-blame-ignore-revs` file, follows moved lines with `-C -C -M`, and uses `git log -L` and the pickaxe (`-S`, `-G`) to find when a string or value appeared. It reads the full commit message, the diff, and the PR discussion.

It ends with one of three verdicts: safe to remove, do not touch, or needs a test first, each tied to a cited commit. The skill calls deleting code of unknown purpose the most common way regressions return.

## 6. query-plan-analyzer: explain a query that got slow

When one endpoint slows down after a deploy or data growth, [query-plan-analyzer](/skills/database/query-plan-analyzer) pulls the real plan with `EXPLAIN (ANALYZE, BUFFERS)` instead of bare `EXPLAIN` estimates and reads it from the most expensive node outward. It checks the estimated-versus-actual row gap first: a gap over about 10x points to stale statistics, which it fixes with `ANALYZE` before proposing any index. It then maps the symptom (a Seq Scan, a Nested Loop blowup, a disk Sort, a non-sargable predicate) to one fix and re-runs the plan to prove the bad node is gone.

Because `EXPLAIN ANALYZE` executes the statement, it wraps writes in `BEGIN; ... ROLLBACK;`. The [database list](/guides/skills/best-claude-skills-for-database-work) covers it for tuning; here it is the incident tool for "this query was fast yesterday".

## 7. memory-leak-hunter: stop the OOM restart loop

[memory-leak-hunter](/skills/performance/memory-leak-hunter) starts by proving there is a leak. It drives a steady workload, samples RSS and heap with forced garbage collection, and stops if memory plateaus or recovers, since warmup, JIT, and cache fill are not leaks. For a confirmed leak it takes two heap snapshots under load, diffs them to find the object type whose count and retained size keep climbing, and follows its retention path to the root: an unbounded cache, a listener never removed, an uncleared timer, or a captured closure.

Its report pairs that path with a concrete diff at the root and a post-fix memory trace that must flatten under the same workload. Use it when a process keeps getting OOM-killed or a scheduled restart is quietly hiding growth.

## 8. flamegraph-analyzer: find where the CPU went

For a request or job that is slow and CPU-bound, [flamegraph-analyzer](/skills/performance/flamegraph-analyzer) captures a sampling profile under a realistic workload (`perf`, async-profiler, `py-spy`, `pprof`, or the Node profiler) and reads it correctly: width is time, and the y-axis is stack depth, not a timeline. It ranks the widest self-time leaves and classifies each as unnecessary, redundant, or algorithmically wrong.

Its most useful incident check: if wall-clock latency is high but the on-CPU graph is thin, the time is spent waiting on I/O or locks, so it switches to an off-CPU or wall-clock profile. It fixes the biggest contributor and then re-profiles, because the bottleneck moves after every fix.

## 9. deadlock-diagnoser: reconstruct the lock cycle

[deadlock-diagnoser](/skills/database/deadlock-diagnoser) works from the engine's own deadlock report: the Postgres server log, the SQL Server deadlock graph, or `SHOW ENGINE INNODB STATUS` in MySQL. It writes out who held which lock and who wanted which, then greps every transaction touching those resources to find the inconsistent acquisition order, including hidden orders from unordered `IN (...)` lists or ORM write ordering.

The fix order is deliberate: enforce one lock order, shorten the transaction so no network call sits between `BEGIN` and `COMMIT`, and only then retry the victim by its error code. It also separates true deadlocks from plain lock-wait timeouts, which need a different fix.

## 10. agent-trajectory-evaluator: debug the path, not the answer

When the program misbehaving is an AI agent, the final answer rarely shows where it went wrong. [agent-trajectory-evaluator](/skills/data/agent-trajectory-evaluator) captures each step as a structured record (decision, tool, arguments, result, error flag, latency) and scores runs on five axes: tool selection, argument correctness, step efficiency, error recovery, and goal completion. It asserts the checkable axes in code and reserves an LLM judge for single subjective steps.

Its baseline diff flags a regression even when the answer still passes, such as two extra steps or a new retry loop. Pair it with [Why Your Agent Loops: Debugging AI Agents](/guides/troubleshooting/debugging-ai-agents).

## Commands and an agent for bugs without a trace

Two more commands cover symptoms that arrive without an error message. [find-bug](/commands/review/find-bug) takes a symptom, builds a reproduction, ranks testable hypotheses, tests them one variable at a time, and reports the root cause with a suggested fix it does not apply. [trace-data-flow](/commands/analyze/trace-data-flow) is read-only: it follows one field or variable from source to sink across renames and flags validation gaps, unit or type mismatches, and sensitive values in logs. Use it when prices come out 100 times too large because one layer stores cents and another displays dollars.

To hand off the whole loop, the [debugger](/agents/quality-security/debugger) subagent reproduces the failure, tests one falsifiable hypothesis at a time, applies the minimal fix, verifies it against the original reproduction, and adds a guarding test where reasonable.

## Recommended debugging stacks

For day-to-day work, install the commands that cover most tickets, the flaky-test skill, and the debugger agent:

```bash
npx agentscamp add commands/explain-error
npx agentscamp add commands/fix-failing-test
npx agentscamp add commands/git-bisect
npx agentscamp add skills/flaky-test-diagnoser
npx agentscamp add agents/debugger
```

For production incidents on a database-backed service, add the evidence readers:

```bash
npx agentscamp add skills/query-plan-analyzer
npx agentscamp add skills/memory-leak-hunter
npx agentscamp add skills/flamegraph-analyzer
npx agentscamp add skills/deadlock-diagnoser
```

Whichever you run, ask Claude for the reproduction command, the evidence that confirmed the cause, and the before-and-after result. Without a reproduction, a diagnosis is still a hypothesis.

## Continue exploring

- [The Best Claude Skills to Install in 2026](/guides/skills/best-claude-skills-2026) — A skills-only tour of the AgentsCamp library, organized by the job each skill does.
- [How to Install Claude Skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
- [9 Best Claude Skills for Performance Engineering](/guides/skills/best-claude-skills-for-performance) — The same profiling skills applied to tuning rather than incidents.
