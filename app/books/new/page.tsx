import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  BookOpen,
  BookPlus,
  CheckCircle2,
  Sparkles,
  Tags,
} from "lucide-react";

import { BookForm } from "@/components/books/book-form";
import { Button } from "@/components/ui/button";

import { addBook } from "./actions";

export default async function NewBookPage() {
  const t = await getTranslations("AddBook");

  return (
    <div className="space-y-6 pb-12">
      <Button
        asChild
        variant="ghost"
        className="-ml-3 w-fit text-stone-600 hover:bg-amber-100/70 hover:text-stone-950"
      >
        <Link href="/books">
          <ArrowLeft className="size-4" />
          {t("backToBooks")}
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-[2rem] border border-amber-950/10 bg-[#17231f] text-white shadow-[0_28px_80px_-42px_rgba(28,25,23,0.9)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-32 size-96 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-16 size-72 rounded-full border border-white/10" />

          <div className="absolute bottom-0 left-1/3 h-px w-96 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />

          <BookPlus className="absolute -bottom-16 right-10 size-72 rotate-6 text-white/[0.035]" />
        </div>

        <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
            <Sparkles className="size-3.5" />
            {t("eyebrow")}
          </div>

          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="h-fit overflow-hidden rounded-3xl border border-amber-950/10 bg-[#fffdf8] shadow-[0_20px_60px_-38px_rgba(41,37,36,0.55)]">
          <div className="border-b border-stone-200 px-6 py-6">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <BookOpen className="size-5" />
            </div>

            <h2 className="mt-5 font-serif text-2xl font-semibold text-stone-950">
              {t("tipsTitle")}
            </h2>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" />

              <p className="text-sm leading-6 text-stone-600">
                {t("tipOne")}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" />

              <p className="text-sm leading-6 text-stone-600">
                {t("tipTwo")}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Tags className="mt-0.5 size-5 shrink-0 text-amber-800" />

              <p className="text-sm leading-6 text-stone-600">
                {t("tipThree")}
              </p>
            </div>
          </div>
        </aside>

        <div className="overflow-hidden rounded-3xl border border-amber-950/10 bg-white shadow-[0_24px_70px_-40px_rgba(41,37,36,0.6)]">
          <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-6 sm:px-8">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#17231f] text-amber-100">
                <BookPlus className="size-5" />
              </div>

              <div>
                <h2 className="font-serif text-2xl font-semibold text-stone-950">
                  {t("formTitle")}
                </h2>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  {t("formDescription")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <BookForm
              action={addBook}
              submitLabel={t("submit")}
              cancelHref="/books"
            />
          </div>
        </div>
      </section>
    </div>
  );
}