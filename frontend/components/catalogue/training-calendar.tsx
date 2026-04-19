"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { parseISO } from "date-fns";

import { translateCategoryName, translateTrainingFormat } from "@/frontend/i18n/helpers";
import { resolveIntlLocale } from "@/frontend/i18n/config";
import { formatDateLabel } from "@/frontend/utils/format";
import type { AppLocale, Category, ScheduleRecord, Training } from "@/frontend/types";

type CalendarItem = ScheduleRecord & {
  training: Training | null;
};

type ViewMode = "calendar" | "list";

const categoryColors: Record<string, string> = {
  "ai-copilot": "#8b5cf6",
  "cyber-security": "#ef4444",
  "enterprise-systems": "#f59e0b",
  "project-governance": "#eab308",
  "cisco-networking": "#06b6d4",
  "microsoft-cloud-data": "#3b82f6",
  "business-productivity": "#ec4899",
  "cloud-infrastructure": "#0ea5e9",
  "software-engineering": "#22c55e",
};

const calendarCopy = {
  en: {
    title: "Training calendar",
    subtitle: "Find a session",
    search: "Search training, trainer, city",
    allCategories: "All categories",
    allMonths: "All months",
    calendar: "Calendar",
    list: "List",
    sessions: "sessions",
    legend: "Categories",
    empty: "No session",
    open: "Open",
    trainer: "Trainer",
    days: "days",
    more: "more",
  },
  fr: {
    title: "Calendrier des formations",
    subtitle: "Trouvez une session",
    search: "Rechercher",
    allCategories: "Toutes categories",
    allMonths: "Tous les mois",
    calendar: "Calendrier",
    list: "Liste",
    sessions: "sessions",
    legend: "Categories",
    empty: "Aucune session",
    open: "Voir",
    trainer: "Formateur",
    days: "jours",
    more: "autres",
  },
  ar: {
    title: "Training calendar",
    subtitle: "Find a session",
    search: "Search",
    allCategories: "All categories",
    allMonths: "All months",
    calendar: "Calendar",
    list: "List",
    sessions: "sessions",
    legend: "Categories",
    empty: "No session",
    open: "Open",
    trainer: "Trainer",
    days: "days",
    more: "more",
  },
} as const;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getCalendarCopy(locale: AppLocale) {
  return calendarCopy[locale] ?? calendarCopy.en;
}

function getMonthKey(date: string) {
  const value = parseISO(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthDate(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function getMonthLabel(monthKey: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    month: "long",
    year: "numeric",
  }).format(getMonthDate(monthKey));
}

function getWeekdayLabels(locale: AppLocale) {
  const formatter = new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    weekday: "short",
  });

  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(2026, 0, 4 + index)),
  );
}

function buildMonthGrid(monthKey: string) {
  const monthDate = getMonthDate(monthKey);
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startWeekday = firstDay.getDay();
  const gridStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 - startWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const value = new Date(gridStart);
    value.setDate(gridStart.getDate() + index);

    return {
      date: value,
      iso: `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(
        value.getDate(),
      ).padStart(2, "0")}`,
      inMonth: value.getMonth() === monthDate.getMonth(),
    };
  });
}

function getTrainingLabel(item: CalendarItem) {
  return item.training?.code ?? item.training?.title ?? item.trainingSlug;
}

function getCategoryLabel(
  item: CalendarItem,
  categories: Category[],
  locale: AppLocale,
) {
  const category = categories.find(
    (entry) => entry.slug === item.training?.categorySlug,
  );

  if (!category) {
    return item.training?.categorySlug ?? "";
  }

  return translateCategoryName(category, locale);
}

function getAccent(item: CalendarItem) {
  return (
    item.training?.coverPalette?.[1] ??
    (item.training?.categorySlug ? categoryColors[item.training.categorySlug] : undefined) ??
    "#df3648"
  );
}

function groupSchedulesByMonth(items: CalendarItem[]) {
  const grouped = new Map<string, CalendarItem[]>();

  for (const item of items) {
    const monthKey = getMonthKey(item.startDate);
    const current = grouped.get(monthKey) ?? [];
    current.push(item);
    grouped.set(monthKey, current);
  }

  return Array.from(grouped.entries()).sort(([left], [right]) => left.localeCompare(right));
}

