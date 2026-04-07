import { Skeleton } from "@/components/ui/skeleton";
import { TOKEN_COOKIE_NAME } from "@/lib/const";
import { fetchCart, fetchStock } from "@/lib/products";
import { CartItem } from "@/lib/types";
import type { Metadata } from "next";
import { cookies } from "next/dist/server/request/cookies";
import Image from "next/image";
import { Suspense } from "react";
import { CartItemControl } from "@/components/ui/custom/cart-item-control";
import { CheckoutButton } from "@/components/ui/custom/checkout-button";

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
              <ul className="grid grid-cols-1 gap-6 mt-10">
                <li>
                  <Skeleton className="h-20 w-full" />
                </li>
                <li>
                  <Skeleton className="h-20 w-full" />
                </li>
                <li>
                  <Skeleton className="h-20 w-full" />
                </li>
                <li>
                  <Skeleton className="h-20 w-full" />
                </li>
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
  let items: CartItem[] = [];

  if (d?.data?.items && d.data.items.length > 0) {
    items = await Promise.all(
      d?.data?.items.map(async (item: CartItem) => ({
        ...item,
        stock: (await fetchStock(item.product.slug))?.data.stock,
      })),
    );
  }

  if (!d?.data?.totalItems || d.data.totalItems === 0)
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold my-20">Your cart is empty</h2>
      </div>
    );

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 mt-10">
        {items.map((cartItem: CartItem) => (
          <li
            key={cartItem.productId}
            className="border p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 w-full"
          >
            <div className="flex justify-center h-10 w-10 overflow-hidden rounded-sm bg-gray-100 min-w-10">
              <Image
                src={cartItem.product.images[0]}
                alt={cartItem.product.name}
                width={40}
                height={40}
                quality={50}
                className="mx-auto"
              />
            </div>
            <div className=" basis-1/2">
              <p className="text-sm font-bold">{cartItem.product.name}</p>
            </div>
            <div className="text-sm h-10 flex items-center justify-center">
              <p className="font-bold">Price: </p>
              <p className="ml-2">${cartItem.product.price.toLocaleString()}</p>
            </div>
            <CartItemControl
              cartItem={cartItem}
              maxQuantity={cartItem?.stock || 100}
            />
            <div className="mr-0 ml-auto">
              <p className="text-sm font-bold">Total:</p>
              <p className="mt-2 text-xs">
                ${cartItem.lineTotal.toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t pt-4 md:pt-10 items-center justify-between flex flex-col md:flex-row gap-4">
        <p className="text-lg font-bold ">
          Subtotal: ${d.data.subtotal.toLocaleString()}
        </p>
        <CheckoutButton />
      </div>
    </>
  );
}
