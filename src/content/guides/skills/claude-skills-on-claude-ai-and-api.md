---
title: "Claude Skills on claude.ai and the API"
description: "How Agent Skills work beyond Claude Code: uploading to claude.ai, the /v1/skills API with code execution, Managed Agents, and the Agent SDK."
author: "AgentsCamp"
date: 2026-07-18
color: "blue"
topics: ["llm-app-dev", "ai-agents-systems"]
tags: ["skills", "claude-api", "claude-ai", "agent-skills", "code-execution"]
featured: false
seoTitle: "Claude Skills on claude.ai and the Claude API (2026)"
seoDescription: "Use Claude Skills outside Claude Code: ZIP upload on claude.ai, the /v1/skills endpoint with code execution betas, Managed Agents, and the Agent SDK."
keywords: ["claude skills api", "claude ai skills", "v1/skills", "agent skills api", "upload skills claude"]
summary: "The same SKILL.md runs on four surfaces. On claude.ai, skills upload as ZIPs with code execution enabled — the document skills (docx, xlsx, pptx, pdf) are pre-built and always on. On the API, custom skills upload to /v1/skills and attach to Messages requests through the code-execution container. Managed Agents and the Agent SDK each load skills their own way — and no surface syncs with another."
keyTakeaways:
  - "claude.ai: zip the skill folder, upload under Settings → Customize → Skills, enable code execution under Settings → Capabilities. Anthropic's document skills are pre-built and always active."
  - "Messages API: attach skills via the container parameter alongside the code_execution tool, with both betas — code-execution-2025-08-25 and skills-2025-10-02."
  - "Custom skills upload once to POST /v1/skills and are referenced by skill_id; versions are epoch-stamped, 'latest' works, and uploads are shared workspace-wide."
  - "API limits to design around: max 8 skills per request, 30 MB per skill, no network access and no runtime package installs inside the container."
  - "Managed Agents take skills as a field on the agent object (max 20); the Agent SDK loads them from .claude/skills/ on the filesystem and ignores allowed-tools."
  - "Surfaces don't sync — a skill on claude.ai doesn't exist in Claude Code or the API. Keep the SKILL.md in git and treat each surface as a deploy target."
faq:
  - q: "How do I use Claude Skills with the API?"
    a: "Upload the skill to POST /v1/skills (beta header skills-2025-10-02) to get a skill_id, then attach it to a Messages request via the container parameter with the code-execution tool declared and both betas set. The skill's files are available inside the execution container, and Claude loads them progressively as in Claude Code."
  - q: "Which skills are pre-built on the API and claude.ai?"
    a: "Anthropic ships document skills — pptx, xlsx, docx, and pdf — referenced by those literal skill_ids with type 'anthropic'. On claude.ai they're always active; on the API you attach them like any other skill and download the generated files through the Files API."
  - q: "Why isn't my claude.ai skill showing up in Claude Code?"
    a: "Surfaces don't share a skill store. claude.ai skills live in your claude.ai settings, Claude Code skills live on your filesystem, and API skills live in your workspace via /v1/skills. Install the same skill on each surface you use."
  - q: "Can API-attached skills use any Python package?"
    a: "No — the code-execution container has no network access and no runtime package installation, so skills can only rely on the pre-installed library set (pandas, numpy, matplotlib, openpyxl, python-docx, python-pptx, and similar). Bundle pure-Python helpers as files inside the skill instead of pip-installing."
  - q: "Do skills work with the Claude Agent SDK?"
    a: "Yes — the SDK discovers skills from ~/.claude/skills/ and the project's .claude/skills/ via the setting_sources option, and you select them with the skills option ('all' or a list). One difference from Claude Code: the allowed-tools frontmatter field is ignored; tool permissions come from the SDK's own allowedTools."
related: ["guide:what-are-claude-skills", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "guide:claude-code-skills-best-practices", "guide:skills-vs-mcp-servers", "glossary:agent-skills"]
---

Skills started in Claude Code, but the format was designed to travel: the same folder-with-a-SKILL.md now runs on claude.ai, on the Claude API, inside Managed Agents, and in the Agent SDK. What changes per surface is *how skills get there* and *what executes them*. This guide covers each. (New to the format? Start with [What Are Claude Skills?](/guides/skills/what-are-claude-skills))

