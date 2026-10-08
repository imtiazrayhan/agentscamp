---
term: "Machine Translation Post-editing"
description: "Machine translation post-editing is human revision of machine-translated text against the source, context, terminology, and agreed quality requirements."
date: "2026-08-14"
reviewed: "2026-10-07"
topics: ["ai-at-work"]
audience: ["marketers", "designers"]
tags: ["machine-translation-post-editing", "knowledge-work"]
featured: false
related: ["guide:ai-localization-review-workflow", "tool:deepl", "agent:localization-copy-reviewer", "skill:localization-glossary-builder", "command:check-translation-tokens"]
---

Machine translation post-editing is human revision of machine output against its source and intended use. ISO 18587:2017's public abstract covers full human post-editing and post-editor competences. [ISO public abstract](https://www.iso.org/standard/62970.html).

## Meaning and structure need different checks

Fluency editing asks whether target prose reads well. Source-target review also asks whether the meaning survived: conditions, negation, quantities, terminology, and claims. A mechanical placeholder check examines a narrower structural requirement. These checks can contribute to one release without answering the same question.

**Illustrative fictional fixture:** an English help message permits export after admin approval and says not to delete an archive. A hypothetical target preserves every placeholder but drops the approval condition. Another hypothetical target preserves the condition while changing `{{workspace_name}}` to `{{workspace}}`. Neither example is a reviewed foreign-language translation.

The first defect needs qualified meaning review; the second can be found by exact placeholder comparison. A fluent rewrite or another model's back-translation does not establish that a human reviewer compared the target with the approved source.

The approval record should identify both source and target versions. A later source edit can reopen the affected segment even when the earlier target was reviewed carefully.

## Preserve the reviewed version

The [localization-review workflow](/guides/marketing/ai-localization-review-workflow) records segment IDs, context, glossary version, findings, and reviewer approval. [DeepL](/tools/deepl) is one drafting option to evaluate within that process.

The [localization glossary builder](/skills/marketing/localization-glossary-builder) prepares terminology from supplied material. The [localization copy reviewer](/agents/marketing/localization-copy-reviewer) proposes source-target questions, while [check-translation-tokens](/commands/marketing/check-translation-tokens) checks supported named placeholders. The language reviewer resolves meaning and locale judgments and approves an identifiable target version. Citing the public ISO abstract here defines scope; it does not claim that this workflow meets the full standard.
