"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type DeleteBookState = {
  error: string | null;
};

export async function deleteBook(
  bookId: number,
  _previousState: DeleteBookState,
  _formData: FormData,
): Promise<DeleteBookState> {
  if (!Number.isInteger(bookId) || bookId < 1) {
    return {
      error: "This book could not be identified.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: "Your session has expired. Please log in again.",
    };
  }

  const { data: deletedBook, error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete book:", error);

    return {
      error: "The book could not be deleted. Please try again.",
    };
  }

  if (!deletedBook) {
    return {
      error: "This book no longer exists or cannot be deleted.",
    };
  }

  revalidatePath("/books");
  redirect("/books");
}