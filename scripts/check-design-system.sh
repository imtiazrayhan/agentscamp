#!/usr/bin/env bash
# Design-system gates. Each rule the redesign established, expressed as a grep
# that must not regress. Allowances are explicit and each one has a reason —
# an unexplained allowance is how a rule quietly stops being a rule.
set -uo pipefail
cd "$(dirname "$0")/.."
fail=0

gate() { # label, pattern, allowed, reason-for-allowance
  hits=$(grep -rEn "$2" src --include='*.tsx' --include='*.ts' 2>/dev/null \
         | grep -vE '^[^:]+:[0-9]+: *(\*|//|/\*)' || true)
  c=$(printf '%s' "$hits" | grep -c . || true)
  if [ "$c" -le "$3" ]; then
    printf '  ok   %-34s %s/%s %s\n' "$1" "$c" "$3" "${4:-}"
  else
    printf '  FAIL %-34s %s/%s\n' "$1" "$c" "$3"
    printf '%s\n' "$hits" | head -8 | sed 's/^/         /'
    fail=1
  fi
}

echo "Design-system gates"

# --- colour: no shade is ever derived with an opacity -----------------------
# `disabled:opacity-*` is excluded by the pattern: dimming a disabled control is
# a state, not a shade, and the book prescribes exactly that.
# 1 allowed: the sticky nav is backdrop-blurred over content it cannot predict,
# which is the one case the palette rule calls legal.
gate "no grey opacity"      '(^|[^:])\b(text|bg|border)-(foreground|muted-foreground|card|secondary|background)/[0-9]' 1 '(blurred nav)'
gate "no brand opacity"     '(^|[^:])\b(bg|border|text|ring)-primary/[0-9]' 0
gate "no accent opacity"    'type-[a-z]+(-ink|-soft)?/[0-9]' 0
gate "no bare colour alpha" '(bg|text|border)-(black|white)/[0-9]' 2 '(2 scrims)'

# --- type: nine steps, none of them arbitrary -------------------------------
gate "no bracket type sizes" 'text-\[[0-9]+px\]' 0

# --- surfaces: two radii, three shadow tokens -------------------------------
gate "no dead radii"        'rounded-(sm|xl)\b' 0
gate "no ad-hoc shadows"    'shadow-(sm|md|lg|xl|2xl)\b' 0

# --- spacing: on the scale --------------------------------------------------
# 4 8 12 16 24 32 48 64 96px, i.e. Tailwind 1 2 3 4 6 8 12 16 24. 2 allowed:
# pl-9 positions an icon inside an input and h-14 is a control height, neither
# of which is rhythm.
# gap-1.5 is on the scale for inline icon+label runs; these are the values that
# are not on it at all.
gate "no off-scale gaps"    'gap-(0\.5|2\.5|3\.5|4\.5|5|7|9|10|11|13|14|15)\b' 0
gate "spacing on the scale" '\b(m|p)(t|b|l|r|x|y)?-(5|7|9|10|11|13|14|15|18|20)\b' 1 '(pl-9 icon offset)'

# --- focus: one style, from the global :focus-visible ------------------------
# 2 allowed: ContentCard proxies focus to its card ring because the stretched
# link has zero height, and <main> is a programmatic skip-link target.
gate "no focus suppression" 'focus(-visible)?:outline-none' 2 '(stretched link, skip target)'

# --- reading measure: one width ---------------------------------------------
# 3 allowed: the palette dialog and the two search fields are control widths,
# not reading measures.
gate "one reading measure"  'max-w-(2xl|3xl)|max-w-\[[0-9]+ch\]' 4 '(dialog, 2 search fields, hero h1)'

echo
if [ "$fail" = 0 ]; then echo "All design-system gates pass."; else echo "Design-system gates FAILED."; fi
exit $fail
