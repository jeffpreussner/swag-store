import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategories, fetchProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchFilters } from "@/components/ui/custom/search-filters";
import { SearchParams } from "@/lib/types";
import { SearchPagination } from "@/components/ui/custom/search-pagination";
import { ProductCard } from "@/components/ui/custom/product-card";

export const metadata: Metadata = {
  title: "Product Search",
  description:
    "Acme Swag Product Search page is the place to find the latest and greatest swaggy stuff!",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
        Search Products
      </h1>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div>
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <SearchFiltersLoader />
          </Suspense>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            <Suspense
              fallback={
                <>
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </>
              }
            >
              <Products searchParams={searchParams} />
            </Suspense>
          </div>
          <div className="text-center mt-10">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <ProductsPagination searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function SearchFiltersLoader() {
  const res = await fetchCategories();
  return <SearchFilters categories={res?.data || []} />;
}

async function ProductsPagination({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const productPromise = fetchProducts(false, { ...params, limit: 5 });
  return (
    <SearchPagination productPromise={productPromise} searchParams={params} />
  );
}

async function Products({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const response = await fetchProducts(false, { ...params, limit: 5 });
  if (!response?.data?.length)
    return (
      <p className="text-center text-lg mx-auto col-span-3" aria-live="polite">
        No products found.
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
