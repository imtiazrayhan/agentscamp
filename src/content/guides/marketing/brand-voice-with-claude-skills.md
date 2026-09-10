---
title: "Build a Brand-Voice Skill for Claude (and Upload It Anywhere)"
description: "Turn 5-10 samples of your copy into a SKILL.md brand-voice skill, then upload it to claude.ai, install it in Claude Code, use it in Cowork, and test it."
seoTitle: "Build a Brand-Voice Skill for Claude and Upload It Anywhere"
seoDescription: "Derive brand-voice rules from your own copy, write them as a SKILL.md, then upload the skill to claude.ai, install it in Claude Code, and use it in Cowork."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "skills", "brand-voice", "cowork", "claude-ai", "marketing"]
featured: true
keywords: ["brand voice skill Claude", "Claude brand voice", "SKILL.md brand guidelines", "upload skill claude.ai", "brand voice AI"]
summary: "A brand-voice skill is a folder with one SKILL.md: a description that tells Claude when to load it and a body of rules it applies while writing. Derive the rules from real samples with brand-voice-profiler, write the file, zip it, and upload it under Customize > Skills on claude.ai (which covers Cowork). Copy the folder to ~/.claude/skills/ for Claude Code."
keyTakeaways:
  - "One SKILL.md, three surfaces: claude.ai takes a ZIP upload, Cowork loads what your claude.ai account has enabled, Claude Code reads ~/.claude/skills/<name>/."
  - "Derive rules from evidence, not adjectives. Run 5-10 real samples through brand-voice-profiler and keep only rules you can point to in the samples."
  - "Keep the description under 200 characters and the folder name equal to the skill name; those are the two limits the claude.ai upload enforces."
  - "The ZIP must contain the skill folder as its root, not loose files. Wrong structure is the most common upload failure."
  - "Rules beat vibes: 'never say leverage', 'numerals for every number', 'one CTA per email' are checkable; 'sound confident' is not."
  - "Test with /brand-check on a draft you know is off-voice. If it passes, the rules are too soft; tighten and re-upload."
howtoSteps:
  - name: "Gather 5-10 samples"
    text: "Collect five to ten pieces of copy the team agrees represent the voice at its best: a homepage section, two emails, a blog intro, a social post, a support reply. Include one piece everyone agrees is wrong, labeled as such. Paste them into one text file."
  - name: "Derive the rules with brand-voice-profiler"
    text: "Run the brand-voice-profiler skill on the samples. It returns a voice guide: tone attributes with evidence quotes, sentence-level habits, vocabulary to use and avoid, formatting conventions, and per-channel adjustments. Delete any rule you cannot point to in the samples."
  - name: "Write SKILL.md"
    text: "Create a folder named after the skill (for example acme-voice) containing SKILL.md. Frontmatter: name (64 characters max) and a description under 200 characters that says what it does and when to use it. Body: the rules, grouped under headings, each one checkable, plus two short before/after examples."
  - name: "Zip the folder"
    text: "Compress the folder so the ZIP contains acme-voice/ as its root with SKILL.md inside it, not loose files at the top level. On macOS, right-click the folder and choose Compress; on Windows, Send to > Compressed folder."
  - name: "Upload on claude.ai"
    text: "Make sure Code execution and file creation is on under Settings > Capabilities (individual plans) or Organization settings > Skills (Team and Enterprise). Go to Customize > Skills, click the + button, choose + Create skill, select Upload a skill, and pick the ZIP. Toggle it on."
  - name: "Install in Claude Code"
    text: "Copy the same folder to ~/.claude/skills/acme-voice/SKILL.md for every project on the machine, or to .claude/skills/acme-voice/SKILL.md inside a repository so teammates get it when they pull. It is available as /acme-voice immediately."
  - name: "Use it in Cowork"
    text: "Cowork does not read ~/.claude/skills. It loads the skills enabled on your claude.ai account at session start, so the upload in step 5 covers it. Type / in the Cowork composer to confirm the skill is listed, then draft something."
  - name: "Test with /brand-check"
    text: "Run the brand-check command against a draft you know breaks the rules. Expect specific flags with quoted sentences and fixes. If it passes clean, the rules are too vague; tighten them, re-zip, delete the old upload, and upload again."
