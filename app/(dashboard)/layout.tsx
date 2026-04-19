import { DashboardHeader } from "@/frontend/components/layout/dashboard-header";
import { DashboardSidebar } from "@/frontend/components/layout/dashboard-sidebar";
import { requireAuthenticatedUser } from "@/backend/auth/guards";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuthenticatedUser();

  return (
    <main className="section-wrap py-6">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DashboardSidebar user={user} />
        <div className="space-y-6">
          <DashboardHeader user={user} />
          {children}
        </div>
      </div>
    </main>
  );
}
