---
title: "How to Install Claude Skills"
description: "Every way to install Claude skills: manual copy, the agentscamp CLI, GitHub repos, plugins, team distribution, and uploading to claude.ai."
author: "AgentsCamp"
date: 2026-07-18
color: "orange"
topics: ["workflow-prompting"]
tags: ["skills", "claude-code", "installation", "cli", "setup"]
featured: false
seoTitle: "How to Install Claude Skills (Claude Code + claude.ai)"
seoDescription: "Install Claude skills in under a minute: where SKILL.md files go, project vs personal scope, npx agentscamp, GitHub repos, plugins, and claude.ai upload."
keywords: ["install claude skills", "claude skills install", "claude code skills setup", "add skills to claude", "agentscamp cli"]
summary: "Installing a Claude skill is copying a folder: .claude/skills/<name>/SKILL.md for the project, ~/.claude/skills/ to follow you everywhere. No restart — skills are picked up live. Faster paths: npx agentscamp add skills/<name> installs from our library in one command, plugins bundle skill sets for teams, and claude.ai takes skills as ZIP uploads with code execution enabled."
howtoSteps:
  - name: "Pick the scope"
    text: "Project skills live in .claude/skills/ (checked in, shared with everyone who clones the repo); personal skills live in ~/.claude/skills/ (follow you across all projects). Default to project scope for team procedures, personal for your own habits."
  - name: "Create the folder and drop in SKILL.md"
    text: "mkdir -p .claude/skills/<name>, then save the SKILL.md inside it. The directory name becomes the /name invocation and must match the frontmatter name field — lowercase, numbers, hyphens."
  - name: "Or install from the AgentsCamp library in one command"
    text: "npx agentscamp add skills/<slug> installs into the current project's .claude/; add -g for ~/.claude/. Bare npx agentscamp opens an interactive picker; npx agentscamp add --all installs the full library to ~/.claude/."
  - name: "Verify it loaded"
    text: "Type / in Claude Code — the skill appears in the menu under its name. Skill directories are watched live, so no restart is needed; if the top-level skills folder itself didn't exist when the session started, restart once."
  - name: "Test the trigger"
    text: "Ask for the job in natural words ('write a commit message for this') and confirm the skill activates on its own. If it only works via /name, the description needs trigger phrasing — that's a description problem, not an install problem."
  - name: "Share it with the team"
    text: "Commit .claude/skills/ to the repo and every clone gets the skills. For distribution across repos, package skills into a plugin; enterprise admins can push skills org-wide through managed settings."
faq:
  - q: "Where do Claude skills go?"
    a: "Project: .claude/skills/<name>/SKILL.md inside the repo. Personal: ~/.claude/skills/<name>/SKILL.md. The folder name is the skill's /name, and it must match the name field in the frontmatter."
  - q: "Do I need to restart Claude Code after installing a skill?"
    a: "Usually not — skill directories are watched, so new and edited skills take effect in the current session. The one exception: if the skills directory itself didn't exist when the session started, restart once so it gets watched."
  - q: "How do I install skills from GitHub?"
    a: "Clone the repo and copy the skill folders you want into ~/.claude/skills/ or .claude/skills/. Anthropic's official anthropics/skills repository works exactly this way, and skills distributed as Claude Code plugins install through the plugin system with their own namespace."
  - q: "How do I uninstall a skill?"
    a: "Delete its folder. There's no registry or lockfile — the filesystem is the source of truth, and removal is picked up live like installation."
  - q: "Can I install skills on claude.ai?"
    a: "Yes — zip the skill folder and upload it under Settings → Customize → Skills, with code execution enabled under Settings → Capabilities. Note that surfaces don't sync: a skill on claude.ai doesn't appear in Claude Code or the API."
  - q: "Is it safe to install skills from the internet?"
    a: "The same way installing packages is: read before you run. A skill's instructions and bundled scripts execute with your session's permissions, so review the SKILL.md, check what its allowed-tools pre-approves, and prefer sources you trust."
related: ["what-are-claude-skills", "best-claude-skills-2026", "packaging-and-sharing-skills", "writing-your-first-skill", "claude-settings-auditor", "skill-md-reference"]
---

