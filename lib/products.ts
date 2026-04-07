import { cacheTag, cacheLife } from "next/cache";
import {
  FeaturedProductData,
  ProductResponse,
  ProductStock,
  ActivePromoResponse,
  CartContentsResponse,
} from "@/lib/types";

export async function fetchProducts(
  featured: boolean,
): Promise<FeaturedProductData | null> {
  "use cache";
  cacheTag("featured-products");
  cacheLife("days");

  const res = await fetch(
    `https://vercel-swag-store-api.vercel.app/api/products?featured=${String(featured)}`,
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
    },
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch featured products: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  return data;
}

export async function fetchActivePromo(): Promise<ActivePromoResponse | null> {
  "use cache";
  cacheTag("featured-products");
  cacheLife("days");

  //this is a server component, its safe i swear :)
  const res = await fetch(
    "https://vercel-swag-store-api.vercel.app/api/promotions",
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
    },
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch featured products: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  return data;
}

export async function fetchProduct(
  productSlug: string,
): Promise<ProductResponse | null> {
  "use cache";
  cacheTag("product");
  cacheLife("days");

  const res = await fetch(
    `https://vercel-swag-store-api.vercel.app/api/products/${productSlug}`,
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchStock(
  productSlug: string,
): Promise<ProductStock | null> {
  "use cache";
  cacheTag("productStock");
  cacheLife("minutes");

  const res = await fetch(
    `https://vercel-swag-store-api.vercel.app/api/products/${productSlug}/stock`,
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch stock: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchCart(
  cartToken: string | undefined,
): Promise<CartContentsResponse | null> {
  "use cache";
  cacheTag("productStock");
  cacheLife("days");
  if (!cartToken) return null;
  const res = await fetch(`https://vercel-swag-store-api.vercel.app/api/cart`, {
    headers: {
      "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      "x-cart-token": cartToken || "",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}
