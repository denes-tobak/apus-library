import Link from "next/link";
import { Plus } from "lucide-react";

import { BookList } from "@/components/books/book-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { getBooks } from "@/services/books/get-books";

export default async function BooksPage() {
  const { books, error } = await getBooks();

  return (
    <main className="min-h-screen bg-muted/40">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Books
            </h1>

            <p className="text-muted-foreground">
              Browse and manage your library.
            </p>
          </div>

          <Button asChild>
            <Link href="/books/new">
              <Plus className="size-4" />
              Add book
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="border-destructive">
            <CardContent className="py-6 text-destructive">
              Failed to load books: {error}
            </CardContent>
          </Card>
        ) : (
          <BookList books={books} />
        )}
      </section>
    </main>
  );
}