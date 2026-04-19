import { ActivityFeed } from "@/frontend/components/dashboard/activity-feed";
import {
  AreaTrendCard,
  BarTrendCard,
  DistributionDonutCard,
} from "@/frontend/components/dashboard/analytics-panels";
import { ActivityLogPanel } from "@/frontend/components/dashboard/activity-log-panel";
import { DashboardSpotlight } from "@/frontend/components/dashboard/dashboard-spotlight";
import { InsightsPanel } from "@/frontend/components/dashboard/insights-panel";
import { MetricCard } from "@/frontend/components/dashboard/metric-card";
import { EnrollmentRequestsPanel } from "@/frontend/components/dashboard/enrollment-requests-panel";
import { NotificationComposer } from "@/frontend/components/dashboard/notification-composer";
import { NotificationsPanel } from "@/frontend/components/dashboard/notifications-panel";
import { TrainingManagementPanel } from "@/frontend/components/dashboard/training-management-panel";
import { TrainingTable } from "@/frontend/components/dashboard/training-table";
import { UserManagementPanel } from "@/frontend/components/dashboard/user-management-panel";
import { UsersTable } from "@/frontend/components/dashboard/users-table";
import { ChatbotPanel } from "@/frontend/components/shared/chatbot-panel";
import { requireRole } from "@/backend/auth/guards";
import { getDashboardData } from "@/backend/services/platform";

export default async function SuperAdminDashboardPage() {
  const user = await requireRole(["super_admin"], "/dashboard/super-admin");
  const dashboard = await getDashboardData(user);

  return (
    <div className="space-y-6">
      <DashboardSpotlight
        eyebrow="Super admin"
        title="Full platform view."
        description="Users. Revenue. Activity."
        chips={["Revenue", "Growth", "Roles"]}
        stats={[
          { label: "Admins", value: dashboard.metrics[0]?.value ?? "0" },
          { label: "Portfolio", value: dashboard.metrics[2]?.value ?? "0" },
          { label: "Paid revenue", value: dashboard.metrics.at(-1)?.value ?? "0" },
        ]}
      />
      <div className="grid gap-5 md:grid-cols-6">
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
            title="Growth"
            description="Users"
            data={dashboard.userGrowth}
            color="#91182f"
          />
          <BarTrendCard
            title="Top activity"
            description="Most active users"
            data={dashboard.topUsersByActivity.map((item) => ({
              label: item.name.split(" ")[0],
              value: item.value,
            }))}
            color="#df3648"
          />
          <TrainingTable rows={dashboard.popularTrainings} />
          <UsersTable rows={dashboard.teamMembers} />
        </div>
        <div className="space-y-5 lg:col-span-4">
          <DistributionDonutCard
            title="Demand"
            description="By category"
            data={dashboard.categoryDistribution}
          />
          <DistributionDonutCard
            title="Duration"
            description="By format"
            data={dashboard.durationDistribution}
          />
          <DistributionDonutCard
            title="Training status"
            description="Portfolio state"
            data={dashboard.trainingStatusDistribution}
          />
          <InsightsPanel
            title="Alex insights"
            description="Rule-based analytics and action prompts."
            insights={[
              {
                title: "Inactive users",
                description: `${dashboard.inactiveUsers.length} learners need re-engagement.`,
                tone: dashboard.inactiveUsers.length ? "warning" : "success",
              },
              {
                title: "Most popular training",
                description:
                  dashboard.popularTrainings[0]
                    ? `${dashboard.popularTrainings[0].name} leads the portfolio this cycle.`
                    : "No training signal yet.",
              },
              {
                title: "Engagement watch",
                description: "Focus on delayed or low-engagement cohorts this week.",
              },
            ]}
          />
        </div>
      </div>

      <div className="dashboard-grid">
        <div id="users" className="space-y-5 lg:col-span-7 scroll-mt-24">
          <UserManagementPanel
            initialUsers={dashboard.teamMembers}
            canManageRoles
            title="All users"
          />
        </div>
        <div id="insights" className="space-y-5 lg:col-span-5 scroll-mt-24">
          <EnrollmentRequestsPanel />
          <NotificationComposer />
          <NotificationsPanel
            items={dashboard.notifications}
            description="Security, platform, and learner notifications."
          />
        </div>
      </div>

      <div className="dashboard-grid">
        <div id="trainings" className="space-y-5 lg:col-span-7 scroll-mt-24">
          <TrainingManagementPanel
            initialTrainings={dashboard.trainings}
            categories={dashboard.categories}
          />
        </div>
        <div className="space-y-5 lg:col-span-5">
          <ChatbotPanel
            recommendations={dashboard.recommendations}
            assistant="alex"
          />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="lg:col-span-6">
          <ActivityFeed items={dashboard.recentActivity} />
        </div>
        <div className="lg:col-span-6">
          <ActivityLogPanel
            items={dashboard.activityLogs}
            description="Administrative and system-side history."
          />
        </div>
      </div>
    </div>
  );
}
