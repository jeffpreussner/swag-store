"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Label } from "../label";
import { CartItem } from "@/lib/types";

export function CartItemControl({
  cartItem,
  maxQuantity,
}: {
  cartItem: CartItem;
  maxQuantity: number;
}) {
  const [count, setCount] = useState(cartItem.quantity);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function updateCount(e: React.ChangeEvent<HTMLInputElement>) {
    setCount(Number(e.target.value));
  }
  async function removeFromCart(productId: string) {
    const previousCount = count; // save for rollback
    setCount(0); // optimistically remove from UI
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: productId }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(
          <div className="flex items-center gap-16">
            <div>
              {d?.data.totalItems} items removed from cart.
              {d?.data.subtotal && (
                <>
                  <br />
                  <strong>Total: ${d?.data.subtotal.toLocaleString()}</strong>
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
        router.refresh();
        return;
      }
      setCount(previousCount);
      toast.error("Failed to remove items from cart. try again later.");
    } catch {
      toast.error("Something went wrong. try again later.");
      setCount(previousCount);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(productId: string) {
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: productId, quantity: count }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(
          <div className="flex items-center gap-16">
            <div>
              {d?.data.totalItems} items updated in your cart.
              {d?.data.subtotal && (
                <>
                  <br />
                  <strong>Total: ${d?.data.subtotal.toLocaleString()}</strong>
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
        router.refresh();
        return;
      }
      toast.error("Failed to add items to cart. try again later.");
    } catch {
      toast.error("Something went wrong. try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full mx-auto">
      <div>
        <Label className="text-sm font-bold">
          Quantity:
          <Input
            className="w-20"
            onChange={updateCount}
            min={1}
            max={maxQuantity}
            type="number"
            value={count}
          />
        </Label>
      </div>
      <Button
        className="cursor-pointer"
        onClick={() => updateQuantity(cartItem.productId)}
        disabled={loading}
      >
        {loading ? "Loading..." : "Update Quantity"}
      </Button>
      <Button
        variant={"destructive"}
        className="cursor-pointer"
        onClick={() => removeFromCart(cartItem.productId)}
        disabled={loading}
        aria-label="Remove from cart"
      >
        {loading ? "Loading..." : <Trash />}
      </Button>
    </div>
  );
}
