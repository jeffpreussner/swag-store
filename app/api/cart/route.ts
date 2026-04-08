import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ONE_DAY_IN_SECONDS, TOKEN_COOKIE_NAME } from "@/lib/const";
import { CartContentsResponse, CartItem } from "@/lib/types";
import { normalizeField } from "@/lib/products";
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
  // if !cartData is true we dont do the normalization pass it back and let error handling pick it up.
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

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const cartToken = await getOrCreateCartToken(cookieStore);
    const requestBody = await request.json();
    const addToCartReq = await fetch(
      "https://vercel-swag-store-api.vercel.app/api/cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cart-token": cartToken,
          "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
        },
        body: JSON.stringify(requestBody),
      },
    );
    const data = await addToCartReq.json();
    data.data = normalizeCart(data.data);

    const response = NextResponse.json(data, {
      status: addToCartReq.status,
    });

    if (!cookieStore.get(TOKEN_COOKIE_NAME)?.value) {
      response.cookies.set(TOKEN_COOKIE_NAME, cartToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ONE_DAY_IN_SECONDS,
        path: "/",
      });
    }
    return response;
  } catch {
    return NextResponse.json(
      { error: "Encountered an unexpected error while adding to cart." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const cartToken = await getOrCreateCartToken(cookieStore);
    const requestBody = await request.json();
    const { itemId, ...rest } = requestBody;
    const updateCart = await fetch(
      `https://vercel-swag-store-api.vercel.app/api/cart/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-cart-token": cartToken,
          "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
        },
        body: JSON.stringify(rest),
      },
    );

    const data = await updateCart.json();
    data.data = normalizeCart(data.data);
    const response = NextResponse.json(data, {
      status: updateCart.status,
    });

    if (!cookieStore.get(TOKEN_COOKIE_NAME)?.value) {
      response.cookies.set(TOKEN_COOKIE_NAME, cartToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ONE_DAY_IN_SECONDS,
        path: "/",
      });
    }
    return response;
  } catch {
    return NextResponse.json(
      { error: "Encountered an unexpected error while adding to cart." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const cartToken = await getOrCreateCartToken(cookieStore);
    const requestBody = await request.json();
    const { itemId, ...rest } = requestBody;

    const deleteItem = await fetch(
      `https://vercel-swag-store-api.vercel.app/api/cart/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-cart-token": cartToken,
          "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
        },
        body: JSON.stringify(rest),
      },
    );

    const data = await deleteItem.json();
    data.data = normalizeCart(data.data);
    const response = NextResponse.json(data, {
      status: deleteItem.status,
    });

    if (!cookieStore.get(TOKEN_COOKIE_NAME)?.value) {
      response.cookies.set(TOKEN_COOKIE_NAME, cartToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ONE_DAY_IN_SECONDS,
        path: "/",
      });
    }
    return response;
  } catch {
    return NextResponse.json(
      { error: "Encountered an unexpected error while adding to cart." },
      { status: 500 },
    );
  }
}
