# Sales & revenue role path (2026-09-10) — SHIPPED

Two commits. The ninth `/for/<role>` path and the first of the five remaining
Anthropic knowledge-work plugin roles we did not cover. Hub **748 -> 778**.
Six authors wrote in parallel into a scratchpad against a frozen manifest; a
separate adversarial fact-checker then tried to falsify every product claim.

## Shipped
6 guides in `guides/sales` (one cornerstone pillar at 4,079 words), a tier-1
roundup and a versus in `guides/comparisons`, 10 tool pages in a new `sales`
category, 4 skills + 2 commands + 1 agent, 5 glossary terms, 25 existing items
back-tagged. `/for/sales` renders 50 curated items.

## The angle is the Claude surface, not the sales framing
All ten tools ship a first-party MCP server and nine carry a Connectors
Directory listing. No page-one competitor organises around that, and it is what
lets a developer byline carry a sales page without writing sales strategy. The
second wedge is freshness: every listicle ranking today still lists Qualified,
Common Room and Clari as independent going concerns, and all three changed
ownership in 2026.

## The planned installables all cloned Anthropic's plugin — caught and replaced
The approved sketch (prospect-researcher, battlecard-builder,
discovery-call-prepper, outreach-sequence-writer, deal-review-checklist,
prep-call, pipeline-reviewer) duplicated `account-research`,
`competitive-intelligence`, `call-prep`, `draft-outreach` and `pipeline-review`
— shipped free by Anthropic. Replaced with the complement: verify and audit
rather than research and draft (`outreach-claim-checker`,
`cold-email-deliverability-auditor`, `crm-export-auditor`,
`security-questionnaire-responder`, `/check-outreach`, `/audit-crm`,
`agent:sales-engineer`). Max description overlap against 265 existing artifacts
plus Anthropic's nine: 0.18 Jaccard. Four skills, not five — the gate allows
3-5 and a forced fifth collided with `command:seed-data`.

## Four planned tools dropped on verifiable grounds
- **11x** — its own Alice pricing page contradicts itself by $9,000/yr; no MCP.
- **Regie.ai** — no MCP server, no developer docs site at all.
- **Clari** — clari.com carries a banner saying it redirects 2026-09-15.
- **Qualified / Common Room** — acquired by Salesforce and Zoom in 2026.
Replaced with **Unify** and **Nooks**. `outreach.io` now 301s to `outreach.ai`,
so the planned URL would have shipped a redirect on day one.

## The fact-check produced 29 corrections, all applied
The ones that mattered:
- **Close's tool count** was "99 tools, 54 read / 17 safe-write / 28 destructive"
  in ten places, sourced to nothing. Its catalogue lists 117 (67/16/34) and
  Anthropic's directory lists 55. The internal consistency of 54+17+28=99 is
  what made a fabricated number look verified.
- **Clay's endpoint** — we told readers a URL claiming to be it "did not come
  from Clay". Anthropic publishes it in two first-party places.
- **The verification badges ARE machine-readable** (`aria-label="Verified"`), so
  our stated reason for not repeating them was false in ten places. The
  editorial conclusion survives on Anthropic's own disclaimer instead.
- Attio 21 -> 23 (directory) and 50+ -> 41 (docs); Apollo 230M -> 240M+;
  Apollo/Pocus is dated March 2026 on both vendors' pages; Gong's 55% was
  quarterly growth, not ARR growth; Gong's MCP docs are 27 Aug, not 5 Jul;
  ZoomInfo's GTM Studio and Copilot launched May 2025, not 2026.

## Process notes
- **My own brief contradicted the spec on prices.** I told the roundup author to
  include Clay's and Apollo's figures; house precedent is that all three
  existing tier-1 roundups carry zero dollar figures. Stripped, with the insight
  kept and the dated numbers left on the tool pages. Versus guides are mixed
  (`exa-vs-tavily` carries four), so those may keep prices.
