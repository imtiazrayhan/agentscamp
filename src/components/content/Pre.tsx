"use client";

import { useRef } from "react";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

export function Pre({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  return (
    <div className="group relative my-4">
      <CopyButton
        iconOnly
        getText={() => ref.current?.textContent ?? ""}
        className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      />
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm leading-relaxed",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
