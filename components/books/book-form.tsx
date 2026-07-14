"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
};

const emptyValues: BookFormValues = {
  title: "",
  author: "",
  published_year: "",
  category: "",
  series_number: "",
};

const inputClassName =
  "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function BookForm({
  action,
  submitLabel,
  initialValues = emptyValues,
}: BookFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    values: initialValues,
    errors: {},
  });

  return (
    <form action={formAction} className="space-y-6">
      {state.errors.form && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.errors.form}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.values.title}
          required
          autoFocus
          aria-invalid={Boolean(state.errors.title)}
          aria-describedby={
            state.errors.title ? "title-error" : undefined
          }
          className={inputClassName}
        />

        {state.errors.title && (
          <p
            id="title-error"
            className="text-sm text-destructive"
          >
            {state.errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="author" className="text-sm font-medium">
          Author
        </label>

        <input
          id="author"
          name="author"
          type="text"
          defaultValue={state.values.author}
          required
          aria-invalid={Boolean(state.errors.author)}
          aria-describedby={
            state.errors.author ? "author-error" : undefined
          }
          className={inputClassName}
        />

        {state.errors.author && (
          <p
            id="author-error"
            className="text-sm text-destructive"
          >
            {state.errors.author}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="published_year"
            className="text-sm font-medium"
          >
            Publication year
          </label>

          <input
            id="published_year"
            name="published_year"
            type="number"
            min="1"
            max="9999"
            step="1"
            defaultValue={state.values.published_year}
            placeholder="Optional"
            aria-invalid={Boolean(
              state.errors.published_year,
            )}
            aria-describedby={
              state.errors.published_year
                ? "published-year-error"
                : undefined
            }
            className={inputClassName}
          />

          {state.errors.published_year && (
            <p
              id="published-year-error"
              className="text-sm text-destructive"
            >
              {state.errors.published_year}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="series_number"
            className="text-sm font-medium"
          >
            Series number
          </label>

          <input
            id="series_number"
            name="series_number"
            type="number"
            min="1"
            step="1"
            defaultValue={state.values.series_number}
            placeholder="Optional"
            aria-invalid={Boolean(
              state.errors.series_number,
            )}
            aria-describedby={
              state.errors.series_number
                ? "series-number-error"
                : undefined
            }
            className={inputClassName}
          />

          {state.errors.series_number && (
            <p
              id="series-number-error"
              className="text-sm text-destructive"
            >
              {state.errors.series_number}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>

        <input
          id="category"
          name="category"
          type="text"
          defaultValue={state.values.category}
          placeholder="Optional"
          aria-invalid={Boolean(state.errors.category)}
          aria-describedby={
            state.errors.category
              ? "category-error"
              : undefined
          }
          className={inputClassName}
        />

        {state.errors.category && (
          <p
            id="category-error"
            className="text-sm text-destructive"
          >
            {state.errors.category}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && (
          <Loader2
            aria-hidden="true"
            className="size-4 animate-spin"
          />
        )}

        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}