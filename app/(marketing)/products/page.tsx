import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { fetchProduct } from "@/lib/products";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Acme Swag - Products',
  description: 'Acme Swag Products page is the place to find the latest and greatest swaggy stuff!',
  openGraph: {
    title: "Acme Swag - Products",
    description: "Your one-stop shop for all swaggy stuff!",
  },
};


export default async function ProductPage() {
   return (<div>
   Products Page
   <code>

   </code>
  </div>
  );
}