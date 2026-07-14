"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  BookOpenText,
  CalendarDays,
  Hash,
  Loader2,
  Save,
  Tags,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BOOK_CATEGORIES } from "@/lib/books/book-categories";
import type {
  BookFormState,
  BookFormValues,
} from "@/types/book-form";

type BookFormAction = (
  state: BookFormState,
  formData: FormData,
) => Promise<BookFormState>;

type BookFormProps = {
  action: BookFormAction;
  submitLabel: string;
  initialValues?: BookFormValues;
  cancelHref?: string;
};

const emptyValues: BookFormValues = {
  title: "",
  author: "",
  published_year: "",
  categories: [],
  series_number: "",
};

const inputClassName =
  "h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-stone-100";

export function BookForm({
  action,
  submitLabel,
  initialValues = emptyValues,
  cancelHref,
}: BookFormProps) {
  const t = useTranslations("BookForm");
  const categoryT = useTranslations("Categories");

  const [state, formAction, isPending] =
    useActionState(action, {
      values: initialValues,
      errors: {},
    });

  const categoryOptions = Array.from(
    new Set([
      ...BOOK_CATEGORIES,
      ...state.values.categories,
    ]),
  );

  const getInputClassName = (
    hasError: boolean,
  ) =>
    `${inputClassName} ${
      hasError
        ? "border-red-400 focus:border-red-600 focus:ring-red-100"
        : ""
    }`;

  return (
    <form action={formAction} className="space-y-8">
      {state.errors.form && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />

          <p className="leading-6">
            {state.errors.form}
          </p>
        </div>
      )}

      <section className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
            <BookOpenText className="size-5" />
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold text-stone-950">
              {t("basicInformation")}
            </h3>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              {t("basicInformationDescription")}
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <BookOpenText className="size-4 text-stone-400" />
              {t("title")}
            </label>

            <input
              id="title"
              name="title"
              type="text"
              defaultValue={state.values.title}
              required
              autoFocus
              disabled={isPending}
              placeholder={t("titlePlaceholder")}
              aria-invalid={Boolean(
                state.errors.title,
              )}
              aria-describedby={
                state.errors.title
                  ? "title-error"
                  : undefined
              }
              className={getInputClassName(
                Boolean(state.errors.title),
              )}
            />

            {state.errors.title && (
              <p
                id="title-error"
                className="flex items-center gap-1.5 text-sm text-red-700"
              >
                <AlertCircle className="size-4" />
                {state.errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="author"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <UserRound className="size-4 text-stone-400" />
              {t("author")}
            </label>

            <input
              id="author"
              name="author"
              type="text"
              defaultValue={state.values.author}
              required
              disabled={isPending}
              placeholder={t("authorPlaceholder")}
              aria-invalid={Boolean(
                state.errors.author,
              )}
              aria-describedby={
                state.errors.author
                  ? "author-error"
                  : undefined
              }
              className={getInputClassName(
                Boolean(state.errors.author),
              )}
            />

            {state.errors.author && (
              <p
                id="author-error"
                className="flex items-center gap-1.5 text-sm text-red-700"
              >
                <AlertCircle className="size-4" />
                {state.errors.author}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="h-px bg-stone-200" />

      <section className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
            <CalendarDays className="size-5" />
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold text-stone-950">
              {t("publicationDetails")}
            </h3>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              {t("publicationDetailsDescription")}
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="published_year"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <CalendarDays className="size-4 text-stone-400" />
              {t("publicationYear")}
            </label>

            <input
              id="published_year"
              name="published_year"
              type="number"
              min="1"
              max="9999"
              step="1"
              inputMode="numeric"
              defaultValue={
                state.values.published_year
              }
              disabled={isPending}
              placeholder={t(
                "publicationYearPlaceholder",
              )}
              aria-invalid={Boolean(
                state.errors.published_year,
              )}
              aria-describedby={
                state.errors.published_year
                  ? "published-year-error"
                  : undefined
              }
              className={getInputClassName(
                Boolean(
                  state.errors.published_year,
                ),
              )}
            />

            {state.errors.published_year && (
              <p
                id="published-year-error"
                className="flex items-center gap-1.5 text-sm text-red-700"
              >
                <AlertCircle className="size-4" />
                {state.errors.published_year}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="series_number"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <Hash className="size-4 text-stone-400" />
              {t("seriesNumber")}
            </label>

            <input
              id="series_number"
              name="series_number"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              defaultValue={
                state.values.series_number
              }
              disabled={isPending}
              placeholder={t(
                "seriesNumberPlaceholder",
              )}
              aria-invalid={Boolean(
                state.errors.series_number,
              )}
              aria-describedby={
                state.errors.series_number
                  ? "series-number-error"
                  : undefined
              }
              className={getInputClassName(
                Boolean(
                  state.errors.series_number,
                ),
              )}
            />

            {state.errors.series_number && (
              <p
                id="series-number-error"
                className="flex items-center gap-1.5 text-sm text-red-700"
              >
                <AlertCircle className="size-4" />
                {state.errors.series_number}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="h-px bg-stone-200" />

      <fieldset className="space-y-5">
        <legend className="sr-only">
          {t("categories")}
        </legend>

        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <Tags className="size-5" />
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold text-stone-950">
              {t("categories")}
            </h3>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              {t("categoriesDescription")}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categoryOptions.map((category) => {
            const categoryLabel =
              categoryT.has(category)
                ? categoryT(category)
                : category;

            return (
              <label
                key={category}
                className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-stone-700 transition hover:border-amber-300 hover:bg-amber-50/60 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 has-[:checked]:font-medium has-[:checked]:text-amber-950"
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={category}
                  defaultChecked={state.values.categories.includes(
                    category,
                  )}
                  disabled={isPending}
                  className="size-4 shrink-0 cursor-pointer accent-amber-800 disabled:cursor-not-allowed"
                />

                <span>{categoryLabel}</span>
              </label>
            );
          })}
        </div>

        {state.errors.categories && (
          <p className="flex items-center gap-1.5 text-sm text-red-700">
            <AlertCircle className="size-4" />
            {state.errors.categories}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
        {cancelHref && (
          <Button
            asChild
            type="button"
            variant="outline"
            className="border-stone-300 bg-white"
          >
            <Link href={cancelHref}>
              <X className="size-4" />
              {t("cancel")}
            </Link>
          </Button>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#17231f] text-amber-50 shadow-md shadow-stone-950/10 hover:bg-[#22312b]"
        >
          {isPending ? (
            <>
              <Loader2
                aria-hidden="true"
                className="size-4 animate-spin"
              />
              {t("saving")}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}