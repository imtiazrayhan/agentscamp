---
name: "security-questionnaire-responder"
description: "Draft answers to a prospect's security questionnaire — a SIG, a CAIQ, a VSA, or a custom spreadsheet — strictly from the documents the company supplies: the SOC 2 report, the DPA, the subprocessor list, a penetration test summary, architecture and access-control notes. Every answer is tagged sourced with the document and section it came from, needs-review, or not-applicable with the reason, and a control that appears in no document is left unanswered rather than asserted. Anything touching contractual terms, breach-notification windows, data residency, roadmap dates, or an exception is routed to Legal or Security by name. Use when a deal is blocked on a questionnaire and every answer has to survive an auditor reading it back."
version: "1.0.0"
color: "purple"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "sales", "security-questionnaire", "compliance", "soc2"]
featured: false
related: ["agent:sales-engineer", "guide:claude-skills-for-sales", "guide:claude-for-sales-teams", "guide:claude-code-for-revenue-ops", "guide:data-privacy-for-llm-apps", "skill:threat-model-builder", "skill:data-retention-auditor", "glossary:grounding"]
seoDescription: "A Claude skill that drafts security questionnaire answers only from your own SOC 2, DPA and architecture docs, tagging each sourced or needs-review."
summary: "Supply the questionnaire and your own security documents, and this skill drafts an answer per row from those documents alone. Each answer is tagged sourced with its document and section, needs-review, or not-applicable with a reason; undocumented controls are left blank rather than claimed, and contractual or residency questions are routed to Legal or Security."
---

A security questionnaire is the one sales document where a confident guess is a liability. The answers get attached to a contract, read back by an auditor, and quoted in the next renewal. This skill drafts them from your own evidence and nothing else: every row is answered from a named document and section, or it is not answered. Undocumented controls come back as needs-review with the exact question to put to the person who owns them. It runs on the text and files you supply, so it works in claude.ai, Claude Code, or Claude Cowork; the [sales-engineer agent](/agents/sales/sales-engineer) is the wider version of the same job, covering integration, SLA, and custom-feature asks alongside the questionnaire.

## When to use this skill

- A prospect's security review is the last thing between you and a signature, and nobody has 200 free minutes.
- The same questionnaire keeps arriving in different formats and the answers drift each time.
- A rep answered one already and Security wants to know which lines are actually backed by the SOC 2.
- You are building a reusable answer bank and need to know which answers have evidence and which are folklore.
- A renewal reopens a questionnaire you filled 18 months ago and the documents have changed since.

> [!NOTE]
> This skill has no knowledge of your controls. It knows only the documents you paste or attach. It will not answer from what a company of your size usually does, from a framework's definition of a control, or from one control implying another: SSO does not imply SCIM, a SOC 2 Type II does not imply ISO 27001, encryption at rest on the primary database does not cover backups, logs, or a subprocessor. Each of those is a separate row and a separate piece of evidence.

## Inputs to ask for

1. **The questionnaire** — pasted rows or the attached sheet, with the question IDs and the answer format for each (yes/no, picklist, free text, evidence upload).
2. **The evidence pack** — SOC 2 Type I or II report, ISO 27001 certificate and Statement of Applicability, DPA, subprocessor list, penetration test summary, security whitepaper or trust page, architecture and data-flow notes, access-control and onboarding/offboarding policy, incident response plan, BCDR plan, retention schedule.
3. **The prospect context** — their industry, the regions their data sits in, whether they are a data controller sending personal data, and any regulation they named (GDPR, HIPAA, DORA, FedRAMP).
4. **Prior answers**, if a previous questionnaire exists, with its date.
5. **Owners** — who at your company signs off for Security, Legal, and Infrastructure.

## Instructions

1. **Inventory the evidence.** One row per document: type, date, period covered, auditor or author, and the systems in scope. Then flag, before answering anything: a SOC 2 whose report period ended more than 12 months ago; a bridge letter that has expired; a certificate covering a different legal entity or a different product; a penetration test older than 12 months; an architecture note with no date. An out-of-scope or expired document cannot source an answer — it produces needs-review with the reason.
2. **Parse the questionnaire.** One row per question: ID, section, verbatim question text, required answer format, and whether it asks for evidence. Group by section so related questions are answered from the same document in one pass. Count the rows and say so; a partially answered sheet must show its denominator.
3. **Answer each row from the evidence.** For every question, search the pack for a statement that answers it directly. Then tag by rule, first match wins:
   - **Sourced** — a specific statement in a specific document answers it. Record document, section or page, and a short quote. Write the answer in the format requested, in your company's voice, adding nothing the quote does not carry.
   - **Partial** — the documents answer part of the question. Answer only that part, state the boundary explicitly ("encryption at rest is documented for the primary datastore; backups are not covered in the supplied documents"), and send the remainder to needs-review.
   - **Not applicable** — only when a supplied document establishes why ("we do not store cardholder data; payments are handled by a PCI-compliant processor, DPA §4"). Never mark a row not applicable to avoid answering it.
   - **Needs review** — no document covers it, the documents conflict, or the only evidence is expired or out of scope. Write the question to ask, name the owner, and leave the answer field blank. Blank is a valid state; an invented control is not.
