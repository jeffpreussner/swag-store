"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { CartItem } from "@/lib/types";
import { updateCartItem, removeFromCart } from "@/app/actions/cart";
import { placeholder } from "@/lib/placeholder";
import { formattedPrice } from "@/lib/format-price";

export function CartItemRow({
  cartItem,
  maxQuantity,
  onSubTotalChange,
}: {
  cartItem: CartItem;
  maxQuantity?: number;
  onSubTotalChange?: (lineTotal: number) => void;
}) {
  const [removed, setRemoved] = useState(false);
  const [count, setCount] = useState(cartItem.quantity);
  const [updatePending, startUpdate] = useTransition();
  const [removePending, startRemove] = useTransition();

  if (removed) return null;

  function handleUpdate() {
    const delta = (count - cartItem.quantity) * cartItem.product.price;

    startUpdate(async () => {
      if (onSubTotalChange) {
        onSubTotalChange(delta);
      }
      try {
        await updateCartItem(cartItem.productId, count);
        toast.success("item(s) updated in your cart.");
      } catch (e) {
        if (onSubTotalChange) {
          onSubTotalChange(-delta);
        }
        toast.error(e instanceof Error ? e.message : "Failed to update cart.");
      }
    });
  }

  function handleRemove() {
    setRemoved(true);

    startRemove(async () => {
      if (onSubTotalChange) {
        onSubTotalChange(-cartItem.lineTotal);
      }
      try {
        await removeFromCart(cartItem.productId);
        toast.success("item(s) removed from cart.");
      } catch (e) {
        setRemoved(false);
        if (onSubTotalChange) {
          onSubTotalChange(cartItem.lineTotal);
        }
        toast.error(e instanceof Error ? e.message : "Failed to remove item.");
      }
    });
  }

  return (
    <li className="border p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      <div className="flex justify-center h-10 w-10 overflow-hidden rounded-sm bg-gray-100 min-w-10">
        <Image
          src={cartItem.product.images[0]}
          alt={cartItem.product.name}
          width={40}
          height={40}
          quality={50}
          className="mx-auto"
          sizes="40px"
          placeholder="blur"
          blurDataURL={placeholder(40, 40)}
        />
      </div>
      <div className="basis-1/2">
        <p className="text-sm font-bold">{cartItem.product.name}</p>
      </div>
      <div className="text-sm h-10 flex items-center justify-center">
        <p className="font-bold">Price: </p>
        <p className="ml-2">{formattedPrice(cartItem.product.price)}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full mx-auto">
        <Label className="text-sm font-bold">
          Quantity:
          <Input
            className="w-20"
            onChange={(e) => setCount(Number(e.target.value))}
            min={1}
            {...(maxQuantity && { max: maxQuantity })}
            type="number"
            value={count}
          />
        </Label>
        <Button
          className="cursor-pointer"
          onClick={handleUpdate}
          disabled={updatePending || removePending}
        >
          {updatePending ? "Updating..." : "Update Quantity"}
        </Button>
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={handleRemove}
          disabled={updatePending || removePending}
          aria-label="Remove from cart"
        >
          {removePending ? "Removing..." : <Trash />}
        </Button>
      </div>
      <div className="md:mr-0 md:ml-auto">
        <p className="text-sm font-bold">Total:</p>
        <p className="mt-2 text-xs">
          {updatePending
            ? formattedPrice(count * cartItem.product.price)
            : formattedPrice(cartItem.lineTotal)}
        </p>
      </div>
    </li>
  );
}
