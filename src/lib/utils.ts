import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Accent, ContentTypeId } from "@/lib/content/types";

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
 * Restrained scheme: neutral surfaces + a single accent (coral). Content types
 * are distinguished by their icon, not by color. Kept as functions of type/accent
 * so call sites stay stable.
 */
const RESTRAINED: AccentClasses = {
  text: "text-foreground",
  bg: "bg-primary",
  softBg: "bg-secondary",
  border: "border-border",
  ring: "ring-ring",
  chip: "bg-secondary text-primary",
  accentBorder: "border-l-border",
};

export function getAccentClasses(_accent: Accent): AccentClasses {
  return RESTRAINED;
}

export function getColorClasses(_type: ContentTypeId): AccentClasses {
  return RESTRAINED;
}

const TYPE_ACCENT: Record<ContentTypeId, Accent> = {
  agent: "coral",
  skill: "turquoise",
  guide: "mint",
  tool: "amber",
  command: "violet",
  glossary: "sky",
};

export function accentForType(type: ContentTypeId): Accent {
  return TYPE_ACCENT[type];
}
