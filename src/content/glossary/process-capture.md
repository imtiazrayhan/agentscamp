---
term: "Process Capture"
description: "Process capture records how a task is actually performed, preserving observed actions and context as input to a reviewed procedure or training guide."
date: "2026-09-13"
reviewed: "2026-10-07"
topics: ["ai-at-work"]
audience: ["founders", "analysts"]
tags: ["process-capture", "knowledge-work"]
featured: false
related: ["guide:ai-standard-operating-procedures", "tool:scribe", "agent:procedure-exception-reviewer", "skill:process-to-sop", "command:check-procedure-graph"]
---

Process capture records an actual execution of a task: the actions taken, their sequence, and the context available to the observer. It gives a reviewer evidence to inspect when creating instructions or explaining how work happened.

Scribe, for example, turns screen activity into an editable screenshot guide. [Scribe work instructions](https://scribe.com/lp/work-instructions).

## Capture, procedure, and process mining

A capture describes one observed path. An SOP describes how an authorized executor should perform the task, including prerequisites, branches, and stopping conditions. Moving from the first to the second requires owner review; a captured click does not establish that everyone may take that action.

Process mining asks a different question: what patterns are present across recorded events from a process? A single demonstration can help explain steps, but it does not establish how frequently a branch occurs across the organization's work.

**Illustrative fictional fixture:** a creative-asset request capture shows a complete brief being routed. An owner note says requests without a brief must be returned, but that branch was not demonstrated. Preserve the note's locator and ask the owner to confirm the return action instead of presenting it as an observed step.

A useful capture record distinguishes screen evidence, narrated rationale, and later additions. It also marks what is missing: access permissions, offline decisions, rare exceptions, or the result after the recording ended. Those gaps are inputs to the [AI SOP workflow](/guides/workflow/ai-standard-operating-procedures).

Use [Scribe](/tools/scribe) when visual documentation fits the task. For supplied local records, [process-to-sop](/skills/docs/process-to-sop) drafts the procedure, while the [procedure exception reviewer](/agents/product/procedure-exception-reviewer) inspects unsupported branches. The [procedure graph check](/commands/docs/check-procedure-graph) tests prerequisite structure; a teammate walkthrough still checks whether the instructions can be followed.
