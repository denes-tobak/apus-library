import Link from "next/link";
import {
  BookOpen,
  Library,
  Plus,
  Tags,
  UserRound,
  UsersRound,
} from "lucide-react";

import { LogoutButton } from "@/components/layout/logout-button";
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
  const supabase = await createClient();

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

  return (
    <main className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Library className="size-5" />
            </div>

            <div>
              <h1 className="font-semibold">
                Apus Library
              </h1>

              <p className="text-sm text-muted-foreground">
                Personal library management
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h2>

          <p className="mt-2 text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    Total books
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
                Books currently stored in the library.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    Unique authors
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
                Different authors represented.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    Categories
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
                Categories currently in use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>
                    Uncategorized
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
                Books still needing categorization.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Recently added</CardTitle>

              <CardDescription>
                The latest books added to the library.
              </CardDescription>
            </div>

            <Button asChild variant="outline" size="sm">
              <Link href="/books">
                View all
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
                      {new Intl.DateTimeFormat("en", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(book.created_at))}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <BookOpen className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 text-sm text-muted-foreground">
                  No books have been added yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/books">
              <BookOpen className="size-4" />
              Browse library
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/books/new">
              <Plus className="size-4" />
              Add book
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}