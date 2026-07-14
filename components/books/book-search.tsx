"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";

type BookSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BookSearch({
  value,
  onChange,
}: BookSearchProps) {
  const t = useTranslations("Books");

  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400"
      />

      <input
        type="search"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchAriaLabel")}
        className="h-12 w-full rounded-xl border border-stone-300 bg-white pl-12 pr-12 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("clearSearch")}
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-800"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}