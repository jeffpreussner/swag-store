import type { Metadata } from "next";
import { Roboto, Roboto_Slab, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const robotoSlabHeading = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-g-heading",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-g-mono",
});

const roboto = Roboto({ subsets: ["latin"], variable: "--font-g-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001",
  ),
  title: {
    template: "%s | Acme Swag Store",
    default: "Acme Swag Store",
  },
  description: "Your one-stop shop for swaggy stuff!",
  openGraph: {
    siteName: "Acme Swag Store",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acme Swag Store",
    description: "Your one-stop shop for all swaggy stuff!",
  },
};

import "./globals.css";

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
        robotoMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
