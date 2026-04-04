import { NextResponse } from "next/server";
// just for reference.
export async function GET() {
  const res = await fetch(
    "https://vercel-swag-store-api.vercel.app/api/products?featured=true",
    {
      headers: {
        "x-vercel-protection-bypass": process.env.SWAG_STORE_API_KEY||"",
      },
    },
  );
  const data = await res.json();
  return NextResponse.json(data);
}
