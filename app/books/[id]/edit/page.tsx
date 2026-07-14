import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Hash,
  PencilLine,
  Sparkles,
  Tags,
} from "lucide-react";

import { BookForm } from "@/components/books/book-form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import { updateBook } from "./actions";

type EditBookPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBookPage({
  params,
}: EditBookPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (!Number.isInteger(bookId) || bookId < 1) {
    notFound();
  }

  const [supabase, t] = await Promise.all([
    createClient(),
    getTranslations("EditBook"),
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
      cover_path
    `,
  )
  .eq("id", bookId)
  .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load book: ${error.message}`,
    );
  }

  if (!book) {
    notFound();
  }

  const updateBookWithId = updateBook.bind(
    null,
    book.id,
  );

  const categories: string[] = Array.isArray(
    book.categories,
  )
    ? book.categories
    : [];

  const titleInitial =
    book.title.trim().charAt(0).toUpperCase() || "A";

  const publicationYear =
    book.published_year ?? t("unknown");

  const seriesNumber =
    book.series_number !== null &&
    book.series_number > 0
      ? `#${book.series_number}`
      : t("notPartOfSeries");

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl border border-amber-950/10 bg-white/90 p-3 shadow-[0_16px_45px_-32px_rgba(41,37,36,0.65)] backdrop-blur">
  <Button
    asChild
    variant="outline"
    className="h-11 w-fit rounded-xl border-stone-200 bg-white px-4 text-stone-700 shadow-sm hover:border-amber-300 hover:bg-amber-50 hover:text-amber-950"
  >
    <Link href={`/books/${book.id}`}>
      <ArrowLeft className="size-4" />
      {t("backToBook")}
    </Link>
  </Button>
</div>

      <section className="relative overflow-hidden rounded-[2rem] border border-amber-950/10 bg-[#17231f] text-white shadow-[0_28px_80px_-42px_rgba(28,25,23,0.9)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-32 size-96 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-16 size-72 rounded-full border border-white/10" />

          <div className="absolute bottom-0 left-1/3 h-px w-96 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />

          <PencilLine className="absolute -bottom-16 right-10 size-72 rotate-6 text-white/[0.035]" />
        </div>

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:gap-12 lg:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
              <Sparkles className="size-3.5" />
              {t("eyebrow")}
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              {t("description")}
            </p>
          </div>

          <div className="hidden justify-self-end lg:block">
            <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-r-2xl rounded-l-md border border-amber-100/20 bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200 shadow-[16px_22px_45px_-18px_rgba(0,0,0,0.75)]">
              <div className="absolute inset-y-0 left-0 w-3 border-r border-amber-950/20 bg-amber-900/20" />

              <div className="absolute inset-x-5 top-6 h-px bg-amber-950/20" />
              <div className="absolute inset-x-5 bottom-6 h-px bg-amber-950/20" />

              <div className="flex h-full flex-col items-center justify-center px-6 text-center text-stone-900">
                <div className="flex size-14 items-center justify-center rounded-full border border-amber-950/20 bg-white/50 font-serif text-2xl font-semibold shadow-sm">
                  {titleInitial}
                </div>

                <p className="mt-5 line-clamp-3 font-serif text-base font-semibold leading-tight">
                  {book.title}
                </p>

                <p className="mt-2 line-clamp-2 text-xs text-stone-600">
                  {book.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit overflow-hidden rounded-3xl border border-amber-950/10 bg-[#fffdf8] shadow-[0_20px_60px_-38px_rgba(41,37,36,0.55)]">
          <div className="border-b border-stone-200 px-6 py-6">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <BookOpen className="size-5" />
            </div>

            <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
              {t("editing")}
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-stone-950">
              {book.title}
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              {book.author}
            </p>
          </div>

          <dl className="divide-y divide-stone-200">
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                <CalendarDays className="size-4" />
              </div>

              <div className="min-w-0">
                <dt className="text-xs text-stone-400">
                  {t("publicationYear")}
                </dt>

                <dd className="mt-0.5 font-medium text-stone-900">
                  {publicationYear}
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                <Tags className="size-4" />
              </div>

              <div className="min-w-0">
                <dt className="text-xs text-stone-400">
                  {t("categories")}
                </dt>

                <dd className="mt-0.5 font-medium text-stone-900">
                  {categories.length}
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                <Hash className="size-4" />
              </div>

              <div className="min-w-0">
                <dt className="text-xs text-stone-400">
                  {t("seriesNumber")}
                </dt>

                <dd className="mt-0.5 font-medium text-stone-900">
                  {seriesNumber}
                </dd>
              </div>
            </div>
          </dl>
        </aside>

        <div className="overflow-hidden rounded-3xl border border-amber-950/10 bg-white shadow-[0_24px_70px_-40px_rgba(41,37,36,0.6)]">
          <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-6 sm:px-8">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#17231f] text-amber-100">
                <PencilLine className="size-5" />
              </div>

              <div>
                <h2 className="font-serif text-2xl font-semibold text-stone-950">
                  {t("formTitle")}
                </h2>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  {t("formDescription")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <BookForm
              action={updateBookWithId}
              submitLabel={t("saveChanges")}
              cancelHref={`/books/${book.id}`}
              initialValues={{
                title: book.title,
                author: book.author,
                published_year:
                  book.published_year?.toString() ?? "",
                categories,
                series_number:
                  book.series_number?.toString() ?? "",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}