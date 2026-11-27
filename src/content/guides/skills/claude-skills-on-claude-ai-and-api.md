---
title: "Claude Skills on claude.ai and the API"
description: "How Agent Skills work beyond Claude Code: uploading to claude.ai, the /v1/skills API with code execution, Managed Agents, and the Agent SDK."
author: "Imtiaz Rayhan"
date: 2026-07-18
updated: 2026-11-27
reviewed: 2026-11-27
color: "blue"
topics: ["llm-app-dev", "ai-agents-systems"]
tags: ["skills", "claude-api", "claude-ai", "agent-skills", "code-execution"]
featured: false
seoTitle: "Claude Skills on claude.ai and the Claude API (2026)"
seoDescription: "Use Claude Skills outside Claude Code: ZIP upload on claude.ai, the /v1/skills endpoint with the code execution tool, Managed Agents, and the Agent SDK."
keywords: ["claude skills api", "claude ai skills", "v1/skills", "agent skills api", "upload skills claude"]
summary: "The same SKILL.md runs on four surfaces. On claude.ai, upload a ZIP under Customize > Skills with code execution on; the document skills (docx, xlsx, pptx, pdf) are built in. On the API, upload to /v1/skills and attach skills to a Messages request through the container parameter, with no beta header. claude.ai skills sync down to Claude Code."
keyTakeaways:
  - "claude.ai: zip the skill folder, then Customize > Skills > + > Create skill > Upload a skill. Code execution and file creation must be on under Settings > Capabilities. Anthropic's document skills are built in."
  - "Messages API: attach skills via the container parameter alongside the code execution tool. As of November 2026 the Skills API is out of beta and needs no beta header; requests that still send skills-2025-10-02 keep working."
  - "Custom skills upload once to POST /v1/skills and are referenced by skill_id. Versions are skver_ IDs, 'latest' works, and uploads are private to the workspace."
  - "API limits to design around: 20 skills per request, 30 MB per skill uncompressed, no network access and no runtime package installs inside the container."
  - "Managed Agents take skills as a field on the agent object; the Agent SDK loads them from .claude/skills/ on the filesystem."
  - "Sync is one-way: skills enabled on claude.ai download into Cowork and Claude Code sessions on the same account. The API workspace shares nothing with either, so keep the SKILL.md in git and treat each surface as a deploy target."
faq:
  - q: "How do I use Claude Skills with the API?"
    a: "Upload the skill with POST /v1/skills (client.skills.create in the Python SDK) to get a skill_id, then attach it to a Messages request via the container parameter with the code execution tool in the tools array. No beta header is needed as of November 2026. The skill's files are copied into the container at /skills/<skill-name>/ and Claude loads them when the request calls for it."
  - q: "Which skills are pre-built on the API and claude.ai?"
    a: "Anthropic ships four document skills: pptx, xlsx, docx, and pdf, referenced by those literal skill_ids with type 'anthropic'. On claude.ai they are active whenever code execution and file creation is on; on the API you attach them like any other skill and download the generated files through the Files API."
  - q: "Does a claude.ai skill show up in Claude Code?"
    a: "Yes, as of November 2026. Claude Code v2.1.273 or later downloads the skills enabled on your claude.ai account into ~/.claude/skills/synced/ when you sign in with that account, and lists them under claude.ai sync in /skills. It never uploads: a skill on your filesystem stays local. API skills live in your workspace via /v1/skills and sync with neither."
  - q: "Can API-attached skills use any Python package?"
    a: "No. The code execution container has no internet access and no runtime package installation, so skills can only rely on the pre-installed set: pandas, numpy, scipy, scikit-learn, matplotlib, seaborn, openpyxl, python-docx, python-pptx, pypdf, reportlab, and similar. Bundle pure-Python helpers as files inside the skill instead of pip-installing."
  - q: "Do skills work with the Claude Agent SDK?"
    a: "Yes. The SDK discovers skills from ~/.claude/skills/ and the project's .claude/skills/ through the setting_sources option, and you select them with the skills option ('all', a list of names, or an empty list). There is no programmatic API for registering a skill; they are files on disk."
