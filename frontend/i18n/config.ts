import type { AppLocale } from "@/frontend/types";

export const localeCookieName = "advancia-locale";
export const locales: AppLocale[] = ["en", "fr", "ar"];
export const defaultLocale: AppLocale = "fr";

export const localeMeta: Record<
  AppLocale,
  { label: string; direction: "ltr" | "rtl"; intl: string }
> = {
  en: { label: "English", direction: "ltr", intl: "en-TN" },
  fr: { label: "Français", direction: "ltr", intl: "fr-TN" },
  ar: { label: "العربية", direction: "rtl", intl: "ar-TN" },
};

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return Boolean(value && locales.includes(value as AppLocale));
}

export function resolveIntlLocale(locale: AppLocale) {
  return localeMeta[locale].intl;
}
