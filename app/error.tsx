"use client";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div>
      <div className="bg-secondary text-secondary-foreground">
        <div className="pt-20 pb-10 px-4 text-center gap-6 flex flex-col items-center max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold mb-4">Oh Snap.</h1>
          <p className="text-2xl">Looks like something bad happened</p>
          {error.digest && (
            <p className="text-sm text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={() => unstable_retry()}
            className={buttonVariants({ size: "lg" })}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
