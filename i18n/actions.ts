"use server";

import { cookies } from "next/headers";

import {
  isLocale,
  type Locale,
} from "@/i18n/config";

export async function setLocale(
  locale: Locale,
): Promise<void> {
  if (!isLocale(locale)) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}