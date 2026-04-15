"use client";

import { useOptimistic } from "react";
import { CartItemRow } from "./cart-item-row";
import { CartItem } from "@/lib/types";
import { CheckoutButton } from "./checkout-button";
import { formattedPrice } from "@/lib/format-price";

export function CartList({
  initialItems,
  initialSubtotal,
}: {
  initialItems: CartItem[];
  initialSubtotal: number;
}) {
  const [optimisticSubtotal, adjustSubtotal] = useOptimistic(
    initialSubtotal,
    (current, delta: number) => current + delta,
  );
  return (
    <>
      <ul>
        {initialItems.map((item) => (
          <CartItemRow
            key={item.productId}
            cartItem={item}
            maxQuantity={item.stock}
            onSubTotalChange={(delta) => adjustSubtotal(delta)}
          />
        ))}
      </ul>
      <div className="mt-10 border-t pt-4 md:pt-10 items-center justify-between flex flex-col md:flex-row gap-4">
        <p className="text-lg font-bold ">
          Subtotal: {formattedPrice(optimisticSubtotal)}
        </p>
        <CheckoutButton />
      </div>
    </>
  );
}
