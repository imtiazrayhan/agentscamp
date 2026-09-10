import Link from "next/link";
import { PromoDismiss } from "./PromoDismiss";

/**
 * Server-rendered so it occupies its final height in the very first paint.
 *
 * Previously this was a client component whose `show` state started false and
 * was set in an effect, so the bar was absent on first paint and then popped in,
 * pushing the whole document down — an unbounded layout shift on every route.
 * Dismissal is now applied before paint by the inline script in layout.tsx,
 * which stamps `data-promo="off"` on <html>; the CSS rule in globals.css hides
 * the bar with no shift.
 */
export function PromoBar() {
  return (
    <div className="promo-bar relative bg-secondary">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-center text-sm text-muted-foreground">
        <span>
          Level up your prompts with{" "}
          <Link
            href="https://sureprompts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2"
          >
            SurePrompts
          </Link>{" "}
          — curated prompts for every workflow.
        </span>
        <PromoDismiss />
      </div>
    </div>
  );
}
