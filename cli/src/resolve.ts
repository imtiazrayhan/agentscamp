import type { ItemType, ManifestItem } from "./manifest";

export type Resolution =
  | { kind: "ok"; ref: string; item: ManifestItem }
  | { kind: "ambiguous"; ref: string; candidates: ManifestItem[] }
  | { kind: "not-found"; ref: string }
  | { kind: "bad-type"; ref: string; typeSeg: string };

const TYPE_ALIASES: Record<string, ItemType> = {
  agent: "agent",
  agents: "agent",
  skill: "skill",
  skills: "skill",
  command: "command",
  commands: "command",
};

export function normalizeType(seg: string): ItemType | null {
  return TYPE_ALIASES[seg] ?? null;
}

/**
 * "agents/x" | "agent/x" → that type's slug; bare "x" → unique match across
 * all types, ambiguous if several, not-found otherwise.
 */
export function resolveRef(rawRef: string, items: ManifestItem[]): Resolution {
  const ref = rawRef.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
  if (ref.includes("/")) {
    const [typeSeg, ...rest] = ref.split("/");
    const slug = rest.join("/");
    const type = normalizeType(typeSeg);
    if (!type) return { kind: "bad-type", ref: rawRef, typeSeg };
    const item = items.find((i) => i.type === type && i.slug === slug);
    return item ? { kind: "ok", ref: rawRef, item } : { kind: "not-found", ref: rawRef };
  }
  const candidates = items.filter((i) => i.slug === ref);
  if (candidates.length === 1) return { kind: "ok", ref: rawRef, item: candidates[0] };
  if (candidates.length > 1) return { kind: "ambiguous", ref: rawRef, candidates };
  return { kind: "not-found", ref: rawRef };
}
