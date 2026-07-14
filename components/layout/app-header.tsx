import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LayoutDashboard, LibraryBig } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { LogoutButton } from "@/components/layout/logout-button";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  displayName: string;
  email: string;
};

export async function AppHeader({
  displayName,
  email,
}: AppHeaderProps) {
  const t = await getTranslations("Navigation");

  const initial =
    displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/books"
          className="flex shrink-0 items-center gap-2 font-semibold"
        >
          <LibraryBig className="size-5" />

          <span className="hidden sm:inline">
            Apus Library
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            aria-label={t("dashboard")}
          >
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />

              <span className="hidden sm:inline">
                {t("dashboard")}
              </span>
            </Link>
          </Button>

          <div className="shrink-0">
            <LanguageSwitcher />
          </div>

          <div
            title={email}
            className="flex min-w-0 items-center gap-2 rounded-md border bg-card px-2 py-1.5"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initial}
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="max-w-40 truncate text-sm font-medium">
                {displayName}
              </p>

              {displayName !== email && (
                <p className="max-w-40 truncate text-xs text-muted-foreground">
                  {email}
                </p>
              )}
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}