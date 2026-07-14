"use client";

import { useMemo, useState } from "react";

import { BookSearch } from "@/components/books/book-search";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Book } from "@/types/book";
import Link from "next/link";

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

export function BookList({ books }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("title-asc");

  const visibleBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredBooks = normalizedSearch
      ? books.filter((book) => {
          return (
            book.title.toLowerCase().includes(normalizedSearch) ||
            book.author.toLowerCase().includes(normalizedSearch) ||
            book.category
              ?.toLowerCase()
              .includes(normalizedSearch)
          );
        })
      : books;

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
  }, [books, searchTerm, sortOption]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
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

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {visibleBooks.length} of {books.length} books
      </p>

      {visibleBooks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No books match your search.
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

      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Year:</span>{" "}
          {book.published_year ?? "Unknown"}
        </p>

        <p>
          <span className="font-medium">Category:</span>{" "}
          {book.category ?? "Uncategorized"}
        </p>

        {book.series_number !== null &&
          book.series_number > 0 && (
            <p>
              <span className="font-medium">Series:</span>{" "}
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