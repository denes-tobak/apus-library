import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  defaultLocale,
  isLocale,
} from "@/i18n/config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const requestedLocale =
    cookieStore.get("NEXT_LOCALE")?.value;

  const locale = isLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  return {
    locale,
    messages: (
      await import(`../messages/${locale}.json`)
    ).default,
  };
});