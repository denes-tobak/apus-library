import Link from "next/link";
import { LibraryBig } from "lucide-react";

import { HeaderNavigation } from "@/components/layout/header-navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { LogoutButton } from "@/components/layout/logout-button";

type AppHeaderProps = {
  displayName: string;
  email: string;
};

export function AppHeader({
  displayName,
  email,
}: AppHeaderProps) {
  const initial =
    displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-amber-100/10 bg-[#17231f]/95 text-white shadow-[0_10px_35px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="relative mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/books"
          className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          <div className="flex size-10 items-center justify-center rounded-xl border border-amber-100/15 bg-amber-100/10 text-amber-100 shadow-sm transition group-hover:border-amber-100/30 group-hover:bg-amber-100/15">
            <LibraryBig className="size-5" />
          </div>

          <div className="hidden sm:block">
            <p className="font-serif text-lg font-semibold tracking-tight text-white">
              Apus Library
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-amber-100/55">
              Personal collection
            </p>
          </div>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <HeaderNavigation />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />

          <div
            title={email}
            className="hidden min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3 shadow-sm lg:flex"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 font-serif text-sm font-semibold text-[#17231f]">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="max-w-40 truncate text-sm font-medium text-white">
                {displayName}
              </p>

              {displayName !== email && (
                <p className="max-w-40 truncate text-[11px] text-stone-400">
                  {email}
                </p>
              )}
            </div>
          </div>

          <div
            title={email}
            className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-serif text-sm font-semibold text-amber-100 sm:flex lg:hidden"
          >
            {initial}
          </div>

          <LogoutButton />
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-2 md:hidden">
        <div className="mx-auto max-w-7xl">
          <HeaderNavigation mobile />
        </div>
      </div>
    </header>
  );
}