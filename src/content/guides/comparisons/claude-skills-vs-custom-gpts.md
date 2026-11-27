---
title: "Claude Skills vs Custom GPTs: Different Answers to Reuse"
description: "Custom GPTs retire on December 11, 2026 and migrate into plugins built on skills. How Claude Skills compare, with the same task written both ways."
author: "Imtiaz Rayhan"
date: 2026-07-18
updated: 2026-11-27
reviewed: 2026-11-27
color: "purple"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["skills", "custom-gpts", "comparison", "chatgpt", "claude"]
featured: false
seoTitle: "Claude Skills vs Custom GPTs (GPTs Retire Dec 11, 2026)"
seoDescription: "Custom GPTs retire December 11, 2026 and migrate to plugins built on skills. Claude Skills vs GPTs on format, sharing, API access and what to do now."
keywords: ["claude skills vs custom gpts", "claude skills vs gpts", "custom gpt alternative", "agent skills vs gpts", "custom gpts retiring"]
summary: "OpenAI is retiring Custom GPTs on December 11, 2026 and moving creators to plugins, where a GPT's instructions become a skill. So the choice is no longer skill or GPT: write the workflow as a SKILL.md folder. A Claude Skill is that format already, and it runs in claude.ai, Claude Code and the API."
keyTakeaways:
  - "Custom GPTs are scheduled to retire on December 11, 2026 (February 28, 2027 for FedRAMP workspaces and approved Enterprise deferrals). After that date GPTs and their pages become inaccessible."
  - "New GPT creation and publishing are already closed on personal ChatGPT accounts, including Free, Go, Plus and Pro."
  - "OpenAI's migration turns a GPT's instructions into a skill inside a plugin and copies knowledge files into reference files. Custom actions do not transfer."
  - "A Claude Skill is a folder with a SKILL.md file. The same open format is what ChatGPT and Codex skills build on, so a well-written skill is the portable asset."
  - "The gap that remains is distribution: a GPT had a public store page, while a skill is shared as a file, a workspace library entry or a plugin."
faq:
  - q: "Are Custom GPTs being discontinued?"
    a: "Yes. OpenAI's help center says custom GPTs are scheduled to retire on December 11, 2026, with a later date of February 28, 2027 for FedRAMP workspaces and Enterprise workspaces that have an approved deferral. Existing GPTs keep working until the date that applies to the account where they were created, and past conversations stay in your history afterwards."
  - q: "Can I still create a new Custom GPT?"
    a: "Not on a personal account. OpenAI states that new GPT creation and publishing are not available on Free, Go, Plus or Pro. For affected Enterprise workspaces, creation ended on October 26, 2026. You can still edit a GPT you already own until it is migrated, at which point the original becomes read-only."
  - q: "What happens to my GPT's knowledge files and actions when I migrate?"
    a: "Knowledge files are copied into the new plugin's reference files and the instructions become a skill. Connected apps come across as apps. Custom actions do not transfer; OpenAI says rebuilding that connection may require a custom MCP server. The GPT's selected model does not carry over either, and the plugin starts private."
  - q: "Can I move a Custom GPT to Claude instead?"
    a: "Yes, by hand. Paste the GPT's instructions into the body of a SKILL.md file, add a name and a description that says when to use it, put the knowledge files in the same folder, zip it and upload it under Customize > Skills in claude.ai. Anything the GPT did through actions needs a connector or MCP server on the Claude side."
  - q: "Did Custom GPTs ever have API access?"
    a: "No. OpenAI's GPT help page says GPTs are designed to work in ChatGPT and are not a way to embed ChatGPT in an external site or app. Claude skills can be uploaded to the API through the `/v1/skills` endpoints and attached to requests, where they run in a sandboxed container with no network access."
