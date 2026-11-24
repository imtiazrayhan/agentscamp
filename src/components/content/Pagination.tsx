"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Builds a compact page window: always shows first & last, the current page
 * with a neighbour either side, and "…" gaps. e.g. 1 … 4 5 6 … 13
 */
function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7)
    return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push("…");
  for (let p = start; p <= end; p++) out.push(p);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

/**
 * With `hrefFor`, every control is a real link (crawlable, path-based pages);
 * without it, buttons call `onPageChange` (client paging of filtered results).
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hrefFor?: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);
  // Disabled prev/next stay buttons: a disabled link is not a thing.
  const buttonProps = (p: number, disabled = false) =>
    hrefFor && !disabled
      ? { asChild: true as const }
      : { onClick: () => onPageChange(p), disabled };
  const inner = (p: number, children: ReactNode, disabled = false) =>
    hrefFor && !disabled ? <Link href={hrefFor(p)}>{children}</Link> : children;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-1"
    >
      <Button
        variant="outline"
        size="sm"
        {...buttonProps(page - 1, page <= 1)}
        aria-label="Previous page"
      >
        {inner(
          page - 1,
          <>
            <ChevronLeft />
            <span className="sr-only sm:not-sr-only">Previous</span>
          </>,
          page <= 1,
        )}
      </Button>

      <ul className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <li
              key={`gap-${i}`}
              className="px-2 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              …
            </li>
          ) : (
            <li key={p}>
              <Button
                variant={p === page ? "default" : "ghost"}
                size="icon"
                className={cn("size-9", p === page && "pointer-events-none")}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                {...buttonProps(p)}
              >
                {inner(p, p)}
              </Button>
            </li>
          ),
        )}
      </ul>

      <Button
        variant="outline"
        size="sm"
        {...buttonProps(page + 1, page >= totalPages)}
        aria-label="Next page"
      >
        {inner(
          page + 1,
          <>
            <span className="sr-only sm:not-sr-only">Next</span>
            <ChevronRight />
          </>,
          page >= totalPages,
        )}
      </Button>
    </nav>
  );
}