| Surface | How skills get there | What runs them |
|---|---|---|
| Claude Code | Filesystem (`.claude/skills/`) | Your session, your machine |
| claude.ai | ZIP upload in Settings | Anthropic's code-execution sandbox |
| Claude API | `POST /v1/skills` + `container` param | The code-execution container |
| Managed Agents | `skills` field on the agent object | The session's container |
| Agent SDK | Filesystem, via `setting_sources` | Your agent process |

## claude.ai: upload and go

On claude.ai (web and desktop), skills are a first-class capability:

1. Enable **code execution** under **Settings → Capabilities** — skills run inside it.
2. Zip your skill folder (the one containing SKILL.md) and upload it under **Settings → Customize → Skills**.

That's the whole flow, available on every plan. On Team and Enterprise, admins can enable skills workspace-wide so one upload serves the org.

Anthropic's **document skills** — Word (`docx`), Excel (`xlsx`), PowerPoint (`pptx`), and PDF — are pre-built and always active on claude.ai: ask for a spreadsheet and the xlsx skill is already doing the formatting. They're the best public demonstration of what a well-built skill looks like; the source is in the public anthropics/skills repo.

## The Messages API: skills + code execution

On the API, skills attach to a request through the `container` parameter, and they execute inside the code-execution tool's sandbox. Two beta headers are required together:

```python
response = client.beta.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "custom", "skill_id": "skill_01AbC...", "version": "latest"},
        ]
    },
    tools=[{"type": "code_execution_20260521", "name": "code_execution"}],
    messages=[{"role": "user", "content": "Build a budget model in a spreadsheet"}],
)
```

Generated files (`.xlsx`, `.pptx`, …) are written inside the container; the response carries file IDs you download via the Files API (`files-api-2025-04-14`).

### Custom skills: the /v1/skills endpoint

Upload your own skills once, reference them everywhere in the workspace:

- `POST /v1/skills` — upload a skill (returns the `skill_id`)
- `GET /v1/skills` — list pre-built and custom skills
- `POST /v1/skills/{skill_id}/versions` — publish a new version

Versions are epoch-stamped IDs, and `"latest"` always resolves to the newest — which gives API skills the real versioning story the SKILL.md format itself deliberately lacks (see [the reference](/guides/skills/skill-md-reference)). Uploaded skills are shared workspace-wide.

### Constraints to design around

- **Max 8 skills per request** — attach what the task needs, not your whole library.
- **30 MB per uploaded skill.**
- **No network access in the container**, and **no runtime package installs** — a skill that shells out to `pip install` or calls an external API works in Claude Code and fails here. Bundle helpers as files; rely on the pre-installed scientific/document Python stack.

That last point is the practical portability rule: a skill built on *reading bundled files and writing outputs* ports cleanly across every surface; a skill built on network calls is Claude Code-only.

## Managed Agents

Anthropic's hosted agents take skills as part of the persisted agent config — up to 20 per agent, mixed pre-built and custom:

```python
agent = client.beta.agents.create(
    name="Financial Agent",
    model="claude-opus-4-8",
    skills=[
        {"type": "anthropic", "skill_id": "xlsx"},
        {"type": "custom", "skill_id": "skill_01AbC...", "version": "latest"},
    ],
)
```

Every session that references the agent gets its skills in the session container, loaded with the same progressive disclosure.

## The Agent SDK

Building your own agent on the Claude Agent SDK? Skills load from the filesystem — the same `~/.claude/skills/` and `.claude/skills/` directories Claude Code uses — controlled by two options: `setting_sources` (which directories to read) and `skills` (`"all"`, a specific list, or `[]`). There's no programmatic create-skill API; skills are artifacts, which means they live in git and deploy with your code.

One behavioral difference: the SDK ignores a skill's `allowed-tools` frontmatter — tool permissions come from the SDK's own `allowedTools` configuration.

## One skill, many deploys

The mental model that makes this all manageable: **the SKILL.md in your repo is the source of truth, and each surface is a deploy target.** Nothing syncs — claude.ai, the API, and your filesystem each hold their own copy. Teams that use skills across surfaces keep them in one directory in git and treat "upload to claude.ai" and "publish to /v1/skills" as release steps, exactly like publishing a package. The [packaging guide](/guides/skills/packaging-and-sharing-skills) covers the Claude Code half of that story.