related: ["guide:what-are-claude-skills", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "guide:claude-code-skills-best-practices", "guide:skills-vs-mcp-servers", "glossary:agent-skills"]
audience: ["developers", "ai-engineers"]
---

Skills started in Claude Code, but the format was designed to travel: the same folder-with-a-SKILL.md now runs on claude.ai, on the Claude API, inside Managed Agents, and in the Agent SDK. What changes per surface is *how skills get there* and *what executes them*. Most of this page is API code; if you only need the upload steps, the first section is enough. (New to the format? Start with [What Are Claude Skills?](/guides/skills/what-are-claude-skills))

| Surface | How skills get there | What runs them |
|---|---|---|
| Claude Code | Filesystem (`.claude/skills/`), plus a one-way sync from claude.ai | Your session, your machine |
| claude.ai | ZIP upload under Customize > Skills | Anthropic's code-execution sandbox |
| Claude API | `POST /v1/skills` + `container` param | The code-execution container |
| Managed Agents | `skills` field on the agent object | The session's container |
| Agent SDK | Filesystem, via `setting_sources` | Your agent process |

## claude.ai: upload and go

On claude.ai (web and desktop), the path from Anthropic's help center, as of November 2026:

1. Open **Settings > Capabilities** and make sure **Code execution and file creation** is on (the updated Settings layout calls it **Create and edit files**). Skills run inside it.
2. Zip your skill folder so the folder, with its SKILL.md inside, is the root of the archive.
3. Go to **Customize > Skills**, click **+**, then **+ Create skill**, then **Upload a skill**, and choose the ZIP.
4. Toggle the skill on in your skills list.

The help center lists this for Free, Pro, Max, Ultra, Team, and Enterprise. On Team plans skills are on by default at the organization level. On Enterprise, an owner enables code execution and Skills under **Organization settings > Plugins & skills**, and can provision skills for everyone. Team and Enterprise members can also share a skill with colleagues or publish it to the organization's library.

Anthropic's **document skills** — Word (`docx`), Excel (`xlsx`), PowerPoint (`pptx`), and PDF — are built in: ask for a spreadsheet and the xlsx skill is already doing the formatting. Their source is in the public anthropics/skills repo under Apache 2.0, and they are the best public demonstration of what a well-built skill looks like. [Claude's Document Skills](/guides/skills/claude-document-skills) covers them in detail.

## The Messages API: skills + code execution

On the API, skills attach to a request through the `container` parameter, and they execute inside the code execution tool's sandbox. As of November 2026 neither the Skills API nor the code execution tool needs a beta header, so this is a plain `client.messages.create` call:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=4096,
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"},
        ]
    },
    messages=[{"role": "user", "content": "Build a budget model in a spreadsheet"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}],
)
```

The custom `skill_id` above is the placeholder Anthropic's docs use; yours comes back from the upload call below. Generated files (`.xlsx`, `.pptx`, …) are written inside the container. The response carries a `file_id` for each one inside the code-execution result blocks, and you download it with the Files API:

```python
for item in response.content:
    if item.type == "bash_code_execution_tool_result":
        result = item.content
        if result.type == "bash_code_execution_result":
            for file in result.content:
                metadata = client.files.retrieve_metadata(file_id=file.file_id)
                client.files.download(file_id=file.file_id).write_to_file(metadata.filename)
```

If you have older code that calls `client.beta.messages.create` with `betas=["code-execution-2025-08-25", "skills-2025-10-02"]`, it still runs. Anthropic's migration note says requests that send the old header "keep working and keep returning the beta response shapes." Removing it switches you to the current shapes: `display_name` instead of `display_title`, and `skver_...` version IDs instead of epoch timestamps.

### Custom skills: the /v1/skills endpoint

Upload your own skills once, reference them everywhere in the workspace:

```python
from anthropic.lib import files_from_dir

