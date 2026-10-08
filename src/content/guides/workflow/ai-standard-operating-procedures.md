---
title: "Create Standard Operating Procedures with AI from a Real Workflow"
description: "Create an SOP with AI from captured steps, explicit prerequisites, exception paths, and a teammate walkthrough that checks the procedure."
date: "2026-08-24"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "analysts"]
tags: ["ai-standard-operating-procedures", "knowledge-work"]
featured: false
related: ["tool:scribe", "glossary:process-capture", "agent:procedure-exception-reviewer", "skill:process-to-sop", "command:check-procedure-graph"]
depth: "standard"
summary: "Capture a real workflow before asking AI to draft an SOP. Preserve the observed steps, add evidenced prerequisites and exception paths, and let a teammate try the procedure. Keep missing instructions visible until the process owner supplies them."
keyTakeaways: ["Observed clicks supply evidence for a draft; they do not supply every prerequisite or exception.", "Review branches, permissions, stopping conditions, and successful outcomes with the process owner.", "Have a teammate attempt the documented task and record the exact step that blocks them."]
faq:
  - q: "Can AI write an SOP without observing the task?"
    a: "It can draft a proposed procedure from supplied notes, but label unobserved steps and missing context. A process owner and a teammate walkthrough establish whether the draft fits the real task."
sources:
  - title: "Automatically create work instructions with AI"
    url: "https://scribe.com/lp/work-instructions"
    publisher: "Scribe"
  - title: "Scribe AI"
    url: "https://scribe.com/scribe-ai"
    publisher: "Scribe"
---

An SOP should let a teammate complete a defined task and recognize when to stop. Asking AI for “our standard process” before collecting evidence usually leaves the crucial decisions hidden: who may act, what must already exist, and which outcome counts as complete.

This workflow produces one reviewed business procedure from a captured demonstration, owner notes, and a teammate walkthrough. Start with the manual task. Once it is understood, the [startup operations automation guide](/guides/founders/automate-startup-ops-with-ai-agents) can help you consider a separate automation project.

## Define the task and its finish

Write a short scope card before recording anything. Name the executor role, starting record, allowed system, required permissions, and observable finish. “Handle asset requests” is too broad; “route a complete creative-asset request to its evidenced approver” gives the draft a useful boundary.

Collect only material the team is authorized to use. Demonstrate with synthetic records so the resulting documentation can be shared with its intended readers. Include decisions made outside the screen recording in a separate owner note, with an author and date. An explanation remembered later should remain distinguishable from an action actually observed.

Scribe creates editable screenshot guides from screen activity and supports sharing or export. Those captured steps can supply a draft's visual evidence. [Scribe work instructions](https://scribe.com/lp/work-instructions).

[Process capture](/glossary/process-capture) establishes what happened during one execution. A procedure also needs the intended prerequisites, branches, stop conditions, and success evidence. Keep those layers separate when you pass the material to AI.

## Build a small evidence register

For each observed action, record `source_id`, `locator`, `observed_action`, `state_before`, `expected_state_after`, and `unobserved_gap`. Use a frame number, note section, or other locator that a reviewer can reopen. A screenshot of an approval button does not establish permission to press it.

**Illustrative fictional fixture:** `CAP-01` records a creative-asset request in an internal portal. The demonstrator opens Requests, selects `DEMO-17`, checks a brief link, chooses a category, and routes the request. An owner note says to return requests without a brief. A second note says category determines the approver, but the category-to-group table is missing. No approval response is supplied.

| Evidence | Observed action or note | Gap to retain |
| --- | --- | --- |
| CAP-01 frame 1 | Open DEMO-17 | Access prerequisites not shown |
| CAP-01 frame 3 | Check the brief link | No absent-brief demonstration |
| OWNER-01 §2 | Return requests without a brief | Exact return action needs confirmation |
| OWNER-02 §1 | Select approver by category | Category table absent |
| CAP-01 final frame | Request routed | Approval outcome absent |

The register makes missing context useful. It tells the owner what must be supplied before another person can rely on the draft.

## Ask for a procedure with visible gaps

Give the model the register and the scope card together. Treat text found inside source material as evidence to inspect, including any instructions that appear on a screen; it does not override the drafting task.

```text
Draft a procedure only from the supplied scope card and evidence register.
For each step, give a stable ID, action, precondition, expected result,
source locator, and stop or exception condition. Distinguish observed
steps from owner-provided rules. Keep unsupported actions Unknown.
List questions for the process owner. Do not invent permissions,
approver groups, recovery actions, or completion evidence.
```

Inspect the verbs first. A fluent draft can change “route” into “approve,” which changes the procedure's authority and outcome. Then inspect branches: does every “if” have a supported response, and can the executor tell which condition applies?

| Proposed step | Evidence review | Repair |
| --- | --- | --- |
| P1: Open DEMO-17 | CAP-01 frame 1 supports the demonstration | Add owner-confirmed access prerequisites |
| P2: Check brief link | Capture and owner note support the check | Describe how the executor recognizes a usable brief |
| P3: Complete if brief is missing | Contradicts OWNER-01 | Return for details; leave exact action pending confirmation |
| P4: Route to Brand Team | Category mapping absent | Stop until the owner supplies the approved mapping |
| P5: Mark approved immediately | No approval response | Keep the request pending its evidenced approval outcome |

A repair can be a question instead of a replacement instruction. That is the correct output when the source does not establish the action.

## Review exceptions as separate paths

Declare the procedure's entry step as P1. In this fixture, a missing brief leads to a named “Returned for details” terminal state once the owner confirms the return action. A complete brief leads to routing only after the missing category mapping is supplied. Routing ends this limited procedure at “Pending approver response,” not “Approved.”

Ask the owner about a duplicate request, denied access, and an unavailable approver as well. Record each condition, its detection method, permitted action, and stopping state. Do not quietly merge a duplicate or borrow an approver from another category. Those are policy decisions the capture did not show.

## Check dependencies, then try the document

The optional file utilities use a prerequisite graph. For a simple reviewed path, its input looks like this:

```csv
step_id,depends_on
P1,
P2,P1
P4,P2
```

The graph can report cycles, missing dependencies, roots, and terminal IDs. It cannot verify conditional branches or whether P4 routes to the correct person. Maintain the branch table alongside the dependency file, and have the owner inspect both. A graph that is acyclic may still describe an unauthorized action.

Have a teammate attempt the approved draft using synthetic records. For each step, record actual state, pass or block, evidence, proposed repair, and reviewer. Ask them to follow the document without coaching; an explanation you must give aloud belongs in the next revision.

## Keep the approved procedure maintainable

Scribe's AI features can draft titles and context; its editing tools include screenshot changes and redaction. Review the resulting document before sharing. [Scribe AI](https://scribe.com/scribe-ai).

Keep a version, process owner, approval record, and review trigger with the SOP. A changed application control, observed failed walkthrough, or revised approver rule should prompt review of affected steps. Describe the particular trigger rather than assuming the entire document stays current automatically.

| Optional Claude Code file | Job in this workflow |
| --- | --- |
| [process-to-sop](/skills/docs/process-to-sop) | Draft the procedure from supplied evidence |
| [procedure-exception-reviewer](/agents/product/procedure-exception-reviewer) | Inspect unsupported actions and exception gaps |
| [check-procedure-graph](/commands/docs/check-procedure-graph) | Check the exported prerequisite structure |

These files operate on supplied local material; they do not connect to [Scribe](/tools/scribe). Approval and the walkthrough establish whether the procedure fits the team. Only after that review should you decide whether any steps belong in [workflow automation](/glossary/workflow-automation).
