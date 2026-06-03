"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchRecord } from "@/lib/content/types";

/**
 * Lazy client search over the static index. Fetches /search-index.json and
 * builds a FlexSearch index the first time `enabled` is true (so it loads only
 * on /search and when the command palette opens — not site-wide).
 */
export function useSearch(enabled: boolean) {
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const indexRef = useRef<any>(null);
  const recordsRef = useRef<SearchRecord[]>([]);

  useEffect(() => {
    if (!enabled || ready || indexRef.current) return;
    let active = true;
    (async () => {
      const [flex, res] = await Promise.all([
        import("flexsearch"),
        fetch("/search-index.json"),
      ]);
      const records: SearchRecord[] = await res.json();
      if (!active) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Document = (flex as any).default?.Document ?? (flex as any).Document;
      const index = new Document({
        tokenize: "forward",
        document: { id: "id", index: ["title", "description", "tags", "topics"] },
      });
      records.forEach((r, i) => index.add({ ...r, id: i }));
      recordsRef.current = records;
      indexRef.current = index;
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [enabled, ready]);

  const search = useCallback((q: string, limit = 12): SearchRecord[] => {
    if (!indexRef.current || !q.trim()) return [];
    const raw = indexRef.current.search(q, { limit });
    const ids = new Set<number>();
    for (const field of raw) for (const id of field.result) ids.add(id as number);
    return [...ids].slice(0, limit).map((i) => recordsRef.current[i]);
  }, []);

  return { ready, search };
}
