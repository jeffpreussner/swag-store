import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { fetchProduct, fetchStock } from "@/lib/products";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AddToCartButton } from "@/components/ui/custom/add-to-cart-button";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Acme Swag - Products",
  description:
    "Acme Swag Products page is the place to find the latest and greatest swaggy stuff!",
  openGraph: {
    title: "Acme Swag - Products",
    description: "Your one-stop shop for all swaggy stuff!",
  },
};

export default async function ProductDetailPage(props: {
  params: Promise<{ productSlug: string }>;
}) {
  return (
    <div>
      <code>
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetails params={props.params} />
        </Suspense>
      </code>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="text-center text-lg mx-auto col-span-3 max-w-md p-4">
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-8 w-3/4 mx-auto mt-4" />
      <Skeleton className="h-4 w-full mt-4" />
      <Skeleton className="h-4 w-5/6 mx-auto mt-2" />
      <Skeleton className="h-6 w-24 mx-auto mt-4" />
      <Skeleton className="h-10 w-36 mx-auto mt-4 rounded-md" />
    </div>
  );
}

async function ProductDetails({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const [productRes, stockRes] = await Promise.all([
    fetchProduct(productSlug),
    fetchStock(productSlug),
  ]);
  const data = productRes?.data;
  const stock = stockRes?.data;

  if (!data)
    return (
      <p className="text-center text-lg mx-auto col-span-3">
        No featured products found. Sorry all sold out ¯\_(ツ)_/¯
      </p>
    );
  return (
    <>
      <div className="container px-4">
        <Link
          href="/products"
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
         <ChevronLeft  /> Back to Products
        </Link>
      </div>
      <div className="text-center text-lg mx-auto col-span-3 max-w-md mx-auto p-4">
        {/* only load carousel if more than 2 images */}

        {data.images && data.images.length < 2 && (
          <Image
            priority={true}
            src={data.images[0]}
            alt={data.name}
            width={400}
            height={400}
          />
        )}
        {data.images && data.images.length > 2 && (
          <Carousel>
            <CarouselContent>
              {data.images.map((imgSrc: string, i: number) => (
                <CarouselItem key={`product-detail-image-${i}`}>
                  {/* only prioritize the first image */}
                  <Image
                    priority={i === 0}
                    src={imgSrc}
                    alt={data.name}
                    width={400}
                    height={400}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl md:text-5xl font-bold">{data.name}</h1>
          <p className="text-gray-600 text-lg md:text-xl">{data.description}</p>
          <p className="font-semibold">${data.price}</p>
          <p className="text-gray-500"></p>
          <div className="flex justify-center items-center gap-4">
             {stock?.inStock ? (
              <>
                <p>{stock.stock} in Stock:</p> <AddToCartButton product={data.id} />
              </>
            ) : (
              <p>Out of Stock</p>
            )}
            {stock?.lowStock && (
              <p className="text-yellow-500">Low Stock order now!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
