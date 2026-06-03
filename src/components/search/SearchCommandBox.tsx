"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "./SearchProvider";
import { cn } from "@/lib/utils";

/**
 * The prominent terminal-styled `$ search N resources` box used in the Hero and
 * Footer. It opens the global ⌘K command palette (no dedicated search page).
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
      aria-label={`Search ${total} resources`}
      className={cn(
        "group flex w-full max-w-md items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/60",
        className,
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="text-primary" aria-hidden>
        $
      </span>
      <span className="flex-1 text-left">
        search <span className="text-foreground">{total}</span> resources
      </span>
      <kbd className="hidden rounded-sm border border-border bg-muted px-1.5 text-[11px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
