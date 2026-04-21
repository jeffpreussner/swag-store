import type { MetadataRoute } from "next";
import { fetchAllProducts } from "@/lib/products";
import { Product } from "@/lib/types";
const baseUrl = process.env.BASE_URL || "https://localhost:3000";

async function getProductPages() {
  const allProducts: Product[] = await fetchAllProducts();

  return (
    allProducts.map((product: Product) => ({
      url: `${baseUrl}/products/${product.slug}`,
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
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...(await getProductPages()),
  ];
}
