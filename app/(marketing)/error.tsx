"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/ui/custom/back-button";

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
          {error.message && <p className="text-red-500">{error.message}</p>}
          <button
            onClick={() => unstable_retry()}
            className={buttonVariants({ size: "lg" })}
          >
            Try Again
          </button>

          <Link className={buttonVariants({ size: "lg" })} href="/products">
            Browse Products
          </Link>
        </div>
      </div>
      <Suspense
        fallback={
          <>
            <Skeleton className="h-10 w-full rounded-full" />
          </>
        }
      >
        <BackButton />
      </Suspense>
    </div>
  );
}
