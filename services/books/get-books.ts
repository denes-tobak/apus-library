import {
  BOOKS_PAGE_SIZE,
  UNCATEGORIZED_FILTER,
  type BookSortOption,
} from "@/lib/books/book-query";
import { createClient } from "@/lib/supabase/server";
import type { Book } from "@/types/book";

export type GetBooksOptions = {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortOption?: BookSortOption;
  selectedCategories?: string[];
};

export type GetBooksResult = {
  books: Book[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error: string | null;
};

export async function getBooks({
  page = 1,
  pageSize = BOOKS_PAGE_SIZE,
  searchTerm = "",
  sortOption = "title-asc",
  selectedCategories = [],
}: GetBooksOptions = {}): Promise<GetBooksResult> {
  const safePage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const safePageSize =
    Number.isInteger(pageSize) && pageSize > 0
      ? pageSize
      : BOOKS_PAGE_SIZE;

  const includeUncategorized =
    selectedCategories.includes(UNCATEGORIZED_FILTER);

  const categories = selectedCategories.filter(
    (category) => category !== UNCATEGORIZED_FILTER,
  );

  const supabase = await createClient();

  let query = supabase.rpc(
    "search_books",
    {
      p_search: searchTerm.trim() || null,
      p_categories: categories,
      p_include_uncategorized: includeUncategorized,
    },
    {
      count: "exact",
    },
  );

  switch (sortOption) {
    case "title-asc":
      query = query
        .order("title", { ascending: true })
        .order("author", { ascending: true });
      break;

    case "title-desc":
      query = query
        .order("title", { ascending: false })
        .order("author", { ascending: true });
      break;

    case "author-asc":
      query = query
        .order("author", { ascending: true })
        .order("title", { ascending: true });
      break;

    case "author-desc":
      query = query
        .order("author", { ascending: false })
        .order("title", { ascending: true });
      break;

    case "year-desc":
      query = query
        .order("published_year", {
          ascending: false,
          nullsFirst: false,
        })
        .order("title", { ascending: true });
      break;

    case "year-asc":
      query = query
        .order("published_year", {
          ascending: true,
          nullsFirst: false,
        })
        .order("title", { ascending: true });
      break;
  }

  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, count, error } = await query
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Failed to load books:", error);

    return {
      books: [],
      totalCount: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 1,
      error: error.message,
    };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / safePageSize),
  );

  return {
    books: (data ?? []) as Book[],
    totalCount,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    error: null,
  };
}