# Tier-1 freshness refresh (2026-09-01, unattended) — PR OPEN

Scope: the 8 tier-1 pages (pricing, context windows, coding stats, MCP stats,
best MCP servers, CLI agents, Claude/GPT/Gemini, big-4 comparison). No August
run landed, so this covers July 1 → September 1.

## Done
- 5 primary-source research agents (vendor pricing/docs pages, registry and
  GitHub APIs, SEC filings, earnings transcripts, vendor changelogs). All 8
  pages changed; validate + build green; shipped as PR from `freshness/2026-09`.
- Biggest corrections: Sonnet 5 $2/$10 made permanent (Aug 10); Claude Opus 5
  (Jul 24) replaces Opus 4.8 (legacy); GPT-5.6 Sol/Terra/Luna (Jul 9, cut
  twice); OpenAI Priority → Fast mode; OpenAI >272K long-context surcharge
  (was missing); DeepSeek peak/off-peak pricing (Aug 16, big list increase);
  Gemini 3.6/3.7 Flash + 3.5 Flash-Lite; Grok 4.5/4.6 + xAI ≥200K tier;
  hosts (Kimi K3, GLM-5.3, DeepSeek V4 Pro 0813); Mistral Medium 3.5 is
  open-weights not "premium". Stats: Copilot 50M users (Jul 29), SpaceX–Cursor
  closed Aug 14 (8-K), Codex 5M weekly (Jun 2) + 25M "active" (exec post),
  Lovable $500M ARR / $13.3B Series C, Cursor $4B is Forbes not Bloomberg,
  METR Feb-2026 CIs cross zero. MCP: npm 204M / PyPI 319M / Smithery 11,245 /
  PulseMCP 21,982 / AAIF 247 (Aug 13) / GitHub MCP 21 toolsets (not 17).
  Tools: Cursor 3.18 + SpaceX company; Continue joined Cursor (repo
  read-only — was already true July 1, missed); Devin Desktop's Cascade NOT
  retired (our FAQ was wrong); Goose → aaif-goose/goose; o-series legacy,
  dedicated Codex models retired Jul 23; Antigravity no longer "preview".
- Left untouched + flagged: mcp.so ~23k (site 403s automated checks; kept
  with July label); SO 2026 / DORA 2026 not yet published (aggregator "2026"
  numbers are relabeled 2025 — avoided); OpenAI ending Cursor model access
  Nov 12 (CNBC/Bloomberg headlines only, body 403 — not added); Devin Desktop
  BYO keys (no current doc — softened to Cursor-only); Grok 4.3 max output.
