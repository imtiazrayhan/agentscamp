# Role paths Wave 1: foundation + founders + marketers (2026-09-10) — SHIPPED

79 new items across three commits, taking the hub from 607 to 686. Every role
hub renders from `audience` frontmatter plus a registered start-here sequence.

## Done (three commits on master)
- **Foundation (16):** tool pages for the products every non-dev role compares
  (claude.ai, Claude Cowork, Claude Design, Claude for Excel, Claude in Chrome,
  ChatGPT, Gemini, Perplexity, Gemini Notebook, Microsoft 365 Copilot); guides
  claude-cowork-guide, claude-knowledge-work-plugins, claude-plans-compared-2026
  (the ONLY page that states consumer plan prices, tier-1 monthly, as-of dated);
  glossary claude-cowork, claude-plugins, ai-connectors.
- **Founders (30):** cornerstone pillar claude-code-for-non-developers plus six
  guides, a tools roundup and two versus guides; tools base44, emergent, rork,
  softr, glide, bubble, zapier-agents, lindy; skills/commands/agents under a new
  `product` category; four glossary terms. Lovable, Bolt, v0 and Replit Agent
  moved from `platform` to the new `app-builder` tool category.
- **Marketers (33):** cornerstone pillar claude-code-for-marketers plus seven
  guides, two roundups and two versus guides; tools jasper, copy-ai, surfer,
  clearscope, hubspot-breeze, gamma, descript, opus-clip; five skills, two
  commands and a content-editor agent under `marketing`; five glossary terms
  (GEO, AEO, AI Overviews, llms.txt, brand voice).
- Category landing copy added for every new guide/skill/command/agent category
  and for the assistant, app-builder, automation, design, marketing and
  analytics tool categories (the old template assumed an AI-coding stack).
