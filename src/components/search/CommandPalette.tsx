"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useSearch } from "./useSearch";
import { contentTypeList } from "@/lib/content/registry";
import { getAccentClasses, cn } from "@/lib/utils";
import type { SearchRecord } from "@/lib/content/types";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { ready, search } = useSearch(open);
  const results = search(query);

  function go(href: string) {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  }

  const byType = contentTypeList
    .map((def) => ({ def, items: results.filter((r) => r.type === def.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search AgentsCamp"
      shouldFilter={false}
      className="fixed left-1/2 top-[15%] z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
    >
      <div className="border-b border-border px-3">
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search agents, skills, guides, tools, commands..."
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto p-2">
        {!query && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {ready ? "Type to search across everything." : "Loading index..."}
          </p>
        )}
        {query && results.length === 0 && (
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
            No results for “{query}”.
          </Command.Empty>
        )}
        {byType.map(({ def, items }) => (
          <Command.Group
            key={def.id}
            heading={def.label}
            className="px-1 py-1 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
          >
            {items.map((r: SearchRecord) => (
              <Command.Item
                key={r.href}
                value={r.href}
                onSelect={() => go(r.href)}
                className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm text-foreground data-[selected=true]:bg-secondary"
              >
                <span
                  className={cn(
                    "mt-1 size-2 shrink-0 rounded-full",
                    getAccentClasses(r.accent).bg,
                  )}
                />
                <span className="min-w-0">
                  <span className="block font-medium">{r.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {r.description}
                  </span>
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
