import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back home
      </Link>
    </div>
  );
}
