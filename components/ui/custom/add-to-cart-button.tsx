"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddToCartButton({
  product,
  max,
}: {
  product: string;
  max: number;
}) {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function updateCount(e: React.ChangeEvent<HTMLInputElement>) {
    setCount(Number(e.target.value));
  }
  async function addToCart(product: string) {
    try {
      setLoading(true);
      const res = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product, quantity: count }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(
          <div className="flex items-center gap-16">
            <div>
              {d?.data.totalItems} items added to cart.
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
    <>
      <Input
        className="w-20"
        onChange={updateCount}
        min={1}
        max={max}
        type="number"
        value={count}
      />
      <Button
        className="cursor-pointer"
        onClick={() => addToCart(product)}
        disabled={loading ?? "disabled"}
      >
        {loading ? "Loading..." : "Add to Cart"}
      </Button>
    </>
  );
}
