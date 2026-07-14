"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  AlertTriangle,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BooksErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function BooksError({
  error,
  reset,
}: BooksErrorProps) {
  useEffect(() => {
    console.error("Books route error:", error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-6xl justify-center px-6 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>

          <CardTitle className="mt-2">
            We couldn&apos;t load the library
          </CardTitle>

          <CardDescription>
            Something unexpected happened while loading this
            section. Your books have not been changed.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RefreshCw className="size-4" />
            Try again
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Back to dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}