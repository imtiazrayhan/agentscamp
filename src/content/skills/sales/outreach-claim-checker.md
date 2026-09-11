---
name: "outreach-claim-checker"
description: "Check every factual and personalization claim in a drafted outreach email, or a batch of them, against the research the draft was written from: funding rounds, job titles and recent moves, tech stack, headcount, product launches and press, and named mutual connections. Each claim is marked sourced with the line that supports it, unsourced, contradicted, or stale, then unsupported specifics are cut or narrowed to what the research actually says, and every email leaves with a send, fix, or hold verdict. A source is never invented and never inferred. Use when outreach was personalized from AI or analyst research and nobody has verified the details before it reaches a prospect."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "sales", "outreach", "fact-checking", "cold-email"]
featured: false
related: ["command:check-outreach", "guide:claude-skills-for-sales", "guide:claude-for-sales-teams", "guide:research-prospects-with-claude", "guide:claude-sales-plugin-guide", "skill:hallucination-evaluator", "skill:cold-email-deliverability-auditor", "glossary:grounding"]
seoDescription: "A Claude skill that fact-checks a drafted outreach email against its research: every funding, title, tech-stack and news claim marked sourced or cut."
summary: "Paste a drafted outreach email and the research behind it. This skill extracts every factual and personalization claim, marks each one sourced with the supporting line, unsourced, contradicted, or stale, cuts or narrows what the research does not support, and returns a send, fix, or hold verdict per email. It never invents a source."
---

Anthropic's [sales plugin](https://github.com/anthropics/knowledge-work-plugins) ships a `draft-outreach` skill that researches a prospect and then writes the email. Nothing in it checks the email afterwards. This skill is that second pass: it takes the draft plus whatever research it was built on, pulls out every claim the message makes about the company, the person, and your own product, and tells you which ones a source actually supports. Unsourced specifics are removed rather than softened, because a vague version of a wrong fact is still wrong. It runs on pasted text alone, so it works the same in claude.ai, Claude Code, and Claude Cowork; the [/check-outreach](/commands/sales/check-outreach) command is the one-line runner, and [Research prospects with Claude](/guides/sales/research-prospects-with-claude) is the workflow this sits at the end of.

## When to use this skill

- A rep or an agent drafted personalized emails from web research and the specifics have never been opened by a human.
- A sequence is about to go out to a list where one wrong title or funding round is a visible, forwarded mistake.
- You are reviewing outreach a teammate wrote and want the claims separated from the copy.
- Someone claims a mutual connection, a shared customer, or a prior conversation in an email and you want it traced before it is asserted.
- A campaign got a "we don't use that" or "I left that company" reply and you want to know how many other drafts carry the same class of error.

> [!NOTE]
> This skill checks claims against the research you supply. It does not browse, and it will not fill a gap from memory: if no supplied source covers a claim, the claim is unsourced, full stop. A model's recollection of a funding round is not a source, and neither is a plausible-sounding URL. If you paste no research at all, every claim comes back unsourced and the verdict is HOLD — that is the correct answer, not a failure.

## Instructions

1. **Collect the inputs.** You need (a) one or more drafts and (b) the research pack: notes, an enrichment export, a research brief, pasted pages, CRM history, links with the quoted line they support. Number the drafts D1, D2, ... and the sources S1, S2, ... Record for each source what it is, where it came from, and its date. A source with no date is usable but is treated as stale for anything time-sensitive in step 4.
2. **Extract the claims.** Read each draft line by line and list every checkable assertion, one row per claim, quoted verbatim. Classify each into one of seven types:
   - **Company fact** — funding, valuation, ownership, headcount, HQ, revenue, customers, structure.
   - **Person fact** — title, team, tenure, prior employer, a recent move or promotion.
   - **Technographic** — a tool, vendor, language, cloud, or integration they are said to use.
   - **Event** — a launch, acquisition, hire, outage, conference talk, post, or press item, with its date.
   - **Relationship** — a mutual connection, referral, prior meeting, shared investor, existing account.
   - **Own-product** — what your product does, a named customer, a result, a number, a comparison.
   - **Inference** — the draft's reasoning that connects a fact to a reason to talk ("since you just raised, you're probably hiring"). Inferences are labelled, not sourced; they are checked only for whether their underlying fact survives.
   Opinions, questions, pleasantries, and calls to action are not claims. Skip them.