- An adversarial fact-check pass reconciled cross-file conflicts: plugin count
  (launched with 11 on Jan 30 2026, 17 today), Cowork platforms and plan gating,
  Claude Design research-preview vs beta, Claude in Chrome availability (an
  unverifiable attack-rate stat was replaced with the GA post's figures),
  the NotebookLM to Gemini Notebook rename, Rork's Swift/Kotlin switch, Fable
  availability per plan, Projects on Free (help center vs pricing page both
  cited), Base44 GitHub tier, and Glide credit counts.

## Method that worked
Parallel authors each write into a scratchpad directory against a shared
authoring spec (frontmatter caps, link allowlist, inbound-link rule, "no figure
from memory"), then a lint script checks lengths and schema before anything is
copied into the repo, then one reviewer agent fact-checks the integrated set.
Spec and scripts live in the session scratchpad; the route index generated from
src/content is what keeps cross-batch links from 404ing.

## Next
- Wave 2a designers (32) and 2b analysts (32), then the cross-role tag pass.
- After Wave 2: rebuild the mirror, bump the CLI (new installables in product,
  marketing, design and analytics categories) and republish.
- The marketers fact-check ran as mechanical consistency checks only (the
  reviewer agent hit a rate limit); a full adversarial pass over the marketing
  cluster is still worth running.

---

# Role paths: audience taxonomy + /for/<role> (2026-09-10) — WAVE 0 SHIPPED

Owner direction: position the hub so every role — developers, founders,
marketers, designers, analysts — lands on a relevant page and finds a path to
the guides, tools, skills, agents, and commands that fit their work. Decision:
role paths are curated (not filters), new non-dev content is anchored to the
Claude ecosystem per role plus tool-agnostic roundups, all four non-dev roles
ship in two waves, no new "models" content type, and each role gets a small
set of installables usable on claude.ai, Claude Code, and Cowork.

## Done (one commit on master)
- Content model: `audience: [...]` site field (zod enum sourced from the new
  `audiences` registry entry; unknown slugs fail at load time); `getByAudience`;
  `audienceCollection` (ordered `startHere` sequence + remaining tagged items
  grouped by type, featured-first then newest); `audienceParams`.
- Routes: `/for` (role index, CollectionPage + ItemList via the generalized
  `hubGraph`, which also now serves `/topics`) and `/for/[role]`
  (`CollectionView` + new `RolePath` list slot). A role renders only once it
  has tagged items, like topics.
- Entry points: homepage "Who are you?" `RoleStrip` (GA4 `role_select`), hero
  "start here" now points at `/for`, nav "Start here" (lg+ only — seven links
  wrap at md), how-to-use FAQ answers by role, about copy broadened.
- Sitemap includes `/for` + rendered roles; llms.txt gains a "By role" section
  and a non-dev-assuming intro line.
- Validator: every `startHere` ref must exist, be unique, and carry the tag;
  `/for*` added to valid link routes; empty roles warn.
- Registry: new topic `ai-at-work` (inert until content lands).
- Developers path curated: 49 items tagged (33 guides across getting-started,
  configuration, mcp, skills, troubleshooting, claude-code comparisons; 6 tools;
  4 agents, 4 skills, 2 commands). Validate 0 errors; build green (2,372 pages);
  JSON-LD ItemList order = start-here first; nav screenshot-checked at 768/1024.

## Next
- Wave 1a Foundation (16): tool pages for claude.ai, Claude Cowork, Claude Design,
  Claude for Excel/Chrome, ChatGPT, Gemini app, Perplexity, NotebookLM, M365
  Copilot; guides claude-cowork-guide, claude-knowledge-work-plugins,
  claude-plans-compared-2026 (the one page with plan facts, tier-1); 3 glossary.
  Gates every role roundup (tool-coverage rule now includes claude.ai/ChatGPT).
- Wave 1b Founders (30) → 1c Marketers (33) → mirror sync + CLI 0.8.0.
- Wave 2 Designers (32) → Analysts (32) → cross-role tag pass (~75 edits).
- Full item tables, gates, and query families: docs/content-roadmap-phase3.md
  (local) / the approved plan.
- Dev server on :3001 was running during the production build and now 500s on
  its CSS chunk — restart `npm run dev`.

---

# Alternatives pages deepened, data-only (2026-09-10) — SHIPPED

Assessment: the 133 indexable `/tools/*/alternatives` pages ranked on the
title match alone — two template sentences, a half-empty table (~43% of
license and ~47% of platform cells were "—"), and one clamped-description
card per alternative. Nothing said why a tool was an alternative, and none of
the 35 comparison guides were linked from the pages whose tools they compare.
Owner chose data-only deepening: no schema change, no new copy.

## Done (one commit on master)
- Ranking: direct alternatives (in the tool's own `alternativeTo`) before
  reverse matches, same category first within each; JSON-LD ItemList follows.
- Per-alternative detail list replaces the card grid on this route only
  (`CollectionView` gained an optional `list` slot): full `summary`, pricing,
  license/platforms when present, profile link.
- Head-to-head links: a guide qualifies when it carries the `comparison` tag
  and its `related` names both tools; pairwise guides sort before roundups,
  then guides whose slug names the alternative. 79 pages get links
  (246 of 599 entries).
- "Free and open-source alternatives to X" block only when the page mixes
  free and paid alternatives (83 pages).
- Cline page went from ~200 to ~540 main-content words; Claude Code to ~1,170.
  No FAQPage node (a templated FAQ would be boilerplate).

## Next
- The 4-week GSC re-check should now also watch CTR and average position on
  alternatives pages against the 2026-09-07 baseline.
- Data gap still open: 60 tools lack `license`, 66 lack `os`; a backfill wave
  would fill the table dashes (verify against primary sources).

# Content-first repositioning + audience foundations (2026-09-09) — SHIPPED

Owner decision: AgentsCamp is a content site first (guides, tool directory,
glossary); the npm CLI is a secondary addition. Backed by Search Console
(2026-06-02 → 2026-09-07): content pages earn ~87% of clicks, installables ~2%,
and the best-performing format is the programmatic tool "alternatives" page.

## Done (three commits on master)
- Repositioning: guides lead the type order (nav, footer, bento, palette,
  llms.txt); the hero and homepage route readers to guides and topics instead
  of an install command; detail pages show the summary before install actions
  with the CLI as the last row; `/how-to-use` opens with the guides and ends
  with an optional `#cli` section; the README leads with the site.
- Audience foundations: Imtiaz Rayhan byline on all 163 guides (Person JSON-LD
  → `/about#who-writes-this`), share row on guides (X, LinkedIn, copy link),
  footer follow links (X, GitHub) + npm link + guides-only `/guides/feed.xml`,
  publish dates on guide cards, `track()` GA4 helper wired to copy and share.
  Fixed two latent bugs: RSS autodiscovery only existed on `/` (metadata
  builders replaced `alternates`), and `formatDate` had no timezone (would
  have caused hydration mismatches west of UTC once cards showed dates).
- GSC follow-ups: alternatives pages open with an intro + pricing/license/
  platform comparison table; agents and skills listings hand off to their
  pillar guides; query-led `seoTitle`/`seoDescription` on 10 pages ranking
  7–12 with near-zero CTR (cursor-vs-windsurf, llm-gateways-compared,
  claude-code-settings-permissions, codex-mcp-setup, llm-api-pricing-2026,
  sandboxing-ai-generated-code, codex-troubleshooting,
  ai-coding-agents-cli-2026, baseten, windsurf).
- Deliberately deferred: newsletter/email capture (owner: bring audience and
  make them return first).

## Next
- Push master and the rebuilt mirror (`mirror/` has README + manifest order
  changes staged locally). No CLI republish needed (no installable changes).
- Re-check GSC in ~4 weeks: CTR on the 10 rewritten pages, clicks on
  alternatives pages, and whether `what-are-claude-skills` starts taking the
  "claude skills" impressions from `/skills`.
- Candidate next steps: extend the comparison table pattern to tool category
  pages; a "compare" surface for the versus guides; newsletter once return
  visits are measurable.

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