skill = client.skills.create(files=files_from_dir("financial_skill"))
print(skill.id, skill.latest_version_id)

# later: publish a new version (a full snapshot, not a delta)
client.skills.versions.create(
    skill_id=skill.id,
    files=files_from_dir("financial_skill"),
)
```

- `POST /v1/skills` uploads a skill and returns the `skill_id`. A ZIP works too.
- `GET /v1/skills` lists pre-built and custom skills; filter with `?source=custom`.
- `POST /v1/skills/{skill_id}/versions` publishes a new version.

`"latest"` always resolves to the newest version, which gives API skills the versioning story the SKILL.md format itself deliberately lacks (see [the reference](/guides/skills/skill-md-reference)). Custom skills are private to the workspace, and anyone in the workspace can publish a version, so pin a `skver_...` ID in production and keep `latest` for development.

### Constraints to design around

- **20 skills per request.** Attach what the task needs, not your whole library; changing the list also breaks prompt caching.
- **30 MB per uploaded skill**, all files combined, uncompressed.
- **Frontmatter rules.** `name` up to 64 characters, lowercase letters, numbers and hyphens, and it cannot contain `anthropic` or `claude`. `description` up to 1,024 characters.
- **No network access in the container**, and **no runtime package installs.** A skill that shells out to `pip install` or calls an external API works in Claude Code and fails here. Bundle helpers as files; rely on the pre-installed data and document Python stack.

That last point is the practical portability rule: a skill built on *reading bundled files and writing outputs* ports cleanly across every surface; a skill built on network calls is Claude Code-only.

## Managed Agents

Anthropic's hosted agents, in beta as of November 2026 behind the `managed-agents-2026-04-01` header, take skills as part of the persisted agent config, mixing pre-built and custom:

```python
agent = client.beta.agents.create(
    name="Financial Analyst",
    model="claude-opus-5-5",
    system="You are a financial analysis agent.",
    skills=[
        {"type": "anthropic", "skill_id": "xlsx"},
        {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"},
    ],
)
```

Every session that references the agent gets its skills in the session container, loaded with the same progressive disclosure. The docs put the ceiling at 500 skills per session, counted across every agent in it.

## The Agent SDK

Building your own agent on the Claude Agent SDK? Skills load from the filesystem, the same `~/.claude/skills/` and `.claude/skills/` directories Claude Code uses, controlled by two options:

```python
options = ClaudeAgentOptions(
    setting_sources=["user", "project"],  # where to look for skills
    skills="all",                         # or a list of names, or []
)
```

There's no programmatic create-skill API; skills are artifacts, which means they live in git and deploy with your code. If you set `setting_sources` explicitly and leave out `user` and `project`, no skills load.

Tool permissions work as they do in Claude Code: a project or personal skill can pre-approve tools with its `allowed-tools` frontmatter, or you can pass `allowed_tools` in the query options. Managed settings that set `allowManagedPermissionRulesOnly` override both.

## One skill, many deploys

The mental model that makes this manageable: **the SKILL.md in your repo is the source of truth, and each surface is a deploy target.** There is one automatic link. Skills you enable on claude.ai download into Cowork and into Claude Code sessions signed in with the same account (v2.1.273 or later), and Claude Code never uploads anything back. Everything else is manual: the API workspace holds its own copy, and a skill in `.claude/skills/` reaches claude.ai only when you upload it. Anthropic's platform overview still describes the surfaces as separate stores, so do not rely on sync for anything the API needs.

Teams that use skills across surfaces keep them in one directory in git and treat "upload to claude.ai" and "publish to /v1/skills" as release steps, exactly like publishing a package. The [packaging guide](/guides/skills/packaging-and-sharing-skills) covers the Claude Code half of that story.
