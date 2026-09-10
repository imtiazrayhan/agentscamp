---
name: "competitor-teardown"
description: "Build a structured teardown of one competitor from the pages, screenshots, and pricing text you paste in: positioning, target customer, pricing model, a feature table with evidence, and the wedge opportunities where you could win, with every unknown flagged as something to research rather than guessed. Use when sizing up a competitor before a PRD, a pitch, or a pricing decision and you want an analysis grounded only in what they publish."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["claude", "founders", "competitive-analysis", "pricing", "product"]
featured: false
related: ["skill:prd-writer", "skill:user-interview-synthesizer", "skill:web-research-pipeline", "guide:claude-skills-for-founders", "guide:best-ai-tools-for-founders-2026"]
seoDescription: "A Claude skill that turns pasted competitor pages and pricing into a teardown: positioning, ICP, pricing model, feature table, wedges, gaps to research."
summary: "Paste a competitor's homepage, pricing page, docs, or screen descriptions and this skill returns a teardown built only from that material: positioning quoted verbatim, the customer they target, pricing model and tier gates, a feature table with evidence, three to five wedge opportunities, and a checklist of gaps to research. Nothing is filled in from memory."
---

A competitor teardown written from memory is mostly a list of things you believe about a product you have not used lately. This skill does the opposite: you paste what the competitor actually publishes (homepage, pricing page, a docs section, your description of a few screens, review excerpts) and it produces a teardown that cites that material line by line. Where the material is silent, it says so and adds the question to a research list instead of guessing. It needs no browser or tools, only pasted text, so it works on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- You are writing a PRD and need the competitive landscape section to be evidence rather than opinion; the [prd-writer](/skills/product/prd-writer) skill can take this output as input.
- You are setting or changing prices and want to see exactly where a competitor's tiers gate features.
- An investor asked "how are you different from X?" and you want an answer that survives them opening X's website.
- You are choosing a wedge, a narrow segment or use case to win first, and want it derived from the competitor's blind spots rather than your preferences.

> [!NOTE]
> The skill works only from what you paste. It will not state a price, feature, customer count, or funding round from memory, even for a well-known product, because that memory has a date. Everything it cannot see goes into Gaps to research. In Claude Code with web access, hand that section to the [web-research-pipeline](/skills/data/web-research-pipeline) skill for a cited follow-up.

## Instructions

1. **Inventory the material.** List every source the user pasted: what page or screen it is and the date it was captured (if missing, continue with "date not given"). This inventory is the entire evidence base; nothing outside it exists for the analysis.
2. **Extract positioning.** Quote the headline, subheadline, and any tagline exactly. Then state in one line each: the category they claim to be in, the promise they make, and who they name or imply as the alternative ("replace your spreadsheet", "unlike legacy tools"). Mark each as STATED (quoted) or INFERRED (your reading).
3. **Identify the target customer.** Derive the ideal customer profile from the language, plan names, logos or case studies, advertised integrations, and roles named on the site. Two or three sentences, each claim marked STATED or INFERRED. If the material shows two audiences (a marketing page for teams, docs for developers), report both.
4. **Describe the pricing model.** Name the model type: per seat, usage based, flat, freemium with tiers, sales-led, or a mix. Then list the tiers by their published names and, for each, what the pricing page says it gates (seats, volume, features, support). Copy figures exactly as they appear, with currency and billing period, and attach the capture date. If no pricing material was provided, this section reads "NOT PROVIDED, see Gaps to research" and nothing else.
5. **Build the feature table.** Columns: Feature, Competitor (Yes / No / Unclear), Evidence (which source, quoted phrase). If the user supplied their own feature list, add a Yours column. "Unclear" is the correct answer whenever the material does not mention a feature; do not downgrade it to "No".
6. **Find wedge opportunities.** Three to five, each derived from a specific observation in the material: a segment their language ignores, a pricing cliff between two tiers, a feature marked No or Unclear that your interviews say matters, a complaint pattern (only if review excerpts were provided), or a positioning promise their own docs undercut. Each wedge has three fields: Observation (with source), Opportunity, and What would need to be true for it to work.
7. **List the gaps to research.** Everything marked INFERRED or Unclear, plus what a founder would want that the material did not cover: pricing if absent, churn signals, recent changes, integrations, support quality. Phrase each as a question and suggest where the answer lives (changelog, docs, a free trial, a review site, one of their customers).
8. **Assemble the teardown** in this order: Sources, Positioning, Target customer, Pricing model, Feature table, Wedge opportunities, Gaps to research. Keep it to two pages.

## Output

A Markdown teardown with the seven sections above. Every factual line either quotes a source from the inventory or carries an INFERRED label, and the Gaps to research section is a checklist you can hand to whoever does the next pass. Run the skill once per competitor and compare the feature tables side by side.

## Example

Excerpt from a teardown of a pasted pricing page captured on 3 September 2026:

```markdown
### Pricing model
Model: freemium with three self-serve tiers plus a sales-led tier (STATED).
- Free: "up to 3 projects", no integrations listed
- Pro: gates "unlimited projects" and "Slack + Zapier"
- Team: gates "roles and permissions" and "SSO"
Price cliff: integrations sit behind Pro, so a solo user who needs one integration pays for unlimited projects they do not need.

### Wedge opportunities
1. Observation: integrations are gated at Pro (pricing page). Opportunity: a free tier with one integration for solo users. What would need to be true: solo users are a meaningful share of their signups (INFERRED, research).
```

Run it alongside the [user-interview-synthesizer](/skills/product/user-interview-synthesizer) skill so the inside and outside views land in the same PRD; [Claude skills for founders](/guides/founders/claude-skills-for-founders) shows the sequence.
