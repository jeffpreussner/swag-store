import { ProductCard } from "@/components/ui/custom/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/products";
import { Product, SearchParams } from "@/lib/types";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPagination } from "@/components/ui/custom/products-pagination";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Acme Swag Products page is the place to find the latest and greatest swaggy stuff!",
};

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const productPromise = fetchProducts(false);

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
              <Products productPromise={productPromise} />
            </Suspense>
          </div>
          <div className="text-center mt-10">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <ProductsPagination
                searchParams={searchParams}
                limit={20}
                route="/products"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function Products({
  productPromise,
}: {
  productPromise: ReturnType<typeof fetchProducts>;
}) {
  const response = await productPromise;
  if (!response?.data?.length)
    return (
      <p className="text-center text-lg mx-auto col-span-3">
        No products found. Sorry all sold out ¯\_(ツ)_/¯
      </p>
    );
  return (
    <>
      {response?.data?.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
