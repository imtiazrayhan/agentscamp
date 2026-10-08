---
description: "Create complete response-path cases for an AI-built survey, check a local route model, then preview the actual form before collection."
date: "2026-08-19"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "analysts", "designers"]
tags: ["survey-routing", "test-ai-survey-logic"]
featured: false
related: ["guide:ai-survey-branching-plan", "command:check-survey-paths", "tool:surveymonkey", "skill:survey-path-test-builder"]
summary: "Create complete response-path cases for an AI-built survey, check a local route model, then preview the actual form before collection."
title: "Test AI Survey Logic with Known Response Paths"
depth: "standard"
sources: [{"title": "Use Typeform AI", "url": "https://help.typeform.com/hc/en-us/articles/42053773420948-Use-Typeform-AI", "publisher": "Typeform"}, {"title": "Build Surveys with AI", "url": "https://help.surveymonkey.com/en/surveymonkey/create/build-with-ai/", "publisher": "SurveyMonkey"}, {"title": "Skip Logic", "url": "https://help.surveymonkey.com/en/surveymonkey/create/skip-logic/", "publisher": "SurveyMonkey"}]
seoDescription: "Create complete response-path cases for an AI-built survey, check a local route model, then preview the actual form before collection."
keyTakeaways: ["Write expected response paths from the approved route table before opening the builder preview.", "Keep local route-model checks separate from observations of the actual hosted form.", "Record unexpected questions as failures even when the eventual ending is correct."]
faq: [{"q": "Does a passing local path check mean the survey is ready to distribute?", "a": "No. It checks the supplied model and cases. Preview the corresponding form draft, record the displayed questions and ending for each case, and obtain the owner’s decision on that version."}]
---

A survey can look complete while sending one group of respondents to the wrong ending. Test navigation with predetermined responses and expected paths. The requirement belongs in the case before anyone opens the preview; the observed result belongs in a separate column afterward.

Use this workflow after an owner has approved the questions and routes. It checks finite, acyclic, single-choice navigation. It does not assess whether the questionnaire measures the right thing, whether respondents interpret a question consistently, or whether a form platform behaves identically in every environment. Those are separate review tasks.

## Freeze the expected behavior

Take the approved [survey branching plan](/guides/workflow/ai-survey-branching-plan), its route version, question and choice IDs, ending IDs, and required-answer notes. Add the builder draft identifier and a mapping between the packet IDs and the displayed controls. If the packet and draft do not describe the same choices, resolve that mismatch before executing cases.

Keep the approved packet read-only during a test pass. Store corrections as proposed changes. This prevents a common error: observing an unexpected ending, changing the expectation to match it, and reporting a pass. An observed route can reveal a bad requirement, but the owner must approve a revised requirement before the case is rerun.

Write cases from the branch table rather than from what the preview happens to show. For a small form, list every complete answer path. For a larger allowed form, ensure each approved transition has coverage, retain complete expected paths for the cases, and explain the bounded coverage you chose. Do not claim exhaustive behavior if your cases cover only selected paths.

## Build a case ledger

This fictional workshop questionnaire uses two required questions. `Q1` asks whether someone attended before. A yes answer leads to `Q2`, which asks for a morning or evening preference. A no answer leads to `E-not-attended`. Both Q2 choices lead to `E-thanks`.

| Case | Answers supplied | Expected visited states |
| --- | --- | --- |
| C1 | Q1=yes; Q2=morning | Q1, Q2, E-thanks |
| C2 | Q1=yes; Q2=evening | Q1, Q2, E-thanks |
| C3 | Q1=no | Q1, E-not-attended |

Keep Q2 absent from C3’s answer list. Supplying an answer for a question the respondent should never see can disguise an incorrect path. For each case, record the approved route version, expected ending and a short reason. Include a separate preview check for trying to advance without selecting a required answer; unanswered UI behavior is not a fabricated answer choice.

If the owner later adds Other to Q2, the previous ledger is incomplete. Add an approved transition and a new case rather than assuming Other behaves like evening. If a question becomes optional, define and test the intended blank response behavior separately before extending the supported route model.

## Check the local model first

The [survey path test builder](/skills/product/survey-path-test-builder) can propose a case packet from supplied routes. Review its cases against the owner’s table before accepting them. Then use [check-survey-paths](/commands/review/check-survey-paths) with the command’s exact fixed JSON input contract. The checker reads a local route model; it does not open the hosted form.

Keep the command’s issue codes and exit status in the review record. A malformed input result means repair the packet structure before drawing any conclusion about navigation. A path finding means compare the affected case and route with the approved requirement. A structural pass means only that the supplied model and cases satisfy the checker’s stated rules.

For example, suppose someone copied C1 to make C3 and left `E-thanks` in its expected path. The local check should flag the inconsistency with `Q1/no -> E-not-attended`. Correct C3 using the approved table and preserve a note explaining the repair. Changing the route to E-thanks to satisfy the copied case would change the questionnaire without authorization.

A clean local result cannot establish which routing rule the builder actually saved, whether required controls prevent advancement, or whether an ending renders correctly. It also cannot prove that a person independently reviewed the expectations. Treat it as a prerequisite for preview, not a substitute.

## Execute the actual preview

[Typeform's AI help](https://help.typeform.com/hc/en-us/articles/42053773420948-Use-Typeform-AI) includes previewing suggested forms. [SurveyMonkey's AI help](https://help.surveymonkey.com/en/surveymonkey/create/build-with-ai/) describes drafting and editing with account and regional restrictions. Check the chosen workspace first; AI drafting access does not establish routing availability. The [SurveyMonkey profile](/tools/surveymonkey) outlines a proposed evaluation, and its [skip-logic help](https://help.surveymonkey.com/en/surveymonkey/create/skip-logic/) explains plan-dependent access.

Run each case from a fresh preview start. Follow the case’s responses exactly and record every displayed question in order. Capture the actual ending and any extra, missing or repeated question. Use screenshots or notes appropriate to the workspace’s data rules, with the draft version visible in the evidence record. Do not substitute remembered behavior from an earlier form revision.

For C3, the reviewer selects no and expects to see the nonattendee ending without Q2. If Q2 appears, record a failure even if the eventual ending is correct. A path includes the questions shown, not only its final page. After fixing the destination, rerun C3 and any other case affected by the changed configuration.

## Decide and preserve the result

The final review table should contain case ID, expected path, observed path, preview environment, evidence reference, pass or failure, and correction status. Keep local checker output beside it. These are complementary records: the first describes the intended local model, while the second describes observed form behavior.

The owner can approve the checked draft, request a correction, or defer distribution because a supported environment or requirement remains unresolved. State that decision with the route and draft versions. A pass for this workshop packet supports those listed paths; it does not validate a different form, future edits or the quality of collected answers. Preserve the ledger so a later routing change has a specific regression check to rerun.
