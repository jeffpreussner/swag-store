import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { fetchProduct, fetchStock } from "@/lib/products";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { AddToCartButton } from "@/components/ui/custom/add-to-cart-button";
import { ChevronLeft } from "lucide-react";
import { placeholder } from "@/lib/placeholder";

export async function generateMetadata(props: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const productSlug = (await props.params).productSlug;
  const productRes = await fetchProduct(productSlug);
  const data = productRes?.data;
  if (!data) {
    return {
      title: "Acme Swag Store - Product Detail (product not found)",
      description: "Detail view of swaggy stuff!",
    };
  }

  return {
    title: data.name,
    description: data.description,
    keywords: data.tags?.join(", "),
    alternates: {
      canonical: `/${productSlug}`,
    },
    openGraph: {
      title: data.name,
      description: data.description,
      images: data.images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.name,
      description: data.description,
      images: data.images,
    },
  };
}
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
  const error = productRes?.error;
  if (error?.code === "NOT_FOUND" || !productRes?.data) {
    notFound();
  } else if (error) {
    throw new Error(error.message);
  }

  const data = productRes?.data;
  const stock = stockRes?.data;

  return (
    <>
      <div className="container px-4">
        <Link
          href="/products"
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          <ChevronLeft /> Back to Products
        </Link>
      </div>
      <div className="text-center text-lg mx-auto col-span-3 max-w-md mx-auto p-4 grid grid-cols-1 gap-6">
        {/* only load carousel if more than 2 images */}
        {data.images && data.images.length < 2 && (
          <Image
            priority={true}
            fetchPriority="high"
            loading="eager"
            src={data.images[0]}
            alt={data.name}
            width={400}
            height={400}
            quality={50}
            sizes="100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL={placeholder(400, 400)}
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
                    fetchPriority={i === 0 ? "high" : "auto"}
                    loading={i === 0 ? "eager" : "lazy"}
                    src={imgSrc}
                    alt={data.name}
                    width={400}
                    height={400}
                    quality={50}
                    sizes="100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL={placeholder(400, 400)}
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
                <p>{stock?.stock} in Stock:</p>{" "}
                <AddToCartButton product={data.id} max={stock?.stock} />
              </>
            ) : (
              <Button disabled={true}>Out of Stock</Button>
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
