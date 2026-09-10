import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Accent, ContentTypeId } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AccentClasses {
  text: string;
  bg: string;
  softBg: string;
  border: string;
  ring: string;
  chip: string;
  accentBorder: string;
}

/**
 * Per-type accents, matching the hues the OG social cards already stamp on every
 * item (see lib/seo/og.tsx). `-ink` shades are the AA-contrast text variants;
 * the bright token is for fills, borders and rules.
 *
 * Every class here is a STATIC literal — Tailwind v4 scans source text, so these
 * can never be built by interpolation.
 */
const ACCENTS: Record<Accent, AccentClasses> = {
  coral: {
    text: "text-type-coral-ink",
    bg: "bg-type-coral",
    softBg: "bg-type-coral/10",
    border: "border-type-coral/30",
    ring: "ring-type-coral",
    chip: "bg-type-coral/10 text-type-coral-ink",
    accentBorder: "border-l-type-coral",
  },
  turquoise: {
    text: "text-type-turquoise-ink",
    bg: "bg-type-turquoise",
    softBg: "bg-type-turquoise/10",
    border: "border-type-turquoise/30",
    ring: "ring-type-turquoise",
    chip: "bg-type-turquoise/10 text-type-turquoise-ink",
    accentBorder: "border-l-type-turquoise",
  },
  mint: {
    text: "text-type-mint-ink",
    bg: "bg-type-mint",
    softBg: "bg-type-mint/10",
    border: "border-type-mint/30",
    ring: "ring-type-mint",
    chip: "bg-type-mint/10 text-type-mint-ink",
    accentBorder: "border-l-type-mint",
  },
  amber: {
    text: "text-type-amber-ink",
    bg: "bg-type-amber",
    softBg: "bg-type-amber/10",
    border: "border-type-amber/30",
    ring: "ring-type-amber",
    chip: "bg-type-amber/10 text-type-amber-ink",
    accentBorder: "border-l-type-amber",
  },
  violet: {
    text: "text-type-violet-ink",
    bg: "bg-type-violet",
    softBg: "bg-type-violet/10",
    border: "border-type-violet/30",
    ring: "ring-type-violet",
    chip: "bg-type-violet/10 text-type-violet-ink",
    accentBorder: "border-l-type-violet",
  },
  sky: {
    text: "text-type-sky-ink",
    bg: "bg-type-sky",
    softBg: "bg-type-sky/10",
    border: "border-type-sky/30",
    ring: "ring-type-sky",
    chip: "bg-type-sky/10 text-type-sky-ink",
    accentBorder: "border-l-type-sky",
  },
};

export function getColorClasses(type: ContentTypeId): AccentClasses {
  return ACCENTS[contentTypes[type].accent];
}
