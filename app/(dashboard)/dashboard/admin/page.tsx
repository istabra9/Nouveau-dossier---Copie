import {
  AreaTrendCard,
  BarTrendCard,
  DistributionDonutCard,
} from "@/frontend/components/dashboard/analytics-panels";
import { InsightsPanel } from "@/frontend/components/dashboard/insights-panel";
import { DashboardSpotlight } from "@/frontend/components/dashboard/dashboard-spotlight";
import { NotificationComposer } from "@/frontend/components/dashboard/notification-composer";
import { NotificationsPanel } from "@/frontend/components/dashboard/notifications-panel";
import { QuickActionsPanel } from "@/frontend/components/dashboard/quick-actions-panel";
import { UserManagementPanel } from "@/frontend/components/dashboard/user-management-panel";
import { requireRole } from "@/backend/auth/guards";
import { getDashboardData } from "@/backend/services/platform";

export default async function AdminDashboardPage() {
  const user = await requireRole(["admin", "super_admin"], "/dashboard/admin");
  const dashboard = await getDashboardData(user);
  const adminMetrics = dashboard.metrics.filter((metric) => metric.id !== "revenue");
  const liveUsers = adminMetrics.find((metric) => metric.id === "users")?.value ?? "0";
  const trainingCatalogue = adminMetrics.find((metric) => metric.id === "trainings")?.value ?? "0";
  const enrollments = adminMetrics.find((metric) => metric.id === "enrollments")?.value ?? "0";

  return (
    <div className="executive-red-stage space-y-6">
      <DashboardSpotlight
        eyebrow="Admin dashboard"
        title="Operations view."
        titleEmoji="⚙️"
        description="Users. Trainings. Delivery."
        tone="operations"
        chips={["Users", "Trainings", "Delivery"]}
        profile={{ name: user.name, avatar: user.avatar, emoji: "🧑‍💼" }}
        stats={[
          { label: "Live users", value: liveUsers, emoji: "🧑‍🎓" },
          { label: "Trainings", value: trainingCatalogue, emoji: "📚" },
          { label: "Enrollments", value: enrollments, emoji: "🎓" },
        ]}
      />
      <div className="executive-red-block dashboard-grid p-5 sm:p-6">
        <div className="space-y-5 lg:col-span-5">
          <BarTrendCard
            title="Enrollments"
            description="Recent"
            data={dashboard.enrollmentTrend}
          />
        </div>
        <div className="space-y-5 lg:col-span-7">
          <AreaTrendCard
            title="Learner growth"
            description="User signups"
            data={dashboard.userGrowth}
            color="#91182f"
          />
          <DistributionDonutCard
            title="Categories"
            description="Demand"
            data={dashboard.categoryDistribution}
          />
          <InsightsPanel
            insights={[
              {
                title: "Inactive learners",
                description: `${dashboard.inactiveUsers.length} accounts need follow-up this month.`,
                tone: dashboard.inactiveUsers.length ? "warning" : "success",
              },
              {
                title: "Live users",
                description: `${dashboard.teamMembers.filter((item) => item.status === "active").length} active accounts are available now.`,
              },
              {
                title: "Security signal",
                description: "Review recent authentication and pending-user states daily.",
              },
            ]}
          />
        </div>
      </div>

      <section
        id="stats"
        className="executive-red-block dashboard-grid scroll-mt-24 p-5 sm:p-6"
      >
        <div className="space-y-5 lg:col-span-7">
          <DistributionDonutCard
            title="Training status"
            description="Upcoming, ongoing, completed, delayed"
            data={dashboard.trainingStatusDistribution}
          />
          <BarTrendCard
            title="Top users by activity"
            description="Recent actions"
            data={dashboard.topUsersByActivity.map((item) => ({
              label: item.name.split(" ")[0],
              value: item.value,
            }))}
            color="#8f1830"
          />
        </div>
        <div className="space-y-5 lg:col-span-5">
          <QuickActionsPanel
            items={[
              { label: "Add user", href: "#users", hint: "Create a learner account" },
              { label: "Import workbook", href: "/dashboard/import-export", hint: "Upload Excel data" },
              { label: "Export reports", href: "/dashboard/import-export", hint: "Generate Excel or PDF" },
              { label: "Open profile", href: "/profile", hint: "Adjust your settings" },
            ]}
          />
          <NotificationComposer />
        </div>
      </section>

      <section id="users" className="executive-red-block scroll-mt-24 p-5 sm:p-6">
        <UserManagementPanel
          initialUsers={dashboard.teamMembers.filter((item) => item.role === "user")}
          title="👥 Users management"
        />
      </section>

      <section
        id="notifications"
        className="executive-red-block scroll-mt-24 p-5 sm:p-6"
      >
        <NotificationsPanel
          items={dashboard.notifications}
          description="Operational alerts and sent updates."
        />
      </section>
    </div>
  );
}
