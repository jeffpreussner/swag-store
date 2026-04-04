import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cartData = await request.json();
  const res = await fetch(
    "https://vercel-swag-store-api.vercel.app/api/cart",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cart-token": "<your-cart-token>",
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY || "",
      },
      body: JSON.stringify(cartData),
    },
  );
  const data = await res.json();
  return NextResponse.json(data);
}