- **Never re-invent the validator's regexes.** My pre-integration checker was
  stricter than the repo and produced four false errors on tool pages; the real
  `prose()` strips fenced and inline code before `PRICE`/`AS_OF` run.
- A cornerstone guide needs `reviewed` when `updated` is absent
  (`validate-content.ts:266`) — the only legal route for new content.
- Nested double quotes inside a double-quoted YAML scalar break the loader; that
  and a 400-char summary overrun were the only two self-inflicted build breaks.

## Next
CLI `agentscamp@0.9.0` is staged (263 installables, verify-bundle OK) and
awaits the owner's `cd cli && npm publish`. Mirror synced and pushed.
Remaining uncovered plugin roles: customer support, product management,
finance, legal. Engineering leaders remains the strongest non-plugin candidate.

---

# Engineering sub-paths: /for/ai-engineers, /for/devops, /for/security (2026-09-10) — SHIPPED

One commit, no new content. `/for/developers` carried **547 of 748 items (73%)**
because `scripts/backfill-audience.ts` had tagged every untagged file
`["developers"]` — one indexable audience hub standing in for four distinct
reader personas. Split into three sub-paths that already had the material.

## What went where
- **`ai-engineers` carves** — those items leave `developers`, because a general
  Claude Code user is not the reader for `chunking-strategy-optimizer` or
  `voyage-ai`: `guides/{concepts,evaluation,mlops,vision,voice}`,
  `agents/data-ai`, `skills/data`, every `sdk`/`platform`/`evaluation`/`voice`/
  `observability` tool page, and 29 deep-ML glossary terms. Overlaid (kept on
  both paths): `guides/{advanced,mcp,prompting,api}`, coding-agent tools, and
  28 general AI terms a working developer still gets asked about.
- **`devops` and `security` overlay only** — cross-cutting concerns a working
  developer still wants on their own path, so nothing was taken from them.

Counts after: developers 386 · ai-engineers 258 · devops 52 · security 32.
Founders 71 · marketers 72 · designers 52 · analysts 54 unchanged.

## Notes
- **Adding a role is a registry edit.** Appending an `AudienceDef` to
  `audiences` propagated to nav, footer, `/for`, the homepage strip, sitemap,
  llms.txt, the command palette, static params and the zod enum with no other
  code. The mirror generator and the npm CLI have no audience concept and
  needed nothing; the search index deliberately does not index `audience`, so
  it is byte-identical.
- **`devops` is the first role whose `startHere` is not all guides.** Only two
  guides live in `observability`/`performance`, so it opens
  `skill:github-actions-optimizer` and `agent:sre-engineer`. The type always
  allowed it; nothing had used it.
- **`AudienceDef` gained an optional `title`.** The derived `AI for ${label}`
  read as "AI for AI engineers"; that page is now titled "AI engineering".
  Every other role still derives its title.
- `scripts/tag-audience.ts` applied the 320 frontmatter edits — same textual
  single-line rewrite as `backfill-audience.ts` so gray-matter never
  re-serialises, `--dry-run` first, idempotent (a second run changes nothing).
  A carve never strips a tag an overlay in the same run just granted, which is
  what keeps `sandboxing-ai-generated-code` on all four engineering paths.
- Copy that hardcoded "five" fixed in `RoleStrip`, `/for`, `/how-to-use`,
  `/about`. The homepage filler card stays — 8 roles + filler is a clean 3x3.
- `npm run validate` 0 errors (25 pre-existing freshness warnings), build green,
  lint clean, all eight `/for/*` routes prerender.

## Next
Sales & revenue is the next full role wave (~30 items against the Phase-3 ship
gate) — the first of the five remaining Anthropic knowledge-work plugin roles
we do not cover. Deferred: engineering leaders (best byline fit, needs ~20 new
items), QA (overlaps developers), customer support, finance.

---

# Full UI redesign against the Refactoring UI principles (2026-09-10) — SHIPPED

