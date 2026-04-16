import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { fetchProducts } from "@/lib/products";
import { SearchParams } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationLinkProps } from "@/lib/types";

export async function SearchPagination({
  productPromise,
  searchParams,
  route = "/search",
}: {
  productPromise: ReturnType<typeof fetchProducts>;
  searchParams: SearchParams;
  route?: string;
}) {
  const response = await productPromise;
  const pagination = response?.meta?.pagination;
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;
  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (searchParams?.search) params.set("search", searchParams.search);
    if (searchParams?.category) params.set("category", searchParams.category);
    params.set("page", String(p));
    return `${route}?${params.toString()}`;
  }

  // Build the visible page numbers: always show current-1, current, current+1
  // clamped within [1, totalPages], then deduplicate
  const middle = Array.from(
    new Set(
      [page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages),
    ),
  );
  const showLeadingEllipsis = middle[0] > 2;
  const showTrailingEllipsis = middle[middle.length - 1] < totalPages - 1;
  const showFirst = middle[0] > 1;
  const showLast = middle[middle.length - 1] < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            size="lg"
            href={hasPreviousPage ? pageHref(page - 1) : undefined}
            aria-disabled={!hasPreviousPage}
            disabled={page === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </PaginationLink>
        </PaginationItem>

        {showFirst && (
          <PaginationItem>
            <PaginationLink href={pageHref(1)}>1</PaginationLink>
          </PaginationItem>
        )}

        {showLeadingEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {middle.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href={pageHref(p)}
              isActive={p === page}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showTrailingEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {showLast && (
          <PaginationItem>
            <PaginationLink href={pageHref(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            size="lg"
            href={hasNextPage ? pageHref(page + 1) : undefined}
            aria-disabled={!hasNextPage}
            disabled={page === totalPages}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function PaginationLink({
  className,
  isActive,
  size = "icon",
  href,
  disabled,
  ...rest
}: PaginationLinkProps) {
  if (disabled) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={cn("opacity-50 cursor-not-allowed", className)}
        disabled
        {...rest}
      />
    );
  }

  return (
    <Button
      asChild
      variant={isActive ? "default" : "ghost"}
      size={size}
      className={cn(className)}
    >
      <Link
        href={href ?? "#"}
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...rest}
      />
    </Button>
  );
}
