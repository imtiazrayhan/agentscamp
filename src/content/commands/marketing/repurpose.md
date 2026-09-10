---
description: "Run content-repurposer on a file or pasted text and write the X thread, LinkedIn post, newsletter section, and video script to content/repurposed/."
seoDescription: "/repurpose turns a file or pasted text into an X thread, LinkedIn post, newsletter section, and video script in content/repurposed/. A Claude Code command."
date: 2026-09-10
argument-hint: "[file path or pasted text]"
allowed-tools: "Read, Write, Glob"
title: "Repurpose"
color: "purple"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
featured: false
related: ["skill:content-repurposer", "command:brand-check", "agent:content-editor", "guide:claude-code-for-marketers", "guide:claude-skills-for-marketers"]
summary: "A slash command that runs the content-repurposer procedure inside Claude Code: it reads the file or text you pass, builds a ledger of every claim in it, writes an X thread, a LinkedIn post, a newsletter section, and a short-video script that draw only from that ledger, and saves them as separate files under content/repurposed/<slug>/ with a claims file."
---

Turn one finished piece into its channel versions and put them where the rest of the project can find them. This command runs the same procedure as the [content-repurposer](/skills/marketing/content-repurposer) skill, with two additions: it reads the source from a file when given a path, and it writes each derivative to its own file under `content/repurposed/<slug>/` instead of printing one long reply. It is one of the repeatable steps in [Claude Code for marketers](/guides/marketing/claude-code-for-marketers); the next step is [/brand-check](/commands/marketing/brand-check) on whichever derivative goes out first.

## Scope

Interpret `$ARGUMENTS` in this order:

1. If it looks like a path and `Read` succeeds on it (`posts/onboarding-timing.md`, `~/Downloads/webinar-transcript.txt`), the file's contents are the source. Anything else in `$ARGUMENTS` is treated as instructions ("skip the video script", "thread limit 4,000 characters").
2. If it looks like a URL, stop and say so in one line: this command has no web access. Save the page as a file or paste the text.
3. Otherwise treat the whole of `$ARGUMENTS` as the pasted source, verbatim.
4. If `$ARGUMENTS` is empty, ask one question, "Which file or text should I repurpose?", and stop. Never pick a project file on your own.

> [!NOTE]
> This command reuses; it does not research or improve. It will not add examples, update a number, or find a source for an unsourced statistic; those are owner decisions, made from the claims file it writes.

## Step 1 — Read the source and find the voice guide

Read the source in full. Then `Glob` for a voice guide in this order: `brand-voice.md`, `docs/brand-voice.md`, `.claude/skills/brand-voice/SKILL.md`. If one exists, `Read` it and apply its rules block to every derivative; if none exists, match the register of the source and say so in the report. Do not search beyond those paths.

## Step 2 — Build the claims ledger and the spine

Follow the skill's first two steps: one ledger row per factual claim, number, quotation, and named entity, each marked SOURCED (with the citation) or UNSOURCED; then the one-sentence spine and three to five supporting points, each pointing at ledger rows. Nothing outside the ledger may appear in any derivative.

## Step 3 — Write the four derivatives

Follow the skill's format rules exactly: an X thread of five to nine posts under 280 characters each with counts printed (or the stated limit); a LinkedIn post of 150 to 300 words with the point in the first two lines; a newsletter section of 120 to 200 words with a subhead and one `[LINK]`; a short-video script of 45 to 60 seconds as a time, spoken line, on-screen text table. Mark every UNSOURCED number that appears with `[UNSOURCED]`. If an instruction in `$ARGUMENTS` skips a derivative, skip it and note it.

## Step 4 — Check the derivatives against the ledger

Compare every number, name, and quotation in the outputs to the ledger. Rounded, strengthened, or new claims are fixed before writing. Record each fix.

## Step 5 — Write the files

Derive `<slug>` from the source filename without its extension, or from the first heading of pasted text, in kebab-case. `Glob` for `content/repurposed/<slug>/`; if it already exists, stop with a one-line question: overwrite it, or write to `content/repurposed/<slug>-2/`? Then `Write`:

- `content/repurposed/<slug>/x-thread.md`
- `content/repurposed/<slug>/linkedin.md`
- `content/repurposed/<slug>/newsletter.md`
- `content/repurposed/<slug>/video-script.md`
- `content/repurposed/<slug>/claims.md` (the ledger, the spine, the flags, and the fixes from Step 4)

Each derivative file starts with a one-line comment naming the source file and the date. Create `content/repurposed/` if it does not exist.

> [!WARNING]
> Only write inside `content/repurposed/<slug>/`. Never modify the source file, any other content, or configuration. If the source contains customer names or figures that should not sit in a repository, say so in the report before writing.

## Output

Report the five paths written (or which were skipped and why), the number of `[UNSOURCED]` flags and where each appears, whether a voice guide was applied and from which path, and the fixes made in Step 4. Suggest `/brand-check content/repurposed/<slug>/linkedin.md` for the first derivative going out, and the [content-editor](/agents/marketing/content-editor) agent for a full voice and claims pass on all four. The skill this wraps, and the rest of the set, are described in [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers).
