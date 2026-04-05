import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme Swag - Products",
  description:
    "Acme Swag Products page is the place to find the latest and greatest swaggy stuff!",
  openGraph: {
    title: "Acme Swag - Products",
    description: "Your one-stop shop for all swaggy stuff!",
  },
};

export default async function ProductPage() {
  return <div>Products Page</div>;
}
