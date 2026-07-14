import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  BookPlus,
  ChevronRight,
  Clock3,
  LibraryBig,
  Plus,
  Sparkles,
  Tags,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  getFormatter,
  getTranslations,
} from "next-intl/server";

import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type LibraryStatistics = {
  total_books: number;
  unique_authors: number;
  total_categories: number;
  uncategorized_books: number;
};

const emptyStatistics: LibraryStatistics = {
  total_books: 0,
  unique_authors: 0,
  total_categories: 0,
  uncategorized_books: 0,
};

export default async function DashboardPage() {
  const [supabase, t, format] = await Promise.all([
    createClient(),
    getTranslations("Dashboard"),
    getFormatter(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const statisticsQuery = supabase
    .rpc("get_library_statistics")
    .single();

  const recentBooksQuery = supabase
    .from("books")
    .select("id, title, author, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const [
    { data: statistics, error: statisticsError },
    { data: recentBooks, error: recentBooksError },
  ] = await Promise.all([
    statisticsQuery,
    recentBooksQuery,
  ]);

  if (statisticsError) {
    throw new Error(
      `Failed to load library statistics: ${statisticsError.message}`,
    );
  }

  if (recentBooksError) {
    throw new Error(
      `Failed to load recent books: ${recentBooksError.message}`,
    );
  }

  const stats =
    (statistics as LibraryStatistics | null) ??
    emptyStatistics;

  const email = user?.email ?? "";

  const metadataDisplayName = [
    user?.user_metadata?.display_name,
    user?.user_metadata?.full_name,
    user?.user_metadata?.name,
  ].find(
    (value): value is string =>
      typeof value === "string" &&
      value.trim().length > 0,
  );

  const displayName = metadataDisplayName ?? email;

  const categorizedBooks = Math.max(
    stats.total_books - stats.uncategorized_books,
    0,
  );

  const categorizedPercentage =
    stats.total_books > 0
      ? Math.round(
          (categorizedBooks / stats.total_books) * 100,
        )
      : 0;

  const statisticCards = [
    {
      label: t("totalBooks"),
      value: stats.total_books,
      description: t("totalBooksDescription"),
      icon: BookOpen,
      iconClassName:
        "bg-amber-100 text-amber-800",
    },
    {
      label: t("uniqueAuthors"),
      value: stats.unique_authors,
      description: t("uniqueAuthorsDescription"),
      icon: UsersRound,
      iconClassName:
        "bg-emerald-100 text-emerald-800",
    },
    {
      label: t("categories"),
      value: stats.total_categories,
      description: t("categoriesDescription"),
      icon: Tags,
      iconClassName:
        "bg-sky-100 text-sky-800",
    },
    {
      label: t("uncategorized"),
      value: stats.uncategorized_books,
      description: t("uncategorizedDescription"),
      icon: UserRound,
      iconClassName:
        "bg-stone-200 text-stone-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f3efe7] text-stone-950">
      <AppHeader
        displayName={displayName}
        email={email}
      />

      <section className="relative overflow-hidden border-b border-amber-950/10 bg-[#17231f] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-32 size-96 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-16 size-72 rounded-full border border-white/10" />
          <div className="absolute bottom-0 left-1/3 h-px w-80 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
          <LibraryBig className="absolute -bottom-16 right-10 size-72 rotate-6 text-white/[0.035]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
              <Sparkles className="size-3.5" />
              {t("eyebrow")}
            </div>

            <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              {t("heroDescription", {
                books: stats.total_books,
                authors: stats.unique_authors,
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button
              asChild
              size="lg"
              className="bg-amber-100 text-stone-950 shadow-lg shadow-black/20 hover:bg-amber-50"
            >
              <Link href="/books">
                <BookOpen className="size-4" />
                {t("browseLibrary")}
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/books/new">
                <Plus className="size-4" />
                {t("addBook")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="relative z-10 -mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statisticCards.map((statistic) => {
            const Icon = statistic.icon;

            return (
              <Card
                key={statistic.label}
                className="group border-amber-950/10 bg-white/95 shadow-[0_18px_50px_-28px_rgba(41,37,36,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(41,37,36,0.55)]"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardDescription className="font-medium text-stone-500">
                        {statistic.label}
                      </CardDescription>

                      <CardTitle className="mt-2 font-serif text-4xl font-semibold tracking-tight text-stone-950">
                        {format.number(statistic.value)}
                      </CardTitle>
                    </div>

                    <div
                      className={`flex size-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${statistic.iconClassName}`}
                    >
                      <Icon className="size-5" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-stone-500">
                    {statistic.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.75fr)]">
          <Card className="overflow-hidden border-amber-950/10 bg-white shadow-[0_20px_60px_-38px_rgba(41,37,36,0.55)]">
            <CardHeader className="border-b border-stone-200/80 bg-stone-50/70 px-5 py-5 sm:px-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#17231f] text-amber-100">
                    <Clock3 className="size-5" />
                  </div>

                  <div>
                    <CardTitle className="font-serif text-xl">
                      {t("recentlyAdded")}
                    </CardTitle>

                    <CardDescription className="mt-1">
                      {t("recentlyAddedDescription")}
                    </CardDescription>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-stone-300 bg-white"
                >
                  <Link href="/books">
                    {t("viewAll")}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {recentBooks && recentBooks.length > 0 ? (
                <div className="divide-y divide-stone-200/80">
                  {recentBooks.map((book, index) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-amber-50/70 sm:px-6"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 font-serif text-sm font-semibold text-stone-500 transition-colors group-hover:border-amber-200 group-hover:bg-amber-100 group-hover:text-amber-900">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-stone-950">
                          {book.title}
                        </p>

                        <p className="mt-0.5 truncate text-sm text-stone-500">
                          {book.author}
                        </p>
                      </div>

                      <span className="hidden shrink-0 text-xs text-stone-400 sm:block">
                        {format.dateTime(
                          new Date(book.created_at),
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>

                      <ChevronRight className="size-4 shrink-0 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-amber-800" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-stone-100">
                    <BookOpen className="size-7 text-stone-400" />
                  </div>

                  <p className="mt-4 text-sm text-stone-500">
                    {t("noBooks")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-amber-950/10 bg-[#22312b] text-white shadow-[0_20px_60px_-38px_rgba(41,37,36,0.8)]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardDescription className="text-amber-100/70">
                      {t("collectionProgress")}
                    </CardDescription>

                    <CardTitle className="mt-2 font-serif text-4xl text-white">
                      {categorizedPercentage}%
                    </CardTitle>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-amber-100">
                    <BookMarked className="size-6" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber-200 transition-all"
                    style={{
                      width: `${categorizedPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-sm leading-6 text-stone-300">
                  {t("collectionProgressDescription", {
                    categorized: categorizedBooks,
                    total: stats.total_books,
                  })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-950/10 bg-white shadow-[0_20px_60px_-38px_rgba(41,37,36,0.55)]">
              <CardHeader>
                <CardDescription className="uppercase tracking-[0.16em] text-stone-400">
                  {t("quickActions")}
                </CardDescription>

                <CardTitle className="font-serif text-xl">
                  {t("manageCollection")}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Link
                  href="/books"
                  className="group flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-900">
                    <LibraryBig className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {t("browseLibrary")}
                    </p>

                    <p className="truncate text-sm text-stone-500">
                      {t("browseLibraryDescription")}
                    </p>
                  </div>

                  <ChevronRight className="size-4 text-stone-300 group-hover:text-amber-800" />
                </Link>

                <Link
                  href="/books/new"
                  className="group flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-900">
                    <BookPlus className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {t("addBook")}
                    </p>

                    <p className="truncate text-sm text-stone-500">
                      {t("addBookDescription")}
                    </p>
                  </div>

                  <ChevronRight className="size-4 text-stone-300 group-hover:text-amber-800" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}