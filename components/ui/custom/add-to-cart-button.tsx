"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { addToCart } from "@/app/actions/cart";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format-price";
export function AddToCartButton({
  product,
  max,
}: {
  product: string;
  max: number;
}) {
  const [count, setCount] = useState(1);

  function updateCount(e: React.ChangeEvent<HTMLInputElement>) {
    setCount(Number(e.target.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch, pending] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_prev: unknown) => {
      try {
        const data = await addToCart(product, count);
        toast.success(
          <div className="flex items-center gap-16">
            <div>
              {data.totalItems} items added to cart.
              {data.subtotal && (
                <>
                  <br />
                  <strong>Total: {formatPrice(data.subtotal)}</strong>
                </>
              )}
            </div>
            <div>
              <Link className={buttonVariants()} href="/cart">
                view cart
              </Link>
            </div>
          </div>,
        );
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to add to cart.");
      }
    },
    null,
  );
  return (
    <>
      <form action={dispatch} className="flex items-center gap-4">
        <input type="hidden" name="..." />
        <Input
          className="w-20"
          onChange={updateCount}
          min={1}
          max={max}
          type="number"
          value={count}
        />
        <Button className="cursor-pointer" disabled={pending}>
          {pending ? "Loading..." : "Add to Cart"}
        </Button>
      </form>
    </>
  );
}
