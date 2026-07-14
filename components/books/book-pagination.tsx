"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";

type BookPaginationProps = {
  page: number;
  totalPages: number;
};

type PaginationItem =
  | number
  | "ellipsis-left"
  | "ellipsis-right";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis-right",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-left",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

export function BookPagination({
  page,
  totalPages,
}: BookPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function createPageHref(targetPage: number) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (targetPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }

    const queryString = params.toString();

    return queryString
      ? `${pathname}?${queryString}`
      : pathname;
  }

  const paginationItems = getPaginationItems(
    page,
    totalPages,
  );

  return (
    <nav
      aria-label="Book pagination"
      className="flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={createPageHref(page - 1)}
              scroll={false}
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">
                Previous
              </span>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">
              Previous
            </span>
          </Button>
        )}

        {paginationItems.map((item) => {
          if (typeof item !== "number") {
            return (
              <span
                key={item}
                aria-hidden="true"
                className="flex size-9 items-center justify-center text-sm text-muted-foreground"
              >
                …
              </span>
            );
          }

          const isCurrentPage = item === page;

          if (isCurrentPage) {
            return (
              <Button
                key={item}
                type="button"
                size="sm"
                className="min-w-9"
                aria-current="page"
                disabled
              >
                {item}
              </Button>
            );
          }

          return (
            <Button
              key={item}
              asChild
              variant="outline"
              size="sm"
              className="min-w-9"
            >
              <Link
                href={createPageHref(item)}
                scroll={false}
                aria-label={`Go to page ${item}`}
              >
                {item}
              </Link>
            </Button>
          );
        })}

        {page < totalPages ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={createPageHref(page + 1)}
              scroll={false}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}