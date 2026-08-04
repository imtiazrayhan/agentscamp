---
title: "Codex Automations: Schedule Reliable Background Work"
description: "Schedule Codex tasks for recurring checks and follow-ups — choose chat or standalone runs, local projects or worktrees, skills, permissions, and stopping rules."
author: "AgentsCamp"
date: 2026-08-04
color: "cyan"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["codex", "automations", "scheduled-tasks", "worktrees", "openai"]
featured: true
summary: "Codex scheduled tasks run repeatable work in the background on a cadence or inside an existing chat. Reliable automations begin as manually tested prompts, define what to inspect and when to stay quiet, use skills for reusable method, and run with the narrowest permissions that work. Local Git tasks should prefer isolated worktrees when edits could collide with active development."
keyTakeaways:
  - "Automate only after the prompt or skill works reliably by hand; scheduling multiplies ambiguity as well as value."
  - "Use a standalone scheduled task for independent runs and an in-chat schedule when the workflow must retain the conversation's context."
  - "Desktop tasks can use local projects and worktrees; web tasks use uploaded context and connected tools, not folders on your computer."
  - "Skills define the method and scheduled tasks define the cadence; invoke the skill explicitly when routing must be deterministic."
  - "Unattended tasks need narrow permissions, explicit no-change behavior, reviewable output, and a clear stop or escalation condition."
faq:
  - q: "Can Codex run scheduled tasks?"
    a: "Yes. Scheduled tasks can run in the background from supported ChatGPT web and desktop experiences. Desktop tasks can target local projects, including isolated Git worktrees. The CLI and IDE extension can help prepare the workflow but do not provide the Scheduled management interface."
  - q: "Should a scheduled task use a worktree?"
    a: "Use a worktree when a Git-based task may edit files and should stay isolated from your active checkout. Run directly in the local project only when intentional edits to that checkout are safe. Read-only reporting tasks may not need the extra isolation."
  - q: "What is the difference between a scheduled task and a skill?"
    a: "A skill defines how to perform a repeatable workflow; a scheduled task defines when and where it runs. A scheduled prompt can invoke a skill explicitly so the procedure stays versioned, testable, and reusable outside the schedule."
  - q: "How should an unattended Codex task handle approvals?"
    a: "Design it to succeed inside its default sandbox without interactive approval. Grant only the filesystem, network, and tool access it needs, prefer read-only checks where possible, and make blocked or risky actions produce a report instead of attempting a workaround."
related: ["openai-codex-guide", "codex-skills-guide", "codex-subagents", "parallel-claude-code-worktrees", "github-actions-optimizer", "human-in-the-loop-ai-workflows"]
howtoSteps:
  - name: "Prove the workflow manually"
    text: "Run the exact prompt or skill in a normal chat until its inputs, output, and failure behavior are predictable."
  - name: "Choose continuity and environment"
    text: "Use a standalone task for independent runs, an in-chat task for ongoing context, and a worktree when local file edits need isolation."
  - name: "Write a durable run contract"
    text: "State what to inspect, the time window, tools and project, what counts as important, what to do when nothing changed, and when to stop or escalate."
  - name: "Set the narrowest permissions"
    text: "Allow only the filesystem, network, plugins, and actions required for the tested workflow."
  - name: "Review early runs"
    text: "Inspect the first few executions for noise, missed events, unsafe side effects, and stale worktrees before trusting the schedule."
---

**Codex automations are scheduled tasks that rerun a prompt or workflow in the background.** They are useful for recurring maintenance, monitoring, and follow-up: checking CI, summarizing recent changes, drafting release notes, scanning a project for likely regressions, or revisiting a long-running operation until it completes.

The hard part is not the schedule. It is making the work deterministic enough to run without live steering. A vague prompt that is tolerable once becomes a stream of noisy reports or risky edits when repeated every hour.

## Start with a workflow, then add time

Before scheduling anything, run the exact prompt manually. Confirm that it:

- finds the right inputs without hidden context
- distinguishes a real finding from routine noise
- returns a stable, reviewable output
- behaves sensibly when there is nothing to report
- stops or asks for help when required context is missing
- completes within the intended permissions

