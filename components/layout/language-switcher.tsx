"use client";

import { useTransition } from "react";
import { Globe2, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import {
  type Locale,
  locales,
} from "@/i18n/config";
import { setLocale } from "@/i18n/actions";

const localeLabels: Record<Locale, string> = {
  hu: "HU",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleLocaleChange(
    nextLocale: Locale,
  ) {
    if (
      nextLocale === locale ||
      isPending
    ) {
      return;
    }

    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div className="flex h-10 items-center rounded-xl border border-white/10 bg-white/5 p-1 shadow-inner">
      <div className="hidden px-2 text-stone-400 sm:block">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Globe2 className="size-4" />
        )}
      </div>

      {locales.map((availableLocale) => {
        const isActive =
          availableLocale === locale;

        return (
          <button
            key={availableLocale}
            type="button"
            disabled={isPending}
            aria-pressed={isActive}
            onClick={() =>
              handleLocaleChange(
                availableLocale,
              )
            }
            className={
              isActive
                ? "flex h-8 min-w-10 items-center justify-center rounded-lg bg-amber-100 px-2 text-xs font-bold text-[#17231f] shadow-sm transition"
                : "flex h-8 min-w-10 items-center justify-center rounded-lg px-2 text-xs font-semibold text-stone-400 transition hover:bg-white/10 hover:text-white"
            }
          >
            {localeLabels[availableLocale]}
          </button>
        );
      })}
    </div>
  );
}