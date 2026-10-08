---
name: "Scribe"
description: "Scribe captures on-screen workflows into editable visual guides and adds AI drafting features for titles, descriptions, and process documentation."
date: "2026-09-27"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "analysts"]
tags: ["scribe", "knowledge-work"]
featured: false
related: ["guide:ai-standard-operating-procedures", "glossary:process-capture", "agent:procedure-exception-reviewer", "skill:process-to-sop", "command:check-procedure-graph"]
url: "https://scribe.com/"
pricing: "freemium"
category: "platform"
os: ["Web"]
---

Scribe is useful when a teammate needs to see how a task was performed on screen. Consider it for a routine procedure where screenshots clarify the sequence and the team can review the captured record before others follow it.

Scribe captures screen activity into a guide with screenshots and editable text, with link, embed, and export sharing options. [Work instructions](https://scribe.com/lp/work-instructions).

Its AI features can add titles, descriptions, and context. Users can edit screenshots, add tips, and redact material in the resulting guide. [Scribe AI](https://scribe.com/scribe-ai).

## Evaluate a complete documentation task

**Illustrative fictional fixture:** document routing the creative-asset request `DEMO-17` in a test portal. Include a duplicate request and a missing brief in the teaching packet. This is a proposed evaluation exercise; no Scribe trial or measured result is reported here.

Start by deciding what a reader should finish. If the scope is routing, the finish is a visible routing result, not an approval that happens later. Record the prerequisites separately: role, access, required brief, and approved category mapping. These are the questions to settle before the visual guide becomes a procedure.

During the demonstration, keep three kinds of material distinguishable: actions shown on screen, explanations spoken by the demonstrator, and additions supplied later by the owner. A later tip can be useful, but a reviewer should know whether it describes observed behavior or a newly confirmed rule.

Give a second teammate the edited guide and synthetic inputs. Ask them to identify the next action at each point, locate its evidence, and explain when they would stop. In the duplicate case, the guide should preserve the owner's actual policy. If the packet lacks that policy, keep the gap visible instead of adding a plausible merge instruction.

Before sharing, inspect the screenshots and text at the resolution readers will receive. Check sensitive screen regions, incidental names, open tabs, and copied URLs. After editing or redacting, inspect the final shared artifact again. The evaluation question is whether the reviewer can see that the intended material was removed from that version.

## Where capture needs owner context

A screen record can omit decisions made in chat, permissions granted earlier, and exceptions that never happened during the demonstration. [Process capture](/glossary/process-capture) preserves an observed execution; the owner still supplies and reviews the intended procedure.

Use the [AI SOP workflow](/guides/workflow/ai-standard-operating-procedures) to turn the record into prerequisites, supported actions, and explicit stopping states. The important handoff is a document a teammate can execute and a list of unresolved owner questions.

## Optional local-file companions

The [process-to-sop skill](/skills/docs/process-to-sop) can draft from an exported evidence packet. The [procedure exception reviewer](/agents/product/procedure-exception-reviewer) examines the resulting gaps and branches. The [procedure graph command](/commands/docs/check-procedure-graph) checks a prerequisite CSV for structural problems. These Claude Code files read material you supply; they do not establish a Scribe integration or approve the document.

Scribe is categorized here as freemium because its pricing page lists free and paid offerings. Confirm the chosen offering and entitlements for your evaluation. [Scribe pricing](https://scribe.com/pricing).
