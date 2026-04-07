import { LoadMoreButton } from "@/components/ui/custom/load-more-button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Acme Swag Products page is the place to find the latest and greatest swaggy stuff!",
};

export default async function ProductPage() {
  const featuredPromise = fetchProducts(false);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
        Products
      </h1>
      <p className="text-center text-lg mb-10">
        Browse our collection of the latest and greatest swaggy stuff!
      </p>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            {/* broke out FeaturedProducts into its own component so we can suspense it */}
            <Suspense
              fallback={
                <>
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </>
              }
            >
              <Products featuredPromise={featuredPromise} />
            </Suspense>
          </div>
          <div className="text-center mt-10">
            <LoadMoreButton />
          </div>
        </div>
      </div>
    </div>
  );
}

async function Products({
  featuredPromise,
}: {
  featuredPromise: ReturnType<typeof fetchProducts>;
}) {
  const response = await featuredPromise;
  if (!response?.data?.length)
    return (
      <p className="text-center text-lg mx-auto col-span-3">
        No featured products found. Sorry all sold out ¯\_(ツ)_/¯
      </p>
    );
  return (
    <>
      {response?.data?.map((product: Product) => (
        <Link
          href={`/products/${product.slug}`}
          key={product.id}
          className="border p-4 rounded-lg"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            quality={75}
            className="mx-auto"
          />
          <h3 className="text-xl font-bold mt-4">{product.name}</h3>
          <p className="mt-2">{product.description}</p>
          <p className="mt-2 font-semibold">
            ${product.price.toLocaleString()}
          </p>
        </Link>
      ))}
    </>
  );
}
