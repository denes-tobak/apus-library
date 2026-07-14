import type {
  BookFormErrors,
  BookFormValues,
} from "@/types/book-form";

export type BookWriteValues = {
  title: string;
  author: string;
  published_year: number | null;
  category: string | null;
  series_number: number | null;
};

type BookFormValidationResult = {
  values: BookFormValues;
  errors: BookFormErrors;
  data: BookWriteValues | null;
};

function getTextValue(
  formData: FormData,
  field: keyof BookFormValues,
) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

export function validateBookForm(
  formData: FormData,
): BookFormValidationResult {
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
      data: null,
    };
  }

  return {
    values,
    errors: {},
    data: {
      title: values.title,
      author: values.author,
      published_year: publishedYear,
      category: values.category || null,
      series_number: seriesNumber,
    },
  };
}