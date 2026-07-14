import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Book } from "@/types/book";

export default async function BooksPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("title", { ascending: true });

  const books = (data ?? []) as Book[];

  return (
    <main className="min-h-screen bg-muted/40">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft />
                Dashboard
              </Link>
            </Button>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              Books
            </h1>

            <p className="mt-2 text-muted-foreground">
              Browse the books stored in Apus Library.
            </p>
          </div>

          <Button asChild>
            <Link href="/books/new">
              <Plus />
              Add book
            </Link>
          </Button>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6 text-destructive">
              Failed to load books: {error.message}
            </CardContent>
          </Card>
        )}

        {!error && books.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">
              No books found.
            </CardContent>
          </Card>
        )}

        {!error && books.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Card key={book.id}>
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Year:</span>{" "}
                    {book.published_year ?? "Unknown"}
                  </p>

                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {book.category ?? "Uncategorized"}
                  </p>

                  <p>
                    <span className="font-medium">Series number:</span>{" "}
                    {book.series_number ?? 0}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}