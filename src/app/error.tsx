"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        An unexpected error occurred. Try again, or head back home.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