related: ["guide:what-are-claude-skills", "guide:agent-skills-open-standard", "guide:skills-vs-agents-vs-commands", "guide:skills-vs-mcp-servers", "guide:how-to-install-claude-skills", "guide:claude-skills-use-cases"]
audience: ["founders", "marketers"]
sources:
  - title: "Custom GPT retirement and migration FAQ"
    url: "https://help.openai.com/articles/20001519"
    publisher: "OpenAI"
  - title: "Creating and editing GPTs"
    url: "https://help.openai.com/en/articles/8554397-creating-and-editing-gpts"
    publisher: "OpenAI"
  - title: "GPTs in ChatGPT"
    url: "https://help.openai.com/en/articles/8554407-gpts-in-chatgpt"
    publisher: "OpenAI"
  - title: "Plugins in ChatGPT"
    url: "https://help.openai.com/articles/20001256"
    publisher: "OpenAI"
  - title: "Skills in ChatGPT"
    url: "https://help.openai.com/articles/20001066"
    publisher: "OpenAI"
  - title: "Build skills (ChatGPT and Codex)"
    url: "https://developers.openai.com/codex/skills"
    publisher: "OpenAI"
  - title: "Agent Skills overview"
    url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
    publisher: "Anthropic"
  - title: "Use Skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-using-skills-in-claude"
    publisher: "Anthropic"
---

This comparison has a deadline on one side. OpenAI's help center now says: "We're planning to retire custom GPTs and help creators migrate them to plugins." The standard retirement date is **December 11, 2026**. In that migration, a GPT's instructions become a skill. So if you came here to decide between building a Custom GPT and writing a Claude Skill, half of the decision has been made for you: the reusable unit on both platforms is now a skill.

## The short answer

- **Starting something new**: write a skill. You cannot create a new GPT on a personal ChatGPT account any more.
- **You own a GPT people rely on**: migrate it or rebuild it before the retirement date on your account's notice, and test the replacement with prompts you know.
- **Your GPT used custom actions**: plan extra time. Actions are the one part that does not migrate.
- **You only use other people's GPTs**: check each GPT's notice for a replacement. Access does not carry over automatically.

## What each one is

A **Custom GPT** is a configured copy of ChatGPT: a name and description, instructions, conversation starters, up to 20 knowledge files of up to 512 MB each, capability toggles, and either connected apps or custom actions (not both). You built it in a web form, people opened it from a link or the GPT Store, and each conversation happened inside that one GPT.

A **Claude Skill** is a [folder with a SKILL.md file](/guides/skills/what-are-claude-skills): a short frontmatter block that says when the skill applies, a Markdown body that says what to do, and optional reference files and scripts. You do not open a skill. Claude loads it into whatever conversation you are already in when the task matches its description, and several skills can be available at once.

That last point is the structural difference. A GPT was a place you went. A skill is something your assistant knows.

## The same job, both ways

Take a job a founder or marketer repeats weekly: turning rough notes into a customer newsletter in the house style. The company and file names below are made up.

As a Custom GPT, that was a set of builder fields:

```text
Name:                  Acme Newsletter Writer
Description:           Turns weekly notes into the Acme customer newsletter.
Instructions:          Write in second person. Keep it under 400 words.
                       Lead with one customer story. End with one link.
                       Never promise ship dates.
Conversation starters: "Draft this week's issue from my notes"
Knowledge:             style-guide.pdf, past-issues.docx
Capabilities:          Web search off, image generation off
```

As a skill, it is a folder:

```text
acme-newsletter/
├── SKILL.md
└── references/
    ├── style-guide.md
    └── past-issues.md
```

```markdown
---
name: acme-newsletter
description: Drafts the weekly Acme customer newsletter from rough notes. Use when the user asks for a newsletter issue, a weekly update email, or a draft from this week's notes.
---

# Acme newsletter

1. Read references/style-guide.md before writing.
2. Write in second person and keep the issue under 400 words.
3. Lead with one customer story and end with exactly one link.
4. Never promise ship dates. If the notes contain one, flag it and leave it out.
5. Match the structure of the two most recent issues in references/past-issues.md.
```

The content is almost the same. What changes is where it lives: the GPT's fields sat in OpenAI's builder, while the skill is a text file you can keep in a shared drive or a repository, diff, hand to a colleague, and load into more than one product.

## Side by side

