---
title: "Claude for Marketing Teams: claude.ai, Cowork, Claude Design, and Connectors"
description: "A surface map for marketing teams: which Claude product to open for brand context, asset folders, recurring reports, decks, CMS chores, and connectors."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "cowork", "claude-design", "connectors", "marketing-teams", "hubspot"]
featured: false
seoTitle: "Claude for Marketing Teams: Which Surface for Which Job"
seoDescription: "Which Claude surface a marketing team opens for brand context, asset folders, recurring reports, decks, CMS chores, and HubSpot, Drive, and Slack connectors."
keywords: ["claude for marketing teams", "claude cowork marketing", "claude design marketing", "claude connectors hubspot", "claude in chrome marketing"]
summary: "One Claude subscription opens a chat workspace, a desktop agent, a design tool, a browser extension, and a coding agent. For a marketing team the split is where the work lives: brand context in claude.ai Projects, asset folders and recurring reports in Cowork, decks in Claude Design, CMS chores in Claude in Chrome, and repeating files in Claude Code."
keyTakeaways:
  - "All surfaces share one usage pool. Which one you open decides where Claude can reach and what it leaves behind, not how good the model is."
  - "Projects hold brand context: upload the style guide, personas, and past work once, and every chat starts with it. Team plans share a project with edit rights."
  - "Cowork works in folders and desktop apps you choose and can run a task daily, weekly, or monthly. That is the surface for asset folders and the Monday report."
  - "Claude Design (beta on paid plans) turns a conversation into one-pagers, decks, and prototypes, exports PDF, PowerPoint, and HTML, and hands off to Canva."
  - "Claude in Chrome reads, clicks, and fills forms in a website; Anthropic says it is still risky. Use it for CMS and ads-console chores you can watch."
  - "Connectors are MCP integrations. Google Drive, Slack, Gmail, and HubSpot are in the directory; the marketing plugin pre-configures HubSpot, Ahrefs, and Klaviyo."
sources:
  - title: "What are projects?"
    url: "https://support.claude.com/en/articles/9517075-what-are-projects"
    publisher: "Anthropic"
  - title: "Claude Cowork"
    url: "https://claude.com/product/cowork"
    publisher: "Anthropic"
  - title: "Get started with Claude Design"
    url: "https://support.claude.com/en/articles/14604416-get-started-with-claude-design"
    publisher: "Anthropic"
  - title: "Get started with Claude in Chrome"
    url: "https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome"
    publisher: "Anthropic"
  - title: "Use connectors to extend Claude's capabilities"
    url: "https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities"
    publisher: "Anthropic"
  - title: "HubSpot connector"
    url: "https://claude.com/connectors/hubspot"
    publisher: "Anthropic"
  - title: "What is the Team plan?"
    url: "https://support.claude.com/en/articles/9266767-what-is-the-team-plan"
    publisher: "Anthropic"
  - title: "Marketing plugin (anthropics/knowledge-work-plugins)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/marketing"
    publisher: "Anthropic"
faq:
  - q: "Where should a marketing team keep its brand context in Claude?"
    a: "In a Project. Projects are self-contained workspaces with their own chat history and knowledge base, plus project instructions that apply to every chat inside. Upload the style guide, personas, messaging pillars, and a few best pieces, and put the non-negotiable rules in the instructions. On Team and Enterprise a project can be shared with view or edit permissions, so one person maintains it and everyone works from it."
  - q: "What is the difference between Cowork and Claude Code for a marketer?"
    a: "Cowork works across the folders and desktop apps you choose and returns documents: a report from a folder of PDFs, a summary from Slack and Drive, a deck. Claude Code works inside one folder, edits files, and runs commands, and leaves scripts and a change history behind. If the deliverable is a document, Cowork. If it is a set of files that will need the same treatment again next month, Claude Code."
  - q: "Can Claude Design replace our design tool?"
    a: "Not yet, and Anthropic does not claim it does. It is in beta, produces designs, prototypes, and presentations from a conversation, learns a design system from your existing files, and exports to PDF, PowerPoint, and HTML, with handoffs to Canva, Gamma, Adobe, and others. Multi-person editing is listed as unreliable. Use it for the first version of a one-pager, deck, or landing-page mockup and finish in the tool your designer lives in."
  - q: "Which connectors matter for marketing?"
    a: "Google Drive, Gmail, Google Calendar, Slack, and Microsoft 365 are the ones Anthropic names in the Team plan description, and HubSpot has its own connector for searching and updating contacts, companies, deals, and campaigns. The marketing plugin pre-configures HubSpot, Ahrefs, Similarweb, Klaviyo, Supermetrics, Amplitude, Canva, Figma, Notion, and Slack. Everything else in the directory, and any custom remote MCP server, is available too."
