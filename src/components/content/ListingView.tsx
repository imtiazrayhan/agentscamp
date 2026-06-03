"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ContentItem } from "@/lib/content/types";
import { ContentCard } from "./ContentCard";
import { ContentGrid } from "./ContentGrid";
import { EmptyState } from "./EmptyState";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { titleCaseLabel } from "@/lib/format";

export function ListingView({ items }: { items: ContentItem[] }) {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<string[]>([]);

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
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      {filtered.length ? (
        <ContentGrid>
          {filtered.map((item) => (
            <ContentCard key={item.href} item={item} />
          ))}
        </ContentGrid>
      ) : (
        <EmptyState
          title="No matches"
          description="Try a different search term or clear the category filters."
        />
      )}
    </div>
  );
}
