---
title: "When Your Lovable or Bolt App Outgrows the Builder"
description: "Signs your Lovable or Bolt app has outgrown its builder, how GitHub sync gives you a repository, and what to audit first with Claude Code: auth, secrets, RLS."
seoTitle: "Lovable to Claude Code Handoff: When Your App Outgrows the Builder"
seoDescription: "Symptoms your Lovable or Bolt app has outgrown the builder, how GitHub sync exports it, and the first audit to run with Claude Code: auth, secrets, RLS, data."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting", "coding-languages"]
audience: ["founders"]
tags: ["lovable", "bolt", "claude-code", "handoff", "vibe-coding"]
featured: false
keywords: ["lovable to claude code", "lovable github export", "bolt github sync", "lovable app outgrown", "audit lovable app"]
summary: "Your Lovable or Bolt app has outgrown the builder when edits break unrelated screens, when the feature you need is one the chat cannot express, or when a security scan flags things you cannot fix from a prompt. Both sync to GitHub both ways, so the handoff is a change of driver: open the repo in Claude Code and audit auth, secrets, RLS, and data first."
keyTakeaways:
  - "The tell is not app size, it is edit cost: when every change risks breaking something you did not touch, the builder is no longer the cheapest way to change it."
  - "Lovable and Bolt both sync to GitHub in both directions, so there is no export step. The repository already exists; you are changing who edits it."
  - "Both builders sync a single branch, so pick one editor at a time. Claude Code on a branch the builder is not watching is the safe pattern."
  - "Audit before you build: auth flows, secrets in code, Row Level Security on every table, and whether the data model matches what the app does now."
  - "Lovable Cloud has no one-click migration to your own Supabase project. Decide early whether the backend stays put."
  - "Keep the builder for fast UI iteration only if you are disciplined about the one-branch rule; otherwise move fully to Claude Code."
faq:
  - q: "How do I get my code out of Lovable?"
    a: "Connect the project to GitHub from Lovable's settings. Lovable's docs describe a two-way sync: changes made in Lovable sync to GitHub, and changes pushed to the active GitHub branch sync back into Lovable. The repository is private by default, and disconnecting later leaves the repo intact with its history. There is no separate download step."
  - q: "Does Bolt also sync to GitHub?"
    a: "Yes. Per Bolt's docs, once connected, Bolt creates a commit for every change that does not break the project and checks GitHub roughly every 30 seconds for changes made outside Bolt, pulling them in. Only the project owner can manage the connection, and Bolt does not merge branches in-app, so merging happens on GitHub."
  - q: "What should I check first when Claude Code opens the repository?"
    a: "In order: how sign-in and session handling work and whether every private route checks them; whether any secret keys sit in the code or the built output; whether every database table has Row Level Security enabled with a policy that matches who should see what; and whether the data model still matches what the app does today. Fix findings before adding features."
  - q: "Can I keep using Lovable for the UI and Claude Code for the logic?"
    a: "You can, but both tools edit one branch, and Bolt's docs say that on a near-simultaneous conflict it keeps its own changes and overwrites GitHub. The safe pattern is one editor per branch and one person deciding when to merge. If that discipline sounds tiring, move fully to Claude Code."
  - q: "What about the backend if I used Lovable Cloud?"
    a: "Lovable Cloud is built on Supabase's open-source foundation, but Lovable's docs state there is no one-click migration from Cloud to your own Supabase project: you export your data, connect a Supabase project to a new Lovable project, and rebuild the schema. Decide whether the backend stays on Cloud before you start moving the front end."
sources:
  - title: "GitHub integration"
    url: "https://docs.lovable.dev/integrations/github"
    publisher: "Lovable"
  - title: "Lovable Cloud"
    url: "https://docs.lovable.dev/features/cloud"
    publisher: "Lovable"
  - title: "Security"
    url: "https://docs.lovable.dev/features/security"
    publisher: "Lovable"
  - title: "GitHub for version control"
    url: "https://support.bolt.new/integrations/git"
    publisher: "Bolt (StackBlitz)"
  - title: "Row Level Security"
    url: "https://supabase.com/docs/guides/database/postgres/row-level-security"
    publisher: "Supabase"
  - title: "Configure permissions"
    url: "https://code.claude.com/docs/en/permissions"
    publisher: "Anthropic"
related: ["tool:lovable", "tool:bolt", "tool:claude-code", "guide:claude-code-for-non-developers", "guide:build-an-mvp-with-claude-code", "guide:lovable-vs-claude-code", "guide:vibe-coding-guide", "guide:testing-ai-generated-code"]
---

