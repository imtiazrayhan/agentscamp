/**
 * Two heading styles, and structure picks which — not taste, and not the
 * heading level.
 *
 *   sectionHeading  an <h2> naming a top-level REGION of the page
 *   label           anything naming a BOX or a LIST
 *
 * A label is a <p> unless it is the accessible name of a <nav> or a region, in
 * which case it stays an <h2> and only borrows the style. That distinction is
 * why `Eyebrow` takes an `as` prop.
 *
 * This replaces 11 distinct h2 strings — text-2xl/xl/lg crossed with
 * bold/semibold, with and without tracking — and resolves two unrelated heading
 * systems that were both being used as section titles on the same page.
 */
export const sectionHeading = "text-2xl font-bold tracking-tight";

export const label =
  "text-xs font-semibold uppercase tracking-wide text-muted-foreground";