Twelve commits. The colour rebuild four commits earlier had done the hard part
correctly and then stopped: the token layer ended at colour, so everything
above it was hand-rolled — 26 card-shell strings, 6 h1 recipes, 11 h2 strings,
5 pill shapes, 4 button shapes, 4 reading measures. Audited against all ten
Refactoring UI skills; nine failed.

## What the audit actually found (with numbers, since most of it read as design)
- **Opacity as a palette.** `--primary` had one shade and derived every state
  with /90, /10, /30, /50; the six accents had two and used /5, /10, /30. Two
  measured AA failures fell straight out of it: the footer counts at
  `text-muted-foreground/70` = **3.52:1**, the category counts at `opacity-60`
  = **2.83:1**. A tint also composites differently over a card than over the
  page, so one token rendered as two colours.
- **Elevation was dead.** `--card` over `--background` measured **1.04:1**, so
  the hairline carried all of it and every surface read as a box.
- **No focus indicator on any `<Button>`.** The base class set
  `focus-visible:outline-none` and no variant added a ring, so it suppressed the
  global `:focus-visible` outline. WCAG 2.4.7, on pagination and install.
- **The primary action rendered as tertiary.** On every agent/skill/command page
  the copy-file control was 12px muted text beside a real outline Button,
  because CopyButton had one hard-coded recipe and InstallActions faked a height
  with `className="h-10 px-4"`.
- **15+ hairlines on one guide page.** ContentCard's internal divider alone
  repeated ~24x per listing.
- **Four spacings for one relationship** in the article foot: mt-12/pt-8,
  mt-10/pt-8, mt-10/pt-6, mt-8/pt-6.
- Three dead-end empty states; `/search` stranded people on a lowercase
  `no results for "q"`.

## Done
- **Palette is two layers.** Eight full 50–950 ramps in `:root`, absolute and
  never redefined in `.dark`; ~40 semantic aliases that point at ramp steps and
  are the only thing components touch or dark mode remaps. The old values were
  already sampled from these same Tailwind ramps two steps at a time, so no hue
  changed. 84 foreground/surface pairs verified in both themes.
- Page moves to stone-100 so white can lift (1.04 → **1.09:1**), and
  `--secondary` becomes a real recessed ground at **1.26:1** below the card —
  which is what made the border removal viable. Deleted `--accent`,
  `--destructive`, `--success` (byte-identical to `--primary`) and two radii.
- **New primitives:** `Panel` (26 surfaces), `Eyebrow` + `typography.ts` (two
  heading styles, replacing 11 h2 strings), `PageHeader` (6 h1 + 6 lead
  recipes), extended `Badge` (5 pill shapes), `ContentGrid` with `cols`.
  Deleted `card.tsx`, `skeleton.tsx`, `tooltip.tsx` — all with zero importers —
  and the Radix tooltip dep.
- **Rhythm is a clean doubling:** 16 within a group, 32 between groups, 64
  between regions. NOTE: the first rhythm commit used mt-10/mt-14/py-7/gap-14,
  none of which are on the scale it claimed; the gates caught it afterwards.
- **OG cards** finally left the terminal theme, and `src/lib/palette.ts` is now
  the single source for the literal hex Satori needs.
  `scripts/validate-content.ts` parses globals.css and fails the build if the
  two drift — verified by breaking a value on purpose (exits 1, names both
  sides).
- **`scripts/check-design-system.sh`** — eleven grep gates, every allowance
  numbered with its reason.

## Verification
typecheck + lint + build green; `npm run validate` green at 748 items.
**Link graph identical: 6,654 unique hrefs across 1,051 pages, before and
after, zero non-asset diffs** — the constraint that matters on an
organic-search site. Screenshotted in a real browser in both themes: home,
guides, a guide, an agent detail, the search empty state, the 404.

## Lessons
- Writing the gates found four things the pass had missed, two of them my own
  rhythm contradicting the scale I had just documented. Gates before the
  victory lap.
- A stale `next-server` from 00:17 was holding port 3001, so the first
  screenshot run rendered a CSS-less page against old HTML. Check what owns the
  port before believing a screenshot.

