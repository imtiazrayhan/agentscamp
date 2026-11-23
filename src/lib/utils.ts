import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Accent, ContentTypeId } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { site } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AccentClasses {
  /** -ink shade: AA on --card, on --background and on its own -soft. */
  text: string;
  /** -soft fill + -ink text, for the square icon tiles. */
  chip: string;
}

/**
 * Per-type accents, matching the hues the OG social cards already stamp on every
 * item (see lib/seo/og.tsx).
 *
 * Two fields, because two is all anything consumes. The map used to carry seven
 * — bg, softBg, border, ring and accentBorder were referenced by nothing, and
 * three of them derived their shade with an opacity, which is exactly what the
 * palette rewrite removed.
 *
 * Every class here is a STATIC literal — Tailwind v4 scans source text, so these
 * can never be built by interpolation.
 */
const ACCENTS: Record<Accent, AccentClasses> = {
  coral: {
    text: "text-type-coral-ink",
    chip: "bg-type-coral-soft text-type-coral-ink",
  },
  turquoise: {
    text: "text-type-turquoise-ink",
    chip: "bg-type-turquoise-soft text-type-turquoise-ink",
  },
  mint: {
    text: "text-type-mint-ink",
    chip: "bg-type-mint-soft text-type-mint-ink",
  },
  amber: {
    text: "text-type-amber-ink",
    chip: "bg-type-amber-soft text-type-amber-ink",
  },
  violet: {
    text: "text-type-violet-ink",
    chip: "bg-type-violet-soft text-type-violet-ink",
  },
  sky: {
    text: "text-type-sky-ink",
    chip: "bg-type-sky-soft text-type-sky-ink",
  },
};

export function getColorClasses(type: ContentTypeId): AccentClasses {
  return ACCENTS[contentTypes[type].accent];
}

const INTERNAL_HOST = new URL(site.url).hostname;

/** Off-site? Handles protocol-relative `//host`; mailto:/tel:/#hash/relative are not links out. */
export function isExternalHref(href: string): boolean {
  if (!/^(https?:)?\/\//i.test(href)) return false;
  try {
    return new URL(href, site.url).hostname !== INTERNAL_HOST;
  } catch {
    return false;
  }
}

/**
 * Attributes for an anchor whose href may leave the site. Returns {} for internal
 * hrefs, so call sites can spread unconditionally.
 *
 * Default is nofollow — a link we render but do not vouch for (directory listings,
 * promos, share intents). Pass { vouch: true } for links the site stands behind:
 * cited primary sources, in-body editorial links, our own identity profiles.
 */
export function externalLinkProps(href: string, opts?: { vouch?: boolean }) {
  if (!isExternalHref(href)) return {};
  return {
    target: "_blank" as const,
    rel: opts?.vouch ? "noopener noreferrer" : "noopener noreferrer nofollow",
  };
}