An app outgrows its builder when changing it stops being cheap. That moment rarely arrives as a crash; it arrives as a Tuesday where fixing the signup form broke the dashboard, the fix for the dashboard cost forty credits, and the feature you actually wanted is still not there. [Lovable](/tools/lovable) and [Bolt](/tools/bolt) are excellent at the first version. This guide is about the handoff to [Claude Code](/tools/claude-code) once the first version is behind you, written for founders who are not developers and are following the [non-developer's path to Claude Code](/guides/founders/claude-code-for-non-developers).

## The symptoms

You do not need all of these. Two is enough.

- **Edits break things you did not touch.** The builder regenerates more than you asked for, and you find out from a user.
- **The feature is one the chat cannot express.** Background jobs, a third-party integration with real error handling, a permissions model with roles, anything where "make it work" is not a sentence.
- **Credit burn is mostly regressions.** You are paying to get back to where you were, not to move forward.
- **A security scan found things you cannot fix from a prompt.** Lovable runs a basic security scan before publishing and shows critical findings; if the fix requires understanding the Row Level Security policy rather than re-rolling the dice, you have crossed over.
- **Someone technical wants a repository.** A contractor, an advisor, a cofounder. They will ask for GitHub, not a share link.
- **The generated code has become the product.** The app is what you sell now, so who can change it safely matters more than how fast the first screen appeared.

If none of these are true, you are not there yet. Builders remain the right tool for exploration, and the [vibe coding guide](/guides/prompting/vibe-coding-guide) covers how to keep exploring without accumulating the mess that forces this handoff early.

## The export that is not an export

Both builders sync to GitHub, so the repository exists before you decide anything.

**Lovable.** Connect GitHub from the project settings. Lovable's documentation describes the sync as two-way: changes made in Lovable sync to GitHub, and changes pushed to the active GitHub branch sync back into Lovable. Two constraints matter for the handoff. Lovable edits and syncs one branch at a time (the default branch unless you change it), and you cannot switch branches while Lovable is editing. Repositories are private by default, and if you disconnect later, the repo keeps its history and files.

**Bolt.** Connect GitHub from the project. Per Bolt's docs, every change that does not break the project becomes a commit, and Bolt checks GitHub about every 30 seconds for updates made outside Bolt and pulls them in. Only the project owner can connect and manage the integration; collaborators' changes sync when the owner next opens the project. Bolt does not merge branches in-app, and if Bolt and GitHub update at almost the same moment, Bolt keeps its own version and overwrites GitHub's.

That last sentence is the whole reason for the one rule below.

> [!WARNING]
> One editor per branch. The builder watches one branch and will happily overwrite it. Do your Claude Code work on a separate branch the builder is not tracking, and merge on GitHub when you decide to. If you want to be done with the builder entirely, disconnect it after the merge, not before.

## The backend question

The front end is the easy part; it is code in a repository. The backend is where the handoff can stall.

- **Lovable with your own Supabase project.** You already own the database, the auth users, and the dashboard. Claude Code can connect to it with the [Supabase MCP server](/tools/supabase-mcp) and nothing moves.
- **Lovable Cloud.** The built-in backend is built on Supabase's open-source foundation, and you can export your database and storage files from the project's advanced settings. But Lovable's docs are explicit that there is no one-click migration from Cloud to your own Supabase project: you export data, connect a Supabase project to a new Lovable project, and rebuild the schema there. Decide now whether the backend stays on Cloud (Claude Code edits the front end, Lovable keeps hosting the backend) or moves (a small project of its own).
- **Bolt.** The backend is whatever the project was built against. Ask Claude Code to list every external service the code calls before assuming anything.

Secrets follow the backend. Lovable stores third-party keys (Stripe, Resend, and the like) in its Secrets feature and detects keys pasted into the chat; when you move, those keys need to be re-entered wherever the code now runs, not copied into files.

## The first audit with Claude Code

Open the synced repository in Claude Code and do not build anything yet. Start in Plan mode, where Claude reads files and runs read-only commands but does not edit, and ask for a tour:

```text
Read this repository and explain, in plain language, how a user signs in, how
the app decides what they can see, where data is stored, and which external
services are called. Do not change anything.
```

Then audit four things, in this order.

**1. Auth.** Ask which routes are private and how each one checks the session. Builder output often protects the page but not the API call behind it. Have Claude list every data-fetching call and whether it runs with the user's identity.

**2. Secrets.** "Search the code and the build output for anything that looks like an API key, token, or service-role key. List every hit with the file." The public Supabase anon key in the browser is expected. A service-role key, a Stripe secret key, or a hardcoded password anywhere in front-end code is a launch blocker.

**3. Row Level Security.** Supabase's guidance is that every table in an exposed schema needs RLS enabled, because a table without it is readable and writable by any role with a grant on it. Lovable's scanners lint RLS policies for overly permissive rules, and that is a good start, but you want Claude Code to go table by table:

```text
For every table in the migrations, tell me: is RLS enabled, what policies
exist, and in one sentence who can read and who can write. Flag any table
where the answer is "anyone".
```

Then test it the founder's way: sign up as a second user and try to see the first user's data.

**4. Data model.** The app has changed since the first prompt; the schema usually has not. Ask Claude whether the tables match what the app does today, which columns are unused, and what a feature you are about to build would need. This is where you write the one-page spec for the next phase, using the same [spec-driven approach](/guides/workflow/spec-driven-development) you would use for a [fresh MVP](/guides/founders/build-an-mvp-with-claude-code).

Fix findings before features. Every fix should come with a test, because you are now the reviewer of code you did not write and cannot fully read; [testing AI-generated code](/guides/testing/testing-ai-generated-code) is the habit that makes that reviewable.

## Choosing who owns the code now

| Situation | Recommendation |
| --- | --- |
| Still exploring what the product is | Stay in the builder; revisit in a month |
| Product is stable, features are getting harder | Move to Claude Code on its own branch; keep the builder read-only |
| A developer or agent is joining | Move fully, disconnect the builder after the merge |
| Backend is on Lovable Cloud and working | Leave the backend, move the front end, plan the backend later |

The honest comparison of the two tools' strengths is in [Lovable vs Claude Code](/guides/comparisons/lovable-vs-claude-code). If you are earlier than that and still choosing a builder, [Base44 vs Lovable](/guides/comparisons/base44-vs-lovable) covers the other common starting point, and the [technical cofounder agent](/agents/product/technical-cofounder) is a useful second opinion on the audit output before you commit to a direction. Whichever way you go, the repository is yours now. That was the point of syncing it in the first place.
