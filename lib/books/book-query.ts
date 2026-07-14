export const BOOKS_PAGE_SIZE = 24;

export const UNCATEGORIZED_FILTER = "__uncategorized__";

export const BOOK_SORT_OPTIONS = [
  "title-asc",
  "title-desc",
  "author-asc",
  "author-desc",
  "year-desc",
  "year-asc",
] as const;

export type BookSortOption =
  (typeof BOOK_SORT_OPTIONS)[number];

export function isBookSortOption(
  value: unknown,
): value is BookSortOption {
  return (
    typeof value === "string" &&
    BOOK_SORT_OPTIONS.includes(value as BookSortOption)
  );
}