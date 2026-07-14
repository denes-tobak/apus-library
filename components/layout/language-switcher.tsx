"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { setLocale } from "@/i18n/actions";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function changeLanguage(locale: Locale) {
    if (locale === currentLocale) {
      return;
    }

    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/20 p-1 text-white shadow-sm backdrop-blur-md">
      <Languages
        aria-hidden="true"
        className="ml-2 size-4 text-white/70"
      />

      <button
        type="button"
        disabled={isPending}
        onClick={() => changeLanguage("hu")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          currentLocale === "hu"
            ? "bg-white text-slate-900"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        HU
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => changeLanguage("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          currentLocale === "en"
            ? "bg-white text-slate-900"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}