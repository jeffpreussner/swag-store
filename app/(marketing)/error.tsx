"use client";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { fetchFeaturedProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { BackButton } from "@/components/ui/custom/back-button";
export const metadata: Metadata = {
  title: "Acme Swag - Home",
  description:
    "Acme Swag Homepage is the place to find the latest and greatest swaggy stuff!",
  openGraph: {
    title: "Acme Swag - Home",
    description: "Your one-stop shop for all swaggy stuff!",
  },
};

export default function MarketingPage() {
  return (
    <div>
      <div className="bg-secondary text-secondary-foreground">
        <div className="pt-20 pb-10 px-4 text-center gap-6 flex flex-col items-center max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold mb-4">Oh Snap.</h1>
          <p className="text-2xl">Looks like something bad happened</p>
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
