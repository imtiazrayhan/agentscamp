import type { ManifestItem } from "./manifest";

/**
 * Tokenized AND match: every query word must hit somewhere (case-insensitive
 * substring), scored per token (exact slug/id 100, slug 50, title 30, topic
 * 20, description 10) and summed. 116 items — no index needed.
 */
export function searchItems(query: string, items: ManifestItem[]): ManifestItem[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: { item: ManifestItem; score: number }[] = [];
  for (const item of items) {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    const topics = item.topics.map((t) => t.toLowerCase());

    let total = 0;
    let allMatch = true;
    for (const token of tokens) {
      let s = 0;
      if (item.slug === token || item.id === token) s = 100;
      else if (item.slug.includes(token)) s = 50;
      else if (title.includes(token)) s = 30;
      else if (topics.some((t) => t.includes(token))) s = 20;
      else if (description.includes(token)) s = 10;
      if (s === 0) {
        allMatch = false;
        break;
      }
      total += s;
    }
    if (allMatch) scored.push({ item, score: total });
  }

  scored.sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
  return scored.map((s) => s.item);
}