4. **Route the ones that are not yours to answer.** Regardless of tag, flag to a named owner: contractual language and liability, breach-notification windows and their SLAs, data-residency guarantees, deletion and return-of-data SLAs, audit rights and permission to pen-test, subprocessor consent or restriction, insurance limits, indemnities, source-code escrow, anything with a future date attached, and any request for an exception to your standard terms. Legal owns the contractual set, Security owns exceptions and compensating controls, Engineering owns the future dates. A rep sending any of these without sign-off is the failure mode this skill exists to prevent.
5. **Protect the evidence while citing it.** Cite the SOC 2; do not paste it. Never reproduce a finding, an exception, a control deviation, a customer name, an internal hostname, a version number, or a vendor's contract term in an answer. If an accurate answer requires disclosing one, mark it needs-review with the note that it should be handled under NDA and delivered as a document, not as a spreadsheet cell.
6. **Run a consistency pass.** Questionnaires ask the same thing three ways. Group answers by control and confirm they agree; where two rows are answered differently, reconcile them or mark both needs-review. Compare against the prior questionnaire if supplied and list every answer that changed, with the document that justifies the change — an unexplained change is the thing an auditor circles.
7. **Report coverage.** The count and percentage of rows sourced, partial, not applicable, and needs-review; the documents that carried the most answers; and the sections with the worst coverage. This number is the honest status of the questionnaire, not the number of rows with text in them.
8. **Close the gaps for next time.** List what would have to be documented to answer today's needs-review rows — usually three or four missing policies, not fifty. That list is the input to the next security-documentation cycle and shortens every questionnaire after this one.

## Output

1. **Evidence inventory** — documents, dates, scope, and any flagged as expired or out of scope.
2. **Answered questionnaire** — the original row order and IDs, with the drafted answer, the tag, and the document plus section for every sourced answer.
3. **Needs-review queue** — question, why it could not be sourced, the owner, and the exact question to ask them.
4. **Sign-off flags** — the rows Legal or Security must clear before the sheet leaves the building.
5. **Coverage summary** — the counts and percentages, and the weakest sections.
6. **Documentation gaps** — what to write so these rows are sourced next quarter.

## Example

An excerpt from a 214-row SIG Lite response:

```markdown
| ID | Question | Tag | Answer | Source |
|---|---|---|---|---|
| D.2.1 | Is data encrypted at rest? | Sourced | Yes, AES-256 on the primary datastore | SOC 2 §CC6.1 |
| D.2.4 | Are backups encrypted at rest? | Needs review | — | not covered by supplied docs → Infra |
| G.1.7 | Breach notification window? | Needs review | — | contractual → Legal (DPA §9 says "without undue delay") |
| H.3.2 | Is customer data stored in the EU? | Needs review | — | residency commitment → Legal + Infra |
| K.1.1 | PCI DSS scope? | N/A | We do not store cardholder data | DPA §4, processor handles payments |

Coverage: 214 rows — 148 sourced (69%), 12 partial, 9 N/A, 45 needs review.
Weakest section: business continuity (2 of 19 sourced). Gaps to document:
backup encryption, BCDR test results, subprocessor change notice period.
```

The same discipline applied to the rest of a prospect's technical asks — integrations, SLAs, custom features — is the [sales-engineer agent](/agents/sales/sales-engineer). For the security work behind the answers, [threat-model-builder](/skills/security/threat-model-builder) and [data-retention-auditor](/skills/security/data-retention-auditor) are the engineering-side companions, and [grounding](/glossary/grounding) is the general name for what the sourced tag enforces. [Claude skills for sales](/guides/sales/claude-skills-for-sales) lists the rest of the set; [Claude for sales teams](/guides/sales/claude-for-sales-teams) covers where a questionnaire sits in the deal.
