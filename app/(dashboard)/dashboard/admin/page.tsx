import { ActivityFeed } from "@/frontend/components/dashboard/activity-feed";
import {
  AreaTrendCard,
  BarTrendCard,
  DistributionDonutCard,
} from "@/frontend/components/dashboard/analytics-panels";
import { InsightsPanel } from "@/frontend/components/dashboard/insights-panel";
import { DashboardSpotlight } from "@/frontend/components/dashboard/dashboard-spotlight";
import { MetricCard } from "@/frontend/components/dashboard/metric-card";
import { NotificationComposer } from "@/frontend/components/dashboard/notification-composer";
import { NotificationsPanel } from "@/frontend/components/dashboard/notifications-panel";
import { QuickActionsPanel } from "@/frontend/components/dashboard/quick-actions-panel";
import { TrainingTable } from "@/frontend/components/dashboard/training-table";
import { UserManagementPanel } from "@/frontend/components/dashboard/user-management-panel";
import { requireRole } from "@/backend/auth/guards";
import { getDashboardData } from "@/backend/services/platform";

export default async function AdminDashboardPage() {
  const user = await requireRole(["admin", "super_admin"], "/dashboard/admin");
  const dashboard = await getDashboardData(user);

  return (
    <div className="space-y-6">
      <DashboardSpotlight
        eyebrow="Admin dashboard"
        title="Operations view."
        description="Users. Reports. Delivery."
        tone="operations"
        chips={["Excel", "PDF", "Charts"]}
        stats={[
          { label: "Live users", value: dashboard.metrics[0]?.value ?? "0" },
          { label: "Revenue pulse", value: dashboard.metrics.at(-1)?.value ?? "0" },
          { label: "Hot categories", value: String(dashboard.categoryDistribution.length) },
        ]}
      />
      <div className="grid gap-5 md:grid-cols-5">
        {dashboard.metrics.map((metric, index) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            index={index}
            className={index === 0 ? "md:col-span-2" : "md:col-span-1"}
          />
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="space-y-5 lg:col-span-8">
          <AreaTrendCard
            title="Revenue"
            description="Paid"
            data={dashboard.revenueTrend}
          />
          <BarTrendCard
            title="Enrollments"
            description="Recent"
            data={dashboard.enrollmentTrend}
          />
          <TrainingTable rows={dashboard.popularTrainings} />
        </div>
        <div className="space-y-5 lg:col-span-4">
          <DistributionDonutCard
            title="Categories"
            description="Demand"
            data={dashboard.categoryDistribution}
          />
          <ActivityFeed items={dashboard.recentActivity} />
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

      <section id="stats" className="dashboard-grid scroll-mt-24">
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

      <section id="users" className="scroll-mt-24">
        <UserManagementPanel
          initialUsers={dashboard.teamMembers.filter((item) => item.role === "user")}
          title="Users management"
        />
      </section>

      <section id="notifications" className="scroll-mt-24">
        <NotificationsPanel
          items={dashboard.notifications}
          description="Operational alerts and sent updates."
        />
      </section>
    </div>
  );
}
