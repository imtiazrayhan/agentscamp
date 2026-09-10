"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCommandPalette } from "@/components/search/SearchProvider";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const palette = useCommandPalette();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        >
          <Menu className="size-4" />
        </button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetTitle>Menu</SheetTitle>

        {/* On mobile the header search collapses to an icon and is easy to miss. */}
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            palette.open();
          }}
          className="flex w-full items-center gap-2 rounded-md border border-input px-3 py-2 text-sm text-muted-foreground"
        >
          <Search className="size-4" />
          Search everything
        </button>

        <nav className="flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.href}>
              <SheetClose asChild>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block text-sm font-semibold",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
              {item.children?.length ? (
                <ul className="mt-2 space-y-1 border-l border-border pl-3">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <SheetClose asChild>
                        <Link
                          href={c.href}
                          aria-current={isActive(c.href) ? "page" : undefined}
                          className={cn(
                            "flex items-baseline justify-between gap-3 py-1 text-sm transition-colors hover:text-foreground",
                            isActive(c.href)
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <span>{c.label}</span>
                          {c.count !== undefined && (
                            <span className="text-xs tabular-nums text-muted-foreground">
                              {c.count.toLocaleString()}
                            </span>
                          )}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="mt-auto flex gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <SheetClose asChild>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/how-to-use" className="hover:text-foreground">
              How to use
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
