---
title: "9 Best Claude Skills for Product Managers"
description: "Compare Claude skills for PRDs, MVP scope cuts, competitor teardowns, interview synthesis, feedback codebooks, survey tests, scorecards, and investor updates."
author: "Imtiaz Rayhan"
date: "2026-10-12"
color: "green"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "marketers"]
tags: ["claude-skills", "product-management", "prd", "customer-discovery", "founders", "best-of"]
seoTitle: "9 Best Claude Skills for Product Managers"
seoDescription: "The best Claude skills for product managers: write PRDs, cut MVP scope, tear down competitors, synthesize interviews, code feedback, and test surveys."
summary: "Use prd-writer and mvp-scope-cutter for the spec and the v1 cut, user-interview-synthesizer and competitor-teardown for evidence, feedback-codebook-designer for recurring feedback, survey-path-test-builder for branching surveys, job-scorecard-builder for hiring, and investor-update-writer for the monthly update. None invents a number or a quote."
keyTakeaways:
  - "Every pick works from what you paste or point it at and marks what it inferred; assumptions, unknown baselines, and missing routes are labeled rather than filled in."
  - "Separate evidence from decision: user-interview-synthesizer, competitor-teardown, and feedback-codebook-designer report, while prd-writer and mvp-scope-cutter decide what to build."
  - "Five of the skills declare no tools at all, so they run the same in claude.ai, Claude Code, and Claude Cowork; the /prd and /scope-mvp commands add file output inside a project."
  - "Counting is code, not a language model: feedback-codebook-designer defines the labels and count-feedback tallies them, and neither reports prevalence it cannot support."
  - "The agents review and never edit: technical-cofounder reads an AI-built app for founder risks, and survey-design-reviewer reads a questionnaire before collection."
faq:
  - q: "Is there a Claude skill for writing a PRD?"
    a: "Yes. prd-writer turns an idea, notes, or a voice-memo transcript into a PRD with eight fixed sections (problem, users, jobs-to-be-done, scope, non-goals, success metrics, open questions, risks), marks every inference as an assumption, and never invents a baseline number. Inside a Claude Code project the /prd command runs the same procedure and writes docs/prd.md."
  - q: "Can Claude help me cut scope for an MVP?"
    a: "mvp-scope-cutter sorts every feature in a PRD or list into keep, cut, or later with a one-line reason tied to the core job or the riskiest assumption, then describes the smallest thing you could build to test that assumption. It never adds features. The /scope-mvp command writes the same table to docs/mvp-scope.md."
  - q: "Which Claude skill analyzes customer feedback or interviews?"
    a: "For interview transcripts, user-interview-synthesizer reports themes with participant counts, verbatim quotes, contradictions, and next questions without inventing a quote. For recurring tickets or survey comments, feedback-codebook-designer builds a versioned codebook with inclusion and exclusion rules, and the count-feedback command tallies the reviewed labels with code."
  - q: "Do these product skills work outside Claude Code?"
    a: "prd-writer, mvp-scope-cutter, user-interview-synthesizer, competitor-teardown, and investor-update-writer work from pasted text and declare no tools, so they upload to claude.ai or run in Claude Cowork unchanged. feedback-codebook-designer, job-scorecard-builder, and survey-path-test-builder read local files, and count-feedback runs a Python script, so those belong in Claude Code."
  - q: "Is there a product manager agent for Claude Code?"
    a: "Yes. The product-manager subagent handles the product reasoning that spans several of these skills, while technical-cofounder reviews an AI-built app for the risks that hurt founders and survey-design-reviewer reviews a questionnaire before responses are collected. All three report; none edits your files."
related: ["skill:prd-writer", "skill:mvp-scope-cutter", "skill:competitor-teardown", "skill:user-interview-synthesizer", "skill:feedback-codebook-designer", "skill:job-scorecard-builder", "skill:investor-update-writer", "skill:survey-path-test-builder", "command:prd", "command:scope-mvp", "command:count-feedback", "agent:product-manager", "agent:technical-cofounder", "agent:survey-design-reviewer", "guide:claude-skills-for-founders", "guide:claude-for-founders"]
---