related: ["guide:claude-code-for-marketers", "guide:which-claude-plan-for-marketers", "guide:claude-cowork-guide", "guide:claude-marketing-plugin-guide", "tool:claude", "tool:claude-cowork", "tool:claude-design", "tool:claude-for-chrome"]
---

A Claude subscription is five surfaces sharing one model and one usage pool: the chat app, a desktop agent, a design tool, a browser extension, and a coding agent. For a marketing team the question is never "which is best" but "where does this job live": in a conversation, in a folder, on a canvas, in a website, or in a repo. This guide is the map, written by a developer who uses all five and watches marketing teams open the wrong one.

## The one-table version

| Job | Open | Why this surface |
|---|---|---|
| Keep the style guide, personas, and past work at hand for every chat | [claude.ai](/tools/claude) Projects | Project knowledge and instructions apply to every chat inside |
| Draft one email, one post, one brief; think through positioning | claude.ai | Chat is the right shape; the Project supplies the context |
| Turn a folder of assets, transcripts, or PDFs into a report or tracker | [Claude Cowork](/tools/claude-cowork) | Works directly in folders and desktop apps you choose |
| The Monday performance summary, every Monday | Cowork scheduled task | Runs daily, weekly, or monthly without you |
| A one-pager, a deck, a social set, a landing-page mockup | [Claude Design](/tools/claude-design) | Conversation to canvas; exports PDF, PPTX, HTML |
| Update the CMS, tidy an ads console, fill a form on a portal | [Claude in Chrome](/tools/claude-for-chrome) | Reads, clicks, and types in the site alongside you |
| Edit thirty posts, analyze an export, build a page, run a check on every draft | Claude Code | Edits files and runs commands in a folder; see the [marketers pillar](/guides/marketing/claude-code-for-marketers) |

The rest of this guide is the reasoning behind each row.

## claude.ai and Projects: where the brand context lives

Anthropic describes Projects as "self-contained workspaces with their own chat histories and knowledge bases." For a marketing team that is the answer to the question every new chat otherwise asks: what does this brand sound like? Upload the style guide, the personas, the messaging pillars, and five of your best pieces to project knowledge, and write the rules you would otherwise repeat (banned phrases, product naming, the "no stat without a source" rule) into the project instructions. Every chat in the project starts with all of it.

Two details matter. On paid plans a large knowledge base switches to a retrieval mode that, in Anthropic's words, expands capacity "by up to 10x," so you can keep adding past work. And on Team and Enterprise a project can be shared with "Can view" or "Can edit" permissions, so one owner maintains the brand project and everyone else chats from it. That is the closest thing Claude has to a team brand-voice setting. Skills upload here too; the five built for marketers are in [Claude Skills for Marketers](/guides/marketing/claude-skills-for-marketers).

## Cowork: asset folders and recurring reports

[Claude Cowork](/tools/claude-cowork) is the surface marketing teams have tried least and would use most. Anthropic's description: it "works directly in folders and tools you choose, and runs your task to deliver work for review." Point it at the launch folder and it reads the brief, the transcripts, and the old campaign files, then produces the announcement, the FAQ, and the social sequence as files in that folder.

