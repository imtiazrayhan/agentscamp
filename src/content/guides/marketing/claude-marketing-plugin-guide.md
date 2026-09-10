---
title: "Anthropic's Marketing Plugin for Claude: Every Skill and Command Explained"
description: "Every skill in Anthropic's open-source marketing plugin for Claude Cowork and Claude Code, its connectors, the install commands, and how to fork it."
seoTitle: "Anthropic's Marketing Plugin for Claude: Every Skill Explained"
seoDescription: "All eight skills in Anthropic's marketing plugin for Claude Cowork and Claude Code, its .mcp.json connectors, install commands, and how to fork it."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "cowork", "plugins", "marketing", "skills", "brand-voice", "seo"]
featured: false
keywords: ["Claude marketing plugin", "Anthropic marketing plugin", "Cowork marketing plugin", "knowledge-work plugins marketing", "brand-review skill"]
summary: "Anthropic's marketing plugin is an Apache-2.0 folder in the knowledge-work-plugins repo: eight SKILL.md files (draft-content, campaign-plan, brand-review, competitive-brief, performance-report, seo-audit, email-sequence, content-creation) plus an .mcp.json of marketing connectors. It installs from Cowork's Customize menu or two claude plugin commands."
keyTakeaways:
  - "As of September 2026 the plugin ships eight skills, not the seven commands plus five skills its README lists; the repo tree is the source of truth."
  - "Seven skills are slash-invocable (/marketing:draft-content and friends); content-creation is user-invocable: false and loads silently as reference."
  - "brand-review and draft-content look for a configured brand guide and fall back to a generic pass if none exists; the fork step that matters is adding yours."
  - "Cowork: Customize > Plugins > Browse plugins > Install. Claude Code: add the knowledge-work-plugins marketplace, then install marketing@knowledge-work-plugins."
  - ".mcp.json pre-configures ten hosted connectors (Slack, Canva, Figma, HubSpot, Amplitude, Notion, Ahrefs, Similarweb, Klaviyo, Supermetrics) by category."
  - "Anthropic's brand-review enforces a guide you already have; the AgentsCamp brand-voice-profiler derives that guide from samples. Run ours first, then theirs."
faq:
  - q: "What is in Anthropic's marketing plugin for Claude?"
    a: "Eight skills as of September 2026: draft-content, campaign-plan, brand-review, competitive-brief, performance-report, seo-audit, email-sequence, and content-creation, plus an .mcp.json that pre-configures Slack, Canva, Figma, HubSpot, Amplitude, Notion, Ahrefs, Similarweb, Klaviyo, and Supermetrics connectors. It lives in the marketing folder of the anthropics/knowledge-work-plugins repository under the Apache 2.0 license."
  - q: "How do I install the marketing plugin in Claude Cowork?"
    a: "Open Cowork in Claude Desktop, click Customize in the left sidebar, open the Plugins tab, click Browse plugins, and press Install on marketing. Plugins are available on all paid plans (Pro, Max, Team, Enterprise). The bundled connectors are set up for you, though you still authorize each service the first time it is used."
  - q: "How do I install it in Claude Code?"
    a: "Two terminal commands: claude plugin marketplace add anthropics/knowledge-work-plugins, then claude plugin install marketing@knowledge-work-plugins. Skills then fire automatically when a task matches and are also available as namespaced commands such as /marketing:brand-review and /marketing:seo-audit."
  - q: "Does the plugin know my brand voice?"
    a: "Not until you give it one. The README says to configure your brand voice, style guide, and personas in a local settings file, and brand-review and draft-content check for that configuration. If nothing is configured they ask you to paste guidelines or fall back to a generic clarity-and-consistency review. Forking the plugin and adding a brand guide file is the intended fix."
  - q: "Why does the README mention commands the plugin does not have?"
    a: "The README predates a restructure. It lists seven slash commands and five skills, but the folder contains no commands directory and eight skill folders. The seven former commands became skills with the same names, and the Claude Code plugin docs now recommend putting everything in skills. Anthropic's root README also shows the newer two-command install syntax; the marketing README still shows an older one."
related: ["guide:claude-code-for-marketers", "guide:claude-knowledge-work-plugins", "guide:brand-voice-with-claude-skills", "guide:seo-content-workflow-with-claude-code", "skill:brand-voice-profiler", "skill:content-repurposer", "tool:claude-cowork", "glossary:claude-plugins"]
sources:
  - title: "anthropics/knowledge-work-plugins: marketing plugin (README, skills/, .mcp.json, CONNECTORS.md, plugin.json)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/marketing"
    publisher: "Anthropic"
  - title: "anthropics/knowledge-work-plugins: root README (install commands)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Use plugins in Claude"
    url: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude"
    publisher: "Anthropic"
  - title: "Create plugins (Claude Code docs)"
    url: "https://code.claude.com/docs/en/plugins"
    publisher: "Anthropic"
