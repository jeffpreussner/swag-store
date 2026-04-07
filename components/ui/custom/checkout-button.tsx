"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CheckoutButton() {
  return (
    <>
      <Button
        className="cursor-pointer"
        onClick={() =>
          toast.info(
            <div className="flex items-center gap-16">
              {" "}
              FPO would proceed to checkout flow.
            </div>,
          )
        }
      >
        Proceed to Checkout
      </Button>
    </>
  );
}
