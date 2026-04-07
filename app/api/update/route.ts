import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ONE_DAY_IN_SECONDS, TOKEN_COOKIE_NAME } from "@/lib/const";

export async function POST(request: Request) {
  try {
    /*
      since we need to get cart token before
      adding to cart. we need to do a sequential
      request BUT we will set a cookie so we don't
      need waterfall every time

      TODO: retry if upstream api rejects token.
    */
    const requestBody = await request.json();
    const cookieStore = await cookies();
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

      if (!cartToken) {
        return NextResponse.json(
          { error: "Problem getting cart token from upstream api" },
          { status: 502 },
        );
      }
    }

    const addToCartResponse = await fetch(
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

    const data = await addToCartResponse.json();

    const response = NextResponse.json(data, {
      status: addToCartResponse.status,
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
