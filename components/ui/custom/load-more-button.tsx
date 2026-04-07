"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LoadMoreButton() {
  return (
    <Button
      className="cursor-pointer"
      onClick={() =>
        toast.info(
          <div>
            This button is just FPO pagination not currently built out for this
            page
          </div>,
        )
      }
    >
      Load More
    </Button>
  );
}
