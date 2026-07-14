import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BookForm } from "@/components/books/book-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { addBook } from "./actions";

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href="/books">
          <ArrowLeft className="size-4" />
          Back to books
        </Link>
      </Button>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Add a book
          </CardTitle>

          <CardDescription>
            Add a new book to the library. Optional details can
            be filled in later.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <BookForm
            action={addBook}
            submitLabel="Add book"
          />
        </CardContent>
      </Card>
    </div>
  );
}