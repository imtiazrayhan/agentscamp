---
title: "The Agent Skills Standard: One SKILL.md for Every AI Tool"
description: "Agent Skills became an open standard in December 2025. Which tools read SKILL.md today — Copilot, Cursor, VS Code, Gemini CLI, Codex — and how to write portable skills."
author: "AgentsCamp"
date: 2026-07-18
color: "green"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["agent-skills", "skills", "skill-md", "open-standard", "interoperability"]
featured: false
seoTitle: "The Agent Skills Standard: One SKILL.md, Every Tool"
seoDescription: "Agent Skills is an open standard: the same SKILL.md runs in Claude Code, GitHub Copilot, Cursor, VS Code, Gemini CLI, and OpenAI Codex. Paths and rules."
keywords: ["agent skills standard", "agentskills.io", "skill.md standard", "agent skills cursor", "agent skills copilot"]
summary: "Anthropic released the Agent Skills format as an open standard on December 18, 2025, and adoption has been sweeping: the official showcase lists 40+ clients, including GitHub Copilot, VS Code, Cursor, Gemini CLI — and OpenAI's Codex. A .agents/skills directory in your repo is emerging as the cross-tool convention: one SKILL.md, every agent your team runs."
keyTakeaways:
  - "Two dates matter: skills shipped as an Anthropic feature in October 2025, and the format became an open standard (agentskills.io) on December 18, 2025."
  - "Adoption is real, not aspirational: the official client showcase lists 44 tools, and OpenAI's own Codex docs say its skills 'build on the open agent skills standard.'"
  - "The portable core is small — name, description, the Markdown body, plus license/metadata/compatibility. Execution fields like allowed-tools and context: fork are per-client extensions."
  - ".agents/skills is the emerging neutral directory: Copilot, VS Code, Cursor, Codex, and Gemini CLI all read it — and several also read .claude/skills for compatibility."
  - "Write for portability: encode the procedure, not the tool — skills that lean on Claude-specific fields or assume specific built-in tools degrade outside Claude Code."
faq:
  - q: "What is the Agent Skills standard?"
    a: "An open specification for the skill format Anthropic developed — a folder with a SKILL.md whose frontmatter (name, description) tells an agent when to load it and whose Markdown body is the procedure to follow. Published at agentskills.io in December 2025, with the spec on GitHub, so any agent product can implement it."
  - q: "Which tools support SKILL.md today?"
    a: "The official showcase lists 44 clients as of mid-2026. The big ones: Claude Code and claude.ai, GitHub Copilot (cloud agent, code review, CLI, and agent mode in VS Code and JetBrains), VS Code, Cursor, Gemini CLI, OpenAI Codex, plus Goose, OpenHands, Letta, JetBrains Junie, Spring AI, Amp, OpenCode, and Roo Code among others."
  - q: "Where do I put skills so every tool finds them?"
    a: "The cross-tool convention is .agents/skills/ in the repo (personal: ~/.agents/skills/) — Copilot, VS Code, Cursor, Codex, and Gemini CLI all read it. Several tools also read .claude/skills/ for compatibility, so existing Claude Code setups often work in other tools unchanged."
  - q: "Do Claude-specific fields like allowed-tools work in other tools?"
    a: "Not guaranteed. The standard's portable core is the identity fields and the body; execution controls (allowed-tools, context: fork, model, hooks) are client extensions that other tools may ignore. Unknown fields don't break anything — clients skip them — but don't rely on them for correctness outside Claude Code."
  - q: "Does OpenAI really support Anthropic's skills format?"
    a: "Yes — first-party confirmed. OpenAI Codex's documentation describes skills as directories with a SKILL.md and states they build on the open agent skills standard, loading from .agents/skills tiers with the same progressive-disclosure model."
related: ["guide:what-are-claude-skills", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "guide:claude-skills-vs-custom-gpts", "guide:packaging-and-sharing-skills", "guide:claude-skills-examples"]
---

The most consequential thing about Claude Skills isn't a feature — it's that the format escaped. Anthropic shipped skills in October 2025, then published the format as an **open standard** on December 18, 2025 (agentskills.io, spec on GitHub). Seven months later, the official client showcase lists **44 tools** that read SKILL.md, including every major coding agent — and, remarkably, OpenAI's own. A procedure you write once now runs in whatever agent each teammate happens to use.

