---
name: "localization-readiness-auditor"
title: "Localization Readiness Auditor"
description: "Audit an application or feature for localization readiness across extracted messages, interpolation, pluralization, date and number formatting, layout expansion, right-to-left behavior, sorting, search, assets, metadata, and test coverage. Use before adding a locale, reviewing hard-coded UI text, or investigating a feature that breaks outside English."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["coding-languages", "review-qa"]
audience: ["developers"]
related: ["guide:best-claude-skills-for-frontend-development", "skill:accessibility-regression-auditor", "skill:test-scaffolder", "skill:architecture-diagram-generator", "agent:frontend-developer", "agent:mobile-developer"]
featured: true
summary: "Audits internationalization foundations before translation: message extraction and context, plural and select rules, locale-aware dates and numbers, Unicode input, text expansion, bidirectional layout, sorting and search, localized assets and metadata, fallback behavior, and pseudolocale coverage. It reports concrete blockers by user journey."
faq:
  - q: "What is the difference between internationalization and localization?"
    a: "Internationalization prepares software to support languages and regional conventions; localization supplies translated content and locale-specific assets or rules. This skill audits the technical readiness needed before localization succeeds."
  - q: "Why use a pseudolocale?"
    a: "A pseudolocale expands and decorates text while preserving automation, revealing hard-coded strings, clipping, concatenation, and layout assumptions before real translations are available."
---

Find assumptions that make a feature work only for one language or region. Report defects with file and line evidence; do not translate copy or rewrite components unless asked.

## Workflow

1. **Define target surfaces.** Identify platforms, routes, components, notifications, documents, emails, metadata, accessibility labels, server messages, and the locales or writing systems in scope. If no target locales are named, audit against three stress cases: a long-text language such as German, a right-to-left language such as Arabic, and a CJK language.

2. **Inventory user-facing text.** Find the i18n library first (search `package.json` or the equivalent manifest for `i18next`, `react-intl`, `formatjs`, `lingui`, `vue-i18n`, `gettext`, `fluent`) and learn its call pattern, then search for text that bypasses it:

   ```bash
   # JSX text nodes that are literal words
   grep -rnE ">[[:space:]]*[A-Z][a-z]+[^<{]*<" --include="*.tsx" --include="*.jsx" src
   # user-facing attributes with literal values
   grep -rnE "(placeholder|title|alt|aria-label|label)=\"[A-Za-z]" --include="*.tsx" --include="*.jsx" --include="*.vue" src
   # sentences built by concatenation or template fragments
   grep -rnE "(\+ *['\"] | ['\"] *\+)" --include="*.ts" --include="*.tsx" src
   ```

   Expect false positives; confirm each hit by reading it. Also check image text, backend-provided prose, error messages returned by APIs, and email templates. Note whether message keys are stable and whether translators get context (a description or screenshot reference).

3. **Check message grammar.** Verify interpolation, plural and select rules, grammatical variants where required, markup handling, escaping, and full-sentence translation. Flag every count-dependent string that branches on `count === 1`: English has two plural forms, while Arabic has six and Russian and Polish distinguish one, few, and many.

   ```text
   Unsafe:  count + " file" + (count === 1 ? "" : "s") + " selected"
   Safe:    {count, plural, one {# file selected} other {# files selected}}
   ```

   The second form is an ICU message. The translator supplies the categories their language needs, and word order stays inside one translatable unit. Apply the same test to any sentence assembled from fragments, such as `t("deleted") + " " + name`.

4. **Inspect locale-aware data.** Review date, time, timezone, calendar, number, currency, percentage, address, name, phone, unit, collation, and case conversion behavior. Search for calls that format with the machine default or a hard-coded pattern:

   - `toLocaleDateString()`, `toLocaleString()`, and `Intl.*` constructors called with no locale argument on the server, where the default is the host's locale and not the user's
   - date patterns such as `MM/DD/YYYY` or `strftime("%m/%d/%Y")`
   - `toFixed(2)` or string concatenation used to display money, and currency symbols typed as literals
   - `toUpperCase()` and `toLowerCase()` on user-visible text, and `sort()` with no comparator on names (use `Intl.Collator` or the platform equivalent)

   Storage should stay locale-neutral (UTC instants, ISO 4217 currency codes, minor units); formatting belongs at the presentation edge.

