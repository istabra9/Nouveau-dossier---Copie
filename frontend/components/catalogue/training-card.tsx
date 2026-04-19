import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";

import { TrainingCover } from "@/frontend/components/catalogue/training-cover";
import { translateTrainingFormat, translateTrainingLevel } from "@/frontend/i18n/helpers";
import { getMessages } from "@/frontend/i18n/messages";
import { formatDateLabel } from "@/frontend/utils/format";
import type { AppLocale, Training } from "@/frontend/types";

export function TrainingCard({
  training,
  locale,
}: {
  training: Training;
  locale: AppLocale;
}) {
  const copy = getMessages(locale);

  return (
    <Link
      href={`/trainings/${training.slug}`}
      className="surface-panel hover-lift ambient-border block overflow-hidden p-5"
    >
      <div className="relative">
        <TrainingCover training={training} compact />
        <div className="absolute right-4 top-4 rounded-full bg-white/84 p-2 text-brand-700 shadow-[0_12px_22px_rgba(43,14,20,0.12)]">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
        <span className="rounded-full bg-brand-50 px-3 py-1">
          {translateTrainingLevel(training.level, locale)}
        </span>
        <span className="rounded-full bg-white px-3 py-1">
          {translateTrainingFormat(training.format, locale)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-white/80 p-4 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-brand-600" />
            {training.durationDays} {copy.labels.days} / {training.totalHours} {copy.labels.hours}
          </span>
        </div>
        <div className="rounded-[22px] border border-line bg-white/80 p-4 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-600" />
            {formatDateLabel(training.nextSession, locale)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
          {training.code}
        </div>
        <span className="text-sm font-medium text-brand-600">{copy.training.viewDetails}</span>
      </div>
    </Link>
  );
}
