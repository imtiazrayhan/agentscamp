"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "promo-dismissed-v1";

export function PromoBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(localStorage.getItem(KEY) !== "1");
  }, []);

  if (!show) return null;

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-center text-sm">
        <span>
          ✨ Level up your prompts with{" "}
          <a
            href="https://sureprompts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
          >
            SurePrompts
          </a>{" "}
          — curated prompts for every workflow.
        </span>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setShow(false);
          }}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
