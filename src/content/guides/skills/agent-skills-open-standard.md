---
title: "The Agent Skills Standard: One SKILL.md for Every AI Tool"
description: "Agent Skills became an open standard in December 2025. Which tools read SKILL.md today — Copilot, Cursor, VS Code, Gemini CLI, Codex — and how to write portable skills."
author: "Imtiaz Rayhan"
date: 2026-07-18
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["workflow-prompting", "ai-agents-systems"]
audience: ["developers"]
tags: ["agent-skills", "skills", "skill-md", "open-standard", "interoperability"]
featured: false
seoTitle: "The Agent Skills Standard: One SKILL.md, Every Tool"
seoDescription: "Agent Skills is an open standard: the same SKILL.md runs in Claude Code, GitHub Copilot, Cursor, VS Code, Gemini CLI, and OpenAI Codex. Paths and rules."
keywords: ["agent skills standard", "agentskills.io", "skill.md standard", "agent skills cursor", "agent skills copilot"]
summary: "Anthropic published the Agent Skills format as an open standard on December 18, 2025. As of November 2026 the official showcase lists 46 clients, including GitHub Copilot, VS Code, Cursor, Gemini CLI, and OpenAI's ChatGPT and Codex. The spec allows six frontmatter fields, and .agents/skills is the directory most tools read."
keyTakeaways:
  - "Two dates matter: skills shipped as an Anthropic feature on October 16, 2025, and the format became an open standard (agentskills.io) on December 18, 2025."
  - "The official client showcase lists 46 tools as of November 2026, and OpenAI's docs say its skills 'build on the open agent skills standard.'"
  - "The spec defines six frontmatter fields: name, description, license, compatibility, metadata, and allowed-tools. Fields such as context: fork, model, and hooks are Claude Code extensions."
  - "Copilot, Cursor, Codex, and Gemini CLI all read .agents/skills; Copilot and Cursor also read .claude/skills. Claude Code reads only .claude/skills."
  - "Extra frontmatter is not always ignored: claude.ai uploads and the Skills API reject any key outside the spec's six with a hard error."
faq:
  - q: "What is the Agent Skills standard?"
    a: "An open specification for the skill format Anthropic developed: a folder with a SKILL.md whose frontmatter (name, description) tells an agent when to load it and whose Markdown body is the procedure to follow. It was published at agentskills.io on December 18, 2025, with the spec and a reference validator in the agentskills/agentskills GitHub repository."
  - q: "Which tools support SKILL.md today?"
    a: "The official showcase lists 46 clients as of November 2026. They include Claude Code and Claude, GitHub Copilot, VS Code, Cursor, Gemini CLI, ChatGPT and Codex, Junie, Kiro, Goose, OpenHands, Letta, Amp, OpenCode, Roo Code, Factory, TRAE, Mistral AI Vibe, Spring AI, Qodo, and Tabnine."
  - q: "Where do I put skills so every tool finds them?"
    a: "No single directory reaches every tool. .agents/skills/ in the repo (personal: ~/.agents/skills/) is read by GitHub Copilot, Cursor, OpenAI Codex, and Gemini CLI, but not by Claude Code, which reads .claude/skills/. Copilot and Cursor read .claude/skills/ too. A team that uses Claude Code alongside Codex or Gemini CLI needs each skill reachable from both directories, usually one real folder and one symlink."
  - q: "Do Claude-specific fields like context: fork work in other tools?"
    a: "No. Claude Code documents context, model, hooks, argument-hint, and its other additions as extensions to the standard. Clients that parse loosely may skip them, but claude.ai skill uploads and the Skills API fail with an 'Unexpected key(s) in SKILL.md frontmatter' error. allowed-tools is in the spec, marked experimental as of November 2026, with support that varies by client."
  - q: "Does OpenAI really support Anthropic's skills format?"
    a: "Yes. OpenAI's skills documentation covers both ChatGPT and Codex, describes a skill as a directory with a SKILL.md, and states that skills build on the open agent skills standard. Codex loads them from .agents/skills at the repository and user levels, plus an admin directory and skills bundled by OpenAI."
sources:
  - title: "Agent Skills specification"
    url: "https://agentskills.io/specification"
    publisher: "Agent Skills"
  - title: "Client Showcase data (docs/snippets/clients.jsx)"
    url: "https://github.com/agentskills/agentskills/blob/main/docs/snippets/clients.jsx"
    publisher: "Agent Skills"
  - title: "Introducing Agent Skills (updated December 18, 2025)"
    url: "https://claude.com/blog/skills"
    publisher: "Anthropic"
  - title: "Extend Claude with skills"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "About agent skills"
    url: "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills"
    publisher: "GitHub"
  - title: "Use Agent Skills in VS Code"
    url: "https://code.visualstudio.com/docs/copilot/customization/agent-skills"
    publisher: "Microsoft"
  - title: "Agent Skills"
    url: "https://cursor.com/docs/skills"
    publisher: "Cursor"
  - title: "Agent Skills (Gemini CLI docs)"
    url: "https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md"
    publisher: "Google"
  - title: "Agent Skills"
    url: "https://developers.openai.com/codex/skills"
    publisher: "OpenAI"
