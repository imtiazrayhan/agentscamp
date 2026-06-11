---
name: "claude-settings-auditor"
description: "Audit every Claude Code settings layer — user, project, local, and managed — and report the effective merged configuration with its risks: over-broad Bash allows, missing deny rules for secrets, bypassPermissions defaults, unvetted MCP servers and hooks, and rules that never match. Use before trusting a new repo's checked-in settings, or to harden your own before handing the agent more autonomy."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "orange"
date: 2026-06-11
topics: ["workflow-prompting"]
related: ["claude-code-settings-permissions", "claude-code-hooks", "hook-writer", "claude-code-mcp-setup", "security-auditor"]
featured: false
summary: "Reads every settings layer — user, project, local, managed — plus .mcp.json and hook scripts, computes which rules win after precedence, and reports findings by severity: permission holes (broad Bash allows, no secret denies), risky defaults (bypassPermissions, auto-approved MCP servers), suspicious hooks, and dead rules — each with a concrete safer replacement."
---

Claude Code's behavior is the *merge* of up to five settings sources — and the merged result is what nobody ever reads. This skill reads it for you: every layer, precedence applied, with each risky or dead rule called out and a safer replacement proposed. Run it on a freshly cloned repo before working in it, or on your own setup before granting more autonomy.

## When to use this skill

- You cloned a repo with a checked-in `.claude/settings.json` (and maybe `.mcp.json` and hooks) and want to know what you're trusting before the first session.
- Your permission prompts feel wrong — too many, too few — and you want the effective rule set explained.
- You're about to loosen the reins (acceptEdits, broader allows, CI automation) and want the floor checked first.

## When NOT to use this skill

- You want to *write* a specific hook — that's [hook-writer](/skills/workflow/hook-writer).
- You're auditing the application's code for vulnerabilities — that's the [security-auditor](/agents/quality-security/security-auditor) agent; this skill audits the agent harness configuration itself.

## Instructions

1. **Collect every layer.** Read `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, and check for managed policy files (platform-specific admin paths). Include `.mcp.json` and any `.claude/hooks/` scripts referenced. Note which files exist, which are committed to the repo, and which are personal.
2. **Compute the effective configuration.** Apply precedence (managed > local > project > user) and the permission decision order (deny → ask → allow). Produce the merged permissions table, the active hooks by event, the MCP servers by scope, and the notable toggles (`defaultMode`, `enableAllProjectMcpServers`, `disableAllHooks`, `autoMemoryEnabled`).
3. **Hunt permission holes.** Flag, with severity: blanket allows (`Bash`, `Bash(*)`, `mcp__*` in allow), allows that swallow more than intended (`Bash(git *)` covers `git push --force`), **missing deny rules for secrets** (`.env*`, key files, cloud credential paths), `WebFetch` unbounded, and `bypassPermissions` as a default mode anywhere outside a container.
4. **Vet hooks and MCP servers as supply chain.** For each hook script: what does it execute, is the source readable, does any blocking hook fail open? For each MCP server: scope, provenance, whether secrets are inline instead of `${VAR}` expansion, and whether `enableAllProjectMcpServers` auto-approves more than the user realizes. Read the scripts — don't trust filenames.
5. **Find dead and shadowed rules.** Rules that can never fire (shadowed by an earlier deny, malformed pattern, the `Bash(ls *)`-vs-`lsof` word-boundary trap, tools that don't exist) are noise that breeds false confidence — list them for deletion.
6. **Report by severity, then propose the patch.** CRITICAL (acts now, dangerous), WARN (risky under the wrong prompt), INFO (hygiene). For each finding: the file and line, why it matters in one sentence, and the exact replacement rule. Offer the corrected settings JSON as a diff the user can apply — but do not modify files unless asked.

> [!NOTE]
> A checked-in settings file is the *team's* contract — recommend fixes to it as a PR suggestion, not a silent local edit, and keep personal loosening in `settings.local.json` where it belongs.

> [!TIP]
> The fastest wins are nearly universal: add `deny: ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]`, replace any bare `Bash` allow with the three or four commands actually used, and move `git push` to `ask`.

## Output

An effective-configuration summary (what wins, from which file), a severity-ordered findings list with file:line and one-line impact each, and a ready-to-apply corrected settings diff — plus the explicit list of things that looked unusual but are fine, so the next auditor doesn't re-litigate them.
