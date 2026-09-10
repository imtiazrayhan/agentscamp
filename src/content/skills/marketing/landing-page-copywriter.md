---
name: "landing-page-copywriter"
description: "Draft landing-page copy from an offer, an audience, and the proof points you actually have, as a complete section set (hero, problem, solution, how it works, proof, pricing framing, FAQ, and three CTA variants) in PAS or AIDA, with a [PROOF NEEDED] marker wherever a testimonial, number, or logo would normally sit but was not supplied. Use when a page needs first-draft copy and you would rather see the gaps than have them filled with invented social proof."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "marketers", "landing-page", "copywriting", "cowork"]
featured: false
related: ["skill:email-sequence-drafter", "skill:brand-voice-profiler", "skill:seo-content-brief-writer", "agent:content-editor", "guide:claude-skills-for-marketers", "tool:claude-design"]
seoDescription: "A Claude skill that drafts landing-page copy (hero, problem, proof, pricing, FAQ, CTAs) in PAS or AIDA from your offer and proof, marking gaps [PROOF NEEDED]."
summary: "Give this skill an offer, an audience, and the proof you actually have and it drafts a full landing page in PAS or AIDA: hero with headline variants, problem, solution, how it works, proof, pricing framing, FAQ, and three CTA variants. It never invents a testimonial, number, or logo; every slot that would hold one gets a [PROOF NEEDED] marker instead."
---

A landing page drafted by an AI assistant usually arrives with three glowing testimonials, a "trusted by 10,000 teams" line, and a logo row, none of which exist. This skill builds the copy from the offer, the audience, and the proof points you list; every place social proof would normally go is a bracketed marker until you supply the real thing. You get a page you can read as a page and a checklist of what to collect. It works from pasted text alone, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- A product, feature, event, or lead magnet needs a page and no copywriter is free this week.
- The [seo-content-brief-writer](/skills/marketing/seo-content-brief-writer) skill classified a keyword as transactional and the right response is a page, not an article.
- A page converts poorly and you want a rewrite that keeps only the claims you can stand behind.
- You are handing copy to a designer or to [Claude Design](/tools/claude-design) and need it structured by section before the layout exists.

> [!NOTE]
> Proof is whatever you paste: a quote with name and permission, a number with its source, a logo you may show, a case study. Nothing else exists for the skill. It never writes a price: given one, it frames it; otherwise it leaves a `[PRICE]` token. Voice comes from a pasted [brand-voice-profiler](/skills/marketing/brand-voice-profiler) rules block if you have one.

## Instructions

1. **Inventory the inputs.** Three lists: the offer (what it is, what it does for the buyer, price if given), the audience (role, situation, objections in their own words where supplied), and the proof points, each tagged TESTIMONIAL (name, permission), NUMBER (source), LOGO (permission), or CASE STUDY. Anything missing is "not provided".
2. **Choose the framework.** PAS (problem, agitation, solution) by default for an audience that knows it has the problem; AIDA (attention, interest, desire, action) for one that does not; or whichever the user names. State the choice and a one-line reason at the top.
3. **Write the hero.** A headline of at most ten words, a subhead of at most 25, the primary CTA button text, and a one-line "who this is for". Give three headline variants: outcome-led, problem-led, and a plain description of the offer.
4. **Write the problem section.** Two or three short paragraphs or bullets in the audience's own words, drawn from the objections and situation you were given. No invented quotes, no "we've all been there".
5. **Write the solution section.** The offer stated as the outcome first, then the mechanism in one paragraph. Capabilities come from the offer notes only.
6. **Write "How it works".** Three or four numbered steps, one sentence each plus an optional detail line: what the buyer does and what happens next.
7. **Write the proof section.** Place every supplied proof item with its type. For each slot you have nothing for, write a marker saying what is needed: `[PROOF NEEDED: customer quote about time saved in the first week]`, `[PROOF NEEDED: logo row, 4 to 6 customers with permission]`.
8. **Frame the pricing.** With a price: plan names, what each includes, any guarantee or trial supplied, and one line anchoring the price to the outcome. Without one: the same copy around a `[PRICE]` token. Never a price, discount, or comparison from memory.
9. **Write the FAQ.** Five to seven questions from the objection list and the gaps a buyer would notice. Answer only from the inventory; where the inventory is silent, the answer reads `[ANSWER NEEDED: refund window]`.
10. **Write three CTA variants.** Direct ("Start your trial"), low-commitment ("See a 3-minute demo"), and benefit-led, each with button text of four words or fewer and a microcopy line that makes no unproven claim.
11. **Run the claims pass.** Remove "guaranteed", "#1", "best", "fastest", "leading", and any competitor comparison unless a proof item backs it. List what was removed and why, then assemble: Framework, Hero, Problem, Solution, How it works, Proof, Pricing, FAQ, CTA variants, Proof needed checklist, Claims removed.

## Output

A Markdown page draft with the sections in that order, plus the two closing lists. The "Proof needed" checklist is the marketer's to-do list; when the items come back, paste them in with the draft and re-run the skill. The [email-sequence-drafter](/skills/marketing/email-sequence-drafter) skill takes the same offer notes and writes the emails that send people to the page, and the [content-editor](/agents/marketing/content-editor) agent can check the final copy for voice and any claim that crept back in.

## Example

Excerpt of a PAS draft for an invoicing tool for freelance designers, with two proof items supplied:

```markdown
### Hero
Headline A (outcome): Get paid without chasing anyone
Headline B (problem): Your invoices should not need a follow-up email
Subhead: Send the invoice once. Reminders, receipts, and late fees run on their own.
CTA: Start free
For: freelance designers who bill by the project

### Proof
NUMBER: "Customers on the reminder plan were paid a median of 6 days sooner" (source: internal billing data, Q2 2026, per offer notes)
TESTIMONIAL: "I stopped writing 'just checking in' emails." Dana R., brand designer (permission: yes)
[PROOF NEEDED: logo row, 4 to 6 customers with permission]

### Claims removed
- "the fastest way to get paid": no proof item supports a speed comparison.
```

The full marketer's toolkit is described in [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers).
