import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireRole } from "@/backend/auth/guards";
import { getDashboardData } from "@/backend/services/platform";
import { ActivityLogPanel } from "@/frontend/components/dashboard/activity-log-panel";
import { MetricCard } from "@/frontend/components/dashboard/metric-card";
import { NotificationsPanel } from "@/frontend/components/dashboard/notifications-panel";
import { QuickActionsPanel } from "@/frontend/components/dashboard/quick-actions-panel";
import { ChatbotPanel } from "@/frontend/components/shared/chatbot-panel";
import { Button } from "@/frontend/components/ui/button";
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

  return (
    <div className="space-y-6">
      <section className="cinematic-panel overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="stat-chip w-fit">{t.workspace}</div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight">
                {t.welcomeBack}, {user.name.split(" ")[0]}.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-ink-soft">
                {t.intro}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {t.accountStatus}
                </div>
                <div className="mt-2 text-xl font-semibold capitalize">
                  {dashboard.currentUser?.status ?? "active"}
                </div>
              </div>
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {t.currentTraining}
                </div>
                <div className="mt-2 text-xl font-semibold">
                  {dashboard.currentTrainingName ?? t.notSet}
                </div>
              </div>
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {t.profileComplete}
                </div>
                <div className="mt-2 text-xl font-semibold">
                  {dashboard.profileCompleteness}%
                </div>
              </div>
            </div>
          </div>

          <div className="surface-panel space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {t.profileOverview}
                </div>
                <div className="mt-1 text-2xl font-semibold">{user.name}</div>
              </div>
              {dashboard.currentUser?.profilePicture ? (
                <Image
                  src={dashboard.currentUser.profilePicture}
                  alt={user.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 rounded-[24px] object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#be223c_0%,#ff8f76_100%)] text-xl font-semibold text-white">
                  {user.avatar}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-line bg-white/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                  {t.email}
                </div>
                <div className="mt-2 text-sm font-medium">{user.email}</div>
              </div>
              <div className="rounded-[22px] border border-line bg-white/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                  {t.funnyAvatar}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {dashboard.currentUser?.funnyAvatar ?? "Sunny Bunny"}
                </div>
              </div>
              <div className="rounded-[22px] border border-line bg-white/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                  {t.startDate}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {dashboard.trainingStartDate
                    ? formatDateLabel(dashboard.trainingStartDate)
                    : t.notSet}
                </div>
              </div>
              <div className="rounded-[22px] border border-line bg-white/70 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                  {t.endDate}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {dashboard.trainingEndDate
                    ? formatDateLabel(dashboard.trainingEndDate)
                    : t.notSet}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">{t.completeness}</span>
                <span className="text-ink-soft">{dashboard.profileCompleteness}%</span>
              </div>
              <div className="h-3 rounded-full bg-brand-50">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,#df3648_0%,#ff8f76_100%)]"
                  style={{ width: `${dashboard.profileCompleteness}%` }}
                />
              </div>
            </div>

            <Link href="/profile">
              <Button className="w-full">{t.openProfileSettings}</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        {dashboard.metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="space-y-5 lg:col-span-7">
          <QuickActionsPanel
            items={[
              { label: qa.browseLabel, href: "/trainings", hint: qa.browseHint },
              { label: qa.enrollLabel, href: "/trainings", hint: qa.enrollHint },
              { label: qa.calendarLabel, href: "/trainings/calendar", hint: qa.calendarHint },
              { label: qa.editLabel, href: "/profile", hint: qa.editHint },
            ]}
          />
          <ActivityLogPanel
            items={dashboard.activityLogs}
            description={t.activityHint}
          />
        </div>

        <div className="space-y-5 lg:col-span-5">
          <NotificationsPanel
            items={dashboard.notifications}
            description={t.notificationsHint}
          />
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
                    href={item.training ? `/trainings/${item.training.slug}` : "/trainings"}
                    className="block rounded-[22px] border border-line bg-white/75 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <div className="font-medium">
                      {item.training?.title ?? item.trainingSlug}
                    </div>
                    <div className="mt-1 text-sm text-ink-soft">
                      {item.status.replace("_", " ")} • {item.progress}% {t.progress}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.18em] text-brand-600">
                      {t.nextSession} • {formatDateLabel(item.nextSession)}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-line bg-white/60 p-6 text-sm text-ink-soft">
                  {t.noEnrollments}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChatbotPanel recommendations={dashboard.recommendations} assistant="alexa" />
    </div>
  );
}
