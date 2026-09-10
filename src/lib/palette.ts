import type { Accent } from "@/lib/content/types";

/**
 * The handful of palette values that have to exist as literal hex because they
 * are consumed outside CSS — Satori, which renders the OG cards, has no CSS
 * variables.
 *
 * These MIRROR src/app/globals.css. They are not a second palette: every value
 * here is a step on a ramp declared there, and `npm run validate` fails the
 * build if the two drift. Before this file the OG generator kept its own
 * private accent map, so a palette change silently desynced a thousand social
 * cards from the site.
 *
 * OG cards are always dark, so these are the .dark aliases.
 */
export const OG_SURFACE = {
  /** --background */
  background: "#0c0a09",
  /** --card */
  card: "#1c1917",
  /** --border */
  border: "#44403c",
  /** --foreground */
  foreground: "#e7e5e4",
  /** --muted-foreground */
  mutedForeground: "#a8a29e",
  /** --input, the dimmest step still legible on the dark ground */
  faint: "#78716c",
} as const;

/** --type-<accent>-ink in dark mode: the step that reads on --background. */
export const OG_ACCENT_INK: Record<Accent, string> = {
  coral: "#fda4af",
  turquoise: "#5eead4",
  mint: "#86efac",
  amber: "#fcd34d",
  violet: "#c4b5fd",
  sky: "#7dd3fc",
};
