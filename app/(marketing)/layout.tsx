import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {Copyright} from "@/components/ui/custom/copyright";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="bg-background text-foreground border-b border-border">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Home"
            className={buttonVariants({ variant: "ghost" })}
          >
            <svg
              focusable="false"
              aria-hidden="true"
              data-testid="geist-icon"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 1L16 15H0L8 1Z"
                fill="currentColor"
              ></path>
            </svg>
          </Link>
          <div className="flex items-center gap-4">
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/products" className={buttonVariants({ variant: "ghost" })}
  >
                  Products
                </Link>
              </li>
              <li>
                <Link href="/search" className={buttonVariants({ variant: "ghost" })}
  >
                  Search
                </Link>
              </li>
              <li>
                <Link href="/cart" className={buttonVariants({ variant: "ghost" })}
  >
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main className="p-4">{children}</main>
      <footer className="bg-secondary text-secondary-foreground w-full">
      {/* cant use date on server component so moved Copyright to client component so it can use new Date() */}
      <Suspense fallback={<div className="container mx-auto p-4 text-center">&copy; Acme, Inc.</div>}>
        <Copyright/>
      </Suspense>
      </footer>
    </>
  );
}
