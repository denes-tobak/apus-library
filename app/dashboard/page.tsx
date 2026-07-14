import Link from "next/link";
import { BookOpen, Library, Plus, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/layout/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: bookCount } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true });

  return (
    <main className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Library className="size-5" />
            </div>

            <div>
              <h1 className="font-semibold">Apus Library</h1>
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

        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Library collection</CardDescription>
                  <CardTitle className="mt-2 text-4xl">
                    {bookCount ?? 0}
                  </CardTitle>
                </div>

                <BookOpen className="size-8 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Books currently stored in Apus Library.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Account</CardDescription>
                  <CardTitle className="mt-2 text-xl">
                    Authenticated
                  </CardTitle>
                </div>

                <UserRound className="size-8 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your session is active and protected by Supabase.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/books">
              <BookOpen />
              Browse library
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/books/new">
              <Plus />
              Add book
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}