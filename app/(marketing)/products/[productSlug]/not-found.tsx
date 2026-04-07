import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="container">
      <h1>404</h1>
      <p>Product Not Found</p>
      <p>
        The product you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link
        href="/"
        className="rounded bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
      >
        Head home
      </Link>
    </div>
  );
}
