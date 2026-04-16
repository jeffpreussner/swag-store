import { fetchProducts } from "@/lib/products";
import { SearchParams } from "@/lib/types";
import { SearchPagination } from "@/components/ui/custom/search-pagination";

export async function ProductsPagination({
  searchParams,
  limit = 5,
  route = "/search",
}: {
  searchParams: Promise<SearchParams>;
  limit?: number;
  route?: string;
}) {
  const params = await searchParams;
  const productPromise = fetchProducts(false, { ...params, limit: limit });
  return (
    <SearchPagination
      productPromise={productPromise}
      searchParams={params}
      route={route}
    />
  );
}
