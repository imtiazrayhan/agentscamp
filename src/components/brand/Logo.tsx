import { cn } from "@/lib/utils";

/**
 * Brand mark: a terminal prompt chevron `>` landing on the phosphor block cursor
 * `▍` — i.e. `>▍`, a literal command line. The block cursor is the heart of the
 * AgentsCamp identity (also the typing cursor in the Hero). `currentColor` lets
 * callers set the hue (use `text-primary`); the cursor can blink via the shared
 * `cursor-blink` keyframes for the live-terminal feel.
 *
 * The viewBox is cropped tight to the glyph so the mark optically matches
 * adjacent text when sized with `h-[1em]`. Pure geometry — no fonts, no chip —
 * so it sits inline anywhere. The chip/tile treatment lives in the favicon
 * (`src/app/icon.svg`) and the standalone lockup (`public/logo.svg`).
 */
export function LogoMark({
  className,
  blink = false,
}: {
  className?: string;
  blink?: boolean;
}) {
  return (
    <svg
      viewBox="4 6 22 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 8.5 L15.5 16 L7 23.5"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="19"
        y="8.5"
        width="6"
        height="15"
        rx="0.5"
        fill="currentColor"
        className={blink ? "cursor-blink" : undefined}
      />
    </svg>
  );
}

/** Mark + lowercase monospace wordmark — the horizontal lockup used in chrome. */
export function Logo({
  className,
  markClassName,
  blink = false,
}: {
  className?: string;
  markClassName?: string;
  blink?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-semibold",
        className,
      )}
    >
      <LogoMark
        className={cn("h-[1.05em] w-auto text-primary", markClassName)}
        blink={blink}
      />
      <span>agentscamp</span>
    </span>
  );
}
