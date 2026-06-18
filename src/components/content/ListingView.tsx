"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ContentItem } from "@/lib/content/types";
import { ContentCard } from "./ContentCard";
import { ContentGrid } from "./ContentGrid";
import { EmptyState } from "./EmptyState";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pagination } from "./Pagination";
import { titleCaseLabel } from "@/lib/format";

// `items` should arrive in the order they will display (the server sorts them);
// the filter below preserves that order, and `pageSize` then paginates it.
export function ListingView({
  items,
  pageSize,
}: {
  items: ContentItem[];
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of items) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (cats.length && !cats.includes(i.category)) return false;
      if (!q) return true;
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, cats]);

  // Reset to the first page whenever the filtered set changes.
  useEffect(() => setPage(1), [query, cats]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
  const current = Math.min(page, totalPages);
  const visible = pageSize
    ? filtered.slice((current - 1) * pageSize, current * pageSize)
    : filtered;
  const rangeStart = filtered.length === 0 ? 0 : (current - 1) * (pageSize ?? 0) + 1;
  const rangeEnd = pageSize ? rangeStart + visible.length - 1 : filtered.length;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Filter list"
          />
        </div>
        {categories.length > 1 && (
          <ToggleGroup
            type="multiple"
            value={cats}
            onValueChange={setCats}
            aria-label="Filter by category"
          >
            {categories.map(([cat, count]) => (
              <ToggleGroupItem key={cat} value={cat}>
                {titleCaseLabel(cat)}
                <span className="ml-1.5 text-xs opacity-60">{count}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {pageSize && filtered.length
          ? `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} ${filtered.length === 1 ? "result" : "results"}`
          : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`}
      </p>

      {filtered.length ? (
        <>
          <ContentGrid>
            {visible.map((item) => (
              <ContentCard key={item.href} item={item} />
            ))}
          </ContentGrid>
          {totalPages > 1 && (
            <Pagination
              page={current}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                if (typeof window !== "undefined")
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="No matches"
          description="Try a different search term or clear the category filters."
        />
      )}
    </div>
  );
}
