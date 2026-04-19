import { parseISO } from "date-fns";

import type { AppLocale } from "@/frontend/types";

import { resolveIntlLocale } from "@/frontend/i18n/config";

const defaultCurrency = process.env.DEFAULT_CURRENCY ?? "TND";

export function formatCurrency(
  value: number,
  currency = defaultCurrency,
  locale: AppLocale = "en",
) {
  return new Intl.NumberFormat(resolveIntlLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number, locale: AppLocale = "en") {
  return new Intl.NumberFormat(resolveIntlLocale(locale), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDateLabel(date: string, locale: AppLocale = "en") {
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseISO(date));
}

export function formatShortDate(date: string, locale: AppLocale = "en") {
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    day: "2-digit",
    month: "short",
  }).format(parseISO(date));
}

export function formatPercent(value: number, locale: AppLocale = "en") {
  return new Intl.NumberFormat(resolveIntlLocale(locale), {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value / 100);
}
