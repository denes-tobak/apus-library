import type {
  BookFormErrors,
  BookFormValues,
} from "@/types/book-form";

export type BookWriteValues = {
  title: string;
  author: string;
  published_year: number | null;
  categories: string[];
  series_number: number | null;
};

export type BookFormValidationMessages = {
  titleRequired: string;
  authorRequired: string;
  invalidPublishedYear: string;
  invalidSeriesNumber: string;
  tooManyCategories: string;
  categoryNameTooLong: string;
};

type BookFormValidationResult = {
  values: BookFormValues;
  errors: BookFormErrors;
  data: BookWriteValues | null;
};

const DEFAULT_VALIDATION_MESSAGES: BookFormValidationMessages = {
  titleRequired: "Title is required.",
  authorRequired: "Author is required.",
  invalidPublishedYear: "Enter a valid publication year.",
  invalidSeriesNumber:
    "Series number must be a positive whole number.",
  tooManyCategories:
    "A book can have a maximum of 10 categories.",
  categoryNameTooLong:
    "Category names cannot exceed 50 characters.",
};

function getTextValue(
  formData: FormData,
  field: keyof BookFormValues,
) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function getCategories(formData: FormData) {
  const categories = formData
    .getAll("categories")
    .filter(
      (value): value is string =>
        typeof value === "string",
    )
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set(categories)];
}

export function validateBookForm(
  formData: FormData,
  messages: BookFormValidationMessages =
    DEFAULT_VALIDATION_MESSAGES,
): BookFormValidationResult {
  const values: BookFormValues = {
    title: getTextValue(formData, "title"),
    author: getTextValue(formData, "author"),
    published_year: getTextValue(
      formData,
      "published_year",
    ),
    categories: getCategories(formData),
    series_number: getTextValue(
      formData,
      "series_number",
    ),
  };

  const errors: BookFormErrors = {};

  if (!values.title) {
    errors.title = messages.titleRequired;
  }

  if (!values.author) {
    errors.author = messages.authorRequired;
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
      messages.invalidPublishedYear;
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
      messages.invalidSeriesNumber;
  }

  if (values.categories.length > 10) {
    errors.categories = messages.tooManyCategories;
  }

  if (
    values.categories.some(
      (category) => category.length > 50,
    )
  ) {
    errors.categories = messages.categoryNameTooLong;
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
      categories: values.categories,
      series_number: seriesNumber,
    },
  };
}