- Note: `public/search-index.json` was byte-identical after the build (index
  fields didn't change), so nothing to stage there.

## Next
- Owner reviews/merges the PR. Next tier-1 run 2026-10-01; quarterly "2026"
  sweep is due (last was not run) — consider `/freshness-refresh quarterly`.
- Watch: Haiku 4.5 retirement floor Oct 15, 2026; Sonnet 4.5 Sep 29 (no
  deprecation notice yet); GPT-5.6 Sol promo through Nov 21; Gemini 3.6/3.7
  Flash intro pricing through Dec 31; DeepSeek peak/off-peak windows.

---

# SEO/AEO/GEO audit and content-depth pass (2026-08-07) — IN PROGRESS

## Done
- Inventoried 607 content pages (61 agents, 110 skills, 163 guides, 139 tools,
  53 commands, 81 glossary entries) and the existing metadata, canonical,
  JSON-LD, sitemap, RSS, IndexNow, Markdown-twin, and llms.txt infrastructure.
- Reviewed current first-party guidance from Google Search Central, Bing
  Webmaster, OpenAI, and Perplexity plus the original KDD 2024 GEO paper.
- Confirmed the main opportunity is editorial: guides average ~840 body words,
  no guide reaches 2,500 body words, and only 13/163 guides cite an external
  source. Technical coverage is already strong.
- Shipped the provenance layer (2026-08-25): `/about` editorial-standards page,
  guide `depth` + `sources` frontmatter, a rendered "Sources and further
  reading" section (also in the .md twin), `citation` /
  `publishingPrinciples` / `abstract` in JSON-LD, explicit googlebot robots
  directives, and cornerstone validation gates. Verified via validate + lint +
  build and by inspecting the generated HTML.

## Next
- Cornerstone tier SHIPPED (2026-08-25). Four guides now carry
  `depth: cornerstone`, each with 5 primary sources:

  | Guide | Words (was) |
  |---|---|
  | writing-your-first-skill | 3,007 (1,703) |
  | skills-vs-agents-vs-commands | 2,992 (1,225) |
  | multi-agent-orchestration | 2,969 (1,261) |
  | what-are-claude-skills | 2,146 (913) |

- Gates rebalanced toward verification: 2,000 words (was 2,500) and 5 sources
  (was 3), on the reasoning that word count is the weakest proxy for depth.
- Corrections made during research (all against first-party docs):
  `allowed-tools` is scoped to the invoking turn, not "while active"; the
  skills library count was stale (90+ -> 110); the "December 2025" open-standard
  date was unverifiable against agentskills.io and has been dropped.
- NOTE: the CLI bundles only agents/skills/commands (`build-cli-content.ts`),
  so a guides-only wave needs NO CLI republish. The roadmap's blanket
  "republish after each content wave" should be read as "after each
  installables wave".
- Remaining: mirror sync + push (outward-facing, awaiting owner go-ahead).
- Next candidates if the tier expands: skill-md-reference,
  building-multi-step-workflows, claude-code-skills-best-practices. Keep the
  tier scarce — it is a head-term tier, not a migration target.

---

# Meta description fix: Bing "short description" flags (2026-07-31) — SHIPPED (33ce91d)

Bing Site Scan CSV (12 URLs) was a sample; real scope = every meta description <100 chars.
Threshold inferred at 100 (all flagged pages 67-98; keep new copy 110-160).

## Done
- 4 template strings in src/lib/seo/collections.ts enriched (category, tool-category,
  pricing, alternatives) → all 202 listing pages now 113-158 chars (verified by executing
  the collection fns). Alternatives template shortened so longest tool title (Void, 48ch) fits ≤160.
- 46 detail pages got bespoke `seoDescription` frontmatter (24 commands, 18 tools, 4 guides);
  inserted after the description line, all 100-160 length-gated by script. `description`
  untouched — it IS the installable artifact description; buildArtifact allowlist confirms
  seoDescription never ships in artifacts/CLI.
- npm run validate green (561 items); full npm run build green (785 pages); built HTML spot-checked
  for 7 of the originally flagged pages.

## Next
- Commit + push (deploy), then mirror:build + push mirror, then request Bing re-scan /
  IndexNow resubmit of the 12 flagged URLs.
- If Bing's next scan still flags stragglers sitting at exactly 100-110 chars, nudge those.

---

# Content wave: "claude skills" keyword (2026-07-18) — SHIPPED (waves 1+2)

## Wave 2 (same day) — SHIPPED, commit "SEO: 'claude skills' cluster wave 2…" (ee1fd29)
6 long-tail guides: troubleshooting/claude-skills-not-working, skills/claude-document-skills,
skills/claude-skills-use-cases, ai-safety/are-claude-skills-safe,
skills/agent-skills-open-standard, comparisons/claude-skills-vs-custom-gpts.
Hub at 561; validated first pass, build green, pushed, mirror synced (1793588).
No CLI republish needed (guides aren't bundled).
Web-verified facts used: Workspace Agents = GPTs successor (Apr 22 2026, org plans; NO published
individual-GPT sunset; do NOT cite the "Aug 26" date or pricing); Codex supports Agent Skills
standard (first-party docs); agentskills.io showcase = 44 clients ("40+" citable); verified load
paths Copilot/VS Code/Cursor/Gemini CLI/Codex; .agents/skills = neutral dir; claude.ai skills on
ALL plans incl. Free; anthropics/skills now 17 skills incl. skill-creator; doc skills in Claude
Code (beta) + M365 add-ins; mobile support UNVERIFIED (avoided the claim).

## Done
- 6 new guides in src/content/guides/skills/: what-are-claude-skills (pillar, featured),
  skill-md-reference, how-to-install-claude-skills, claude-skills-on-claude-ai-and-api,
  claude-skills-examples, best-claude-skills-2026
- New skill: src/content/skills/workflow/skill-auditor.md (skipped skill-creator — create-skill command exists)
- New glossary: src/content/glossary/agent-skills.md
- Interlinks: pillar added to related[] of all 6 pre-existing skills guides
- Facts verified against official docs (claude-code-guide agent + claude-api reference):
  no `version` field in spec; full field set incl. when_to_use/paths/context: fork;
  agentskills.io open standard (Dec 2025); API betas + /v1/skills; surfaces don't sync
- validate + full build green (555 items); search index rebuilt
- Committed ("SEO: 'claude skills' cluster…") + pushed master → deploy
- Mirror rebuilt (mirror:build) + committed + pushed (agentscamp-library main)
- Local-only scripts/audit-links.ts: fixed tsc error (item.body possibly undefined) that broke next build

## Blocked (owner action)
- (none — CLI 0.7.2 published to npm 2026-07-31; version bump committed as 1d2149b)

## Next session
- Watch Search Console for the cluster; consider a follow-up "claude skills not working" troubleshooting
  page if impressions warrant (testing-and-debugging-skills partially covers it).
