import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const robotoSlabHeading = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
});
const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s | Acme Swag Store",
    default: "Acme Swag Store",
  },
  description: "Your one-stop shop for swaggy stuff!",
  openGraph: {
    title: "Acme Swag Store",
    description: "Your one-stop shop for all swaggy stuff!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        roboto.variable,
        robotoSlabHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
