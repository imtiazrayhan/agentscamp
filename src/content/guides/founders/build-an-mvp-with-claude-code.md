---
title: "Build an MVP with Claude Code: Idea to Deployed App in a Weekend"
description: "A non-developer's weekend plan for an MVP with Claude Code: one-page spec, a boring stack, tests as you go, Supabase for auth and data, Vercel to deploy."
seoTitle: "Build an MVP with Claude Code in a Weekend (Founder Guide)"
seoDescription: "Step-by-step: spec, stack, scaffold, test, add Supabase auth and data, deploy to Vercel or Replit, and what to check before you share your Claude Code MVP."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting", "coding-languages"]
audience: ["founders"]
tags: ["claude-code", "mvp", "vibe-coding"]
featured: false
keywords: ["build mvp with claude code", "claude code for founders", "mvp in a weekend", "supabase claude code", "deploy mvp vercel"]
summary: "You can take an idea to a deployed MVP in a weekend with Claude Code if you do three things a builder normally does for you: write a one-page spec first, pick a stack Claude Code knows well (Next.js, TypeScript, Supabase, Vercel), and make it prove each slice with a test before moving on. This is that plan, with a CLAUDE.md for non-developers."
keyTakeaways:
  - "Spend the first hour on a one-page spec, not on prompts. Every correction you make in the spec is cheaper than the same correction made in code."
  - "Pick the boring stack: Next.js plus TypeScript for the app, Supabase for auth and data, Vercel for hosting. Claude Code has seen all of it thousands of times."
  - "Run /init, then edit the CLAUDE.md so it says who you are, how to run the app, and what Claude must never do (secrets in code, tables without RLS)."
  - "Build in slices and make each one prove itself: a test, a running dev server, a screenshot. Do not accept 'done' without evidence."
  - "Supabase Row Level Security is the one security setting you cannot skip. A table without it is readable and writable by anyone holding your public key."
  - "Deploy from GitHub to Vercel so every push builds a preview URL, and keep the production branch for things you have actually clicked through."
faq:
  - q: "Can a non-developer really build an MVP with Claude Code?"
    a: "Yes, if the scope is honest. A single-purpose app with a login, a few screens, and one database is a weekend. A marketplace with payments, messaging, and admin tooling is not. The tool handles the code; you handle the spec, the decisions, and checking that what it built matches what you asked for."
  - q: "Why not just use Lovable or Bolt?"
    a: "For the first version, a builder is often faster. Claude Code wins when you want a real repository from day one, when the feature needs logic a chat builder struggles to express, or when you are already leaving a builder because edits keep breaking other things. Many founders start with a builder and hand the code to Claude Code later."
  - q: "What stack should I ask Claude Code to use?"
    a: "Next.js with TypeScript and Tailwind for the app, Supabase for authentication and the database, Vercel for hosting. It is the most common combination in Claude's training data and in public example code, which means fewer wrong guesses. Replit is the alternative if you want the editor, hosting, and database in one account."
  - q: "How do I know the app is safe to share?"
    a: "Check four things before sending a link: every Supabase table has Row Level Security enabled with a policy, no secret keys appear in the code or the browser, the app works when logged out and when logged in as a second user, and the production deploy uses environment variables you set in the hosting dashboard rather than a copied .env file."
  - q: "Do I need a paid Claude plan?"
    a: "Claude Code needs a paid plan (Pro or above) or an Anthropic Console account; the free Claude plan does not include it. The plan comparison for founders covers which tier fits a weekend build versus daily use."
howtoSteps:
  - name: "Write a one-page spec"
    text: "Before opening a terminal, write SPEC.md: who the app is for, the one job it does, the three screens it needs, what data it stores, and what 'working' looks like. Keep it to a page. Claude reads it every session, and it is where you fix mistakes cheaply."
  - name: "Pick a stack Claude Code handles well"
    text: "Choose Next.js with TypeScript and Tailwind for the app, Supabase for auth and database, and Vercel for hosting. Write the choice into the spec so Claude does not pick something else halfway through."
  - name: "Scaffold the project and set up CLAUDE.md"
    text: "Create an empty folder, start Claude Code inside it, and ask it to scaffold the app from SPEC.md. Run /init to generate a CLAUDE.md, then edit it to add your run commands, the rule that you are not a developer, and the safety rules about secrets and Row Level Security."
  - name: "Build one slice at a time, with a test each"
    text: "Ask for one screen or one feature per prompt. For each slice, require a passing test or a running dev server you can click through before moving on. If Claude reports done without evidence, ask it to show the test output."
  - name: "Add auth and data with Supabase"
    text: "Create a Supabase project, add the Supabase MCP server to Claude Code so it can inspect your schema, and ask Claude to add sign-in and the tables from your spec. Insist that every table has Row Level Security enabled with a policy before any data goes in."
  - name: "Deploy to Vercel or Replit"
    text: "Push the repository to GitHub and import it into Vercel; every push builds a preview URL and the main branch becomes production. Set your Supabase keys as environment variables in the Vercel dashboard. If you built inside Replit instead, publish with a Replit deployment."
  - name: "Check before you share"
    text: "Run the pre-share checklist: log out and confirm private pages redirect, sign up as a second user and confirm you cannot see the first user's data, search the code for keys, confirm the production build passes, and click through the three core screens on a phone."
