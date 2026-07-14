import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { createClient } from "@/lib/supabase/server";

type BooksLayoutProps = {
  children: ReactNode;
};

export default async function BooksLayout({
  children,
}: BooksLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const metadataName = user.user_metadata?.full_name;

  const displayName =
    typeof metadataName === "string" &&
    metadataName.trim().length > 0
      ? metadataName
      : user.email ?? "Library user";

  return (
    <div className="min-h-screen">
      <AppHeader
        displayName={displayName}
        email={user.email ?? "No email available"}
      />

      <main>{children}</main>
    </div>
  );
}