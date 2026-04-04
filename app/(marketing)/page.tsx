import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { fetchFeaturedProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import heroImg from "@/public/img/1200x400-grayscale.jpg"
export const metadata: Metadata = {
  title: 'Acme Swag - Home',
  description: 'Acme Swag Homepage is the place to find the latest and greatest swaggy stuff!',
  openGraph: {
    title: "Acme Swag - Home",
    description: "Your one-stop shop for all swaggy stuff!",
  },
};

export default async function MarketingPage() {
  return (
    <div>
      <div className="bg-secondary text-secondary-foreground">
        <div className="pt-20 pb-10 px-4 text-center gap-6 flex flex-col items-center max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold mb-4">
            Welcome to Our Store
          </h1>
          <p className="text-xl">
            Check out our latest products and find something you love!
          </p>
          <Link className={buttonVariants({ size: "lg" })} href="/products">
            Browse Products
          </Link>
        </div>
        <div className="bg-gray-800 aspect-[3/1] mt-6 mx-auto w-full max-w-5xl">
          <Image
            priority={true}
            src={heroImg}
            alt="Store Hero Image"
            width={1200}
            height={400}
            className="aspect-[3/1]"
            placeholder="blur"
          />
        </div>
      </div>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-center text-3xl md:text-4xl">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* broke out FeaturedProducts into its own component so we can suspense it */}
          <Suspense
            fallback={
              <>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function FeaturedProducts() {
  const response = await fetchFeaturedProducts();
  if (!response?.data?.length)
    return (
      <p className="text-center text-lg mx-auto col-span-3">
        No featured products found. Sorry all sold out ¯\_(ツ)_/¯
      </p>
    );
  return (
    <>
    {response?.data?.map((product: Product) => (
        <Link href={`/products/${product.slug}`} key={product.id} className="border p-4 rounded-lg">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            quality={75}
            className="mx-auto"
          />
          <h3 className="text-xl font-bold mt-4">{product.name}</h3>
          <p className="mt-2">{product.description}</p>
          <p className="mt-2 font-semibold">${product.price}</p>
        </Link>
      ))}
    </>
  );
}
