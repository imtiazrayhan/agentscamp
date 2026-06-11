"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useSearch } from "./useSearch";
import { contentTypes } from "@/lib/content/registry";

/**
 * Client results for the /search page. Reads ?q= (the WebSite SearchAction
 * target) and runs the same FlexSearch index the command palette uses, so the
 * URL form of search stays in lockstep with ⌘K.
 */
export function SearchResults() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const { ready, search } = useSearch(true);

  useEffect(() => setQ(initial), [initial]);

  const results = useMemo(
    () => (ready ? search(q, 30) : []),
    [ready, search, q],
  );

  const onChange = (value: string) => {
    setQ(value);
    const url = value ? `/search?q=${encodeURIComponent(value)}` : "/search";
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      <label className="group flex w-full max-w-xl items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-sm focus-within:border-primary/60">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="text-primary" aria-hidden>
          $
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder="search agents, skills, guides, tools, commands…"
          aria-label="Search AgentsCamp"
          autoFocus
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-6">
        {!ready && q && (
          <p className="font-mono text-sm text-muted-foreground">loading index…</p>
        )}
        {ready && q && results.length === 0 && (
          <p className="font-mono text-sm text-muted-foreground">
            no results for &ldquo;{q}&rdquo;
          </p>
        )}
        <ul className="divide-y divide-border">
          {results.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="group flex items-baseline gap-3 py-3"
              >
                <span className="w-20 shrink-0 rounded-sm border border-border bg-muted px-1.5 py-0.5 text-center font-mono text-[11px] text-muted-foreground">
                  {contentTypes[r.type].singular}
                </span>
                <span>
                  <span className="block font-semibold group-hover:text-primary">
                    {r.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                    {r.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