The best Claude skills for product managers are the ones that refuse to make things up. A PRD with an invented baseline, a synthesis with a paraphrased "quote", or a competitor table filled in from memory looks finished and misleads everyone downstream. Each pick below works only from the material you give it and marks what it inferred, so gaps show up as questions instead of hiding as facts.

The picks follow a product cycle: the spec, the version one cut, customer and competitor evidence, recurring feedback, survey tests, hiring, and the investor update. Eight are skills and one is a slash command; two more commands run the first two skills inside a Claude Code project. Each entry names the allowed tools, what it writes versus prints, and when to pick it over its neighbours.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [prd-writer](/skills/product/prd-writer) | Notes that need to become a spec | Eight-section PRD with [ASSUMPTION] tags | No; /prd writes docs/prd.md |
| [mvp-scope-cutter](/skills/product/mvp-scope-cutter) | A scope that keeps growing | Keep / cut / later table and smallest test | No; /scope-mvp writes docs/mvp-scope.md |
| [user-interview-synthesizer](/skills/product/user-interview-synthesizer) | A batch of discovery calls | Themes with counts, verbatim quotes, contradictions | No |
| [competitor-teardown](/skills/product/competitor-teardown) | Sizing up one rival | Positioning, pricing model, feature table, wedges | No |
| [feedback-codebook-designer](/skills/product/feedback-codebook-designer) | Recurring tickets or survey comments | Versioned codebook with rules and examples | Only a requested new file |
| [count-feedback](/commands/analytics/count-feedback) (command) | A labeled feedback CSV | Counts per label, respondents, duplicates | Optional report file |
| [survey-path-test-builder](/skills/product/survey-path-test-builder) | A branching survey | survey-paths.json test packet | No (inline) |
| [job-scorecard-builder](/skills/product/job-scorecard-builder) | Hiring for a role | Criteria, anchors, questions, weights | Only a requested new file |
| [investor-update-writer](/skills/product/investor-update-writer) | The monthly update | TL;DR, metrics table, wins, misses, asks, runway | No |

## 1. prd-writer: turn notes into a spec a builder can start from

[prd-writer](/skills/product/prd-writer) takes an idea, a page of bullets, or a voice-memo transcript and returns a PRD with eight headings in a fixed order: Problem, Users, Jobs-to-be-done, Scope, Non-goals, Success metrics, Open questions, Risks. It drafts without asking questions up front, marking every inference `[ASSUMPTION]` and every unresolved point `[OPEN]`. Scope items are behaviors a user can observe. A baseline is a number you supplied or the literal text "unknown, measure first". The first row of Risks is the assumption that, if wrong, means the product should not be built.

The skill declares no tools and works from pasted text, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork, and its output is printed. Inside a project, the [/prd](/commands/product/prd) command (Read, Write, Glob) accepts a notes file path, writes `docs/prd.md`, and asks before overwriting. Neither names a stack, a vendor, or a screen layout.

## 2. mvp-scope-cutter: sort every feature into keep, cut, or later

[mvp-scope-cutter](/skills/product/mvp-scope-cutter) applies one rule to a PRD or feature list: does the item help a user complete the core job once, or does it produce evidence about the riskiest assumption? It states the core job in one sentence, writes the assumption as "We believe [users] will [behavior] because [reason]", and sorts every item into keep, cut, or later with a one-line reason. Admin panels, settings, roles, integrations, notifications, dashboards, billing tiers, onboarding tours, dark mode, and native mobile default to later; expensive keeps get a manual substitute marked "manual for v1". It closes with the smallest thing that would test the assumption, with an observable pass and fail signal, and a one-sentence version one. It never adds a feature. No tools; pasted text. The [/scope-mvp](/commands/product/scope-mvp) command defaults to `docs/prd.md` and writes `docs/mvp-scope.md`.

## 3. user-interview-synthesizer: report what people actually said