faq:
  - q: "How do I upload a custom skill to claude.ai?"
    a: "Zip the skill folder so the folder itself is the root of the ZIP, then go to Customize > Skills, click the + button, choose + Create skill, select Upload a skill, and pick the file. Code execution and file creation must be enabled first (Settings > Capabilities on Free, Pro, and Max; Organization settings > Skills on Team and Enterprise). Uploaded skills are private to your account until you share them."
  - q: "Does a skill uploaded to claude.ai work in Claude Code?"
    a: "Not automatically for local sessions. Claude Code on your machine reads skills from ~/.claude/skills/ and the project's .claude/skills/, so copy the folder there. Cowork and Claude Code cloud sessions are different: they load the skills enabled on your claude.ai account, so the upload does cover them."
  - q: "What are the limits on SKILL.md for claude.ai?"
    a: "Anthropic's help center lists name at 64 characters maximum and description at 200 characters maximum for skills you upload to claude.ai. The folder name must match the skill name and the ZIP must contain the folder as its root. Keep the description short and trigger-focused; the rules go in the body."
  - q: "What is the difference between a brand-voice skill and a project instruction?"
    a: "A project instruction is always in context for that project only. A skill loads only when its description matches the task and travels across projects, chats, Cowork sessions, and Claude Code. Voice rules apply to almost everything you write, so a skill is the right container; put project-specific facts in the project."
  - q: "How is this different from Anthropic's brand-voice skill in the marketing plugin?"
    a: "Anthropic's brand-review skill enforces a guide you already have and asks you to paste one if none is configured. This guide builds that guide. The AgentsCamp brand-voice-profiler derives the rules from your samples; the SKILL.md you write here is the artifact Anthropic's skill, or any other, can then apply."
related: ["guide:claude-code-for-marketers", "guide:claude-marketing-plugin-guide", "guide:seo-content-workflow-with-claude-code", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "skill:brand-voice-profiler", "command:brand-check", "glossary:brand-voice"]
sources:
  - title: "Use skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-use-skills-in-claude"
    publisher: "Anthropic"
  - title: "How to create custom skills"
    url: "https://support.claude.com/en/articles/12512198-how-to-create-custom-skills"
    publisher: "Anthropic"
  - title: "Extend Claude with skills (Claude Code docs)"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "anthropics/knowledge-work-plugins: marketing/skills/brand-review/SKILL.md"
    url: "https://github.com/anthropics/knowledge-work-plugins/blob/main/marketing/skills/brand-review/SKILL.md"
    publisher: "Anthropic"
---

A brand-voice skill is a folder containing one `SKILL.md` file: a short description that tells Claude when to load it, and a body of rules Claude applies whenever it writes for you. Build it once and the same folder works on claude.ai (as a ZIP upload), in Claude Cowork (which loads what is enabled on your claude.ai account), and in Claude Code (as a directory under `~/.claude/skills/`). This guide walks the path from samples to a tested skill in eight steps.

It assumes you know what a skill is; if not, read [What are Claude skills?](/guides/skills/what-are-claude-skills) first. The term [brand voice](/glossary/brand-voice) and the underlying [agent skills](/glossary/agent-skills) format are in the glossary, and the pillar [Claude Code for marketers](/guides/marketing/claude-code-for-marketers) shows where this fits in a marketing workflow.

## Why a skill and not a pasted style guide

You can paste a style guide into every chat. Three things go wrong: it gets forgotten in long conversations, it is absent in Cowork or Claude Code unless you paste it again, and it drifts as five people keep five copies. A skill fixes all three: it loads when the task matches its description, it lives on every surface you install it on, and there is one file to edit.

The other reason is that most brand guides are adjectives ("confident, warm, human") and Claude cannot check an adjective. A skill forces you to write rules it can check: "numerals for every number," "never open with a question," "one call to action per email." That translation is the real work; steps 1 and 2 do it.

## Step 1: Gather 5-10 samples

Collect five to ten pieces the team agrees sound like you at your best, across channels: a homepage section, two emails, a blog introduction, a social post, a support reply. Add one piece everyone agrees is *wrong* and label it; a counterexample tells the profiler which habits are accidental and which are the voice. Paste everything into one text file with a line naming the channel above each sample.

## Step 2: Derive the rules with brand-voice-profiler

Run the [brand-voice-profiler](/skills/marketing/brand-voice-profiler) skill on that file. It works on pasted text with no tools or network, so it runs identically on claude.ai, Cowork, and Claude Code. The output is a voice guide: tone attributes each backed by a quote from the samples, sentence-level habits (length, openers, contractions, person), vocabulary to use and avoid, formatting conventions, and per-channel adjustments.

Then cut. Delete any rule you cannot point to in at least two samples. What survives is short, and short is what you want.

## Step 3: Write SKILL.md

Create a folder named after the skill, all lowercase with hyphens, and put `SKILL.md` inside it. The folder name must match the skill's `name`. Anthropic's help center sets `name` at 64 characters maximum and `description` at 200 characters maximum for skills uploaded to claude.ai; the description is what Claude uses to decide when to load the skill, so spend it on the trigger, not the rules. The full field list is in the [SKILL.md reference](/guides/skills/skill-md-reference).

Here is a complete, working example for a fictional company:

