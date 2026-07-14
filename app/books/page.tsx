import Link from "next/link";
import {
  BookOpen,
  LibraryBig,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  getFormatter,
  getTranslations,
} from "next-intl/server";

import { BookList } from "@/components/books/book-list";
import { Button } from "@/components/ui/button";
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

  return Number.isInteger(page) && page > 0
    ? page
    : 1;
}

export default async function BooksPage({
  searchParams,
}: BooksPageProps) {
  const params = await searchParams;

  const page = parsePage(
    getSingleValue(params.page),
  );

  const searchTerm =
    getSingleValue(params.search)?.trim() ?? "";

  const requestedSort =
    getSingleValue(params.sort);

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

  const [
    booksResult,
    categoriesResult,
    t,
    format,
  ] = await Promise.all([
    getBooks({
      page,
      searchTerm,
      sortOption,
      selectedCategories,
    }),
    getBookCategories(),
    getTranslations("Books"),
    getFormatter(),
  ]);

  return (
    <main className="min-h-screen bg-[#f3efe7] text-stone-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-amber-950/10 bg-[#17231f] text-white shadow-[0_28px_80px_-42px_rgba(28,25,23,0.9)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-28 -top-32 size-96 rounded-full border border-white/10" />
            <div className="absolute -right-8 -top-16 size-72 rounded-full border border-white/10" />

            <LibraryBig className="absolute -bottom-20 right-8 size-80 rotate-6 text-white/[0.035]" />
          </div>

          <div className="relative flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
                <Sparkles className="size-3.5" />
                {t("eyebrow")}
              </div>

              <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("title")}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">
                {t("description")}
              </p>

              {!booksResult.error && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-stone-200">
                  <BookOpen className="size-4 text-amber-100" />

                  {t("bookCount", {
                    count: format.number(
                      booksResult.totalCount,
                    ),
                  })}
                </div>
              )}
            </div>

            <Button
              asChild
              size="lg"
              className="w-fit bg-amber-100 text-stone-950 shadow-lg shadow-black/20 hover:bg-amber-50"
            >
              <Link href="/books/new">
                <Plus className="size-4" />
                {t("addBook")}
              </Link>
            </Button>
          </div>
        </div>

        {booksResult.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-red-800 shadow-sm">
            {t("loadError", {
              error: booksResult.error,
            })}
          </div>
        ) : (
          <>
            {categoriesResult.error && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                {t("categoryUnavailable")}
              </div>
            )}

            <BookList
              books={booksResult.books}
              totalCount={booksResult.totalCount}
              page={booksResult.page}
              pageSize={booksResult.pageSize}
              totalPages={booksResult.totalPages}
              searchTerm={searchTerm}
              sortOption={sortOption}
              selectedCategories={
                selectedCategories
              }
              categories={
                categoriesResult.categories
              }
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