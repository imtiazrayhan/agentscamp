"use client";

import { X } from "lucide-react";

const KEY = "promo-dismissed-v1";

/** The only interactive part of the promo bar, so the bar itself stays server-rendered. */
export function PromoDismiss() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.setItem(KEY, "1");
        } catch {
          /* private mode — dismissal just won't persist */
        }
        document.documentElement.dataset.promo = "off";
      }}
      aria-label="Dismiss announcement"
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
    >
      <X className="size-4" />
    </button>
  );
}