## Not done (deliberate)
- `/glossary` still does not use ContentCard. ~100 terms exist to be scanned
  for one word; card padding would roughly triple the page height. Its real
  inconsistencies were fixed instead.
- The `>|` prompt-cursor logo and mono wordmark stay. Terminal-era, but a brand
  decision rather than a UI-system one.
- Nothing pushed. Deploy, then mirror:build, are the owner's call.

---

# Post-role-paths: recover, fix, fortify, deepen (2026-09-10) — SHIPPED

Seven commits. Everything that did not depend on the October Search Console
checkpoint: the silently broken surfaces, the freshness program, the unfinished
half of the audience layer, and content depth.

## The recovery that mattered most
The monthly freshness job never failed in September. It succeeded, opened
PR #8, and told nobody, because line 27 of the local runner assigned
`status=$?` and `status` is a read-only special variable in zsh, so the shell
died after the work was done but before the notification. That PR sat unmerged
for nine days while tier-1 pages looked 71 days stale. Rebased and merged;
conflicts resolved by keeping master's byline and publish date and recording
the refresh as `updated`, per the /about convention.

## Done
- **Open Graph:** 301 of 1,051 built pages emitted `twitter:card=summary_large_image`
  with no image, including all five role hubs and all 133 alternatives pages.
  Next merges file-convention images per segment and `buildPageMetadata` declared
  an openGraph object with no images key, so nothing was inherited. Collection
  pages now default to the site card; alternatives pages use their parent tool's
  own card. Detail pages keep their per-item generators, which was the
  regression to avoid. Down to one page: Next's internal error boundary.
- **IndexNow** derives from `sitemap()` itself now, so the two cannot drift.
  757 URLs became 1,029, which is the sitemap plus the feed. A changed content
  file also re-pings its category landing.
- Seven one-item category landings noindexed; sitemap 1,035 to 1,028.
- **CI exists**: validate, lint, typecheck, build on push and PR, about 3 minutes.
  Deliberately no gate on search-index.json drift, which regenerates on deploy.
- **Freshness is real.** `freshness` and `reviewed` frontmatter keys;
  `src/lib/content/freshness.ts` holds the shared predicates;
  `npm run freshness` is the tracked queue with `--json` for the local runner
  and `--check-urls` for renames. Tier 1 is declared (15 pages, not derivable:
  all 8 money pages have a year in the title and so do 56 other guides);
  the derived pool is 110 priced tools and year-titled guides, worked
  stalest-first. The gate lives in validate-content.ts because that is the only
  thing that runs on every build: a tool cannot quote an undated price, and a
  tier-1 page 90 days past cadence fails the build, which is how a dead
  scheduler becomes visible next time.
- **All 26 undated tool prices re-verified against the vendor and dated.**
  Real drift found: Flowise archived Aug 13; Amp replaced its entire free-credit
  model; CodeRabbit renamed and repriced every tier and dropped free private
  repos; Greptile added a free tier; Lovable moved to credit tiers with
  expiring rollover; Warp's free tier no longer bundles AI credits; Cartesia's
  phone and SIP left beta. Where a vendor blocked automated reading (Devin 429,
  Tabnine 403, Tavily animates its price) the figure was removed rather than
  re-dated.
- **Audience layer finished:** role pills on detail pages with matching
  schema.org audience, role paths reachable from the command palette, shared
  audience weighted in getRelated, per-role reading orders in llms-full.txt,
  and 486 engineering items back-tagged onto /for/developers behind a 30-per-
  type cap so the page stays a curated entry point.
- **Content depth:** the 5 legacy roundups went from ~534 words to 1,228-1,375
  with tables, verdicts, how-to-choose steps and primary sources; all 81
  glossary terms missing a summary have one, restoring 100% coverage; the last
  16 items with an empty related array now link out. Continue, Ragas and
  Chonkie were exposed as stale by that pass and corrected.

## Deliberately not done
- `reviewed` was NOT backfilled from in-prose as-of dates. Of the 74 items with
  a parseable one, 72 already agree with `updated ?? date`, and the two that
  differ cite a source's date, so writing them would report those pages as
  staler than they are.
