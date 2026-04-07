import { cacheTag, cacheLife } from "next/cache";
import {
  ProuctResponse,
  ProductResponse,
  ProductStock,
  ActivePromoResponse,
  CartContentsResponse,
  SearchParams,
  CategoryResponse,
} from "@/lib/types";
import queryString from "query-string";
export async function fetchProducts(
  featured: boolean,
  params: SearchParams = {},
): Promise<ProuctResponse | null> {
  "use cache";
  cacheTag("featured-products");
  cacheLife("days");
  const qs = queryString.stringify({ ...{ featured: featured }, ...params });
  const res = await fetch(
    `https://vercel-swag-store-api.vercel.app/api/products?${qs}`,
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

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchCategories(): Promise<CategoryResponse | null> {
  "use cache";
  cacheTag("categories");
  cacheLife("days");

  const res = await fetch(
    "https://vercel-swag-store-api.vercel.app/api/categories",
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
    },
  );

  if (res.status === 404) {
    return null;
  }

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

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchCart(
  cartToken: string | undefined,
): Promise<CartContentsResponse | null> {
  if (!cartToken) return null;
  const res = await fetch(`https://vercel-swag-store-api.vercel.app/api/cart`, {
    headers: {
      "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      "x-cart-token": cartToken || "",
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}
