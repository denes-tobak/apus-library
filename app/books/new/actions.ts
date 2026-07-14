"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { validateBookForm } from "@/lib/books/validate-book-form";
import { createClient } from "@/lib/supabase/server";
import type { BookFormState } from "@/types/book-form";

export async function addBook(
  _previousState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const validationT = await getTranslations(
    "BookValidation",
  );
  const errorT = await getTranslations(
    "BookForm.errors",
  );

  const validation = validateBookForm(formData, {
    titleRequired: validationT("titleRequired"),
    authorRequired: validationT("authorRequired"),
    invalidPublishedYear: validationT(
      "invalidPublishedYear",
    ),
    invalidSeriesNumber: validationT(
      "invalidSeriesNumber",
    ),
    tooManyCategories: validationT(
      "tooManyCategories",
    ),
    categoryNameTooLong: validationT(
      "categoryNameTooLong",
    ),
  });

  if (!validation.data) {
    return {
      values: validation.values,
      errors: validation.errors,
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
        form: errorT("sessionExpired"),
      },
    };
  }

  const { data: book, error } = await supabase
    .from("books")
    .insert(validation.data)
    .select("id")
    .single();

  if (error || !book) {
    console.error("Failed to add book:", error);

    return {
      values: validation.values,
      errors: {
        form: errorT("addFailed"),
      },
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/books");

  redirect(`/books/${book.id}`);
}