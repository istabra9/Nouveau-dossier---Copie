import { cookies } from "next/headers";

import type { AppLocale } from "@/frontend/types";

import {
  defaultLocale,
  isAppLocale,
  localeCookieName,
  localeMeta,
  resolveIntlLocale,
} from "./config";

export async function getCurrentLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;

  return isAppLocale(locale) ? locale : defaultLocale;
}

export function getLocaleDirection(locale: AppLocale) {
  return localeMeta[locale].direction;
}

export function getIntlLocale(locale: AppLocale) {
  return resolveIntlLocale(locale);
}