related: ["guide:what-are-claude-skills", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "guide:claude-skills-vs-custom-gpts", "guide:packaging-and-sharing-skills", "guide:claude-skills-examples"]
---

Anthropic shipped skills as a Claude feature on October 16, 2025, then published the format as an **open standard** on December 18, 2025 (agentskills.io, with the spec on GitHub). As of November 2026 the official client showcase lists **46 tools** that read SKILL.md, including GitHub Copilot, Cursor, Gemini CLI, and OpenAI's ChatGPT and Codex. A procedure you write once can run in whichever agent each teammate uses, provided you stay inside the part of the format that is actually shared.

## What the standard actually specifies

The spec is small. A skill is a directory containing a `SKILL.md` with YAML frontmatter and a Markdown body, plus optional `scripts/`, `references/`, and `assets/` folders.

| Frontmatter field | Required | Constraint in the spec |
|---|---|---|
| `name` | Yes | 1-64 characters; lowercase letters, numbers, and hyphens; no leading, trailing, or consecutive hyphens; must match the parent directory name |
| `description` | Yes | 1-1024 characters; says what the skill does and when to use it |
| `license` | No | A license name or a reference to a bundled license file |
| `compatibility` | No | Up to 500 characters of environment requirements (intended product, system packages, network access) |
| `metadata` | No | A map of string keys to string values |
| `allowed-tools` | No | A space-separated string of pre-approved tools |

The spec marks `allowed-tools` as experimental as of November 2026 and warns that support varies between agent implementations.

The body has no format rules. The spec recommends keeping `SKILL.md` under 500 lines and under roughly 5,000 tokens of instructions, with longer material moved to files referenced by relative path, one level deep.

**Progressive disclosure** is the other half of the standard: a client loads each skill's name and description at startup (about 100 tokens per skill), reads the body when a task matches, and opens bundled files only when the instructions call for them.

Everything else you may know from Claude Code, such as [`context: fork`, `model`, `argument-hint`, `disable-model-invocation`, and skill-scoped hooks](/guides/skills/skill-md-reference), is a **client extension**. Other vendors add their own: Cursor has a `paths` field that scopes a skill to matching files, and Codex reads UI and invocation settings from a separate `agents/openai.yaml` file.

## Who reads SKILL.md today

Load paths below were checked against each vendor's own documentation in November 2026.

| Tool | Where it loads skills from |
|---|---|
| **[Claude Code](/tools/claude-code)** | `.claude/skills/` in the project (including parent directories up to the repository root, and nested subdirectories on demand), `~/.claude/skills/` (personal), the managed settings directory (enterprise), directories passed with `--add-dir`, and plugins |
| **[GitHub Copilot](/tools/github-copilot)** | Project: `.github/skills`, `.claude/skills`, or `.agents/skills`. Personal: `~/.copilot/skills` or `~/.agents/skills`. Used by the Copilot app, Copilot CLI, the cloud agent, Copilot code review, and agent mode in VS Code, Visual Studio, and JetBrains IDEs |
| **VS Code** | Depends on the agent harness running the session. Copilot: `.github/skills/`, `~/.copilot/skills/`. Claude: `.claude/skills/`, `~/.claude/skills/`. Codex: `.agents/skills/`, `~/.agents/skills/` |
| **[Cursor](/tools/cursor)** | `.agents/skills/`, `.cursor/skills/`, `~/.agents/skills/`, `~/.cursor/skills/`; for compatibility also `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, and `~/.codex/skills/` |
| **[Gemini CLI](/tools/gemini-cli)** | User: `~/.gemini/skills/` or the `~/.agents/skills/` alias. Workspace: `.gemini/skills/` or the `.agents/skills/` alias. The alias wins within a tier, and activation shows a consent prompt |
| **[OpenAI Codex](/tools/codex-cli)** | `.agents/skills` in every directory from the working directory up to the repository root, `$HOME/.agents/skills`, admin `/etc/codex/skills`, and system skills bundled by OpenAI |

Two VS Code details are easy to miss. Its older Local harness, which read `.claude/skills/` and `.agents/skills/` alongside `.github/skills/` in one session, is deprecated and scheduled for removal in February 2027. And the Codex integration inside VS Code is experimental as of November 2026.

The showcase also lists [JetBrains Junie](/tools/junie), Kiro, Goose, OpenHands, Letta, Amp, OpenCode, Roo Code, Factory, TRAE, Mistral AI Vibe, Spring AI, Databricks Genie Code, Snowflake Cortex Code, Qodo, and Tabnine, among others.

Two patterns come out of the table:

- **`.agents/skills/` is the closest thing to neutral ground.** Copilot, Cursor, Codex, and Gemini CLI read it. Claude Code does not.
- **`.claude/skills/` travels further than its name suggests.** Copilot and Cursor read it directly, and VS Code reads it in Claude harness sessions. Codex and Gemini CLI do not.

So no single directory reaches all six. A team that runs Claude Code next to Codex or Gemini CLI keeps the real skill folder in one place and symlinks it into the other. Claude Code's docs state that a skill folder entry can be a symlink to a directory elsewhere on disk:

```bash
# real files live in .agents/skills; expose one skill to Claude Code
mkdir -p .claude/skills
ln -s ../../.agents/skills/release-notes .claude/skills/release-notes
```

## A minimal portable SKILL.md

This skill uses only spec fields and names plain commands, so every client in the table can load it:

```markdown
---
name: release-notes
description: Drafts release notes from the commits since the last git tag, grouped into Added, Changed, and Fixed. Use when the user asks for release notes, a changelog entry, or a summary of what shipped.
license: MIT
compatibility: Requires git and a repository with at least one tag
metadata:
  author: example-org
  version: "1.0"
