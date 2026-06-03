"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "./useSearch";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/content/EmptyState";
import { contentTypeList } from "@/lib/content/registry";
import { getAccentClasses, cn } from "@/lib/utils";

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  const { ready, search } = useSearch(true);
  const results = search(query, 50);

  const byType = contentTypeList
    .map((def) => ({ def, items: results.filter((r) => r.type === def.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across everything..."
          className="h-12 pl-10 text-base"
          aria-label="Search"
        />
      </div>

      {!query && (
        <p className="text-muted-foreground">
          {ready
            ? "Start typing to search agents, skills, guides, tools, and commands."
            : "Loading search index..."}
        </p>
      )}

      {query && results.length === 0 && (
        <EmptyState
          title={`No results for “${query}”`}
          description="Try a broader term, or browse the sections from the nav."
        />
      )}

      <div className="space-y-8" aria-live="polite">
        {byType.map(({ def, items }) => (
          <section key={def.id}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {def.label} ({items.length})
            </h2>
            <ul className="divide-y divide-border rounded-xl border border-border">
              {items.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary"
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        getAccentClasses(r.accent).bg,
                      )}
                    />
                    <span>
                      <span className="block font-medium">{r.title}</span>
                      <span className="block text-sm text-muted-foreground">
                        {r.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
