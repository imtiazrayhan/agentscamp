---
title: "Are Claude Skills Safe? A Security Review Checklist"
description: "Skills are an instruction supply chain: what can go wrong with third-party SKILL.md files, and the review checklist before installing or distributing one."
author: "AgentsCamp"
date: 2026-07-18
color: "red"
topics: ["ai-safety-security", "workflow-prompting"]
tags: ["skills", "security", "claude-code", "supply-chain", "prompt-injection"]
featured: false
seoTitle: "Are Claude Skills Safe? A Security Review Checklist"
seoDescription: "Claude skills run instructions and scripts with your session's permissions. The threat model for third-party SKILL.md files, plus a pre-install checklist."
keywords: ["claude skills safe", "claude skills security", "skill.md security", "claude code skills risk"]
summary: "A skill is instructions Claude follows and code it may run, executing with your session's permissions — which makes third-party skills a supply chain, and installing one an act of trust. The realistic risks: malicious or manipulated instructions, over-broad tool grants, bundled scripts, and quiet exfiltration. All four are reviewable in minutes with the checklist here."
keyTakeaways:
  - "The correct mental model: installing a skill is installing a dependency whose payload is instructions. Claude follows the body; bundled scripts are real code."
  - "Skills don't bypass your permission model — tools still run under your settings. But allowed-tools removes the friction that would otherwise make you look, exactly where you should look hardest."
  - "The four review points: what the body instructs, what allowed-tools pre-approves (scoped forms beat blanket grants), what bundled scripts do, and whether anything phones home."
  - "Auto-invocation is a risk multiplier for destructive procedures — deploy and cleanup skills should carry disable-model-invocation: true so a matching phrase can't fire them."
  - "For teams: review skills in PRs like code (they are), pin plugin versions, and prefer enterprise-managed distribution over everyone installing ad hoc."
faq:
  - q: "Can a Claude skill run malware?"
    a: "A skill can bundle scripts and instruct Claude to run them, and those scripts execute with the same permissions as anything else in your session — so a malicious skill is absolutely possible, the same way a malicious npm package is. The defense is the same too: read what you install, prefer trusted sources, and let your permission settings be the backstop."
  - q: "Does allowed-tools give a skill extra permissions?"
    a: "No — it can't grant anything your settings forbid. What it does is pre-approve listed tools so they run without asking during the skill's turn. That's removed friction, not elevated privilege — but removed friction is precisely where review matters, so scrutinize the list and prefer scoped forms like Bash(git diff:*) over bare Bash."
  - q: "What's the risk of a skill that only contains instructions, no scripts?"
    a: "Instructions steer a model that holds your tools. A body can tell Claude to read sensitive files, weaken what it reports, or quietly include content in outputs that leave the machine (commits, PRs, web requests). Instruction-only skills are lower risk than script-bearing ones, but 'just text' is not 'harmless' — read the body."
  - q: "Are skills from the AgentsCamp library or anthropics/skills safe?"
    a: "Both are public and reviewable, which is the real answer: safety comes from being able to read the SKILL.md before installing, not from any badge. Every AgentsCamp page shows the full file; treat that read as part of installing, especially for skills that touch git remotes, credentials, or deploy paths."
  - q: "How should a team govern skills?"
    a: "Three practices: skills enter the repo only via PR review (a SKILL.md diff is a behavior diff); plugins are pinned to versions so an upstream change can't silently alter behavior; and org-wide distribution goes through enterprise managed settings rather than each engineer's personal folder."
related: ["guide:what-are-claude-skills", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "skill:claude-settings-auditor", "guide:packaging-and-sharing-skills", "guide:claude-code-settings-permissions"]
---

Skills are the most benign-looking thing you can install — a Markdown file — and that's exactly why they deserve a real threat model. A SKILL.md is instructions an agent will follow and code it may execute, running with your session's permissions, triggered automatically when a task matches. That's an **instruction supply chain**, and it deserves the same posture as a package registry. Here's what can actually go wrong, and the five-minute review that covers it.

## The threat model

