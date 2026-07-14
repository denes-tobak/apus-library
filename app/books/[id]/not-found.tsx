import Link from "next/link";
import { BookX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BookNotFound() {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BookX className="size-6 text-muted-foreground" />
        </div>

        <CardTitle>Book not found</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-center">
        <p className="text-sm text-muted-foreground">
          This book does not exist or may have been removed from
          the library.
        </p>

        <Button asChild>
          <Link href="/books">Return to books</Link>
        </Button>
      </CardContent>
    </Card>
  );
}