| | Claude Skills | Custom GPTs |
| --- | --- | --- |
| Status | Current | Retiring December 11, 2026 (February 28, 2027 for FedRAMP and approved deferrals) |
| Unit | Folder with `SKILL.md`, optional scripts and reference files | Builder configuration stored in ChatGPT |
| Create new ones | Yes, in claude.ai, Claude Code or through the API | No on Free, Go, Plus and Pro; closed for affected Enterprise workspaces since October 26, 2026 |
| Where it runs | claude.ai, Claude Code, the Claude API | ChatGPT only |
| How it is triggered | Loaded automatically when the task matches its description | You open the GPT and chat inside it |
| Several at once | Yes | One GPT per conversation |
| Reference material | Any files in the skill folder | Up to 20 files, 512 MB each |
| External systems | Scripts in the skill, plus connectors and MCP servers | Apps or custom actions, not both |
| Sharing | Zip upload, workspace library on Team and Enterprise, plugins | Link, workspace, GPT Store |
| API access | Yes, `/v1/skills` | No |
| Plan needed to create | Free, Pro, Max and Ultra can upload skills in claude.ai; Team and Enterprise owners control it | No longer possible on personal plans |

One caveat on the Claude side: custom skills do not sync across surfaces. A skill uploaded to claude.ai is not automatically available through the API or in Claude Code, so you upload or copy it to each place you use it.

## What OpenAI replaced GPTs with

Two things, and both narrow the gap with Claude.

**Plugins.** A ChatGPT plugin bundles skills, connected apps and app templates. The plugin directory is available across ChatGPT plans, though what you can install depends on your plan, workspace and region.

**Skills.** ChatGPT skills are described as "reusable, shareable workflows" that ChatGPT uses automatically when they are helpful, which is the same loading model Claude uses. They are available to eligible Business, Enterprise, Healthcare and Edu users. OpenAI's developer docs say these skills "build on the open agent skills standard": a directory with a `SKILL.md` that must include `name` and `description`. That is the format Anthropic published, covered in [the open standard guide](/guides/skills/agent-skills-open-standard).

OpenAI also introduced workspace agents in April 2026, described at launch as "an evolution of GPTs" for Business, Enterprise, Edu and Teachers plans. Those are scheduled, cloud-run agents for teams, a different product from a reusable instruction set.

## If you own a GPT: what to do before the deadline

1. **Find the date that applies.** It follows the account or workspace where the GPT was created, not the one you use it from.
2. **Save test prompts.** Keep three or four prompts with outputs you were happy with, including one hard case.
3. **Publish pending edits.** Migration uses the latest published version. Drafts do not transfer.
4. **Migrate.** In ChatGPT go to My GPTs and choose Migrate to plugin. If the option is missing, migration may not have reached your account yet.
5. **Rebuild actions separately.** Check whether a connected app covers what the action did. If not, the replacement is an MCP server, which needs technical help.
6. **Re-share.** The plugin starts private. Existing users of the GPT do not get access until you share it, and making a personal plugin public is a separate submission.
7. **Keep a portable copy.** Copy the instructions and knowledge files into a `SKILL.md` folder like the one above. That copy also loads in Claude; [installing a skill](/guides/skills/how-to-install-claude-skills) takes a few minutes.

If the GPT was only a way to keep instructions and files together for your own ongoing work, OpenAI suggests a ChatGPT project instead, which keeps related chats, files and instructions together without a skill.

## Where each one still loses

**Skills have no storefront.** The GPT Store gave a tutor or a niche assistant a public page that anyone could open. Skills are shared as files, through a workspace library, or inside plugins. If your goal was reach, not reuse, a skill does not replace that.

**Skills on the API are sandboxed.** A skill attached to a Claude API request runs in a container with no network access and no runtime package installs. A GPT with custom actions could call your live API mid-conversation. In claude.ai and Claude Code you close that gap with connectors or [MCP servers](/guides/skills/skills-vs-mcp-servers).

**Skills ask more of the author.** A GPT's description was marketing copy. A skill's `description` is the trigger: if it does not say when to use the skill, the skill never loads. Expect to rewrite it a couple of times.

**GPTs lose on everything with a date attached.** They cannot be created on personal plans, they were never callable from the API, and their pages go dark at retirement.

## How to choose now

If your workflow is "my assistant should know how we do this," write it as a skill and keep the folder somewhere you control. It will load in Claude today, and it is the shape ChatGPT's own replacement expects. The [use-cases list](/guides/skills/claude-skills-use-cases) has examples outside engineering.

If you need a public, branded assistant that strangers can open with one click, neither product gives you a like-for-like successor to the GPT Store yet. Look at a published ChatGPT plugin, or build a small app on either company's API.
