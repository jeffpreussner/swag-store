import Link from "next/link";
import Image from "next/image";
import { placeholder } from "@/lib/placeholder";
import { Product } from "@/lib/types";
import { formattedPrice } from "@/lib/format-price";
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      key={product.id}
      className="border p-4 rounded-lg"
    >
      <Image
        src={product.images[0]}
        alt={product.name}
        width={300}
        height={300}
        quality={75}
        className="mx-auto"
        placeholder="blur"
        blurDataURL={placeholder(300, 300)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <h3 className="text-xl font-bold mt-4">{product.name}</h3>
      <p className="mt-2">{product.description}</p>
      <p className="mt-2 font-semibold">{formattedPrice(product.price)}</p>
    </Link>
  );
}
