import { notFound } from "next/navigation";

import { getCurrentUser } from "@/backend/auth/session";
import { getTrainingPageData } from "@/backend/services/platform";
import { TrainingCard } from "@/frontend/components/catalogue/training-card";
import { TrainingCover } from "@/frontend/components/catalogue/training-cover";
import { TrainingExperienceCard } from "@/frontend/components/catalogue/training-experience-card";
import { RequestEnrollmentButton } from "@/frontend/components/reservation/request-enrollment-button";
import { Badge } from "@/frontend/components/ui/badge";
import { translateTrainingFormat, translateTrainingLevel } from "@/frontend/i18n/helpers";
import { getMessages } from "@/frontend/i18n/messages";
import { getCurrentLocale } from "@/frontend/i18n/server";
import { formatDateLabel } from "@/frontend/utils/format";

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getTrainingPageData(slug);
  const user = await getCurrentUser();
  const locale = await getCurrentLocale();
  const copy = getMessages(locale);

  if (!detail) {
    notFound();
  }

  const primarySchedule = detail.schedules[0] ?? null;
  const pageCopy =
    locale === "fr"
      ? {
          trainerFallback: "Formateur certifie Advancia",
          durationLabel: "Duree",
          formatLabel: "Format",
          locationLabel: "Lieu",
          overviewLabel: "Points forts ✨",
          noScheduleLabel: "Dates sur demande. ✨",
          happyLearning: "Apprentissage joyeux 😄",
          relatedHeading: "Liens",
        }
      : locale === "ar"
        ? {
            trainerFallback: "مدرب معتمد من Advancia",
            durationLabel: "المدة",
            formatLabel: "الصيغة",
            locationLabel: "المكان",
            overviewLabel: "أبرز النقاط ✨",
            noScheduleLabel: "المواعيد عند الطلب. ✨",
            happyLearning: "تعلم سعيد 😄",
            relatedHeading: "روابط",
          }
        : {
            trainerFallback: "Advancia certified trainer",
            durationLabel: "Duration",
            formatLabel: "Format",
            locationLabel: "Location",
            overviewLabel: "Highlights ✨",
            noScheduleLabel: "Dates on request. ✨",
            happyLearning: "Happy learning 😄",
            relatedHeading: "Related",
          };

  const sessionRange = primarySchedule
    ? `${formatDateLabel(primarySchedule.startDate, locale)} / ${formatDateLabel(primarySchedule.endDate, locale)}`
    : formatDateLabel(detail.training.nextSession, locale);
  const duration = `${detail.training.durationDays} ${copy.labels.days} / ${detail.training.totalHours} ${copy.labels.hours}`;
  const displayFormat = translateTrainingFormat(
    primarySchedule?.format ?? detail.training.format,
    locale,
  );
  const location = primarySchedule
    ? `${primarySchedule.city} / ${primarySchedule.venue}`
    : displayFormat;
  const trainer = primarySchedule?.instructor ?? pageCopy.trainerFallback;

  const quickFacts = [
    { label: copy.training.instructor, value: trainer },
    { label: copy.training.nextSession, value: sessionRange },
    { label: pageCopy.durationLabel, value: duration },
    { label: pageCopy.formatLabel, value: displayFormat },
    { label: pageCopy.locationLabel, value: location },
  ];

  return (
    <div className="section-wrap space-y-10 py-12">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-panel ambient-border overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <TrainingCover training={detail.training} />

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="dark">{detail.training.badge}</Badge>
                <span className="rounded-full bg-[#fff0d8] px-4 py-2 text-sm font-medium text-foreground">
                  {pageCopy.happyLearning}
                </span>
                <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
                  {translateTrainingLevel(detail.training.level, locale)}
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground">
                  {translateTrainingFormat(detail.training.format, locale)}
                </span>
              </div>

              <div>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  {detail.training.title}
                </h1>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {quickFacts.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-line bg-white/80 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                      {item.label}
                    </div>
                    <div className="mt-2 font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <TrainingExperienceCard
            trainer={trainer}
            sessionDate={sessionRange}
            duration={duration}
            format={displayFormat}
            location={location}
            isAuthenticated={Boolean(user)}
          />
          <RequestEnrollmentButton
            trainingSlug={detail.training.slug}
            isAuthenticated={Boolean(user)}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-6">
          <h2 className="text-2xl font-semibold">{pageCopy.overviewLabel}</h2>

          <div className="mt-6">
            <div className="text-sm font-medium text-ink-soft">{copy.training.category}</div>
            <div className="mt-2 text-xl font-semibold">{detail.category?.name}</div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-ink-soft">{copy.training.audienceFit}</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {detail.training.audience.map((item) => (
                <span key={item} className="rounded-full bg-brand-50 px-4 py-2 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-line bg-white/80 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                {copy.training.outcomes}
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground">
                {detail.training.outcomes.map((outcome) => (
                  <li key={outcome}>- {outcome}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border border-line bg-white/80 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                {copy.training.modules}
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground">
                {detail.training.modules.map((module) => (
                  <li key={module}>- {module}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="surface-panel p-6">
          <h2 className="text-2xl font-semibold">{copy.training.upcomingSchedules}</h2>

          {detail.schedules.length ? (
            <div className="mt-5 space-y-4">
              {detail.schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="rounded-[24px] border border-line bg-white/75 p-4"
                >
                  <div className="font-medium">
                    {schedule.city} / {schedule.venue}
                  </div>
                  <div className="mt-2 text-sm text-ink-soft">
                    {formatDateLabel(schedule.startDate, locale)} /{" "}
                    {formatDateLabel(schedule.endDate, locale)}
                  </div>
                  <div className="mt-2 text-sm text-ink-soft">
                    {copy.training.instructor}: {schedule.instructor}
                  </div>
                  <div className="mt-1 text-sm text-ink-soft">
                    {pageCopy.formatLabel}: {translateTrainingFormat(schedule.format, locale)}
                  </div>
                  <div className="mt-1 text-sm text-ink-soft">
                    {copy.training.seatsAvailable}: {schedule.seatsAvailable}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-line bg-white/65 p-6 text-sm text-ink-soft">
              {pageCopy.noScheduleLabel}
            </div>
          )}
        </div>
      </section>

      {detail.related.length ? (
        <section className="space-y-6">
          <div>
            <div className="stat-chip w-fit">{copy.training.relatedPrograms}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {pageCopy.relatedHeading}
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {detail.related.map((training) => (
              <TrainingCard key={training.id} training={training} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
