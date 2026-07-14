import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { BookForm } from "@/components/books/book-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const supabase = await createClient();

  const { data: book, error } = await supabase
    .from("books")
    .select(
      `
        id,
        title,
        author,
        published_year,
        category,
        series_number
      `,
    )
    .eq("id", bookId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load book: ${error.message}`);
  }

  if (!book) {
    notFound();
  }

  const updateBookWithId = updateBook.bind(null, book.id);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href={`/books/${book.id}`}>
          <ArrowLeft className="size-4" />
          Back to book
        </Link>
      </Button>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Edit book
          </CardTitle>

          <CardDescription>
            Correct or update the details for this book.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <BookForm
            action={updateBookWithId}
            submitLabel="Save changes"
            initialValues={{
              title: book.title,
              author: book.author,
              published_year:
                book.published_year?.toString() ?? "",
              category: book.category ?? "",
              series_number:
                book.series_number?.toString() ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}