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
import { BookList } from "@/components/books/book-list";

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
          {!error && <BookList books={books} />}        
      </section>
    </main>
  );
}