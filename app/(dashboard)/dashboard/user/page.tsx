import Link from "next/link";
import { redirect } from "next/navigation";

import { requireRole } from "@/backend/auth/guards";
import { getDashboardData } from "@/backend/services/platform";
import { TrainingRecommendationStars } from "@/frontend/components/catalogue/training-recommendation-stars";
import { ActivityLogPanel } from "@/frontend/components/dashboard/activity-log-panel";
import { MetricCard } from "@/frontend/components/dashboard/metric-card";
import { NotificationsPanel } from "@/frontend/components/dashboard/notifications-panel";
import { QuickActionsPanel } from "@/frontend/components/dashboard/quick-actions-panel";
import { getCurrentLocale } from "@/frontend/i18n/server";
import { getMessages } from "@/frontend/i18n/messages";
import { formatDateLabel } from "@/frontend/utils/format";

export default async function UserDashboardPage() {
  const user = await requireRole(["user"], "/dashboard/user");
  const dashboard = await getDashboardData(user);
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);
  const t = messages.userDashboard;
  const qa = messages.quickActions;

  if (dashboard.currentUser?.onboardingCompleted === false) {
    redirect("/onboarding");
  }

  const stats = [
    {
      label: t.accountStatus,
      value: dashboard.currentUser?.status ?? "active",
      capitalize: true,
    },
    {
      label: t.currentTraining,
      value: dashboard.currentTrainingName ?? t.notSet,
    },
    {
      label: t.profileComplete,
      value: `${dashboard.profileCompleteness}%`,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="stat-chip w-fit">{t.workspace}</div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-[32px]">
              {t.welcomeBack}, {user.name.split(" ")[0]}.
            </h1>
            <p className="max-w-xl text-sm text-ink-soft">{t.intro}</p>
          </div>
          <Link
            href="/profile"
            className="inline-flex h-11 items-center justify-center self-start rounded-full border border-line bg-surface px-5 text-sm font-medium hover:bg-brand-50 sm:self-end"
          >
            {t.openProfileSettings}
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-line bg-white/70 p-4"
            >
              <div className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                {stat.label}
              </div>
              <div
                className={`mt-2 text-lg font-semibold ${
                  stat.capitalize ? "capitalize" : ""
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboard.metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="space-y-5 lg:col-span-7">
          <div className="surface-panel p-5">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{t.myTrainings}</h3>
              <p className="text-sm text-ink-soft">{t.myTrainingsHint}</p>
            </div>
            <div className="mt-5 space-y-3">
              {dashboard.myTrainingCards.length ? (
                dashboard.myTrainingCards.map((item) => (
                  <Link
                    key={item.id}
                    href={
                      item.training
                        ? `/trainings/${item.training.slug}`
                        : "/trainings"
                    }
                    className="block rounded-[20px] border border-line bg-white/75 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">
                          {item.training?.title ?? item.trainingSlug}
                        </div>
                        {item.training ? (
                          <div className="mt-1.5">
                            <TrainingRecommendationStars
                              rating={item.training.rating}
                              size="sm"
                            />
                          </div>
                        ) : null}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-ink-soft">
                      {item.status.replace("_", " ")} • {t.nextSession}{" "}
                      {formatDateLabel(item.nextSession)}
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-brand-50">
                      <div
                        className="h-1.5 rounded-full bg-[linear-gradient(90deg,#df3648_0%,#ff8f76_100%)]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-line bg-white/60 p-6 text-sm text-ink-soft">
                  {t.noEnrollments}
                </div>
              )}
            </div>
          </div>

          <QuickActionsPanel
            items={[
              { label: qa.browseLabel, href: "/trainings", hint: qa.browseHint },
              { label: qa.enrollLabel, href: "/trainings", hint: qa.enrollHint },
              {
                label: qa.calendarLabel,
                href: "/trainings/calendar",
                hint: qa.calendarHint,
              },
              { label: qa.editLabel, href: "/profile", hint: qa.editHint },
            ]}
          />
        </div>

        <div className="space-y-5 lg:col-span-5">
          <NotificationsPanel
            items={dashboard.notifications}
            description={t.notificationsHint}
          />
          <ActivityLogPanel
            items={dashboard.activityLogs}
            description={t.activityHint}
          />
        </div>
      </div>
    </div>
  );
}
