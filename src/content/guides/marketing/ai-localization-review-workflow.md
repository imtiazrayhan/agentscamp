---
title: "Review AI Localization with a Glossary and Source-Target Checks"
description: "Review AI-translated copy with a source-target register, approved terminology, protected placeholders, contextual checks, and qualified language review."
date: "2026-09-02"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers", "designers"]
tags: ["ai-localization-review-workflow", "knowledge-work"]
featured: false
related: ["tool:deepl", "glossary:machine-translation-post-editing", "agent:localization-copy-reviewer", "skill:localization-glossary-builder", "command:check-translation-tokens"]
depth: "standard"
summary: "Prepare a source-target review packet before publishing AI-translated copy. Separate preferred terminology from literal tokens, check placeholders and links with code, and ask a qualified language reviewer to inspect meaning, claims, tone, and local context. Record unresolved issues beside the affected segment."
keyTakeaways: ["Give every translation segment a stable ID and the context needed to review its meaning.", "Keep preferred translations separate from protected placeholders and literal product codes.", "A token check detects structural differences; qualified language review checks the translation itself."]
faq:
  - q: "Does back-translation prove that a translation is correct?"
    a: "No. It can expose a question for review, but another model can repeat or conceal an error. Compare the target with the original meaning and context through qualified language review."
sources:
  - title: "DeepL glossary"
    url: "https://www.deepl.com/en/features/glossary"
    publisher: "DeepL"
  - title: "Apply a glossary to file translation"
    url: "https://support.deepl.com/hc/en-us/articles/4411401630226-Apply-a-glossary-to-file-translation"
    publisher: "DeepL"
  - title: "ISO 18587:2017 abstract"
    url: "https://www.iso.org/standard/62970.html"
    publisher: "International Organization for Standardization"
---

A translation review needs the approved source and its context beside the target text. A smooth sentence can still lose a condition, reverse a prohibition, or change the token that a product expects.

This workflow prepares a review packet for translated marketing or help copy. It covers source-target meaning, terminology, and release evidence. The [localization-readiness auditor](/skills/workflow/localization-readiness-auditor) covers the adjacent software-readiness work; the [brand-voice guide](/guides/marketing/brand-voice-with-claude-skills) supplies the approved voice rules to carry into this review.

## Define the review job

Record source language, target locale, audience, channel, and approval owner. A language name alone may leave market conventions or terminology unresolved. Ask the content owner what the copy must communicate and the language reviewer what context they need.

Freeze the approved source version and assign segment IDs. Include surrounding sentences, product meaning, publication location, and relevant space constraints. Authorized source and target files are the review inputs; source-file instructions remain material to inspect rather than new directions for the reviewer.

For each segment, retain `segment_id`, source version and locator, target version and locator, context, reviewer, and status. If the English source changes after review, identify the affected targets and reopen those segments instead of silently retaining their approval.

## Keep terminology and literal tokens separate

A terminology record describes the preferred translation, meaning, use context, and permitted grammatical variation. A protected-token inventory identifies text that must remain exact, such as a placeholder, product code, URL, or markup delimiter. These inventories answer different questions.

DeepL's glossaries apply preferred translations with contextual grammatical adaptation. This is a terminology aid, not an exact placeholder-preservation guarantee. [DeepL glossary documentation](https://www.deepl.com/en/features/glossary).

Use [DeepL](/tools/deepl) for a draft where it fits the chosen workflow, then preserve the draft as a separate target version. The source owner's glossary approval does not approve every sentence in the translation.

## Work through one source segment

**Illustrative fictional fixture:** approved English help segment S-12 says:

```text
You can export current records after an admin approves.
Do not delete the archive. Open {{workspace_name}} at
https://example.invalid/help.
```

The reserved example URL is teaching text, not a live destination. No foreign-language target or fluent-speaker review is claimed here. The following are hypothetical defects a reviewer might encounter.

