---
title: "Build an Interview Scorecard with AI from Job Evidence"
description: "Build an interview scorecard with AI using approved job tasks, observable competencies, shared questions, rating anchors, and human rubric review."
date: "2026-08-09"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["ai-interview-scorecard", "knowledge-work"]
featured: false
related: ["tool:workable", "glossary:structured-interview", "agent:interview-scorecard-reviewer", "skill:job-scorecard-builder", "command:check-scorecard"]
depth: "standard"
summary: "Use AI to turn approved job tasks into a draft interview scorecard. Tie each question and observable rating anchor to job evidence, review the rubric with the hiring team, and test it on invented answers before interviewing. Candidate evaluation remains a human responsibility."
keyTakeaways: ["Start from approved job tasks and evidence rather than inferred personality or a generic ideal candidate.", "Use common questions and observable rating anchors that reviewers can interpret consistently.", "Validate rubric structure separately from human decisions about applicants."]
faq:
  - q: "Can this workflow rank candidates automatically?"
    a: "No. It prepares and reviews a job-related rubric using supplied role evidence. Interviewers assess actual responses and make hiring decisions through the organization's approved process."
sources:
  - title: "Structured Interviews"
    url: "https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews"
    publisher: "U.S. Office of Personnel Management"
  - title: "How do I score a structured interview?"
    url: "https://www.opm.gov/frequently-asked-questions/assessment-policy-faq/structured-interviews/how-do-i-score-a-structured-interview-how-do-i-assign-points-to-the-content-areas-and-rating-scale/"
    publisher: "U.S. Office of Personnel Management"
  - title: "Creating and using an interview kit / scorecard"
    url: "https://help.workable.com/hc/en-us/articles/115012304987-Creating-and-using-an-interview-kit-scorecard"
    publisher: "Workable"
---

Prepare the interview rubric before reviewing applicants. AI can help turn approved job tasks into draft questions and rating anchors, but the hiring team needs to inspect what each question measures and where that requirement came from.

This workflow produces a job-evidence scorecard and a review record. It covers preparation for employment interviews; it does not rank applicants or infer their personality. The broader [founder workflow guide](/guides/founders/claude-for-founders) can help organize the surrounding work.

## Start with observable work

Ask the role owner for approved tasks, required outcomes, constraints, and examples of work the role must handle. Record a locator for each requirement. “Great communicator” needs a task-level explanation: what information must this person communicate, to whom, under which conditions?

Keep missing role information as a question. Do not infer requirements from personal traits of previous employees. Candidate histories are unnecessary for building this preparation packet; use the job evidence and invented practice material.

**Illustrative fictional fixture:** the operations coordinator brief `ROLE-01` has three tasks: A, reconcile duplicate queue records without deleting unresolved work; B, flag blocked approvals while preserving the decision owner; C, write an exception note with evidence. These tasks are invented for teaching, not a validated hiring assessment.

The proposed rubric has two competencies. Queue reconciliation maps to A and its evidence note to C. Escalation judgment maps to B and its evidence note to C. Ask the role owner whether this shared treatment covers C adequately or needs a separate approved criterion.

## Draft common questions from the tasks

OPM describes structured interviews as assessing job-related competencies through past-behavior or hypothetical questions, using predetermined questions and common rating standards. [OPM structured-interview guidance](https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews).

The [structured interview](/glossary/structured-interview) method gives the rubric its common questions and evaluation approach. A form with a numeric scale alone does not establish that structure.

```text
Use only the supplied approved role tasks to draft a preparation rubric.
For each competency include a task locator, a common question, and
observable anchors at three levels. Include an Unobserved option
outside the rating scale. Flag missing requirements and unsupported
criteria. Do not use candidate records, rank applicants, or infer
personality, demographics, protected traits, or personal circumstances.
```

Remove “Are you an energetic culture fit?” from this fixture: it lacks an approved task locator and observable job behavior. Replace it with a question a reviewer can tie to the actual work.

## Make anchors distinguishable

