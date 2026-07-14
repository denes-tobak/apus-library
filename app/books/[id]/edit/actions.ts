"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { validateBookForm } from "@/lib/books/validate-book-form";
import { createClient } from "@/lib/supabase/server";
import type { BookFormState } from "@/types/book-form";

export async function updateBook(
  bookId: number,
  _previousState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const t = await getTranslations(
    "BookForm.errors",
  );

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
        form: t("bookNotIdentified"),
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
        form: t("sessionExpired"),
      },
    };
  }

  const { data: updatedBook, error } =
    await supabase
      .from("books")
      .update({
        ...validation.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)
      .select("id")
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to update book:",
      error,
    );

    return {
      values: validation.values,
      errors: {
        form: t("updateFailed"),
      },
    };
  }

  if (!updatedBook) {
    return {
      values: validation.values,
      errors: {
        form: t("bookMissing"),
      },
    };
  }

  revalidatePath("/books");
  revalidatePath(`/books/${bookId}`);
  revalidatePath(`/books/${bookId}/edit`);

  redirect(`/books/${bookId}`);
}