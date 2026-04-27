import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/backend/auth/actions";
import { requireAuthenticatedUser } from "@/backend/auth/guards";
import { getProfilePageData } from "@/backend/services/platform";
import { ActivityLogPanel } from "@/frontend/components/dashboard/activity-log-panel";
import { NotificationsPanel } from "@/frontend/components/dashboard/notifications-panel";
import { PageIntro } from "@/frontend/components/shared/page-intro";
import { ProfileSettingsForm } from "@/frontend/components/profile/profile-settings-form";
import { Button } from "@/frontend/components/ui/button";
import { getMessages } from "@/frontend/i18n/messages";
import { getCurrentLocale } from "@/frontend/i18n/server";
import { formatDateLabel } from "@/frontend/utils/format";

export default async function ProfilePage() {
  const sessionUser = await requireAuthenticatedUser("/profile");
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);
  const copy = messages.profilePage;
  const profile = await getProfilePageData(sessionUser);
  const currentUser = profile.user ?? sessionUser;

  if (sessionUser.role === "user" && profile.user?.onboardingCompleted === false) {
    redirect("/onboarding");
  }

  return (
    <div className="section-wrap space-y-8 py-12">
      <PageIntro
        eyebrow={`${copy.greeting} ${currentUser.name.split(" ")[0]}`}
        title={currentUser.name}
      />

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-6">
          <section className="surface-panel space-y-5 p-6">
            <h2 className="text-xl font-semibold">{copy.personalInfo}</h2>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-xl font-semibold text-white">
                {currentUser.avatar}
              </div>
              <div>
                <div className="text-lg font-semibold">{currentUser.name}</div>
                <div className="text-sm text-ink-soft">{currentUser.email}</div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {copy.company}
                </div>
                <div className="mt-2 font-medium">{currentUser.company}</div>
              </div>
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {copy.department}
                </div>
                <div className="mt-2 font-medium">{currentUser.department}</div>
              </div>
            </div>
            <div className="rounded-[24px] border border-line bg-white/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {copy.completeness}
                </div>
                <div className="text-sm font-semibold text-brand-700">
                  {profile.profileCompleteness}%
                </div>
              </div>
              <div className="mt-3 h-3 rounded-full bg-brand-50">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,#df3648_0%,#ff8f76_100%)]"
                  style={{ width: `${profile.profileCompleteness}%` }}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {copy.currentTraining}
                </div>
                <div className="mt-2 font-medium">
                  {profile.currentTrainingName ?? copy.notSet}
                </div>
              </div>
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {copy.startDate}
                </div>
                <div className="mt-2 font-medium">
                  {profile.trainingStartDate
                    ? formatDateLabel(profile.trainingStartDate, locale)
                    : copy.notSet}
                </div>
              </div>
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {copy.endDate}
                </div>
                <div className="mt-2 font-medium">
                  {profile.trainingEndDate
                    ? formatDateLabel(profile.trainingEndDate, locale)
                    : copy.notSet}
                </div>
              </div>
            </div>
          </section>

          <section className="surface-panel space-y-4 p-6">
            <h2 className="text-xl font-semibold">{copy.quickActions}</h2>
            <Link href="/trainings" className="block">
              <Button className="w-full">{copy.browseTrainings}</Button>
            </Link>
            <form action={logoutAction}>
              <button className="w-full rounded-full border border-line px-4 py-3 text-sm font-semibold hover:bg-white/80">
                {copy.logout}
              </button>
            </form>
          </section>
        </div>

        <section className="surface-panel space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{copy.myTrainings}</h2>
            <Link href="/trainings" className="text-sm font-semibold text-brand-600">
              {copy.browseTrainings}
            </Link>
          </div>
          {profile.myEnrollments.length ? (
            <div className="space-y-4">
              {profile.myEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-[24px] border border-line bg-white/80 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">
                        {enrollment.training?.title ?? enrollment.trainingSlug}
                      </div>
                      <div className="mt-1 text-sm text-ink-soft">
                        {copy.nextSession}: {formatDateLabel(enrollment.nextSession, locale)}
                      </div>
                    </div>
                    <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium capitalize text-brand-700">
                      {enrollment.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-line bg-white/55 p-6 text-sm text-ink-soft">
              {copy.noTrainings}
            </div>
          )}
        </section>
      </div>

      {profile.user ? <ProfileSettingsForm user={profile.user} /> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <NotificationsPanel
          items={profile.notifications}
          title={copy.notifications}
          description={copy.notificationsHint}
        />
        <ActivityLogPanel
          items={profile.activityLogs}
          title={copy.activity}
          description={copy.activityHint}
        />
      </div>
    </div>
  );
}
