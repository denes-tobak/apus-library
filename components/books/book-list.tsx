"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Book } from "@/types/book";

type BookListProps = {
  books: Book[];
};

export function BookList({ books }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return books;
    }

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch) ||
        book.category?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [books, searchTerm]);

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by title, author or category..."
          className="h-11 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filteredBooks.length} of {books.length} books
      </p>

      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No books match your search.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>

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

                {book.series_number !== null && book.series_number > 0 && (
                  <p>
                    <span className="font-medium">Series:</span>{" "}
                    #{book.series_number}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}