function CompactCalendar({
  schedules,
  locale,
}: {
  schedules: CalendarItem[];
  locale: AppLocale;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {schedules.slice(0, 3).map((schedule) => (
        <Link
          key={schedule.id}
          href={schedule.training ? `/trainings/${schedule.training.slug}` : "/trainings"}
          className="rounded-[26px] border border-line bg-white p-5 shadow-[0_14px_35px_rgba(28,23,25,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(28,23,25,0.08)]"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {formatDateLabel(schedule.startDate, locale)}
          </div>
          <div className="mt-3 text-lg font-semibold text-foreground">
            {schedule.training?.title ?? schedule.trainingSlug}
          </div>
          <div className="mt-3 space-y-1 text-sm text-ink-soft">
            <div>{schedule.instructor}</div>
            <div>{schedule.city}</div>
            <div>{translateTrainingFormat(schedule.format, locale)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function TrainingCalendar({
  schedules,
  categories = [],
  locale,
  compact = false,
}: {
  schedules: CalendarItem[];
  categories?: Category[];
  locale: AppLocale;
  compact?: boolean;
}) {
  if (compact) {
    return <CompactCalendar schedules={schedules} locale={locale} />;
  }

  return <FullTrainingCalendar schedules={schedules} categories={categories} locale={locale} />;
}

function FullTrainingCalendar({
  schedules,
  categories,
  locale,
}: {
  schedules: CalendarItem[];
  categories: Category[];
  locale: AppLocale;
}) {
  const copy = getCalendarCopy(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [monthKey, setMonthKey] = useState("all");
  const [view, setView] = useState<ViewMode>("calendar");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery);

  const baseFilteredSchedules = schedules.filter((item) => {
    if (category !== "all" && item.training?.categorySlug !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const categoryLabel = getCategoryLabel(item, categories, locale);
    const haystack = normalizeText(
      [
        item.training?.title ?? "",
        item.training?.code ?? "",
        item.trainingSlug,
        item.instructor,
        item.city,
        categoryLabel,
      ].join(" "),
    );

    return haystack.includes(normalizedQuery);
  });

  const monthOptions = Array.from(
    new Set(baseFilteredSchedules.map((item) => getMonthKey(item.startDate))),
  ).sort();
  const selectedMonthKey =
    monthKey === "all" || monthOptions.includes(monthKey) ? monthKey : "all";

  const visibleSchedules =
    selectedMonthKey === "all"
      ? baseFilteredSchedules
      : baseFilteredSchedules.filter((item) => getMonthKey(item.startDate) === selectedMonthKey);

  const activeMonthKey =
    selectedMonthKey === "all" ? (monthOptions[0] ?? null) : selectedMonthKey;
  const activeMonthIndex = activeMonthKey ? monthOptions.indexOf(activeMonthKey) : -1;
  const calendarSchedules = activeMonthKey
    ? baseFilteredSchedules.filter((item) => getMonthKey(item.startDate) === activeMonthKey)
    : [];

  const dayMap = new Map<string, CalendarItem[]>();
  for (const item of calendarSchedules) {
    const key = item.startDate;
    const current = dayMap.get(key) ?? [];
    current.push(item);
    dayMap.set(
      key,
      current.sort((left, right) => getTrainingLabel(left).localeCompare(getTrainingLabel(right))),
    );
  }

  const monthGrid = activeMonthKey ? buildMonthGrid(activeMonthKey) : [];
  const categoryLegend = categories
    .filter((entry) =>
      baseFilteredSchedules.some((item) => item.training?.categorySlug === entry.slug),
    )
    .sort((left, right) => left.name.localeCompare(right.name));
  const listGroups = groupSchedulesByMonth(visibleSchedules);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{copy.title}</h1>
        <p className="text-sm text-ink-soft sm:text-base">{copy.subtitle}</p>
      </div>

      <section className="rounded-[28px] border border-line bg-white p-4 shadow-[0_18px_45px_rgba(28,23,25,0.06)] sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.search}
              className="w-full rounded-2xl border border-line bg-white py-3 pr-4 pl-10 text-sm outline-none ring-0 transition focus:border-brand-300"
            />
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-300"
          >
            <option value="all">{copy.allCategories}</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {translateCategoryName(item, locale)}
              </option>
            ))}
          </select>

          <select
            value={selectedMonthKey}
            onChange={(event) => setMonthKey(event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-300"
          >
            <option value="all">{copy.allMonths}</option>
            {monthOptions.map((item) => (
              <option key={item} value={item}>
                {getMonthLabel(item, locale)}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-2xl bg-brand-50 p-1">
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={`inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium ${
                view === "calendar" ? "bg-white text-brand-600 shadow-sm" : "text-ink-soft"
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              {copy.calendar}
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium ${
                view === "list" ? "bg-white text-brand-600 shadow-sm" : "text-ink-soft"
              }`}
            >
              <List className="h-4 w-4" />
              {copy.list}
            </button>
          </div>
        </div>
      </section>

      <div className="text-sm font-medium text-ink-soft">
        {visibleSchedules.length} {copy.sessions}
      </div>

      {view === "calendar" ? (
        <section className="overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_20px_48px_rgba(28,23,25,0.06)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
            <button
              type="button"
              disabled={activeMonthIndex <= 0}
              onClick={() => {
                if (activeMonthIndex > 0) {
                  setMonthKey(monthOptions[activeMonthIndex - 1] ?? "all");
                }
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              {activeMonthKey ? getMonthLabel(activeMonthKey, locale) : copy.empty}
            </h2>

            <button
              type="button"
              disabled={activeMonthIndex < 0 || activeMonthIndex >= monthOptions.length - 1}
              onClick={() => {
                if (activeMonthIndex >= 0 && activeMonthIndex < monthOptions.length - 1) {
                  setMonthKey(monthOptions[activeMonthIndex + 1] ?? "all");
                }
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-line bg-brand-50/60">
            {getWeekdayLabels(locale).map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft sm:text-xs"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {monthGrid.map((cell) => {
              const items = dayMap.get(cell.iso) ?? [];

              return (
                <div
                  key={cell.iso}
                  className={`min-h-[120px] border-r border-b border-line p-2 align-top sm:min-h-[136px] sm:p-3 ${
                    cell.inMonth ? "bg-white" : "bg-brand-50/40"
                  }`}
                >
                  <div
                    className={`mb-2 text-sm font-semibold ${
                      cell.inMonth ? "text-foreground" : "text-ink-soft/60"
                    }`}
                  >
                    {cell.date.getDate()}
                  </div>

                  <div className="space-y-1.5">
                    {items.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={item.training ? `/trainings/${item.training.slug}` : "/trainings"}
                        className="block truncate rounded-lg px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:scale-[1.02] sm:text-xs"
                        style={{ backgroundColor: getAccent(item) }}
                        title={item.training?.title ?? item.trainingSlug}
                      >
                        {getTrainingLabel(item)}
                      </Link>
                    ))}

                    {items.length > 3 ? (
                      <div className="px-1 text-[11px] text-ink-soft">
                        +{items.length - 3} {copy.more}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {categoryLegend.length ? (
            <div className="border-t border-line bg-brand-50/50 px-4 py-4 sm:px-6">
              <div className="mb-3 text-sm font-semibold text-foreground">{copy.legend}</div>
              <div className="flex flex-wrap gap-3">
                {categoryLegend.map((item) => (
                  <div key={item.id} className="inline-flex items-center gap-2 text-xs text-ink-soft">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: categoryColors[item.slug] ?? "#df3648" }}
                    />
                    {translateCategoryName(item, locale)}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : listGroups.length ? (
        <div className="space-y-5">
          {listGroups.map(([groupMonthKey, items]) => (
            <section
              key={groupMonthKey}
              className="rounded-[28px] border border-line bg-white p-4 shadow-[0_18px_45px_rgba(28,23,25,0.06)] sm:p-6"
            >
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {getMonthLabel(groupMonthKey, locale)}
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.training ? `/trainings/${item.training.slug}` : "/trainings"}
                    className="block rounded-[22px] border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(28,23,25,0.06)]"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
                            style={{ backgroundColor: getAccent(item) }}
                          >
                            {getTrainingLabel(item)}
                          </span>
                          <span className="text-sm text-ink-soft">
                            {getCategoryLabel(item, categories, locale)}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground">
                          {item.training?.title ?? item.trainingSlug}
                        </h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-soft">
                          <span>{formatDateLabel(item.startDate, locale)}</span>
                          <span>
                            {item.training?.durationDays ?? 1} {copy.days}
                          </span>
                          <span>{translateTrainingFormat(item.format, locale)}</span>
                          <span>{item.city}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                          <UserRound className="h-4 w-4" />
                          <span>
                            {copy.trainer}: {item.instructor}
                          </span>
                          <MapPin className="ml-2 h-4 w-4" />
                          <span>{item.venue}</span>
                        </div>
                      </div>

                      <span className="text-sm font-semibold text-brand-600">{copy.open}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-line bg-white p-10 text-center text-sm text-ink-soft">
          {copy.empty}
        </div>
      )}
    </div>
  );
}
