import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/products";
import { Product } from "@/lib/types";

async function getProductPages() {
  const allProducts: Product[] = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const d = await fetchProducts(false, { page });

    if (!d?.data) break;
    allProducts.push(...d.data);
    hasNextPage = d.meta.pagination.hasNextPage;
    page++;
  }

  return (
    allProducts.map((product: Product) => ({
      url: `${process.env.BASE_URL}/products/${product.slug}`,
      lastModified: product.createdAt,
      changeFrequency: "weekly" as const,
      images: product.images,
      priority: 0.5,
    })) || []
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${process.env.BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${process.env.BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${process.env.BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...(await getProductPages()),
  ];
}
