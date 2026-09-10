import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-5xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-lg text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild size="lg">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/guides">Browse the guides</Link>
        </Button>
      </div>
    </div>
  );
}
