"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLinks({ links }: { links: { label: string; href: string }[] }) {
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
              "rounded-sm px-2.5 py-1.5 font-mono text-sm lowercase transition-colors hover:bg-secondary hover:text-foreground",
              active ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
