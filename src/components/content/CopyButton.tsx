"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface CopyButtonProps {
  text?: string;
  getText?: () => string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  /**
   * `chip` is the small bordered control used beside code and share links.
   * `primary` is a real Button — the install action on an agent, skill or
   * command page is the most important thing on that page, and it used to
   * render as 12px muted text next to an actual outline button.
   */
  variant?: "chip" | "primary";
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
  variant = "chip",
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
        variant === "primary"
          ? buttonVariants()
          : "inline-flex items-center gap-1.5 rounded-md border border-input bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary",
        className,
      )}
    >
      <span aria-live="polite" className="contents">
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </span>
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </button>
  );
}
