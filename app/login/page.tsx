"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { BookOpenText, Library, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { createClient } from "@/lib/supabase/client";

const inputClassName =
  "h-12 w-full rounded-xl border border-white/40 bg-white/80 px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-500/20";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const email = String(
      formData.get("email") ?? "",
    ).trim();

    const password = String(
      formData.get("password") ?? "",
    );

    const supabase = createClient();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("Login failed:", error);

      setErrorMessage(t("invalidCredentials"));
      setIsSubmitting(false);

      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/temple-of-books-6-1536x934.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-slate-950/50" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_30%)]" />

      <div className="absolute right-5 top-5 z-30">
        <LanguageSwitcher />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_480px] lg:items-center">
          <div className="hidden lg:block">
            <div className="max-w-xl text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <Library className="size-4" />
                {t("eyebrow")}
              </div>

              <h1 className="text-5xl font-semibold leading-tight tracking-tight drop-shadow-lg xl:text-6xl">
                {t("heroTitle")}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 drop-shadow-md">
                {t("heroDescription")}
              </p>

              <div className="mt-8 grid gap-4 text-base text-white/90">
                <div className="flex items-center gap-3">
                  <span className="size-2.5 shrink-0 rounded-full bg-emerald-300" />
                  <span>{t("featureBrowse")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="size-2.5 shrink-0 rounded-full bg-sky-300" />
                  <span>{t("featureSearch")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="size-2.5 shrink-0 rounded-full bg-amber-300" />
                  <span>{t("featureSimple")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/25 bg-white/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-900/10 text-slate-900">
                  <BookOpenText className="size-7" />
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {t("welcome")}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("subtitle")}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("email")}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                    disabled={isSubmitting}
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("password")}
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder={t("passwordPlaceholder")}
                    disabled={isSubmitting}
                    className={inputClassName}
                  />
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-medium text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  )}

                  {isSubmitting
                    ? t("signingIn")
                    : t("signIn")}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                {t("footer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}