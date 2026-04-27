import {
  BarTrendCard,
  DistributionDonutCard,
} from "@/frontend/components/dashboard/analytics-panels";
import { ActivityLogPanel } from "@/frontend/components/dashboard/activity-log-panel";
import { DashboardSpotlight } from "@/frontend/components/dashboard/dashboard-spotlight";
import { InsightsPanel } from "@/frontend/components/dashboard/insights-panel";
import { EnrollmentRequestsPanel } from "@/frontend/components/dashboard/enrollment-requests-panel";
import { NotificationComposer } from "@/frontend/components/dashboard/notification-composer";
import { NotificationsPanel } from "@/frontend/components/dashboard/notifications-panel";
import { TrainingManagementPanel } from "@/frontend/components/dashboard/training-management-panel";
import { UserManagementPanel } from "@/frontend/components/dashboard/user-management-panel";
import { requireRole } from "@/backend/auth/guards";
import { getDashboardData } from "@/backend/services/platform";

export default async function SuperAdminDashboardPage() {
  const user = await requireRole(["super_admin"], "/dashboard/super-admin");
  const dashboard = await getDashboardData(user);
  const executiveMetrics = dashboard.metrics.filter((metric) => metric.id !== "revenue");
  const adminSeats = executiveMetrics.find((metric) => metric.id === "admins")?.value ?? "0";
  const portfolio = executiveMetrics.find((metric) => metric.id === "trainings")?.value ?? "0";
  const enrollments = executiveMetrics.find((metric) => metric.id === "enrollments")?.value ?? "0";

  return (
    <div className="executive-red-stage space-y-4">
      <DashboardSpotlight
        eyebrow="Super admin"
        title="Full platform view."
        titleEmoji="🛡️"
        description="Users. Training activity. Governance."
        chips={["Growth", "Roles", "Operations"]}
        profile={{ name: user.name, avatar: user.avatar, emoji: "👑" }}
        stats={[
          { label: "Admins", value: adminSeats, emoji: "🧑‍💼" },
          { label: "Portfolio", value: portfolio, emoji: "📚" },
          { label: "Enrollments", value: enrollments, emoji: "🎓" },
        ]}
      />
      <section id="users" className="executive-red-block scroll-mt-24 p-4 sm:p-5">
        <UserManagementPanel
          initialUsers={dashboard.teamMembers}
          canManageRoles
          title="👥 All users"
        />
      </section>

      <section
        id="enrollment-requests"
        className="executive-red-block scroll-mt-24 p-4 sm:p-5"
      >
        <EnrollmentRequestsPanel />
      </section>

      <section
        id="statistics"
        className="executive-red-block scroll-mt-24 space-y-5 p-4 sm:p-5"
      >
        <div className="space-y-1">
          <h3 className="executive-red-title text-2xl font-semibold">
            📊 Tableau de bord
          </h3>
          <p className="text-sm text-ink-soft">
            A clear overview of platform activity.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <BarTrendCard
            title="Enrollments"
            description="Last periods"
            data={dashboard.enrollmentTrend}
            color="#be223c"
          />
          <DistributionDonutCard
            title="Demand"
            description="By category"
            data={dashboard.categoryDistribution}
          />
        </div>

        <InsightsPanel
          title="Highlights"
          description="Key signals across the platform."
          insights={[
            {
              title: "Inactive users",
              description: `${dashboard.inactiveUsers.length} learners need re-engagement.`,
              tone: dashboard.inactiveUsers.length ? "warning" : "success",
            },
            {
              title: "Most popular training",
              description: dashboard.popularTrainings[0]
                ? `${dashboard.popularTrainings[0].name} leads the portfolio this cycle.`
                : "No training signal yet.",
            },
            {
              title: "Engagement watch",
              description:
                "Focus on delayed or low-engagement cohorts this week.",
            },
          ]}
        />
      </section>

      <div
        id="insights"
        className="executive-red-block dashboard-grid scroll-mt-24 p-5 sm:p-6"
      >
        <div className="space-y-5 lg:col-span-6">
          <NotificationComposer />
        </div>
        <div className="space-y-5 lg:col-span-6">
          <NotificationsPanel
            items={dashboard.notifications}
            description="Security, platform, and learner notifications."
          />
        </div>
      </div>

      <section id="trainings" className="executive-red-block scroll-mt-24 p-4 sm:p-5">
        <div className="mb-3 text-lg font-semibold">📚 Trainings</div>
        <TrainingManagementPanel
          initialTrainings={dashboard.trainings}
          categories={dashboard.categories}
        />
      </section>

      <section className="executive-red-block p-5 sm:p-6">
        <ActivityLogPanel
          items={dashboard.activityLogs}
          description="Administrative and system-side history."
        />
      </section>
    </div>
  );
}