The second use is the one that pays weekly. Cowork can "schedule a task for any cadence, and it runs unattended," with daily, weekly, or monthly options. A Monday task that pulls last week's numbers from connected tools and writes a one-page summary is the textbook case. Cowork also opens its own browser in a side panel when a task needs a website, separate "from your own browser, logins, and tabs," which is how it fills a form without touching your session.

Anthropic's marketing plugin was built for this surface first: eight skills for drafting, campaign plans, brand review, competitive briefs, performance reports, SEO audits, and email sequences, plus pre-configured connectors. The walkthrough is [Anthropic's Marketing Plugin: A Guide](/guides/marketing/claude-marketing-plugin-guide), and the general setup is the [Cowork guide](/guides/getting-started/claude-cowork-guide).

## Claude Design: one-pagers, decks, social sets

[Claude Design](/tools/claude-design) is, in Anthropic's words, a way to "create designs, interactive prototypes, presentations, and more by having a conversation with Claude." It lives at claude.ai/design and in the desktop sidebar, and as of September 2026 it is in beta on Pro, Max, Team, and Enterprise (off by default on Enterprise).

Two things make it useful to a marketing team rather than a toy. It learns a design system from files you attach, so the third one-pager matches the first. And it exports where marketers need things: PDF, PowerPoint, standalone HTML, and handoffs to Canva, Gamma, Adobe, Miro, and others, or to Claude Code when a mockup should become a real page. The beta limits are the ones to expect: multi-person editing is listed as unreliable, and it is web and desktop only. Use it for the first version of the sales one-pager, the webinar deck, and the campaign landing-page mockup; finish in the designer's tool.

## Claude in Chrome: CMS and ads-console chores

[Claude in Chrome](/tools/claude-for-chrome) is "a browser extension that allows Claude to read, click, and navigate websites alongside you," available on Pro, Max, Team, and Enterprise. It can work across multiple tabs, record a workflow, and run scheduled tasks, and it runs inside Cowork and Claude Code as well as its own side panel.

The marketing jobs are the ones with no export button and no API you have access to: updating meta descriptions in a CMS that only has a web editor, pausing a set of ad groups, pulling a report a platform only shows on screen, filling a partner's submission form. Anthropic's own article says the extension "is enhanced with our safety classifiers but is still risky." Keep it on tasks you can watch, and away from anything where a wrong click spends money until you have seen it work on that site.

## Connectors: Drive, Slack, HubSpot, and the rest

[Connectors](/glossary/ai-connectors) "let Claude access your apps and services, retrieve your data, and take actions within connected services." They are MCP integrations under the hood, browsed from Customize > Connectors or at claude.ai/connectors, and they work across chat, Cowork, Claude Desktop, and Claude Code. Custom remote MCP connectors work on every plan; the free plan is limited to one.

For a marketing team the Team plan description names the core set: Google Drive, Gmail, Google Calendar, GitHub, Microsoft 365, and Slack. HubSpot has its own connector, described as letting you "search and update contacts, companies, deals, tickets, campaigns, and more" and "analyze campaign performance across emails, landing pages, and blog posts." The marketing plugin goes further, pre-configuring Ahrefs, Similarweb, Klaviyo, Supermetrics, Amplitude, Canva, Figma, and Notion alongside HubSpot and Slack, with each skill written against a category (`~~SEO`, `~~email marketing`) so whichever tool you connect fills the slot. Anthropic's usage article calls connectors token-intensive, which is a reason to enable the ones a task needs rather than all of them.

## Choosing, and paying for it

Start in the brand Project unless the output is a file, a deck, or a change on a website. Folder of things or a recurring report: Cowork. Something that has to look finished: Claude Design. A website with no export: Claude in Chrome. Files that repeat, exports, pages, and checks: Claude Code, covered in [Claude Code for Marketers](/guides/marketing/claude-code-for-marketers).

All five draw from one usage pool, and on Team plans the limits apply per member. Which tier fits a solo marketer, a team sharing a brand project, or an agency is in [Which Claude Plan Should a Marketer Pay For?](/guides/marketing/which-claude-plan-for-marketers). The rest of the toolkit for your role is at the [marketers hub](/for/marketers).
