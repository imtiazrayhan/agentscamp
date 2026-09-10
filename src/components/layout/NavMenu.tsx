"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";

/**
 * Hover/focus disclosure for a nav group.
 *
 * Deliberately NOT a Radix DropdownMenu: that portals its content and renders
 * nothing until opened, so every link inside would be absent from the server
 * HTML. On a site whose traffic is organic search, site-wide internal links must
 * stay in the markup. Here the <ul> is always rendered and merely hidden, and
 * `group-focus-within` gives keyboard users tab-through for free.
 *
 * The trigger is itself a real link to a hub page, so touch devices (no hover)
 * always have somewhere to land.
 */
export function NavMenu({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`) ||
    (item.children ?? []).some(
      (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
    );

  return (
    <div className="group relative">
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {item.label}
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>

      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-[opacity,visibility] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="w-72 rounded-lg border border-border bg-popover p-1.5 shadow-overlay">
          {item.children?.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="block rounded-md px-3 py-2 transition-colors hover:bg-secondary"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">{c.label}</span>
                  {c.count !== undefined && (
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {c.count.toLocaleString()}
                    </span>
                  )}
                </span>
                {c.description && (
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                    {c.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