**1. Malicious or manipulated instructions.** The skill body steers a model that holds your tools. A hostile body can instruct Claude to read files it shouldn't, include their contents in something that leaves the machine (a commit, a PR description, a web request), soften what a review skill reports, or take "adjacent" actions you didn't ask for. This is the skills-flavored version of prompt injection — except you *installed* the injection and it loads whenever its description matches.

**2. Over-broad tool grants.** `allowed-tools` can't exceed your permission settings, but it pre-approves — the skill's tools run without the prompt that would have made you look. A skill whose job needs `Read` and `Grep` but ships with bare `Bash` pre-approved has claimed the exact head-room an attacker (or a buggy body) would want.

**3. Bundled scripts.** Anything next to the SKILL.md is real code the body can run. A ten-line "helper" script is the least-read, most-capable part of a skill — the natural home for the actual payload in a hostile one.

**4. Update drift.** A skill that was clean when reviewed can change: a plugin update, a re-synced repo, an upstream marketplace edit. Instructions are behavior; changed instructions are changed behavior, silently.

Worth stating plainly: none of this bypasses Claude Code's permission model — your settings remain the boundary, which is why [hardening them](/guides/configuration/claude-code-settings-permissions) matters more once skills are in play, not less.

## The pre-install checklist

Five checks, in the order that catches the most:

1. **Read the body as if it were a shell script.** What does it instruct, and where does it stop? Look hardest at anything touching credentials, git remotes, network access, deletion, or "send/post/publish" verbs. A well-built skill states its boundary ("writing the file is the whole job"); a missing boundary on a side-effecting procedure is itself a flag.
2. **Audit `allowed-tools` against the procedure.** Every grant should map to a numbered step. Prefer scoped forms (`Bash(git diff:*)`) over blanket ones; treat bare `Bash` on a skill that doesn't obviously need arbitrary commands as a rewrite-before-install.
3. **Open every bundled file.** Scripts, "templates", reference docs — the payload surface is the whole folder, not just SKILL.md.
4. **Check the invocation mode fits the risk.** Destructive or costly procedures (deploys, mass edits, anything irreversible) should carry `disable-model-invocation: true` so only a deliberate `/name` runs them — auto-invocation plus a broad description is how a casual sentence fires a dangerous runbook. (Field semantics in the [reference](/guides/skills/skill-md-reference).)
5. **Know your source and pin it.** Public, readable sources (the [library](/skills), anthropics/skills) beat opaque ZIPs; plugin installs should pin versions so review-time behavior is run-time behavior.

For a repo you've just cloned, run [claude-settings-auditor](/skills/workflow/claude-settings-auditor) before trusting its checked-in `.claude/` at all — skills are one layer of a config that can also carry hooks, permissions, and MCP servers.

## For teams: govern like code, because it is

- **Skills enter via PR.** A SKILL.md diff is a behavior diff for every engineer's agent; review it with the same seriousness as CI config.
- **One distribution path.** Project `.claude/skills/` for repo-scoped procedures, a versioned [plugin](/guides/skills/packaging-and-sharing-skills) for cross-repo sets, enterprise managed settings for org-wide — and discourage ad-hoc personal installs of unreviewed third-party skills on work machines.
- **Re-review on update.** Treat plugin version bumps like dependency bumps: diff the skills, not just the changelog.
- **Least-privilege by default.** House style for your own skills: scoped `allowed-tools`, explicit boundaries, `disable-model-invocation` on anything destructive. The [skill-auditor](/skills/workflow/skill-auditor) skill checks an existing folder against exactly these rules.

## The honest summary

Skills are as safe as your review habit. The format has real guardrails — permissions still apply, grants are turn-scoped, nothing installs itself — but the same property that makes skills powerful (instructions that load and act automatically) is the property that rewards a hostile author. Read what you install. It's Markdown; it takes five minutes; it's the whole defense.

## Continue exploring

- [Software Supply Chain Security: Dependencies, Builds, and Releases](/guides/ai-safety/software-supply-chain-security) — Secure the software supply chain from dependency selection through release — lockfiles, provenance, least privilege, secret controls, SBOMs, and response.