---

# Release notes

1. Find the last tag: `git describe --tags --abbrev=0`.
2. List commits since that tag: `git log <tag>..HEAD --no-merges --pretty=format:'%h %s'`.
3. Sort each commit under Added, Changed, or Fixed. Skip commits that only touch CI, formatting, or dependencies with no user-visible effect.
4. Write one line per entry in plain language, with the short hash in parentheses.
5. If there are no commits since the tag, say so and stop. Do not invent entries.

## Output

    ## Unreleased
    ### Added
    - Export invoices as CSV (a1b2c3d)
    ### Fixed
    - Stop duplicate webhook deliveries on retry (d4e5f6a)
```

Save it as `release-notes/SKILL.md`, because the folder name must equal `name`. The spec's reference library, `skills-ref`, checks the frontmatter and naming rules:

```bash
skills-ref validate ./release-notes
```

## What this means for a team

Skills stop being per-tool configuration and become shared repository infrastructure, like `.editorconfig` or CI config.

1. **Keep one copy in the repo.** Choose `.agents/skills/` or `.claude/skills/` as the real location based on the table above, and symlink into the other if your tool mix needs both. Do not maintain per-tool copies by hand.
2. **Let each engineer bring their own agent.** A migration-writer procedure can fire whether a teammate runs Claude Code, Cursor, or Codex, so conventions no longer depend on everyone using one tool.
3. **Review skills like shared code.** A SKILL.md in the repo changes behavior for every agent that reads that directory, so the [security checklist](/guides/ai-safety/are-claude-skills-safe) applies to each change.

## Writing portably

- **Stay inside the six spec fields if the skill leaves Claude Code.** Claude Code accepts its own extra fields, but claude.ai skill uploads, the Skills API, and Anthropic's `package_skill.py` fail on them with `Unexpected key(s) in SKILL.md frontmatter`. A client that skips unknown keys silently is no better: the behavior you expected is simply absent.
- **Encode the procedure, not the tool.** "Run `git diff --staged` and summarize by intent" ports. "Use the Grep tool with these parameters" does not, because tool names differ per client.
- **Treat execution fields as optional extras.** `allowed-tools` cutting permission prompts is useful where it is honored. A skill that is unsafe or wrong without it is not portable. The same goes for `context: fork`: the procedure should still make sense run inline.
- **Keep bundled scripts boring.** The spec leaves supported script languages to each agent and names Python, Bash, and JavaScript as common options. Use relative paths from the skill root, document dependencies, and state real requirements in `compatibility`.
- **Write the description for a router you have never seen.** Each client wraps your description in its own prompt. State what the skill does and when to use it, with the keywords a user would type ([the craft guide](/guides/skills/claude-code-skills-best-practices) covers the shape).
- **Expect activation to differ.** Gemini CLI asks for consent before a skill activates, Codex has an `allow_implicit_invocation` setting in `agents/openai.yaml`, and Cursor and Claude Code each have a `disable-model-invocation` field. Test the trigger in every tool your team uses.

Skill bodies in the [AgentsCamp library](/skills) are command-and-outcome procedures, which is the part that carries across tools. Their frontmatter is written for Claude Code, so check it against the six spec fields before uploading one elsewhere. For how the open format compares with a closed one, see the [Custom GPTs comparison](/guides/comparisons/claude-skills-vs-custom-gpts).
