"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Hash,
  LibraryBig,
  Loader2,
  SlidersHorizontal,
  Tags,
  X,
} from "lucide-react";
import {
  useFormatter,
  useLocale,
  useTranslations,
} from "next-intl";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { BookPagination } from "@/components/books/book-pagination";
import { BookSearch } from "@/components/books/book-search";
import { Button } from "@/components/ui/button";
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

  const locale = useLocale();
  const t = useTranslations("Books");
  const categoryT = useTranslations("Categories");
  const format = useFormatter();

  const [searchValue, setSearchValue] =
    useState(searchTerm);

  const [isPending, startTransition] =
    useTransition();

  const categoryCollator = useMemo(
    () =>
      new Intl.Collator(locale, {
        sensitivity: "base",
      }),
    [locale],
  );

  const getCategoryLabel = useCallback(
    (category: string) =>
      categoryT.has(category)
        ? categoryT(category)
        : category,
    [categoryT],
  );

  const sortedCategories = useMemo(
    () =>
      [...categories].sort(
        (firstCategory, secondCategory) =>
          categoryCollator.compare(
            getCategoryLabel(
              firstCategory.name,
            ),
            getCategoryLabel(
              secondCategory.name,
            ),
          ),
      ),
    [
      categories,
      categoryCollator,
      getCategoryLabel,
    ],
  );

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
    const normalizedSearch =
      searchValue.trim();

    if (normalizedSearch === searchTerm) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString(),
      );

      if (normalizedSearch) {
        params.set(
          "search",
          normalizedSearch,
        );
      } else {
        params.delete("search");
      }

      params.delete("page");

      navigate(params, "replace");
    }, 350);

    return () =>
      window.clearTimeout(timeout);
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
        : [
            ...selectedCategories,
            category,
          ];

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("category");

    nextCategories.forEach(
      (selectedCategory) => {
        params.append(
          "category",
          selectedCategory,
        );
      },
    );

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

  return (
    <div
      aria-busy={isPending}
      className="space-y-6"
    >
      <section className="overflow-hidden rounded-3xl border border-amber-950/10 bg-white shadow-[0_22px_65px_-40px_rgba(41,37,36,0.55)]">
        <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#17231f] text-amber-100">
              <SlidersHorizontal className="size-5" />
            </div>

            <div>
              <h2 className="font-serif text-xl font-semibold text-stone-950">
                {t("filtersTitle")}
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                {t("filtersDescription")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row">
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
                  event.target
                    .value as BookSortOption,
                )
              }
              aria-label={t("sortAriaLabel")}
              className="h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm text-stone-900 outline-none transition hover:border-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100 lg:w-64"
            >
              <option value="title-asc">
                {t("sortTitleAsc")}
              </option>

              <option value="title-desc">
                {t("sortTitleDesc")}
              </option>

              <option value="author-asc">
                {t("sortAuthorAsc")}
              </option>

              <option value="author-desc">
                {t("sortAuthorDesc")}
              </option>

              <option value="year-desc">
                {t("sortYearDesc")}
              </option>

              <option value="year-asc">
                {t("sortYearAsc")}
              </option>
            </select>
          </div>

          {(categories.length > 0 ||
            uncategorizedCount > 0) && (
            <div className="space-y-4 border-t border-stone-200 pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-stone-900">
                    {t("categoryFilter")}
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    {t(
                      "categoryFilterDescription",
                    )}
                  </p>
                </div>

                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="w-fit text-stone-600 hover:bg-amber-100 hover:text-amber-950"
                  >
                    <X className="size-4" />
                    {t("clearFilters")}
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {sortedCategories.map(
                  (category) => {
                    const isSelected =
                      selectedCategories.includes(
                        category.name,
                      );

                    return (
                      <button
                        key={category.name}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          toggleCategory(
                            category.name,
                          )
                        }
                        className={
                          isSelected
                            ? "inline-flex items-center gap-2 rounded-full border border-[#17231f] bg-[#17231f] px-3.5 py-2 text-sm font-medium text-amber-50 shadow-sm transition hover:bg-[#22312b]"
                            : "inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-950"
                        }
                      >
                        {getCategoryLabel(
                          category.name,
                        )}

                        <span
                          className={
                            isSelected
                              ? "rounded-full bg-white/10 px-1.5 py-0.5 text-xs text-amber-100"
                              : "rounded-full bg-stone-100 px-1.5 py-0.5 text-xs text-stone-500"
                          }
                        >
                          {format.number(
                            category.bookCount,
                          )}
                        </span>
                      </button>
                    );
                  },
                )}

                {uncategorizedCount > 0 && (
                  <button
                    type="button"
                    aria-pressed={selectedCategories.includes(
                      UNCATEGORIZED_FILTER,
                    )}
                    onClick={() =>
                      toggleCategory(
                        UNCATEGORIZED_FILTER,
                      )
                    }
                    className={
                      selectedCategories.includes(
                        UNCATEGORIZED_FILTER,
                      )
                        ? "inline-flex items-center gap-2 rounded-full border border-[#17231f] bg-[#17231f] px-3.5 py-2 text-sm font-medium text-amber-50 shadow-sm transition hover:bg-[#22312b]"
                        : "inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-950"
                    }
                  >
                    {t("uncategorized")}

                    <span className="rounded-full bg-current/10 px-1.5 py-0.5 text-xs opacity-70">
                      {format.number(
                        uncategorizedCount,
                      )}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="flex min-h-6 flex-col gap-2 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {totalCount === 0
            ? t("resultsZero")
            : t("resultsRange", {
                first: format.number(
                  firstVisibleBook,
                ),
                last: format.number(
                  lastVisibleBook,
                ),
                total: format.number(
                  totalCount,
                ),
              })}
        </p>

        <div
          aria-live="polite"
          className="min-h-5"
        >
          {isPending && (
            <p className="flex items-center gap-2 font-medium text-amber-900">
              <Loader2 className="size-4 animate-spin" />
              {t("updatingResults")}
            </p>
          )}
        </div>
      </div>

      <div
        className={
          isPending
            ? "opacity-55 transition-opacity"
            : "transition-opacity"
        }
      >
        {books.length === 0 ? (
          <div className="rounded-3xl border border-amber-950/10 bg-white px-6 py-16 text-center shadow-[0_20px_60px_-38px_rgba(41,37,36,0.5)]">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <LibraryBig className="size-8" />
            </div>

            <h2 className="mt-5 font-serif text-2xl font-semibold text-stone-950">
              {hasActiveFilters
                ? t("noMatches")
                : t("noBooks")}
            </h2>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => {
              const bookCategories =
                Array.isArray(book.categories)
                  ? [...book.categories].sort(
                      (
                        firstCategory,
                        secondCategory,
                      ) =>
                        categoryCollator.compare(
                          getCategoryLabel(
                            firstCategory,
                          ),
                          getCategoryLabel(
                            secondCategory,
                          ),
                        ),
                    )
                  : [];

              const visibleCategories =
                bookCategories.slice(0, 3);

              const remainingCategories =
                Math.max(
                  bookCategories.length - 3,
                  0,
                );

              const titleInitial =
                book.title
                  .trim()
                  .charAt(0)
                  .toUpperCase() || "A";

              return (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  aria-label={t("viewDetails", {
                    title: book.title,
                  })}
                  className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                >
                  <article className="relative flex h-full min-h-72 flex-col overflow-hidden rounded-2xl border border-amber-950/10 bg-white p-5 shadow-[0_18px_50px_-34px_rgba(41,37,36,0.45)] transition duration-300 group-hover:-translate-y-1 group-hover:border-amber-300 group-hover:shadow-[0_26px_65px_-34px_rgba(41,37,36,0.6)]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-700 via-amber-300 to-transparent opacity-60" />

                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#17231f] font-serif text-xl font-semibold text-amber-100 shadow-sm">
                        {titleInitial}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="line-clamp-2 font-serif text-xl font-semibold leading-snug text-stone-950">
                          {book.title}
                        </h2>

                        <p className="mt-1 line-clamp-1 text-sm text-stone-500">
                          {book.author}
                        </p>
                      </div>

                      <ArrowUpRight className="size-5 shrink-0 text-stone-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-800" />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-stone-50 px-3 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                          <CalendarDays className="size-3.5" />
                          {t("year")}
                        </div>

                        <p className="mt-1 text-sm font-medium text-stone-900">
                          {book.published_year ??
                            t("unknown")}
                        </p>
                      </div>

                      <div className="rounded-xl bg-stone-50 px-3 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                          <Hash className="size-3.5" />
                          {t("series")}
                        </div>

                        <p className="mt-1 text-sm font-medium text-stone-900">
                          {book.series_number !==
                            null &&
                          book.series_number > 0
                            ? `#${book.series_number}`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex-1">
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                        <Tags className="size-3.5" />
                        {t("categories")}
                      </div>

                      {visibleCategories.length >
                      0 ? (
                        <div className="flex flex-wrap gap-2">
                          {visibleCategories.map(
                            (category) => (
                              <span
                                key={category}
                                className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-950"
                              >
                                {getCategoryLabel(
                                  category,
                                )}
                              </span>
                            ),
                          )}

                          {remainingCategories > 0 && (
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-500">
                              {t("moreCategories", {
                                count:
                                  remainingCategories,
                              })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-500">
                          {t("uncategorized")}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm">
                      <span className="flex items-center gap-2 font-medium text-stone-700">
                        <BookOpen className="size-4 text-amber-800" />
                        {t("viewBook")}
                      </span>

                      <ArrowUpRight className="size-4 text-stone-300 group-hover:text-amber-800" />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BookPagination
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}