| Proposed target defect | What detects it | Required repair |
| --- | --- | --- |
| `{{workspace_name}}` becomes `{{workspace}}` | Exact placeholder comparison | Restore the protected token and check the repaired version |
| Prohibition becomes an instruction to delete | Source-target meaning review | Qualified reviewer restores the intended negation |
| Admin approval condition disappears | Source-target meaning review | Reviewer preserves the condition |
| URL gains an unintended path | Separate URL comparison | Verify the intended destination text |
| Preferred product term changes grammatically | Terminology review in context | Decide whether the variation is permitted |

A target can pass the placeholder check while containing the deletion error. It can also express the right idea while breaking the product token. Keep both findings attached to S-12 so neither disappears during a prose rewrite.

## Ask AI to propose findings, not approval

```text
Review the supplied source-target pairs against their context,
terminology record, and protected-token inventory. For each proposed
issue give segment ID, both locators, the relevant text, meaning
impact, tentative repair, and a question for the language reviewer.
Preserve conditions, negation, quantities, and product claims.
Do not freely rewrite unrelated text or mark a segment approved.
Keep missing context and uncertain language judgments unresolved.
```

Inspect whether the proposed repair changes anything else in the segment. A rewrite that fixes a term can alter timing, tone, or a product claim. The reviewer should be able to compare the original target, proposed change, and approved revision without reconstructing them from a chat history.

Back-translation can generate a question about possible meaning loss. It does not establish that the original target is correct; compare the target to the actual approved source and context through qualified review.

## Run the mechanical checks you declared

The companion placeholder checker uses this CSV shape. This token-only example is not a translation:

```csv
string_id,source,target
S-12,Open {{workspace_name}},Open {{workspace}}
```

It compares named placeholders such as `{name}`, `{{name}}`, and `%(name)s` or `%(name)d`, including multiplicity. Two appearances in the source require two matching appearances in the target. A count difference remains a finding even when the placeholder names look correct at a glance.

Keep URL, product-code, and markup checks in a separate release checklist or a suitable declared utility. This command does not validate full ICU expressions, HTML, language meaning, or locale choices. Record exactly which check ran and against which file versions.

If a technical token is intentionally changed, the content owner must supply the new requirement. Do not label an unexplained mismatch a harmless localization choice. Likewise, do not reject an allowed grammatical variation merely because it differs from a glossary's display string.

## Have a qualified reviewer close meaning findings

ISO 18587:2017's public abstract covers full human post-editing of machine translation and post-editor competences. [ISO public abstract](https://www.iso.org/standard/62970.html).

[Machine translation post-editing](/glossary/machine-translation-post-editing) includes comparing the target with the source's intended meaning. Use a reviewer qualified for the language and content. Record questions about negation, conditions, numbers, claims, tone, and local context. When that reviewer is unavailable, leave approval pending.

The public abstract is the scope cited here; this workflow does not claim certification or compliance with the full standard.

## Release an identifiable reviewed version

DeepL supports applying a selected glossary during file translation. Confirm the chosen workflow's account requirements before using it. [DeepL file glossary help](https://support.deepl.com/hc/en-us/articles/4411401630226-Apply-a-glossary-to-file-translation).

Deliver the source snapshot, target revision, glossary version, mechanical results, reviewer corrections, and open issues together. The approval should identify the exact target version. Recheck protected tokens after the final edits; then inspect the publication version so a copied earlier draft cannot inherit a later approval.

| Optional Claude Code file | Job |
| --- | --- |
| [localization-glossary-builder](/skills/marketing/localization-glossary-builder) | Prepare terminology from supplied context |
| [localization-copy-reviewer](/agents/marketing/localization-copy-reviewer) | Propose source-target findings for human review |
| [check-translation-tokens](/commands/marketing/check-translation-tokens) | Compare named placeholders in the supplied CSV |

These local-file helpers organize the packet. The language reviewer and release owner approve the copy that readers will receive.