[user-interview-synthesizer](/skills/product/user-interview-synthesizer) reads every transcript with the same attention. It labels each source (P1, P2) as VERBATIM or NOTES; quotes may be lifted only from VERBATIM sources, character for character, and a theme with only notes behind it says "no verbatim quote available". It marks each statement BEHAVIOR or OPINION and weights behavior higher, clusters three to seven themes with "raised by X of N participants" counts, derives jobs-to-be-done statements with supporting labels, and builds a contradictions table that includes a participant's stated preference conflicting with their described behavior. It ends with past-tense questions for the next round and a confidence line. It does not decide what to build. No tools; pasted text.

## 4. competitor-teardown: an analysis that survives opening their website

[competitor-teardown](/skills/product/competitor-teardown) works only from what you paste: a homepage, a pricing page, docs, screen descriptions, review excerpts. It inventories each source with its capture date, quotes positioning verbatim and labels every reading STATED or INFERRED, names the pricing model and what each published tier gates (or "NOT PROVIDED"), and builds a feature table of Yes, No, or Unclear with quoted evidence; "Unclear" is the correct answer whenever the material is silent. It proposes three to five wedges, each tied to an observation and the condition that would need to be true, and lists gaps to research as questions. It will not state a price or a feature from memory. No tools; pasted text. In Claude Code, hand the gaps to [web-research-pipeline](/skills/data/web-research-pipeline) for a cited follow-up.

## 5. feedback-codebook-designer: define the labels before anyone counts

[feedback-codebook-designer](/skills/product/feedback-codebook-designer) builds a versioned codebook from a pilot sample with record IDs. It confirms the goal, the unit of coding, and a single- or multi-label policy, then proposes one code per job with a stable ID, a definition, an inclusion rule, an exclusion rule, an exact example with its record ID, and a boundary case against the nearest alternative. Overlapping codes are merged or sharpened, unsupported codes are marked Proposed, and an Unresolved bucket holds records that need a human question. A change log and merge or split mappings keep old labels from being silently redefined. Tools are Read and Write; it prints by default and writes only a requested new file. It refuses to compute frequencies with language-model arithmetic. [Analyze Customer Feedback with AI](/guides/workflow/analyze-customer-feedback-with-ai) covers the workflow.

## 6. count-feedback: count with code, not with a model

[count-feedback](/commands/analytics/count-feedback) tallies a reviewed, single-label CSV with the columns `record_id,respondent_id,label` using a fixed Python script rather than the model. It collapses exact duplicate rows, stops if one record ID carries conflicting rows, and reports raw rows, duplicates, canonical records, distinct known respondents, missing identities, tagged and untagged rows, and per-label record and respondent counts. It never reports prevalence or a percentage of customers. Tools are Read, Bash, and Write; the argument text is never interpolated into a shell command, and the optional report cannot overwrite an input. It needs Python 3.10 or later.

## 7. survey-path-test-builder: prove the branching before the form ships

[survey-path-test-builder](/skills/product/survey-path-test-builder) builds a route-and-case packet from an approved specification: a named owner, a revision, question and single-choice option IDs, named endings, a start question, every answer-to-destination rule, and handling of "no answer" and "other". It lists missing or conflicting routes first, checks that every node is reachable with no loops, and writes cases covering every transition with the expected path. The output is `survey-paths.json` returned inline plus an evidence table mapping each case to its rule; if a route is missing it returns `status: blocked` rather than a packet that looks complete. Tools are Read, Glob, and Grep; it never edits or uploads a form. The [check-survey-paths](/commands/review/check-survey-paths) command validates the same contract. Start from [Plan AI Survey Branching Before Building the Form](/guides/workflow/ai-survey-branching-plan).

## 8. job-scorecard-builder: hire against the work