```markdown
---
name: acme-voice
description: Applies Acme's brand voice and house style to customer-facing writing. Use when drafting, editing, or reviewing marketing copy, emails, web pages, social posts, or docs.
---

# Acme voice

Apply these rules to every customer-facing draft. When a rule conflicts
with a user's explicit instruction, follow the instruction and say so.

## Tone

- Plain and direct. Say what the product does; do not say how we feel about it.
- Confident without superlatives. Never "best", "fastest", "only", "revolutionary".
- Warm means specific, not exclamatory. No exclamation marks in body copy.

## Sentences

- Second person ("you"), present tense, active voice.
- Average under 18 words. Split anything over 25.
- Never open a paragraph with a question. Never end one with "Let's dive in."

## Words

- Use: "customers", "plan", "workspace", "sign in".
- Avoid: "users", "tier", "dashboard", "log in", "leverage", "seamless", "unlock".
- Numerals for every number, including one through nine. Percentages as "12%".
- Product names exactly: Acme Flow, Acme Ledger. Never "the Flow product".

## Formatting

- Sentence case for headings and buttons.
- One call to action per email. Button text is a verb phrase: "Start a trial".
- Bulleted lists of three to five items; longer lists become a table.

## By channel

- Email: subject line under 45 characters, no first names in the subject.
- Social: hook in the first line, no hashtags in the body, at most two at the end.
- Docs: no marketing adjectives at all.

## Before and after

- Before: "Unlock seamless collaboration with our revolutionary dashboard!"
  After: "Share a workspace with your team. Everyone sees the same numbers."
- Before: "Users can leverage tiers to log in faster."
  After: "Customers on any plan sign in with one click."

## Output

When reviewing, quote each sentence that breaks a rule, name the rule,
and give the fix. When drafting, apply the rules silently.
```

Every rule in that body is checkable. That is the test for your own: if a reviewer could not say "this sentence breaks rule X," rewrite or delete the rule.

## Step 4: Zip the folder

The ZIP must contain the folder as its root:

```text
acme-voice.zip
└── acme-voice/
    └── SKILL.md
```

Loose files at the top of the ZIP fail to upload. On macOS, right-click the folder and choose **Compress**; on Windows, **Send to > Compressed (zipped) folder**. If you add a `reference.md` with the full style guide, keep it inside the folder and mention it in `SKILL.md`.

## Step 5: Upload on claude.ai

Skills are available on Free, Pro, Max, Team, and Enterprise plans, and require code execution to be on. Individual plans: **Settings > Capabilities**, enable **Code execution and file creation**. Team plans have it on by default; Enterprise owners enable both **Code execution and file creation** and **Skills** under **Organization settings > Skills**.

Then: **Customize > Skills**, click the **+** button, choose **+ Create skill**, select **Upload a skill**, and pick the ZIP. The skill appears in your list with a toggle. Uploads are private to your account; on Team and Enterprise, the three-dot menu offers **Share** with specific people, a group, or the whole organization once an owner has enabled sharing. Shared skills are view-only and recipients get your updates automatically.

## Step 6: Install in Claude Code

Claude Code on your machine does not see the claude.ai upload. Copy the same folder to one of two places:

```bash
# every project on this machine
mkdir -p ~/.claude/skills && cp -r acme-voice ~/.claude/skills/

# or one repository, committed so teammates get it
mkdir -p .claude/skills && cp -r acme-voice .claude/skills/
```

The skill is available as `/acme-voice` at once and loads automatically when a request matches the description. Precedence rules and the plugin route are in [How to install Claude skills](/guides/skills/how-to-install-claude-skills).

## Step 7: Use it in Cowork

Cowork sessions do not read `~/.claude/skills/` on your machine. They load the skills enabled for your claude.ai account, synced at session start, so the upload in step 5 is the Cowork install too. Open [Cowork](/tools/claude-cowork), type `/` in the composer, confirm `acme-voice` is listed, and give it a real task: "Draft the launch email for Acme Ledger." If you also installed Anthropic's marketing plugin, its `draft-content` skill and your voice skill load together; [the marketing plugin guide](/guides/marketing/claude-marketing-plugin-guide) covers how they fit.

## Step 8: Test with /brand-check

Do not test on good copy. Take a draft you know is off-voice (the counterexample from step 1 works) and run the [brand-check](/commands/marketing/brand-check) command on it. Expect specific flags: the sentence, the rule it breaks, the fix. Three outcomes:

| Result | What it means | What to do |
|---|---|---|
| Flags the known problems with quotes | Rules are checkable | Ship it |
| Passes clean or gives general praise | Rules are too vague | Rewrite adjectives as rules, re-zip, upload again |
| Flags things that are fine | A rule is too broad | Narrow it or scope it to one channel |

On claude.ai, either edit the skill files where they open beside a chat (highlight text, click **Edit with Claude**) or disable the old skill, delete it from the three-dot menu, and upload the new ZIP. In Claude Code, editing the file is enough; skill directories are watched live.

## Keeping it honest

A voice skill only stays useful if it stays true. Re-run the profiler every quarter on copy that shipped; if a rule is being broken everywhere, either the voice moved or the rule was never real. Keep the file in git even if you mostly use claude.ai; the upload is a deploy target, not the source of truth. The same discipline pays off downstream: [An SEO content workflow in Claude Code](/guides/marketing/seo-content-workflow-with-claude-code) runs every draft through this skill before the on-page check, and [Does AI-written content rank in 2026?](/guides/marketing/ai-content-and-search-2026) explains why a distinct voice matters more, not less, when AI does the drafting.
