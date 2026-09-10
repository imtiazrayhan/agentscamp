"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "./SearchProvider";
import { cn } from "@/lib/utils";

/**
 * The homepage's primary call to action — a real-looking search field that opens
 * the global ⌘K palette. Search is the fastest way into 748 items, so it leads
 * the hero rather than a generic "browse" button.
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
        "flex h-12 w-full max-w-xl items-center gap-3 rounded-lg border border-input bg-card px-4 text-left text-[15px] text-muted-foreground shadow-sm transition-colors hover:border-foreground/30",
        className,
      )}
    >
      <Search className="size-[18px] shrink-0" aria-hidden />
      <span className="flex-1 truncate">
        Search {total.toLocaleString()} guides, tools and terms
      </span>
      <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