A Claude skill installs by existing in the right folder — there's no package manager step, no registry, no build. This guide covers every route: manual copy, the one-command CLI, GitHub repos, plugins, teams, and the non-Claude-Code surfaces. If you're not sure what a skill is yet, read [What Are Claude Skills?](/guides/skills/what-are-claude-skills) first.

## The two folders that matter

| Scope | Path | Use for |
|---|---|---|
| **Project** | `.claude/skills/<name>/SKILL.md` | Team procedures — checked into the repo, everyone who clones gets them |
| **Personal** | `~/.claude/skills/<name>/SKILL.md` | Your own habits — follow you into every project |

The directory name is the skill's identity: it defines the `/name` invocation and must match the `name` in the frontmatter (lowercase, numbers, hyphens). Everything else in the folder — scripts, templates — rides along and loads only when the skill's instructions reference it.

## Route 1: manual copy

```bash
mkdir -p .claude/skills/conventional-commits
# paste the SKILL.md into that folder
```

Every skill page in the [AgentsCamp library](/skills) shows the complete SKILL.md with a copy button and the exact install path. Paste, save, done — skill directories are watched live, so the skill is available in your current session without a restart.

## Route 2: the agentscamp CLI

One command from any terminal:

```bash
# into this project's .claude/
npx agentscamp add skills/conventional-commits

# into ~/.claude/ (all projects)
npx agentscamp add skills/conventional-commits -g

# browse and pick interactively
npx agentscamp

# the whole library in one shot (installs to ~/.claude/)
npx agentscamp add --all
```

The CLI has zero runtime dependencies and installs agents and commands the same way (`agents/<slug>`, `commands/<slug>`). It's the fastest path from "that looks useful" to installed.

## Route 3: GitHub repos

Skills distributed as git repos install by clone-and-copy:

```bash
git clone https://github.com/anthropics/skills /tmp/skills
cp -r /tmp/skills/<skill-name> ~/.claude/skills/
```

The anthropics/skills repository is Anthropic's official collection — including the document skills (`docx`, `xlsx`, `pptx`, `pdf`) that also power claude.ai. Community skills on GitHub follow the same shape: find the folder with the SKILL.md, copy it in.

> [!WARNING]
> Read before you install. A skill's body is instructions Claude follows, and bundled scripts are code it may run — all under your session's permissions. For unfamiliar sources, skim the SKILL.md and check what `allowed-tools` pre-approves. On a new repo, [claude-settings-auditor](/skills/workflow/claude-settings-auditor) reviews checked-in skills and settings before you trust them.

## Route 4: plugins and teams

For a *set* of skills — your team's whole workflow — three tiers:

1. **Check `.claude/skills/` into the repo.** Zero infrastructure; every clone is provisioned. This is the right default for team procedures.
2. **Package a plugin.** A plugin bundles skills, agents, commands, and hooks into one versioned, installable unit with its own namespace (`/plugin:skill-name`). [Packaging and Sharing Skills](/guides/skills/packaging-and-sharing-skills) walks through it; the [plugin-scaffolder](/skills/workflow/plugin-scaffolder) skill automates the scaffolding.
3. **Enterprise managed settings.** Org admins can distribute skills to every user centrally — the skills appear automatically, highest in precedence.

## Beyond Claude Code

- **claude.ai** — zip the skill folder, upload under **Settings → Customize → Skills**, and make sure code execution is on under **Settings → Capabilities**. Available on all plans; Team/Enterprise admins can enable skills workspace-wide.
- **Claude API** — upload to the `/v1/skills` endpoint and attach by `skill_id` to Messages requests via the code-execution container. Code and beta headers in [Claude Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
- **Other tools** — since Agent Skills became an open standard (agentskills.io), the same SKILL.md installs into GitHub Copilot, Cursor, VS Code, Gemini CLI, and more — each tool documents its own skills directory.

Surfaces don't sync: each one needs its own copy of the skill.

## Verify and tune

After installing, two checks. First, type `/` — the skill should be in the menu. Second, and more important: ask for the job in plain words and confirm the skill fires *on its own*. If it doesn't, the install is fine but the description isn't — see [Testing and Debugging Skills](/guides/skills/testing-and-debugging-skills) for the fix loop.
