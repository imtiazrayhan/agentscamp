"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "./SearchProvider";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const { open } = useCommandPalette();

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search"
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Search className="size-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 font-mono text-[11px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
