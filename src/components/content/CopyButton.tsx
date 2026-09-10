"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text?: string;
  getText?: () => string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  className?: string;
  /** GA4 `copy` event label; defaults to the visible label. */
  eventLabel?: string;
}

export function CopyButton({
  text,
  getText,
  label = "Copy",
  copiedLabel = "Copied",
  iconOnly = false,
  className,
  eventLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const value = getText ? getText() : (text ?? "");
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      track("copy", { label: eventLabel ?? label });
      toast.success(copiedLabel);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? copiedLabel : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span aria-live="polite" className="contents">
        {copied ? (
          <Check className="size-3.5 text-success" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </span>
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </button>
  );
}
