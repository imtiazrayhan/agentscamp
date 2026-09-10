"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavMenu } from "./NavMenu";
import type { NavItem } from "./nav-items";

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="ml-6 hidden items-center gap-1 md:flex">
      {items.map((item) =>
        item.children?.length ? (
          <NavMenu key={item.href} item={item} />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "page"
                : undefined
            }
            className={cn(
              "whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
