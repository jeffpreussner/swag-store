"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import "@/app/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div>
          <header className="bg-background text-foreground border-b border-border">
            <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
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
                    <Link
                      href="/products"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          <div className="bg-secondary text-secondary-foreground">
            <div className="pt-20 pb-10 px-4 text-center gap-6 flex flex-col items-center max-w-3xl mx-auto">
              <h1 className="text-6xl md:text-9xl font-bold mb-4">Oh Snap.</h1>
              <p className="text-2xl">Looks like something bad happened</p>
              {error.digest && (
                <p className="text-sm text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
              <button
                onClick={() => reset()}
                className={buttonVariants({ size: "lg" })}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
