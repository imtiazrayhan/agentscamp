"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { CardItem } from "@/lib/content/card";
import { ContentCard } from "./ContentCard";
import { ContentGrid } from "./ContentGrid";
import { EmptyState } from "./EmptyState";
import { Input } from "@/components/ui/input";
import { Pagination } from "./Pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type SortKey = "newest" | "title" | "reading-time";

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  title: "A–Z",
  "reading-time": "Quickest read",
};

function sortItems(items: CardItem[], sort: SortKey): CardItem[] {
  const out = [...items];
  switch (sort) {
    case "title":
      return out.sort((a, b) => a.title.localeCompare(b.title));
    case "reading-time":
      return out.sort(
        (a, b) =>
          (("readingTime" in a && a.readingTime) || 0) -
            (("readingTime" in b && b.readingTime) || 0) ||
          a.title.localeCompare(b.title),
      );
    case "newest":
    default:
      // Only 22 guides and 29 tools carry `updated`, so a separate "recently
      // updated" sort would be indistinguishable from this one.
      return out.sort(
        (a, b) =>
          (b.updated ?? b.date ?? "").localeCompare(a.updated ?? a.date ?? "") ||
          a.title.localeCompare(b.title),
      );
  }
}

/**
 * `items` arrive in the server's default order. Filter/sort/page state lives in
 * the URL so a view can be shared, bookmarked and restored.
 *
 * NOTE: this deliberately does NOT use `useSearchParams`. These listings are
 * statically prerendered with PPR off; `useSearchParams` forces a Suspense
 * boundary, and on a static route Next renders the *fallback* into the
 * prerendered HTML and defers the subtree to the client — which would strip
 * every ContentCard link out of guides.html. Reading `window.location.search`
 * and writing through the History API (which the App Router patches) keeps the
 * cards in the static HTML. Same approach as SearchResults.tsx.
 */
export function ListingView({
  items,
  pageSize = 24,
  sorts,
  defaultSort,
}: {
  items: CardItem[];
  pageSize?: number;
  sorts: SortKey[];
  defaultSort: SortKey;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [page, setPage] = useState(1);
  const hydrated = useRef(false);

  const readUrl = useCallback(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get("sort");
    setQuery(p.get("q") ?? "");
    setSort(s && sorts.includes(s as SortKey) ? (s as SortKey) : defaultSort);
    const n = Number(p.get("page"));
    setPage(Number.isFinite(n) && n > 0 ? n : 1);
  }, [sorts, defaultSort]);

  // State starts at the server defaults so the hydration render matches the
  // prerendered HTML exactly; URL params are applied one frame later.
  useEffect(() => {
    readUrl();
    hydrated.current = true;
    const onPop = () => readUrl();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [readUrl]);

  // Write state back to the URL. Typing replaces (so it can't spam history);
  // sort and page push (so Back undoes them).
  const lastQuery = useRef(query);
  useEffect(() => {
    if (!hydrated.current) return;
    const typing = lastQuery.current !== query;
    lastQuery.current = query;

    const write = () => {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (sort !== defaultSort) p.set("sort", sort);
      if (page > 1) p.set("page", String(page));
      const qs = p.toString();
      const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
      if (url === `${window.location.pathname}${window.location.search}`) return;
      if (typing) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    };

    if (!typing) return write();
    const t = setTimeout(write, 200);
    return () => clearTimeout(t);
  }, [query, sort, page, defaultSort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? items.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.tags.some((t) => t.toLowerCase().includes(q)),
        )
      : items;
    return sortItems(matched, sort);
  }, [items, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (current - 1) * pageSize + 1;
  const rangeEnd = rangeStart + visible.length - 1;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter by name, description or tag"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
            aria-label="Filter list"
          />
        </div>

        {sorts.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground sm:ml-auto">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(1);
              }}
              aria-label="Sort"
              className="h-10 rounded-md border border-input bg-card px-2 text-sm text-foreground"
            >
              {sorts.map((s) => (
                <option key={s} value={s}>
                  {SORT_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length
          ? `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} ${filtered.length === 1 ? "result" : "results"}`
          : "0 results"}
      </p>

      {filtered.length ? (
        <>
          <ContentGrid>
            {visible.map((item) => (
              <ContentCard key={item.href} item={item} showType={false} />
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
          title={`No matches for \u201C${query}\u201D`}
          description={`Nothing in this list matches that filter. Clear it to see all ${items.length}, or search the whole site.`}
          action={
            <>
              <Button
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
              >
                Clear filter
              </Button>
              <Button asChild variant="outline">
                <Link href={`/search?q=${encodeURIComponent(query)}`}>
                  Search everything
                </Link>
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