sources:
  - title: "Claude Code overview"
    url: "https://code.claude.com/docs/en/overview"
    publisher: "Anthropic"
  - title: "How Claude remembers your project (CLAUDE.md and /init)"
    url: "https://code.claude.com/docs/en/memory"
    publisher: "Anthropic"
  - title: "Configure permissions"
    url: "https://code.claude.com/docs/en/permissions"
    publisher: "Anthropic"
  - title: "Row Level Security"
    url: "https://supabase.com/docs/guides/database/postgres/row-level-security"
    publisher: "Supabase"
  - title: "Model context protocol (MCP) server"
    url: "https://supabase.com/docs/guides/getting-started/mcp"
    publisher: "Supabase"
  - title: "Deploying Git Repositories with Vercel"
    url: "https://vercel.com/docs/git"
    publisher: "Vercel"
  - title: "About Deployments"
    url: "https://docs.replit.com/cloud-services/deployments/about-deployments"
    publisher: "Replit"
related: ["guide:claude-code-for-non-developers", "guide:spec-driven-development", "guide:lovable-to-claude-code-handoff", "guide:lovable-vs-claude-code", "tool:claude-code", "tool:supabase-mcp", "tool:replit-agent", "skill:mvp-scope-cutter"]
---

A weekend MVP with [Claude Code](/tools/claude-code) is realistic for a non-developer, but not because the tool is magic. It is realistic because you do the three things a chat builder normally does for you: fix the scope in writing, choose a stack the agent already knows cold, and make it prove each piece works before you move on. This is the plan I use, in the order I use it. If you have never opened Claude Code, start with the [non-developer's guide to Claude Code](/guides/founders/claude-code-for-non-developers) and come back.

## Friday night: the one-page spec

Do not open a terminal yet. Open a blank document called `SPEC.md` and answer five questions in plain language:

1. **Who** is this for, in one sentence?
2. **What one job** does it do? (If you wrote "and", cut the second half.)
3. **Which three screens** does it need? Name them and say what is on each.
4. **What does it store?** List the nouns: users, listings, bookings. One line each with the fields you actually need.
5. **What does "working" look like?** Three or four sentences a stranger could check. "A new user can sign up, create a listing with a photo, and see it on the home page."

This is [spec-driven development](/guides/workflow/spec-driven-development) at its smallest useful size. The spec is where you fix mistakes cheaply: changing a sentence costs a minute, changing a built feature costs an hour of credits and confusion. If the scope keeps growing, the [MVP scope cutter skill](/skills/product/mvp-scope-cutter) or the [/scope-mvp command](/commands/product/scope-mvp) will argue you back down to one job.

Add one more section to the spec, **Stack**, and write exactly what is in the next step. Claude follows a written stack decision; it drifts when you leave it open.

## Pick the stack Claude Code handles well

You want the boring combination, because boring means Claude has seen it thousands of times and guesses right:

| Layer | Pick | Why it suits a non-developer |
| --- | --- | --- |
| App | Next.js + TypeScript + Tailwind | The most common web stack in public code; errors are well-known |
| Auth + database | Supabase | Postgres with sign-in, file storage, and a dashboard you can read |
| Hosting | Vercel | Deploys straight from GitHub; every push gets a preview URL |
| All-in-one alternative | Replit | Editor, hosting, and database in one account if you would rather not juggle three |

If you have already prototyped in a builder like Lovable, its output uses the same Supabase-shaped backend, which is why the [handoff to Claude Code](/guides/founders/lovable-to-claude-code-handoff) works. If you are still deciding between a builder and an agent, [Lovable vs Claude Code](/guides/comparisons/lovable-vs-claude-code) is the short version.

## Saturday morning: scaffold and write CLAUDE.md

Install Claude Code ([the install guide](/guides/getting-started/installing-claude-code) is ten minutes), create an empty folder, put `SPEC.md` in it, and start a session there. Your first prompt is not "build my app". It is:

```text
Read SPEC.md. Scaffold a Next.js + TypeScript + Tailwind project that matches it.
Do not add auth or a database yet. When it runs locally, tell me the command to
start it and stop.
```

In its Manual permission mode, Claude Code asks before it runs commands or edits files, so you will approve the scaffold step by step (check the mode indicator in the session; if it says Auto, switch to Manual for your first weekend). Say yes; read what it is doing. Once the dev server runs, type `/init`. Claude Code writes a starting `CLAUDE.md`, the file it reads at the beginning of every session. Then edit it so it looks something like this:

```markdown
# Project: Roomshare

## What this is
A booking board for a shared studio. The spec is in SPEC.md; read it before
changing any behavior, and ask me if the spec is ambiguous.

## Commands
- `npm run dev` starts the app locally
- `npm test` runs the tests; run it before you tell me a task is done
- `npm run build` must pass before anything is deployed

## Working with me
- I am not a developer. After each change, explain what changed in plain
  language and tell me exactly what to click to check it.
- Ask before adding a new dependency, service, or paid API.
- One feature per session. Do not refactor things I did not ask about.

## Safety rules
- Never put API keys or secrets in code. Use `.env.local` and tell me which
  variable to set. Never commit `.env.local`.
- Every Supabase table must have Row Level Security enabled with a policy
  before it holds real data.
- Never run `git push` or deploy without asking me first.
```

Keep it under 200 lines; Anthropic's docs say longer files reduce how reliably Claude follows them. The two rules that matter most for a non-developer are "explain what you changed" and "ask before adding a dependency", because those are the two places an unsupervised agent creates work you cannot see. [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices) goes deeper if you want the reasoning.

> [!TIP]
> Add a hard stop, not just a rule. In `.claude/settings.json`, a deny rule such as `"Bash(git push *)"` blocks pushes regardless of what Claude decides. Rules in CLAUDE.md are context; permission rules are enforced by Claude Code itself.

## Saturday: build in slices, with evidence

Work through the spec one screen at a time. The prompt pattern is the same each time:

```text
Implement the "create listing" screen from SPEC.md. Write a test for the form
validation first, then make it pass. When done, show me the test output and
tell me the URL to open.
```

The important word is *show*. Claude Code will sometimes say "done" when it means "I wrote code that I believe works". Require the evidence: test output, a running server, a screenshot if the desktop app is showing you one. This is the whole discipline of [testing AI-generated code](/guides/testing/testing-ai-generated-code) compressed into one habit, and it is what separates a weekend that ends with a demo from one that ends with a folder of half-working screens.

When something breaks, paste the error and the words "what changed since it last worked?" before "fix it". The first question makes Claude read its own diff; the second makes it guess.

## Saturday afternoon: auth and data with Supabase

Create a Supabase project in the browser and copy the project URL and the public (anon) key into `.env.local`. Then give Claude Code eyes on the database by adding the [Supabase MCP server](/tools/supabase-mcp):

```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp"
```

Run `/mcp` in the session to authenticate. Supabase's own docs recommend scoping the server to one project and using read-only mode for anything unattended; for a weekend build on a fresh project, project scoping is enough, but do not point it at anything holding real customer data.

Now the prompt:

```text
Add Supabase auth (email + password) and the tables from SPEC.md. Write the
schema as a migration I can read. Enable Row Level Security on every table and
write policies so a user can only read and write their own rows. Explain each
policy in one sentence.
```

Row Level Security is the one line you cannot skip. Supabase's guidance is blunt: enable RLS on every table in an exposed schema, because a table without it is readable and writable by any role with a grant on it, and your public key is in the browser. Ask Claude to explain each policy in a sentence, and if you cannot follow the sentence, ask again until you can. You are the last reviewer.

## Sunday: deploy

Push the repository to GitHub (ask Claude to set up the remote and the first push; it will ask before pushing if you set the rule above). Then import the repo into Vercel. Vercel builds a deployment on every branch push and turns merges to the production branch (`main` by default) into the live site, with every other branch getting its own preview URL. Add your Supabase URL and anon key as environment variables in the Vercel project settings; never upload the `.env.local` file.

If you built inside Replit with [Replit Agent](/tools/replit-agent) instead, the equivalent is a Replit deployment: Autoscale for a normal web app, Static for a site with no server, and the platform hosts it for you. Either way, the first deploy is a preview you click through, not the URL you send to customers.

## Sunday evening: check before sharing

Five checks, ten minutes, in this order:

1. **Logged out.** Open the live URL in a private window. Every private page should redirect to sign-in.
2. **Second user.** Sign up with a second email. Create data. Confirm the first account cannot see it, and vice versa. This is your RLS test.
3. **Secrets.** Ask Claude: "Search the repository and the built output for anything that looks like a key or token. List every hit." The anon key is expected; a service-role key anywhere in the app is a stop-the-launch finding.
4. **Build.** `npm run build` passes locally and the Vercel deploy is green.
5. **Phone.** Open the three core screens on your phone. Fix the one that is broken (there is always one).

Then send the link to five people, not five hundred. The best next step after the first feedback is usually the [technical cofounder agent](/agents/product/technical-cofounder) reviewing the repo for what will hurt at month three, and the wider field of tools worth adding is in [the best AI tools for founders](/guides/comparisons/best-ai-tools-for-founders-2026). What you have at the end of the weekend is a real repository, a real database, and a real URL, which is the point: it can grow instead of being rebuilt.
