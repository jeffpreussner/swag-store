import { cacheTag, cacheLife } from "next/cache";
import {
  ProuctResponse,
  ProductResponse,
  ProductStock,
  ActivePromoResponse,
  CartContentsResponse,
  SearchParams,
  CategoryResponse,
  CartItem,
  Product,
} from "@/lib/types";
import queryString from "query-string";

//This function takes an object and a key returns the object with that key divided by 100 for cent to dollar conversion
export function normalizeField(
  obj: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  return { ...obj, [key]: (obj[key] as number) / 100 };
}

export async function fetchProducts(
  featured: boolean,
  params: SearchParams = {},
): Promise<ProuctResponse | null> {
  "use cache";
  cacheTag(featured ? "featured-products" : "products");
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
  data.data = data.data.map((p: Product) => normalizeField(p, "price"));

  return data;
}

export async function fetchActivePromo(): Promise<ActivePromoResponse | null> {
  "use cache";
  cacheTag("active-promo");
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
  if (data.data) data.data = normalizeField(data.data, "price");
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
 // if we cache here it would need to be short to avoid errors
 // potentially adding out of stock items to cart, but this also
 // would shorten the cache on any page its added to. Solution, no
 // cache, always most up to date stock, and fetch is dynamic by default
 // allowing us to have longer cache on product page. 

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
  if (data.data) {
    data.data.subtotal = data.data.subtotal / 100;
    data.data.items = data.data.items.map((item: CartItem) => ({
      ...item,
      lineTotal: item.lineTotal / 100,
      product: normalizeField(item.product, "price"),
    }));
  }

  return data;
}
