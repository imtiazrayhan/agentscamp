"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLink {
  label: string;
  href: string;
  /** Show in the desktop bar only from the lg breakpoint (space is tight at md). */
  lgOnly?: boolean;
}

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="ml-4 hidden items-center gap-0.5 md:flex">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-sm px-2.5 py-1.5 font-mono text-sm lowercase transition-colors hover:bg-secondary hover:text-foreground",
              active ? "bg-secondary text-foreground" : "text-muted-foreground",
              l.lgOnly && "hidden lg:inline-block",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
