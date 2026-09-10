"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-lg text-muted-foreground">
        An unexpected error occurred. Try again, or head back home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button type="button" size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
