import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Product Not Found",
  description:
    "The product you are looking for does not exist or has been moved.",
};

export default function ProductNotFound() {
  return (
    <div>
      <div className="bg-secondary text-secondary-foreground">
        <div className="pt-20 pb-10 px-4 text-center gap-6 flex flex-col items-center max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold mb-4">404</h1>
          <p className="text-2xl">
            The product you are looking for does not exist or has moved.
          </p>
        </div>
      </div>
    </div>
  );
}
