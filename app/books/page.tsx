import Link from "next/link";
import { Plus } from "lucide-react";

import { BookList } from "@/components/books/book-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  isBookSortOption,
  type BookSortOption,
} from "@/lib/books/book-query";
import { getBookCategories } from "@/services/books/get-book-categories";
import { getBooks } from "@/services/books/get-books";

type BooksPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    sort?: string | string[];
    category?: string | string[];
  }>;
};

function getSingleValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

function getMultipleValues(
  value: string | string[] | undefined,
) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function parsePage(value: string | undefined) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function BooksPage({
  searchParams,
}: BooksPageProps) {
  const params = await searchParams;

  const page = parsePage(getSingleValue(params.page));

  const searchTerm =
    getSingleValue(params.search)?.trim() ?? "";

  const requestedSort = getSingleValue(params.sort);

  const sortOption: BookSortOption =
    isBookSortOption(requestedSort)
      ? requestedSort
      : "title-asc";

  const selectedCategories = Array.from(
    new Set(
      getMultipleValues(params.category)
        .map((category) => category.trim())
        .filter(Boolean),
    ),
  );

  const [booksResult, categoriesResult] =
    await Promise.all([
      getBooks({
        page,
        searchTerm,
        sortOption,
        selectedCategories,
      }),
      getBookCategories(),
    ]);

  return (
    <main className="min-h-screen bg-muted/40">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Books
            </h1>

            <p className="text-muted-foreground">
              Browse and manage your library.
            </p>
          </div>

          <Button asChild>
            <Link href="/books/new">
              <Plus className="size-4" />
              Add book
            </Link>
          </Button>
        </div>

        {booksResult.error ? (
          <Card className="border-destructive">
            <CardContent className="py-6 text-destructive">
              Failed to load books: {booksResult.error}
            </CardContent>
          </Card>
        ) : (
          <>
            {categoriesResult.error && (
              <Card className="mb-6">
                <CardContent className="py-4 text-sm text-muted-foreground">
                  Category filters are temporarily unavailable.
                </CardContent>
              </Card>
            )}

            <BookList
              books={booksResult.books}
              totalCount={booksResult.totalCount}
              page={booksResult.page}
              pageSize={booksResult.pageSize}
              totalPages={booksResult.totalPages}
              searchTerm={searchTerm}
              sortOption={sortOption}
              selectedCategories={selectedCategories}
              categories={categoriesResult.categories}
              uncategorizedCount={
                categoriesResult.uncategorizedCount
              }
            />
          </>
        )}
      </section>
    </main>
  );
}