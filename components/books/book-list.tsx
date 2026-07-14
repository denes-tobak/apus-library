"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { BookSearch } from "@/components/books/book-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UNCATEGORIZED_FILTER,
  type BookSortOption,
} from "@/lib/books/book-query";
import type { Book } from "@/types/book";

type CategoryOption = {
  name: string;
  bookCount: number;
};

type BookListProps = {
  books: Book[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  searchTerm: string;
  sortOption: BookSortOption;
  selectedCategories: string[];
  categories: CategoryOption[];
  uncategorizedCount: number;
};

type NavigationMode = "push" | "replace";

export function BookList({
  books,
  totalCount,
  page,
  pageSize,
  totalPages,
  searchTerm,
  sortOption,
  selectedCategories,
  categories,
  uncategorizedCount,
}: BookListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] =
    useState(searchTerm);

  const [isPending, startTransition] =
    useTransition();

  const navigate = useCallback(
    (
      params: URLSearchParams,
      mode: NavigationMode,
    ) => {
      const queryString = params.toString();

      const href = queryString
        ? `${pathname}?${queryString}`
        : pathname;

      startTransition(() => {
        if (mode === "replace") {
          router.replace(href, {
            scroll: false,
          });

          return;
        }

        router.push(href, {
          scroll: false,
        });
      });
    },
    [pathname, router],
  );

  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const normalizedSearch = searchValue.trim();

    if (normalizedSearch === searchTerm) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString(),
      );

      if (normalizedSearch) {
        params.set("search", normalizedSearch);
      } else {
        params.delete("search");
      }

      params.delete("page");

      navigate(params, "replace");
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [
    navigate,
    searchParams,
    searchTerm,
    searchValue,
  ]);

  const hasActiveFilters =
    searchTerm.length > 0 ||
    selectedCategories.length > 0;

  const firstVisibleBook =
    totalCount === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const lastVisibleBook = Math.min(
    page * pageSize,
    totalCount,
  );

  function handleSortChange(
    nextSortOption: BookSortOption,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (nextSortOption === "title-asc") {
      params.delete("sort");
    } else {
      params.set("sort", nextSortOption);
    }

    params.delete("page");

    navigate(params, "push");
  }

  function toggleCategory(category: string) {
    const nextCategories =
      selectedCategories.includes(category)
        ? selectedCategories.filter(
            (selectedCategory) =>
              selectedCategory !== category,
          )
        : [...selectedCategories, category];

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("category");

    nextCategories.forEach((selectedCategory) => {
      params.append("category", selectedCategory);
    });

    params.delete("page");

    navigate(params, "push");
  }

  function clearFilters() {
    setSearchValue("");

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("search");
    params.delete("category");
    params.delete("page");

    navigate(params, "push");
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

  return (
    <div
      aria-busy={isPending}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <BookSearch
              value={searchValue}
              onChange={setSearchValue}
            />
          </div>

          <select
            value={sortOption}
            onChange={(event) =>
              handleSortChange(
                event.target.value as BookSortOption,
              )
            }
            aria-label="Sort books"
            className="h-11 rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-56"
          >
            <option value="title-asc">
              Title: A–Z
            </option>

            <option value="title-desc">
              Title: Z–A
            </option>

            <option value="author-asc">
              Author: A–Z
            </option>

            <option value="author-desc">
              Author: Z–A
            </option>

            <option value="year-desc">
              Publication year: Newest
            </option>

            <option value="year-asc">
              Publication year: Oldest
            </option>
          </select>
        </div>

        {(categories.length > 0 ||
          uncategorizedCount > 0) && (
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Filter by category
                </p>

                <p className="text-xs text-muted-foreground">
                  Books matching any selected category are
                  shown.
                </p>
              </div>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="size-4" />
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected =
                  selectedCategories.includes(
                    category.name,
                  );

                return (
                  <Button
                    key={category.name}
                    type="button"
                    size="sm"
                    variant={
                      isSelected
                        ? "default"
                        : "outline"
                    }
                    aria-pressed={isSelected}
                    onClick={() =>
                      toggleCategory(category.name)
                    }
                  >
                    {category.name}

                    <span className="text-xs opacity-70">
                      {category.bookCount}
                    </span>
                  </Button>
                );
              })}

              {uncategorizedCount > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant={
                    selectedCategories.includes(
                      UNCATEGORIZED_FILTER,
                    )
                      ? "default"
                      : "outline"
                  }
                  aria-pressed={selectedCategories.includes(
                    UNCATEGORIZED_FILTER,
                  )}
                  onClick={() =>
                    toggleCategory(
                      UNCATEGORIZED_FILTER,
                    )
                  }
                >
                  Uncategorized

                  <span className="text-xs opacity-70">
                    {uncategorizedCount}
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {totalCount === 0
            ? "Showing 0 books"
            : `Showing ${firstVisibleBook}–${lastVisibleBook} of ${totalCount} books`}
        </p>

        {isPending && <p>Updating results...</p>}
      </div>

      <div
        className={
          isPending
            ? "opacity-60 transition-opacity"
            : "transition-opacity"
        }
      >
        {books.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {hasActiveFilters
                ? "No books match your current filters."
                : "No books have been added yet."}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                aria-label={`View details for ${book.title}`}
                className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {book.title}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      {book.author}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm">
                    <p>
                      <span className="font-medium">
                        Year:
                      </span>{" "}
                      {book.published_year ?? "Unknown"}
                    </p>

                    <div className="space-y-2">
                      <span className="font-medium">
                        Categories:
                      </span>

                      {book.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {book.categories.map(
                            (category) => (
                              <span
                                key={category}
                                className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                {category}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Uncategorized
                        </p>
                      )}
                    </div>

                    {book.series_number !== null &&
                      book.series_number > 0 && (
                        <p>
                          <span className="font-medium">
                            Series:
                          </span>{" "}
                          #{book.series_number}
                        </p>
                      )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            {page > 1 ? (
              <Button asChild variant="outline">
                <Link
                  href={createPageHref(page - 1)}
                  scroll={false}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <ChevronLeft className="size-4" />
                Previous
              </Button>
            )}

            {page < totalPages ? (
              <Button asChild variant="outline">
                <Link
                  href={createPageHref(page + 1)}
                  scroll={false}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}