3. **Check entity identity before checking facts.** For each draft, confirm the sources are about the same company and the same person as the draft: matching domain, not just a matching name; the right person at the right company where the name is common; the right entity where two companies share a name. An entity mismatch invalidates every claim drawn from that source at once — record it as a single finding and re-check the draft against what remains.
4. **Mark each claim.** Apply these rules in order; the first that matches wins.
   - **Contradicted** — a supplied source says something different, or two sources disagree and none is clearly newer and authoritative.
   - **Sourced** — a specific line in a specific source states it. Record the source ID and quote the line. A source that implies, is adjacent to, or is consistent with the claim is not a source for it.
   - **Stale** — sourced, but the source predates the threshold for its type: 12 months for funding, headcount, revenue, or ownership; 6 months for a job title or a tech stack; 90 days for anything the draft calls "recent", "just", or "this quarter".
   - **Unsourced** — everything else, including claims supported only by general knowledge.
5. **Rewrite or cut.** Work claim by claim, changing nothing else in the email.
   - Sourced: leave it alone.
   - Stale: either add the hedge the source supports ("as of your Series B last March") or cut it. Never restate a stale fact in the present tense.
   - Unsourced: cut the specific. Only rewrite when a source supports a weaker true version — replace "you're migrating off Redshift" with the posting the source actually shows. Do not replace a deleted specific with a vaguer version of the same claim; that is the same claim with the evidence hidden.
   - Contradicted: cut it and record what the source says instead, in case the correct fact is a better hook.
   - Own-product claims with no source: cut. A customer name, a percentage, or a payback period with no supplied proof point does not ship.
6. **Re-read the rewritten draft.** Cutting claims often leaves a sentence with no subject or a paragraph with no reason to exist. Fix the seams so the email still reads as one message, and say plainly if the draft has nothing personalized left after the cuts — that is a finding about the research, not about the writing.
7. **Assign a verdict.** Deterministic, per draft:
   - **HOLD** — any contradicted claim, any unsourced relationship claim, or any unsourced person fact. These are the ones that get forwarded to the person you got wrong.
   - **FIX** — no contradictions, but one or more unsourced or stale claims remain in the rewritten draft.
   - **SEND** — every remaining claim is sourced and inside its freshness threshold.
8. **Roll the batch up.** Across all drafts, report the claim count, the share sourced, the most common failure type, and which source, if any, produced the most contradictions. Repeated failures are usually one bad source or one bad research step, not many bad emails.

## Output

1. **Claims table** — one row per claim: draft ID, quoted claim, type, status, source ID and quoted supporting line, and the action taken.
2. **Rewritten drafts** — the full corrected email for each, with cuts marked so the author can see what left.
3. **Verdicts** — SEND, FIX, or HOLD per draft, with the single reason for anything that is not SEND.
4. **Sources to add** — the specific lookups that would turn the remaining unsourced claims into sourced ones, phrased as what to search for and what would count as proof.
5. **Batch summary** — the counts, the dominant failure type, and any source flagged as unreliable.

## Example

An excerpt from a check of three drafts against a four-source research pack:

```markdown
| Draft | Claim | Type | Status | Source | Action |
|---|---|---|---|---|---|
| D1 | "your Series B in March" | Company | Sourced | S1: "raised $40M Series B, 2026-03-04" | keep |
| D1 | "now that you own the Nordics rollout" | Person | Unsourced | — | cut |
| D1 | "teams like yours cut ramp time 40%" | Own-product | Unsourced | — | cut |
| D2 | "you're on Snowflake" | Technographic | Contradicted | S3 job post lists BigQuery | cut, note BigQuery |
| D3 | "Priya suggested I reach out" | Relationship | Unsourced | — | cut |

D1 FIX · D2 HOLD (contradicted) · D3 HOLD (unsourced relationship claim)
Batch: 21 claims, 11 sourced (52%). Dominant failure: person facts from S2,
an enrichment export dated 2025-11 — refresh it before the next batch.
```

The pass this skill runs is the one [Claude for sales teams](/guides/sales/claude-for-sales-teams) argues every AI-drafted message needs, and it is the same problem [hallucination-evaluator](/skills/data/hallucination-evaluator) solves for RAG answers — see [grounding](/glossary/grounding) for the general idea. Deliverability is the other half of whether the email lands: run [cold-email-deliverability-auditor](/skills/sales/cold-email-deliverability-auditor) on the sending setup. The rest of the set is in [Claude skills for sales](/guides/sales/claude-skills-for-sales), and the plugin skill that writes these drafts is covered in the [Claude sales plugin guide](/guides/sales/claude-sales-plugin-guide).