| Competency | Source | Common question |
| --- | --- | --- |
| Queue reconciliation | ROLE-01 A and C | “Two records share an ID but have different text. What would you do?” |
| Escalation judgment | ROLE-01 B and C | “A request has no named approver. How would you continue?” |

For queue reconciliation, proposed anchors are: **1**, deletes a record on matching ID alone; **2**, preserves both and requests clarification; **3**, also records the conflict and checks source history. For escalation, they are: **1**, invents an approver; **2**, leaves work pending and seeks the owner; **3**, also records the blocker, source gap, and next check.

These are illustrative options for human review. They do not establish predictive validity. Inspect whether the question actually gives someone an opportunity to demonstrate the higher-level behavior. If a detail can only emerge through a follow-up, record a consistent approved follow-up rather than leaving each interviewer to improvise it.

Add **Unobserved** as a distinct outcome. If the interview did not elicit the required evidence, the record should say so. A missing observation must not become the weakest score or an invented answer.

## Decide weights before interviews

OPM recommends equal competency weights unless there is a clear documented rationale for another choice. [OPM scoring FAQ](https://www.opm.gov/frequently-asked-questions/assessment-policy-faq/structured-interviews/how-do-i-score-a-structured-interview-how-do-i-assign-points-to-the-content-areas-and-rating-scale/).

For this two-criterion fixture, proposed weights are equal. The hiring team approves the final set and any rationale for different weights. Do not ask a model to estimate the “optimal” weights from a few examples.

The companion file checker accepts decimal strings, so an excerpt for the first criterion is:

```json
{
  "criterion_id": "C1",
  "competency": "Queue reconciliation",
  "weight": "0.5",
  "anchors": {
    "1": "Deletes on matching ID alone",
    "2": "Preserves both and requests clarification",
    "3": "Also records conflict and checks source history"
  },
  "source_ref": "ROLE-01 tasks A and C",
  "question_ids": ["Q1"]
}
```

The full input is an object containing `role_id` and `criteria`; include the second criterion with weight `"0.5"`. The excerpt is not a complete input file. The utility checks the declared structure and weight total, not whether the source task supports the criterion.

## Calibrate the rubric on invented answers

Use two fictional practice responses before any real interviews. Response A says, “I would keep both records and ask the owner which is current.” Response B adds, “I would record the differing text and inspect the source history before changing either record.”

Have reviewers independently identify the behaviors present and explain which anchor language guided them. Discuss disagreements about the rubric. For example, does “inspect source history” require describing what evidence would resolve the conflict? Repair the anchor if reviewers cannot apply it consistently to the practice material.

Preserve the calibration notes and rubric version. This exercise inspects shared interpretation; it is not a study of hiring outcomes and supplies no automatic applicant ranking.

## Approve the preparation packet

The human role and HR reviewers check task coverage, question wording, rating anchors, interview conduct, accommodations, and the organization's actual hiring process. [Human-in-the-loop review](/glossary/human-in-the-loop) belongs at that decision point, with a named owner and a visible approval record.

Workable supports interview kits, common rating scales, notes, and use at eligible interview stages. A reviewed kit can be created or imported. [Workable interview-kit documentation](https://help.workable.com/hc/en-us/articles/115012304987-Creating-and-using-an-interview-kit-scorecard).

If [Workable](/tools/workable) fits the team's process, inspect the stored kit against the approved rubric rather than treating a successful import as approval.

| Optional Claude Code file | Preparation job |
| --- | --- |
| [job-scorecard-builder](/skills/product/job-scorecard-builder) | Draft the rubric from supplied job evidence |
| [interview-scorecard-reviewer](/agents/product/interview-scorecard-reviewer) | Inspect coverage, unsupported criteria, and anchor gaps |
| [check-scorecard](/commands/product/check-scorecard) | Check the exported rubric's structure and arithmetic |

Deliver the approved rubric, its source map, calibration repairs, and unresolved questions together. Interviewers assess actual responses through the approved human process.
