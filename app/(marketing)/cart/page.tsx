import { Skeleton } from "@/components/ui/skeleton";
import { TOKEN_COOKIE_NAME } from "@/lib/const";
import { fetchCart, fetchStock } from "@/lib/products";
import { CartItem } from "@/lib/types";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { CartList } from "@/components/ui/custom/cart-list";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Acme Swag Cart page is the place to find the latest and greatest swaggy stuff!",
};

export default async function CartPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center">Cart</h1>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div>
          {/* broke out FeaturedProducts into its own component so we can suspense it */}
          <Suspense
            fallback={
              <ul className="grid grid-cols-1 gap-6">
                <li>
                  <Skeleton className="h-20 w-full" />
                </li>
                <li>
                  <Skeleton className="h-20 w-full" />
                </li>
              </ul>
            }
          >
            <Cart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function Cart() {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  const d = await fetchCart(cartToken);

  if (!d?.data?.totalItems || d.data.totalItems === 0)
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold my-20">Your cart is empty</h2>
      </div>
    );

  return (
    <CartList initialItems={d.data.items} initialSubtotal={d.data.subtotal} />
  );
}
