"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type {
  BookFormErrors,
  BookFormState,
  BookFormValues,
} from "@/types/book-form";

function getTextValue(
  formData: FormData,
  field: keyof BookFormValues,
) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

export async function addBook(
  _previousState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const values: BookFormValues = {
    title: getTextValue(formData, "title"),
    author: getTextValue(formData, "author"),
    published_year: getTextValue(
      formData,
      "published_year",
    ),
    category: getTextValue(formData, "category"),
    series_number: getTextValue(
      formData,
      "series_number",
    ),
  };

  const errors: BookFormErrors = {};

  if (!values.title) {
    errors.title = "Title is required.";
  }

  if (!values.author) {
    errors.author = "Author is required.";
  }

  const publishedYear = values.published_year
    ? Number(values.published_year)
    : null;

  if (
    publishedYear !== null &&
    (!Number.isInteger(publishedYear) ||
      publishedYear < 1 ||
      publishedYear > 9999)
  ) {
    errors.published_year =
      "Enter a valid publication year.";
  }

  const seriesNumber = values.series_number
    ? Number(values.series_number)
    : null;

  if (
    seriesNumber !== null &&
    (!Number.isInteger(seriesNumber) ||
      seriesNumber < 1)
  ) {
    errors.series_number =
      "Series number must be a positive whole number.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      values,
      errors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      values,
      errors: {
        form: "Your session has expired. Please log in again.",
      },
    };
  }

  const { data: book, error } = await supabase
    .from("books")
    .insert({
      title: values.title,
      author: values.author,
      published_year: publishedYear,
      category: values.category || null,
      series_number: seriesNumber,
    })
    .select("id")
    .single();

  if (error || !book) {
    console.error("Failed to add book:", error);

    return {
      values,
      errors: {
        form: "The book could not be added. Please try again.",
      },
    };
  }

  revalidatePath("/books");
  redirect(`/books/${book.id}`);
}