- Audience is not a search-index field: it would return 547 flat hits against a
  limit of 12 with nothing to rank them by.
- No new URLs, per the owner's call to favour depth until the checkpoint.

## Next
- The October Search Console checkpoint: per-role query families in
  docs/content-roadmap-phase3.md, plus the GA4 role_select event.
- 22 of 29 head-to-head comparison guides are still under 700 words. That is
  the obvious next depth pass.
- The glossary has no OpenAPI or REST term, which left one skill without a
  glossary link.
- 8 guides still warn on undated dollar figures. They are funding rounds rather
  than prices, so they warn by design, but dating them would clear the noise.

---

# Role paths Wave 2: designers + analysts + tag pass (2026-09-10) — SHIPPED

The audience program is complete. All five role paths are live, the hub stands
at 748 items, and the mirror and CLI bundle are in sync.

## Done (four commits on master)
- **Designers (31):** cornerstone pillar on Claude Design plus guides on Claude
  Code for designers, Figma-to-code through the Figma MCP server, Anthropic's
  design plugin, design-system upkeep, skills and plan choice; a tools roundup,
  an image-generator roundup, and Claude Design versus Figma Make. Tools
  figma-make, framer-ai, canva, midjourney, recraft, ideogram, relume, stitch.
  Five skills, two commands, a design-systems-librarian agent, five glossary
  terms. Uizard was deliberately skipped: no site activity since 2024.
- **Analysts (31):** cornerstone pillar mapping the four Claude surfaces, plus
  Claude for Excel, Claude Code against notebooks and warehouses, a read-only
  Postgres text-to-SQL setup, the data plugin, how to check an AI analysis,
  skills and plan choice; two roundups and a ChatGPT comparison. Tools julius,
  hex, databricks-genie, thoughtspot-spotter, deepnote, pandasai, vanna. Five
  skills, two commands, an analysis-reviewer agent, five glossary terms.
- **Tag pass:** 91 audience tags added to existing guides, tools, glossary
  terms, skills, commands and agents. Role paths now carry 61 items for
  developers, 71 founders, 72 marketers, 52 designers, 54 analysts.
- **Two adversarial fact-check passes** over all four clusters. Real errors
  caught: Surfer's AI tracker does not cover Claude; Copy.ai bundles seats per
  plan; Google's dedicated AI-search reports reached all sites Aug 31 2026, so
  the "aggregate only" line was stale; three Google quotes were not verbatim;
  Vanna's OSS repo was archived Mar 29 2026 and 2.0 replaced train() with agent
  memory; Databricks Genie and peers are consumption-billed; Claude's code
  sandbox has network on by default for Free/Pro/Max; Recraft's free tier grants
  no commercial use. Both plugin pillars had cited stale READMEs (the design
  folder has 7 skills, the data folder 10, neither has a commands directory).
- Mirror rebuilt and pushed (748 items / 256 installable). CLI bundle
  regenerated and verified; cli/README counts updated to 65/130/61.

## Blocked (owner action)
- **`agentscamp@0.8.0` is staged but NOT published.** Run `cd cli && npm publish`
  and complete the npm 2FA one-time password. The version bump, README counts and
  bundle are already committed; prepublishOnly regenerates and verifies.

## Next
- GSC checkpoint in 4 to 6 weeks: watch the per-role query families listed in
  docs/content-roadmap-phase3.md, plus the GA4 role_select event.
- Two vendor claims could not be machine-verified because the pages block
  automated reading (Midjourney's revenue threshold for asset ownership, Canva's
  output terms). Both are attributed to the vendor terms URL rather than stated
  flatly; a manual browser read would harden them.
- The tools freshness tier (open since June) matters more now: 180 tool pages
  carry pricing, and the new consumer-plan page is tier-1 monthly.

---

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

# Tier-1 freshness refresh (2026-09-01, unattended) — MERGED 2026-09-10

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
