import { createClient } from "@/lib/supabase/server";

export type BookCategoryOption = {
  name: string;
  bookCount: number;
};

export type GetBookCategoriesResult = {
  categories: BookCategoryOption[];
  uncategorizedCount: number;
  error: string | null;
};

type CategoryRow = {
  category: string | null;
  book_count: number | string;
};

export async function getBookCategories(): Promise<GetBookCategoriesResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_library_categories",
  );

  if (error) {
    console.error("Failed to load book categories:", error);

    return {
      categories: [],
      uncategorizedCount: 0,
      error: error.message,
    };
  }

  const rows = (data ?? []) as CategoryRow[];

  const categories = rows
    .filter(
      (
        row,
      ): row is CategoryRow & {
        category: string;
      } => row.category !== null,
    )
    .map((row) => ({
      name: row.category,
      bookCount: Number(row.book_count),
    }));

  const uncategorizedRow = rows.find(
    (row) => row.category === null,
  );

  return {
    categories,
    uncategorizedCount: uncategorizedRow
      ? Number(uncategorizedRow.book_count)
      : 0,
    error: null,
  };
}