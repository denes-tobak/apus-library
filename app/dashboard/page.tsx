import Link from "next/link";
import {
  BookOpen,
  Plus,
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

  return (
    <main className="min-h-screen bg-muted/40">
      <AppHeader
        displayName={displayName}
        email={email}
      />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("welcomeBack")}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {email}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    {t("totalBooks")}
                  </CardDescription>

                  <CardTitle className="mt-2 text-4xl">
                    {stats.total_books}
                  </CardTitle>
                </div>

                <BookOpen className="size-7 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("totalBooksDescription")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    {t("uniqueAuthors")}
                  </CardDescription>

                  <CardTitle className="mt-2 text-4xl">
                    {stats.unique_authors}
                  </CardTitle>
                </div>

                <UsersRound className="size-7 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("uniqueAuthorsDescription")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    {t("categories")}
                  </CardDescription>

                  <CardTitle className="mt-2 text-4xl">
                    {stats.total_categories}
                  </CardTitle>
                </div>

                <Tags className="size-7 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("categoriesDescription")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    {t("uncategorized")}
                  </CardDescription>

                  <CardTitle className="mt-2 text-4xl">
                    {stats.uncategorized_books}
                  </CardTitle>
                </div>

                <UserRound className="size-7 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("uncategorizedDescription")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>
                {t("recentlyAdded")}
              </CardTitle>

              <CardDescription>
                {t("recentlyAddedDescription")}
              </CardDescription>
            </div>

            <Button asChild variant="outline" size="sm">
              <Link href="/books">
                {t("viewAll")}
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            {recentBooks && recentBooks.length > 0 ? (
              <div className="space-y-2">
                {recentBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="flex items-center justify-between gap-4 rounded-lg border bg-background px-4 py-3 transition hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {book.title}
                      </p>

                      <p className="truncate text-sm text-muted-foreground">
                        {book.author}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {format.dateTime(
                        new Date(book.created_at),
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <BookOpen className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 text-sm text-muted-foreground">
                  {t("noBooks")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/books">
              <BookOpen className="size-4" />
              {t("browseLibrary")}
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/books/new">
              <Plus className="size-4" />
              {t("addBook")}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}