If the method needs several steps, encode it as a [skill](/guides/skills/codex-skills-guide) first. The skill defines **how** to do the work; the scheduled task defines **when**, **where**, and **how often**.

## Standalone task or scheduled chat?

Use a **standalone scheduled task** when every run should begin from the saved prompt and produce an independent result. Examples: a weekly repository health report or a daily dependency scan.

Schedule work **inside an existing chat** when each run should return to the same thread and use its context. Examples: poll a deployment until it completes, revisit a PR until checks are green, or continue an incident-monitoring loop where prior observations matter.

The distinction is continuity:

| Mode | Context | Best for |
| --- | --- | --- |
| Standalone | Saved prompt and configured sources | Independent recurring reports and maintenance |
| In-chat | Existing conversation plus its tools and context | Follow-ups, polling, and stateful monitoring |

## Local project, worktree, or web

Desktop scheduled tasks can work with local projects. The machine must remain on, the app must be running, and the project must still be available when the run starts.

For Git repositories, choose between:

- **Local project** — the task works directly in your checkout. Use this only when touching the same files as active development is acceptable.
- **Worktree** — each run works in an isolated checkout. Prefer this for tasks that may edit code, create commits, or otherwise collide with unfinished local work.

Web scheduled tasks can use uploaded files, connected tools, plugins, and skills available to the chat, but they cannot directly operate on a folder on your computer. Put required context in an accessible project or integration rather than assuming the web task can see local state.

The Codex CLI and IDE extension do not provide the Scheduled management interface. They are still useful places to test the prompt, build the skill, and verify repository instructions before creating the task in a supported web or desktop surface.

## Write a durable run contract

An unattended prompt should answer seven questions:

1. **Target:** Which project, branch, service, PR, or data source?
2. **Window:** What changed since the last run, or what time period should it inspect?
3. **Method:** Which skill, commands, or tools should it use?
4. **Signal:** What is important enough to report or act on?
5. **No-op:** What should happen when nothing relevant changed?
6. **Boundary:** Which actions are forbidden or require a person?
7. **Stop condition:** When is the loop complete or blocked?

```text
Every weekday at 09:00, inspect failed GitHub Actions runs for this repository
from the previous 24 hours. Group failures by likely root cause and link each run.

If a failure is clearly flaky, report the evidence but do not rerun it. If the
failure has a safe repository-only fix, prepare the smallest patch in an isolated
worktree and run the affected check. Never push, open a PR, change secrets, or
modify workflow permissions. If there are no new failures, return “No new CI
failures” and stop.
```

The prompt defines valuable silence, safe mutation, verification, and external-action boundaries. Those are the details schedules most often omit.

## Permissions must work without you

Scheduled tasks are unattended. They cannot depend on a fresh approval appearing at the right moment. Start with the narrowest sandbox that completes the tested workflow:

- Prefer read-only access for monitoring and reports.
- Use workspace-write only when repository edits are part of the job.
- Grant network or app access only for named sources the task needs.
- Make any externally visible or destructive action an explicit boundary.

When organization policy permits, scheduled tasks can run without interactive approval. That makes least privilege more important, not less. A task that cannot complete safely inside its boundary should report the blocker and stop.

## Review operations, not only content

Watch the first few runs and inspect more than the prose result:

- Did it run at the expected time and against the intended project?
- Did it use the correct context window and data interval?
- Were tool calls limited to the promised sources and actions?
- Did a worktree remain behind, and was that intentional?
- Did “nothing changed” produce a concise no-op instead of invented work?
- Is the cadence generating useful decisions or merely more inbox?

Frequent worktree-backed schedules can accumulate checkouts. Archive runs you no longer need and avoid pinning runs unless their worktree should remain.

## Good candidates and bad candidates

Good automations have stable inputs, objective checks, bounded output, and recoverable side effects. Examples include summaries, scans, drafts, and evidence-backed maintenance.

Bad candidates still need negotiation every run, depend on broad unsupervised access, or make irreversible decisions from ambiguous evidence. Keep those as manually initiated workflows with a human gate.

> [!TIP]
> If you would not trust the workflow when run manually with your screen turned away, it is not ready for a schedule.

Official reference: [Codex scheduled tasks](https://learn.chatgpt.com/docs/automations).
