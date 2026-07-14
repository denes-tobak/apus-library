import Link from "next/link";
import { notFound } from "next/navigation";
import {  ArrowLeft,  BookOpen,  Pencil,} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DeleteBookButton } from "@/components/books/delete-book-button";

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

  const supabase = await createClient();

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
        created_at,
        updated_at
      `,
    )
    .eq("id", bookId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load book details: ${error.message}`);
  }

  if (!book) {
    notFound();
  }

  return (
    <div className="space-y-6">
     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <Button asChild variant="ghost" className="-ml-3">
    <Link href="/books">
      <ArrowLeft className="size-4" />
      Back to books
    </Link>
  </Button>

  <div className="flex gap-2">
    <Button asChild variant="outline">
      <Link href={`/books/${book.id}/edit`}>
        <Pencil className="size-4" />
        Edit book
      </Link>
    </Button>

    <DeleteBookButton
      bookId={book.id}
      bookTitle={book.title}
    />
  </div>
</div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
              <BookOpen className="size-6 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl sm:text-3xl">
                {book.title}
              </CardTitle>

              <p className="text-muted-foreground">
                {book.author}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <dt className="text-sm text-muted-foreground">
                Publication year
              </dt>

              <dd className="font-medium">
                {book.published_year ?? "Unknown"}
              </dd>
            </div>

                            <div className="space-y-2">
                <dt className="text-sm text-muted-foreground">
                    Categories
                </dt>

                <dd>
                    {book.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {book.categories.map((category: string) => (
                        <span
                            key={category}
                            className="rounded-full bg-muted px-2.5 py-1 text-sm"
                        >
                            {category}
                        </span>
                        ))}
                    </div>
                    ) : (
                    <span className="font-medium">
                        Uncategorized
                    </span>
                    )}
                </dd>
                </div>

            <div className="space-y-1">
              <dt className="text-sm text-muted-foreground">
                Series number
              </dt>

              <dd className="font-medium">
                {book.series_number !== null &&
                book.series_number > 0
                  ? `#${book.series_number}`
                  : "Not part of a series"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}