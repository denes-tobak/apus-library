export const locales = ["hu", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "hu";

export function isLocale(
  value: unknown,
): value is Locale {
  return (
    typeof value === "string" &&
    locales.includes(value as Locale)
  );
}