---

Anthropic's marketing plugin is one folder inside the open-source `knowledge-work-plugins` repository: eight Markdown skills, a JSON file of connectors, and an Apache 2.0 license. Install it in [Claude Cowork](/tools/claude-cowork) or Claude Code and Claude gets a repeatable procedure for drafting content, planning campaigns, reviewing copy against a brand guide, briefing on competitors, auditing SEO, building email sequences, and reporting on performance. This guide covers every skill, the connectors, the install commands, and the fork that makes it use your brand guide.

It drills into a single plugin. The catalog of every role plugin, the repo's history, and licensing are in [Anthropic's knowledge-work plugins, explained](/guides/getting-started/claude-knowledge-work-plugins); the term is in the glossary under [Claude plugins](/glossary/claude-plugins). New to Claude for marketing work? Start with the pillar, [Claude Code for marketers](/guides/marketing/claude-code-for-marketers).

## What is actually in the folder

Read the repository tree, not the README. As of September 2026 the marketing README still lists seven slash commands and five skills, but the folder has no `commands/` directory. It has eight skill folders, a `.mcp.json`, a `CONNECTORS.md`, a `LICENSE`, and `.claude-plugin/plugin.json` (version `1.2.0`); the last change was a Slack OAuth fix on April 23, 2026.

The seven former commands are now skills with the same names, and since skills double as slash commands nothing was lost: `/marketing:draft-content` works as `/draft-content` did. The eighth, `content-creation`, sets `user-invocable: false`, so it never appears as a command; Claude loads it silently as reference material (templates, headline formulas, CTA guidance) whenever it writes.

## Every skill

Descriptions are condensed from each `SKILL.md`'s frontmatter, the text Claude matches your request against.

| Skill | What it does | Triggers when you |
|---|---|---|
| `draft-content` | Drafts blog posts, social posts, newsletters, landing pages, press releases, and case studies with channel-specific formatting and SEO suggestions; asks for type, topic, audience, key messages, tone, and length if missing | Ask to draft, write, or create marketing content, or need headline or subject-line options |
| `campaign-plan` | Produces a campaign brief: objectives, audience, messaging, channel strategy, week-by-week content calendar with dependencies, and success metrics | Plan a launch, lead-gen push, or awareness campaign |
| `brand-review` | Reviews content against your brand voice, style guide, and messaging pillars; flags deviations by severity with before/after fixes; always checks for unsubstantiated claims, missing disclaimers, and comparative claims | Ask to review, check, or audit a draft before it ships |
| `competitive-brief` | Researches competitors and generates a positioning and messaging comparison with content gaps, opportunities, threats, and battlecard material | Build battlecards, find unclaimed positioning, or assess a competitor's move |
| `performance-report` | Builds a report with key metrics, trend analysis, wins and misses, and prioritized optimization recommendations, ending in an executive summary | Wrap a campaign or prepare a weekly, monthly, or quarterly channel summary |
| `seo-audit` | Runs a full site audit, keyword research, content-gap analysis, technical check, or competitor comparison and returns a plan split into quick wins and strategic investments | Assess a site's SEO health or find keyword opportunities |
| `email-sequence` | Designs multi-email flows with full copy, timing, branching logic, exit conditions, benchmarks, and A/B suggestions | Build onboarding, nurture, re-engagement, win-back, or launch flows |
| `content-creation` | Background reference: content-type templates, per-channel best practices, SEO fundamentals, headline formulas, CTA guidance | Never invoked directly; loads when any content is being written |

Two things to know before relying on them. `brand-review` and `draft-content` both check for a configured brand guide; without one, `brand-review` falls back to a generic clarity-and-consistency pass and `draft-content` defaults to "a neutral professional tone." And `brand-review` runs its legal flags regardless: superlatives without evidence, claims that may need disclaimers, unattributed testimonials, and copy that reads like a close paraphrase of another source.

## Connectors the plugin expects

Skills never name a product. They refer to tool *categories* with a `~~` placeholder (`~~SEO`, `~~email marketing`), and whatever MCP server you have connected in that category fills the slot. `CONNECTORS.md` maps them:

| Category | Placeholder | In `.mcp.json` | Other options the file names |
|---|---|---|---|
| Chat | `~~chat` | Slack | Microsoft Teams |
| Design | `~~design` | Canva, Figma | Adobe Creative Cloud |
| Marketing automation | `~~marketing automation` | HubSpot | Marketo, Pardot, Mailchimp |
| Product analytics | `~~product analytics` | Amplitude (US and EU endpoints) | Mixpanel, Google Analytics |
| Knowledge base | `~~knowledge base` | Notion | Confluence, Guru |
| SEO | `~~SEO` | Ahrefs, Similarweb | Semrush, Moz |
| Email marketing | `~~email marketing` | Klaviyo | Mailchimp, Brevo, Customer.io |
| Marketing analytics | `~~marketing analytics` | Supermetrics | Google Analytics, Mailchimp, Semrush |

