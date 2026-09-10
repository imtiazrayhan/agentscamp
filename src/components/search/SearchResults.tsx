"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useSearch } from "./useSearch";
import { contentTypes } from "@/lib/content/registry";
import { ContentGrid } from "@/components/content/ContentGrid";
import { EmptyState } from "@/components/content/EmptyState";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

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
      {/* The `$` prompt glyph that used to sit inside this field went with the
          terminal theme; it read as stray content beside a real search input. */}
      <label className="group flex h-12 w-full max-w-2xl items-center gap-3 rounded-lg border border-input bg-card px-4 text-base shadow-raised focus-within:border-border-strong">
        <Search className="size-5 shrink-0 text-primary" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search guides, tools, glossary, agents, skills, commands…"
          aria-label="Search AgentsCamp"
          autoFocus
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-8">
        {!ready && q && (
          <p className="text-sm text-muted-foreground">Loading index…</p>
        )}
        {ready && q && results.length === 0 && (
          <EmptyState
            title={`No results for \u201C${q}\u201D`}
            description="Try fewer or more general words. Every guide, tool, glossary term, agent, skill and command is indexed."
            action={
              <>
                <Button asChild>
                  <Link href="/guides">Browse the guides</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/topics">Browse by topic</Link>
                </Button>
              </>
            }
          />
        )}
        {/* Every other listing on the site is a card grid; this was the only
            divide-y list, another survivor of the terminal theme. */}
        <ContentGrid>
          {results.map((r) => {
            const def = contentTypes[r.type];
            const Icon = def.icon;
            return (
              <Panel key={r.href} variant="interactive" padding="sm" asChild>
                <Link href={r.href} className="group flex flex-col">
                  <Eyebrow as="div" className="mb-3 flex items-center gap-1.5">
                    <Icon className="size-3.5" />
                    {def.singular}
                  </Eyebrow>
                  <span className="font-semibold leading-snug tracking-tight group-hover:text-primary">
                    {r.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {r.description}
                  </span>
                </Link>
              </Panel>
            );
          })}
        </ContentGrid>
      </div>
    </div>
  );
}