5. **Test input and text processing.** Exercise Unicode, composed and decomposed characters, non-Latin scripts, emoji, long names, input methods, normalization, validation, truncation, search, slugs, exports, and round trips. Look for name validators that allow only `[A-Za-z]`, length limits counted in bytes or UTF-16 units, truncation that can split a grapheme, and slug or search code that drops non-ASCII characters.

6. **Stress layout.** Use a lengthened pseudolocale and a narrow viewport to find fixed widths, clipping, overlapping controls, unsafe truncation, and text embedded in graphics. If the project has no pseudolocale, recommend one that pads strings by roughly 40% and wraps them in visible markers such as `[!! Šéţţîñĝš !!]`, so an untranslated string is obvious and a clipped one loses its closing marker. Treat short labels (buttons, tabs, table headers) as the highest risk, because short strings grow the most in proportion. Android's built-in `en-XA` and `ar-XB` pseudolocales do this for native apps.

7. **Inspect bidirectional behavior.** Check that `dir` is set on the root element from the locale, then search styles for physical properties that will not flip: `margin-left`, `padding-right`, `left:`, `text-align: left`, `float: right`, `border-left`. The fixes are logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`). Test mixed-direction text, directional icons (back arrows mirror; media-playback controls and brand marks do not), number and code isolation, focus order, gestures, and charts.

8. **Review loading and fallback.** Check locale detection, explicit user choice that persists, routing, bundle loading, fallback chains (`pt-BR` to `pt` to the default), missing-key telemetry, cache keys that vary by locale, server and client rendering the same locale, and localized SEO metadata including `lang` and `hreflang`.

9. **Define regression coverage.** Add or recommend a pseudolocale build, a CI check that fails on keys missing from the source catalog, tests for one representative locale per risk class from step 1, screenshots of critical layouts in the pseudolocale, and format assertions that pass an explicit locale so they do not depend on the CI machine's defaults.

> [!WARNING]
> Translating visible strings does not make a feature localized if dates, plural rules, layout, search, validation, or screen-reader labels still assume English.

## Output

Report the audited surfaces and locales, blockers by user journey, hard-coded and structurally unsafe messages, formatting and Unicode defects, layout and RTL findings, fallback gaps, test recommendations, and evidence locations. Separate product copy questions from technical defects.

Group findings by journey and rate each one: **blocker** (the journey cannot be completed or shows wrong data in a target locale), **major** (wrong or untranslatable text, broken layout), **minor** (cosmetic). Example (fictional):

```markdown
## Journey: checkout (audited for de, ar, ja)

| # | Rating | Finding | Evidence | Fix |
|---|---|---|---|---|
| 1 | blocker | Order total formatted with toFixed(2) and a literal "$" | src/checkout/Total.tsx:27 | Intl.NumberFormat(locale, { style: "currency", currency }) |
| 2 | major | Item count built by concatenation, English plural only | src/cart/Summary.tsx:14 | single ICU plural message |
| 3 | major | "Pay now" button has width: 96px; clips under pseudolocale | src/checkout/pay.css:8 | min-width plus padding |
| 4 | major | Step indicator uses margin-left and a hard-coded right arrow | src/checkout/Steps.tsx:40 | logical properties; mirror the icon in RTL |
| 5 | minor | Delivery date tested against "11/28/2026" | tests/checkout.test.ts:61 | assert with an explicit locale |

Coverage: static review of 14 files; pseudolocale run not performed (no pseudolocale configured).
Copy questions for product: does "Pay now" need a formal variant in German?
```