Every entry in `.mcp.json` is a hosted HTTP server (`mcp.hubspot.com`, `api.ahrefs.com/mcp`, `mcp.klaviyo.com`), so there is nothing to run locally; `google calendar` and `gmail` have empty URLs as placeholders for Cowork's built-in connectors. No skill requires a connector: `seo-audit` falls back to web search and notes that connecting Ahrefs or Semrush "will auto-populate with ranking data." The concept is covered under [AI connectors](/glossary/ai-connectors).

## Installing in Cowork

Plugins are available on all paid plans. In Claude Desktop, open the **Cowork** tab, click **Customize** in the left sidebar, open the **Plugins** tab, click **Browse plugins**, and press **Install** on marketing. The bundled connectors are set up for you, though each service still asks for authorization the first time a skill reaches for it. Type `/` in the composer to see the seven invocable skills.

One Cowork-only detail: while viewing an installed plugin, a **Customize** button in the upper right opens a Cowork task that asks Claude to adjust the plugin's skills and connectors to how you work. That is the no-terminal path to the fork below.

## Installing in Claude Code

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install marketing@knowledge-work-plugins
```

Inside a session, `/plugin marketplace add` and `/plugin install` do the same. Skills fire automatically when a request matches and are also namespaced commands: `/marketing:brand-review`, `/marketing:seo-audit`, `/marketing:email-sequence`. The marketing README still shows an older `claude plugins add knowledge-work-plugins/marketing` form; use the two commands above, which match the root README and the Claude Code plugin docs. If the terminal is new to you, [Installing Claude Code](/guides/getting-started/installing-claude-code) is the ten-minute setup; [Claude Code plugins](/guides/configuration/claude-code-plugins) covers the format in depth.

## Forking it and adding your brand guide

The README calls the plugin a "generic starting point" and says to configure your brand voice, style guide, and personas "in a local settings file" without naming one. The clean fork looks like this.

1. **Copy the folder.** Clone the repo and copy `marketing/` to your own repository as `acme-marketing/`. Change `name` in `.claude-plugin/plugin.json` so the namespace becomes `/acme-marketing:...`.
2. **Add the guide as a file.** Put your brand guide at `acme-marketing/brand-guide.md`. If you do not have one written down, derive it first: the [brand-voice-profiler](/skills/marketing/brand-voice-profiler) skill takes five to ten samples of your existing copy and produces a rules document. The full procedure is in [Build a brand-voice skill for Claude](/guides/marketing/brand-voice-with-claude-skills).
3. **Point the skills at it.** In `skills/brand-review/SKILL.md` and `skills/draft-content/SKILL.md`, replace the "if a brand style guide is configured in local settings" step with "read `../../brand-guide.md` and apply it." Add house terminology and banned words under the skill's terminology section.
4. **Trim the connectors.** Delete the `.mcp.json` entries you will never authorize and swap in your stack; Customer.io instead of Klaviyo is a one-entry change.
5. **Test locally.** `claude --plugin-dir ./acme-marketing` loads the folder for one session without installing it. In Cowork, zip the folder and upload it as a custom plugin file from the same Plugins tab.
6. **Distribute.** On Team and Enterprise plans an owner can create an organization marketplace in **Organization settings > Plugins**, fed by ZIP uploads or a synced private GitHub repository, and mark the plugin *Installed by default* or *Required*. Apache 2.0 allows all of this as long as the license notice stays.

> [!TIP]
> Keep the brand guide as one file the skills reference rather than pasting it into every `SKILL.md`; it only enters context when a skill reaches for it, and you edit it in one place.

## How the AgentsCamp skills fit alongside it

The plugin assumes you already have a brand guide and finished assets. The marketing skills on this site fill the gaps in front of and behind it.

- **[brand-voice-profiler](/skills/marketing/brand-voice-profiler)** derives a voice guide from samples. Anthropic's `brand-review` enforces a guide you supply. Run ours once, then hand the output to theirs.
- **[content-repurposer](/skills/marketing/content-repurposer)** turns a finished piece into channel-specific cuts. Anthropic's `draft-content` starts from a brief, not an existing asset, so the two chain: draft with theirs, repurpose with ours.
- **[seo-content-brief-writer](/skills/marketing/seo-content-brief-writer)** produces the per-article brief that `seo-audit` does not: the audit finds gaps, the brief tells a writer what to do about one. The end-to-end flow is in [An SEO content workflow in Claude Code](/guides/marketing/seo-content-workflow-with-claude-code).

Whatever Claude drafts still has to clear Google's quality bar; [Does AI-written content rank in 2026?](/guides/marketing/ai-content-and-search-2026) covers what Google actually says.
