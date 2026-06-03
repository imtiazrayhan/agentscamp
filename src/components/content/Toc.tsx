"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-2 font-semibold">On this page</p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((i) => (
          <li key={i.id} style={{ paddingLeft: i.depth === 3 ? 16 : 0 }}>
            <a
              href={`#${i.id}`}
              className={cn(
                "-ml-px block border-l-2 border-transparent pl-3 text-muted-foreground transition-colors hover:text-foreground",
                active === i.id && "border-primary font-medium text-foreground",
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
