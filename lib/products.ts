import { cacheTag, cacheLife } from "next/cache";
import {
  FeaturedProductData,
  ProductResponse,
  ProductStock,
  ActivePromoResponse,
  CartContentsResponse,
} from "@/lib/types";

// fetch featured products from our API
export async function fetchFeaturedProducts(): Promise<FeaturedProductData | null> {
  // fetch featured products from our API endpoint
  "use cache";
  cacheTag("featured-products");
  cacheLife("days");
  //this is a server component, its safe i swear :)
  const res = await fetch(
    "https://vercel-swag-store-api.vercel.app/api/products?featured=true",
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
    },
  );
  //add throw error if fetch fails
  if (!res.ok) {
    throw new Error(
      `Failed to fetch featured products: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  return data;
}

export async function fetchActivePromo(): Promise<ActivePromoResponse | null> {
  // fetch featured products from our API endpoint
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
  //add throw error if fetch fails
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
  // fetch featured products from our API endpoint
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

  //add throw error if fetch fails
  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchStock(
  productSlug: string,
): Promise<ProductStock | null> {
  // fetch featured products from our API endpoint
  "use cache";
  cacheTag("productStock");
  cacheLife("days");

  const res = await fetch(
    `https://vercel-swag-store-api.vercel.app/api/products/${productSlug}/stock`,
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
    },
  );

  //add throw error if fetch fails
  if (!res.ok) {
    throw new Error(`Failed to fetch stock: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchCart(
  cartToken: string | undefined,
): Promise<CartContentsResponse | null> {
  // fetch featured products from our API endpoint
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

  //add throw error if fetch fails
  if (!res.ok) {
    throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}
