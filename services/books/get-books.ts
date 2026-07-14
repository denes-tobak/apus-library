import { createClient } from "@/lib/supabase/server";
import type { Book } from "@/types/book";

export type GetBooksResult = {
  books: Book[];
  error: string | null;
};

export async function getBooks(): Promise<GetBooksResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select(
      `
        id,
        title,
        author,
        published_year,
        categories,
        series_number,
        created_at,
        updated_at
      `,
    )
    .order("title", { ascending: true });

  if (error) {
    console.error("Failed to load books:", error);

    return {
      books: [],
      error: error.message,
    };
  }

  return {
    books: (data ?? []) as Book[],
    error: null,
  };
}