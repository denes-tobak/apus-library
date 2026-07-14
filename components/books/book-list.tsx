"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { BookSearch } from "@/components/books/book-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Book } from "@/types/book";

type BookListProps = {
  books: Book[];
};

type SortOption =
  | "title-asc"
  | "title-desc"
  | "author-asc"
  | "author-desc"
  | "year-desc"
  | "year-asc";

const UNCATEGORIZED_FILTER = "__uncategorized__";

export function BookList({ books }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("title-asc");
  const [selectedCategories, setSelectedCategories] = useState<
    string[]
  >([]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();

    books.forEach((book) => {
      book.categories.forEach((category) => {
        categories.add(category);
      });
    });

    return Array.from(categories).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [books]);

  const hasUncategorizedBooks = useMemo(() => {
    return books.some((book) => book.categories.length === 0);
  }, [books]);

  const visibleBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredBooks = books.filter((book) => {
      const matchesSearch =
        !normalizedSearch ||
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch) ||
        book.categories.some((category) =>
          category.toLowerCase().includes(normalizedSearch),
        );

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => {
          if (category === UNCATEGORIZED_FILTER) {
            return book.categories.length === 0;
          }

          return book.categories.includes(category);
        });

      return matchesSearch && matchesCategory;
    });

    return [...filteredBooks].sort((a, b) => {
      switch (sortOption) {
        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "author-asc":
          return a.author.localeCompare(b.author);

        case "author-desc":
          return b.author.localeCompare(a.author);

        case "year-desc":
          if (a.published_year === null) return 1;
          if (b.published_year === null) return -1;

          return b.published_year - a.published_year;

        case "year-asc":
          if (a.published_year === null) return 1;
          if (b.published_year === null) return -1;

          return a.published_year - b.published_year;
      }
    });
  }, [books, searchTerm, selectedCategories, sortOption]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedCategories.length > 0;

  function toggleCategory(category: string) {
    setSelectedCategories((currentCategories) => {
      if (currentCategories.includes(category)) {
        return currentCategories.filter(
          (currentCategory) => currentCategory !== category,
        );
      }

      return [...currentCategories, category];
    });
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategories([]);
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <BookSearch
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          <select
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
            aria-label="Sort books"
            className="h-11 rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-52"
          >
            <option value="title-asc">Title: A–Z</option>
            <option value="title-desc">Title: Z–A</option>
            <option value="author-asc">Author: A–Z</option>
            <option value="author-desc">Author: Z–A</option>
            <option value="year-desc">
              Publication year: Newest
            </option>
            <option value="year-asc">
              Publication year: Oldest
            </option>
          </select>
        </div>

        {(availableCategories.length > 0 ||
          hasUncategorizedBooks) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  Filter by category
                </p>

                <p className="text-xs text-muted-foreground">
                  Books matching any selected category are shown.
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
              {availableCategories.map((category) => {
                const isSelected =
                  selectedCategories.includes(category);

                return (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    aria-pressed={isSelected}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Button>
                );
              })}

              {hasUncategorizedBooks && (
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
                    toggleCategory(UNCATEGORIZED_FILTER)
                  }
                >
                  Uncategorized
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {visibleBooks.length} of {books.length} books
      </p>

      {visibleBooks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {hasActiveFilters
              ? "No books match your current filters."
              : "No books have been added yet."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleBooks.map((book) => (
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
                    <span className="font-medium">Year:</span>{" "}
                    {book.published_year ?? "Unknown"}
                  </p>

                  <div className="space-y-2">
                    <span className="font-medium">
                      Categories:
                    </span>

                    {book.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {book.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {category}
                          </span>
                        ))}
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
  );
}