"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ONE_DAY_IN_SECONDS, TOKEN_COOKIE_NAME } from "@/lib/const";
import { CartContentsResponse, CartItem } from "@/lib/types";
import { normalizeField } from "@/lib/products";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().gte(1).lte(999),
});

const updateCartSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().gte(1).lte(999),
});

const removeFromCartSchema = z.object({
  itemId: z.string().min(1),
});

async function getOrCreateCartToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  let cartToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!cartToken) {
    const createCartResponse = await fetch(
      "https://vercel-swag-store-api.vercel.app/api/cart/create",
      {
        method: "POST",
        headers: {
          "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
        },
      },
    );

    const cartData = await createCartResponse.json();
    cartToken = cartData?.data?.token;

    if (!cartToken) throw new Error("Failed to get cart token from upstream");
  }

  return cartToken;
}

function normalizeCart(cartData: CartContentsResponse["data"]) {
  // if !cartData is true we don't do the normalization pass it back and let error handling pick it up.
  if (!cartData) return cartData;
  return {
    ...normalizeField(cartData, "subtotal"),
    items: cartData.items?.map((item: CartItem) => ({
      ...item,
      lineTotal: item.lineTotal / 100,
      product: normalizeField(item.product, "price"),
    })),
  };
}

function setCartCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  cartToken: string,
) {
  if (!cookieStore.get(TOKEN_COOKIE_NAME)?.value) {
    cookieStore.set(TOKEN_COOKIE_NAME, cartToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_DAY_IN_SECONDS,
      path: "/",
    });
  }
}

export async function addToCart(productId: string, quantity: number) {
  try {
    addToCartSchema.parse({ productId, quantity });
    const cookieStore = await cookies();
    const cartToken = await getOrCreateCartToken(cookieStore);
    setCartCookie(cookieStore, cartToken);

    const res = await fetch(
      "https://vercel-swag-store-api.vercel.app/api/cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cart-token": cartToken,
          "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
        },
        body: JSON.stringify({ productId, quantity }),
      },
    );

    const d = await res.json();
    if (!d.success)
      throw new Error(d.error?.message ?? "Failed to add to cart");

    d.data = normalizeCart(d.data);
    revalidatePath("/", "layout");
    return d.data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("An unexpected error occurred");
  }
}
export async function updateCartItem(itemId: string, quantity: number) {
  try {
    updateCartSchema.parse({ itemId, quantity });
    const cookieStore = await cookies();
    const cartToken = await getOrCreateCartToken(cookieStore);
    setCartCookie(cookieStore, cartToken);

    const res = await fetch(
      `https://vercel-swag-store-api.vercel.app/api/cart/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-cart-token": cartToken,
          "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
        },
        body: JSON.stringify({ quantity }),
      },
    );

    const d = await res.json();
    if (!d.success)
      throw new Error(d.error?.message || "Failed to update cart");

    d.data = normalizeCart(d.data);
    revalidatePath("/", "layout");
    return d.data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("An unexpected error occurred");
  }
}
export async function removeFromCart(itemId: string) {
  try {
    removeFromCartSchema.parse({ itemId });
    const cookieStore = await cookies();
    const cartToken = await getOrCreateCartToken(cookieStore);
    setCartCookie(cookieStore, cartToken);

    const res = await fetch(
      `https://vercel-swag-store-api.vercel.app/api/cart/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-cart-token": cartToken,
          "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
        },
      },
    );

    const d = await res.json();
    if (!d.success)
      throw new Error(d.error?.message ?? "Failed to remove item");

    d.data = normalizeCart(d.data);
    revalidatePath("/", "layout");
    return d.data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("An unexpected error occurred");
  }
}