## What the standard actually specifies

The spec is deliberately small. A skill is a directory with a `SKILL.md`:

- **Identity frontmatter** — `name` (lowercase, hyphens, matches the folder) and `description` (what it does + when to use it), plus optional `license`, `metadata`, and `compatibility`.
- **The body** — Markdown instructions the agent follows once the skill loads.
- **Progressive disclosure** — clients load name/description at startup, the body on trigger, and bundled files (scripts, references) only when the instructions reach for them.

That's the portable core. Everything else you may know from Claude Code — [`allowed-tools`, `context: fork`, `model`, skill-scoped hooks](/guides/skills/skill-md-reference) — is a **client extension**: legal under the spec (unknown fields are ignored), but not behavior you can count on elsewhere.

## Who reads SKILL.md today

Verified against each vendor's own docs (July 2026):

| Tool | Where it loads skills from |
|---|---|
| **Claude Code** | `.claude/skills/` (project), `~/.claude/skills/` (personal), plugins, managed |
| **GitHub Copilot** | `.github/skills`, `.claude/skills`, `.agents/skills`; personal `~/.copilot/skills`, `~/.agents/skills` — across the cloud agent, code review, Copilot CLI, and agent mode in VS Code/JetBrains |
| **VS Code** | Workspace `.github/skills/`, `.claude/skills/`, `.agents/skills/`; user `~/.copilot/skills`, `~/.claude/skills`, `~/.agents/skills` |
| **Cursor** | `.agents/skills/`, `.cursor/skills/` (+ home equivalents) — and reads `.claude/skills/` and `.codex/skills/` for compatibility |
| **Gemini CLI** | User `~/.gemini/skills/` (alias `~/.agents/skills/`), workspace `.gemini/skills/` (alias `.agents/skills/`), with a consent prompt on activation |
| **OpenAI Codex** | `.agents/skills` (scanned up to repo root), `~/.agents/skills`, admin `/etc/codex/skills` — its docs cite the open standard explicitly |

Beyond those: Goose, OpenHands, Letta, JetBrains Junie, Spring AI, Amp, OpenCode, Roo Code, Qodo, Tabnine, and enough others that "40+ tools" is now simply accurate.

Two patterns jump out of that table. First, **`.agents/skills/` is the neutral ground** — the one directory nearly everyone reads. Second, **`.claude/skills/` travels**: Copilot, VS Code, and Cursor read it directly, so a repo already set up for Claude Code is, for most teams, already set up for everything else.

## What this means for a team

The strategic shift: skills stop being tool configuration and become **team infrastructure**, like `.editorconfig` or CI. One concrete playbook:

1. **Keep skills in the repo, once.** Either stay in `.claude/skills/` (widely read for compatibility) or move to `.agents/skills/` as the tool-neutral home. Don't maintain per-tool copies.
2. **Let each engineer bring their own agent.** The migration-writer procedure fires whether a teammate runs Claude Code, Cursor, or Codex — conventions stop depending on tool monoculture.
3. **Review skills like the shared code they now are.** A SKILL.md in the repo changes behavior for *every* agent in the building — the [security checklist](/guides/ai-safety/are-claude-skills-safe) applies with interest.

## Writing portably

A few rules keep a skill working across clients:

- **Encode the procedure, not the tool.** "Run `git diff --staged` and summarize by intent" ports; "use the Grep tool with these parameters" doesn't. Name commands and outcomes, not a specific client's tool surface.
- **Treat execution fields as progressive enhancement.** `allowed-tools` reducing friction in Claude Code is great; a skill that's *unsafe or wrong* without it isn't portable. Same for `context: fork` — the procedure should still make sense inline.
- **Keep bundled scripts boring.** POSIX shell or stdlib Python, relative paths, no assumptions about the host beyond "can run a script" — the lowest common denominator across 44 sandboxes is low.
- **Test the description against strangers.** Different clients route with different prompting around your description; the trigger-first two-sentence shape ([the craft guide](/guides/skills/claude-code-skills-best-practices)) is what survives contact with all of them.

Skills from the [AgentsCamp library](/skills) follow these rules — the bodies are command-and-outcome procedures, which is why they carry across tools with light or no editing. And if you're deciding what this means versus the walled-garden alternative, the [Custom GPTs comparison](/guides/comparisons/claude-skills-vs-custom-gpts) is the natural next read.