[job-scorecard-builder](/skills/product/job-scorecard-builder) drafts a pre-interview scorecard from the role's actual tasks and the hiring owner's priorities. Each criterion is one observable competency with a stable ID and a `source_ref` to the task that justifies it; personality, culture fit, identity, and school prestige are not evidence. Each gets exactly three behavioral anchors, a question or work-sample ID, and the owner's weight copied exactly; missing weights stay Unresolved rather than invented. With all weights supplied it offers JSON that the [check-scorecard](/commands/product/check-scorecard) command validates for shape and exact decimal arithmetic. Tools are Read and Write; it prints by default and never assesses candidates. [Build an Interview Scorecard with AI from Job Evidence](/guides/founders/ai-interview-scorecard) covers the owner review.

## 9. investor-update-writer: an honest update from your own numbers

[investor-update-writer](/skills/product/investor-update-writer) drafts the monthly update from the metrics and notes you paste: a three-bullet TL;DR, a metrics table, wins, misses, asks, and runway. Deltas are arithmetic on the numbers you supplied; a metric with no prior value reads "n/a (no prior)". Wins are factual sentences with evidence. Misses state the target, the actual, the stated reason, and what changes next month. Each ask has a concrete object, a deadline, and the kind of person who could help. Runway comes from cash and net burn only, or a labeled placeholder. It lists customer names and unreleased features to confirm before sending and targets 300 to 500 words. No tools; pasted text. The mvp-scope-cutter table is a natural input for wins and misses.

## Agents: product-manager, technical-cofounder, survey-design-reviewer

Three subagents cover the work between the artifacts. The new [product-manager](/agents/product/product-manager) agent is the generalist of the set: where each skill runs one fixed procedure, it takes a product question end to end, from framing the problem and weighing the evidence to a written recommendation, and reaches for the skills above when one of their artifacts is the right next step.

[technical-cofounder](/agents/product/technical-cofounder) is a read-only reviewer (Read, Grep, Glob, and Bash for inspection only) for an app produced by an AI builder or coding agent. It checks login and permission gaps, secrets in the code, data exposed by missing row-level security, cost traps such as paid API calls in loops, lock-in, backups, and tests, and reports each finding with a severity, why it matters, and a sentence you can paste to an engineer. Its verdict is Ready to launch, Launch after fixes, or Not yet.

[survey-design-reviewer](/agents/product/survey-design-reviewer) reads a draft questionnaire before collection (Read, Glob, Grep) and flags leading wording, two concepts in one question, missing answer options, inconsistent scales, undefined recall windows, and questions that cannot answer the stated objective, returning a table with a proposed rewrite and an owner check per finding. It never edits the survey.

## Recommended product stacks

From idea to a scoped version one inside a Claude Code project:

```bash
npx agentscamp add commands/prd
npx agentscamp add commands/scope-mvp
npx agentscamp add skills/user-interview-synthesizer
npx agentscamp add skills/competitor-teardown
npx agentscamp add agents/product-manager
```

For recurring feedback and research instruments:

```bash
npx agentscamp add skills/feedback-codebook-designer
npx agentscamp add commands/count-feedback
npx agentscamp add skills/survey-path-test-builder
npx agentscamp add agents/survey-design-reviewer
```

For running the company around the product:

```bash
npx agentscamp add skills/job-scorecard-builder
npx agentscamp add skills/investor-update-writer
npx agentscamp add agents/technical-cofounder
```

The five pasted-text skills (prd-writer, mvp-scope-cutter, user-interview-synthesizer, competitor-teardown, investor-update-writer) also upload to claude.ai as ZIP files; [Claude Skills for Founders](/guides/founders/claude-skills-for-founders) walks through that.

## Continue exploring

- [Claude for Founders: Which Claude Product for Which Job](/guides/founders/claude-for-founders) — When to use claude.ai, Claude Design, Cowork, Claude Code, and the in-tool integrations.
- [Analyze Customer Feedback with AI: Themes You Can Check](/guides/workflow/analyze-customer-feedback-with-ai) — The codebook, labeling, and counting workflow these skills implement.
- [The Best Claude Skills to Install in 2026](/guides/skills/best-claude-skills-2026) — A skills-only tour of the AgentsCamp library, organized by the job each skill does.
