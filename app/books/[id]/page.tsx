import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  Hash,
  Layers3,
  Pencil,
  Sparkles,
  Tags,
  UserRound,
} from "lucide-react";
import {
  getFormatter,
  getTranslations,
} from "next-intl/server";

import { DeleteBookButton } from "@/components/books/delete-book-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type BookDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (!Number.isInteger(bookId) || bookId < 1) {
    notFound();
  }

  const [supabase, t, categoryT, format] =
    await Promise.all([
      createClient(),
      getTranslations("BookDetails"),
      getTranslations("Categories"),
      getFormatter(),
    ]);

  const { data: book, error } = await supabase
  .from("books")
  .select(
    `
      id,
      title,
      author,
      published_year,
      categories,
      series_number,
      cover_path,
      created_at,
      updated_at
    `,
  )
  .eq("id", bookId)
  .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load book details: ${error.message}`,
    );
  }

  if (!book) {
    notFound();
  }

  const categories: string[] = Array.isArray(
    book.categories,
  )
    ? book.categories
    : [];

  const getCategoryLabel = (category: string) =>
    categoryT.has(category)
      ? categoryT(category)
      : category;

  const publicationYear =
    book.published_year ?? t("unknown");

  const seriesNumber =
    book.series_number !== null &&
    book.series_number > 0
      ? `#${book.series_number}`
      : t("notPartOfSeries");

  const createdDate = format.dateTime(
    new Date(book.created_at),
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const updatedDate = book.updated_at
    ? format.dateTime(new Date(book.updated_at), {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : createdDate;

  const titleInitial =
    book.title.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-950/10 bg-white/90 p-3 shadow-[0_16px_45px_-32px_rgba(41,37,36,0.65)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Button
          asChild
          variant="outline"
          className="h-11 w-fit rounded-xl border-stone-200 bg-white px-4 text-stone-700 shadow-sm hover:border-amber-300 hover:bg-amber-50 hover:text-amber-950"
        >
          <Link href="/books">
            <ArrowLeft className="size-4" />
            {t("backToBooks")}
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-amber-200 bg-amber-50 px-4 font-medium text-amber-950 shadow-sm hover:border-amber-300 hover:bg-amber-100"
          >
            <Link href={`/books/${book.id}/edit`}>
              <Pencil className="size-4" />
              {t("editBook")}
            </Link>
          </Button>

          <DeleteBookButton
            bookId={book.id}
            bookTitle={book.title}
          />
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-amber-950/10 bg-[#17231f] text-white shadow-[0_28px_80px_-42px_rgba(28,25,23,0.9)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-32 size-96 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-16 size-72 rounded-full border border-white/10" />

          <div className="absolute bottom-0 left-1/3 h-px w-96 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />

          <BookOpen className="absolute -bottom-14 right-8 size-72 rotate-6 text-white/[0.035]" />
        </div>

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12 lg:p-12">
          <div className="mx-auto w-full max-w-[210px] lg:mx-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-r-2xl rounded-l-md border border-amber-100/20 bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200 shadow-[16px_22px_45px_-18px_rgba(0,0,0,0.75)]">
              <div className="absolute inset-y-0 left-0 w-4 border-r border-amber-950/20 bg-amber-900/20" />

              <div className="absolute inset-x-6 top-7 h-px bg-amber-950/20" />
              <div className="absolute inset-x-6 bottom-7 h-px bg-amber-950/20" />

              <div className="flex h-full flex-col items-center justify-center px-8 text-center text-stone-900">
                <div className="flex size-16 items-center justify-center rounded-full border border-amber-950/20 bg-white/50 font-serif text-3xl font-semibold shadow-sm">
                  {titleInitial}
                </div>

                <p className="mt-6 line-clamp-3 font-serif text-xl font-semibold leading-tight">
                  {book.title}
                </p>

                <p className="mt-3 line-clamp-2 text-sm text-stone-600">
                  {book.author}
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
              <Sparkles className="size-3.5" />
              {t("eyebrow")}
            </div>

            <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {book.title}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-lg text-stone-300">
              <UserRound className="size-5 text-amber-100/80" />
              <span>{book.author}</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <CalendarDays className="size-4 text-amber-100" />

                <div>
                  <p className="text-xs text-stone-400">
                    {t("publicationYear")}
                  </p>

                  <p className="text-sm font-medium text-white">
                    {publicationYear}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <Hash className="size-4 text-amber-100" />

                <div>
                  <p className="text-xs text-stone-400">
                    {t("seriesNumber")}
                  </p>

                  <p className="text-sm font-medium text-white">
                    {seriesNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
                {t("categories")}
              </p>

              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/books?category=${encodeURIComponent(
                        category,
                      )}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1.5 text-sm font-medium text-amber-50 transition hover:border-amber-200/40 hover:bg-amber-100/20"
                    >
                      <Tags className="size-3.5" />
                      {getCategoryLabel(category)}
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-stone-300">
                  <Tags className="size-3.5" />
                  {t("uncategorized")}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
        <div className="overflow-hidden rounded-3xl border border-amber-950/10 bg-white shadow-[0_20px_60px_-38px_rgba(41,37,36,0.5)]">
          <div className="border-b border-stone-200 bg-stone-50/70 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#17231f] text-amber-100">
                <Layers3 className="size-5" />
              </div>

              <div>
                <h2 className="font-serif text-xl font-semibold text-stone-950">
                  {t("catalogDetails")}
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {t("catalogDescription")}
                </p>
              </div>
            </div>
          </div>

          <dl className="grid sm:grid-cols-2">
            <div className="border-b border-stone-200 px-6 py-5 sm:border-r">
              <dt className="flex items-center gap-2 text-sm text-stone-500">
                <UserRound className="size-4" />
                {t("author")}
              </dt>

              <dd className="mt-2 font-medium text-stone-950">
                {book.author}
              </dd>
            </div>

            <div className="border-b border-stone-200 px-6 py-5">
              <dt className="flex items-center gap-2 text-sm text-stone-500">
                <CalendarDays className="size-4" />
                {t("publicationYear")}
              </dt>

              <dd className="mt-2 font-medium text-stone-950">
                {publicationYear}
              </dd>
            </div>

            <div className="border-b border-stone-200 px-6 py-5 sm:border-b-0 sm:border-r">
              <dt className="flex items-center gap-2 text-sm text-stone-500">
                <Tags className="size-4" />
                {t("categories")}
              </dt>

              <dd className="mt-2">
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-950"
                      >
                        {getCategoryLabel(category)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="font-medium text-stone-950">
                    {t("uncategorized")}
                  </span>
                )}
              </dd>
            </div>

            <div className="px-6 py-5">
              <dt className="flex items-center gap-2 text-sm text-stone-500">
                <Hash className="size-4" />
                {t("seriesNumber")}
              </dt>

              <dd className="mt-2 font-medium text-stone-950">
                {seriesNumber}
              </dd>
            </div>
          </dl>
        </div>

        <aside className="overflow-hidden rounded-3xl border border-amber-950/10 bg-[#fffdf8] shadow-[0_20px_60px_-38px_rgba(41,37,36,0.5)]">
          <div className="border-b border-stone-200 px-6 py-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
              <Clock3 className="size-5" />
            </div>

            <h2 className="mt-4 font-serif text-xl font-semibold text-stone-950">
              {t("recordHistory")}
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              {t("recordHistoryDescription")}
            </p>
          </div>

          <dl className="divide-y divide-stone-200">
            <div className="px-6 py-5">
              <dt className="text-sm text-stone-500">
                {t("addedToLibrary")}
              </dt>

              <dd className="mt-2 font-medium text-stone-950">
                {createdDate}
              </dd>
            </div>

            <div className="px-6 py-5">
              <dt className="text-sm text-stone-500">
                {t("lastUpdated")}
              </dt>

              <dd className="mt-2 font-medium text-stone-950">
                {updatedDate}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}