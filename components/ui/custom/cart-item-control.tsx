"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [removeLoading, setRemoveLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const router = useRouter();

  function updateCount(e: React.ChangeEvent<HTMLInputElement>) {
    setCount(Number(e.target.value));
  }
  async function removeFromCart(productId: string) {
    const previousCount = count;
    setCount(0);
    try {
      setRemoveLoading(true);
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
            item(s) removed from cart.
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
      setRemoveLoading(false);
    }
  }

  async function updateQuantity(productId: string) {
    try {
      setUpdateLoading(true);
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
            item(s) updated in your cart.
          </div>,
        );
        router.refresh();
        return;
      }
      toast.error("Failed to update items in your cart. try again later.");
    } catch {
      toast.error("Something went wrong. try again later.");
    } finally {
      setUpdateLoading(false);
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
        disabled={updateLoading || removeLoading}
      >
        {updateLoading ? "Updating..." : "Update Quantity"}
      </Button>
      <Button
        variant={"destructive"}
        className="cursor-pointer"
        onClick={() => removeFromCart(cartItem.productId)}
        disabled={updateLoading || removeLoading}
        aria-label="Remove from cart"
      >
        {removeLoading ? "Removing..." : <Trash />}
      </Button>
    </div>
  );
}
