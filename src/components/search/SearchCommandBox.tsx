"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "./SearchProvider";
import { cn } from "@/lib/utils";

/**
 * The homepage's primary call to action — a real-looking search field that opens
 * the global ⌘K palette. Search is the fastest way into 748 items, so it leads
 * the hero rather than a generic "browse" button.
 *
 * It is the only element on the page with elevation, which is what makes it
 * read as first among the things a visitor can act on. Everything around it in
 * the hero is deliberately flat and, below the h1, muted.
 */
export function SearchCommandBox({
  total,
  className,
}: {
  total: number;
  className?: string;
}) {
  const { open } = useCommandPalette();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Search ${total} guides, tools and terms`}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "flex h-14 w-full max-w-2xl items-center gap-3 rounded-lg border border-input bg-card px-6 text-left text-lg text-muted-foreground shadow-raised transition-colors hover:border-border-strong",
        className,
      )}
    >
      <Search className="size-5 shrink-0 text-primary" aria-hidden />
      <span className="flex-1 truncate">
        Search {total.toLocaleString()} guides, tools and terms
      </span>
      <kbd className="hidden shrink-0 rounded-md bg-secondary px-1.5 py-0.5 font-mono text-xs sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
