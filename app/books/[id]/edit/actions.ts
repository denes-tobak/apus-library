"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateBookForm } from "@/lib/books/validate-book-form";
import { createClient } from "@/lib/supabase/server";
import type { BookFormState } from "@/types/book-form";

export async function updateBook(
  bookId: number,
  _previousState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const validation = validateBookForm(formData);

  if (!validation.data) {
    return {
      values: validation.values,
      errors: validation.errors,
    };
  }

  if (!Number.isInteger(bookId) || bookId < 1) {
    return {
      values: validation.values,
      errors: {
        form: "This book could not be identified.",
      },
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      values: validation.values,
      errors: {
        form: "Your session has expired. Please log in again.",
      },
    };
  }

  const { data: updatedBook, error } = await supabase
    .from("books")
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update book:", error);

    return {
      values: validation.values,
      errors: {
        form: "The book could not be updated. Please try again.",
      },
    };
  }

  if (!updatedBook) {
    return {
      values: validation.values,
      errors: {
        form: "This book no longer exists or cannot be updated.",
      },
    };
  }

  revalidatePath("/books");
  revalidatePath(`/books/${bookId}`);

  redirect(`/books/${bookId}`);
}